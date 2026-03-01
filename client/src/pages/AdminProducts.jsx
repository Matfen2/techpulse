import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../services/productService';

const BRANDS = ['Samsung', 'Xiaomi', 'Asus', 'Sony', 'Apple', 'Lenovo'];
const CATEGORIES = ['Smartphone', 'Laptop', 'Wearable', 'Accessoire'];

const CATEGORY_ICONS = {
  Smartphone: '📱',
  Laptop: '💻',
  Wearable: '⌚',
  Accessoire: '🎧',
};

// ── Empty form state ──
const emptyForm = {
  name: '',
  brand: 'Samsung',
  category: 'Smartphone',
  price: '',
  description: '',
  specs: '{}',
  image: '',
  inStock: true,
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // ── Fetch products ──
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (search) params.search = search;
      if (filterCategory) params.category = filterCategory;
      const { data } = await getProducts(params);
      setProducts(data.products);
      setTotalPages(data.totalPages);
      setTotal(data.total);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [page, search, filterCategory]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // ── Open modal for create ──
  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setFormError('');
    setShowModal(true);
  };

  // ── Open modal for edit ──
  const openEdit = (product) => {
    setEditing(product);
    setForm({
      name: product.name,
      brand: product.brand,
      category: product.category,
      price: String(product.price),
      description: product.description,
      specs: JSON.stringify(product.specs || {}, null, 2),
      image: product.image || '',
      inStock: product.inStock,
    });
    setFormError('');
    setShowModal(true);
  };

  // ── Handle form submit ──
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSaving(true);

    try {
      let parsedSpecs = {};
      try {
        parsedSpecs = JSON.parse(form.specs);
      } catch {
        setFormError('Le JSON des spécifications est invalide');
        setSaving(false);
        return;
      }

      const payload = {
        name: form.name.trim(),
        brand: form.brand,
        category: form.category,
        price: Number(form.price),
        description: form.description.trim(),
        specs: parsedSpecs,
        image: form.image.trim(),
        inStock: form.inStock,
      };

      if (editing) {
        await updateProduct(editing._id, payload);
      } else {
        await createProduct(payload);
      }

      setShowModal(false);
      fetchProducts();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  // ── Handle delete ──
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteProduct(deleteTarget._id);
      setDeleteTarget(null);
      fetchProducts();
    } catch {
      setFormError('Erreur lors de la suppression');
    } finally {
      setDeleting(false);
    }
  };

  // ── Search with debounce reset page ──
  const handleSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-deep)] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[var(--text)]">
              Gestion des Produits
            </h1>
            <p className="text-sm text-[var(--text-muted)] mt-1">
              {total} produit{total > 1 ? 's' : ''} au catalogue
            </p>
          </div>
          <button onClick={openCreate} className="btn-primary flex items-center gap-2">
            <span className="text-lg">+</span>
            Ajouter un produit
          </button>
        </div>

        {/* ── Filters bar ── */}
        <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-4 mb-6 flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">🔍</span>
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[var(--bg-deep)] border border-[var(--border)] rounded-lg text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--orange)]"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => { setFilterCategory(e.target.value); setPage(1); }}
            className="px-4 py-2 bg-[var(--bg-deep)] border border-[var(--border)] rounded-lg text-[var(--text)] focus:outline-none focus:border-[var(--orange)]"
          >
            <option value="">Toutes catégories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{CATEGORY_ICONS[c]} {c}</option>
            ))}
          </select>
        </div>

        {/* ── Table ── */}
        <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--bg-deep)]/50">
                  <th className="text-left py-3 px-4 text-[var(--text-muted)] font-medium">Produit</th>
                  <th className="text-left py-3 px-4 text-[var(--text-muted)] font-medium">Marque</th>
                  <th className="text-left py-3 px-4 text-[var(--text-muted)] font-medium">Catégorie</th>
                  <th className="text-right py-3 px-4 text-[var(--text-muted)] font-medium">Prix</th>
                  <th className="text-center py-3 px-4 text-[var(--text-muted)] font-medium">Stock</th>
                  <th className="text-center py-3 px-4 text-[var(--text-muted)] font-medium">Note</th>
                  <th className="text-right py-3 px-4 text-[var(--text-muted)] font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-[var(--text-muted)]">
                      Chargement...
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-[var(--text-muted)]">
                      Aucun produit trouvé
                    </td>
                  </tr>
                ) : (
                  products.map((product, i) => (
                    <motion.tr
                      key={product._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="border-b border-[var(--border)]/50 hover:bg-[var(--bg-deep)]/30 transition-colors"
                    >
                      {/* Produit */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          {product.image ? (
                            <img src={product.image} alt={product.name} className="w-10 h-10 rounded-lg object-cover bg-[var(--bg-deep)]" />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-[var(--bg-deep)] flex items-center justify-center text-lg">
                              {CATEGORY_ICONS[product.category] || '📦'}
                            </div>
                          )}
                          <div>
                            <p className="text-[var(--text)] font-medium truncate max-w-[200px]">{product.name}</p>
                            <p className="text-xs text-[var(--text-muted)]">{product.numReviews} avis</p>
                          </div>
                        </div>
                      </td>

                      {/* Marque */}
                      <td className="py-3 px-4 text-[var(--text)]">{product.brand}</td>

                      {/* Catégorie */}
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-[var(--orange)]/10 text-[var(--orange)]">
                          {CATEGORY_ICONS[product.category]} {product.category}
                        </span>
                      </td>

                      {/* Prix */}
                      <td className="py-3 px-4 text-right font-mono text-[var(--text)]">
                        {product.price.toLocaleString('fr-FR')}€
                      </td>

                      {/* Stock */}
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-block w-2 h-2 rounded-full ${product.inStock ? 'bg-emerald-400' : 'bg-red-400'}`} />
                      </td>

                      {/* Note */}
                      <td className="py-3 px-4 text-center text-[var(--text)]">
                        {product.rating > 0 ? (
                          <span className="flex items-center justify-center gap-1">
                            <span className="text-amber-400 text-xs">★</span>
                            {product.rating.toFixed(1)}
                          </span>
                        ) : (
                          <span className="text-[var(--text-muted)]">—</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEdit(product)}
                            className="p-2 rounded-lg hover:bg-[var(--orange)]/10 text-[var(--text-muted)] hover:text-[var(--orange)] transition-colors"
                            title="Modifier"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => setDeleteTarget(product)}
                            className="p-2 rounded-lg hover:bg-red-500/10 text-[var(--text-muted)] hover:text-red-400 transition-colors"
                            title="Supprimer"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* ── Pagination ── */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--border)]">
              <p className="text-sm text-[var(--text-muted)]">
                Page {page} / {totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1 rounded-lg border border-[var(--border)] text-[var(--text)] disabled:opacity-30 hover:border-[var(--orange)] transition-colors"
                >
                  ←
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1 rounded-lg border border-[var(--border)] text-[var(--text)] disabled:opacity-30 hover:border-[var(--orange)] transition-colors"
                >
                  →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ══════════════════════════════════════════ */}
        {/* ── Create / Edit Modal ── */}
        {/* ══════════════════════════════════════════ */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowModal(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              >
                {/* Modal header */}
                <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
                  <h2 className="text-lg font-bold text-[var(--text)]">
                    {editing ? 'Modifier le produit' : 'Nouveau produit'}
                  </h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 rounded-lg hover:bg-[var(--bg-deep)] text-[var(--text-muted)] transition-colors"
                  >
                    ✕
                  </button>
                </div>

                {/* Modal form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                  {formError && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                      {formError}
                    </div>
                  )}

                  {/* Row 1: Name */}
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-muted)] mb-1">
                      Nom du produit *
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                      maxLength={100}
                      placeholder="Galaxy S25 Ultra"
                      className="w-full px-4 py-2 bg-[var(--bg-deep)] border border-[var(--border)] rounded-lg text-[var(--text)] placeholder:text-[var(--text-muted)]/50 focus:outline-none focus:border-[var(--orange)]"
                    />
                  </div>

                  {/* Row 2: Brand + Category (2 cols) */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-muted)] mb-1">
                        Marque *
                      </label>
                      <select
                        value={form.brand}
                        onChange={(e) => setForm({ ...form, brand: e.target.value })}
                        className="w-full px-4 py-2 bg-[var(--bg-deep)] border border-[var(--border)] rounded-lg text-[var(--text)] focus:outline-none focus:border-[var(--orange)]"
                      >
                        {BRANDS.map((b) => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-muted)] mb-1">
                        Catégorie *
                      </label>
                      <select
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                        className="w-full px-4 py-2 bg-[var(--bg-deep)] border border-[var(--border)] rounded-lg text-[var(--text)] focus:outline-none focus:border-[var(--orange)]"
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c} value={c}>{CATEGORY_ICONS[c]} {c}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Row 3: Price + Stock (2 cols) */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-muted)] mb-1">
                        Prix (€) *
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={form.price}
                        onChange={(e) => setForm({ ...form, price: e.target.value })}
                        required
                        placeholder="999"
                        className="w-full px-4 py-2 bg-[var(--bg-deep)] border border-[var(--border)] rounded-lg text-[var(--text)] placeholder:text-[var(--text-muted)]/50 focus:outline-none focus:border-[var(--orange)] font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-muted)] mb-1">
                        En stock
                      </label>
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, inStock: !form.inStock })}
                        className={`w-full px-4 py-2 rounded-lg border transition-colors font-medium ${
                          form.inStock
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                            : 'bg-red-500/10 border-red-500/30 text-red-400'
                        }`}
                      >
                        {form.inStock ? '✓ En stock' : '✕ Rupture'}
                      </button>
                    </div>
                  </div>

                  {/* Row 4: Image URL */}
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-muted)] mb-1">
                      URL de l'image
                    </label>
                    <input
                      type="url"
                      value={form.image}
                      onChange={(e) => setForm({ ...form, image: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                      className="w-full px-4 py-2 bg-[var(--bg-deep)] border border-[var(--border)] rounded-lg text-[var(--text)] placeholder:text-[var(--text-muted)]/50 focus:outline-none focus:border-[var(--orange)]"
                    />
                    {form.image && (
                      <img src={form.image} alt="Preview" className="mt-2 h-20 rounded-lg object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                    )}
                  </div>

                  {/* Row 5: Description */}
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-muted)] mb-1">
                      Description *
                    </label>
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      required
                      rows={3}
                      minLength={10}
                      placeholder="Description du produit (min. 10 caractères)..."
                      className="w-full px-4 py-2 bg-[var(--bg-deep)] border border-[var(--border)] rounded-lg text-[var(--text)] placeholder:text-[var(--text-muted)]/50 focus:outline-none focus:border-[var(--orange)] resize-none"
                    />
                  </div>

                  {/* Row 6: Specs JSON */}
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-muted)] mb-1">
                      Spécifications (JSON)
                    </label>
                    <textarea
                      value={form.specs}
                      onChange={(e) => setForm({ ...form, specs: e.target.value })}
                      rows={4}
                      placeholder='{"écran": "6.8 pouces", "RAM": "12 Go"}'
                      className="w-full px-4 py-2 bg-[var(--bg-deep)] border border-[var(--border)] rounded-lg text-[var(--text)] placeholder:text-[var(--text-muted)]/50 focus:outline-none focus:border-[var(--orange)] font-mono text-sm resize-none"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="flex-1 px-4 py-2 rounded-lg border border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--text-muted)] transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex-1 px-4 py-2 rounded-lg bg-[var(--orange)] text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      {saving ? 'Enregistrement...' : editing ? 'Mettre à jour' : 'Créer le produit'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ══════════════════════════════════════════ */}
        {/* ── Delete Confirmation Modal ── */}
        {/* ══════════════════════════════════════════ */}
        <AnimatePresence>
          {deleteTarget && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
              onClick={() => setDeleteTarget(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] p-6 w-full max-w-md text-center"
              >
                <div className="text-4xl mb-4">⚠️</div>
                <h3 className="text-lg font-bold text-[var(--text)] mb-2">Supprimer ce produit ?</h3>
                <p className="text-sm text-[var(--text-muted)] mb-6">
                  « {deleteTarget.name} » sera définitivement supprimé. Cette action est irréversible.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteTarget(null)}
                    className="flex-1 px-4 py-2 rounded-lg border border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--text-muted)] transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="flex-1 px-4 py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
                  >
                    {deleting ? 'Suppression...' : 'Supprimer'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}