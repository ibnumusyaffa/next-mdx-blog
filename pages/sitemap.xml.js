import { getPosts } from "../helpers/mdx";
import path from "path";


function generateSiteMap(posts) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
     <!-- Add the static URLs manually -->
     <url>
       <loc>${process.env.NEXT_PUBLIC_URL}</loc>
     </url>
     <url>
       <loc>${process.env.NEXT_PUBLIC_URL}/about</loc>
     </url>
     ${posts
       .map((item) => {
         return `
           <url>
               <loc>${`${process.env.NEXT_PUBLIC_URL}/article/${item.slug}`}</loc>
           </url>
         `;
       })
       .join("")}
   </urlset>
 `;
}

export async function getServerSideProps({ res }) {
  const post_path = path.join(process.cwd(), "content", "articles");
  const posts = await getPosts(post_path);

  // Generate the XML sitemap with the blog data
  const sitemap = generateSiteMap(posts);

  res.setHeader("Content-Type", "text/xml");
  // Send the XML to the browser
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}

export default function SiteMap() {}
