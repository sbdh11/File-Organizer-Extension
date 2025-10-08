// Simple popup script
console.log('Popup script loaded');

document.addEventListener('DOMContentLoaded', function() {
  console.log('Popup DOM loaded');
  
  const toggle = document.getElementById('toggle');
  const statusText = document.getElementById('statusText');
  const ruleCountEl = document.getElementById('ruleCount');
  const openOptions = document.getElementById('openOptions');
  const resetDefaults = document.getElementById('resetDefaults');

  function renderEnabled(enabled) {
    console.log('Rendering enabled state:', enabled);
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
      console.log('Sending message:', type);
      chrome.runtime.sendMessage({ type, ...payload }, function(response) {
        console.log('Message response:', response);
        resolve(response);
      });
    });
  }

  // Load initial status
  sendMessage('getStatus').then(function(status) {
    console.log('Initial status:', status);
    if (status) {
      renderEnabled(status.enabled);
      setRuleCount(status.ruleCount);
    }
  });

  // Toggle handler
  toggle.addEventListener('click', function() {
    console.log('Toggle clicked');
    sendMessage('toggleEnabled').then(function(res) {
      console.log('Toggle response:', res);
      if (res && typeof res.enabled === 'boolean') {
        renderEnabled(res.enabled);
      }
    });
  });

  // Options handler
  openOptions.addEventListener('click', function() {
    console.log('Opening options');
    if (chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    } else {
      window.open('options.html');
    }
  });

  // Reset handler
  resetDefaults.addEventListener('click', function() {
    console.log('Resetting defaults');
    sendMessage('resetDefaults').then(function() {
      sendMessage('getStatus').then(function(status) {
        if (status) {
          renderEnabled(status.enabled);
          setRuleCount(status.ruleCount);
        }
      });
    });
  });
});

console.log('Popup script ready');