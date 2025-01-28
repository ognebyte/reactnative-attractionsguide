import { useState, useEffect } from 'react';
import { View, Image, Dimensions, ScrollView } from 'react-native';
import { Text, TouchableRipple } from 'react-native-paper';
import { useSelector } from "react-redux";
import Carousel from "react-native-reanimated-carousel";
import { useSharedValue } from "react-native-reanimated";
import SkeletonLoading from "../SkeletonLoading";
import Pagination from '../Pagination';


const { width: screenWidth } = Dimensions.get('window');


const CityScreen = ({ route, navigation }) => {
    const { city } = route.params;
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
                data={city.images}
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
                {city.images.map((_, index) => (
                    <Pagination key={"city-image-" + index}
                        progress={progress} index={index}
                    />
                ))}
            </View>
            <View style={{ paddingVertical: 8, paddingHorizontal: 16, gap: 8 }}>
                <Text variant="titleLarge">{city.name}</Text>
                <Text variant="bodyLarge">Основан: {city.founded}</Text>
                <Text variant="bodyLarge">Площадь: {city.area}</Text>
                <Text variant="bodyLarge">Население: {city.population}</Text>
                <Text variant="bodyMedium">{city.description}</Text>
                <Text variant="bodyMedium">{city.history}</Text>
            </View>
            <Text variant="titleLarge" style={{ paddingHorizontal: 16, marginTop: 16 }}>Что посмотреть</Text>
            <ScrollView
                horizontal={true}
                contentContainerStyle={{ padding: 8, gap: 4 }}
                showsHorizontalScrollIndicator={false}
            >
                {attractions?.filter((attraction) => attraction.city_id === city.id).map((attraction) =>
                    <TouchableRipple key={attraction.id}
                        style={{ width: 200, borderRadius: 8, padding: 8, gap: 8 }}
                        onPress={() => navigation.navigate('Attraction', { attraction })}
                    >
                        <>
                            <View style={{ height: 120 }}>
                                {!loadedImages[attraction.images[0]] && (
                                    <SkeletonLoading />
                                )}
                                <Image
                                    source={{ uri: attraction.images[0] }}
                                    width={'100%'} height={'100%'}
                                    onLoad={() => handleImageLoad(attraction.images[0])}
                                    style={{
                                        flex: 1, borderRadius: 8,
                                        display: !loadedImages[attraction.images[0]] ? 'none' : 'flex',
                                    }}
                                />
                            </View>
                            <Text variant="titleMedium" numberOfLines={2}>
                                {attraction.name}
                            </Text>
                        </>
                    </TouchableRipple>
                )}
            </ScrollView>
        </ScrollView>
    );
};

export default CityScreen;