import { Link } from "react-router-dom";
import { Heart, MessageCircle } from "lucide-react";
import { useStore } from "../store/useStore";
import type { Property } from "../types";

interface PropertyCardProps {
  property: Property;
  commentCount: number;
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(price);
}

export default function PropertyCard({ property, commentCount }: PropertyCardProps) {
  const userId = useStore((state) => state.user?.id);
  const likes = useStore((state) => state.likes);
  const toggleLike = useStore((state) => state.toggleLike);

  const likeCount = likes.filter((like) => like.propertyId === property.id).length;
  const isLiked = Boolean(
    userId && likes.some((like) => like.propertyId === property.id && like.userId === userId)
  );

  return (
    <article className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md md:rounded-2xl md:hover:-translate-y-1 md:hover:shadow-xl">
      {/* Image Wrapper Block */}
      <div className="relative aspect-[4/3] w-full overflow-hidden md:h-56 md:aspect-auto">
        <img
          src={property.image}
          alt={property.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />
        
        {/* Type Badge */}
        <div className="absolute left-2 top-2 rounded bg-white/95 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-brand-700 backdrop-blur-sm sm:left-4 sm:top-4 sm:rounded-full sm:px-3 sm:py-1 sm:text-xs">
          {property.type}
        </div>

        {/* Responsive Interaction Action Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault(); // Stop link routing action on click
            toggleLike(property.id);
          }}
          className={`absolute right-2 top-2 flex items-center justify-center rounded-lg p-1.5 text-xs font-semibold shadow transition sm:right-4 sm:top-4 sm:rounded-full sm:px-3 sm:py-2 md:text-sm ${
            isLiked ? "bg-rose-500 text-white" : "bg-white/95 text-slate-700 hover:bg-rose-50"
          }`}
        >
          <Heart size={14} className={`sm:size-4 ${isLiked ? "fill-white" : ""}`} />
          <span className="ml-1 text-[11px] sm:text-xs">
            {likeCount}
          </span>
        </button>
      </div>

      {/* Main Content Info Block */}
      <Link to={`/property/${property.id}`} className="block p-3 sm:p-4 md:p-5">
        <div className="min-w-0">
          <h3 className="truncate text-xs font-bold text-slate-900 sm:text-sm md:text-lg">
            {property.title}
          </h3>
          <p className="mt-0.5 truncate text-[10px] text-slate-500 sm:text-xs md:text-sm">
            📍 {property.location}
          </p>
          <p className="mt-2 text-sm font-extrabold text-brand-600 sm:text-base md:mt-3 md:text-2xl md:text-slate-900">
            {formatPrice(property.price)}
          </p>
        </div>

        {/* Footer Meta Strip */}
        <div className="mt-3 flex items-center justify-between gap-2 border-t border-slate-100 pt-2.5 md:mt-4 md:pt-4">
          <span className="flex items-center gap-1 text-[10px] font-medium text-slate-500 sm:text-xs">
            <MessageCircle size={12} className="text-slate-400 sm:size-4" />
            <span>{commentCount} <span className="hidden sm:inline">comments</span></span>
          </span>
          
          {/* Action text button visible on desktop size variations exclusively */}
          <span className="hidden rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition group-hover:bg-brand-700 sm:inline-block">
            View Details
          </span>
        </div>
      </Link>
    </article>
  );
}
