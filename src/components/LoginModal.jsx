import { useState } from 'react';
import { findAccount } from '../data/storage.js';
import { useLanguage } from '../i18n/LanguageContext.jsx';
import Icon from './Icon.jsx';

export default function LoginModal({ onClose, onLoginSuccess }) {
  const { t } = useLanguage();
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const account = findAccount(mobileNumber.trim(), password);
    if (!account) {
      setError(t('login.error'));
      return;
    }
    onLoginSuccess(account);
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="login-title" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h2 id="login-title">{t('login.title')}</h2>
          <button type="button" className="modal__close" onClick={onClose} aria-label="Close">
            <Icon name="x" size={16} />
          </button>
        </div>
        <p className="modal__subtitle">{t('login.subtitle')}</p>
        <form onSubmit={handleSubmit}>
          <label className="field">
            <span className="field__label">{t('login.mobile')}</span>
            <input
              type="tel"
              inputMode="numeric"
              maxLength={10}
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              autoFocus
            />
          </label>
          <label className="field">
            <span className="field__label">{t('login.password')}</span>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
          {error && <p className="field-error">{error}</p>}
          <div className="form-actions">
            <button type="submit" className="btn btn--primary">
              {t('login.submit')}
            </button>
            <button type="button" className="btn btn--ghost" onClick={onClose}>
              {t('login.cancel')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
