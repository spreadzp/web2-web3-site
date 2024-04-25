

import Collaboration from './Collaboration';
import ImageSlider from './ImageSlider';
import Poster from './Poster';

const Landing: React.FC = () => {
    return (<div className="min-h-screen bg-gradient-to-b from-[#76004f] to-[#4b4fa6]">
        <div className="container mx-auto p-4">
            <div className="landing">
                <h1 className="title">Your Site Title</h1>
                <ImageSlider />
                <Poster
                    title="Your site title here."
                    description="Your site description here."
                    imageUrl="https://random.imagecdn.app/500/250"
                />
                <Collaboration />
            </div>
        </div>
    </div>
    );
};

export default Landing;