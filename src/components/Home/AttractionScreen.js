import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';

import { setMapCoordinates } from '@features/store/mapSlice';
import getCategoryNameById from '@utils/getCategoryNameById';

import ImageCarousel from '@/components/ImageCarousel';
import GoBackButton from '@components/GoBackButton';
import GoMapButton from '@components/GoMapButton';


const AttractionScreen = ({ route, navigation }) => {
    const dispatch = useDispatch();
    const { attraction } = route.params;
    // @ts-ignore
    const categories = useSelector(state => state.categories);


    useEffect(() => {
        navigation.setOptions({ title: attraction.name });
    }, [navigation, attraction])

    const handleNavigateToMap = () => {
        dispatch(setMapCoordinates({
            latitude: attraction.location.latitude,
            longitude: attraction.location.longitude,
            attraction: attraction
        }));
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={{ paddingBottom: 50 }} stickyHeaderIndices={[0]}>
                <View style={{ paddingLeft: 8, paddingTop: 8 }}>
                    <GoBackButton navigation={navigation} />
                </View>

                <ImageCarousel
                    images={attraction.images}
                    height={300}
                />
                <View style={{ paddingVertical: 8, paddingHorizontal: 16, gap: 8 }}>
                    <Text variant="titleLarge">{attraction.name}</Text>

                    <Text variant="bodyLarge" style={{ textAlign: 'right', opacity: .4 }}>
                        {getCategoryNameById(categories, attraction.category)}
                    </Text>

                    <Text variant="titleMedium">
                        Описание{'\n'}
                        <Text variant="bodyMedium">
                            {attraction.description}
                        </Text>
                    </Text>

                    <Text variant="titleMedium">
                        История{'\n'}
                        <Text variant="bodyMedium">
                            {attraction.history}
                        </Text>
                    </Text>
                </View>
            </ScrollView>
            <GoMapButton handleButton={handleNavigateToMap} />
        </SafeAreaView>
    );
};

export default AttractionScreen;