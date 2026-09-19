import { describe, it, expect } from 'vitest';
import { formatDateCN, formatFullDate } from '../src/utils/date';

describe('formatDateCN', () => {
  it('formats date with 2-digit year/month/day', () => {
    const date = new Date('2026-05-15T10:30:00Z');
    const formatted = formatDateCN(date);
    expect(formatted).toMatch(/^\d{4}\/\d{2}\/\d{2}$/);
  });

  it('accepts custom Intl options', () => {
    const date = new Date('2026-05-15T10:30:00Z');
    const formatted = formatDateCN(date, { year: 'numeric', month: 'long', day: 'numeric' });
    expect(formatted).toContain('2026');
    expect(formatted).toContain('5');
  });
});

describe('formatFullDate', () => {
  it('formats full Chinese date', () => {
    const date = new Date('2026-05-15T10:30:00Z');
    const formatted = formatFullDate(date);
    expect(formatted).toContain('2026');
    expect(formatted).toContain('5月');
    expect(formatted).toContain('15');
  });
});
