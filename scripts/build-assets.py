"""生成品牌与分享图资源（一次性脚本，可重复运行）。
源：旧站备份 images；输出：public/img。
"""
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

SRC = Path(r"D:\WorkCode\yeshizistudio.top 备份\images")
OUT = Path(r"D:\WorkCode\yeshizi-web\public\img")
OUT.mkdir(parents=True, exist_ok=True)

FONT_BD = r"C:\Windows\Fonts\msyhbd.ttc"
FONT_RG = r"C:\Windows\Fonts\msyh.ttc"


def line_art(logo: Image.Image, gamma: float = 0.72, color=(226, 240, 255)) -> Image.Image:
    """白底蓝 logo -> 透明底浅色线稿，供深色背景使用。"""
    rgb = logo.convert("RGB")
    w, h = rgb.size
    out = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    src = rgb.load()
    dst = out.load()
    for y in range(h):
        for x in range(w):
            r, g, b = src[x, y]
            lum = 0.299 * r + 0.587 * g + 0.114 * b
            a = (255 - lum) / 255.0
            a = a ** gamma
            dst[x, y] = (*color, int(max(0, min(255, round(a * 255)))))
    return out.crop(out.getbbox())


def make_hero() -> None:
    hero = Image.open(SRC / "hezhao.png").convert("RGB")
    hero = hero.resize((1600, 900), Image.LANCZOS)
    hero.save(OUT / "hero.jpg", "JPEG", quality=82, optimize=True, progressive=True)
    print("hero.jpg", (OUT / "hero.jpg").stat().st_size // 1024, "KB")


def make_og(mark: Image.Image) -> None:
    W, H = 1200, 630
    bg = Image.open(SRC / "hezhao.png").convert("RGB").resize((W, H), Image.LANCZOS)
    dark = Image.new("RGB", (W, H), (4, 8, 16))
    bg = Image.blend(bg, dark, 0.62)
    tint = Image.new("RGB", (W, H), (10, 40, 90))
    bg = Image.blend(bg, tint, 0.18)

    glow = Image.new("L", (W, H), 0)
    gd = ImageDraw.Draw(glow)
    gd.ellipse((-260, -260, W + 260, H + 260), fill=90)
    glow = glow.filter(ImageFilter.GaussianBlur(160))
    bg = Image.composite(Image.new("RGB", (W, H), (12, 30, 60)), bg, glow)

    canvas = bg.convert("RGBA")
    draw = ImageDraw.Draw(canvas)
    for x in range(0, W, 56):
        draw.line([(x, 0), (x, H)], fill=(120, 170, 255, 8))
    for y in range(0, H, 56):
        draw.line([(0, y), (W, y)], fill=(120, 170, 255, 8))

    m = mark.copy()
    m.thumbnail((360, 360))
    canvas.paste(m, (92, 120), m)

    f_title = ImageFont.truetype(FONT_BD, 68)
    f_en = ImageFont.truetype(FONT_BD, 30)
    f_sub = ImageFont.truetype(FONT_RG, 26)
    draw.text((520, 178), "夜十字工作室", font=f_title, fill=(238, 246, 255))
    draw.text((522, 268), "NOCTU CRUCIS STUDIO", font=f_en, fill=(122, 184, 255))
    draw.line([(522, 328), (1030, 328)], fill=(84, 140, 220, 120), width=2)
    draw.text((522, 352), "一个普普通通的 MC 工作室", font=f_sub, fill=(198, 214, 238))
    draw.text((522, 392), "我们很小，但我们很努力！", font=f_sub, fill=(198, 214, 238))
    draw.text((522, 470), "2017 / 07 / 23  —  NOW",
              font=ImageFont.truetype(FONT_RG, 22), fill=(118, 140, 172))

    canvas.convert("RGB").save(OUT / "og-cover.jpg", "JPEG", quality=88, optimize=True)
    print("og-cover.jpg", (OUT / "og-cover.jpg").stat().st_size // 1024, "KB")


def make_placeholder(mark: Image.Image) -> None:
    """旧站已无资源的地图封面占位图：深色品牌底 + 交叉标记 + 提示文字。"""
    W, H = 684, 428
    canvas = Image.new("RGB", (W, H), "#080e1a")
    draw = ImageDraw.Draw(canvas)
    # 渐变底
    for y in range(H):
        t = y / H
        color = (int(8 + 10 * (1 - t)), int(14 + 20 * (1 - t)), int(26 + 34 * (1 - t)))
        draw.line([(0, y), (W, y)], fill=color)
    # 网格
    for x in range(0, W, 42):
        draw.line([(x, 0), (x, H)], fill=(20, 34, 58), width=1)
    for y in range(0, H, 42):
        draw.line([(0, y), (W, y)], fill=(20, 34, 58), width=1)

    m = mark.copy()
    m.thumbnail((240, 240))
    faded = m.copy()
    faded.putalpha(m.getchannel("A").point(lambda a: int(a * 0.28)))
    canvas.paste(faded, ((W - m.width) // 2, (H - m.height) // 2 - 16), faded)

    f_big = ImageFont.truetype(FONT_BD, 34)
    f_small = ImageFont.truetype(FONT_RG, 21)
    label = "封面暂缺"
    bbox = draw.textbbox((0, 0), label, font=f_big)
    draw.text(((W - (bbox[2] - bbox[0])) / 2, H - 118), label, font=f_big, fill=(150, 180, 218))
    sub = "COVER MISSING · 资源已失效"
    bbox2 = draw.textbbox((0, 0), sub, font=f_small)
    draw.text(((W - (bbox2[2] - bbox2[0])) / 2, H - 66), sub, font=f_small, fill=(96, 120, 152))

    # 四角装饰
    accent = (63, 120, 190)
    L = 22
    for cx, cy, dx, dy in ((16, 16, 1, 1), (W - 16, 16, -1, 1), (16, H - 16, 1, -1), (W - 16, H - 16, -1, -1)):
        draw.line([(cx, cy), (cx + dx * L, cy)], fill=accent, width=2)
        draw.line([(cx, cy), (cx, cy + dy * L)], fill=accent, width=2)

    canvas.save(OUT / "cover-placeholder.png")
    print("cover-placeholder.png", (W, H))


def make_theme_assets(logo: Image.Image) -> None:
    """白天主题用的深蓝线稿标志（黑夜主题用浅色 brand-mark.png）。"""
    ink = line_art(logo, 0.72, color=(20, 84, 196))
    ink.save(OUT / "brand-mark-ink.png")
    w, h = ink.size
    ink.crop((0, 0, w, int(h * 0.66))).save(OUT / "brand-cross-ink.png")
    print("brand-mark-ink.png", ink.size)


def main() -> None:
    logo = Image.open(SRC / "titlelogo.png")
    mark_a = line_art(logo, 0.72)
    mark_a.save(OUT / "brand-mark.png")
    print("brand-mark.png", mark_a.size)
    make_hero()
    make_og(mark_a)
    make_placeholder(mark_a)
    make_theme_assets(logo)


if __name__ == "__main__":
    main()
