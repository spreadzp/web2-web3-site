import Image from "next/image";

interface PosterProps {
    title: string;
    description: string;
    imageUrl: string;
}

const Poster: React.FC<PosterProps> = ({ title, description, imageUrl }) => {
    return (
        <div className="poster">
            <div className="poster-content">
                <div className="poster-image-container">
                    <Image src={imageUrl} alt={title} className="poster-image" width={1500} height={350} />
                </div>
                <div className="poster-description">
                    <h2>{title}</h2>
                    <p>{description}</p>
                </div>
            </div>
            <div className="poster-background"></div>
        </div>
    );
};

export default Poster;