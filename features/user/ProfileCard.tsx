import Link from 'next/link';

interface ProfileCardProps {
  username: string;
  displayName?: string;
  itemCount: number;
}

export default function ProfileCard({ username, displayName, itemCount }: ProfileCardProps) {
  const title = displayName || username;

  return (
    <Link 
      href={`/vault/${username}`} 
      className="block p-4 md:p-6 bg-vaporCard border border-vaporBorder hover:border-vaporCyan transition-all shadow-neon group flex flex-col justify-between h-full"
      style={{ borderRadius: 'var(--card-radius)' }}
    >
      <div>
        <h3 className="text-lg md:text-xl font-bold text-vaporText group-hover:text-vaporCyan transition-colors truncate">@{title}</h3>
        <p className="text-vaporMuted mt-1 md:mt-2 text-xs md:text-sm">Vault: <span className="font-bold text-vaporPink">{itemCount} items</span></p>
      </div>
      <div className="mt-4 text-vaporCyan font-bold text-xs md:text-sm tracking-wider uppercase">View Vault &rarr;</div>
    </Link>
  );
}