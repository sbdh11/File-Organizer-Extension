document.addEventListener('DOMContentLoaded', async () => {
  const toggle = document.getElementById('toggle');
  const statusText = document.getElementById('statusText');
  const ruleCountEl = document.getElementById('ruleCount');
  const openOptions = document.getElementById('openOptions');
  const resetDefaults = document.getElementById('resetDefaults');

  function renderEnabled(enabled) {
    if (enabled) {
      toggle.classList.add('on');
      statusText.textContent = 'Enabled';
    } else {
      toggle.classList.remove('on');
      statusText.textContent = 'Disabled';
    }
  }

  function setRuleCount(n) {
    ruleCountEl.textContent = String(n);
  }

  function sendMessage(type, payload) {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage({ type, ...payload }, resolve);
    });
  }

  const status = await sendMessage('getStatus');
  if (status) {
    renderEnabled(status.enabled);
    setRuleCount(status.ruleCount);
  }

  toggle.addEventListener('click', async () => {
    const res = await sendMessage('toggleEnabled');
    if (res && typeof res.enabled === 'boolean') {
      renderEnabled(res.enabled);
    }
  });

  openOptions.addEventListener('click', () => {
    if (chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    } else {
      window.open('options.html');
    }
  });

  resetDefaults.addEventListener('click', async () => {
    await sendMessage('resetDefaults');
    const status2 = await sendMessage('getStatus');
    if (status2) {
      renderEnabled(status2.enabled);
      setRuleCount(status2.ruleCount);
    }
  });
}); 