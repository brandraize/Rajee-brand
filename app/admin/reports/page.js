'use client';

import { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';

export default function AdminReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) { setReports([]); setLoading(false); return; }
      const token = await user.getIdToken();
      const qs = statusFilter ? `?status=${encodeURIComponent(statusFilter)}` : '';
      const res = await fetch(`/api/reports/list${qs}`, { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' });
      const data = await res.json();
      setReports(data?.reports || []);
    } catch (_) {
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [statusFilter]);

  const updateStatus = async (id, status) => {
    try {
      const auth = getAuth();
      const token = await auth.currentUser.getIdToken();
      const res = await fetch(`/api/reports/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ status }) });
      if (res.ok) load();
    } catch (_) {}
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Reports</h1>
        <select value={statusFilter} onChange={(e)=>setStatusFilter(e.target.value)} className="border rounded px-3 py-2 text-sm">
          <option value="">All</option>
          <option value="open">Open</option>
          <option value="reviewing">Reviewing</option>
          <option value="resolved">Resolved</option>
          <option value="dismissed">Dismissed</option>
        </select>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left p-2 border">Listing</th>
                <th className="text-left p-2 border">User</th>
                <th className="text-left p-2 border">Reason</th>
                <th className="text-left p-2 border">Status</th>
                <th className="text-left p-2 border">Time</th>
                <th className="text-left p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r)=> (
                <tr key={r.id} className="border-b">
                  <td className="p-2 border">{r.listingId}</td>
                  <td className="p-2 border">{r.userDisplayName || r.userEmail || r.userId}</td>
                  <td className="p-2 border">{r.reason}</td>
                  <td className="p-2 border">{r.status || 'open'}</td>
                  <td className="p-2 border">{r.timestamp?.toDate ? r.timestamp.toDate().toLocaleString() : ''}</td>
                  <td className="p-2 border space-x-2">
                    <button onClick={()=>updateStatus(r.id,'reviewing')} className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">Reviewing</button>
                    <button onClick={()=>updateStatus(r.id,'resolved')} className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">Resolved</button>
                    <button onClick={()=>updateStatus(r.id,'dismissed')} className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">Dismiss</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}


