import { useEffect, useRef, useState } from 'react';
import { Dimensions, View, Image, ScrollView } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useSharedValue } from 'react-native-reanimated';
import Carousel, { Pagination } from "react-native-reanimated-carousel";
import SkeletonLoading from './SkeletonLoading';



const { width: screenWidth } = Dimensions.get('window');


const ImageLeftAlign = ({ images }) => {
    const [loadedImages, setLoadedImages] = useState({});
    const [imageWrapperWidth, setImageWrapperWidth] = useState(128);
    const [imageWrapperHeight, setImageWrapperHeight] = useState(128);

    useEffect(() => {
        if (images.length === 1) setImageWrapperWidth(screenWidth - 16)
        if (images.length === 2) setImageWrapperWidth((screenWidth / 2) - 16)
        if (images.length >= 3) setImageWrapperWidth(128)
    }, [images])

    const handleImageLoad = (uri) => {
        setLoadedImages((prev) => ({ ...prev, [uri]: true }));
    };

    return (
        <ScrollView
            horizontal={true}
            contentContainerStyle={{ paddingHorizontal: 8, gap: 8 }}
            showsHorizontalScrollIndicator={false}
        >
            {images.map((image) => (
                <View
                    key={`map-attraction-image-${image}`}
                    style={{ width: imageWrapperWidth, height: imageWrapperHeight }}
                >
                    {!loadedImages[image] && <SkeletonLoading />}
                    <Image
                        source={{ uri: image }}
                        style={{
                            minWidth: imageWrapperWidth,
                            minHeight: imageWrapperHeight,
                            borderRadius: 8,
                            display: !loadedImages[image] ? 'none' : 'flex',
                        }}
                        onLoad={() => handleImageLoad(image)}
                    />
                </View>
            ))}
        </ScrollView>
    );
};

export default ImageLeftAlign;