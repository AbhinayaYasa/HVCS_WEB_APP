import { useState } from 'react';
import { createServiceRequest } from '../lib/serviceRequests';
import type { ServiceRequestCategory } from '../types/serviceRequest';
import { SERVICE_REQUEST_CATEGORIES } from '../types/serviceRequest';

const inputStyle: React.CSSProperties = {
  padding: '0.6rem 1rem',
  background: 'var(--color-bg-subtle)',
  border: '1px solid rgba(255, 255, 255, 0.15)',
  borderRadius: 4,
  color: 'var(--color-text)',
  width: '100%',
  fontFamily: 'inherit',
};

export default function ServiceRequestForm() {
  const [category, setCategory] = useState<ServiceRequestCategory>('Personal');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [details, setDetails] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      await createServiceRequest({
        category,
        name,
        email,
        phone,
        details,
      });
      setStatus('success');
      setName('');
      setEmail('');
      setPhone('');
      setDetails('');
    } catch (err) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Failed to submit request');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="service-request-form">
      <h3>Request a Service</h3>
      <p className="form-description">Submit your request and we&apos;ll get back to you shortly.</p>

      <div className="form-field">
        <label htmlFor="category">Service Category</label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value as ServiceRequestCategory)}
          required
          style={inputStyle}
        >
          {SERVICE_REQUEST_CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="form-row">
        <div className="form-field">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Your name"
            style={inputStyle}
          />
        </div>
        <div className="form-field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="your@email.com"
            style={inputStyle}
          />
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="phone">Phone</label>
        <input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          placeholder="(555) 555-5555"
          style={inputStyle}
        />
      </div>

      <div className="form-field">
        <label htmlFor="details">Details</label>
        <textarea
          id="details"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          required
          rows={4}
          placeholder="Describe your request..."
          style={{ ...inputStyle, resize: 'vertical' }}
        />
      </div>

      {status === 'success' && (
        <p className="form-success">Thank you! Your request has been submitted.</p>
      )}
      {status === 'error' && (
        <p className="form-error">{errorMessage}</p>
      )}

      <button type="submit" className="btn" disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Submitting…' : 'Submit Request'}
      </button>
    </form>
  );
}
