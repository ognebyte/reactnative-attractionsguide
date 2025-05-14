import { collection, query, where, doc, getDocs, getDoc, setDoc, addDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { FIREBASE_DB } from "./firebase";


export const getCollection = async (collectionName) => {
    try {
        const dataRef = await getDocs(collection(FIREBASE_DB, collectionName));
        return dataRef.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        throw new Error('Error getting collection:', error);
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
        console.error("Error getting documents by collection value:", error);
        return [];
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
        throw new Error('Error getting document:', error);
    }
};

export const setDocument = async (collectionName, docId, data) => {
    try {
        const docRef = doc(FIREBASE_DB, collectionName, docId);
        await setDoc(docRef, data);
        return true;
    } catch (error) {
        throw new Error('Error setting document:', error);
    }
};

export const updateDocument = async (collectionName, docId, data) => {
    try {
        const docRef = doc(FIREBASE_DB, collectionName, docId);
        await updateDoc(docRef, data);
        return true;
    } catch (error) {
        throw new Error('Error updating document:', error);
    }
};

export const deleteDocument = async (collectionName, docId) => {
    try {
        const docRef = doc(FIREBASE_DB, collectionName, docId);
        await deleteDoc(docRef);
        return true;
    } catch (error) {
        throw new Error('Error deleting document:', error);
    }
};