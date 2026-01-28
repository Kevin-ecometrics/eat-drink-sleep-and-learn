import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'EDS - Eat.Drink.Sleep.and.Learn';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#fff',
          backgroundImage: 'linear-gradient(to bottom right, #f9fafb, #ffffff, #f3f4f6)',
        }}
      >
        {/* Logo SVG */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 40,
          }}
        >
          <svg
            width="180"
            height="85"
            viewBox="0 0 63.45 29.79"
            style={{
              filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.1))',
            }}
          >
            <path
              fill="#2563eb"
              d="M0.06,2.22c-0.28-0.96,0.47-2.45,2.16-2.19c6.75,1.1,23.93,4.55,30.9,5.75c1.76,0.45,2.13,1.18,2.25,1.56c0.88,4.01,0.87,5.24,1.28,6.35s1.15,1.34,3.04,1.35c2.83,0,17.96,0.08,21.25,0.18c2.36,0.07,2.71,1.1,2.44,2.6c-0.1,0.53-0.7,3.66-0.99,5.26c-0.18,1-0.84,1.61-1.83,1.81l-20.4,4.86c-0.89,0.15-2.12-0.09-2.45-1.56c-0.51-2.22-1.16-5.43-1.53-7.04c-0.44-1.92-1.12-2.51-3.06-2.49c-5.06,0.08-21.76,1.29-23.73,1.31c-2.04,0.03-3.82-0.28-4.6-2.76C4.15,15.16,0.06,2.22,0.06,2.22"
            />
          </svg>
        </div>

        {/* Texto "Hola" */}
        <div
          style={{
            fontSize: 120,
            fontWeight: 'bold',
            background: 'linear-gradient(to bottom right, #2563eb, #7c3aed)',
            backgroundClip: 'text',
            color: 'transparent',
            marginBottom: 20,
          }}
        >
          Hello
        </div>

        {/* Subtítulo */}
        <div
          style={{
            fontSize: 40,
            color: '#6b7280',
            fontWeight: '500',
            textAlign: 'center',
            maxWidth: 900,
          }}
        >
          Eat.Drink.Sleep.and.Learn
        </div>

        {/* Descripción */}
        <div
          style={{
            fontSize: 24,
            color: '#9ca3af',
            marginTop: 20,
            textAlign: 'center',
            maxWidth: 800,
          }}
        >
          A community platform for sharing and discovering
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}