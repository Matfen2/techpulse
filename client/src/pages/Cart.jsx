import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cartItems, removeFromCart, subtotal, buyerProtection, serviceFee, total } = useCart();

  return (
    <div className="min-h-screen bg-[var(--bg-deep)] pt-6 sm:pt-12 lg:pt-24 pb-10 sm:pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-[var(--text-primary)] mb-1 sm:mb-2 font-request">🛒 Mon Panier</h1>
        <p className="text-[var(--text-muted)] text-xs sm:text-sm mb-5 sm:mb-8 font-qaranta">{cartItems.length} article{cartItems.length !== 1 ? 's' : ''}</p>

        {cartItems.length === 0 ? (
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-8 sm:p-12 text-center">
            <p className="text-3xl sm:text-4xl mb-3 sm:mb-4">🛒</p>
            <p className="text-[var(--text-muted)] mb-1.5 sm:mb-2 text-sm sm:text-base font-request">Votre panier est vide</p>
            <p className="text-[var(--text-muted)] text-xs sm:text-sm mb-5 sm:mb-6 font-qaranta">Parcourez la marketplace pour trouver des produits d'occasion vérifiés</p>
            <Link to="/marketplace" className="inline-block px-5 py-2 sm:px-6 sm:py-2.5 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-hover)] transition-colors font-medium text-xs sm:text-sm font-qaranta">
              Explorer la marketplace
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-5 sm:gap-6 lg:gap-8">
            {/* Liste articles */}
            <div className="flex-1 space-y-3 sm:space-y-4">
              {cartItems.map((item) => (
                <div key={item._id} className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-3 sm:p-4 lg:p-5 flex gap-3 sm:gap-4">
                  {/* Image */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-[var(--bg-base)] rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                    {(item.images?.[0]?.url || item.image) ? (
                      <img src={item.images?.[0]?.url || item.image} alt={item.title} className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <span className="text-2xl sm:text-3xl">📦</span>
                    )}
                  </div>

                  {/* Infos */}
                  <div className="flex-1 min-w-0">
                    <Link
                      to={item.type === 'product' ? `/catalogue/${item.slug}` : `/marketplace/${item.slug}`}
                      className="text-[var(--text-primary)] font-semibold hover:text-[var(--primary)] transition-colors text-xs sm:text-sm lg:text-base font-request line-clamp-1"
                    >
                      {item.title}
                    </Link>
                    <p className="text-[var(--text-muted)] text-[10px] sm:text-xs mt-0.5 sm:mt-1 font-qaranta">
                      {item.category}{item.condition ? ` • ${item.condition}` : ''}{item.brand ? ` • ${item.brand}` : ''}
                    </p>
                    {item.seller && (
                      <p className="text-[var(--text-muted)] text-[10px] sm:text-xs mt-0.5 sm:mt-1 font-qaranta hidden sm:block">
                        Vendu par <span className="text-[var(--text-secondary)]">{item.seller.firstName} {item.seller.lastName}</span>
                      </p>
                    )}
                    {item.videoVerified && (
                      <span className="inline-block mt-1 sm:mt-2 text-green-400 text-[10px] sm:text-xs font-qaranta">✓ Vidéo vérifiée</span>
                    )}
                  </div>

                  {/* Prix + Supprimer */}
                  <div className="flex flex-col items-end justify-between shrink-0">
                    <span className="text-[var(--primary)] font-bold text-sm sm:text-base lg:text-lg font-request">
                      {item.price?.toLocaleString('fr-FR')} €
                    </span>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-red-400 text-[10px] sm:text-xs hover:text-red-300 transition-colors cursor-pointer font-qaranta"
                    >
                      ✕ Retirer
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Résumé */}
            <div className="lg:w-80 shrink-0">
              <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4 sm:p-5 lg:p-6 sticky top-20 lg:top-24">
                <h3 className="text-[var(--text-primary)] font-bold mb-3 sm:mb-4 text-sm sm:text-base font-request">Résumé</h3>

                <div className="space-y-2.5 sm:space-y-3 text-xs sm:text-sm">
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)] font-qaranta">Sous-total ({cartItems.length} article{cartItems.length !== 1 ? 's' : ''})</span>
                    <span className="text-[var(--text-primary)] font-qaranta">{subtotal.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)] font-qaranta">Protection acheteur</span>
                    <span className="text-[var(--text-primary)] font-qaranta">{buyerProtection.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)] font-qaranta">Frais de service (5%)</span>
                    <span className="text-[var(--text-primary)] font-qaranta">{serviceFee.toFixed(2)} €</span>
                  </div>
                </div>

                <div className="border-t border-[var(--border)] mt-3 sm:mt-4 pt-3 sm:pt-4 flex justify-between items-center">
                  <span className="text-[var(--text-primary)] font-bold text-sm sm:text-base font-request">Total</span>
                  <span className="text-[var(--primary)] font-bold text-base sm:text-lg lg:text-xl font-request">{total.toFixed(2)} €</span>
                </div>

                <Link
                  to="/checkout"
                  className="block w-full mt-4 sm:mt-6 py-2.5 sm:py-3 bg-[var(--primary)] text-white text-center rounded-lg hover:bg-[var(--primary-hover)] transition-colors font-medium text-xs sm:text-sm font-qaranta"
                >
                  Passer la commande →
                </Link>

                <p className="text-[var(--text-muted)] text-[10px] sm:text-xs text-center mt-2 sm:mt-3 font-qaranta">
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