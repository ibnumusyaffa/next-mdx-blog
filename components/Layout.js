import React, { useState } from "react";
import Link from "next/link";
import Meta from "../components/Meta";
import MenuItem from "../components/MenuItem";
import MenuItemMobile from "../components/MenuItemMobile";
import MenuIcon from "../components/icons/Menu";
import CloseIcon from "../components/icons/Close";
import clsx from "clsx";

function Layout({ children, meta }) {
  let [show, setShow] = useState(false);

  function toggle() {
    setShow((prev) => !prev);
  }

  let navClass = clsx(" h-16 flex justify-center", {
    "border-b border-gray-200 ": !show,
  });
  return (
    <React.Fragment>
      <Meta {...meta}></Meta>
      <nav>
        <div className="bg-gradient-to-r from-green-400 via-blue-400 to-pink-400 h-0.5"></div>
        <div className={navClass}>
          <div className="px-5 md:px-0 w-full md:w-1/2   h-full flex items-center justify-between">
            <Link href="/">
              <a className="flex items-center space-x-3 hover:underline">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-blue-500"></div>
                <div className=" text-gray-700">Ibnu Musyaffa</div>
              </a>
            </Link>

            <div className="hidden md:flex h-full">
              <MenuItem href="/tentang">Tentang</MenuItem>
            </div>
            {show ? (
              <button className="md:hidden" onClick={toggle}>
                <CloseIcon></CloseIcon>
              </button>
            ) : (
              <button className="md:hidden" onClick={toggle}>
                <MenuIcon></MenuIcon>
              </button>
            )}
          </div>
        </div>
        {show ? (
          <div className="relative h-56">
            <div className="border-b flex flex-col border-gray-200 absolute w-full bg-white opacity-90">
              <MenuItemMobile href="/tentang">Tentang</MenuItemMobile>
            </div>
          </div>
        ) : null}
      </nav>

      <div
        className="flex justify-center py-5"
        style={{
          minHeight: "calc(100vh - 8rem)",
        }}
      >
        <main className="px-5 md:px-0 w-full md:w-1/2">{children}</main>
      </div>
      <footer className="flex justify-center">
        <div className="px-5 md:px-0 w-full md:w-1/2 text-gray-600 text-sm border-t border-gray-200 py-5 text-center">
          © 2021. Ibnu Musyaffa
        </div>
      </footer>
    </React.Fragment>
  );
}

export default Layout;
