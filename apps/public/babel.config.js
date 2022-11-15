module.exports = (api) => {
  api.cache.using(() => process.env.NODE_ENV);
  return {
    presets: [
      [
        "@babel/preset-env",
        {
          modules: false,
          useBuiltIns: "usage",
          corejs: "3.6",
          targets: {
            browsers: "defaults",
          },
        },
      ],
      "@babel/preset-react",
    ],
    plugins: [
      "@babel/plugin-transform-runtime",
      [
        "babel-plugin-direct-import",
        { modules: ["@mui/material", "@mui/icons-material", "@mui/lab"] },
      ],
      !api.env("production") && "react-refresh/babel",
    ],
  };
};
