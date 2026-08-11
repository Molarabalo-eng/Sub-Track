import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

export function OnboardingStep1() {
  const navigate = useNavigate();
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [customServices, setCustomServices] = useState<ServiceItem[]>([]);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customCategory, setCustomCategory] = useState('Productivity');

  const allServices = [...PRESET_SERVICES, ...customServices];

  const toggleService = (id: string) => {
    setSelectedServices(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleAddCustom = () => {
    if (!customName.trim()) return;
    const newId = `custom_${Date.now()}`;
    const newService: ServiceItem = {
      id: newId,
      name: customName.trim(),
      category: customCategory,
      logo: 'https://cdn-icons-png.flaticon.com/512/3563/3563393.png'
    };

    setCustomServices(prev => [...prev, newService]);
    setSelectedServices(prev => [...prev, newId]);
    setCustomName('');
    setShowCustomModal(false);
  };

  const handleNext = () => {
    // Pass selected services and custom items to Step 2
    const selectedObjects = allServices.filter(s => selectedServices.includes(s.id));
    navigate('/onboarding/step-2', { state: { selectedServices: selectedServices, customServicesList: customObjects(selectedObjects) } });
  };

  const customObjects = (selected: ServiceItem[]) => {
    return selected.map(s => ({
      id: s.id,
      name: s.name,
      category: s.category,
      logo: s.logo
    }));
  };

  const categories = Array.from(new Set(allServices.map(s => s.category)));

  return (
    <div className="onboarding-container">
      <div className="header">
        <h2>Select your services</h2>
        <p>Choose the subscriptions you want to track. We'll help you find hidden costs.</p>
        <p className="step-indicator">Step 1 of 2</p>
      </div>

      <div className="services-grid-container">
        {categories.map(category => (
          <div key={category} className="category-section">
            <h3>{category.toUpperCase()}</h3>
            <div className="services-grid">
              {allServices.filter(s => s.category === category).map(service => (
                <button
                  key={service.id}
                  className={`service-card ${selectedServices.includes(service.id) ? 'selected' : ''}`}
                  onClick={() => toggleService(service.id)}
                >
                  <div className="service-logo">
                    <img src={service.logo} alt={service.name} style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '8px' }} />
                  </div>
                  <span className="service-name">{service.name}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
        
        <div className="category-section">
            <h3>OTHER</h3>
            <button className="add-custom-btn" onClick={() => setShowCustomModal(true)}>
              + Add Custom Service
            </button>
        </div>
      </div>

      {showCustomModal && (
        <div className="modal-backdrop" onClick={() => setShowCustomModal(false)}>
          <div className="manage-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-handle" />
            <h3 style={{ margin: '0 0 1rem 0', color: 'var(--text-color)' }}>Add Custom Subscription</h3>
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label>Service Name</label>
              <input
                type="text"
                placeholder="e.g. Canva, ChatGPT, Gym"
                value={customName}
                onChange={e => setCustomName(e.target.value)}
                autoFocus
              />
            </div>
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label>Category</label>
              <select
                value={customCategory}
                onChange={e => setCustomCategory(e.target.value)}
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-color)',
                  color: 'var(--text-color)'
                }}
              >
                <option value="Streaming">Streaming</option>
                <option value="Music">Music</option>
                <option value="Utilities">Utilities</option>
                <option value="Productivity">Productivity</option>
                <option value="Fitness">Fitness</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="btn-primary" onClick={handleAddCustom} disabled={!customName.trim()}>
                Add Service
              </button>
              <button
                className="add-custom-btn"
                style={{ border: '1px solid var(--border-color)', color: 'var(--text-muted)' }}
                onClick={() => setShowCustomModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="footer">
        <p>{selectedServices.length} services selected</p>
        <button 
          className="btn-primary" 
          onClick={handleNext} 
          disabled={selectedServices.length === 0}
        >
          Next: Set Dates →
        </button>
      </div>
    </div>
  );
}

