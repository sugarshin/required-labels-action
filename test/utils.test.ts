import test from 'ava';
import { uniq, includesOneof } from '../src/utils';

test('uniq: expect to uniqueness string array', t => {
  const expected = ['foo', 'bar', 'baz'];
  const actual = uniq(['foo', 'foo', 'bar', 'baz'])
  t.deepEqual(expected, actual);
});

test('includesOneof: expect to include a one of thing', t => {
  t.true(includesOneof(['foo', 'bar'], ['bar', 'baz']));
});

test('includesOneof: expect to false if two targets are includes', t => {
  t.false(includesOneof(['foo', 'bar'], ['foo', 'bar', 'baz']));
});
