
import Image from 'next/image';

interface VaultHeaderProps {
  username: string;
  uniqueCount: number;
  dateStarted: string;
  bannerUrl?: string | null;
}

export default function VaultHeader({ username, uniqueCount, dateStarted, bannerUrl }: VaultHeaderProps) {
  return (
    <div className="relative w-full h-64 md:h-80 bg-vaporCard border-b-4 border-pink-500 overflow-hidden shadow-[0_4px_20px_rgba(236,72,153,0.3)]">
      {/* Banner Background */}
      {bannerUrl ? (
        <Image 
          src={bannerUrl} 
          alt={`${username}'s banner`} 
          fill 
          className="object-cover opacity-60"
        />
      ) : (
        /* Fallback Vaporwave Gradient Banner */
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900 via-pink-900 to-cyan-900 opacity-60" />
      )}

      {/* Info Overlay at the bottom of the banner */}
      <div className="absolute bottom-0 left-0 w-full p-6 flex flex-col md:flex-row justify-between items-end bg-gradient-to-t from-gray-950 to-transparent">
        
        {/* Name & Start Date */}
        <div>
          <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-cyan-400 drop-shadow-[0_0_15px_rgba(236,72,153,0.8)] tracking-wider">
            {username}
          </h1>
          <p className="text-cyan-200 mt-2 text-sm uppercase tracking-widest font-semibold">
            Started Collecting: <span className="text-vaporText">{new Date(dateStarted).toLocaleDateString()}</span>
          </p>
        </div>

        {/* Unique Items Badge */}
        <div className="mt-4 md:mt-0 text-right bg-vaporBg/80 p-4 border-2 border-cyan-500 rounded-lg shadow-[4px_4px_0px_0px_rgba(6,182,212,1)]">
          <span className="block text-4xl font-black text-vaporPink">{uniqueCount}</span>
          <span className="text-xs text-vaporCyan uppercase tracking-widest">Unique Items</span>
        </div>

      </div>
    </div>
  );
}