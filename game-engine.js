// ==================== 3D GAME ENGINE ====================
class GameEngine {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0f0f1e);
        this.scene.fog = new THREE.Fog(0x0f0f1e, 300, 100);

        // Setup camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );

        // Setup renderer
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFShadowShadowMap;

        // Physics world
        this.world = new CANNON.World();
        this.world.gravity.set(0, CONFIG.GRAVITY, 0);
        this.world.defaultContactMaterial.friction = 0.3;

        // Managers
        this.particleSystem = new ParticleSystem(this.scene, this.world);
        this.abilitySystem = new AbilitySystem(this.scene);
        window.particleSystem = this.particleSystem;

        // Game state
        this.gameState = {
            mode: 'menu',
            running: false,
            kills: 0,
            endless_wave: 1,
            unlockedAbilities: [],
            bossDefeated: localStorage.getItem('bossDefeated') === 'true'
        };

        // Characters
        this.player = null;
        this.enemies = [];
        this.boss = null;
        this.spawnTimer = 0;

        // Input
        this.keys = {};
        this.mouse = { x: 0, y: 0, down: false };

        this.setupLighting();
        this.setupArena();
        this.setupInput();
        this.showMenu();

        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());

        // Start game loop
        this.clock = new THREE.Clock();
        this.animate();
    }

    setupLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        // Directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(50, 50, 50);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.left = -100;
        directionalLight.shadow.camera.right = 100;
        directionalLight.shadow.camera.top = 100;
        directionalLight.shadow.camera.bottom = -100;
        this.scene.add(directionalLight);

        // Point lights for atmosphere
        const pointLight1 = new THREE.PointLight(0xff006e, 0.5);
        pointLight1.position.set(-50, 30, -50);
        this.scene.add(pointLight1);

        const pointLight2 = new THREE.PointLight(0x00ff88, 0.5);
        pointLight2.position.set(50, 30, 50);
        this.scene.add(pointLight2);
    }

    setupArena() {
        // Floor
        const floorShape = new CANNON.Plane();
        const floorBody = new CANNON.Body({ mass: 0, shape: floorShape });
        floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
        this.world.addBody(floorBody);

        const floorGeom = new THREE.PlaneGeometry(CONFIG.ARENA_SIZE, CONFIG.ARENA_SIZE);
        const floorMat = new THREE.MeshStandardMaterial({
            color: COLORS.ground,
            metalness: 0.5,
            roughness: 0.8
        });
        const floorMesh = new THREE.Mesh(floorGeom, floorMat);
        floorMesh.rotation.x = -Math.PI / 2;
        floorMesh.receiveShadow = true;
        this.scene.add(floorMesh);

        // Walls
        const wallMaterial = new THREE.MeshStandardMaterial({
            color: COLORS.wall,
            metalness: 0.3,
            roughness: 0.7
        });

        const wallConfigs = [
            { pos: [0, 0, CONFIG.ARENA_SIZE / 2], rot: [0, 0, 0] },
            { pos: [0, 0, -CONFIG.ARENA_SIZE / 2], rot: [0, 0, 0] },
            { pos: [CONFIG.ARENA_SIZE / 2, 0, 0], rot: [0, Math.PI / 2, 0] },
            { pos: [-CONFIG.ARENA_SIZE / 2, 0, 0], rot: [0, Math.PI / 2, 0] }
        ];

        wallConfigs.forEach(cfg => {
            const wallShape = new CANNON.Box(new CANNON.Vec3(CONFIG.ARENA_SIZE / 2, CONFIG.ARENA_HEIGHT / 2, 1));
            const wallBody = new CANNON.Body({ mass: 0, shape: wallShape });
            wallBody.position.set(...cfg.pos);
            this.world.addBody(wallBody);

            const wallGeom = new THREE.BoxGeometry(CONFIG.ARENA_SIZE, CONFIG.ARENA_HEIGHT, 2);
            const wallMesh = new THREE.Mesh(wallGeom, wallMaterial);
            wallMesh.position.set(...cfg.pos);
            wallMesh.rotation.order = 'YXZ';
            wallMesh.rotation.set(...cfg.rot);
            wallMesh.castShadow = true;
            wallMesh.receiveShadow = true;
            this.scene.add(wallMesh);
        });
    }

    setupInput() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;
            
            // Ability keys
            const abilityMap = { 'q': 0, 'w': 1, 'e': 2, 'r': 3, 't': 4, 'y': 5, 'u': 6, 'i': 7 };
            if (abilityMap[e.key.toLowerCase()] !== undefined && this.gameState.running) {
                this.handleAbilityInput(abilityMap[e.key.toLowerCase()]);
            }
        });

        document.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });

        document.addEventListener('mousemove', (e) => {
            this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        });

        document.addEventListener('mousedown', () => {
            this.mouse.down = true;
        });

        document.addEventListener('mouseup', () => {
            this.mouse.down = false;
        });
    }

    startCampaign() {
        this.gameState.mode = 'campaign';
        this.gameState.running = true;
        this.gameState.kills = 0;
        this.gameState.unlockedAbilities = [];
        this.enemies = [];
        this.spawnTimer = 0;

        document.getElementById('menu').style.display = 'none';
        document.getElementById('loading').style.display = 'none';
        document.getElementById('player-stats').style.display = 'block';
        document.getElementById('wave-info').style.display = 'block';
        document.getElementById('abilities').style.display = 'block';
        document.getElementById('controls').style.display = 'block';

        // Create player
        const playerPos = new THREE.Vector3(0, 5, 0);
        this.player = new StickFigure(this.world, playerPos, true);
        this.scene.add(this.player.mesh);

        // Spawn first enemies
        for (let i = 0; i < 2; i++) {
            this.spawnEnemy();
        }
    }

    startEndless() {
        this.gameState.mode = 'endless';
        this.gameState.running = true;
        this.gameState.kills = 0;
        this.gameState.endless_wave = 1;
        this.gameState.unlockedAbilities = JSON.parse(localStorage.getItem('unlockedAbilities') || '[]');
        this.enemies = [];
        this.spawnTimer = 0;

        document.getElementById('menu').style.display = 'none';
        document.getElementById('loading').style.display = 'none';
        document.getElementById('player-stats').style.display = 'block';
        document.getElementById('wave-info').style.display = 'block';
        document.getElementById('abilities').style.display = 'block';
        document.getElementById('controls').style.display = 'block';

        // Create player with unlocked abilities
        const playerPos = new THREE.Vector3(0, 5, 0);
        this.player = new StickFigure(this.world, playerPos, true);
        this.gameState.unlockedAbilities.forEach(a => this.player.addAbility(a));
        this.scene.add(this.player.mesh);
    }

    showAbilities() {
        let html = '<h1>UNLOCKED ABILITIES</h1>';
        if (this.gameState.unlockedAbilities.length === 0) {
            html += '<p>Kill enemies to unlock abilities!</p>';
        } else {
            html += '<table class="ability-table"><tr><td>Ability</td><td>DMG</td></tr>';
            this.gameState.unlockedAbilities.forEach(name => {
                const ability = ABILITY_SPECS[name];
                html += `<tr><td>${name}</td><td>${ability.damage}</td></tr>`;
            });
            html += '</table>';
        }
        // Placeholder - could open overlay
        alert('Unlocked: ' + (this.gameState.unlockedAbilities.length || 'None'));
    }

    showMenu() {
        this.gameState.mode = 'menu';
        this.gameState.running = false;
        document.getElementById('menu').style.display = 'block';
        document.getElementById('player-stats').style.display = 'none';
        document.getElementById('enemy-stats').style.display = 'none';
        document.getElementById('boss-stats').style.display = 'none';
        document.getElementById('wave-info').style.display = 'none';
        document.getElementById('abilities').style.display = 'none';
        document.getElementById('controls').style.display = 'none';

        // Clear scene
        const objectsToRemove = [];
        this.scene.traverse(obj => {
            if (obj.userData && obj.userData.character) objectsToRemove.push(obj);
        });
        objectsToRemove.forEach(obj => this.scene.remove(obj));

        if (this.player) {
            this.player.dispose();
            this.player = null;
        }

        this.enemies.forEach(e => e.dispose());
        this.enemies = [];

        if (this.gameState.bossDefeated) {
            document.getElementById('endless-btn').disabled = false;
        }
    }

    spawnEnemy() {
        const angle = Math.random() * Math.PI * 2;
        const distance = CONFIG.ARENA_SIZE * 0.4;
        const x = Math.cos(angle) * distance;
        const z = Math.sin(angle) * distance;
        const pos = new THREE.Vector3(x, 5, z);

        const elite = this.gameState.mode === 'endless' && Math.random() < 0.1;
        const enemy = new StickFigure(this.world, pos, false, false);
        if (elite) {
            enemy.hp = CONFIG.ENEMY_ELITE_HP;
            enemy.maxHp = CONFIG.ENEMY_ELITE_HP;
        }
        this.enemies.push(enemy);
        this.scene.add(enemy.mesh);
    }

    spawnBoss() {
        const pos = new THREE.Vector3(0, 5, -20);
        this.boss = new StickFigure(this.world, pos, false, true);
        this.scene.add(this.boss.mesh);

        document.getElementById('boss-stats').style.display = 'block';
        document.getElementById('enemy-stats').style.display = 'none';
        document.getElementById('wave-info').style.display = 'none';
    }

    handleAbilityInput(index) {
        if (!this.player || !this.enemies.length && !this.boss) return;

        const ability = this.player.useAbility(index);
        if (!ability) return;

        let target = null;
        if (this.boss) {
            target = this.boss;
        } else if (this.enemies.length > 0) {
            target = this.enemies.reduce((closest, enemy) => {
                const dist1 = this.player.getPosition().distanceTo(closest.getPosition());
                const dist2 = this.player.getPosition().distanceTo(enemy.getPosition());
                return dist2 < dist1 ? enemy : closest;
            });
        }

        if (target) {
            this.abilitySystem.executeAbility(this.player, target, this.player.abilities[index]);
            this.abilitySystem.createScreenShake(this.camera, 3);
        }
    }

    update(deltaTime) {
        if (!this.gameState.running) return;

        // Update physics
        this.world.step(1 / 60);

        // Player movement
        if (this.player) {
            const direction = new THREE.Vector3();
            if (this.keys['w']) direction.z -= 1;
            if (this.keys['s']) direction.z += 1;
            if (this.keys['a']) direction.x -= 1;
            if (this.keys['d']) direction.x += 1;

            if (direction.length() > 0) {
                direction.normalize();
                this.player.moveTo(direction, 1);
            }

            this.player.update(deltaTime);

            // Camera follow
            const playerPos = this.player.getPosition();
            this.camera.position.lerp(
                new THREE.Vector3(
                    playerPos.x + 15,
                    playerPos.y + CONFIG.CAMERA_HEIGHT,
                    playerPos.z + 15
                ),
                0.1
            );
            this.camera.lookAt(playerPos.x, playerPos.y + 2, playerPos.z);

            // Check punch
            if (this.mouse.down) {
                if (this.boss) {
                    this.player.punch(this.boss);
                } else if (this.enemies.length > 0) {
                    const closest = this.enemies.reduce((a, b) =>
                        this.player.getPosition().distanceTo(a.getPosition()) <
                        this.player.getPosition().distanceTo(b.getPosition()) ? a : b
                    );
                    this.player.punch(closest);
                }
                this.mouse.down = false;
            }

            // Player death
            if (this.player.hp <= 0) {
                this.endGame(false);
                return;
            }
        }

        // Update enemies
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            enemy.update(deltaTime);

            // Chase player
            const direction = this.player.getPosition().clone().sub(enemy.getPosition()).normalize();
            enemy.moveTo(direction, 1);

            // Check attack
            if (this.player.getPosition().distanceTo(enemy.getPosition()) < 5) {
                if (Math.random() < 0.02) {
                    enemy.punch(this.player);
                }
            }

            // Death
            if (enemy.hp <= 0) {
                enemy.dispose();
                this.scene.remove(enemy.mesh);
                this.enemies.splice(i, 1);
                this.gameState.kills++;

                // Ability drop
                if (Math.random() < 0.5) {
                    const abilityNames = Object.keys(ABILITY_SPECS);
                    const randomAbility = abilityNames[Math.floor(Math.random() * abilityNames.length)];
                    if (!this.gameState.unlockedAbilities.includes(randomAbility)) {
                        this.gameState.unlockedAbilities.push(randomAbility);
                        this.player.addAbility(randomAbility);
                    }
                }

                // Check boss spawn
                if (this.gameState.mode === 'campaign' && this.gameState.kills >= CONFIG.WIN_KILL_COUNT) {
                    this.spawnBoss();
                }
            }
        }

        // Update boss
        if (this.boss) {
            this.boss.update(deltaTime);
            this.boss.updatePhase(this.boss.hp / this.boss.maxHp);

            // Chase player
            const direction = this.player.getPosition().clone().sub(this.boss.getPosition()).normalize();
            this.boss.moveTo(direction, 1);

            // Attack
            if (this.player.getPosition().distanceTo(this.boss.getPosition()) < 6) {
                if (Math.random() < 0.015) {
                    this.boss.punch(this.player);
                }
            }

            // Death
            if (this.boss.hp <= 0) {
                this.boss.dispose();
                this.scene.remove(this.boss.mesh);
                this.particleSystem.addExplosion(this.boss.getPosition(), 0xff0000, 50);
                this.abilitySystem.createScreenShake(this.camera, 10);

                localStorage.setItem('bossDefeated', 'true');
                localStorage.setItem('unlockedAbilities', JSON.stringify(this.gameState.unlockedAbilities));
                this.gameState.bossDefeated = true;

                this.endGame(true);
            }
        }

        // Spawn enemies
        if (this.gameState.mode === 'campaign' || this.gameState.mode === 'endless') {
            this.spawnTimer += deltaTime;
            if (this.spawnTimer > (CONFIG.SPAWN_INTERVAL / 1000) && !this.boss && this.enemies.length < CONFIG.MAX_ENEMIES) {
                this.spawnEnemy();
                this.spawnTimer = 0;
            }
        }

        // Update particles
        this.particleSystem.update(deltaTime);

        // Update UI
        this.updateUI();
    }

    updateUI() {
        if (this.player) {
            document.getElementById('player-health').style.width = (this.player.hp / this.player.maxHp) * 100 + '%';
            document.getElementById('player-hp').textContent = `${Math.ceil(this.player.hp)}/${this.player.maxHp}`;
            document.getElementById('player-kills').textContent = this.gameState.kills;
        }

        if (this.enemies.length > 0 && !this.boss) {
            const target = this.enemies[0];
            document.getElementById('enemy-health').style.width = (target.hp / target.maxHp) * 100 + '%';
            document.getElementById('enemy-hp').textContent = `${Math.ceil(target.hp)}/${target.maxHp}`;
            document.getElementById('enemy-stats').style.display = 'block';
        } else {
            document.getElementById('enemy-stats').style.display = 'none';
        }

        if (this.boss) {
            document.getElementById('boss-health').style.width = (this.boss.hp / this.boss.maxHp) * 100 + '%';
            document.getElementById('boss-hp').textContent = `${Math.ceil(this.boss.hp)}/${this.boss.maxHp}`;
            document.getElementById('boss-phase').textContent = this.boss.phase;
        }

        document.getElementById('kills-display').textContent = this.gameState.kills;

        // Abilities
        const abilitySlots = document.getElementById('ability-slots');
        if (this.player) {
            abilitySlots.innerHTML = '';
            for (let i = 0; i < 8; i++) {
                const slot = document.createElement('div');
                slot.className = 'ability-slot';
                if (i < this.player.abilities.length) {
                    const abilityName = this.player.abilities[i];
                    slot.textContent = i + 1;
                    if (this.player.abilityCooldowns[abilityName] <= 0) {
                        slot.classList.add('available');
                    } else {
                        slot.classList.add('cooldown');
                    }
                } else {
                    slot.textContent = '?';
                    slot.style.opacity = '0.3';
                }
                abilitySlots.appendChild(slot);
            }
        }
    }

    endGame(victory) {
        this.gameState.running = false;
        if (victory) {
            alert('Victory! Thragg defeated!');
        } else {
            alert('Defeated! Kills: ' + this.gameState.kills);
        }
        this.showMenu();
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        const deltaTime = this.clock.getDelta();
        TWEEN.update();

        this.update(deltaTime);
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize game when page loads
window.addEventListener('load', () => {
    document.getElementById('loading').classList.add('pulse');
    setTimeout(() => {
        window.gameEngine = new GameEngine();
        document.getElementById('loading').style.display = 'none';
    }, 500);
});
