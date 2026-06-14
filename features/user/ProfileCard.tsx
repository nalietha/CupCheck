import Link from 'next/link';

interface ProfileCardProps {
  username: string;
  itemCount: number;
}

export default function ProfileCard({ username, itemCount }: ProfileCardProps) {
  return (
    <Link href={`/vault/${username}`} className="block p-6 bg-gray-900 border border-purple-500/30 rounded-lg hover:border-purple-500 transition-all">
      <h3 className="text-xl font-bold text-white">{username}</h3>
      <p className="text-gray-400">Vault Size: {itemCount} items</p>
      <div className="mt-4 text-pink-500 font-semibold underline">View Vault</div>
    </Link>
  );
}