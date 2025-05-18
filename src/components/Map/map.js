import { useState, useEffect, useMemo, useRef } from 'react';
import { useSelector } from "react-redux";
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

    const [heading, setHeading] = useState(0);
    const [mapType, setMapType] = useState('standard');
    const [mapTraffic, setMapTraffic] = useState(false);
    const [mapPoi, setMapPoi] = useState(true);
    const [selectedAttraction, setSelectedAttraction] = useState(null);
    const [mapOptionsVisible, setMapOptionsVisible] = useState(false);
    const [mapMarkerVisible, setMapMarkerVisible] = useState(false);
    const [zoomInterval, setZoomInterval] = useState(null);
    const [loadedImages, setLoadedImages] = useState({});


    useEffect(() => {
        if (currentCity?.location) {
            animateToRegion({
                latitude: currentCity.location.latitude,
                longitude: currentCity.location.longitude,
                latitudeDelta: 0.25,
                longitudeDelta: 0.25,
            });
        }
    }, [currentCity]);

    useEffect(() => {
        if (mapStore) {
            animateToRegion({
                latitude: mapStore.latitude,
                longitude: mapStore.longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
            });
        }
    }, [mapStore]);

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

    const handleImageLoad = (imageUri) => {
        setLoadedImages((prevState) => ({
            ...prevState,
            [imageUri]: true,
        }));
    };

    return (
        <SafeAreaView style={{ flex: 1, position: 'relative' }}>
            <MapView
                ref={mapRef}
                onPress={onMapPress}
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
                {attractions?.map((attraction) => (
                    <MapMarker
                        key={attraction.id}
                        attraction={attraction}
                        onPress={handleMarkerPress}
                        isSelected={selectedAttraction?.id === attraction.id}
                    />
                ))}
            </MapView>

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
                    enableContentPanningGesture={false}
                    enableDynamicSizing={true}
                    onChange={(index) => {
                        setMapMarkerVisible(index >= 0);
                        if (index < 0) {
                            setSelectedAttraction(null);
                        }
                    }}
                    topInset={StatusBar.currentHeight}
                    backgroundStyle={styles.bottomSheetModalBackground}
                >
                    <BottomSheetView>
                        {selectedAttraction && (
                            <View style={{ gap: 16, paddingTop: 4, paddingBottom: 24 }}>
                                <Text
                                    variant='titleLarge'
                                    numberOfLines={2}
                                    style={{ paddingHorizontal: 16 }}
                                >
                                    {selectedAttraction.name}
                                </Text>

                                <View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: 8 }}>
                                    <ScrollView
                                        horizontal={true}
                                        contentContainerStyle={{ padding: 8, gap: 8 }}
                                        showsHorizontalScrollIndicator={false}
                                    >
                                        {selectedAttraction.images?.map((image) => (
                                            <View
                                                key={`map-attraction-image-${image}`}
                                                style={{ width: 128, height: 128 }}
                                            >
                                                {!loadedImages[image] && <SkeletonLoading />}
                                                <Image
                                                    source={{ uri: image }}
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        borderRadius: 8,
                                                        display: !loadedImages[image] ? 'none' : 'flex',
                                                    }}
                                                    onLoad={() => handleImageLoad(image)}
                                                />
                                            </View>
                                        ))}
                                    </ScrollView>
                                </View>

                                {selectedAttraction.description && (
                                    <Text
                                        variant="bodyMedium"
                                        style={{ paddingHorizontal: 16 }}
                                    >
                                        {selectedAttraction.description}
                                    </Text>
                                )}

                                {selectedAttraction.history && (
                                    <Text
                                        variant="bodyMedium"
                                        style={{ paddingHorizontal: 16 }}
                                    >
                                        {selectedAttraction.history}
                                    </Text>
                                )}
                            </View>
                        )}
                    </BottomSheetView>
                </BottomSheetModal>
            </View>
        </SafeAreaView>
    );
};

export default Map;