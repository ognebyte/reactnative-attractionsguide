import { useEffect, useState } from "react";
import { View, StatusBar, ScrollView } from "react-native";
import { Avatar, Button, Card, List, Text, IconButton, TouchableRipple } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from "react-redux";


const Home = () => {
    const cities = useSelector((state) => state.cities);
    const attractions = useSelector((state) => state.attractions);
    const categories = useSelector((state) => state.categories);
    const [expanded, setExpanded] = useState(null); // Для управления раскрытием списка

    const handlePress = (cityId) => {
        setExpanded(expanded === cityId ? null : cityId); // Открываем или закрываем список
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={{ paddingVertical: 16, gap: 16, paddingHorizontal: 0 }}>
                {!cities ? null : cities.map((city) =>
                    <Card key={city.id}
                        style={{ borderRadius: 0, }}
                        elevation={1}
                    >
                        <Card.Title
                            title={city.name}
                            titleVariant="titleLarge"
                            left={(props) => <Avatar.Icon {...props} icon="folder" />}
                            right={(props) => <IconButton {...props} icon="dots-vertical" onPress={() => { }} />}
                        />
                        <Card.Content>
                            <ScrollView horizontal={true} contentContainerStyle={{ padding: 8, gap: 8 }}>
                                {attractions?.filter((attraction) => attraction.city_id === city.id).map((attraction) =>
                                    <TouchableRipple key={attraction.id}
                                        style={{ width: 200, height: 120, borderRadius: 6, padding: 8, elevation: 1 }}
                                        onPress={() => { }}
                                    >
                                        <>
                                            <Text variant="titleMedium">
                                                {attraction.name}
                                            </Text>
                                            <Text variant="bodyMedium" numberOfLines={2} ellipsizeMode="tail">
                                                {attraction.description}
                                            </Text>
                                        </>
                                    </TouchableRipple>
                                )}
                            </ScrollView>
                        </Card.Content>
                    </Card>
                )}
            </ScrollView>
        </SafeAreaView>
    )
};

export default Home;