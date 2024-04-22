import React from 'react';

interface AboutProps {
  name: string;
  occupation: string;
  description: string;
}

const About: React.FC<AboutProps> = ({ name, occupation, description }) => {
  return (
    <div className="container mx-auto p-4">
      <h1>About</h1>
      <h1 className="text-3xl font-bold mb-4">{name}</h1>
      <h2 className="text-xl mb-2">{occupation}</h2>
      <p className="text-gray-700 text-lg">{description}</p>
    </div>
  );
};

export default About;
