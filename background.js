chrome.runtime.onInstalled.addListener(async function() {
  const defaults = getDefaultSettings();
  const stored = await chrome.storage.sync.get(["enabled", "rules"]);
  const initial = {
    enabled: stored.enabled !== undefined ? stored.enabled : true,
    rules: stored.rules && Object.keys(stored.rules).length > 0 ? stored.rules : defaults.rules
  };
  await chrome.storage.sync.set(initial);
});

chrome.downloads.onDeterminingFilename.addListener(async function (downloadItem, suggest) {
  try {
    const settings = await getSettings();
    if (!settings.enabled) {
      suggest({ filename: downloadItem.filename });
      return;
    }

    const fileName = downloadItem.filename;
    const fileExtension = getFileExtension(fileName).toLowerCase();
    const destinationFolder = settings.rules[fileExtension] || 'Other';

    console.log(`Organizing ${fileName} into ${destinationFolder} folder.`);
    suggest({ filename: destinationFolder + '/' + fileName });
  } catch (error) {
    console.error('Error organizing file:', error);
    suggest({ filename: downloadItem.filename });
  }
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  (async () => {
    try {
      if (message.type === 'getStatus') {
        const settings = await getSettings();
        sendResponse({ enabled: settings.enabled, ruleCount: Object.keys(settings.rules).length });
      } else if (message.type === 'toggleEnabled') {
        const settings = await getSettings();
        const next = !settings.enabled;
        await chrome.storage.sync.set({ enabled: next });
        sendResponse({ enabled: next });
      } else if (message.type === 'getRules') {
        const settings = await getSettings();
        sendResponse({ rules: settings.rules });
      } else if (message.type === 'saveRules') {
        const rules = message.rules || {};
        await chrome.storage.sync.set({ rules });
        sendResponse({ ok: true });
      } else if (message.type === 'resetDefaults') {
        const defaults = getDefaultSettings();
        await chrome.storage.sync.set(defaults);
        sendResponse({ ok: true });
      }
    } catch (e) {
      console.error('Message handling error', e);
      sendResponse({ error: String(e) });
    }
  })();
  return true; // keep the message channel open for async response
});

function getFileExtension(fileName) {
  const parts = fileName.split('.');
  if (parts.length > 1) {
    return parts[parts.length - 1];
  }
  return '';
}

async function getSettings() {
  const stored = await chrome.storage.sync.get(["enabled", "rules"]);
  const defaults = getDefaultSettings();
  return {
    enabled: stored.enabled !== undefined ? stored.enabled : true,
    rules: stored.rules && Object.keys(stored.rules).length > 0 ? stored.rules : defaults.rules
  };
}

function getDefaultSettings() {
  return {
    enabled: true,
    rules: {
      // Images
      png: 'Images',
      jpeg: 'Images',
      jpg: 'Images',
      gif: 'Images',
      webp: 'Images',
      svg: 'Images',
      bmp: 'Images',

      // Documents
      pdf: 'PDFs',
      doc: 'Documents',
      docx: 'Documents',
      txt: 'Documents',
      rtf: 'Documents',

      // Presentations
      ppt: 'PPTs',
      pptx: 'PPTs',

      // Spreadsheets
      xls: 'Spreadsheets',
      xlsx: 'Spreadsheets',
      csv: 'Spreadsheets',

      // Videos
      mp4: 'Videos',
      mov: 'Videos',
      avi: 'Videos',
      mkv: 'Videos',
      webm: 'Videos',

      // Audio
      mp3: 'Audio',
      wav: 'Audio',
      ogg: 'Audio',
      m4a: 'Audio',

      // Archives
      zip: 'Archives',
      rar: 'Archives',
      '7z': 'Archives',
      tar: 'Archives',
      gz: 'Archives',

      // Executables
      exe: 'Executables',
      msi: 'Executables',

      // Code
      js: 'Code',
      py: 'Code',
      java: 'Code',
      cpp: 'Code',
      html: 'Code',
      css: 'Code',
      json: 'Code',
      xml: 'Code',

      // Fonts
      ttf: 'Fonts',
      otf: 'Fonts',
      woff: 'Fonts',
      woff2: 'Fonts'
    }
  };
}
