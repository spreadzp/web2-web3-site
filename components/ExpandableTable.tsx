import { useState } from "react";


type ExpandableTableProps = {
    title: string;
    children: React.ReactNode;
};

const ExpandableTable: React.FC<ExpandableTableProps> = ({ title, children }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpansion = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className="mb-4" >
            <h2 className="text-xl font-semibold mb-2 cursor-pointer" onClick={toggleExpansion} >
                {title} {isExpanded ? '▲' : '▼'}
            </h2>
            {isExpanded && children}
        </div>
    );
};

export default ExpandableTable;