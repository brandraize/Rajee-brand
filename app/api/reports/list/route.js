import { NextResponse } from 'next/server';
import { authAdmin, firestoreAdmin } from '../../../../configuration/firebase-admin';

export const dynamic = 'force-dynamic';

async function getDecodedFromRequest(request) {
  try {
    const authHeader = request.headers.get('authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) return null;
    const decoded = await authAdmin.verifyIdToken(token);
    return decoded || null;
  } catch (_) {
    return null;
  }
}

async function ensureIsAdmin(decoded) {
  if (!decoded) return false;
  if (decoded.admin === true) return true;
  try {
    const uid = decoded.uid;
    const userDoc = await firestoreAdmin.collection('users').doc(uid).get();
    const role = userDoc.exists ? userDoc.data()?.role : null;
    if (role === 'super_admin') return true;
    // fallback: email heuristic used elsewhere in app
    const email = decoded.email || '';
    if (email === 'admin@gmail.com' || email.includes('admin')) return true;
  } catch (_) {}
  return false;
}

export async function GET(request) {
  try {
    const decoded = await getDecodedFromRequest(request);
    if (!decoded) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    const isAdmin = await ensureIsAdmin(decoded);
    if (!isAdmin) return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let query = firestoreAdmin.collection('reports').orderBy('timestamp', 'desc');
    if (status) {
      query = query.where('status', '==', status);
    }
    const snap = await query.limit(200).get();
    const reportsRaw = snap.docs.map((d) => ({ id: d.id, ...(d.data() || {}) }));

    // Enrich with user display names if missing
    const missingUserIds = Array.from(new Set(
      reportsRaw
        .filter(r => !r.userDisplayName && !r.userEmail)
        .map(r => r.userId)
        .filter(Boolean)
    ));

    const userMap = new Map();
    if (missingUserIds.length > 0) {
      await Promise.all(missingUserIds.map(async (uid) => {
        try {
          const doc = await firestoreAdmin.collection('users').doc(uid).get();
          if (doc.exists) {
            const data = doc.data() || {};
            userMap.set(uid, { displayName: data.displayName || '', email: data.email || '' });
          } else {
            userMap.set(uid, { displayName: '', email: '' });
          }
        } catch (_) {
          userMap.set(uid, { displayName: '', email: '' });
        }
      }));
    }

    const reports = reportsRaw.map((r) => {
      if (!r.userDisplayName && !r.userEmail) {
        const u = userMap.get(r.userId) || { displayName: '', email: '' };
        return { ...r, userDisplayName: u.displayName, userEmail: u.email };
      }
      return r;
    });

    return NextResponse.json({ success: true, reports });
  } catch (error) {
    console.error('GET /api/reports/list error:', error);
    return NextResponse.json({ success: false, message: 'Failed to list reports' }, { status: 500 });
  }
}


