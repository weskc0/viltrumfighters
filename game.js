(() => {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const ui = {
    menu: document.getElementById('menuOverlay'),
    abilitiesOverlay: document.getElementById('abilitiesOverlay'),
    abilitiesList: document.getElementById('abilitiesList'),
    btnFight: document.getElementById('btnFight'),
    btnEndless: document.getElementById('btnEndless'),
    btnAbilities: document.getElementById('btnAbilities'),
    btnQuit: document.getElementById('btnQuit'),
    closeAbilities: document.getElementById('closeAbilities'),
    victoryOverlay: document.getElementById('victoryOverlay'),
    victoryText: document.getElementById('victoryText'),
    toMenu: document.getElementById('toMenu'),
    kills: document.getElementById('kills'),
    hpFill: document.getElementById('hpFill'),
    cooldowns: document.getElementById('cooldowns'),
  };

  const STATE = { MENU:0, CAMPAIGN:1, BOSS:2, ENDLESS:3, VICTORY:4 };
  let gameState = STATE.MENU;

  const keys = {};
  let mouse = {x: W/2, y: H/2, down:false};

  window.addEventListener('keydown', e => keys[e.key.toLowerCase()] = true);
  window.addEventListener('keyup', e => keys[e.key.toLowerCase()] = false);
  canvas.addEventListener('mousemove', e => {
    const r = canvas.getBoundingClientRect();
    mouse.x = (e.clientX - r.left) * (canvas.width / r.width);
    mouse.y = (e.clientY - r.top) * (canvas.height / r.height);
  });
  canvas.addEventListener('mousedown', e => mouse.down = true);
  canvas.addEventListener('mouseup', e => mouse.down = false);

  const rand = (a,b) => a + Math.random()*(b-a);
  const clamp = (v,a,b) => Math.max(a, Math.min(b, v));
  const dist = (a,b) => Math.hypot(a.x-b.x, a.y-b.y);

  const player = {
    x: W/2, y: H/2, vx:0, vy:0, w:10, h:28,
    speed: 220, jumpVel: -9, onGround:true,
    hp: 100, maxHp: 100,
    facing: 1,
    kills: 0,
    unlocked: [],
    abilitiesCooldowns: {},
    basicCombo: { step:0, timer:0 },
  };

  const enemies = [];
  const ragdolls = [];
  const orbs = [];
  let boss = null;
  let endlessUnlocked = false;
  let wave = 0;
  let score = 0;

  const SPAWN_INTERVAL = 2500;
  let lastSpawn = performance.now();

  const ALL_ABILITIES = [
    { name:'Ragdoll Slap', dmg:30, cd:12, desc:'Wild backhand sends foe flying to border wall, ragdoll bounce.' },
    { name:'Viltrumite Spear Hand', dmg:40, cd:15, desc:'Knife-hand thrust pierces, massive knockback + bleed.' },
    { name:'Omni Knee Strike', dmg:35, cd:12, desc:'Flying knee to gut, stuns + launches upward.' },
    { name:'Belly Slam', dmg:45, cd:18, desc:'Grab, fly-ram into ground creating crater, AoE stun.' },
    { name:'Serious Punch', dmg:50, cd:20, desc:'Charged haymaker, one-shots weak foes, shockwave.' },
    { name:'Lethal Whirlwind', dmg:40, cd:16, desc:'Spin grab-slam, multi-hits + fling.' },
    { name:'Ignition Burst', dmg:38, cd:14, desc:'Double-blast roll (front/back), high burst damage.' },
    { name:'Doom Dive', dmg:48, cd:18, desc:'Aerial dive-bomb, ground explosion on impact.' },
  ];

  function spawnEnemy(type='normal') {
    const side = Math.floor(rand(0,4));
    let x = 0, y = 0;
    if(side===0){ x = -20; y = rand(40, H-40); }
    if(side===1){ x = rand(40, W-40); y = -20; }
    if(side===2){ x = W+20; y = rand(40, H-40); }
    if(side===3){ x = rand(40, W-40); y = H+20; }
    const e = {
      x, y, vx:0, vy:0, w:10, h:26,
      hp: type==='elite'?60:20,
      maxHp: type==='elite'?60:20,
      type,
      attackTimer: rand(1,2.5),
      stun:0,
      id:Date.now()+Math.random(),
    };
    enemies.push(e);
    return e;
  }

  function dropOrb(x,y){ orbs.push({x,y,r:8,ttl:12000,spawn:performance.now()}); }

  function makeRagdoll(x,y,velx,vely,scale=1,color='#fff'){
    const p = { points: [], constraints: [], color, life: 4000, born: performance.now(), bounce: 0.6 };
    const s = 12*scale; const px = x, py = y;
    p.points.push({x:px, y:py - s*1.1, ox:px, oy:py - s*1.1, vx: velx, vy: vely});
    p.points.push({x:px, y:py, ox:px, oy:py, vx: velx, vy: vely});
    p.points.push({x:px - s, y:py + s*0.8, ox:px - s, oy:py + s*0.8, vx: velx, vy: vely});
    p.points.push({x:px + s, y:py + s*0.8, ox:px + s, oy:py + s*0.8, vx: velx, vy: vely});
    p.points.push({x:px - s*0.9, y:py - s*0.2, ox:px - s*0.9, oy:py - s*0.2, vx: velx, vy: vely});
    p.points.push({x:px + s*0.9, y:py - s*0.2, ox:px + s*0.9, oy:py - s*0.2, vx: velx, vy: vely});
    p.constraints.push([0,1, s*1.0]);
    p.constraints.push([1,2, s*1.4]);
    p.constraints.push([1,3, s*1.4]);
    p.constraints.push([1,4, s*1.0]);
    p.constraints.push([1,5, s*1.0]);
    ragdolls.push(p);
    return p;
  }

  function updateRagdolls(dt){
    const gravity = 1200;
    for(let r of ragdolls){
      for(let pt of r.points){
        let nx = pt.x + pt.vx * dt;
        let ny = pt.y + pt.vy * dt + gravity * dt * dt * 0.5;
        pt.vx *= 0.99; pt.vy *= 0.99; pt.vy += gravity * dt; pt.x = nx; pt.y = ny;
        if(pt.x < 2){ pt.x = 2; pt.vx = -pt.vx * r.bounce; }
        if(pt.x > W-2){ pt.x = W-2; pt.vx = -pt.vx * r.bounce; }
        if(pt.y > H-2){ pt.y = H-2; pt.vy = -pt.vy * 0.45; pt.vx *= 0.9; }
      }
      for(let k=0;k<3;k++){
        for(let c of r.constraints){
          const a = r.points[c[0]], b = r.points[c[1]]; const target = c[2];
          const dx = b.x - a.x, dy = b.y - a.y; const d = Math.hypot(dx,dy) || 0.0001;
          const diff = (d - target) / d * 0.5; const ox = dx * diff, oy = dy * diff;
          a.x += ox; a.y += oy; b.x -= ox; b.y -= oy;
        }
      }
    }
    const now = performance.now();
    for(let i=ragdolls.length-1;i>=0;i--){ if(now - ragdolls[i].born > ragdolls[i].life) ragdolls.splice(i,1); }
  }

  function lineHit(x1,y1,x2,y2, target){ const vx = x2-x1, vy = y2-y1; const wx = target.x - x1, wy = target.y - y1; const c = (wx*vx + wy*vy) / (vx*vx + vy*vy); const t = clamp(c,0,1); const px = x1 + vx*t, py = y1 + vy*t; const d = Math.hypot(px-target.x, py-target.y); return d < 18; }

  function damageEnemy(e, dmg, impulse={x:0,y:0}){
    e.hp -= dmg;
    if(e.hp <= 0){ dropOrb(e.x, e.y); makeRagdoll(e.x, e.y, impulse.x*20, impulse.y*20, e.type==='elite'?1.3:1, '#fff'); const i = enemies.indexOf(e); if(i>=0) enemies.splice(i,1); player.kills++; ui.kills.textContent = 'Kills: '+player.kills; score += 10; }
  }

  function playerAttack(dt){
    if(mouse.down){
      const combo = player.basicCombo;
      if(combo.timer <= 0){ combo.step = (combo.step % 3) + 1; combo.timer = 0.32; const facingVec = {x: mouse.x - player.x, y: mouse.y - player.y}; const mag = Math.hypot(facingVec.x,facingVec.y)||1; const nx = facingVec.x/mag, ny = facingVec.y/mag; const reach = 48; const x2 = player.x + nx*reach, y2 = player.y + ny*reach; for(let e of enemies){ if(lineHit(player.x,player.y,x2,y2,e)){ const dmg = rand(1,2); damageEnemy(e, dmg, {x:nx,y:ny}); e.vx += nx * 120; e.vy += ny * 60; } } }
    player.basicCombo.timer = Math.max(0, player.basicCombo.timer - dt);
  }

  function tryUseAbility(slot){ const idx = player.unlocked[slot]; if(idx === undefined) return; const ability = ALL_ABILITIES[idx]; const now = performance.now()/1000; if(player.abilitiesCooldowns[ability.name] && player.abilitiesCooldowns[ability.name] > now) return; player.abilitiesCooldowns[ability.name] = now + ability.cd; const aim = {x:mouse.x-player.x, y:mouse.y-player.y}; const mag = Math.hypot(aim.x,aim.y)||1; const nx = aim.x/mag, ny = aim.y/mag; for(let e of enemies){ if(dist(e, player) < 240){ damageEnemy(e, ability.dmg, {x:nx,y:ny}); e.vx += nx * ability.dmg * 6; e.vy += ny * ability.dmg * 3; if(ability.dmg >= 45) makeRagdoll(e.x, e.y, nx*30 + e.vx*0.5, ny*ability.dmg*0.5, 1.2, '#f55'); break; } } }

  function updateEnemies(dt){ for(let e of enemies){ if(e.stun > 0){ e.stun -= dt; continue; } const target = player; const dx = target.x - e.x, dy = target.y - e.y; const d = Math.hypot(dx,dy); const nx = dx/d||0, ny = dy/d||0; const speed = (e.type==='elite'?80:60) * (1 + player.kills*0.01); e.vx += nx * speed * dt; e.vy += ny * speed * dt; e.vx *= 0.96; e.vy *= 0.96; e.x += e.vx * dt; e.y += e.vy * dt; e.attackTimer -= dt; if(e.attackTimer <= 0){ e.attackTimer = rand(1.2,2.5); if(dist(e, player) < 34){ player.hp -= (e.type==='elite'?6:2); player.vx += nx*120; player.vy += -200; } } e.x = clamp(e.x, 6, W-6); e.y = clamp(e.y, 6, H-6); } }

  function updateOrbs(dt){ for(let i=orbs.length-1;i>=0;i--){ const o = orbs[i]; const now = performance.now(); if(now - o.spawn > o.ttl) { orbs.splice(i,1); continue; } const d = Math.hypot(o.x-player.x, o.y-player.y); if(d < 40){ pickAbilityOrb(); orbs.splice(i,1); } else { o.x += Math.cos(now/300 + i) * 0.1; o.y += Math.sin(now/300 + i) * 0.1; } } }

  function pickAbilityOrb(){ const available = ALL_ABILITIES.map((a,i)=>i).filter(i => !player.unlocked.includes(i)); let chosen; if(available.length === 0){ chosen = Math.floor(rand(0, ALL_ABILITIES.length)); } else { chosen = available[Math.floor(rand(0, available.length))]; } if(player.unlocked.length < 8){ player.unlocked.push(chosen); } else { const slot = Math.floor(rand(0,8)); player.unlocked[slot] = chosen; } console.log('Unlocked ability:', ALL_ABILITIES[chosen].name); }

  function updatePlayer(dt){ let ax = 0; if(keys['a'] || keys['arrowleft']) ax -= 1; if(keys['d'] || keys['arrowright']) ax += 1; const groundY = H - 10; if((keys[' '] || keys['space']) && player.onGround){ player.vy = player.jumpVel * 80; player.onGround = false; } const acc = ax * player.speed; player.vx += acc * dt; player.vx *= 0.92; player.vy += 1200 * dt; player.x += player.vx * dt; player.y += player.vy * dt; if(player.y >= groundY){ player.y = groundY; player.vy = 0; player.onGround = true; } player.x = clamp(player.x, 20, W-20); player.facing = (mouse.x >= player.x) ? 1 : -1; }

  function spawnLoop(now){ if(gameState === STATE.CAMPAIGN || gameState === STATE.ENDLESS){ if(now - lastSpawn > SPAWN_INTERVAL){ lastSpawn = now; const count = Math.floor(rand(1,3.1)); for(let i=0;i<count;i++){ const t = Math.random() < (0.12 + player.kills*0.01) ? 'elite' : 'normal'; spawnEnemy(t); } } } }

  function spawnThragg(){ boss = { x: W/2, y: 140, vx:0, vy:0, hp: 1000, maxHp: 1000, phase: 1, enraged:false, attackTimer: 1.2, size: 2.2, id:'thragg', }; }

  function updateBoss(dt){ if(!boss) return; const p = boss; const speed = p.phase === 1 ? 80 : (p.phase===2?140:90); p.vx += (player.x - p.x) * 0.002 * speed * dt; p.vy += (player.y - p.y) * 0.002 * speed * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.vx *= 0.93; p.vy *= 0.93; p.attackTimer -= dt; if(p.attackTimer <= 0){ p.attackTimer = rand(0.8, 1.6); for(let e of enemies.slice()){ e.vx += rand(-200,200); e.vy += -200; } if(dist(p, player) < 140){ player.hp -= p.phase===2 ? 30 : 18; player.vx += (player.x - p.x) * 1.2; player.vy -= 400; } } const perc = p.hp / p.maxHp; if(p.phase === 1 && perc <= 0.6){ p.phase = 2; p.enraged = true; p.attackTimer = 0.6; } else if(p.phase === 2 && perc <= 0.3){ p.phase = 3; for(let i=0;i<3;i++) spawnEnemy(Math.random()>0.5?'elite':'normal'); } if(p.hp <= 0){ makeRagdoll(p.x, p.y, p.vx*3, p.vy*3, 3.2, '#f00'); boss = null; onVictory('Viltrumite Empire Conquered!'); } }

  function onVictory(text){ endlessUnlocked = true; ui.btnEndless.classList.remove('locked'); ui.victoryOverlay.classList.remove('hidden'); ui.victoryText.textContent = text; gameState = STATE.VICTORY; const h = localStorage.getItem('sva_high') || 0; if(score > h) localStorage.setItem('sva_high', score); }

  let last = performance.now();
  function loop(now){ const dt = Math.min(0.04, (now - last) / 1000); last = now; spawnLoop(now); if(gameState === STATE.CAMPAIGN || gameState === STATE.ENDLESS){ updatePlayer(dt); updateEnemies(dt); updateOrbs(dt); updateRagdolls(dt); playerAttack(dt); updateBoss(dt); for(let k=1;k<=8;k++){ if(keys[''+k]){ tryUseAbility(k-1); keys[''+k]=false; } } if(gameState === STATE.CAMPAIGN && player.kills >= 20 && !boss){ spawnThragg(); gameState = STATE.BOSS; } ui.hpFill.style.width = (player.hp / player.maxHp * 100)+'%'; }
  if(gameState === STATE.BOSS){ updatePlayer(dt); updateEnemies(dt); updateOrbs(dt); updateRagdolls(dt); playerAttack(dt); updateBoss(dt); for(let k=1;k<=8;k++){ if(keys[''+k]){ tryUseAbility(k-1); keys[''+k]=false; } } ui.hpFill.style.width = (player.hp / player.maxHp * 100)+'%'; }
  render(now); requestAnimationFrame(loop); }

  function render(now){ ctx.clearRect(0,0,W,H); ctx.fillStyle = '#070707'; ctx.fillRect(0,0,W,H); ctx.strokeStyle = 'rgba(255,0,0,0.04)'; ctx.lineWidth = 6; ctx.strokeRect(2,2,W-4,H-4); for(let o of orbs){ ctx.beginPath(); ctx.fillStyle = 'rgba(255,215,0,0.95)'; ctx.arc(o.x, o.y, o.r, 0, Math.PI*2); ctx.fill(); ctx.strokeStyle = 'rgba(255,180,40,0.6)'; ctx.stroke(); } for(let e of enemies){ drawStick(e.x, e.y, '#ccc', e.type==='elite'?1.2:1); const w = 32, h = 5; ctx.fillStyle = '#333'; ctx.fillRect(e.x - w/2, e.y - 40, w, h); ctx.fillStyle = '#e74c3c'; ctx.fillRect(e.x - w/2, e.y - 40, w * (e.hp / e.maxHp), h); } if(boss){ drawStick(boss.x, boss.y, boss.phase===2? '#ff4d4d':'#ff0000', boss.size); ctx.fillStyle = '#111'; ctx.fillRect(80, 18, W-160, 18); ctx.fillStyle = '#ff4d4d'; ctx.fillRect(80, 18, (W-160) * (boss.hp / boss.maxHp), 18); ctx.strokeStyle = '#660000'; ctx.strokeRect(80, 18, W-160, 18); } drawStick(player.x, player.y, '#fff', 1.0, true); for(let r of ragdolls){ ctx.strokeStyle = r.color; ctx.lineWidth = 3; for(let c of r.constraints){ const a = r.points[c[0]], b = r.points[c[1]]; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); } ctx.fillStyle = r.color; ctx.beginPath(); ctx.arc(r.points[0].x, r.points[0].y, 6, 0, Math.PI*2); ctx.fill(); } const nowS = performance.now()/1000; let cdText = 'Powers: '; for(let i=0;i<player.unlocked.length;i++){ const idx = player.unlocked[i]; const ab = ALL_ABILITIES[idx]; const ready = !(player.abilitiesCooldowns[ab.name] && player.abilitiesCooldowns[ab.name] > nowS); cdText += `[${i+1}] ${ab.name.split(' ')[0]} ${ready?'<ready>':'cd'}  `; } ui.cooldowns.textContent = cdText; }

  function drawStick(x,y,color,scale=1, isPlayer=false){ ctx.save(); ctx.translate(x,y); ctx.scale(scale, scale); ctx.lineWidth = 3; ctx.strokeStyle = color; ctx.fillStyle = color; ctx.beginPath(); ctx.arc(0, -18, 8, 0, Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.moveTo(0,-10); ctx.lineTo(0,12); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0,-2); ctx.lineTo(-18,6); ctx.moveTo(0,-2); ctx.lineTo(18,6); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0,12); ctx.lineTo(-12,28); ctx.moveTo(0,12); ctx.lineTo(12,28); ctx.stroke(); ctx.restore(); }

  ui.btnFight.addEventListener('click', ()=> { startCampaign(); });
  ui.btnEndless.addEventListener('click', ()=> { if(!endlessUnlocked) return; startEndless(); });
  ui.btnAbilities.addEventListener('click', ()=> { showAbilities(); });
  ui.closeAbilities.addEventListener('click', ()=> { ui.abilitiesOverlay.classList.add('hidden'); ui.menu.classList.remove('hidden'); });
  ui.btnQuit.addEventListener('click', ()=> { showMenu(); });
  ui.toMenu.addEventListener('click', ()=> { showMenu(); ui.victoryOverlay.classList.add('hidden'); });

  function showMenu(){ gameState = STATE.MENU; ui.menu.classList.remove('hidden'); ui.abilitiesOverlay.classList.add('hidden'); ui.victoryOverlay.classList.add('hidden'); resetGame(); }

  function showAbilities(){ ui.menu.classList.add('hidden'); ui.abilitiesOverlay.classList.remove('hidden'); ui.abilitiesList.innerHTML = ''; if(player.unlocked.length === 0) ui.abilitiesList.textContent = '(none)'; player.unlocked.forEach((i, idx) => { const a = ALL_ABILITIES[i]; const el = document.createElement('div'); el.innerHTML = `<strong>[${idx+1}] ${a.name}</strong> — ${a.desc} (DMG ${a.dmg}, CD ${a.cd}s)`; ui.abilitiesList.appendChild(el); }); }

  function startCampaign(){ ui.menu.classList.add('hidden'); ui.victoryOverlay.classList.add('hidden'); ui.abilitiesOverlay.classList.add('hidden'); gameState = STATE.CAMPAIGN; resetGame(); }

  function startEndless(){ ui.menu.classList.add('hidden'); gameState = STATE.ENDLESS; resetGame(); wave = 1; for(let i=0;i<10;i++) spawnEnemy(i%6===0?'elite':'normal'); }

  function resetGame(){ player.x = W/2; player.y = H-10; player.vx = 0; player.vy = 0; player.hp = player.maxHp; enemies.length = 0; orbs.length = 0; ragdolls.length = 0; boss = null; player.kills = 0; ui.kills.textContent = 'Kills: 0'; score = 0; lastSpawn = performance.now(); }

  showMenu(); requestAnimationFrame(loop);

  window._SVA = { spawnEnemy, makeRagdoll, ALL_ABILITIES, player };

  window.addEventListener('keydown', e => { if(e.key === 'U' || e.key === 'u'){ pickAbilityOrb(); } });

})();