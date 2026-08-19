import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import JobCard from './JobCard.jsx';
import Icon from './Icon.jsx';
import { useLanguage } from '../i18n/LanguageContext.jsx';

export default function JobList({ jobs, selectedJobId, onSelect }) {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');

  const filteredJobs = useMemo(() => {
    const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (terms.length === 0) return jobs;
    return jobs.filter((job) => {
      const haystack = [
        job.title, job.title_hi, job.restaurant, job.restaurant_hi,
        job.location, job.location_hi, job.roleCategory, job.experience, job.experience_hi,
      ]
        .join(' ')
        .toLowerCase();
      return terms.every((term) => haystack.includes(term));
    });
  }, [jobs, query]);

  return (
    <aside className="job-list" aria-label="Available job openings">
      <div className="job-list__header">
        <h2>{t('jobList.heading')}</h2>
        <span className="job-list__count">{t('jobList.count', { n: jobs.length })}</span>
      </div>

      <div className="job-list__search">
        <Icon name="search" size={16} />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('jobList.searchPlaceholder')}
          aria-label={t('jobList.searchPlaceholder')}
        />
      </div>

      {filteredJobs.length === 0 ? (
        <p className="job-list__empty">{t('jobList.noResults')}</p>
      ) : (
        <ul className="job-list__items">
          {filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} selected={job.id === selectedJobId} onSelect={onSelect} />
          ))}
        </ul>
      )}
    </aside>
  );
}
