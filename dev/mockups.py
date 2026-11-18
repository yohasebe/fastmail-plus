"""Generate the SVG mockups in images/mockups/ (README and store artwork).

The button icons are read from content/reading_pane_control.js, so the mockups
follow the extension's real buttons. Run from the repository root:

    python3 dev/mockups.py

Edit this file (not the generated SVGs) to change the mockups.
"""
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'images', 'mockups')
with open(os.path.join(ROOT, 'content', 'reading_pane_control.js')) as f:
    icons = dict(re.findall(r"  (\w+): svgIcon\('(.*?)'\),\n", f.read()))

FONT = "-apple-system, 'Helvetica Neue', Arial, sans-serif"
TITLE_FONT = "Futura, 'Avenir Next', 'Helvetica Neue', Arial, sans-serif"
BLUE = "#0067b9"; YELLOW = "#ffc10e"; ACCENT = "#5b9bd5"
INK = "#1b1e20"; SUB = "#5f6b76"; LINE = "#d9dde1"; PAGE = "#f3f4f5"; CARD = "#ffffff"; BTN = "#e4e6e8"

def symbols(names):
    out = []
    for n in names:
        out.append(f'    <symbol id="i-{n}" viewBox="0 0 16 16">{icons[n]}</symbol>')
    return "\n".join(out)

def svg(w, h, body, defs="", title=""):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}" '
            f'font-family="{FONT}">\n'
            + (f'  <title>{title}</title>\n' if title else '')
            + (f'  <defs>\n{defs}\n  </defs>\n' if defs else '')
            + body + '\n</svg>\n')

def write(name, content):
    open(os.path.join(OUT, name), 'w').write(content)

def icon(n, x, y, size=16, color=INK):
    return f'<use href="#i-{n}" x="{x}" y="{y}" width="{size}" height="{size}" fill="{color}"/>'

# ---- reading-pane buttons -------------------------------------------------
def cluster(x, y, scale=1.0, with_popover=False):
    """The floating button cluster at (x, y) (top-left of the frosted panel)."""
    names = ['reload', 'fullscreen', 'up', 'down', 'viewList', 'expand', 'collapse', None, 'rightSquare']
    bw, bh, gap, pad = 40, 32, 8, 6
    parts = []
    widths = [56 if n is None else bw for n in names]
    total = sum(widths) + gap * (len(names) - 1) + pad * 2
    parts.append(f'<g transform="translate({x} {y}) scale({scale})">')
    parts.append(f'  <rect width="{total}" height="{bh + pad*2}" rx="12" fill="#7f7f7f" fill-opacity="0.12"/>')
    cx = pad
    for n, w in zip(names, widths):
        parts.append(f'  <rect x="{cx}" y="{pad}" width="{w}" height="{bh}" rx="6" fill="#7f7f7f" fill-opacity="0.18"/>')
        if n is None:
            parts.append(f'  <text x="{cx + w/2}" y="{pad + 21}" font-size="13" text-anchor="middle" fill="{INK}">100%</text>')
            if with_popover:
                px, py = cx - pad, -3 * (bh + 8) - pad - 2
                parts.append(f'  <rect x="{px}" y="{py}" width="{w + pad*2}" height="{3*bh + 2*8 + pad*2}" rx="12" fill="#7f7f7f" fill-opacity="0.12"/>')
                for i, label in enumerate(['A+', '↺', 'A-']):
                    by = py + pad + i * (bh + 8)
                    parts.append(f'  <rect x="{cx}" y="{by}" width="{w}" height="{bh}" rx="6" fill="#7f7f7f" fill-opacity="0.18"/>')
                    parts.append(f'  <text x="{cx + w/2}" y="{by + 21}" font-size="14" text-anchor="middle" fill="{INK}">{label}</text>')
        else:
            parts.append('  ' + icon(n, cx + (w - 16) / 2, pad + 8))
        cx += w + gap
    parts.append('</g>')
    return "\n".join('  ' + p for p in parts), total

CLUSTER_ICONS = ['reload', 'fullscreen', 'up', 'down', 'viewList', 'expand', 'collapse', 'rightSquare']

def reading_pane_buttons():
    g, total = cluster(20, 150, 1.0, with_popover=True)
    w = int(total + 40)
    body = f'  <rect width="{w}" height="214" fill="{PAGE}"/>\n{g}'
    write('reading-pane-buttons.svg', svg(w, 214, body, symbols(CLUSTER_ICONS), 'Reading-pane buttons'))

# ---- search modes ----------------------------------------------------------
SEARCH_ICON = '<circle cx="10.5" cy="10.5" r="5.75"/><line x1="19.25" y1="19.25" x2="14.57" y2="14.57"/>'
SEND = '<line x1="4" y1="12" x2="18" y2="12"/><polyline points="12 5.5 18.5 12 12 18.5"/>'
REPEAT = '<polyline points="17 2 21 6 17 10"/><path d="M3 11.5V10a4 4 0 0 1 4-4h14"/><polyline points="7 22 3 18 7 14"/><path d="M21 12.5V14a4 4 0 0 1-4 4H3"/>'

def stroke_icon(inner, x, y, size=18, color=INK):
    return (f'<svg x="{x}" y="{y}" width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="{color}" '
            f'stroke-width="2" stroke-linecap="round" stroke-linejoin="round">{inner}</svg>')

def search_bar(x, y, width, placeholder, input_bg, send_bg, toggle_bg=BTN):
    p = []
    p.append(f'<rect x="{x}" y="{y}" width="{width}" height="36" rx="6" fill="{input_bg}" stroke="#b9c0c7"/>')
    p.append(stroke_icon(SEARCH_ICON, x + 10, y + 9, 18, SUB))
    p.append(f'<text x="{x + 38}" y="{y + 23}" font-size="14" fill="{SUB}">{placeholder}</text>')
    p.append(f'<rect x="{x + width + 10}" y="{y}" width="36" height="36" rx="6" fill="{send_bg}"/>')
    p.append(stroke_icon(SEND, x + width + 19, y + 9))
    p.append(f'<rect x="{x + width + 54}" y="{y}" width="36" height="36" rx="6" fill="{toggle_bg}"/>')
    p.append(stroke_icon(REPEAT, x + width + 63, y + 9))
    return "\n".join('  ' + q for q in p)

def search_modes():
    rows = [
        ('Anywhere (Fastmail default)', 'Search Mail (Default)', '#ffffff', BTN),
        ('Subject &amp; Body', 'Search Mail (Subject &amp; Body)', '#e3edf7', '#80aedb'),
        ('Subject only', 'Search Mail (Subject Only)', '#f7e3e3', '#e6a8a8'),
    ]
    body = [f'  <rect width="760" height="250" fill="{PAGE}"/>']
    for i, (label, ph, ibg, sbg) in enumerate(rows):
        y = 20 + i * 76
        body.append(f'  <text x="20" y="{y + 12}" font-size="12" font-weight="600" fill="{SUB}">{i+1}. {label}</text>')
        body.append(search_bar(20, y + 22, 610, ph, ibg, sbg))
    write('search-modes.svg', svg(760, 250, "\n".join(body), title='Search modes'))

# ---- mail window mock (shared by banner and store screenshot) ---------------
def mail_window(x, y, w, h, subjects, cluster_scale=1.0, wide=True):
    p = [f'<g transform="translate({x} {y})">']
    p.append(f'  <rect width="{w}" height="{h}" rx="10" fill="{PAGE}" stroke="#c9ced3"/>')
    # top bar
    p.append(f'  <rect x="1" y="1" width="{w-2}" height="54" rx="9" fill="#e9ebed"/>')
    p.append(f'  <rect x="15" y="20" width="22" height="16" rx="3" fill="none" stroke="{INK}" stroke-width="2"/>')
    p.append(f'  <path d="M16 22 l10 7 10 -7" fill="none" stroke="{INK}" stroke-width="2"/>')
    p.append(f'  <text x="46" y="33" font-size="15" font-weight="600" fill="{INK}">Mail</text>')
    sx = int(w * 0.3)
    p.append(f'  <rect x="{sx}" y="12" width="{int(w*0.36)}" height="30" rx="6" fill="#ffffff" stroke="#c9ced3"/>')
    p.append(f'  <text x="{sx + 14}" y="32" font-size="13" fill="{SUB}">Search Mail (Default)</text>')
    p.append(f'  <rect x="{sx + int(w*0.36) + 8}" y="12" width="30" height="30" rx="6" fill="{BTN}"/>')
    p.append('  ' + stroke_icon(SEND, sx + int(w*0.36) + 15, 19, 16))
    p.append(f'  <rect x="{sx + int(w*0.36) + 46}" y="12" width="30" height="30" rx="6" fill="{BTN}"/>')
    p.append('  ' + stroke_icon(REPEAT, sx + int(w*0.36) + 53, 19, 16))
    # left nav
    p.append(f'  <rect x="14" y="70" width="110" height="28" rx="6" fill="{BLUE}"/>')
    p.append(f'  <text x="69" y="89" font-size="13" font-weight="600" fill="#ffffff" text-anchor="middle">Compose</text>')
    for i, f in enumerate(['Inbox', 'Drafts', 'Sent', 'Archive', 'Trash']):
        yy = 122 + i * 26
        if i == 0:
            p.append(f'  <rect x="10" y="{yy-17}" width="118" height="24" rx="5" fill="#dde1e5"/>')
        p.append(f'  <text x="22" y="{yy}" font-size="13" fill="{INK}">{f}</text>')
    # list pane
    lx, lw = 140, int(w * 0.38)
    p.append(f'  <rect x="{lx}" y="62" width="{lw}" height="{h-72}" fill="{CARD}"/>')
    p.append(f'  <line x1="{lx}" y1="96" x2="{lx+lw}" y2="96" stroke="{ACCENT}" stroke-width="2"/>')
    row_h = 46
    for i in range(int((h - 110) / row_h)):
        yy = 100 + i * row_h
        if i == 1:
            p.append(f'  <rect x="{lx}" y="{yy}" width="{lw}" height="{row_h}" fill="#e8eef5"/>')
        p.append(f'  <rect x="{lx+14}" y="{yy+16}" width="13" height="13" rx="3" fill="none" stroke="#b9c0c7"/>')
        if i < len(subjects):
            weight = '700' if i == 1 else '600'
            color = BLUE if i == 1 else INK
            p.append(f'  <text x="{lx+40}" y="{yy+28}" font-size="15" font-weight="{weight}" fill="{color}">{subjects[i]}</text>')
        else:
            p.append(f'  <rect x="{lx+40}" y="{yy+18}" width="{int(lw*0.5)}" height="9" rx="4" fill="#e6e8ea"/>')
        p.append(f'  <line x1="{lx+40}" y1="{yy+row_h}" x2="{lx+lw}" y2="{yy+row_h}" stroke="{LINE}"/>')
    # reading pane card
    rx = lx + lw + 16; rw = w - rx - 16
    p.append(f'  <rect x="{rx}" y="74" width="{rw}" height="{int(h*0.5)}" rx="10" fill="{CARD}" stroke="{LINE}"/>')
    p.append(f'  <text x="{rx+20}" y="104" font-size="14" font-weight="700" fill="{BLUE}">README</text>')
    p.append(f'  <line x1="{rx}" y1="116" x2="{rx+rw}" y2="116" stroke="{LINE}"/>')
    ty = 74 + int(h*0.5*0.55)
    fs = int(rw * 0.16)
    p.append(f'  <text x="{rx + rw/2}" y="{ty}" font-family="{TITLE_FONT}" font-size="{fs}" font-weight="800" fill="{BLUE}" text-anchor="middle">Fastmail</text>')
    p.append(f'  <text x="{rx + rw/2}" y="{ty + int(fs*0.95)}" font-family="{TITLE_FONT}" font-size="{fs}" font-weight="800" fill="{YELLOW}" text-anchor="middle">Plus</text>')
    for i in range(3):
        yy = 74 + int(h*0.5) + 26 + i * 18
        p.append(f'  <rect x="{rx+8}" y="{yy}" width="{int(rw*(0.8 - i*0.15))}" height="8" rx="4" fill="#e1e4e7"/>')
    g, total = cluster(0, 0, cluster_scale)
    p.append(f'  <g transform="translate({w - 16 - total*cluster_scale} {h - 16 - 44*cluster_scale})">')
    p.append(g)
    p.append('  </g>')
    p.append('</g>')
    return "\n".join('  ' + q for q in p)

FEATURES = ['Features', 'Quick search mode switch', 'Cursor key navigation', 'Extra shortcut keys',
            'Uncluttered viewing mode', 'Reading-pane buttons', 'Body text size', 'Resizable compose', '… and more']

def store_screenshot():
    body = f'  <rect width="1280" height="800" fill="#ffffff"/>\n' + mail_window(0, 0, 1280, 800, FEATURES[1:], 1.0)
    write('store-screenshot.svg', svg(1280, 800, body, symbols(CLUSTER_ICONS), 'Fastmail Plus'))

def banner():
    body = [f'  <rect width="1400" height="560" fill="{BLUE}"/>']
    body.append(f'  <text x="350" y="225" font-family="{TITLE_FONT}" font-size="124" font-weight="800" fill="#ffffff" text-anchor="middle">Fastmail</text>')
    body.append(f'  <text x="350" y="340" font-family="{TITLE_FONT}" font-size="124" font-weight="800" fill="{YELLOW}" text-anchor="middle">Plus</text>')
    body.append(f'  <text x="700" y="500" font-size="34" fill="#ffffff" text-anchor="middle">A browser extension to make the Fastmail web UI more usable and productive</text>')
    body.append(f'  <g transform="translate(750 56) scale(0.47)">')
    body.append(mail_window(0, 0, 1280, 800, FEATURES[1:], 1.0))
    body.append('  </g>')
    write('banner.svg', svg(1400, 560, "\n".join(body), symbols(CLUSTER_ICONS), 'Fastmail Plus'))

def promo_small():
    body = [f'  <rect width="440" height="280" fill="{BLUE}"/>']
    body.append(f'  <text x="220" y="118" font-family="{TITLE_FONT}" font-size="76" font-weight="800" fill="#ffffff" text-anchor="middle">Fastmail</text>')
    body.append(f'  <text x="220" y="188" font-family="{TITLE_FONT}" font-size="76" font-weight="800" fill="{YELLOW}" text-anchor="middle">Plus</text>')
    body.append(f'  <text x="220" y="240" font-size="17" fill="#ffffff" text-anchor="middle">Make the Fastmail web UI more productive</text>')
    write('promo-small.svg', svg(440, 280, "\n".join(body), title='Fastmail Plus'))

# ---- max width ---------------------------------------------------------------
def pane_mock(x, y, w, h, card_w, label):
    p = [f'<g transform="translate({x} {y})">']
    p.append(f'  <text x="0" y="-12" font-size="14" font-weight="600" fill="{SUB}">{label}</text>')
    p.append(f'  <rect width="{w}" height="{h}" rx="8" fill="{PAGE}" stroke="#c9ced3"/>')
    cx = (w - card_w) / 2
    p.append(f'  <rect x="{cx}" y="20" width="{card_w}" height="{h-40}" rx="8" fill="{CARD}" stroke="{LINE}"/>')
    p.append(f'  <rect x="{cx+16}" y="38" width="{card_w*0.45}" height="10" rx="5" fill="{BLUE}" fill-opacity="0.75"/>')
    for i in range(7):
        p.append(f'  <rect x="{cx+16}" y="{66 + i*22}" width="{(card_w-32)*(0.95 if i % 3 else 0.7)}" height="8" rx="4" fill="#e1e4e7"/>')
    p.append('</g>')
    return "\n".join('  ' + q for q in p)

def max_width():
    body = [f'  <rect width="1000" height="330" fill="#ffffff"/>']
    body.append(pane_mock(20, 44, 470, 260, 300, 'Default'))
    body.append(pane_mock(510, 44, 470, 260, 430, 'Maximize message/compose pane width'))
    write('max-width.svg', svg(1000, 330, "\n".join(body), title='Maximized pane width'))

# ---- resizable compose ---------------------------------------------------------
def resizable_compose():
    w, h = 900, 340
    p = [f'  <rect width="{w}" height="{h}" fill="{PAGE}"/>']
    cw = 560
    p.append(f'  <rect x="40" y="30" width="{cw+200}" height="280" rx="10" fill="none" stroke="{ACCENT}" stroke-dasharray="6 6"/>')
    p.append(f'  <rect x="40" y="30" width="{cw}" height="280" rx="10" fill="{CARD}" stroke="{LINE}"/>')
    p.append(f'  <rect x="60" y="48" width="74" height="28" rx="6" fill="{BLUE}"/>')
    p.append(f'  <text x="97" y="67" font-size="13" font-weight="600" fill="#ffffff" text-anchor="middle">Send</text>')
    for i, label in enumerate(['To', 'Subject']):
        yy = 104 + i * 34
        p.append(f'  <text x="60" y="{yy}" font-size="13" fill="{SUB}">{label}</text>')
        p.append(f'  <line x1="120" y1="{yy+6}" x2="{40+cw-24}" y2="{yy+6}" stroke="{LINE}"/>')
    for i in range(5):
        p.append(f'  <rect x="60" y="{176 + i*22}" width="{(cw-60)*(0.9 if i % 2 else 0.75)}" height="8" rx="4" fill="#e1e4e7"/>')
    gx = 40 + cw - 5
    p.append(f'  <rect x="{gx-1.5}" y="152" width="3" height="36" rx="1.5" fill="{ACCENT}"/>')
    p.append(f'  <path d="M{gx+24} 170 h150 M{gx+164} 160 l12 10 -12 10" fill="none" stroke="{ACCENT}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>')
    p.append(f'  <text x="{gx+30}" y="150" font-size="13" fill="{SUB}">Drag the right edge</text>')
    p.append(f'  <text x="{gx+30}" y="200" font-size="13" fill="{SUB}">The width is remembered</text>')
    write('resizable-compose.svg', svg(w, h, "\n".join(p), title='Resizable compose pane'))

# ---- options page ---------------------------------------------------------------
def options():
    items = [(True, 'Use switchable search box'), (True, 'Use ↑/↓/←/→ keys to move focus'),
             (True, 'Use extra shortcut keys'), (False, 'Maximize message/compose pane width'),
             (False, 'Show a reading pane layout button'), (False, 'Use H/L keys like ←/→')]
    p = [f'  <rect width="480" height="330" fill="#ffffff" stroke="{LINE}"/>']
    p.append(f'  <text x="24" y="44" font-size="20" font-weight="700" fill="{INK}">Fastmail Plus Options</text>')
    for i, (on, label) in enumerate(items):
        yy = 76 + i * 34
        if on:
            p.append(f'  <rect x="24" y="{yy}" width="18" height="18" rx="4" fill="#2f6fde"/>')
            p.append(f'  <path d="M28 {yy+9} l4 4 7 -8" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>')
        else:
            p.append(f'  <rect x="24.5" y="{yy+0.5}" width="17" height="17" rx="4" fill="#ffffff" stroke="#8a929a"/>')
        p.append(f'  <text x="54" y="{yy+14}" font-size="16" fill="{INK}">{label}</text>')
    p.append(f'  <text x="24" y="300" font-size="14" font-style="italic" fill="{SUB}">Reload page to reflect changes</text>')
    write('options.svg', svg(480, 330, "\n".join(p), title='Options'))

if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)
    for make in (reading_pane_buttons, search_modes, store_screenshot, banner, promo_small,
                 max_width, resizable_compose, options):
        make()

