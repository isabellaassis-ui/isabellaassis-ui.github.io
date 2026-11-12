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

// All five project cases stay readable when JavaScript is unavailable.
const projectTabs = document.querySelector('.project-tabs');
const projectButtons = [...document.querySelectorAll('[data-project]')];
const projectPanels = [...document.querySelectorAll('[data-project-panel]')];
const projectStatus = document.querySelector('.project-status');

if (projectTabs && projectButtons.length === projectPanels.length && projectPanels.length > 0) {
  let selectedProject = 0;

  function selectProject(index, focusTab = false) {
    selectedProject = index;
    projectButtons.forEach((button, buttonIndex) => {
      const active = buttonIndex === index;
      button.setAttribute('aria-selected', String(active));
      button.tabIndex = active ? 0 : -1;
      projectPanels[buttonIndex].hidden = !active;
    });
    if (focusTab) {
      projectButtons[index].focus({ preventScroll: true });
      projectButtons[index].scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }
    if (projectStatus) {
      const name = projectButtons[index].querySelector('strong').textContent;
      projectStatus.textContent = 'Projeto ' + (index + 1) + ' de ' + projectButtons.length + ': ' + name;
    }
    queueNavigationUpdate();
  }

  projectTabs.setAttribute('role', 'tablist');
  function updateProjectOrientation() {
    projectTabs.setAttribute('aria-orientation', window.matchMedia('(max-width: 800px)').matches ? 'horizontal' : 'vertical');
  }
  updateProjectOrientation();
  window.addEventListener('resize', updateProjectOrientation);

  projectButtons.forEach((button, index) => {
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-controls', projectPanels[index].id);
    projectPanels[index].setAttribute('role', 'tabpanel');
    projectPanels[index].setAttribute('aria-labelledby', button.id);
    projectPanels[index].tabIndex = 0;
    button.addEventListener('click', () => selectProject(index));
    button.addEventListener('keydown', (event) => {
      let nextIndex;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = (selectedProject + 1) % projectButtons.length;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = (selectedProject - 1 + projectButtons.length) % projectButtons.length;
      if (event.key === 'Home') nextIndex = 0;
      if (event.key === 'End') nextIndex = projectButtons.length - 1;
      if (nextIndex !== undefined) {
        event.preventDefault();
        selectProject(nextIndex, true);
      }
    });
  });

  document.querySelector('#projetos').classList.add('projects-enhanced');
  projectTabs.hidden = false;
  document.querySelector('.project-instruction').hidden = false;
  const linkedProject = projectPanels.findIndex((panel) => '#' + panel.id === window.location.hash);
  selectProject(linkedProject >= 0 ? linkedProject : 0);
  window.addEventListener('hashchange', () => {
    const linkedIndex = projectPanels.findIndex((panel) => '#' + panel.id === window.location.hash);
    if (linkedIndex >= 0) selectProject(linkedIndex);
  });
}

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
