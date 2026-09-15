// Runs before `next build` (see package.json "prebuild").
//
// Locally, HARNESS_PATH / ~/harness-engineering is used as-is — this script
// does nothing. On a clean CI/Vercel build, neither exists, so this clones a
// full (non-shallow) copy of the harness repo into .harness-cache/. A full
// clone matters: src/lib/harness.ts runs `git log -- <file>` per skill to
// read real provenance (author, date, commit), and a shallow clone would
// make every file look like it was last touched in the same single commit.
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import os from "node:os";
import path from "node:path";

const HARNESS_REPO_URL =
  process.env.HARNESS_REPO_URL ??
  "https://github.com/MatheusSlvRibeiro/harness-engineering.git";

function main() {
  if (process.env.HARNESS_PATH?.trim()) {
    console.log("[fetch-harness] HARNESS_PATH is set, skipping clone.");
    return;
  }

  const homeClone = path.join(os.homedir(), "harness-engineering");
  if (existsSync(homeClone)) {
    console.log(
      `[fetch-harness] Found local clone at ${homeClone}, skipping clone.`,
    );
    return;
  }

  const target = path.join(
    process.cwd(),
    ".harness-cache",
    "harness-engineering",
  );

  if (existsSync(target)) {
    console.log(`[fetch-harness] ${target} already present, pulling latest.`);
    try {
      execFileSync("git", ["-C", target, "pull", "--ff-only"], {
        stdio: "inherit",
      });
    } catch (error) {
      console.warn(
        "[fetch-harness] git pull failed, keeping existing clone.",
        error.message,
      );
    }
    return;
  }

  console.log(`[fetch-harness] Cloning ${HARNESS_REPO_URL} into ${target}...`);
  execFileSync("git", ["clone", HARNESS_REPO_URL, target], {
    stdio: "inherit",
  });
}

main();
