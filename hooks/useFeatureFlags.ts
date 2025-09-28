"use client";

import { useMemo } from "react";

// Feature scope configuration
export const FEATURE_SCOPE_RAJEA = "rajea";

export interface FeatureScope {
  scope: string;
  allowedCategories: string[];
  blockedCategories: string[];
  allowedSections: string[];
  blockedSections: string[];
}

export interface FeatureFlags {
  getScope: () => FeatureScope;
  isCategoryAllowed: (category: string) => boolean;
  isSectionAllowed: (section: string) => boolean;
  getFilteredCategories: (categories: Array<{ key: string; slug: string }>) => Array<{ key: string; slug: string }>;
}

export const useFeatureFlags = (): FeatureFlags => {
  const scope = useMemo((): FeatureScope => {
    const currentScope = FEATURE_SCOPE_RAJEA;

    return {
      scope: currentScope,
      allowedCategories: [
        'Main',
        'electrical-tools',
        'construction-equipment',
        'iron-tools',
        'plastic-tools',
        'old-electronics',
        'fashion',
        'furniture',
        'cars'
      ],
      blockedCategories: [
        'jobs',
        'services',
        'realestate',
        'games',
        'gardens',
        'lost',
        'occasions',
        'rarities',
        'coach',
        'code',
        'devices',
        'fund',
        'electronics'
      ],
      allowedSections: [
        'home',
        'categories',
        'listings',
        'profile',
        'dashboard'
      ],
      blockedSections: [
        'jobs',
        'services',
        'real-estate',
        'realestate'
      ]
    };
  }, []);

  const isCategoryAllowed = (category: string): boolean => {
    return scope.allowedCategories.includes(category) && !scope.blockedCategories.includes(category);
  };

  const isSectionAllowed = (section: string): boolean => {
    return scope.allowedSections.includes(section) && !scope.blockedSections.includes(section);
  };

  const getFilteredCategories = (categories: Array<{ key: string; slug: string }>): Array<{ key: string; slug: string }> => {
    return categories.filter(category => isCategoryAllowed(category.slug));
  };

  return {
    getScope: () => scope,
    isCategoryAllowed,
    isSectionAllowed,
    getFilteredCategories
  };
};
