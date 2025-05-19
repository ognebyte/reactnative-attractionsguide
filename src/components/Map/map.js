import { useState, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { View, StatusBar, Image, ScrollView } from 'react-native';
import { useTheme, SegmentedButtons, List, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView from 'react-native-maps';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';

import { darkMapStyle } from "./hooks/darkMapStyle";
import { useMapCamera } from './hooks/useMapCamera';
import { useLocation } from './hooks/useLocation';

import MapControls from './MapControls';
import MapMarker from './MapMarker';
import SkeletonLoading from '@/components/SkeletonLoading';
import { resetMapAnimateFlag } from '@features/store/mapSlice';
import CategoriesChips from '@components/CategoriesChips';
import ImageCarousel from '@components/ImageCarousel';
import ImageLeftAlign from '@components/ImageLeftAlign';
import getCategoryNameById from '@utils/getCategoryNameById';

const INITIAL_REGION = {
    latitude: 46.33255681298829,
    latitudeDelta: 74.06192509464654,
    longitude: 96.50912079960108,
    longitudeDelta: 72.32142426473551
};

const MAP_TYPES = [
    { label: "Схема", value: 'standard', style: { borderRadius: 8 } },
    { label: "Спутник", value: 'satellite' },
    { label: "Гибрид", value: 'hybrid', style: { borderRadius: 8 } },
];

const Map = () => {
    const theme = useTheme();
    const dispatch = useDispatch();

    // @ts-ignore
    const categories = useSelector((state) => state.categories);
    // @ts-ignore
    const currentCity = useSelector((state) => state.city);
    // @ts-ignore
    const attractions = useSelector((state) => state.attractions);
    // @ts-ignore
    const mapStore = useSelector((state) => state.map);

    const { mapRef, animateToRegion, animateCamera, zoomMap } = useMapCamera();
    const { gpsEnabled, currLocation, setCurrLocation, checkGpsStatus } = useLocation();

    const bottomSheetMapOptionsRef = useRef(null);
    const bottomSheetMapMarkerRef = useRef(null);

    const [selectedCategory, setSelectedCategory] = useState(0);
    const [heading, setHeading] = useState(0);
    const [mapReady, setMapReady] = useState(false);
    const [mapType, setMapType] = useState('standard');
    const [mapTraffic, setMapTraffic] = useState(false);
    const [mapPoi, setMapPoi] = useState(true);
    const [selectedAttraction, setSelectedAttraction] = useState(null);
    const [mapOptionsVisible, setMapOptionsVisible] = useState(false);
    const [mapMarkerVisible, setMapMarkerVisible] = useState(false);
    const [enableContentPanningGesture, setEnableContentPanningGesture] = useState(false);
    const [zoomInterval, setZoomInterval] = useState(null);
    const [filteredAttractions, setFilteredAttractions] = useState([]);


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

    const styles = useMemo(() => ({
        bottomSheetModalBackground: {
            backgroundColor: theme.colors.elevation.level3
        },
    }), [theme.colors.elevation.level3]);

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

    // BottomSheet handlers
    const handleMapOptionsPress = () => {
        if (mapMarkerVisible) {
            bottomSheetMapMarkerRef.current?.dismiss();
        }

        if (mapOptionsVisible) {
            bottomSheetMapOptionsRef.current?.dismiss();
        } else {
            bottomSheetMapOptionsRef.current?.present();
        }
    };

    const onMapPress = () => {
        if (mapOptionsVisible) {
            bottomSheetMapOptionsRef.current?.dismiss();
        }
        if (mapMarkerVisible) {
            bottomSheetMapMarkerRef.current?.dismiss();
        }
    };

    const handleMarkerPress = (attraction) => {
        setSelectedAttraction(attraction);
        if (mapOptionsVisible) {
            bottomSheetMapOptionsRef.current?.dismiss();
        }
        bottomSheetMapMarkerRef.current?.present();
    };

    return (
        <SafeAreaView style={{ flex: 1, position: 'relative' }}>
            <MapView
                ref={mapRef}
                onPress={onMapPress}
                onMapReady={() => setMapReady(true)}
                // @ts-ignore
                mapType={mapType}
                style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    right: 0,
                    left: 0,
                    backgroundColor: 'transparent'
                }}
                customMapStyle={mapStyle}
                showsTraffic={mapTraffic}
                showsPointsOfInterest={mapPoi}
                onUserLocationChange={({ nativeEvent }) => setCurrLocation(nativeEvent.coordinate)}
                onRegionChange={handleRegionChange}
                initialRegion={INITIAL_REGION}
                // @ts-ignore
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
            </MapView>

            <View style={{ flex: 1, position: 'relative' }}>
                <View style={{ marginTop: 8 }}>
                    <CategoriesChips categories={categories} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
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
                    topInset={StatusBar.currentHeight}
                    backgroundStyle={styles.bottomSheetModalBackground}
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
                                    <List.Icon
                                        icon={mapTraffic ? 'traffic-light' : 'traffic-light-outline'}
                                    />
                                )}
                                title="Пробки"
                                onPress={() => setMapTraffic(prev => !prev)}
                                style={{
                                    paddingHorizontal: 24,
                                    backgroundColor: mapTraffic
                                        ? theme.colors.secondaryContainer
                                        : undefined,
                                }}
                            />
                            <List.Item
                                left={() => (
                                    <List.Icon
                                        icon={mapPoi ? 'star-four-points' : 'star-four-points-outline'}
                                    />
                                )}
                                title="Точки интереса"
                                onPress={() => setMapPoi(prev => !prev)}
                                style={{
                                    paddingHorizontal: 24,
                                    backgroundColor: mapPoi
                                        ? theme.colors.secondaryContainer
                                        : undefined,
                                }}
                            />
                        </List.Section>
                    </BottomSheetView>
                </BottomSheetModal>

                {/* Attraction Modal */}
                <BottomSheetModal
                    ref={bottomSheetMapMarkerRef}
                    enableContentPanningGesture={enableContentPanningGesture}
                    snapPoints={[250, '80%']}
                    onChange={(index) => {
                        setMapMarkerVisible(index >= 0);
                        if (index < 0) {
                            setSelectedAttraction(null);
                        }
                        if (index > 0) {
                            setEnableContentPanningGesture(false)
                        } else {
                            setEnableContentPanningGesture(true)
                        }
                    }}
                    topInset={StatusBar.currentHeight}
                    backgroundStyle={styles.bottomSheetModalBackground}
                >
                    <BottomSheetView>
                        <ScrollView contentContainerStyle={{ paddingTop: 4, paddingBottom: 24 }}>
                            {selectedAttraction && (
                                <View style={{ gap: 16 }}>
                                    <Text
                                        variant='titleLarge'
                                        numberOfLines={2}
                                        style={{ paddingHorizontal: 16 }}
                                    >
                                        {selectedAttraction.name}
                                    </Text>

                                    <ImageLeftAlign images={selectedAttraction.images} />

                                    <Text
                                        variant='titleMedium'
                                        style={{ paddingHorizontal: 16, textAlign: 'right', opacity: .4 }}
                                    >
                                        {getCategoryNameById(categories, selectedAttraction.category)}
                                    </Text>

                                    {selectedAttraction.description && (
                                        <Text variant="titleMedium" style={{ paddingHorizontal: 16 }}>
                                            Описание{'\n'}
                                            <Text variant="bodyMedium">
                                                {selectedAttraction.description}
                                            </Text>
                                        </Text>
                                    )}

                                    {selectedAttraction.history && (
                                        <Text variant="titleMedium" style={{ paddingHorizontal: 16 }}>
                                            История{'\n'}
                                            <Text variant="bodyMedium">
                                                {selectedAttraction.history}
                                            </Text>
                                        </Text>
                                    )}
                                </View>
                            )}
                        </ScrollView>
                    </BottomSheetView>
                </BottomSheetModal>
            </View>
        </SafeAreaView>
    );
};

export default Map;