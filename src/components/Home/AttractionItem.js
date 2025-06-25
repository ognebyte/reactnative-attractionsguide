import { View } from "react-native";
import { Icon, Text, TouchableRipple, useTheme } from 'react-native-paper';
import ImageView from "@components/Layouts/ImageView";


const AttractionItem = ({ attraction, onPress, isFavorite = false, distance = null }) => {
    const theme = useTheme();

    return (
        <TouchableRipple
            onPress={onPress}
            style={{
                flex: 1,
                borderRadius: 8,
                backgroundColor: theme.colors.elevation.level1,
                overflow: 'hidden'
            }}
            borderless
        >
            <View style={{ flex: 1 }}>
                {
                    isFavorite &&
                    <View style={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        padding: 3,
                        borderRadius: 100,
                        backgroundColor: 'rgba(0,0,0,.3)',
                        overflow: 'hidden',
                        zIndex: 1
                    }}>
                        <Icon
                            source='star'
                            size={18}
                            color="#FDB738"
                        />
                    </View>
                }
                <ImageView uri={attraction.images[0]} borderRadius={0} />
                <View style={{ flex: 1, padding: 6, gap: 4 }}>
                    <Text variant="bodyLarge" numberOfLines={2}>
                        {attraction.name}
                    </Text>
                    {
                        distance &&
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 'auto', opacity: .6 }}>
                            <Text variant="bodyMedium" >
                                Растояние:
                            </Text>
                            <Text variant="bodyMedium">
                                {distance < 1 ? `${(distance * 1000).toFixed(0)} м` : `${(distance).toFixed(1)} км`}
                            </Text>
                        </View>
                    }
                </View>
            </View>
        </TouchableRipple>
    );
};

export default AttractionItem;
