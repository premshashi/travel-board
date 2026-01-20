import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, query, orderBy, Timestamp, Firestore } from 'firebase/firestore';
import { TravelPost } from '@/types/travel';

// TODO: Replace with your Firebase config from Firebase Console
// Go to: Firebase Console > Project Settings > Your apps > Web app
const firebaseConfig = {
  apiKey: "AIzaSyCJ5w9lKnLo46z8fzx7WgvEjD5qkFkj7CI",
  authDomain: "travelboard-78c4e.firebaseapp.com",
  projectId: "travelboard-78c4e",
  storageBucket: "travelboard-78c4e.firebasestorage.app",
  messagingSenderId: "335185155350",
  appId: "1:335185155350:web:e6589989aab1be07496c37",
  measurementId: "G-V1019B8SV8"
};

let app: FirebaseApp | null = null;
let db: Firestore | null = null;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
} catch (error) {
  console.error('Firebase initialization error:', error);
}

export { db };

const POSTS_COLLECTION = 'travel_posts';

export const addTravelPost = async (postData: Omit<TravelPost, 'id' | 'createdAt'>): Promise<TravelPost> => {
  if (!db) {
    throw new Error('Firebase not initialized');
  }
  
  const docRef = await addDoc(collection(db, POSTS_COLLECTION), {
    ...postData,
    createdAt: Timestamp.now(),
  });
  
  return {
    ...postData,
    id: docRef.id,
    createdAt: new Date().toISOString().split('T')[0],
  };
};

export const getTravelPosts = async (): Promise<TravelPost[]> => {
  if (!db) {
    console.warn('Firebase not initialized, returning empty array');
    return [];
  }
  
  const q = query(collection(db, POSTS_COLLECTION), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      origin: data.origin,
      originFull: data.originFull,
      destination: data.destination,
      destinationFull: data.destinationFull,
      travelDate: data.travelDate,
      departureTime: data.departureTime,
      flightNumber: data.flightNumber,
      airline: data.airline,
      requestType: data.requestType,
      postedBy: data.postedBy,
      contactMethod: data.contactMethod,
      contactId: data.contactId,
      createdAt: data.createdAt?.toDate?.()?.toISOString?.()?.split('T')[0] || new Date().toISOString().split('T')[0],
    } as TravelPost;
  });
};
