'use client';
import { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { getIconByName } from "./Icons";
import ExternalMenu from "./ExternalMenu";

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };
    return (
        <header className="  text-white p-4 w-full ">
            <div className="container mx-auto flex place-items-center justify-between">
                <button onClick={toggleMenu}>
                    {getIconByName('Burger')}
                </button>
                <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-[3rem]">


                    <span className="text-[hsl(187,100%,68%)]">
                        Tokenbound account
                    </span>{" "}
                    for any NFT
                </h1>
                <ConnectButton />
            </div>
            <ExternalMenu
                isOpen={isMenuOpen}
                onClose={toggleMenu}
            />
        </header>
    );
}
