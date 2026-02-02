import { lazy, Suspense } from 'react';
import Home from '../pages/Home';
import RequestService from '../pages/RequestService';
import NotFound from '../pages/NotFound';

const Gallery = lazy(() => import('../pages/Gallery'));
const Admin = lazy(() => import('../pages/Admin'));

export const routes = [
  { path: '/', element: <Home /> },
  { path: '/request', element: <RequestService /> },
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
