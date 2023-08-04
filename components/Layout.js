import React, { useState } from "react";
import Link from "next/link";

function Layout({ children }) {
  return (
    <React.Fragment>
      <nav>
        <div className="h-20 flex justify-center px-5 md:px-0">
          <div className="w-full md:w-[45%]   h-full flex items-center justify-between">
            <Link href="/">
              <di className="flex items-center space-x-3  transition-colors text-gray-900 hover:text-purple-700">
                <div className="text-xl font-bold">Ibnu.dev</div>
              </di>
            </Link>
            <div>
              <Link href="/about">
                <di className="flex items-center space-x-3  transition-colors text-gray-700 hover:text-purple-900">
                  <div className="text-sm">About</div>
                </di>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div
        className="flex justify-center py-5 px-5 md:px-0"
        style={{
          minHeight: "calc(100vh - 9rem)",
        }}
      >
        <main className="w-full md:w-[45%] ">{children}</main>
      </div>
      <footer className="flex justify-center">
        <div className="px-5 md:px-0 w-full md:w-[45%] text-gray-600 flex justify-between text-sm py-5">
          <div>© Ibnu Musyaffa</div>
          <a href="https://github.com/ibnumusyaffa/ibnu.dev" className="underline">Source</a>
        </div>
      </footer>
    </React.Fragment>
  );
}

export default Layout;
