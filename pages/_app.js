import "../styles/globals.css";

import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "@fontsource/roboto/900.css";
import "@fontsource/roboto/400-italic.css";
import "@fontsource/roboto/500-italic.css";

import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/400-italic.css";

import { Analytics } from "@vercel/analytics/react";
import React from "react";

function MyApp({ Component, pageProps }) {
  return (
    <React.Fragment>
      <Component {...pageProps} />
      <Analytics />
    </React.Fragment>
  );
}

export default MyApp;
