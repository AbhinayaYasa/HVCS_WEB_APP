import { lazy, Suspense } from 'react';
import Home from '../pages/Home';
import NotFound from '../pages/NotFound';

const RequestService = lazy(() => import('../pages/RequestService'));
const Gallery = lazy(() => import('../pages/Gallery'));
const Admin = lazy(() => import('../pages/Admin'));

// Feedback Hub: /request and /feedback (for post-trip links with ?token=)
export const routes = [
  { path: '/', element: <Home /> },
  {
    path: '/request',
    element: (
      <Suspense fallback={<p className="loading">Loading…</p>}>
        <RequestService />
      </Suspense>
    ),
  },
  {
    path: '/feedback',
    element: (
      <Suspense fallback={<p className="loading">Loading…</p>}>
        <RequestService />
      </Suspense>
    ),
  },
  {
    path: '/gallery',
    element: (
      <Suspense fallback={<p className="loading">Loading…</p>}>
        <Gallery />
      </Suspense>
    ),
  },
  {
    path: '/admin',
    element: (
      <Suspense fallback={<p className="loading">Loading…</p>}>
        <Admin />
      </Suspense>
    ),
  },
  { path: '*', element: <NotFound /> },
];
