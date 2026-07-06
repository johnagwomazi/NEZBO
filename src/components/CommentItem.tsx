import type { Comment } from "../types";

interface CommentItemProps {
  comment: Comment;
}

export default function CommentItem({ comment }: CommentItemProps) {
  const date = new Date(comment.createdAt);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="font-semibold text-slate-900">{comment.user}</p>
        <p className="text-[11px] text-slate-500 sm:text-xs">
          {date.toLocaleDateString()}
        </p>
      </div>
      <p className="mt-2 text-sm leading-6 text-slate-600">{comment.text}</p>
    </div>
  );
}
