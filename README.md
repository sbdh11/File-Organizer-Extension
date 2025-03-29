# File Organizer Chrome Extension

A Chrome extension that automatically organizes your downloaded files into appropriate folders based on their file types. This extension helps you maintain a clean and organized downloads folder by automatically categorizing files as they are downloaded.

## Features

- Automatically organizes downloaded files into appropriate folders
- Supports a wide range of file types
- Clean and intuitive popup interface
- Error handling to ensure downloads aren't interrupted
- No configuration needed - works out of the box

## Supported File Types

The extension organizes files into the following categories:

- **Images**: png, jpeg, jpg, gif, webp, svg, bmp
- **Documents**: pdf, doc, docx, txt, rtf
- **Presentations**: ppt, pptx
- **Spreadsheets**: xls, xlsx, csv
- **Videos**: mp4, mov, avi, mkv, webm
- **Audio**: mp3, wav, ogg, m4a
- **Archives**: zip, rar, 7z, tar, gz
- **Executables**: exe, msi
- **Code**: js, py, java, cpp, html, css, json, xml
- **Fonts**: ttf, otf, woff, woff2
- **Other**: Any unrecognized file types

## Installation

1. Clone this repository or download the source code
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the extension directory

## Usage

Once installed, the extension will automatically organize your downloads. When you download a file:
1. The extension detects the file type
2. Creates the appropriate folder if it doesn't exist
3. Moves the file to the corresponding folder

You can click the extension icon in your Chrome toolbar to see which file types are supported and their corresponding folders.

## Development

The extension is built using:
- HTML/CSS for the popup interface
- JavaScript for the background service worker
- Chrome Extension Manifest V3

## Contributing

Feel free to submit issues and enhancement requests!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Chrome Extensions API documentation
- Icons from [source] 