import { IconButton } from 'react-native-paper';


const GoBackButton = ({ navigation, customColor = true }) => (
    <IconButton
        icon="chevron-left"
        onPress={navigation.goBack}
        iconColor={customColor ? 'rgba(255, 255, 255, .8)' : null}
        containerColor={customColor ? 'rgba(0, 0, 0, 0.2)' : null}
        style={{ padding: 0, margin: 0 }}
    />
)


export default GoBackButton;
