'use client';

import React from 'react';
import { useItemTypes } from '@/hooks/useItemTypes';

interface ItemTypeSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  // We omit children since this component populates its own options
}

export default function ItemTypeSelect(props: ItemTypeSelectProps) {
  const { itemTypes, loading } = useItemTypes();

  return (
    <select {...props} disabled={loading || props.disabled}>
      {loading ? (
        <option value="">Loading types...</option>
      ) : (
        itemTypes.map((type) => (
          <option key={type.value} value={type.value}>
            {type.label}
          </option>
        ))
      )}
    </select>
  );
}