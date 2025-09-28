"use client";

import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useLanguage } from "../app/context/LanguageContext";
import { Loader2 } from "lucide-react";

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
  title?: string;
  description?: string;
}

export const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
  title,
  description,
}) => {
  const { t, isRTL } = useLanguage();

  const defaultTitle = isRTL ? "تأكيد الحذف" : "Confirm Delete";
  const defaultDescription = isRTL 
    ? "هل أنت متأكد من أنك تريد حذف هذا الإعلان؟ لا يمكن التراجع عن هذا الإجراء." 
    : "Are you sure you want to delete this listing? This action cannot be undone.";

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className={isRTL ? 'text-right' : 'text-left'}>
        <AlertDialogHeader>
          <AlertDialogTitle 
            className={isRTL ? 'text-right' : 'text-left'}
            style={{ fontFamily: isRTL ? 'Cairo, sans-serif' : 'Inter, sans-serif' }}
          >
            {title || defaultTitle}
          </AlertDialogTitle>
          <AlertDialogDescription 
            className={isRTL ? 'text-right' : 'text-left'}
            style={{ fontFamily: isRTL ? 'Cairo, sans-serif' : 'Inter, sans-serif' }}
          >
            {description || defaultDescription}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className={isRTL ? 'flex-row-reverse' : ''}>
          <AlertDialogCancel 
            onClick={onClose}
            disabled={isDeleting}
            className={isRTL ? 'mr-2' : 'ml-2'}
            style={{ fontFamily: isRTL ? 'Cairo, sans-serif' : 'Inter, sans-serif' }}
          >
            {isRTL ? 'إلغاء' : 'Cancel'}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 text-white"
            style={{ fontFamily: isRTL ? 'Cairo, sans-serif' : 'Inter, sans-serif' }}
          >
            {isDeleting ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{isRTL ? 'جاري الحذف...' : 'Deleting...'}</span>
              </div>
            ) : (
              isRTL ? 'حذف' : 'Delete'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
