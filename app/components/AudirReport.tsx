import { AuditResponse } from "../utils/types";

export const AuditReport = (auditResponse: AuditResponse) => {
  const { vulnerabilities, metadata } = auditResponse;

  return (
    <div className='p-8 bg-gray-50 min-h-screen'>
      <h1 className='text-3xl font-bold text-gray-800 mb-6'>Audit Report</h1>

      <div className='bg-white shadow rounded-lg p-6 mb-6'>
        <h2 className='text-2xl font-semibold text-gray-700 mb-4'>Summary</h2>
        <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
          {Object.entries(metadata.vulnerabilities).map(([key, value]) => (
            <div key={key} className='p-4 bg-gray-100 rounded-md'>
              <p className='text-sm font-medium text-gray-500'>{key}</p>
              <p className='text-lg font-bold text-gray-900'>{value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className='bg-white shadow rounded-lg p-6'>
        <h2 className='text-2xl font-semibold text-gray-700 mb-4'>
          Vulnerabilities
        </h2>
        {Object.entries(vulnerabilities).map(([name, details]) => (
          <div key={name} className='mb-6 p-4 bg-gray-100 rounded-md shadow'>
            <h3 className='text-xl font-semibold text-gray-800'>
              {details.name}
            </h3>
            <p className='text-sm text-gray-600 mb-2'>
              Severity:{" "}
              <span
                className={`font-bold ${
                  details.severity === "high"
                    ? "text-red-500"
                    : details.severity === "moderate"
                    ? "text-yellow-500"
                    : "text-gray-500"
                }`}>
                {details.severity}
              </span>
            </p>
            <p className='text-sm text-gray-600 mb-2'>
              Is Direct: {details.isDirect ? "Yes" : "No"}
            </p>
            <p className='text-sm text-gray-600 mb-2'>
              Affected Range: {details.range}
            </p>
            {details.via && (
              <div className='mt-4'>
                <h4 className='text-lg font-semibold text-gray-700'>
                  Details:
                </h4>
                <ul className='list-disc pl-5 text-sm text-gray-600'>
                  {details.via.map((v, index) => (
                    <li key={index} className='mb-2'>
                      <p>
                        <span className='font-medium'>Title:</span> {v.title}
                      </p>
                      <p>
                        <span className='font-medium'>Dependency:</span>{" "}
                        {v.dependency}
                      </p>
                      <p>
                        <span className='font-medium'>Severity:</span>{" "}
                        {v.severity}
                      </p>
                      <a
                        href={v.url}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-blue-500 hover:underline'>
                        Advisory Link
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
