import React from "react";
import Layout from "../components/Layout";
function index() {
  return (
    <Layout>
      <div className="flex h-64  justify-center flex-col">
        <div>
          <span className="text-2xl md:text-3xl pb-2 font-semibold text-gray-800">
            Halo, Saya Ibnu Musyaffa 👋
          </span>
          <div className="mt-3 text-gray-700">
            Saya adalah seorang software developer, dan ini adalah blog pribadi
            yang berisi tulisan seputar pengembangan perangkat lunak
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default index;
