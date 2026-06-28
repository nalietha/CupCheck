import SupportForm from '@/features/support/SupportForm';

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-black text-vaporText p-8 flex flex-col items-center">
      <div className="max-w-2xl w-full space-y-8">
        
        {/* Header Section */}
        <header className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold text-vaporCyan">Support Center</h1>
          <p className="text-gray-400">
            Encountered an issue or have a great idea? Let us know below.
          </p>
        </header>

        {/* The Form Component */}
        <SupportForm />

        {/* Footer/Info Section */}
        <div className="border-t border-gray-800 pt-6 text-center text-sm text-gray-500">
          <p>We typically respond within 24-48 hours.</p>
          <p>You can also reach us directly at <a href="mailto:Medusa.Studio@proton.me" className="text-vaporCyan hover:underline">Medusa.Studio@proton.me</a></p>
        </div>
      </div>
    </main>
  );
}