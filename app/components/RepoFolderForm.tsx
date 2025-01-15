import React, { useState } from "react";
import { AuditResponse } from "../utils/types";

interface RepoFormProps {
  onAuditComplete: (auditResult: AuditResponse) => void;
}

export const RepoFolderForm: React.FC<RepoFormProps> = ({
  onAuditComplete,
}) => {
  const [fileContent, setFileContent] = useState<string | null>(null);

  const handleFileSelection = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file?.name === "package-lock.json") {
      const content = await file.text();
      setFileContent(content);
    } else {
      alert("Please select the package-lock.json file.");
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (fileContent) {
      try {
        const response = await fetch("/api/getLocalAudit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: fileContent }),
        });

        if (!response.ok) {
          const { error } = await response.json();
          throw new Error(error);
        }

        const data = await response.json();
        console.log(data);

        onAuditComplete(JSON.parse(data.result));
        alert("Audit complete. Check console for results.");
      } catch (error) {
        console.error("Error:", error);
        alert("An error occurred during the audit.");
      }
    } else {
      alert("Please select the package-lock.json file first.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div className='flex flex-col'>
        <label htmlFor='fileInput' className='text-gray-700 font-medium mb-2'>
          Select Repository Folder:
        </label>
        <input
          type='file'
          id='fileInput'
          className='file:hidden w-full bg-gray-100 p-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500'
          ref={input => {
            if (input) {
              input.setAttribute("webkitdirectory", "true");
              input.setAttribute("mozdirectory", "true");
              input.setAttribute("directory", "true");
            }
          }}
          onChange={handleFileSelection}
        />
      </div>
      <button
        type='submit'
        className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'>
        Audit Repository
      </button>
    </form>
  );
};
