import React from "react";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
function MenuItem({ children, href }) {
  let router = useRouter();
  let currentParentRoute = `/${router.pathname.split("/")[1]}`;
  let parentHref = `/${href.split("/")[1]}`;

  let isActive = currentParentRoute === parentHref ? true : false;
  let classNames = clsx("px-4 h-full  flex items-center", {
    "text-blue-500 border-b-2 border-blue-500": isActive,
    "text-gray-700": !isActive,
  });
  return (
    <Link href={href}>
      <a className={classNames}>
        <div>{children}</div>
      </a>
    </Link>
  );
}

export default MenuItem;
