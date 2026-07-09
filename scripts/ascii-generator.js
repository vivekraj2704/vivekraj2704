/**
 * Generate the ASCII portrait used by the GitHub profile banner.
 *
 * If an `assets/avatar.png` file exists, the script converts it to grayscale
 * ASCII and writes it to `assets/avatar.txt`. Otherwise it preserves the
 * current `avatar.txt` so a hand-edited portrait is not overwritten.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { inflateSync } from 'node:zlib';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const assetDir = path.join(projectRoot, 'assets');
const pngPath = path.join(assetDir, 'avatar.png');
const txtPath = path.join(assetDir, 'avatar.txt');

const fallbackPortrait = [
  '+-#*==##+**#=#*##+#*-%=#*#=##-%***#+==++*++***+*##%##*++=--::::==-=+===-+:---==-==+:-:=+:%++#+*+#*=+-+#%##:.-+#*+-#+*+++#*#+**-=**#',
  ':+*=*=#*#=*#=#*#%**=+*+#-%*+=:=#++=+++++*##*+==-=**%##*++*##*=-=+==+#%**#++=+**-+=++-=---:*+.=:%*:++#+-:+=##*-+:.+*-=+-:-:+:*-+#+#*',
  '=+-#=##*##++%*%%++*#=-.+%=+@*:#.#++-******###**##%#**+=++*%#%%%%#%%%***%%%#**=*=#=:#*:::=::--#+=.#.=%+%=%=:**#==--:-+##+=:-+#==+++#',
  '+-+***=*=##=+%##+*-#*+%+++#-%+#===**#*++*****#######***+*##*++=--=====+*#*=-+**+**#=-.--:.-.:.*=*#=#%#**+*+*=+*=##*-*-+-=*+--=+#-=*',
  '-=-*=+=*=**+##*#+==**#*#=#++=**+*=#%#***###########*+====------:-::::---=====*#***::..:+.-:...+=*:**.**#*+=:*++-*:=+###+**+-=#**+-=',
  '=--***#+++-*%+##**#-*+*=-:#-:=-#++******#######*++=------:::--::::.:::::-----=++==--=-::+-.::#=:+..+%#=#**##+###-*+:=%++*+:*.++*-=-',
  ':#:--+:+*#**=*:******+*#+#%#:-+=-**###*#####**+=------::::-:::::::::..:::----=+*+*++==--=-=-=:#*-+==#+=###+#+==-%*#*:-*++*-*-:**+*:',
  '-*++-#*#+**:+:+*#*==+#**+#*#**###**#%%#***+=--::::::::::::::::::::.:::::::::-==+*#*###---=-==---#%.:****+*#=*#+#**###%=*#-#*#*-*-==',
  '+=+-#*+=+#*:+:+=+-+**#+*++#********#*++=-:::::::::::::::::::::::::::::::::::-:-===*%%+*:+-+==+-%-:-#+-+:=+:=:%*#+%=*#-+--==+.***+**',
  ':-*==****=*+-+%:=+*+##+#%*#=####*#%=--:::::::::::::::::::::::::::::::::::::::-----+*%%:-=+*++==+*%==*#%+*+=+*#####**--#:##=+:#-***+',
  '-=*##+++-%:+==#-+=**++*=*-:*#*####*+-:::::::::::::::::::::::::::::::::::::::::---=-*+****#***++**-*=*##**+*##*:=:#**###=:=++#+:+*::',
  ':++*:=*-#-*%#-#:-++**=#:+%+*%%#*#**+=:::::::::::::::::::::::::::::..:::::::::::--==#%%######*++#*-#*=*#-=+:***=*+:%=%=++++-:::+=#*+',
  '-***#+++=*#=+=#=+=%#*+#=%=*.%##*###*+-:::::::::::::::::::::::::::....::::::::::-===##%#%%%%#*+:==%#=**+#%*+=#*=**+%#+*:+-#+-#*+::%+',
  '-=-#-++:#+**+-=+%:+***-*+#=*%###%%##+-::::::::::::::::::::::::::::::::......:::--==##%%%%%%%%++:-::#**=#=++#*:=-##*.==*%%-**+.+#*++',
  '.-=##:++=*=#=+*--*#%##***-%+##%#%%##+--::::::::::::::::::::::::::::::::........:--+##%%%%%%%*=%=#+**+=*#*#+=#**+=*:**.*##**+++++=+.',
  ':=*#+-+-#*+*#=*#*#=+#++#+=%=+%###%%*--:::=+====--:::::::::::::::::::::::-=--=...-==%#%%%%%%%=*=*%.*%=*+-*#*-+%###%-#-%:*%+##**#%.::',
  '-==*+===+*=#++=#*+#**-=**##-=%*##%%=:::+***#*#####%*+--=---:-=*+=+*##%%%##*+=++-:--##%%#%%%%**%-:#:+**##%*==-*=#*+=--*=*++*=-*=*#:#',
  '-:-#++::*#==*+*+##+#-*%*=*:#+*#*###:::*++=--=--+*##*+===--==--++++*#*+=-::--==***--=%%%%#%%##%#=+%%++.=%*%#*+%#++%*=**-*#-#**#-:#=-',
  '=-:=+-*=#++##*+=**=+*:**++**++#*#%*::-+*****=--=+*#*++=-=---==+*+++##+-=-==----++*+-+%%#%%%*=#+#-*==#*#++=:***#*+#=*+=**-==-==%+++#',
  '=---=#*=-#+=+=***-*#:#*=*#-##-=##*#%=.:==-#**#*#*+*+==-*%#**#%+-++=+*:***%=-*=----*+=*##%-.:.##+*=#:*-*#+#***:%*=:*#++++%::-*:+%***',
  ':::==*##+*+=*#*+**=*+#*#=#+%:#:+*#+%:---==:::*##.:-=+--++-:-:#+=====:.:#%*:------.#::%%#==+=-+%+%*#%*%*#*#+:*=-+#.*-*%%=+%:=-#*+*=+',
  '..=*##-+==:-+*-=-++#=**==:*+-==--%:=-::-----=-:--=-----#-:::--#===---===--=--:::.+.::=%*=----==#:+%=*+#++#*#*+**+=#+*###*.*#:-=-=++',
  '.:**#*=++#:##=*-**==*#*%+++#:--::#..+.:::::----:------:*.:..:-**:----------:::...#.:::+=:---:+*+++*%:**.#=#%****+:##=:.#**=:++*+-@*',
  ':-=-#=*=-**+=#=#+#++=#+*#=%+:-:::=::-::::::::::::::::.*:.. ..::#::::::---::::.:..:..:::=::-=:*##%+**#*-#*+-+*--==-+==*#-*#++#:*=*%*',
  ':.-*#**+*%=#*#:****#*-***#*%*:-:=-::.=.:::::::::.:.:.#:.... ..::@-.:::.::::....:-...:::*=-:==*%-:*=*+---**=.*#-:#:--.*-+#=*-.+:.+-*',
  ':.=-#*=*=*--+#:+*+#+*+*=*+**%::=+-::::.::--====++**=-::.........:-++++=-::::........:::+==::+@++:#*%*-@-:=#++=++#%.=*=:*:+==++-#%:+',
  '--.-#+=*-*-#:*=:*****=:--#%-%*.:+=::::....:::::::---:-:-::-:----::--:::::.......:.::::-=+:.-@:#=%%=+:*##=+=*%*-*+#%+:-%+*-+*+*+:+=-',
  ':--=-*#-+:=-=#*#==*=*-:##%++=%-:-+::::::...:::::-----+*+-----%*#++=----::::::..::::::-+:.-.*+%#***+#=.:*+=**=**#:#+.+++=+==+===:*++',
  '::++=*=-**=#=%*+=:=%++**#=*+##=-.*-:::::::::::--::-==+**##*#####+++=-:---:::::::::::-==::.:*#+%=++#*=+==%==-:-=#*+++*=-#:*:+#:.:.:+',
  '..-**#*=*=-#=*-=+:**%+:#-**+%-%::*---::::::::--=+*######%%#*%%%######*++--:::-:---:--=-:..+%*%#+*#:++-+%*---%=#+#=::%:..*-+:*.#*+=+',
  '..=+*+===+#=#*=#=*=+=*%*=***#%*.:==---:::::::=*####*+==++----+#****##%##*=:--------==+....%#**++=*+%+%#*#*#*=:=:++-.-#+=-+:#+#**=#+',
  '..:+-=*:**=*=:###+###*+#*#%#+##-++*----:::::-*##**+=+++========+++***##%%+-------===+=++###%*%%*=%#.**-***%*+*:=-.=##-+*:#-=+=*-=**',
  '..:*#::+#+=#+***+*#*%+*#*#+****#+**==-:---::=*+=--=---------------===-=*#+-----==-=+**#*-#*#*+#*###%**+*#---+*==*-**=.*=++#+*:-=+**',
  '**=-++*#-=-%=#*%***#%=##*#+*###%##:*+=-----------:---:-:-------======--+=-=-=-=====**##%*+=+-=+##++#*%#+-*+=#==++%-#:#+#*++#*+**%#*',
  '===**:=+-%+*=*%*=*#*%*#*+#**#*+*##%#+-----------:-----=+****++++=======+=--=======*####%#*==#%%**#*=*#%.##%:=++---+*#+++*-#+**=-#=#',
  ':..+*-++*++###+#+**-**%#*##**=*+*#%%#+=-----===+-----=++*###***+======+*+=======+#+#-*%##*##*%+*%-%==++*==##+*+++*-#+=##*+#*#=##.+*',
  '::::.*+**=**#****#%++****#*+*@-*#%***#+==-===++==--::---+***++==---==++**+++++****%%*@***%%*%+**+##=@*#+#+*=-#++=#-:#**--++%+*=*%==',
  '-::*==*+.=**+*#**#**#=#+*#*%#**=#=#%****+=-===+=-------======-==--=+=+*******####**%###%%*.-%%#%##*##+#%*+++*=*-%:#:+##*#*:+*:#+***',
  ':::+=+##*-#+#**###*=*####+++#=####+-+**#=**++++=+====+==++====+++++***###*####+*#+*#=-*#*#+#==#%=**#+:%%+:*#=:=--+-==**:###*+=++#==',
  '-:-+===#:*==%-#-*+*+#+%#*#%*%-+%%.#=+##+--+#######***#*#*****#######%%##%%###+-##%**#*%##++-#+######**=+++++###*##=*+#+**+*##+*+#*=',
  '...---*+#*=*++##%*#=*#***++#=*=#=*+=+:*#::-=**%#####%%%%%%%%%%%%%%%%%%%%%#*+==-#+==%#%****+%.=#-*####***#*%#+***:##%*.%%-+##+#++%*+',
  '--=*==+*=*=*+:#=##*=*#+-+*=++@=-***+##*@=---===+###%%%%%%%%%%%%%%%%%%%###*+====@%--##=%#**%*##**#:###*-#=+*+%#=+*%#+##-*-#**+#*=#+*',
  '-==**:+*%:+*+#+*#*=#-+=###*+%##*+:=**#%@-----===++**#%%%%%%%%%%%%%%###*++=---==@%%=+*#%++#+%=%=%*%++=**%--*+#:#=##%%=%:+##+#:*=*+%#',
  '....+-=+++-*+*=%#+*+###**=+#-:+=#%=##@%@--:-:---==+*******##########*+=========@%@+++-##%***+*-%%+**=+#****%++=#**#%--%+*.::*=:-+:=',
  ':---+:*::#%+*@+#%=#*+*+*%+#=##+.%##%@%%%--:-::-------==+++++++****+====-==---==@@%#+#:%%#++*#*=##=*#+##+%**+*:=++#:@+.*%.#%::=#*=+=',
  ':::--=*=**+%*-##+=#=+==+**++=#%%++%##%%%=----::::-:------==========----------==#@#*##--**%#%#=#*+%***+*%=*#-+#-=**:#+#+#:++*+*#*+#+',
  '....*=++=+*+**#*##**-+%*=#***##++#@*#%%%+---::--:::-------------------------=++*%##--:-=+**+*#*#%=*:#*#=#-*:+@%**:#-*%**+:==+-++*:#',
  '==-=-:=+=*+##*+-*+-++***+-%+#+++##%%#%%#+=-------::-:::::::----------------==+=#*#*:+:-+*+=+%++-+*:#-%*%%+*##*#*:+%**=-*+=-:+*#*#=*',
  '=+++=-::++*###=+=**+*-=%*=#+#*++%*%#*%%#++=-------:-----::---------------====+=+%*##.-:#*+=++==:-.##@:*+#*=:=**=###*=-=:=%++*-+:+-#',
  '....+-+++**+#**++*=*==+**###+==*#%@#**%*++==----------::-:---------------=====+##***+:=:=++*+++-==:-=:..-%+*==*-#-+:++#=+*#*+#-=+#-',
  ':::.*++#+*+%*-=-=*-*#####%##%%@-#%%#+*#*++===---------::-:---------------====+*##*%:+=.:=:-*-*+-+++++*+::+==---=*#=#-*+****+#+#=:*#',
  '',
  '',
].join('\n');


function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function decodePng(buffer) {
  const signature = buffer.subarray(0, 8);
  const expected = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  if (!signature.equals(expected)) {
    throw new Error('avatar.png is not a PNG file');
  }

  let offset = 8;
  let width = 0;
  let height = 0;
  let bitDepth = 0;
  let colorType = 0;
  let interlace = 0;
  const idatChunks = [];
  let palette = null;
  let transparency = null;

  while (offset < buffer.length) {
    const length = buffer.readUInt32BE(offset);
    offset += 4;
    const type = buffer.toString('ascii', offset, offset + 4);
    offset += 4;
    const data = buffer.subarray(offset, offset + length);
    offset += length;
    offset += 4;

    if (type === 'IHDR') {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      bitDepth = data.readUInt8(8);
      colorType = data.readUInt8(9);
      interlace = data.readUInt8(12);
      continue;
    }

    if (type === 'PLTE') {
      palette = data;
      continue;
    }

    if (type === 'tRNS') {
      transparency = data;
      continue;
    }

    if (type === 'IDAT') {
      idatChunks.push(data);
      continue;
    }

    if (type === 'IEND') {
      break;
    }
  }

  if (bitDepth !== 8 || interlace !== 0) {
    throw new Error('Only non-interlaced 8-bit PNG files are supported');
  }

  const channelsByType = {
    0: 1,
    2: 3,
    3: 1,
    4: 2,
    6: 4,
  };

  const channels = channelsByType[colorType];
  if (!channels) {
    throw new Error(`Unsupported PNG color type: ${colorType}`);
  }

  const inflated = inflateSync(Buffer.concat(idatChunks));
  const bytesPerPixel = channels;
  const rowStride = width * channels;
  const pixels = new Uint8Array(width * height * 4);
  let srcOffset = 0;
  let prevRow = new Uint8Array(rowStride);

  for (let y = 0; y < height; y += 1) {
    const filter = inflated[srcOffset];
    srcOffset += 1;
    const row = inflated.subarray(srcOffset, srcOffset + rowStride);
    srcOffset += rowStride;
    const recon = new Uint8Array(rowStride);

    for (let i = 0; i < rowStride; i += 1) {
      const left = i >= bytesPerPixel ? recon[i - bytesPerPixel] : 0;
      const up = prevRow[i] ?? 0;
      const upLeft = i >= bytesPerPixel ? prevRow[i - bytesPerPixel] : 0;
      const raw = row[i];
      let value = raw;

      if (filter === 1) {
        value = (raw + left) & 0xff;
      } else if (filter === 2) {
        value = (raw + up) & 0xff;
      } else if (filter === 3) {
        value = (raw + Math.floor((left + up) / 2)) & 0xff;
      } else if (filter === 4) {
        value = (raw + paethPredictor(left, up, upLeft)) & 0xff;
      } else if (filter !== 0) {
        throw new Error(`Unsupported PNG filter: ${filter}`);
      }

      recon[i] = value;
    }

    writeRowToRgba(recon, pixels, width, y, colorType, palette, transparency);
    prevRow = recon;
  }

  return { width, height, pixels };
}

function paethPredictor(left, up, upLeft) {
  const p = left + up - upLeft;
  const distanceLeft = Math.abs(p - left);
  const distanceUp = Math.abs(p - up);
  const distanceUpLeft = Math.abs(p - upLeft);

  if (distanceLeft <= distanceUp && distanceLeft <= distanceUpLeft) {
    return left;
  }

  if (distanceUp <= distanceUpLeft) {
    return up;
  }

  return upLeft;
}

function writeRowToRgba(row, pixels, width, y, colorType, palette, transparency) {
  const rowOffset = y * width * 4;
  let sourceOffset = 0;

  for (let x = 0; x < width; x += 1) {
    const targetOffset = rowOffset + x * 4;

    if (colorType === 0) {
      const value = row[sourceOffset];
      sourceOffset += 1;
      pixels[targetOffset] = value;
      pixels[targetOffset + 1] = value;
      pixels[targetOffset + 2] = value;
      pixels[targetOffset + 3] = 255;
      continue;
    }

    if (colorType === 2) {
      pixels[targetOffset] = row[sourceOffset];
      pixels[targetOffset + 1] = row[sourceOffset + 1];
      pixels[targetOffset + 2] = row[sourceOffset + 2];
      pixels[targetOffset + 3] = 255;
      sourceOffset += 3;
      continue;
    }

    if (colorType === 3) {
      const index = row[sourceOffset];
      sourceOffset += 1;
      const paletteOffset = index * 3;
      pixels[targetOffset] = palette[paletteOffset] ?? 0;
      pixels[targetOffset + 1] = palette[paletteOffset + 1] ?? 0;
      pixels[targetOffset + 2] = palette[paletteOffset + 2] ?? 0;
      pixels[targetOffset + 3] = transparency?.[index] ?? 255;
      continue;
    }

    if (colorType === 4) {
      const value = row[sourceOffset];
      const alpha = row[sourceOffset + 1];
      sourceOffset += 2;
      pixels[targetOffset] = value;
      pixels[targetOffset + 1] = value;
      pixels[targetOffset + 2] = value;
      pixels[targetOffset + 3] = alpha;
      continue;
    }

    if (colorType === 6) {
      pixels[targetOffset] = row[sourceOffset];
      pixels[targetOffset + 1] = row[sourceOffset + 1];
      pixels[targetOffset + 2] = row[sourceOffset + 2];
      pixels[targetOffset + 3] = row[sourceOffset + 3];
      sourceOffset += 4;
    }
  }
}

function toAsciiArt(pixels, width, height) {
  const targetWidth = 70;
  const targetHeight = Math.max(1, Math.round((height / width) * targetWidth * 0.5));
  const ramp = ' .,:;irsXA253hMHGS#9B&@';
  const lines = [];

  for (let y = 0; y < targetHeight; y += 1) {
    const y0 = Math.floor((y / targetHeight) * height);
    const y1 = Math.max(y0 + 1, Math.floor(((y + 1) / targetHeight) * height));
    let line = '';

    for (let x = 0; x < targetWidth; x += 1) {
      const x0 = Math.floor((x / targetWidth) * width);
      const x1 = Math.max(x0 + 1, Math.floor(((x + 1) / targetWidth) * width));
      let total = 0;
      let count = 0;

      for (let sampleY = y0; sampleY < y1; sampleY += 1) {
        for (let sampleX = x0; sampleX < x1; sampleX += 1) {
          const source = (sampleY * width + sampleX) * 4;
          const red = pixels[source];
          const green = pixels[source + 1];
          const blue = pixels[source + 2];
          const alpha = pixels[source + 3] / 255;
          const luminance = (0.2126 * red + 0.7152 * green + 0.0722 * blue) * alpha + 255 * (1 - alpha);
          total += luminance;
          count += 1;
        }
      }

      const average = count === 0 ? 255 : total / count;
      const normalized = 1 - clamp(average / 255, 0, 1);
      const rampIndex = Math.round(normalized * (ramp.length - 1));
      line += ramp[rampIndex];
    }

    lines.push(line.replace(/\s+$/u, ''));
  }

  return `${lines.join('\n')}\n`;
}

function generateFromPng() {
  const source = readFileSync(pngPath);
  const image = decodePng(source);
  return toAsciiArt(image.pixels, image.width, image.height);
}

function main() {
  if (existsSync(pngPath)) {
    try {
      const portrait = generateFromPng();
      writeFileSync(txtPath, portrait, 'utf8');
      console.log(`Wrote ${path.relative(projectRoot, txtPath)}`);
      return;
    } catch (error) {
      console.warn(`Falling back to curated portrait: ${error.message}`);
    }
  }

  if (existsSync(txtPath)) {
    console.log(`Preserved ${path.relative(projectRoot, txtPath)}`);
    return;
  }

  writeFileSync(txtPath, fallbackPortrait, 'utf8');
  console.log(`Wrote ${path.relative(projectRoot, txtPath)}`);
}

main();
