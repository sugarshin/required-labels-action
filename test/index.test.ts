import * as cp from 'child_process';
import * as path from 'path';
import test from 'ava';

const ip = path.join(process.cwd(), 'src/index.ts');

test('INPUT_REQUIRED_ANY: expect to pass if labeled by `required_any` included in GitHub event labels', t => {
  process.env.INPUT_REQUIRED_ANY = 'foo';
  process.env.GITHUB_EVENT_PATH = path.join(__dirname, 'fixture/event.json');
  const actual = cp.execSync(`ts-node ${ip}`).toString();
  t.is(actual.trim(), '::set-output name=required_labels::ok')
});

test('INPUT_REQUIRED_ONEOF: expect to pass if one of labeled by `required_oneof` included in GitHub event labels', t => {
  process.env.INPUT_REQUIRED_ONEOF = 'bar,buz';
  process.env.GITHUB_EVENT_PATH = path.join(__dirname, 'fixture/event.json');
  const actual = cp.execSync(`ts-node ${ip}`).toString();
  t.is(actual.trim(), '::set-output name=required_labels::ok')
});

test('INPUT_REQUIRED_ALL: expect to pass if labeled by `required_all` included in GitHub event labels', t => {
  process.env.INPUT_REQUIRED_ALL = 'foo,bar';
  process.env.GITHUB_EVENT_PATH = path.join(__dirname, 'fixture/event.json');
  const actual = cp.execSync(`ts-node ${ip}`).toString();
  t.is(actual.trim(), '::set-output name=required_labels::ok')
});

test('INPUT_BANNED: expect to pass if not `banned` labeled in GitHub event labels', t => {
  process.env.INPUT_BANNED = 'buz';
  process.env.GITHUB_EVENT_PATH = path.join(__dirname, 'fixture/event.json');
  const actual = cp.execSync(`ts-node ${ip}`).toString();
  t.is(actual.trim(), '::set-output name=required_labels::ok')
});

// TODO: exception case
