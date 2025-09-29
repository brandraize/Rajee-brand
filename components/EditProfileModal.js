'use client';

import React, { useState, useEffect } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../configuration/firebase-config'; // your firebase-config should export `storage`
import { useLanguage } from '../app/context/LanguageContext'; // adjust path if needed

const FIELD_CONFIG = {
  profileImage: { labelKey: 'profileImage', type: 'file' },
  coverImage: { labelKey: 'coverImage', type: 'file' },
  name: { labelKey: 'name', type: 'text' },
  email: { labelKey: 'email', type: 'email' },
  phone: { labelKey: 'phone', type: 'tel' },
  password: { labelKey: 'password', type: 'password' },
  twitter: { labelKey: 'twitter', type: 'text' },
  instagram: { labelKey: 'instagram', type: 'text' },
  facebook: { labelKey: 'facebook', type: 'text' },
};

export default function EditProfileModal({ isOpen, activeField, userData, onClose, onSave, uid }) {
  const { t, isRTL } = useLanguage();

  const [inputValue, setInputValue] = useState('');
  const [filePreview, setFilePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (activeField && userData) {
      const val = userData[activeField];
      const type = FIELD_CONFIG[activeField]?.type || 'text';

      if (type === 'file') {
        setFilePreview(val || null);
        setInputValue('');
      } else {
        setInputValue(val || '');
        setFilePreview(null);
      }
      setError('');
      setIsEditing(false);
    }
  }, [activeField, userData]);

  // Cleanup blob URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      if (filePreview && filePreview.startsWith('blob:')) {
        URL.revokeObjectURL(filePreview);
      }
    };
  }, [filePreview]);

  if (!isOpen || !activeField) return null;

  const config = FIELD_CONFIG[activeField] || { labelKey: activeField, type: 'text' };

  const renderValueText = () => {
    const val = userData[activeField];
    if (!val) return <span className="text-gray-500 italic">{t('notSet')}</span>;

    if (config.type === 'file') {
      return (
        <img
          src={val}
          alt={t(config.labelKey)}
          className="w-32 h-32 object-cover rounded-full border"
        />
      );
    }

    if (config.type === 'password') {
      return <span>••••••••</span>;
    }

    return <span>{val.toString()}</span>;
  };

  const handleChange = (e) => {
    if (config.type === 'file') {
      const file = e.target.files[0];
      if (file) {
        const previewUrl = URL.createObjectURL(file);
        setFilePreview(previewUrl);
        setInputValue(file);
      }
    } else {
      setInputValue(e.target.value);
    }
  };

  const uploadFileToFirebase = async (file, folder, uid) => {
    if (!file || !uid) throw new Error(t('missingFileOrUserID'));
    const fileRef = ref(storage, `${folder}/${uid}/${file.name}`);
    await uploadBytes(fileRef, file);
    const url = await getDownloadURL(fileRef);
    return url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (config.type === 'file') {
      if (!inputValue) {
        setError(t('pleaseSelectFile'));
        return;
      }

      setUploading(true);
      try {
        const folder = activeField === 'profileImage' ? 'profileImages' : 'coverImages';
        const uploadedUrl = await uploadFileToFirebase(inputValue, folder, uid);
        await onSave({ field: activeField, value: uploadedUrl });
        setIsEditing(false);
      } catch (err) {
        console.error(err);
        setError(t('failedUploadImage'));
      } finally {
        setUploading(false);
      }
    } else {
      await onSave({ field: activeField, value: inputValue });
      setIsEditing(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 px-4"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4">{t(config.labelKey)}</h2>

        {!isEditing ? (
          <>
            <div className="mb-6">{renderValueText()}</div>
            <div className={`flex justify-end space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                {t('close')}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {t('edit')}
              </button>
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {config.type === 'file' ? (
              <>
                {filePreview && (
                  <img
                    src={filePreview}
                    alt={t('preview')}
                    className="mb-4 w-32 h-32 object-cover rounded-full border"
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleChange}
                  className="block w-full"
                />
              </>
            ) : (
              <input
                type={config.type}
                value={inputValue}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            )}

            {error && <p className="text-red-600">{error}</p>}

            <div className={`flex justify-end space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                disabled={uploading}
              >
                {t('cancel')}
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                disabled={uploading}
              >
                {uploading ? t('uploading') : t('save')}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
