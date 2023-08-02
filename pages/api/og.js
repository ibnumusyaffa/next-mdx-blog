import { ImageResponse } from "@vercel/og";

export const config = {
  runtime: 'edge',
};
 

export default function (req) {


  const { searchParams } = new URL(req.url);

  const hasTitle = searchParams.has('title');
  const heading = hasTitle
      ? searchParams.get('title')?.slice(0, 100)
      : 'My default title';


  const mode = "dark"
  const paint =  "#fff" 

  const fontSize = heading.length > 100 ? "70px" : "90px";

  return new ImageResponse(
    (
      <div
        tw="flex relative flex-col p-12 w-full h-full items-start"
        style={{
          color: paint,
          background:
            mode === "dark"
              ? "linear-gradient(to right, rgb(17, 24, 39), rgb(88, 28, 135), rgb(124, 58, 237))"
              : "white",
        }}
      >
        
        <div tw="flex flex-col flex-1 py-10">
        
          <div
            tw="flex leading-[1.1] text-[80px] font-bold"
            style={{
              fontFamily: "Cal Sans",
              fontWeight: "bold",
              marginLeft: "-3px",
              fontSize,
            }}
          >
            {heading}
          </div>
        </div>
        <div tw="flex items-center w-full justify-between">
          <div
            tw="flex text-3xl"
            style={{ fontFamily: "Inter", fontWeight: "normal" }}
          >
            ibnu.dev
          </div>
          <div
            tw="flex items-center text-3xl"
            style={{ fontFamily: "Inter", fontWeight: "normal" }}
          >
            <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
              <path
                d="M30 44v-8a9.6 9.6 0 0 0-2-7c6 0 12-4 12-11 .16-2.5-.54-4.96-2-7 .56-2.3.56-4.7 0-7 0 0-2 0-6 3-5.28-1-10.72-1-16 0-4-3-6-3-6-3-.6 2.3-.6 4.7 0 7a10.806 10.806 0 0 0-2 7c0 7 6 11 12 11a9.43 9.43 0 0 0-1.7 3.3c-.34 1.2-.44 2.46-.3 3.7v8"
                stroke={paint}
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M18 36c-9.02 4-10-4-14-4"
                stroke={paint}
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <div tw="flex ml-2">github.com/ibnumusyaffa</div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      // fonts: [
      //   {
      //     name: "Inter",
      //     data: fontRegular,
      //     weight: 400,
      //     style: "normal",
      //   },
      //   {
      //     name: "Cal Sans",
      //     data: fontBold,
      //     weight: 700,
      //     style: "normal",
      //   },
      // ],
    }
  );
}
