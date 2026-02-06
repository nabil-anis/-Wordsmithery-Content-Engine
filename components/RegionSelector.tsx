
import React from 'react';
import { REGIONS } from '../types';

interface RegionSelectorProps {
  selected: string[];
  onChange: (regions: string[]) => void;
}

export const RegionSelector: React.FC<RegionSelectorProps> = ({ selected, onChange }) => {
  const toggleRegion = (region: string) => {
    if (selected.includes(region)) {
      onChange(selected.filter(r => r !== region));
    } else {
      onChange([...selected, region]);
    }
  };

  const isAllSelected = selected.length === REGIONS.length;

  const handleSelectAll = () => {
    if (isAllSelected) {
      onChange([]);
    } else {
      onChange([...REGIONS]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-end">
        <h3 className="text-sm font-semibold text-white/60 uppercase tracking-widest">Target Regions</h3>
        <button 
          onClick={handleSelectAll}
          className="text-[10px] font-bold uppercase tracking-[0.2em] text-purple-400 hover:text-purple-300 transition-colors"
        >
          {isAllSelected ? 'Deselect All' : 'Select All'}
        </button>
      </div>
      <div className="flex flex-wrap gap-3">
        {REGIONS.map((region) => (
          <button
            key={region}
            onClick={() => toggleRegion(region)}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold tracking-wider transition-all duration-300 border ${
              selected.includes(region)
                ? 'bg-white text-purple-900 border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]'
                : 'glass-card text-white/40 hover:text-white hover:border-white/20'
            }`}
          >
            {region}
          </button>
        ))}
      </div>
    </div>
  );
};
