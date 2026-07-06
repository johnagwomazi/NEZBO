import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  Heart,
  Hash,
  MapPin,
  MessageCircle,
} from "lucide-react";
import CommentItem from "../components/CommentItem";
import Navbar from "../components/Navbar";
import PropertyDetailSkeleton from "../components/PropertyDetailSkeleton";
import { getProperties } from "../services/propertyService";
import { useStore } from "../store/useStore";
import type { Property } from "../types";

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(price);
}

export default function PropertyDetail() {
  const params = useParams();
  const propertyId = Number(params.id);
  const properties = useStore((state) => state.properties);
  const comments = useStore((state) => state.comments);
  const likes = useStore((state) => state.likes);
  const loading = useStore((state) => state.loading);
  const setProperties = useStore((state) => state.setProperties);
  const setLoading = useStore((state) => state.setLoading);
  const addComment = useStore((state) => state.addComment);
  const toggleLike = useStore((state) => state.toggleLike);
  const userId = useStore((state) => state.user?.id);
  const [commentText, setCommentText] = useState("");
  const commentInputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (properties.length > 0) {
      return;
    }

    let active = true;

    async function loadData() {
      setLoading(true);
      const propertyData = await getProperties();

      if (active) {
        setProperties(propertyData);
        setLoading(false);
      }
    }

    loadData();

    return () => {
      active = false;
    };
  }, [propertyId, properties.length, setLoading, setProperties]);

  const property = useMemo(() => {
    return properties.find((item: Property) => item.id === propertyId) ?? null;
  }, [properties, propertyId]);

  const propertyComments = comments.filter(
    (comment) => comment.propertyId === propertyId
  );
  const likeCount = likes.filter((like) => like.propertyId === propertyId).length;
  const isLiked = Boolean(
    userId &&
      likes.some((like) => like.propertyId === propertyId && like.userId === userId)
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!commentText.trim()) {
      return;
    }

    addComment(propertyId, commentText.trim());
    setCommentText("");
  }

  function handleContactAgent() {
    if (!property) {
      return;
    }

    const subject = encodeURIComponent(`Inquiry about ${property.title}`);
    const body = encodeURIComponent(
      `Hi, I would like to know more about ${property.title} in ${property.location}.`
    );

    window.location.href = `mailto:agent@nobzo.com?subject=${subject}&body=${body}`;
  }

  const isPageLoading = loading || properties.length === 0;

  if (isPageLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <PropertyDetailSkeleton />
        </main>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-16 lg:px-8">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-10">
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Property not found
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base">
              This listing may have been removed or does not exist.
            </p>
            <Link
              to="/feed"
              className="mt-6 inline-flex items-center justify-center rounded-full bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Feed
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />
      <main className="mx-auto max-w-7xl px-0 pb-28 pt-0 sm:px-6 sm:py-8 lg:px-8 lg:py-8">
        <Link
          to="/feed"
         className="hidden lg:inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-brand-700 shadow-sm ring-1 ring-slate-200 backdrop-blur transition hover:text-brand-800"
        >
          <ArrowLeft size={16} />
          Back to Feed
        </Link>

        <div className="mt-4 mx-3 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm sm:mt-6">
          <div className="relative h-[360px] sm:h-[420px] lg:h-[500px]">
            <img
              src={property.image}
              alt={property.title}
              className="h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

            <div className="absolute inset-x-0 bottom-0 w-full p-5 sm:p-8 lg:p-12">
              <span className="inline-flex rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-white backdrop-blur sm:px-4 sm:py-2 sm:text-sm sm:normal-case sm:tracking-normal">
                {property.type}
              </span>

              <h1 className="mt-3 max-w-2xl text-2xl font-bold leading-tight text-white sm:mt-4 sm:text-3xl lg:text-5xl">
                {property.title}
              </h1>

              <p className="mt-2 flex items-center gap-2 text-sm text-white/90 sm:mt-3 sm:text-base lg:text-lg">
                <MapPin size={16} className="shrink-0" />
                <span className="truncate">{property.location}</span>
              </p>

              <p className="mt-3 text-3xl font-extrabold text-white sm:mt-5 sm:text-4xl">
                {formatPrice(property.price)}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 mx-4 grid grid-cols-2 gap-3 px-0 sm:mt-8 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {/* Likes Card */}
          <div className="w-full rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm sm:rounded-3xl sm:p-5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 sm:text-xs sm:tracking-[0.18em]">
              Likes
            </p>
            <div className="mt-2 flex items-center justify-between sm:mt-4">
              <p className="text-xl font-bold text-slate-900 sm:text-3xl">{likeCount}</p>
              <div className="rounded-xl bg-rose-50 p-2 sm:rounded-2xl sm:p-3">
                <Heart size={16} className="text-rose-500 sm:size-5" />
              </div>
            </div>
          </div>

          {/* Comments Card */}
          <div className="w-full rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm sm:rounded-3xl sm:p-5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 sm:text-xs sm:tracking-[0.18em]">
              Comments
            </p>
            <div className="mt-2 flex items-center justify-between sm:mt-4">
              <p className="text-xl font-bold text-slate-900 sm:text-3xl">
                {propertyComments.length}
              </p>
              <div className="rounded-xl bg-brand-50 p-2 sm:rounded-2xl sm:p-3">
                <MessageCircle size={16} className="text-brand-700" />
              </div>
            </div>
          </div>

          {/* Listing Type Card */}
          <div className="w-full rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm sm:rounded-3xl sm:p-5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 sm:text-xs sm:tracking-[0.18em]">
              Listing Type
            </p>
            <div className="mt-2 flex items-center justify-between sm:mt-4">
              <p className="truncate text-base font-bold capitalize text-slate-900 sm:text-2xl">
                {property.type}
              </p>
              <div className="rounded-xl bg-emerald-50 p-2 sm:rounded-2xl sm:p-3">
                <Building2 size={16} className="text-emerald-600" />
              </div>
            </div>
          </div>

          {/* Property ID Card */}
          <div className="w-full rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm sm:rounded-3xl sm:p-5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 sm:text-xs sm:tracking-[0.18em]">
              Property ID
            </p>
            <div className="mt-2 flex items-center justify-between sm:mt-4">
              <p className="truncate text-base font-bold text-slate-900 sm:text-2xl">{property.id}</p>
              <div className="rounded-xl bg-slate-100 p-2 sm:rounded-2xl sm:p-3">
                <Hash size={16} className="text-slate-500" />
              </div>
            </div>
          </div>
        </div>


        <div className="mt-4 grid gap-4 px-4 sm:mt-8 sm:gap-8 sm:px-0 lg:grid-cols-[2fr_1fr]">
  
  {/* Left Panel: Description and Comments */}
  <section className="space-y-4 sm:space-y-6">
    {/* Description Block */}
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:rounded-[2rem] sm:p-8">
      <h2 className="text-base font-bold text-slate-900 sm:text-2xl">
        Property Description
      </h2>
      <p className="mt-2 text-xs leading-6 text-slate-600 sm:mt-5 sm:text-base sm:leading-8">
        {property.description}
      </p>
    </div>

    {/* Comments Block */}
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:rounded-[2rem] sm:p-8">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-bold text-slate-900 sm:text-2xl">
          Comments ({propertyComments.length})
        </h2>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500 sm:px-3 sm:py-1 sm:text-xs">
          Add below
        </span>
      </div>

      {/* Optimized Form Field */}
      <form onSubmit={handleSubmit} className="mt-3 space-y-3 sm:mt-6">
        <textarea
          ref={commentInputRef}
          value={commentText}
          onChange={(event) => setCommentText(event.target.value)}
          rows={2}
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-100 sm:rounded-2xl sm:px-4 sm:py-3 md:rows={4}"
          placeholder="Write your comment..."
        />
        <button
          type="submit"
          className="inline-flex w-full items-center justify-center rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 sm:rounded-2xl sm:py-3 sm:text-base"
        >
          Post Comment
        </button>
      </form>

      {/* Comments List Block */}
      <div className="mt-4 space-y-2.5 sm:mt-6 sm:space-y-4">
        {propertyComments.length > 0 ? (
          propertyComments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))
        ) : (
          <p className="rounded-xl bg-slate-50 px-3 py-4 text-xs text-slate-500 sm:rounded-2xl sm:px-4 sm:py-5 sm:text-sm">
            No comments yet. Be the first to comment.
          </p>
        )}
      </div>
    </div>
  </section>

  {/* Right Sidebar Panel (Drops underneath gracefully on mobile variants instead of disappearing) */}
  <aside className="hidden lg:block lg:relative">
    <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:rounded-[2rem] sm:p-6 pb-24 md:pb-6">
      <h3 className="text-base font-bold text-slate-900 sm:text-xl">
        Engage With Listing
      </h3>
      <p className="mt-1 text-xs text-slate-500 sm:mt-2 sm:text-sm">
        Like this property or reach out to the agent when you are ready.
      </p>

      {/* Desktop Interaction Layout buttons */}
      <div className="mt-4 flex flex-col gap-2 sm:mt-6">
        <button
          type="button"
          onClick={() => toggleLike(property.id)}
          className={`w-full rounded-xl py-2.5 text-sm font-semibold transition sm:rounded-2xl sm:py-4 ${
            isLiked
              ? "bg-rose-500 text-white"
              : "bg-brand-600 text-white hover:bg-brand-700"
          }`}
        >
          <Heart size={14} className="mr-1.5 inline-block sm:size-4" />
          {isLiked ? "Liked" : "Like Property"}
        </button>

<button
  type="button"
  onClick={handleContactAgent}
  className="w-full rounded-xl bg-emerald-600 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-emerald-700 active:scale-[0.98] sm:rounded-2xl sm:py-4"
>
  Contact Agent
</button>

      </div>
    </div>
  </aside>

  {/* Floating Mobile Bottom Sticky Action Overlay Strip */}
  <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white px-4 py-3 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] md:hidden">
    <div className="flex gap-2">
      <button
        type="button"
        onClick={() => toggleLike(property.id)}
        className={`flex items-center justify-center rounded-xl p-3 border transition active:scale-[0.97] ${
          isLiked 
            ? "bg-rose-50 border-rose-200 text-rose-500" 
            : "bg-slate-50 border-slate-200 text-slate-600"
        }`}
      >
        <Heart size={20} className={isLiked ? "fill-rose-500" : ""} />
      </button>
      <button
        type="button"
        onClick={handleContactAgent}
        className="flex-1 rounded-xl bg-brand-600 py-3 text-center text-sm font-bold text-white transition active:scale-[0.97]"
      >
        Contact Agent
      </button>
    </div>
  </div>
</div>

      </main>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-4 py-3 shadow-[0_-10px_30px_rgba(15,23,42,0.08)] backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-7xl items-center gap-3">
          <button
            type="button"
            onClick={() => toggleLike(property.id)}
            className={`flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl px-4 text-sm font-semibold transition ${
              isLiked
                ? "bg-rose-500 text-white"
                : "bg-brand-600 text-white hover:bg-brand-700"
            }`}
          >
            <Heart size={16} fill={isLiked ? "currentColor" : "none"} />
            <span>{isLiked ? "Liked" : "Like"}</span>
          </button>

<button
  type="button"
  onClick={handleContactAgent}
  className="flex h-12 flex-[0.9] items-center justify-center gap-2 rounded-2xl bg-emerald-600 text-sm font-bold text-white shadow-sm transition-all hover:bg-emerald-700 active:scale-[0.98]"
>
  Contact Agent
</button>

        </div>
      </div>
    </div>
  );
}
