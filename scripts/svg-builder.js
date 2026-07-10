/**
 * Build the dark and light GitHub profile SVGs from one shared template.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const templatePath = path.join(projectRoot, 'templates', 'terminal.svg');
const avatarPath = path.join(projectRoot, 'assets', 'avatar.txt');
const darkOutputPath = path.join(projectRoot, 'assets', 'dark_mode.svg');
const lightOutputPath = path.join(projectRoot, 'assets', 'light_mode.svg');

const themes = {
  dark: {
    BACKGROUND: '#0D1117',
    BORDER: '#30363D',
    PANEL: '#161B22',
    PANEL_SOFT: '#0F1520',
    PANEL_BORDER: '#30363D',
    TEXT: '#C9D1D9',
    TEXT_DIM: '#8B949E',
    PROMPT: '#7EE787',
    COMMAND: '#79C0FF',
    ACCENT: '#FFA657',
    CURSOR: '#58A6FF',
  },
  light: {
    BACKGROUND: '#F6F8FA',
    BORDER: '#D0D7DE',
    PANEL: '#FFFFFF',
    PANEL_SOFT: '#F3F6FA',
    PANEL_BORDER: '#D0D7DE',
    TEXT: '#24292F',
    TEXT_DIM: '#57606A',
    PROMPT: '#1A7F37',
    COMMAND: '#0969DA',
    ACCENT: '#953800',
    CURSOR: '#0969DA',
  },
};

const portrait = readFileSync(avatarPath, 'utf8').trimEnd();

function escapeXml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function textLine(x, y, fill, text, className = 'body') {
  return `<text class="mono ${className}" x="${x}" y="${y}" xml:space="preserve"><tspan fill="${fill}">${escapeXml(text)}</tspan></text>`;
}

function renderPortrait(theme) {
  const lines = portrait.split('\n');
  return lines.map((line, index) => textLine(0, index * 11, theme.TEXT, line, 'portrait')).join('\n');
}

function card(x, y, width, height, title, content) {
  return `
    <g>
      <rect class="panel" x="${x}" y="${y}" width="${width}" height="${height}" rx="22" ry="22" />
      <text class="mono label" x="${x + 22}" y="${y + 24}" xml:space="preserve">${escapeXml(title)}</text>
      <g transform="translate(${x} ${y})">
        ${content}
      </g>
    </g>
  `;
}

function renderLeftPortrait(theme) {
  return `
    <g>
      <rect class="panel" x="36" y="36" width="488" height="518" rx="22" ry="22" />
      <g transform="translate(36 36)">
        <rect class="soft-panel" x="0" y="38" width="486" height="480" rx="20" ry="20" />
        <g class="mono portrait" transform="translate(65 75)">
          ${renderPortrait(theme)}
        </g>
      </g>
      <text class="mono label" x="58" y="60" xml:space="preserve">${escapeXml('PORTRAIT')}</text>
    </g>
  `;
}

function renderAboutCard(theme) {
  return card(624, 36, 340, 118, 'VIVEK RAJ', `
    <text class="mono title" x="22" y="56" xml:space="preserve">${escapeXml('Software Engineer')}</text>
    <text class="mono body-dim" x="22" y="78" xml:space="preserve"><tspan fill="${theme.TEXT_DIM}">IIIT Bhagalpur</tspan></text>
    <text class="mono body-dim" x="22" y="98" xml:space="preserve"><tspan fill="${theme.TEXT_DIM}">MAQ Software</tspan></text>
  `);
}

function renderStackCard(theme) {
  return card(624, 168, 340, 224, 'TECH STACK', `
    <g transform="translate(22 56)">
      ${textLine(0, 0, theme.ACCENT, 'Languages', 'body-dim')}
      ${textLine(92, 0, theme.TEXT, 'C++, Java')}
      ${textLine(92, 16, theme.TEXT, 'TypeScript, JavaScript')}
      ${textLine(0, 40, theme.ACCENT, 'Backend', 'body-dim')}
      ${textLine(92, 40, theme.TEXT, 'Node.js, Express')}
      ${textLine(92, 56, theme.TEXT, 'Hono')}
      ${textLine(0, 80, theme.ACCENT, 'Frontend', 'body-dim')}
      ${textLine(92, 80, theme.TEXT, 'React, Tailwind CSS')}
      ${textLine(0, 104, theme.ACCENT, 'Data + Cloud', 'body-dim')}
      ${textLine(92, 104, theme.TEXT, 'PostgreSQL, MongoDB')}
      ${textLine(92, 120, theme.TEXT, 'MySQL, Azure')}
      ${textLine(92, 136, theme.TEXT, 'Microsoft Fabric, Cloudflare Workers')}
    </g>
  `);
}

function renderNowCard(theme) {
  return card(624, 408, 164, 148, 'NOW', `
    <g transform="translate(22 54)">
      ${textLine(0, 0, theme.ACCENT, 'Grinding DSA', 'body')}
      ${textLine(0, 24, theme.TEXT_DIM, 'System design', 'body')}
      ${textLine(0, 48, theme.TEXT_DIM, 'Backend systems', 'body')}
    </g>
  `);
}

function renderInterestsCard(theme) {
  return card(800, 408, 164, 148, 'INTERESTS', `
    <g transform="translate(22 54)">
      ${textLine(0, 0, theme.TEXT_DIM, 'Distributed Systems', 'body')}
      ${textLine(0, 24, theme.TEXT_DIM, 'Backend Engineering', 'body')}
      ${textLine(0, 48, theme.TEXT_DIM, 'AI Agents', 'body')}
      ${textLine(0, 72, theme.TEXT_DIM, 'Open Source', 'body')}
    </g>
  `);
}

function renderPrompt(theme) {
  return `
    <g transform="translate(624 652)">
      <text class="mono body" x="0" y="0" xml:space="preserve"><tspan fill="${theme.PROMPT}">$ </tspan><tspan fill="${theme.COMMAND}">ssh vivek@github</tspan></text>
      <rect class="cursor" x="170" y="-11" width="9" height="13" rx="1.5">
        <animate attributeName="opacity" values="1;0;1" dur="1.05s" repeatCount="indefinite" />
      </rect>
    </g>
  `;
}

function buildContent(theme) {
  return `
    <g class="mono fade-in">
      ${renderLeftPortrait(theme)}
      ${renderAboutCard(theme)}
      ${renderStackCard(theme)}
      ${renderNowCard(theme)}
      ${renderInterestsCard(theme)}
      ${renderPrompt(theme)}
    </g>
  `;
}

function buildSvg(theme) {
  const template = readFileSync(templatePath, 'utf8');
  return template
    .replaceAll('{{BACKGROUND}}', theme.BACKGROUND)
    .replaceAll('{{BORDER}}', theme.BORDER)
    .replaceAll('{{PANEL}}', theme.PANEL)
    .replaceAll('{{PANEL_SOFT}}', theme.PANEL_SOFT)
    .replaceAll('{{PANEL_BORDER}}', theme.PANEL_BORDER)
    .replaceAll('{{TEXT}}', theme.TEXT)
    .replaceAll('{{TEXT_DIM}}', theme.TEXT_DIM)
    .replaceAll('{{PROMPT}}', theme.PROMPT)
    .replaceAll('{{COMMAND}}', theme.COMMAND)
    .replaceAll('{{ACCENT}}', theme.ACCENT)
    .replaceAll('{{CURSOR}}', theme.CURSOR)
    .replace('{{CONTENT}}', buildContent(theme));
}

function writeSvg(filePath, contents) {
  writeFileSync(filePath, `${contents.trim()}\n`, 'utf8');
}

function main() {
  writeSvg(darkOutputPath, buildSvg(themes.dark));
  writeSvg(lightOutputPath, buildSvg(themes.light));
  console.log(`Wrote ${path.relative(projectRoot, darkOutputPath)}`);
  console.log(`Wrote ${path.relative(projectRoot, lightOutputPath)}`);
}

main();