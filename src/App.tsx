import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import ItemsList from './pages/ItemsList';
import ItemCard from './pages/ItemCard';
import ItemForm from './pages/ItemForm';
import Catalog from './pages/Catalog';

export default function App() {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 text-slate-900 print:h-auto print:w-auto print:overflow-visible">
      <Sidebar />
      <main className="flex-1 overflow-y-auto print:overflow-visible">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/artikuj" element={<ItemsList />} />
          <Route path="/artikuj/ri" element={<ItemForm />} />
          <Route path="/artikuj/:id" element={<ItemCard />} />
          <Route path="/artikuj/:id/edit" element={<ItemForm />} />
          <Route path="/katalog" element={<Catalog />} />
        </Routes>
      </main>
    </div>
  );
}
