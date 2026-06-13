"""Generate non-English sample PDFs (DE/FR/IT/RU). Fictional content.

Uses a system Unicode TTF (Arial Unicode) so Cyrillic renders correctly.
Output: ~/Desktop/test-<lang>-<type>.pdf
"""
import os
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

FONT_PATH = "/System/Library/Fonts/Supplemental/Arial Unicode.ttf"
pdfmetrics.registerFont(TTFont("Uni", FONT_PATH))

DESK = os.path.expanduser("~/Desktop")
W, H = A4
LEFT = 25 * mm
RIGHT = W - 25 * mm


def new(name):
    return canvas.Canvas(os.path.join(DESK, name), pagesize=A4)


def text(c, x, y, s, size=11, lead=6 * mm, center=False):
    c.setFont("Uni", size)
    for i, ln in enumerate(s.split("\n")):
        if center:
            c.drawCentredString(W / 2, y - i * lead, ln)
        else:
            c.drawString(x, y - i * lead, ln)


def line(c, y):
    c.setLineWidth(0.5)
    c.line(LEFT, y, RIGHT, y)


# ---------- DE: invoice ----------
c = new("test-de-invoice.pdf")
text(c, LEFT, H - 35 * mm, "RECHNUNG", size=24)
c.setFont("Uni", 11)
c.drawRightString(RIGHT, H - 30 * mm, "Rechnungsnummer: RE-2026-014")
c.drawRightString(RIGHT, H - 36 * mm, "Datum: 12.02.2026")
c.drawRightString(RIGHT, H - 42 * mm, "Fällig bis: 12.03.2026")
line(c, H - 50 * mm)
text(c, LEFT, H - 62 * mm, "Von:", size=12)
text(c, LEFT, H - 68 * mm, "Müller IT-Dienstleistungen GmbH\nBerlin, Deutschland")
text(c, LEFT + 95 * mm, H - 62 * mm, "An:", size=12)
text(c, LEFT + 95 * mm, H - 68 * mm, "Schneider Handels AG\nHamburg, Deutschland")
text(c, LEFT, H - 92 * mm, "Beschreibung: Webentwicklung und Wartung")
line(c, H - 100 * mm)
c.drawRightString(RIGHT, H - 108 * mm, "Betrag: EUR 3.200,00")
c.drawRightString(RIGHT, H - 114 * mm, "MwSt 19%: EUR 608,00")
text(c, LEFT, H - 122 * mm, "")
c.setFont("Uni", 13)
c.drawRightString(RIGHT, H - 122 * mm, "Gesamtbetrag: EUR 3.808,00")
text(c, LEFT, 30 * mm, "Vielen Dank für Ihr Vertrauen. Zahlbar bis zum 12.03.2026.", size=9)
c.showPage()
c.save()

# ---------- FR: CV ----------
c = new("test-fr-cv.pdf")
text(c, LEFT, H - 35 * mm, "Camille Bernard", size=24)
text(c, LEFT, H - 43 * mm, "Email : camille.bernard@example.fr  |  Téléphone : +33 1 23 45 67 89")
line(c, H - 49 * mm)
text(c, LEFT, H - 60 * mm, "Profil", size=12)
text(c, LEFT, H - 68 * mm, "Développeuse backend avec 6 ans d'expérience dans la création d'API.")
text(c, LEFT, H - 86 * mm, "Expérience", size=12)
text(c, LEFT, H - 94 * mm,
     "Ingénieure logiciel — Datatech (2020–présent)\n"
     "Développeuse — WebNeo (2018–2020)")
text(c, LEFT, H - 118 * mm, "Compétences", size=12)
text(c, LEFT, H - 126 * mm, "Python, Django, PostgreSQL, Docker, Git")
text(c, LEFT, H - 144 * mm, "Langues", size=12)
text(c, LEFT, H - 152 * mm, "Français (langue maternelle), Anglais (courant), Espagnol (notions)")
text(c, LEFT, H - 170 * mm, "Formation", size=12)
text(c, LEFT, H - 178 * mm, "Master en informatique — Université de Lyon, 2017")
c.showPage()
c.save()

# ---------- IT: contract ----------
c = new("test-it-contract.pdf")
text(c, LEFT, H - 35 * mm, "CONTRATTO DI SERVIZI", size=22)
line(c, H - 42 * mm)
text(c, LEFT, H - 55 * mm,
     "Il presente contratto è stipulato tra Rossi Software Srl (il Fornitore)\n"
     "e Bianchi Logistica Spa (il Cliente).")
text(c, LEFT, H - 78 * mm, "1. Parti", size=12)
text(c, LEFT, H - 86 * mm,
     "Fornitore: Rossi Software Srl, Milano, Italia\n"
     "Cliente: Bianchi Logistica Spa, Torino, Italia")
text(c, LEFT, H - 104 * mm, "2. Durata", size=12)
text(c, LEFT, H - 112 * mm, "Data di inizio: 01.04.2026\nData di fine: 31.03.2027")
text(c, LEFT, H - 130 * mm, "3. Preavviso", size=12)
text(c, LEFT, H - 138 * mm,
     "Ciascuna parte può recedere dal contratto con un preavviso di 60 giorni.")
text(c, LEFT, H - 156 * mm, "4. Oggetto", size=12)
text(c, LEFT, H - 164 * mm,
     "Il Fornitore fornirà servizi di sviluppo e manutenzione software.")
text(c, LEFT, H - 192 * mm, "Firmato da entrambe le parti il 25.03.2026.")
c.showPage()
c.save()

# ---------- RU: certificate ----------
c = new("test-ru-certificate.pdf")
text(c, 0, H - 55 * mm, "Сертификат о прохождении курса", size=24, center=True)
text(c, 0, H - 75 * mm, "Настоящим подтверждается, что", size=13, center=True)
text(c, 0, H - 90 * mm, "Иван Петров", size=20, center=True)
text(c, 0, H - 105 * mm, "успешно завершил курс", size=13, center=True)
text(c, 0, H - 120 * mm, "«Управление проектами»", size=15, center=True)
text(c, 0, H - 140 * mm, "Выдан: Институт профессионального образования", size=12, center=True)
text(c, 0, H - 150 * mm, "Дата: 05.11.2025", size=12, center=True)
text(c, 0, H - 160 * mm, "Номер сертификата: ИПО-2025-3344", size=12, center=True)
c.showPage()
c.save()

for f in ["test-de-invoice.pdf", "test-fr-cv.pdf", "test-it-contract.pdf", "test-ru-certificate.pdf"]:
    p = os.path.join(DESK, f)
    print("Created:", p, "(%d bytes)" % os.path.getsize(p))
