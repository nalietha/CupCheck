import VaultItemCard from './VaultItemCard';
import { VaultItem } from '@/types';

interface VaultDisplayShelfProps {
  title: string;
  items: VaultItem[];
  emptyMessage?: string;
}

export default function VaultDisplayShelf({ 
  title, 
  items, 
  emptyMessage = "This section of the vault is empty." 
}: VaultDisplayShelfProps) {
  return (
    <div className="mb-12">
      {/* Vault-Centric Header */}
      <div className="flex items-center mb-6">
        <h2 className="text-2xl font-black text-vaporCyan uppercase tracking-widest drop-shadow-[0_0_10px_rgba(1,205,254,0.3)]">
          {title}
        </h2>
        <div className="ml-4 flex-grow h-px bg-gradient-to-r from-vaporCyan to-transparent opacity-50"></div>
      </div>

      {/* The Vault Shelf Display */}
      {items.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 pb-6 border-b-[8px] border-vaporCard rounded-b">
          {items.map((item) => (
            <div key={item.record_id || item.id} className="flex justify-center transition-transform hover:-translate-y-2 w-full">
              <VaultItemCard item={item} />
            </div>
          ))}
        </div>
      ) : (
        <div className="w-full py-12 text-center border-b-[8px] border-vaporCard rounded-b bg-vaporCard/20">
          <p className="text-vaporMuted font-mono text-sm">{emptyMessage}</p>
        </div>
      )}
    </div>
  );
}