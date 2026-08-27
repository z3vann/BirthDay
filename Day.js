// ============================================
// FIX: Buat elemen musicCtrl & bgMusic secara dinamis
// (harus di paling atas, sebelum dipakai getElementById di bawah)
// ============================================
const musicCtrlDiv = document.createElement('div');
musicCtrlDiv.id = 'musicCtrl';
musicCtrlDiv.className = 'hidden';
musicCtrlDiv.innerHTML = '<button id="musicToggle" type="button">🔇</button>';
document.body.appendChild(musicCtrlDiv);

const bgMusicEl = document.createElement('audio');
bgMusicEl.id = 'bgMusic';
bgMusicEl.src = 'SnapTik.Net_7599345448838548757.mp3'; // ganti sesuai nama file musikmu
bgMusicEl.loop = true;
document.body.appendChild(bgMusicEl);

// Ambient floating hearts
  const heartsWrap = document.getElementById('ambientHearts');
  const heartGlyphs = ['🌟','💕','🌸','💖','⭐'];
  for(let i=0;i<14;i++){
    const h = document.createElement('div');
    h.className = 'heart';
    h.textContent = heartGlyphs[i % heartGlyphs.length];
    h.style.left = (Math.random()*94)+'vw';
    h.style.fontSize = (16 + Math.random()*16)+'px';
    h.style.animationDuration = (8 + Math.random()*8)+'s';
    h.style.animationDelay = (Math.random()*10)+'s';
    heartsWrap.appendChild(h);
  }

  // Name gate
  const gate = document.getElementById('gate');
  const nameInput = document.getElementById('nameInput');
  const gateBtn = document.getElementById('gateBtn');
  const titleName = document.getElementById('titleName');
  const letterGreeting = document.getElementById('letterGreeting');

  const nameWarning = document.getElementById('nameWarning');

  // Music
  const bgMusic = document.getElementById('bgMusic');
  const musicCtrl = document.getElementById('musicCtrl');
  const musicToggle = document.getElementById('musicToggle');
  let musicPlaying = false;

  function playMusic(){
    bgMusic.currentTime = 0;
    bgMusic.play().then(() => {
      musicPlaying = true;
      musicToggle.textContent = '🎵';
    }).catch(() => {
      musicPlaying = false;
      musicToggle.textContent = '🔇';
    });
  }

  function toggleMusic(){
    if(musicPlaying){
      bgMusic.pause();
      musicPlaying = false;
      musicToggle.textContent = '🔇';
    } else {
      playMusic();
    }
  }

  musicToggle.addEventListener('click', toggleMusic);

  function applyName(){
    const name = nameInput.value.trim();
    if(!name.length){
      nameWarning.classList.add('show');
      nameInput.classList.remove('shake');
      void nameInput.offsetWidth;
      nameInput.classList.add('shake');
      nameInput.focus();
      return;
    }
    titleName.textContent = name;
    letterGreeting.textContent = 'Untuk kamu, ' + name;

    // Tutup keyboard virtual (HP) dan pastikan halaman balik ke paling atas
    nameInput.blur();
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });

    gate.classList.add('hidden');
    playMusic();

    // Jaga-jaga: kalau keyboard HP baru nutup belakangan & ikut geser scroll,
    // paksa balik ke atas sekali lagi setelah delay singkat
    setTimeout(() => window.scrollTo({ top: 0, left: 0, behavior: 'auto' }), 150);
  }
  gateBtn.addEventListener('click', applyName);
  nameInput.addEventListener('keydown', e => {
    if(e.key === 'Enter'){
      e.preventDefault();
      applyName();
    }
  });

  // Candles
  const NUM_CANDLES = 5;
  const candlesEl = document.getElementById('candles');
  for(let i=0;i<NUM_CANDLES;i++){
    const c = document.createElement('div');
    c.className = 'candle';
    const f = document.createElement('div');
    f.className = 'flame';
    c.appendChild(f);
    candlesEl.appendChild(c);
  }

  let blown = false;
  document.getElementById('cake-wrap').addEventListener('click', () => {
    if(blown) return;
    blown = true;
    document.querySelectorAll('.flame').forEach((f, idx) => {
      setTimeout(() => f.classList.add('out'), idx*120);
    });
    document.getElementById('hint').style.display = 'none';
    setTimeout(() => {
      document.getElementById('scrollCue').classList.add('show');
      document.getElementById('gallery').classList.add('show');
      document.getElementById('letterSection').classList.add('show');
      burstHearts();
    }, NUM_CANDLES*120 + 300);
  });

  // Heart-shaped confetti burst
  const canvas = document.getElementById('hearts-burst');
  const ctx = canvas.getContext('2d');
  function resize(){ canvas.width = innerWidth; canvas.height = innerHeight; }
  resize();
  window.addEventListener('resize', resize);

  let particles = [];
  const burstColors = ['#ff5d8f', '#e8b44a', '#ffc2d6', '#c92c5c', '#fff9f6'];

  function drawHeart(ctx, size){
    ctx.beginPath();
    const s = size;
    ctx.moveTo(0, s*0.3);
    ctx.bezierCurveTo(0, 0, -s, 0, -s, s*0.3);
    ctx.bezierCurveTo(-s, s*0.7, 0, s*0.9, 0, s*1.2);
    ctx.bezierCurveTo(0, s*0.9, s, s*0.7, s, s*0.3);
    ctx.bezierCurveTo(s, 0, 0, 0, 0, s*0.3);
    ctx.closePath();
  }

  function burstHearts(){
    for(let i=0;i<90;i++){
      particles.push({
        x: window.innerWidth/2 + (Math.random()-0.5)*180,
        y: window.innerHeight*0.38,
        vx: (Math.random()-0.5)*8,
        vy: Math.random()*-9 - 3,
        size: 4 + Math.random()*5,
        color: burstColors[Math.floor(Math.random()*burstColors.length)],
        rot: Math.random()*Math.PI*2,
        vr: (Math.random()-0.5)*0.25,
        life: 0
      });
    }
  }

  function animate(){
    ctx.clearRect(0,0,canvas.width, canvas.height);
    particles.forEach(p => {
      p.vy += 0.2;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      p.life++;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      drawHeart(ctx, p.size);
      ctx.fill();
      ctx.restore();
    });
    particles = particles.filter(p => p.y < canvas.height + 40 && p.life < 420);
    requestAnimationFrame(animate);
  }
  animate();