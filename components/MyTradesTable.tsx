import type { TableData } from "../interfaces/components.itypes";
import Table from "./Table";

export const MyTradesTable: React.FC = () => {
    const myTradesData: TableData[] = [
        {
            id: 1,
            name: 'Item 1',
            uri: 'http://example.com/item1',
            price: 175,
            buyer: 'Buyer 1',
            nftMetadata: 'Metadata for Item 1',
        },
        {
            id: 2,
            name: 'Item 2',
            uri: 'http://example.com/item2',
            price: 275,
            buyer: 'Buyer 2',
            nftMetadata: 'Metadata for Item 2',
        },
        // ... add more items as needed
    ];

    return <Table data={myTradesData} />;
};