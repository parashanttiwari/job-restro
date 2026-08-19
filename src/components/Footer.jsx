import { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from './Icon.jsx';
import { useLanguage } from '../i18n/LanguageContext.jsx';

const ROLE_LINKS = [
  { label: 'Chefs & Cooks', job: 'job-1' },
  { label: 'Service Staff', job: 'job-4' },
  { label: 'Bar & Bartending', job: 'job-5' },
  { label: 'Management', job: 'job-6' },
];

export default function Footer() {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const year = new Date().getFullYear();

  function handleSubscribe(e) {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail('');
  }

  return (
    <footer className="site-footer">
      <div className="site-footer__glow" aria-hidden="true" />
      <div className="site-footer__inner">
        <div className="site-footer__grid">
          <div className="site-footer__col site-footer__col--brand">
            <Link to="/" className="site-footer__brand">
              <span className="brand-mark brand-mark--sm">
                <Icon name="fork" size={16} />
              </span>
              <span>{t('app.title')}</span>
            </Link>
            <p>{t('footer.blurb')}</p>
            <div className="site-footer__contact">
              <span>
                <Icon name="mail" size={14} /> support@job-restro.example
              </span>
              <span>
                <Icon name="phone" size={14} /> +91 98765 43210
              </span>
            </div>
          </div>

          <div className="site-footer__col">
            <h4>{t('footer.explore')}</h4>
            <nav className="site-footer__links">
              <Link to="/">{t('nav.home')}</Link>
              <Link to="/jobs">{t('nav.jobs')}</Link>
              <Link to="/about">{t('nav.about')}</Link>
              <Link to="/contact">{t('nav.contact')}</Link>
            </nav>
          </div>

          <div className="site-footer__col">
            <h4>{t('footer.categories')}</h4>
            <nav className="site-footer__links">
              {ROLE_LINKS.map((role) => (
                <Link key={role.job} to={`/jobs?job=${role.job}`}>
                  {role.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="site-footer__col site-footer__col--newsletter">
            <h4>{t('footer.newsletterHeading')}</h4>
            <p>{t('footer.newsletterBody')}</p>
            {subscribed ? (
              <p className="site-footer__subscribed">
                <Icon name="checkCircle" size={16} /> {t('footer.subscribed')}
              </p>
            ) : (
              <form className="site-footer__newsletter" onSubmit={handleSubscribe}>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('footer.emailPlaceholder')}
                  aria-label={t('footer.emailPlaceholder')}
                />
                <button type="submit" aria-label={t('footer.subscribe')}>
                  <Icon name="send" size={15} />
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="site-footer__bottom">
          <p className="site-footer__copy">{t('footer.copy', { year })}</p>
        </div>
      </div>
    </footer>
  );
}
