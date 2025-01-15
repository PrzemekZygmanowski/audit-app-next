import Arborist from "@npmcli/arborist";
import * as load from "npm-audit-report";

import { NextResponse } from "next/server";

interface AuditRequestBody {
  repo: string;
}

interface AuditResult {
  report: any;
  exitCode: number;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const repoPath = body.repo;

    const options = { reporter: "json" };
    const arb = new Arborist({ path: repoPath });
    const report = await arb.audit();

    const result = load(report, options);

    return NextResponse.json({ report: result.report });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json(
        { error: "An unknown error occurred" },
        { status: 500 }
      );
    }
  }
}
