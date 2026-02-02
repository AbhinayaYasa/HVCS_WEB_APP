export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <p>© {year} Hudson Valley Concierge Service</p>
    </footer>
  );
}
