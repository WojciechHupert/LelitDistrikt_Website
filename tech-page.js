/* ══════════════════════════════════════════════════════════════════════════
   TECH PAGE | Dedicated JavaScript
   ══════════════════════════════════════════════════════════════════════════ */

// ── Animated Number Counters ──────────────────────────────────────────────
function animateCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        const duration = 2000;
        const startTime = performance.now();
        
        function update(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.round(eased * target);
          el.textContent = current.toLocaleString();
          
          if (progress < 1) {
            requestAnimationFrame(update);
          }
        }
        
        requestAnimationFrame(update);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  
  counters.forEach(counter => observer.observe(counter));
}

// ── Architecture Nodes Staggered Reveal ──────────────────────────────────
function animateArchNodes() {
  const nodes = document.querySelectorAll('.arch-node');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const parent = entry.target.closest('.arch-flow');
        if (parent && !parent.dataset.animated) {
          parent.dataset.animated = 'true';
          const children = parent.querySelectorAll('.arch-node');
          children.forEach((node, i) => {
            node.style.opacity = '0';
            node.style.transform = 'translateY(20px)';
            setTimeout(() => {
              node.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
              node.style.opacity = '1';
              node.style.transform = 'translateY(0)';
            }, i * 200);
          });
          
          // Animate arrows after nodes
          const arrows = parent.querySelectorAll('.arch-arrow');
          arrows.forEach((arrow, i) => {
            arrow.style.opacity = '0';
            setTimeout(() => {
              arrow.style.transition = 'opacity 0.4s ease';
              arrow.style.opacity = '0.4';
            }, 300 + i * 200);
          });
        }
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  
  if (nodes.length > 0) {
    observer.observe(nodes[0]);
  }
}

// ── Store Cards Stagger ──────────────────────────────────────────────────
function animateStores() {
  const stores = document.querySelectorAll('.arch-store');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        stores.forEach((store, i) => {
          store.style.opacity = '0';
          store.style.transform = 'translateY(15px)';
          setTimeout(() => {
            store.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            store.style.opacity = '1';
            store.style.transform = 'translateY(0)';
          }, i * 150);
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  
  if (stores.length > 0) {
    observer.observe(stores[0]);
  }
}

// ── Architecture Node Expansion ──────────────────────────────────────────
function initArchExpansion() {
  const nodes = document.querySelectorAll('.arch-node');
  
  nodes.forEach(node => {
    node.addEventListener('click', () => {
      // If clicking already expanded node, close it
      if (node.classList.contains('expanded')) {
        node.classList.remove('expanded');
        return;
      }
      
      // Close all others
      nodes.forEach(n => n.classList.remove('expanded'));
      // Expand current
      node.classList.add('expanded');
    });
  });
}

// ── Initialize ───────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  animateCounters();
  animateArchNodes();
  animateStores();
  initArchExpansion();
});
