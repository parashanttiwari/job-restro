import { useEffect, useRef, useState } from 'react';
import { getDraft, saveDraft, clearDraft, saveApplication, upsertAccount } from '../data/storage.js';
import { useLanguage } from '../i18n/LanguageContext.jsx';
import {
  educationOptions,
  experienceOptions,
  availabilityOptions,
  genderOptions,
  noticePeriodOptions,
} from '../i18n/translations.js';
import Icon from './Icon.jsx';

const MAX_RESUME_BYTES = 5 * 1024 * 1024;

const EMPTY_FORM = {
  fullName: '',
  mobileNumber: '',
  currentLocation: '',
  highestEducation: '',
  totalExperience: '',
  availabilityToJoin: '',
  password: '',
  email: '',
  age: '',
  gender: '',
  preferredWorkLocation: '',
  currentEmployer: '',
  currentSalary: '',
  expectedSalary: '',
  noticePeriod: '',
  skills: '',
  languagesKnown: '',
  additionalComments: '',
};

const MANDATORY_FIELDS = [
  ['fullName', 'field.fullName'],
  ['mobileNumber', 'field.mobileNumber'],
  ['currentLocation', 'field.currentLocation'],
  ['highestEducation', 'field.highestEducation'],
  ['totalExperience', 'field.totalExperience'],
  ['availabilityToJoin', 'field.availability'],
];

function profileFromAccount(account) {
  const { password: _pw, ...rest } = account;
  return { ...EMPTY_FORM, ...rest, mobileNumber: account.mobileNumber, password: '' };
}

export default function ApplicationForm({ job, account, onLoggedOut }) {
  const { t, lang, localize } = useLanguage();
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [resume, setResume] = useState({ status: 'idle', progress: 0, fileName: '', note: '' });
  const [photoFileName, setPhotoFileName] = useState('');
  const [submitStatus, setSubmitStatus] = useState('idle');
  const [draftNotice, setDraftNotice] = useState('');
  const [dropActive, setDropActive] = useState(false);
  const progressTimer = useRef(null);
  const resumeInputRef = useRef(null);

  const completedCount = MANDATORY_FIELDS.filter(([field]) => formData[field]?.trim()).length +
    (resume.status === 'done' ? 1 : 0);
  const totalMandatory = MANDATORY_FIELDS.length + 1;

  useEffect(() => {
    if (!job) return;

    setSubmitStatus('idle');
    setErrors({});
    setPhotoFileName('');
    setResume({ status: 'idle', progress: 0, fileName: '', note: '' });

    const draft = getDraft(job.id);
    if (draft) {
      const { savedAt, resumeFileName, ...fields } = draft;
      setFormData({ ...EMPTY_FORM, ...fields });
      if (resumeFileName) {
        setResume({
          status: 'idle',
          progress: 0,
          fileName: '',
          note: t('form.draftFileNote', { file: resumeFileName }),
        });
      }
      setDraftNotice(t('form.draftRestored', { time: new Date(savedAt).toLocaleString() }));
    } else if (account) {
      setFormData(profileFromAccount(account));
      setDraftNotice('');
    } else {
      setFormData(EMPTY_FORM);
      setDraftNotice('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [job, account]);

  useEffect(() => () => clearInterval(progressTimer.current), []);

  if (!job) {
    return (
      <section className="application-form application-form--empty">
        <Icon name="briefcase" size={28} />
        <p>{t('form.emptyState')}</p>
      </section>
    );
  }

  const isClosed = job.status === 'Closed';

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function startResumeUpload(file) {
    clearInterval(progressTimer.current);
    setErrors((prev) => ({ ...prev, resume: undefined }));

    if (file.size > MAX_RESUME_BYTES) {
      setResume({ status: 'idle', progress: 0, fileName: '', note: '' });
      setErrors((prev) => ({ ...prev, resume: t('validation.fileTooLarge') }));
      return;
    }

    setResume({ status: 'uploading', progress: 0, fileName: file.name, note: '' });
    progressTimer.current = setInterval(() => {
      setResume((prev) => {
        if (prev.status !== 'uploading') {
          clearInterval(progressTimer.current);
          return prev;
        }
        const next = Math.min(prev.progress + Math.round(15 + Math.random() * 20), 100);
        if (next >= 100) {
          clearInterval(progressTimer.current);
          return { ...prev, progress: 100, status: 'done' };
        }
        return { ...prev, progress: next };
      });
    }, 200);
  }

  function handleResumeInputChange(e) {
    const file = e.target.files?.[0];
    if (file) startResumeUpload(file);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDropActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) startResumeUpload(file);
  }

  function handlePhotoChange(e) {
    const file = e.target.files?.[0];
    setPhotoFileName(file ? file.name : '');
  }

  function validate() {
    const nextErrors = {};
    MANDATORY_FIELDS.forEach(([field, labelKey]) => {
      if (!formData[field] || !formData[field].trim()) {
        nextErrors[field] = t('validation.required', { label: t(labelKey) });
      }
    });
    if (!account && (!formData.password || formData.password.length < 6)) {
      nextErrors.password = t('validation.passwordMin');
    }
    if (resume.status !== 'done') {
      nextErrors.resume = t('validation.resumeRequired');
    }
    if (formData.mobileNumber && !/^\d{10}$/.test(formData.mobileNumber.trim())) {
      nextErrors.mobileNumber = t('validation.mobileInvalid');
    }
    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
      nextErrors.email = t('validation.emailInvalid');
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleApply(e) {
    e.preventDefault();
    if (isClosed) return;
    if (!validate()) return;

    const profile = { ...formData, password: account ? account.password : formData.password };
    upsertAccount(profile);
    saveApplication({
      jobId: job.id,
      jobTitle: job.title,
      restaurant: job.restaurant,
      mobileNumber: formData.mobileNumber,
      resumeFileName: resume.fileName,
      photoFileName,
    });
    clearDraft(job.id);
    setSubmitStatus('success');
  }

  function handleSaveDraft() {
    saveDraft(job.id, { ...formData, resumeFileName: resume.fileName });
    setDraftNotice(t('form.draftSaved'));
  }

  function handleReset() {
    clearInterval(progressTimer.current);
    setFormData(account ? profileFromAccount(account) : EMPTY_FORM);
    setResume({ status: 'idle', progress: 0, fileName: '', note: '' });
    setPhotoFileName('');
    setErrors({});
    setSubmitStatus('idle');
    setDraftNotice('');
  }

  if (submitStatus === 'success') {
    return (
      <section className="application-form">
        <div className="success-banner" role="status">
          <span className="success-banner__icon">
            <Icon name="checkCircle" size={30} />
          </span>
          <h2>{t('success.title')}</h2>
          <p>
            {t('success.message', {
              name: formData.fullName.split(' ')[0],
              job: localize(job, 'title'),
              restaurant: localize(job, 'restaurant'),
            })}
          </p>
          <button type="button" className="btn btn--primary" onClick={() => setSubmitStatus('idle')}>
            {t('actions.backToForm')}
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="application-form">
      <header className="application-form__header">
        <div className="application-form__heading-row">
          <div>
            <h2>{t('form.headingApplyFor', { job: localize(job, 'title') })}</h2>
            <p className="application-form__subtitle">
              {localize(job, 'restaurant')} · {localize(job, 'location')}
            </p>
          </div>
          <div className="form-progress" aria-hidden="true">
            <svg width="44" height="44" viewBox="0 0 44 44">
              <circle cx="22" cy="22" r="18" className="form-progress__track" />
              <circle
                cx="22"
                cy="22"
                r="18"
                className="form-progress__value"
                style={{
                  strokeDasharray: 2 * Math.PI * 18,
                  strokeDashoffset: 2 * Math.PI * 18 * (1 - completedCount / totalMandatory),
                }}
              />
            </svg>
            <span className="form-progress__label">
              {completedCount}/{totalMandatory}
            </span>
          </div>
        </div>

        {account && (
          <p className="logged-in-banner">
            <Icon name="user" size={14} />
            {t('form.loggedInAs', { mobile: account.mobileNumber })}{' '}
            <button type="button" className="link-button" onClick={onLoggedOut}>
              {t('header.logout')}
            </button>
          </p>
        )}
        {isClosed && (
          <p className="closed-banner">
            <Icon name="x" size={14} />
            {t('form.closedNotice')}
          </p>
        )}
        {draftNotice && <p className="draft-notice">{draftNotice}</p>}
      </header>

      <form onSubmit={handleApply} noValidate>
        <fieldset disabled={isClosed}>
          <SectionHeading index={1} title={t('form.sections.basic')} />
          <div className="form-grid">
            <Field label={t('field.fullName')} required error={errors.fullName}>
              <input name="fullName" value={formData.fullName} onChange={handleChange} type="text" />
            </Field>

            <Field label={t('field.mobileNumber')} required error={errors.mobileNumber}>
              <input
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                type="tel"
                inputMode="numeric"
                maxLength={10}
                disabled={Boolean(account)}
              />
            </Field>

            <Field label={t('field.currentLocation')} required error={errors.currentLocation}>
              <input name="currentLocation" value={formData.currentLocation} onChange={handleChange} type="text" />
            </Field>

            <Field label={t('field.preferredRole')} required>
              <input value={localize(job, 'title')} readOnly disabled />
            </Field>
          </div>

          <SectionHeading index={2} title={t('form.sections.professional')} />
          <div className="form-grid">
            <Field label={t('field.highestEducation')} required error={errors.highestEducation}>
              <SelectField
                name="highestEducation"
                value={formData.highestEducation}
                onChange={handleChange}
                options={educationOptions}
                lang={lang}
                placeholder={t('placeholder.select')}
              />
            </Field>

            <Field label={t('field.totalExperience')} required error={errors.totalExperience}>
              <SelectField
                name="totalExperience"
                value={formData.totalExperience}
                onChange={handleChange}
                options={experienceOptions}
                lang={lang}
                placeholder={t('placeholder.select')}
              />
            </Field>

            <Field label={t('field.availability')} required error={errors.availabilityToJoin}>
              <SelectField
                name="availabilityToJoin"
                value={formData.availabilityToJoin}
                onChange={handleChange}
                options={availabilityOptions}
                lang={lang}
                placeholder={t('placeholder.select')}
              />
            </Field>
          </div>

          <SectionHeading index={3} title={t('form.sections.account')} />
          <div className="form-grid">
            {!account && (
              <Field label={t('field.password')} required error={errors.password} hint={t('field.passwordHint')}>
                <input name="password" value={formData.password} onChange={handleChange} type="password" />
              </Field>
            )}

            <Field label={t('field.resume')} required error={errors.resume} className="form-grid__full">
              <div
                className={`dropzone ${dropActive ? 'dropzone--active' : ''} ${resume.status === 'done' ? 'dropzone--done' : ''}`}
                onClick={() => resumeInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDropActive(true); }}
                onDragLeave={() => setDropActive(false)}
                onDrop={handleDrop}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') resumeInputRef.current?.click(); }}
              >
                <input
                  ref={resumeInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeInputChange}
                  className="dropzone__input"
                  tabIndex={-1}
                />
                {resume.status === 'idle' && (
                  <>
                    <Icon name="upload" size={22} />
                    <p className="dropzone__cta">{t('upload.cta')}</p>
                    <p className="dropzone__hint">{t('upload.hint')}</p>
                  </>
                )}
                {resume.status === 'uploading' && (
                  <div className="upload-progress" onClick={(e) => e.stopPropagation()}>
                    <div className="upload-progress__track">
                      <div className="upload-progress__bar" style={{ width: `${resume.progress}%` }} />
                    </div>
                    <span className="upload-progress__label">
                      {t('upload.uploading', { file: resume.fileName, pct: resume.progress })}
                    </span>
                  </div>
                )}
                {resume.status === 'done' && (
                  <div className="dropzone__done">
                    <Icon name="checkCircle" size={20} />
                    <span>{t('upload.done', { file: resume.fileName })}</span>
                    <span className="dropzone__replace">{t('upload.replace')}</span>
                  </div>
                )}
              </div>
              {resume.note && <p className="field-note">{resume.note}</p>}
            </Field>
          </div>

          <SectionHeading index={4} title={t('form.sections.optional')} optional />
          <div className="form-grid">
            <Field label={t('field.email')} error={errors.email}>
              <input name="email" value={formData.email} onChange={handleChange} type="email" />
            </Field>
            <Field label={t('field.age')}>
              <input name="age" value={formData.age} onChange={handleChange} type="number" min="14" max="80" />
            </Field>
            <Field label={t('field.gender')}>
              <SelectField
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                options={genderOptions}
                lang={lang}
                placeholder={t('placeholder.select')}
              />
            </Field>
            <Field label={t('field.preferredWorkLocation')}>
              <input name="preferredWorkLocation" value={formData.preferredWorkLocation} onChange={handleChange} type="text" />
            </Field>
            <Field label={t('field.currentEmployer')}>
              <input name="currentEmployer" value={formData.currentEmployer} onChange={handleChange} type="text" />
            </Field>
            <Field label={t('field.currentSalary')}>
              <input
                name="currentSalary"
                value={formData.currentSalary}
                onChange={handleChange}
                type="text"
                placeholder={t('placeholder.currentSalary')}
              />
            </Field>
            <Field label={t('field.expectedSalary')}>
              <input
                name="expectedSalary"
                value={formData.expectedSalary}
                onChange={handleChange}
                type="text"
                placeholder={t('placeholder.expectedSalary')}
              />
            </Field>
            <Field label={t('field.noticePeriod')}>
              <SelectField
                name="noticePeriod"
                value={formData.noticePeriod}
                onChange={handleChange}
                options={noticePeriodOptions}
                lang={lang}
                placeholder={t('placeholder.select')}
              />
            </Field>
            <Field label={t('field.skills')}>
              <input name="skills" value={formData.skills} onChange={handleChange} type="text" placeholder={t('placeholder.commaSeparated')} />
            </Field>
            <Field label={t('field.languagesKnown')}>
              <input name="languagesKnown" value={formData.languagesKnown} onChange={handleChange} type="text" placeholder={t('placeholder.commaSeparated')} />
            </Field>
            <Field label={t('field.profilePhoto')}>
              <input type="file" accept="image/*" onChange={handlePhotoChange} />
              {photoFileName && <p className="field-note">{t('upload.photoChosen', { file: photoFileName })}</p>}
            </Field>
            <Field label={t('field.comments')} className="form-grid__full">
              <textarea name="additionalComments" value={formData.additionalComments} onChange={handleChange} rows={3} />
            </Field>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn--primary" disabled={isClosed}>
              {t('actions.applyNow')}
              <Icon name="arrowRight" size={15} />
            </button>
            <button type="button" className="btn btn--secondary" onClick={handleSaveDraft} disabled={isClosed}>
              {t('actions.saveDraft')}
            </button>
            <button type="button" className="btn btn--ghost" onClick={handleReset}>
              {t('actions.resetForm')}
            </button>
          </div>
        </fieldset>
      </form>
    </section>
  );
}

function SectionHeading({ index, title, optional }) {
  return (
    <div className={`section-heading ${optional ? 'section-heading--optional' : ''}`}>
      <span className="section-heading__index">{index}</span>
      <h3>{title}</h3>
    </div>
  );
}

function SelectField({ name, value, onChange, options, lang, placeholder }) {
  return (
    <select name={name} value={value} onChange={onChange}>
      <option value="">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {lang === 'hi' ? opt.hi : opt.en}
        </option>
      ))}
    </select>
  );
}

function Field({ label, required, error, hint, className = '', children }) {
  return (
    <label className={`field ${error ? 'field--error' : ''} ${className}`}>
      <span className="field__label">
        {label}
        {required && <span className="field__required">*</span>}
      </span>
      {children}
      {hint && !error && <span className="field-note">{hint}</span>}
      {error && <span className="field-error">{error}</span>}
    </label>
  );
}
