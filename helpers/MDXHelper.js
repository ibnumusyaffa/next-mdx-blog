import fs from "fs";
const { readdir, readFile, lstat,access } = fs.promises;
import matter from "gray-matter";
import path from "path";
import formatDate from "./formatDate";
import { bundleMDX } from "mdx-bundler";
export async function getAllPosts(posts_path) {
  const slugs = await readdir(posts_path);

  let posts = await Promise.all(
    slugs.map(async (slug) => {
      const stat = await lstat(path.join(posts_path, slug));

      let fileBuffer = null;
      if (stat.isFile()) {
        fileBuffer = await readFile(path.join(posts_path, slug));
      } else {
        fileBuffer = await readFile(path.join(posts_path, slug, "index.mdx"));
      }

      const { data } = matter(fileBuffer);
      return {
        ...data,
        slug: `${slug.replace(/\.mdx?$/, "")}`,
      };
    })
  );

  return posts
    .slice()
    .sort((a, b) => b.date - a.date)
    .map((item) => {
      return {
        ...item,
        date: formatDate(item.date),
      };
    });
}

export async function getAllPaths(post_path) {
  let slugs = await readdir(post_path);

  let paths = slugs.map((slug) => {
    return {
      params: {
        slug: slug.replace(/\.mdx?$/, ""),
      },
    };
  });

  return paths;
}

export async function getPostDetail(post_path, slug) {
  let postFilePath;
  let components = {};
  let isFile = await isFileExist(path.join(post_path, `${slug}.mdx`));
  if (isFile) {
    postFilePath = path.join(post_path, `${slug}.mdx`);
  } else {
    postFilePath = path.join(post_path, `${slug}`, "index.mdx");
    components = await getComponents(path.join(post_path, `${slug}`));
  }

  let mdxSource = await readFile(postFilePath);
  let result = await bundleMDX(mdxSource, {
    files: components,
  });
  let { code, frontmatter } = result;

  return {
    slug,
    code,
    frontmatter: {
      ...frontmatter,
      date: formatDate(frontmatter.date),
    },
  };
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
