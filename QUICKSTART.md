# 🎮 Quick Start Guide

## Play the Game (Right Now!)

### Online
Visit: `https://YOUR_USERNAME.github.io/stick-viltrumite-arena`

### Local
```bash
# Python 3
python3 -m http.server 8000

# Or Python 2
python -m SimpleHTTPServer 8000

# Then open: http://localhost:8000
```

---

## Game Controls

| Input | Action |
|-------|--------|
| **W** | Move Forward |
| **A** | Strafe Left |
| **S** | Move Backward |
| **D** | Strafe Right |
| **Left Click** | Punch/Attack |
| **Q-I** | Abilities 1-8 |

### Camera
- Automatic 3rd-person orbit around player
- Zooms in during intense combat

---

## Game Flow

### 1️⃣ Campaign (Story Mode)
```
Start → Fight Weak Enemies → Collect Abilities → 20 Kills → Boss Fight
                                                              ↓
                                                         Fight Thragg
                                                              ↓
                                                        Victory → Unlock Endless
```

### 2️⃣ Endless Mode (High Score)
```
Spawn in Arena → Waves of Enemies → Each Wave Harder → Survive as Long as Possible
```

---

## Core Mechanics

### Punching
- **Weak**: Basic melee, 3-8 damage
- **Range**: ~5 meters
- **Cooldown**: 0.3 seconds
- **Knockback**: Physical impulse physics

### Abilities (Unlocked by killing enemies)
```
Ragdoll Slap (Q)       → 35 DMG, massive knockback
Viltrumite Spear (W)   → 50 DMG, piercing damage
Omni Knee Strike (E)   → 40 DMG, upward launch
Belly Slam (R)         → 45 DMG, AoE ground pound
Serious Punch (T)      → 60 DMG, one-shot weak
Lethal Whirlwind (Y)   → 55 DMG, multi-hit spin
Ignition Burst (U)     → 50 DMG, explosive burst
Doom Dive (I)          → 70 DMG, aerial bomb
```

### Ragdoll Physics
- Bodies have 6 limbs (head, torso, 2 arms, 2 legs)
- Connected by ball-socket joints
- High-damage hits detach limbs
- Bodies slide realistically on arena floor

---

## Boss Fight: Thragg

### Stats
- **HP**: 500 (vs Player's 100)
- **Size**: 2.5x normal
- **Damage**: 8-12 per punch

### Phases
```
Phase 1 (100-60% HP)  → Normal agro, moderate speed
Phase 2 (60-30% HP)   → Enraged, faster attacks, harder hits
Phase 3 (30-0% HP)    → Desperate, constant attacks
```

### Strategy
1. Use high-damage abilities (Serious Punch, Doom Dive)
2. Kite around arena to avoid close combat
3. Let impulse knockback create distance
4. Watch health bar to anticipate phase changes

---

## Technical Stack

### CDN Libraries (No Installation Needed!)
- **Three.js**: 3D graphics (`cdnjs.cloudflare.com`)
- **Cannon.js**: Physics (`cdn.jsdelivr.net`)
- **Tween.js**: Animations (`cdnjs.cloudflare.com`)

### Custom Code (100% Vanilla JS)
- `config.js` - Constants & ability specs
- `physics-body.js` - Ragdoll limbs & constraints
- `stick-figure.js` - Character class
- `particle-system.js` - Blood, explosions, effects
- `abilities.js` - Ability execution
- `game-engine.js` - Main loop & game state

---

## File Checklist

For the game to work, ensure these files are in the root directory:

```
✅ index.html              (Main entry point)
✅ config.js               (All constants & ability specs)
✅ physics-body.js         (Physics simulation)
✅ stick-figure.js         (Character class)
✅ particle-system.js      (Visual effects)
✅ abilities.js            (Ability system)
✅ game-engine.js          (Game logic)
```

**Missing any file?** Game won't start - check browser console (F12)!

---

## Customization

### Change Colors
Edit `config.js`, `COLORS` object:
```javascript
const COLORS = {
    player: 0x00ff88,      // Change to 0xFF0000 for red
    enemy: 0xff006e,
    boss: 0xff0000,
    blood: 0xff0000,
    // ... etc
};
```

### Adjust Difficulty
```javascript
const CONFIG = {
    PLAYER_HP: 100,              // Increase for easier
    ENEMY_BASE_HP: 20,           // Decrease for easier
    THRAGG_HP: 500,              // Decrease for easier
    // ...
};
```

### Add New Abilities
Edit `config.js`, `ABILITY_SPECS`:
```javascript
'My Custom Ability': {
    name: 'My Custom Ability',
    damage: 75,
    cooldown: 1000,
    range: 12,
    impulse: 35,
    key: 'p'
}
```

---

## Debugging

### Open Console
- **Chrome/Edge**: Press `F12`
- **Firefox**: Press `F12`

### Common Errors
```
Error: "Cannot read property 'createMeshes' of undefined"
→ Make sure physics-body.js loaded

Error: "THREE is not defined"
→ CDN didn't load, check internet connection

Error: "Config is not defined"
→ config.js is missing or not in root
```

### Performance Issues
```
FPS < 30
→ Disable particles in particle-system.js
→ Reduce max enemies in config.js
→ Use Chrome instead of Firefox
```

---

## Performance Targets

| Metric | Target |
|--------|--------|
| Initial Load | <10 seconds (CDN load) |
| Cached Load | <1 second |
| FPS | 60 FPS (desktop), 30+ FPS (mobile) |
| Physics Update | 60 Hz |
| Max Entities | 20 (player + enemies + boss + particles) |

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Game won't load | Check console (F12) for errors, check internet |
| Lag/stuttering | Reduce particle count, close other tabs |
| No sound (future) | Browser might have audio disabled |
| Mobile controls | Currently keyboard-only, touch planned |

---

## Next Steps

1. **Play the game!** Beat the campaign
2. **Unlock Endless Mode** by defeating Thragg
3. **Customize** colors, difficulty, abilities
4. **Deploy** to GitHub Pages (see DEPLOYMENT.md)
5. **Share** your repo with friends!

---

## Getting Help

- **Three.js**: https://threejs.org/docs
- **Cannon.js**: https://www.cannonjs.org/docs
- **Game Logic**: Check `game-engine.js` comments
- **Physics**: Check `physics-body.js` comments

---

**Have fun! 🎮⚔️💥**

Enjoy the visceral combat and watch limbs fly! Feel free to fork, modify, and improve!
