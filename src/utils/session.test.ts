import test from 'node:test';
import assert from 'node:assert/strict';
import {
  generateSessionId,
  verifyAdminCredentials,
  createOwnerSession,
  isSessionActiveAndValid,
  checkSessionConflict,
  MASTER_ADMIN_PASSWORD,
  AUTHORIZED_SUPER_ADMIN_EMAILS,
} from './session.js';

test('generateSessionId returns unique identifiers prefixed with hb_sess_', () => {
  const id1 = generateSessionId();
  const id2 = generateSessionId();
  assert.ok(id1.startsWith('hb_sess_'));
  assert.ok(id2.startsWith('hb_sess_'));
  assert.notEqual(id1, id2);
});

test('verifyAdminCredentials validates authorized Super Admin accounts correctly', () => {
  // Authorized email with correct password
  const resValid = verifyAdminCredentials('tanzilahammed130@gmail.com', MASTER_ADMIN_PASSWORD);
  assert.equal(resValid.success, true);
  assert.equal(resValid.role, 'Super Admin');
  assert.ok(resValid.name?.includes('তানজিল আহাম্মেদ'));

  // Authorized secondary owner email
  const resValid2 = verifyAdminCredentials('owner@haatbazar.com', MASTER_ADMIN_PASSWORD);
  assert.equal(resValid2.success, true);

  // Unauthorized email address
  const resUnauthorized = verifyAdminCredentials('intruder@random.com', MASTER_ADMIN_PASSWORD);
  assert.equal(resUnauthorized.success, false);
  assert.match(resUnauthorized.error || '', /অননুমোদিত প্রবেশ/);

  // Wrong password
  const resWrongPass = verifyAdminCredentials('tanzilahammed130@gmail.com', 'wrongpassword123');
  assert.equal(resWrongPass.success, false);
  assert.match(resWrongPass.error || '', /ভুল সিকিউরিটি পাসওয়ার্ড/);

  // Empty fields
  assert.equal(verifyAdminCredentials('', '').success, false);
});

test('createOwnerSession generates valid single session payload', () => {
  const session = createOwnerSession('tanzilahammed130@gmail.com', 'Super Admin', 'Tanzil', 'Mozilla 5.0 Desktop');
  assert.ok(session.sessionId.startsWith('hb_sess_'));
  assert.equal(session.adminEmail, 'tanzilahammed130@gmail.com');
  assert.equal(session.role, 'Super Admin');
  assert.ok(session.loginTimestamp > 0);
  assert.equal(session.deviceLabel, 'ডেস্কটপ / ল্যাপটপ (Workstation)');
});

test('isSessionActiveAndValid confirms match and rejects invalid/null sessions', () => {
  const sessionA = createOwnerSession('owner@haatbazar.com');
  assert.equal(isSessionActiveAndValid(sessionA.sessionId, sessionA), true);
  assert.equal(isSessionActiveAndValid('hb_sess_old_token', sessionA), false);
  assert.equal(isSessionActiveAndValid(null, sessionA), false);
  assert.equal(isSessionActiveAndValid(sessionA.sessionId, null), false);
});

test('checkSessionConflict detects concurrent session replacement and invalidates earlier session', () => {
  const session1 = createOwnerSession('owner@haatbazar.com', 'Super Admin', 'Admin', 'Mozilla Desktop');
  
  // As long as session1 is the stored active session, there is no conflict
  const checkInitial = checkSessionConflict(session1.sessionId, session1);
  assert.equal(checkInitial.isConflict, false);

  // Simulate a new login from another device/browser window
  const session2 = createOwnerSession('owner@haatbazar.com', 'Super Admin', 'Admin', 'Mobile Safari');
  
  // For the client holding session1, the active store is now session2
  const conflict = checkSessionConflict(session1.sessionId, session2);
  assert.equal(conflict.isConflict, true);
  assert.ok(conflict.reason?.includes('একক-সেশন (Single Session)'));
  assert.ok(conflict.reason?.includes('বাতিল'));
});
