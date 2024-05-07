import React from 'react';
import type { TableData } from "../interfaces/components.itypes";

type TableProps = {
    data: TableData[];
    onBuyClick?: (item: TableData) => void;
};

const Table: React.FC<TableProps> = ({ data, onBuyClick }) => {
    // Extract headers from the first item in the data array
    const headers = data.length > 0 ? Object.keys(data[0]) : [];

    return (
        <div className="overflow-y-auto h-64">
            <table className="table-auto w-full text-white">
                <thead>
                    <tr>
                        {headers.map((header, index) => (
                            <th key={index} className="border px-4 py-2">
                                {header.charAt(0).toUpperCase() + header.slice(1)}
                            </th>
                        ))}
                        {onBuyClick && <th className="border px-4 py-2">Buy offer</th>}
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={index}>
                            {Object.values(item).map((value, valueIndex) => (
                                <td key={valueIndex} className="border px-4 py-2">
                                    {value}
                                </td>
                            ))}
                            {onBuyClick && (
                                <td className="border px-4 py-2">
                                    <button
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                        onClick={() => onBuyClick(item)}
                                    >
                                        Buy offer
                                    </button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Table;