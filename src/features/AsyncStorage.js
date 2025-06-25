import AsyncStorage from '@react-native-async-storage/async-storage';


export const getAsyncStorage = async (key) => {
    try {
        const value = await AsyncStorage.getItem(key);
        return value != null ? JSON.parse(value) : null;
    } catch (e) {
        throw new Error(e);
    }
};

export const setAsyncStorage = async (key, value) => {
    try {
        const jsonValue = JSON.stringify(value);
        await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {
        throw new Error(e);
    }
};

export const getAllAsyncStorage = async () => {
    try {
        const value = await AsyncStorage.getAllKeys();
        if (value.length == 0) return null;

        console.log();
        console.log('keys');
        value.map(async v => {
            let data = await getAsyncStorage(v);
            console.log(v, data)
        })

        return value;
    } catch (e) {
        throw new Error(e);
    }
};

export const clearAllAsyncStorage = async () => {
    try {
        await AsyncStorage.clear();
    } catch (e) {
        throw new Error(e);
    }
};