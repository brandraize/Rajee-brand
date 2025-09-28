'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePostWizard } from '../../layout';
import { useEffect } from 'react';
const citiesData = [
  { id: 'riyadh', name: { en: 'Riyadh', ar: 'الرياض' } },
  { id: 'kharj', name: { en: 'Al Kharj', ar: 'الخرج' } },
  { id: 'dawadmi', name: { en: 'Al Dawadmi', ar: 'الدوادمي' } },
  { id: 'dilam', name: { en: 'Al Dilam', ar: 'الضلم' } },
  { id: 'diraiyah', name: { en: 'Al Diraiyah', ar: 'الدرعية' } },
  { id: 'majmaah', name: { en: 'Al Majmaah', ar: 'المجمعة' } },
  { id: 'quwaiiyah', name: { en: 'Al Quwaiiyah', ar: 'القويعية' } },
  { id: 'wadi', name: { en: 'Wadi Al Dawasir', ar: 'وادي الدواسر' } },
  { id: 'afif', name: { en: 'Afif', ar: 'عفيف' } },
  { id: 'shaqra', name: { en: 'Shaqra', ar: 'شقراء' } },
  { id: 'zulfi', name: { en: 'Zulfi', ar: 'الزلفي' } },
  { id: 'rumah', name: { en: 'Rumah', ar: 'رماح' } },
  { id: 'thadiq', name: { en: 'Thadiq', ar: 'ثادق' } },
  { id: 'huraymila', name: { en: 'Huraymila', ar: 'حريملاء' } },
  { id: 'riyadh_al_khabra', name: { en: 'Riyadh Al Khabra', ar: 'رياض الخبراء' } },
  { id: 'makkah', name: { en: 'Makkah', ar: 'مكة المكرمة' } },
  { id: 'jeddah', name: { en: 'Jeddah', ar: 'جدة' } },
  { id: 'taif', name: { en: 'Taif', ar: 'الطائف' } },
  { id: 'yanbu', name: { en: 'Yanbu', ar: 'ينبع' } },
  { id: 'rabigh', name: { en: 'Rabigh', ar: 'رابغ' } },
  { id: 'jazan', name: { en: 'Jazan', ar: 'جازان' } },
  { id: 'alqunfudhah', name: { en: 'Al Qunfudhah', ar: 'القنفذة' } },
  { id: 'al_lith', name: { en: 'Al Lith', ar: 'الليث' } },
  { id: 'al_bahah', name: { en: 'Al Bahah', ar: 'الباحة' } },
  { id: 'al_madinah', name: { en: 'Al Madinah', ar: 'المدينة المنورة' } },
  { id: 'tabuk', name: { en: 'Tabuk', ar: 'تبوك' } },
  { id: 'hail', name: { en: 'Hail', ar: 'حائل' } },
  { id: 'dammam', name: { en: 'Dammam', ar: 'الدمام' } },
  { id: 'khobar', name: { en: 'Al Khobar', ar: 'الخبر' } },
  { id: 'dhahran', name: { en: 'Dhahran', ar: 'الظهران' } },
  { id: 'jubail', name: { en: 'Jubail', ar: 'الجبيل' } },
  { id: 'qatif', name: { en: 'Qatif', ar: 'القطيف' } },
  { id: 'hafr_al_batin', name: { en: 'Hafr Al Batin', ar: 'حفر الباطن' } },
  { id: 'hafar', name: { en: 'Hafar', ar: 'حفر' } },
  { id: 'al_ahsa', name: { en: 'Al Ahsa', ar: 'الأحساء' } },
  { id: 'buraidah', name: { en: 'Buraidah', ar: 'بريدة' } },
  { id: 'unayzah', name: { en: 'Unaizah', ar: 'عنيزة' } },
  { id: 'al_rass', name: { en: 'Al Rass', ar: 'الرس' } },
  { id: 'al_mithnab', name: { en: 'Al Mithnab', ar: 'المذنب' } },
  { id: 'al_bukayriyah', name: { en: 'Al Bukayriyah', ar: 'البكيرية' } },
  { id: 'al_badai', name: { en: 'Al Badai', ar: 'البدائع' } },
  { id: 'abha', name: { en: 'Abha', ar: 'أبها' } },
  { id: 'khamis_mushait', name: { en: 'Khamis Mushait', ar: 'خميس مشيط' } },
  { id: 'najran', name: { en: 'Najran', ar: 'نجران' } },
  { id: 'al_namas', name: { en: 'Al Namas', ar: 'النماص' } },
  { id: 'tathleeth', name: { en: 'Tathleeth', ar: 'تثليث' } },
  { id: 'madinah', name: { en: 'Al Madinah', ar: 'المدينة المنورة' } },
  { id: 'al_ula', name: { en: 'Al Ula', ar: 'العلا' } },
  { id: 'al_wajh', name: { en: 'Al Wajh', ar: 'الوجه' } }
];

const CityGrid = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState(null);
  const router = useRouter();

  const filteredCities = citiesData.filter(city =>
    city.name.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
    city.name.ar.toLowerCase().includes(searchTerm.toLowerCase())
  );

const { agreed, city, setCity } = usePostWizard();
useEffect(() => {
    if (!agreed) {
      router.push('/seller/add-listing/fee');
      return;
    }


 // Redirect checks
  
   
   
  }, [agreed,router]);
   const handleCitySelect = (city) => {
    setCity(city);          // save city in shared state
    setSelectedCity(city);  // set local selected city for UI highlight
    router.push('/seller/add-listing/images');
  };
  return (
    <div className="max-w-4xl mx-auto p-4">
      <input
        type="text"
        placeholder="Search by English or Arabic name..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 overflow-y-auto max-h-[400px] border border-gray-200 rounded-md p-3"
        role="list"
      >
        {filteredCities.length === 0 && (
          <p className="col-span-full text-center text-gray-500">No cities found</p>
        )}

        {filteredCities.map((city) => (
          <button
            key={city.id}
            onClick={() => handleCitySelect(city)}
            className={`bg-gray-100 rounded-lg p-6 text-center cursor-pointer hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition
              ${selectedCity?.id === city.id ? 'bg-blue-200' : ''}`}
            role="listitem"
            tabIndex={0}
            aria-pressed={selectedCity?.id === city.id}
          >
            <div className="text-lg font-semibold">{city.name.en}</div>
            <div className="text-gray-600">{city.name.ar}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CityGrid;
