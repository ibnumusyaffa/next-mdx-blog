import fs from "fs";
import matter from "gray-matter";
import path from "path";
import formatDate from "./formatDate";
import { bundleMDX } from "mdx-bundler";
import readingTime from "reading-time";
let { readdir, readFile, lstat, access } = fs.promises;
import remarkSlug from "remark-slug";
var GithubSlugger = require("github-slugger");
var slugger = new GithubSlugger();

const getRehypeMdxCodeMeta = async () => {
  const { visit } = await import("unist-util-visit");

  return (options = {}) => {
    return (tree) => {
      visit(tree, "element", visitor);
    };

    function visitor(node, index, parentNode) {
      if (node.tagName === "code" && node.data && node.data.meta) {
        const blocks = node.data.meta.split(" ");

        node.properties = blocks.reduce((props, block) => {
          const [prop, value] = block.split("=");

          if (typeof value === "undefined") {
            props.line = prop;

            return props;
          }

          props[prop] = value;

          return props;
        }, node.properties);
      }
    }
  };
};

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

  let mdxSource = await readFile(postFilePath);
  const rehypeMdxCodeMeta = await getRehypeMdxCodeMeta();
  let result = await bundleMDX(mdxSource, {
    cwd: isFile ? undefined : path.join(post_path, slug),
    xdmOptions(options) {
      // this is the recommended way to add custom remark/rehype plugins:
      // The syntax might look weird, but it protects you in case we add/remove
      // plugins in the future.
      options.remarkPlugins = [...(options.remarkPlugins ?? []), remarkSlug];
      options.rehypePlugins = [
        ...(options.rehypePlugins ?? []),
        rehypeMdxCodeMeta,
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
