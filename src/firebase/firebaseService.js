import { collection, query, where, doc, getDocs, getDoc, setDoc, updateDoc, deleteDoc, addDoc, Timestamp } from "firebase/firestore";
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, signOut } from "@firebase/auth";
import { FIREBASE_AUTH, FIREBASE_DB } from "./firebase";


export const getCollection = async (collectionName) => {
    try {
        const dataRef = await getDocs(collection(FIREBASE_DB, collectionName));
        return dataRef.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        throw new Error(error);
    }
}

export const getDocumentsFromCollection = async (collectionName, collectionKey, docValue) => {
    try {
        const q = query(
            collection(FIREBASE_DB, collectionName),
            where(collectionKey, '==', docValue)
        );

        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        throw new Error(error);
    }
};

export const getDocById = async (collectionName, docId) => {
    try {
        const docRef = doc(FIREBASE_DB, collectionName, docId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        } else {
            throw new Error('Document does not exist');
        }
    } catch (error) {
        throw new Error(error);
    }
};

export const addDocument = async (collectionName, data) => {
    try {
        const collectionRef = collection(FIREBASE_DB, collectionName);
        const docRef = await addDoc(collectionRef, data);
        return docRef.id;
    } catch (error) {
        throw new Error(error);
    }
}

export const setDocument = async (collectionName, docId, data) => {
    try {
        const docRef = doc(FIREBASE_DB, collectionName, docId);
        await setDoc(docRef, data);
        return true;
    } catch (error) {
        throw new Error(error);
    }
};

export const updateDocument = async (collectionName, docId, data) => {
    try {
        const docRef = doc(FIREBASE_DB, collectionName, docId);
        await updateDoc(docRef, data);
        return true;
    } catch (error) {
        throw new Error(error);
    }
};

export const deleteDocument = async (collectionName, docId) => {
    try {
        const docRef = doc(FIREBASE_DB, collectionName, docId);
        await deleteDoc(docRef);
        return true;
    } catch (error) {
        throw new Error(error);
    }
};


// ========== AUTH ==========
export const authStateListener = (begin, setUser, clearUser) => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, async (user) => {
        begin();
        if (user) {
            // Пользователь авторизован
            const userData = await getDocById('users', user.uid);
            setUser(userData);
        } else {
            // Пользователь не авторизован
            clearUser();
        }
    });

    return unsubscribe;
}

export const signIn = async (email, password) => {
    await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
}

export const signUp = async (userData, password) => {
    const userCredential = await createUserWithEmailAndPassword(FIREBASE_AUTH, userData.email, password);
    const user = userCredential.user;
    await setDocument('users', user.uid, userData);
}

export const signOutFromAccount = async () => {
    await signOut(FIREBASE_AUTH);
}

export const sendPasswordReset = async (email) => {
    await sendPasswordResetEmail(FIREBASE_AUTH, email);
}


// ========== FAVORITES ==========
export const addToFavorites = async (userId, attractionId) => {
    const userData = await getDocById('users', userId);

    const existingFavorites = userData.favorites || [];
    const alreadyExists = existingFavorites.some(fav => fav.attraction_id === attractionId);

    if (alreadyExists) {
        throw new Error('Достопримечательность уже в избранном');
    }

    // Добавляем новое избранное
    const newFavorite = {
        attraction_id: attractionId,
        added_at: Timestamp.now()
    };

    const updatedFavorites = [...existingFavorites, newFavorite];

    // Обновляем документ пользователя
    await updateDocument('users', userId, {
        favorites: updatedFavorites
    });
    return updatedFavorites;
};

export const removeFromFavorites = async (userId, attractionId) => {
    // Получаем текущие данные пользователя
    const user = await getDocById('users', userId);

    // Фильтруем избранное, убирая нужную достопримечательность
    const existingFavorites = user.favorites || [];
    const updatedFavorites = existingFavorites.filter(fav => fav.attraction_id !== attractionId);

    // Обновляем документ пользователя
    await updateDocument('users', userId, {
        favorites: updatedFavorites
    });

    return updatedFavorites;
};


// ========== user ==========
export const updateUsername = async (userId, firstname, lastname) => {
    await updateDocument('users', userId, {
        firstname,
        lastname
    })
}