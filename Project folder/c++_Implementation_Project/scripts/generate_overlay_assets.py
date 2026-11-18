import os
import math
from PIL import Image, ImageDraw, ImageFilter

overlay_dir = os.path.join(os.getcwd(), 'public', 'overlays')
os.makedirs(overlay_dir, exist_ok=True)

def create_transparent_ring_asset(filename, metal_type='platinum', gem_type='sapphire'):
    img = Image.new('RGBA', (500, 500), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    cx, cy = 250, 260
    rx, ry = 130, 60

    # 1. Ring Band (Outer & Inner 3D metal metallic shading)
    for t in range(24, 0, -1):
        alpha = int(255 * (t / 24.0))
        if metal_type == 'gold':
            color = (245 - t*4, 175 - t*3, 25 - t, 255)
        elif metal_type == 'rosegold':
            color = (251 - t*3, 113 - t*2, 133 - t*2, 255)
        else: # platinum / white gold
            color = (226 - t*3, 232 - t*3, 240 - t*3, 255)
        draw.ellipse([cx - rx - t, cy - ry - t//2, cx + rx + t, cy + ry + t//2], outline=color, width=2)

    # 2. Specular metallic highlights on band
    draw.arc([cx - rx - 12, cy - ry - 6, cx + rx + 12, cy + ry + 6], start=180, end=360, fill=(255, 255, 255, 230), width=4)

    # 3. Solitaire Crown Mount
    crown_y = cy - ry - 20
    draw.polygon([(cx - 25, crown_y + 35), (cx - 35, crown_y), (cx + 35, crown_y), (cx + 25, crown_y + 35)], fill=(200, 210, 225, 255))

    # 4. Faceted Gemstone (Sapphire, Diamond, Emerald, Ruby)
    gem_size = 55
    gem_cy = crown_y - 25

    if gem_type == 'sapphire':
        base_color = (37, 99, 235, 255)
        sparkle_color = (147, 197, 253, 255)
    elif gem_type == 'emerald':
        base_color = (5, 150, 105, 255)
        sparkle_color = (167, 243, 208, 255)
    elif gem_type == 'ruby':
        base_color = (225, 29, 72, 255)
        sparkle_color = (254, 205, 211, 255)
    else: # diamond
        base_color = (224, 242, 254, 255)
        sparkle_color = (255, 255, 255, 255)

    # Cushion Cut Gemstone Facets
    pts = [
        (cx, gem_cy - gem_size),
        (cx + gem_size, gem_cy - gem_size//2),
        (cx + gem_size, gem_cy + gem_size//2),
        (cx, gem_cy + gem_size),
        (cx - gem_size, gem_cy + gem_size//2),
        (cx - gem_size, gem_cy - gem_size//2)
    ]
    draw.polygon(pts, fill=base_color, outline=(255, 255, 255, 220))

    # Inner Gem Facet Reflections
    draw.polygon([(cx, gem_cy - gem_size), (cx + gem_size//2, gem_cy - 10), (cx, gem_cy + 10), (cx - gem_size//2, gem_cy - 10)], fill=sparkle_color)
    draw.ellipse([cx - 12, gem_cy - 25, cx + 5, gem_cy - 10], fill=(255, 255, 255, 240))

    img.save(os.path.join(overlay_dir, filename), 'PNG')
    print(f"Saved {filename}")

def create_transparent_necklace_asset(filename, metal_type='gold', gem_type='emerald'):
    img = Image.new('RGBA', (800, 600), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    cx = 400
    # Chain Curve Across Collarbone
    chain_pts = []
    for i in range(101):
        t = i / 100.0
        x = 100 + t * 600
        y = 120 + 260 * (4 * t * (1 - t)) # Parabolic chain curve
        chain_pts.append((x, y))

    # Metallic Chain Links
    metal_color = (245, 175, 25, 255) if metal_type == 'gold' else (226, 232, 240, 255)
    for i in range(len(chain_pts) - 1):
        draw.line([chain_pts[i], chain_pts[i+1]], fill=metal_color, width=6)
        if i % 3 == 0:
            draw.ellipse([chain_pts[i][0]-3, chain_pts[i][1]-3, chain_pts[i][0]+3, chain_pts[i][1]+3], fill=(255, 255, 255, 230))

    # Central Royal Pendant
    px, py = cx, 380
    # Connector Bail
    draw.rectangle([px - 8, py - 30, px + 8, py - 10], fill=metal_color)
    
    # Pear-shaped Gemstone
    gem_pts = []
    for deg in range(360):
        rad = math.radians(deg)
        r = 50 * (1 + 0.5 * math.sin(rad))
        gx = px + r * math.cos(rad)
        gy = py + r * math.sin(rad) + 20
        gem_pts.append((gx, gy))
    
    gem_fill = (5, 150, 105, 255) if gem_type == 'emerald' else (37, 99, 235, 255) if gem_type == 'sapphire' else (255, 255, 255, 255)
    draw.polygon(gem_pts, fill=gem_fill, outline=(255, 255, 255, 220))
    draw.ellipse([px - 15, py, px + 5, py + 25], fill=(255, 255, 255, 240))

    img.save(os.path.join(overlay_dir, filename), 'PNG')
    print(f"Saved {filename}")

def create_transparent_earring_asset(filename, metal_type='gold', gem_type='emerald'):
    img = Image.new('RGBA', (300, 500), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    cx = 150
    # Top Stud
    draw.ellipse([cx - 18, 40, cx + 18, 76], fill=(245, 175, 25, 255) if metal_type == 'gold' else (226, 232, 240, 255))
    draw.ellipse([cx - 6, 50, cx + 6, 62], fill=(255, 255, 255, 240))

    # Chandelier Lattice Frame
    draw.line([(cx, 76), (cx - 50, 160)], fill=(245, 175, 25, 255), width=5)
    draw.line([(cx, 76), (cx + 50, 160)], fill=(245, 175, 25, 255), width=5)
    draw.line([(cx - 50, 160), (cx + 50, 160)], fill=(245, 175, 25, 255), width=5)

    # Gemstone Drop
    gem_color = (5, 150, 105, 255) if gem_type == 'emerald' else (255, 255, 255, 255)
    draw.polygon([(cx, 160), (cx + 35, 280), (cx, 360), (cx - 35, 280)], fill=gem_color, outline=(255, 255, 255, 220))
    draw.ellipse([cx - 10, 240, cx + 5, 270], fill=(255, 255, 255, 240))

    img.save(os.path.join(overlay_dir, filename), 'PNG')
    print(f"Saved {filename}")

def create_transparent_tiara_asset(filename):
    img = Image.new('RGBA', (700, 400), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    cx = 350
    # Tiara Arch Base
    draw.arc([cx - 280, 100, cx + 280, 450], start=190, end=350, fill=(245, 175, 25, 255), width=8)

    # Tiara Peaks
    peaks = [
        (cx - 220, 200), (cx - 150, 110), (cx - 80, 160),
        (cx, 40),
        (cx + 80, 160), (cx + 150, 110), (cx + 220, 200)
    ]
    for i in range(len(peaks) - 1):
        draw.line([peaks[i], peaks[i+1]], fill=(245, 175, 25, 255), width=5)
        draw.ellipse([peaks[i][0]-12, peaks[i][1]-12, peaks[i][0]+12, peaks[i][1]+12], fill=(255, 255, 255, 240))

    draw.ellipse([cx-18, peaks[3][1]-18, cx+18, peaks[3][1]+18], fill=(255, 255, 255, 255))

    img.save(os.path.join(overlay_dir, filename), 'PNG')
    print(f"Saved {filename}")

create_transparent_ring_asset('ring_solitaire_sapphire.png', 'platinum', 'sapphire')
create_transparent_ring_asset('ring_solitaire_diamond.png', 'whitegold', 'diamond')
create_transparent_ring_asset('ring_gold_emerald.png', 'gold', 'emerald')
create_transparent_ring_asset('ring_ruby_sunset.png', 'rosegold', 'ruby')

create_transparent_necklace_asset('necklace_diamond_teardrop.png', 'whitegold', 'diamond')
create_transparent_necklace_asset('necklace_emerald_royal.png', 'gold', 'emerald')
create_transparent_necklace_asset('necklace_sapphire_pendant.png', 'platinum', 'sapphire')

create_transparent_earring_asset('earring_emerald_chandelier.png', 'gold', 'emerald')
create_transparent_earring_asset('earring_diamond_hoops.png', 'platinum', 'diamond')

create_transparent_tiara_asset('tiara_empress_pearl.png')
print("All transparent photorealistic overlays created successfully!")
