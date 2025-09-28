'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "../app/context/LanguageContext";
import { useNavigation } from "../hooks/useNavigation";
import { useAuth } from "../hooks/useAuth";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Search, Globe, Menu, X, User, LogOut, Settings, ChevronDown, AlertTriangle, Shield } from "lucide-react";
import { ChevronUp, ChevronDown as ChevronDownIcon } from "lucide-react";
import { FaUserCircle } from "react-icons/fa";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

export default function Header() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
   const searchParams = useSearchParams();
const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');

  const { t, toggleLanguage, language, isRTL } = useLanguage();
  const { user, loading, signOut, requireAuth } = useAuth();
  const { getFilteredCategoriesList } = useNavigation();
  const router = useRouter();
  const pathname = usePathname();
 

  const categories = getFilteredCategoriesList();
  const currentCategory = (() => {
    const parts = (pathname || "").split("/").filter(Boolean);
    return parts[0] === "category" && parts[1] ? parts[1] : "Main";
  })();
  const hasAnyFilters = ['minPrice','maxPrice','condition','q'].some(k => searchParams?.get(k)) || currentCategory == 'Main';

  const flexDir = isRTL ? "flex-row-reverse" : "flex-row";
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
  const [error, setError] = useState('');

useEffect(() => {
  async function fetchUserProfile() {
    if (!user) return;

    try {
      const idToken = await user.getIdToken();
      

      const response = await fetch("/api/profileimage", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      const data = await response.json();
 
      setUserProfile(data.user);
    } catch (err) {
   
      setError(err.message);
    }
  }

  fetchUserProfile();
}, [user]);



  return (
    <header className="shadow-md sticky top-0 z-50 bg-white/95 backdrop-blur">

      {/* Top Navigation Bar */}
      <div className="bg-[#112A4A] text-white">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Link href="/">
              <Image src="/images/logo.png" alt="Logo" width={70} height={20} />
            </Link>

            {/* Categories Dropdown in Navbar */}
            <div className={`ml-4 ${isRTL ? 'mr-4 ml-0' : ''}`}>
              <DropdownMenu open={isCategoriesOpen} onOpenChange={setIsCategoriesOpen}>
                <DropdownMenuTrigger asChild>
                  <button type="button" onClick={() => setIsCategoriesOpen((v) => !v)} className="flex items-center gap-2 text-sm bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-white/30">
                    <span>{t('categories')}</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align={isRTL ? 'end' : 'start'} className="w-64 mt-2 p-2 z-50">
                  <div className="max-h-80 overflow-y-auto custom-scrollbar">
                    <div className="space-y-1">
                      {categories.map((category) => (
                        <DropdownMenuItem key={category.slug} asChild={false}>
                          <button
                            type="button"
                            onClick={() => { router.push(`/category/${category.slug}`); setIsCategoriesOpen(false); }}
                            className="flex items-center w-full px-3 py-2.5 text-sm rounded-lg hover:bg-gray-100 transition-colors text-left"
                          >
                            <span className="truncate">{t(category.slug) || t(category.key)}</span>
                          </button>
                        </DropdownMenuItem>
                      ))}
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Desktop Right */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 text-sm hover:text-blue-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md p-1">


{userProfile?.profileImage ? (
 <Image
  src={userProfile.profileImage}
  alt={userProfile.name || "User Profile"}
  width={32}
  height={32}
  className="rounded-full object-cover"
  onError={(e) => {
    e.currentTarget.src = "/images/default-avatar.png";
  }}
  priority
/>

) : (
  <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
    <User className="h-5 w-5 text-white" />
  </div>
)}





                  <span className="hidden sm:block">{user.displayName || user.email?.split("@")[0] || 'User'}</span>
                  <ChevronDown className="h-4 w-4" />
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align={isRTL ? "start" : "end"}
                  className="w-56 mt-2"
                >
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.displayName || user.email?.split("@")[0] || 'User'}
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
                      <span>{isRTL ? 'الملف الشخصي' : 'Profile'}</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>{isRTL ? 'الإعدادات' : 'Settings'}</span>
                    </Link>
                  </DropdownMenuItem>

                  {/* Admin Link */}
                  {(user?.email === "admin@gmail.com" || user?.email?.includes("admin")) && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/admin/dashboard" className="flex items-center">
                          <Shield className="mr-2 h-4 w-4" />
                          <span>{isRTL ? 'لوحة الإدارة' : 'Admin Panel'}</span>
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={() => setShowLogoutModal(true)}
                    className="text-red-600 focus:text-red-600 focus:bg-red-50"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{isRTL ? 'تسجيل الخروج' : 'Sign Out'}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                style={{ fontFamily }}
                href="/auth/login"
                className="flex items-center gap-1 text-sm hover:text-blue-200 transition-colors"
              >
                {isRTL ? 'تسجيل الدخول' : 'Login'}
              </Link>
            )}

            {/* Favorites Link */}
          {user && (
  <Link href="/favorites" className="text-sm hover:text-blue-200 transition-colors">
    {isRTL ? 'المفضلة' : 'Favorites'}
  </Link>
)}


            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 text-sm hover:text-blue-200 transition-colors"
            >
              <Globe className="w-4 h-4" />
              <span>{language === "en" ? "العربية" : "English"}</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setIsDrawerOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setIsDrawerOpen(false)}
          />
          <div
            className={`fixed top-0 ${drawerSide} w-64 h-full bg-white shadow-lg flex flex-col p-6 gap-4 transition-transform duration-300`}
            style={{ fontFamily }}
          >
            <button
              className="self-end mb-4"
              onClick={() => setIsDrawerOpen(false)}
            >
              <X className="w-6 h-6" />
            </button>

            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                className="text-gray-800 text-base hover:text-blue-500 transition-colors"
              >
                {t(category.slug) || t(category.key)}
              </Link>
            ))}

         {user && (
  <Link href="/favorites" className="text-sm hover:text-blue-200 transition-colors">
    {isRTL ? 'المفضلة' : 'Favorites'}
  </Link>
)}


            {user ? (
              <div className="mt-2">
                <Link
                  href="/profile"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-100 rounded flex items-center gap-2"
                >
                  <User className="h-4 w-4" />
                  {isRTL ? 'الملف الشخصي' : 'Profile'}
                </Link>
                <Link
                  href="/settings"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-100 rounded flex items-center gap-2"
                >
                  <Settings className="h-4 w-4" />
                  {isRTL ? 'الإعدادات' : 'Settings'}
                </Link>
                <button
                  onClick={() => setShowLogoutModal(true)}
                  className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  {isRTL ? 'تسجيل الخروج' : 'Sign Out'}
                </button>
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="text-gray-800 text-base hover:text-blue-500 transition-colors"
              >
                {isRTL ? "تسجيل الدخول" : "Login"}
              </Link>
            )}

            {/* Language Button */}
            <button
              onClick={toggleLanguage}
              className="bg-primary-darker dark:bg-background flex h-[34px] items-center justify-center gap-2 rounded border-none px-3 text-sm text-white shadow-none transition-colors hover:text-blue-400 mt-4"
            >
              <span className="flex flex-col items-center justify-center text-[10px] leading-none">
                <ChevronUp className="w-3 h-3" />
                <ChevronDown className="w-3 h-3" />
              </span>
              <span>{language === "en" ? "العربية" : "English"}</span>
            </button>
          </div>
        </div>
      )}

      {/* Search & Post Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-4">
            {/* Search Input */}
           <div className="flex-1 max-w-2xl">
  <div className="relative group">
    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
      <Search className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
    </div>
    <input
      id="search-input"
      type="search"
      placeholder={t("searchGoods")}
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleSearch();
        }
      }}
      className={`w-full h-12 pl-12 pr-14 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200
        ${isRTL ? 'text-right' : 'text-left'}`}
      style={{ fontFamily }}
    />
    <button
      type="submit"
      onClick={(e) => {
        e.preventDefault();
        handleSearch();
      }}
      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md transition-colors"
    >
      <Search className="w-4 h-4" />
    </button>
  </div>
</div>


            {/* Add Listing Button */}
            <button
              onClick={handleAddPostClick}
              className="bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-lg font-medium text-white transition-colors shadow-sm hover:shadow-md"
              style={{ fontFamily }}
            >
              {isRTL ? "أضف إعلانك +" : "Add your post +"}
            </button>
          </div>
        </div>
      </div>


      {/* Logout Confirmation Modal */}
      <Dialog open={showLogoutModal} onOpenChange={setShowLogoutModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center space-x-2">
              <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <DialogTitle className="text-lg font-semibold">
                {isRTL ? 'تأكيد تسجيل الخروج' : 'Confirm Sign Out'}
              </DialogTitle>
            </div>
            <DialogDescription className="pt-2">
              {isRTL
                ? 'هل أنت متأكد من أنك تريد تسجيل الخروج؟ ستحتاج إلى تسجيل الدخول مرة أخرى للوصول إلى حسابك.'
                : 'Are you sure you want to sign out? You will need to log in again to access your account.'
              }
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <button
              onClick={() => setShowLogoutModal(false)}
              disabled={isLoggingOut}
              className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRTL ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoggingOut ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {isRTL ? 'جاري تسجيل الخروج...' : 'Signing out...'}
                </>
              ) : (
                <>
                  <LogOut className="mr-2 h-4 w-4" />
                  {isRTL ? 'تسجيل الخروج' : 'Sign Out'}
                </>
              )}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
}
