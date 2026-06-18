import Link from 'next/link';

interface Props {
  featureName: string;
}

export default function NotImplemented({ featureName }: Props) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
      {/* Vaporwave Style Error Icon */}
      <div className="text-6xl mb-6 animate-pulse text-vaporPink">
        // 404
      </div>
      
      <h1 className="text-4xl font-black text-vaporText mb-4 uppercase tracking-widest">
        {featureName} Offline
      </h1>
      
      <p className="text-vaporMuted max-w-sm mb-8">
        This sector of the CupCheck database is currently under heavy maintenance. 
        Check back once the developers finish the next hotfix.
      </p>

      <Link 
        href="/" 
        className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-vaporText font-bold rounded-sm transition-all shadow-[4px_4px_0px_0px_rgba(236,72,153,1)]"
      >
        Return to Safety
      </Link>
    </div>
  );
}