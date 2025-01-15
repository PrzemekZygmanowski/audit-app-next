import { exec } from "child_process";
import fs from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";
import { promisify } from "util";

const execPromise = promisify(exec);

export async function POST(request: Request) {
  try {
    // Parse the incoming JSON request body
    const body = await request.json();
    const { content } = body;

    if (!content) {
      return NextResponse.json(
        { error: "No file content provided." },
        { status: 400 }
      );
    }

    const workspaceDir = path.join(process.cwd(), "public", "workspace");
    const packageLockPath = path.join(workspaceDir, "package-lock.json");

    // Step 1: Create the workspace directory
    await fs.mkdir(workspaceDir, { recursive: true });

    // Step 2: Write the package-lock.json content to the file
    await fs.writeFile(packageLockPath, content, "utf8");
    console.log("packageLockPath", packageLockPath);
    // Step 3: Run `npm audit` to get the audit result
    const { stdout, stderr } = await execPromise("npm audit --json", {
      cwd: workspaceDir,
    });

    // Step 4: Return the audit results as JSON response
    return NextResponse.json({ result: stdout || stderr });
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
