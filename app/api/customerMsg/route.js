import { NextResponse } from 'next/server';
import admin, { db } from '../../../lib/firebaseAdmin';

export async function GET() {
  try {
    const snapshot = await db
      .collection('contacts')
      .orderBy('createdAt', 'desc')
      .get();

    const messages = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name || '',
        email: data.email || '',
        subject: data.subject || '',
        message: data.message || '',
        createdAt: data.createdAt || null,
      };
    });

    return NextResponse.json({ messages }, { status: 200 });
  } catch (error) {
    console.error('Error fetching customer messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customer messages' },
      { status: 500 }
    );
  }
}
