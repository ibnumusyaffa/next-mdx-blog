import React, { useEffect, useState } from "react";
import path from "path";
import Layout from "../components/Layout";
import Link from "next/link";
import Input from "../components/Input";
import SearchIcon from "../components/icons/Search";
import Tag from "../components/Tag";
import useDebounce from "../helpers/useDebounce";
import { getAllPosts } from "../helpers/MDXHelper";
function index({ posts }) {
  let [filteredPosts, setFilteredPost] = useState([]);
  let [keyword, setKeyword] = useState("");
  let debouncedKeyword = useDebounce(keyword, 500);

  useEffect(() => {
    let keywordLowered = debouncedKeyword.toLowerCase();
    let filtered = posts.filter(
      (item) => item.title.toLowerCase().indexOf(keywordLowered) > -1
    );

    setFilteredPost(filtered);
  }, [debouncedKeyword]);
  return (
    <Layout>
      <div className="flex flex-col space-y-8">
        <div>
          <div className="space-y-2 text-center">
            <div className="text-3xl font-bold text-gray-800">ProTips</div>
            <div className="text-gray-700">
              Tips singkat dan padat untuk developer yang sibuk
            </div>
          </div>

          <div className="mt-8">
            <Input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              leftIcon={
                <div className="w-5 h-5 text-gray-500">
                  <SearchIcon></SearchIcon>
                </div>
              }
              placeholder="Cari tulisan..."
            ></Input>
          </div>
        </div>

        {filteredPosts.map((item) => (
          <Link key={item.id} href={`/tips/${item.slug}`}>
            <a className="group space-y-2 ">
              <div className="text-xl font-bold text-gray-900 hover:underline">
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
            </a>
          </Link>
        ))}

        {filteredPosts.length == 0 ? (
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-600">Oopss...</div>
            <div className="text-gray-500">Artikel tidak ditemukan</div>
          </div>
        ) : null}
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  const POSTS_PATH = path.join(process.cwd(), "content", "tips");
  let posts = await getAllPosts(POSTS_PATH);
  return {
    props: {
      posts,
    },
  };
}

export default index;
