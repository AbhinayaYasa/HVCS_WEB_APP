import { Link } from 'react-router-dom';

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
        <Link to="/request" className="btn btn-primary">Get Started</Link>
      </section>

      <section>
        <h2>Welcome</h2>
        <p>Explore our services and gallery.</p>
      </section>
    </>
  );
}
