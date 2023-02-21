import React from "react";
import cl from "clsx";
function Tag({ children, variant = "orange" }) {
  let className = cl(
    "text-xs px-1.5 py-1 font-medium flex items-center justify-center rounded uppercase leading-none",
    {
      "bg-gray-50 border border-gray-300 text-gray-600": variant == "gray",
      "bg-blue-50 border border-blue-300 text-blue-600": variant == "blue",
      "bg-green-50 border border-green-300 text-green-600": variant == "green",
      "bg-yellow-50 border border-yellow-300 text-yellow-600": variant == "yellow",
      "bg-red-50 border border-red-300 text-red-600": variant == "red",
      "bg-purple-50 border border-purple-300 text-purple-600": variant == "purple",
    }
  );
  return <div  className={className}>{children}</div>;
}

export default Tag;
