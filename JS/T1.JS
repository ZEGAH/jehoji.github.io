/* ========= Efek Ketik–Hapus ========= */
(function(){
  const lines = [
    "Hai, aku Jehoji. aku Ai yang Dibuat oleh tim ZEGAH CREATIVE PROJECT",
    "Aku Jehoji, atau Jehovah Jireh—Tuhan akan menyediakan.",
    "Aku siap membantumu.",
    "Jadilah berkat bagi banyak orang."
    
  ];
  const el = document.getElementById("typed");
  let iLine = 0, iChar = 0, deleting = false;

  function loop(){
    const full = lines[iLine];

    if(!deleting){
      el.textContent = full.slice(0, ++iChar);
      if(iChar === full.length){ deleting = true; setTimeout(loop, 1400); return; }
      setTimeout(loop, 38);
    }else{
      el.textContent = full.slice(0, --iChar);
      if(iChar === 0){ deleting = false; iLine = (iLine+1) % lines.length; setTimeout(loop, 260); return; }
      setTimeout(loop, 24);
    }
  }
  loop();
})();

/* ========= Jaringan Interaktif (tanpa library) ========= */
(function(){
  const canvas = document.getElementById("network");
  const ctx = canvas.getContext("2d");

  let W,H,DPR = Math.max(1, Math.floor(window.devicePixelRatio || 1));
  function resize(){
    W = canvas.clientWidth; H = canvas.clientHeight;
    canvas.width = W * DPR; canvas.height = H * DPR;
    ctx.setTransform(DPR,0,0,DPR,0,0);
  }
  window.addEventListener("resize", resize, {passive:true});
  resize();

  const N = 90;              // jumlah partikel
  const SPEED = 0.35;        // kecepatan
  const LINK_DIST = 140;     // jarak maksimal koneksi
  const MOUSE_HOLE = 110;    // radius “putus” di sekitar mouse

  const nodes = [];
  function rand(n){ return Math.random()*n }
  for(let i=0;i<N;i++){
    nodes.push({
      x: rand(W), y: rand(H),
      vx: (Math.random()-0.5)*SPEED,
      vy: (Math.random()-0.5)*SPEED
    });
  }

  const mouse = {x:null,y:null,active:false};
  window.addEventListener("mousemove", e=>{
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
    mouse.active = true;
  });
  window.addEventListener("mouseleave", ()=>{ mouse.active = false; });

  function tick(){
    ctx.clearRect(0,0,W,H);

    // gerak & bounce + gambar titik
    for(const p of nodes){
      p.x += p.vx; p.y += p.vy;
      if(p.x < 0 || p.x > W) p.vx *= -1;
      if(p.y < 0 || p.y > H) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, 2, 0, Math.PI*2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
    }

    // gambar garis koneksi
    for(let i=0;i<nodes.length;i++){
      for(let j=i+1;j<nodes.length;j++){
        const a = nodes[i], b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d  = Math.hypot(dx, dy);
        if(d > LINK_DIST) continue;

        let alpha = 0.34 * (1 - d / LINK_DIST);

        if(mouse.active){
          const dA = Math.hypot(a.x - mouse.x, a.y - mouse.y);
          const dB = Math.hypot(b.x - mouse.x, b.y - mouse.y);
          const near = Math.min(dA, dB);

          if(near < MOUSE_HOLE){
            // Fade kuat saat kursor dekat -> efek "putus"
            alpha *= Math.max(0, (near / MOUSE_HOLE) ** 2);
            if(alpha < 0.02) continue; // benar-benar putus
          }
        }

        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(255,255,255,${alpha.toFixed(3)})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    requestAnimationFrame(tick);
  }
  tick();
})();
