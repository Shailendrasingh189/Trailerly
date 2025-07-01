import React from "react";

const ErrorPage = () => {
  return (
    <div className="w-full flex items-center justify-center min-h-screen bg-[#0D0B18]">
      <svg width="600" height="300" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#0d0b18" />

        <text
          x="50%"
          y="45%"
          text-anchor="middle"
          font-family="Courier New, monospace"
          font-size="100"
          fill="#AB8BFF"
          font-weight="bold"
          letter-spacing="10"
        >
          404
        </text>

        <text
          x="50%"
          y="60%"
          text-anchor="middle"
          font-family="Arial, sans-serif"
          font-size="24"
          fill="#AB8BFF"
        >
          Scene Not Found
        </text>

        <text
          x="50%"
          y="72%"
          text-anchor="middle"
          font-family="Arial, sans-serif"
          font-size="16"
          fill="#AB8BFF"
        >
          The film you’re looking for has left the projector.
        </text>

        <rect x="50" y="250" width="500" height="10" fill="#AB8BFF" />
        <g fill="white">
          <rect x="60" y="252" width="6" height="6" />
          <rect x="100" y="252" width="6" height="6" />
          <rect x="140" y="252" width="6" height="6" />
          <rect x="180" y="252" width="6" height="6" />
          <rect x="220" y="252" width="6" height="6" />
          <rect x="260" y="252" width="6" height="6" />
          <rect x="300" y="252" width="6" height="6" />
          <rect x="340" y="252" width="6" height="6" />
          <rect x="380" y="252" width="6" height="6" />
          <rect x="420" y="252" width="6" height="6" />
          <rect x="460" y="252" width="6" height="6" />
          <rect x="500" y="252" width="6" height="6" />
        </g>
      </svg>
    </div>
  );
};

export default ErrorPage;
