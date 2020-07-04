/* eslint-disable import/no-unresolved */
/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable import/extensions */
import fs from "fs";
import path from "path";
import React from "react";
import ReactDOMServer from "react-dom/server";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { CookiesProvider } from "react-cookie";
import serialize from "serialize-javascript";
import { getBundles } from "react-loadable-ssr-addon";
import { Capture } from "react-loadable";
import { HelmetProvider } from "react-helmet-async";
import { ServerStyleSheet } from "styled-components";
import { devMiddleware } from "../middleware/webpack";
import manifest from "../../build/react-loadable-ssr-addon.json";
import App from "../../src/App";
import rootReducer from "../../src/reducers";

function getTemplate() {
  if (process.env.NODE_ENV === "production") {
    return fs.readFileSync(path.resolve("src/index.html"), "utf8");
  }

  return devMiddleware.fileSystem.readFileSync(
    path.resolve("src/index.html"),
    "utf8"
  );
}

function render(req, res, preloadedState, routeData) {
  const context = { data: routeData };

  // const { default: App } = require("../../build/app.server");
  // const { default: rootReducer } = require("../../build/rootReducer.server");

  // if (process.env.NODE_ENV !== "production") {
  // delete require.cache[require.resolve("../../build/app.server")];
  // delete require.cache[require.resolve("../../build/rootReducer.server")];
  // }

  const store = createStore(rootReducer, preloadedState);

  const template = getTemplate();

  const modules = [];

  const helmetContext = {};

  const sheet = new ServerStyleSheet();

  const body = ReactDOMServer.renderToString(sheet.collectStyles(
    <Capture report={(moduleName) => modules.push(moduleName)}>
      <HelmetProvider context={helmetContext}>
        <Provider store={store}>
          <CookiesProvider cookies={req.universalCookies}>
            <App ssrLocation={req.url} context={context} />
          </CookiesProvider>
        </Provider>
      </HelmetProvider>
    </Capture>
  ));

  const { helmet } = helmetContext;

  const stylesSC = sheet.getStyleTags();

  const finalState = store.getState();

  const bundles = getBundles(manifest, [
    ...manifest.entrypoints,
    ...Array.from(modules),
  ]);

  const styles = bundles.css || [];
  const scripts = bundles.js || [];

  const html = template
    .replace('<div id="root"></div>', `<div id="root">${body}</div>`)
    .replace("</head>", `${helmet.link.toString()}</head>`)
    .replace("<title>Project</title>", `${helmet.title.toString()}`)
    .replace(
      "</head>",
      `<script>window.__PRELOADED_STATE__=${serialize(
        finalState
      )};</script><script>window.__ROUTE_DATA__=${serialize(
        routeData
      )};</script></head>`
    )
    .replace(
      "</head>",
      `${styles
        .map((style) => `<link href="../../build/${style.file}" rel="stylesheet" />`)
        .join("\n")}</head>`
    )
    .replace(
      "</head>",
      `${stylesSC}</head>`
    )
    .replace(
      "</body>",
      `${scripts
        .map(
          (script) => `<script type="text/babel" src="../../build/${script.file}"></script>`
        )
        .join("\n")}</body>`
    );

  if (context.url) {
    res.redirect(context.status, context.url);
  } else {
    console.log("**********", html);
    res.status(context.status || 200).send(html);
  }
}

export default render;
