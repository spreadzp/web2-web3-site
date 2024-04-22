import { ConnectButton } from '@rainbow-me/rainbowkit';
import '../styles/global.css';
import '@rainbow-me/rainbowkit/styles.css';
import Tbd from '../components/tbd';

function Page() {
  return (
    <>
     <div
       className="flex   flex-col items-end justify-center bg-gradient-to-b from-[#76004f] to-[#15162c]"
    >
      <ConnectButton />
    </div>
    <Tbd />
    </>
   
  );
}

export default Page;
