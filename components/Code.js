import React from "react";
import Highlight, { defaultProps } from "prism-react-renderer";
import theme from "prism-react-renderer/themes/dracula";
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

function Code({ children, className, ...other }) {
  if (!className) {
    return (
      <code className="text-pink-700 clear-both py-0.5 bg-pink-50 px-2 text-sm">
        {children}
      </code>
    );
  }
  const language = className.replace(/language-/, "");
  const shouldHighlightLine = calculateLinesToHighlight(other.line);

  return (
    <React.Fragment>
      {other.filename ? (
        <div
          style={{
            backgroundColor: "rgb(40, 42, 54)",
          }}
          className="px-3 rounded-t-md text-sm py-2 border-b border-gray-700 text-gray-300"
        >
          File : {other.filename}
        </div>
      ) : null}

      <Highlight
        {...defaultProps}
        code={children}
        theme={theme}
        language={language}
      >
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre
            className={`${className} overflow-x-auto p-3  -mx-5 md:mx-0 md:rounded-b-md ${
              other.filename ? "" : "md:rounded-t-md"
            }`}
            style={style}
          >
            {tokens.map((line, i) => {
              if (tokens.length - 1 == i) {
                return null;
              }

              let highLighClass = shouldHighlightLine(i)
                ? "highlight-line"
                : null;
              return (
                <div
                  key={i}
                  {...getLineProps({ line, key: i })}
                  className={`table-row ${highLighClass}`}
                >
                  <span className="table-cell text-sm text-right select-none opacity-50 pr-5">
                    {i + 1}
                  </span>
                  <span className={`table-cell text-sm`}>
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
    </React.Fragment>
  );
}

export default Code;
