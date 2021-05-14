import React from "react";
import cl from "clsx";
function Tag({ children, variant = "orange" }) {
  let className = cl(
    "text-xs px-1.5 py-0.5 flex items-center justify-center rounded-sm uppercase",
    {
      "bg-gray-100 text-gray-600": variant == "gray",
      "bg-blue-100 text-blue-600": variant == "blue",
      "bg-green-100 text-green-600": variant == "green",
      "bg-yellow-100 text-yellow-600": variant == "yellow",
      "bg-red-100 text-red-600": variant == "red",
      "bg-purple-100 text-purple-600": variant == "purple",
    }
  );
  return <div  className={className}>{children}</div>;
}

export default Tag;
