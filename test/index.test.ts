import * as cp from 'child_process';
import * as path from 'path';
import test from 'ava';

// wip
test('INPUT_REQUIREDANY: passed', () => {
  process.env.INPUT_REQUIREDANY = 'foo';
  process.env.GITHUB_EVENT_PATH = path.join(__dirname, 'fixture/required-any-passed.json');
  const ip = path.join(process.cwd(), 'index.ts');
  console.log(cp.execSync(`ts-node ${ip}`).toString());
});
