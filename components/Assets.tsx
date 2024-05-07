import { useState } from "react";
import ExpandableTable from "./ExpandableTable";
import Table from "./Table";
import { Modal } from "./ModalSend";

export const Assets = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSendClick = () => {
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    const handleModalSubmit = (data: any) => {
        console.log('Submitted:', data);
        // Handle the form submission here
    };

    const coinsData = [
        { '#': 1, address: 'Address 1', amount: 100, symbol: 'BNB', name: 'BNB' },
    ];

    const tokensData = [
        { '#': 1, address: 'Address 1', name: 'Token 1', amount: 50 },
    ];

    const nftsData = [
        { '#': 1, name: 'NFT 1', uri: 'http://example.com/nft1', price: 1000, seller: 'Seller 1', nftMetadata: 'Metadata for NFT 1' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#76004f] to-[#4b4fa6]">
            <div className="container mx-auto p-4">


                <ExpandableTable title="Balance coins">
                    <Table data={coinsData} onBuyClick={() => handleSendClick()} />
                    <button onClick={handleSendClick}>Send coins</button>
                </ExpandableTable>

                <ExpandableTable title="Balance tokens">
                    <Table data={tokensData} onBuyClick={() => handleSendClick()} />
                    <button onClick={handleSendClick}>Send tokens</button>
                </ExpandableTable>

                <ExpandableTable title="Balance NFTs">
                    <Table data={nftsData} onBuyClick={() => handleSendClick()} />
                    <button onClick={handleSendClick}>Send NFT</button>
                </ExpandableTable>

                {isModalOpen && (
                    <Modal isOpen={isModalOpen} onClose={handleModalClose} onSubmit={handleModalSubmit} />
                )}
            </div>
        </div>
    );
};