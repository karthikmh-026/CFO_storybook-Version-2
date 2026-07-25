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

    # Full merge order with correct chapter-to-dashboard mapping for all 31 PDFs
    merge_order = [
        # --- Cover / Table of Contents ---
        {
            "title": "Cover — Table of Contents",
            "files": [
                os.path.join(PROJECT, "Pitti Group — CFO Storybook.pdf"),
            ],
        },
        # --- Main Narrative ---
        {
            "title": "CFO Storybook — Full Narrative",
            "files": [sb(1), sb(2), sb(3)],
        },
        # --- Chapter 1: Executive Summary ---
        {
            "title": "Chapter 1 — Executive Summary (Financial Statements Deep Dive)",
            "files": [sb(4), sb(5), sb(6), sb(7), sb(8), sb(9)],
        },
        # --- Chapter 2: Value Chain ---
        {
            "title": "Chapter 2 — Value Chain (Sales Analytics Deep Dive)",
            "files": [sb(10), sb(11), sb(12)],
        },
        # --- Chapter 3: Margin Story ---
        {
            "title": "Chapter 3 — Margin Story (Expense Analytics Deep Dive)",
            "files": [sb(13), sb(14), sb(15)],
        },
        # --- Chapter 4: Cash & Working Capital ---
        {
            "title": "Chapter 4 — Cash & Working Capital (Working Capital & Treasury Deep Dive)",
            "files": [sb(16), sb(17), sb(18)],
        },
        # --- Chapter 5: Ratios & Valuation ---
        {
            "title": "Chapter 5 — Ratios & Valuation (Ratios & Investor Relations Deep Dive)",
            "files": [sb(19), sb(20), sb(21)],
        },
        # --- Chapter 6: Risk & Anomaly ---
        {
            "title": "Chapter 6 — Risk & Anomaly (Exceptions & Compliance Deep Dive)",
            "files": [sb(22), sb(23), sb(24)],
        },
        # --- Chapter 7: Capital Assets & RPT ---
        {
            "title": "Chapter 7 — Capital Assets & RPT (Deep Dive)",
            "files": [sb(25), sb(26), sb(27)],
        },
        # --- Chapter 8: Forex & Loans ---
        {
            "title": "Chapter 8 — Forex & Loans (Deep Dive)",
            "files": [sb(28), sb(29), sb(30)],
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
