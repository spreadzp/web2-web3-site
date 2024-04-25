import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css'; // Import the CSS for tooltips 
import { FaGithub, FaTelegram, FaDiscord } from 'react-icons/fa';


const socialNetworks = [

    { name: 'GitHub', link: 'https://github.com/' },
    { name: 'Telegram', link: 'https://telegram.org/' },
    { name: 'Discord', link: 'https://discord.com/' },
];

const getIconByName = (name: string) => {
    switch (name) {
        case 'GitHub':
            return <FaGithub size={32} color="white" />;
        case 'Telegram':
            return <FaTelegram size={32} color="white" />;
        case 'Discord':
            return <FaDiscord size={32} color="white" />;
        default:
            return null; // or a default icon if you have one
    }
};
export const SocialNetworks = () => (
    <div className="w-full flex justify-between items-center">
        <div className=" w-80 flex justify-around">
            {socialNetworks.map((network, index) => (
                <a
                    key={index}
                    href={network.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-tooltip-id="social-tooltip"
                    data-tooltip-content={network.name}
                >{getIconByName(network.name)}

                </a>
            ))}
            <Tooltip id="social-tooltip" />
        </div>
        <div className="w-40 text-right text-white">© 2024 Caravan LTD</div>
    </div>
);
