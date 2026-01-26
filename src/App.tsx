import { Routes, Route } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { HomePage } from './pages/HomePage';
import { HeroesPage } from './pages/HeroesPage';
import { ItemsPage } from './pages/ItemsPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="heroes" element={<HeroesPage />} />
        <Route path="items" element={<ItemsPage />} />
      </Route>
    </Routes>
  );
}

export default App;