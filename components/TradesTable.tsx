import type { TableData } from "../interfaces/components.itypes";
import Table from "./Table";

export const TradesTable: React.FC = () => {
    const tradesData: TableData[] = [
        {
            id: 1,
            name: 'Item 1',
            uri: 'http://example.com/item1',
            price: 150,
            buyer: 'Buyer 1',
            nftMetadata: 'Metadata for Item 1',
            date: '2022-01-01',
        },
        {
            id: 2,
            name: 'Item 2',
            uri: 'http://example.com/item2',
            price: 250,
            buyer: 'Buyer 2',
            nftMetadata: 'Metadata for Item 2',
            date: '2022-01-02',
        },
        // ... add more items as needed
    ];

    return <Table data={tradesData} />;
};