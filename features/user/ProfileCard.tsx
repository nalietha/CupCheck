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
      className="block p-6 bg-vaporCard border border-vaporBorder hover:border-vaporCyan transition-all shadow-neon group"
      style={{ borderRadius: 'var(--card-radius)' }}
    >
      <h3 className="text-xl font-bold text-vaporText group-hover:text-vaporCyan transition-colors truncate">@{title}</h3>
      <p className="text-vaporMuted mt-2 text-sm">Vault Size: <span className="font-bold text-vaporPink">{itemCount} items</span></p>
      <div className="mt-4 text-vaporCyan font-bold text-sm tracking-wider uppercase">View Vault &rarr;</div>
    </Link>
  );
}