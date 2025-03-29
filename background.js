chrome.downloads.onDeterminingFilename.addListener(function (downloadItem, suggest) {
  try {
    const fileName = downloadItem.filename;
    const fileExtension = getFileExtension(fileName);

    // Define folders for different file types
    const folders = {
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
      woff2: 'Fonts',
    };

    const extensionLower = fileExtension.toLowerCase();
    const destinationFolder = folders[extensionLower] || 'Other';

    // Log the organization process
    console.log(`Organizing ${fileName} into ${destinationFolder} folder.`);

    // Suggest a new filename with the destination folder
    suggest({ filename: destinationFolder + '/' + fileName });
  } catch (error) {
    console.error('Error organizing file:', error);
    // If there's an error, let the file download normally
    suggest({ filename: downloadItem.filename });
  }
});

function getFileExtension(fileName) {
  // Handle files with multiple extensions (e.g., file.tar.gz)
  const parts = fileName.split('.');
  if (parts.length > 1) {
    return parts[parts.length - 1];
  }
  return '';
}
