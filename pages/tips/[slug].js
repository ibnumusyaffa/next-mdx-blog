import * as React from "react";
import { getMDXComponent } from "mdx-bundler/client";
import { bundleMDX } from "mdx-bundler";
import fs from "fs";
import path from "path";
let { readdir, readFile, lstat, access } = fs.promises;
import Layout from "../../components/Layout";
import Code from "../../components/Code";
import formatDate from "../../helpers/formatDate";
import Tag from "../../components/Tag";
import Image from "next/image";

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

async function getComponents(directory) {
  let files = await readdir(directory);
  let components = {};

  for (let file of files) {
    if (file.substr(-3) === "tsx" || file.substr(-3) === "jsx") {
      let fileBuffer = await readFile(path.join(directory, file));
      components[`./${file}`] = fileBuffer.toString().trim();
    }
  }

  return components;
}

async function isFileExist(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

export async function getStaticProps({ params }) {
  let slug = params.slug;

  let POSTS_PATH = path.join(process.cwd(), "content", "tips");
  let isFile = await isFileExist(path.join(POSTS_PATH, `${slug}.mdx`));
  if (isFile) {
    let postFilePath = path.join(POSTS_PATH, `${slug}.mdx`);
    let mdxSource = await readFile(postFilePath);
    let result = await bundleMDX(mdxSource, {
      files: {},
    });
    let { code, frontmatter } = result;

    return {
      props: {
        slug: params.slug,
        code,
        frontmatter: {
          ...frontmatter,
          date: formatDate(frontmatter.date),
        },
      },
    };
  } else {
    let postFilePath = path.join(POSTS_PATH, `${slug}`, "index.mdx");
    let mdxSource = await readFile(postFilePath);

    let components = await getComponents(
      path.join(POSTS_PATH, `${params.slug}`)
    );
    let result = await bundleMDX(mdxSource, {
      files: components,
    });
    let { code, frontmatter } = result;

    return {
      props: {
        slug: params.slug,
        code,
        frontmatter: {
          ...frontmatter,
          date: formatDate(frontmatter.date),
        },
      },
    };
  }
}

export async function getStaticPaths() {
  let POSTS_PATH = path.join(process.cwd(), "content", "tips");
  let slugs = await readdir(POSTS_PATH);

  let paths = [];
  for (let slug of slugs) {
    let stat = await lstat(path.join(POSTS_PATH, slug));

    if (stat.isFile()) {
      paths.push({
        params: {
          slug: slug.replace(/\.mdx?$/, ""),
        },
      });
    } else {
      paths.push({
        params: {
          slug,
        },
      });
    }
  }

  return {
    paths,
    fallback: false,
  };
}
