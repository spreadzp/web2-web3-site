

import Collaboration from './Collaboration';
//import ImageSlider from './ImageSlider';
import Poster from './Poster';
import posterImage from './../assets/poster-1.jpg';

const Landing: React.FC = () => {
    return (<div className="min-h-screen bg-gradient-to-b from-[#76004f] to-[#4b4fa6]">
        <div className="container mx-auto p-4">
            <div className="landing">
                <h1 className="title">Your Site Title</h1>
                {/* <ImageSlider /> */}
                <Poster
                    title="ERC-6551 in action"
                    description="Use this application to learn more about ERC-6551."
                    imageUrl={posterImage}
                />
                <Collaboration />
            </div>
        </div>
    </div>
    );
};

export default Landing;