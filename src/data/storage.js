const ACCOUNTS_KEY = 'rr_accounts';
const DRAFTS_KEY = 'rr_drafts';
const APPLICATIONS_KEY = 'rr_applications';
const MESSAGES_KEY = 'rr_messages';

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function findAccount(mobileNumber, password) {
  const accounts = readJSON(ACCOUNTS_KEY, {});
  const account = accounts[mobileNumber];
  if (account && account.password === password) return account;
  return null;
}

export function upsertAccount(profile) {
  const accounts = readJSON(ACCOUNTS_KEY, {});
  accounts[profile.mobileNumber] = profile;
  writeJSON(ACCOUNTS_KEY, accounts);
}

export function getDraft(jobId) {
  const drafts = readJSON(DRAFTS_KEY, {});
  return drafts[jobId] || null;
}

export function saveDraft(jobId, data) {
  const drafts = readJSON(DRAFTS_KEY, {});
  drafts[jobId] = { ...data, savedAt: new Date().toISOString() };
  writeJSON(DRAFTS_KEY, drafts);
}

export function clearDraft(jobId) {
  const drafts = readJSON(DRAFTS_KEY, {});
  delete drafts[jobId];
  writeJSON(DRAFTS_KEY, drafts);
}

export function saveApplication(application) {
  const applications = readJSON(APPLICATIONS_KEY, []);
  applications.push({ ...application, submittedAt: new Date().toISOString() });
  writeJSON(APPLICATIONS_KEY, applications);
}

export function saveContactMessage(message) {
  const messages = readJSON(MESSAGES_KEY, []);
  messages.push({ ...message, submittedAt: new Date().toISOString() });
  writeJSON(MESSAGES_KEY, messages);
}
