import * as React from "react";
import { getMDXComponent } from "mdx-bundler/client";
import path from "path";
import Layout from "../../components/Layout";
import Pre from "../../components/Pre";
import Tag from "../../components/Tag";
import Image from "next/image";
import { getAllPaths, getPostDetail } from "../../helpers/MDXHelper";
import clsx from "clsx";
import { useState } from "react";
import ArrowRight from "../../components/icons/ArrowRight";
import ArrowDown from "../../components/icons/ArrowDown";
import Giscus from "@giscus/react";

export default function Post({ code, frontmatter, slug, readingTime, toc }) {
  let Component = React.useMemo(() => getMDXComponent(code), [code]);
  let [collapseToc, setCollapseToc] = useState(false);
  return (
    <Layout
      meta={{
        title: frontmatter.title,
        description: frontmatter.description,
        url: `article/${slug}`,
        thumbnail: frontmatter.thumbnail,
      }}
    >
      <article className="mb-10">
        <header className="mb-10 mt-3 flex md:items-center flex-col">
          <h1 className="text-3xl md:text-4xl  font-semibold md:text-center">
            {frontmatter.title}
          </h1>
          <div className="flex space-x-3 mt-5">
            <div className="text-sm text-gray-700">{frontmatter.date}</div>
            <div className="text-gray-700">·</div>
            <div className="text-sm text-gray-700">{readingTime}</div>
            <div className="text-gray-700">·</div>
            <div>
              <Tag variant={frontmatter.category_color}>
                {frontmatter.category}
              </Tag>
            </div>
          </div>
        </header>
        {frontmatter.thumbnail && frontmatter.show_thumbnail ? (
          <div className="mb-10">
            <Image
              className="rounded"
              src={"/" + frontmatter.thumbnail}
              layout="responsive"
              width={1920}
              height={1080}
            />
          </div>
        ) : null}

        {frontmatter.show_toc ? (
          <div className="flex  flex-col justify-center  bg-gray-50 border border-gray-200 px-2 py-3  text-gray-700 rounded">
            <button
              onClick={() => setCollapseToc((prev) => !prev)}
              className="font-semibold uppercase focus:outline-none"
            >
              <div className="flex items-center">
                {collapseToc ? (
                  <ArrowDown></ArrowDown>
                ) : (
                  <ArrowRight></ArrowRight>
                )}

                <div className="pl-1">Daftar Isi</div>
              </div>
            </button>
            {collapseToc ? (
              <div className="mt-2 space-y-1 pl-6">
                {toc.map((item) => {
                  let aClass = clsx("block hover:underline", {
                    "pl-0": item.level == 2,
                    "pl-5": item.level == 3,
                  });
                  return (
                    <a className={aClass} href={item.href}>
                      {item.title}
                    </a>
                  );
                })}
              </div>
            ) : null}
          </div>
        ) : null}

        <div className="prose prose-green max-w-full mt-5">
          <Component
            components={{
              pre: Pre,
            }}
          />
        </div>
      </article>
      <Giscus
        repo="ibnumusyaffa/ibnu.dev"
        repoId="MDEwOlJlcG9zaXRvcnkzNjMwMjEwNzk="
        category="General"
        categoryId="DIC_kwDOFaNDF84CO_nG"
        mapping="pathname"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme="light"
        lang="en"
        loading="lazy"
        crossorigin="anonymous"
        async
      ></Giscus>
    </Layout>
  );
}

export async function getStaticProps({ params }) {
  let slug = params.slug;
  let POSTS_PATH = path.join(process.cwd(), "content", "articles");
  let post = await getPostDetail(POSTS_PATH, slug);

  return {
    props: post,
  };
}

export async function getStaticPaths() {
  let POSTS_PATH = path.join(process.cwd(), "content", "articles");
  let paths = await getAllPaths(POSTS_PATH);
  return {
    paths,
    fallback: false,
  };
}
