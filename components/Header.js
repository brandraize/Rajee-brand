'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "../app/context/LanguageContext";
import { useAuth } from "../hooks/useAuth";
import { useNavigation } from "../hooks/useNavigation";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Sidebar from "./Sidebar";
import { Search, Globe, Menu, X, User, LogOut, Settings, ChevronDown, AlertTriangle, Shield } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";

export default function Header() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');

  const { t, toggleLanguage, language, isRTL } = useLanguage();
  const { user, signOut, requireAuth } = useAuth();
  const { getFilteredCategoriesList } = useNavigation();
  const router = useRouter();
  const pathname = usePathname();

  const categories = getFilteredCategoriesList();
  const fontFamily = isRTL ? "Cairo, sans-serif" : "Inter, sans-serif";
  const drawerSide = isRTL ? "right-0" : "left-0";

  const handleSearch = () => {
    if (!searchQuery) return;
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  const handleAddPostClick = async (e) => {
    e.preventDefault();
    if (!user) {
      await requireAuth();
    } else {
      router.push('/seller/add-listing');
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
      setShowLogoutModal(false);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    async function fetchUserProfile() {
      if (!user) return;
      try {
        const idToken = await user.getIdToken();
        const response = await fetch("/api/profileimage", {
          method: "GET",
          headers: { Authorization: `Bearer ${idToken}` },
        });
        const data = await response.json();
        setUserProfile(data.user);
      } catch (err) {
        console.error(err.message);
      }
    }
    fetchUserProfile();
  }, [user]);

  return (
    <header className="shadow-md sticky top-0 z-50 bg-white/95 backdrop-blur">

      {/* Top Navigation */}
      <div className="bg-[#112A4A] text-white">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Link href="/">
              <Image src="/images/logo.png" alt="Logo" width={70} height={20} />
            </Link>
          </div>

          {/* Desktop Right */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 text-sm hover:text-blue-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md p-1">
                  {userProfile?.profileImage ? (
                    <Image
                      src={userProfile.profileImage}
                      alt={userProfile.displayName || "User Profile"}
                      width={32} height={32}
                      className="rounded-full object-cover"
                      onError={(e) => { e.currentTarget.src = "/images/default-avatar.png"; }}
                      priority
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                  )}
                  <span className="hidden sm:block">{userProfile?.name|| user.email?.split("@")[0] || 'User'}</span>
                  <ChevronDown className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align={isRTL ? "start" : "end"} className="w-56 mt-2">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.displayName || user.email?.split("@")[0]}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem asChild><Link href="/profile" className="flex items-center"><User className="mr-2 h-4 w-4" /> {isRTL ? 'الملف الشخصي' : 'Profile'}</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link href="/settings" className="flex items-center"><Settings className="mr-2 h-4 w-4" /> {isRTL ? 'الإعدادات' : 'Settings'}</Link></DropdownMenuItem>
                
                  {(user?.email?.includes("admin")) && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild><Link href="/admin/dashboard" className="flex items-center"><Shield className="mr-2 h-4 w-4" /> {isRTL ? 'لوحة الإدارة' : 'Admin Panel'}</Link></DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setShowLogoutModal(true)} className="text-red-600 focus:text-red-600 focus:bg-red-50">
                    <LogOut className="mr-2 h-4 w-4" /> {isRTL ? 'تسجيل الخروج' : 'Sign Out'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link style={{ fontFamily }} href="/auth/login" className="flex items-center gap-1 text-sm hover:text-blue-200 transition-colors">
                {isRTL ? 'تسجيل الدخول' : 'Login'}
              </Link>
            )}

            {user && (
              <Link href="/favorites" className="text-sm hover:text-blue-200 transition-colors">
                {isRTL ? 'المفضلة' : 'Favorites'}
              </Link>
            )}

            <button onClick={toggleLanguage} className="flex items-center gap-1 text-sm hover:text-blue-200 transition-colors">
              <Globe className="w-4 h-4" />
              <span>{language === "en" ? "العربية" : "English"}</span>
            </button>
          </div>

       {/* Mobile Menu Button (opens Sidebar directly) */}
<div className="md:hidden flex items-center gap-4 px-4 py-3 bg-[#112A4A] text-white justify-end">
  <button onClick={toggleLanguage} aria-label="Toggle Language" className="flex items-center gap-1 hover:text-blue-200 transition-colors">
    <Globe className="w-6 h-6" />
     <span>{language === "en" ? "العربية" : "English"}</span>
  </button>

  <button onClick={() => setIsDrawerOpen(true)} aria-label="Open menu">
    <User className="w-6 h-6" />
  </button>
</div>

        </div>
      </div>

      {/* Mobile Sidebar Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-[9999] flex">

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsDrawerOpen(false)} />

          {/* Render Sidebar component */}
          <div className={`absolute top-0 ${drawerSide} h-screen w-full md:w-80 z-[10000] bg-white`}>
 <Sidebar
  isOpen={isDrawerOpen}
  setIsOpen={setIsDrawerOpen}
  user={user}
  userProfile={userProfile}
  isRTL={isRTL}
  setShowLogoutModal={setShowLogoutModal}
/>



        
          </div>
          
        </div>
      )}

      {/* Search & Add Post Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-center gap-4">
          <div className="flex-1 max-w-2xl relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            </div>
            <input
              type="search"
              placeholder={t("searchGoods")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSearch(); } }}
              className={`w-full h-12 pl-12 pr-14 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isRTL ? 'text-right' : 'text-left'}`}
              style={{ fontFamily }}
            />
            <button type="submit" onClick={(e) => { e.preventDefault(); handleSearch(); }} className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md transition-colors">
              <Search className="w-4 h-4" />
            </button>
          </div>

          <button onClick={handleAddPostClick} className="bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-lg font-medium text-white transition-colors shadow-sm hover:shadow-md" style={{ fontFamily }}>
            {isRTL ? "أضف إعلانك +" : "Add your post +"}
          </button>
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
              <DialogTitle className="text-lg font-semibold">{isRTL ? 'تأكيد تسجيل الخروج' : 'Confirm Sign Out'}</DialogTitle>
            </div>
            <DialogDescription className="pt-2">{isRTL ? 'هل أنت متأكد من أنك تريد تسجيل الخروج؟ ستحتاج إلى تسجيل الدخول مرة أخرى للوصول إلى حسابك.' : 'Are you sure you want to sign out? You will need to log in again to access your account.'}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <button onClick={() => setShowLogoutModal(false)} disabled={isLoggingOut} className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed">
              {isRTL ? 'إلغاء' : 'Cancel'}
            </button>
            <button onClick={handleLogout} disabled={isLoggingOut} className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
              {isLoggingOut ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div> : <LogOut className="mr-2 h-4 w-4" />} {isLoggingOut ? (isRTL ? 'جاري تسجيل الخروج...' : 'Signing out...') : (isRTL ? 'تسجيل الخروج' : 'Sign Out')}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
}
