import admin, { auth, db } from '../../../lib/firebaseAdmin';
import { NextResponse } from 'next/server';

// Validate phone: optional + at start, then 7-15 digits only (no spaces, dashes, or parentheses)
function isValidPhone(phone) {
  const phoneRegex = /^\+?\d{7,15}$/;
  return phoneRegex.test(phone);
}

export async function POST(request) {
  const body = await request.json();
  const { email, password, name, phone } = body;

  if (!email || !password || !name) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  if (phone && !isValidPhone(phone)) {
    return NextResponse.json({ error: 'Invalid phone number format. Use + and digits only, length 7-15.' }, { status: 400 });
  }

  try {
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: name,
    
    });

    await db.collection('users').doc(userRecord.uid).set({
      uid: userRecord.uid,
 name,
      email,
password,
     
      phone: phone || '',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ message: 'User created successfully', uid: userRecord.uid }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: error.message || 'Something went wrong' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: 'GET method not allowed' }, { status: 405 });
}
