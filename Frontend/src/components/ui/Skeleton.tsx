import React from 'react';

type SkeletonProps = {
  count?: number;
  className?: string;
  height?: string | number;
  lines?: number;
};

const Skeleton: React.FC<SkeletonProps> = ({ count = 1, className = '', height, lines = 1 }) => {
  const items = Array.from({ length: count });
  return (
    <div className={`space-y-4 ${className}`}>
      {items.map((_, i) => (
        <div key={i} className="animate-pulse">
          {lines === 1 ? (
            <div
              style={{ height }}
              className="w-full bg-gray-200 rounded"
            />
          ) : (
            <div className="space-y-2">
              {Array.from({ length: lines }).map((_, j) => (
                <div key={j} className={`h-3 bg-gray-200 rounded ${j === 0 ? 'w-3/4' : 'w-full'}`} />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Skeleton;
