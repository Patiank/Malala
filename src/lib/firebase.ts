import { initializeApp } from 'firebase/app';
import { initializeFirestore, persistentLocalCache, persistentSingleTabManager } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  projectId: "still-dimension-p8gvj",
  appId: "1:150503186564:web:64af24b2edc852fb23a2d1",
  apiKey: "AIzaSyBAizWQnaNb-EX-BcjoZt9BSRctFGyMEnE",
  authDomain: "still-dimension-p8gvj.firebaseapp.com",
  storageBucket: "still-dimension-p8gvj.firebasestorage.app",
  messagingSenderId: "150503186564",
};

export const app = initializeApp(firebaseConfig);
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentSingleTabManager({})
  })
}, "ai-studio-malaladiscoverwe-562e18f6-b088-4083-a613-a873b9667b3f");
export const auth = getAuth(app);
