import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import ArtistForm from '@/features/artists/ArtistForm';

/* =====================================================================
 * GOAL: Dynamic route for editing a specific artist.
 * 1. Catch the UUID from the URL params.
 * 2. Fetch the artist's current data from Supabase.
 * 3. Pass that data into the ArtistForm to trigger "Edit Mode".
 * ===================================================================== */

export default async function EditArtistPage({ params }: { params: { id: string } }) {
  
  // Fetch the target artist from the database
  const { data: artist, error } = await supabase
    .from('artists')
    .select('*')
    .eq('id', params.id)
    .single();

  // If the ID in the URL is fake or broken, show Next.js 404 page
  if (error || !artist) {
    notFound();
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white">
          Edit Artist: <span className="text-cyan-400">{artist.name}</span>
        </h1>
        <p className="text-gray-400 mt-2">
          Updating this artist's details will automatically update their name on every item they are attached to.
        </p>
      </div>

      {/* Render the form WITH an ID and Data, triggering "Edit Mode" */}
      <ArtistForm 
        artistId={artist.id} 
        initialData={{ name: artist.name }} 
      />
    </div>
  );
}