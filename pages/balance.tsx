import React from 'react';
import FileEditSource from '../components/fileEditSource';

interface BalanceProps {
  name: string;
  occupation: string;
  description: string;
}
 

const tabs = [
    {
      name: 'General',
      content: (
        <div>
          <div className="flex items-center mb-2">
            <span className="mr-2">Name:</span>
            <input type="text" className="border border-gray-300 p-2 rounded" />
          </div>
          <div className="flex items-center mb-2">
            <span className="mr-2">Direction:</span>
            <span>Left</span>
          </div>
          <div className="flex items-center">
            <span className="mr-2">Attending?:</span>
            <span>Yes</span>
          </div>
        </div>
      ),
    },
    {
      name: 'Nft List',
      content: (
        <div>
          <p>This is the Nft List content.</p>
        </div>
      ),
    },
    {
        name: 'ERC-20 List',
        content: (
          <div>
            <p>This is the ERC-20 List content.</p>
          </div>
        ),
      },
  ];
  

const Balance: React.FC<BalanceProps> = ({ name, occupation, description }) => {
  return (
    <div className="container mx-auto p-4">
      <h1>Balance</h1>
      <FileEditSource tabs={tabs} />
      <h1 className="text-3xl font-bold mb-4">{name}</h1>
      <h2 className="text-xl mb-2">{occupation}</h2>
      <p className="text-gray-700 text-lg">{description}</p>
    </div>
  );
};

export default Balance;
