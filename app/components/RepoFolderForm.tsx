import React, { useReducer } from "react";
import { AuditResponse } from "../utils/types";

interface RepoFormProps {
  onAuditComplete: (auditResult: AuditResponse) => void;
}
interface FileState {
  packageLockJson: string | null;
  packageJson: string | null;
}

type FileAction =
  | {
      type: "setFiles";
      payload: { packageLockJson: string; packageJson: string };
    }
  | { type: "resetFiles" };

const initialState: FileState = {
  packageLockJson: null,
  packageJson: null,
};

const fileReducer = (state: FileState, action: FileAction): FileState => {
  switch (action.type) {
    case "setFiles":
      return {
        ...state,
        packageLockJson: action.payload.packageLockJson,
        packageJson: action.payload.packageJson,
      };
    case "resetFiles":
      return {
        ...state,
        packageLockJson: null,
        packageJson: null,
      };
    default:
      throw new Error(`Unhandled action type`);
  }
};

export const RepoFolderForm: React.FC<RepoFormProps> = ({
  onAuditComplete,
}) => {
  const [state, dispatch] = useReducer(fileReducer, initialState);

  const handleFileSelection = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files) {
      alert("No files selected.");
      return;
    }
    const fileArray = Array.from(files);

    const packageLockFile = fileArray.find(
      file => file.name === "package-lock.json"
    );
    const packageFile = fileArray.find(file => file.name === "package.json");

    if (!packageLockFile || !packageFile) {
      alert("Please select both package-lock.json and package.json files.");
      return;
    }

    const packageLockContent = await packageLockFile.text();
    const packageContent = await packageFile.text();

    dispatch({
      type: "setFiles",
      payload: {
        packageLockJson: packageLockContent,
        packageJson: packageContent,
      },
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (state.packageLockJson && state.packageJson) {
      try {
        const response = await fetch("/api/getLocalAudit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            packageLockJson: state.packageLockJson,
            packageJson: state.packageJson,
          }),
        });

        if (!response.ok) {
          const { error } = await response.json();
          throw new Error(error);
        }

        const data = await response.json();

        onAuditComplete(JSON.parse(data.report));
        alert("Audit complete. Check console for results.");
      } catch (error) {
        console.error("Error:", error);
        alert("An error occurred during the audit.");
      }
    } else {
      alert("Please select both package-lock.json and package.json files.");
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
