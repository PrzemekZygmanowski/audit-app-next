"use client";
import { useState } from "react";
import { AuditReport } from "./components/AudirReport";
import { AuditTable } from "./components/AuditTable";
import { PageLayout } from "./components/PageLayout";
import { RepoForm } from "./components/RepoForm";
import { AuditResponse } from "./utils/types";

export default function Home() {
  const [auditResult, setAuditResult] = useState<AuditResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tableData, setTableData] = useState<any[]>([]);

  const handleAudit = async (repoPath: string) => {
    console.log("repoPath", repoPath);
    try {
      setError(null);
      setAuditResult(null);

      const response = await fetch("/api/auditor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repo: repoPath }),
      });

      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error);
      }

      const data = await response.json();

      const tableData = JSON.parse(data.report).metadata;
      const formattedTableData = [
        {
          projectId: repoPath || "N/A",
          metadata: tableData,
          onViewReport: () => {
            setAuditResult(JSON.parse(data.report));
          },
        },
      ];

      setTableData(formattedTableData);
      setAuditResult(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <PageLayout>
      <h1 className='text-3xl font-bold mb-6 text-gray-800'>
        Audit Repository with npm
      </h1>
      <RepoForm onSubmit={handleAudit} />
      {error && <p className='text-red-500 mt-4'>Error: {error}</p>}
      {tableData.length > 0 && <AuditTable audits={tableData} />}
      {auditResult && <AuditReport {...auditResult} />}
    </PageLayout>
  );
}
