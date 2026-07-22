import docx
import sys

doc_path = r"c:\Users\ajala\Downloads\CFO Dashboard (1).docx"
out_path = r"c:\Users\ajala\Downloads\CFO PITTI\cfo_storybook\backend\docx_content.txt"
try:
    doc = docx.Document(doc_path)
    with open(out_path, "w", encoding="utf-8") as out:
        for i, p in enumerate(doc.paragraphs, 1):
            if p.text.strip():
                out.write(f"{i}: {p.text.strip()}\n")
    print("Content successfully written to", out_path)
except Exception as e:
    print("Error reading docx:", e)
