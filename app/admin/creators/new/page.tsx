import CreatorForm from '@/features/creators/CreatorForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Add New Creator | Admin',
};

export default function NewCreatorPage() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-vaporText uppercase tracking-widest">
          Add New Creator
        </h1>
        <p className="text-vaporMuted mt-2">
          Create a new creator profile to link with items.
        </p>
      </div>

      <CreatorForm />
    </div>
  );
}