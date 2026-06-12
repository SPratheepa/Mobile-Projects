// ===== NEOLOOP GAME ENGINE =====
const params = new URLSearchParams(window.location.search);
const ROOM = params.get('room') || 'bedroom';
const DIFFICULTY = params.get('difficulty') || 'easy';
const TOTAL_LOOPS = parseInt(params.get('loops') || '5');

let scene, camera, renderer, clock;
let moveState = { w:0,a:0,s:0,d:0 };
let yaw = 0, pitch = 0;
let isPointerLocked = false;
let interactables = [];
let nearbyObject = null;
let inventory = [];
let gameStarted = false;
let gameWon = false;
let timerInterval;

let loopEngine, puzzleEngine;

const ROOM_CONFIGS = {
  bedroom: {
    name: 'Bedroom Loop',
    objects: [
      { id:'bed', label:'🛏️ Bed', pos:[0,-0.5,-3], size:[2.4,0.6,1.4], color:0x6b4c3b, puzzle:'drawer_key', loopAppear:1 },
      { id:'mirror', label:'🪞 Mirror', pos:[-3,0.5,-2], size:[0.1,1.4,1], color:0x88ccff, puzzle:'mirror_code', loopAppear:1 },
      { id:'lamp', label:'💡 Lamp', pos:[2,0,-2.5], size:[0.2,1.2,0.2], color:0xffee88, puzzle:null, loopAppear:1 },
      { id:'bookshelf', label:'📚 Bookshelf', pos:[3,0,-1], size:[0.3,1.8,1.2], color:0x7c5c3a, puzzle:'book_order', loopAppear:2 },
      { id:'wardrobe', label:'🗄️ Wardrobe', pos:[-3,0.3,0], size:[0.3,1.8,1.2], color:0x4a3728, puzzle:'wardrobe_lock', loopAppear:3 },
      { id:'door', label:'🚪 Exit', pos:[0,0,3.5], size:[0.1,2.2,1], color:0x8b6914, puzzle:'exit', loopAppear:1, isExit:true },
    ]
  },
  office: {
    name: 'Office Loop',
    objects: [
      { id:'desk', label:'🖥️ Desk', pos:[0,-0.5,-3], size:[2,0.8,1], color:0x3a3a5a, puzzle:'clock_hands', loopAppear:1 },
      { id:'clock', label:'🕐 Clock', pos:[0,1.2,-3.9], size:[0.05,0.5,0.5], color:0xcccccc, puzzle:'clock_hands', loopAppear:1 },
      { id:'whiteboard', label:'📋 Whiteboard', pos:[-3.9,0.5,-1], size:[0.1,1.4,2], color:0xffffff, puzzle:'whiteboard_cipher', loopAppear:1 },
      { id:'cabinet', label:'🗂️ Cabinet', pos:[3,0,-2], size:[0.4,1.6,0.8], color:0x5a5a6a, puzzle:'cabinet_key', loopAppear:2 },
      { id:'printer', label:'🖨️ Printer', pos:[2.5,-0.3,-3], size:[0.5,0.4,0.4], color:0x888888, puzzle:'printer_code', loopAppear:3 },
      { id:'door', label:'🚪 Exit', pos:[0,0,3.5], size:[0.1,2.2,1], color:0x8b6914, puzzle:'exit', loopAppear:1, isExit:true },
    ]
  },
  lab: {
    name: 'Lab Loop',
    objects: [
      { id:'bench', label:'🔬 Lab Bench', pos:[0,-0.5,-3], size:[2.5,0.8,1], color:0x2a3a2a, puzzle:'tube_colors', loopAppear:1 },
      { id:'tubes', label:'🧪 Test Tubes', pos:[1,-0.1,-3.2], size:[0.3,0.6,0.3], color:0x44ffaa, puzzle:'tube_colors', loopAppear:1 },
      { id:'notebook', label:'📓 Notebook', pos:[-1,-0.1,-3.3], size:[0.3,0.05,0.4], color:0xddbb88, puzzle:'notebook_code', loopAppear:2 },
      { id:'flask', label:'⚗️ Flask', pos:[-2,0,-2], size:[0.3,0.5,0.3], color:0x88aaff, puzzle:'flask_key', loopAppear:3 },
      { id:'terminal', label:'💻 Terminal', pos:[3,0.2,-2], size:[0.05,0.8,1], color:0x222222, puzzle:'terminal_pin', loopAppear:2 },
      { id:'door', label:'🚪 Exit', pos:[0,0,3.5], size:[0.1,2.2,1], color:0x8b6914, puzzle:'exit', loopAppear:1, isExit:true },
    ]
  }
};

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, innerWidth/innerHeight, 0.1, 100);
  camera.position.set(0, 0.8, 1.5);

  renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('game-canvas'), antialias:true });
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(devicePixelRatio);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.9;

  clock = new THREE.Clock();

  loopEngine = new LoopEngine(TOTAL_LOOPS, onLoopChange);
  puzzleEngine = new PuzzleEngine(ROOM, DIFFICULTY, loopEngine);

  buildRoom();
  setupLighting();
  setupControls();
  updateHUD();
  startTimer();

  window.addEventListener('resize', () => {
    camera.aspect = innerWidth/innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  });

  showLoading();
}

function buildRoom() {
  const cfg = ROOM_CONFIGS[ROOM] || ROOM_CONFIGS.bedroom;
  document.getElementById('hud-room-name').textContent = cfg.name;

  const wall = (w,h,d,x,y,z,col=0x1a1a2e) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w,h,d), new THREE.MeshLambertMaterial({color:col}));
    m.position.set(x,y,z); m.receiveShadow=true; scene.add(m);
  };
  wall(10,0.1,10, 0,-1,0, 0x111120); // floor
  wall(10,0.1,10, 0,4,0,  0x0d0d1a); // ceiling
  wall(0.1,6,10,  -5,1.5,0); // left
  wall(0.1,6,10,  5,1.5,0);  // right
  wall(10,6,0.1,  0,1.5,-4); // back
  wall(10,6,0.1,  0,1.5,4);  // front

  // Floor grid texture effect
  const gridGeo = new THREE.PlaneGeometry(10,10,10,10);
  const gridMat = new THREE.MeshBasicMaterial({ color:0x222244, wireframe:true, opacity:0.15, transparent:true });
  const grid = new THREE.Mesh(gridGeo, gridMat);
  grid.rotation.x = -Math.PI/2; grid.position.y = -0.94;
  scene.add(grid);

  scene.fog = new THREE.FogExp2(0x080816, 0.025);

  cfg.objects.forEach(obj => addInteractable(obj));
}

function addInteractable(cfg) {
  const geo = new THREE.BoxGeometry(...cfg.size);
  const mat = new THREE.MeshLambertMaterial({ color: cfg.color });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(...cfg.pos);
  mesh.castShadow = true; mesh.receiveShadow = true;
  scene.add(mesh);

  // Glow outline
  const edgeMat = new THREE.MeshBasicMaterial({ color:0xa78bfa, wireframe:true, opacity:0.0, transparent:true });
  const edgeMesh = new THREE.Mesh(new THREE.BoxGeometry(cfg.size[0]+0.05, cfg.size[1]+0.05, cfg.size[2]+0.05), edgeMat);
  edgeMesh.position.set(...cfg.pos);
  scene.add(edgeMesh);

  const data = { ...cfg, mesh, edgeMesh, discovered:false, solved:false };
  interactables.push(data);
}

function setupLighting() {
  const ambient = new THREE.AmbientLight(0x334466, 0.4);
  scene.add(ambient);

  const point = new THREE.PointLight(0xa78bfa, 1.5, 12);
  point.position.set(0, 2.5, 0);
  point.castShadow = true;
  scene.add(point);

  const fill = new THREE.PointLight(0x38bdf8, 0.6, 8);
  fill.position.set(-3, 1.5, -2);
  scene.add(fill);

  // Store refs for loop variation
  window._ambient = ambient;
  window._point = point;
}

function setupControls() {
  document.addEventListener('keydown', e => {
    if (e.key==='w'||e.key==='ArrowUp')    moveState.w=1;
    if (e.key==='s'||e.key==='ArrowDown')  moveState.s=1;
    if (e.key==='a'||e.key==='ArrowLeft')  moveState.a=1;
    if (e.key==='d'||e.key==='ArrowRight') moveState.d=1;
    if (e.key==='e'||e.key==='E') interact();
    if (e.key==='r'||e.key==='R') resetLoop();
    if (e.key==='i'||e.key==='I') togglePanel('inventory-panel');
    if (e.key==='m'||e.key==='M') togglePanel('map-panel');
    if (e.key==='Escape') { closeAllPanels(); exitPointerLock(); }
  });
  document.addEventListener('keyup', e => {
    if (e.key==='w'||e.key==='ArrowUp')    moveState.w=0;
    if (e.key==='s'||e.key==='ArrowDown')  moveState.s=0;
    if (e.key==='a'||e.key==='ArrowLeft')  moveState.a=0;
    if (e.key==='d'||e.key==='ArrowRight') moveState.d=0;
  });

  document.addEventListener('mousemove', e => {
    if (!isPointerLocked) return;
    yaw   -= e.movementX * 0.002;
    pitch -= e.movementY * 0.002;
    pitch  = Math.max(-Math.PI/3, Math.min(Math.PI/3, pitch));
  });

  renderer.domElement.addEventListener('click', () => {
    if (!isPointerLocked) renderer.domElement.requestPointerLock();
  });

  document.addEventListener('pointerlockchange', () => {
    isPointerLocked = document.pointerLockElement === renderer.domElement;
  });

  document.getElementById('hud-inventory-btn').addEventListener('click', () => togglePanel('inventory-panel'));
  document.getElementById('hud-map-btn').addEventListener('click',       () => togglePanel('map-panel'));
  document.getElementById('close-inventory').addEventListener('click',   () => hidePanel('inventory-panel'));
  document.getElementById('close-map').addEventListener('click',         () => hidePanel('map-panel'));
}

function exitPointerLock() { if (document.exitPointerLock) document.exitPointerLock(); }

function update(dt) {
  const speed = 3;
  const dir = new THREE.Vector3();
  if (moveState.w) dir.z -= 1;
  if (moveState.s) dir.z += 1;
  if (moveState.a) dir.x -= 1;
  if (moveState.d) dir.x += 1;
  dir.normalize().multiplyScalar(speed * dt);
  dir.applyEuler(new THREE.Euler(0, yaw, 0));
  camera.position.add(dir);
  camera.position.x = Math.max(-4.5, Math.min(4.5, camera.position.x));
  camera.position.z = Math.max(-3.8, Math.min(3.4, camera.position.z));
  camera.position.y = 0.8;
  camera.rotation.order = 'YXZ';
  camera.rotation.y = yaw;
  camera.rotation.x = pitch;

  checkNearby();
  updateMapPlayer();
}

function checkNearby() {
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(new THREE.Vector2(0,0), camera);

  let found = null;
  let minDist = 99;
  for (const obj of interactables) {
    if (obj.loopAppear && obj.loopAppear > loopEngine.currentLoop) continue;
    const d = camera.position.distanceTo(obj.mesh.position);
    if (d < 2.5 && d < minDist) { minDist = d; found = obj; }
    obj.edgeMesh.material.opacity = 0;
  }

  if (found) {
    found.edgeMesh.material.opacity = 0.4;
    document.getElementById('interact-prompt').classList.remove('hidden');
    document.getElementById('ip-text').textContent = found.isExit ? 'Exit Room' : found.label;
    nearbyObject = found;
  } else {
    document.getElementById('interact-prompt').classList.add('hidden');
    nearbyObject = null;
  }
}

function interact() {
  if (!nearbyObject || !gameStarted) return;
  const obj = nearbyObject;

  if (!obj.discovered) {
    obj.discovered = true;
    loopEngine.recordMemory(`Discovered: ${obj.label}`);
    showMsg(`🔍 Examined ${obj.label}`, 'msg-clue');
  }

  if (obj.isExit) {
    if (puzzleEngine.isEscapeable()) { triggerWin(); }
    else { showMsg(`🔐 Locked. Find ${puzzleEngine.requiredKeys - puzzleEngine.keyFragments} more key fragment(s).`, 'msg-warn'); }
    return;
  }

  if (obj.puzzle && obj.puzzle !== 'exit' && !obj.solved) {
    const avail = puzzleEngine.getPuzzlesForLoop(loopEngine.currentLoop);
    const pz = avail.find(p => p.id === obj.puzzle);
    if (pz) openPuzzle(pz, obj);
    else showMsg(`🔒 This activates in a later loop.`, 'msg-warn');
  } else if (obj.solved) {
    showMsg(`✅ Already solved. Key fragments: ${puzzleEngine.keyFragments}/${puzzleEngine.requiredKeys}`, 'msg-clue');
  }
}

function openPuzzle(pz, obj) {
  exitPointerLock();
  document.getElementById('pm-ico').textContent = pz.icon;
  document.getElementById('pm-title').textContent = pz.title;
  const body = document.getElementById('pm-body');
  body.innerHTML = `<p class="pm-desc">${pz.desc}</p>`;

  if (pz.type === 'key') {
    body.innerHTML += `<div class="pm-result success">🗝️ Key fragment found! +1 fragment</div>`;
    puzzleEngine.solvePuzzle(pz.id);
    obj.solved = true;
    obj.mesh.material.color.setHex(0x4ade80);
    obj.edgeMesh.material.color.setHex(0x4ade80);
    addInventoryItem({ ico: '🗝️', name: 'Key Fragment', desc: `Found: ${pz.title}` });
    updateHUD();
    showMsg(`🗝️ Key Fragment collected! (${puzzleEngine.keyFragments}/${puzzleEngine.requiredKeys})`, 'msg-key');
    setTimeout(() => closePuzzle(), 2000);
  } else if (pz.type === 'number') {
    buildNumpad(body, pz, obj);
  } else if (pz.type === 'sequence') {
    buildSequence(body, pz, obj);
  }

  document.getElementById('puzzle-modal').classList.remove('hidden');
  document.getElementById('pm-close').onclick = closePuzzle;
}

function buildNumpad(body, pz, obj) {
  const display = document.createElement('div');
  display.className = 'numpad';
  let entered = '';
  const disp = document.createElement('div');
  disp.className = 'np-display'; disp.textContent = '____';
  display.appendChild(disp);

  const nums = [1,2,3,4,5,6,7,8,9,'CLR',0,'OK'];
  nums.forEach(n => {
    const btn = document.createElement('button');
    btn.className = 'np-btn' + (n==='CLR'?' np-clear':n==='OK'?' np-enter':'');
    btn.textContent = n;
    btn.addEventListener('click', () => {
      if (n==='CLR') { entered=''; disp.textContent='____'; return; }
      if (n==='OK') {
        if (entered === pz.answer) { solvePuzzleSuccess(pz, obj, body); }
        else { disp.textContent='____'; entered=''; flashFail(disp); }
        return;
      }
      if (entered.length < 4) { entered += n; disp.textContent = entered.padEnd(4,'_'); }
    });
    display.appendChild(btn);
  });
  body.appendChild(display);
}

function buildSequence(body, pz, obj) {
  const wrap = document.createElement('div');
  wrap.className = 'memory-seq';
  const items = Array.isArray(pz.answer) ? pz.answer : ['📘','📗','📙','📕'];
  const shuffled = [...items].sort(() => Math.random()-0.5);
  let selected = [];
  const disp = document.createElement('div');
  disp.className = 'seq-display';
  items.forEach(() => {
    const el = document.createElement('div'); el.className='seq-item'; el.textContent='?'; disp.appendChild(el);
  });
  wrap.appendChild(disp);
  const btns = document.createElement('div'); btns.className='seq-btns';
  shuffled.forEach(ico => {
    const btn = document.createElement('button'); btn.className='seq-btn'; btn.textContent=ico;
    btn.addEventListener('click', () => {
      if (selected.length >= items.length) return;
      selected.push(ico);
      disp.children[selected.length-1].textContent = ico;
      disp.children[selected.length-1].classList.add('lit');
      if (selected.length === items.length) {
        const correct = selected.every((v,i)=>v===items[i]);
        if (correct) solvePuzzleSuccess(pz, obj, wrap.parentElement);
        else { selected=[]; setTimeout(()=>{ Array.from(disp.children).forEach(c=>{c.textContent='?';c.classList.remove('lit');}); flashFail(disp); },600); }
      }
    });
    btns.appendChild(btn);
  });
  wrap.appendChild(btns);
  body.appendChild(wrap);
}

function solvePuzzleSuccess(pz, obj, container) {
  puzzleEngine.solvePuzzle(pz.id);
  obj.solved = true;
  obj.mesh.material.color.setHex(0x4ade80);
  const res = document.createElement('div');
  res.className = 'pm-result success';
  res.textContent = '✅ Correct! Puzzle solved!';
  container.appendChild(res);
  if (pz.type === 'key' || pz.id.includes('key')) {
    addInventoryItem({ ico:'🗝️', name:'Key Fragment', desc:`From: ${pz.title}` });
  } else {
    addInventoryItem({ ico: pz.icon, name: pz.title, desc:'Solved puzzle' });
  }
  updateHUD();
  showMsg(`✅ Solved: ${pz.title}`, 'msg-key');
  setTimeout(() => closePuzzle(), 2000);
}

function flashFail(el) {
  el.style.borderColor = '#fb923c';
  el.style.color = '#fb923c';
  setTimeout(() => { el.style.borderColor=''; el.style.color=''; }, 600);
}

function closePuzzle() {
  document.getElementById('puzzle-modal').classList.add('hidden');
  setTimeout(() => renderer.domElement.requestPointerLock(), 200);
}

function resetLoop() {
  if (gameWon) return;
  showLoopOverlay(() => {
    loopEngine.triggerNextLoop((ok, variation) => {
      if (!ok) { triggerForcedEnd(); return; }
      applyLoopVariation(variation);
      updateHUD();
      showMsg(`🔁 ${loopEngine.getCurrentVariation().hint}`, 'msg-loop');
    });
  });
}

function onLoopChange(loop, variation) { applyLoopVariation(variation); }

function applyLoopVariation(v) {
  if (!v) return;
  window._ambient && (window._ambient.intensity = v.ambientInt || 0.4);
  if (window._point) window._point.color.setHex(v.light || 0xffffff);
  scene.fog && (scene.fog.density = v.fogDensity || 0.025);
  interactables.forEach(obj => {
    if (obj.loopAppear && obj.loopAppear <= loopEngine.currentLoop) {
      obj.mesh.visible = true;
      obj.edgeMesh.visible = true;
    }
  });
}

function showLoopOverlay(onReady) {
  const ov = document.getElementById('loop-overlay');
  const fill = document.getElementById('lo-fill');
  const count = document.getElementById('lo-count');
  const sub = document.getElementById('lo-sub');
  ov.classList.remove('hidden');
  fill.style.width = '0%';
  sub.textContent = loopEngine.isLastLoop()
    ? '⚠️ This is the final loop. Escape now or be trapped forever.'
    : 'The room resets. But you remember everything.';
  count.textContent = `Entering Loop ${loopEngine.currentLoop + 1}...`;
  let p = 0;
  const iv = setInterval(() => {
    p += 2; fill.style.width = p + '%';
    if (p >= 100) { clearInterval(iv); ov.classList.add('hidden'); if (onReady) onReady(); }
  }, 45);
}

function triggerWin() {
  gameWon = true;
  clearInterval(timerInterval);
  exitPointerLock();
  const summary = loopEngine.getSummary();
  document.getElementById('ws-sub').textContent = `You escaped in ${summary.totalTime} using ${summary.loopsUsed} loop(s)!`;
  const statsEl = document.getElementById('ws-stats');
  statsEl.innerHTML = `
    <div class="ws-stat"><span class="wss-val">${summary.totalTime}</span><span class="wss-lbl">Time</span></div>
    <div class="ws-stat"><span class="wss-val">${summary.loopsUsed}</span><span class="wss-lbl">Loops Used</span></div>
    <div class="ws-stat"><span class="wss-val">${puzzleEngine.solved.size}</span><span class="wss-lbl">Puzzles Solved</span></div>`;
  document.getElementById('win-screen').classList.remove('hidden');
  document.getElementById('ws-share').addEventListener('click', () => {
    const url = `${location.origin}${location.pathname}?room=${ROOM}&difficulty=${DIFFICULTY}`;
    navigator.clipboard?.writeText(url).then(() => showMsg('🔗 Room link copied!','msg-key'));
  });
}

function triggerForcedEnd() {
  showMsg('⚠️ All loops exhausted! The room resets permanently...', 'msg-warn');
  setTimeout(() => window.location.href = 'upload.html', 3000);
}

function startTimer() {
  const el = document.getElementById('hud-timer');
  timerInterval = setInterval(() => {
    if (!gameStarted || gameWon) return;
    el.textContent = `⏱ ${loopEngine.getElapsedTime()}`;
  }, 1000);
}

function updateHUD() {
  const cfg = ROOM_CONFIGS[ROOM] || ROOM_CONFIGS.bedroom;
  document.getElementById('current-loop').textContent = loopEngine.currentLoop;
  document.getElementById('total-loops').textContent  = loopEngine.totalLoops;
  document.getElementById('hud-found').textContent = `🗝️ ${puzzleEngine.keyFragments}/${puzzleEngine.requiredKeys}`;
  const barsEl = document.getElementById('ld-bars');
  barsEl.innerHTML = '';
  for (let i=1; i<=loopEngine.totalLoops; i++) {
    const b = document.createElement('div');
    b.className = 'ld-bar' + (i < loopEngine.currentLoop ? ' done' : i === loopEngine.currentLoop ? ' current' : '');
    barsEl.appendChild(b);
  }
}

function updateMapPlayer() {
  const el = document.getElementById('mm-player');
  if (!el) return;
  const px = ((camera.position.x + 5) / 10) * 100;
  const pz = ((camera.position.z + 4) / 8) * 100;
  el.style.left = Math.max(5, Math.min(95, px)) + '%';
  el.style.top  = Math.max(5, Math.min(95, pz)) + '%';
}

function addInventoryItem(item) {
  inventory.push(item);
  const cont = document.getElementById('inventory-content');
  if (inventory.length === 1) cont.innerHTML = '';
  const div = document.createElement('div'); div.className='inv-item';
  div.innerHTML = `<span class="ii-ico">${item.ico}</span><div class="ii-info"><div class="ii-name">${item.name}</div><div class="ii-desc">${item.desc}</div></div>`;
  cont.appendChild(div);
}

function showMsg(text, cls='') {
  const feed = document.getElementById('msg-feed');
  const el = document.createElement('div');
  el.className = `msg ${cls}`; el.textContent = text;
  feed.appendChild(el);
  setTimeout(() => { el.style.opacity='0'; el.style.transition='opacity 0.5s'; setTimeout(()=>el.remove(),500); }, 3500);
}

function togglePanel(id) {
  const el = document.getElementById(id);
  el.classList.contains('hidden') ? showPanel(id) : hidePanel(id);
}
function showPanel(id) { closeAllPanels(); document.getElementById(id).classList.remove('hidden'); exitPointerLock(); }
function hidePanel(id) { document.getElementById(id).classList.add('hidden'); }
function closeAllPanels() { ['inventory-panel','map-panel'].forEach(hidePanel); }

function showLoading() {
  const hints = ['Memory is your only weapon.','Objects change between loops.','The exit unlocks when you have enough keys.','Watch for clues that evolve across loops.'];
  let p = 0;
  const fill = document.getElementById('ls-fill');
  const text = document.getElementById('ls-text');
  const hint = document.getElementById('ls-hint');
  const steps = ['Initializing Loop Engine...','Loading Room Geometry...','Injecting Puzzles...','Activating Time Loop...','Ready.'];
  let si = 0;
  hint.textContent = hints[Math.floor(Math.random()*hints.length)];
  const iv = setInterval(() => {
    p += 1.5; fill.style.width = p + '%';
    if (p % 20 < 1.5 && si < steps.length) { text.textContent = steps[si++]; }
    if (p >= 100) {
      clearInterval(iv);
      setTimeout(() => {
        document.getElementById('loading-screen').classList.add('hidden');
        gameStarted = true;
        showMsg(`🔁 ${loopEngine.getCurrentVariation().hint}`, 'msg-loop');
        renderer.domElement.requestPointerLock();
      }, 400);
    }
  }, 40);
}

function animate() {
  requestAnimationFrame(animate);
  const dt = clock.getDelta();
  if (gameStarted && !gameWon) update(dt);
  renderer.render(scene, camera);
}

init();
animate();
