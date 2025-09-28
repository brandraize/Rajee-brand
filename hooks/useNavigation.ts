"use client";

import { useFeatureFlags } from "./useFeatureFlags";
import { CATEGORIES } from "../constants/categories";

export const useNavigation = () => {
  const { getFilteredCategories, isSectionAllowed } = useFeatureFlags();

  const getFilteredCategoriesList = () => {
    return getFilteredCategories(CATEGORIES);
  };

  const canAccessSection = (section: string) => {
    return isSectionAllowed(section);
  };

  const getBlockedSections = () => {
    const { blockedSections } = useFeatureFlags().getScope();
    return blockedSections;
  };

  return {
    getFilteredCategoriesList,
    canAccessSection,
    getBlockedSections
  };
};
