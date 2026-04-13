import React from "react";

const Spin = ({ size = "md", color = "emerald" }) => {

  const sizeClasses = {
    sm: "w-6 h-6 border-2",
    md: "w-10 h-10 border-4",
    lg: "w-14 h-14 border-6",
  };

  const colorClasses = {
    emerald: "border-emerald-500 border-t-transparent",
    white: "border-white border-t-transparent",
    gray: "border-gray-400 border-t-transparent",
  };

  const selectedSizeClass = sizeClasses[size] || sizeClasses.md;
  const selectedColorClass = colorClasses[color] || colorClasses.emerald;

  return (
    <div
      className={`animate-spin rounded-full ${selectedSizeClass} ${selectedColorClass} border-solid`}
    ></div>
  );
};

export default Spin;