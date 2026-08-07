import Icon from './Icon.jsx';
import { useLanguage } from '../i18n/LanguageContext.jsx';

const ROLE_ICON = {
  chef: 'chefHat',
  baker: 'bread',
  service: 'tray',
  bar: 'cocktail',
  manager: 'briefcase',
  wash: 'droplet',
};

export default function JobCard({ job, selected, onSelect }) {
  const { t, localize, lang } = useLanguage();
  const isClosed = job.status === 'Closed';
  const iconName = ROLE_ICON[job.roleCategory] || 'fork';

  return (
    <li className={`job-card ${selected ? 'job-card--selected' : ''} ${isClosed ? 'job-card--closed' : ''}`}>
      <button
        type="button"
        className="job-card__button"
        onClick={() => onSelect(job.id)}
        aria-pressed={selected}
      >
        <div className="job-card__row">
          <span className={`job-card__icon job-card__icon--${job.roleCategory}`}>
            <Icon name={iconName} size={20} />
          </span>
          <div className="job-card__main">
            <div className="job-card__top">
              <h3 className="job-card__title">{localize(job, 'title')}</h3>
              <span className={`status-pill status-pill--${job.status.toLowerCase()}`}>
                <span className="status-pill__dot" />
                {t(`status.${job.status}`)}
              </span>
            </div>
            <p className="job-card__restaurant">{localize(job, 'restaurant')}</p>

            <div className="job-card__salary">{lang === 'hi' ? job.salaryRange_hi : job.salaryRange}</div>

            <dl className="job-card__meta">
              <div>
                <Icon name="pin" size={13} className="job-card__meta-icon" />
                <dd>{localize(job, 'location')}</dd>
              </div>
              <div>
                <Icon name="briefcase" size={13} className="job-card__meta-icon" />
                <dd>{localize(job, 'experience')}</dd>
              </div>
            </dl>

            <div className="job-card__bottom">
              <span className="job-card__type">{t(`employmentType.${job.employmentType}`)}</span>
              <span className="job-card__apply">
                {isClosed ? t('jobCard.closed') : t('jobCard.apply')}
                {!isClosed && <Icon name="arrowRight" size={13} />}
              </span>
            </div>
          </div>
        </div>
      </button>
    </li>
  );
}
