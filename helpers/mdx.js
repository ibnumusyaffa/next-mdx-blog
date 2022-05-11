import fs from "fs";
import matter from "gray-matter";
import path from "path";
import { defaultFormat } from "./date";
import { bundleMDX } from "mdx-bundler";
import readingTime from "reading-time";
import remarkSlug from "remark-slug";
import remarkGfm from "remark-gfm";
import GithubSlugger from "github-slugger";
import rehypePrettyCode from "rehype-pretty-code";

const { readdir, readFile, lstat } = fs.promises;
const slugger = new GithubSlugger();

function rehypePrettyCodeWithConf() {
  const options = {
    theme: "monokai",
    onVisitLine(node) {
      // Prevent lines from collapsing in `display: grid` mode, and
      // allow empty lines to be copy/pasted
      if (node.children.length === 0) {
        node.children = [{ type: "text", value: " " }];
      }
    },
    // Feel free to add classNames that suit your docs
    onVisitHighlightedLine(node) {
      node.properties.className.push("highlight");
    },
    onVisitHighlightedWord(node) {
      node.properties.className = ["word"];
    },
  };

  return rehypePrettyCode(options);
}

export async function getPosts(postPath) {
  let slugs = await readdir(postPath);

  let posts = await Promise.all(
    slugs.map(async (slug) => {
      let stat = await lstat(path.join(postPath, slug));

      let filePath = stat.isFile()
        ? path.join(postPath, slug)
        : path.join(postPath, slug, "index.mdx");

      let fileBuffer = await readFile(filePath, "utf-8");

      let { data: frontMatter, content } = matter(fileBuffer);
      let readStat = readingTime(content);
      return {
        ...frontMatter,
        slug: `${slug.replace(/\.mdx?$/, "")}`,
        readingTime: readStat.text,
      };
    })
  );

  return posts
    .slice()
    .filter((item) => item.is_published == true)
    .sort((a, b) => b.date - a.date)
    .map((item, index) => {
      return {
        ...item,
        id: index,
        date: defaultFormat(item.date),
      };
    });
}

export async function getPaths(postPath) {
  let slugs = await readdir(postPath);

  let paths = slugs.map((slug) => {
    return {
      params: {
        slug: slug.replace(/\.mdx?$/, ""),
      },
    };
  });

  return paths;
}

export async function getPost(postPath, slug) {
  let isFile = fs.existsSync(path.join(postPath, `${slug}.mdx`));
  let filePath = isFile
    ? path.join(postPath, `${slug}.mdx`)
    : path.join(postPath, slug, "index.mdx");

  let source = await readFile(filePath, "utf8");
  let mdxResult = await bundleMDX({
    source,
    cwd: isFile ? undefined : path.join(postPath, slug),
    mdxOptions(options) {
      options.remarkPlugins = [
        ...(options.remarkPlugins ?? []),
        remarkSlug,
        remarkGfm,
      ];
      options.rehypePlugins = [
        ...(options.rehypePlugins ?? []),
        rehypePrettyCodeWithConf,
      ];

      return options;
    },
  });

  let { content } = matter(source);
  let readStat = readingTime(content);
  const toc = content
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

  return {
    slug,
    code: mdxResult.code,
    toc,
    readingTime: readStat.text,
    frontmatter: {
      ...mdxResult.frontmatter,
      date: defaultFormat(mdxResult.frontmatter.date),
    },
  };
}
