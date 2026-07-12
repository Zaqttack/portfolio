'use client';

import { useState } from 'react';
import type { ProjectImage } from '@/types';

export default function ProjectImageCarousel({ images }: { images: ProjectImage[] }) {
  const [idx, setIdx] = useState(0);

  if (images.length === 0) return null;

  const img = images[idx];

  const prev = () => setIdx((i) => Math.max(0, i - 1));
  const next = () => setIdx((i) => Math.min(images.length - 1, i + 1));

  return (
    <div style={{ marginBottom: '36px' }}>
      <div
        style={{
          position: 'relative',
          borderRadius: '10px',
          overflow: 'hidden',
          border: '1px solid var(--border-2)',
          background: 'var(--bg-panel)',
        }}
      >
        <img
          key={img.url}
          src={img.url}
          alt={img.caption ?? ''}
          style={{ display: 'block', width: '100%', maxHeight: '480px', objectFit: 'contain' }}
        />

        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              disabled={idx === 0}
              aria-label="Previous image"
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(0,0,0,.55)',
                border: 'none',
                borderRadius: '50%',
                width: '34px',
                height: '34px',
                cursor: idx === 0 ? 'default' : 'pointer',
                opacity: idx === 0 ? 0.3 : 1,
                color: '#fff',
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'opacity .2s',
              }}
            >
              ←
            </button>
            <button
              onClick={next}
              disabled={idx === images.length - 1}
              aria-label="Next image"
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(0,0,0,.55)',
                border: 'none',
                borderRadius: '50%',
                width: '34px',
                height: '34px',
                cursor: idx === images.length - 1 ? 'default' : 'pointer',
                opacity: idx === images.length - 1 ? 0.3 : 1,
                color: '#fff',
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'opacity .2s',
              }}
            >
              →
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '6px',
            marginTop: '10px',
          }}
        >
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              aria-label={`Image ${i + 1}`}
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                background: i === idx ? 'var(--accent)' : 'var(--border-3)',
                transition: 'background .2s',
              }}
            />
          ))}
        </div>
      )}

      {img.caption && (
        <p
          style={{
            marginTop: '10px',
            font: '400 13px var(--font-space), sans-serif',
            color: 'var(--text-meta)',
            textAlign: 'center',
          }}
        >
          {img.caption}
        </p>
      )}
    </div>
  );
}
