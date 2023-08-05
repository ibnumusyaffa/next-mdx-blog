import React from "react";
import Layout from "../components/Layout";
import Link from "next/link";
import path from "path";
import { getPosts } from "../helpers/mdx";
import Meta from "../components/Meta";

function Index({ posts }) {
  return (
    <Layout>
      <Meta></Meta>

      <main className="font-mono m-auto mb-10 text-sm">
        <header className="text-gray-500  flex items-center text-xs">
          <button className="w-24 h-9 text-left pl-0.5">Date</button>
          <span className="flex-1">Title</span>
          <button className="h-9 w-14"></button>
        </header>
        <ul>
          {posts.map((item) => (
            <li key={item.id}>
              <Link  href={`/article/${item.slug}`}>
                <span className="flex transition-[background-color] hover:bg-gray-100 active:bg-gray-200 border-y border-gray-200 border-b-0">
                  <span className="py-3 flex grow items-center ">
                    <span className="w-24 inline-block self-start shrink-0 text-gray-500 pl-0.5">
                      {item.date}
                    </span>
                    <span className="flex-1 pr-1"> {item.title}</span>
                    <span className="text-gray-500  text-xs w-14 inline-block self-start ">{item.readingTime.replace("read","")}</span>
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </main>
      `
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
