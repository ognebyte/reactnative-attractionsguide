import { useState, useEffect } from 'react';
import { View, Image, Dimensions, ScrollView } from 'react-native';
import { Text, TouchableRipple } from 'react-native-paper';
import { useSelector } from "react-redux";
import Carousel from "react-native-reanimated-carousel";
import { useSharedValue } from "react-native-reanimated";
import SkeletonLoading from "../SkeletonLoading";
import Pagination from '../Pagination';


const { width: screenWidth } = Dimensions.get('window');


const AttractionScreen = ({ route, navigation }) => {
    const { attraction } = route.params;
    const attractions = useSelector((state) => state.attractions);
    const progress = useSharedValue(0);
    const [loadedImages, setLoadedImages] = useState({});


    const handleImageLoad = (imageUri) => {
        setLoadedImages((prevState) => ({
            ...prevState,
            [imageUri]: true,
        }));
    };


    return (
        <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
            <Carousel
                data={attraction.images}
                loop={false}
                width={screenWidth}
                height={300}
                mode="parallax"
                modeConfig={{
                    parallaxScrollingScale: 0.9,
                    parallaxScrollingOffset: 75,
                    parallaxAdjacentItemScale: 0.7
                }}
                onProgressChange={(_, absolute) => progress.value = absolute}
                renderItem={({ item }) =>
                    <>
                        {!loadedImages[item] && (
                            <SkeletonLoading key={"skeleton-" + item} />
                        )}
                        <Image
                            key={item}
                            source={{ uri: item }}
                            width={'100%'} height={'100%'}
                            onLoad={() => handleImageLoad(item)}
                            style={{
                                flex: 1, borderRadius: 8,
                                display: !loadedImages[item] ? 'none' : 'flex',
                            }}
                        />
                    </>
                }
            />
            <View style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 8,
            }}>
                {attraction.images.map((_, index) => (
                    <Pagination key={"attraction-image-" + index}
                        progress={progress} index={index}
                    />
                ))}
            </View>
            <View style={{ paddingVertical: 8, paddingHorizontal: 16, gap: 8 }}>
                <Text variant="titleLarge">{attraction.name}</Text>
                <Text variant="bodyMedium">{attraction.description}</Text>
                <Text variant="bodyMedium">{attraction.history}</Text>
            </View>
        </ScrollView>
    );
};

export default AttractionScreen;