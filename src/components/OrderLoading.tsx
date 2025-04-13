"use client";

function OrderLoading({ size = 2.5 }: { size?: number }) {
  // Calculate sizes based on the size multiplier
  const containerSize = size * 1;
  const roadWidth = size * 16;
  const packageWidth = size * 12;
  const packageHeight = size * 8;
  const stripeWidth = size * 8;
  const pingSize = size * 6;
  const dotSize = size * 2;

  return (
    <div
      className="absolute   inset-0 flex flex-col items-center justify-center space-y-3"
      style={{ transform: `scale(${containerSize})` }}
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 opacity-30 animate-gradient-x"></div>

      {/* Creative loading animation */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Package delivery animation */}
        <div
          className="relative mb-6"
          style={{ width: `${size * 24}px`, height: `${size * 16}px` }}
        >
          <div
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 rounded-full animate-pulse bg-gray-200"
            style={{ width: `${roadWidth}px`, height: `${size * 2}px` }}
          ></div>
          <div
            className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-blue-500 rounded-lg animate-bounce"
            style={{
              width: `${packageWidth}px`,
              height: `${packageHeight}px`,
            }}
          >
            <div
              className="absolute top-1 left-1/2 transform -translate-x-1/2 rounded-full bg-blue-300"
              style={{ width: `${stripeWidth}px`, height: `${size * 1}px` }}
            ></div>
          </div>
          <div
            className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-yellow-400 rounded-full animate-ping opacity-75"
            style={{ width: `${pingSize}px`, height: `${pingSize}px` }}
          ></div>
        </div>

        {/* Text with typing animation */}
        <div className="text-center">
          <p className="text-sm text-gray-500 flex items-center justify-center">
            <span
              className="inline-block rounded-full bg-blue-500 mx-1 animate-bounce"
              style={{
                width: `${dotSize}px`,
                height: `${dotSize}px`,
                animationDelay: "0.1s",
              }}
            ></span>
            <span
              className="inline-block rounded-full bg-blue-500 mx-1 animate-bounce"
              style={{
                width: `${dotSize}px`,
                height: `${dotSize}px`,
                animationDelay: "0.2s",
              }}
            ></span>
            <span
              className="inline-block rounded-full bg-blue-500 mx-1 animate-bounce"
              style={{
                width: `${dotSize}px`,
                height: `${dotSize}px`,
                animationDelay: "0.3s",
              }}
            ></span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default OrderLoading;
