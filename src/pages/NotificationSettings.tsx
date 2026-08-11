import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, HelpCircle, Bell, EyeOff, PiggyBank, Moon } from 'lucide-react';
import { BottomNav } from '../components/BottomNav';
import './NotificationSettings.css';

export function NotificationSettings() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('subtrack_settings');
    return saved ? JSON.parse(saved) : {
      remind5Days: true,
      remind3Days: true,
      remindDDay: true,
      unusedAlerts: true,
      weeklyDigest: true,
      quietHours: false,
      quietFrom: '22:00',
      quietTo: '07:00'
    };
  });

  useEffect(() => {
    localStorage.setItem('subtrack_settings', JSON.stringify(settings));
  }, [settings]);

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings((prev: any) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleTimeChange = (key: 'quietFrom' | 'quietTo', value: string) => {
    setSettings((prev: any) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="settings-page">
      <header className="settings-header">
        <button className="icon-btn back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={24} />
        </button>
        <h2>Notification Settings</h2>
        <button className="icon-btn">
          <HelpCircle size={24} />
        </button>
      </header>

      <section className="settings-section">
        <div className="section-title">
          <Bell size={20} color="var(--primary-color)" />
          <h3>Renewal Reminders</h3>
        </div>
        <div className="settings-card">
          <div className="setting-row">
            <div className="setting-info">
              <h4>5 Days Before</h4>
              <p>Early heads-up for upcoming bills</p>
            </div>
            <label className="toggle-switch">
              <input type="checkbox" checked={settings.remind5Days} onChange={() => toggleSetting('remind5Days')} />
              <span className="slider round"></span>
            </label>
          </div>
          <div className="divider" />
          <div className="setting-row">
            <div className="setting-info">
              <h4>3 Days Before</h4>
              <p>Final chance to review auto-renews</p>
            </div>
            <label className="toggle-switch">
              <input type="checkbox" checked={settings.remind3Days} onChange={() => toggleSetting('remind3Days')} />
              <span className="slider round"></span>
            </label>
          </div>
          <div className="divider" />
          <div className="setting-row">
            <div className="setting-info">
              <h4>D-Day Reminder</h4>
              <p>Instant alert on renewal day</p>
            </div>
            <label className="toggle-switch">
              <input type="checkbox" checked={settings.remindDDay} onChange={() => toggleSetting('remindDDay')} />
              <span className="slider round"></span>
            </label>
          </div>
        </div>
      </section>

      <section className="settings-section">
        <div className="section-title">
          <div className="insights-icon-wrapper">
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
          </div>
          <h3>Insights & Alerts</h3>
        </div>
        
        <div className="alert-card yellow-card">
          <div className="alert-header">
            <div className="alert-icon yellow-icon">
              <EyeOff size={20} />
            </div>
            <label className="toggle-switch">
              <input type="checkbox" checked={settings.unusedAlerts} onChange={() => toggleSetting('unusedAlerts')} />
              <span className="slider round"></span>
            </label>
          </div>
          <h4>Unused App Alerts</h4>
          <p>Get notified when a subscription shows zero activity for 14+ days.</p>
        </div>

        <div className="alert-card blue-card">
          <div className="alert-header">
            <div className="alert-icon blue-icon">
              <PiggyBank size={20} />
            </div>
            <label className="toggle-switch">
              <input type="checkbox" checked={settings.weeklyDigest} onChange={() => toggleSetting('weeklyDigest')} />
              <span className="slider round"></span>
            </label>
          </div>
          <h4>Weekly Savings Digest</h4>
          <p>Every Monday at 9 AM. A summary of potential cancellations and bill trends.</p>
        </div>
      </section>

      <section className="settings-section">
        <div className="section-title">
          <Moon size={20} color="var(--primary-color)" />
          <h3>Quiet Hours</h3>
        </div>
        <div className="settings-card">
          <div className="setting-row quiet-hours-row">
            <div className="setting-info">
              <h4>Enable Quiet Hours</h4>
              <p>Suppress notifications during specific times</p>
            </div>
            <label className="toggle-switch">
              <input type="checkbox" checked={settings.quietHours} onChange={() => toggleSetting('quietHours')} />
              <span className="slider round"></span>
            </label>
          </div>
          <div className="time-pickers">
            <div className="time-input-group">
              <label>From</label>
              <input type="time" value={settings.quietFrom} onChange={(e) => handleTimeChange('quietFrom', e.target.value)} disabled={!settings.quietHours} />
            </div>
            <div className="time-input-group">
              <label>To</label>
              <input type="time" value={settings.quietTo} onChange={(e) => handleTimeChange('quietTo', e.target.value)} disabled={!settings.quietHours} />
            </div>
          </div>
        </div>
      </section>

      <section className="focused-banner">
        <div className="focused-content">
          <h4>Stay Focused</h4>
          <p>Fine-tune how SubTrack talks to you. No more irrelevant noise, just clarity.</p>
        </div>
        <div className="focused-icon">
           <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><line x1="19" y1="8" x2="23" y2="12"></line><line x1="23" y1="8" x2="19" y2="12"></line></svg>
        </div>
      </section>

      <BottomNav />
    </div>
  );
}
