import Arborist from "@npmcli/arborist";
import { exec } from "child_process";
import fs from "fs/promises";
import { NextResponse } from "next/server";
import * as load from "npm-audit-report";
import path from "path";
import { promisify } from "util";

const execPromise = promisify(exec);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { packageLockJson, packageJson } = body;

    if (!packageLockJson || !packageJson) {
      return NextResponse.json(
        {
          error:
            "Both package-lock.json and package.json content are required.",
        },
        { status: 400 }
      );
    }

    const workspaceDir = path.join(process.cwd(), "public", "workspace");
    const packageLockPath = path.join(workspaceDir, "package-lock.json");
    const packagePath = path.join(workspaceDir, "package.json");

    await fs.mkdir(workspaceDir, { recursive: true });

    await fs.writeFile(packageLockPath, packageLockJson, "utf8");
    await fs.writeFile(packagePath, packageJson, "utf8");

    const options = { reporter: "json" };
    const arb = new Arborist({ path: workspaceDir });
    const report = await arb.audit();
    const result = load(report, options);

    return NextResponse.json({ report: result.report });

    // const { stdout, stderr } = await execPromise("npm audit --json", {
    //   cwd: workspaceDir,
    // });

    // return NextResponse.json({ result: stdout || stderr });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json(
        { error: "An unknown error occurred" },
        { status: 500 }
      );
    }
  } finally {
    const workspaceDir = path.join(process.cwd(), "public", "workspace");
    try {
      await fs.rm(workspaceDir, { recursive: true, force: true });
    } catch (cleanupError) {
      console.error("Error cleaning up workspace:", cleanupError);
    }
  }
}
