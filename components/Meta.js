import React from "react";
import Head from "next/head";
function Meta({
  title = "Ibnu Musyaffa",
  description = "Tulisan seputar pengembangan perangkat lunak dan teknologi lainnya",
  thumbnail = "default.png",
  url = "",
}) {
  url = process.env.NEXT_PUBLIC_URL + url;
  thumbnail = `${process.env.NEXT_PUBLIC_URL}api/image?title=${encodeURIComponent(title)}&cache=${Math.floor(Date.now() / 1000)}`;
  return (
    <Head>
      <title>{title}</title>
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
      ></meta>
      <meta name="title" content={title} />
      <meta name="description"   content={description ? description : ""} />

      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:site_name" content="ibnu.dev"/>
      <meta name="robots" content="index,follow"/>
      <meta property="og:description"  content={description ? description : ""} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image" content={thumbnail} />
      <meta property="og:image:alt" content={title} />

      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta
        property="twitter:description"
        content={description ? description : ""}
      />
      <meta name="twitter:card" content="summary_large_image"></meta>
      <meta name="twitter:creator" content="@IbnuMusyaffa"></meta>
      <meta property="twitter:image" content={thumbnail} />
    </Head>
  );
}

export default Meta;
