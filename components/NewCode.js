import SyntaxHighlighter from "react-syntax-highlighter";
// import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function Code({ className, ...props }) {
  var match = /language-(\w+)/.exec(className || "");
  return match ? (
    <SyntaxHighlighter showLineNumbers  language={match[1]} PreTag="div" {...props}  />
  ) : (
    <code className={className} {...props} />
  );
}


export default Code