import { NextResponse } from 'next/server';

export async function GET(request) {
  return NextResponse.json({ 
    success: false, 
    message: "هذا القسم غير متاح" 
  }, { status: 403 });
}

export async function POST(request) {
  return NextResponse.json({ 
    success: false, 
    message: "هذا القسم غير متاح" 
  }, { status: 403 });
}

export async function PUT(request) {
  return NextResponse.json({ 
    success: false, 
    message: "هذا القسم غير متاح" 
  }, { status: 403 });
}

export async function DELETE(request) {
  return NextResponse.json({ 
    success: false, 
    message: "هذا القسم غير متاح" 
  }, { status: 403 });
}
