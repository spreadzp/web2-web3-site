"use client";
import Tbd from "../../components/tbd";
import { useTbaSiteStore } from "../../hooks/store";
import { WalletInstallation } from "../../hooks/walletInstallation";



function Page() {
    const { walletClient } = useTbaSiteStore();
    return (
        <>
            {!walletClient.chain && <WalletInstallation />}
            <Tbd />

        </>
    );
}

export default Page;
