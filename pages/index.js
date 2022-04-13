import React from "react";
import Layout from "../components/Layout";
import Link from "next/link";

import Tag from "../components/Tag";
import { getAllPosts } from "../helpers/MDXHelper";

import path from "path";
function Index({ posts }) {
  return (
    <Layout>
      <div className="flex flex-col space-y-8">
        {posts.map((item) => (
          <Link key={item.id} href={`/article/${item.slug}`}>
            <a className="group space-y-2 ">
              <div className="text-2xl font-bold text-gray-900 hover:underline capitalize">
                {item.title}
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-sm text-gray-700">{item.date}</div>
                <div className="text-gray-700">·</div>
                <div className="text-sm text-gray-700">{item.readingTime}</div>
                <div className="text-gray-700">·</div>
                <div>
                  <Tag variant={item.category_color}>{item.category}</Tag>
                </div>
              </div>

              <div className="text-sm text-gray-700">{item.description}</div>
            </a>
          </Link>
        ))}
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  const POSTS_PATH = path.join(process.cwd(), "content", "articles");
  let posts = await getAllPosts(POSTS_PATH);
  return {
    props: {
      posts,
    },
  };
}

export default Index;
