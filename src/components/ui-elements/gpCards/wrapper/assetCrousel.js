import { useState } from 'react';
import {
  Carousel,
  CarouselItem,
  CarouselControl,
  CarouselIndicators,
  CarouselCaption,
} from 'reactstrap';

const AssetCrousel = (props) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(0);

  const onExiting = () => {
    setAnimating(true);
  };

  const onExited = () => {
    setAnimating(false);
  };

  const next = () => {
    if (animating) return;
    const nextIndex =
      activeIndex === props.imgs.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(nextIndex);
  };

  const previous = () => {
    if (animating) return;
    const nextIndex =
      activeIndex === 0 ? props.imgs.length - 1 : activeIndex - 1;
    setActiveIndex(nextIndex);
  };

  const goToIndex = (newIndex) => {
    if (animating) return;
    setActiveIndex(newIndex);
  };

  const slides = props.imgs.map((item) => {
    return (
      <CarouselItem onExiting={onExiting} onExited={onExited} key={item.id}>
        <img src={item.src} className="img-fluid w-100" alt={item.id} />
        <CarouselCaption
          captionText={
            <span className="text-white text_shadow">{item.caption}</span>
          }
          captionHeader={
            <span className="text-white text_shadow">{item.header}</span>
          }
        />
      </CarouselItem>
    );
  });
  return (
    <Carousel
      activeIndex={activeIndex}
      next={next}
      previous={previous}
      keyboard={false}
    >
      <CarouselIndicators
        items={props.imgs}
        activeIndex={activeIndex}
        onClickHandler={goToIndex}
      />
      {slides}
      <CarouselControl
        direction="prev"
        directionText="Previous"
        onClickHandler={previous}
      />
      <CarouselControl
        direction="next"
        directionText="Next"
        onClickHandler={next}
      />
    </Carousel>
  );
};

export default AssetCrousel;
