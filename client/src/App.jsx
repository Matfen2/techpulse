import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/"
            element={
              <div className="min-h-screen bg-[var(--bg-deep)] flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-5xl font-bold text-[var(--primary)] mb-4">TechPulse</h1>
                  <p className="text-[var(--text-secondary)]">Catalogue & Marketplace High-Tech</p>
                  <span className="inline-block mt-4 px-4 py-2 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg text-[var(--text-muted)] text-sm">
                    🚀 J2 — Auth OK
                  </span>
                </div>
              </div>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;