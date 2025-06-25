import { useCallback, useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { FlatList, View, RefreshControl, Dimensions } from "react-native";
import { Text, useTheme, Searchbar, IconButton, TouchableRipple, Snackbar, Portal } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';

import calculateDistanceByCoordinates from "@utils/calculateDistanceByCoordinates";
import getObjectFromArrayByValue from "@utils/getObjectFromArrayByValue";
import SkeletonLoading from "@components/Layouts/SkeletonLoading";
import ImageView from "@components/Layouts/ImageView";
import ChipItem from "@components/Layouts/ChipItem";
import AttractionItem from "./AttractionItem";

const { width: screenWidth } = Dimensions.get('window');
const ITEM_SPACING = 8;
const ITEM_WIDTH = (screenWidth - ITEM_SPACING * 3) / 2;
const viewModes = [
    {
        id: 'all',
        label: 'Все',
        icon: 'view-grid',
    },
    {
        id: 'favorites',
        label: 'Избранные',
        icon: 'star',
    },
    {
        id: 'nearby',
        label: 'Рядом',
        icon: 'map-marker-radius',
    }
];


const HomeScreen = ({ navigation }) => {
    const theme = useTheme();
    const currentCity = useSelector((state) => state.city);
    const currentUser = useSelector((state) => state.user);
    const attractions = useSelector(state => state.attractions);
    const categories = useSelector(state => state.categories);

    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState('all');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarText, setSnackbarText] = useState('');


    useEffect(() => {
        if (viewMode === 'nearby') {
            getLocation();
        }
    }, [viewMode]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        if (viewMode === 'nearby') getLocation();

        setTimeout(() => setRefreshing(false), 1000);
    }, []);

    // Получение геолокации
    const getLocation = async () => {
        try {
            // запрос разрешения на доступ к геолокации
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status === 'granted') {
                // запрос на текущее местоположение, если не включена GPS предлагает включить его
                const location = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.Balanced
                });
                setUserLocation({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude
                });
            }
        } catch (error) {
            setSnackbarText('Пожалуйста включите геолокацию');
            setSnackbarVisible(true);
        }
    };

    // Мемоизация обработанных данных
    const processedAttractions = useMemo(() => {
        if (!attractions.length) return [];

        let result = attractions.map(attraction => ({
            ...attraction,
            distance: userLocation ? calculateDistanceByCoordinates(
                userLocation.latitude,
                userLocation.longitude,
                attraction.location.latitude,
                attraction.location.longitude
            ) : null
        }));

        // Фильтрация по режиму просмотра
        switch (viewMode) {
            case 'favorites':
                if (currentUser.user?.favorites) {
                    const favoriteIds = currentUser.user.favorites.map(fav => fav.attraction_id);
                    result = result.filter(attraction => favoriteIds.includes(attraction.id));
                } else {
                    result = []
                }
                break;
            case 'nearby':
                result = result
                    .filter(attraction => attraction.distance && attraction.distance <= 10)
                    .sort((a, b) => a.distance - b.distance);
                break;
        }

        // Фильтрация по категории
        if (selectedCategory) {
            result = result.filter(a => a.category === selectedCategory);
        }

        // Поиск
        if (searchQuery.trim()) {
            result = result.filter(a =>
                a.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        return result;
    }, [attractions, viewMode, currentUser.user?.favorites, selectedCategory, searchQuery, userLocation]);

    const renderItem = ({ item, index }) => (
        <View style={{ width: ITEM_WIDTH }}>
            <AttractionItem
                attraction={item}
                onPress={() => navigation.navigate('HomeAttraction', { attraction: item })}
                isFavorite={
                    currentUser.user &&
                    getObjectFromArrayByValue(currentUser.user.favorites, 'attraction_id', item.id)
                }
                distance={viewMode === 'nearby' ? item.distance : null}
            />
        </View>
    );

    const renderEmpty = () => (
        <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 60
        }}>
            <Text variant="headlineSmall" style={{
                textAlign: 'center',
                opacity: 0.6,
                marginBottom: 8
            }}>
                {getEmptyMessage()}
            </Text>
            <Text variant="bodyMedium" style={{
                textAlign: 'center',
                opacity: 0.4,
                paddingHorizontal: 32
            }}>
                {getEmptyDescription()}
            </Text>
        </View>
    );

    const renderSkeleton = () => (
        <View style={{
            width: ITEM_WIDTH,
            gap: 8,
        }}>
            <SkeletonLoading skeletonHeight={160} />
            <SkeletonLoading skeletonHeight={16} />
            <SkeletonLoading skeletonHeight={14} />
        </View>
    );

    const getViewModeSubtitle = () => {
        switch (viewMode) {
            case 'favorites':
                return `${processedAttractions.length} избранных мест`;
            case 'nearby':
                return userLocation ? `${processedAttractions.length} мест поблизости` : 'Определяем местоположение...';
            default:
                return `${processedAttractions.length} достопримечательностей`;
        }
    };

    const getEmptyMessage = () => {
        switch (viewMode) {
            case 'favorites':
                return currentUser.user ? 'Нет избранных мест' : 'Войдите в аккаунт';
            case 'nearby':
                return userLocation ? 'Рядом ничего нет' : 'Нет доступа к геолокации';
            default:
                return 'Ничего не найдено';
        }
    };

    const getEmptyDescription = () => {
        switch (viewMode) {
            case 'favorites':
                return currentUser.user ?
                    'Добавьте места в избранное, нажав на звезду' :
                    'Войдите в систему, чтобы сохранять любимые места';
            case 'nearby':
                return userLocation ?
                    'Попробуйте изменить фильтры или поискать в другом месте' :
                    'Разрешите доступ к геолокации в настройках';
            default:
                return 'Попробуйте изменить поисковый запрос или фильтры';
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.surface }}>
            <View style={{ gap: 8, paddingVertical: 8, backgroundColor: theme.colors.background, zIndex: 2 }}>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginHorizontal: 8,
                    borderRadius: 8,
                    backgroundColor: theme.colors.elevation.level1,
                    overflow: 'hidden'
                }}>
                    <View style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        opacity: .2,
                        zIndex: 0
                    }}>
                        <ImageView uri={currentCity?.images[0]} imgWrapperHeight='100%' />
                    </View>
                    <TouchableRipple style={{ flex: 1, padding: 8 }}
                        onPress={() => navigation.navigate('City', { city: currentCity })}
                    >
                        <View style={{ flexDirection: 'column', gap: 2, maxWidth: '50%', overflow: 'hidden' }}>
                            {
                                !currentCity ? <SkeletonLoading skeletonWidth={160} skeletonHeight={18} />
                                    :
                                    <Text variant="headlineSmall">
                                        {currentCity.name}
                                    </Text>
                            }
                            {
                                !currentCity ? <SkeletonLoading skeletonWidth={100} skeletonHeight={12} />
                                    :
                                    <Text variant="bodySmall" numberOfLines={1} style={{ opacity: 0.7 }}>
                                        {getViewModeSubtitle()}
                                    </Text>
                            }
                        </View>
                    </TouchableRipple>
                    <View style={{ position: 'absolute', right: 0, flexDirection: 'row', padding: 8, gap: 8 }}>
                        <IconButton
                            icon="map-marker"
                            mode="contained-tonal"
                            size={24}
                            onPress={() => navigation.navigate('SelectCity')}
                            style={{ margin: 0, padding: 0 }}
                            iconColor={theme.colors.secondary}
                            containerColor={theme.colors.onSecondary}
                        />
                        <IconButton
                            icon={"account"}
                            mode="contained-tonal"
                            size={24}
                            onPress={() => navigation.navigate('Profile')}
                            style={{ margin: 0, padding: 0 }}
                            iconColor={theme.colors.secondary}
                            containerColor={theme.colors.onSecondary}
                        />
                    </View>
                </View>

                {/* Поиск */}
                <View style={{ paddingHorizontal: 8 }}>
                    <Searchbar
                        placeholder="Поиск достопримечательностей"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        style={{ borderRadius: 8 }}
                        inputStyle={{ minHeight: 0 }}
                    />
                </View>

                {/* Режимы просмотра */}
                <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={viewModes}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ paddingHorizontal: 8, gap: 8 }}
                    renderItem={({ item }) => (
                        <ChipItem
                            selected={viewMode === item.id}
                            setSelectedCategory={() => setViewMode(item.id)}
                            name={item.label}
                            icon={item.icon}
                        />
                    )}
                />

                {/* Категории */}
                {
                    categories.length !== 0 &&
                    <FlatList
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        data={[
                            { id: null, name: 'Все' },
                            ...categories
                        ]}
                        keyExtractor={(item, index) => item.id || 'category-' + index}
                        contentContainerStyle={{ paddingHorizontal: 8, gap: 8 }}
                        renderItem={({ item }) => (
                            <ChipItem
                                selected={selectedCategory === item.id}
                                setSelectedCategory={() => setSelectedCategory(item.id)}
                                name={item.name}
                            />
                        )}
                    />
                }
            </View>

            <FlatList
                data={attractions.length === 0 ? Array(5).fill(null) : processedAttractions}
                renderItem={attractions.length === 0 ? renderSkeleton : renderItem}
                keyExtractor={(item, index) => item?.id || 'attraction-' + index}
                numColumns={2}
                ListEmptyComponent={renderEmpty}
                contentContainerStyle={{
                    padding: 8,
                    paddingBottom: 24,
                    rowGap: 16
                }}
                columnWrapperStyle={{ justifyContent: 'space-between' }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                removeClippedSubviews={true}
                maxToRenderPerBatch={10}
                windowSize={10}
                initialNumToRender={6}
                getItemLayout={(data, index) => ({
                    length: 200,
                    offset: 200 * Math.floor(index / 2),
                    index,
                })}
            />
            <Portal>
                <Snackbar
                    visible={snackbarVisible}
                    onDismiss={() => setSnackbarVisible(false)}
                    duration={2000}
                >
                    {snackbarText}
                </Snackbar>
            </Portal>
        </SafeAreaView>
    );
};

export default HomeScreen;