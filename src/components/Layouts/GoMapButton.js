import { Button } from "react-native-paper"


const GoMapButton = ({ handleButton }) => (
    <Button
        icon="map"
        mode="contained-tonal"
        onPress={handleButton}
        style={{ position: 'absolute', bottom: 8, left: 8, right: 8, borderRadius: 8 }}
    >
        Открыть на карте
    </Button>
);

export default GoMapButton;