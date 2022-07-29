import { CarouselCard } from './components'
import { Avatar, Stack } from '@mui/material'
import { Carousel } from 'react-responsive-carousel'
import 'react-responsive-carousel/lib/styles/carousel.min.css'

interface SlideProps {
  bannerImages: string[]
}

export const Slide: React.FC<SlideProps> = ({ bannerImages }) => {

  return (
    <Stack sx={{ textAlign: 'center', width: '100vw', height: '40vh', marginTop: 3 }} direction='row'>
      <Carousel
        autoPlay
        swipeable
        stopOnHover
        emulateTouch
        infiniteLoop
        interval={6000}
        showArrows={false}
        showStatus={false}
        showThumbs={false}
        className='carousel'
        showIndicators={false}
      >
        {bannerImages.map((item, key) => (
          <CarouselCard key={key}>
            <Avatar
              src={item}
              alt='Banner image'
              variant='square'
              imgProps={{ style: { objectFit: 'contain' } }}
              sx={{
                width: '100%',
                height: '100%',
              }}
            />
          </CarouselCard>
        ))}
      </Carousel>
    </Stack>
  )
}
