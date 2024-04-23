import { Item1Icon, Item2Icon } from "./Icons";
import MenuItem from "./MenuItem";


type MenuProps = {
    isOpen: boolean;
    onClose: () => void;
};

const menuItems = [
    {
        icon: <Item1Icon />,
        label: "Home",
        href: "/",
    },
    {
        icon: <Item2Icon />,
        label: "About",
        href: "/about",
    },
];
const ExternalMenu: React.FC<MenuProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={onClose}
        >
            <div className="bg-gray-800 w-64 h-full p-4">
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
