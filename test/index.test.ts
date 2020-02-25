import * as cp from 'child_process';
import * as path from 'path';
import test from 'ava';

const ip = path.join(process.cwd(), 'src/index.ts');

test('INPUT_REQUIREDANY: expect to pass if labeled by `requiredAny` included in GitHub event labels', t => {
  process.env.INPUT_REQUIREDANY = 'foo';
  process.env.GITHUB_EVENT_PATH = path.join(__dirname, 'fixture/event.json');
  const actual = cp.execSync(`ts-node ${ip}`).toString();
  t.is(actual.trim(), 'ok!')
});

test('INPUT_REQUIREDONEOF: expect to pass if one of labeled by `requiredOneof` included in GitHub event labels', t => {
  process.env.INPUT_REQUIREDONEOF = 'bar,buz';
  process.env.GITHUB_EVENT_PATH = path.join(__dirname, 'fixture/event.json');
  const actual = cp.execSync(`ts-node ${ip}`).toString();
  t.is(actual.trim(), 'ok!')
});

test('INPUT_REQUIREDALL: expect to pass if labeled by `requiredAll` included in GitHub event labels', t => {
  process.env.INPUT_REQUIREDALL = 'foo,bar';
  process.env.GITHUB_EVENT_PATH = path.join(__dirname, 'fixture/event.json');
  const actual = cp.execSync(`ts-node ${ip}`).toString();
  t.is(actual.trim(), 'ok!')
});

test('INPUT_BANNED: expect to pass if not `banned` labeled in GitHub event labels', t => {
  process.env.INPUT_BANNED = 'buz';
  process.env.GITHUB_EVENT_PATH = path.join(__dirname, 'fixture/event.json');
  const actual = cp.execSync(`ts-node ${ip}`).toString();
  t.is(actual.trim(), 'ok!')
});

// TODO: exception case
