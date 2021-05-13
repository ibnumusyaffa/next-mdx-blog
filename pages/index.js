import React, { useEffect, useState } from "react";
import fs from "fs";
import path from "path";
const { readdir, readFile, lstat } = fs.promises;
import matter from "gray-matter";
import Layout from "../components/Layout";
import Link from "next/link";
import Input from "../components/Input";
import SearchIcon from "../components/icons/Search";
import Tag from "../components/Tag";
import formatDate from "../helpers/formatDate";
import useDebounce from "../helpers/useDebounce";
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
            <div className="text-3xl font-bold text-gray-800">Blog</div>
            <div className="text-gray-700">
              Tulisan seputar pengembangan perangkat lunak dan teknologi lainnya
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
              placeholder="Cari artikel..."
            ></Input>
          </div>
        </div>

        {filteredPosts.map((item) => (
          <Link key={item.id} href={item.slug}>
            <a className="group space-y-2 ">
              <div className="text-xl font-bold text-gray-900 hover:underline">
                {item.title}
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-sm text-gray-700">{item.date}</div>
                <div>
                  <Tag variant={item.category_color}>{item.category}</Tag>
                </div>
              </div>

              <div className="text-sm text-gray-700">{item.description}</div>
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

export async function getStaticProps({ params }) {
  const POSTS_PATH = path.join(process.cwd(), "content", "articles");
  const slugs = await readdir(POSTS_PATH);

  let posts = [];
  for (const slug of slugs) {
    const stat = await lstat(path.join(POSTS_PATH, slug));

    if (stat.isFile()) {
      const fileBuffer = await readFile(path.join(POSTS_PATH, slug));

      const { data } = matter(fileBuffer);

      posts.push({
        ...data,
        slug: `/article/${slug.replace(/\.mdx?$/, "")}`,
      });
    } else {
      const fileBuffer = await readFile(
        path.join(POSTS_PATH, slug, "index.mdx")
      );

      const { data } = matter(fileBuffer);
      posts.push({
        ...data,
        slug: `/article/${slug}`,
      });
    }
  }

  let sorted = posts.slice().sort((a, b) => b.date - a.date);
  let changeDate = sorted.map((item) => {
    return {
      ...item,
      date: formatDate(item.date),
    };
  });

  return {
    props: {
      posts: changeDate,
    },
  };
}

export default index;
