import { LayoutGrid, Plus, User } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import './BottomNav.css';

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="bottom-nav">
      <button 
        className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}
        onClick={() => navigate('/')}
      >
        <LayoutGrid size={24} />
        <span>Dashboard</span>
      </button>

      <button 
        className="nav-item add-fab-container"
        onClick={() => navigate('/onboarding/step-1')}
      >
        <div className="fab">
          <Plus size={28} color="white" />
        </div>
      </button>

      <button 
        className={`nav-item ${location.pathname === '/profile' ? 'active' : ''}`}
        onClick={() => navigate('/profile')}
      >
        <User size={24} />
        <span>Profile</span>
      </button>
    </div>
  );
}
