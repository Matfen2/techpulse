import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getAllListings, verifyListing } from '../services/productService';

const statusColors = {
  active: { bg: 'bg-[var(--success)]/10', text: 'text-[var(--success)]', label: 'Active' },
  pending: { bg: 'bg-[var(--warning)]/10', text: 'text-[var(--warning)]', label: 'En attente' },
  sold: { bg: 'bg-[var(--info)]/10', text: 'text-[var(--info)]', label: 'Vendue' },
  rejected: { bg: 'bg-[var(--error)]/10', text: 'text-[var(--error)]', label: 'Rejetée' },
};

const AdminListings = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const statusFilter = searchParams.get('status') || '';

  const fetchListings = async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      const { data } = await getAllListings(params);
      setListings(data);
    } catch (err) {
      console.error('Error fetching listings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [searchParams]);

  const handleVerify = async (id, status) => {
    try {
      await verifyListing(id, status);
      await fetchListings();
    } catch (err) {
      console.error('Error verifying listing:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Modération des annonces</h1>
          <p className="text-[var(--text-muted)]">{listings.length} annonce{listings.length > 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-2 mb-6">
        {['', 'pending', 'active', 'rejected', 'sold'].map((status) => (
          <button
            key={status}
            onClick={() => {
              const params = new URLSearchParams();
              if (status) params.set('status', status);
              setSearchParams(params);
            }}
            className={`px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
              statusFilter === status
                ? 'bg-[var(--primary)] text-white'
                : 'bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--primary)]'
            }`}
          >
            {status === '' ? 'Toutes' : statusColors[status]?.label || status}
          </button>
        ))}
      </div>

      {/* Listings table */}
      {loading ? (
        <div className="text-center py-10 text-[var(--text-muted)]">Chargement...</div>
      ) : listings.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-[var(--text-muted)]">Aucune annonce trouvée</p>
        </div>
      ) : (
        <div className="space-y-4">
          {listings.map((listing) => (
            <div
              key={listing._id}
              className={`bg-[var(--bg-card)] border rounded-xl p-5 flex items-center gap-6 ${
                listing.status === 'pending' ? 'border-[var(--warning)]/30' : 'border-[var(--border)]'
              }`}
            >
              {/* Thumbnail */}
              <div className="w-20 h-20 bg-[var(--bg-base)] rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                {listing.images?.[0] ? (
                  <img src={listing.images[0].url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl">📦</span>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-[var(--text-primary)] font-semibold text-sm truncate">{listing.title}</h3>
                  <span className={`px-2 py-0.5 rounded text-xs ${statusColors[listing.status]?.bg} ${statusColors[listing.status]?.text}`}>
                    {statusColors[listing.status]?.label}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-[var(--text-muted)]">
                  <span>{listing.category}</span>
                  <span>{listing.condition}</span>
                  <span className="text-[var(--primary)] font-semibold">{listing.price} €</span>
                  <span>par {listing.seller?.firstName} {listing.seller?.lastName}</span>
                  <span>{new Date(listing.createdAt).toLocaleDateString('fr-FR')}</span>
                </div>
                {listing.video?.url && (
                  <a href={listing.video.url} target="_blank" rel="noopener noreferrer" className="text-xs text-[var(--info)] hover:underline mt-1 inline-block">
                    🎥 Voir la vidéo
                  </a>
                )}
              </div>

              {/* Actions */}
              {listing.status === 'pending' && (
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleVerify(listing._id, 'active')}
                    className="px-4 py-2 bg-[var(--success)]/10 text-[var(--success)] rounded-lg text-sm hover:bg-[var(--success)]/20 transition-colors cursor-pointer"
                  >
                    ✓ Approuver
                  </button>
                  <button
                    onClick={() => handleVerify(listing._id, 'rejected')}
                    className="px-4 py-2 bg-[var(--error)]/10 text-[var(--error)] rounded-lg text-sm hover:bg-[var(--error)]/20 transition-colors cursor-pointer"
                  >
                    ✗ Rejeter
                  </button>
                </div>
              )}

              {listing.status === 'active' && (
                <span className="text-[var(--success)] text-sm shrink-0">✓ Vérifiée</span>
              )}
              {listing.status === 'rejected' && (
                <button
                  onClick={() => handleVerify(listing._id, 'active')}
                  className="px-4 py-2 bg-[var(--bg-base)] border border-[var(--border)] text-[var(--text-muted)] rounded-lg text-sm hover:border-[var(--primary)] transition-colors cursor-pointer shrink-0"
                >
                  Réactiver
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminListings;