import { expect } from 'chai';
import { deepCopy } from './obj';

describe('obj', () => {
  it('should clone a type A object', () => {
    const obj = { foo: 'bar' };
    const copy = deepCopy(obj);
    expect(JSON.stringify(obj)).equals(JSON.stringify(copy));
  });

  it('should clone a type B object', () => {
    const obj = { foo: 'bar', obj: [{ foo: 'bar' }] };
    const copy = deepCopy(obj);
    expect(JSON.stringify(obj)).equals(JSON.stringify(copy));
  });

  it('should clone a type C object', () => {
    const obj = { foo: 'bar', da: new Date() };
    const copy = deepCopy(obj);
    expect(JSON.stringify(obj)).equals(JSON.stringify(copy));
  });
});
