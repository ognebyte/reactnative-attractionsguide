import { View } from 'react-native';
import { IconButton } from 'react-native-paper';


const GoBackButton = ({ navigation, absolute = true, customColor = true }) => (
    <View style={absolute ? { position: 'absolute', top: 8, left: 8, zIndex: 10 } : null}>
        <IconButton
            icon="chevron-left"
            onPress={navigation.goBack}
            iconColor={customColor ? 'rgba(255, 255, 255, .8)' : null}
            containerColor={customColor ? 'rgba(0, 0, 0, 0.2)' : null}
            style={{ padding: 0, margin: 0 }}
        />
    </View>
)


export default GoBackButton;
