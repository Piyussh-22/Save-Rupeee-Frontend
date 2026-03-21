import { Plus } from "lucide-react";

export default function FABButton({ onClick }) {
  return (
    <div className="fixed bottom-24 left-0 right-0 z-40 flex justify-center pointer-events-none">
      <button
        type="button"
        onClick={onClick}
        className="pointer-events-auto flex items-center gap-2 bg-zinc-800 dark:bg-white text-white dark:text-zinc-900 px-6 py-3 rounded-full font-semibold text-sm cursor-pointer active:scale-95 hover:scale-105 transition-all 
        shadow-[0_4px_20px_rgba(0,0,0,0.25)]
        dark:shadow-[0_4px_20px_rgba(255,255,255,0.15)]
        hover:shadow-[0_6px_28px_rgba(0,0,0,0.35)]
        dark:hover:shadow-[0_6px_28px_rgba(255,255,255,0.25)]
        ring-1 ring-white/10 dark:ring-black/10"
      >
        <Plus size={18} strokeWidth={2.5} />
        Add Transaction
      </button>
    </div>
  );
}
