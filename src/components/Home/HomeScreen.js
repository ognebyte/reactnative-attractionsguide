import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Dimensions, ScrollView, View } from "react-native";
import { Button, Text, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import SkeletonLoading from "@/components/SkeletonLoading";
import SearchBarInput from "@components/SearchBarInput.js";
import CategoriesChips from "@components/CategoriesChips.js";
import CurrentCity from "./CurrentCity.js";
import AttractionItem from "./AttractionItem.js";


const { width: screenWidth } = Dimensions.get('window');
const itemSpacing = 4;
const itemWidth = (screenWidth - itemSpacing * 6) / 2;


const HomeScreen = ({ navigation }) => {
    const customTheme = useTheme()
    // @ts-ignore
    const currentCity = useSelector((state) => state.city);
    // @ts-ignore
    const attractions = useSelector(state => state.attractions);
    // @ts-ignore
    const categories = useSelector(state => state.categories);
    const [filteredAttractions, setFilteredAttractions] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');


    useEffect(() => {
        filterAttractions();
    }, [searchQuery, selectedCategory, attractions]);

    const filterAttractions = () => {
        let result = [...attractions];

        if (selectedCategory) {
            result = result.filter(a => a.category === selectedCategory);
        }

        if (searchQuery.trim()) {
            result = result.filter(a =>
                a.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredAttractions(result);
    };

    const renderSkeleton = useCallback((index) => (
        <View key={`attraction-skeleton-${index}`} style={{ width: itemWidth, gap: itemSpacing }}>
            <SkeletonLoading
                // @ts-ignore
                skeletonHeight={120} />
            <SkeletonLoading
                // @ts-ignore
                skeletonHeight={16} />
            <SkeletonLoading
                // @ts-ignore
                skeletonHeight={16} />
        </View>
    ), []);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ alignItems: 'flex-start', margin: 8 }}>
                <Button icon="map-marker" mode="contained-tonal"
                    onPress={() => navigation.navigate('Select City')}
                    style={{ width: 'auto' }}
                >
                    {!currentCity ?
                        <SkeletonLoading
                            // @ts-ignore
                            skeletonWidth={120} skeletonHeight={16} />
                        : currentCity.name
                    }
                </Button>
            </View>

            <ScrollView stickyHeaderIndices={[1]}>
                <View style={{ paddingBottom: 8 }}>
                    <CurrentCity navigation={navigation} />
                </View>

                <View style={{ paddingBottom: 8, backgroundColor: customTheme.colors.background }}>
                    <View style={{ gap: 8 }}>
                        <Text variant="headlineSmall" style={{ paddingHorizontal: 8 }}>Достопримечательности</Text>
                        <View style={{ paddingHorizontal: 8 }}>
                            <SearchBarInput
                                value={searchQuery}
                                onChange={setSearchQuery}
                            />
                        </View>

                        <CategoriesChips
                            categories={categories}
                            selectedCategory={selectedCategory}
                            setSelectedCategory={setSelectedCategory}
                        />
                    </View>
                </View>

                <View style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    gap: itemSpacing * 2,
                    paddingHorizontal: itemSpacing * 2,
                    paddingBottom: 24
                }}>
                    {
                        attractions.length === 0 ?
                            Array(5).fill(null).map((_, index) => renderSkeleton(index))
                            :
                            filteredAttractions.length === 0 ?
                                <Text style={{ textAlign: 'center', width: '100%', marginTop: 20 }}>
                                    Нет достопримечательностей
                                </Text>
                                :
                                filteredAttractions.map((item) =>
                                    <View key={item.id} style={{ width: itemWidth, gap: itemSpacing }}>
                                        <AttractionItem
                                            attraction={item}
                                            onPress={() => navigation.navigate('Attraction', { attraction: item })}
                                        />
                                    </View>
                                )
                    }
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default HomeScreen