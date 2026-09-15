
// As imagens já estão no atributo src (Base64). Não sobrescrever com dataset.embedded inexistente.
  const frontImg = document.getElementById('frontImg');
  const backImg = document.getElementById('backImg');
  let rotY = 0;
  const inner = document.getElementById('inner');
  const card = document.getElementById('card');
  const waLink = "https://wa.me/5521990646585";
  card.addEventListener('click', (e) => {
    if(e.target.closest('#phoneHot')) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const isRight = x > rect.width/2;
    const side = isRight ? 'right' : 'left';
    rotY += isRight ? 180 : -180;
    inner.style.transform = `rotateY(${rotY}deg)`;
    registerConsecutiveClick(side);
  });
  document.getElementById('phoneHot').addEventListener('click', (e)=>{
    e.stopPropagation();
  });
  let startX=0;
  card.addEventListener('touchstart', e=>{startX=e.touches[0].clientX}, {passive:true});
  card.addEventListener('touchend', e=>{
    const dx = e.changedTouches[0].clientX - startX;
    if(Math.abs(dx)>30) {
      const side = dx > 0 ? 'left' : 'right';
      rotY += dx>0 ? -180 : 180;
      inner.style.transform = `rotateY(${rotY}deg)`;
      registerConsecutiveClick(side);
    }
  });

  // Desafio: 40 cliques consecutivos para o mesmo lado
  let consecutiveSide = null;
  let consecutiveClicks = 0;
  let audioContext = null;

  function playOldTelephone() {
    try {
      audioContext = audioContext || new (window.AudioContext || window.webkitAudioContext)();
      const ctx = audioContext;
      if (ctx.state === 'suspended') ctx.resume();

      // Toque sintetizado de telefone antigo (dois tons alternados)
      const frequencies = [440, 480];
      const start = ctx.currentTime;
      for (let i = 0; i < 10; i++) {
        const t = start + i * 0.38;
        frequencies.forEach((freq, j) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.value = freq;
          gain.gain.setValueAtTime(0.0001, t);
          gain.gain.exponentialRampToValueAtTime(0.18, t + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.28);
          osc.connect(gain).connect(ctx.destination);
          osc.start(t);
          osc.stop(t + 0.30);
        });
      }
    } catch (err) {
      console.warn('Não foi possível reproduzir o som:', err);
    }
  }

  function launchConfetti() {
    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:99999;';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = innerWidth * dpr;
    canvas.height = innerHeight * dpr;
    ctx.scale(dpr, dpr);

    const pieces = Array.from({length: 220}, () => ({
      x: innerWidth / 2,
      y: innerHeight * 0.35,
      vx: (Math.random() - 0.5) * 13,
      vy: Math.random() * -11 - 4,
      gravity: 0.32 + Math.random() * 0.12,
      size: 5 + Math.random() * 7,
      rotation: Math.random() * Math.PI,
      spin: (Math.random() - 0.5) * 0.3,
      life: 0,
      maxLife: 120 + Math.random() * 80,
      color: ['#ff3b30','#ffcc00','#34c759','#007aff','#af52de','#ff9500'][Math.floor(Math.random()*6)]
    }));

    let frame = 0;
    function animate() {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      pieces.forEach(p => {
        p.life++;
        p.x += p.vx;
        p.vy += p.gravity;
        p.y += p.vy;
        p.rotation += p.spin;
        const alpha = Math.max(0, 1 - p.life / p.maxLife);
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.55);
        ctx.restore();
      });
      frame++;
      if (frame < 190) requestAnimationFrame(animate);
      else canvas.remove();
    }
    requestAnimationFrame(animate);
  }

  function registerConsecutiveClick(side) {
    if (consecutiveSide === side) consecutiveClicks++;
    else {
      consecutiveSide = side;
      consecutiveClicks = 1;
    }

    if (consecutiveClicks === 40) {
      playOldTelephone();
      launchConfetti();
      consecutiveClicks = 0;
      consecutiveSide = null;
    }
  }


  function tamTam() {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    const ctx = new AC();
    const now = ctx.currentTime;

    // Efeito percussivo curto: "TAM TAM"
    [0, 0.28].forEach((delay, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = "sine";
      osc.frequency.setValueAtTime(i === 0 ? 125 : 95, now + delay);
      osc.frequency.exponentialRampToValueAtTime(
        i === 0 ? 55 : 42, now + delay + 0.22
      );

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(700, now + delay);

      gain.gain.setValueAtTime(0.0001, now + delay);
      gain.gain.exponentialRampToValueAtTime(0.55, now + delay + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + 0.35);

      osc.connect(filter).connect(gain).connect(ctx.destination);
      osc.start(now + delay);
      osc.stop(now + delay + 0.38);
    });

    setTimeout(() => ctx.close(), 1200);
  }



  // ===== Controle da janela de Informações adicionais =====
  const infoAddBtn = document.getElementById('infoAddBtn');
  const infoOverlay = document.getElementById('infoOverlay');
  const infoClose = document.getElementById('infoClose');

  function openInfoModal(){
    infoOverlay.classList.add('open');
    infoOverlay.setAttribute('aria-hidden','false');
    document.body.style.overflow='hidden';
    infoClose.focus();
  }

  function closeInfoModal(){
    infoOverlay.classList.remove('open');
    infoOverlay.setAttribute('aria-hidden','true');
    document.body.style.overflow='';
    infoAddBtn.focus();
  }

  infoAddBtn.addEventListener('click',(e)=>{
    e.stopPropagation();
    openInfoModal();
  });
  infoClose.addEventListener('click',(e)=>{
    e.stopPropagation();
    closeInfoModal();
  });
  infoOverlay.addEventListener('click',(e)=>{
    if(e.target===infoOverlay) closeInfoModal();
  });
  document.addEventListener('keydown',(e)=>{
    if(e.key==='Escape' && infoOverlay.classList.contains('open')) closeInfoModal();
  });



  // ===== SISTEMA DE AVALIAÇÕES =====
  const REVIEWS_KEY = 'cartao_welmington_reviews_v1';
  const reviewsBtn = document.getElementById('reviewsBtn');
  const reviewsOverlay = document.getElementById('reviewsOverlay');
  const reviewsClose = document.getElementById('reviewsClose');
  const starButtons = [...document.querySelectorAll('#starPicker .star')];
  const selectedRating = document.getElementById('selectedRating');
  const reviewName = document.getElementById('reviewName');
  const reviewComment = document.getElementById('reviewComment');
  const saveReviewBtn = document.getElementById('saveReviewBtn');
  const exportReviewsBtn = document.getElementById('exportReviewsBtn');
  const reviewsList = document.getElementById('reviewsList');
  const reviewsCountLabel = document.getElementById('reviewsCountLabel');
  let selectedStars = 0;

  function loadReviews(){
    try { return JSON.parse(localStorage.getItem(REVIEWS_KEY) || '[]'); }
    catch(e){ return []; }
  }
  function saveReviews(list){ localStorage.setItem(REVIEWS_KEY, JSON.stringify(list)); }
  function escapeHTML(value){
    return String(value).replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));
  }
  function starsText(n){ return '★'.repeat(n) + '☆'.repeat(5-n); }
  function formatDate(iso){
    try { return new Intl.DateTimeFormat('pt-BR',{dateStyle:'short',timeStyle:'short'}).format(new Date(iso)); }
    catch(e){ return ''; }
  }
  function renderReviews(){
    const list = loadReviews();
    reviewsCountLabel.textContent = `${list.length} ${list.length===1?'avaliação':'avaliações'}`;
    if(!list.length){
      reviewsList.innerHTML='<div class="review-empty">Ainda não há comentários. Seja o primeiro a avaliar!</div>';
      return;
    }
    reviewsList.innerHTML = list.slice().reverse().map(r => `
      <article class="review-card">
        <div class="review-top"><span class="review-author">${escapeHTML(r.name || 'Cliente')}</span><span class="review-date">${escapeHTML(formatDate(r.date))}</span></div>
        <div class="review-card-stars" aria-label="${Number(r.rating)} de 5 estrelas">${starsText(Number(r.rating))}</div>
        ${r.comment ? `<p class="review-comment">${escapeHTML(r.comment)}</p>` : ''}
      </article>`).join('');
  }
  function setStars(value){
    selectedStars=value;
    starButtons.forEach(btn=>btn.classList.toggle('active', Number(btn.dataset.value)<=value));
    selectedRating.textContent = value ? `${value} ${value===1?'estrela':'estrelas'} selecionada${value===1?'':'s'}` : 'Escolha de 1 a 5 estrelas';
  }
  function openReviews(){
    renderReviews();
    reviewsOverlay.classList.remove('closing');
    reviewsOverlay.classList.add('open');
    reviewsOverlay.setAttribute('aria-hidden','false');
    document.body.style.overflow='hidden';
    setTimeout(()=>starButtons[0]?.focus(),80);
  }
  function closeReviews(){
    if(!reviewsOverlay.classList.contains('open')) return;
    reviewsOverlay.classList.add('closing');
    setTimeout(()=>{
      reviewsOverlay.classList.remove('open','closing');
      reviewsOverlay.setAttribute('aria-hidden','true');
      document.body.style.overflow='';
      reviewsBtn?.focus();
    },230);
  }
  starButtons.forEach(btn=>{
    btn.addEventListener('mouseenter',()=>setStars(Number(btn.dataset.value)));
    btn.addEventListener('focus',()=>setStars(Number(btn.dataset.value)));
    btn.addEventListener('click',()=>setStars(Number(btn.dataset.value)));
  });
  reviewsBtn.addEventListener('click',e=>{e.stopPropagation();openReviews();});
  reviewsClose.addEventListener('click',e=>{e.stopPropagation();closeReviews();});
  reviewsOverlay.addEventListener('click',e=>{if(e.target===reviewsOverlay)closeReviews();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape' && reviewsOverlay.classList.contains('open')) closeReviews();});
  saveReviewBtn.addEventListener('click',()=>{
    if(!selectedStars){ alert('Escolha uma nota de 1 a 5 estrelas.'); return; }
    const list=loadReviews();
    list.push({rating:selectedStars,name:reviewName.value.trim() || 'Cliente',comment:reviewComment.value.trim(),date:new Date().toISOString()});
    saveReviews(list);
    reviewName.value=''; reviewComment.value=''; setStars(0); renderReviews();
    alert('Avaliação salva neste navegador.');
  });
  exportReviewsBtn.addEventListener('click',()=>{
    const data=JSON.stringify(loadReviews(),null,2);
    const blob=new Blob([data],{type:'application/json'});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a'); a.href=url; a.download='reviews.json'; a.click();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
  });
