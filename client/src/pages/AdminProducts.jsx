import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../services/productService';

const BRANDS = ['Samsung', 'Xiaomi', 'Asus', 'Sony', 'Apple', 'Lenovo'];
const CATEGORIES = ['Smartphone', 'Laptop', 'Wearable', 'Accessoire'];
const CATEGORY_ICONS = { Smartphone: '📱', Laptop: '💻', Wearable: '⌚', Accessoire: '🎧' };

const emptyForm = { name: '', brand: 'Samsung', category: 'Smartphone', price: '', description: '', specs: '{}', image: '', inStock: true };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

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
    } catch { setProducts([]); }
    finally { setLoading(false); }
  }, [page, search, filterCategory]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setFormError(''); setShowModal(true); };
  const openEdit = (p) => {
    setEditing(p);
    setForm({ name: p.name, brand: p.brand, category: p.category, price: String(p.price), description: p.description, specs: JSON.stringify(p.specs || {}, null, 2), image: p.image || '', inStock: p.inStock });
    setFormError(''); setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setFormError(''); setSaving(true);
    try {
      let parsedSpecs = {};
      try { parsedSpecs = JSON.parse(form.specs); } catch { setFormError('JSON specs invalide'); setSaving(false); return; }
      const payload = { name: form.name.trim(), brand: form.brand, category: form.category, price: Number(form.price), description: form.description.trim(), specs: parsedSpecs, image: form.image.trim(), inStock: form.inStock };
      if (editing) await updateProduct(editing._id, payload); else await createProduct(payload);
      setShowModal(false); fetchProducts();
    } catch (err) { setFormError(err.response?.data?.message || 'Erreur'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return; setDeleting(true);
    try { await deleteProduct(deleteTarget._id); setDeleteTarget(null); fetchProducts(); }
    catch { setFormError('Erreur suppression'); }
    finally { setDeleting(false); }
  };

  const inputCls = 'w-full px-3 sm:px-4 py-2 bg-[var(--bg-deep)] border border-[var(--border)] rounded-xl text-[var(--text)] text-sm font-qaranta placeholder:text-[var(--text-muted)]/50 focus:outline-none focus:border-[var(--orange)] transition-colors';

  return (
    <div className="min-h-screen bg-[var(--bg-deep)] py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 sm:mb-8">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[var(--text)] font-request">Gestion des Produits</h1>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1 font-qaranta">{total} produit{total > 1 ? 's' : ''} au catalogue</p>
          </div>
          <button onClick={openCreate} className="px-4 py-2.5 bg-gradient-to-r from-[var(--orange)] to-amber-500 text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-[var(--orange)]/25 transition-all cursor-pointer flex items-center gap-2 justify-center font-qaranta">
            <span className="text-lg">+</span> Ajouter un produit
          </button>
        </div>

        {/* Filters */}
        <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-3 sm:p-4 mb-4 sm:mb-6 flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-sm">🔍</span>
            <input type="text" placeholder="Rechercher..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className={`${inputCls} !pl-10 font-qaranta`} />
          </div>
          <select value={filterCategory} onChange={(e) => { setFilterCategory(e.target.value); setPage(1); }} className={`${inputCls} sm:w-48 font-qaranta`}>
            <option value="">Toutes catégories</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{CATEGORY_ICONS[c]} {c}</option>)}
          </select>
        </div>

        {/* ── Desktop Table ── */}
        <div className="hidden sm:block bg-[var(--bg-card)] rounded-xl border border-[var(--border)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--bg-deep)]/50">
                  <th className="text-left py-3 px-4 text-[var(--text-muted)] font-medium text-xs font-qaranta">Produit</th>
                  <th className="text-left py-3 px-4 text-[var(--text-muted)] font-medium text-xs font-qaranta">Marque</th>
                  <th className="text-left py-3 px-4 text-[var(--text-muted)] font-medium text-xs font-qaranta">Catégorie</th>
                  <th className="text-right py-3 px-4 text-[var(--text-muted)] font-medium text-xs font-qaranta">Prix</th>
                  <th className="text-center py-3 px-4 text-[var(--text-muted)] font-medium text-xs font-qaranta">Stock</th>
                  <th className="text-center py-3 px-4 text-[var(--text-muted)] font-medium text-xs font-qaranta">Note</th>
                  <th className="text-right py-3 px-4 text-[var(--text-muted)] font-medium text-xs font-qaranta">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={7} className="py-12 text-center text-[var(--text-muted)] text-sm">Chargement...</td></tr>
                ) : products.length === 0 ? (
                  <tr><td colSpan={7} className="py-12 text-center text-[var(--text-muted)] text-sm">Aucun produit trouvé</td></tr>
                ) : products.map((p, i) => (
                  <motion.tr key={p._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-b border-[var(--border)]/50 hover:bg-[var(--bg-deep)]/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {p.image ? <img src={p.image} alt="" className="w-10 h-10 rounded-lg object-cover bg-[var(--bg-deep)]" /> : <div className="w-10 h-10 rounded-lg bg-[var(--bg-deep)] flex items-center justify-center text-lg">{CATEGORY_ICONS[p.category] || '📦'}</div>}
                        <div><p className="text-[var(--text)] font-medium truncate max-w-[200px] text-sm font-request">{p.name}</p><p className="text-[10px] text-[var(--text-muted)] font-qaranta">{p.numReviews} avis</p></div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[var(--text)] text-sm font-qaranta">{p.brand}</td>
                    <td className="py-3 px-4"><span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-[var(--orange)]/10 text-[var(--orange)]">{CATEGORY_ICONS[p.category]} {p.category}</span></td>
                    <td className="py-3 px-4 text-right font-mono text-[var(--text)] text-sm">{p.price.toLocaleString('fr-FR')}€</td>
                    <td className="py-3 px-4 text-center"><span className={`inline-block w-2 h-2 rounded-full ${p.inStock ? 'bg-emerald-400' : 'bg-red-400'}`} /></td>
                    <td className="py-3 px-4 text-center text-[var(--text)] text-sm">{p.rating > 0 ? <span className="flex items-center justify-center gap-1"><span className="text-amber-400 text-xs">★</span>{p.rating.toFixed(1)}</span> : <span className="text-[var(--text-muted)]">—</span>}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(p)} className="p-2 rounded-lg hover:bg-[var(--orange)]/10 text-[var(--text-muted)] hover:text-[var(--orange)] transition-colors cursor-pointer" title="Modifier">✏️</button>
                        <button onClick={() => setDeleteTarget(p)} className="p-2 rounded-lg hover:bg-red-500/10 text-[var(--text-muted)] hover:text-red-400 transition-colors cursor-pointer" title="Supprimer">🗑️</button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--border)]">
              <p className="text-xs text-[var(--text-muted)] font-qaranta">Page {page}/{totalPages}</p>
              <div className="flex gap-2">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 rounded-lg border border-[var(--border)] text-[var(--text)] text-sm disabled:opacity-30 hover:border-[var(--orange)] transition-colors cursor-pointer">←</button>
                <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1 rounded-lg border border-[var(--border)] text-[var(--text)] text-sm disabled:opacity-30 hover:border-[var(--orange)] transition-colors cursor-pointer">→</button>
              </div>
            </div>
          )}
        </div>

        {/* ── Mobile Card View ── */}
        <div className="sm:hidden space-y-3">
          {loading ? (
            <div className="text-center py-12 text-[var(--text-muted)] text-sm">Chargement...</div>
          ) : products.length === 0 ? (
            <div className="text-center py-12 text-[var(--text-muted)] text-sm">Aucun produit trouvé</div>
          ) : products.map((p, i) => (
            <motion.div
              key={p._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-3.5"
            >
              <div className="flex items-center gap-3 mb-2.5">
                {p.image ? <img src={p.image} alt="" className="w-11 h-11 rounded-lg object-cover bg-[var(--bg-deep)]" /> : <div className="w-11 h-11 rounded-lg bg-[var(--bg-deep)] flex items-center justify-center text-xl">{CATEGORY_ICONS[p.category] || '📦'}</div>}
                <div className="flex-1 min-w-0">
                  <p className="text-[var(--text)] font-medium text-sm truncate font-request">{p.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-[var(--text-muted)] font-qaranta">{p.brand}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[var(--orange)]/10 text-[var(--orange)] font-qaranta">{p.category}</span>
                    <span className={`w-1.5 h-1.5 rounded-full ${p.inStock ? 'bg-emerald-400' : 'bg-red-400'}`} />
                  </div>
                </div>
                <span className="text-[var(--orange)] font-mono font-bold text-sm shrink-0">{p.price.toLocaleString('fr-FR')}€</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-[10px] text-[var(--text-muted)]">
                  {p.rating > 0 && <span className="text-amber-400">★ {p.rating.toFixed(1)}</span>}
                  <span>{p.numReviews} avis</span>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg hover:bg-[var(--orange)]/10 text-[var(--text-muted)] hover:text-[var(--orange)] transition-colors cursor-pointer text-sm">✏️</button>
                  <button onClick={() => setDeleteTarget(p)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-[var(--text-muted)] hover:text-red-400 transition-colors cursor-pointer text-sm">🗑️</button>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Mobile pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <p className="text-xs text-[var(--text-muted)] font-qaranta">Page {page}/{totalPages}</p>
              <div className="flex gap-2">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 rounded-lg border border-[var(--border)] text-[var(--text)] text-sm disabled:opacity-30 cursor-pointer">←</button>
                <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1.5 rounded-lg border border-[var(--border)] text-[var(--text)] text-sm disabled:opacity-30 cursor-pointer">→</button>
              </div>
            </div>
          )}
        </div>

        {/* ── Create/Edit Modal ── */}
        <AnimatePresence>
          {showModal && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)}>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 40 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-[var(--bg-card)] rounded-t-2xl sm:rounded-2xl border border-[var(--border)] w-full sm:max-w-2xl max-h-[92vh] sm:max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-[var(--border)] sticky top-0 bg-[var(--bg-card)] z-10">
                  <h2 className="text-sm sm:text-lg font-bold text-[var(--text)] font-request">{editing ? 'Modifier le produit' : 'Nouveau produit'}</h2>
                  <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-[var(--bg-deep)] text-[var(--text-muted)] transition-colors cursor-pointer">✕</button>
                </div>
                <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-5">
                  {formError && <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs sm:text-sm">{formError}</div>}
                  <div>
                    <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5 font-qaranta">Nom *</label>
                    <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required maxLength={100} placeholder="Galaxy S25 Ultra" className={inputCls} />
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5 font-qaranta">Marque *</label>
                      <select value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} className={inputCls}>{BRANDS.map((b) => <option key={b} value={b}>{b}</option>)}</select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5 font-qaranta">Catégorie *</label>
                      <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputCls}>{CATEGORIES.map((c) => <option key={c} value={c}>{CATEGORY_ICONS[c]} {c}</option>)}</select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5 font-qaranta">Prix (€) *</label>
                      <input type="number" min="0" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required placeholder="999" className={`${inputCls} font-mono`} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5 font-qaranta">En stock</label>
                      <button type="button" onClick={() => setForm({ ...form, inStock: !form.inStock })} className={`w-full px-4 py-2 rounded-xl border text-sm font-medium transition-colors cursor-pointer ${form.inStock ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
                        {form.inStock ? '✓ En stock' : '✕ Rupture'}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5 font-qaranta">URL image</label>
                    <input type="url" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://..." className={inputCls} />
                    {form.image && <img src={form.image} alt="Preview" className="mt-2 h-16 rounded-lg object-cover" onError={(e) => { e.target.style.display = 'none'; }} />}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5 font-qaranta">Description *</label>
                    <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required rows={3} minLength={10} placeholder="Description (min. 10 car.)..." className={`${inputCls} resize-none`} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5 font-qaranta">Spécifications (JSON)</label>
                    <textarea value={form.specs} onChange={(e) => setForm({ ...form, specs: e.target.value })} rows={3} placeholder='{"écran": "6.8\"", "RAM": "12 Go"}' className={`${inputCls} font-mono text-xs resize-none`} />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 rounded-xl border border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--text-muted)] transition-colors text-sm cursor-pointer font-qaranta">Annuler</button>
                    <button type="submit" disabled={saving} className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[var(--orange)] to-amber-500 text-white font-medium text-sm hover:shadow-lg hover:shadow-[var(--orange)]/25 transition-all disabled:opacity-50 cursor-pointer font-qaranta">
                      {saving ? 'Enregistrement...' : editing ? 'Mettre à jour' : 'Créer'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Delete Modal ── */}
        <AnimatePresence>
          {deleteTarget && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteTarget(null)}>
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} onClick={(e) => e.stopPropagation()} className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] p-5 sm:p-6 w-full max-w-md text-center">
                <div className="text-4xl mb-3">⚠️</div>
                <h3 className="text-base sm:text-lg font-bold text-[var(--text)] mb-2 font-request">Supprimer ce produit ?</h3>
                <p className="text-xs sm:text-sm text-[var(--text-muted)] mb-5 font-qaranta">« {deleteTarget.name} » sera définitivement supprimé.</p>
                <div className="flex gap-3">
                  <button onClick={() => setDeleteTarget(null)} className="flex-1 px-4 py-2.5 rounded-xl border border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--text-muted)] transition-colors text-sm cursor-pointer font-qaranta">Annuler</button>
                  <button onClick={handleDelete} disabled={deleting} className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white font-medium text-sm hover:bg-red-600 transition-colors disabled:opacity-50 cursor-pointer font-qaranta">{deleting ? 'Suppression...' : 'Supprimer'}</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}