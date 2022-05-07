import fs from "fs";
import matter from "gray-matter";
import path from "path";
import formatDate from "./formatDate";
import { bundleMDX } from "mdx-bundler";
import readingTime from "reading-time";
let { readdir, readFile, lstat, access } = fs.promises;
import remarkSlug from "remark-slug";
import GithubSlugger from "github-slugger";
const slugger = new GithubSlugger();
import rehypePrettyCode from "rehype-pretty-code";

function rehypePrettyCodeWithConf() {
  const options = {
    // Use one of Shiki's packaged themes
    theme: "monokai",
    // Or your own JSON theme

    onVisitLine(node) {
      // Prevent lines from collapsing in `display: grid` mode, and
      // allow empty lines to be copy/pasted
      if (node.children.length === 0) {
        node.children = [{ type: "text", value: " " }];
      }
    },
    // Feel free to add classNames that suit your docs
    onVisitHighlightedLine(node) {
      node.properties.className.push("highlighted");
    },
    onVisitHighlightedWord(node) {
      node.properties.className = ["word"];
    },
  };

  return rehypePrettyCode(options);
}

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

      let { data, content } = matter(fileBuffer);

      let readStat = readingTime(content);
      return {
        ...data,
        slug: `${slug.replace(/\.mdx?$/, "")}`,
        readingTime: readStat.text,
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

  let mdxSource = await readFile(postFilePath, "utf8");

  let result = await bundleMDX({
    source: mdxSource,
    cwd: isFile ? undefined : path.join(post_path, slug),
    mdxOptions(options) {
      options.remarkPlugins = [...(options.remarkPlugins ?? []), remarkSlug];
      options.rehypePlugins = [
        ...(options.rehypePlugins ?? []),
        rehypePrettyCodeWithConf,
      ];

      return options;
    },
  });

  let { content: mdxContent } = matter(mdxSource);
  let readStat = readingTime(mdxContent);
  const toc = mdxContent
    .split("\n")
    .filter((line) => line.match(/^#{1,3}\s/)) // only match level 1-3
    .map((line) => {
      const [level, title] = line.split(/(?<=#)\s/); // split on first space
      return {
        level: level.length,
        title,
        href: "#" + slugger.slug(title),
      };
    });

  let { code, frontmatter } = result;

  return {
    slug,
    code,
    toc,
    readingTime: readStat.text,
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
