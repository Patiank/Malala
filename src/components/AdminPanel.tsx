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
    baseImage: appSettings?.baseImage || '',
    revealImage: appSettings?.revealImage || '',
  });

  useEffect(() => {
    if (appSettings) {
      setSettingsFormData({
        baseImage: appSettings.baseImage || '',
        revealImage: appSettings.revealImage || '',
      });
    }
  }, [appSettings]);

  // Generic editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>(null);
  const [adminError, setAdminError] = useState<string | null>(null);
  const [adminSuccess, setAdminSuccess] = useState<string | null>(null);
  
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [loginError, setLoginError] = useState<string | null>(null);

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
    if (file.type.startsWith('image/') || file.type.includes('pdf') || file.type.includes('text') || file.type.includes('svg')) {
      reader.readAsDataURL(file);
    } else {
      reader.readAsText(file);
    }
  };
  
  const handleArrayChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
     // for arrays like highlights (comma separated in edit mode)
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
        // new item
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
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
      }
    });
    return () => unsub();
  }, []);

  const handlePasswordLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsAuthenticated(true);
      setLoginError(null);
    } else {
      setLoginError('Kata sandi salah.');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoginError(null);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      setLoginError(null);
    } catch (error: any) {
      console.warn("Google Auth popup error:", error);
      if (error?.code === 'auth/popup-blocked' || error?.code === 'auth/cancelled-popup-request') {
        setLoginError('Popup diblokir oleh browser / iframe. Silakan gunakan Kata Sandi Admin.');
      } else {
        setLoginError('Gagal masuk Google. Silakan gunakan Kata Sandi Admin.');
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

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-white p-6 rounded-lg">
        <div className="w-full max-w-sm border border-gray-200 rounded-lg p-6 shadow-xs text-center">
          <h3 className="font-bold text-sm uppercase tracking-wider font-jakarta mb-2">Otentikasi Admin</h3>
          <p className="text-[10px] text-gray-500 mb-6">Silakan masukkan kata sandi admin (default: admin123) atau masuk dengan akun Google.</p>
          
          <form onSubmit={handlePasswordLogin} className="flex flex-col gap-3">
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Kata Sandi (admin123)..."
              className="w-full bg-gray-50 border border-gray-300 rounded p-2 text-xs text-center focus:outline-none focus:border-black transition-colors"
              autoFocus
            />
            {loginError && <p className="text-[10px] text-red-600 font-bold m-0 p-0">{loginError}</p>}
            <button 
              type="submit" 
              className="bg-black text-white px-4 py-2.5 rounded text-xs font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors"
            >
              Masuk dengan Kata Sandi
            </button>
          </form>

          <div className="relative my-4 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
            <span className="relative bg-white px-2 text-[10px] text-gray-400 uppercase">atau</span>
          </div>

          <button 
            type="button" 
            onClick={handleGoogleLogin}
            className="w-full bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded text-xs font-bold uppercase tracking-wider hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Masuk dengan Google
          </button>

          <button onClick={() => dataStore.seedData()} className="mt-8 text-[9px] text-gray-400 hover:text-black uppercase cursor-pointer">
            [Seed Database (Run Once)]
          </button>
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
              Pengaturan Gambar Latar Belakang Canvas & Reveal Effect
            </h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Ubah URL gambar dasar (Base Canvas Image) dan gambar efek sorot cursor (Hover Reveal Image) yang muncul di latar belakang aplikasi. Dukung link biasa maupun tautan Google Drive.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase text-gray-700 mb-1">
                  1. Base Canvas Image URL (Gambar Utama Latar Belakang)
                </label>
                <input
                  type="text"
                  name="baseImage"
                  value={settingsFormData.baseImage}
                  onChange={handleSettingsChange}
                  placeholder="https://drive.google.com/file/d/... ATAU URL Gambar Direct"
                  className="w-full bg-white border border-gray-300 rounded p-2 text-xs font-mono"
                />
                <p className="text-[10px] text-gray-500 mt-1">Tautan Google Drive otomatis dikonversi ke direct image link.</p>
                {settingsFormData.baseImage && (
                  <div className="mt-2 h-28 w-full rounded overflow-hidden border border-gray-300 bg-gray-100">
                    <img src={settingsFormData.baseImage} alt="Base Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-gray-700 mb-1">
                  2. Hover Reveal Canvas Image URL (Gambar Kedua Saat Disorot Cursor)
                </label>
                <input
                  type="text"
                  name="revealImage"
                  value={settingsFormData.revealImage}
                  onChange={handleSettingsChange}
                  placeholder="https://drive.google.com/file/d/... ATAU URL Gambar Direct"
                  className="w-full bg-white border border-gray-300 rounded p-2 text-xs font-mono"
                />
                <p className="text-[10px] text-gray-500 mt-1">Gambar ini akan muncul di dalam efek lingkaran sorot kursor pengguna.</p>
                {settingsFormData.revealImage && (
                  <div className="mt-2 h-28 w-full rounded overflow-hidden border border-gray-300 bg-gray-100">
                    <img src={settingsFormData.revealImage} alt="Reveal Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <button
                onClick={handleSaveSettings}
                className="w-full bg-black text-white py-2.5 rounded text-xs font-bold uppercase tracking-wider flex justify-center items-center gap-1.5 hover:bg-gray-800 transition-colors cursor-pointer"
              >
                <Check className="w-4 h-4" /> Simpan Pengaturan Latar Belakang
              </button>
            </div>
          </div>
        ) : editingId ? (
          <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg space-y-4">
            <h4 className="font-bold text-xs uppercase text-gray-500">{editingId === 'new' ? 'Tambah Item Baru' : 'Edit Item'}</h4>
            
            <div className="space-y-3 font-jakarta">
              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Judul / Nama File Asset</label>
                <input type="text" name="title" value={formData.title || ''} onChange={handleChange} className="w-full bg-white border border-gray-300 rounded p-2 text-xs" />
              </div>

              {adminTab === 'hotinfo' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Kategori Info</label>
                      <select name="category" value={formData.category || 'Berita Utama'} onChange={handleChange} className="w-full bg-white border border-gray-300 rounded p-2 text-xs">
                        <option>Berita Utama</option>
                        <option>Cuaca & Jalur</option>
                        <option>Event Mendatang</option>
                        <option>Himbauan Wisata</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Tanggal / Waktu Update</label>
                      <input type="text" name="date" value={formData.date || ''} onChange={handleChange} placeholder="e.g. Hari Ini, 16:30 WIB" className="w-full bg-white border border-gray-300 rounded p-2 text-xs" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Tag / Label Status</label>
                      <input type="text" name="tag" value={formData.tag || ''} onChange={handleChange} placeholder="e.g. Penting, Festival, BPBD Info" className="w-full bg-white border border-gray-300 rounded p-2 text-xs" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">URL / Lokasi Google Maps (Opsional)</label>
                      <input type="text" name="actionUrl" value={formData.actionUrl || formData.locationQuery || ''} onChange={handleChange} placeholder="e.g. Jam Gadang Bukittinggi ATAU https://maps.google.com/..." className="w-full bg-white border border-gray-300 rounded p-2 text-xs" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Isi Berita / Keterangan Lengkap</label>
                    <textarea name="description" value={formData.description || formData.content || ''} onChange={handleChange} className="w-full bg-white border border-gray-300 rounded p-2 text-xs h-24 resize-none" />
                  </div>
                </>
              )}

              {adminTab === 'download' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Kategori Asset</label>
                      <input type="text" name="category" value={formData.category || ''} onChange={handleChange} placeholder="e.g. E-Booklet PDF, Logo Kit" className="w-full bg-white border border-gray-300 rounded p-2 text-xs" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Format Tipe</label>
                      <input type="text" name="type" value={formData.type || ''} onChange={handleChange} placeholder="e.g. Document PDF (24 Halaman)" className="w-full bg-white border border-gray-300 rounded p-2 text-xs" />
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

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Deskripsi Singkat Asset</label>
                    <textarea name="description" value={formData.description || ''} onChange={handleChange} className="w-full bg-white border border-gray-300 rounded p-2 text-xs h-16 resize-none" />
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

              {adminTab === 'destinations' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Kategori</label>
                      <select name="category" value={formData.category} onChange={handleChange} className="w-full bg-white border border-gray-300 rounded p-2 text-xs">
                        <option>Alam</option>
                        <option>Danau & Gunung</option>
                        <option>Lembah & Geopark</option>
                        <option>Pantai & Bahari</option>
                        <option>Desa Wisata</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Wilayah / Kabupaten</label>
                      <input type="text" name="regency" value={formData.regency} onChange={handleChange} className="w-full bg-white border border-gray-300 rounded p-2 text-xs" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Tag (Label)</label>
                    <input type="text" name="tag" value={formData.tag} onChange={handleChange} className="w-full bg-white border border-gray-300 rounded p-2 text-xs" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Deskripsi</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} className="w-full bg-white border border-gray-300 rounded p-2 text-xs h-20 resize-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Highlights (Pisahkan dengan baris baru)</label>
                    <textarea value={formData.highlights?.join('\n') || ''} onChange={(e) => handleArrayChange(e, 'highlights')} className="w-full bg-white border border-gray-300 rounded p-2 text-xs h-20 resize-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Waktu Terbaik</label>
                      <input type="text" name="bestTime" value={formData.bestTime} onChange={handleChange} className="w-full bg-white border border-gray-300 rounded p-2 text-xs" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Detail Lokasi</label>
                      <input type="text" name="locationDetails" value={formData.locationDetails} onChange={handleChange} className="w-full bg-white border border-gray-300 rounded p-2 text-xs" />
                    </div>
                  </div>
                </>
              )}

              {adminTab === 'culture' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Kategori</label>
                      <select name="category" value={formData.category} onChange={handleChange} className="w-full bg-white border border-gray-300 rounded p-2 text-xs">
                        <option>Arsitektur</option>
                        <option>Tari & Musik</option>
                        <option>Seni Beladiri</option>
                        <option>Kain & Kerajinan</option>
                        <option>Tradisi Adat</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Asal Daerah</label>
                      <input type="text" name="origin" value={formData.origin} onChange={handleChange} className="w-full bg-white border border-gray-300 rounded p-2 text-xs" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Deskripsi</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} className="w-full bg-white border border-gray-300 rounded p-2 text-xs h-20 resize-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Filosofi / Makna</label>
                    <textarea name="philosophy" value={formData.philosophy} onChange={handleChange} className="w-full bg-white border border-gray-300 rounded p-2 text-xs h-16 resize-none" />
                  </div>
                </>
              )}

              {adminTab === 'culinary' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Jenis Makanan</label>
                      <select name="type" value={formData.type} onChange={handleChange} className="w-full bg-white border border-gray-300 rounded p-2 text-xs">
                        <option>Makanan Utama</option>
                        <option>Minuman Tradisional</option>
                        <option>Kudapan Khas</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Asal Daerah</label>
                      <input type="text" name="origin" value={formData.origin} onChange={handleChange} className="w-full bg-white border border-gray-300 rounded p-2 text-xs" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Deskripsi</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} className="w-full bg-white border border-gray-300 rounded p-2 text-xs h-20 resize-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Profil Rasa (Pisahkan dengan koma)</label>
                    <input type="text" name="flavorProfile" value={formData.flavorProfile} onChange={handleChange} className="w-full bg-white border border-gray-300 rounded p-2 text-xs" />
                  </div>
                </>
              )}

              {adminTab === 'events' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Jadwal (Bulan/Tanggal)</label>
                      <input type="text" name="schedule" value={formData.schedule} onChange={handleChange} className="w-full bg-white border border-gray-300 rounded p-2 text-xs" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Lokasi</label>
                      <input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full bg-white border border-gray-300 rounded p-2 text-xs" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Deskripsi</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} className="w-full bg-white border border-gray-300 rounded p-2 text-xs h-20 resize-none" />
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
