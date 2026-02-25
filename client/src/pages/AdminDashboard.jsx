import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAdminStats } from '../services/productService';

const StatCard = ({ label, value, color = 'var(--primary)', icon }) => (
  <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
    <div className="flex items-center justify-between mb-3">
      <span className="text-2xl">{icon}</span>
      <span className="text-3xl font-bold" style={{ color }}>{value}</span>
    </div>
    <p className="text-sm text-[var(--text-muted)]">{label}</p>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await getAdminStats();
        setStats(data);
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[var(--primary)] text-xl">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Panel Admin</h1>
          <p className="text-[var(--text-muted)]">Vue d'ensemble de TechPulse</p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/admin/products"
            className="px-4 py-2 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-secondary)] hover:border-[var(--primary)] transition-colors"
          >
            Produits
          </Link>
          <Link
            to="/admin/listings"
            className="px-4 py-2 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-secondary)] hover:border-[var(--primary)] transition-colors relative"
          >
            Annonces
            {stats?.pendingListings > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-[var(--error)] text-white text-xs rounded-full flex items-center justify-center">
                {stats.pendingListings}
              </span>
            )}
          </Link>
          <Link
            to="/admin/users"
            className="px-4 py-2 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-secondary)] hover:border-[var(--primary)] transition-colors"
          >
            Utilisateurs
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon="👥" label="Utilisateurs" value={stats?.users || 0} color="var(--info)" />
        <StatCard icon="📦" label="Produits catalogue" value={stats?.products || 0} color="var(--primary)" />
        <StatCard icon="🏪" label="Annonces marketplace" value={stats?.listings || 0} color="var(--teal)" />
        <StatCard icon="⭐" label="Avis clients" value={stats?.reviews || 0} color="var(--warning)" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Pending moderation */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Modération</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[var(--text-muted)] text-sm">Annonces en attente</span>
              <span className={`font-bold ${stats?.pendingListings > 0 ? 'text-[var(--warning)]' : 'text-[var(--success)]'}`}>
                {stats?.pendingListings || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--text-muted)] text-sm">Annonces actives</span>
              <span className="font-bold text-[var(--success)]">{stats?.activeListings || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--text-muted)] text-sm">Nouveaux users (7 jours)</span>
              <span className="font-bold text-[var(--info)]">{stats?.newUsersThisWeek || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--text-muted)] text-sm">Valeur marketplace</span>
              <span className="font-bold text-[var(--primary)]">{(stats?.marketplaceRevenue || 0).toLocaleString('fr-FR')} €</span>
            </div>
          </div>
          {stats?.pendingListings > 0 && (
            <Link
              to="/admin/listings?status=pending"
              className="block mt-4 text-center py-2 bg-[var(--warning)]/10 text-[var(--warning)] rounded-lg text-sm hover:bg-[var(--warning)]/20 transition-colors"
            >
              Modérer les annonces en attente →
            </Link>
          )}
        </div>

        {/* Listings by category */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Annonces par catégorie</h2>
          {stats?.listingsByCategory?.length > 0 ? (
            <div className="space-y-3">
              {stats.listingsByCategory.map((cat) => (
                <div key={cat.name} className="flex items-center justify-between">
                  <span className="text-[var(--text-muted)] text-sm">{cat.name}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 bg-[var(--bg-base)] rounded-full h-2">
                      <div
                        className="bg-[var(--primary)] h-2 rounded-full"
                        style={{ width: `${(cat.count / stats.listings) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-[var(--text-primary)] w-8 text-right">{cat.count}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[var(--text-muted)] text-sm">Aucune annonce pour le moment</p>
          )}
        </div>
      </div>

      {/* Listings by status */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6">
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Annonces par statut</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(stats?.listingsByStatus || []).map((s) => {
            const colors = {
              active: { bg: 'var(--success)', label: 'Actives' },
              pending: { bg: 'var(--warning)', label: 'En attente' },
              sold: { bg: 'var(--info)', label: 'Vendues' },
              rejected: { bg: 'var(--error)', label: 'Rejetées' },
            };
            const config = colors[s.name] || { bg: 'var(--text-muted)', label: s.name };
            return (
              <div key={s.name} className="text-center p-4 bg-[var(--bg-base)] rounded-lg">
                <div className="text-2xl font-bold mb-1" style={{ color: config.bg }}>{s.count}</div>
                <div className="text-xs text-[var(--text-muted)]">{config.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;