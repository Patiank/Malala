import React, { useState, useEffect } from 'react';
import { Destination, CultureItem, CulinaryItem, EventItem } from '../types';
import { Trash2, Plus, Edit3, Check, X } from 'lucide-react';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';

interface AdminPanelProps {
  dataStore: any;
}


type TabType = 'destinations' | 'culture' | 'culinary' | 'events' | 'download' | 'hotinfo' | 'settings';

export const AdminPanel: React.FC<AdminPanelProps> = ({ dataStore }) => {
  const [adminTab, setAdminTab] = useState<TabType>('destinations');
  
  const {
    destinations,
    cultureItems,
    culinaryItems,
    eventItems,
    downloadItems,
    hotInfoItems,
    appSettings,
    saveItem,
    saveSettings,
    deleteItem,
  } = dataStore;

  // Settings form state
  const [settingsFormData, setSettingsFormData] = useState({
    bgMediaType: appSettings?.bgMediaType || 'image',
    baseImage: appSettings?.baseImage || '',
    revealImage: appSettings?.revealImage || '',
    baseVideo: appSettings?.baseVideo || '',
  });

  useEffect(() => {
    if (appSettings) {
      setSettingsFormData({
        bgMediaType: appSettings.bgMediaType || 'image',
        baseImage: appSettings.baseImage || '',
        revealImage: appSettings.revealImage || '',
        baseVideo: appSettings.baseVideo || '',
      });
    }
  }, [appSettings]);

  // Generic editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>(null);
  const [adminError, setAdminError] = useState<string | null>(null);
  const [adminSuccess, setAdminSuccess] = useState<string | null>(null);
  
  // Auth state & Admin Whitelist
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [allowedAdminEmails, setAllowedAdminEmails] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('malala_allowed_admin_emails');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {
        console.warn('Failed to parse allowed admin emails:', e);
      }
    }
    return ['aldoaldiles@gmail.com'];
  });
  const [newAdminEmail, setNewAdminEmail] = useState<string>('');

  // Sync allowed admin emails to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('malala_allowed_admin_emails', JSON.stringify(allowedAdminEmails));
      } catch (e) {
        console.warn('Failed to save admin emails:', e);
      }
    }
  }, [allowedAdminEmails]);

  const checkIsEmailAllowed = (email: string | null | undefined): boolean => {
    if (!email) return false;
    if (!allowedAdminEmails || allowedAdminEmails.length === 0) return false;
    return allowedAdminEmails.some((e) => e.toLowerCase().trim() === email.toLowerCase().trim());
  };

  const getActiveData = () => {
    switch (adminTab) {
      case 'destinations': return destinations;
      case 'culture': return cultureItems;
      case 'culinary': return culinaryItems;
      case 'events': return eventItems;
      case 'download': return downloadItems || [];
      case 'hotinfo': return hotInfoItems || [];
      default: return [];
    }
  };

  const showSuccess = (msg: string) => {
    setAdminSuccess(msg);
    setTimeout(() => setAdminSuccess(null), 3000);
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setFormData({ ...item });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettingsFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveSettings = async () => {
    try {
      await saveSettings(settingsFormData);
      showSuccess('Pengaturan gambar latar belakang berhasil disimpan!');
    } catch (e) {
      setAdminError('Gagal menyimpan pengaturan latar belakang');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setFormData((prev: any) => ({
        ...prev,
        filename: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        mimeType: file.type || 'application/octet-stream',
        content: result,
      }));
    };
    reader.readAsDataURL(file);
  };
  
  const handleArrayChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
     const val = e.target.value.split('\n').map(v => v.trim()).filter(Boolean);
     setFormData((prev: any) => ({ ...prev, [name]: val }));
  };

  const getCollectionName = () => {
    switch (adminTab) {
      case 'destinations': return 'destinations';
      case 'culture': return 'cultures';
      case 'culinary': return 'culinaries';
      case 'events': return 'events';
      case 'download': return 'downloads';
      case 'hotinfo': return 'hotinfo';
      default: return '';
    }
  };

  const handleSave = async () => {
    try {
      if (!formData.id) {
        formData.id = `item_${Date.now()}`;
      }
      const colName = getCollectionName();
      await saveItem(colName, formData);
      showSuccess('Perubahan berhasil disimpan');
      setEditingId(null);
      setFormData(null);
    } catch (e: any) {
      setAdminError('Error saving data');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Yakin ingin menghapus item ini?')) {
      const colName = getCollectionName();
      await deleteItem(colName, id);
      showSuccess('Item berhasil dihapus');
    }
  };

  const handleAddNew = () => {
    let emptyItem: any = {};
    switch (adminTab) {
      case 'destinations':
        emptyItem = { id: '', title: '', category: 'Alam', regency: '', tag: '', description: '', highlights: [], bestTime: '', locationDetails: '', imageUrl: '', videoUrl: '', mapUrl: '' };
        break;
      case 'culture':
        emptyItem = { id: '', title: '', category: 'Arsitektur', description: '', philosophy: '', origin: '', imageUrl: '', videoUrl: '', mapUrl: '' };
        break;
      case 'culinary':
        emptyItem = { id: '', title: '', type: 'Makanan Utama', origin: '', description: '', flavorProfile: '', imageUrl: '', videoUrl: '', mapUrl: '' };
        break;
      case 'events':
        emptyItem = { id: '', title: '', schedule: '', location: '', description: '', imageUrl: '', videoUrl: '', mapUrl: '' };
        break;
      case 'download':
        emptyItem = { id: '', title: '', category: 'E-Booklet PDF', type: 'Document PDF', size: '2.5 MB', description: '', filename: 'Buku_Panduan.pdf', content: 'Isi Dokumen Resmi Pariwisata Sumbar...', mimeType: 'application/pdf' };
        break;
      case 'hotinfo':
        emptyItem = { id: '', title: '', category: 'Berita Utama', date: 'Hari Ini', description: '', imageUrl: '', tag: 'Update', actionUrl: '' };
        break;
    }
    setFormData(emptyItem);
    setEditingId('new');
  };

  const activeData = getActiveData();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        if (checkIsEmailAllowed(user.email)) {
          setIsAuthenticated(true);
          setLoginError(null);
        } else {
          await signOut(auth);
          setIsAuthenticated(false);
          setLoginError(`Akses Ditolak: Email '${user.email}' tidak terdaftar sebagai Admin MALALA.`);
        }
      }
    });
    return () => unsub();
  }, [allowedAdminEmails]);

  const handleGoogleLogin = async () => {
    try {
      setLoginError(null);
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        if (checkIsEmailAllowed(result.user.email)) {
          setIsAuthenticated(true);
          setLoginError(null);
        } else {
          await signOut(auth);
          setIsAuthenticated(false);
          setLoginError(`Akses Ditolak: Email '${result.user.email}' tidak terdaftar di Whitelist Admin (${allowedAdminEmails.join(', ')}).`);
        }
      }
    } catch (error: any) {
      console.warn("Google Auth popup error detail:", error);
      const errCode = error?.code || '';
      const errMessage = error?.message || '';

      if (errCode === 'auth/popup-blocked' || errCode === 'auth/cancelled-popup-request') {
        setLoginError('⚠️ Pop-up diblokir oleh browser Anda! Silakan klik ikon blokir di bilah alamat browser (URL bar) dan pilih "Always allow popups", atau gunakan PIN Rahasia Admin di bawah.');
      } else if (errCode === 'auth/unauthorized-domain') {
        setLoginError('⚠️ Domain localhost belum didaftarkan di Firebase Console Authorized Domains.');
      } else if (errCode === 'auth/popup-closed-by-user') {
        setLoginError('⚠️ Jendela Google Sign-In ditutup sebelum selesai. Silakan coba lagi.');
      } else {
        setLoginError(`Gagal masuk Google (${errCode || 'Error'}): ${errMessage}`);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error(error);
    }
    setIsAuthenticated(false);
  };

  const [showPinInput, setShowPinInput] = useState<boolean>(false);
  const [pinCode, setPinCode] = useState<string>('');

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinCode.trim() === '496501') {
      setIsAuthenticated(true);
      setLoginError(null);
    } else {
      setLoginError('PIN Darurat Admin salah.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-white p-6 rounded-lg font-jakarta">
        <div className="w-full max-w-sm border border-gray-200 rounded-xl p-6 shadow-md text-center bg-white space-y-4">
          <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto border border-red-100">
            🛡️
          </div>
          <div>
            <h3 className="font-orbitron font-extrabold text-sm uppercase tracking-wider text-black">
              Otentikasi Admin Terlindungi
            </h3>
            <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">
              Masuk menggunakan Akun Google resmi yang terdaftar sebagai Admin.
            </p>
          </div>

          {loginError && (
            <div className="p-3 bg-red-50 text-red-700 text-[11px] font-bold rounded-lg border border-red-200 text-left leading-relaxed">
              {loginError}
            </div>
          )}

          <button 
            type="button" 
            onClick={handleGoogleLogin}
            className="w-full bg-black text-white py-3 px-4 rounded-lg font-jakarta font-bold text-xs uppercase tracking-wider hover:bg-gray-800 transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>🔐 Masuk Dengan Akun Google</span>
          </button>

          {!showPinInput ? (
            <button
              type="button"
              onClick={() => setShowPinInput(true)}
              className="text-[10px] text-gray-400 hover:text-black transition-colors underline uppercase tracking-wider block mx-auto cursor-pointer"
            >
              Pop-up diblokir? Gunakan PIN Darurat Admin
            </button>
          ) : (
            <form onSubmit={handlePinSubmit} className="pt-2 border-t border-gray-100 space-y-2">
              <input
                type="password"
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value)}
                placeholder="Masukkan PIN Darurat Admin..."
                className="w-full bg-gray-50 border border-gray-300 rounded p-2 text-xs text-center font-mono font-bold focus:outline-none focus:border-black"
                autoFocus
              />
              <button
                type="submit"
                className="w-full bg-gray-900 text-white py-2 rounded text-xs font-bold uppercase tracking-wider hover:bg-black"
              >
                Masuk dengan PIN Darurat
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-7 gap-1 bg-gray-100 p-1.5 rounded-lg shrink-0 mb-4 text-[11px] font-jakarta">
        <button onClick={() => { setAdminTab('destinations'); handleCancelEdit(); }} className={`py-2 px-1 rounded-md font-bold uppercase transition-all ${adminTab === 'destinations' ? 'bg-black text-white shadow-xs' : 'text-gray-600 hover:text-black'}`}>Destinasi</button>
        <button onClick={() => { setAdminTab('culture'); handleCancelEdit(); }} className={`py-2 px-1 rounded-md font-bold uppercase transition-all ${adminTab === 'culture' ? 'bg-black text-white shadow-xs' : 'text-gray-600 hover:text-black'}`}>Budaya</button>
        <button onClick={() => { setAdminTab('culinary'); handleCancelEdit(); }} className={`py-2 px-1 rounded-md font-bold uppercase transition-all ${adminTab === 'culinary' ? 'bg-black text-white shadow-xs' : 'text-gray-600 hover:text-black'}`}>Kuliner</button>
        <button onClick={() => { setAdminTab('events'); handleCancelEdit(); }} className={`py-2 px-1 rounded-md font-bold uppercase transition-all ${adminTab === 'events' ? 'bg-black text-white shadow-xs' : 'text-gray-600 hover:text-black'}`}>Event</button>
        <button onClick={() => { setAdminTab('download'); handleCancelEdit(); }} className={`py-2 px-1 rounded-md font-bold uppercase transition-all ${adminTab === 'download' ? 'bg-black text-white shadow-xs' : 'text-gray-600 hover:text-black'}`}>Unduhan</button>
        <button onClick={() => { setAdminTab('hotinfo'); handleCancelEdit(); }} className={`py-2 px-1 rounded-md font-bold uppercase transition-all ${adminTab === 'hotinfo' ? 'bg-red-600 text-white shadow-xs' : 'text-red-700 bg-red-50 hover:bg-red-100'}`}>Hot Info</button>
        <button onClick={() => { setAdminTab('settings'); handleCancelEdit(); }} className={`py-2 px-1 rounded-md font-bold uppercase transition-all col-span-2 sm:col-span-1 ${adminTab === 'settings' ? 'bg-amber-600 text-white shadow-xs' : 'text-amber-800 bg-amber-50 hover:bg-amber-100'}`}>Settings Latar</button>
      </div>

      {/* Messages */}
      {adminError && <div className="p-3 bg-red-50 text-red-700 text-xs font-jakarta rounded-md border border-red-200 mb-4">{adminError}</div>}
      {adminSuccess && <div className="p-3 bg-green-50 text-green-700 text-xs font-jakarta rounded-md border border-green-200 mb-4">{adminSuccess}</div>}

      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-sm uppercase tracking-wider font-jakarta">
          {adminTab === 'download' ? 'Kelola Media Kit & Unduhan' : adminTab === 'hotinfo' ? 'Kelola Hot Info & Berita Terbaru' : adminTab === 'settings' ? 'Kelola Gambar Latar Belakang (Hero Canvas)' : `Kelola Data ${adminTab}`}
        </h3>
        <div className="flex gap-2">
          <button onClick={handleLogout} className="bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded-md text-xs font-bold font-jakarta uppercase flex items-center gap-1 hover:bg-gray-50 transition-colors">
            Keluar
          </button>
          {!editingId && adminTab !== 'settings' && (
            <button onClick={handleAddNew} className="bg-black text-white px-3 py-1.5 rounded-md text-xs font-bold font-jakarta uppercase flex items-center gap-1 hover:bg-gray-800 transition-colors">
              <Plus className="w-3 h-3" /> Tambah
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {adminTab === 'settings' ? (
          <div className="bg-amber-50/50 border border-amber-200 p-4 rounded-lg space-y-4 font-jakarta">
            <h4 className="font-bold text-xs uppercase text-amber-900 flex items-center gap-2">
              Pengaturan Latar Belakang Utama (Gambar & Video MP4)
            </h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Pilih tipe media latar belakang halaman utama. Jika menggunakan <strong>Gambar</strong>, efek spotlight reveal saat kursor digerakkan akan aktif. Jika memilih <strong>Video MP4</strong>, latar belakang akan memutar video secara otomatis dan efek reveal ditiadakan.
            </p>

            <div className="space-y-4">
              {/* Media Type Selector */}
              <div>
                <label className="block text-[11px] font-bold uppercase text-gray-700 mb-1.5">
                  Tipe Media Latar Belakang
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSettingsFormData(prev => ({ ...prev, bgMediaType: 'image' }))}
                    className={`py-2 px-3 rounded-md border text-xs font-bold uppercase flex items-center justify-center gap-2 cursor-pointer transition-all ${
                      settingsFormData.bgMediaType === 'image' || !settingsFormData.bgMediaType
                        ? 'bg-black text-white border-black shadow-xs'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <span>🖼️ Gambar (Dengan Reveal Effect)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSettingsFormData(prev => ({ ...prev, bgMediaType: 'video' }))}
                    className={`py-2 px-3 rounded-md border text-xs font-bold uppercase flex items-center justify-center gap-2 cursor-pointer transition-all ${
                      settingsFormData.bgMediaType === 'video'
                        ? 'bg-black text-white border-black shadow-xs'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <span>🎬 Video MP4 (Tanpa Reveal)</span>
                  </button>
                </div>
              </div>

              {/* Video Settings */}
              {settingsFormData.bgMediaType === 'video' ? (
                <div className="bg-white border border-gray-200 p-3 rounded-md space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-gray-700 mb-1">
                      1. Upload File Video MP4 (Lokal)
                    </label>
                    <input
                      type="file"
                      accept="video/mp4,video/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (evt) => {
                            const res = evt.target?.result as string;
                            setSettingsFormData(prev => ({ ...prev, baseVideo: res }));
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="w-full text-xs text-gray-600 file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800 cursor-pointer"
                    />
                    <p className="text-[10px] text-gray-500 mt-1">Pilih file .mp4 langsung dari perangkat Anda.</p>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-gray-700 mb-1">
                      2. Atau Input URL Video MP4 Direct Link
                    </label>
                    <input
                      type="text"
                      name="baseVideo"
                      value={settingsFormData.baseVideo}
                      onChange={(e) => setSettingsFormData(prev => ({ ...prev, baseVideo: e.target.value }))}
                      placeholder="https://example.com/background.mp4 ATAU link MP4"
                      className="w-full bg-white border border-gray-300 rounded p-2 text-xs font-mono"
                    />
                  </div>

                  {settingsFormData.baseVideo && (
                    <div>
                      <span className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Preview Video Latar:</span>
                      <div className="h-36 w-full rounded overflow-hidden border border-gray-300 bg-black">
                        <video
                          src={settingsFormData.baseVideo}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Image Settings */
                <div className="bg-white border border-gray-200 p-3 rounded-md space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-gray-700 mb-1">
                      1. Base Canvas Image (Gambar Utama Latar Belakang)
                    </label>
                    <div className="space-y-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (evt) => {
                              const res = evt.target?.result as string;
                              setSettingsFormData(prev => ({ ...prev, baseImage: res }));
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="w-full text-xs text-gray-600 file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800 cursor-pointer"
                      />
                      <input
                        type="text"
                        name="baseImage"
                        value={settingsFormData.baseImage}
                        onChange={(e) => setSettingsFormData(prev => ({ ...prev, baseImage: e.target.value }))}
                        placeholder="https://drive.google.com/file/d/... ATAU URL Gambar Direct"
                        className="w-full bg-white border border-gray-300 rounded p-2 text-xs font-mono"
                      />
                    </div>
                    {settingsFormData.baseImage && (
                      <div className="mt-2 h-28 w-full rounded overflow-hidden border border-gray-300 bg-gray-100">
                        <img src={settingsFormData.baseImage} alt="Base Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-gray-700 mb-1">
                      2. Hover Reveal Canvas Image (Gambar Kedua Saat Disorot Cursor)
                    </label>
                    <div className="space-y-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (evt) => {
                              const res = evt.target?.result as string;
                              setSettingsFormData(prev => ({ ...prev, revealImage: res }));
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="w-full text-xs text-gray-600 file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800 cursor-pointer"
                      />
                      <input
                        type="text"
                        name="revealImage"
                        value={settingsFormData.revealImage}
                        onChange={(e) => setSettingsFormData(prev => ({ ...prev, revealImage: e.target.value }))}
                        placeholder="https://drive.google.com/file/d/... ATAU URL Gambar Direct"
                        className="w-full bg-white border border-gray-300 rounded p-2 text-xs font-mono"
                      />
                    </div>
                    {settingsFormData.revealImage && (
                      <div className="mt-2 h-28 w-full rounded overflow-hidden border border-gray-300 bg-gray-100">
                        <img src={settingsFormData.revealImage} alt="Reveal Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>
              )}

              <button
                onClick={handleSaveSettings}
                className="w-full bg-black text-white py-2.5 rounded text-xs font-bold uppercase tracking-wider flex justify-center items-center gap-1.5 hover:bg-gray-800 transition-colors cursor-pointer"
              >
                <Check className="w-4 h-4" /> Simpan Pengaturan Latar Belakang
              </button>
            </div>

            {/* Admin Whitelist Emails Section */}
            <div className="bg-white border border-gray-200 p-4 rounded-md space-y-3 mt-4">
              <div>
                <label className="block text-[11px] font-bold uppercase text-gray-800 mb-1">
                  🛡️ Daftar Email Admin Resmi (Google Whitelist)
                </label>
                <p className="text-[10px] text-gray-500 mb-3">
                  Masukkan alamat email Google/Gmail yang diizinkan untuk login ke Admin Panel. Jika daftar ini diisi, hanya pemilik email terdaftar yang diperbolehkan masuk.
                </p>

                <div className="flex gap-2 mb-3">
                  <input
                    type="email"
                    value={newAdminEmail}
                    onChange={(e) => setNewAdminEmail(e.target.value)}
                    placeholder="masukkan.email@gmail.com..."
                    className="flex-1 bg-white border border-gray-300 rounded p-2 text-xs font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!newAdminEmail.trim() || !newAdminEmail.includes('@')) return;
                      const emailClean = newAdminEmail.trim().toLowerCase();
                      if (!allowedAdminEmails.includes(emailClean)) {
                        setAllowedAdminEmails((prev) => [...prev, emailClean]);
                        showSuccess(`Email '${emailClean}' berhasil ditambahkan ke Whitelist Admin!`);
                      }
                      setNewAdminEmail('');
                    }}
                    className="bg-black text-white px-3 py-1.5 rounded text-xs font-bold uppercase hover:bg-gray-800 transition-colors cursor-pointer shrink-0"
                  >
                    Tambah Email
                  </button>
                </div>

                {allowedAdminEmails.length === 0 ? (
                  <div className="p-2.5 bg-amber-50 border border-amber-200 rounded text-[11px] text-amber-800 font-jakarta">
                    ℹ️ <strong>Belum ada email yang dibatasi:</strong> Semua akun Google saat ini diizinkan login. Tambahkan email di atas untuk mengaktifkan pembatasan keamanan.
                  </div>
                ) : (
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase text-gray-500 block">
                      Email Admin Terdaftar ({allowedAdminEmails.length}):
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {allowedAdminEmails.map((email) => (
                        <span
                          key={email}
                          className="inline-flex items-center gap-1.5 bg-gray-100 border border-gray-300 text-gray-800 text-xs px-2.5 py-1 rounded-full font-mono font-semibold"
                        >
                          <span>{email}</span>
                          <button
                            type="button"
                            onClick={() => {
                              setAllowedAdminEmails((prev) => prev.filter((e) => e !== email));
                              showSuccess(`Email '${email}' telah dihapus dari Whitelist Admin.`);
                            }}
                            className="text-gray-400 hover:text-red-600 font-bold ml-1 transition-colors cursor-pointer"
                            title="Hapus Email"
                          >
                            &times;
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : editingId ? (
          <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg space-y-4">
            <h4 className="font-bold text-xs uppercase text-gray-500">{editingId === 'new' ? 'Tambah Item Baru' : 'Edit Item'}</h4>
            
            <div className="space-y-3 font-jakarta">
              {/* Title (ID & EN) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">1. Judul / Nama (Bahasa Indonesia)</label>
                  <input type="text" name="title" value={formData.title || ''} onChange={handleChange} className="w-full bg-white border border-gray-300 rounded p-2 text-xs" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-blue-600 mb-1">1. Title / Name (English Translation)</label>
                  <input type="text" name="titleEn" value={formData.titleEn || ''} onChange={handleChange} placeholder="e.g. Bukittinggi Clock Tower" className="w-full bg-blue-50/40 border border-blue-200 rounded p-2 text-xs font-medium" />
                </div>
              </div>

              {/* Hot Info Tab Fields */}
              {adminTab === 'hotinfo' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">2. Kategori Info (Indonesian)</label>
                      <select name="category" value={formData.category || 'Berita Utama'} onChange={handleChange} className="w-full bg-white border border-gray-300 rounded p-2 text-xs">
                        <option>Berita Utama</option>
                        <option>Cuaca & Jalur</option>
                        <option>Event Mendatang</option>
                        <option>Himbauan Wisata</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-blue-600 mb-1">2. Category Info (English Translation)</label>
                      <input type="text" name="categoryEn" value={formData.categoryEn || ''} onChange={handleChange} placeholder="e.g. Main News / Weather Update" className="w-full bg-blue-50/40 border border-blue-200 rounded p-2 text-xs" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">3. Tanggal / Waktu (Indonesian)</label>
                      <input type="text" name="date" value={formData.date || ''} onChange={handleChange} placeholder="e.g. Hari Ini, 16:30 WIB" className="w-full bg-white border border-gray-300 rounded p-2 text-xs" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-blue-600 mb-1">3. Date / Time (English Translation)</label>
                      <input type="text" name="dateEn" value={formData.dateEn || ''} onChange={handleChange} placeholder="e.g. Today, 04:30 PM WIB" className="w-full bg-blue-50/40 border border-blue-200 rounded p-2 text-xs" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">4. Tag / Label (Indonesian)</label>
                      <input type="text" name="tag" value={formData.tag || ''} onChange={handleChange} placeholder="e.g. Penting, Festival" className="w-full bg-white border border-gray-300 rounded p-2 text-xs" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-blue-600 mb-1">4. Tag / Label (English Translation)</label>
                      <input type="text" name="tagEn" value={formData.tagEn || ''} onChange={handleChange} placeholder="e.g. Urgent, Cultural Festival" className="w-full bg-blue-50/40 border border-blue-200 rounded p-2 text-xs" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">5. Isi Berita (Bahasa Indonesia)</label>
                      <textarea name="description" value={formData.description || formData.content || ''} onChange={handleChange} className="w-full bg-white border border-gray-300 rounded p-2 text-xs h-24 resize-none" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-blue-600 mb-1">5. News Description (English Translation)</label>
                      <textarea name="descriptionEn" value={formData.descriptionEn || ''} onChange={handleChange} placeholder="English news summary..." className="w-full bg-blue-50/40 border border-blue-200 rounded p-2 text-xs h-24 resize-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">6. URL Google Maps / Link Aksi (Alamat Single)</label>
                    <input type="text" name="actionUrl" value={formData.actionUrl || formData.locationQuery || ''} onChange={handleChange} placeholder="e.g. Jam Gadang Bukittinggi ATAU https://maps.google.com/..." className="w-full bg-white border border-gray-300 rounded p-2 text-xs" />
                  </div>
                </>
              )}

              {/* Download Tab Fields */}
              {adminTab === 'download' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">2. Kategori Asset (Indonesian)</label>
                      <input type="text" name="category" value={formData.category || ''} onChange={handleChange} placeholder="e.g. E-Booklet PDF, Logo Kit" className="w-full bg-white border border-gray-300 rounded p-2 text-xs" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-blue-600 mb-1">2. Asset Category (English Translation)</label>
                      <input type="text" name="categoryEn" value={formData.categoryEn || ''} onChange={handleChange} placeholder="e.g. PDF Guide Booklet" className="w-full bg-blue-50/40 border border-blue-200 rounded p-2 text-xs" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">3. Format Tipe (Indonesian)</label>
                      <input type="text" name="type" value={formData.type || ''} onChange={handleChange} placeholder="e.g. Document PDF (24 Halaman)" className="w-full bg-white border border-gray-300 rounded p-2 text-xs" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-blue-600 mb-1">3. Format Type (English Translation)</label>
                      <input type="text" name="typeEn" value={formData.typeEn || ''} onChange={handleChange} placeholder="e.g. Printable PDF Document" className="w-full bg-blue-50/40 border border-blue-200 rounded p-2 text-xs" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Nama File Unduhan</label>
                      <input type="text" name="filename" value={formData.filename || ''} onChange={handleChange} placeholder="e.g. Panduan_Wisata.pdf" className="w-full bg-white border border-gray-300 rounded p-2 text-xs" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Ukuran File</label>
                      <input type="text" name="size" value={formData.size || ''} onChange={handleChange} placeholder="e.g. 2.4 MB" className="w-full bg-white border border-gray-300 rounded p-2 text-xs" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">4. Deskripsi Asset (Indonesian)</label>
                      <textarea name="description" value={formData.description || ''} onChange={handleChange} className="w-full bg-white border border-gray-300 rounded p-2 text-xs h-20 resize-none" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-blue-600 mb-1">4. Asset Description (English Translation)</label>
                      <textarea name="descriptionEn" value={formData.descriptionEn || ''} onChange={handleChange} placeholder="English asset description..." className="w-full bg-blue-50/40 border border-blue-200 rounded p-2 text-xs h-20 resize-none" />
                    </div>
                  </div>

                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg space-y-2">
                    <label className="block text-[10px] font-bold uppercase text-blue-800">Upload File / Masukkan Konten Unduhan</label>
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      className="block w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
                    />
                    <div className="pt-1">
                      <label className="block text-[10px] font-bold uppercase text-gray-600 mb-1">Atau Masukkan Teks / URL / Konten File Langsung:</label>
                      <textarea
                        name="content"
                        value={formData.content || ''}
                        onChange={handleChange}
                        placeholder="Ketik isi materi, tautan Google Drive / Cloud storage, atau SVG file..."
                        className="w-full bg-white border border-gray-300 rounded p-2 text-xs h-24 font-mono text-[11px] resize-none"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Destinations Tab Fields */}
              {adminTab === 'destinations' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">2. Kategori (Indonesian)</label>
                      <select name="category" value={formData.category} onChange={handleChange} className="w-full bg-white border border-gray-300 rounded p-2 text-xs">
                        <option>Alam</option>
                        <option>Danau & Gunung</option>
                        <option>Lembah & Geopark</option>
                        <option>Pantai & Bahari</option>
                        <option>Desa Wisata</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-blue-600 mb-1">2. Category (English Translation)</label>
                      <input type="text" name="categoryEn" value={formData.categoryEn || ''} onChange={handleChange} placeholder="e.g. Lakes & Mountains" className="w-full bg-blue-50/40 border border-blue-200 rounded p-2 text-xs" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">3. Wilayah / Kabupaten (Indonesian)</label>
                      <input type="text" name="regency" value={formData.regency} onChange={handleChange} className="w-full bg-white border border-gray-300 rounded p-2 text-xs" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-blue-600 mb-1">3. Regency / City (English Translation)</label>
                      <input type="text" name="regencyEn" value={formData.regencyEn || formData.regency || ''} onChange={handleChange} placeholder="e.g. Bukittinggi Regency" className="w-full bg-blue-50/40 border border-blue-200 rounded p-2 text-xs" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">4. Tag Label (Indonesian)</label>
                      <input type="text" name="tag" value={formData.tag} onChange={handleChange} className="w-full bg-white border border-gray-300 rounded p-2 text-xs" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-blue-600 mb-1">4. Tag Label (English Translation)</label>
                      <input type="text" name="tagEn" value={formData.tagEn || ''} onChange={handleChange} placeholder="e.g. ANCIENT VOLCANIC CALDERA" className="w-full bg-blue-50/40 border border-blue-200 rounded p-2 text-xs font-mono" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">5. Deskripsi (Bahasa Indonesia)</label>
                      <textarea name="description" value={formData.description} onChange={handleChange} className="w-full bg-white border border-gray-300 rounded p-2 text-xs h-24 resize-none" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-blue-600 mb-1">5. Description (English Translation)</label>
                      <textarea name="descriptionEn" value={formData.descriptionEn || ''} onChange={handleChange} placeholder="English destination description..." className="w-full bg-blue-50/40 border border-blue-200 rounded p-2 text-xs h-24 resize-none" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">6. Highlights (Bahasa Indonesia - Per Baris)</label>
                      <textarea value={formData.highlights?.join('\n') || ''} onChange={(e) => handleArrayChange(e, 'highlights')} className="w-full bg-white border border-gray-300 rounded p-2 text-xs h-20 resize-none" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-blue-600 mb-1">6. Highlights (English Translation - Per Line)</label>
                      <textarea value={formData.highlightsEn?.join('\n') || ''} onChange={(e) => handleArrayChange(e, 'highlightsEn')} placeholder="Line 1&#10;Line 2" className="w-full bg-blue-50/40 border border-blue-200 rounded p-2 text-xs h-20 resize-none" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">7. Waktu Terbaik (Indonesian)</label>
                      <input type="text" name="bestTime" value={formData.bestTime} onChange={handleChange} className="w-full bg-white border border-gray-300 rounded p-2 text-xs" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-blue-600 mb-1">7. Best Time (English Translation)</label>
                      <input type="text" name="bestTimeEn" value={formData.bestTimeEn || ''} onChange={handleChange} placeholder="e.g. Year-round (Morning & Evening)" className="w-full bg-blue-50/40 border border-blue-200 rounded p-2 text-xs" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">8. Detail Lokasi (Indonesian)</label>
                      <input type="text" name="locationDetails" value={formData.locationDetails} onChange={handleChange} className="w-full bg-white border border-gray-300 rounded p-2 text-xs" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-blue-600 mb-1">8. Location Details (English Translation)</label>
                      <input type="text" name="locationDetailsEn" value={formData.locationDetailsEn || ''} onChange={handleChange} placeholder="e.g. Bukittinggi City Center, West Sumatra" className="w-full bg-blue-50/40 border border-blue-200 rounded p-2 text-xs" />
                    </div>
                  </div>
                </>
              )}

              {/* Culture Tab Fields */}
              {adminTab === 'culture' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">2. Kategori (Indonesian)</label>
                      <select name="category" value={formData.category} onChange={handleChange} className="w-full bg-white border border-gray-300 rounded p-2 text-xs">
                        <option>Arsitektur</option>
                        <option>Tari & Musik</option>
                        <option>Seni Beladiri</option>
                        <option>Kain & Kerajinan</option>
                        <option>Tradisi Adat</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-blue-600 mb-1">2. Category (English Translation)</label>
                      <input type="text" name="categoryEn" value={formData.categoryEn || ''} onChange={handleChange} placeholder="e.g. Architecture & Heritage" className="w-full bg-blue-50/40 border border-blue-200 rounded p-2 text-xs" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">3. Asal Daerah (Indonesian)</label>
                      <input type="text" name="origin" value={formData.origin} onChange={handleChange} className="w-full bg-white border border-gray-300 rounded p-2 text-xs" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-blue-600 mb-1">3. Origin / Region (English Translation)</label>
                      <input type="text" name="originEn" value={formData.originEn || formData.origin || ''} onChange={handleChange} placeholder="e.g. Tanah Datar Regency" className="w-full bg-blue-50/40 border border-blue-200 rounded p-2 text-xs" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">4. Deskripsi (Bahasa Indonesia)</label>
                      <textarea name="description" value={formData.description} onChange={handleChange} className="w-full bg-white border border-gray-300 rounded p-2 text-xs h-20 resize-none" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-blue-600 mb-1">4. Description (English Translation)</label>
                      <textarea name="descriptionEn" value={formData.descriptionEn || ''} onChange={handleChange} placeholder="English culture description..." className="w-full bg-blue-50/40 border border-blue-200 rounded p-2 text-xs h-20 resize-none" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">5. Filosofi / Makna (Bahasa Indonesia)</label>
                      <textarea name="philosophy" value={formData.philosophy} onChange={handleChange} className="w-full bg-white border border-gray-300 rounded p-2 text-xs h-16 resize-none" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-blue-600 mb-1">5. Philosophy / Meaning (English Translation)</label>
                      <textarea name="philosophyEn" value={formData.philosophyEn || ''} onChange={handleChange} placeholder="English philosophy description..." className="w-full bg-blue-50/40 border border-blue-200 rounded p-2 text-xs h-16 resize-none" />
                    </div>
                  </div>
                </>
              )}

              {/* Culinary Tab Fields */}
              {adminTab === 'culinary' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">2. Jenis Makanan (Indonesian)</label>
                      <select name="type" value={formData.type} onChange={handleChange} className="w-full bg-white border border-gray-300 rounded p-2 text-xs">
                        <option>Makanan Utama</option>
                        <option>Minuman Tradisional</option>
                        <option>Kudapan Khas</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-blue-600 mb-1">2. Dish Type (English Translation)</label>
                      <input type="text" name="typeEn" value={formData.typeEn || ''} onChange={handleChange} placeholder="e.g. Main Course / Traditional Snack" className="w-full bg-blue-50/40 border border-blue-200 rounded p-2 text-xs" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">3. Asal Daerah (Indonesian)</label>
                      <input type="text" name="origin" value={formData.origin} onChange={handleChange} className="w-full bg-white border border-gray-300 rounded p-2 text-xs" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-blue-600 mb-1">3. Origin / Region (English Translation)</label>
                      <input type="text" name="originEn" value={formData.originEn || formData.origin || ''} onChange={handleChange} placeholder="e.g. Payakumbuh & Bukittinggi" className="w-full bg-blue-50/40 border border-blue-200 rounded p-2 text-xs" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">4. Deskripsi (Bahasa Indonesia)</label>
                      <textarea name="description" value={formData.description} onChange={handleChange} className="w-full bg-white border border-gray-300 rounded p-2 text-xs h-20 resize-none" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-blue-600 mb-1">4. Description (English Translation)</label>
                      <textarea name="descriptionEn" value={formData.descriptionEn || ''} onChange={handleChange} placeholder="English culinary description..." className="w-full bg-blue-50/40 border border-blue-200 rounded p-2 text-xs h-20 resize-none" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">5. Profil Rasa (Indonesian)</label>
                      <input type="text" name="flavorProfile" value={formData.flavorProfile} onChange={handleChange} className="w-full bg-white border border-gray-300 rounded p-2 text-xs" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-blue-600 mb-1">5. Flavor Profile (English Translation)</label>
                      <input type="text" name="flavorProfileEn" value={formData.flavorProfileEn || ''} onChange={handleChange} placeholder="e.g. Rich savory & spicy coconut curry" className="w-full bg-blue-50/40 border border-blue-200 rounded p-2 text-xs" />
                    </div>
                  </div>
                </>
              )}

              {/* Events Tab Fields */}
              {adminTab === 'events' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">2. Jadwal (Indonesian)</label>
                      <input type="text" name="schedule" value={formData.schedule} onChange={handleChange} className="w-full bg-white border border-gray-300 rounded p-2 text-xs" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-blue-600 mb-1">2. Schedule (English Translation)</label>
                      <input type="text" name="scheduleEn" value={formData.scheduleEn || ''} onChange={handleChange} placeholder="e.g. Every Weekend (Rotational)" className="w-full bg-blue-50/40 border border-blue-200 rounded p-2 text-xs" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">3. Lokasi (Indonesian)</label>
                      <input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full bg-white border border-gray-300 rounded p-2 text-xs" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-blue-600 mb-1">3. Location (English Translation)</label>
                      <input type="text" name="locationEn" value={formData.locationEn || ''} onChange={handleChange} placeholder="e.g. Tanah Datar Rice Fields" className="w-full bg-blue-50/40 border border-blue-200 rounded p-2 text-xs" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">4. Deskripsi (Bahasa Indonesia)</label>
                      <textarea name="description" value={formData.description} onChange={handleChange} className="w-full bg-white border border-gray-300 rounded p-2 text-xs h-20 resize-none" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-blue-600 mb-1">4. Description (English Translation)</label>
                      <textarea name="descriptionEn" value={formData.descriptionEn || ''} onChange={handleChange} placeholder="English event description..." className="w-full bg-blue-50/40 border border-blue-200 rounded p-2 text-xs h-20 resize-none" />
                    </div>
                  </div>
                </>
              )}

              {adminTab !== 'download' && (
                <>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">URL Gambar (Wajib)</label>
                    <input type="text" name="imageUrl" value={formData.imageUrl || ''} onChange={handleChange} className="w-full bg-white border border-gray-300 rounded p-2 text-xs" />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">URL Video YouTube (Opsional)</label>
                    <input type="text" name="videoUrl" value={formData.videoUrl || ''} onChange={handleChange} className="w-full bg-white border border-gray-300 rounded p-2 text-xs" placeholder="https://youtube.com/..." />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">URL / Nama Tempat / Koordinat Google Maps (Opsional)</label>
                    <input type="text" name="mapUrl" value={formData.mapUrl || ''} onChange={handleChange} className="w-full bg-white border border-gray-300 rounded p-2 text-xs" placeholder="Misal: Jam Gadang Bukittinggi ATAU -0.304987, 100.369434 ATAU https://maps.google.com/..." />
                    <p className="text-[9px] text-gray-500 mt-0.5">Bisa diisi URL langsung, nama lokasi (e.g. Jam Gadang), atau koordinat GPS (e.g. -0.304987, 100.369434). Jika diisi, tombol Petunjuk Arah akan muncul.</p>
                  </div>
                </>
              )}

            </div>

            <div className="flex items-center gap-2 pt-4 mt-4 border-t border-gray-200">
              <button onClick={handleSave} className="flex-1 bg-black text-white px-4 py-2 rounded text-xs font-bold uppercase tracking-wider flex justify-center items-center gap-1 hover:bg-gray-800 transition-colors">
                <Check className="w-4 h-4" /> Simpan
              </button>
              <button onClick={handleCancelEdit} className="flex-1 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded text-xs font-bold uppercase tracking-wider flex justify-center items-center gap-1 hover:bg-gray-50 transition-colors">
                <X className="w-4 h-4" /> Batal
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3 pb-8">
            {activeData.map((item: any) => (
              <div key={item.id} className="border border-gray-200 rounded-lg p-3 flex justify-between items-start bg-white shadow-xs hover:border-gray-400 transition-colors">
                <div className="flex-1 min-w-0 pr-4">
                  <h4 className="font-bold text-sm truncate">{item.title}</h4>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.description}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => handleEdit(item)} className="p-1.5 text-gray-500 hover:text-black hover:bg-gray-100 rounded transition-colors" title="Edit">
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Hapus">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
