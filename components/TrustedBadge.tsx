"use client";

import { Shield, Star } from "lucide-react";

export default function TrustedBadge({ isRTL = true }: { isRTL?: boolean }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-200">
      <Shield className="w-3 h-3" />
      <span>{isRTL ? 'موثوق' : 'Trusted'}</span>
    </span>
  );
}


