interface IssueNumberBadgeProps {
  issueNumber: string | number;
  issueLabel: string;
}

export function IssueNumberBadge({
  issueNumber,
  issueLabel,
}: IssueNumberBadgeProps) {
  return (
    <div className="bg-white border border-black text-black flex ">
      <p
        className={
          "text-xl-obviously p-4 pt-[14px] border-r border-black text-[16px]"
        }
      >
        {issueLabel}
      </p>
      <p className="text-xl-obviously p-4 pt-[14px] text-[16px]">
        N°{issueNumber}
      </p>
    </div>
  );
}
