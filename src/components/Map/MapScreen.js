import { useState, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { View, StatusBar, FlatList } from 'react-native';
import { useTheme, SegmentedButtons, List } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from '@gorhom/bottom-sheet';
import MapViewDirections from 'react-native-maps-directions';

import { darkMapStyle } from "./hooks/darkMapStyle";
import { useMapCamera } from './hooks/useMapCamera';
import { useLocation } from './hooks/useLocation';

import MapControls from './MapControls';
import MapMarker from './MapMarker';
import { resetMapAnimateFlag } from '@features/store/mapSlice';
import ChipItem from '@components/Layouts/ChipItem';
import AttractionBottomSheet from './AttractionBottomSheet';
import RouteOptionsBottomSheet from './RouteOptionsBottomSheet';

const INITIAL_REGION = {
    latitude: 46.33255681298829,
    latitudeDelta: 74.06192509464654,
    longitude: 96.50912079960108,
    longitudeDelta: 72.32142426473551
};

const MAP_TYPES = [
    { label: "Схема", value: 'standard' },
    { label: "Спутник", value: 'satellite' },
    { label: "Гибрид", value: 'hybrid' },
];

const mapApikey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

const MapScreen = ({ navigation }) => {
    const theme = useTheme();
    const dispatch = useDispatch();

    const categories = useSelector((state) => state.categories);
    const currentCity = useSelector((state) => state.city);
    const attractions = useSelector((state) => state.attractions);
    const mapStore = useSelector((state) => state.map);

    const { mapRef, animateToRegion, animateCamera, zoomMap } = useMapCamera();
    const { gpsEnabled, currLocation, setCurrLocation, checkGpsStatus } = useLocation();

    const bottomSheetMapOptionsRef = useRef(null);
    const bottomSheetMapMarkerRef = useRef(null);
    const bottomSheetRouteOptionsRef = useRef(null);

    const [selectedCategory, setSelectedCategory] = useState(null);
    const [heading, setHeading] = useState(0);
    const [mapReady, setMapReady] = useState(false);
    const [mapType, setMapType] = useState('standard');
    const [mapTraffic, setMapTraffic] = useState(false);
    const [mapPoi, setMapPoi] = useState(false);
    const [selectedAttraction, setSelectedAttraction] = useState(null);
    const [mapOptionsVisible, setMapOptionsVisible] = useState(false);
    const [mapMarkerVisible, setMapMarkerVisible] = useState(false);
    const [routeOptionsVisible, setRouteOptionsVisible] = useState(false);
    const [zoomInterval, setZoomInterval] = useState(null);
    const [filteredAttractions, setFilteredAttractions] = useState([]);
    const [routeDistance, setRouteDistance] = useState(null);
    const [routeDuration, setRouteDuration] = useState(null);
    const [routeError, setRouteError] = useState(null);
    const [isBuilding, setIsBuilding] = useState(false);

    // Состояния для маршрутизации
    const [routeOrigin, setRouteOrigin] = useState(null);
    const [currentTravelMode, setCurrentTravelMode] = useState('DRIVING');

    useEffect(() => {
        if (mapReady && !mapStore.shouldAnimate) {
            if (currentCity?.location) {
                animateToRegion({
                    latitude: currentCity.location.latitude,
                    longitude: currentCity.location.longitude,
                    latitudeDelta: 0.25,
                    longitudeDelta: 0.25,
                }, 0);
            }
        }
    }, [mapReady, currentCity]);

    useEffect(() => {
        if (mapReady && mapStore.shouldAnimate && mapRef.current) {
            let zoom = mapStore.isCity ? 0.25 : 0.01
            animateToRegion({
                latitude: mapStore.latitude,
                longitude: mapStore.longitude,
                latitudeDelta: zoom,
                longitudeDelta: zoom,
            });

            if (!mapStore.isCity) {
                handleMarkerPress(mapStore.attraction)
            }

            dispatch(resetMapAnimateFlag());
        }
    }, [mapReady, mapStore]);

    useEffect(() => {
        filterAttractions();
    }, [selectedCategory, attractions]);

    // Сброс маршрута при изменении выбранной достопримечательности
    useEffect(() => {
        if (!selectedAttraction) {
            setRouteOrigin(null);
            setRouteDistance(null);
            setRouteDuration(null);
            setRouteError(null);
            setIsBuilding(false);
        }
    }, [selectedAttraction]);

    const filterAttractions = () => {
        let result = [...attractions];

        if (selectedCategory) {
            result = result.filter(a => a.category === selectedCategory);
        }

        setFilteredAttractions(result);
    };

    const mapStyle = useMemo(() => [
        ...(theme.dark ? darkMapStyle : []),
        {
            featureType: "poi",
            stylers: [{ visibility: mapPoi ? "on" : "off" }],
        },
    ], [theme.dark, mapPoi]);

    const startMapZoom = (isZoomIn) => {
        const interval = setInterval(() => zoomMap(isZoomIn), 400);
        setZoomInterval(interval);
    };

    const stopZoom = () => {
        if (zoomInterval) {
            clearInterval(zoomInterval);
            setZoomInterval(null);
        }
    };

    const goToCurrentLocation = async () => {
        if (await checkGpsStatus() && currLocation) {
            animateCamera({
                center: {
                    latitude: currLocation.latitude,
                    longitude: currLocation.longitude,
                },
                zoom: 16
            });
        }
    };

    const handleRegionChange = async () => {
        try {
            const camera = await mapRef.current?.getCamera();
            if (camera && camera.heading !== heading) {
                setHeading(camera.heading);
            }
        } catch (error) {
            console.warn('Error handling region change:', error);
        }
    };

    // Обработчик успешного построения маршрута
    const onRouteReady = ({ distance, duration, coordinates }) => {
        setRouteDistance(distance);
        setRouteDuration(duration);
        setIsBuilding(false);

        if (mapRef.current) {
            mapRef.current.fitToCoordinates(coordinates, {
                edgePadding: {
                    right: 50,
                    bottom: 300,
                    left: 50,
                    top: 100,
                },
                animated: true,
            });
        }
    };

    // Обработчик ошибки построения маршрута
    const onRouteError = (errorMessage) => {
        console.error('Route error:', errorMessage);
        setRouteError('Не удалось построить маршрут. Проверьте подключение к интернету.');
        setIsBuilding(false);
    };

    const handleRouteStart = async (origin, travelMode) => {
        if (!travelMode || !selectedAttraction) {
            return;
        }
        setIsBuilding(true);
        setRouteError(null);
        try {
            const gpsAvailable = await checkGpsStatus();
            if (!gpsAvailable) {
                throw new Error('gps-not-available');
            }
            setCurrentTravelMode(travelMode);
            setRouteOrigin(origin);
        } catch (err) {
            let error = 'Не удалось построить маршрут. Проверьте подключение к интернету.'
            switch (err) {
                case 'gps-not-available':
                    error = 'GPS недоступен. Включите геолокацию для построения маршрута.'
                    break;
            }
            console.error('Route building error:', err);
            setRouteError(error);
            setIsBuilding(false);
        }
    };

    // BottomSheet handlers
    const handleMapOptionsPress = () => {
        if (mapOptionsVisible) handleBottomSheet(bottomSheetMapOptionsRef, setMapOptionsVisible, false);
        else {
            handleBottomSheet(bottomSheetMapOptionsRef, setMapOptionsVisible);
        }
    };

    const onMapPress = () => {
        if (mapOptionsVisible) {
            handleBottomSheet(bottomSheetMapOptionsRef, setMapOptionsVisible, false);
            return;
        }

        if (routeOptionsVisible) return;
        if (mapMarkerVisible) {
            handleBottomSheet(bottomSheetMapMarkerRef, setMapMarkerVisible, false);
            setSelectedAttraction(null);
        }
    };

    const handleMarkerPress = (attraction) => {
        if (mapOptionsVisible) handleBottomSheet(bottomSheetMapOptionsRef, setMapOptionsVisible, false);

        setSelectedAttraction(attraction);
        if (routeOptionsVisible) return;
        handleBottomSheet(bottomSheetMapMarkerRef, setMapMarkerVisible);
    };

    const handleRouteOptionsOpen = () => {
        handleBottomSheet(bottomSheetRouteOptionsRef, setRouteOptionsVisible);
        handleRouteStart(currLocation, currentTravelMode);
    };

    const handleRouteClose = () => {
        handleBottomSheet(bottomSheetRouteOptionsRef, setRouteOptionsVisible, false);
        setRouteOrigin(null);
        setRouteDistance(null);
        setRouteDuration(null);
        setRouteError(null);
        setIsBuilding(false);
    };

    const handleBottomSheet = (ref, setState, isOpen = true) => {
        if (isOpen) {
            ref.current?.present();
            setState(true);
        } else {
            ref.current?.dismiss();
            setState(false);
        }
    }


    return (
        <SafeAreaView style={{ flex: 1, position: 'relative' }}>
            <BottomSheetModalProvider>
                <MapView
                    provider={PROVIDER_GOOGLE}
                    ref={mapRef}
                    onPress={onMapPress}
                    onMapReady={() => setMapReady(true)}
                    mapType={mapType}
                    style={{ position: 'absolute', top: 0, bottom: 0, right: 0, left: 0, backgroundColor: 'transparent' }}
                    customMapStyle={mapStyle}
                    showsTraffic={mapTraffic}
                    showsPointsOfInterest={mapPoi}
                    onUserLocationChange={({ nativeEvent }) => setCurrLocation(nativeEvent.coordinate)}
                    onRegionChange={handleRegionChange}
                    initialRegion={INITIAL_REGION}
                    mapPadding={{ top: StatusBar.currentHeight }}
                    showsUserLocation={true}
                    showsCompass={false}
                    showsMyLocationButton={false}
                    renderToHardwareTextureAndroid={true}
                    showsScale={false}
                    toolbarEnabled={false}
                    loadingEnabled={true}
                    loadingIndicatorColor={theme.colors.primary}
                    loadingBackgroundColor={theme.colors.background}
                >
                    {filteredAttractions?.map((attraction) => (
                        <MapMarker
                            key={attraction.id}
                            attraction={attraction}
                            onPress={handleMarkerPress}
                            isSelected={selectedAttraction?.id === attraction.id}
                        />
                    ))}

                    {/* Маршрут от зафиксированной точки до выбранной достопримечательности */}
                    {routeOrigin && selectedAttraction && (
                        <MapViewDirections
                            origin={routeOrigin}
                            destination={selectedAttraction.location}
                            apikey={mapApikey}
                            mode={currentTravelMode}
                            onReady={onRouteReady}
                            onError={onRouteError}
                            strokeColor={theme.colors.tertiary}
                            strokeWidth={6}
                            optimizeWaypoints={true}
                            precision="high"
                        />
                    )}
                </MapView>

                <View style={{ flex: 1, position: 'relative' }}>
                    <View style={{ marginTop: 8 }}>
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

                    <View style={{ flex: 1 }}>
                        <MapControls
                            gpsEnabled={gpsEnabled}
                            heading={heading}
                            mapOptionsVisible={mapOptionsVisible}
                            onResetToNorth={() => animateCamera({ heading: 0 })}
                            onGoToCurrentLocation={goToCurrentLocation}
                            onMapOptionsPress={handleMapOptionsPress}
                            onZoomIn={() => zoomMap(true)}
                            onZoomOut={() => zoomMap(false)}
                            onStartZoom={startMapZoom}
                            onStopZoom={stopZoom}
                        />
                    </View>

                    {/* Map Options Modal */}
                    <BottomSheetModal
                        ref={bottomSheetMapOptionsRef}
                        onChange={(index) => setMapOptionsVisible(index >= 0)}
                        enableDynamicSizing={true}
                        backgroundStyle={{ backgroundColor: theme.colors.elevation.level3 }}
                    >
                        <BottomSheetView>
                            <List.Section style={{ gap: 8 }}>
                                <SegmentedButtons
                                    value={mapType}
                                    onValueChange={setMapType}
                                    buttons={MAP_TYPES}
                                    style={{ paddingHorizontal: 24 }}
                                />
                                <List.Item
                                    left={() => (
                                        <List.Icon icon={mapTraffic ? 'traffic-light' : 'traffic-light-outline'} />
                                    )}
                                    title="Пробки"
                                    onPress={() => setMapTraffic(prev => !prev)}
                                    style={{ paddingHorizontal: 24, backgroundColor: mapTraffic ? theme.colors.secondaryContainer : undefined, }}
                                />
                                <List.Item
                                    left={() => (
                                        <List.Icon icon={mapPoi ? 'star-four-points' : 'star-four-points-outline'} />
                                    )}
                                    title="Точки интереса"
                                    onPress={() => setMapPoi(prev => !prev)}
                                    style={{ paddingHorizontal: 24, backgroundColor: mapPoi ? theme.colors.secondaryContainer : undefined, }}
                                />
                            </List.Section>
                        </BottomSheetView>
                    </BottomSheetModal>

                    {/* Attraction Modal */}
                    <AttractionBottomSheet
                        ref={bottomSheetMapMarkerRef}
                        theme={theme}
                        selectedAttraction={selectedAttraction}
                        categories={categories}
                        navigate={() => {
                            navigation.navigate('MapAttraction', { attraction: selectedAttraction });
                        }}
                        onRouteOptionsOpen={handleRouteOptionsOpen}
                        onClose={() => {
                            handleBottomSheet(bottomSheetMapMarkerRef, setMapMarkerVisible, false)
                            setSelectedAttraction(null);
                        }}
                    />

                    {/* Route Options Modal */}
                    <RouteOptionsBottomSheet
                        ref={bottomSheetRouteOptionsRef}
                        theme={theme}
                        selectedAttraction={selectedAttraction}
                        routeDistance={routeDistance}
                        routeDuration={routeDuration}
                        routeError={routeError}
                        isBuilding={isBuilding}
                        travelMode={currentTravelMode}
                        handleTravelMode={(travelMode) => {
                            handleRouteStart(currLocation, travelMode);
                        }}
                        onClose={handleRouteClose}
                    />
                </View>
            </BottomSheetModalProvider>
        </SafeAreaView>
    );
};

export default MapScreen;