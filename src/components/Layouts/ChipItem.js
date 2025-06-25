import { View } from "react-native";
import { Chip, Icon, Text, useTheme } from "react-native-paper";


const ChipItem = ({ selected, setSelectedCategory, name, icon = null, disabled = false }) => {
    const customTheme = useTheme();
    const textColor = selected ? customTheme.colors.elevation.level1 : customTheme.colors.primary

    return (
        <Chip
            selected={selected}
            onPress={setSelectedCategory}
            showSelectedCheck={false}
            style={{
                backgroundColor: selected ? customTheme.colors.primary : customTheme.colors.elevation.level1,
                borderRadius: 8,
                opacity: disabled ? .5 : 1,
            }}
            disabled={disabled}
        >
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8
            }}>
                {icon &&
                    <Icon
                        source={icon}
                        color={textColor}
                        size={16}
                    />
                }
                <Text style={{ color: textColor }}>
                    {name}
                </Text>
            </View>
        </Chip>
    )
}

export default ChipItem;