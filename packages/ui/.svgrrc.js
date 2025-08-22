const template = (variables, { tpl }) => {
  variables.exports.forEach(
    (e) => (e.declaration.name = e.declaration.name.replace(/^Svg/, "Icon"))
  );

  return tpl`
${variables.imports};

${variables.interfaces};

const ${variables.componentName.replace(/^Svg/, "Icon")} = (${variables.props}) => (
  ${variables.jsx}
);

${variables.exports};
`;
};

const attrs = ["fill", "stroke"];

module.exports = {
  svgo: true,
  svgoConfig: {
    plugins: [
      // keep defaults (optional)
      "preset-default",
      // custom replacer
      {
        name: "fillStrokeToCurrentColor",
        type: "visitor",
        fn: () => ({
          element: {
            enter: (node) => {
              if (!node.attributes) return;
              const hasAllAttrs = attrs.every((attr) => node.attributes[attr]);
              const allAttrsSame = attrs.every(
                (attr) => node.attributes[attr] === node.attributes[attrs[0]]
              );
              // Replace attribute form: <path fill="#000" stroke="...">
              attrs.forEach((attr) => {
                const v = node.attributes[attr];
                if (!v) return;
                // don't touch none or gradient/paint servers like url(#id)
                if (v === "none" || /^url\(/i.test(v)) return;
                node.attributes[attr] =
                  hasAllAttrs && !allAttrsSame
                    ? `var(--${attr})`
                    : "currentColor";
              });

              // Replace inline style form: <path style="fill:#000;stroke:#333">
              const s = node.attributes.style;
              if (s) {
                node.attributes.style = s
                  .replace(
                    /(^|;)\s*fill\s*:\s*(?!none)(?!url\()[^;]+/gi,
                    "$1fill:currentColor"
                  )
                  .replace(
                    /(^|;)\s*stroke\s*:\s*(?!none)(?!url\()[^;]+/gi,
                    "$1stroke:currentColor"
                  );
              }
            },
          },
        }),
      },
    ],
  },
  template,
};
