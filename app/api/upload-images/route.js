import { NextResponse } from 'next/server';
import { storage } from '../../../configuration/firebase-config.js';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { randomUUID } from 'crypto';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files');
    const clientId = formData.get('clientId');
    
    if (!files || files.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'لم يتم اختيار أي صور'
      }, { status: 400 });
    }
    
    if (!clientId) {
      return NextResponse.json({
        success: false,
        message: 'معرف المستخدم مطلوب'
      }, { status: 400 });
    }
    
    const uploadPromises = files.map(async (file) => {
      const fileName = `${randomUUID()}-${file.name}`;
      const storageRef = ref(storage, `posts/${clientId}/${fileName}`);
      
      const bytes = await file.arrayBuffer();
      await uploadBytes(storageRef, bytes);
      
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    });
    
    const urls = await Promise.all(uploadPromises);
    
    return NextResponse.json({
      success: true,
      message: 'تم رفع الصور بنجاح',
      urls
    });
    
  } catch (error) {
    console.error('Error uploading images:', error);
    return NextResponse.json({
      success: false,
      message: 'فشل رفع الصور. حاول مرة أخرى'
    }, { status: 500 });
  }
}
