// app/category/[slug]/page.js
import CategoryContent from '../../../components/CategoryContent';
import { CATEGORY_SLUGS } from '../../../constants/categories';

// Generate static params (required for static export)
export async function generateStaticParams() {
  return CATEGORY_SLUGS.map((slug) => ({ slug }));
}

// Server component — no 'use client' here
export default function CategoryPage({ params }) {
  return <CategoryContent slug={params.slug} />;
}
