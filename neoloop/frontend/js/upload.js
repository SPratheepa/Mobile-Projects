// ===== NEOLOOP UPLOAD PAGE JS =====
const ROOM_DATA = {
  bedroom: {
    name: 'Bedroom', icon: '🛏️',
    objects: [
      { ico: '🛏️', name: 'Bed', role: 'Hidden Compartment' },
      { ico: '🪞', name: 'Mirror', role: 'Reality Clue' },
      { ico: '💡', name: 'Lamp', role: 'Sound Trigger' },
      { ico: '🗄️', name: 'Wardrobe', role: 'Key Hiding Spot' },
      { ico: '📚', name: 'Bookshelf', role: 'Pattern Lock' },
      { ico: '🪟', name: 'Window', role: 'Time Indicator' },
    ],
    puzzles: [
      { ico: '🔑', name: 'Key under pillow (Loop 3)', loop: 'Loop 3' },
      { ico: '🪞', name: 'Mirror shows reversed code', loop: 'Loop 1' },
      { ico: '📖', name: 'Book order = combination', loop: 'Loop 2' },
      { ico: '💡', name: 'Lamp flickers in morse code', loop: 'Loop 4' },
    ]
  },
  office: {
    name: 'Office', icon: '🖥️',
    objects: [
      { ico: '🖥️', name: 'Monitor', role: 'Digital Clue' },
      { ico: '🗂️', name: 'Filing Cabinet', role: 'Key Hiding Spot' },
      { ico: '🕐', name: 'Wall Clock', role: 'Loop Trigger' },
      { ico: '📋', name: 'Whiteboard', role: 'Cipher Board' },
      { ico: '🖨️', name: 'Printer', role: 'Clue Dispenser' },
      { ico: '🚪', name: 'Door', role: 'Loop Reset' },
    ],
    puzzles: [
      { ico: '🔐', name: 'Password on sticky note (Loop 5)', loop: 'Loop 5' },
      { ico: '📋', name: 'Whiteboard numbers = code', loop: 'Loop 2' },
      { ico: '🕐', name: 'Clock hands point to drawer', loop: 'Loop 1' },
      { ico: '🖨️', name: 'Printer outputs cipher key', loop: 'Loop 3' },
    ]
  },
  lab: {
    name: 'Lab', icon: '🔬',
    objects: [
      { ico: '🔬', name: 'Microscope', role: 'Visual Clue' },
      { ico: '🧪', name: 'Test Tubes', role: 'Color Code' },
      { ico: '⚗️', name: 'Flask', role: 'Hidden Key' },
      { ico: '📓', name: 'Lab Notebook', role: 'Cipher Text' },
      { ico: '🧲', name: 'Magnet Board', role: 'Pattern Lock' },
      { ico: '💻', name: 'Terminal', role: 'Digital Lock' },
    ],
    puzzles: [
      { ico: '🧪', name: 'Tube colors = frequency code', loop: 'Loop 1' },
      { ico: '📓', name: 'Notebook entry changes each loop', loop: 'All Loops' },
      { ico: '💻', name: 'Terminal requires 4-digit pin', loop: 'Loop 4' },
      { ico: '⚗️', name: 'Flask glow reveals hidden key', loop: 'Loop 5' },
    ]
  }
};

const AI_PROMPTS_RESPONSES = [
  { keywords: ['haunted','ghost'], name: 'Haunted Manor Room', icon: '👻' },
  { keywords: ['hospital','medical'], name: 'Abandoned Hospital Ward', icon: '🏥' },
  { keywords: ['space','sci-fi','scifi'], name: 'Space Station Module', icon: '🚀' },
  { keywords: ['library','book'], name: 'Ancient Library', icon: '📚' },
  { keywords: ['prison','jail','cell'], name: 'Prison Cell Block', icon: '⛓️' },
];

const LOG_LINES = [
  '> Parsing image metadata...',
  '> Running depth estimation model...',
  '> Segmenting room boundaries...',
  '> Extracting object features...',
  '> Building scene graph nodes...',
  '> Applying room-to-logic mapping...',
  '> Generating loop variation seeds...',
  '> Puzzle injection complete ✓',
];

let selectedRoom = null;
let currentStep = 1;
let gameConfig = { difficulty: 'easy', mode: 'escape', loops: 5, share: true };

// DOM refs
const step1 = document.getElementById('step-1');
const step2 = document.getElementById('step-2');
const step3 = document.getElementById('step-3');
const stepIndicator = document.getElementById('step-indicator');
const panelTitle = document.getElementById('panel-title');
const panelDesc = document.getElementById('panel-desc');

function setStep(n) {
  currentStep = n;
  [step1, step2, step3].forEach((s, i) => s.classList.toggle('hidden', i + 1 !== n));
  stepIndicator.textContent = `Step ${n} of 3`;
  const titles = ['Upload Your Room', 'AI Processing...', 'Configure & Play'];
  const descs = [
    'Drop photos or video. Our AI reconstructs your space and injects puzzles.',
    'Sit tight — your room is being transformed into a time loop escape room.',
    'Customize your experience and enter the loop.'
  ];
  panelTitle.textContent = titles[n - 1];
  panelDesc.textContent = descs[n - 1];
}

// Drop zone
const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');

dropZone.addEventListener('dragover', e => { e.preventDefault(); dropZone.classList.add('dragover'); });
dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
dropZone.addEventListener('drop', e => {
  e.preventDefault(); dropZone.classList.remove('dragover');
  const files = e.dataTransfer.files;
  if (files.length) handleUpload('Uploaded Room');
});
fileInput.addEventListener('change', () => {
  if (fileInput.files.length) handleUpload('Your Room');
});
dropZone.addEventListener('click', () => fileInput.click());

// Demo cards
document.querySelectorAll('.demo-card').forEach(card => {
  card.addEventListener('click', () => {
    document.querySelectorAll('.demo-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    selectedRoom = card.dataset.room;
    setTimeout(() => startProcessing(selectedRoom), 300);
  });
});

// AI Generate
document.getElementById('ai-gen-btn').addEventListener('click', () => {
  const prompt = document.getElementById('ai-prompt-input').value.trim();
  if (!prompt) { document.getElementById('ai-prompt-input').style.borderColor = 'rgba(251,146,60,0.6)'; return; }
  const lower = prompt.toLowerCase();
  let matched = AI_PROMPTS_RESPONSES.find(r => r.keywords.some(k => lower.includes(k)));
  if (!matched) matched = { name: 'Custom AI Room: ' + prompt.slice(0, 30), icon: '🤖' };
  startProcessing('ai', matched);
});

// File upload handler
function handleUpload(roomName) {
  selectedRoom = 'uploaded';
  startProcessing('uploaded', { name: roomName, icon: '🏠' });
}

function startProcessing(roomKey, aiData = null) {
  setStep(2);
  updatePreviewStatus('active', 'Processing...');

  const procSteps = ['proc-1','proc-2','proc-3','proc-4'];
  const fills = ['pf-1','pf-2','pf-3','pf-4'];
  const logEl = document.getElementById('proc-log');
  let stepIdx = 0;
  let logIdx = 0;

  const logInterval = setInterval(() => {
    if (logIdx < LOG_LINES.length) {
      logEl.innerHTML += LOG_LINES[logIdx] + '\n';
      logEl.scrollTop = logEl.scrollHeight;
      logIdx++;
    }
  }, 500);

  function runProcStep(i) {
    if (i >= procSteps.length) {
      clearInterval(logInterval);
      setTimeout(() => {
        const rData = roomKey === 'ai' ? aiData :
          (ROOM_DATA[roomKey] || { name: aiData?.name || 'Custom Room', objects: getGenericObjects(), puzzles: getGenericPuzzles() });
        populatePreview(rData);
        setStep(3);
        updatePreviewStatus('done', 'Ready to Play');
      }, 600);
      return;
    }
    const step = document.getElementById(procSteps[i]);
    const fill = document.getElementById(fills[i]);
    step.classList.add('active');
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 18 + 5;
      if (progress >= 100) { progress = 100; clearInterval(interval); step.classList.remove('active'); step.classList.add('done'); setTimeout(() => runProcStep(i + 1), 300); }
      fill.style.width = progress + '%';
    }, 120);
  }
  runProcStep(0);
}

function getGenericObjects() {
  return [
    { ico: '🚪', name: 'Door', role: 'Loop Reset' },
    { ico: '💡', name: 'Light', role: 'Sound Trigger' },
    { ico: '📦', name: 'Box', role: 'Hidden Key' },
    { ico: '🪟', name: 'Window', role: 'Time Clue' },
  ];
}
function getGenericPuzzles() {
  return [
    { ico: '🔑', name: 'Key hidden in unexpected spot', loop: 'Loop 3' },
    { ico: '🔢', name: 'Number sequence on wall', loop: 'Loop 2' },
    { ico: '🪞', name: 'Reflection reveals hidden code', loop: 'Loop 1' },
  ];
}

function populatePreview(rData) {
  const doList = document.getElementById('do-list');
  doList.innerHTML = '';
  const objs = rData.objects || getGenericObjects();
  objs.forEach((o, i) => {
    const el = document.createElement('div');
    el.className = 'obj-tag';
    el.style.animationDelay = (i * 0.08) + 's';
    el.innerHTML = `<span class="obj-tag-ico">${o.ico}</span><span class="obj-tag-name">${o.name}</span><span class="obj-tag-role">${o.role}</span>`;
    doList.appendChild(el);
  });

  const pp2List = document.getElementById('pp2-list');
  pp2List.innerHTML = '';
  const pzls = rData.puzzles || getGenericPuzzles();
  pzls.forEach((p, i) => {
    const el = document.createElement('div');
    el.className = 'puzzle-tag';
    el.style.animationDelay = (i * 0.1) + 's';
    el.innerHTML = `<span class="pt-ico">${p.ico}</span><span class="pt-name">${p.name}</span><span class="pt-loop">${p.loop}</span>`;
    pp2List.appendChild(el);
  });

  // Show 3D room preview
  const rp = document.getElementById('room-preview');
  rp.innerHTML = `<div class="mini-3d-room" id="mini-room"></div>`;
  buildMiniRoom(rData);
}

function buildMiniRoom(rData) {
  const container = document.getElementById('mini-room');
  if (!container) return;
  container.style.cssText = `
    width:100%; height:100%; position:relative;
    background: linear-gradient(160deg, #0a0820 0%, #060614 100%);
    overflow: hidden; display: flex; align-items: flex-end; justify-content: center;
  `;
  const objs = rData.objects || [];
  const colors = ['rgba(167,139,250,0.6)', 'rgba(56,189,248,0.6)', 'rgba(45,212,191,0.6)', 'rgba(251,191,36,0.6)'];
  let html = `<div style="position:absolute;bottom:0;left:0;right:0;height:40px;background:linear-gradient(180deg,#0c0c28,#060614);border-top:1px solid rgba(167,139,250,0.15)"></div>`;
  html += `<div style="position:absolute;top:0;left:0;right:0;height:55%;background:linear-gradient(180deg,#08081a,#0c0c22)"></div>`;
  const positions = ['15%','28%','45%','62%','75%','88%'];
  objs.slice(0,6).forEach((o, i) => {
    const col = colors[i % colors.length];
    const left = positions[i] || `${15 + i * 14}%`;
    const size = 40 + Math.random() * 20;
    const bottom = 40 + Math.random() * 30;
    html += `<div style="position:absolute;left:${left};bottom:${bottom}px;display:flex;flex-direction:column;align-items:center;gap:4px;cursor:pointer;transition:transform 0.2s;" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform=''">
      <div style="font-size:${size * 0.6}px">${o.ico}</div>
      <div style="width:${size}px;height:${size * 0.8}px;background:${col.replace('0.6','0.15')};border:1px solid ${col};border-radius:6px;box-shadow:0 0 15px ${col.replace('0.6','0.3')}"></div>
      <span style="font-size:9px;font-family:monospace;color:rgba(255,255,255,0.4)">${o.name.slice(0,8)}</span>
    </div>`;
  });
  container.innerHTML = html;
}

function updatePreviewStatus(state, text) {
  const statusEl = document.getElementById('pp-status');
  const dot = statusEl.querySelector('.pp-dot');
  dot.className = `pp-dot ${state}`;
  statusEl.innerHTML = `<span class="pp-dot ${state}"></span>${text}`;
}

// Config options
document.getElementById('diff-opts').querySelectorAll('.cfg-opt').forEach(btn => {
  btn.addEventListener('click', () => {
    document.getElementById('diff-opts').querySelectorAll('.cfg-opt').forEach(b => b.classList.remove('active'));
    btn.classList.add('active'); gameConfig.difficulty = btn.dataset.val;
  });
});
document.getElementById('mode-opts').querySelectorAll('.cfg-opt').forEach(btn => {
  btn.addEventListener('click', () => {
    document.getElementById('mode-opts').querySelectorAll('.cfg-opt').forEach(b => b.classList.remove('active'));
    btn.classList.add('active'); gameConfig.mode = btn.dataset.val;
  });
});
const loopCount = document.getElementById('loop-count');
const loopVal = document.getElementById('loop-count-val');
loopCount.addEventListener('input', () => { loopVal.textContent = loopCount.value + ' Loops'; gameConfig.loops = parseInt(loopCount.value); });
document.getElementById('share-toggle').addEventListener('change', e => { gameConfig.share = e.target.checked; });

// Start Game
document.getElementById(
    'start-game-btn'
).addEventListener(
    'click',
    async () => {

        await createRoomInBackend();

        const params =
            new URLSearchParams({

                room:
                    selectedRoom
                    || 'bedroom',

                ...gameConfig
            });

        window.location.href =
            `game.html?${params.toString()}`;
    }
);

// Handle URL params (demo mode)
const urlP = new URLSearchParams(window.location.search);
if (urlP.get('demo') === 'true') {
  setTimeout(() => {
    document.getElementById('demo-bedroom').click();
  }, 800);
} else if (urlP.get('demo') === 'explore') {
  setTimeout(() => { document.getElementById('demo-office').click(); }, 800);
} else if (urlP.get('demo') === 'ai') {
  document.getElementById('ai-prompt-input').value = 'Haunted Victorian library with ancient puzzles';
  setTimeout(() => { document.getElementById('ai-gen-btn').click(); }, 1000);
}
async function createRoomInBackend() {

    try {

        const roomName = prompt(
            "Enter Room Name"
        );

        if (!roomName) {
            return;
        }

        const payload = {

            name: roomName,

            description:
                "Created from frontend prototype",

            difficulty:
                gameConfig.difficulty.toUpperCase(),

            estimated_time: 30
        };

        const response =
            await apiRequest(
                "/api/rooms",
                "POST",
                payload,
                true
            );

        console.log(
            "Room Created",
            response
        );

        alert(
            "Room Created Successfully"
        );

    }
    catch(ex) {

        console.error(ex);

        alert(
            "Failed to create room"
        );
    }
}