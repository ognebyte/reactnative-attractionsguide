import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { View, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import getCategoryNameById from '@utils/getCategoryNameById';
import ImageCarousel from '@/components/ImageCarousel';


const AttractionScreen = ({ route, navigation }) => {
    const { attraction } = route.params;
    // @ts-ignore
    const categories = useSelector(state => state.categories);


    useEffect(() => {
        navigation.setOptions({ title: attraction.name });
    }, [navigation, attraction])
    

    return (
        <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
            <ImageCarousel
                images={attraction.images}
                height={300}
            />
            <View style={{ paddingVertical: 8, paddingHorizontal: 16, gap: 8 }}>
                <Text variant="titleLarge">{attraction.name}</Text>

                <Text variant="bodyLarge" style={{ textAlign: 'right', opacity: .4 }}>
                    {getCategoryNameById(categories, attraction.category)}
                </Text>

                <View style={{ gap: 4 }}>
                    <Text variant="titleMedium">
                        Описание:
                    </Text>
                    <Text variant="bodyMedium">
                        {attraction.description}
                    </Text>
                </View>

                <View style={{ gap: 4 }}>
                    <Text variant="titleMedium">
                        История:
                    </Text>
                    <Text variant="bodyMedium">
                        {attraction.history}
                    </Text>
                </View>
            </View>
        </ScrollView>
    );
};

export default AttractionScreen;