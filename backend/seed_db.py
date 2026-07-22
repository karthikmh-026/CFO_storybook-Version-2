"""Creates the cfo_storybook database (if needed), tables, and seed rows.

Run once before starting the API: `python seed_db.py`
"""
import psycopg2

from db import connect, PG_DBNAME

SCHEMA_SQL = """
DROP TABLE IF EXISTS violation_transactions;
DROP TABLE IF EXISTS rule_violations;
DROP TABLE IF EXISTS ar_ageing;
DROP TABLE IF EXISTS customer_risk;

CREATE TABLE rule_violations (
    id SERIAL PRIMARY KEY,
    document VARCHAR(50) NOT NULL,
    document_type VARCHAR(50) NOT NULL,
    rule_violated VARCHAR(100) NOT NULL,
    severity VARCHAR(20) NOT NULL,
    customer_code VARCHAR(20) NOT NULL,
    customer_name VARCHAR(100) NOT NULL,
    amount_cr NUMERIC(10, 2) NOT NULL,
    txn_date DATE NOT NULL,
    description TEXT NOT NULL,
    recommended_action TEXT NOT NULL
);

CREATE TABLE violation_transactions (
    id SERIAL PRIMARY KEY,
    violation_id INT NOT NULL REFERENCES rule_violations(id),
    line_no INT NOT NULL,
    sap_doc VARCHAR(50) NOT NULL,
    doc_date DATE NOT NULL,
    description VARCHAR(200) NOT NULL,
    amount_cr NUMERIC(10, 2) NOT NULL,
    status VARCHAR(40) NOT NULL
);

CREATE TABLE ar_ageing (
    id SERIAL PRIMARY KEY,
    bucket VARCHAR(20) NOT NULL,
    amount_cr NUMERIC(10, 2) NOT NULL
);

CREATE TABLE customer_risk (
    id SERIAL PRIMARY KEY,
    customer_code VARCHAR(20) NOT NULL,
    customer_name VARCHAR(100) NOT NULL,
    risk_score INT NOT NULL,
    open_ar_cr NUMERIC(10, 2) NOT NULL,
    overdue_cr NUMERIC(10, 2) NOT NULL,
    narrative TEXT
);
"""

SEED_SQL = """
INSERT INTO rule_violations
    (id, document, document_type, rule_violated, severity, customer_code, customer_name, amount_cr, txn_date, description, recommended_action)
VALUES
    (1, 'SO10045', 'Sales Order', 'Credit Limit Breach', 'High', 'C1001', 'Meridian Steel Corp', 2.40, '2026-06-18',
     'Sales order raised for Rs.2.40 Cr against an approved credit limit of Rs.1.50 Cr for customer C1001 -- a 60% breach recorded in KNKK.',
     'Hold shipment pending credit committee approval; request updated financials from the customer before releasing the order.'),
    (2, 'INV2451', 'Invoice', 'Duplicate Invoice', 'Critical', 'C1032', 'Vantage Auto Components', 1.85, '2026-06-22',
     'Invoice INV2451 matches INV2438 on purchase order, material and amount -- almost certainly a duplicate posting in BSID.',
     'Reverse the duplicate FI posting immediately; confirm with the AR team before the next customer statement run.'),
    (3, 'SO10078', 'Sales Order', 'High Discount', 'Medium', 'C1077', 'Orion Fabrication Ltd', 0.62, '2026-06-11',
     'An 18% discount was granted on SO10078, above the 10% threshold delegated to the regional sales desk.',
     'Route to the regional sales head for retrospective approval, or reverse the discount to the standard band.'),
    (4, 'DLV3390', 'Delivery', 'Delivery Before Approval', 'High', 'C1001', 'Meridian Steel Corp', 1.10, '2026-06-25',
     'Delivery DLV3390 was posted 2 days before the linked sales order credit approval was recorded -- a workflow sequencing gap.',
     'Escalate to credit control; review the approval-before-delivery sequencing in the SAP workflow configuration.'),
    (5, 'INV2477', 'Invoice', 'Tax Variance', 'Medium', 'C1032', 'Vantage Auto Components', 0.34, '2026-06-28',
     'GST computed on INV2477 deviates from the expected rate by 3.2%, inconsistent with the HSN/SAC code mapping on the material master.',
     'Reconcile HSN/SAC master data with the finance team; reissue a corrected tax invoice if the variance is confirmed.'),
    (6, 'SO10091', 'Sales Order', 'Duplicate Order', 'Low', 'C1077', 'Orion Fabrication Ltd', 0.28, '2026-06-14',
     'SO10091 duplicates SO10088, raised 40 minutes earlier for the same material, quantity and ship-to party.',
     'Confirm with the sales desk whether this is a genuine repeat order or an accidental duplicate entry.');

INSERT INTO violation_transactions (violation_id, line_no, sap_doc, doc_date, description, amount_cr, status) VALUES
    (1, 10, 'SO10045/10', '2026-06-18', 'CRGO coil laminations, 420T', 1.60, 'Blocked'),
    (1, 20, 'SO10045/20', '2026-06-18', 'Stamped rotor cores, 90T', 0.55, 'Blocked'),
    (1, 30, 'SO10045/30', '2026-06-19', 'Freight & packing', 0.25, 'Open'),
    (1, 40, 'KNKK-C1001', '2026-06-18', 'Credit limit master check -- limit Rs.1.50 Cr', 1.50, 'Exceeded'),

    (2, 10, 'INV2438', '2026-06-20', 'Original invoice -- die-cast rotor assemblies', 1.85, 'Posted'),
    (2, 20, 'INV2451', '2026-06-22', 'Duplicate invoice -- same PO/material/amount', 1.85, 'Flagged'),
    (2, 30, 'PMT-88213', '2026-06-24', 'Customer payment applied against INV2438', 1.85, 'Cleared'),

    (3, 10, 'SO10078/10', '2026-06-11', 'Machined stator assemblies, 60T', 0.62, 'Approved (pending review)'),
    (3, 20, 'DISC-SO10078', '2026-06-11', 'Discount applied: 18% vs 10% delegated limit', -0.11, 'Flagged'),

    (4, 10, 'SO10045-B/10', '2026-06-21', 'Sales order credit approval recorded', 0.00, 'Approved'),
    (4, 20, 'DLV3390', '2026-06-19', 'Delivery posted (2 days before approval above)', 1.10, 'Flagged'),
    (4, 30, 'INV2460', '2026-06-26', 'Billing document raised against DLV3390', 1.10, 'Posted'),

    (5, 10, 'INV2477', '2026-06-28', 'Tax computation -- expected 18.0% GST', 0.34, 'Flagged'),
    (5, 20, 'HSN-88452', '2026-06-28', 'HSN/SAC master reference for material', 0.00, 'Under Review'),

    (6, 10, 'SO10088', '2026-06-14', 'Original order -- stamped cores, 30T', 0.28, 'Released'),
    (6, 20, 'SO10091', '2026-06-14', 'Duplicate order, 40 min later, same line items', 0.28, 'Flagged');

INSERT INTO ar_ageing (bucket, amount_cr) VALUES
    ('0-30', 214),
    ('31-60', 112),
    ('61-90', 54),
    ('90+', 38);

INSERT INTO customer_risk (customer_code, customer_name, risk_score, open_ar_cr, overdue_cr, narrative) VALUES
    ('C1001', 'Meridian Steel Corp', 92, 2.40, 1.10, 'Order value up 180% vs last quarter, alongside repeated late payments.'),
    ('C1032', 'Vantage Auto Components', 78, 1.85, 0.62, 'Three duplicate invoices raised within the same billing cycle.'),
    ('C1077', 'Orion Fabrication Ltd', 65, 1.20, 0.35, 'Consistent 15-day payment delays over the last two quarters.');
"""


def main():
    admin_conn = connect(dbname="postgres")
    admin_conn.autocommit = True
    with admin_conn.cursor() as cur:
        cur.execute("SELECT 1 FROM pg_database WHERE datname = %s", (PG_DBNAME,))
        exists = cur.fetchone()
        if not exists:
            cur.execute(f'CREATE DATABASE "{PG_DBNAME}"')
            print(f"Created database {PG_DBNAME}")
        else:
            print(f"Database {PG_DBNAME} already exists")
    admin_conn.close()

    conn = connect()
    with conn.cursor() as cur:
        cur.execute(SCHEMA_SQL)
        cur.execute(SEED_SQL)
        cur.execute("SELECT setval(pg_get_serial_sequence('rule_violations', 'id'), (SELECT MAX(id) FROM rule_violations))")
    conn.commit()
    conn.close()
    print("Schema created and seeded.")


if __name__ == "__main__":
    main()
