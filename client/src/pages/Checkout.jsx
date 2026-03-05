import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Checkout = () => {
  const { cartItems, subtotal, buyerProtection, serviceFee, total, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('form');

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    address: '',
    zipCode: '',
    city: '',
    cardNumber: '4242 4242 4242 4242',
    cardExpiry: '12/28',
    cardCvc: '123',
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.address || !form.zipCode || !form.city) {
      alert('Veuillez remplir tous les champs');
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    clearCart();
    setLoading(false);
    setStep('success');
  };

  if (cartItems.length === 0 && step !== 'success') {
    return (
      <div className="min-h-screen bg-[var(--bg-deep)] pt-10 sm:pt-24 pb-10 sm:pb-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <p className="text-3xl sm:text-4xl mb-3 sm:mb-4">🛒</p>
          <p className="text-[var(--text-muted)] mb-4 text-sm sm:text-base font-qaranta">Votre panier est vide</p>
          <Link to="/marketplace" className="px-5 py-2 sm:px-6 sm:py-2.5 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-hover)] transition-colors text-xs sm:text-sm font-qaranta">
            Retour à la marketplace
          </Link>
        </div>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-[var(--bg-deep)] pt-10 sm:pt-24 pb-10 sm:pb-16">
        <div className="max-w-lg mx-auto px-4 text-center">
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6 sm:p-10">
            <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">✅</div>
            <h1 className="text-lg sm:text-2xl font-bold text-[var(--text-primary)] mb-1.5 sm:mb-2 font-request">Commande confirmée !</h1>
            <p className="text-[var(--text-muted)] mb-2 text-xs sm:text-sm font-qaranta">Merci pour votre achat (simulé)</p>
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-2.5 sm:p-3 mt-3 sm:mt-4 mb-4 sm:mb-6">
              <p className="text-yellow-400 text-[10px] sm:text-sm font-qaranta">⚠️ Mode démonstration — Aucun paiement réel n'a été effectué</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
              <Link to="/marketplace" className="px-4 sm:px-5 py-2 sm:py-2.5 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-hover)] transition-colors text-xs sm:text-sm font-medium font-qaranta">
                Continuer mes achats
              </Link>
              <Link to="/dashboard" className="px-4 sm:px-5 py-2 sm:py-2.5 border border-[var(--border)] text-[var(--text-secondary)] rounded-lg hover:border-[var(--text-muted)] transition-colors text-xs sm:text-sm font-qaranta">
                Mon espace
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-deep)] pt-6 sm:pt-12 lg:pt-24 pb-10 sm:pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Bannière démo */}
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-2.5 sm:p-3 mb-4 sm:mb-6 text-center">
          <p className="text-yellow-400 text-[10px] sm:text-sm font-medium font-qaranta">⚠️ Mode démonstration — Aucun paiement réel ne sera effectué</p>
        </div>

        <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-[var(--text-primary)] mb-5 sm:mb-8 font-request">Finaliser la commande</h1>

        <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-5 sm:gap-6 lg:gap-8">
          {/* Formulaire */}
          <div className="flex-1 space-y-4 sm:space-y-6">
            {/* Adresse de livraison */}
            <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4 sm:p-5 lg:p-6">
              <h3 className="text-[var(--text-primary)] font-bold mb-3 sm:mb-4 text-sm sm:text-base font-request">📍 Adresse de livraison</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-[var(--text-muted)] text-[10px] sm:text-xs font-medium mb-1 sm:mb-1.5 font-qaranta">Prénom</label>
                  <input
                    type="text" name="firstName" value={form.firstName} onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-[var(--bg-base)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] text-xs sm:text-sm font-qaranta focus:border-[var(--primary)] focus:outline-none transition-colors"
                    placeholder="Mathieu"
                  />
                </div>
                <div>
                  <label className="block text-[var(--text-muted)] text-[10px] sm:text-xs font-medium mb-1 sm:mb-1.5 font-qaranta">Nom</label>
                  <input
                    type="text" name="lastName" value={form.lastName} onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-[var(--bg-base)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] text-xs sm:text-sm font-qaranta focus:border-[var(--primary)] focus:outline-none transition-colors"
                    placeholder="Fenouil"
                  />
                </div>
              </div>
              <div className="mt-3 sm:mt-4">
                <label className="block text-[var(--text-muted)] text-[10px] sm:text-xs font-medium mb-1 sm:mb-1.5 font-qaranta">Adresse</label>
                <input
                  type="text" name="address" value={form.address} onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-[var(--bg-base)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] text-xs sm:text-sm font-qaranta focus:border-[var(--primary)] focus:outline-none transition-colors"
                  placeholder="123 rue de la Tech"
                />
              </div>
              <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-3 sm:mt-4">
                <div>
                  <label className="block text-[var(--text-muted)] text-[10px] sm:text-xs font-medium mb-1 sm:mb-1.5 font-qaranta">Code postal</label>
                  <input
                    type="text" name="zipCode" value={form.zipCode} onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-[var(--bg-base)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] text-xs sm:text-sm font-qaranta focus:border-[var(--primary)] focus:outline-none transition-colors"
                    placeholder="13800"
                  />
                </div>
                <div>
                  <label className="block text-[var(--text-muted)] text-[10px] sm:text-xs font-medium mb-1 sm:mb-1.5 font-qaranta">Ville</label>
                  <input
                    type="text" name="city" value={form.city} onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-[var(--bg-base)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] text-xs sm:text-sm font-qaranta focus:border-[var(--primary)] focus:outline-none transition-colors"
                    placeholder="Istres"
                  />
                </div>
              </div>
            </div>

            {/* Carte bancaire */}
            <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4 sm:p-5 lg:p-6">
              <h3 className="text-[var(--text-primary)] font-bold mb-3 sm:mb-4 text-sm sm:text-base font-request">💳 Paiement</h3>

              {/* Carte visuelle */}
              <div className="bg-gradient-to-br from-slate-700 to-slate-900 rounded-xl p-4 sm:p-5 mb-4 sm:mb-5 max-w-sm">
                <div className="flex justify-between items-start mb-5 sm:mb-8">
                  <div className="w-8 h-5 sm:w-10 sm:h-7 bg-yellow-400/80 rounded-md"></div>
                  <span className="text-white/60 text-[10px] sm:text-xs font-qaranta">DEMO</span>
                </div>
                <p className="text-white font-mono text-sm sm:text-lg tracking-widest mb-3 sm:mb-4">{form.cardNumber}</p>
                <div className="flex justify-between text-white/80 text-[10px] sm:text-xs font-qaranta">
                  <span>{form.firstName || 'PRENOM'} {form.lastName || 'NOM'}</span>
                  <span>{form.cardExpiry}</span>
                </div>
              </div>

              <div>
                <label className="block text-[var(--text-muted)] text-[10px] sm:text-xs font-medium mb-1 sm:mb-1.5 font-qaranta">Numéro de carte</label>
                <input
                  type="text" name="cardNumber" value={form.cardNumber} onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-[var(--bg-base)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] text-xs sm:text-sm font-mono focus:border-[var(--primary)] focus:outline-none transition-colors"
                  readOnly
                />
              </div>
              <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-3 sm:mt-4">
                <div>
                  <label className="block text-[var(--text-muted)] text-[10px] sm:text-xs font-medium mb-1 sm:mb-1.5 font-qaranta">Expiration</label>
                  <input
                    type="text" name="cardExpiry" value={form.cardExpiry} onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-[var(--bg-base)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] text-xs sm:text-sm font-mono focus:border-[var(--primary)] focus:outline-none transition-colors"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-[var(--text-muted)] text-[10px] sm:text-xs font-medium mb-1 sm:mb-1.5 font-qaranta">CVC</label>
                  <input
                    type="text" name="cardCvc" value={form.cardCvc} onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-[var(--bg-base)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] text-xs sm:text-sm font-mono focus:border-[var(--primary)] focus:outline-none transition-colors"
                    readOnly
                  />
                </div>
              </div>
              <p className="text-[var(--text-muted)] text-[10px] sm:text-xs mt-2.5 sm:mt-3 font-qaranta">🔒 Carte de test pré-remplie — aucune transaction réelle</p>
            </div>
          </div>

          {/* Résumé commande */}
          <div className="lg:w-80 shrink-0">
            <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4 sm:p-5 lg:p-6 sticky top-20 lg:top-24">
              <h3 className="text-[var(--text-primary)] font-bold mb-3 sm:mb-4 text-sm sm:text-base font-request">Récapitulatif</h3>

              <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex justify-between items-center text-xs sm:text-sm">
                    <span className="text-[var(--text-secondary)] truncate mr-2 font-qaranta">{item.title}</span>
                    <span className="text-[var(--text-primary)] shrink-0 font-qaranta">{item.price} €</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-[var(--border)] pt-2.5 sm:pt-3 space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)] font-qaranta">Sous-total</span>
                  <span className="text-[var(--text-primary)] font-qaranta">{subtotal.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)] font-qaranta">Protection acheteur</span>
                  <span className="text-[var(--text-primary)] font-qaranta">{buyerProtection.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)] font-qaranta">Frais de service</span>
                  <span className="text-[var(--text-primary)] font-qaranta">{serviceFee.toFixed(2)} €</span>
                </div>
              </div>

              <div className="border-t border-[var(--border)] mt-2.5 sm:mt-3 pt-2.5 sm:pt-3 flex justify-between items-center">
                <span className="text-[var(--text-primary)] font-bold text-sm sm:text-base font-request">Total</span>
                <span className="text-[var(--primary)] font-bold text-base sm:text-lg lg:text-xl font-request">{total.toFixed(2)} €</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 sm:mt-6 py-2.5 sm:py-3 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-hover)] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm font-qaranta cursor-pointer"
              >
                {loading ? '⏳ Traitement en cours...' : '🔒 Confirmer la commande'}
              </button>

              <Link to="/cart" className="block text-center text-[var(--text-muted)] text-[10px] sm:text-xs mt-2.5 sm:mt-3 hover:text-[var(--text-secondary)] transition-colors font-qaranta">
                ← Retour au panier
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;