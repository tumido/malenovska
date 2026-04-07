"use client";

export const Loading = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="relative h-32 w-32">
        {/* Outer circle */}
        <div
          className="absolute inset-0 rounded-full border-4 border-t-transparent"
          style={{
            animation: "spin-loading 2s linear infinite, color-cycle 6s ease-in-out infinite",
          }}
        />
        {/* Middle circle */}
        <div
          className="absolute inset-4 rounded-full border-4 border-t-transparent"
          style={{
            animation: "spin-loading 3s linear infinite reverse, color-cycle 6s ease-in-out infinite 2s",
          }}
        />
        {/* Inner circle */}
        <div
          className="absolute inset-8 rounded-full border-4 border-t-transparent"
          style={{
            animation: "spin-loading 1.5s linear infinite, color-cycle 6s ease-in-out infinite 4s",
          }}
        />
      </div>
    </div>
  );
};
