import * as React from "react";
import { getMDXComponent } from "mdx-bundler/client";
import path from "path";
import Layout from "../../components/Layout";
import Pre from "../../components/Pre";
import Tag from "../../components/Tag";
import Image from "next/image";
import { getPaths, getPost } from "../../helpers/mdx";
import clsx from "clsx";

import Meta from "../../components/Meta";
import Giscus from "@giscus/react";

const useIntersectionObserver = (setActiveId) => {
  const headingElementsRef = React.useRef({});
  React.useEffect(() => {
    const callback = (headings) => {
      headingElementsRef.current = headings.reduce((map, headingElement) => {
        map[headingElement.target.id] = headingElement;
        return map;
      }, headingElementsRef.current);

      const visibleHeadings = [];
      Object.keys(headingElementsRef.current).forEach((key) => {
        const headingElement = headingElementsRef.current[key];
        if (headingElement.isIntersecting) visibleHeadings.push(headingElement);
      });

      const getIndexFromId = (id) =>
        headingElements.findIndex((heading) => heading.id === id);

      if (visibleHeadings.length === 1) {
        setActiveId(visibleHeadings[0].target.id);
      } else if (visibleHeadings.length > 1) {
        const sortedVisibleHeadings = visibleHeadings.sort(
          (a, b) => getIndexFromId(a.target.id) > getIndexFromId(b.target.id)
        );
        setActiveId(sortedVisibleHeadings[0].target.id);
      }
    };

    const observer = new IntersectionObserver(callback, {
      rootMargin: "0px 0px -40% 0px",
    });

    const headingElements = Array.from(document.querySelectorAll("h2, h3"));

    headingElements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [setActiveId]);
};

function Header({ frontmatter, readingTime }) {
  return (
    <React.Fragment>
      <header className="mb-10 mt-3 flex md:items-center flex-col">
        <h1 className="text-3xl md:text-4xl  font-semibold md:text-center capitalize">
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
            width={1920}
            height={1080}
          />
        </div>
      ) : null}
    </React.Fragment>
  );
}

function TableOfContent({ toc }) {
  const [activeId, setActiveId] = React.useState();
  useIntersectionObserver(setActiveId);
  return (
    <div className="flex flex-col justify-center  ">
      <div className="font-semibold mb-1.5 text-gray-800 uppercase">
        Daftar Isi
      </div>
      <div className="space-y-2">
        {toc.map((item) => {
          const isActive = item.href === `#${activeId}`;
          return (
            <a
              key={item.href}
              className={clsx("block hover:underline text-sm ", {
                "pl-0": item.level == 2,
                "pl-5": item.level == 3,
                "text-purple-700 font-medium": isActive,
                "text-gray-600": !isActive,
              })}
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                document.querySelector(item.href).scrollIntoView({
                  behavior: "smooth",
                });
              }}
            >
              {item.title}
            </a>
          );
        })}
      </div>
    </div>
  );
}

function TableOfContentMobile({ toc }) {
  return (
    <div className="flex flex-col justify-center p-5 ">
      <div className="font-semibold mb-1.5 text-gray-800 uppercase">
        Daftar Isi
      </div>
      <div className="space-y-2">
        {toc.map((item) => {
          return (
            <a
              key={item.href}
              className={clsx("block hover:underline  text-gray-700 ", {
                "pl-0": item.level == 2,
                "pl-5": item.level == 3,
              })}
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                document.querySelector(item.href).scrollIntoView({
                  behavior: "smooth",
                });
              }}
            >
              {item.title}
            </a>
          );
        })}
      </div>
    </div>
  );
}
export default function Post({ code, frontmatter, slug, readingTime, toc }) {
  let MDXComponent = React.useMemo(() => getMDXComponent(code), [code]);

  return (
    <Layout>
      <Meta
        {...{
          title: frontmatter.title,
          description: frontmatter.description,
          date: frontmatter.date,
          url: `article/${slug}`,
          thumbnail: frontmatter.thumbnail,
        }}
      ></Meta>
      <article className="mb-10">
        <div className="flex justify-center">
          <div className="md:w-[45%] w-full">
            <Header
              frontmatter={frontmatter}
              readingTime={readingTime}
            ></Header>
          </div>
        </div>

        <div className="relative flex justify-center w-full ">
          {frontmatter.show_toc ? (
            <div className="hidden md:block  w-full"></div>
          ) : null}
          <div className="md:w-[45%] w-full">
            {frontmatter.show_toc ? (
              <div className="border border-gray-200 md:hidden bg-gray-50 rounded">
                <TableOfContentMobile toc={toc}></TableOfContentMobile>
              </div>
            ) : null}
            <div className="prose prose-purple max-w-full mt-5">
              <MDXComponent
                components={{
                  pre: Pre,
                }}
              />
            </div>
          </div>
          <div className="w-full hidden md:block ">
            <div
              className="fixed top-[50%]  border-gray-200 ml-10 pl-5 py-1.5 border-l "
              style={{ transform: "translate(0, -50%)" }}
            >
              <TableOfContent toc={toc}></TableOfContent>
            </div>
          </div>
        </div>
      </article>
      <div className="flex justify-center">
        <div className="md:w-[45%] w-full">
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
            crossorigin="anonymous"
            async
          ></Giscus>
        </div>
      </div>
    </Layout>
  );
}

export async function getStaticProps({ params }) {
  let slug = params.slug;
  let postPath = path.join(process.cwd(), "content", "articles");
  let post = await getPost(postPath, slug);

  return {
    props: post,
  };
}

export async function getStaticPaths() {
  let postPath = path.join(process.cwd(), "content", "articles");
  let paths = await getPaths(postPath);
  return {
    paths,
    fallback: false,
  };
}
