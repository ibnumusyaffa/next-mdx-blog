import * as React from "react";
import { getMDXComponent } from "mdx-bundler/client";
import path from "path";
import Layout from "../../components/Layout";
import Code from "../../components/Code";
import Tag from "../../components/Tag";
import Image from "next/image";
import { getAllPaths, getPostDetail } from "../../helpers/MDXHelper";

export default function Post({ code, frontmatter, slug }) {
  let Component = React.useMemo(() => getMDXComponent(code), [code]);
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

        <div className="prose prose-green max-w-full">
          <Component
            components={{
              code: Code,
              pre: ({ children, ...other }) => children,
            }}
          />
        </div>
      </article>
    </Layout>
  );
}

export async function getStaticProps({ params }) {
  let slug = params.slug;
  let POSTS_PATH = path.join(process.cwd(), "content", "tips");
  let post = await getPostDetail(POSTS_PATH, slug);
  
  return {
    props: post,
  };
}

export async function getStaticPaths() {
  let POSTS_PATH = path.join(process.cwd(), "content", "tips");
  let paths = await getAllPaths(POSTS_PATH);
  return {
    paths,
    fallback: false,
  };
}
