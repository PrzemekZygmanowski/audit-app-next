"use client";
import { AuditReport } from "@/app/components/AudirReport";
import { AuditTable } from "@/app/components/AuditTable";
import { PageLayout } from "@/app/components/PageLayout";
import { RepoFolderForm } from "@/app/components/RepoFolderForm";
import { AuditResponse } from "@/app/utils/types";
import { useState } from "react";

export default function Home() {
  const [auditResult, setAuditResult] = useState<AuditResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tableData, setTableData] = useState<any[]>([]);

  return (
    <PageLayout>
      <h1 className='text-3xl font-bold mb-6 text-gray-800'>
        Audit Repository with npm
      </h1>
      <RepoFolderForm onAuditComplete={setAuditResult} />
      {error && <p className='text-red-500 mt-4'>Error: {error}</p>}
      {tableData.length > 0 && <AuditTable audits={tableData} />}
      {auditResult && <AuditReport {...auditResult} />}
    </PageLayout>
  );
}
