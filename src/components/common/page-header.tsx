interface PageHeaderProps {
  marqueeLabel?: string;
  title: string;
}

export function PageHeader({ marqueeLabel, title }: PageHeaderProps) {
  return (
    <header className="bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800">
      <div className="container mx-auto px-4 py-8">
        {marqueeLabel && (
          <div className="mb-4 text-sm font-medium text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
            {marqueeLabel}
          </div>
        )}
        <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white">
          {title}
        </h1>
      </div>
    </header>
  );
}
