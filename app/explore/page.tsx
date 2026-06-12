export default function ExplorePage() {
  return (
    <div className="min-h-screen bg-vaporBg text-vaporText font-sans pb-12">
      
      {/* 1. Navigation / Header area */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-vaporBg/80 border-b border-vaporBorder px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
            {/* Logo goes here */}
            <div className="w-10 h-10 bg-vaporCyan/20 rounded-full flex items-center justify-center border border-vaporCyan text-vaporCyan font-bold">CC</div>
            <h1 className="text-xl font-bold tracking-widest uppercase">CupCheck</h1>
        </div>
        <nav className="space-x-4 text-sm text-vaporMuted">
            <button className="text-vaporCyan hover:text-white transition-colors">Explore</button>
            <button className="hover:text-vaporPink transition-colors">My Collection</button>
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 mt-8 space-y-8">
        
        {/* 2. Hero & Search */}
        <div className="space-y-4">
          <h2 className="text-5xl font-extrabold bg-clip-text text-transparent bg-vapor-gradient">
            The Archive
          </h2>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search by waifu, creator, or season..."
              className="w-full md:w-1/2 bg-vaporCard border border-vaporBorder rounded-lg px-4 py-3 focus:outline-none focus:border-vaporPurple focus:ring-1 focus:ring-vaporPurple transition-all placeholder:text-vaporBorder"
            />
            <button className="bg-vaporCard border border-vaporBorder text-vaporText px-6 py-3 rounded-lg hover:border-vaporCyan transition-colors">
              Filters
            </button>
          </div>
        </div>

        {/* 3. The Cup Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
          
          {/* 4. Example Cup Card */}
          <div className="bg-vaporCard rounded-xl overflow-hidden border border-vaporBorder shadow-lg hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(1,205,254,0.15)] transition-all duration-300">
            {/* Image Area */}
            <div className="h-64 bg-[#0A0710] flex items-center justify-center p-4 relative group">
              <span className="text-vaporBorder italic group-hover:text-vaporCyan transition-colors">Cup Image Here</span>
              {/* Rare Badge */}
              <span className="absolute top-3 right-3 bg-vaporPurple/20 text-vaporPurple border border-vaporPurple/50 text-xs px-2 py-1 rounded">S4 Rare</span>
            </div>
            
            {/* Card Details */}
            <div className="p-5 space-y-4">
              <div>
                <h3 className="font-bold text-xl text-vaporCyan">Succubus</h3>
                <p className="text-sm text-vaporMuted">Season 4 • #S4.2</p>
              </div>
              
              <button className="w-full bg-vaporPink text-vaporBg font-bold py-2.5 rounded-md hover:bg-white hover:text-vaporPink transition-all shadow-[0_0_10px_rgba(255,113,206,0.4)] hover:shadow-[0_0_20px_rgba(255,113,206,0.8)]">
                + Add to Vault
              </button>
            </div>
          </div>
          
          {/* You would map() through your database results to render more of these cards! */}
          
        </div>
      </main>
    </div>
  );
}