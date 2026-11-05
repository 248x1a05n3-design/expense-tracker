import React, { useState } from 'react';
import { CategorySummary } from '../../types/expense';
import { formatINR } from '../../utils/formatters';

interface CategoryDonutChartProps {
  categories: CategorySummary[];
  totalAmount: number;
  size?: number;
}

export const CategoryDonutChart: React.FC<CategoryDonutChartProps> = ({
  categories,
  totalAmount,
  size = 240,
}) => {
  const [hoveredCategory, setHoveredCategory] = useState<CategorySummary | null>(null);

  // Filter categories with spending
  const activeCategories = categories.filter((c) => c.totalAmount > 0);

  if (activeCategories.length === 0 || totalAmount === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center text-slate-400 min-h-[220px]">
        <div className="w-24 h-24 rounded-full border-4 border-dashed border-slate-200 flex items-center justify-center text-xs text-slate-400">
          No Data
        </div>
        <p className="mt-3 text-xs text-slate-500">Record expenses to visualize distribution</p>
      </div>
    );
  }

  const strokeWidth = 32;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="#f1f5f9"
            strokeWidth={strokeWidth}
          />

          {activeCategories.map((cat) => {
            const fraction = cat.totalAmount / totalAmount;
            const strokeDasharray = `${fraction * circumference} ${circumference}`;
            const strokeDashoffset = -(accumulatedPercent * circumference);
            accumulatedPercent += fraction;

            const isHovered = hoveredCategory?.category === cat.category;

            return (
              <circle
                key={cat.category}
                cx={center}
                cy={center}
                r={radius}
                fill="transparent"
                stroke={cat.color}
                strokeWidth={isHovered ? strokeWidth + 6 : strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="butt"
                className="transition-all duration-200 cursor-pointer"
                onMouseEnter={() => setHoveredCategory(cat)}
                onMouseLeave={() => setHoveredCategory(null)}
              />
            );
          })}
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-4">
          {hoveredCategory ? (
            <>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider truncate max-w-[130px]">
                {hoveredCategory.category}
              </span>
              <span className="text-base font-bold text-slate-900 font-mono-numbers mt-0.5">
                {formatINR(hoveredCategory.totalAmount)}
              </span>
              <span className="text-xs font-semibold text-emerald-700 font-mono-numbers">
                {hoveredCategory.percentage}%
              </span>
            </>
          ) : (
            <>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Total
              </span>
              <span className="text-sm font-bold text-slate-900 font-mono-numbers mt-0.5 truncate max-w-[130px]">
                {formatINR(totalAmount)}
              </span>
              <span className="text-[10px] text-slate-500">
                {activeCategories.length} categories
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
