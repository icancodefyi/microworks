#!/usr/bin/env python3
"""
Microworks - Animated Product Demo Video Generator
Generates a 1280x720 30FPS MP4 video with synced voiceover, arcade sound effects,
and synthesized electronic soundtrack showcasing the Microworks Monad Arcade.
"""

import os
import sys
import math
import subprocess
import wave
import struct
import numpy as np
from PIL import Image, ImageDraw, ImageFont

# Dimensions & Framerate
WIDTH = 1280
HEIGHT = 720
FPS = 30
DURATION_SEC = 28
TOTAL_FRAMES = DURATION_SEC * FPS

FFMPEG_BIN = "/Users/zaidrakhange/Library/Python/3.14/lib/python/site-packages/imageio_ffmpeg/binaries/ffmpeg-macos-aarch64-v7.1"
OUTPUT_DIR = "/tmp/microworks_video"
OUTPUT_VIDEO = "/Users/zaidrakhange/Developer/web3/microworks/public/microworks-demo.mp4"

os.makedirs(OUTPUT_DIR, exist_ok=True)
os.makedirs("/Users/zaidrakhange/Developer/web3/microworks/public", exist_ok=True)

# Colors
C_BG = (12, 13, 18)
C_CARD = (22, 25, 35)
C_CARD_BORDER = (45, 50, 70)
C_BLUE = (41, 119, 255)       # #2977ff Electric Blue
C_EMERALD = (16, 185, 129)    # Emerald green
C_AMBER = (245, 158, 11)      # Gold / Amber
C_ROSE = (239, 68, 68)        # Rose / Miss
C_WHITE = (255, 255, 255)
C_MUTED = (148, 163, 184)
C_DARK_TEXT = (203, 213, 225)

# Fonts
FONT_TITLE = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"
FONT_TEXT = "/System/Library/Fonts/Supplemental/Arial.ttf"
FONT_MONO = "/System/Library/Fonts/Menlo.ttc"

def get_font(path, size):
    try:
        return ImageFont.truetype(path, size)
    except:
        return ImageFont.load_default()

font_h1 = get_font(FONT_TITLE, 44)
font_h2 = get_font(FONT_TITLE, 28)
font_h3 = get_font(FONT_TITLE, 20)
font_body = get_font(FONT_TEXT, 17)
font_caption = get_font(FONT_TEXT, 14)
font_mono_lg = get_font(FONT_MONO, 22)
font_mono_md = get_font(FONT_MONO, 16)
font_mono_sm = get_font(FONT_MONO, 13)

# -------------------------------------------------------------
# 1. AUDIO SYNTHESIS & VOICEOVER
# -------------------------------------------------------------

def generate_voiceovers():
    """Generate crystal clear speech files using macOS say."""
    print("Generating voiceovers...")
    scripts = [
        (0.5, "Welcome to Microworks. High speed micro-tasking, powered by Monad parallel execution.", "sc1.aiff"),
        (6.5, "Creators deploy tasks with escrowed bounty vaults and on-chain golden keys.", "sc2.aiff"),
        (12.5, "Workers solve micro-tasks on mobile. Tap your answer, and get paid instantly in 1.2 seconds.", "sc3.aiff"),
        (20.5, "Stack daily streaks, unlock achievement badges, and climb the Top Run leaderboard.", "sc4.aiff"),
        (25.0, "Microworks on Monad. Micro-tasks. Instant payouts. On-chain.", "sc5.aiff"),
    ]
    
    voice_files = []
    for start_t, text, fname in scripts:
        out_path = os.path.join(OUTPUT_DIR, fname)
        subprocess.run(["say", "-v", "Samantha", "-r", "175", text, "-o", out_path], check=True)
        voice_files.append((start_t, out_path))
    return voice_files

def generate_arcade_audio():
    """Generate 28-second electronic game soundtrack with sfx."""
    print("Synthesizing arcade soundtrack & SFX...")
    sr = 44100
    n_samples = int(DURATION_SEC * sr)
    audio = np.zeros(n_samples, dtype=np.float32)
    
    # 1. Ambient bassline & electronic pulse
    t = np.linspace(0, DURATION_SEC, n_samples, endpoint=False)
    # 125 BPM groove (0.48s per beat)
    beat_period = 60.0 / 128.0
    
    # Bass synth notes
    bass_freqs = [65.4, 65.4, 77.8, 87.3, 65.4, 98.0, 87.3, 77.8]
    for i in range(int(DURATION_SEC / beat_period)):
        start_idx = int(i * beat_period * sr)
        freq = bass_freqs[i % len(bass_freqs)]
        dur = int(beat_period * 0.8 * sr)
        if start_idx + dur < n_samples:
            sub_t = np.linspace(0, beat_period * 0.8, dur, endpoint=False)
            env = np.exp(-sub_t * 5.0)
            note = (np.sin(2 * np.pi * freq * sub_t) + 0.5 * np.sin(2 * np.pi * freq * 2 * sub_t)) * env * 0.14
            audio[start_idx:start_idx+dur] += note
            
        # Kick drum on beats 0, 2 and snare on beats 1, 3
        if i % 2 == 0:
            k_dur = int(0.12 * sr)
            if start_idx + k_dur < n_samples:
                k_t = np.linspace(0, 0.12, k_dur, endpoint=False)
                k_freq = 150.0 * np.exp(-k_t * 25.0)
                kick = np.sin(2 * np.pi * k_freq * k_t) * np.exp(-k_t * 20.0) * 0.20
                audio[start_idx:start_idx+k_dur] += kick
        else:
            s_dur = int(0.10 * sr)
            if start_idx + s_dur < n_samples:
                noise = np.random.uniform(-0.10, 0.10, s_dur) * np.exp(-np.linspace(0, 5, s_dur))
                audio[start_idx:start_idx+s_dur] += noise
                
        # High hat ticks
        for hh_offset in [0, 0.5]:
            hh_idx = int((i + hh_offset) * beat_period * sr)
            hh_dur = int(0.04 * sr)
            if hh_idx + hh_dur < n_samples:
                audio[hh_idx:hh_idx+hh_dur] += np.random.uniform(-0.04, 0.04, hh_dur)

    # 2. Add SFX at key visual moments
    def add_sfx_tone(time_sec, freqs, duration=0.3, volume=0.25):
        s_idx = int(time_sec * sr)
        d_len = int(duration * sr)
        if s_idx + d_len >= n_samples:
            return
        s_t = np.linspace(0, duration, d_len, endpoint=False)
        sig = np.zeros(d_len, dtype=np.float32)
        for f in freqs:
            sig += np.sin(2 * np.pi * f * s_t)
        sig = (sig / len(freqs)) * np.exp(-s_t * (4.0 / duration)) * volume
        audio[s_idx:s_idx+d_len] += sig

    # SFX 1: Deploy Task click & chime (t = 10.2s)
    add_sfx_tone(10.2, [523.25, 659.25], 0.2, 0.25)
    # SFX 2: Mobile Button Tap (t = 15.8s)
    add_sfx_tone(15.8, [350], 0.06, 0.3)
    # SFX 3: Golden key verify whoosh (t = 16.8s)
    add_sfx_tone(16.8, [880, 1174.66], 0.35, 0.3)
    # SFX 4: Coin collect chime! (t = 17.2s)
    add_sfx_tone(17.2, [987.77, 1318.51], 0.45, 0.4)
    # SFX 5: Combo x3 fanfare (t = 18.8s)
    add_sfx_tone(18.8, [523.25, 659.25, 783.99, 1046.50], 0.55, 0.35)
    # SFX 6: Leaderboard level up (t = 23.5s)
    add_sfx_tone(23.5, [587.33, 739.99, 880.0, 1174.66], 0.6, 0.35)

    # Normalize & clip
    audio = np.clip(audio, -0.95, 0.95)
    audio_int16 = (audio * 32767).astype(np.int16)
    
    music_wav = os.path.join(OUTPUT_DIR, "music_sfx.wav")
    with wave.open(music_wav, "wb") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(sr)
        wf.writeframes(audio_int16.tobytes())
        
    return music_wav

def assemble_master_audio(music_wav, voice_files):
    """Mix background music and voice tracks using ffmpeg."""
    print("Mixing master audio track with voiceovers...")
    master_wav = os.path.join(OUTPUT_DIR, "master_audio.wav")
    
    inputs = ["-i", music_wav]
    filter_complex = []
    
    for i, (start_t, v_path) in enumerate(voice_files):
        inputs.extend(["-i", v_path])
        delay_ms = int(start_t * 1000)
        filter_complex.append(f"[{i+1}:a]adelay={delay_ms}|{delay_ms}[v{i}];")
        
    amix_inputs = "[0:a]" + "".join(f"[v{i}]" for i in range(len(voice_files)))
    filter_complex.append(f"{amix_inputs}amix=inputs={len(voice_files)+1}:duration=first:dropout_transition=2[outa]")
    
    cmd = [
        FFMPEG_BIN, "-y",
        *inputs,
        "-filter_complex", "".join(filter_complex),
        "-map", "[outa]",
        "-ac", "2",
        "-ar", "44100",
        master_wav
    ]
    subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    return master_wav

# -------------------------------------------------------------
# 2. VIDEO SCENE DRAWING HELPERS
# -------------------------------------------------------------

def draw_rounded_rect(draw, bbox, radius, fill=None, outline=None, width=1):
    draw.rounded_rectangle(bbox, radius=radius, fill=fill, outline=outline, width=width)

def draw_arcade_bg(draw, frame_idx):
    """Draw futuristic dark grid background with gentle scrolling grid lines."""
    # Dark base
    draw.rectangle([0, 0, WIDTH, HEIGHT], fill=C_BG)
    
    # Animated subtle grid
    grid_size = 48
    offset_y = (frame_idx * 1.5) % grid_size
    grid_color = (24, 28, 42)
    
    for x in range(0, WIDTH, grid_size):
        draw.line([(x, 0), (x, HEIGHT)], fill=grid_color, width=1)
    for y in range(int(offset_y) - grid_size, HEIGHT + grid_size, grid_size):
        draw.line([(0, y), (WIDTH, y)], fill=grid_color, width=1)
        
    # Vignette glow
    draw.ellipse([WIDTH//2 - 400, -200, WIDTH//2 + 400, 300], fill=(20, 45, 90, 40))

def draw_top_hud(draw, title="MONAD TESTNET · ARCADE ENGINE"):
    # Header bar
    draw_rounded_rect(draw, [40, 24, WIDTH - 40, 72], radius=16, fill=(18, 20, 28), outline=(36, 42, 60), width=1)
    
    # Logo & Monad badge
    draw_rounded_rect(draw, [56, 36, 84, 60], radius=8, fill=C_BLUE)
    draw.text((64, 38), "⚡", font=font_mono_md, fill=C_WHITE)
    draw.text((96, 40), "MICROWORKS", font=font_h3, fill=C_WHITE)
    draw.text((250, 43), "|", font=font_mono_md, fill=(80, 90, 110))
    draw.text((270, 42), title, font=font_mono_sm, fill=C_MUTED)
    
    # Live Monad speed pill
    draw_rounded_rect(draw, [WIDTH - 310, 34, WIDTH - 56, 62], radius=20, fill=(10, 40, 25), outline=(20, 90, 50), width=1)
    draw.ellipse([WIDTH - 296, 44, WIDTH - 286, 54], fill=C_EMERALD)
    draw.text((WIDTH - 276, 41), "1.2s FINALITY · 10,000 TPS", font=font_mono_sm, fill=C_EMERALD)

def draw_caption_banner(draw, text):
    """Draw bottom caption subtitle."""
    draw_rounded_rect(draw, [140, HEIGHT - 76, WIDTH - 140, HEIGHT - 24], radius=14, fill=(15, 18, 26, 230), outline=(50, 60, 85), width=1)
    bbox = font_body.getbbox(text)
    w = bbox[2] - bbox[0]
    draw.text(((WIDTH - w) // 2, HEIGHT - 64), text, font=font_body, fill=C_WHITE)

# -------------------------------------------------------------
# 3. SCENE RENDERING
# -------------------------------------------------------------

def render_scene_1(draw, f_rel, t_rel):
    """Scene 1: Introduction to Microworks on Monad (0s - 6s)"""
    draw_top_hud(draw, "HIGH-SPEED PARALLEL EVM")
    
    # Main hero card
    alpha_scale = min(1.0, f_rel / 20.0)
    card_top = int(120 + (1.0 - alpha_scale) * 40)
    draw_rounded_rect(draw, [160, card_top, WIDTH - 160, 580], radius=24, fill=C_CARD, outline=C_CARD_BORDER, width=2)
    
    # Glowing Badge
    draw_rounded_rect(draw, [195, card_top + 35, 430, card_top + 68], radius=10, fill=(25, 45, 90), outline=C_BLUE, width=1)
    draw.text((210, card_top + 42), "⚡ MONAD BLITZ HACKATHON", font=font_mono_sm, fill=C_BLUE)
    
    # Main Title
    draw.text((195, card_top + 90), "HUMAN LABELLING AT 10,000 TPS.", font=font_h1, fill=C_WHITE)
    draw.text((195, card_top + 155), "Decentralised micro-task marketplace with sub-second parallel finality.", font=font_body, fill=C_MUTED)
    draw.text((195, card_top + 185), "Graded automatically on-chain against cryptographic golden keys.", font=font_body, fill=C_MUTED)
    
    # 3 Stat Boxes
    box_y = card_top + 250
    stat_items = [
        ("BLOCK FINALITY", "1.2s", "Parallel execution", C_EMERALD),
        ("THROUGHPUT", "10,000 TPS", "High frequency labels", C_BLUE),
        ("VERIFICATION", "Golden Key", "Instant hash grading", C_AMBER),
    ]
    
    for i, (label, val, sub, col) in enumerate(stat_items):
        bx = 195 + i * 295
        draw_rounded_rect(draw, [bx, box_y, bx + 270, box_y + 130], radius=18, fill=(16, 18, 26), outline=(40, 48, 68), width=1)
        draw.text((bx + 20, box_y + 18), label, font=font_mono_sm, fill=C_MUTED)
        draw.text((bx + 20, box_y + 45), val, font=font_h2, fill=col)
        draw.text((bx + 20, box_y + 90), sub, font=font_caption, fill=C_DARK_TEXT)
        
    draw_caption_banner(draw, "Traditional task platforms have slow payouts and middlemen. Microworks is instant on Monad.")

def render_scene_2(draw, f_rel, t_rel):
    """Scene 2: Creator Escrows Bounty & Deploys Quest (6s - 12s)"""
    draw_top_hud(draw, "CREATOR STUDIO · DEPLOYMENT")
    
    # Creator Modal Window
    draw_rounded_rect(draw, [200, 110, WIDTH - 200, 590], radius=24, fill=C_CARD, outline=C_CARD_BORDER, width=2)
    
    # Chrome Bar
    draw_rounded_rect(draw, [200, 110, WIDTH - 200, 155], radius=24, fill=(18, 20, 28))
    draw.rectangle([200, 140, WIDTH - 200, 155], fill=(18, 20, 28))
    draw.line([(200, 155), (WIDTH - 200, 155)], fill=(40, 46, 64), width=1)
    
    # Window buttons
    draw.ellipse([225, 128, 237, 140], fill=C_ROSE)
    draw.ellipse([245, 128, 257, 140], fill=C_AMBER)
    draw.ellipse([265, 128, 277, 140], fill=C_EMERALD)
    draw.text((295, 125), "microworks://deploy-task-vault", font=font_mono_sm, fill=C_MUTED)
    
    # Content
    draw.text((230, 180), "Deploy Micro-Task & Escrow Bounty", font=font_h2, fill=C_WHITE)
    draw.text((230, 220), "Smart contract locks golden key hashes and escrows MON reward pool.", font=font_caption, fill=C_MUTED)
    
    # Form Input 1: Title
    draw_rounded_rect(draw, [230, 255, WIDTH - 230, 310], radius=12, fill=(16, 18, 26), outline=C_BLUE if t_rel > 1.5 else (40, 48, 68), width=1)
    draw.text((245, 272), "Quest Title: Label 30 Dashcam Autonomous Driving Frames", font=font_mono_md, fill=C_WHITE)
    
    # Form Input 2: Escrow Bounty
    draw_rounded_rect(draw, [230, 330, 580, 395], radius=12, fill=(16, 18, 26), outline=(40, 48, 68), width=1)
    draw.text((245, 342), "Escrow Pool: 10.000 MON", font=font_mono_md, fill=C_AMBER)
    draw.text((245, 368), "30 Frames · 0.333 MON / Frame", font=font_caption, fill=C_MUTED)
    
    # Form Input 3: Golden Key Hashes
    draw_rounded_rect(draw, [610, 330, WIDTH - 230, 395], radius=12, fill=(16, 18, 26), outline=(40, 48, 68), width=1)
    draw.text((625, 342), "Golden Key Hash Commitments", font=font_mono_md, fill=C_EMERALD)
    draw.text((625, 368), "SHA-256 Verified On-Chain: 0x7f2a89...c4b2", font=font_mono_sm, fill=C_MUTED)
    
    # Deploy Button (Clicks around t_rel = 4.2s)
    is_clicked = t_rel > 4.2
    btn_y = 440 + (4 if is_clicked else 0)
    btn_col = C_EMERALD if is_clicked else C_BLUE
    draw_rounded_rect(draw, [230, btn_y, WIDTH - 230, btn_y + 55], radius=16, fill=btn_col)
    
    btn_label = "✓ BOUNTY VAULT DEPLOYED ON MONAD TESTNET (TX: 0x9b4e...2a1f)" if is_clicked else "DEPLOY TASK & ESCROW 10.000 MON [ ▶ ]"
    draw.text((360 if is_clicked else 430, btn_y + 16), btn_label, font=font_h3, fill=C_WHITE)
    
    # Confirmed pill
    if is_clicked:
        draw_rounded_rect(draw, [420, 520, 860, 560], radius=12, fill=(15, 45, 30), outline=C_EMERALD, width=1)
        draw.text((450, 530), "⚡ Monad Parallel Consensus Finalized in 1.18s", font=font_mono_sm, fill=C_EMERALD)
        
    draw_caption_banner(draw, "Creators lock tasks with golden keys. Smart contract handles instant automated payouts.")

def render_scene_3(draw, f_rel, t_rel):
    """Scene 3: Subway Surfers Mobile Arcade Runner (Worker View) (12s - 20s)"""
    draw_top_hud(draw, "WORKER MODE · SUBWAY SURFERS ARCADE")
    
    # Left Side: Explanation & Live Stats
    draw.text((80, 130), "SUBWAY SURFERS ARCADE UI", font=font_h1, fill=C_WHITE)
    draw.text((80, 185), "Chunky pushable thumb pads engineered for daily mobile grinding.", font=font_body, fill=C_MUTED)
    draw.text((80, 215), "Instant consensus feedback with zero lag.", font=font_body, fill=C_MUTED)
    
    # Left Live XP & Combo cards
    draw_rounded_rect(draw, [80, 270, 360, 360], radius=18, fill=C_CARD, outline=C_CARD_BORDER, width=1)
    draw.text((100, 288), "TOTAL SCORE", font=font_mono_sm, fill=C_MUTED)
    score_val = 850 + (100 if t_rel > 5.0 else 0)
    draw.text((100, 312), f"{score_val} XP", font=font_h2, fill=C_BLUE)
    
    draw_rounded_rect(draw, [80, 380, 360, 470], radius=18, fill=C_CARD, outline=C_CARD_BORDER, width=1)
    draw.text((100, 398), "COMBO MULTIPLIER", font=font_mono_sm, fill=C_MUTED)
    combo_str = "x3 COMBO!" if t_rel > 6.5 else ("x2 STREAK" if t_rel > 5.0 else "x1")
    draw.text((100, 422), f"🔥 {combo_str}", font=font_h2, fill=C_ROSE if t_rel > 5.0 else C_AMBER)
    
    # Daily check pill
    draw_rounded_rect(draw, [80, 490, 360, 560], radius=16, fill=(20, 35, 25), outline=C_EMERALD, width=1)
    draw.text((100, 515), "🪙 +0.05 MON Credited Instantly", font=font_mono_sm, fill=C_EMERALD)
    
    # Right Side: Realistic Mobile Phone Mockup (Subway Surfers Runner)
    phone_x = 440
    phone_y = 110
    phone_w = 400
    phone_h = 580
    
    # Phone Body with Bevel
    draw_rounded_rect(draw, [phone_x, phone_y, phone_x + phone_w, phone_y + phone_h], radius=36, fill=(18, 20, 26), outline=(70, 80, 110), width=3)
    
    # Screen inner
    draw_rounded_rect(draw, [phone_x + 12, phone_y + 12, phone_x + phone_w - 12, phone_y + phone_h - 12], radius=26, fill=(245, 245, 240))
    
    # Phone Header Strip
    draw_rounded_rect(draw, [phone_x + 12, phone_y + 12, phone_x + phone_w - 12, phone_y + 55], radius=24, fill=(235, 235, 230))
    draw.rectangle([phone_x + 12, phone_y + 40, phone_x + phone_w - 12, phone_y + 55], fill=(235, 235, 230))
    draw.text((phone_x + 25, phone_y + 25), "STAGE 1 OF 30", font=font_mono_sm, fill=(50, 50, 50))
    draw_rounded_rect(draw, [phone_x + phone_w - 130, phone_y + 22, phone_x + phone_w - 25, phone_y + 46], radius=8, fill=(255, 238, 200), outline=(220, 170, 60), width=1)
    draw.text((phone_x + phone_w - 120, phone_y + 27), "🪙 +0.05 MON", font=font_mono_sm, fill=(160, 90, 10))
    
    # Task Image Viewport (Dashcam visual)
    draw_rounded_rect(draw, [phone_x + 25, phone_y + 70, phone_x + phone_w - 25, phone_y + 240], radius=16, fill=(25, 28, 35))
    draw.text((phone_x + 40, phone_y + 85), "FRAME #1 · DASHCAM SCAN", font=font_mono_sm, fill=C_MUTED)
    
    # Simulated vehicle bounding box
    draw.rectangle([phone_x + 90, phone_y + 120, phone_x + 230, phone_y + 200], outline=C_BLUE, width=2)
    draw.text((phone_x + 95, phone_y + 102), "VEHICLE DETECTED", font=font_mono_sm, fill=C_BLUE)
    
    # Question prompt
    draw.text((phone_x + 25, phone_y + 255), "Is there a vehicle in lane 2?", font=font_h3, fill=(20, 20, 20))
    
    # Giant Pushable Thumb Pads (Subway Surfers Style)
    is_tapped = t_rel > 3.8
    yes_btn_y = (phone_y + 310) + (4 if is_tapped else 0)
    
    # YES BUTTON (Green 3D pushable)
    draw_rounded_rect(draw, [phone_x + 25, yes_btn_y, phone_x + 190, yes_btn_y + 65], radius=16, fill=(16, 185, 129), outline=(10, 130, 90), width=2)
    draw.text((phone_x + 65, yes_btn_y + 20), "YES ✓", font=font_h3, fill=C_WHITE)
    
    # NO BUTTON (Red 3D pushable)
    draw_rounded_rect(draw, [phone_x + 210, phone_y + 310, phone_x + phone_w - 25, phone_y + 375], radius=16, fill=(239, 68, 68), outline=(170, 40, 40), width=2)
    draw.text((phone_x + 255, phone_y + 330), "NO ✕", font=font_h3, fill=C_WHITE)
    
    # Triumphant Outcome Splash (t_rel > 4.8s)
    if t_rel > 4.8:
        splash_y = phone_y + 395
        draw_rounded_rect(draw, [phone_x + 25, splash_y, phone_x + phone_w - 25, splash_y + 130], radius=18, fill=(236, 253, 245), outline=C_EMERALD, width=2)
        draw.text((phone_x + 40, splash_y + 15), "⭐ PERFECT HIT! +100 XP", font=font_h3, fill=(6, 95, 70))
        draw.text((phone_x + 40, splash_y + 48), "🪙 +0.05 MON Credited to Wallet", font=font_mono_sm, fill=(6, 95, 70))
        draw.text((phone_x + 40, splash_y + 75), "⚡ Consensus verified in 1.19s", font=font_mono_sm, fill=(16, 140, 90))
        
        # Next button
        draw_rounded_rect(draw, [phone_x + 40, splash_y + 98, phone_x + phone_w - 40, splash_y + 122], radius=8, fill=C_BLUE)
        draw.text((phone_x + 95, splash_y + 102), "NEXT STAGE (FRAME 2) ▶", font=font_mono_sm, fill=C_WHITE)
        
    # Floating Phone Bottom Dock
    dock_y = phone_y + phone_h - 45
    draw.line([(phone_x + 12, dock_y), (phone_x + phone_w - 12, dock_y)], fill=(220, 220, 220), width=1)
    draw.text((phone_x + 40, dock_y + 10), "🎯 Quests", font=font_mono_sm, fill=(100, 100, 100))
    draw.text((phone_x + 155, dock_y + 10), "⚡ Play", font=font_mono_sm, fill=C_BLUE)
    draw.text((phone_x + 260, dock_y + 10), "🏆 Rank", font=font_mono_sm, fill=(100, 100, 100))
    
    draw_caption_banner(draw, "Tap your answer on mobile. Answers grade against on-chain golden keys in 1.2s.")

def render_scene_4(draw, f_rel, t_rel):
    """Scene 4: Daily Grind 7-Day Streak & Top Run Leaderboard (20s - 25s)"""
    draw_top_hud(draw, "RETENTION · DAILY STREAK & LEADERBOARD")
    
    # 7-Day Streak Calendar Track Card
    draw_rounded_rect(draw, [100, 110, WIDTH - 100, 310], radius=24, fill=C_CARD, outline=C_CARD_BORDER, width=2)
    draw.text((130, 130), "🔥 7-DAY MONAD STREAK CALENDAR", font=font_h2, fill=C_WHITE)
    draw.text((130, 168), "Daily grind rewards. Return every 24h to unlock the Day 7 Mystery Vault.", font=font_body, fill=C_MUTED)
    
    # 7 Day Pills
    days = [
        ("Day 1", "+50 XP", True, False),
        ("Day 2", "+75 XP", True, False),
        ("Day 3", "+100 XP", True, True),  # Active flame
        ("Day 4", "+125 XP", False, False),
        ("Day 5", "+150 XP", False, False),
        ("Day 6", "+200 XP", False, False),
        ("Day 7", "+500 XP", False, False, True), # Vault
    ]
    
    for i, d in enumerate(days):
        dx = 130 + i * 145
        is_vault = len(d) > 4 and d[4]
        is_active = d[3]
        is_done = d[2]
        
        bg_col = (45, 30, 10) if is_vault else ((25, 45, 80) if is_active else ((15, 35, 25) if is_done else (16, 18, 26)))
        border_col = C_AMBER if is_vault else (C_BLUE if is_active else (C_EMERALD if is_done else (40, 48, 68)))
        
        draw_rounded_rect(draw, [dx, 200, dx + 130, 290], radius=14, fill=bg_col, outline=border_col, width=2 if (is_active or is_vault) else 1)
        draw.text((dx + 15, 212), d[0], font=font_mono_sm, fill=C_MUTED)
        icon = "🎁 VAULT" if is_vault else ("🔥 ACTIVE" if is_active else ("✓ DONE" if is_done else "🔒 LOCK"))
        draw.text((dx + 15, 235), icon, font=font_mono_sm, fill=border_col)
        draw.text((dx + 15, 260), d[1], font=font_h3, fill=C_WHITE)
        
    # Top Run Leaderboard Card
    draw_rounded_rect(draw, [100, 335, WIDTH - 100, 600], radius=24, fill=C_CARD, outline=C_CARD_BORDER, width=2)
    draw.text((130, 355), "🏆 TOP RUN · HALL OF FAME", font=font_h2, fill=C_WHITE)
    
    # Leaderboard Rows
    board_rows = [
        ("1", "0x26e6...5237 (You)", "1,250 XP", "🔥 8x COMBO", "👑 Grandmaster", C_AMBER),
        ("2", "0x89a1...10b4", "950 XP", "🔥 5x COMBO", "⭐ Master", C_DARK_TEXT),
        ("3", "0x33f2...88cc", "800 XP", "🔥 4x COMBO", "⭐ Diamond", C_DARK_TEXT),
    ]
    
    for i, (rank, addr, xp, combo, title, col) in enumerate(board_rows):
        ry = 405 + i * 58
        is_p1 = i == 0
        bg_r = (25, 35, 55) if is_p1 else (16, 18, 26)
        draw_rounded_rect(draw, [130, ry, WIDTH - 130, ry + 48], radius=12, fill=bg_r, outline=C_BLUE if is_p1 else (35, 40, 55), width=1)
        
        draw.text((150, ry + 14), rank, font=font_h3, fill=col)
        draw.text((190, ry + 15), addr, font=font_mono_md, fill=C_WHITE if is_p1 else C_DARK_TEXT)
        draw.text((490, ry + 15), xp, font=font_mono_md, fill=C_BLUE if is_p1 else C_DARK_TEXT)
        draw.text((680, ry + 15), combo, font=font_mono_sm, fill=C_ROSE)
        draw.text((880, ry + 15), title, font=font_mono_sm, fill=col)
        
    draw_caption_banner(draw, "Climb the leaderboard, stack daily grind multipliers, and earn on-chain glory.")

def render_scene_5(draw, f_rel, t_rel):
    """Scene 5: Grand Finale & Call to Action (25s - 28s)"""
    draw_top_hud(draw, "MICROWORKS · LIVE ON MONAD TESTNET")
    
    # Center Showcase Card
    draw_rounded_rect(draw, [200, 130, WIDTH - 200, 580], radius=28, fill=C_CARD, outline=C_CARD_BORDER, width=2)
    
    # Pulse logo
    draw_rounded_rect(draw, [WIDTH//2 - 45, 175, WIDTH//2 + 45, 265], radius=22, fill=C_BLUE)
    draw.text((WIDTH//2 - 18, 192), "⚡", font=font_h1, fill=C_WHITE)
    
    draw.text((WIDTH//2 - 180, 290), "MICROWORKS", font=font_h1, fill=C_WHITE)
    draw.text((WIDTH//2 - 250, 350), "Micro-tasks. Instant payouts. On-chain.", font=font_h2, fill=C_BLUE)
    draw.text((WIDTH//2 - 310, 400), "Deploy bounties or solve frames in seconds on parallel EVM.", font=font_body, fill=C_MUTED)
    
    # Contract pill
    draw_rounded_rect(draw, [WIDTH//2 - 280, 440, WIDTH//2 + 280, 478], radius=10, fill=(16, 18, 26), outline=(45, 52, 75), width=1)
    draw.text((WIDTH//2 - 260, 452), "Contract: 0x26e67271c65ac40d419dffe8d6ad7ffcb2755237", font=font_mono_sm, fill=C_MUTED)
    
    # 3D Launch Button
    btn_y = 500
    draw_rounded_rect(draw, [WIDTH//2 - 160, btn_y, WIDTH//2 + 160, btn_y + 55], radius=16, fill=C_EMERALD)
    draw.text((WIDTH//2 - 110, btn_y + 16), "LAUNCH APP NOW ▶", font=font_h3, fill=C_WHITE)
    
    draw_caption_banner(draw, "Try Microworks today on your phone or desktop. Built for Monad Blitz.")

# -------------------------------------------------------------
# 4. MAIN VIDEO RENDERING PIPELINE
# -------------------------------------------------------------

def main():
    print(f"--- Starting Microworks Animated Video Pipeline ---")
    print(f"Config: {WIDTH}x{HEIGHT} @ {FPS} FPS | Duration: {DURATION_SEC}s ({TOTAL_FRAMES} frames)")
    
    # Step A: Audio Generation
    voice_files = generate_voiceovers()
    music_wav = generate_arcade_audio()
    master_audio = assemble_master_audio(music_wav, voice_files)
    print(f"Master audio generated: {master_audio}")
    
    # Step B: Render Frames
    frames_pattern = os.path.join(OUTPUT_DIR, "frame_%05d.png")
    print(f"Rendering {TOTAL_FRAMES} video frames...")
    
    for i in range(TOTAL_FRAMES):
        t = i / float(FPS)
        img = Image.new("RGB", (WIDTH, HEIGHT), C_BG)
        draw = ImageDraw.Draw(img)
        draw_arcade_bg(draw, i)
        
        if t < 6.0:
            render_scene_1(draw, i, t)
        elif t < 12.0:
            render_scene_2(draw, i - 6 * FPS, t - 6.0)
        elif t < 20.0:
            render_scene_3(draw, i - 12 * FPS, t - 12.0)
        elif t < 25.0:
            render_scene_4(draw, i - 20 * FPS, t - 20.0)
        else:
            render_scene_5(draw, i - 25 * FPS, t - 25.0)
            
        frame_file = os.path.join(OUTPUT_DIR, f"frame_{i:05d}.png")
        img.save(frame_file, "PNG")
        
        if (i + 1) % 150 == 0 or i == TOTAL_FRAMES - 1:
            print(f"Rendered {i + 1}/{TOTAL_FRAMES} frames ({(i+1)*100//TOTAL_FRAMES}%)")
            
    # Step C: Encode Video with FFmpeg
    print("Encoding master video with FFmpeg...")
    encode_cmd = [
        FFMPEG_BIN, "-y",
        "-r", str(FPS),
        "-i", frames_pattern,
        "-i", master_audio,
        "-c:v", "libx264",
        "-pix_fmt", "yuv420p",
        "-preset", "fast",
        "-crf", "20",
        "-c:a", "aac",
        "-b:a", "192k",
        "-shortest",
        OUTPUT_VIDEO
    ]
    subprocess.run(encode_cmd, check=True)
    print(f"SUCCESS! Video written to {OUTPUT_VIDEO}")
    
    # Clean up temp frames to save disk space
    print("Cleaning temporary frame PNGs...")
    for i in range(TOTAL_FRAMES):
        try:
            os.remove(os.path.join(OUTPUT_DIR, f"frame_{i:05d}.png"))
        except:
            pass
    print("Clean up completed.")

if __name__ == "__main__":
    main()
