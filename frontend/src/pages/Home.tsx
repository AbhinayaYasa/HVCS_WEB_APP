import ServiceRequestForm from '../components/ServiceRequestForm';

export default function Home() {
  return (
    <>
      <section className="hero">
        <p className="hero-subtitle">Concierge Services</p>
        <h1>The leader in personalized service</h1>
        <p className="hero-tagline">Your trusted partner for seamless experiences in the Hudson Valley</p>
        <div className="hero-image">
          <img
            src="/hero-banner.png"
            alt="Hudson Valley Concierge Service — Concierge Portfolio"
          />
        </div>
        <a href="#request" className="btn btn-primary">Get Started</a>
      </section>

      <section id="request">
        <h2>Request a Service</h2>
        <p>Select a category, fill out the form below, and we&apos;ll get in touch.</p>
        <ServiceRequestForm />
      </section>

      <section>
        <h2>Welcome</h2>
        <p>Explore our services and gallery.</p>
      </section>
    </>
  );
}
