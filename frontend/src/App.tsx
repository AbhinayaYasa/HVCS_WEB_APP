import { Routes, Route } from 'react-router-dom';
import Shell from './components/layout/Shell';
import { routes } from './routes';

export default function App() {
  return (
    <Shell>
      <Routes>
        {routes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
        <Route path="*" element={routes.find((r) => r.path === '*')!.element} />
      </Routes>
    </Shell>
  );
}
