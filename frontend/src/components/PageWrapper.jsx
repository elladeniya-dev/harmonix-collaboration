import React from 'react';

const PageWrapper = ({ title, children }) => {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-3xl mx-auto bg-white rounded shadow p-6">
        <h1 className="text-2xl font-bold text-indigo-700 mb-6 text-center">
          {title}
        </h1>
        {children}
      </div>
    </div>
  );
};

export default PageWrapper;
