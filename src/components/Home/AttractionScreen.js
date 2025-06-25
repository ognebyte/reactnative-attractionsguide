import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, ScrollView } from 'react-native';
import { Text, Snackbar, Portal } from 'react-native-paper';

import { setMapCoordinates } from '@features/store/mapSlice';
import { setFavorites } from '@features/store/userSlice';
import getCategoryNameById from '@utils/getCategoryNameById';
import getObjectFromArrayByValue from '@utils/getObjectFromArrayByValue';
import { addToFavorites, removeFromFavorites } from '@/firebase/firebaseService.js';

import ImageCarousel from '@components/Layouts/ImageCarousel';
import GoBackButton from '@components/Layouts/GoBackButton';
import GoMapButton from '@components/Layouts/GoMapButton';
import FavoriteButton from '@components/Layouts/FavoriteButton';


const AttractionScreen = ({ route, navigation }) => {
    const dispatch = useDispatch();
    const { attraction } = route.params;
    const categories = useSelector(state => state.categories);
    const { user } = useSelector(state => state.user);

    const [isFavorite, setIsFavorite] = useState(false);
    const [favoriteLoading, setFavoriteLoading] = useState(false);
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarText, setSnackbarText] = useState('');


    // Проверяем, есть ли достопримечательность в избранном при загрузке
    useEffect(() => {
        if (user) {
            const isExists = getObjectFromArrayByValue(user.favorites, 'attraction_id', attraction.id);
            if (isExists) {
                setIsFavorite(true);
            }
            else {
                setIsFavorite(false)
            }
        }
    }, []);

    const handleToggleFavorite = async () => {  // добавление и удаление избранного
        if (!user) {        // проверка пользователя на авторизацию
            setSnackbarText('Необходимо войти в систему для добавления в избранное');
            setSnackbarVisible(true)
            return;
        }
        setFavoriteLoading(true);
        var res;
        try {
            if (isFavorite) {
                res = await removeFromFavorites(user.id, attraction.id);
                setIsFavorite(false);
                setSnackbarText('Удалено из избранного');
            } else {
                res = await addToFavorites(user.id, attraction.id);
                setIsFavorite(true);
                setSnackbarText('Добавлено в избранное');
            }
            setSnackbarVisible(true);
            dispatch(setFavorites(res));
        } catch (error) {
            console.error('Ошибка при работе с избранным:', error);
            setSnackbarText('Не удалось обновить избранное');
        } finally {
            setFavoriteLoading(false);
        }
    };

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
                <View style={{
                    padding: 8,
                }}>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between'
                    }}>
                        <GoBackButton navigation={navigation} />

                        {user !== null && (
                            <FavoriteButton onPress={handleToggleFavorite} filled={isFavorite} loading={favoriteLoading} />
                        )}
                    </View>
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

export default AttractionScreen;