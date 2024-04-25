import { HomeIcon, getIconByName } from "./Icons";
import MenuItem from "./MenuItem";


type MenuProps = {
    isOpen: boolean;
    onClose: () => void;
};

const menuItems = [
    {
        icon: getIconByName('Home'),
        label: "Home",
        href: "/",
    },
    {
        icon: getIconByName('Marketplace'),
        label: "Marketplace",
        href: "/marketplace",
    },
    {
        icon: getIconByName('Tba'),
        label: "Token Bound account",
        href: "/token-bound",
    },
    {
        icon: getIconByName('Assets'),
        label: "My assets",
        href: "/assets",
    },
    {
        icon: getIconByName('Help'),
        label: "Help",
        href: "/help",
    },
    {
        icon: getIconByName('About'),
        label: "About",
        href: "/about",
    }
];
const ExternalMenu: React.FC<MenuProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={onClose}
        >
            <div className="bg-gradient-to-b from-[#76004f] to-[#0e0109] w-64 h-full p-4">
                {menuItems.map((item) => (
                    <MenuItem
                        key={item.label}
                        icon={item.icon}
                        label={item.label}
                        href={item.href}
                    />
                ))}
            </div>
        </div>
    );
};

export default ExternalMenu;
