import Link from "next/link";

type MenuItemProps = {
    icon: React.ReactNode;
    label: string;
    href: string;
};

const MenuItem: React.FC<MenuItemProps> = ({ icon, label, href }) => {
    return (
        <Link
            href={href}
            legacyBehavior
        >
            <a className="flex items-center p-2 text-white hover:bg-gray">
                {icon}
                <span className="ml-2">{label}</span>
            </a>
        </Link>
    );
};

export default MenuItem;
