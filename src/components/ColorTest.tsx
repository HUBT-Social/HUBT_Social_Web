import React from 'react';

// Dữ liệu nhóm màu
const colorGroups: Record<string, Record<string, string>> = {
  'Primary': {
    'primary-100': 'bg-primary-100 text-on-primary',
    'primary-90': 'bg-primary-90 text-on-primary',
    'primary-80': 'bg-primary-80 text-on-primary',
    'primary-70': 'bg-primary-70 text-on-primary',
    'primary-60': 'bg-primary-60 text-on-primary',
    'primary-50': 'bg-primary-50 text-on-primary',
    'primary-40': 'bg-primary-40 text-on-primary',
    'primary-30': 'bg-primary-30 text-on-primary',
    'primary-20': 'bg-primary-20 text-on-primary',
    'primary-10': 'bg-primary-10 text-on-primary',
    'primary-container': 'bg-primary-container text-on-primary-container',
  },
  'Secondary': {
    'secondary-100': 'bg-secondary-100 text-on-secondary',
    'secondary-90': 'bg-secondary-90 text-on-secondary',
    'secondary-80': 'bg-secondary-80 text-on-secondary',
    'secondary-70': 'bg-secondary-70 text-on-secondary',
    'secondary-60': 'bg-secondary-60 text-on-secondary',
    'secondary-50': 'bg-secondary-50 text-on-secondary',
    'secondary-40': 'bg-secondary-40 text-on-secondary',
    'secondary-30': 'bg-secondary-30 text-on-secondary',
    'secondary-20': 'bg-secondary-20 text-on-secondary',
    'secondary-10': 'bg-secondary-10 text-on-secondary',
    'secondary-container': 'bg-secondary-container text-on-secondary-container',
  },
  'Tertiary': {
    'tertiary-100': 'bg-tertiary-100 text-on-tertiary',
    'tertiary-90': 'bg-tertiary-90 text-on-tertiary',
    'tertiary-80': 'bg-tertiary-80 text-on-tertiary',
    'tertiary-70': 'bg-tertiary-70 text-on-tertiary',
    'tertiary-60': 'bg-tertiary-60 text-on-tertiary',
    'tertiary-50': 'bg-tertiary-50 text-on-tertiary',
    'tertiary-40': 'bg-tertiary-40 text-on-tertiary',
    'tertiary-30': 'bg-tertiary-30 text-on-tertiary',
    'tertiary-20': 'bg-tertiary-20 text-on-tertiary',
    'tertiary-10': 'bg-tertiary-10 text-on-tertiary',
    'tertiary-container': 'bg-tertiary-container text-on-tertiary-container',
  },
  'Error': {
    'error-100': 'bg-error-100 text-on-error',
    'error-90': 'bg-error-90 text-on-error',
    'error-80': 'bg-error-80 text-on-error',
    'error-70': 'bg-error-70 text-on-error',
    'error-60': 'bg-error-60 text-on-error',
    'error-50': 'bg-error-50 text-on-error',
    'error-40': 'bg-error-40 text-on-error',
    'error-30': 'bg-error-30 text-on-error',
    'error-20': 'bg-error-20 text-on-error',
    'error-10': 'bg-error-10 text-on-error',
    'error-container': 'bg-error-container text-on-error-container',
  },
  'Surface': {
    'surface-100': 'bg-surface-100 text-on-surface',
    'surface-90': 'bg-surface-90 text-on-surface',
    'surface-80': 'bg-surface-80 text-on-surface',
    'surface-70': 'bg-surface-70 text-on-surface',
    'surface-60': 'bg-surface-60 text-on-surface',
    'surface-50': 'bg-surface-50 text-on-surface',
    'surface-40': 'bg-surface-40 text-on-surface',
    'surface-30': 'bg-surface-30 text-on-surface',
    'surface-20': 'bg-surface-20 text-on-surface',
    'surface-10': 'bg-surface-10 text-on-surface',
    'surface-plus-1': 'bg-surface-plus-1 text-on-surface',
    'surface-plus-2': 'bg-surface-plus-2 text-on-surface',
    'surface-plus-3': 'bg-surface-plus-3 text-on-surface',
    'surface-plus-4': 'bg-surface-plus-4 text-on-surface',
    'surface-plus-5': 'bg-surface-plus-5 text-on-surface',
  },
  'Neutral': {
    'neutral-100': 'bg-neutral-100 text-on-neutral',
    'neutral-90': 'bg-neutral-90 text-on-neutral',
    'neutral-80': 'bg-neutral-80 text-on-neutral',
    'neutral-70': 'bg-neutral-70 text-on-neutral',
    'neutral-60': 'bg-neutral-60 text-on-neutral',
    'neutral-50': 'bg-neutral-50 text-on-neutral',
    'neutral-40': 'bg-neutral-40 text-on-neutral',
    'neutral-30': 'bg-neutral-30 text-on-neutral',
    'neutral-20': 'bg-neutral-20 text-on-neutral',
    'neutral-10': 'bg-neutral-10 text-on-neutral',
  },
};

const ColorTestPage: React.FC = () => {
  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Kiểm tra Màu Sắc - 6 Nhóm Màu</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {Object.entries(colorGroups).map(([groupName, colors]) => (
          <div key={groupName}>
            <h2 className="text-lg font-semibold text-gray-700 mb-2 text-center">{groupName}</h2>
            <div className="space-y-1">
              {Object.entries(colors).map(([colorName, classNames]) => (
                <div
                  key={colorName}
                  className={`w-40 h-10 rounded flex items-center justify-center text-xs font-medium border ${classNames}`}
                >
                  {colorName}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ColorTestPage;
