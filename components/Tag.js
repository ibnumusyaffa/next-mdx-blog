import React from "react";
import cl from "clsx";
function Tag({ children, variant = "orange" }) {
  let className = cl("px-3 text-xs px-2 py-0.5 text-center rounded-sm uppercase", {
    "bg-gray-100 text-gray-700": variant == "gray",
    "bg-blue-100 text-blue-700": variant == "blue",
    "bg-green-100 text-green-700": variant == "green",
    "bg-yellow-100 text-yellow-700": variant == "yellow",
    "bg-red-100 text-red-700": variant == "red",
    "bg-purple-100 text-purple-700": variant == "purple",
  });
  return <div className={className}>{children}</div>;
}

export default Tag;
