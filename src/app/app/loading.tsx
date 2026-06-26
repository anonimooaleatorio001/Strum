export default function Loading() {
  return (
    <div className="mx-auto max-w-2xl animate-pulse">
      <div className="h-7 w-40 rounded-lg bg-forest/10" />
      <div className="mt-2 h-4 w-28 rounded bg-forest/10" />
      <div className="mt-5 h-36 rounded-3xl bg-forest/10" />
      <div className="mt-3 h-11 rounded-full bg-forest/10" />
      <div className="mt-4 flex gap-2">
        {[64, 72, 80, 88].map((w) => (
          <div key={w} className="h-9 rounded-full bg-forest/10" style={{ width: w }} />
        ))}
      </div>
    </div>
  );
}
