import React, { useState } from "react";
import Link from "next/link";

function Layout({ children }) {
  return (
    <React.Fragment>
      <nav>
        <div className="h-20 flex justify-center border-b">
          <div className="px-5 md:px-0 w-full md:w-[45%]   h-full flex items-center justify-between">
            <Link href="/">
              <di className="flex items-center space-x-3 ">
                <div className="text-2xl lowercase font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-700  to-pink-500">
                  Ibnu.dev
                </div>
              </di>
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
