import { useState } from 'react';
import { getCurrencySymbol } from '../lib/currency';
import './ManageModal.css';

interface Subscription {
  id: string;
  servicetitle: string;
  pricenaira: number;
  renewaldatestring: string;
  intervalperiod: string;
}

interface ManageModalProps {
  subscription: Subscription;
  onClose: () => void;
  onUpdate: (id: string, newPrice: number, newDate: string) => void;
  onDelete: (id: string) => void;
}

const LOGO_MAP: Record<string, string> = {
  'Netflix': '/icons/notflix.jpg',
  'Spotify': '/icons/spotify.png',
  'YouTube Premium': '/icons/youtube.png',
  'Amazon Prime': '/icons/Prime.jpg',
  'Showmax': '/icons/Showmax.jpg',
  'Apple Music': '/icons/apple_music.webp',
  'Google One': '/icons/google1.webp',
  'Microsoft 365': '/icons/Microsoft_365.jpg',
};

const CHEAPER_ALTERNATIVES: Record<string, { altName: string; altPrice: string; savings: string }> = {
  'Netflix': { altName: 'Showmax', altPrice: '1,900', savings: '2,500' },
  'Spotify': { altName: 'Boomplay', altPrice: '900', savings: '900' },
  'Google One': { altName: 'Google Free Tier (15GB)', altPrice: '0', savings: '950' },
  'YouTube Premium': { altName: 'YouTube (Free with ads)', altPrice: '0', savings: '1,190' },
};

const DEFAULT_LOGO = 'https://cdn-icons-png.flaticon.com/512/3563/3563393.png';

export function ManageModal({ subscription, onClose, onUpdate, onDelete }: ManageModalProps) {
  const [price, setPrice] = useState(subscription.pricenaira.toString());
  const [date, setDate] = useState(subscription.renewaldatestring);
  const [saving, setSaving] = useState(false);

  const currencySymbol = getCurrencySymbol();

  const logo = LOGO_MAP[subscription.servicetitle] || DEFAULT_LOGO;
  const alternative = CHEAPER_ALTERNATIVES[subscription.servicetitle];

  const handleUpdate = async () => {
    const newPrice = parseFloat(price);
    if (isNaN(newPrice) || newPrice < 0) return;
    if (!date) return;
    setSaving(true);
    onUpdate(subscription.id, newPrice, date);
  };

  const handleDelete = () => {
    onDelete(subscription.id);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="manage-modal" onClick={e => e.stopPropagation()}>
        {/* Drag Handle */}
        <div className="modal-handle" />

        {/* Header */}
        <div className="modal-header">
          <div className="modal-logo-box">
            <img src={logo} alt={subscription.servicetitle} />
          </div>
          <div className="modal-title-info">
            <h3>{subscription.servicetitle}</h3>
            <p>{subscription.intervalperiod.charAt(0) + subscription.intervalperiod.slice(1).toLowerCase()}</p>
          </div>
        </div>

        {/* Cheaper Alternative Card */}
        {alternative && (
          <div className="cheaper-alt-card">
            <div className="alt-badge">💡 Smart Savings Tip</div>
            <h4>Try {alternative.altName}</h4>
            <p>
              Switching can save you up to <strong>{currencySymbol}{alternative.savings}/mo</strong> ({currencySymbol}{alternative.altPrice}/mo).
            </p>
          </div>
        )}

        {/* Price Edit */}
        <div className="modal-section">
          <label className="modal-label">Subscription Price ({currencySymbol})</label>
          <div className="modal-input-wrapper">
            <span className="modal-input-prefix">{currencySymbol}</span>
            <input
              className="modal-price-input"
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={e => setPrice(e.target.value)}
            />
          </div>
        </div>

        {/* Renewal Date */}
        <div className="modal-section">
          <label className="modal-label">Renewal Date</label>
          <div className="modal-input-wrapper">
            <input
              className="modal-price-input"
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="modal-actions">
          <button className="btn-save" onClick={handleUpdate} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <button className="btn-delete" onClick={handleDelete}>
            Remove Subscription
          </button>
        </div>
      </div>
    </div>
  );
}

