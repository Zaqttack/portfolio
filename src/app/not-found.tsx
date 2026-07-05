export default function NotFound() {
  return (
    <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: '12px' }}>
      <div style={{ fontWeight: 700, fontSize: '96px', letterSpacing: '-.04em', lineHeight: 1 }}>404</div>
      <div style={{ fontSize: '18px', color: 'var(--text-2)' }}>Page not found</div>
    </main>
  );
}
