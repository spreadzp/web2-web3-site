"use client";

import "../styles/global.css";
import "@rainbow-me/rainbowkit/styles.css";
import Tbd from "../components/tbd";
import { WalletInstallation } from "../hooks/walletInstallation";
import { useTbaSiteStore } from "../hooks/store";
import Header from "../components/Header";
import Footer from "../components/Footer";

function Page() {
  const { walletClient } = useTbaSiteStore();
  return (
    <>
      <div className="flex   flex-col items-start justify-between bg-gradient-to-b from-[#76004f] to-[#15162c]">
        <Header />
      </div>
      {!walletClient.chain && <WalletInstallation />}
      <Tbd />
      <Footer />
    </>
  );
}

export default Page;
