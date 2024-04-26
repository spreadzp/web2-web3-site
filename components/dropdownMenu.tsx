import { useCallback, useState } from "react";
import { FaBars } from "react-icons/fa";
import type { Nft } from "../interfaces/components.itypes";
import { proxyUrl } from "../hooks/proxyUrl";
import { useTbaSiteStore } from "../hooks/store";
import * as NFT_CONTRACT from "../app/ABIs/nft.sol.json";
import { getIconByName } from "./Icons";

export const DropdownMenu = ({ menuItems }: { menuItems: Nft[] }) => {
  const {
    setHtmlForFrame,
    publicClient,
  } = useTbaSiteStore();
  const [isOpen, setIsOpen] = useState(false);

  const getPageFromNftUri = useCallback(
    async (nft: Nft) => {
      debugger;
      if (publicClient && nft.address) {
        const uri =
          nft.link ??
          (await publicClient.readContract({
            address: nft.address as `0x${string}`,
            abi: NFT_CONTRACT.abi,
            functionName: "tokenURI",
            args: [nft.nftId],
          }));
        console.log("🚀 ~ getPageFromNftUri ~ uri:", uri);
        if (uri as string) {
          const res = await proxyUrl(`${uri}`);
          setHtmlForFrame(`${res}`);
        } else {
          alert("No metadata found for this NFT");
        }
      } else {
        setHtmlForFrame(``);
      }
    },
    [publicClient, setHtmlForFrame]
  );
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  const getChainIcon = (chainId: string | undefined) => {
    const chainName = chainId === '97' ? 'Bsc' : 'Home'
    let icon = getIconByName(chainName)
    // const chainIdNumbered = Number(chainId);
    // if (chainIdNumbered) {

    //   if ([97].includes(chainIdNumbered)) {
    //     console.log("🚀 ~ getChainIcon ~ chainIdNumbered:", chainIdNumbered)
    //     icon = <BscIcon />;
    //   }
    //   if ([1].includes(chainIdNumbered)) {
    //     icon = <EthIcon />;
    //   }
    //   else {
    //     icon = <HomeIcon />
    //   }
    // }
    return icon;
  };
  return (
    <div className="dropdown-menu">
      <div
        className="dropdown-toggle"
        onClick={toggleMenu}
      >
        <FaBars
          color="red"
          size={20}
        />
      </div>
      {isOpen && (
        <ul className={`dropdown-list ${isOpen ? "open" : ""}`}>
          {menuItems.map((menuItem, index) => (
            <li
              key={index}
              onClick={() => getPageFromNftUri(menuItem)}
            >
              {getChainIcon(menuItem.chainId)}
              <div className="item-title">{menuItem.title}</div>
              <div className="item-nftId">{menuItem.nftId}</div>
              <div className="item-description">{menuItem.description}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
