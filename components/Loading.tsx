"use client";

export const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="relative h-32 w-32">
        {/* Outer circle */}
        <div
          className="absolute inset-0 rounded-full border-4 border-transparent"
          style={{ borderTopColor: "rgb(253, 38, 0)", animation: "spin-loading 2s linear infinite" }}
        />
        {/* Middle circle */}
        <div
          className="absolute inset-4 rounded-full border-4 border-transparent"
          style={{ borderTopColor: "rgb(241, 238, 16)", animation: "spin-loading 3s linear infinite reverse" }}
        />
        {/* Inner circle */}
        <div
          className="absolute inset-8 rounded-full border-4 border-transparent"
          style={{ borderTopColor: "rgb(255, 145, 0)", animation: "spin-loading 1.5s linear infinite" }}
        />
      </div>
    </div>
  );
};
