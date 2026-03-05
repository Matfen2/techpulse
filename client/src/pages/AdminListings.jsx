import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllListings, verifyListing } from '../services/productService';

const STATUS_CONFIG = {
  active: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30', label: 'Active', icon: '✓' },
  pending: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30', label: 'En attente', icon: '⏳' },
  sold: { bg: 'bg-sky-500/10', text: 'text-sky-400', border: 'border-sky-500/30', label: 'Vendue', icon: '💰' },
  rejected: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30', label: 'Rejetée', icon: '✗' },
};
const CONDITION_COLORS = { 'Comme neuf': 'text-emerald-400', 'Très bon état': 'text-sky-400', 'Bon état': 'text-amber-400', 'État correct': 'text-orange-400' };
const CATEGORY_ICONS = { Smartphone: '📱', Laptop: '💻', Wearable: '⌚', Accessoire: '🎧' };

const AdminListings = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({ all: 0, pending: 0, active: 0, rejected: 0, sold: 0 });

  const [selectedListing, setSelectedListing] = useState(null);
  const [checklist, setChecklist] = useState({});
  const [verifying, setVerifying] = useState(false);

  const statusFilter = searchParams.get('status') || '';

  const fetchListings = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      const { data } = await getAllListings(params);
      setListings(data);
      if (statusFilter) { const { data: all } = await getAllListings({}); updateCounts(all); }
      else updateCounts(data);
    } catch { setListings([]); }
    finally { setLoading(false); }
  }, [statusFilter]);

  const updateCounts = (data) => {
    const c = { all: data.length, pending: 0, active: 0, rejected: 0, sold: 0 };
    data.forEach((l) => { if (c[l.status] !== undefined) c[l.status]++; });
    setCounts(c);
  };

  useEffect(() => { fetchListings(); }, [fetchListings]);

  const openDetail = (listing) => {
    setSelectedListing(listing);
    setChecklist({ photos: false, video: false, price: false, description: false });
  };

  const handleVerify = async (id, status) => {
    setVerifying(true);
    try { await verifyListing(id, status); setSelectedListing(null); await fetchListings(); }
    catch { /* silent */ }
    finally { setVerifying(false); }
  };

  const allChecked = Object.values(checklist).every(Boolean);
  const setFilter = (status) => {
    const params = new URLSearchParams();
    if (status) params.set('status', status);
    setSearchParams(params);
  };

  /* ── Detail Panel Content (shared between desktop sidebar & mobile modal) ── */
  const DetailPanel = () => {
    if (!selectedListing) return null;
    const st = STATUS_CONFIG[selectedListing.status] || STATUS_CONFIG.pending;
    return (
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="p-3 sm:p-4 border-b border-[var(--border)] flex items-center justify-between">
          <h3 className="font-bold text-[var(--text)] text-xs sm:text-sm font-request">Détail de l'annonce</h3>
          <button onClick={() => setSelectedListing(null)} className="p-1 rounded-lg hover:bg-[var(--bg-deep)] text-[var(--text-muted)] transition-colors cursor-pointer">✕</button>
        </div>

        {/* Media */}
        <div className="p-3 sm:p-4 border-b border-[var(--border)]">
          <p className="text-[10px] font-medium text-[var(--text-muted)] mb-2 uppercase tracking-wider font-qaranta">Médias</p>
          {selectedListing.images?.length > 0 ? (
            <div className="grid grid-cols-3 gap-2 mb-3">
              {selectedListing.images.map((img, i) => (
                <a key={i} href={img.url} target="_blank" rel="noopener noreferrer">
                  <img src={img.url} alt={`Photo ${i + 1}`} className="w-full h-16 sm:h-20 object-cover rounded-lg border border-[var(--border)] hover:border-[var(--orange)] transition-colors" />
                </a>
              ))}
            </div>
          ) : <p className="text-[10px] text-[var(--text-muted)] mb-3">Aucune photo</p>}
          {selectedListing.video?.url ? (
            <div>
              <video src={selectedListing.video.url} controls className="w-full rounded-lg border border-[var(--border)]" style={{ maxHeight: '160px' }} />
              {selectedListing.video.duration && <p className="text-[10px] text-[var(--text-muted)] mt-1">Durée : {Math.round(selectedListing.video.duration)}s</p>}
            </div>
          ) : <p className="text-[10px] text-red-400">⚠️ Aucune vidéo</p>}
        </div>

        {/* Info */}
        <div className="p-3 sm:p-4 border-b border-[var(--border)] space-y-2">
          <p className="text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-wider font-qaranta">Informations</p>
          <h4 className="text-[var(--text)] font-semibold text-sm font-request">{selectedListing.title}</h4>
          <p className="text-[10px] sm:text-xs text-[var(--text-muted)] leading-relaxed font-qaranta">{selectedListing.description}</p>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="bg-[var(--bg-deep)] rounded-xl p-2"><p className="text-[10px] text-[var(--text-muted)] font-qaranta">Prix</p><p className="text-xs font-mono text-[var(--orange)] font-bold font-qaranta">{selectedListing.price}€</p></div>
            <div className="bg-[var(--bg-deep)] rounded-xl p-2"><p className="text-[10px] text-[var(--text-muted)] font-qaranta">État</p><p className={`text-xs font-medium ${CONDITION_COLORS[selectedListing.condition]}`}>{selectedListing.condition}</p></div>
            <div className="bg-[var(--bg-deep)] rounded-xl p-2"><p className="text-[10px] text-[var(--text-muted)] font-qaranta">Catégorie</p><p className="text-xs text-[var(--text)] font-qaranta">{CATEGORY_ICONS[selectedListing.category]} {selectedListing.category}</p></div>
            <div className="bg-[var(--bg-deep)] rounded-xl p-2"><p className="text-[10px] text-[var(--text-muted)] font-qaranta">Vendeur</p><p className="text-xs text-[var(--text)]">{selectedListing.seller?.firstName} {selectedListing.seller?.lastName}</p></div>
          </div>
          {selectedListing.location && <p className="text-[10px] text-[var(--text-muted)]">📍 {selectedListing.location}</p>}
        </div>

        {/* Checklist */}
        {selectedListing.status === 'pending' && (
          <div className="p-3 sm:p-4 border-b border-[var(--border)]">
            <p className="text-[10px] font-medium text-[var(--text-muted)] mb-2 uppercase tracking-wider font-qaranta">Checklist de vérification</p>
            <div className="space-y-1.5">
              {[
                { key: 'photos', label: 'Photos conformes' },
                { key: 'video', label: 'Vidéo produit réel' },
                { key: 'price', label: 'Prix cohérent' },
                { key: 'description', label: 'Description honnête' },
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-[var(--bg-deep)] transition-colors cursor-pointer">
                  <input type="checkbox" checked={checklist[key] || false} onChange={(e) => setChecklist({ ...checklist, [key]: e.target.checked })} className="w-4 h-4 rounded accent-[var(--orange)]" />
                  <span className={`text-xs transition-colors font-qaranta ${checklist[key] ? 'text-[var(--text)]' : 'text-[var(--text-muted)]'}`}>{label}</span>
                </label>
              ))}
            </div>
            <p className="mt-1.5 text-[10px] text-[var(--text-muted)]">{Object.values(checklist).filter(Boolean).length}/4 vérifications</p>
          </div>
        )}

        {/* Actions */}
        <div className="p-3 sm:p-4">
          {selectedListing.status === 'pending' ? (
            <div className="flex gap-2">
              <button onClick={() => handleVerify(selectedListing._id, 'rejected')} disabled={verifying} className="flex-1 px-3 py-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 font-medium text-xs font-qaranta hover:bg-red-500/20 transition-colors disabled:opacity-50 cursor-pointer">✗ Rejeter</button>
              <button onClick={() => handleVerify(selectedListing._id, 'active')} disabled={verifying || !allChecked} className="flex-1 px-3 py-2.5 rounded-xl bg-emerald-500 text-white font-medium text-xs font-qaranta hover:bg-emerald-600 transition-colors disabled:opacity-50 cursor-pointer" title={!allChecked ? 'Complétez la checklist' : ''}>{verifying ? '...' : '✓ Approuver'}</button>
            </div>
          ) : selectedListing.status === 'rejected' ? (
            <button onClick={() => handleVerify(selectedListing._id, 'active')} disabled={verifying} className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-deep)] border border-[var(--border)] text-[var(--text-muted)] font-medium text-xs font-qaranta hover:border-[var(--orange)] hover:text-[var(--orange)] transition-colors disabled:opacity-50 cursor-pointer">Réactiver</button>
          ) : selectedListing.status === 'active' ? (
            <div className="text-center py-2"><span className="text-emerald-400 text-xs font-medium">✓ Annonce vérifiée et active</span></div>
          ) : (
            <div className="text-center py-2"><span className="text-sky-400 text-xs font-medium">💰 Annonce vendue</span></div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[var(--bg-deep)] py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-3 mb-1.5">
            <h1 className="text-xl sm:text-2xl font-bold text-[var(--text)] font-request">Modération des annonces</h1>
            {counts.pending > 0 && <span className="px-2.5 py-1 rounded-full bg-amber-500 text-white text-[10px] sm:text-xs font-bold animate-pulse font-qaranta">{counts.pending} en attente</span>}
          </div>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] font-qaranta">Vérifiez les annonces avant publication</p>
        </div>

        {/* Status filter pills */}
        <div className="flex gap-2 mb-4 sm:mb-6 overflow-x-auto pb-1 -mx-1 px-1">
          {[
            { key: '', label: 'Toutes', count: counts.all },
            { key: 'pending', label: '⏳ Attente', count: counts.pending },
            { key: 'active', label: '✓ Actives', count: counts.active },
            { key: 'rejected', label: '✗ Rejetées', count: counts.rejected },
            { key: 'sold', label: '💰 Vendues', count: counts.sold },
          ].map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm transition-all flex items-center gap-1.5 shrink-0 cursor-pointer font-qaranta ${
                statusFilter === key
                  ? 'bg-[var(--orange)] text-white shadow-lg shadow-[var(--orange)]/25'
                  : 'bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--orange)]'
              }`}
            >
              {label}
              <span className={`text-[10px] ${statusFilter === key ? 'text-white/70' : 'text-[var(--text-muted)]/50'}`}>{count}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex gap-6">

          {/* Listings list */}
          <div className="flex-1 space-y-2 sm:space-y-3 min-w-0">
            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl h-20 sm:h-24 animate-pulse" />
                ))}
              </div>
            ) : listings.length === 0 ? (
              <div className="text-center py-16 text-[var(--text-muted)] text-sm">Aucune annonce trouvée</div>
            ) : (
              <AnimatePresence mode="popLayout">
                {listings.map((listing, i) => {
                  const st = STATUS_CONFIG[listing.status] || STATUS_CONFIG.pending;
                  return (
                    <motion.div
                      key={listing._id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: i * 0.03 }}
                      onClick={() => openDetail(listing)}
                      className={`bg-[var(--bg-card)] border rounded-xl p-3 sm:p-4 flex items-center gap-3 sm:gap-4 cursor-pointer transition-all hover:border-[var(--orange)]/50 ${
                        selectedListing?._id === listing._id
                          ? 'border-[var(--orange)] ring-1 ring-[var(--orange)]/30'
                          : listing.status === 'pending' ? 'border-amber-500/30' : 'border-[var(--border)]'
                      }`}
                    >
                      {/* Thumb */}
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[var(--bg-deep)] rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                        {listing.images?.[0] ? <img src={listing.images[0].url} alt="" className="w-full h-full object-cover" /> : <span className="text-base sm:text-xl">{CATEGORY_ICONS[listing.category] || '📦'}</span>}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5 sm:mb-1 flex-wrap">
                          <h3 className="text-[var(--text)] font-medium text-xs sm:text-sm truncate font-request">{listing.title}</h3>
                          <span className={`px-1.5 sm:px-2 py-0.5 rounded text-[10px] ${st.bg} ${st.text}`}>{st.icon} {st.label}</span>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs text-[var(--text-muted)] flex-wrap font-qaranta">
                          <span>{CATEGORY_ICONS[listing.category]} {listing.category}</span>
                          <span className={CONDITION_COLORS[listing.condition]}>{listing.condition}</span>
                          <span className="font-mono text-[var(--orange)]">{listing.price}€</span>
                          <span className="hidden sm:inline">par {listing.seller?.firstName}</span>
                        </div>
                      </div>

                      {/* Date */}
                      <div className="shrink-0 text-[10px] text-[var(--text-muted)] hidden sm:block">
                        {new Date(listing.createdAt).toLocaleDateString('fr-FR')}
                      </div>

                      {/* Quick actions */}
                      {listing.status === 'pending' && (
                        <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                          <button onClick={() => handleVerify(listing._id, 'active')} className="p-1.5 sm:p-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors text-xs sm:text-sm cursor-pointer" title="Approuver">✓</button>
                          <button onClick={() => handleVerify(listing._id, 'rejected')} className="p-1.5 sm:p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors text-xs sm:text-sm cursor-pointer" title="Rejeter">✗</button>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}
          </div>

          {/* ── Desktop detail sidebar ── */}
          <AnimatePresence>
            {selectedListing && (
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                className="w-96 shrink-0 sticky top-8 self-start hidden lg:block"
              >
                <DetailPanel />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Mobile detail modal ── */}
        <AnimatePresence>
          {selectedListing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setSelectedListing(null)}
            >
              <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 40, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full sm:max-w-md max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl"
              >
                <DetailPanel />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminListings;