// The content and native project disclosures work without JavaScript.
const navigationLinks = [...document.querySelectorAll('[data-nav]')];
const sections = navigationLinks.map((link) => document.querySelector(link.hash));
let scrollFramePending = false;

function updateNavigation() {
  const readingLine = window.innerHeight * 0.42;
  let activeSection = null;
  for (const section of sections) {
    if (section && section.getBoundingClientRect().top <= readingLine) activeSection = section;
  }
  if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 8) {
    activeSection = document.querySelector('#contato');
  }
  for (const link of navigationLinks) {
    if (activeSection && link.hash === '#' + activeSection.id) {
      link.setAttribute('aria-current', 'location');
    } else {
      link.removeAttribute('aria-current');
    }
  }
  scrollFramePending = false;
}

function queueNavigationUpdate() {
  if (!scrollFramePending) {
    scrollFramePending = true;
    window.requestAnimationFrame(updateNavigation);
  }
}

window.addEventListener('scroll', queueNavigationUpdate, { passive: true });
window.addEventListener('resize', queueNavigationUpdate);
window.addEventListener('load', updateNavigation);
updateNavigation();

const copyButton = document.querySelector('.copy-email');
const copyStatus = document.querySelector('.copy-status');
if (copyButton && copyStatus && navigator.clipboard?.writeText) {
  copyButton.hidden = false;
  let feedbackTimer;
  copyButton.addEventListener('click', async () => {
    window.clearTimeout(feedbackTimer);
    const emailLink = document.querySelector('a[href^="mailto:"]');
    try {
      await navigator.clipboard.writeText(emailLink.href.slice('mailto:'.length));
      copyStatus.textContent = 'E-mail copiado. Vamos conversar!';
    } catch {
      copyStatus.textContent = 'Não foi possível copiar. Você pode usar o link de e-mail acima.';
    }
    feedbackTimer = window.setTimeout(() => { copyStatus.textContent = ''; }, 6000);
  });
}
