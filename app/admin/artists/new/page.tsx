import ArtistForm from '@/features/artists/ArtistForm';

/* =====================================================================
 * GOAL: Render the page for creating a completely new artist. 
 * This is a Server Component that simply acts as a layout wrapper 
 * for our Client Component form.
 * ===================================================================== */

export default function NewArtistPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500">
          Add New Artist
        </h1>
        <p className="text-vaporMuted mt-2">
          Create a new artist profile to associate with items in the catalog.
        </p>
      </div>

      {/* Render the form without an ID, triggering "Create Mode" */}
      <ArtistForm />
    </div>
  );
}