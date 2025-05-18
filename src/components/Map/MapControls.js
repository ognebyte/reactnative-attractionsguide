import { View } from 'react-native';
import { IconButton } from 'react-native-paper';
import { Svg, Path } from 'react-native-svg';

const MapControls = ({
    gpsEnabled,
    heading,
    mapOptionsVisible,
    onResetToNorth,
    onGoToCurrentLocation,
    onMapOptionsPress,
    onZoomIn,
    onZoomOut,
    onStartZoom,
    onStopZoom,
    padding = 4
}) => {
    return (
        <>
            {/* Compass and GPS */}
            <View style={{
                position: 'absolute',
                right: padding,
                bottom: padding,
                alignItems: 'center'
            }}>
                <IconButton
                    mode='contained'
                    icon={() => (
                        <Svg width="90%" height="90%" viewBox="0 0 24 24" fill="none">
                            <Path d="M12 2L9 12H15L12 2Z" fill="#FF0000" />
                            <Path d="M15 12L11.9908 22L9 12H15Z" fill="black" />
                        </Svg>
                    )}
                    size={24}
                    onPress={onResetToNorth}
                    style={{ transform: [{ rotate: `${360 - heading}deg` }] }}
                />
                <IconButton
                    mode='contained'
                    icon={gpsEnabled ? "crosshairs-gps" : "crosshairs-question"}
                    size={30}
                    onPress={onGoToCurrentLocation}
                />
            </View>

            {/* Zoom */}
            <View style={{
                position: 'absolute',
                right: padding,
                top: '50%'
            }}>
                <IconButton
                    mode='contained'
                    icon='plus'
                    size={30}
                    onPressIn={onZoomIn}
                    onLongPress={() => onStartZoom(true)}
                    onPressOut={onStopZoom}
                />
                <IconButton
                    mode='contained'
                    icon='minus'
                    size={30}
                    onPressIn={onZoomOut}
                    onLongPress={() => onStartZoom(false)}
                    onPressOut={onStopZoom}
                />
            </View>

            {/* Map options toggle */}
            <IconButton
                mode='contained'
                icon={mapOptionsVisible ? 'layers' : 'layers-outline'}
                size={30}
                onPress={onMapOptionsPress}
                style={{
                    position: 'absolute',
                    right: padding,
                    top: padding
                }}
            />
        </>
    );
};

export default MapControls;