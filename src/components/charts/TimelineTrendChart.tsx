import React, { useState } from 'react';
import { TimelinePoint } from '../../utils/calculations';
import { formatINR } from '../../utils/formatters';

interface TimelineTrendChartProps {
  points: TimelinePoint[];
}

export const TimelineTrendChart: React.FC<TimelineTrendChartProps> = ({ points }) => {
  const [hoveredPoint, setHoveredPoint] = useState<TimelinePoint | null>(null);

  if (points.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-slate-400">
        <p className="text-xs">No timeline data available yet</p>
      </div>
    );
  }

  // Take up to 12 most recent dates for clear bar spacing
  const displayPoints = points.slice(-12);
  const maxTotal = Math.max(...displayPoints.map((p) => p.total), 1);

  return (
    <div className="space-y-3">
      {hoveredPoint && (
        <div className="flex items-center justify-between text-xs px-3 py-1.5 bg-slate-100 rounded-lg">
          <span className="font-medium text-slate-700">{hoveredPoint.label}</span>
          <span className="font-semibold text-slate-900 font-mono-numbers">
            {formatINR(hoveredPoint.total)} ({hoveredPoint.count}{' '}
            {hoveredPoint.count === 1 ? 'transaction' : 'transactions'})
          </span>
        </div>
      )}

      {/* Responsive Bar Grid */}
      <div className="h-44 w-full flex items-end gap-2 pt-6 pb-2 px-1 border-b border-slate-200">
        {displayPoints.map((pt) => {
          const heightPercent = Math.max((pt.total / maxTotal) * 100, 6);
          const isHovered = hoveredPoint?.dateKey === pt.dateKey;

          return (
            <div
              key={pt.dateKey}
              className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
              onMouseEnter={() => setHoveredPoint(pt)}
              onMouseLeave={() => setHoveredPoint(null)}
            >
              <div
                className={`w-full max-w-[36px] rounded-t-md transition-all duration-200 ${
                  isHovered ? 'bg-emerald-600' : 'bg-slate-700 hover:bg-slate-900'
                }`}
                style={{ height: `${heightPercent}%` }}
              />
              <span className="text-[10px] text-slate-500 mt-2 truncate w-full text-center">
                {pt.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
