
import { MyTradesTable } from './MyTradesTable';
import { OffersTable } from './OffersTable';
import { TradesTable } from './TradesTable';
import ExpandableTable from './ExpandableTable';

const Market: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-[#76004f] to-[#4b4fa6]">
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Marketplace</h1>

                <ExpandableTable title="Offers">
                    <OffersTable />
                </ExpandableTable>

                <ExpandableTable title="Trades">
                    <TradesTable />
                </ExpandableTable>

                <ExpandableTable title="My Trades">
                    <MyTradesTable />
                </ExpandableTable>
            </div>
        </div>
    );
};

export default Market;