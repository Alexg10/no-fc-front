interface ArticleCardBadgeProps {
  issueNumber: string | number;
  issueLabel: string;
}

export function ArticleCardBadge({
  issueNumber,
  issueLabel,
}: ArticleCardBadgeProps) {
  return (
    <div className="flex bg-white border border-black ">
      <span className="border-r border-black text-xl-obviously lg:text-[16px] px-[8px] p-[6px]">
        {issueLabel}
      </span>
      <span className=" text-black text-xl-obviously lg:text-[16px] p-[6px]">
        N°{issueNumber}
      </span>
    </div>
  );
}
