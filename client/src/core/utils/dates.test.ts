import { getDateString, getTimeString, getToday } from './dates';
import { expect } from 'chai';

describe('Dates', () => {
  it('should return expected DateString', () => {
    const date = getDateString(new Date());
    expect(date.substr(2, 1)).equal('-');
    expect(date.substr(5, 1)).equal('-');
    expect(date.length).equal(10);
  });

  it('should return expected TimeString', () => {
    const date = getTimeString(new Date());
    expect(date.substr(2, 1)).equal(':');
    expect(date.substr(5, 1)).equal(':');
    expect(date.length).equal(8);
  });

  it('should return Date object', () => {
    expect(getToday() instanceof Date).equal(true);
  });
});
