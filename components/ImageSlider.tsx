import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Image from 'next/image';

const ImageSlider: React.FC = () => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
    };

    return (
        <div className="image-slider">
            <Slider {...settings}>
                <div>
                    <Image src="https://random.imagecdn.app/500/300" alt="Image 1" width={1500} height={300} />
                </div>
                <div>
                    <Image src="https://random.imagecdn.app/500/300" alt="Image 1" width={1500} height={300} />
                </div>
                <div>
                    <Image src="https://random.imagecdn.app/500/300" alt="Image 1" width={1500} height={300} />
                </div>
                <div>
                    <Image src="https://random.imagecdn.app/500/300" alt="Image 1" width={1500} height={300} />
                </div>
                <div>
                    <Image src="https://random.imagecdn.app/500/300" alt="Image 1" width={1500} height={300} />
                </div>

            </Slider>
        </div>
    );
};

export default ImageSlider;