/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
// @ts-check

/** @type {import('@yarnpkg/types')} */
const { defineConfig } = require(`@yarnpkg/types`);
/** @type {import('./package.json') & { devDependencies?: Record<string, string>, dependencies?: Record<string, string> }} */
const pkg = require("./package.json");

const config = defineConfig({
  async constraints({ Yarn }) {
    for (const workspace of Yarn.workspaces()) {
      if (workspace.cwd !== ".") {
        for (const dep of Yarn.dependencies({
          type: "devDependencies",
          workspace,
        })) {
          const { devDependencies, dependencies = {} } = pkg;

          const version = devDependencies[dep.ident] || dependencies[dep.ident];

          if (version) {
            dep.update(version);
          }
        }
      }
    }
  },
});

module.exports = config;
