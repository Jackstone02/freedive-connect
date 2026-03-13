const zlib = require('zlib');
const fs = require('fs');
const path = require('path');

function crc32(buf) {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc & 1) ? (crc >>> 1) ^ 0xEDB88320 : crc >>> 1;
    }
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuffer = Buffer.from(type, 'ascii');
  const crcVal = crc32(Buffer.concat([typeBuffer, data]));
  const crcBuffer = Buffer.alloc(4);
  crcBuffer.writeUInt32BE(crcVal, 0);
  return Buffer.concat([len, typeBuffer, data, crcBuffer]);
}

function createPNG(width, height, r, g, b) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8;
  ihdrData[9] = 2;

  const scanline = Buffer.alloc(1 + width * 3);
  scanline[0] = 0;
  for (let x = 0; x < width; x++) {
    scanline[1 + x * 3] = r;
    scanline[2 + x * 3] = g;
    scanline[3 + x * 3] = b;
  }

  const rows = [];
  for (let y = 0; y < height; y++) rows.push(scanline);
  const rawData = Buffer.concat(rows);
  const idatData = zlib.deflateSync(rawData);

  return Buffer.concat([
    signature,
    makeChunk('IHDR', ihdrData),
    makeChunk('IDAT', idatData),
    makeChunk('IEND', Buffer.alloc(0)),
  ]);
}

const assetsDir = path.join(__dirname, 'assets');
if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir);

// Brand color: #0077B6
fs.writeFileSync(path.join(assetsDir, 'icon.png'), createPNG(1024, 1024, 0, 119, 182));
fs.writeFileSync(path.join(assetsDir, 'adaptive-icon.png'), createPNG(1024, 1024, 0, 119, 182));
fs.writeFileSync(path.join(assetsDir, 'splash.png'), createPNG(1284, 2778, 0, 119, 182));
fs.writeFileSync(path.join(assetsDir, 'favicon.png'), createPNG(48, 48, 0, 119, 182));
fs.writeFileSync(path.join(assetsDir, 'notification-icon.png'), createPNG(96, 96, 255, 255, 255));

console.log('Assets created in ./assets/');
