import * as React from "react";
import { getMDXComponent } from "mdx-bundler/client";
import { bundleMDX } from "mdx-bundler";
import fs from "fs";
import path from "path";
const { readdir, readFile, lstat, access } = fs.promises;
import Layout from "../../components/Layout";
import Code from "../../components/Code";
import formatDate from "../../helpers/formatDate";
import Tag from "../../components/Tag";
export default function Post({ code, frontmatter, slug }) {

  const Component = React.useMemo(() => getMDXComponent(code), [code]);
  return (
    <Layout
      meta={{
        title: frontmatter.title,
        description: frontmatter.description,
        url: `blog/${slug}`,
      }}
    >
      <div className="mb-10 mt-3 flex items-center flex-col">
        <h1 className="text-4xl  font-semibold text-center">
          {frontmatter.title}
        </h1>
        <div className="flex items-center space-x-3 mt-5">
          <div className="text-sm text-gray-700">{frontmatter.date}</div>
          <div>
            <Tag variant={frontmatter.category_color}>
              {frontmatter.category}
            </Tag>
          </div>
        </div>
      </div>
      <div className="prose max-w-full">
        <Component
          components={{
            code: Code,
            pre: ({ children, ...other }) => children,
          }}
        />
      </div>
    </Layout>
  );
}

async function getComponents(directory) {
  const files = await readdir(directory);
  let components = {};

  for (const file of files) {
    if (file.substr(-3) === "tsx" || file.substr(-3) === "jsx") {
      const fileBuffer = await readFile(path.join(directory, file));
      components[`./${file}`] = fileBuffer.toString().trim();
    }
  }

  return components;
}

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

export async function getStaticProps({ params }) {
  let slug = params.slug;

  const POSTS_PATH = path.join(process.cwd(), "posts");
  let isExist = await exists(path.join(POSTS_PATH, `${slug}.mdx`));
  if (isExist) {
    let postFilePath = path.join(POSTS_PATH, `${slug}.mdx`);
    const mdxSource = await readFile(postFilePath);

    const result = await bundleMDX(mdxSource, {
      files: {},
    });
    const { code, frontmatter } = result;

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
    const mdxSource = await readFile(postFilePath);

    const components = await getComponents(
      path.join(POSTS_PATH, `${params.slug}`)
    );
    const result = await bundleMDX(mdxSource, {
      files: components,
    });
    const { code, frontmatter } = result;

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
  let POSTS_PATH = path.join(process.cwd(), "posts");
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
