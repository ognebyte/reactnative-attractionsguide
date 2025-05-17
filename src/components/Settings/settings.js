import { ScrollView } from 'react-native';
import { Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { clearAllAsyncStorage } from '@/features/AsyncStorage';


const Settings = () => {
    async function clearAll() {
        await clearAllAsyncStorage()
        console.log('cleared')
    }

    return (
        <SafeAreaView>
            <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
                <Button icon='trash-can-outline' onPress={() => clearAll()}>
                    Clear async storage
                </Button>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Settings;