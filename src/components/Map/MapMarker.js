import { View } from 'react-native';
import { Marker } from 'react-native-maps';
import { useTheme } from 'react-native-paper';

import iconStatue from '@/assets/icons/iconStatue';
import iconMonument from '@/assets/icons/iconMonument';
import iconMemorial from '@/assets/icons/iconMemorial';
import iconStar from '@/assets/icons/iconStar';
import iconMarker from '@/assets/icons/iconMarker';
import iconStreet from '@/assets/icons/iconStreet';
import iconArchitecture from '@/assets/icons/iconArchitecture';
import iconMuseum from '@/assets/icons/iconMuseum';
import iconTemple from '@/assets/icons/iconTemple';

const MARKER_SIZE = 54;

const categoryIcons = {
    statue: iconStatue,
    monument: iconMonument,
    memorial: iconMemorial,
    street: iconStreet,
    architecture: iconArchitecture,
    museum: iconMuseum,
    temple: iconTemple,
    default: iconStar,
};

const MapMarker = ({ attraction, onPress, isSelected }) => {
    const theme = useTheme();
    const markerColor = theme.colors.secondaryContainer;
    const markerIconColor = theme.colors.secondary;

    const getIcon = (category) => {
        const IconComponent = categoryIcons[category] || categoryIcons.default;
        return IconComponent(markerIconColor);
    };

    return (
        <Marker
            coordinate={{
                latitude: attraction.location.latitude,
                longitude: attraction.location.longitude,
            }}
            onPress={() => onPress(attraction)}
            style={{ opacity: isSelected ? 0.6 : 1 }}
            tracksViewChanges={false}
        >
            <View style={{
                position: 'relative',
                width: MARKER_SIZE,
                height: MARKER_SIZE,
                alignItems: 'center',
                justifyContent: 'center',
                alignContent: 'center'
            }}>
                {iconMarker(markerColor, markerIconColor)}
                <View style={{
                    position: 'absolute',
                    width: MARKER_SIZE / 2,
                    height: MARKER_SIZE / 2,
                    alignSelf: 'center'
                }}>
                    {getIcon(attraction.category)}
                </View>
            </View>
        </Marker>
    );
};

export default MapMarker;