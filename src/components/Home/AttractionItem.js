import { View } from "react-native";
import { Text, TouchableRipple, useTheme } from 'react-native-paper';
import ImageView from "@components/ImageView";


const DEFAULT_IMAGE = "@/assets/images/default-attraction-image.png";


const AttractionItem = ({ attraction, onPress }) => {
    const theme = useTheme();
    const imageUri = attraction.images?.[0] || DEFAULT_IMAGE;

    return (
        <TouchableRipple
            onPress={onPress}
            style={{
                flex: 1,
                padding: 4,
                borderRadius: 12,
                backgroundColor: theme.colors.elevation.level1,
                overflow: 'hidden'
            }}
            borderless
        >
            <View style={{ gap: 4 }}>
                <ImageView uri={imageUri} />
                <Text variant="bodyLarge" numberOfLines={2}>
                    {attraction.name}
                </Text>
            </View>
        </TouchableRipple>
    );
};

export default AttractionItem;
