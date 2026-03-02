import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { getAdminStats } from '../services/productService';

// ── Brand colors for donut chart ──
const BRAND_COLORS = {
  Samsung: '#1428A0',
  Apple: '#A2AAAD',
  Xiaomi: '#FF6900',
  Sony: '#000000',
  Asus: '#00529B',
  Lenovo: '#E2231A',
};
const FALLBACK_COLORS = ['#f97316', '#06b6d4', '#8b5cf6', '#10b981', '#f43f5e', '#eab308'];

const STATUS_LABELS = {
  active: 'Actives',
  pending: 'En attente',
  sold: 'Vendues',
  rejected: 'Rejetées',
};
const STATUS_COLORS = {
  active: '#10b981',
  pending: '#f59e0b',
  sold: '#06b6d4',
  rejected: '#ef4444',
};

// ── Custom tooltip for charts ──
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg px-3 py-2 shadow-lg">
      <p className="text-xs text-[var(--text-muted)]">{label || payload[0]?.name}</p>
      <p className="text-sm font-bold text-[var(--text)]">{payload[0]?.value}</p>
    </div>
  );
};

// ── Star display ──
const Stars = ({ rating }) => {
  const full = Math.floor(rating);
  return (
    <span className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <span key={i} className={`text-xs ${i < full ? 'text-amber-400' : 'text-[var(--border)]'}`}>★</span>
      ))}
    </span>
  );
};

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await getAdminStats();
        setStats(data);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[var(--orange)] text-lg">Chargement du dashboard...</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-400 text-lg">Erreur de chargement des statistiques</div>
      </div>
    );
  }

  // Prepare chart data
  const brandData = (stats.productsByBrand || []).map((b) => ({
    ...b,
    color: BRAND_COLORS[b.name] || FALLBACK_COLORS[0],
  }));

  const categoryData = (stats.productsByCategory || []).map((c) => ({
    name: c.name,
    Produits: c.count,
    'Prix moyen': c.avgPrice,
  }));

  const statusData = (stats.listingsByStatus || []).map((s) => ({
    name: STATUS_LABELS[s.name] || s.name,
    value: s.count,
    color: STATUS_COLORS[s.name] || '#6b7280',
  }));

  return (
    <div className="min-h-screen bg-[var(--bg-deep)] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[var(--text)]">Panel Admin</h1>
            <p className="text-sm text-[var(--text-muted)] mt-1">Vue d'ensemble de TechPulse</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Link
              to="/admin/products"
              className="px-4 py-2 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-muted)] hover:border-[var(--orange)] hover:text-[var(--orange)] transition-colors"
            >
              📦 Produits
            </Link>
            <Link
              to="/admin/listings"
              className="px-4 py-2 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-muted)] hover:border-[var(--orange)] hover:text-[var(--orange)] transition-colors relative"
            >
              🏪 Annonces
              {stats.pendingListings > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                  {stats.pendingListings}
                </span>
              )}
            </Link>
            <Link
              to="/admin/users"
              className="px-4 py-2 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-muted)] hover:border-[var(--orange)] hover:text-[var(--orange)] transition-colors"
            >
              👥 Utilisateurs
            </Link>
          </div>
        </div>

        {/* ── KPI Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: '👥', label: 'Utilisateurs', value: stats.users, color: '#06b6d4', sub: `+${stats.newUsersThisWeek} cette semaine` },
            { icon: '📦', label: 'Produits', value: stats.products, color: '#f97316', sub: `${stats.productsByCategory?.length || 0} catégories` },
            { icon: '🏪', label: 'Annonces', value: stats.listings, color: '#8b5cf6', sub: `${stats.pendingListings} en attente` },
            { icon: '⭐', label: 'Avis', value: stats.reviews, color: '#eab308', sub: stats.averageRating ? `${stats.averageRating.toFixed(1)}/5 moyenne` : 'Aucun avis' },
          ].map((kpi, i) => (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">{kpi.icon}</span>
                <span className="text-3xl font-bold" style={{ color: kpi.color }}>
                  {kpi.value.toLocaleString('fr-FR')}
                </span>
              </div>
              <p className="text-sm text-[var(--text)] font-medium">{kpi.label}</p>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">{kpi.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* ── Alerts ── */}
        {stats.pendingListings > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">⚠️</span>
              <div>
                <p className="text-sm font-medium text-amber-400">
                  {stats.pendingListings} annonce{stats.pendingListings > 1 ? 's' : ''} en attente de modération
                </p>
                <p className="text-xs text-[var(--text-muted)]">Les vendeurs attendent votre validation</p>
              </div>
            </div>
            <Link
              to="/admin/listings?status=pending"
              className="px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600 transition-colors shrink-0"
            >
              Modérer →
            </Link>
          </motion.div>
        )}

        {/* ── Charts Row ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

          {/* Bar Chart: Products by category */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6"
          >
            <h2 className="text-base font-bold text-[var(--text)] mb-4">Produits par catégorie</h2>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={categoryData} barSize={40}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                  <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="Produits" fill="#f97316" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-[var(--text-muted)] text-sm text-center py-12">Aucune donnée</p>
            )}
          </motion.div>

          {/* Donut Chart: Products by brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6"
          >
            <h2 className="text-base font-bold text-[var(--text)] mb-4">Répartition par marque</h2>
            {brandData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={brandData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={95}
                    paddingAngle={3}
                    dataKey="count"
                    nameKey="name"
                  >
                    {brandData.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={entry.color || FALLBACK_COLORS[index % FALLBACK_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    formatter={(value) => <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-[var(--text-muted)] text-sm text-center py-12">Aucune donnée</p>
            )}
          </motion.div>
        </div>

        {/* ── Bottom Row ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Listings by status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6"
          >
            <h2 className="text-base font-bold text-[var(--text)] mb-4">Annonces par statut</h2>
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                    nameKey="name"
                  >
                    {statusData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    formatter={(value) => <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-[var(--text-muted)] text-sm text-center py-8">Aucune annonce</p>
            )}
          </motion.div>

          {/* Moderation summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6"
          >
            <h2 className="text-base font-bold text-[var(--text)] mb-4">Modération</h2>
            <div className="space-y-3">
              {[
                { label: 'Annonces en attente', value: stats.pendingListings, color: stats.pendingListings > 0 ? 'text-amber-400' : 'text-emerald-400' },
                { label: 'Annonces actives', value: stats.activeListings, color: 'text-emerald-400' },
                { label: 'Nouveaux users (7j)', value: stats.newUsersThisWeek, color: 'text-sky-400' },
                { label: 'Valeur marketplace', value: `${stats.marketplaceRevenue.toLocaleString('fr-FR')}€`, color: 'text-[var(--orange)]' },
                { label: 'Note moyenne', value: stats.averageRating ? `${stats.averageRating.toFixed(1)}/5` : '—', color: 'text-amber-400' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-sm text-[var(--text-muted)]">{item.label}</span>
                  <span className={`font-bold text-sm ${item.color}`}>{item.value}</span>
                </div>
              ))}
            </div>
            {stats.pendingListings > 0 && (
              <Link
                to="/admin/listings?status=pending"
                className="block mt-4 text-center py-2 bg-amber-500/10 text-amber-400 rounded-lg text-sm hover:bg-amber-500/20 transition-colors"
              >
                Modérer les annonces →
              </Link>
            )}
          </motion.div>

          {/* Recent reviews */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6"
          >
            <h2 className="text-base font-bold text-[var(--text)] mb-4">Derniers avis</h2>
            {stats.recentReviews?.length > 0 ? (
              <div className="space-y-3">
                {stats.recentReviews.map((review) => (
                  <div key={review._id} className="p-3 bg-[var(--bg-deep)] rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-[var(--text)]">{review.user}</span>
                      <Stars rating={review.rating} />
                    </div>
                    <p className="text-xs text-[var(--text-muted)] truncate">{review.comment}</p>
                    <p className="text-xs text-[var(--text-muted)]/50 mt-1">
                      sur {review.product} • {new Date(review.createdAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[var(--text-muted)] text-sm text-center py-8">Aucun avis</p>
            )}
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;