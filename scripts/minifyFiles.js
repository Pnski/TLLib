const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');
const { XMLParser, XMLBuilder } = require('fast-xml-parser');

const inputDir = 'sources';
const outputDir = 'minified-sources';

const parser = new XMLParser({
  ignoreAttributes: false,
  ignoreDeclaration: true,
  removeNSPrefix: true,
  // add other options as needed
});
const builder = new XMLBuilder({
  ignoreAttributes: false,
  format: false,
  suppressEmptyNode: true,
});

function isJson(content) {
  try {
    JSON.parse(content);
    return true;
  } catch {
    return false;
  }
}

function isXml(content) {
  // naive check: starts with < and ends with >
  return content.trim().startsWith('<') && content.trim().endsWith('>');
}

async function processFile(filePath) {
  const relPath = path.relative(inputDir, filePath);
  const outputPath = path.join(outputDir, relPath);

  const content = await fs.readFile(filePath, 'utf8');

  let minified;

  if (isJson(content)) {
    // minify JSON
    const obj = JSON.parse(content);
    minified = JSON.stringify(obj);
  } else if (isXml(content)) {
    // minify XML
    const jsonObj = parser.parse(content);
    minified = builder.build(jsonObj);
  } else {
    // copy as is (e.g., images)
    await fs.copy(filePath, outputPath);
    return;
  }

  await fs.outputFile(outputPath, minified);
}

async function run() {
  const files = glob.sync('**/*', { cwd: inputDir, nodir: true });

  for (const file of files) {
    await processFile(path.join(inputDir, file));
  }
}

run().catch(e => {
  console.error(e);
  process.exit(1);
});
