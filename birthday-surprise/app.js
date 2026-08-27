'use strict';

const PHOTO_BASE = window.location.hostname.endsWith('github.io') ? '../photo_min/' : './photo_min/';
const motions = ['motion-rise', 'motion-slide', 'motion-float'];
const chapters = [
  ['最初认识的你', '那时我还不知道，后来会有这么多关于你的心动。', '故事的第一页，是你和小猫一样可爱的样子。'],
  ['你的小世界', '小猫、花和夜晚，原来温柔有这么多种样子。', '我开始想认识你所有细小的喜欢。'],
  ['灯光落下的瞬间', '有些夜晚没有礼物，却因为你变成了节日。', '原来陪伴本身，就足够让平凡发亮。'],
  ['并肩的日常', '坐在你对面、牵着你的手，时间就有了方向。', '有你在身边，连日常也值得反复回看。'],
  ['被记住的细节', '我想把每一次回头，都留在这一页。', '因为关于你的瞬间，从来都不是小事。'],
  ['远一点的地方', '城市的灯、旅行的路，而你比风景更让人记得。', '我们去过的地方，都因为你有了名字。'],
  ['靠近一点', '镜头里的你、身边的你，都是我想珍藏的你。', '我总觉得，怎么都看不够。'],
  ['我们的小宇宙', '一杯饮料、一个影子，也能成为只属于我们的暗号。', '原来快乐可以这么具体。'],
  ['等你出现', '从一顿饭、一次看展，到每个想分享的瞬间。', '我慢慢明白，等待的答案一直是你。'],
  ['海边的约定', '夕阳替我收下那句：想牵着你走很远。', '海风知道，往后的路也想和你一起走。'],
  ['听歌与远行', '车窗、海风、雨伞；故事在路上慢慢有了旋律。', '你出现后，每首歌都像写给我们。'],
  ['眼里的风景', '你举起相机的时候，也成为了最好的画面。', '世间的好风景，和你比起来还是逊色一些。'],
  ['举杯、夜色、秋天', '所有好天气都想和你一起经过。', '我喜欢的从来不只是风景，是风景里有你。'],
  ['去看海', '教堂、海岸和冬天的风，仍然记得你的笑。', '愿以后每一次出发，身边都还是你。'],
  ['给你的祝福', '愿往后余生的每一季，都是你喜欢的样子。', '愿你一直明亮，也一直被世界温柔对待。'],
  ['最爱的人', '生日快乐，愿你被爱，也永远自在。', '今天的主角，是我最想好好祝福的人。'],
  ['最后一份礼物', '谢谢你来到这世上，也谢谢你走进我的世界。', '故事还没结束，接下来的每一页，也想和你一起写。']
].map(([title, note, line], index) => ({
  title,
  note,
  line,
  photos: Array.from({ length: 4 }, (_, offset) => index * 4 + offset + 1),
  motion: motions[index % motions.length]
}));

const experience = document.getElementById('experience');
const beginButton = document.getElementById('beginButton');
const nextButton = document.getElementById('nextButton');
const restartButton = document.getElementById('restartButton');
const music = document.getElementById('music');
const introScene = document.querySelector('.intro-scene');
const introParticlesCanvas = document.getElementById('introParticles');
const titleEl = document.getElementById('chapter-title');
const noteEl = document.getElementById('chapter-note');
const lineEl = document.getElementById('chapter-line');
const photoGrid = document.getElementById('photoGrid');
const memoryStage = document.getElementById('memoryStage');
const constellation = document.getElementById('constellation');
let currentChapter = 0;

function photoUrl(number) {
  return `${PHOTO_BASE}${String(number).padStart(2, '0')}.jpg`;
}

function renderChapter() {
  const chapter = chapters[currentChapter];
  titleEl.textContent = chapter.title;
  noteEl.textContent = chapter.note;
  lineEl.textContent = chapter.line;
  nextButton.textContent = currentChapter === chapters.length - 1 ? '拆开最后一份' : '打开下一份';
  memoryStage.className = `memory-stage ${chapter.motion}`;
  photoGrid.innerHTML = chapter.photos.map((number, index) => `
    <figure class="photo-card" style="--i:${index}">
      <div class="photo-image-frame">
        <img src="${photoUrl(number)}" alt="第 ${number} 张回忆照片" loading="eager">
      </div>
    </figure>
  `).join('');
  photoGrid.querySelectorAll('img').forEach(preparePortraitPhoto);
}

function startExperience() {
  playMusic();
  currentChapter = 0;
  renderChapter();
  experience.dataset.stage = 'memory';
}

function makeConstellation() {
  constellation.innerHTML = '';
  Array.from({ length: 68 }, (_, index) => {
    const angle = (Math.PI * 2 * index) / 68;
    const x = 16 * Math.sin(angle) ** 3;
    const y = 13 * Math.cos(angle) - 5 * Math.cos(2 * angle) - 2 * Math.cos(3 * angle) - Math.cos(4 * angle);
    const image = document.createElement('img');
    image.src = photoUrl(index + 1);
    image.alt = '';
    image.style.left = `${50 + (x / 16) * 45}%`;
    image.style.top = `${50 - (y / 34) * 43}%`;
    image.style.transform = 'translate(-50%, -50%)';
    const orientThumbnail = () => {
      if (image.naturalWidth > image.naturalHeight) image.classList.add('portrait-rotated-thumb');
    };
    if (image.complete) orientThumbnail();
    else image.addEventListener('load', orientThumbnail, { once: true });
    constellation.appendChild(image);
  });
}

function preparePortraitPhoto(image) {
  const orient = () => {
    if (image.naturalWidth <= image.naturalHeight) return;
    const frame = image.closest('.photo-image-frame');
    const width = frame.clientWidth;
    const height = frame.clientHeight;
    const portraitRatio = image.naturalHeight / image.naturalWidth;
    const finalWidth = Math.min(width, height * portraitRatio);
    const finalHeight = finalWidth / portraitRatio;
    image.classList.add('portrait-rotated');
    image.style.width = `${finalHeight}px`;
    image.style.height = `${finalWidth}px`;
  };
  if (image.complete) orient();
  else image.addEventListener('load', orient, { once: true });
}

function showNextChapter() {
  if (currentChapter === chapters.length - 1) {
    makeConstellation();
    experience.dataset.stage = 'finale';
    return;
  }
  currentChapter += 1;
  renderChapter();
}

beginButton.addEventListener('click', startExperience);
nextButton.addEventListener('click', showNextChapter);
restartButton.addEventListener('click', startExperience);

function playMusic() {
  music.volume = 0.72;
  if (!music.paused) return;
  music.play().catch(() => {});
}

playMusic();
music.addEventListener('canplaythrough', playMusic, { once: true });
document.addEventListener('pointerdown', playMusic, { once: true });
document.addEventListener('keydown', playMusic, { once: true });
window.addEventListener('focus', playMusic);
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) playMusic();
});

function textLines(element) {
  return element.innerText.split('\n').map((line) => line.trim()).filter(Boolean);
}

function startIntroAssembly() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  const width = window.innerWidth;
  const height = window.innerHeight;
  introParticlesCanvas.width = Math.floor(width * ratio);
  introParticlesCanvas.height = Math.floor(height * ratio);
  const particleContext = introParticlesCanvas.getContext('2d');
  particleContext.setTransform(ratio, 0, 0, ratio, 0, 0);

  const source = document.createElement('canvas');
  source.width = introParticlesCanvas.width;
  source.height = introParticlesCanvas.height;
  const sourceContext = source.getContext('2d');
  sourceContext.setTransform(ratio, 0, 0, ratio, 0, 0);
  sourceContext.textAlign = 'center';
  sourceContext.textBaseline = 'middle';

  const elements = [
    document.getElementById('introEyebrow'),
    document.getElementById('introDate'),
    document.getElementById('intro-title'),
    document.getElementById('introMessage'),
    beginButton,
    document.getElementById('soundNote')
  ];

  for (const element of elements) {
    const styles = window.getComputedStyle(element);
    const bounds = element.getBoundingClientRect();
    const lines = textLines(element);
    sourceContext.font = `${styles.fontStyle} ${styles.fontWeight} ${styles.fontSize} ${styles.fontFamily}`;
    sourceContext.fillStyle = element.id === 'intro-title' || element.id === 'introEyebrow' ? '#f1c878' : styles.color;
    lines.forEach((line, index) => {
      const y = bounds.top + (bounds.height * (index + 0.5)) / lines.length;
      sourceContext.fillText(line, bounds.left + bounds.width / 2, y);
    });
  }

  const pixels = sourceContext.getImageData(0, 0, source.width, source.height).data;
  const targets = [];
  const step = Math.max(3, Math.floor(4 * ratio));
  for (let y = 0; y < source.height; y += step) {
    for (let x = 0; x < source.width; x += step) {
      if (pixels[(y * source.width + x) * 4 + 3] < 110 || Math.random() > 0.65) continue;
      targets.push({ x: x / ratio, y: y / ratio });
    }
  }

  const particles = targets.slice(0, 2200).map((target) => {
    const side = Math.floor(Math.random() * 4);
    const offset = 24 + Math.random() * 120;
    const start = side === 0 ? { x: -offset, y: Math.random() * height }
      : side === 1 ? { x: width + offset, y: Math.random() * height }
        : side === 2 ? { x: Math.random() * width, y: -offset }
          : { x: Math.random() * width, y: height + offset };
    const controlX = (start.x + target.x) / 2 + (Math.random() - 0.5) * Math.min(width * 0.28, 260);
    const controlY = (start.y + target.y) / 2 + (Math.random() - 0.5) * Math.min(height * 0.28, 180);
    return {
      startX: start.x,
      startY: start.y,
      controlX,
      controlY,
      targetX: target.x,
      targetY: target.y,
      delay: Math.random() * 0.16,
      size: Math.random() * 1.6 + 0.7,
      color: Math.random() > 0.75 ? '#f09ba8' : '#fff4c7'
    };
  });

  introScene.classList.add('is-assembling');
  const startedAt = performance.now();
  const duration = 4000;
  let revealStarted = false;
  const animate = (now) => {
    const progress = Math.min((now - startedAt) / duration, 1);
    if (progress >= 0.82 && !revealStarted) {
      revealStarted = true;
      introScene.classList.add('is-revealing');
    }
    const particleFade = progress < 0.82 ? 1 : Math.max(0, (1 - progress) / 0.18);
    particleContext.clearRect(0, 0, width, height);
    for (const particle of particles) {
      const localProgress = Math.max(0, Math.min(1, (progress - particle.delay) / (1 - particle.delay)));
      const eased = localProgress ** 3 * (localProgress * (localProgress * 6 - 15) + 10);
      const inverse = 1 - eased;
      const x = inverse ** 2 * particle.startX + 2 * inverse * eased * particle.controlX + eased ** 2 * particle.targetX;
      const y = inverse ** 2 * particle.startY + 2 * inverse * eased * particle.controlY + eased ** 2 * particle.targetY;
      particleContext.fillStyle = particle.color;
      particleContext.globalAlpha = particleFade * (0.32 + localProgress * 0.68);
      particleContext.beginPath();
      particleContext.arc(x, y, particle.size * (0.72 + localProgress * 0.28), 0, Math.PI * 2);
      particleContext.fill();
    }
    particleContext.globalAlpha = 1;
    if (progress < 1) requestAnimationFrame(animate);
    else {
      introScene.classList.remove('is-assembling', 'is-revealing');
      introParticlesCanvas.classList.add('is-finished');
    }
  };
  requestAnimationFrame(animate);
}

requestAnimationFrame(startIntroAssembly);

const sky = document.getElementById('sky');
const context = sky.getContext('2d');
const sparkleLayer = document.getElementById('sparkleLayer');
let stars = [];
let meteors = [];
let nextMeteorAt = 0;

function resizeSky() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  sky.width = Math.floor(window.innerWidth * ratio);
  sky.height = Math.floor(window.innerHeight * ratio);
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  stars = Array.from({ length: Math.max(70, Math.floor(window.innerWidth * window.innerHeight / 7000)) }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    size: Math.random() * 1.4 + 0.2,
    phase: Math.random() * Math.PI * 2,
    speed: Math.random() * 0.02 + 0.004,
    driftX: (Math.random() - 0.5) * 0.16,
    driftY: (Math.random() - 0.5) * 0.09
  }));
}

function createMeteor() {
  const fromLeft = Math.random() > 0.5;
  const speed = 7 + Math.random() * 7;
  meteors.push({
    x: fromLeft ? -80 : window.innerWidth + 80,
    y: Math.random() * window.innerHeight * 0.65,
    vx: fromLeft ? speed : -speed,
    vy: speed * (0.28 + Math.random() * 0.3),
    length: 90 + Math.random() * 130,
    alpha: 0.65 + Math.random() * 0.35
  });
}

function createOpeningMeteor() {
  const speed = Math.max(5, window.innerWidth / 95);
  meteors.push({
    x: -160,
    y: window.innerHeight * 0.38,
    vx: speed,
    vy: speed * 0.1,
    length: 300,
    alpha: 1,
    lineWidth: 3.2,
    glow: 16,
    headSize: 2.8
  });
}

function drawMeteor(meteor) {
  const tailX = meteor.x - meteor.vx * (meteor.length / Math.abs(meteor.vx));
  const tailY = meteor.y - meteor.vy * (meteor.length / Math.abs(meteor.vx));
  const gradient = context.createLinearGradient(tailX, tailY, meteor.x, meteor.y);
  gradient.addColorStop(0, 'rgba(255, 241, 194, 0)');
  gradient.addColorStop(0.75, `rgba(255, 226, 160, ${meteor.alpha * 0.35})`);
  gradient.addColorStop(1, `rgba(255, 251, 235, ${meteor.alpha})`);
  context.save();
  context.strokeStyle = gradient;
  context.lineWidth = meteor.lineWidth || 1.6;
  if (meteor.glow) {
    context.shadowBlur = meteor.glow;
    context.shadowColor = 'rgba(255, 235, 183, 0.9)';
  }
  context.beginPath();
  context.moveTo(tailX, tailY);
  context.lineTo(meteor.x, meteor.y);
  context.stroke();
  if (meteor.headSize) {
    context.fillStyle = 'rgba(255, 253, 241, 0.96)';
    context.beginPath();
    context.arc(meteor.x, meteor.y, meteor.headSize, 0, Math.PI * 2);
    context.fill();
  }
  context.restore();
}

function addBurst(x, y) {
  const colors = ['#fff6d8', '#f1c878', '#f09ba8', '#c8d7f4'];
  const fragment = document.createDocumentFragment();
  Array.from({ length: 24 }, (_, index) => {
    const angle = (Math.PI * 2 * index) / 24 + (Math.random() - 0.5) * 0.35;
    const distance = 36 + Math.random() * 90;
    const sparkle = document.createElement('i');
    sparkle.className = 'sparkle';
    sparkle.style.left = `${x}px`;
    sparkle.style.top = `${y}px`;
    sparkle.style.color = colors[Math.floor(Math.random() * colors.length)];
    sparkle.style.setProperty('--size', `${2 + Math.random() * 4}px`);
    sparkle.style.setProperty('--dx', `${Math.cos(angle) * distance}px`);
    sparkle.style.setProperty('--dy', `${Math.sin(angle) * distance}px`);
    sparkle.addEventListener('animationend', () => sparkle.remove(), { once: true });
    fragment.appendChild(sparkle);
  });
  sparkleLayer.appendChild(fragment);
}

function drawSky(time) {
  context.clearRect(0, 0, window.innerWidth, window.innerHeight);
  for (const star of stars) {
    star.phase += star.speed;
    star.x += star.driftX;
    star.y += star.driftY;
    if (star.x < -2) star.x = window.innerWidth + 2;
    if (star.x > window.innerWidth + 2) star.x = -2;
    if (star.y < -2) star.y = window.innerHeight + 2;
    if (star.y > window.innerHeight + 2) star.y = -2;
    const alpha = 0.2 + (Math.sin(star.phase) + 1) * 0.26;
    context.fillStyle = `rgba(255, 245, 215, ${alpha})`;
    context.beginPath();
    context.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    context.fill();
  }
  if (time >= nextMeteorAt) {
    createMeteor();
    nextMeteorAt = time + 1400 + Math.random() * 3500;
  }
  meteors = meteors.filter((meteor) => {
    meteor.x += meteor.vx;
    meteor.y += meteor.vy;
    drawMeteor(meteor);
    const margin = meteor.length + 100;
    return meteor.x > -margin && meteor.x < window.innerWidth + margin && meteor.y < window.innerHeight + margin;
  });
  requestAnimationFrame(drawSky);
}

resizeSky();
createOpeningMeteor();
nextMeteorAt = performance.now() + 3200;
drawSky();
window.addEventListener('resize', resizeSky);
window.addEventListener('resize', () => photoGrid.querySelectorAll('img').forEach(preparePortraitPhoto));
document.addEventListener('click', (event) => addBurst(event.clientX, event.clientY));
