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
    // Parse the incoming JSON request body
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

    // Step 1: Create the workspace directory
    await fs.mkdir(workspaceDir, { recursive: true });

    // Step 2: Write the package-lock.json and package.json content to files
    await fs.writeFile(packageLockPath, packageLockJson, "utf8");
    await fs.writeFile(packagePath, packageJson, "utf8");
    console.log("Files written to workspace:", {
      packageLockPath,
      packagePath,
    });
    console.log("workspaceDir", workspaceDir);
    const options = { reporter: "json" };
    const arb = new Arborist({ path: workspaceDir });
    const report = await arb.audit();
    const result = load(report, options);
    console.log(result);
    return NextResponse.json({ report: result.report });

    // Step 3: Run `npm audit` to get the audit result
    // const { stdout, stderr } = await execPromise("npm audit --json", {
    //   cwd: workspaceDir,
    // });

    // Step 4: Return the audit results as JSON response
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
    // Clean up the workspace directory after processing
    const workspaceDir = path.join(process.cwd(), "public", "workspace");
    try {
      await fs.rm(workspaceDir, { recursive: true, force: true });
    } catch (cleanupError) {
      console.error("Error cleaning up workspace:", cleanupError);
    }
  }
}
