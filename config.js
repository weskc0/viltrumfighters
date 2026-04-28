// ==================== GAME CONFIG ====================
const CONFIG = {
    // World
    GRAVITY: -9.8,
    ARENA_SIZE: 150,
    ARENA_HEIGHT: 100,
    
    // Player
    PLAYER_SCALE: 1,
    PLAYER_HP: 100,
    PLAYER_SPEED: 25,
    PLAYER_PUNCH_RANGE: 8,
    PLAYER_PUNCH_DAMAGE: 3,
    PLAYER_PUNCH_COOLDOWN: 300,
    
    // Enemies
    ENEMY_SCALE: 1,
    ENEMY_BASE_HP: 20,
    ENEMY_ELITE_HP: 35,
    ENEMY_SPEED: 15,
    ENEMY_PUNCH_DAMAGE: 4,
    
    // Boss
    THRAGG_SCALE: 2.5,
    THRAGG_HP: 500,
    THRAGG_SPEED: 20,
    THRAGG_PUNCH_DAMAGE: 12,
    
    // Progression
    WIN_KILL_COUNT: 20,
    SPAWN_INTERVAL: 2000,
    MAX_ENEMIES: 4,
    
    // Physics
    LIMB_SCALE: 0.5,
    JOINT_ELASTICITY: 0.3,
    IMPULSE_MULTIPLIER: 2,
    
    // Abilities
    ABILITY_MAX_SLOTS: 8,
    
    // Camera
    CAMERA_DISTANCE: 25,
    CAMERA_HEIGHT: 8,
};

// Ability specs
const ABILITY_SPECS = {
    'Ragdoll Slap': {
        name: 'Ragdoll Slap',
        damage: 35,
        cooldown: 600,
        range: 12,
        impulse: 30,
        key: 'q'
    },
    'Viltrumite Spear Hand': {
        name: 'Viltrumite Spear Hand',
        damage: 50,
        cooldown: 800,
        range: 10,
        impulse: 25,
        key: 'w'
    },
    'Omni Knee Strike': {
        name: 'Omni Knee Strike',
        damage: 40,
        cooldown: 700,
        range: 9,
        impulse: 28,
        key: 'e'
    },
    'Belly Slam': {
        name: 'Belly Slam',
        damage: 45,
        cooldown: 900,
        range: 11,
        impulse: 35,
        key: 'r'
    },
    'Serious Punch': {
        name: 'Serious Punch',
        damage: 60,
        cooldown: 1000,
        range: 10,
        impulse: 40,
        key: 't'
    },
    'Lethal Whirlwind': {
        name: 'Lethal Whirlwind',
        damage: 55,
        cooldown: 850,
        range: 12,
        impulse: 32,
        key: 'y'
    },
    'Ignition Burst': {
        name: 'Ignition Burst',
        damage: 50,
        cooldown: 750,
        range: 10,
        impulse: 28,
        key: 'u'
    },
    'Doom Dive': {
        name: 'Doom Dive',
        damage: 70,
        cooldown: 1200,
        range: 13,
        impulse: 45,
        key: 'i'
    }
};

// Color scheme
const COLORS = {
    player: 0x00ff88,
    enemy: 0xff006e,
    enemyElite: 0xff6666,
    boss: 0xff0000,
    blood: 0xff0000,
    ground: 0x1a1a2e,
    wall: 0x2a2a3e,
};
