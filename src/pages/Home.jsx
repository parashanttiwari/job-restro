import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from '../components/Icon.jsx';
import JobCard from '../components/JobCard.jsx';
import Reveal from '../components/Reveal.jsx';
import Counter from '../components/Counter.jsx';
import Marquee from '../components/Marquee.jsx';
import Testimonials from '../components/Testimonials.jsx';
import { jobs } from '../data/jobs.js';
import { CATEGORIES } from '../data/categories.js';
import { useLanguage } from '../i18n/LanguageContext.jsx';

const FEATURES = [
  { icon: 'briefcase', tone: 'amber', key: 'home.features.roles' },
  { icon: 'globe', tone: 'emerald', key: 'home.features.bilingual' },
  { icon: 'user', tone: 'blue', key: 'home.features.profile' },
  { icon: 'checkCircle', tone: 'gold', key: 'home.features.free' },
];

const STEPS_SEEKERS = [
  { icon: 'search', key: 'home.steps.search' },
  { icon: 'upload', key: 'home.steps.apply' },
  { icon: 'checkCircle', key: 'home.steps.hired' },
];

const STEPS_EMPLOYERS = [
  { icon: 'briefcase', key: 'home.steps.post' },
  { icon: 'user', key: 'home.steps.review' },
  { icon: 'checkCircle', key: 'home.steps.hire' },
];

const RESOURCES = [
  { icon: 'upload', key: 'home.resources.resume' },
  { icon: 'user', key: 'home.resources.interview' },
  { icon: 'tag', key: 'home.resources.salary' },
];

const TESTIMONIAL_NAMES = [
  { key: 'a', name: 'Rohit Sharma', role: 'Line Cook, Spice Route Kitchen', rating: 5 },
  { key: 'b', name: 'Ananya Iyer', role: 'Restaurant Manager, The Golden Spoon', rating: 5 },
  { key: 'c', name: 'Farhan Khan', role: 'Bartender, Skyline Lounge', rating: 4 },
  { key: 'd', name: 'Vikram Nair', role: 'Owner, The Coastal Table', rating: 5 },
];

export default function Home() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [audience, setAudience] = useState('seekers');
  const [searchTitle, setSearchTitle] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [searchCategory, setSearchCategory] = useState('');
  const [searchExperience, setSearchExperience] = useState('');

  const {
    openCount,
    restaurantCount,
    featuredJobs,
    restaurantNames,
    categoryCounts,
    topRestaurants,
    topLocations,
    experienceOptions,
  } = useMemo(() => {
    const open = jobs.filter((job) => job.status === 'Open');

    const byCategory = {};
    for (const job of jobs) {
      if (job.status !== 'Open') continue;
      byCategory[job.roleCategory] = (byCategory[job.roleCategory] || 0) + 1;
    }

    const byRestaurant = new Map();
    for (const job of jobs) {
      const entry = byRestaurant.get(job.restaurant) || {
        name: job.restaurant,
        name_hi: job.restaurant_hi,
        location: job.location,
        location_hi: job.location_hi,
        count: 0,
      };
      entry.count += 1;
      byRestaurant.set(job.restaurant, entry);
    }

    const byLocation = new Map();
    for (const job of jobs) {
      const entry = byLocation.get(job.location) || {
        location: job.location,
        location_hi: job.location_hi,
        count: 0,
      };
      entry.count += 1;
      byLocation.set(job.location, entry);
    }

    return {
      openCount: open.length,
      restaurantCount: new Set(jobs.map((job) => job.restaurant)).size,
      featuredJobs: open.slice(0, 3),
      restaurantNames: [...new Set(jobs.map((job) => job.restaurant))],
      categoryCounts: byCategory,
      topRestaurants: [...byRestaurant.values()].sort((a, b) => b.count - a.count),
      topLocations: [...byLocation.values()].sort((a, b) => b.count - a.count),
      experienceOptions: [...new Set(jobs.map((job) => job.experience))],
    };
  }, []);

  const steps = audience === 'seekers' ? STEPS_SEEKERS : STEPS_EMPLOYERS;

  function handleSearch(e) {
    e.preventDefault();
    const terms = [searchTitle, searchLocation, searchCategory, searchExperience].filter(Boolean);
    navigate(terms.length ? `/jobs?q=${encodeURIComponent(terms.join(' '))}` : '/jobs');
  }

  return (
    <main className="home">
      <section className="hero-section">
        <div className="hero-section__bg" aria-hidden="true">
          <span className="hero-section__blob hero-section__blob--1" />
          <span className="hero-section__blob hero-section__blob--2" />
        </div>

        <Reveal className="hero" y={20}>
          <span className="hero__eyebrow">
            <Icon name="sparkle" size={14} />
            {t('home.eyebrow')}
          </span>
          <h1>{t('home.heroTitle')}</h1>
          <p className="hero__subtitle">{t('home.heroSubtitle')}</p>
        </Reveal>

        <Reveal delay={0.12} className="hero-search-wrap">
          <form className="hero-search" onSubmit={handleSearch}>
            <div className="hero-search__field">
              <label htmlFor="search-title">{t('home.search.titleLabel')}</label>
              <div className="hero-search__input">
                <Icon name="search" size={16} />
                <input
                  id="search-title"
                  type="text"
                  value={searchTitle}
                  onChange={(e) => setSearchTitle(e.target.value)}
                  placeholder={t('home.search.titlePlaceholder')}
                />
              </div>
            </div>

            <div className="hero-search__field">
              <label htmlFor="search-location">{t('home.search.locationLabel')}</label>
              <div className="hero-search__input">
                <Icon name="pin" size={16} />
                <input
                  id="search-location"
                  type="text"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  placeholder={t('home.search.locationPlaceholder')}
                />
              </div>
            </div>

            <div className="hero-search__field">
              <label htmlFor="search-category">{t('home.search.categoryLabel')}</label>
              <div className="hero-search__input">
                <Icon name="briefcase" size={16} />
                <select
                  id="search-category"
                  value={searchCategory}
                  onChange={(e) => setSearchCategory(e.target.value)}
                >
                  <option value="">{t('home.search.categoryPlaceholder')}</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {t(cat.key)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="hero-search__field">
              <label htmlFor="search-experience">{t('home.search.experienceLabel')}</label>
              <div className="hero-search__input">
                <Icon name="clock" size={16} />
                <select
                  id="search-experience"
                  value={searchExperience}
                  onChange={(e) => setSearchExperience(e.target.value)}
                >
                  <option value="">{t('home.search.experiencePlaceholder')}</option>
                  {experienceOptions.map((exp) => (
                    <option key={exp} value={exp}>
                      {exp}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button type="submit" className="btn btn--primary hero-search__submit">
              <Icon name="search" size={16} />
              {t('home.search.button')}
            </button>
          </form>
        </Reveal>

        <Reveal className="hero__stats" delay={0.22}>
          <div className="hero__stat">
            <strong><Counter value={openCount} /></strong>
            <span>{t('home.statOpenRoles')}</span>
          </div>
          <div className="hero__stat">
            <strong><Counter value={restaurantCount} /></strong>
            <span>{t('home.statRestaurants')}</span>
          </div>
          <div className="hero__stat">
            <strong><Counter value={2} /></strong>
            <span>{t('home.statLanguages')}</span>
          </div>
          <div className="hero__stat">
            <strong><Counter value={5} suffix=" min" /></strong>
            <span>{t('home.statApplyTime')}</span>
          </div>
        </Reveal>
      </section>

      <div className="marquee-strip">
        <Marquee items={restaurantNames} />
      </div>

      <section className="section categories">
        <Reveal as="h2" className="section__heading section__heading--center">
          {t('home.categoriesHeading')}
        </Reveal>
        <Reveal as="p" delay={0.05} className="section__subtitle">
          {t('home.categoriesSubtitle')}
        </Reveal>
        <div className="categories__grid">
          {CATEGORIES.map((cat, i) => (
            <Reveal key={cat.value} delay={i * 0.06} className="reveal-block">
              <Link to={`/jobs?q=${encodeURIComponent(cat.value)}`} className="category-card">
                <span className="category-card__icon">
                  <Icon name={cat.icon} size={22} />
                </span>
                <h3>{t(cat.key)}</h3>
                <span className="category-card__count">
                  {t('jobList.count', { n: categoryCounts[cat.value] || 0 })}
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section top-hiring">
        <Reveal as="h2" className="section__heading section__heading--center">
          {t('home.topHiringHeading')}
        </Reveal>
        <Reveal as="p" delay={0.05} className="section__subtitle">
          {t('home.topHiringSubtitle')}
        </Reveal>
        <div className="top-hiring__grid">
          {topRestaurants.map((r, i) => (
            <Reveal key={r.name} delay={i * 0.06} className="reveal-block">
              <Link to={`/jobs?q=${encodeURIComponent(r.name)}`} className="hiring-card">
                <span className="hiring-card__icon">
                  <Icon name="briefcase" size={18} />
                </span>
                <div>
                  <h3>{r.name}</h3>
                  <p>{r.location}</p>
                </div>
                <span className="hiring-card__count">{t('jobList.count', { n: r.count })}</span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section by-location">
        <Reveal as="h2" className="section__heading section__heading--center">
          {t('home.byLocationHeading')}
        </Reveal>
        <Reveal as="p" delay={0.05} className="section__subtitle">
          {t('home.byLocationSubtitle')}
        </Reveal>
        <div className="location__grid">
          {topLocations.map((loc, i) => (
            <Reveal key={loc.location} delay={i * 0.06} className="reveal-block">
              <Link to={`/jobs?q=${encodeURIComponent(loc.location)}`} className="location-card">
                <span className="location-card__icon">
                  <Icon name="pin" size={16} />
                </span>
                <span>{loc.location}</span>
                <span className="location-card__count">{t('jobList.count', { n: loc.count })}</span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section features">
        <Reveal as="h2" className="section__heading section__heading--center">
          {t('home.featuresHeading')}
        </Reveal>
        <div className="features__grid">
          {FEATURES.map((feature, i) => (
            <Reveal key={feature.key} delay={i * 0.08} className={`feature-card feature-card--${feature.tone}`}>
              <span className="feature-card__icon">
                <Icon name={feature.icon} size={20} />
              </span>
              <h3>{t(`${feature.key}.title`)}</h3>
              <p>{t(`${feature.key}.body`)}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section steps">
        <Reveal as="h2" className="section__heading section__heading--center">
          {t('home.stepsHeading')}
        </Reveal>
        <Reveal delay={0.05} className="steps__tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={audience === 'seekers'}
            className={`steps__tab ${audience === 'seekers' ? 'steps__tab--active' : ''}`}
            onClick={() => setAudience('seekers')}
          >
            {t('home.stepsTabSeekers')}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={audience === 'employers'}
            className={`steps__tab ${audience === 'employers' ? 'steps__tab--active' : ''}`}
            onClick={() => setAudience('employers')}
          >
            {t('home.stepsTabEmployers')}
          </button>
        </Reveal>
        <div className="steps__row">
          {steps.map((step, i) => (
            <Reveal key={step.key} delay={i * 0.1} className="step-card">
              <span className="step-card__index">{i + 1}</span>
              <span className="step-card__icon">
                <Icon name={step.icon} size={22} />
              </span>
              <h3>{t(`${step.key}.title`)}</h3>
              <p>{t(`${step.key}.body`)}</p>
              {i < steps.length - 1 && <span className="step-card__connector" aria-hidden="true" />}
            </Reveal>
          ))}
        </div>
        {audience === 'employers' && (
          <Reveal delay={0.1} className="steps__cta">
            <Link to="/contact" className="btn btn--secondary">
              {t('home.ctaPostJob')}
              <Icon name="arrowRight" size={15} />
            </Link>
          </Reveal>
        )}
      </section>

      <section className="section featured-jobs">
        <div className="section__heading-row">
          <Reveal as="h2" className="section__heading">
            {t('home.featuredHeading')}
          </Reveal>
          <Reveal as="span" delay={0.1}>
            <Link to="/jobs" className="link-button">
              {t('home.viewAll')}
            </Link>
          </Reveal>
        </div>
        <div className="featured-jobs__grid">
          {featuredJobs.map((job, i) => (
            <Reveal key={job.id} delay={i * 0.08} className="featured-jobs__item">
              <JobCard job={job} selected={false} onSelect={(id) => navigate(`/jobs?job=${id}`)} />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section resources">
        <Reveal as="h2" className="section__heading section__heading--center">
          {t('home.resourcesHeading')}
        </Reveal>
        <Reveal as="p" delay={0.05} className="section__subtitle">
          {t('home.resourcesSubtitle')}
        </Reveal>
        <div className="features__grid">
          {RESOURCES.map((res, i) => (
            <Reveal key={res.key} delay={i * 0.08} className="feature-card resource-card">
              <span className="feature-card__icon">
                <Icon name={res.icon} size={20} />
              </span>
              <h3>{t(`${res.key}.title`)}</h3>
              <p>{t(`${res.key}.body`)}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section testimonials-section">
        <Reveal as="h2" className="section__heading section__heading--center">
          {t('home.testimonialsHeading')}
        </Reveal>
        <Reveal delay={0.1}>
          <Testimonials
            items={TESTIMONIAL_NAMES.map((item) => ({
              ...item,
              quote: t(`home.testimonials.${item.key}`),
            }))}
          />
        </Reveal>
      </section>

      <Reveal as="section" className="section cta-banner">
        <span className="cta-banner__glow" aria-hidden="true" />
        <h2>{t('home.ctaHeading')}</h2>
        <p>{t('home.ctaBody')}</p>
        <div className="cta-banner__actions">
          <Link to="/jobs" className="btn btn--primary btn--lg">
            {t('home.ctaButton')}
            <Icon name="arrowRight" size={15} />
          </Link>
          <Link to="/contact" className="btn btn--secondary btn--lg">
            {t('home.ctaPostJob')}
          </Link>
        </div>
      </Reveal>
    </main>
  );
}
