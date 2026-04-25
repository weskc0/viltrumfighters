# Stick Viltrumite Arena

Short school project: an offline HTML5 Canvas fighting game with stick figures and unlockable Viltrumite-inspired powers.

How to run
1. Place files in repo root: index.html, style.css, game.js, README.md.
2. Open index.html in a modern browser (Chrome/Edge/Firefox). No server required.

Controls
- WASD: Move
- Space: Jump
- Mouse aim + Left click: Punch/Primary attack
- 1-8: Use unlocked abilities
- UI buttons: FIGHT (campaign), ENDLESS (locked until Thragg is defeated), ABILITIES, QUIT.

Design notes
- Arena: 1200x600 canvas, borders are impassable for enemies (they bounce off).
- Enemies spawn from edges, fight in arena; kills drop power orbs which unlock random abilities.
- Ragdoll physics: simplified verlet constraints for crude limb flinging and bounce.
- Progression: beat 20 enemies to summon Thragg boss. Defeat Thragg to unlock Endless Mode and see victory screen.
- Endless Mode: waves with scaling difficulty, local high score stored in localStorage.

Files included
- index.html — canvas + UI
- style.css — basic styling and menu visuals
- game.js — core game logic (movement, AI, ragdolls, abilities, boss flow) 

Claude boss prompt:
"Enhance Stick Viltrumite Arena game: After 20 enemy kills, fade to boss arena (same screen, blood splatters, thunder SFX via AudioContext). Spawn Thragg: giant red stick figure (2x player size, mustache/line beard), 1000 HP bar top-screen. Thragg AI: aggressive fly-charges, uses all player abilities + exclusives—Viltrumite Gore (grab-tear limbs, massive bleed), Empire Slam (ground-pound AoE crater), Thragg Barrage (20-punch combo). Player uses full unlocked powers.

Boss phases:

Basic: Mirrors player moves, high speed.

60% HP: Enrages—red aura, double damage, homing dives.

30% HP: Calls 2-3 minions from borders.

Win: Thragg ragdolls to wall, explodes in gore pixels. Unlocks Endless Mode (waves: 10 enemies/wave, scaling HP/speed + random bosses). Lose: Restart campaign.

Implement in JS/Canvas: Thragg pathfinding (lerp to player), phase health checks, minion spawns. Ragdoll Thragg dramatically on kill. Add victory screen: 'Viltrumite Empire Conquered!' with Endless unlock. Keep offline, simple code.