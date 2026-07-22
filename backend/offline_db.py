import os
import re
import pandas as pd

class OfflineCursor:
    def __init__(self, dbname):
        self.dbname = dbname
        self.description = None
        self._rows = []
        self._idx = 0
        
        # Seed data
        self.violations = [
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
             'Confirm with the sales desk whether this is a genuine repeat order or an accidental duplicate entry.')
        ]
        
        self.transactions = [
            (10, 'SO10045/10', '2026-06-18', 'CRGO coil laminations, 420T', 1.60, 'Blocked', 1),
            (20, 'SO10045/20', '2026-06-18', 'Stamped rotor cores, 90T', 0.55, 'Blocked', 1),
            (30, 'SO10045/30', '2026-06-19', 'Freight & packing', 0.25, 'Open', 1),
            (40, 'KNKK-C1001', '2026-06-18', 'Credit limit master check -- limit Rs.1.50 Cr', 1.50, 'Exceeded', 1),
            
            (10, 'INV2438', '2026-06-20', 'Original invoice -- die-cast rotor assemblies', 1.85, 'Posted', 2),
            (20, 'INV2451', '2026-06-22', 'Duplicate invoice -- same PO/material/amount', 1.85, 'Flagged', 2),
            (30, 'PMT-88213', '2026-06-24', 'Customer payment applied against INV2438', 1.85, 'Cleared', 2),
            
            (10, 'SO10078/10', '2026-06-11', 'Machined stator assemblies, 60T', 0.62, 'Approved (pending review)', 3),
            (20, 'DISC-SO10078', '2026-06-11', 'Discount applied: 18% vs 10% delegated limit', -0.11, 'Flagged', 3),
            
            (10, 'SO10045-B/10', '2026-06-21', 'Sales order credit approval recorded', 0.00, 'Approved', 4),
            (20, 'DLV3390', '2026-06-19', 'Delivery posted (2 days before approval above)', 1.10, 'Flagged', 4),
            (30, 'INV2460', '2026-06-26', 'Billing document raised against DLV3390', 1.10, 'Posted', 4),
            
            (10, 'INV2477', '2026-06-28', 'Tax computation -- expected 18.0% GST', 0.34, 'Flagged', 5),
            (20, 'HSN-88452', '2026-06-28', 'HSN/SAC master reference for material', 0.00, 'Under Review', 5),
            
            (10, 'SO10088', '2026-06-14', 'Original order -- stamped cores, 30T', 0.28, 'Released', 6),
            (20, 'SO10091', '2026-06-14', 'Duplicate order, 40 min later, same line items', 0.28, 'Flagged', 6)
        ]
        
        self.ar_ageing = [
            (1, '0-30', 214.0),
            (2, '31-60', 112.0),
            (3, '61-90', 54.0),
            (4, '90+', 38.0)
        ]
        
        self.customer_risk = [
            ('C1001', 'Meridian Steel Corp', 92, 2.40, 1.10, 'Order value up 180% vs last quarter, alongside repeated late payments.'),
            ('C1032', 'Vantage Auto Components', 78, 1.85, 0.62, 'Three duplicate invoices raised within the same billing cycle.'),
            ('C1077', 'Orion Fabrication Ltd', 65, 1.20, 0.35, 'Consistent 15-day payment delays over the last two quarters.')
        ]
 
        # Load GL mappings from 1000TB and 2000TB once
        self.static_gl_map = {}
        for f in (r"C:\Users\ajala\Downloads\1000TB.xlsx", r"C:\Users\ajala\Downloads\2000TB.XLSX"):
            if os.path.exists(f):
                try:
                    df = pd.read_excel(f)
                    for _, row in df.iterrows():
                        gl = str(row.get('G/L Acct', '')).strip().replace('.0', '')
                        cls = str(row.get('Classification', '')).strip()
                        if gl and cls:
                            self.static_gl_map[gl] = cls
                except Exception:
                    pass
 
    def get_classification(self, cocd, gl, short_text):
        gl = str(gl).strip().replace('.0', '')
        short_text = str(short_text).lower().strip()
        gl_int = int(gl) if gl.isdigit() else 0
        
        # 1. Check static map first!
        if gl in self.static_gl_map:
            return self.static_gl_map[gl]
            
        # 2. Check CC and borrowing keywords
        is_borrowing = (
            bool(re.search(r'\bcc\b', short_text)) or
            any(x in short_text for x in ('wcdl', 'pcfc', 'bill disc', 'borrowing', 'loan', 'term loan', 'car loan', 'ecb loan'))
        )
        if is_borrowing and 200000 <= gl_int < 300000:
            return 'Short term Borrowings'
        
        # 3. Fallbacks
        if gl in ('140800', '140801') or 'cash acc' in short_text:
            return 'Cash and Cash Equivalent'
        if 100000 <= gl_int < 200000 and any(b in short_text for b in ('kotak', 'sbi', 'icici', 'hdfc', 'bank')):
            if "charges" not in short_text and "interest" not in short_text and "discount" not in short_text and "encashment" not in short_text:
                return 'Bank Balances Other Than CASH And Cash Equivalent'
        if 'salary advance' in short_text:
            return 'Receivables'
        if any(x in short_text for x in ('customs duty', 'input cgst', 'gst', 'tax rec')):
            return 'Other Current Assets'
        if 'stor & spar' in short_text:
            return 'Inventory'
            
        if gl in self.static_gl_map:
            return self.static_gl_map[gl]
            
        if 'revenue' in short_text or 'sales' in short_text or 'income from' in short_text:
            return 'Revenue from Operations'
        if 'other income' in short_text or 'interest received' in short_text:
            return 'Other Income'
        if any(x in short_text for x in ('cost of material', 'consumption', 'cogs', 'changes in inventory', 'change in inventory')):
            return 'Cost of Material Consumed'
        if any(x in short_text for x in ('salary', 'wages', 'employee', 'pf', 'gratuity')):
            return 'Employee Benefit Expenses'
        if any(x in short_text for x in ('interest', 'finance cost', 'bank charges')):
            return 'Finance Cost'
        if 'depreciation' in short_text or 'amortisation' in short_text:
            return 'Depreciation and amortisation'
        if 'tax' in short_text:
            return 'Deferred Tax'
        if any(x in short_text for x in ('land', 'building', 'machinery', 'plant', 'furniture', 'office equipment', 'vehicle')):
            return 'PPE'
        if 'receivable' in short_text or 'debtor' in short_text:
            return 'Receivables'
        if 'payable' in short_text or 'creditor' in short_text:
            return 'Payables'
        if any(x in short_text for x in ('inventory', 'stock', 'raw material', 'finished goods')):
            return 'Inventory'
        if 'borrowing' in short_text or 'loan' in short_text:
            return 'Short term Borrowings'
            
        return 'Other Expenses'

    def execute(self, query, params=None):
        query_upper = query.upper().strip()
        self._rows = []
        self._idx = 0
        
        # 1. tables query
        if "INFORMATION_SCHEMA.TABLES" in query_upper and "TABLE_SCHEMA = 'TB'" in query_upper:
            self._rows = [("TB_1000_2025",), ("TB_2000_2025",), ("TB_4000_2025",)]
            self.description = [("table_name",)]
            return

        # 2. SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'TB' AND table_name = '{table}')
        if "EXISTS (SELECT FROM INFORMATION_SCHEMA.TABLES" in query_upper:
            self._rows = [(True,)]
            self.description = [("exists",)]
            return

        # 3. TB queries
        if '"TB".' in query:
            table_name = query.split('"TB".')[1].split('"')[1]
            filepath = os.path.join(r"C:\Users\ajala\Downloads\TB\TB", f"{table_name}.xlsx")
            
            if not os.path.exists(filepath):
                self._rows = []
                self.description = []
                return
                
            df = pd.read_excel(filepath, header=5)
            df = df.dropna(subset=['CoCd', 'G/L Acct'])
            
            # Map G/L Acct to string and fill nans
            df['CoCd'] = df['CoCd'].astype(str).str.strip().str.replace('.0', '', regex=False)
            df['G/L Acct'] = df['G/L Acct'].astype(str).str.strip().str.replace('.0', '', regex=False)
            df['Short Text'] = df['Short Text'].fillna('').astype(str).str.strip()
            df['Balance Carryforward'] = df['Balance Carryforward'].fillna(0.0)
            df['Debit Blnce of Reportng Period'] = df['Debit Blnce of Reportng Period'].fillna(0.0)
            df['Credit Balance Reporting Per.'] = df['Credit Balance Reporting Per.'].fillna(0.0)
            df['Accumulated Balance'] = df['Accumulated Balance'].fillna(0.0)
            
            # Calculate classification
            df['Classification'] = df.apply(lambda r: self.get_classification(r['CoCd'], r['G/L Acct'], r['Short Text']), axis=1)

            # Map to expected output columns
            if '"CoCd", "G/L Acct", "Classification"' in query:
                self.description = [("CoCd",), ("G/L Acct",), ("Classification",)]
                for _, r in df.iterrows():
                    self._rows.append((r['CoCd'], r['G/L Acct'], r['Classification']))
            elif '"Debit Blnce of Reportng Period", "Credit Balance Reporting Per."' in query:
                self.description = [("G/L Acct",), ("Debit Blnce of Reportng Period",), ("Credit Balance Reporting Per.",), ("Accumulated Balance",), ("Classification",)]
                for _, r in df.iterrows():
                    self._rows.append((r['G/L Acct'], r['Debit Blnce of Reportng Period'], r['Credit Balance Reporting Per.'], r['Accumulated Balance'], r['Classification']))
            elif '"Short Text", "Balance Carryforward"' in query:
                self.description = [("G/L Acct",), ("Short Text",), ("Balance Carryforward",), ("Accumulated Balance",), ("Classification",)]
                for _, r in df.iterrows():
                    self._rows.append((r['G/L Acct'], r['Short Text'], r['Balance Carryforward'], r['Accumulated Balance'], r['Classification']))
            else:
                self.description = [(c,) for c in df.columns]
                limit = None
                if "LIMIT" in query_upper:
                    import re
                    m = re.search(r'LIMIT\s+(\d+)', query_upper)
                    if m:
                        limit = int(m.group(1))
                if limit is not None:
                    self._rows = [tuple(x) for x in df.head(limit).to_numpy()]
                else:
                    self._rows = [tuple(x) for x in df.to_numpy()]
            return

        # 4. rule_violations query
        if "RULE_VIOLATIONS" in query_upper:
            if "WHERE ID =" in query_upper:
                # Extract numeric value
                import re
                m = re.search(r'WHERE ID\s*=\s*(\d+)', query_upper)
                vid = int(m.group(1)) if m else (params[0] if params else 1)
                matched = [v for v in self.violations if v[0] == vid]
                self._rows = matched
                self.description = [("id",), ("document",), ("document_type",), ("rule_violated",), ("severity",), ("customer_code",), ("customer_name",), ("amount_cr",), ("txn_date",), ("description",), ("recommended_action",)]
            else:
                self._rows = [(v[0], v[1], v[3], v[4], v[6], v[7]) for v in self.violations]
                self.description = [("id",), ("document",), ("rule_violated",), ("severity",), ("customer_name",), ("amount_cr",)]
            return

        # 5. violation_transactions query
        if "VIOLATION_TRANSACTIONS" in query_upper:
            import re
            m = re.search(r'WHERE VIOLATION_ID\s*=\s*(\d+)', query_upper)
            vid = int(m.group(1)) if m else (params[0] if params else 1)
            matched = [t[:6] for t in self.transactions if t[6] == vid]
            self._rows = matched
            self.description = [("line_no",), ("sap_doc",), ("doc_date",), ("description",), ("amount_cr",), ("status",)]
            return

        # 6. ar_ageing query
        if "AR_AGEING" in query_upper:
            self._rows = [(a[1], a[2]) for a in self.ar_ageing]
            self.description = [("bucket",), ("amount_cr",)]
            return

        # 7. customer_risk query
        if "CUSTOMER_RISK" in query_upper:
            self._rows = self.customer_risk
            self.description = [("customer_code",), ("customer_name",), ("risk_score",), ("open_ar_cr",), ("overdue_cr",), ("narrative",)]
            return

    def fetchall(self):
        return self._rows

    def fetchone(self):
        if self._idx < len(self._rows):
            r = self._rows[self._idx]
            self._idx += 1
            return r
        return None

    def close(self):
        pass

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.close()

class OfflineConnection:
    def __init__(self, dbname):
        self.dbname = dbname
        self.autocommit = True

    def cursor(self):
        return OfflineCursor(self.dbname)

    def commit(self):
        pass

    def close(self):
        pass

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.close()
