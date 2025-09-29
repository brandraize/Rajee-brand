import { NextResponse } from 'next/server';
import { firestoreAdmin } from '../../../configuration/firebase-admin';

export const dynamic = 'force-dynamic'; // ensures fresh response

// POST — Submit a report
export async function POST(request) {
  try {
    const data = await request.json();
    const { name, email, issueType, description } = data;

    // Basic validation
    if (!name || !email || !issueType || !description) {
      return NextResponse.json(
        { success: false, message: 'All fields are required.' },
        { status: 400 }
      );
    }

    const reportData = {
      name,
      email,
      issueType,
      description,
      createdAt: new Date(),
    };

    const reportRef = await firestoreAdmin
      .collection('customerReports')
      .add(reportData);

    return NextResponse.json({
      success: true,
      message: 'Report submitted successfully.',
      reportId: reportRef.id,
    });
  } catch (error) {
    console.error('POST /api/report-issue error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to submit report.',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

// GET — Fetch all reports
export async function GET() {
  try {
    const snapshot = await firestoreAdmin
      .collection('customerReports')
      .orderBy('createdAt', 'desc')
      .get();

    const reports = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.().toISOString() || null,
      };
    });

    return NextResponse.json(reports);
  } catch (error) {
    console.error('GET /api/report-issue error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch reports.',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
