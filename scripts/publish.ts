import { spawnSync } from "child_process";
import { basename, resolve } from "path";

import { moveSync, readJSONSync, writeJSONSync } from "fs-extra";
import minimist from "minimist";

const argv = minimist(process.argv.slice(2));

const { shouldPublish } = argv;

const PACKAGE_NAME = `@hali/${basename(process.env.INIT_CWD || "")}`;
const MANIFEST_PATH = resolve(process.env.INIT_CWD || "", "package.json");
const MANIFEST_BACKUP_PATH = resolve(
  process.env.INIT_CWD || "",
  "backup.package.json"
);

async function main() {
  spawnSync("yarn", ["workspace", PACKAGE_NAME, "build"], {
    stdio: "inherit",
  });

  const pkg = readJSONSync(MANIFEST_PATH);

  moveSync(MANIFEST_PATH, MANIFEST_BACKUP_PATH, {
    overwrite: true,
  });

  delete pkg.devDependencies;
  delete pkg.scripts;

  writeJSONSync(MANIFEST_PATH, pkg, { spaces: 2 });

  if (shouldPublish) {
    if (shouldPublish === "yes") {
      console.log("Publishing (actually)");
      spawnSync("yarn", ["workspace", PACKAGE_NAME, "npm", "publish"]);
    } else {
      console.log("Publishing (not really)");
    }
  } else {
    console.log("Skipping build");
  }

  moveSync(MANIFEST_BACKUP_PATH, MANIFEST_PATH, {
    overwrite: true,
  });
}

main();
