'use client';

interface AdminItemImageManagerProps {
  itemImages: any[];
  setItemImages: React.Dispatch<React.SetStateAction<any[]>>;
}

export default function AdminItemImageManager({ itemImages, setItemImages }: AdminItemImageManagerProps) {
  
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    
    const newImages = files.map((file, idx) => ({
      file,
      url: URL.createObjectURL(file), // Local preview URL
      display_order: itemImages.length + idx,
      isNew: true
    }));

    setItemImages([...itemImages, ...newImages]);
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    const newImages = [...itemImages];
    if (direction === 'up' && index > 0) {
      [newImages[index - 1], newImages[index]] = [newImages[index], newImages[index - 1]];
    } else if (direction === 'down' && index < newImages.length - 1) {
      [newImages[index + 1], newImages[index]] = [newImages[index], newImages[index + 1]];
    }
    // Re-assign display_order based on new array index
    newImages.forEach((img, idx) => img.display_order = idx);
    setItemImages(newImages);
  };

  const removeImage = (index: number) => {
    const newImages = [...itemImages];
    newImages.splice(index, 1);
    newImages.forEach((img, idx) => img.display_order = idx);
    setItemImages(newImages);
  };

  return (
    <div className="w-full xl:w-1/4 flex flex-col gap-4">
      <h2 className="text-xl font-bold text-neonBlue mb-4 uppercase tracking-widest">Image Details</h2>
      
      <div className="bg-gray-900 p-5 rounded-xl border border-gray-800">
        <label className="block text-sm font-medium text-gray-400 mb-2">Upload New Images</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageSelect}
          className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-neonBlue/10 file:text-neonBlue hover:file:bg-neonBlue/20 transition-all cursor-pointer"
        />
      </div>

      <div className="space-y-3 flex-grow">
        {itemImages.length === 0 ? (
          <div className="bg-gray-900/50 p-6 rounded-xl border border-dashed border-gray-700 text-center text-gray-500 text-sm">
            No images added yet. The first image will be primary, the second will be the hover swap.
          </div>
        ) : (
          itemImages.map((img, index) => (
            <div key={index} className="flex items-center gap-3 bg-gray-900 p-2 rounded-xl border border-gray-800">
              <img src={img.url} alt={`Preview ${index}`} className="w-16 h-16 object-cover rounded-lg bg-black" />
              
              <div className="flex-grow">
                <p className="text-sm font-bold text-white">
                  {index === 0 ? 'Primary' : index === 1 ? 'Hover Swap' : `Extra ${index + 1}`}
                </p>
                <p className="text-xs text-gray-500 font-mono">Order: {index}</p>
              </div>

              <div className="flex flex-col gap-1 pr-2">
                <button type="button" onClick={() => moveImage(index, 'up')} disabled={index === 0} className="text-gray-500 hover:text-white disabled:opacity-30">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                </button>
                <button type="button" onClick={() => moveImage(index, 'down')} disabled={index === itemImages.length - 1} className="text-gray-500 hover:text-white disabled:opacity-30">
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
              </div>

              <button type="button" onClick={() => removeImage(index)} className="p-2 text-red-500 hover:bg-red-500/20 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}