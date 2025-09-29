'use client';

import React, { useEffect, useState } from 'react';

const ReportedIssues = ({ isRTL = false }) => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  const labels = {
    title: isRTL ? 'القضايا المُبلّغ عنها' : 'Reported Issues',
    name: isRTL ? 'الاسم' : 'Name',
    email: isRTL ? 'البريد الإلكتروني' : 'Email',
    issueType: isRTL ? 'نوع المشكلة' : 'Issue Type',
    description: isRTL ? 'الوصف' : 'Description',
    createdAt: isRTL ? 'تاريخ الإبلاغ' : 'Reported At',
    reply: isRTL ? 'رد' : 'Reply',
    empty: isRTL ? 'لا توجد بلاغات.' : 'No issues reported.',
    loading: isRTL ? 'جارٍ التحميل...' : 'Loading...'
  };

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch('/api/issue');
        const data = await res.json();
        setIssues(data);
      } catch (error) {
        console.error('Failed to fetch reports:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleString(isRTL ? 'ar-EG' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Opens default mail client with email to user
  const handleReply = (email) => {
    window.location.href = `mailto:${email}?subject=Regarding your report`;
  };

  return (
    <div
      style={{
        direction: isRTL ? 'rtl' : 'ltr',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        padding: '2rem',
        maxWidth: '1000px',
        margin: '0 auto',
      }}
    >
      <h2 style={{ textAlign: isRTL ? 'right' : 'left', marginBottom: '1.5rem' }}>
        {labels.title}
      </h2>

      {loading ? (
        <p>{labels.loading}</p>
      ) : issues.length === 0 ? (
        <p>{labels.empty}</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            }}
          >
            <thead>
              <tr
                style={{
                  backgroundColor: '#0070f3',
                  color: 'white',
                  textAlign: 'left',
                  fontWeight: 'bold',
                }}
              >
                <th style={{ padding: '12px 15px' }}>{labels.name}</th>
                <th style={{ padding: '12px 15px' }}>{labels.email}</th>
                <th style={{ padding: '12px 15px' }}>{labels.issueType}</th>
                <th style={{ padding: '12px 15px' }}>{labels.description}</th>
                <th style={{ padding: '12px 15px' }}>{labels.createdAt}</th>
                <th style={{ padding: '12px 15px', textAlign: 'center' }}>{labels.reply}</th>
              </tr>
            </thead>

            <tbody>
              {issues.map((issue, i) => (
                <tr
                  key={issue.id}
                  style={{
                    backgroundColor: i % 2 === 0 ? '#f9f9f9' : 'white',
                    borderBottom: '1px solid #ddd',
                  }}
                >
                  <td style={{ padding: '12px 15px', verticalAlign: 'top', maxWidth: '120px', wordBreak: 'break-word' }}>
                    {issue.name}
                  </td>
                  <td style={{ padding: '12px 15px', verticalAlign: 'top', maxWidth: '180px', wordBreak: 'break-word', color: '#0070f3', cursor: 'pointer' }}>
                    <a href={`mailto:${issue.email}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      {issue.email}
                    </a>
                  </td>
                  <td style={{ padding: '12px 15px', verticalAlign: 'top', textTransform: 'capitalize' }}>
                    {issue.issueType}
                  </td>
                  <td style={{ padding: '12px 15px', verticalAlign: 'top', maxWidth: '350px', whiteSpace: 'pre-wrap' }}>
                    {issue.description}
                  </td>
                  <td style={{ padding: '12px 15px', verticalAlign: 'top', whiteSpace: 'nowrap' }}>
                    {formatDate(issue.createdAt)}
                  </td>
                  <td
                    style={{
                      padding: '12px 15px',
                      textAlign: 'center',
                      verticalAlign: 'middle',
                    }}
                  >
                    <button
                      onClick={() => handleReply(issue.email)}
                      style={{
                        backgroundColor: '#0070f3',
                        border: 'none',
                        color: 'white',
                        padding: '8px 16px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s ease',
                      }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = '#005bb5'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = '#0070f3'}
                      aria-label={`${labels.reply} ${issue.email}`}
                    >
                      {labels.reply}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ReportedIssues;
