// frontend/src/components/SystemRequirements.tsx

import React, { useState } from 'react';
import { SystemRequirements as SystemReq } from '../types';
import { Monitor, Cpu, HardDrive, MemoryStick, Gpu } from 'lucide-react';

interface SystemRequirementsProps {
  requirements: SystemReq;
}

const SystemRequirements: React.FC<SystemRequirementsProps> = ({ requirements }) => {
  const [activeTab, setActiveTab] = useState<'minimum' | 'recommended'>('minimum');

  const specs = activeTab === 'minimum'
    ? {
        os: requirements.minOS,
        processor: requirements.minProcessor,
        ram: requirements.minRAM,
        storage: requirements.minStorage,
        graphics: requirements.minGraphics,
      }
    : {
        os: requirements.recOS,
        processor: requirements.recProcessor,
        ram: requirements.recRAM,
        storage: requirements.recStorage,
        graphics: requirements.recGraphics,
      };

  const SpecItem = ({ icon: Icon, label, value }: { icon: any; label: string; value: string }) => (
    <div className="flex gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <div className="flex-shrink-0">
        <Icon className="w-6 h-6 text-blue-600" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-gray-600 mb-1">{label}</p>
        <p className="text-gray-800">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
        <h3 className="text-2xl font-bold text-white">System Requirements</h3>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('minimum')}
          className={`flex-1 px-6 py-3 font-semibold transition-colors ${
            activeTab === 'minimum'
              ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
              : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
          }`}
        >
          Minimum
        </button>
        <button
          onClick={() => setActiveTab('recommended')}
          className={`flex-1 px-6 py-3 font-semibold transition-colors ${
            activeTab === 'recommended'
              ? 'bg-green-50 text-green-600 border-b-2 border-green-600'
              : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
          }`}
        >
          Recommended
        </button>
      </div>

      {/* Requirements Content */}
      <div className="p-6">
        <div className="space-y-3">
          <SpecItem icon={Monitor} label="Operating System" value={specs.os} />
          <SpecItem icon={Cpu} label="Processor" value={specs.processor} />
          <SpecItem icon={MemoryStick} label="Memory (RAM)" value={specs.ram} />
          <SpecItem icon={HardDrive} label="Storage" value={specs.storage} />
          <SpecItem icon={Gpu} label="Graphics Card" value={specs.graphics} />
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Note:</span>{' '}
            {activeTab === 'minimum'
              ? 'These are the minimum requirements to run the game. Performance may vary.'
              : 'These specifications are recommended for optimal gaming experience.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SystemRequirements;