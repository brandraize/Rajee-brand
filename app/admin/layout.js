"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthSimple } from "../../hooks/useAuthSimple";
import { useLanguage } from "../context/LanguageContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import {
  User,
  Settings,
  LogOut,
  Shield,
  ChevronDown,
  AlertTriangle
} from "lucide-react";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const { user, loading, signOut } = useAuthSimple();
  const { isRTL } = useLanguage();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const isAdmin = user?.email === "admin@gmail.com" || user?.email?.includes("admin");

  useEffect(() => {
    if (!loading && user && !isAdmin) {
      router.push("/");
    }
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [loading, user, isAdmin, router]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
      setShowLogoutModal(false);
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {isRTL ? "جارٍ فحص صلاحيات الإدارة..." : "Checking admin access..."}
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">
            {isRTL ? "يرجى تسجيل الدخول للوصول إلى منطقة الإدارة" : "Please log in to access admin area"}
          </p>
          <button
            onClick={() => router.push("/auth/login")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {isRTL ? "الذهاب إلى تسجيل الدخول" : "Go to Login"}
          </button>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">
            {isRTL ? "تم رفض الوصول. مطلوب صلاحيات الإدارة." : "Access denied. Admin access required."}
          </p>
          <button
            onClick={() => router.push("/")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {isRTL ? "الذهاب إلى الصفحة الرئيسية" : "Go to Home"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-50 ${isRTL ? "font-cairo" : "font-inter"}`}>
      {/* Admin Header */}
      <nav className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex justify-between items-center h-16 ${isRTL ? "flex-row-reverse" : ""}`}>

            {/* Logo */}
            <div className={`flex items-center ${isRTL ? "flex-row-reverse" : ""}`}>
              <div className="flex-shrink-0">
                <div className="flex items-center">
                  <Shield className="h-8 w-8 text-blue-600" />
                  <span className={`ml-2 text-xl font-bold text-gray-900 ${isRTL ? "mr-2 ml-0" : ""}`}>
                    {isRTL ? "لوحة الإدارة" : "Admin Panel"}
                  </span>
                </div>
              </div>
            </div>


            {/* User Dropdown */}
            <div className="flex items-center">
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center space-x-3 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div className={`hidden md:block ${isRTL ? "text-right" : "text-left"}`}>
                      <p className="text-sm font-medium text-gray-900">
                        {user.displayName || user.email?.split("@")[0] || "Admin"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {isRTL ? "مدير" : "Administrator"}
                      </p>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </div>
                </DropdownMenuTrigger>

                <DropdownMenuContent align={isRTL ? "start" : "end"} className="w-56 mt-2">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.displayName || user.email?.split("@")[0] || "Admin"}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>{isRTL ? "الملف الشخصي" : "Profile"}</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link href="/admin/settings" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>{isRTL ? "الإعدادات" : "Settings"}</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={() => setShowLogoutModal(true)}
                    className="text-red-600 focus:text-red-600 focus:bg-red-50"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{isRTL ? "تسجيل الخروج" : "Sign Out"}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content with sidebar */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <aside className="md:col-span-1">
            <nav className="bg-white border rounded-lg p-4 sticky top-20">
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/admin/dashboard" className="block px-3 py-2 rounded hover:bg-gray-50">{isRTL ? 'لوحة التحكم' : 'Dashboard'}</Link>
                </li>
                <li>
                  <Link href="/admin/reports" className="block px-3 py-2 rounded hover:bg-gray-50">{isRTL ? 'بلاغات الإعلانات' : 'Reported Listings'}</Link>
                </li>
                <li>
                  <Link href="/admin/assign-admin" className="block px-3 py-2 rounded hover:bg-gray-50">{isRTL ? 'إدارة المدراء' : 'Manage Admins'}</Link>
                </li>
                <li>
  <Link href="/admin/customerMsg" className="block px-3 py-2 rounded hover:bg-gray-50">
    {isRTL ? 'رسائل العملاء' : 'Customer Messages'}
  </Link>
</li>

              </ul>
            </nav>
          </aside>
          <main className="md:col-span-3">
            {children}
          </main>
        </div>
      </div>

      {/* Logout Modal */}
      <Dialog open={showLogoutModal} onOpenChange={setShowLogoutModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center space-x-2">
              <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <DialogTitle className="text-lg font-semibold">
                {isRTL ? "تأكيد تسجيل الخروج" : "Confirm Sign Out"}
              </DialogTitle>
            </div>
            <DialogDescription className="pt-2">
              {isRTL
                ? "هل أنت متأكد من أنك تريد تسجيل الخروج؟ ستحتاج إلى تسجيل الدخول مرة أخرى للوصول إلى لوحة الإدارة."
                : "Are you sure you want to sign out? You will need to log in again to access the admin panel."
              }
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <button
              onClick={() => setShowLogoutModal(false)}
              disabled={isLoggingOut}
              className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRTL ? "إلغاء" : "Cancel"}
            </button>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoggingOut ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {isRTL ? "جاري تسجيل الخروج..." : "Signing out..."}
                </>
              ) : (
                <>
                  <LogOut className="mr-2 h-4 w-4" />
                  {isRTL ? "تسجيل الخروج" : "Sign Out"}
                </>
              )}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
