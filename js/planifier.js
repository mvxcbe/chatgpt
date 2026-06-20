/* ========================================
   JAPAN ODYSSEY — Trip Planner
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
  const steps = document.querySelectorAll('.plan-step');
  const dots = document.querySelectorAll('.step-dot');
  const progressLine = document.querySelector('.progress-line');
  const result = document.querySelector('.plan-result');
  const totalSteps = steps.length;
  let currentStep = 0;
  const selections = {};

  function updateProgress() {
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentStep);
      dot.classList.toggle('done', i < currentStep);
    });
    if (progressLine) {
      const pct = totalSteps > 1 ? (currentStep / (totalSteps - 1)) * 100 : 0;
      progressLine.style.width = pct + '%';
    }
  }

  function showStep(idx) {
    steps.forEach((s, i) => s.classList.toggle('active', i === idx));
    if (result) result.classList.remove('active');
    currentStep = idx;
    updateProgress();
  }

  function showResult() {
    steps.forEach(s => s.classList.remove('active'));
    if (result) result.classList.add('active');
    dots.forEach(dot => dot.classList.remove('active'));
    if (progressLine) progressLine.style.width = '100%';
    buildResult();
  }

  function buildResult() {
    const dest = selections[0] || 'Tokyo';
    const type = selections[1] || 'Culture';
    const dur = selections[2] || '2 semaines';
    const budget = selections[3] || 'Confort';
    const voy = selections[4] || 'Duo';

    const prices = { 'Économique': '1 200', 'Confort': '2 100', 'Premium': '3 800' };
    const price = prices[budget] || '2 100';

    const el = document.querySelector('.plan-result-card');
    if (!el) return;

    el.querySelector('h2').textContent = `Votre voyage à ${dest}`;
    el.querySelector('p').textContent =
      `Un séjour ${type.toLowerCase()} de ${dur.toLowerCase()} à ${dest}, conçu pour ${voy.toLowerCase()}, dans un confort ${budget.toLowerCase()}. Nous avons sélectionné les meilleures adresses, activités et expériences pour que votre voyage soit inoubliable.`;

    const tagsEl = el.querySelector('.plan-tags');
    tagsEl.innerHTML = [dest, type, dur, budget, voy]
      .map(t => `<span class="plan-tag">${t}</span>`).join('');

    el.querySelector('.plan-price').textContent = `À partir de ${price}€`;
  }

  // Card selection
  document.querySelectorAll('.choices-grid').forEach((grid, stepIdx) => {
    grid.querySelectorAll('.choice-card').forEach(card => {
      card.addEventListener('click', () => {
        grid.querySelectorAll('.choice-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        selections[stepIdx] = card.querySelector('.choice-label').textContent.trim();
      });
    });
  });

  // Next buttons
  document.querySelectorAll('.btn-next').forEach(btn => {
    btn.addEventListener('click', () => {
      if (currentStep < totalSteps - 1) showStep(currentStep + 1);
      else showResult();
    });
  });

  // Prev buttons
  document.querySelectorAll('.btn-prev').forEach(btn => {
    btn.addEventListener('click', () => {
      if (currentStep > 0) showStep(currentStep - 1);
    });
  });

  showStep(0);
});
