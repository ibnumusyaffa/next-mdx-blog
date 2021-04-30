import React from "react";
import Link from "next/link";
import Meta from "../components/Meta";
import MenuItem from "../components/MenuItem";
function Layout({ children, meta }) {
  return (
    <div>
      <Meta {...meta}></Meta>
      <div class="bg-gradient-to-r from-green-400 via-blue-400 to-pink-400 h-0.5"></div>
      <div className="border-b border-gray-200  h-16 flex justify-center">
        <div className="px-5 md:px-0 w-full md:w-1/2   h-full flex items-center justify-between">
          <Link href="/">
            <a className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-blue-500"></div>
              <div className=" text-gray-700 hidden md:block">
                Ibnu Musyaffa
              </div>
            </a>
          </Link>

          <div className="flex  h-full">
            <MenuItem href="/">Beranda</MenuItem>
            <MenuItem href="/tulisan">Tulisan</MenuItem>
            <MenuItem href="/tentang">Tentang</MenuItem>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center py-5">
        <div className="px-5 md:px-0 w-full md:w-1/2">{children}</div>
      </div>
    </div>
  );
}

export default Layout;
