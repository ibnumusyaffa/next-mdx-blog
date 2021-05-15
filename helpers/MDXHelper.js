import fs from "fs";
import matter from "gray-matter";
import path from "path";
import formatDate from "./formatDate";
import { bundleMDX } from "mdx-bundler";
let { readdir, readFile, lstat, access } = fs.promises;

export async function getAllPosts(posts_path) {
  let slugs = await readdir(posts_path);

  let posts = await Promise.all(
    slugs.map(async (slug) => {
      let stat = await lstat(path.join(posts_path, slug));

      let fileBuffer = null;
      if (stat.isFile()) {
        fileBuffer = await readFile(path.join(posts_path, slug));
      } else {
        fileBuffer = await readFile(path.join(posts_path, slug, "index.mdx"));
      }

      let { data } = matter(fileBuffer);
      return {
        ...data,
        slug: `${slug.replace(/\.mdx?$/, "")}`,
      };
    })
  );

  return posts
    .slice()
    .filter((item) => item.is_published == true)
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

  let isFile = await isFileExist(path.join(post_path, `${slug}.mdx`));
  if (isFile) {
    postFilePath = path.join(post_path, `${slug}.mdx`);
  } else {
    postFilePath = path.join(post_path, slug, "index.mdx");
  }

  let mdxSource = await readFile(postFilePath);
  let result = await bundleMDX(mdxSource, {
    cwd: isFile ? undefined : path.join(post_path, slug),
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

async function isFileExist(path) {
  try {
    await access(path);
    return true;
  } catch (e) {
    return false;
  }
}
