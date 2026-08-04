import { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, setDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { DESTINATIONS, CULTURE_ITEMS, CULINARY_ITEMS, EVENTS_SCHEDULE, DOWNLOAD_ITEMS, HOT_INFO_ITEMS, BG_IMAGE_1, BG_IMAGE_2, getDirectDriveUrl } from './content';
import { Destination, CultureItem, CulinaryItem, EventItem, DownloadItem, HotInfoItem, AppSettings } from '../types';

export function useData() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [cultureItems, setCultureItems] = useState<CultureItem[]>([]);
  const [culinaryItems, setCulinaryItems] = useState<CulinaryItem[]>([]);
  const [eventItems, setEventItems] = useState<EventItem[]>([]);
  const [downloadItems, setDownloadItems] = useState<DownloadItem[]>([]);
  const [hotInfoItems, setHotInfoItems] = useState<HotInfoItem[]>([]);
  const [appSettings, setAppSettings] = useState<AppSettings>({
    baseImage: BG_IMAGE_1,
    revealImage: BG_IMAGE_2,
  });

  useEffect(() => {
    // We subscribe to all collections
    const unsubDest = onSnapshot(collection(db, 'destinations'), (snapshot) => {
      const data = snapshot.docs.map(doc => {
        const item = doc.data() as Destination;
        return { id: doc.id, ...item, imageUrl: item.imageUrl ? getDirectDriveUrl(item.imageUrl) : '' };
      });
      if (data.length > 0) setDestinations(data);
    }, (err) => console.warn("Firestore destinations error:", err));

    const unsubCult = onSnapshot(collection(db, 'cultures'), (snapshot) => {
      const data = snapshot.docs.map(doc => {
        const item = doc.data() as CultureItem;
        return { id: doc.id, ...item, imageUrl: item.imageUrl ? getDirectDriveUrl(item.imageUrl) : '' };
      });
      if (data.length > 0) setCultureItems(data);
    }, (err) => console.warn("Firestore cultures error:", err));

    const unsubCul = onSnapshot(collection(db, 'culinaries'), (snapshot) => {
      const data = snapshot.docs.map(doc => {
        const item = doc.data() as CulinaryItem;
        return { id: doc.id, ...item, imageUrl: item.imageUrl ? getDirectDriveUrl(item.imageUrl) : '' };
      });
      if (data.length > 0) setCulinaryItems(data);
    }, (err) => console.warn("Firestore culinaries error:", err));

    const unsubEvt = onSnapshot(collection(db, 'events'), (snapshot) => {
      const data = snapshot.docs.map(doc => {
        const item = doc.data() as EventItem;
        return { id: doc.id, ...item, imageUrl: item.imageUrl ? getDirectDriveUrl(item.imageUrl) : '' };
      });
      if (data.length > 0) setEventItems(data);
    }, (err) => console.warn("Firestore events error:", err));

    const unsubDl = onSnapshot(collection(db, 'downloads'), (snapshot) => {
      const data = snapshot.docs.map(doc => {
        const item = doc.data() as DownloadItem;
        return { id: doc.id, ...item };
      });
      if (data.length > 0) setDownloadItems(data);
    }, (err) => console.warn("Firestore downloads error:", err));

    const unsubHot = onSnapshot(collection(db, 'hotinfo'), (snapshot) => {
      const data = snapshot.docs.map(doc => {
        const item = doc.data() as HotInfoItem;
        return { id: doc.id, ...item, imageUrl: item.imageUrl ? getDirectDriveUrl(item.imageUrl) : '' };
      });
      if (data.length > 0) setHotInfoItems(data);
    }, (err) => console.warn("Firestore hotinfo error:", err));

    const unsubSett = onSnapshot(doc(db, 'settings', 'hero'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as AppSettings;
        setAppSettings({
          baseImage: data.baseImage ? getDirectDriveUrl(data.baseImage) : BG_IMAGE_1,
          revealImage: data.revealImage ? getDirectDriveUrl(data.revealImage) : BG_IMAGE_2,
        });
      }
    }, (err) => console.warn("Firestore settings error:", err));

    return () => {
      unsubDest();
      unsubCult();
      unsubCul();
      unsubEvt();
      unsubDl();
      unsubHot();
      unsubSett();
    };
  }, []);

  const saveItem = async (colName: string, item: any) => {
    try {
      const formattedItem = {
        ...item,
        imageUrl: item.imageUrl ? getDirectDriveUrl(item.imageUrl) : ''
      };
      await setDoc(doc(db, colName, item.id), formattedItem);
    } catch (e) {
      console.error("Error saving to Firebase: ", e);
    }
  };

  const saveSettings = async (newSettings: AppSettings) => {
    try {
      const formatted = {
        baseImage: newSettings.baseImage ? getDirectDriveUrl(newSettings.baseImage) : BG_IMAGE_1,
        revealImage: newSettings.revealImage ? getDirectDriveUrl(newSettings.revealImage) : BG_IMAGE_2,
      };
      await setDoc(doc(db, 'settings', 'hero'), formatted);
    } catch (e) {
      console.error("Error saving settings to Firebase: ", e);
    }
  };

  const deleteItem = async (colName: string, id: string) => {
    try {
      await deleteDoc(doc(db, colName, id));
    } catch (e) {
      console.error("Error deleting from Firebase: ", e);
    }
  };

  const seedData = async () => {
    const batch = writeBatch(db);
    DESTINATIONS.forEach(item => batch.set(doc(db, 'destinations', item.id), {
      ...item,
      titleEn: `[EN] ${item.title}`,
      categoryEn: item.category,
      tagEn: `[EN] ${item.tag}`,
      descriptionEn: `[EN] ${item.description}`,
      highlightsEn: item.highlights.map(h => `[EN] ${h}`),
      bestTimeEn: `[EN] ${item.bestTime}`,
      locationDetailsEn: `[EN] ${item.locationDetails}`
    }));
    CULTURE_ITEMS.forEach(item => batch.set(doc(db, 'cultures', item.id), {
      ...item,
      titleEn: `[EN] ${item.title}`,
      categoryEn: item.category,
      descriptionEn: `[EN] ${item.description}`,
      philosophyEn: `[EN] ${item.philosophy}`,
      originEn: `[EN] ${item.origin}`
    }));
    CULINARY_ITEMS.forEach(item => batch.set(doc(db, 'culinaries', item.id), {
      ...item,
      titleEn: `[EN] ${item.title}`,
      typeEn: item.type,
      originEn: `[EN] ${item.origin}`,
      descriptionEn: `[EN] ${item.description}`,
      flavorProfileEn: `[EN] ${item.flavorProfile}`
    }));
    EVENTS_SCHEDULE.forEach(item => batch.set(doc(db, 'events', item.id), {
      ...item,
      titleEn: `[EN] ${item.title}`,
      scheduleEn: `[EN] ${item.schedule}`,
      locationEn: `[EN] ${item.location}`,
      descriptionEn: `[EN] ${item.description}`
    }));
    DOWNLOAD_ITEMS.forEach(item => batch.set(doc(db, 'downloads', item.id), item));
    HOT_INFO_ITEMS.forEach(item => batch.set(doc(db, 'hotinfo', item.id), item));
    batch.set(doc(db, 'settings', 'hero'), {
      baseImage: BG_IMAGE_1,
      revealImage: BG_IMAGE_2,
    });
    await batch.commit();
  };

  const getDestinationsWithEn = () => DESTINATIONS.map(item => ({
    ...item,
    titleEn: `[EN] ${item.title}`,
    categoryEn: item.category,
    tagEn: `[EN] ${item.tag}`,
    descriptionEn: `[EN] ${item.description}`,
    highlightsEn: item.highlights.map(h => `[EN] ${h}`),
    bestTimeEn: `[EN] ${item.bestTime}`,
    locationDetailsEn: `[EN] ${item.locationDetails}`
  }));

  const getCultureWithEn = () => CULTURE_ITEMS.map(item => ({
    ...item,
    titleEn: `[EN] ${item.title}`,
    categoryEn: item.category,
    descriptionEn: `[EN] ${item.description}`,
    philosophyEn: `[EN] ${item.philosophy}`,
    originEn: `[EN] ${item.origin}`
  }));

  const getCulinaryWithEn = () => CULINARY_ITEMS.map(item => ({
    ...item,
    titleEn: `[EN] ${item.title}`,
    typeEn: item.type,
    originEn: `[EN] ${item.origin}`,
    descriptionEn: `[EN] ${item.description}`,
    flavorProfileEn: `[EN] ${item.flavorProfile}`
  }));

  const getEventsWithEn = () => EVENTS_SCHEDULE.map(item => ({
    ...item,
    titleEn: `[EN] ${item.title}`,
    scheduleEn: `[EN] ${item.schedule}`,
    locationEn: `[EN] ${item.location}`,
    descriptionEn: `[EN] ${item.description}`
  }));

  return {
    destinations: destinations.length > 0 ? destinations : getDestinationsWithEn(),
    cultureItems: cultureItems.length > 0 ? cultureItems : getCultureWithEn(),
    culinaryItems: culinaryItems.length > 0 ? culinaryItems : getCulinaryWithEn(),
    eventItems: eventItems.length > 0 ? eventItems : getEventsWithEn(),
    downloadItems: downloadItems.length > 0 ? downloadItems : DOWNLOAD_ITEMS,
    hotInfoItems: hotInfoItems.length > 0 ? hotInfoItems : HOT_INFO_ITEMS,
    appSettings,
    saveItem,
    saveSettings,
    deleteItem,
    seedData
  };
}

