'use client';

import React, { useEffect, useState } from 'react';
import { auth } from '../../configuration/firebase-config';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

import EditProfileModal from '../../components/EditProfileModal';

import {
  User,
  Image,
  Mail,
  Phone,
  Lock,
  Twitter,
  Instagram,
  Facebook,
  Trash2,
} from 'lucide-react';

import { useLanguage } from '../../app/context/LanguageContext'; // Adjust path as needed

const FIELD_CONFIG = {
  profileImage: { labelKey: 'Change Profile Image', type: 'file', icon: Image },
  coverImage: { labelKey: 'Change Cover Image', type: 'file', icon: Image },
  name: { labelKey: 'Change Name', type: 'text', icon: User },
  email: { labelKey: 'Change Email', type: 'email', icon: Mail },
  phone: { labelKey: 'Change Phone', type: 'tel', icon: Phone },
  password: { labelKey: 'Change Password', type: 'password', icon: Lock },
};

const ORDERED_FIELDS = [
  'profileImage',
  'coverImage',
  'name',
  'email',
  'phone',
  'password',
];

// Social links are hardcoded, keep as is or translate labels only
const SOCIAL_LINKS = {
  twitter: 'https://twitter.com/yourhandle',
  instagram: 'https://instagram.com/yourhandle',
  facebook: 'https://facebook.com/yourhandle',
};

export default function SettingsPage() {
  const { language, isRTL, t } = useLanguage();
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeField, setActiveField] = useState(null);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setLoadingUser(false);
        return;
      }
      setUser(firebaseUser);

      try {
        const res = await fetch(`/api/settings?uid=${firebaseUser.uid}`);
        if (!res.ok) throw new Error(t('failedFetchUser'));
        const data = await res.json();
        setUserData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingUser(false);
      }
    });

    return () => unsubscribe();
  }, [t]);

  const openModalForField = (field) => {
    setActiveField(field);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setActiveField(null);
    setError('');
  };

  const handleSave = async ({ field, value }) => {
    if (!user) {
      setError(t('userNotAuthenticated'));
      return;
    }

    try {
      setError('');
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: user.uid, [field]: value }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || t('failedUpdateProfile'));
      }

      setUserData((prev) => ({ ...prev, [field]: value }));
      closeModal();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(t('deleteAccountConfirm'));
    if (!confirmed) return;

    try {
      setError('');
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: user.uid, deleteAccount: true }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || t('failedDeleteAccount'));
      }

      await signOut(auth);
      router.push('/');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loadingUser) {
    return (
      <div className="p-6 text-center text-gray-500">{t('loadingUser')}</div>
    );
  }

  if (!user) {
    return (
      <div className="p-6 text-center text-gray-700">{t('pleaseLogin')}</div>
    );
  }

  if (!userData) {
    return (
      <div className="p-6 text-center text-gray-700">{t('noUserData')}</div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50" dir={isRTL ? 'rtl' : 'ltr'}>
      <nav
        className={`w-80 bg-white p-6 border-r border-gray-200 flex flex-col justify-between shadow-lg rounded-r-lg ${
          isRTL ? 'border-l' : 'border-r'
        }`}
      >
        <div>
          <h2 className="text-3xl font-semibold mb-10 border-b border-gray-200 pb-4">
            {t('settings')}
          </h2>

          <ul className="space-y-4">
            {ORDERED_FIELDS.map((key) => {
              if (!(key in userData)) return null;

              const Icon = FIELD_CONFIG[key]?.icon;

              return (
                <li key={key}>
                  <button
                    className="w-full flex items-center gap-3 text-left text-lg font-medium text-gray-800 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-lg px-3 py-3 transition shadow-sm hover:shadow-md"
                    onClick={() => openModalForField(key)}
                    type="button"
                  >
                    {Icon && <Icon className="w-5 h-5 text-blue-500" />}
                    {t(FIELD_CONFIG[key]?.labelKey) || key}
                  </button>
                </li>
              );
            })}
          </ul>
{Object.entries(SOCIAL_LINKS).map(([platform, url]) => {
  let Icon;
  switch (platform) {
    case 'twitter':
      Icon = Twitter;
      break;
    case 'instagram':
      Icon = Instagram;
      break;
    case 'facebook':
      Icon = Facebook;
      break;
    default:
      Icon = null;
  }

  if (!Icon) return null;

  return (
    <a
      key={platform}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex ml-4 mt-3 items-center gap-2 text-blue-600 hover:underline text-lg font-semibold"
    >
      <Icon className="w-6 h-6" />
      {t(platform)}
    </a>
  );
})}

          
        </div>

        <div className="mt-8">
          <button
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg shadow-md transition"
            onClick={handleDeleteAccount}
            type="button"
          >
            <Trash2 className="w-5 h-5" />
            {t('deleteAccount')}
          </button>

          {error && (
            <p className="text-red-600 mt-4 text-center font-medium">{error}</p>
          )}
        </div>
      </nav>

      <main className="flex-1 p-12">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">{t('editProfile')}</h1>
        <p className="text-gray-600 max-w-xl mb-8">{t('selectSetting')}</p>
      </main>

      <EditProfileModal
        userData={userData}
        isOpen={modalOpen}
        activeField={activeField}
        onClose={closeModal}
        onSave={handleSave}
        uid={user?.uid}
      />
    </div>
  );
}
