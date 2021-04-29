import React from "react";
import clx from "clsx";

function Input({
  error,
  disabled,
  leftIcon,
  rightIcon,
  size = "default",
  noBlock,
  className,
  value = "",
  ...props
}) {
  let cl = clx(
    `appearance-none transition-all duration-300 ease-in-out border border-gray-300 rounded  px-3 text-gray-800  leading-tight outline-none focus:border-blue-500  focus:border-2 ${className}`,
    {
      "opacity-75 cursor-not-allowed": disabled,
      "border-red-500": error,
      "h-8 text-xs": size === "small",
      "h-10 text-sm": size == "default",
      "h-12 text-base": size == "large",

      "pl-10": leftIcon, // has left icon
      "pr-10": rightIcon,

      "w-full": !noBlock,
    }
  );

  return (
    <div className="relative">
      {leftIcon && (
        <div className="absolute text-gray-600 w-10  left-0 top-0   flex justify-center items-center h-full">
          <div className="w-5 h-5">{leftIcon}</div>
        </div>
      )}

      <input disabled={disabled} value={value} className={cl} {...props} />
      {rightIcon && (
        <div className="absolute text-gray-600 w-10  right-0 top-0   flex justify-center items-center h-full">
          <div className="w-5 h-5">{rightIcon}</div>
        </div>
      )}
    </div>
  );
}

export default Input;
