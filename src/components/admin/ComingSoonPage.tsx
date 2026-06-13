import React from "react";
import { LucideIcon } from "lucide-react";

interface ComingSoonPageProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

const ComingSoonPage: React.FC<ComingSoonPageProps> = ({
  title,
  description,
  icon: Icon,
}) => {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-600/10 ring-1 ring-white/[0.06]">
          <Icon className="h-7 w-7 text-emerald-400/60" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-white">
            {title}
          </h1>
          <p className="mt-1.5 max-w-md text-sm text-white/40">
            {description}
          </p>
        </div>
        <div className="mt-2 rounded-full bg-white/[0.04] px-4 py-1.5 text-xs font-medium text-white/25 ring-1 ring-white/[0.06]">
          Coming Soon
        </div>
      </div>
    </div>
  );
};

export default ComingSoonPage;
