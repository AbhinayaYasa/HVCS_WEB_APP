import ServiceRequestForm from '../components/ServiceRequestForm';

export default function RequestService() {
  return (
    <div className="request-page">
      <div className="request-page-content">
        <h1>Request a Service</h1>
        <p className="request-page-subtitle">Select a category, fill out the form below, and we&apos;ll get in touch.</p>
        <ServiceRequestForm />
      </div>
    </div>
  );
}
