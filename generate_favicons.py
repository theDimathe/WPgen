import colorsys
import re
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent

site_dirs = sorted([
    p for p in BASE_DIR.iterdir()
    if p.is_dir() and re.match(r"\d{2}-", p.name)
])

sites = [(BASE_DIR, "WP")]
sites.extend((directory, directory.name.split('-')[0]) for directory in site_dirs)

def hsv_to_hex(h: float, s: float, v: float) -> str:
    r, g, b = colorsys.hsv_to_rgb(h, s, v)
    return f"#{int(r * 255):02X}{int(g * 255):02X}{int(b * 255):02X}"


def ensure_favicon_link(html_path: Path, href: str) -> bool:
    content = html_path.read_text(encoding="utf-8")
    if re.search(r"rel=['\"]icon['\"]", content):
        return False

    base_indent = "    "
    link_tag = f"<link rel=\"icon\" type=\"image/svg+xml\" href=\"{href}\">"

    match = re.search(r"^\s*<link\b", content, flags=re.MULTILINE)
    if match:
        line_start = content.rfind('\n', 0, match.start()) + 1
        indent = content[line_start:match.start()]
        if not indent.strip():
            indent = base_indent
        insertion = indent + link_tag + '\n'
        content = content[:match.start()] + insertion + content[match.start():]
    elif '</head>' in content:
        content = content.replace('</head>', f"{base_indent}{link_tag}\n</head>")
    else:
        return False

    html_path.write_text(content, encoding="utf-8")
    return True


def create_svg(path: Path, bg_color: str, accent_color: str, label: str) -> None:
    svg_content = f"""<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
  <defs>
    <linearGradient id='grad' x1='0%' y1='0%' x2='100%' y2='100%'>
      <stop offset='0%' stop-color='{bg_color}' />
      <stop offset='100%' stop-color='{accent_color}' />
    </linearGradient>
  </defs>
  <rect width='100' height='100' rx='18' fill='url(#grad)' />
  <path d='M5 70 L35 40 L55 60 L95 20 L95 95 L5 95 Z' fill='rgba(255, 255, 255, 0.22)' />
  <text x='50' y='63' font-family="'Segoe UI', sans-serif" font-size='46' font-weight='700' text-anchor='middle' fill='#FFFFFF'>
    {label}
  </text>
</svg>
"""
    path.write_text(svg_content.strip() + "\n", encoding="utf-8")


updates = []
for index, (directory, label) in enumerate(sites):
    hue = (index / max(len(sites), 1)) % 1.0
    bg = hsv_to_hex(hue, 0.55, 0.78)
    accent = hsv_to_hex((hue + 0.12) % 1.0, 0.65, 0.85)

    if directory is BASE_DIR:
        favicon_dir = directory
        href = 'favicon.svg'
    else:
        favicon_dir = directory / 'images'
        favicon_dir.mkdir(parents=True, exist_ok=True)
        href = 'images/favicon.svg'

    svg_path = favicon_dir / 'favicon.svg'
    create_svg(svg_path, bg, accent, label)

    html_files = []
    if directory is BASE_DIR:
        html_files.append(directory / 'index.html')
    else:
        html_files.append(directory / 'index.html')

    for html_path in html_files:
        if html_path.exists():
            changed = ensure_favicon_link(html_path, href)
            if changed:
                updates.append(html_path)

print(f"Generated favicons for {len(sites)} sites.")
if updates:
    print("Updated HTML files:")
    for path in updates:
        print(f" - {path.relative_to(BASE_DIR)}")
