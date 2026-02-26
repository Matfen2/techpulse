import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import { getMyReviews, getMyListings, deleteReview, getFavorites } from '../services/productService';

const Dashboard = () => {
  const { user } = useAuth();
  const { favoriteIds, toggleFavorite, isFavorite } = useFavorites();
  const [favorites, setFavorites] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [reviews, setReviews] = useState([]);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const activeTab = searchParams.get('tab') || 'favorites';

  useEffect(() => {
    const fetchData = async () => {
        setLoading(true);
        try {
        if (activeTab === 'favorites') {
            const res = await getFavorites();
            setFavorites(res.data);
        } else if (activeTab === 'reviews') {
            const res = await getMyReviews();
            setReviews(res.data);
        } else if (activeTab === 'listings') {
            const res = await getMyListings();
            setListings(res.data);
        }
        } catch (err) {
        console.error(err);
        }
        setLoading(false);
    };
    fetchData();
  }, [activeTab]);

  const handleDeleteReview = async (id) => {
    if (!window.confirm('Supprimer cet avis ?')) return;
    try {
      await deleteReview(id);
      setReviews((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const tabs = [
    { key: 'favorites', label: '❤️ Mes Favoris', count: favoriteIds.length },
    { key: 'reviews', label: '⭐ Mes Avis', count: reviews.length },
    { key: 'listings', label: '🏷️ Mes Annonces', count: listings.length },
    { key: 'settings', label: '⚙️ Paramètres' },
  ];

  const statusColors = {
    active: 'text-green-400 bg-green-400/10 border-green-400/30',
    pending: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
    rejected: 'text-red-400 bg-red-400/10 border-red-400/30',
    sold: 'text-blue-400 bg-blue-400/10 border-blue-400/30',
  };

  const statusLabels = {
    active: 'Active',
    pending: 'En attente',
    rejected: 'Rejetée',
    sold: 'Vendue',
  };

  const conditionLabels = {
    'Comme neuf': 'Comme neuf',
    'Très bon état': 'Très bon état',
    'Bon état': 'Bon état',
    'État correct': 'État correct',
  };

  return (
    <div className="min-h-screen bg-[var(--bg-deep)] pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar */}
          <aside className="lg:w-72 shrink-0">
            <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6">
              {/* Avatar */}
              <div className="text-center mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--primary)] to-orange-600 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </div>
                <h3 className="text-[var(--text-primary)] font-bold text-lg">
                  {user?.firstName} {user?.lastName}
                </h3>
                <p className="text-[var(--text-muted)] text-sm">{user?.email}</p>
                <p className="text-[var(--text-muted)] text-xs mt-1">
                  Membre depuis {new Date(user?.createdAt).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                </p>
              </div>

              {/* Navigation */}
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setSearchParams({ tab: tab.key })}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      activeTab === tab.key
                        ? 'bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/30'
                        : 'text-[var(--text-secondary)] hover:bg-[var(--bg-base)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <span>{tab.label}</span>
                    {tab.count !== undefined && (
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        activeTab === tab.key ? 'bg-[var(--primary)]/20 text-[var(--primary)]' : 'bg-[var(--bg-base)] text-[var(--text-muted)]'
                      }`}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            
            {/* ── Favoris ── */}
            {activeTab === 'favorites' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-2xl font-bold text-[var(--text-primary)]">❤️ Mes Favoris</h1>
                    <p className="text-[var(--text-muted)] text-sm mt-1">{favorites.length} produits sauvegardés</p>
                  </div>
                </div>

                {favorites.length === 0 ? (
                  <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-12 text-center">
                    <p className="text-4xl mb-4">❤️</p>
                    <p className="text-[var(--text-muted)]">Aucun favori pour le moment</p>
                    <Link to="/catalogue" className="inline-block mt-4 px-6 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-hover)] transition-colors">
                      Explorer le catalogue
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {favorites.map((product) => (
                      <div key={product._id} className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden hover:border-[var(--primary)]/50 transition-all group">
                        <div className="relative">
                          <Link to={`/catalogue/${product.slug}`}>
                            <div className="h-40 bg-[var(--bg-base)] flex items-center justify-center text-5xl">
                              {product.category === 'Smartphone' ? '📱' : product.category === 'Laptop' ? '💻' : product.category === 'Wearable' ? '⌚' : '🎧'}
                            </div>
                          </Link>
                          <button
                            onClick={() => {
                                toggleFavorite(product._id);
                                setFavorites((prev) => prev.filter((p) => p._id !== product._id));
                            }}
                            className="absolute top-2 right-2 w-8 h-8 bg-red-500/20 backdrop-blur-sm rounded-full flex items-center justify-center text-red-400 hover:bg-red-500/40 transition-colors"
                          >
                            ❤️
                          </button>
                        </div>
                        <div className="p-4">
                          <Link to={`/catalogue/${product.slug}`}>
                            <h3 className="text-[var(--text-primary)] font-semibold text-sm group-hover:text-[var(--primary)] transition-colors">{product.name}</h3>
                          </Link>
                          <p className="text-[var(--text-muted)] text-xs mt-1">{product.brand}</p>
                          <div className="flex items-center justify-between mt-3">
                            <span className="text-[var(--primary)] font-bold">{product.price} €</span>
                            {product.rating > 0 && (
                              <span className="text-yellow-400 text-xs">★ {product.rating.toFixed(1)}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── Mes Avis ── */}
            {activeTab === 'reviews' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-2xl font-bold text-[var(--text-primary)]">⭐ Mes Avis</h1>
                    <p className="text-[var(--text-muted)] text-sm mt-1">{reviews.length} avis publiés</p>
                  </div>
                </div>

                {loading ? (
                  <div className="text-center py-12 text-[var(--text-muted)]">Chargement...</div>
                ) : reviews.length === 0 ? (
                  <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-12 text-center">
                    <p className="text-4xl mb-4">⭐</p>
                    <p className="text-[var(--text-muted)]">Aucun avis publié</p>
                    <Link to="/catalogue" className="inline-block mt-4 px-6 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-hover)] transition-colors">
                      Donner mon premier avis
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review._id} className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[var(--bg-base)] rounded-lg flex items-center justify-center text-xl">
                              {review.product?.category === 'Smartphone' ? '📱' : review.product?.category === 'Laptop' ? '💻' : review.product?.category === 'Wearable' ? '⌚' : '🎧'}
                            </div>
                            <div>
                              <Link to={`/catalogue/${review.product?.slug}`} className="text-[var(--text-primary)] font-semibold hover:text-[var(--primary)] transition-colors">
                                {review.product?.name}
                              </Link>
                              <p className="text-[var(--text-muted)] text-xs">{review.product?.brand} • {review.product?.category}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-yellow-400 text-sm">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={i < review.rating ? 'text-yellow-400' : 'text-[var(--border)]'}>★</span>
                            ))}
                          </div>
                        </div>
                        <p className="text-[var(--text-secondary)] text-sm mt-3 leading-relaxed">{review.comment}</p>
                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-[var(--border)]">
                          <span className="text-[var(--text-muted)] text-xs">
                            {new Date(review.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </span>
                          <div className="flex gap-2">
                            <Link to={`/catalogue/${review.product?.slug}`} className="px-3 py-1.5 text-xs border border-[var(--border)] text-[var(--text-secondary)] rounded-lg hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors">
                              ✏️ Modifier
                            </Link>
                            <button onClick={() => handleDeleteReview(review._id)} className="px-3 py-1.5 text-xs border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/10 transition-colors">
                              🗑️ Supprimer
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── Mes Annonces ── */}
            {activeTab === 'listings' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-2xl font-bold text-[var(--text-primary)]">🏷️ Mes Annonces</h1>
                    <p className="text-[var(--text-muted)] text-sm mt-1">{listings.length} annonces</p>
                  </div>
                  <Link to="/marketplace/create" className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-hover)] transition-colors text-sm font-medium">
                    + Nouvelle annonce
                  </Link>
                </div>

                {loading ? (
                  <div className="text-center py-12 text-[var(--text-muted)]">Chargement...</div>
                ) : listings.length === 0 ? (
                  <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-12 text-center">
                    <p className="text-4xl mb-4">🏷️</p>
                    <p className="text-[var(--text-muted)]">Aucune annonce publiée</p>
                    <Link to="/marketplace/create" className="inline-block mt-4 px-6 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-hover)] transition-colors">
                      Créer ma première annonce
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {listings.map((listing) => (
                      <div key={listing._id} className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5 flex items-center gap-4">
                        <div className="w-16 h-16 bg-[var(--bg-base)] rounded-lg flex items-center justify-center shrink-0">
                          {listing.images?.[0] ? (
                            <img src={listing.images[0].url} alt="" className="w-full h-full object-cover rounded-lg" />
                          ) : (
                            <span className="text-2xl">📦</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Link to={`/marketplace/${listing.slug}`} className="text-[var(--text-primary)] font-semibold hover:text-[var(--primary)] transition-colors truncate">
                              {listing.title}
                            </Link>
                            <span className={`px-2 py-0.5 text-xs rounded-full border ${statusColors[listing.status]}`}>
                              {statusLabels[listing.status]}
                            </span>
                          </div>
                          <p className="text-[var(--text-muted)] text-xs">
                            {listing.category} • {conditionLabels[listing.condition] || listing.condition} • {new Date(listing.createdAt).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-[var(--primary)] font-bold">{listing.price} €</span>
                          {listing.videoVerified && (
                            <p className="text-green-400 text-xs mt-1">✓ Vérifiée</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── Paramètres ── */}
            {activeTab === 'settings' && (
              <div>
                <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-6">⚙️ Paramètres</h1>
                <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6">
                  <h3 className="text-[var(--text-primary)] font-semibold mb-4">Informations personnelles</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[var(--text-muted)] text-xs font-medium mb-1.5">Prénom</label>
                      <input type="text" defaultValue={user?.firstName} className="w-full px-4 py-2.5 bg-[var(--bg-base)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] text-sm focus:border-[var(--primary)] focus:outline-none transition-colors" />
                    </div>
                    <div>
                      <label className="block text-[var(--text-muted)] text-xs font-medium mb-1.5">Nom</label>
                      <input type="text" defaultValue={user?.lastName} className="w-full px-4 py-2.5 bg-[var(--bg-base)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] text-sm focus:border-[var(--primary)] focus:outline-none transition-colors" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-[var(--text-muted)] text-xs font-medium mb-1.5">Email</label>
                    <input type="email" defaultValue={user?.email} className="w-full px-4 py-2.5 bg-[var(--bg-base)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] text-sm focus:border-[var(--primary)] focus:outline-none transition-colors" />
                  </div>
                  <div className="mt-6 pt-4 border-t border-[var(--border)]">
                    <button className="px-6 py-2.5 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-hover)] transition-colors text-sm font-medium">
                      Sauvegarder
                    </button>
                  </div>
                </div>
              </div>
            )}

          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;