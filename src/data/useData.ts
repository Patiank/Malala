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
  const [appSettings, setAppSettings] = useState<AppSettings>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('malala_app_settings');
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.warn('Failed to parse appSettings from localStorage:', e);
      }
    }
    return {
      bgMediaType: 'image',
      baseImage: BG_IMAGE_1,
      revealImage: BG_IMAGE_2,
      baseVideo: '',
    };
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
        if (data && (data.baseImage || data.revealImage || data.baseVideo)) {
          // Check if local storage has custom uploaded media (data: URLs or custom URLs)
          let hasLocalCustom = false;
          if (typeof window !== 'undefined') {
            try {
              const localSaved = localStorage.getItem('malala_app_settings');
              if (localSaved) {
                const parsed = JSON.parse(localSaved);
                if (parsed.baseImage?.startsWith('data:') || parsed.revealImage?.startsWith('data:') || parsed.baseVideo?.startsWith('data:')) {
                  hasLocalCustom = true;
                }
              }
            } catch (e) {}
          }

          if (!hasLocalCustom) {
            const fetched: AppSettings = {
              bgMediaType: data.bgMediaType || 'image',
              baseImage: data.baseImage ? getDirectDriveUrl(data.baseImage) : BG_IMAGE_1,
              revealImage: data.revealImage ? getDirectDriveUrl(data.revealImage) : BG_IMAGE_2,
              baseVideo: data.baseVideo || '',
              allowedAdminEmails: data.allowedAdminEmails && data.allowedAdminEmails.length > 0 ? data.allowedAdminEmails : ['aldoaldiles@gmail.com'],
            };
            setAppSettings(fetched);
            if (typeof window !== 'undefined') {
              try {
                localStorage.setItem('malala_app_settings', JSON.stringify(fetched));
              } catch (e) {
                console.warn('Failed to save settings to localStorage:', e);
              }
            }
          }
        }
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
      const formatted: AppSettings = {
        bgMediaType: newSettings.bgMediaType || 'image',
        baseImage: newSettings.baseImage ? getDirectDriveUrl(newSettings.baseImage) : BG_IMAGE_1,
        revealImage: newSettings.revealImage ? getDirectDriveUrl(newSettings.revealImage) : BG_IMAGE_2,
        baseVideo: newSettings.baseVideo || '',
        allowedAdminEmails: newSettings.allowedAdminEmails && newSettings.allowedAdminEmails.length > 0 ? newSettings.allowedAdminEmails : ['aldoaldiles@gmail.com'],
      };
      setAppSettings(formatted);

      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('malala_app_settings', JSON.stringify(formatted));
        } catch (e) {
          console.warn('Failed to save settings to localStorage (quota exceeded or storage full):', e);
        }
      }

      // Safe payload for Firestore
      const firestorePayload: any = {
        bgMediaType: formatted.bgMediaType,
        allowedAdminEmails: formatted.allowedAdminEmails,
      };
      if (formatted.baseImage && (!formatted.baseImage.startsWith('data:') || formatted.baseImage.length < 800000)) {
        firestorePayload.baseImage = formatted.baseImage;
      }
      if (formatted.revealImage && (!formatted.revealImage.startsWith('data:') || formatted.revealImage.length < 800000)) {
        firestorePayload.revealImage = formatted.revealImage;
      }
      if (formatted.baseVideo && (!formatted.baseVideo.startsWith('data:') || formatted.baseVideo.length < 800000)) {
        firestorePayload.baseVideo = formatted.baseVideo;
      }

      await setDoc(doc(db, 'settings', 'hero'), firestorePayload, { merge: true });
    } catch (e) {
      console.warn("Cloud settings sync notice (saved locally): ", e);
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
      allowedAdminEmails: ['aldoaldiles@gmail.com'],
    });
    await batch.commit();
  };

  const getDestinationsWithEn = () => DESTINATIONS.map(item => ({
    ...item,
    titleEn: item.titleEn || item.title,
    categoryEn: item.categoryEn || item.category,
    tagEn: item.tagEn || item.tag,
    descriptionEn: item.descriptionEn || item.description,
    highlightsEn: item.highlightsEn || item.highlights,
    bestTimeEn: item.bestTimeEn || item.bestTime,
    locationDetailsEn: item.locationDetailsEn || item.locationDetails
  }));

  const getCultureWithEn = () => CULTURE_ITEMS.map(item => ({
    ...item,
    titleEn: item.titleEn || item.title,
    categoryEn: item.categoryEn || item.category,
    descriptionEn: item.descriptionEn || item.description,
    philosophyEn: item.philosophyEn || item.philosophy,
    originEn: item.originEn || item.origin
  }));

  const getCulinaryWithEn = () => CULINARY_ITEMS.map(item => ({
    ...item,
    titleEn: item.titleEn || item.title,
    typeEn: item.typeEn || item.type,
    originEn: item.originEn || item.origin,
    descriptionEn: item.descriptionEn || item.description,
    flavorProfileEn: item.flavorProfileEn || item.flavorProfile
  }));

  const getEventsWithEn = () => EVENTS_SCHEDULE.map(item => ({
    ...item,
    titleEn: item.titleEn || item.title,
    scheduleEn: item.scheduleEn || item.schedule,
    locationEn: item.locationEn || item.location,
    descriptionEn: item.descriptionEn || item.description
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

