import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="logo-link">
          <img src="/logo.png" alt="Hudson Valley Concierge Service" className="logo-img" />
          <span className="logo-text">Hudson Valley Concierge Service</span>
        </Link>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/gallery">Gallery</Link>
          <Link to="/admin">Admin</Link>
          <Link to="/request" className="btn btn-nav">Leave Feedback</Link>
        </nav>
      </div>
    </header>
  );
}
