// Simple options script
console.log('Options script loaded');

function sendMessage(type, payload) {
  return new Promise((resolve) => {
    console.log('Sending message:', type);
    chrome.runtime.sendMessage({ type, ...payload }, function(response) {
      console.log('Message response:', response);
      resolve(response);
    });
  });
}

function showToast(message) {
  const toast = document.getElementById('toast');
  const msg = document.getElementById('toastMsg');
  if (!toast || !msg) return;
  msg.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove('show'), 1800);
}

function createRow(ext = '', folder = '') {
  const tr = document.createElement('tr');
  const tdExt = document.createElement('td');
  const tdFolder = document.createElement('td');
  const tdActions = document.createElement('td');

  const extInput = document.createElement('input');
  extInput.placeholder = 'e.g. png';
  extInput.value = ext;

  const folderInput = document.createElement('input');
  folderInput.placeholder = 'e.g. Images';
  folderInput.value = folder;

  const removeBtn = document.createElement('button');
  removeBtn.textContent = 'Remove';
  removeBtn.className = 'btn secondary';
  removeBtn.addEventListener('click', function() {
    tr.remove();
    showToast('Rule removed');
  });

  tdExt.appendChild(extInput);
  tdFolder.appendChild(folderInput);
  tdActions.appendChild(removeBtn);

  tr.appendChild(tdExt);
  tr.appendChild(tdFolder);
  tr.appendChild(tdActions);
  return tr;
}

function loadRules() {
  console.log('Loading rules...');
  sendMessage('getRules').then(function(res) {
    console.log('Rules response:', res);
    const rules = (res && res.rules) ? res.rules : {};
    console.log('Parsed rules:', rules);
    const body = document.getElementById('rulesBody');
    body.innerHTML = '';
    Object.keys(rules).sort().forEach(function(ext) {
      body.appendChild(createRow(ext, rules[ext]));
    });
    console.log('Rules loaded, count:', Object.keys(rules).length);
  });
}

function saveRules() {
  const rows = Array.from(document.querySelectorAll('#rulesBody tr'));
  const rules = {};
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const inputs = row.querySelectorAll('input');
    const ext = (inputs[0].value || '').trim().toLowerCase();
    const folder = (inputs[1].value || '').trim();
    if (!ext || !folder) continue;
    rules[ext] = folder;
  }
  
  console.log('Saving rules:', rules);
  sendMessage('saveRules', { rules: rules }).then(function() {
    showToast('Rules saved');
  });
}

document.addEventListener('DOMContentLoaded', function() {
  console.log('Options DOM loaded');
  
  const addRowBtn = document.getElementById('addRow');
  const saveBtn = document.getElementById('save');
  const resetBtn = document.getElementById('reset');

  addRowBtn.addEventListener('click', function() {
    document.getElementById('rulesBody').appendChild(createRow());
    showToast('Rule added');
  });
  
  saveBtn.addEventListener('click', saveRules);
  
  resetBtn.addEventListener('click', function() {
    sendMessage('resetDefaults').then(function() {
      loadRules();
      showToast('Defaults restored');
    });
  });

  loadRules();
});

console.log('Options script ready');