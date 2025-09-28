'use client';

import { useEffect, useState } from 'react';
import { Mail, User, MessageCircle, Reply } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext'; // for RTL and translations

export default function CustomerMsg() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isRTL, t } = useLanguage();

  useEffect(() => {
    async function fetchMessages() {
      try {
        const res = await fetch('/api/customerMsg');
        if (!res.ok) {
          throw new Error('Failed to fetch messages');
        }
        const data = await res.json();
        setMessages(data.messages || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchMessages();
  }, []);

  return (
    <div className={`max-w-7xl mx-auto p-6 min-h-screen ${isRTL ? 'rtl' : 'ltr'}`}>
      <h1 className="text-4xl font-extrabold mb-8 text-center text-gray-900">
        {t ? t('CustomerMessages') : 'Customer Messages'}
      </h1>

      {loading && <p className="text-center text-gray-600">Loading messages...</p>}
      {error && <p className="text-center text-red-600 font-semibold">Error: {error}</p>}
      {!loading && !error && messages.length === 0 && (
        <p className="text-center text-gray-700">No customer messages found.</p>
      )}

      {!loading && !error && messages.length > 0 && (
        <div className="bg-white shadow-lg rounded-xl overflow-x-auto border border-gray-200">
          <div className="grid grid-cols-12 bg-gray-100 text-sm font-semibold text-gray-700 border-b px-4 py-3">
            <div className="col-span-2 flex items-center gap-2">
              <User className="w-4 h-4" />
              {t ? t('name') : 'Name'}
            </div>
            <div className="col-span-2 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              {t ? t('email') : 'Email'}
            </div>
            <div className="col-span-3 flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              {t ? t('subject') : 'Subject'}
            </div>
            <div className="col-span-4">{t ? t('message') : 'Message'}</div>
            <div className="col-span-1 text-center">{t ? t('reply') : 'Reply'}</div>
          </div>

          {messages.map(({ id, name, email, subject, message }) => (
            <div
              key={id}
              className="grid grid-cols-12 px-4 py-4 border-b text-sm hover:bg-gray-50 transition"
            >
              <div className="col-span-2 flex items-center text-gray-900 break-words">{name}</div>

              <div className="col-span-2 flex items-center text-green-700 break-all">
                <a
                  href={`mailto:${email}`}
                  className="hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {email}
                </a>
              </div>

              <div className="col-span-3 text-gray-800 font-medium break-words">{subject}</div>

              <div className="col-span-4 text-gray-700 whitespace-pre-wrap break-words">{message}</div>

              <div className="col-span-1 flex justify-center items-center">
                <a
                  href={`mailto:${email}`}
                  title={t ? t('replyToEmail') : 'Reply to email'}
                  className="text-blue-600 hover:text-blue-800"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Reply className="w-5 h-5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
