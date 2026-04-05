import React, { useState } from 'react';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Camera,
    Shield,
    Key,
    Bell,
    CreditCard,
    Check
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import { useNotification } from '../context/NotificationContext';
import './ProfilePage.css';

const ProfilePage = () => {
    const baseUrl = import.meta.env.BASE_URL;
    const { role } = useDashboard();
    const { showToast } = useNotification();

    const [profile, setProfile] = useState({
        name: 'Abhishek Watmode',
        email: 'watmodeabhishek@gmail.com',
        phone: '+91 8390664056',
        location: 'Pune, India',
        bio: 'Tech Lead and Wealth Management enthusiast based in Pune. Passionate about financial literacy and building the next generation of Indian Fintech solutions.',
        company: 'Bharat Ledger Solutions',
        role: role
    });

    const [isEditing, setIsEditing] = useState(false);

    const handleSave = () => {
        setIsEditing(false);
        showToast('Profile updated successfully!', 'success', 'Profile Saved');
    };

    return (
        <div className="profile-page fade-in">
            <div className="profile-header-section">
                <div className="profile-cover" />
                <div className="profile-avatar-wrapper">
                    <div className="profile-avatar-big">
                        <img 
                            src={`${baseUrl}IMG-20260327-WA0017.jpg.jpeg`} 
                            alt="Profile" 
                            style={{ 
                                width: '100%', 
                                height: '100%', 
                                objectFit: 'cover',
                                borderRadius: '24px' // Matches 30px container radius minus 6px border
                            }} 
                        />
                        <button className="change-avatar-btn">
                            <Camera size={18} />
                        </button>
                    </div>
                    <div className="profile-intro">
                        <h1>{profile.name}</h1>
                        <p>{profile.company} • {profile.role}</p>
                    </div>
                    <div className="profile-actions">
                        {isEditing ? (
                            <button className="btn-save" onClick={handleSave}>
                                <Check size={18} />
                                Save Changes
                            </button>
                        ) : (
                            <button className="btn-edit" onClick={() => setIsEditing(true)}>
                                Edit Profile
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="profile-content-grid">
                <div className="profile-main-cards">
                    <div className="card profile-card">
                        <h3 className="card-title">Personal Information</h3>
                        <div className="info-grid">
                            <div className="info-item">
                                <label><User size={16} /> Full Name</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={profile.name}
                                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                    />
                                ) : (
                                    <span>{profile.name}</span>
                                )}
                            </div>
                            <div className="info-item">
                                <label><Mail size={16} /> Email Address</label>
                                {isEditing ? (
                                    <input
                                        type="email"
                                        value={profile.email}
                                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                    />
                                ) : (
                                    <span>{profile.email}</span>
                                )}
                            </div>
                            <div className="info-item">
                                <label><Phone size={16} /> Phone Number</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={profile.phone}
                                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                    />
                                ) : (
                                    <span>{profile.phone}</span>
                                )}
                            </div>
                            <div className="info-item">
                                <label><MapPin size={16} /> Location</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={profile.location}
                                        onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                                    />
                                ) : (
                                    <span>{profile.location}</span>
                                )}
                            </div>
                        </div>
                        <div className="info-item full-width">
                            <label>Bio</label>
                            {isEditing ? (
                                <textarea
                                    value={profile.bio}
                                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                    rows={4}
                                />
                            ) : (
                                <p className="bio-text">{profile.bio}</p>
                            )}
                        </div>
                    </div>

                    <div className="card profile-card">
                        <h3 className="card-title">Security & Privacy</h3>
                        <div className="security-options">
                            <div className="security-item">
                                <div className="security-info">
                                    <Key size={20} />
                                    <div>
                                        <strong>Change Password</strong>
                                        <p>Update your account password regularly.</p>
                                    </div>
                                </div>
                                <button className="btn-outline">Update</button>
                            </div>
                            <div className="security-item">
                                <div className="security-info">
                                    <Shield size={20} />
                                    <div>
                                        <strong>Two-Factor Authentication</strong>
                                        <p>Secure your account with 2FA.</p>
                                    </div>
                                </div>
                                <button className="btn-outline">Enable</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="profile-side-cards">
                    {/* <div className="card billing-card">
                        <h3 className="card-title">Billing & Subscription</h3>
                        <div className="plan-badge">PRO PLAN</div>
                        <div className="payment-method">
                            <CreditCard size={16} />
                            <span>Visa ending in 4242</span>
                        </div>
                        <p className="next-bill">Next bill: May 15, 2026</p>
                        <button className="btn-text">Manage Subscription</button>
                    </div> */}

                    <div className="card activity-summary">
                        <h3 className="card-title">Account Activity</h3>
                        <ul className="activity-list">
                            <li>
                                <div className="activity-dot" />
                                <div>
                                    <p>Logged in from 192.168.1.1</p>
                                    <span>2 hours ago</span>
                                </div>
                            </li>
                            <li>
                                <div className="activity-dot" />
                                <div>
                                    <p>Changed password</p>
                                    <span>5 days ago</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
