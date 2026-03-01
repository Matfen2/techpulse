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

const CONDITION_COLORS = {
  'Comme neuf': 'text-emerald-400',
  'Très bon état': 'text-sky-400',
  'Bon état': 'text-amber-400',
  'État correct': 'text-orange-400',
};

const CATEGORY_ICONS = {
  Smartphone: '📱',
  Laptop: '💻',
  Wearable: '⌚',
  Accessoire: '🎧',
};

const AdminListings = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({ all: 0, pending: 0, active: 0, rejected: 0, sold: 0 });

  // Detail panel
  const [selectedListing, setSelectedListing] = useState(null);
  const [checklist, setChecklist] = useState({});
  const [verifying, setVerifying] = useState(false);

  const statusFilter = searchParams.get('status') || '';

  // ── Fetch listings ──
  const fetchListings = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      const { data } = await getAllListings(params);
      setListings(data);

      // Fetch all to count statuses
      if (statusFilter) {
        const { data: all } = await getAllListings({});
        updateCounts(all);
      } else {
        updateCounts(data);
      }
    } catch {
      setListings([]);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  const updateCounts = (data) => {
    const c = { all: data.length, pending: 0, active: 0, rejected: 0, sold: 0 };
    data.forEach((l) => { if (c[l.status] !== undefined) c[l.status]++; });
    setCounts(c);
  };

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  // ── Open detail panel ──
  const openDetail = (listing) => {
    setSelectedListing(listing);
    setChecklist({
      photos: false,
      video: false,
      price: false,
      description: false,
    });
  };

  // ── Handle verify ──
  const handleVerify = async (id, status) => {
    setVerifying(true);
    try {
      await verifyListing(id, status);
      setSelectedListing(null);
      await fetchListings();
    } catch {
      // Error handling silencieux
    } finally {
      setVerifying(false);
    }
  };

  // ── Check if all checklist items are done ──
  const allChecked = Object.values(checklist).every(Boolean);

  // ── Filter tab helper ──
  const setFilter = (status) => {
    const params = new URLSearchParams();
    if (status) params.set('status', status);
    setSearchParams(params);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-deep)] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* ── Header ── */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-[var(--text)]">
              Modération des annonces
            </h1>
            {counts.pending > 0 && (
              <span className="px-2.5 py-1 rounded-full bg-amber-500 text-white text-xs font-bold animate-pulse">
                {counts.pending} en attente
              </span>
            )}
          </div>
          <p className="text-sm text-[var(--text-muted)]">
            Vérifiez les annonces avant publication — photos, vidéo, prix et description
          </p>
        </div>

        {/* ── Status filter tabs ── */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {[
            { key: '', label: 'Toutes', count: counts.all },
            { key: 'pending', label: 'En attente', count: counts.pending },
            { key: 'active', label: 'Actives', count: counts.active },
            { key: 'rejected', label: 'Rejetées', count: counts.rejected },
            { key: 'sold', label: 'Vendues', count: counts.sold },
          ].map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                statusFilter === key
                  ? 'bg-[var(--orange)] text-white'
                  : 'bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--orange)]'
              }`}
            >
              {label}
              <span className={`text-xs ${statusFilter === key ? 'text-white/70' : 'text-[var(--text-muted)]/50'}`}>
                {count}
              </span>
            </button>
          ))}
        </div>

        {/* ── Content ── */}
        <div className="flex gap-6">

          {/* ── Listings list ── */}
          <div className="flex-1 space-y-3">
            {loading ? (
              <div className="text-center py-16 text-[var(--text-muted)]">Chargement...</div>
            ) : listings.length === 0 ? (
              <div className="text-center py-16 text-[var(--text-muted)]">
                Aucune annonce trouvée
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {listings.map((listing, i) => (
                  <motion.div
                    key={listing._id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: i * 0.03 }}
                    onClick={() => openDetail(listing)}
                    className={`bg-[var(--bg-card)] border rounded-xl p-4 flex items-center gap-4 cursor-pointer transition-all hover:border-[var(--orange)]/50 ${
                      selectedListing?._id === listing._id
                        ? 'border-[var(--orange)] ring-1 ring-[var(--orange)]/30'
                        : listing.status === 'pending'
                          ? 'border-amber-500/30'
                          : 'border-[var(--border)]'
                    }`}
                  >
                    {/* Thumbnail */}
                    <div className="w-16 h-16 bg-[var(--bg-deep)] rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                      {listing.images?.[0] ? (
                        <img src={listing.images[0].url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xl">{CATEGORY_ICONS[listing.category] || '📦'}</span>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-[var(--text)] font-medium text-sm truncate">{listing.title}</h3>
                        <span className={`px-2 py-0.5 rounded text-xs ${STATUS_CONFIG[listing.status]?.bg} ${STATUS_CONFIG[listing.status]?.text}`}>
                          {STATUS_CONFIG[listing.status]?.icon} {STATUS_CONFIG[listing.status]?.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
                        <span>{CATEGORY_ICONS[listing.category]} {listing.category}</span>
                        <span className={CONDITION_COLORS[listing.condition]}>{listing.condition}</span>
                        <span className="font-mono text-[var(--orange)]">{listing.price}€</span>
                        <span>par {listing.seller?.firstName} {listing.seller?.lastName}</span>
                      </div>
                    </div>

                    {/* Quick status */}
                    <div className="shrink-0 text-xs text-[var(--text-muted)]">
                      {new Date(listing.createdAt).toLocaleDateString('fr-FR')}
                    </div>

                    {/* Quick actions for pending */}
                    {listing.status === 'pending' && (
                      <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleVerify(listing._id, 'active')}
                          className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors text-sm"
                          title="Approuver"
                        >
                          ✓
                        </button>
                        <button
                          onClick={() => handleVerify(listing._id, 'rejected')}
                          className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors text-sm"
                          title="Rejeter"
                        >
                          ✗
                        </button>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>

          {/* ══════════════════════════════════════════ */}
          {/* ── Detail / Verification Panel ── */}
          {/* ══════════════════════════════════════════ */}
          <AnimatePresence>
            {selectedListing && (
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                className="w-96 shrink-0 sticky top-8 self-start"
              >
                <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl overflow-hidden">

                  {/* Panel header */}
                  <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
                    <h3 className="font-bold text-[var(--text)] text-sm">Détail de l'annonce</h3>
                    <button
                      onClick={() => setSelectedListing(null)}
                      className="p-1 rounded-lg hover:bg-[var(--bg-deep)] text-[var(--text-muted)] transition-colors"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Media preview */}
                  <div className="p-4 border-b border-[var(--border)]">
                    <p className="text-xs font-medium text-[var(--text-muted)] mb-2 uppercase tracking-wider">Médias</p>

                    {/* Images gallery */}
                    {selectedListing.images?.length > 0 ? (
                      <div className="grid grid-cols-3 gap-2 mb-3">
                        {selectedListing.images.map((img, i) => (
                          <a key={i} href={img.url} target="_blank" rel="noopener noreferrer">
                            <img
                              src={img.url}
                              alt={`Photo ${i + 1}`}
                              className="w-full h-20 object-cover rounded-lg border border-[var(--border)] hover:border-[var(--orange)] transition-colors"
                            />
                          </a>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-[var(--text-muted)] mb-3">Aucune photo</p>
                    )}

                    {/* Video player */}
                    {selectedListing.video?.url ? (
                      <div>
                        <video
                          src={selectedListing.video.url}
                          controls
                          className="w-full rounded-lg border border-[var(--border)]"
                          style={{ maxHeight: '180px' }}
                        >
                          Vidéo non supportée
                        </video>
                        {selectedListing.video.duration && (
                          <p className="text-xs text-[var(--text-muted)] mt-1">
                            Durée : {Math.round(selectedListing.video.duration)}s
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-red-400">⚠️ Aucune vidéo de vérification</p>
                    )}
                  </div>

                  {/* Listing info */}
                  <div className="p-4 border-b border-[var(--border)] space-y-2">
                    <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Informations</p>
                    <h4 className="text-[var(--text)] font-semibold">{selectedListing.title}</h4>
                    <p className="text-xs text-[var(--text-muted)] leading-relaxed">{selectedListing.description}</p>
                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <div className="bg-[var(--bg-deep)] rounded-lg p-2">
                        <p className="text-xs text-[var(--text-muted)]">Prix</p>
                        <p className="text-sm font-mono text-[var(--orange)] font-bold">{selectedListing.price}€</p>
                      </div>
                      <div className="bg-[var(--bg-deep)] rounded-lg p-2">
                        <p className="text-xs text-[var(--text-muted)]">État</p>
                        <p className={`text-sm font-medium ${CONDITION_COLORS[selectedListing.condition]}`}>
                          {selectedListing.condition}
                        </p>
                      </div>
                      <div className="bg-[var(--bg-deep)] rounded-lg p-2">
                        <p className="text-xs text-[var(--text-muted)]">Catégorie</p>
                        <p className="text-sm text-[var(--text)]">
                          {CATEGORY_ICONS[selectedListing.category]} {selectedListing.category}
                        </p>
                      </div>
                      <div className="bg-[var(--bg-deep)] rounded-lg p-2">
                        <p className="text-xs text-[var(--text-muted)]">Vendeur</p>
                        <p className="text-sm text-[var(--text)]">
                          {selectedListing.seller?.firstName} {selectedListing.seller?.lastName}
                        </p>
                      </div>
                    </div>
                    {selectedListing.location && (
                      <p className="text-xs text-[var(--text-muted)]">📍 {selectedListing.location}</p>
                    )}
                  </div>

                  {/* Verification checklist (only for pending) */}
                  {selectedListing.status === 'pending' && (
                    <div className="p-4 border-b border-[var(--border)]">
                      <p className="text-xs font-medium text-[var(--text-muted)] mb-3 uppercase tracking-wider">
                        Checklist de vérification
                      </p>
                      <div className="space-y-2">
                        {[
                          { key: 'photos', label: 'Photos conformes au produit' },
                          { key: 'video', label: 'Vidéo montre le produit réel' },
                          { key: 'price', label: 'Prix cohérent avec le marché' },
                          { key: 'description', label: 'Description précise et honnête' },
                        ].map(({ key, label }) => (
                          <label
                            key={key}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--bg-deep)] transition-colors cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={checklist[key] || false}
                              onChange={(e) => setChecklist({ ...checklist, [key]: e.target.checked })}
                              className="w-4 h-4 rounded accent-[var(--orange)]"
                            />
                            <span className={`text-sm transition-colors ${
                              checklist[key] ? 'text-[var(--text)]' : 'text-[var(--text-muted)]'
                            }`}>
                              {label}
                            </span>
                          </label>
                        ))}
                      </div>
                      <div className="mt-2 text-xs text-[var(--text-muted)]">
                        {Object.values(checklist).filter(Boolean).length}/4 vérifications
                      </div>
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="p-4">
                    {selectedListing.status === 'pending' ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleVerify(selectedListing._id, 'rejected')}
                          disabled={verifying}
                          className="flex-1 px-4 py-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 font-medium text-sm hover:bg-red-500/20 transition-colors disabled:opacity-50"
                        >
                          ✗ Rejeter
                        </button>
                        <button
                          onClick={() => handleVerify(selectedListing._id, 'active')}
                          disabled={verifying || !allChecked}
                          className="flex-1 px-4 py-2.5 rounded-lg bg-emerald-500 text-white font-medium text-sm hover:bg-emerald-600 transition-colors disabled:opacity-50"
                          title={!allChecked ? 'Complétez la checklist' : ''}
                        >
                          {verifying ? '...' : '✓ Approuver'}
                        </button>
                      </div>
                    ) : selectedListing.status === 'rejected' ? (
                      <button
                        onClick={() => handleVerify(selectedListing._id, 'active')}
                        disabled={verifying}
                        className="w-full px-4 py-2.5 rounded-lg bg-[var(--bg-deep)] border border-[var(--border)] text-[var(--text-muted)] font-medium text-sm hover:border-[var(--orange)] hover:text-[var(--orange)] transition-colors disabled:opacity-50"
                      >
                        Réactiver cette annonce
                      </button>
                    ) : selectedListing.status === 'active' ? (
                      <div className="text-center py-2">
                        <span className="text-emerald-400 text-sm font-medium">✓ Annonce vérifiée et active</span>
                      </div>
                    ) : (
                      <div className="text-center py-2">
                        <span className="text-sky-400 text-sm font-medium">💰 Annonce vendue</span>
                      </div>
                    )}
                  </div>

                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
};

export default AdminListings;