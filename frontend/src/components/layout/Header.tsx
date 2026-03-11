import { Link, useLocation } from 'react-router-dom';

function NavLink({ to, children, className }: { to: string; children: React.ReactNode; className?: string }) {
  const location = useLocation();
  const isActive = location.pathname === to || (to === '/request' && location.pathname === '/feedback');

  const handleClick = (e: React.MouseEvent) => {
    if (isActive) {
      e.preventDefault();
      window.location.href = to;
    }
  };

  return (
    <Link to={to} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}

export default function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <NavLink to="/" className="logo-link">
          <img src="/logo.png" alt="Hudson Valley Concierge Service" className="logo-img" />
          <span className="logo-text">Hudson Valley Concierge Service</span>
        </NavLink>
        <nav>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/gallery">Gallery</NavLink>
          <NavLink to="/admin">Admin</NavLink>
          <NavLink to="/request" className="btn btn-nav">Leave Feedback</NavLink>
        </nav>
      </div>
    </header>
  );
}
