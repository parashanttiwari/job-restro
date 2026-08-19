import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/Icon.jsx';
import Reveal from '../components/Reveal.jsx';
import Counter from '../components/Counter.jsx';
import { jobs } from '../data/jobs.js';
import { useLanguage } from '../i18n/LanguageContext.jsx';

const VALUES = [
  { icon: 'checkCircle', tone: 'amber', key: 'about.values.trust' },
  { icon: 'globe', tone: 'emerald', key: 'about.values.access' },
  { icon: 'briefcase', tone: 'blue', key: 'about.values.opportunity' },
];

export default function About() {
  const { t } = useLanguage();

  const stats = useMemo(
    () => ({
      roles: jobs.length,
      restaurants: new Set(jobs.map((job) => job.restaurant)).size,
      cities: new Set(jobs.map((job) => job.location)).size,
    }),
    []
  );

  return (
    <main className="page-content about">
      <section className="page-hero">
        <div className="page-hero__bg" aria-hidden="true">
          <span className="hero-section__blob hero-section__blob--1" />
        </div>
        <Reveal as="span" className="hero__eyebrow">
          <Icon name="fork" size={14} />
          {t('about.eyebrow')}
        </Reveal>
        <Reveal as="h1" delay={0.05}>
          {t('about.title')}
        </Reveal>
        <Reveal as="p" className="hero__subtitle" delay={0.1}>
          {t('about.intro')}
        </Reveal>
      </section>

      <Reveal as="section" className="section about__stats">
        <div className="about__stats-grid">
          <div className="about__stat">
            <strong><Counter value={stats.roles} /></strong>
            <span>{t('about.statRoles')}</span>
          </div>
          <div className="about__stat">
            <strong><Counter value={stats.restaurants} /></strong>
            <span>{t('about.statRestaurants')}</span>
          </div>
          <div className="about__stat">
            <strong><Counter value={stats.cities} /></strong>
            <span>{t('about.statCities')}</span>
          </div>
          <div className="about__stat">
            <strong><Counter value={2} /></strong>
            <span>{t('about.statLanguages')}</span>
          </div>
        </div>
      </Reveal>

      <section className="section about__mission">
        <div className="about__mission-grid">
          <Reveal as="div">
            <h2 className="section__heading">{t('about.missionHeading')}</h2>
            <p>{t('about.missionBody')}</p>
          </Reveal>
          <Reveal as="div" delay={0.1} className="about__mission-visual">
            <span className="about__mission-blob" aria-hidden="true" />
            <span className="about__mission-badge about__mission-badge--1">
              <Icon name="chefHat" size={22} />
            </span>
            <span className="about__mission-badge about__mission-badge--2">
              <Icon name="cocktail" size={22} />
            </span>
            <span className="about__mission-badge about__mission-badge--3">
              <Icon name="briefcase" size={22} />
            </span>
            <span className="about__mission-core">
              <Icon name="fork" size={34} />
            </span>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <Reveal as="h2" className="section__heading section__heading--center">
          {t('about.valuesHeading')}
        </Reveal>
        <div className="features__grid">
          {VALUES.map((value, i) => (
            <Reveal key={value.key} delay={i * 0.08} className={`feature-card feature-card--${value.tone}`}>
              <span className="feature-card__icon">
                <Icon name={value.icon} size={20} />
              </span>
              <h3>{t(`${value.key}.title`)}</h3>
              <p>{t(`${value.key}.body`)}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <Reveal as="section" className="section cta-banner">
        <span className="cta-banner__glow" aria-hidden="true" />
        <h2>{t('home.ctaHeading')}</h2>
        <p>{t('home.ctaBody')}</p>
        <Link to="/jobs" className="btn btn--primary btn--lg">
          {t('home.ctaButton')}
          <Icon name="arrowRight" size={15} />
        </Link>
      </Reveal>
    </main>
  );
}
