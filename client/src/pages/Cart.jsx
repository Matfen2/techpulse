import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cartItems, removeFromCart, subtotal, buyerProtection, serviceFee, total } = useCart();

  return (
    <div className="min-h-screen bg-[var(--bg-deep)] pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">🛒 Mon Panier</h1>
        <p className="text-[var(--text-muted)] text-sm mb-8">{cartItems.length} article{cartItems.length !== 1 ? 's' : ''}</p>

        {cartItems.length === 0 ? (
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-12 text-center">
            <p className="text-4xl mb-4">🛒</p>
            <p className="text-[var(--text-muted)] mb-2">Votre panier est vide</p>
            <p className="text-[var(--text-muted)] text-sm mb-6">Parcourez la marketplace pour trouver des produits d'occasion vérifiés</p>
            <Link to="/marketplace" className="inline-block px-6 py-2.5 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-hover)] transition-colors font-medium">
              Explorer la marketplace
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Liste articles */}
            <div className="flex-1 space-y-4">
              {cartItems.map((item) => (
                <div key={item._id} className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5 flex gap-4">
                  {/* Image */}
                  <div className="w-24 h-24 bg-[var(--bg-base)] rounded-lg flex items-center justify-center shrink-0">
                    {item.images?.[0]?.url ? (
                      <img src={item.images[0].url} alt={item.title} className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <span className="text-3xl">📦</span>
                    )}
                  </div>

                  {/* Infos */}
                  <div className="flex-1 min-w-0">
                    <Link to={`/marketplace/${item.slug}`} className="text-[var(--text-primary)] font-semibold hover:text-[var(--primary)] transition-colors">
                      {item.title}
                    </Link>
                    <p className="text-[var(--text-muted)] text-xs mt-1">
                      {item.category} • {item.condition}
                    </p>
                    {item.seller && (
                      <p className="text-[var(--text-muted)] text-xs mt-1">
                        Vendu par <span className="text-[var(--text-secondary)]">{item.seller.firstName} {item.seller.lastName}</span>
                      </p>
                    )}
                    {item.videoVerified && (
                      <span className="inline-block mt-2 text-green-400 text-xs">✓ Vidéo vérifiée</span>
                    )}
                  </div>

                  {/* Prix + Supprimer */}
                  <div className="flex flex-col items-end justify-between shrink-0">
                    <span className="text-[var(--primary)] font-bold text-lg">{item.price} €</span>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-red-400 text-xs hover:text-red-300 transition-colors"
                    >
                      ✕ Retirer
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Résumé */}
            <div className="lg:w-80 shrink-0">
              <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6 sticky top-24">
                <h3 className="text-[var(--text-primary)] font-bold mb-4">Résumé</h3>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">Sous-total ({cartItems.length} article{cartItems.length !== 1 ? 's' : ''})</span>
                    <span className="text-[var(--text-primary)]">{subtotal.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">Protection acheteur</span>
                    <span className="text-[var(--text-primary)]">{buyerProtection.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">Frais de service (5%)</span>
                    <span className="text-[var(--text-primary)]">{serviceFee.toFixed(2)} €</span>
                  </div>
                </div>

                <div className="border-t border-[var(--border)] mt-4 pt-4 flex justify-between items-center">
                  <span className="text-[var(--text-primary)] font-bold">Total</span>
                  <span className="text-[var(--primary)] font-bold text-xl">{total.toFixed(2)} €</span>
                </div>

                <Link
                  to="/checkout"
                  className="block w-full mt-6 py-3 bg-[var(--primary)] text-white text-center rounded-lg hover:bg-[var(--primary-hover)] transition-colors font-medium"
                >
                  Passer la commande →
                </Link>

                <p className="text-[var(--text-muted)] text-xs text-center mt-3">
                  🔒 Paiement sécurisé (mode démonstration)
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;