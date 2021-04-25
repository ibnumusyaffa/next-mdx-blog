import React from "react";
import fs from "fs";
import path from "path";
const { readdir, readFile, lstat } = fs.promises;
import matter from "gray-matter";
import Layout from "../../components/Layout";
import { format } from "date-fns";
import Link from "next/link";
// import { da } from "date-fns/locale";
function index({ posts }) {
  return (
    <Layout>
      <div className="flex flex-col">
        {posts.map((item) => (
          <Link key={item.id} href={item.slug}>
            <a>{item.title}</a>
          </Link>
        ))}
      </div>
    </Layout>
  );
}

export async function getStaticProps({ params }) {
  const POSTS_PATH = path.join(process.cwd(), "posts");
  const slugs = await readdir(POSTS_PATH);

  let posts = [];
  for (const slug of slugs) {
    const stat = await lstat(path.join(process.cwd(), "posts", slug));

    if (stat.isFile()) {
      const fileBuffer = await readFile(
        path.join(process.cwd(), "posts", slug)
      );

      const { data } = matter(fileBuffer);
   
      posts.push({
        ...data,
        date: format(data.date, "dd MMMM yyyy"),
        slug: `/tulisan/${slug.replace(/\.mdx?$/, "")}`,
      });
    } else {
      const fileBuffer = await readFile(
        path.join(process.cwd(), "posts", slug, "index.mdx")
      );

      const { data } = matter(fileBuffer);
      posts.push({
        ...data,
        date: format(data.date, "dd MMMM yyyy"),
        slug: `/tulisan/${slug}`,
      });
    }
  }

  return {
    props: {
      posts,
    },
  };
}

export default index;
