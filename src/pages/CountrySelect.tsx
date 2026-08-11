import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CountrySelect.css';

const COUNTRIES = [
  {
    code: 'NGN',
    name: 'Nigeria',
    symbol: '₦',
    flag: '🇳🇬',
    subtitle: 'Naira · ₦',
  },
  {
    code: 'GBP',
    name: 'United Kingdom',
    symbol: '£',
    flag: '🇬🇧',
    subtitle: 'Pound Sterling · £',
  },
  {
    code: 'USD',
    name: 'United States',
    symbol: '$',
    flag: '🇺🇸',
    subtitle: 'US Dollar · $',
  },
];

export function CountrySelect() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string | null>(null);

  const handleContinue = () => {
    const country = COUNTRIES.find(c => c.code === selected);
    if (!country) return;

    // Persist to localStorage so Dashboard can read it after onboarding
    localStorage.setItem('currencySymbol', country.symbol);
    localStorage.setItem('currencyCode', country.code);

    navigate('/onboarding/step-1', {
      state: {
        currencySymbol: country.symbol,
        currencyCode: country.code,
      },
    });
  };

  return (
    <div className="country-page">
      <div className="country-header">
        <h1 className="brand-title">SubTrack</h1>
        <h2>Where are you based?</h2>
        <p>We'll show you prices in your local currency.</p>
        <span className="step-indicator">Step 1 of 3</span>
      </div>

      <div className="country-list">
        {COUNTRIES.map(country => (
          <button
            key={country.code}
            className={`country-card ${selected === country.code ? 'selected' : ''}`}
            onClick={() => setSelected(country.code)}
          >
            <span className="country-flag">{country.flag}</span>
            <div className="country-info">
              <strong>{country.name}</strong>
              <span>{country.subtitle}</span>
            </div>
            <div className={`country-radio ${selected === country.code ? 'checked' : ''}`} />
          </button>
        ))}
      </div>

      <div className="country-footer">
        <button
          className="btn-continue"
          onClick={handleContinue}
          disabled={!selected}
        >
          Continue →
        </button>
      </div>
    </div>
  );
}
