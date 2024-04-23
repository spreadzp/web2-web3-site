
import { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { BurgerIcon } from "./Icons";
import ExternalMenu from "./ExternalMenu";

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };
    return (
        <header className="  text-white p-4 w-full ">
            <div className="container mx-auto flex place-items-center justify-between">
                {/* Burger icon */}
                <button onClick={toggleMenu}>
                    <BurgerIcon />
                </button>
                {/* Site name */}
                <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-[3rem]">

                    Check{" "}
                    <span className="text-[hsl(187,100%,68%)]">
                        tokenbound account
                    </span>{" "}
                    for any NFT
                </h1>
                {/* Connect button */}
                <ConnectButton />
            </div>
            <ExternalMenu
                isOpen={isMenuOpen}
                onClose={toggleMenu}
            />
        </header>
    );
}
