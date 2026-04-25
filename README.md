# 🎮 Stick Viltrumite Arena

An intense offline stick figure fighting game with ragdoll physics, boss fights, and unlockable abilities inspired by the Viltrumite Empire from *Invincible*.

## 📋 Features

### 🕹️ **Gameplay Modes**
- **Campaign Mode**: Defeat 20 enemies to face Thragg, the Viltrumite Warlord
- **Boss Fight**: Epic battle against Thragg with multiple phases and minion spawns
- **Endless Mode**: Infinite waves with scaling difficulty and score tracking

### 🎯 **Combat System**
- **Basic Combat**: Weak punches with realistic damage (1-2 HP per hit)
- **Ability Progression**: Unlock 8 unique abilities by defeating enemies
- **Ragdoll Physics**: Bodies fly realistically when hit with knockback
- **Enemy Variety**: Regular and elite enemies with different stats

### 💪 **Unlockable Abilities**
1. **Ragdoll Slap** (Q) - 35 DMG, massive knockback
2. **Viltrumite Spear Hand** (W) - 50 DMG, piercing + bleed
3. **Omni Knee Strike** (E) - 40 DMG, upward launch + stun
4. **Belly Slam** (R) - 45 DMG, AoE ground pound
5. **Serious Punch** (T) - 60 DMG, one-shot weak foes
6. **Lethal Whirlwind** (Y) - 55 DMG, multi-hit spin
7. **Ignition Burst** (U) - 50 DMG, explosive burst
8. **Doom Dive** (I) - 70 DMG, aerial bomb dive

### 🧬 **Advanced Features**
- **Smooth Animations**: Walk, jump, fall, punch, idle states with frame-by-frame animation
- **Screen Shake**: Dynamic camera feedback on major hits
- **Particle Effects**: Blood splatters and explosions for visual feedback
- **Health System**: Progressive difficulty as you level up
- **Boss Phases**: Thragg changes behavior based on remaining HP
- **Minion Spawning**: Phase 3 spawns elite enemies to support the boss

## 🎮 **Controls**

| Action | Key |
|--------|-----|
| Move Left | `←` Arrow Left |
| Move Right | `→` Arrow Right |
| Jump | `Space` |
| Ability 1 | `Q` |
| Ability 2 | `W` |
| Ability 3 | `E` |
| Ability 4 | `R` |
| Ability 5 | `T` |
| Ability 6 | `Y` |
| Ability 7 | `U` |
| Ability 8 | `I` |

## 🚀 **Getting Started**

### Installation
1. Download all files to a local folder
2. Open `index.html` in a modern web browser
3. Click "FIGHT" to start the campaign

### No Internet Required
This game runs completely offline. All assets are generated in real-time using Canvas.

## 📁 **File Structure**

```
stick-viltrumite-arena/
├── index.html           # Main HTML file
├── styles.css           # Responsive styling
├── game-config.js       # Game constants
├── player.js            # Player class with animation
├── enemy.js             # Enemy class with animation
├── boss.js              # Thragg boss class
├── particles.js         # Particle system
├── abilities.js         # Ability specifications
├── renderer.js          # Rendering system
├── game-manager.js      # Game logic & state management
└── main.js              # Entry point & input handling
```

## 🎨 **Visual Design**

- **Theme**: Cyberpunk neon (magenta borders, green accents)
- **Stick Figures**: Animated with body parts (head, torso, limbs, eyes)
- **Boss Design**: Thragg features Viltrumite mustache and crown spikes
- **Effects**: Screen shake, blood splatters, particle explosions
- **UI**: Health bars, ability slots, wave tracking

## 📊 **Game Progression**

### Campaign (20 Kills)
1. Weak punches deal 1-2 damage
2. Enemies spawn from borders at increasing difficulty
3. Defeat enemies to unlock random abilities
4. Defeat 20 enemies to unlock the boss fight

### Boss Fight
- **Thragg**: 1000 HP with three phases
  - Phase 1 (100-60% HP): Normal aggression
  - Phase 2 (60-30% HP): Enraged (red aura, double damage)
  - Phase 3 (30-0% HP): Spawns minions, aggressive dives
- Use all unlocked abilities against him
- Victory unlocks Endless Mode

### Endless Mode
- Waves of 10+ enemies with scaling difficulty
- Enemy health and damage increase per wave
- Score multiplier increases with wave number
- No end - survive as long as possible

## 🔧 **Technical Details**

- **Canvas-Based**: Pure HTML5 Canvas rendering, no external libraries
- **Responsive**: Scales to any screen size automatically
- **Keyboard-Only**: All controls via keyboard input
- **Local Storage**: Saves boss completion status
- **Frame-Based Animation**: 60 FPS smooth animations

## 🐛 **Known Features**

- ✅ Full keyboard-only controls
- ✅ Responsive fullscreen design
- ✅ Smooth stick figure animations
- ✅ Ragdoll physics with realistic knockback
- ✅ Progressive difficulty system
- ✅ Boss fight with phases and minions
- ✅ Endless mode for replayability
- ✅ Offline gameplay
- ✅ Screen shake and particle effects

## 💡 **Tips for Playing**

1. **Learn the Basics**: Start with basic punches to understand range
2. **Collect Abilities**: Random ability drops are essential for progression
3. **Use Knockback**: Send enemies flying into walls for massive damage
4. **Phase Recognition**: Watch Thragg's health bar to anticipate phase changes
5. **Endless Strategy**: Focus on high-damage abilities for wave 10+ scaling

## 📝 **Game Stats**

- **Player Starting HP**: 100
- **Base Punch Damage**: 1-2 per hit
- **Max Ability Slots**: 8
- **Campaign Goal**: 20 enemy defeats
- **Thragg Health**: 1000 HP
- **Endless Waves**: Unlimited

## 🎯 **Future Enhancements**

- Custom ability selection before campaign
- Leaderboard system
- Sound effects via Web Audio API
- Additional boss encounters
- Power-up shops in endless mode
- Animation key combos for advanced moves

## 📄 **License**

This game is free to use, modify, and distribute.

## 🤝 **Credits**

Inspired by:
- *Invincible* - Viltrumite hand-to-hand combat
- *Roblox Strongest Battlegrounds* - Ragdoll mechanics and move design
- Classic stick figure fighting games

---

**Play Now**: Open `index.html` in your browser and start fighting! 🥊⚔️
