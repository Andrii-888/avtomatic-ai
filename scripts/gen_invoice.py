"""Generate a sample invoice PDF for testing document analysis."""
import os
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas

OUT = os.path.expanduser("~/Desktop/test-invoice.pdf")
W, H = A4

c = canvas.Canvas(OUT, pagesize=A4)
left = 25 * mm
right = W - 25 * mm

# Title
c.setFont("Helvetica-Bold", 26)
c.drawString(left, H - 35 * mm, "INVOICE")

c.setFont("Helvetica", 11)
c.drawRightString(right, H - 30 * mm, "Invoice No: INV-2026-001")
c.drawRightString(right, H - 36 * mm, "Date: 15.01.2026")
c.drawRightString(right, H - 42 * mm, "Due Date: 28.02.2026")

# Divider
c.setLineWidth(0.5)
c.line(left, H - 50 * mm, right, H - 50 * mm)

# From / To
y = H - 62 * mm
c.setFont("Helvetica-Bold", 11)
c.drawString(left, y, "From:")
c.drawString(left + 95 * mm, y, "To:")
c.setFont("Helvetica", 11)
c.drawString(left, y - 6 * mm, "TechCorp SA")
c.drawString(left, y - 12 * mm, "Lugano, Switzerland")
c.drawString(left + 95 * mm, y - 6 * mm, "ClientCorp AG")
c.drawString(left + 95 * mm, y - 12 * mm, "Zurich, Switzerland")

# Line items table
ty = y - 32 * mm
c.setFillColorRGB(0.95, 0.95, 0.95)
c.rect(left, ty - 2 * mm, right - left, 9 * mm, fill=1, stroke=0)
c.setFillColorRGB(0, 0, 0)
c.setFont("Helvetica-Bold", 11)
c.drawString(left + 3 * mm, ty, "Description")
c.drawRightString(right - 3 * mm, ty, "Amount")

c.setFont("Helvetica", 11)
ty -= 12 * mm
c.drawString(left + 3 * mm, ty, "Web Development Services")
c.drawRightString(right - 3 * mm, ty, "CHF 4,500.00")

# Totals
c.line(left, ty - 6 * mm, right, ty - 6 * mm)
ty -= 14 * mm
c.drawRightString(right - 35 * mm, ty, "Amount:")
c.drawRightString(right - 3 * mm, ty, "CHF 4,500.00")
ty -= 6 * mm
c.drawRightString(right - 35 * mm, ty, "VAT 8.1%:")
c.drawRightString(right - 3 * mm, ty, "CHF 364.50")
ty -= 9 * mm
c.setFont("Helvetica-Bold", 12)
c.drawRightString(right - 35 * mm, ty, "Total:")
c.drawRightString(right - 3 * mm, ty, "CHF 4,864.50")

# Footer
c.setFont("Helvetica", 9)
c.setFillColorRGB(0.4, 0.4, 0.4)
c.drawString(left, 25 * mm, "Thank you for your business. Payment due by 28.02.2026.")

c.showPage()
c.save()
print("Created:", OUT)
