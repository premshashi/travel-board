import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import { TravelPost } from '@/types/travel';

// TODO: Replace with your Firebase config from Firebase Console
// Go to: Firebase Console > Project Settings > Your apps > Web app
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

const POSTS_COLLECTION = 'travel_posts';

export const addTravelPost = async (postData: Omit<TravelPost, 'id' | 'createdAt'>): Promise<TravelPost> => {
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
