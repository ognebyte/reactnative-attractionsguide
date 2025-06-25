import { IconButton } from 'react-native-paper';


const FavoriteButton = ({ onPress, filled, loading, customColor = true }) => (
    <IconButton
        icon={filled ? 'star' : 'star-outline'}
        onPress={onPress}
        disabled={loading}
        iconColor={customColor ? '#FDB738' : null}
        containerColor={customColor ? 'rgba(0, 0, 0, 0.2)' : null}
        style={{ padding: 0, margin: 0 }}
    />
)


export default FavoriteButton;
