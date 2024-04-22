import { useState } from "react";

 

interface ITab {
  name: string;
  content: React.ReactNode;
}

interface IProps {
  tabs: ITab[];
  onClose?: () => void;
}

const FileEditSource: React.FC<IProps> = ({ tabs, onClose }) => {
  const [activeTab, setActiveTab] = useState(tabs[0].name);

  const handleClick = (tabName: string) => {
    setActiveTab(tabName);
  };

  const renderTabs = () => {
    return tabs.map((tab) => (
      <button
        key={tab.name}
        className={`px-3 py-2 mr-2 ${
          activeTab === tab.name ? 'bg-gray-200 font-medium' : ''
        }`}
        onClick={() => handleClick(tab.name)}
      >
        {tab.name}
      </button>
    ));
  };

  const renderContent = () => {
    const activeContent = tabs.find((tab) => tab.name === activeTab)?.content;
    return activeContent;
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex justify-between p-2">
        <div className="flex">{renderTabs()}</div>
        <button onClick={onClose}>Close</button>
      </div>
      <div className="flex flex-col p-2 border-b border-gray-200">
        {renderContent()}
      </div>
      <div className="flex p-2">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Save
        </button>
      </div>
    </div>
  );
};

export default FileEditSource;
