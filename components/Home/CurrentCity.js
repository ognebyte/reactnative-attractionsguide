import { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import { View, Image, Dimensions, ScrollView } from 'react-native';
import { Button, Searchbar, Text, TouchableRipple } from 'react-native-paper';
import { useSharedValue } from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";
import SkeletonLoading from "../SkeletonLoading";
import ImageCarousel from '../ImageCarousel';


const { width: screenWidth } = Dimensions.get('window');
const componentHeight = 300;


const CurrentCity = ({ navigate }) => {
    const currentCity = useSelector((state) => state.city);
    const [loadedImages, setLoadedImages] = useState({});


    const handleImageLoad = (uri) => {
        setLoadedImages((prev) => {
            if (prev[uri]) return prev;
            return { ...prev, [uri]: true };
        });
    };


    return (
        <View style={{ height: componentHeight }}>
            <View style={{ flex: 1, position: 'relative' }}>
                {!currentCity ? <SkeletonLoading /> :
                    <ImageCarousel
                        images={currentCity.images}
                        height={componentHeight}
                    />
                }
            </View>
        </View >
    );
};

export default CurrentCity;