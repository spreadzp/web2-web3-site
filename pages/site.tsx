import React from 'react';

interface SiteProps {
  name: string;
  occupation: string;
  description: string;
}

const Site: React.FC<SiteProps> = ({ name, occupation, description }) => {
  return (
    <div className="container mx-auto p-4">
      <h1>Site</h1>
      <h1 className="text-3xl font-bold mb-4">{name}</h1>
      <h2 className="text-xl mb-2">{occupation}</h2>
      <p className="text-gray-700 text-lg">{description}</p>
    </div>
  );
};

export default Site;
