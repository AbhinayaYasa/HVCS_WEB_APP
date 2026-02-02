import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <>
      <section className="hero">
        <h1>Hudson Valley Concierge Services</h1>
        <p>Your trusted partner for seamless experiences in the Hudson Valley</p>
        <div className="hero-image">
          <img
            src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80"
            alt="Hudson Valley scenery"
          />
        </div>
        <Link to="/gallery" className="btn">View Gallery</Link>
      </section>

      <section>
        <h2>Welcome</h2>
        <p>Explore our services and gallery. Configure Firebase to enable the full gallery and admin features.</p>
      </section>
    </>
  );
}
