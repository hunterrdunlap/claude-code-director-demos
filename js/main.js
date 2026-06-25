// Wires arrow-key navigation across pages and clipboard-copy buttons.
// Loaded as a module on every page in the site.

const isTextInput = (el) =>
  el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable);

const navigate = (selector) => {
  const link = document.querySelector(selector);
  if (link && link.href) window.location.href = link.href;
};

const onKey = (event) => {
  if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
  if (isTextInput(document.activeElement)) return;
  if (document.activeElement && document.activeElement.closest &&
      document.activeElement.closest('.tabs__list')) return;
  if (event.key === 'ArrowRight') navigate('[data-key-next]');
  if (event.key === 'ArrowLeft') navigate('[data-key-prev]');
};

document.addEventListener('keydown', onKey);

// ----- Copy buttons -----

const copyTextFromButton = (btn) => {
  if (btn.dataset.copy) return btn.dataset.copy;
  if (btn.dataset.copyFrom === 'parent-pre') {
    // The button is inside a <pre>; copy the <pre>'s text content but
    // strip the button's own label.
    const pre = btn.closest('pre');
    if (!pre) return '';
    const clone = pre.cloneNode(true);
    clone.querySelectorAll('.copy-btn').forEach((b) => b.remove());
    return clone.textContent.trim();
  }
  return '';
};

const flashCopied = (btn) => {
  const original = btn.textContent;
  btn.classList.add('copied');
  btn.textContent = '✓ Copied';
  setTimeout(() => {
    btn.classList.remove('copied');
    btn.textContent = original;
  }, 1200);
};

const onCopyClick = async (event) => {
  const btn = event.target.closest('.copy-btn');
  if (!btn) return;
  event.preventDefault();
  const text = copyTextFromButton(btn);
  if (!text) return;
  try {
    await navigator.clipboard.writeText(text);
    flashCopied(btn);
  } catch (err) {
    console.error('Copy failed:', err);
  }
};

document.addEventListener('click', onCopyClick);

// ----- Tabs -----

const onTabClick = (event) => {
  const tab = event.target.closest('.tabs__tab');
  if (!tab) return;
  const tabs = tab.closest('.tabs');
  if (!tabs) return;
  const key = tab.dataset.tab;
  tabs.querySelectorAll('.tabs__tab').forEach((t) => {
    const active = t === tab;
    t.classList.toggle('is-active', active);
    t.setAttribute('aria-selected', active ? 'true' : 'false');
    t.tabIndex = active ? 0 : -1;
  });
  tabs.querySelectorAll('.tabs__panel').forEach((p) => {
    p.hidden = p.dataset.panel !== key;
    p.classList.toggle('is-active', p.dataset.panel === key);
  });
};

document.addEventListener('click', onTabClick);
