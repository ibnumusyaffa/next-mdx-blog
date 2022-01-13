import React, { useState } from "react";
import Link from "next/link";
import Meta from "../components/Meta";


function Layout({ children, meta }) {
  return (
    <React.Fragment>
      <Meta {...meta}></Meta>
      <nav>
        <div className="h-20 flex justify-center border-b">
          <div className="px-5 md:px-0 w-full md:w-[45%]   h-full flex items-center justify-between">
            <Link href="/">
              <a className="flex items-center space-x-3 ">
                <div className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-teal-500">
                 Ibnu.dev
                </div>
              </a>
            </Link>
          </div>
        </div>
      </nav>

      <div
        className="flex justify-center py-5 mt-5"
        style={{
          minHeight: "calc(100vh - 8rem)",
        }}
      >
        <main className="px-5 md:px-0 w-full md:w-[45%]">{children}</main>
      </div>
      <footer className="flex justify-center">
        <div className="px-5 md:px-0 w-full md:w-[45%] text-gray-600 text-sm border-t border-gray-300 py-5 text-center">
          © 2022. Ibnu Musyaffa
        </div>
      </footer>
    </React.Fragment>
  );
}

export default Layout;
