import { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '../components/Icon.jsx';
import Reveal from '../components/Reveal.jsx';
import { saveContactMessage } from '../data/storage.js';
import { useLanguage } from '../i18n/LanguageContext.jsx';

const EMPTY_FORM = { name: '', email: '', phone: '', message: '' };

export default function Contact() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function validate() {
    const nextErrors = {};
    if (!formData.name.trim()) nextErrors.name = t('validation.required', { label: t('contact.name') });
    if (!formData.message.trim()) nextErrors.message = t('validation.required', { label: t('contact.message') });
    if (!formData.email.trim() && !formData.phone.trim()) {
      nextErrors.email = t('contact.contactMethodRequired');
    } else if (formData.email.trim() && !/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
      nextErrors.email = t('validation.emailInvalid');
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    saveContactMessage(formData);
    setSent(true);
    setFormData(EMPTY_FORM);
  }

  return (
    <main className="page-content contact">
      <section className="page-hero">
        <div className="page-hero__bg" aria-hidden="true">
          <span className="hero-section__blob hero-section__blob--2" />
        </div>
        <Reveal as="span" className="hero__eyebrow">
          <Icon name="mail" size={14} />
          {t('contact.eyebrow')}
        </Reveal>
        <Reveal as="h1" delay={0.05}>
          {t('contact.title')}
        </Reveal>
        <Reveal as="p" className="hero__subtitle" delay={0.1}>
          {t('contact.intro')}
        </Reveal>
      </section>

      <section className="section contact__grid">
        <Reveal className="contact__info">
          <div className="contact__info-item">
            <span className="feature-card__icon">
              <Icon name="pin" size={18} />
            </span>
            <div>
              <h3>{t('contact.addressHeading')}</h3>
              <p>{t('contact.addressBody')}</p>
            </div>
          </div>
          <div className="contact__info-item">
            <span className="feature-card__icon">
              <Icon name="mail" size={18} />
            </span>
            <div>
              <h3>{t('contact.emailHeading')}</h3>
              <p>support@job-restro.example</p>
            </div>
          </div>
          <div className="contact__info-item">
            <span className="feature-card__icon">
              <Icon name="clock" size={18} />
            </span>
            <div>
              <h3>{t('contact.hoursHeading')}</h3>
              <p>{t('contact.hoursBody')}</p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="contact__form-card">
          {sent ? (
            <motion.div
              className="success-banner"
              role="status"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="success-banner__icon">
                <Icon name="checkCircle" size={28} />
              </span>
              <h2>{t('contact.successTitle')}</h2>
              <p>{t('contact.successBody')}</p>
              <button type="button" className="btn btn--primary" onClick={() => setSent(false)}>
                {t('contact.sendAnother')}
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <label className="field">
                <span className="field__label">
                  {t('contact.name')}
                  <span className="field__required">*</span>
                </span>
                <input name="name" value={formData.name} onChange={handleChange} type="text" />
                {errors.name && <span className="field-error">{errors.name}</span>}
              </label>

              <div className="form-grid">
                <label className="field">
                  <span className="field__label">{t('contact.email')}</span>
                  <input name="email" value={formData.email} onChange={handleChange} type="email" />
                  {errors.email && <span className="field-error">{errors.email}</span>}
                </label>
                <label className="field">
                  <span className="field__label">{t('contact.phone')}</span>
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                  />
                </label>
              </div>

              <label className="field">
                <span className="field__label">
                  {t('contact.message')}
                  <span className="field__required">*</span>
                </span>
                <textarea name="message" value={formData.message} onChange={handleChange} rows={5} />
                {errors.message && <span className="field-error">{errors.message}</span>}
              </label>

              <div className="form-actions">
                <button type="submit" className="btn btn--primary btn--lg">
                  {t('contact.submit')}
                  <Icon name="send" size={15} />
                </button>
              </div>
            </form>
          )}
        </Reveal>
      </section>
    </main>
  );
}
