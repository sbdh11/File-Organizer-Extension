function sendMessage(type, payload) {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ type, ...payload }, resolve);
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
  removeBtn.addEventListener('click', () => {
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

async function loadRules() {
  const res = await sendMessage('getRules');
  const rules = (res && res.rules) ? res.rules : {};
  const body = document.getElementById('rulesBody');
  body.innerHTML = '';
  Object.keys(rules).sort().forEach(ext => {
    body.appendChild(createRow(ext, rules[ext]));
  });
}

async function saveRules() {
  const rows = Array.from(document.querySelectorAll('#rulesBody tr'));
  const rules = {};
  for (const row of rows) {
    const [extInput, folderInput] = row.querySelectorAll('input');
    const ext = (extInput.value || '').trim().toLowerCase();
    const folder = (folderInput.value || '').trim();
    if (!ext || !folder) continue;
    rules[ext] = folder;
  }
  await sendMessage('saveRules', { rules });
  const status = await sendMessage('getStatus');
  if (status) {
    showToast('Rules saved');
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const addRowBtn = document.getElementById('addRow');
  const saveBtn = document.getElementById('save');
  const resetBtn = document.getElementById('reset');

  addRowBtn.addEventListener('click', () => {
    document.getElementById('rulesBody').appendChild(createRow());
    showToast('Rule added');
  });
  saveBtn.addEventListener('click', saveRules);
  resetBtn.addEventListener('click', async () => {
    await sendMessage('resetDefaults');
    await loadRules();
    showToast('Defaults restored');
  });

  await loadRules();
}); 