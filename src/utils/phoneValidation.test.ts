import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  validateBangladeshPhoneNumber,
  VALID_BD_PREFIXES,
  generateOTP,
} from './phoneValidation.ts';

test('validateBangladeshPhoneNumber accepts standard 11-digit local format with valid prefixes', () => {
  const validNumbers = [
    '01312345678',
    '01412345678',
    '01512345678',
    '01612345678',
    '01712345678',
    '01812345678',
    '01912345678',
  ];

  for (const num of validNumbers) {
    const res = validateBangladeshPhoneNumber(num);
    assert.equal(res.isValid, true, `Expected ${num} to be valid`);
    assert.equal(res.normalizedNumber, num);
  }
});

test('validateBangladeshPhoneNumber normalizes +880 and 880 international prefixes to 11 digits', () => {
  const res1 = validateBangladeshPhoneNumber('+8801712345678');
  assert.equal(res1.isValid, true);
  assert.equal(res1.normalizedNumber, '01712345678');

  const res2 = validateBangladeshPhoneNumber('8801812345678');
  assert.equal(res2.isValid, true);
  assert.equal(res2.normalizedNumber, '01812345678');

  const res3 = validateBangladeshPhoneNumber('+880 1912-345678');
  assert.equal(res3.isValid, true);
  assert.equal(res3.normalizedNumber, '01912345678');
});

test('validateBangladeshPhoneNumber rejects invalid prefixes (e.g. 010, 011, 012)', () => {
  const invalidPrefixes = ['01012345678', '01112345678', '01212345678'];
  for (const num of invalidPrefixes) {
    const res = validateBangladeshPhoneNumber(num);
    assert.equal(res.isValid, false, `Expected ${num} to be invalid`);
    assert.ok(res.error);
    assert.ok(res.errorBn);
  }
});

test('validateBangladeshPhoneNumber rejects numbers with wrong lengths', () => {
  const tooShort = validateBangladeshPhoneNumber('0171234567'); // 10 digits
  assert.equal(tooShort.isValid, false);

  const tooLong = validateBangladeshPhoneNumber('017123456789'); // 12 digits
  assert.equal(tooLong.isValid, false);
});

test('validateBangladeshPhoneNumber rejects letters or symbols', () => {
  const withLetters = validateBangladeshPhoneNumber('0171234567a');
  assert.equal(withLetters.isValid, false);
});

test('generateOTP creates a 4-digit numeric string', () => {
  for (let i = 0; i < 10; i++) {
    const otp = generateOTP();
    assert.equal(otp.length, 4);
    assert.ok(/^\d{4}$/.test(otp));
  }
});
