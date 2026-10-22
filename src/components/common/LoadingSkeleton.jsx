import React from 'react';

export const ProductCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm animate-pulse flex flex-col justify-between">
      <div>
        <div className="w-full aspect-square bg-slate-200 rounded-xl mb-4"></div>
        <div className="h-4 bg-slate-200 rounded w-1/3 mb-2"></div>
        <div className="h-5 bg-slate-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-slate-200 rounded w-full mb-3"></div>
      </div>
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
        <div className="h-6 bg-slate-200 rounded w-20"></div>
        <div className="h-9 bg-slate-200 rounded-lg w-24"></div>
      </div>
    </div>
  );
};

export const TableRowSkeleton = ({ cols = 5 }) => {
  return (
    <tr className="animate-pulse border-b border-slate-100">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="py-4 px-4">
          <div className="h-4 bg-slate-200 rounded w-4/5"></div>
        </td>
      ))}
    </tr>
  );
};
