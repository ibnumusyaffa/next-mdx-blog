import React from "react";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
function MenuItem({ children, href }) {
  let router = useRouter();
  let currentParentRoute = `/${router.pathname.split("/")[1]}`;
  let parentHref = `/${href.split("/")[1]}`;

  let isActive = currentParentRoute === parentHref ? true : false;
  let classNames = clsx(
    "h-12 flex items-center px-5",
    {
      "text-blue-500 font-semibold": isActive,
      "text-gray-700": !isActive,
    }
  );
  return (
    <Link href={href}>
      <a className={classNames}>{children}</a>
    </Link>
  );
}

export default MenuItem;
