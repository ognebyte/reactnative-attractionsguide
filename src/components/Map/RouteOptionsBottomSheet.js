import { forwardRef, useCallback } from 'react';
import { View, StatusBar, StyleSheet } from 'react-native';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { Text, Icon, IconButton, SegmentedButtons, Divider } from 'react-native-paper';

const TRAVEL_MODES = [
    {
        label: "Авто",
        value: 'DRIVING',
        icon: 'car'
    },
    {
        label: "Пешком",
        value: 'WALKING',
        icon: 'walk'
    },
    // {
    //     label: "Велосипед",
    //     value: 'BICYCLING',
    //     icon: 'bicycle'
    // },
    // {
    //     label: "Транспорт",
    //     value: 'TRANSIT',
    //     icon: 'bus'
    // },
];

const RouteOptionsBottomSheet = forwardRef(({
    theme,
    selectedAttraction,
    routeDistance,
    routeDuration,
    routeError,
    isBuilding,
    travelMode,
    handleTravelMode,
    onClose
}, ref) => {
    // Форматирование расстояния и времени
    const formatDistance = useCallback((distance) => {
        return distance < 1 ? `${(distance * 1000).toFixed(0)} м` : `${(distance).toFixed(1)} км`;
    }, []);

    const formatDuration = useCallback((duration) => {
        const minutes = Math.round(duration);
        return minutes < 60 ? `${minutes} мин` : `${Math.floor(minutes / 60)} ч ${minutes % 60} мин`;
    }, []);

    return (
        <BottomSheetModal
            ref={ref}
            enableDynamicSizing={true}
            enablePanDownToClose={false}
            backgroundStyle={{
                backgroundColor: theme.colors.elevation.level3
            }}
        >
            <BottomSheetView style={styles.bottomSheetView}>
                {selectedAttraction && (
                    <View style={{ gap: 12 }}>
                        <View style={styles.destinationInfo}>
                            <Icon
                                source='map-marker'
                                size={20}
                                color={theme.colors.primary}
                            />
                            <Text style={{ color: theme.colors.onSurface, flex: 1 }}>
                                {selectedAttraction.name}
                            </Text>

                            <IconButton
                                icon='close'
                                onPress={onClose}
                                size={20}
                                style={{ margin: 0, padding: 0 }}
                            />
                        </View>

                        <Divider />

                        {/* Выбор режима передвижения */}
                        <SegmentedButtons
                            value={travelMode}
                            onValueChange={handleTravelMode}
                            buttons={TRAVEL_MODES.map(mode => ({
                                value: mode.value,
                                label: mode.label,
                                icon: mode.icon,
                                style: { minWidth: 0 },
                                disabled: isBuilding
                            }))}
                            density='small'
                        />

                        {/* Информация о маршруте */}
                        {routeError && (
                            <View style={[styles.container, { backgroundColor: theme.colors.errorContainer }]}>
                                <Icon
                                    source='alert-circle'
                                    size={20}
                                    color={theme.colors.error}
                                />
                                <Text style={{ flex: 1 }}>
                                    {routeError}
                                </Text>
                            </View>
                        )}

                        {!routeError && isBuilding && (
                            <View style={[styles.container, { backgroundColor: theme.colors.secondaryContainer }]}>
                                <Icon
                                    source='timer-sand'
                                    size={20}
                                    color={theme.colors.secondary}
                                />
                                <Text style={{ color: theme.colors.onSecondaryContainer, flex: 1 }}>
                                    Построение маршрута...
                                </Text>
                            </View>
                        )}

                        {!routeError && !isBuilding && routeDistance && routeDuration && (
                            <View style={[styles.container, { backgroundColor: theme.colors.primaryContainer }]}>
                                <Icon
                                    source='map-marker-distance'
                                    size={20}
                                    color={theme.colors.primary}
                                />
                                <View style={{ flex: 1 }}>
                                    <Text style={{ color: theme.colors.onPrimaryContainer }}>
                                        {formatDistance(routeDistance)} • {formatDuration(routeDuration)}
                                    </Text>
                                </View>
                            </View>
                        )}
                    </View>
                )}
            </BottomSheetView>
        </BottomSheetModal>
    );
});

const styles = StyleSheet.create({
    bottomSheetView: {
        paddingHorizontal: 12,
        paddingBottom: 12,
    },

    destinationInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        gap: 12,
    },
});

RouteOptionsBottomSheet.displayName = 'RouteOptionsBottomSheet';

export default RouteOptionsBottomSheet;