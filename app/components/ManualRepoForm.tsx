"use client";
import { useState } from "react";

interface RepoFormProps {
  onSubmit: (repoPath: string) => void;
}

export const ManualRepoForm = ({ onSubmit }: RepoFormProps) => {
  const [repoPath, setRepoPath] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (repoPath.trim()) {
      onSubmit(repoPath.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className='flex flex-col space-y-4'>
      <label htmlFor='repoPath' className='text-lg font-medium text-gray-700'>
        Repository Path:
      </label>
      <input
        id='repoPath'
        type='text'
        value={repoPath}
        onChange={e => setRepoPath(e.target.value)}
        placeholder='Enter the repository path'
        required
        className='border border-gray-300 rounded-md px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
      />
      <button
        type='submit'
        className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'>
        Run Audit
      </button>
    </form>
  );
};
