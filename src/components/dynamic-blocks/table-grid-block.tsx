import type { StrapiCommonTableGrid } from "@/types/strapi";

interface TableGridBlockProps {
  block: StrapiCommonTableGrid;
}

export function TableGridBlock({ block }: TableGridBlockProps) {
  const { caption, grid } = block;

  if (!grid?.cells?.length) {
    return null;
  }

  const [headerRow, ...bodyRows] = grid.cells;

  return (
    <section className="table-grid-block pb-10 lg:pb-20">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-l-polymath border border-black">
          {caption && (
            <caption className="mb-4 text-left heading-s-obviously">
              {caption}
            </caption>
          )}
          {headerRow && headerRow.length > 0 && (
            <thead>
              <tr className="border-b border-black">
                {headerRow.map((cell, i) => (
                  <th
                    key={i}
                    className="px-4 py-3 text-left text-polymath-display text-[12px]"
                  >
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          {bodyRows.length > 0 && (
            <tbody>
              {bodyRows.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="border-b border-black text-polymath text-[12px]"
                >
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="px-4 py-3">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
    </section>
  );
}
