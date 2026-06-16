import CreatorForm from '@/features/creators/CreatorForm';
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Creator | Admin',
};

export default async function EditCreatorPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;

  // Fetch the existing creator data
  const { data: creator, error } = await supabase
    .from('creators')
    .select('*')
    .eq('id', id)
    .single();

  // If there's an error or the creator doesn't exist, show a 404
  if (error || !creator) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white uppercase tracking-widest">
          Edit Creator:{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500">
            {creator.name}
          </span>
        </h1>
        <p className="text-gray-400 mt-2">
          Update the profile details, social links, and settings for this creator.
        </p>
      </div>

      {/* Pass the ID and the fetched data into the form */}
      <CreatorForm 
        creatorId={creator.id} 
        initialData={creator} 
      />
    </div>
  );
}