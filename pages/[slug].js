import * as React from "react";
import { getMDXComponent } from "mdx-bundler/client";
import { bundleMDX } from "mdx-bundler";
import fs from "fs";
import path from "path";
const { readdir, readFile } = fs.promises;

export default function Post({ code, frontmatter }) {
  const Component = React.useMemo(() => getMDXComponent(code), [code]);
  return (
    <>
      <header>
        <h1>{frontmatter.title}</h1>
        <p>{frontmatter.description}</p>
      </header>
      <main>
        <Component />
      </main>
    </>
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

export async function getServerSideProps({ params }) {
  const POSTS_PATH = path.join(process.cwd(), "posts");
  const postFilePath = path.join(POSTS_PATH, `${params.slug}`, "index.mdx");
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
      code,
      frontmatter,
    },
  };
}
