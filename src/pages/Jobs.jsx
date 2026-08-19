import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import JobList from '../components/JobList.jsx';
import ApplicationForm from '../components/ApplicationForm.jsx';
import Icon from '../components/Icon.jsx';
import { jobs } from '../data/jobs.js';
import { useLanguage } from '../i18n/LanguageContext.jsx';
import { useAccount } from '../components/Layout.jsx';

export default function Jobs() {
  const { t } = useLanguage();
  const { account, setAccount } = useAccount();
  const [searchParams] = useSearchParams();
  const initialJobId = searchParams.get('job');
  const [selectedJobId, setSelectedJobId] = useState(
    (initialJobId && jobs.some((job) => job.id === initialJobId) ? initialJobId : jobs[0]?.id) ?? null
  );

  const selectedJob = jobs.find((job) => job.id === selectedJobId) ?? null;

  const { openCount, restaurantCount } = useMemo(() => {
    return {
      openCount: jobs.filter((job) => job.status === 'Open').length,
      restaurantCount: new Set(jobs.map((job) => job.restaurant)).size,
    };
  }, []);

  return (
    <>
      <div className="stats-strip">
        <Icon name="briefcase" size={14} />
        <span>{t('stats.line', { openCount, restaurantCount })}</span>
      </div>

      <main className="layout">
        <JobList jobs={jobs} selectedJobId={selectedJobId} onSelect={setSelectedJobId} />
        <ApplicationForm job={selectedJob} account={account} onLoggedOut={() => setAccount(null)} />
      </main>
    </>
  );
}
