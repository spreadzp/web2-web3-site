import { useCallback, useState } from "react";
import { FaBars } from "react-icons/fa";
import type { Nft } from "../interfaces/components.itypes";
import { proxyUrl } from "../hooks/proxyUrl";
import { useTbaSiteStore } from "../hooks/store";
import * as NFT_CONTRACT from "../app/ABIs/nft.sol.json";

export const DropdownMenu = ({ menuItems}: { menuItems: Nft[] } ) => {
    const  {  setTbaBalance, tbaBalance,  htmlForFrame ,
        setHtmlForFrame, publicClient, selectedNft} = useTbaSiteStore()
    const [isOpen, setIsOpen] = useState(false);
  
    const getPageFromNftUri = useCallback(async (nft: Nft) => { 
        debugger
        if (publicClient && nft.address) {
     
            const uri = await publicClient.readContract({
              address: nft.address as `0x${string}`,
              abi: NFT_CONTRACT.abi,
              functionName: "tokenURI",
              args: [nft.nftId],
            });
            console.log("🚀 ~ getPageFromNftUri ~ uri:", uri)
            if(uri as string ){
              const res = await proxyUrl(`${uri}`)
              setHtmlForFrame(`${res}`);
            }
            
        
        }
    
      },[NFT_CONTRACT.abi, publicClient, selectedNft])
    const toggleMenu = () => {
      setIsOpen(!isOpen);
    }; 
    return (
      <div className="dropdown-menu" >
        <div className="dropdown-toggle" onClick={toggleMenu}>
        <FaBars color="red" size={20}/>  
        </div>
        {isOpen && (
          <ul className={`dropdown-list ${isOpen ? 'open' : ''}`}>
            {menuItems.map((menuItem, index) => (
              <li key={index} onClick={() => getPageFromNftUri(menuItem)}>
                <div className="item-icon">{menuItem.chainId}</div>
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