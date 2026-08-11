import { useNavigate } from 'react-router-dom';
import './SplashScreen.css';

export function SplashScreen() {
  const navigate = useNavigate();

  return (
    <div className="splash-page">
      <h1 className="splash-brand">SubTrack</h1>

      <div className="hero-visual">
        <div className="hero-glow"></div>
        <div className="hero-circle">
          <img src="/hero_card.png" alt="Credit card floating" className="hero-card-img" />
        </div>
      </div>

      <div className="splash-copy">
        <h2>Take back control of your money.</h2>
        <p>Master your subscriptions, eliminate hidden costs, and save more every month.</p>
      </div>

      <div className="splash-actions">
        <button className="btn-get-started" onClick={() => navigate('/sign-up')}>
          Get Started
        </button>
        <button className="btn-sign-in-link" onClick={() => navigate('/sign-in')}>
          I already have an account
        </button>
      </div>
    </div>
  );
}
