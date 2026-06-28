'use server';

export async function scrapeArtistProfile(url: string) {
  console.log(`[Scraper] Starting scrape for: ${url}`);
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Discordbot/2.0; +https://discordapp.com)',
        'Accept': 'text/html',
      },
      // Cache must be disabled so we don't get stale data
      cache: 'no-store' 
    });

    console.log(`[Scraper] Response Status: ${response.status}`);
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    
    const html = await response.text();
    console.log(`[Scraper] Downloaded ${html.length} characters of HTML.`);
    
    let imageUrl = '';
    const links: { platform: string; url: string }[] = [];

    // 1. Universal og:image extraction
    const ogImageMatch = html.match(/<meta\s+(?:property|name)="og:image"\s+content="([^"]+)"/i);
    if (ogImageMatch && ogImageMatch[1]) {
      imageUrl = ogImageMatch[1];
      console.log(`[Scraper] Found OG Image: ${imageUrl}`);
    }

    // 2. Linktree specific extraction
    if (url.includes('linktr.ee')) {
      const nextDataMatch = html.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/);
      
      if (nextDataMatch && nextDataMatch[1]) {
        console.log(`[Scraper] Found Linktree NEXT_DATA JSON block.`);
        try {
          const nextData = JSON.parse(nextDataMatch[1]);
          const treeLinks = nextData.props?.pageProps?.account?.links || [];
          
          treeLinks.forEach((link: any) => {
            if (link.url) {
              links.push({ platform: detectPlatform(link.url), url: link.url });
            }
          });
        } catch (e) {
          console.error(`[Scraper] Failed to parse Linktree JSON.`, e);
        }
      } else {
        console.log(`[Scraper] No NEXT_DATA block found. Attempting fallback link extraction...`);
        // Fallback: Just grab all hrefs from standard anchor tags
        const aTags = html.matchAll(/<a[^>]+href="([^"]+)"[^>]*>/gi);
        for (const match of aTags) {
          const href = match[1];
          // Filter out internal linktree links or junk
          if (href.startsWith('http') && !href.includes('linktr.ee')) {
             links.push({ platform: detectPlatform(href), url: href });
          }
        }
      }
    }

    // Remove duplicates from links array
    const uniqueLinks = Array.from(new Map(links.map(item => [item.url, item])).values());
    
    console.log(`[Scraper] Finished. Found ${uniqueLinks.length} links.`);
    return { success: true, imageUrl, links: uniqueLinks };
    
  } catch (error: any) {
    console.error('[Scraper] Critical Error:', error.message);
    return { success: false, error: error.message };
  }
}

// Helper function to figure out the platform from the URL
function detectPlatform(url: string) {
  const lowerUrl = url.toLowerCase();
  if (lowerUrl.includes('twitter.com') || lowerUrl.includes('x.com')) return 'Twitter / X';
  if (lowerUrl.includes('instagram.com')) return 'Instagram';
  if (lowerUrl.includes('twitch.tv')) return 'Twitch';
  if (lowerUrl.includes('youtube.com')) return 'YouTube';
  if (lowerUrl.includes('pixiv.net')) return 'Pixiv';
  if (lowerUrl.includes('patreon.com')) return 'Patreon';
  if (lowerUrl.includes('bsky.app')) return 'BlueSky';
  return 'Custom';
}

export async function scrapeGamersuppsProduct(url: string) {
  console.log(`[GS Scraper] Starting fetch for: ${url}`);
  try {
    // 1. Clean the URL and append Shopify's JSON endpoint extension
    const cleanUrl = url.split('?')[0]; 
    const jsonUrl = cleanUrl.endsWith('.js') ? cleanUrl : `${cleanUrl}.js`;

    const response = await fetch(jsonUrl, { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

    const product = await response.json();
    console.log(`[GS Scraper] Successfully retrieved data for: ${product.title}`);

    // 2. Format the price (Shopify returns price in cents, e.g. 2499 -> 24.99)
    const price = product.price ? (product.price / 100).toFixed(2) : '';

    // 3. Strip HTML tags from the description to keep it clean
    const cleanDescription = product.description
      ? product.description
          .replace(/<br\s*\/?>/gi, '\n') // Convert breaks to newlines
          .replace(/<[^>]*>?/gm, '')     // Strip all other HTML tags
          .replace(/\n\s*\n/g, '\n\n')   // Clean up excessive whitespace
          .trim()
      : '';

    // 4. Format Image URLs (Shopify omits the protocol 'https:' in their JSON)
    const images = (product.images || []).map((img: string) => {
      if (img.startsWith('//')) return `https:${img}`;
      return img;
    });

    // 5. Attempt to automatically detect the item type based on title/tags
    let itemType = 'cup';
    const titleLower = (product.title || '').toLowerCase();
    const typeLower = (product.type || '').toLowerCase();
    
    if (titleLower.includes('tub') || typeLower.includes('energy')) itemType = 'tub';
    else if (titleLower.includes('shirt') || typeLower.includes('apparel') || typeLower.includes('hoodie')) itemType = 'shirt';
    else if (titleLower.includes('jug')) itemType = 'merch';
    else if (titleLower.includes('sleeve') || titleLower.includes('mousepad') || titleLower.includes('mat')) itemType = 'merch';

    return {
      success: true,
      data: {
        name: product.title,
        retail_price: price,
        description: cleanDescription,
        tags: product.tags || [],
        item_type: itemType,
        images: images
      }
    };

  } catch (error: any) {
    console.error('[GS Scraper] Critical Error:', error.message);
    return { success: false, error: error.message };
  }
}