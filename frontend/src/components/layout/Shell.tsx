import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';

export default function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="shell">
      <Header />
      <main className="main">{children}</main>
      <Footer />
    </div>
  );
}
