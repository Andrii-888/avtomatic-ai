"""Generate sample PDFs for every document type the app classifies.

All content is fictional. Output: ~/Desktop/test-<type>.pdf
"""
import os
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas

DESK = os.path.expanduser("~/Desktop")
W, H = A4
LEFT = 25 * mm
RIGHT = W - 25 * mm


def new(name):
    c = canvas.Canvas(os.path.join(DESK, name), pagesize=A4)
    return c


def title(c, text, y=H - 35 * mm, size=24):
    c.setFont("Helvetica-Bold", size)
    c.drawString(LEFT, y, text)


def line(c, y):
    c.setLineWidth(0.5)
    c.line(LEFT, y, RIGHT, y)


def para(c, x, y, text, size=11, bold=False, lead=6 * mm):
    c.setFont("Helvetica-Bold" if bold else "Helvetica", size)
    for i, ln in enumerate(text.split("\n")):
        c.drawString(x, y - i * lead, ln)


# ---------- INVOICE ----------
c = new("test-invoice.pdf")
title(c, "INVOICE")
c.setFont("Helvetica", 11)
c.drawRightString(RIGHT, H - 30 * mm, "Invoice No: INV-2026-001")
c.drawRightString(RIGHT, H - 36 * mm, "Date: 15.01.2026")
c.drawRightString(RIGHT, H - 42 * mm, "Due Date: 28.02.2026")
line(c, H - 50 * mm)
para(c, LEFT, H - 62 * mm, "From:", bold=True)
para(c, LEFT, H - 68 * mm, "Northwind Studio Ltd\nManchester, United Kingdom")
para(c, LEFT + 95 * mm, H - 62 * mm, "Bill To:", bold=True)
para(c, LEFT + 95 * mm, H - 68 * mm, "Riverside Retail Ltd\nLeeds, United Kingdom")
para(c, LEFT, H - 92 * mm, "Description", bold=True)
c.drawRightString(RIGHT, H - 92 * mm, "Amount")
para(c, LEFT, H - 100 * mm, "Web Development Services")
c.drawRightString(RIGHT, H - 100 * mm, "GBP 4,500.00")
line(c, H - 105 * mm)
c.drawRightString(RIGHT - 35 * mm, H - 113 * mm, "Subtotal:")
c.drawRightString(RIGHT, H - 113 * mm, "GBP 4,500.00")
c.drawRightString(RIGHT - 35 * mm, H - 119 * mm, "VAT 20%:")
c.drawRightString(RIGHT, H - 119 * mm, "GBP 900.00")
c.setFont("Helvetica-Bold", 12)
c.drawRightString(RIGHT - 35 * mm, H - 127 * mm, "Total:")
c.drawRightString(RIGHT, H - 127 * mm, "GBP 5,400.00")
c.showPage()
c.save()

# ---------- CONTRACT ----------
c = new("test-contract.pdf")
title(c, "SERVICE AGREEMENT")
line(c, H - 42 * mm)
para(
    c,
    LEFT,
    H - 55 * mm,
    "This Service Agreement is entered into between Alpha Software Ltd\n"
    "(the Provider) and Beta Logistics Ltd (the Client).",
)
para(c, LEFT, H - 78 * mm, "1. Parties", bold=True)
para(
    c,
    LEFT,
    H - 86 * mm,
    "Provider: Alpha Software Ltd, London, United Kingdom\n"
    "Client: Beta Logistics Ltd, Birmingham, United Kingdom",
)
para(c, LEFT, H - 104 * mm, "2. Term", bold=True)
para(
    c,
    LEFT,
    H - 112 * mm,
    "Start Date: 01.03.2026\nEnd Date: 28.02.2027",
)
para(c, LEFT, H - 130 * mm, "3. Notice Period", bold=True)
para(
    c,
    LEFT,
    H - 138 * mm,
    "Either party may terminate this agreement with a notice period of 30 days.",
)
para(c, LEFT, H - 156 * mm, "4. Scope of Services", bold=True)
para(
    c,
    LEFT,
    H - 164 * mm,
    "The Provider shall deliver software development and maintenance services\n"
    "as described in the attached statement of work.",
)
para(c, LEFT, H - 195 * mm, "Signed by both parties on 20.02.2026.")
c.showPage()
c.save()

# ---------- CV ----------
c = new("test-cv.pdf")
title(c, "Maria Rossi")
c.setFont("Helvetica", 11)
c.drawString(LEFT, H - 43 * mm, "Email: maria.rossi@example.com  |  Phone: +44 20 7946 0123")
line(c, H - 49 * mm)
para(c, LEFT, H - 60 * mm, "Summary", bold=True)
para(
    c,
    LEFT,
    H - 68 * mm,
    "Senior Frontend Engineer with 8 years of experience building web apps.",
)
para(c, LEFT, H - 86 * mm, "Experience", bold=True)
para(
    c,
    LEFT,
    H - 94 * mm,
    "Senior Frontend Engineer — Acme Web (2021–Present)\n"
    "Frontend Developer — BrightApps (2017–2021)",
)
para(c, LEFT, H - 118 * mm, "Skills", bold=True)
para(c, LEFT, H - 126 * mm, "React, TypeScript, Next.js, CSS, Testing")
para(c, LEFT, H - 144 * mm, "Languages", bold=True)
para(c, LEFT, H - 152 * mm, "English (native), Italian (fluent), Spanish (basic)")
para(c, LEFT, H - 170 * mm, "Education", bold=True)
para(c, LEFT, H - 178 * mm, "BSc Computer Science — University of Bristol, 2016")
c.showPage()
c.save()

# ---------- CERTIFICATE ----------
c = new("test-certificate.pdf")
c.setFont("Helvetica-Bold", 26)
c.drawCentredString(W / 2, H - 55 * mm, "Certificate of Completion")
c.setFont("Helvetica", 13)
c.drawCentredString(W / 2, H - 75 * mm, "This is to certify that")
c.setFont("Helvetica-Bold", 20)
c.drawCentredString(W / 2, H - 90 * mm, "James Carter")
c.setFont("Helvetica", 13)
c.drawCentredString(W / 2, H - 105 * mm, "has successfully completed the course")
c.setFont("Helvetica-Bold", 15)
c.drawCentredString(W / 2, H - 120 * mm, "Advanced Project Management")
c.setFont("Helvetica", 12)
c.drawCentredString(W / 2, H - 140 * mm, "Issued by: Global Training Institute")
c.drawCentredString(W / 2, H - 150 * mm, "Date: 10.12.2025")
c.drawCentredString(W / 2, H - 160 * mm, "Certificate ID: GTI-2025-7788")
c.showPage()
c.save()

for f in ["test-invoice.pdf", "test-contract.pdf", "test-cv.pdf", "test-certificate.pdf"]:
    p = os.path.join(DESK, f)
    print("Created:", p, "(%d bytes)" % os.path.getsize(p))
