import { useEffect, useState } from 'react';
import { UserButton } from '@clerk/clerk-react';
import { Bell, AlertCircle, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { updateSubscription, deleteSubscription } from '../lib/subscriptionService';
import { formatCurrency } from '../lib/currency';
import { ManageModal } from '../components/ManageModal';
import { BottomNav } from '../components/BottomNav';
import './Dashboard.css';

interface Subscription {
  id: string;
  servicetitle: string;
  pricenaira: number;
  renewaldatestring: string;
  intervalperiod: string;
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

const DEFAULT_LOGO = 'https://cdn-icons-png.flaticon.com/512/3563/3563393.png';

export function Dashboard() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSub, setSelectedSub] = useState<Subscription | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const { data, error } = await supabase
          .from('subscriptiontable')
          .select('*')
          .order('renewaldatestring', { ascending: true });

        if (error) throw error;
        setSubscriptions(data || []);
      } catch (err) {
        console.error("Error loading subscriptions:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Helper to calculate days until renewal
  const getDaysUntil = (dateString: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const renewal = new Date(dateString);
    renewal.setHours(0, 0, 0, 0);
    const diffTime = renewal.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // ===== Optimistic UI Handlers =====

  const handleUpdate = async (id: string, newPrice: number, newDate: string) => {
    // Update locally first — instant feedback
    setSubscriptions(prev =>
      prev.map(s => s.id === id ? { ...s, pricenaira: newPrice, renewaldatestring: newDate } : s)
    );
    setSelectedSub(null); // close modal immediately

    try {
      await updateSubscription(id, newPrice, newDate);
    } catch (err) {
      console.error('Failed to update, rolling back:', err);
      const { data } = await supabase.from('subscriptiontable').select('*');
      if (data) setSubscriptions(data);
    }
  };

  const handleDelete = async (id: string) => {
    setSelectedSub(null); // close modal immediately
    setDeletingId(id);   // trigger fade-out animation

    // Wait for animation to complete before removing from state
    setTimeout(async () => {
      setSubscriptions(prev => prev.filter(s => s.id !== id));
      setDeletingId(null);

      try {
        await deleteSubscription(id);
      } catch (err) {
        console.error('Failed to delete subscription, rolling back:', err);
        const { data } = await supabase.from('subscriptiontable').select('*');
        if (data) setSubscriptions(data);
      }
    }, 300);
  };

  const totalMonthly = subscriptions.reduce((sum, sub) => sum + sub.pricenaira, 0);

  const upcomingSub = subscriptions.find(s => getDaysUntil(s.renewaldatestring) >= 0);
  const nextDueDate = upcomingSub
    ? new Date(upcomingSub.renewaldatestring).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : 'None';

  // Smart reminder prompt for upcoming renewals
  const urgentSub = subscriptions.find(s => {
    const d = getDaysUntil(s.renewaldatestring);
    return d === 0 || d === 3 || d === 5;
  });

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div className="user-profile">
          <UserButton afterSignOutUrl="/sign-in" />
          <h1 className="app-title">SubTrack</h1>
        </div>
        <button className="icon-btn">
          <Bell size={24} color="var(--primary-color)" />
        </button>
      </header>

      {/* Smart Renewal Nudge Banner (T-5, T-3, T-0 D-Day per PRD) */}
      {urgentSub && (
        <div className="reminder-nudge-banner">
          <AlertCircle size={20} color="#f59e0b" />
          <div className="nudge-text">
            <strong>Renewal Alert:</strong> {urgentSub.servicetitle} renews in{' '}
            {getDaysUntil(urgentSub.renewaldatestring) === 0
              ? 'today'
              : `${getDaysUntil(urgentSub.renewaldatestring)} days`}{' '}
            for {formatCurrency(urgentSub.pricenaira)}.
          </div>
        </div>
      )}

      <section className="summary-card">
        <p className="summary-title">Total Monthly Spend</p>
        <div className="spend-row">
          <h2>{formatCurrency(totalMonthly)}</h2>
          <span className="spend-badge">+2% vs last month</span>
        </div>
        <div className="summary-details">
          <div className="detail-block">
            <span>Next Due</span>
            <strong>{nextDueDate}</strong>
          </div>
          <div className="detail-block">
            <span>Services</span>
            <strong>{subscriptions.length} Active</strong>
          </div>
        </div>
      </section>

      <section className="subscriptions-section">
        <div className="section-header">
          <h3>Your Subscriptions</h3>
        </div>

        {loading ? (
          <p>Loading your subscriptions...</p>
        ) : subscriptions.length === 0 ? (
          <div className="empty-state">
            <p>No active subscriptions found.</p>
          </div>
        ) : (
          <div className="subscriptions-list">
            {subscriptions.map(sub => {
              const daysUntil = getDaysUntil(sub.renewaldatestring);
              const isUrgent = daysUntil <= 7 && daysUntil >= 0;
              const isUnused = daysUntil < -30; // Flagged as unused per Section 8 PRD

              return (
                <div
                  key={sub.id}
                  className={`sub-list-item clickable ${deletingId === sub.id ? 'deleting' : ''}`}
                  onClick={() => setSelectedSub(sub)}
                >
                  <div className="sub-logo-box">
                    <img src={LOGO_MAP[sub.servicetitle] || DEFAULT_LOGO} alt={sub.servicetitle} />
                  </div>
                  <div className="sub-info">
                    <h4>{sub.servicetitle}</h4>
                    <div className="sub-meta-tags">
                      <span className="interval-tag">
                        {sub.intervalperiod.charAt(0) + sub.intervalperiod.slice(1).toLowerCase()}
                      </span>
                      {isUnused && (
                        <span className="unused-badge">
                          <Sparkles size={12} /> Possibly Unused
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="sub-price-info">
                    <h4>{formatCurrency(sub.pricenaira)}</h4>
                    <span className={`days-badge ${isUrgent ? 'urgent' : ''}`}>
                      {daysUntil === 0 ? 'Renews today' :
                       daysUntil < 0 ? 'Overdue' :
                       `${daysUntil}d left`}
                    </span>
                  </div>
                  <span className="card-chevron">›</span>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Manage Modal */}
      {selectedSub && (
        <ManageModal
          subscription={selectedSub}
          onClose={() => setSelectedSub(null)}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      )}

      <BottomNav />
    </div>
  );
}

