import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, subtotal, buyerProtection, serviceFee, total, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('form'); // form | success

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
    // Simule un délai de paiement
    await new Promise((r) => setTimeout(r, 1500));
    clearCart();
    setLoading(false);
    setStep('success');
  };

  if (cartItems.length === 0 && step !== 'success') {
    return (
      <div className="min-h-screen bg-[var(--bg-deep)] pt-24 pb-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <p className="text-4xl mb-4">🛒</p>
          <p className="text-[var(--text-muted)] mb-4">Votre panier est vide</p>
          <Link to="/marketplace" className="px-6 py-2.5 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-hover)] transition-colors">
            Retour à la marketplace
          </Link>
        </div>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-[var(--bg-deep)] pt-24 pb-16">
        <div className="max-w-lg mx-auto px-4 text-center">
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-10">
            <div className="text-6xl mb-4">✅</div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Commande confirmée !</h1>
            <p className="text-[var(--text-muted)] mb-2">Merci pour votre achat (simulé)</p>
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 mt-4 mb-6">
              <p className="text-yellow-400 text-sm">⚠️ Mode démonstration — Aucun paiement réel n'a été effectué</p>
            </div>
            <div className="flex gap-3 justify-center">
              <Link to="/marketplace" className="px-5 py-2.5 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-hover)] transition-colors text-sm font-medium">
                Continuer mes achats
              </Link>
              <Link to="/dashboard" className="px-5 py-2.5 border border-[var(--border)] text-[var(--text-secondary)] rounded-lg hover:border-[var(--text-muted)] transition-colors text-sm">
                Mon espace
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-deep)] pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Bannière démo */}
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 mb-6 text-center">
          <p className="text-yellow-400 text-sm font-medium">⚠️ Mode démonstration — Aucun paiement réel ne sera effectué</p>
        </div>

        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-8">Finaliser la commande</h1>

        <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8">
          {/* Formulaire */}
          <div className="flex-1 space-y-6">
            {/* Adresse de livraison */}
            <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6">
              <h3 className="text-[var(--text-primary)] font-bold mb-4">📍 Adresse de livraison</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[var(--text-muted)] text-xs font-medium mb-1.5">Prénom</label>
                  <input
                    type="text" name="firstName" value={form.firstName} onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-[var(--bg-base)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] text-sm focus:border-[var(--primary)] focus:outline-none transition-colors"
                    placeholder="Mathieu"
                  />
                </div>
                <div>
                  <label className="block text-[var(--text-muted)] text-xs font-medium mb-1.5">Nom</label>
                  <input
                    type="text" name="lastName" value={form.lastName} onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-[var(--bg-base)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] text-sm focus:border-[var(--primary)] focus:outline-none transition-colors"
                    placeholder="Fenouil"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-[var(--text-muted)] text-xs font-medium mb-1.5">Adresse</label>
                <input
                  type="text" name="address" value={form.address} onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-[var(--bg-base)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] text-sm focus:border-[var(--primary)] focus:outline-none transition-colors"
                  placeholder="123 rue de la Tech"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-[var(--text-muted)] text-xs font-medium mb-1.5">Code postal</label>
                  <input
                    type="text" name="zipCode" value={form.zipCode} onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-[var(--bg-base)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] text-sm focus:border-[var(--primary)] focus:outline-none transition-colors"
                    placeholder="13800"
                  />
                </div>
                <div>
                  <label className="block text-[var(--text-muted)] text-xs font-medium mb-1.5">Ville</label>
                  <input
                    type="text" name="city" value={form.city} onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-[var(--bg-base)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] text-sm focus:border-[var(--primary)] focus:outline-none transition-colors"
                    placeholder="Istres"
                  />
                </div>
              </div>
            </div>

            {/* Carte bancaire */}
            <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6">
              <h3 className="text-[var(--text-primary)] font-bold mb-4">💳 Paiement</h3>

              {/* Carte visuelle */}
              <div className="bg-gradient-to-br from-slate-700 to-slate-900 rounded-xl p-5 mb-5 max-w-sm">
                <div className="flex justify-between items-start mb-8">
                  <div className="w-10 h-7 bg-yellow-400/80 rounded-md"></div>
                  <span className="text-white/60 text-xs">DEMO</span>
                </div>
                <p className="text-white font-mono text-lg tracking-widest mb-4">{form.cardNumber}</p>
                <div className="flex justify-between text-white/80 text-xs">
                  <span>{form.firstName || 'PRENOM'} {form.lastName || 'NOM'}</span>
                  <span>{form.cardExpiry}</span>
                </div>
              </div>

              <div>
                <label className="block text-[var(--text-muted)] text-xs font-medium mb-1.5">Numéro de carte</label>
                <input
                  type="text" name="cardNumber" value={form.cardNumber} onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-[var(--bg-base)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] text-sm font-mono focus:border-[var(--primary)] focus:outline-none transition-colors"
                  readOnly
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-[var(--text-muted)] text-xs font-medium mb-1.5">Expiration</label>
                  <input
                    type="text" name="cardExpiry" value={form.cardExpiry} onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-[var(--bg-base)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] text-sm font-mono focus:border-[var(--primary)] focus:outline-none transition-colors"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-[var(--text-muted)] text-xs font-medium mb-1.5">CVC</label>
                  <input
                    type="text" name="cardCvc" value={form.cardCvc} onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-[var(--bg-base)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] text-sm font-mono focus:border-[var(--primary)] focus:outline-none transition-colors"
                    readOnly
                  />
                </div>
              </div>
              <p className="text-[var(--text-muted)] text-xs mt-3">🔒 Carte de test pré-remplie — aucune transaction réelle</p>
            </div>
          </div>

          {/* Résumé commande */}
          <div className="lg:w-80 shrink-0">
            <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6 sticky top-24">
              <h3 className="text-[var(--text-primary)] font-bold mb-4">Récapitulatif</h3>

              <div className="space-y-3 mb-4">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex justify-between items-center text-sm">
                    <span className="text-[var(--text-secondary)] truncate mr-2">{item.title}</span>
                    <span className="text-[var(--text-primary)] shrink-0">{item.price} €</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-[var(--border)] pt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Sous-total</span>
                  <span className="text-[var(--text-primary)]">{subtotal.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Protection acheteur</span>
                  <span className="text-[var(--text-primary)]">{buyerProtection.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Frais de service</span>
                  <span className="text-[var(--text-primary)]">{serviceFee.toFixed(2)} €</span>
                </div>
              </div>

              <div className="border-t border-[var(--border)] mt-3 pt-3 flex justify-between items-center">
                <span className="text-[var(--text-primary)] font-bold">Total</span>
                <span className="text-[var(--primary)] font-bold text-xl">{total.toFixed(2)} €</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 py-3 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-hover)] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '⏳ Traitement en cours...' : '🔒 Confirmer la commande'}
              </button>

              <Link to="/cart" className="block text-center text-[var(--text-muted)] text-xs mt-3 hover:text-[var(--text-secondary)] transition-colors">
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