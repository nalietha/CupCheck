import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get('user') || 'Unknown Collector';
    const uniqueCount = searchParams.get('count') || '0';

    // Returning a dynamic image response styled with your specific UI aesthetics
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            backgroundColor: '#110C1B', // VaporBg
            borderBottom: '16px solid #FF71CE', // VaporPink
            padding: '60px',
            fontFamily: 'sans-serif',
          }}
        >
          {/* Decorative Grid / Scanlines can be achieved with SVG backgrounds here */}
          
          <div style={{ display: 'flex', flexDirection: 'column', zIndex: 10 }}>
            <h1
              style={{
                fontSize: '80px',
                fontWeight: 900,
                fontStyle: 'italic',
                color: '#01CDFE', // VaporCyan
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                margin: 0,
              }}
            >
              {username}'s Vault
            </h1>
            
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginTop: '20px',
              }}
            >
              <span
                style={{
                  fontSize: '48px',
                  fontWeight: 900,
                  color: '#FF71CE', // VaporPink
                  marginRight: '16px',
                }}
              >
                {uniqueCount}
              </span>
              <span
                style={{
                  fontSize: '32px',
                  color: '#A594FD', // VaporMuted
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                }}
              >
                Unique Items Secured
              </span>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    return new Response('Failed to generate vault card', { status: 500 });
  }
}