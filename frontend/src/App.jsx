import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';;
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import AuthPage from './pages/AuthPage';

function App() {
  return (
    <div className="min-h-screen bg-background">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
