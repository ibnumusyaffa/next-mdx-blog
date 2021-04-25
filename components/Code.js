import React from "react";
import Highlight, { defaultProps } from "prism-react-renderer";
import theme from "prism-react-renderer/themes/nightOwl";
import rangeParser from "parse-numeric-range";

const calculateLinesToHighlight = (meta) => {
  const RE = /{([\d,-]+)}/;
  if (RE.test(meta)) {
    const strlineNumbers = RE.exec(meta)[1];
    const lineNumbers = rangeParser(strlineNumbers);
    return (index) => lineNumbers.includes(index + 1);
  } else {
    return () => false;
  }
};

function Code({ children, className, metastring }) {
  if (!className) {
    return <code>{children}</code>
  }
  const language = className.replace(/language-/, "");
  const shouldHighlightLine = calculateLinesToHighlight(metastring);
  return (
    <Highlight
      {...defaultProps}
      code={children}
      theme={theme}
      language={language}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre
          className={className}
          style={{ ...style, padding: "15px", overflowX: "auto" }}
        >
          {tokens.map((line, i) => {
            let lineClass = "";
            if (shouldHighlightLine(i)) {
              lineClass = "highlight-line";
            }
            return (
              <div
                className="table-row"
                key={i}
                {...getLineProps({ line, key: i })}
              >
                <span className="table-cell text-right select-none opacity-50 pr-5">
                  {i + 1}
                </span>
                <span className={`table-cell ${lineClass}`}>
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
