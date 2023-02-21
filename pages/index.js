import React from "react";
import Layout from "../components/Layout";
import Link from "next/link";
import path from "path";
import Tag from "../components/Tag";
import { getPosts } from "../helpers/mdx";
import Meta from "../components/Meta";

function Index({ posts }) {
  return (
    <Layout>
      <Meta></Meta>
      <div className="flex flex-col space-y-8">
        {posts.map((item) => (
          <Link key={item.id} href={`/article/${item.slug}`}>
            <div className="group space-y-2 ">
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

              <div className="text-gray-700">{item.description}</div>
            </div>
          </Link>
        ))}
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  const post_path = path.join(process.cwd(), "content", "articles");
  let posts = await getPosts(post_path);
  return {
    props: {
      posts,
    },
  };
}

export default Index;
