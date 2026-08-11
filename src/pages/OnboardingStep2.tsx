import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { supabase } from '../lib/supabase';
import { getCurrencySymbol, getCurrencyCode } from '../lib/currency';
import './Onboarding.css';

interface ServiceItem {
  id: string;
  name: string;
  category: string;
  logo: string;
}

const PRESET_SERVICES: ServiceItem[] = [
  { id: 'netflix', name: 'Netflix', category: 'Streaming', logo: '/icons/notflix.jpg' },
  { id: 'youtube', name: 'YouTube Premium', category: 'Streaming', logo: '/icons/youtube.png' },
  { id: 'amazon', name: 'Amazon Prime', category: 'Streaming', logo: '/icons/Prime.jpg' },
  { id: 'showmax', name: 'Showmax', category: 'Streaming', logo: '/icons/Showmax.jpg' },
  { id: 'spotify', name: 'Spotify', category: 'Music', logo: '/icons/spotify.png' },
  { id: 'apple_music', name: 'Apple Music', category: 'Music', logo: '/icons/apple_music.webp' },
  { id: 'electricity', name: 'Electricity', category: 'Utilities', logo: 'https://cdn-icons-png.flaticon.com/512/3563/3563393.png' },
  { id: 'internet', name: 'Internet/Data', category: 'Utilities', logo: 'https://cdn-icons-png.flaticon.com/512/2885/2885417.png' },
  { id: 'google_one', name: 'Google One', category: 'Productivity', logo: '/icons/google1.webp' },
  { id: 'microsoft_365', name: 'Microsoft 365', category: 'Productivity', logo: '/icons/Microsoft_365.jpg' },
];

// Pre-defined plans for services per currency
const SERVICE_PLANS: Record<string, Record<string, { name: string, price: number }[]>> = {
  NGN: {
    netflix: [
      { name: 'Mobile', price: 2200 },
      { name: 'Basic', price: 2900 },
      { name: 'Standard', price: 4500 },
      { name: 'Premium', price: 7000 }
    ],
    youtube: [
      { name: 'Individual', price: 1190 },
      { name: 'Family', price: 2200 },
      { name: 'Student', price: 690 }
    ],
    amazon: [
      { name: 'Prime Video', price: 2300 }
    ],
    showmax: [
      { name: 'Entertainment', price: 1900 },
      { name: 'Pro / Sports', price: 3500 }
    ],
    spotify: [
      { name: 'Individual', price: 900 },
      { name: 'Duo', price: 1400 },
      { name: 'Family', price: 1900 }
    ],
    apple_music: [
      { name: 'Individual', price: 1000 },
      { name: 'Family', price: 1500 }
    ],
    electricity: [
      { name: 'Monthly Average', price: 15000 }
    ],
    internet: [
      { name: 'Monthly Unlimited', price: 20000 }
    ],
    google_one: [
      { name: 'Basic (100GB)', price: 950 },
      { name: 'Standard (200GB)', price: 1400 },
      { name: 'Premium (2TB)', price: 4800 }
    ],
    microsoft_365: [
      { name: 'Personal', price: 3200 },
      { name: 'Family', price: 4500 }
    ]
  },
  USD: {
    netflix: [
      { name: 'Standard with ads', price: 6.99 },
      { name: 'Standard', price: 15.49 },
      { name: 'Premium', price: 22.99 }
    ],
    youtube: [
      { name: 'Individual', price: 13.99 },
      { name: 'Family', price: 22.99 },
      { name: 'Student', price: 7.99 }
    ],
    amazon: [
      { name: 'Prime Monthly', price: 14.99 },
      { name: 'Prime Video Only', price: 8.99 }
    ],
    showmax: [
      { name: 'Entertainment', price: 8.99 },
      { name: 'Pro', price: 17.99 }
    ],
    spotify: [
      { name: 'Individual', price: 10.99 },
      { name: 'Duo', price: 14.99 },
      { name: 'Family', price: 16.99 },
      { name: 'Student', price: 5.99 }
    ],
    apple_music: [
      { name: 'Individual', price: 10.99 },
      { name: 'Family', price: 16.99 }
    ],
    google_one: [
      { name: 'Basic (100GB)', price: 1.99 },
      { name: 'Standard (200GB)', price: 2.99 },
      { name: 'Premium (2TB)', price: 9.99 }
    ],
    microsoft_365: [
      { name: 'Personal', price: 6.99 },
      { name: 'Family', price: 9.99 }
    ]
  }
};

export function OnboardingStep2() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUser();
  const currencySymbol = getCurrencySymbol();
  const currencyCode = getCurrencyCode();
  
  const selectedServiceIds: string[] = location.state?.selectedServices || [];
  const customList: ServiceItem[] = location.state?.customServicesList || [];

  // Combine preset and custom services
  const combinedPreset = [...PRESET_SERVICES, ...customList];
  const selectedServices = combinedPreset.filter(s => selectedServiceIds.includes(s.id));

  const planTable = SERVICE_PLANS[currencyCode] || SERVICE_PLANS['USD'];

  // Default selection state for plans and dates
  const [formData, setFormData] = useState<Record<string, { planName: string, amount: number, date: string }>>(() => {
    const initialState: any = {};
    selectedServices.forEach(service => {
        const plans = planTable[service.id];
        if (plans && plans.length > 0) {
            initialState[service.id] = { planName: plans[0].name, amount: plans[0].price, date: '' };
        } else {
            initialState[service.id] = { planName: 'Custom', amount: 0, date: '' };
        }
    });
    return initialState;
  });

  const [loading, setLoading] = useState(false);

  const handlePlanChange = (id: string, planName: string) => {
    const plans = planTable[id];
    const selectedPlan = plans?.find(p => p.name === planName);
    
    setFormData(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        planName: planName,
        amount: selectedPlan ? selectedPlan.price : prev[id].amount
      }
    }));
  };

  const handleCustomAmountChange = (id: string, amount: string) => {
    setFormData(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        amount: parseFloat(amount) || 0
      }
    }));
  }

  const handleDateChange = (id: string, date: string) => {
    setFormData(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        date: date
      }
    }));
  };

  const handleFinish = async () => {
    if (!user) return;
    setLoading(true);

    try {
      const inserts = selectedServices.map(service => {
        const data = formData[service.id];
        return {
          ownerclerkid: user.id,
          servicetitle: service.name,
          pricenaira: data?.amount || 0,
          intervalperiod: 'monthly'.toUpperCase(),
          renewaldatestring: data?.date || new Date().toISOString().split('T')[0],
        };
      });

      const { data, error } = await supabase.from('subscriptiontable').insert(inserts).select();

      if (error) {
        console.error('Supabase insert error:', JSON.stringify(error, null, 2));
        alert(`Database error: ${error.message}\n\nCode: ${error.code}\nDetails: ${error.details || 'none'}\nHint: ${error.hint || 'none'}`);
        return;
      }

      console.log('Insert success:', data);
      navigate('/'); // Go to Dashboard
    } catch (err: any) {
      console.error('Full error:', err);
      alert(`Error: ${err?.message || 'Unknown error saving subscriptions.'}`);
    } finally {
      setLoading(false);
    }
  };

  if (selectedServices.length === 0) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>No services selected. <br/><br/><button className="btn-primary" onClick={() => navigate('/onboarding/step-1')}>Go Back</button></div>;
  }

  return (
    <div className="onboarding-container">
      <div className="header">
        <h2>When did you last pay?</h2>
        <p>We use this to calculate your next renewal date and send reminders.</p>
        <p className="step-indicator">Step 2 of 2</p>
      </div>

      <div className="forms-list">
        {selectedServices.map(service => {
          const plans = planTable[service.id];
          const currentData = formData[service.id] || { planName: 'Custom', amount: 0, date: '' };

          return (
            <div key={service.id} className="service-form-card">
              <div className="service-form-header">
                <div className="service-logo-small">
                  <img src={service.logo} alt={service.name} style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '4px' }} />
                </div>
                <h4>{service.name}</h4>
              </div>
              
              {plans && plans.length > 0 ? (
                <>
                    <div className="form-group">
                        <label>Select Plan</label>
                        <select 
                            value={currentData.planName}
                            onChange={(e) => handlePlanChange(service.id, e.target.value)}
                        >
                            {plans.map(p => (
                                <option key={p.name} value={p.name}>
                                    {p.name} ({currencySymbol}{p.price.toLocaleString('en-US')}/mo)
                                </option>
                            ))}
                        </select>
                    </div>
                </>
              ) : (
                <>
                    <div className="form-group">
                        <label>Plan Details (Custom)</label>
                        <input type="text" placeholder="e.g. Standard Plan" value={currentData.planName} onChange={e => handlePlanChange(service.id, e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Monthly Amount ({currencySymbol})</label>
                        <input type="number" placeholder="0.00" value={currentData.amount || ''} onChange={e => handleCustomAmountChange(service.id, e.target.value)} />
                    </div>
                </>
              )}

              <div className="form-group">
                  <label>Last Subscription Date</label>
                  <input type="date" value={currentData.date} onChange={e => handleDateChange(service.id, e.target.value)} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="footer">
        <button 
          className="btn-primary" 
          onClick={handleFinish}
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Finish Setup'}
        </button>
      </div>
    </div>
  );
}
