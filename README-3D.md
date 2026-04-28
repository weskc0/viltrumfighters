# ⚔️ Stick Viltrumite Arena - 3D Physics Edition

A brutal 3D stick figure fighting game with ragdoll physics, destructible limbs, and visceral combat inspired by *Invincible* and *Roblox Strongest Battlegrounds*.

## 🎮 **Features**

### 3D Physics & Ragdolls
- **Cannon.js Physics**: Realistic body simulation with ball-socket joints
- **Limb Detachment**: Bodies explode into flying limbs on high-damage hits
- **Blood & Gore**: Particle systems for blood splatters and gibs
- **Screen Shake**: Dynamic camera feedback on impacts

### Gameplay Modes
- **Campaign**: 20 enemy kills → Boss fight vs Thragg
- **Boss Fight**: 3-phase Thragg boss with scaling difficulty
- **Endless Mode**: Infinite waves with increasing challenge (unlocked after boss)

### Combat System
- **Basic Punches**: 3-8 damage with realistic knockback
- **8 Unlockable Abilities**: Each with unique damage, range, and impulse
- **Ability Progression**: Random drops from defeated enemies
- **Smart Targeting**: Automatic lock-on to nearest enemy

### Visual Effects
- **Three.js Rendering**: 3D scenes with dynamic lighting
- **Particle Effects**: Explosions, blood, and debris
- **Smooth Animations**: Body ragdoll and limb physics
- **Neon Aesthetic**: Cyberpunk color scheme with glow effects

## 🕹️ **Controls**

| Action | Key |
|--------|-----|
| Move Forward | `W` |
| Move Backward | `S` |
| Strafe Left | `A` |
| Strafe Right | `D` |
| Punch / Attack | `Left Mouse Button` |
| Ability 1 | `Q` |
| Ability 2 | `W` |
| Ability 3 | `E` |
| Ability 4 | `R` |
| Ability 5 | `T` |
| Ability 6 | `Y` |
| Ability 7 | `U` |
| Ability 8 | `I` |

**Camera**: Third-person orbit following player automatically

## 🚀 **Quick Start**

### Play Online (GitHub Pages)
1. Visit: `https://[your-username].github.io/stick-viltrumite-arena`
2. Click "FIGHT" to start campaign
3. Defeat 20 enemies to face Thragg

### Local Development
```bash
# Clone the repo
git clone https://github.com/[your-username]/stick-viltrumite-arena.git
cd stick-viltrumite-arena

# Start a local server (Python)
python3 -m http.server 8000

# Open http://localhost:8000 in your browser
```

## 📦 **File Structure**

```
stick-viltrumite-arena/
├── 3d-index.html          # Main HTML with Three.js setup
├── config.js              # Game configuration & ability specs
├── physics-body.js        # Cannon.js physics system
├── stick-figure.js        # Character class with animations
├── particle-system.js     # Blood, explosions, gore effects
├── abilities.js           # Ability system
├── game-engine.js         # Main game loop
├── README.md              # This file
└── .github/
    └── workflows/
        └── deploy.yml     # Auto-deploy to GitHub Pages
```

## 🌐 **Deploy to GitHub Pages**

### Step 1: Create Repository
```bash
git init
git add .
git commit -m "Initial commit: Stick Viltrumite Arena 3D"
git branch -M main
git remote add origin https://github.com/[username]/stick-viltrumite-arena.git
git push -u origin main
```

### Step 2: Enable GitHub Pages
1. Go to Settings → Pages
2. Select `main` branch as source
3. Save

### Step 3: Rename HTML (if needed)
For GitHub Pages to work properly, ensure the main file is `index.html`:
```bash
mv 3d-index.html index.html
```

The game will be live at `https://[username].github.io/stick-viltrumite-arena`

## 🎯 **Game Progression**

### Campaign (20 Kills)
1. Start in arena with weak punch (3-8 damage)
2. Enemies spawn from borders
3. Defeat enemies to unlock random abilities
4. Each kill increases difficulty slightly
5. At 20 kills, Thragg spawns for final boss fight

### Boss Fight - Thragg
- **HP**: 500
- **Size**: 2.5x player scale
- **Phases**:
  - **Phase 1** (100-60% HP): Normal aggression, moderate speed
  - **Phase 2** (60-30% HP): Enraged (faster, harder hits)
  - **Phase 3** (30-0% HP): Desperate (constant attacks)

### Endless Mode (Post-Boss)
- Wave-based enemy spawning
- Enemy health scales per wave
- No end condition
- Score tracking
- Compete for high scores

## 💪 **Unlockable Abilities**

| Ability | Damage | Cooldown | Effect |
|---------|--------|----------|--------|
| Ragdoll Slap | 35 | 0.6s | Massive knockback |
| Viltrumite Spear | 50 | 0.8s | Piercing thrust |
| Knee Strike | 40 | 0.7s | Upward launch |
| Belly Slam | 45 | 0.9s | AoE ground pound |
| Serious Punch | 60 | 1.0s | One-shot weak foes |
| Whirlwind | 55 | 0.85s | Multi-hit spin |
| Ignition Burst | 50 | 0.75s | Explosive burst |
| Doom Dive | 70 | 1.2s | Aerial bomb |

## 🛠️ **Tech Stack**

- **Three.js**: 3D graphics and rendering
- **Cannon.js**: Physics simulation and constraints
- **TWEEN.js**: Animation tweening
- **Vanilla JavaScript**: No build tools required
- **HTML5 Canvas**: Rendering target

## 📊 **Performance**

- **Target FPS**: 60 FPS on desktop
- **Mobile**: Optimized for mid-range devices
- **Physics Updates**: 60 Hz
- **Max Entities**: 20 (player + enemies + boss + particles)

## 🐛 **Known Issues**

- Mobile controls not yet implemented
- Ragdoll limbs can occasionally clip through walls
- Endless mode may lag with 50+ particles

## 🔮 **Future Features**

- [ ] Mobile touch controls
- [ ] Sound effects and music
- [ ] More boss encounters
- [ ] Co-op multiplayer
- [ ] Custom ability selection
- [ ] Leaderboard system
- [ ] VR support

## 📝 **Credits**

Inspired by:
- *Invincible* (Viltrumite combat style)
- *Roblox Strongest Battlegrounds* (ragdoll mechanics)
- *Blood Drive* (gore system)

## 📄 **License**

MIT License - Feel free to fork, modify, and distribute!

## 🤝 **Contributing**

Pull requests welcome! Please follow the existing code style.

---

**Play Now**: [Live Demo](https://[username].github.io/stick-viltrumite-arena)

**Watch Gameplay**: See limbs fly as you unleash devastating abilities! 🥊💥
