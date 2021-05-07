import React from "react";
import Highlight, { defaultProps } from "prism-react-renderer";
import theme from "prism-react-renderer/themes/nightOwl";
import rangeParser from "parse-numeric-range";

function Code({ children, className, metastring }) {
  if (!className) {
    return <code>{children}</code>;
  }
  const language = className.replace(/language-/, "");

  return (
    <Highlight
      {...defaultProps}
      code={children}
      theme={theme}
      language={language}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre
          className={`${className} overflow-x-auto p-3 rounded`}
          style={style}
        >
          {tokens.map((line, i) => {
            
            if (tokens.length - 1 == i) {
              return null;
            }
            return (
              <div
                className="table-row "
                key={i}
                {...getLineProps({ line, key: i })}
              >
                <span className="table-cell text-sm text-right select-none opacity-50 pr-5">
                  {i + 1}
                </span>
                <span className="table-cell text-sm">
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token, key })} />
                  ))}
                </span>
              </div>
            );
          })}
        </pre>
      )}
    </Highlight>
  );
}

export default Code;
