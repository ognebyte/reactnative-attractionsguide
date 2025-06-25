import { useRef, useState } from 'react';
import { Dimensions, View, Image } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useSharedValue } from 'react-native-reanimated';
import Carousel, { Pagination } from "react-native-reanimated-carousel";
import SkeletonLoading from './SkeletonLoading';
import ImageView from './ImageView';



const { width: screenWidth } = Dimensions.get('window');
const paginationHeight = 2;


const ImageCarousel = ({ images, width = screenWidth, height, pagination = true }) => {
    const customTheme = useTheme();
    const carouselRef = useRef(null);
    const progress = useSharedValue(0);


    const onPressPagination = (index) => {
        if (carouselRef.current) {
            carouselRef.current.scrollTo({ index, animated: true });
        }
    };

    return (
        <View style={{ flex: 1, gap: 4 }}>
            <Carousel ref={carouselRef}
                data={images}
                width={width}
                height={(pagination ? (height - paginationHeight - 4) : height)}
                mode="parallax"
                loop
                modeConfig={{
                    parallaxScrollingScale: 0.93,
                    parallaxScrollingOffset: 70,
                    parallaxAdjacentItemScale: 0.7
                }}
                onProgressChange={progress}
                renderItem={({ item }) => (
                    <ImageView key={item} uri={item} imgWrapperHeight={'100%'} />
                )}
            />
            {
                !pagination ? null :
                    <Pagination.Basic
                        progress={progress}
                        data={images}
                        dotStyle={{
                            width: 16, height: paginationHeight, backgroundColor: customTheme.colors.inverseOnSurface,
                        }}
                        activeDotStyle={{
                            overflow: 'hidden', backgroundColor: customTheme.colors.onSurface,
                        }}
                        containerStyle={{ gap: 4 }}
                        onPress={onPressPagination}
                        horizontal
                    />
            }
        </View>
    );
};

export default ImageCarousel;