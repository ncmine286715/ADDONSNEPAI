import { readFileSync, writeFileSync } from 'fs';
import JSON5 from 'json5';

const input = './src/data/addons.json5';
const output = './src/data/addons.json';

try {
  const content = readFileSync(input, 'utf8');
  const parsed = JSON5.parse(content);
  writeFileSync(output, JSON.stringify(parsed, null, 2));
  console.log('✅ addons.json gerado com sucesso!');
} catch (err) {
  console.error('❌ Erro ao processar JSON5:', err.message);
  process.exit(1);
}
