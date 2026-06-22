export default function Loading() {
  return (
    <div className="min-h-screen bg-cinema-black flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 rounded-full border-2 border-brand-orange border-t-transparent animate-spin mx-auto" />
        <p className="text-ink-secondary text-sm">Loading...</p>
      </div>
    </div>
  );
}