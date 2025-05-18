import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { View, ScrollView } from 'react-native';
import { IconButton, Text, useTheme } from 'react-native-paper';
import getCategoryNameById from '@utils/getCategoryNameById';
import ImageCarousel from '@/components/ImageCarousel';
import { SafeAreaView } from 'react-native-safe-area-context';
import GoBackButton from '@components/GoBackButton';


const AttractionScreen = ({ route, navigation }) => {
    const { attraction } = route.params;
    // @ts-ignore
    const categories = useSelector(state => state.categories);


    useEffect(() => {
        navigation.setOptions({ title: attraction.name });
    }, [navigation, attraction])


    return (
        <SafeAreaView>
            <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
                <GoBackButton navigation={navigation} />
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
        </SafeAreaView>
    );
};

export default AttractionScreen;