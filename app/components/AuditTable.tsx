import React from "react";

interface AuditMetadata {
  vulnerabilities: {
    info: number;
    low: number;
    moderate: number;
    high: number;
    critical: number;
    total: number;
  };
}

interface AuditReportProps {
  projectId: string;
  metadata: AuditMetadata;
  onViewReport: () => void;
}

export const AuditTable: React.FC<{ audits: AuditReportProps[] }> = ({
  audits,
}) => {
  return (
    <div className='p-4'>
      <h2 className='text-xl font-bold mb-4'>Audit Reports</h2>
      <table className='w-full border-collapse border border-gray-200 text-left'>
        <thead>
          <tr className='bg-gray-100'>
            <th className='border border-gray-300 px-4 py-2'>Project</th>
            <th className='border border-gray-300 px-4 py-2'>
              Total Vulnerabilities
            </th>
            <th className='border border-gray-300 px-4 py-2'>Low</th>
            <th className='border border-gray-300 px-4 py-2'>Moderate</th>
            <th className='border border-gray-300 px-4 py-2'>High</th>
            <th className='border border-gray-300 px-4 py-2'>Critical</th>
            <th className='border border-gray-300 px-4 py-2'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {audits.map(audit => (
            <tr key={audit.projectId} className='hover:bg-gray-50'>
              <td className='border border-gray-300 px-4 py-2'>
                {audit.projectId}
              </td>
              <td className='border border-gray-300 px-4 py-2'>
                {audit.metadata.vulnerabilities.total}
              </td>
              <td className='border border-gray-300 px-4 py-2'>
                {audit.metadata.vulnerabilities.low}
              </td>
              <td className='border border-gray-300 px-4 py-2'>
                {audit.metadata.vulnerabilities.moderate}
              </td>
              <td className='border border-gray-300 px-4 py-2'>
                {audit.metadata.vulnerabilities.high}
              </td>
              <td className='border border-gray-300 px-4 py-2'>
                {audit.metadata.vulnerabilities.critical}
              </td>
              <td className='border border-gray-300 px-4 py-2'>
                <button
                  onClick={audit.onViewReport}
                  className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-3 rounded'>
                  View Report
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
