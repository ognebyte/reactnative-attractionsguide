import { useEffect, useState } from "react";
import * as Updates from 'expo-updates';
import { useDispatch, useSelector } from "react-redux";
import { ScrollView, View } from "react-native";
import { ActivityIndicator, Avatar, Button, Dialog, Portal, Snackbar, Text, TextInput, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import { signOutFromAccount, updateUsername } from "@firebase/firebaseService";
import { clearAllAsyncStorage, getAllAsyncStorage } from "@features/AsyncStorage";
import { setUsername } from "@features/store/userSlice";
import GoBackButton from "@components/Layouts/GoBackButton";
import AuthScreen from "./AuthScreen";


const ProfileScreen = ({ navigation }) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const currentUser = useSelector((state) => state.user);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [dialogReloadVisible, setDialogReloadVisible] = useState(false);
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarText, setSnackbarText] = useState('');

    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [saving, setSaving] = useState(false);


    useEffect(() => {
        setFirstname(currentUser.user?.firstname || '')
        setLastname(currentUser.user?.lastname || '')
    }, [currentUser.user])

    const clearLocalData = async () => {
        try {
            await clearAllAsyncStorage();
            setDialogVisible(false);
            setDialogReloadVisible(true);
        } catch (error) {
            setSnackbarText('Произошла ошибка. Повторите попытку позже');
            setSnackbarVisible(true);
        }
    }

    const handeSignOut = async () => {
        try {
            await signOutFromAccount();
        } catch (error) {
            setSnackbarText('Произошла ошибка. Повторите попытку позже');
            setSnackbarVisible(true);
        }
    }

    const handleSave = async () => {
        if (!firstname || !lastname) {
            setSnackbarText('Пожалуйста, заполните все поля');
            setSnackbarVisible(true);
            return;
        }
        try {
            setSaving(true);
            await updateUsername(currentUser.user.id, firstname, lastname);
            dispatch(setUsername({ firstname, lastname }));
            setSnackbarText('Изменения успешно сохранены');
            setSnackbarVisible(true);
        } catch (error) {
            setSnackbarText('Ошибка при сохранении');
            setSnackbarVisible(true);
            console.error(error)
        } finally {
            setSaving(false);
        }
    };


    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ paddingLeft: 8, paddingTop: 8 }}>
                <GoBackButton navigation={navigation} />
            </View>
            {currentUser.loading ?
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16 }}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                    <Text variant="titleMedium">
                        Загрузка...
                    </Text>
                </View>
                :
                !currentUser.user ?
                    <AuthScreen /> :
                    <ScrollView contentContainerStyle={{ paddingTop: 16, paddingBottom: 24, gap: 64, paddingHorizontal: 8 }}>
                        <View style={{ alignItems: 'center' }}>
                            <Avatar.Text size={128} label={currentUser.user.lastname[0] + currentUser.user.firstname[0]} />
                        </View>
                        <View style={{ gap: 16 }}>
                            <TextInput
                                mode="outlined"
                                label="Фамилия"
                                value={lastname}
                                onChangeText={setLastname}
                            />
                            <TextInput
                                mode="outlined"
                                label="Имя"
                                value={firstname}
                                onChangeText={setFirstname}
                            />
                            <TextInput
                                mode="outlined"
                                label="Email"
                                defaultValue={currentUser.user.email}
                                disabled
                            />
                            <Button
                                mode="contained"
                                onPress={handleSave}
                                loading={saving}
                                disabled={saving}
                                contentStyle={{ flexDirection: 'row-reverse' }}
                            >
                                Сохранить
                            </Button>
                        </View>

                        <View style={{ gap: 16 }}>
                            <Button
                                mode="contained"
                                icon='logout'
                                onPress={handeSignOut}
                                contentStyle={{ flexDirection: 'row-reverse' }}
                            >
                                Выйти из аккаунта
                            </Button>

                            <Button
                                mode="contained"
                                icon='trash-can-outline'
                                onPress={() => setDialogVisible(true)}
                                buttonColor={theme.colors.error}
                                textColor={theme.colors.onError}
                                contentStyle={{ flexDirection: 'row-reverse' }}
                            >
                                Удалить все локальные данные
                            </Button>
                        </View>

                        <Portal>
                            <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
                                <Dialog.Title>Подтверждение удаления</Dialog.Title>
                                <Dialog.Content>
                                    <Text variant="bodyMedium">
                                        Вы уверены, что хотите удалить все локальные данные?
                                    </Text>
                                </Dialog.Content>
                                <Dialog.Actions>
                                    <Button onPress={() => setDialogVisible(false)}
                                        mode="outlined"
                                        style={{ flex: 1 }}
                                    >
                                        Нет
                                    </Button>
                                    <Button mode="contained"
                                        style={{ flex: 1 }}
                                        buttonColor={theme.colors.error}
                                        textColor={theme.colors.onError}
                                        onPress={clearLocalData}
                                    >
                                        Да
                                    </Button>
                                </Dialog.Actions>
                            </Dialog>

                            <Dialog visible={dialogReloadVisible} onDismiss={Updates.reloadAsync}>
                                <Dialog.Title>Успех</Dialog.Title>
                                <Dialog.Content>
                                    <Text variant="bodyMedium">
                                        Все локальные данные были успешно удалены. Приложение будет перезапущено.
                                    </Text>
                                </Dialog.Content>
                                <Dialog.Actions>
                                    <Button onPress={Updates.reloadAsync} mode="contained">
                                        Перезапустить
                                    </Button>
                                </Dialog.Actions>
                            </Dialog>

                            <Snackbar
                                visible={snackbarVisible}
                                onDismiss={() => setSnackbarVisible(false)}
                                duration={2000}
                            >
                                {snackbarText}
                            </Snackbar>
                        </Portal>
                    </ScrollView>
            }
        </SafeAreaView>
    )
};

export default ProfileScreen;