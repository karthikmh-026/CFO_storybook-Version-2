"""
Merge all Pitti Group CFO Storybook PDFs into one organized PDF.

Correct chapter order based on the Cover/TOC:
  01 - Executive Summary
  02 - Value Chain
  03 - Margin Story
  04 - Cash & Working Capital
  05 - Ratios & Valuation
  06 - Risk & Anomaly
  07 - Capital Assets & RPT
  08 - Forex & Loans

Structure:
  Cover (Table of Contents)
  Main Narrative (scrolling single-page with all 8 chapters)
  Deep Dive dashboards grouped by chapter
"""

import os
from pypdf import PdfReader, PdfWriter

PROJECT = os.path.dirname(os.path.abspath(__file__))


def sb(num):
    """Path to a Pitti Group storybook dashboard PDF by number."""
    return os.path.join(PROJECT, f"Pitti Group \u2014 CFO Storybook ({num}).pdf")


def merge():
    """
    Merge all PDFs in correct chapter order.

    Order:
      1. Cover/TOC page
      2. Main narrative (PDF 1 — all chapters in a single scrolling page)
      3. Chapter deep-dive dashboards in chapter order:
         Ch1 Executive Summary    -> Financial Statements dashboards (2, 3)
         Ch2 Value Chain          -> Sales Analytics dashboard (4)
         Ch3 Margin Story         -> Expense Analytics dashboard (5)
         Ch4 Cash & Working Capital -> Working Capital & Treasury dashboard (6)
         Ch5 Ratios & Valuation   -> Ratios & Investor Relations dashboards (7-11)
         Ch6 Risk & Anomaly       -> Exceptions & Compliance dashboards (12-15)
         Ch7 Capital Assets & RPT -> Capital Assets & RPT dashboards (16-18)
         Ch8 Forex & Loans        -> Forex & Loans dashboards (19-22)
    """
    writer = PdfWriter()
    page_count = 0

    # Full merge order with correct chapter-to-dashboard mapping
    merge_order = [
        # --- Cover / Table of Contents ---
        {
            "title": "Cover \u2014 Table of Contents",
            "files": [
                os.path.join(PROJECT, "Pitti Group \u2014 CFO Storybook.pdf"),
            ],
        },
        # --- Main Narrative (all 8 chapters in one scrolling page) ---
        {
            "title": "CFO Storybook \u2014 Full Narrative",
            "files": [sb(1)],
        },
        # --- Chapter 1: Executive Summary ---
        # Deep dive: Financial Statements (the detail behind the headline numbers)
        {
            "title": "Chapter 1 \u2014 Executive Summary (Financial Statements Deep Dive)",
            "files": [sb(2), sb(3)],
        },
        # --- Chapter 2: Value Chain ---
        # Deep dive: Sales Analytics
        {
            "title": "Chapter 2 \u2014 Value Chain (Sales Analytics Deep Dive)",
            "files": [sb(4)],
        },
        # --- Chapter 3: Margin Story ---
        # Deep dive: Expense Analytics
        {
            "title": "Chapter 3 \u2014 Margin Story (Expense Analytics Deep Dive)",
            "files": [sb(5)],
        },
        # --- Chapter 4: Cash & Working Capital ---
        # Deep dive: Working Capital & Treasury
        {
            "title": "Chapter 4 \u2014 Cash & Working Capital (Working Capital & Treasury Deep Dive)",
            "files": [sb(6)],
        },
        # --- Chapter 5: Ratios & Valuation ---
        # Deep dive: Ratios & Investor Relations
        {
            "title": "Chapter 5 \u2014 Ratios & Valuation (Ratios & Investor Relations Deep Dive)",
            "files": [sb(7), sb(8), sb(9), sb(10), sb(11)],
        },
        # --- Chapter 6: Risk & Anomaly ---
        # Deep dive: Exceptions & Compliance
        {
            "title": "Chapter 6 \u2014 Risk & Anomaly (Exceptions & Compliance Deep Dive)",
            "files": [sb(12), sb(13), sb(14), sb(15)],
        },
        # --- Chapter 7: Capital Assets & RPT ---
        # Deep dive: Capital Assets & RPT
        {
            "title": "Chapter 7 \u2014 Capital Assets & RPT (Deep Dive)",
            "files": [sb(16), sb(17), sb(18)],
        },
        # --- Chapter 8: Forex & Loans ---
        # Deep dive: Forex & Loans
        {
            "title": "Chapter 8 \u2014 Forex & Loans (Deep Dive)",
            "files": [sb(19), sb(20), sb(21), sb(22)],
        },
    ]

    print("=" * 60)
    print("MERGING PITTI GROUP CFO STORYBOOK")
    print("=" * 60)

    for section in merge_order:
        title = section["title"]
        section_start = page_count
        print("")
        print(">> " + title)

        for filepath in section["files"]:
            basename = os.path.basename(filepath)
            if not os.path.exists(filepath):
                print("   [MISSING] " + basename)
                continue

            reader = PdfReader(filepath)
            num_pages = len(reader.pages)
            for page in reader.pages:
                writer.add_page(page)
                page_count += 1
            print("   [OK] " + basename + " (" + str(num_pages) + " page(s))")

        # Add bookmark for PDF navigation
        if page_count > section_start:
            writer.add_outline_item(title, section_start)

    # Write the merged output
    output_path = os.path.join(PROJECT, "Pitti_Group_CFO_Storybook_Complete.pdf")
    with open(output_path, "wb") as f:
        writer.write(f)

    print("")
    print("=" * 60)
    print("MERGED PDF CREATED SUCCESSFULLY!")
    print("   Total pages: " + str(page_count))
    print("   Output: " + output_path)
    print("=" * 60)

    return output_path


if __name__ == "__main__":
    merge()
