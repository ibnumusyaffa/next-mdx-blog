import React from "react";
import Layout from "../components/Layout";
function index() {
  return (
    <Layout>
      <div className="flex h-64  justify-center flex-col">
        <span className="text-3xl">Halo, Saya Ibnu Musyaffa 👋</span>
        <div className="mt-2">Saya adalah seorang software developer, dan ini adalah blog pribadi yang berisi catatan seputar pengembangan perangkat lunak</div>
      </div>
    </Layout>
  );
}

export default index;
