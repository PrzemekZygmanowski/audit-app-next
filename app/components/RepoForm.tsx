import React, { useState } from "react";

interface RepoFormProps {
  onSubmit: (folderPath: string) => void;
}

export const RepoForm: React.FC<RepoFormProps> = ({ onSubmit }) => {
  const [folderPath, setFolderPath] = useState<string>("");

  const handleFolderSelection = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      //trzeba przemapowac pliki w poszukiwaniu package-lock.json i package.json
      const fullPath = files[0].webkitRelativePath;
      console.log("pliki", files[0]);
      const folder = fullPath.substring(0, fullPath.lastIndexOf("/"));
      setFolderPath(fullPath);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (folderPath) {
      onSubmit(folderPath);
    } else {
      alert("Please select a folder first.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div className='flex flex-col'>
        <label htmlFor='folderInput' className='text-gray-700 font-medium mb-2'>
          Select Repository Folder:
        </label>
        <input
          type='file'
          id='folderInput'
          className='file:hidden w-full bg-gray-100 p-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500'
          ref={input => {
            if (input) {
              input.setAttribute("webkitdirectory", "true");
              input.setAttribute("mozdirectory", "true");
              input.setAttribute("directory", "true");
            }
          }}
          onChange={handleFolderSelection}
        />
        {folderPath && (
          <p className='text-gray-600 mt-2'>Selected Folder: {folderPath}</p>
        )}
      </div>
      <button
        type='submit'
        className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'>
        Audit Repository
      </button>
    </form>
  );
};
