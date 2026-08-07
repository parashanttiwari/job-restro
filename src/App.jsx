import { useMemo, useState } from 'react';
import JobList from './components/JobList.jsx';
import ApplicationForm from './components/ApplicationForm.jsx';
import LoginModal from './components/LoginModal.jsx';
import Icon from './components/Icon.jsx';
import { jobs } from './data/jobs.js';
import { useLanguage } from './i18n/LanguageContext.jsx';
import './App.css';

function App() {
  const { t, lang, setLang } = useLanguage();
  const [selectedJobId, setSelectedJobId] = useState(jobs[0]?.id ?? null);
  const [account, setAccount] = useState(null);
  const [showLogin, setShowLogin] = useState(false);

  const selectedJob = jobs.find((job) => job.id === selectedJobId) ?? null;

  const { openCount, restaurantCount } = useMemo(() => {
    return {
      openCount: jobs.filter((job) => job.status === 'Open').length,
      restaurantCount: new Set(jobs.map((job) => job.restaurant)).size,
    };
  }, []);

  return (
    <div className="page">
      <header className="site-header">
        <div className="site-header__inner">
          <div className="site-header__brand">
            <span className="brand-mark">
              <Icon name="fork" size={20} />
            </span>
            <div>
              <h1>{t('app.title')}</h1>
              <p>{t('app.tagline')}</p>
            </div>
          </div>

          <div className="site-header__actions">
            <div className="lang-toggle" role="group" aria-label={t('header.language')}>
              <button
                type="button"
                className={lang === 'en' ? 'lang-toggle__btn lang-toggle__btn--active' : 'lang-toggle__btn'}
                onClick={() => setLang('en')}
              >
                EN
              </button>
              <button
                type="button"
                className={lang === 'hi' ? 'lang-toggle__btn lang-toggle__btn--active' : 'lang-toggle__btn'}
                onClick={() => setLang('hi')}
              >
                हिं
              </button>
            </div>

            {account ? (
              <div className="account-chip">
                <span className="account-chip__avatar">
                  <Icon name="user" size={14} />
                </span>
                <span>{t('header.greeting', { name: account.fullName || account.mobileNumber })}</span>
              </div>
            ) : (
              <button type="button" className="btn btn--secondary btn--sm" onClick={() => setShowLogin(true)}>
                <Icon name="user" size={14} />
                {t('header.login')}
              </button>
            )}
          </div>
        </div>

        <div className="stats-strip">
          <Icon name="briefcase" size={14} />
          <span>{t('stats.line', { openCount, restaurantCount })}</span>
        </div>
      </header>

      <main className="layout">
        <JobList jobs={jobs} selectedJobId={selectedJobId} onSelect={setSelectedJobId} />
        <ApplicationForm job={selectedJob} account={account} onLoggedOut={() => setAccount(null)} />
      </main>

      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onLoginSuccess={(loggedInAccount) => {
            setAccount(loggedInAccount);
            setShowLogin(false);
          }}
        />
      )}
    </div>
  );
}

export default App;
