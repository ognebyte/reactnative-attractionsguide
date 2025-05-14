import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { View, ScrollView, Image, Dimensions } from "react-native";
import { Text, TouchableRipple, useTheme } from 'react-native-paper';
import SkeletonLoading from "../SkeletonLoading";

const { width: screenWidth } = Dimensions.get('window');
const itemSpacing = 4;
const itemWidth = (screenWidth - itemSpacing * 6) / 2;

const AttractionItems = ({ navigation }) => {
    const customTheme = useTheme();
    const attractions = useSelector((state) => state.attractions);
    const [loadedImages, setLoadedImages] = useState({});


    const handleImageLoad = (uri) => {
        setLoadedImages((prev) => {
            if (prev[uri]) return prev;
            return { ...prev, [uri]: true };
        });
    };

    const AttractionItem = ({ children }) => (
        <View style={{ width: itemWidth, gap: itemSpacing }}>
            {children}
        </View>
    );

    return (
        <View style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            columnGap: itemSpacing,
            rowGap: itemSpacing * 2,
            padding: itemSpacing * 2
        }}>
            {(!attractions || attractions.length === 0) ?
                Array(5).fill(null).map((_, index) => (
                    <AttractionItem key={`attraction-skeleton-${index}`}>
                        <SkeletonLoading height={120} />
                        <SkeletonLoading height={16} />
                        <SkeletonLoading height={16} />
                    </AttractionItem>
                ))
                :
                attractions.map((attraction) => (
                    <AttractionItem key={attraction.id}>
                        <TouchableRipple
                            onPress={() => navigation.navigate('Attraction', { attraction })}
                            style={{
                                padding: itemSpacing,
                                borderRadius: 8,
                                backgroundColor: customTheme.colors.elevation.level1,
                                overflow: 'hidden'
                            }}
                            borderless
                        >
                            <View style={{ gap: itemSpacing }}>
                                <View style={{ height: 120, borderRadius: 8, overflow: 'hidden' }}>
                                    {!loadedImages[attraction.images[0]] && <SkeletonLoading />}
                                    <Image
                                        source={{ uri: attraction.images[0] }}
                                        onLoad={() => handleImageLoad(attraction.images[0])}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            display: !loadedImages[attraction.images[0]] ? 'none' : 'flex',
                                        }}
                                    />
                                </View>
                                <Text variant="bodyLarge" numberOfLines={2}>
                                    {attraction.name}
                                </Text>
                            </View>
                        </TouchableRipple>
                    </AttractionItem>
                ))
            }
        </View>
    );
};

export default AttractionItems;