import ContributeItemForm from '@/features/support/ContributeItemForm';
import Link from 'next/link';

export default function DataFixPage() {
  return (
    <main className="min-h-screen bg-black text-vaporText p-8 flex flex-col items-center">
      <div className="max-w-4xl w-full space-y-8">
        
        {/* Back Navigation */}
        <div>
          <Link href="/support" className="text-vaporCyan hover:text-vaporPink transition-colors font-bold tracking-wider text-sm uppercase">
            &larr; BACK TO SUPPORT
          </Link>
        </div>

        {/* Header Section */}
        <header className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold text-vaporCyan">Contribute Data</h1>
          <p className="text-gray-400">
            Help us expand the CupCheck database by submitting missing items or updating release dates.
          </p>
        </header>

        {/* The Actual Form Component */}
        <ContributeItemForm />

      </div>
    </main>
  );
}