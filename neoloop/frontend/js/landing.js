// Landing page interactions
document.addEventListener('DOMContentLoaded', () => {
  // Navbar scroll effect
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.style.background = window.scrollY > 50
      ? 'rgba(6,6,16,0.95)' : 'rgba(6,6,16,0.7)';
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const el = document.querySelector(a.getAttribute('href'));
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // Intersection observer for step cards
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, i * 100);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.step-card, .feat-card, .mode-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease, border-color 0.3s, box-shadow 0.3s';
    observer.observe(el);
  });

  // Interactive room preview objects
  document.querySelectorAll('.ps-obj').forEach(obj => {
    obj.addEventListener('click', () => {
      const lbl = obj.querySelector('.pobj-lbl');
      const msgs = ['🔍 Searching...', '📜 Found a clue!', '🗝️ Key fragment!', '❓ Nothing here...'];
      lbl.textContent = msgs[Math.floor(Math.random() * msgs.length)];
      obj.style.transform = 'scale(1.15)';
      setTimeout(() => { obj.style.transform = ''; }, 400);
    });
  });

  // Fake loop counter animation
  const loopDisplay = document.querySelector('.phud-loop');
  const timerDisplay = document.querySelector('.phud-timer');
  let seconds = 167;
  setInterval(() => {
    seconds++;
    const m = String(Math.floor(seconds / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    if (timerDisplay) timerDisplay.textContent = `⏱ ${m}:${s}`;
  }, 1000);
});
