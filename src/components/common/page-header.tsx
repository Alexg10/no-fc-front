interface PageHeaderProps {
  marqueeLabel?: string;
  title: string;
}

export function PageHeader({ marqueeLabel, title }: PageHeaderProps) {
  return (
    <header className="bg-white border-b border-black text-black uppercase text-center ">
      <div className="container mx-auto px-4 py-8 pb-20">
        {marqueeLabel && (
          <div className="mb-4  tracking-wider">{marqueeLabel}</div>
        )}
        <h1 className="text-4xl md:text-5xl font-bold ">{title}</h1>
      </div>
    </header>
  );
}
