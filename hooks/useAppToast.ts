import { useToast } from "./use-toast.js";
import { useLanguage } from "../app/context/LanguageContext";

/**
 * Centralized toast helpers to keep messages consistent and DRY.
 * Arabic-first; falls back to English.
 */
export const useAppToast = () => {
  const { toast } = useToast();
  const { isRTL } = useLanguage();

  const t = (ar: string, en: string) => (isRTL ? ar : en);

  const blockedSection = () =>
    toast({
      title: t("هذا القسم غير متاح", "This section is not available"),
      description: t(
        "نعتذر، هذا القسم غير متاح حالياً. يرجى تصفح الأقسام المتاحة الأخرى.",
        "Sorry, this section is not currently available. Please browse other available sections."
      ),
      variant: "destructive",
    });

  const posting = () =>
    toast({ title: t("جارٍ نشر الإعلان…", "Publishing…"), description: t("يرجى الانتظار", "Please wait") });

  const postSuccessVisible = () =>
    toast({ title: t("تم نشر الإعلان بنجاح", "Post published"), description: t("إعلانك الآن مرئي للجميع", "Your post is now visible") });

  const postSubmittedForReview = () =>
    toast({ title: t("تم إرسال الإعلان للمراجعة", "Submitted for review"), description: t("سيتم نشره بعد موافقة الإدارة", "It will be published after approval") });

  const error = (message?: string) =>
    toast({ title: t("حدث خطأ", "Error"), description: message || t("حدث خطأ غير متوقع", "Unexpected error"), variant: "destructive" });

  const success = (message?: string) =>
    toast({ title: t("تم بنجاح", "Success"), description: message });

  return {
    blockedSection,
    posting,
    postSuccessVisible,
    postSubmittedForReview,
    error,
    success,
  };
};
