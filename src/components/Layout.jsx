import { NavLink, Outlet, useLocation, useOutletContext } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Icon from './Icon.jsx';
import Footer from './Footer.jsx';
import LoginModal from './LoginModal.jsx';
import { useLanguage } from '../i18n/LanguageContext.jsx';

const NAV_LINKS = [
  { to: '/', key: 'nav.home', end: true },
  { to: '/jobs', key: 'nav.jobs', end: false },
  { to: '/about', key: 'nav.about', end: false },
  { to: '/contact', key: 'nav.contact', end: false },
];

export default function Layout() {
  const { t, lang, setLang } = useLanguage();
  const [account, setAccount] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <div className="page">
      <header className={`site-header ${scrolled ? 'site-header--scrolled' : ''}`}>
        <div className="site-header__inner">
          <NavLink to="/" className="site-header__brand" end>
            <span className="brand-mark">
              <Icon name="fork" size={20} />
            </span>
            <div>
              <h1>{t('app.title')}</h1>
              <p>{t('app.tagline')}</p>
            </div>
          </NavLink>

          <nav className="site-nav" aria-label={t('nav.main')}>
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) => `site-nav__link ${isActive ? 'site-nav__link--active' : ''}`}
              >
                {t(link.key)}
              </NavLink>
            ))}
          </nav>

          <div className="site-header__actions">
            <div className="site-header__controls">
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
                  <button
                    type="button"
                    className="account-chip__logout"
                    onClick={() => setAccount(null)}
                    aria-label={t('header.logout')}
                  >
                    <Icon name="logOut" size={13} />
                  </button>
                </div>
              ) : (
                <button type="button" className="btn btn--secondary btn--sm" onClick={() => setShowLogin(true)}>
                  <Icon name="user" size={14} />
                  {t('header.login')}
                </button>
              )}
            </div>

            <button
              type="button"
              className="site-header__burger"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              <Icon name={menuOpen ? 'x' : 'menu'} size={20} />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className="mobile-drawer__backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />
            <motion.nav
              className="mobile-drawer"
              aria-label={t('nav.main')}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) => `mobile-drawer__link ${isActive ? 'mobile-drawer__link--active' : ''}`}
                >
                  {t(link.key)}
                </NavLink>
              ))}

              <div className="mobile-drawer__divider" />

              <div className="lang-toggle mobile-drawer__lang" role="group" aria-label={t('header.language')}>
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
                <div className="account-chip mobile-drawer__account">
                  <span className="account-chip__avatar">
                    <Icon name="user" size={14} />
                  </span>
                  <span>{t('header.greeting', { name: account.fullName || account.mobileNumber })}</span>
                  <button
                    type="button"
                    className="account-chip__logout"
                    onClick={() => setAccount(null)}
                    aria-label={t('header.logout')}
                  >
                    <Icon name="logOut" size={13} />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="btn btn--secondary mobile-drawer__login"
                  onClick={() => {
                    setMenuOpen(false);
                    setShowLogin(true);
                  }}
                >
                  <Icon name="user" size={14} />
                  {t('header.login')}
                </button>
              )}
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      <div className="page__main">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <Outlet context={{ account, setAccount }} />
          </motion.div>
        </AnimatePresence>
      </div>

      <Footer />

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

export function useAccount() {
  return useOutletContext();
}
