import { NextResponse } from 'next/server';
import { FirebaseAuthService } from '../../../services/firebase';
import { ROLES } from '../../../constants/roles';

export async function POST(request) {
  try {
    const { email, password, displayName } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const user = await FirebaseAuthService.signUp(email, password, displayName);
    await FirebaseAuthService.updateUserRole(user.uid, ROLES.SUPER_ADMIN);

    return NextResponse.json({
      success: true,
      message: 'Super admin created successfully',
      uid: user.uid
    });
  } catch (error) {
    console.error('Error creating super admin:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create super admin' },
      { status: 500 }
    );
  }
}
