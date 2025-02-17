/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
// @ts-check

const semver = require("semver");

const { defineConfig } = require(`@yarnpkg/types`);
/** @type {import('./package.json') & { devDependencies?: Record<string, string>, dependencies?: Record<string, string>, peerDependencies?: Record<string, string> }} */
const pkg = require("./package.json");

const config = defineConfig({
  async constraints({ Yarn }) {
    for (const workspace of Yarn.workspaces()) {
      if (workspace.cwd !== ".") {
        const dependencies = Yarn.dependencies({
          workspace,
        });

        for (const dep of dependencies) {
          const rootVersion =
            pkg.dependencies?.[dep.ident] || pkg.devDependencies?.[dep.ident];

          if (rootVersion) {
            dep.update(rootVersion);
            continue;
          }

          if (dep.type === "devDependencies") {
            const peerVersion = dependencies.find(
              (d) => d.ident === dep.ident && d.type === "peerDependencies"
            )?.range;

            if (peerVersion && !semver.satisfies(dep.range, peerVersion)) {
              const newPeerVersion = semver
                .minVersion(peerVersion, {
                  loose: true,
                })
                ?.format();
              dep.update(newPeerVersion || "");
              continue;
            }
          }
        }
      }
    }
  },
});

module.exports = config;
