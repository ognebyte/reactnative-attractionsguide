import { useState, useRef } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { TextInput, Button, useTheme, Text, Divider, Snackbar, Portal, } from 'react-native-paper';
import { Timestamp } from 'firebase/firestore';
import { signIn, signUp, sendPasswordReset } from '@firebase/firebaseService';


const NEXT_INPUT_OPTIONS = {
    returnKeyType: "next",
    blurOnSubmit: false
}


const AuthScreen = () => {
    const theme = useTheme();
    const [mode, setMode] = useState('login'); // 'login', 'register', 'forgot'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');

    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarText, setSnackbarText] = useState('');
    const [errorText, setErrorText] = useState('');

    const inputEmail = useRef(null);
    const inputPassword = useRef(null);
    const inputConfirmPassword = useRef(null);
    const inputFirstname = useRef(null);
    const inputLastname = useRef(null);

    const [loading, setLoading] = useState(false);


    const handleLogin = async () => {
        if (!email || !password) {
            setErrorText('Пожалуйста, заполните все поля');
            return;
        }
        setErrorText('');
        setLoading(true);
        try {
            await signIn(email, password);
        } catch (error) {
            switch (error.code) {
                case 'auth/user-not-found':
                    setErrorText('Пользователь не найден');
                    break;
                case 'auth/wrong-password':
                    setErrorText('Неверный пароль');
                    break;
                case 'auth/invalid-email':
                    setErrorText('Неверный формат email');
                    break;
                case 'auth/too-many-requests':
                    setErrorText('Слишком много попыток. Попробуйте позже');
                    break;
                default:
                    setErrorText('Неверный логин или пароль');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async () => {
        if (!email || !password || !confirmPassword || !firstname || !lastname) {
            setErrorText('Пожалуйста, заполните все поля');
            return;
        }
        if (password !== confirmPassword) {
            setErrorText('Пароли не совпадают');
            return;
        }
        if (password.length < 6) {
            setErrorText('Пароль должен содержать минимум 6 символов');
            return;
        }
        setErrorText('');
        setLoading(true);
        try {
            await signUp({
                firstname,
                lastname,
                email,
                created_at: Timestamp.now(),
                favorites: [],
            }, password)
        } catch (error) {
            switch (error.code) {
                case 'auth/email-already-in-use':
                    setErrorText('Этот email уже используется');
                    break;
                case 'auth/invalid-email':
                    setErrorText('Неверный формат email');
                    break;
                case 'auth/weak-password':
                    setErrorText('Слишком слабый пароль');
                    break;
            }
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async () => {
        if (!email) {
            setErrorText('Пожалуйста, введите email');
            return;
        }
        setErrorText('');
        setLoading(true);
        try {
            await sendPasswordReset(email);
            setMode('login');
            setSnackbarText('Письмо отправлено. Проверьте вашу почту для восстановления пароля');
            setSnackbarVisible(true);
        } catch (error) {
            setErrorText('Проверьте правильность электронной почты');
        } finally {
            setLoading(false);
        }
    };

    const isNextInput = (exists, nextInputRef) => {
        if (!exists) return;
        return {
            ...NEXT_INPUT_OPTIONS,
            onSubmitEditing: () => { nextInputRef.current.focus() }
        };
    }

    const resetForm = () => {
        setErrorText('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setFirstname('');
        setLastname('');
    };

    const switchMode = (newMode) => {
        setMode(newMode);
        resetForm();
    };


    return (
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
            <Text style={[styles.title, { color: theme.colors.onSurface }]}>
                {mode === 'login' ? 'Вход' : mode === 'register' ? 'Регистрация' : 'Восстановление пароля'}
            </Text>

            <View style={{ gap: 16 }}>
                {mode === 'register' && (
                    <>
                        <TextInput ref={inputLastname}
                            label="Фамилия"
                            value={lastname}
                            onChangeText={setLastname}
                            mode="outlined"
                            disabled={loading}

                            onSubmitEditing={() => { inputFirstname.current.focus(); }}
                            {...NEXT_INPUT_OPTIONS}
                        />
                        <TextInput ref={inputFirstname}
                            label="Имя"
                            value={firstname}
                            onChangeText={setFirstname}
                            mode="outlined"
                            disabled={loading}

                            onSubmitEditing={() => { inputEmail.current.focus(); }}
                            {...NEXT_INPUT_OPTIONS}
                        />
                    </>
                )}

                <TextInput ref={inputEmail}
                    label="Email"
                    value={email}
                    onChangeText={setEmail}
                    mode="outlined"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    disabled={loading}

                    {...isNextInput(mode !== 'forgot', inputPassword)}
                />

                {mode !== 'forgot' && (
                    <TextInput ref={inputPassword}
                        label="Пароль"
                        value={password}
                        onChangeText={setPassword}
                        mode="outlined"
                        secureTextEntry
                        disabled={loading}

                        {...isNextInput(mode === 'register', inputConfirmPassword)}
                    />
                )}

                {mode === 'register' && (
                    <TextInput ref={inputConfirmPassword}
                        label="Подтвердите пароль"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        mode="outlined"
                        secureTextEntry
                        disabled={loading}
                    />
                )}

                {errorText.length != 0 && (
                    <Text variant='bodyMedium' style={{ color: theme.colors.error }}>
                        {errorText}
                    </Text>
                )}
            </View>

            <Button
                mode="contained"
                onPress={() => {
                    if (mode === 'login') handleLogin();
                    else if (mode === 'register') handleRegister();
                    else handleForgotPassword();
                }}
                contentStyle={{ flexDirection: 'row-reverse' }}
                loading={loading}
                disabled={loading}
            >
                {mode === 'login' ? 'Войти' : mode === 'register' ? 'Зарегистрироваться' : 'Отправить письмо'}
            </Button>

            <Divider style={styles.divider} />

            <View style={styles.switchContainer}>
                {mode === 'login' && (
                    <>
                        <TouchableOpacity onPress={() => switchMode('register')}>
                            <Text variant="bodyLarge" style={[styles.linkText, { color: theme.colors.primary }]}>
                                Нет аккаунта? Зарегистрироваться
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => switchMode('forgot')}>
                            <Text variant="bodyLarge" style={[styles.linkText, { color: theme.colors.primary }]}>
                                Забыли пароль?
                            </Text>
                        </TouchableOpacity>
                    </>
                )}

                {mode === 'register' && (
                    <TouchableOpacity onPress={() => switchMode('login')}>
                        <Text variant="bodyLarge" style={[styles.linkText, { color: theme.colors.primary }]}>
                            Уже есть аккаунт? Войти
                        </Text>
                    </TouchableOpacity>
                )}

                {mode === 'forgot' && (
                    <TouchableOpacity onPress={() => switchMode('login')}>
                        <Text variant="bodyLarge" style={[styles.linkText, { color: theme.colors.primary }]}>
                            Вернуться к входу
                        </Text>
                    </TouchableOpacity>
                )}

            </View>

            <Portal>
                <Snackbar
                    visible={snackbarVisible}
                    onDismiss={() => setSnackbarVisible(false)}
                    duration={2000}
                >
                    {snackbarText}
                </Snackbar>
            </Portal>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        gap: 32,
        padding: 8
    },
    title: {
        textAlign: 'center',
        marginBottom: 16,
        fontSize: 28,
        fontWeight: 'bold'
    },
    switchContainer: {
        alignItems: 'center',
        gap: 16,
    },
    linkText: {
        textAlign: 'center',
        textDecorationLine: 'underline',
    },
});

export default AuthScreen;