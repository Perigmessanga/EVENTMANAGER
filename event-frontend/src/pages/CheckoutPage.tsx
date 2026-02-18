import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Trash2, ShoppingBag } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { PaymentFlow } from '@/components/payment/PaymentFlow';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/stores/cartStore';
import { usePaymentStore } from '@/stores/paymentStore';
import { formatCurrency, formatDateCompact } from '@/lib/format';

type CheckoutStep = 'cart' | 'payment';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<CheckoutStep>('cart');
  
  const { items, total, removeItem, updateQuantity, clearCart } = useCartStore();
  const { resetPayment } = usePaymentStore();

  const handlePaymentSuccess = () => {
    clearCart();
    resetPayment();
    navigate('/payment-success');
  };

  if (items.length === 0 && step === 'cart') {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-muted flex items-center justify-center mb-6">
            <ShoppingBag className="h-10 w-10 text-muted-foreground" />
          </div>
          <h1 className="font-display font-bold text-2xl mb-4">Votre panier est vide</h1>
          <p className="text-muted-foreground mb-6">
            Parcourez nos événements et ajoutez des billets à votre panier.
          </p>
          <Link to="/events">
            <Button size="lg">Voir les événements</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout showFooter={false}>
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => step === 'payment' ? setStep('cart') : navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="font-display font-bold text-2xl">
              {step === 'cart' ? 'Votre panier' : 'Paiement'}
            </h1>
            <p className="text-sm text-muted-foreground">
              {step === 'cart' ? 'Vérifiez votre commande' : 'Finalisez votre achat'}
            </p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center gap-2 mb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
              1
            </div>
            <span className="text-sm font-medium">Panier</span>
          </div>
          <div className="h-px flex-1 bg-border" />
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step === 'payment' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted text-muted-foreground'
            }`}>
              2
            </div>
            <span className={`text-sm ${step === 'payment' ? 'font-medium' : 'text-muted-foreground'}`}>
              Paiement
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {step === 'cart' ? (
              <div className="space-y-4">
                {items.map(item => (
                  <div 
                    key={item.ticketTypeId}
                    className="bg-card rounded-xl border border-border p-4"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold">{item.eventTitle}</h3>
                        <p className="text-sm text-muted-foreground">
                          {item.ticketTypeName} • {formatDateCompact(item.eventDate)}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => removeItem(item.ticketTypeId)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex justify-between items-center mt-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.ticketTypeId, item.quantity - 1)}
                        >
                          -
                        </Button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.ticketTypeId, item.quantity + 1)}
                        >
                          +
                        </Button>
                      </div>
                      <p className="font-bold">
                        {formatCurrency(item.unitPrice * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-card rounded-xl border border-border p-6">
                <PaymentFlow 
                  onSuccess={handlePaymentSuccess}
                  onBack={() => setStep('cart')}
                />
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-card rounded-xl border border-border p-6">
              <h2 className="font-display font-bold text-lg mb-4">Récapitulatif</h2>
              
              <div className="space-y-3 text-sm">
                {items.map(item => (
                  <div key={item.ticketTypeId} className="flex justify-between">
                    <span className="text-muted-foreground">
                      {item.quantity}x {item.ticketTypeName}
                    </span>
                    <span>{formatCurrency(item.unitPrice * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-border my-4 pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total</span>
                  <span className="font-display font-bold text-xl text-primary">
                    {formatCurrency(total)}
                  </span>
                </div>
              </div>

              {step === 'cart' && (
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={() => setStep('payment')}
                >
                  Passer au paiement
                </Button>
              )}

              <p className="text-xs text-center text-muted-foreground mt-4">
                🔒 Paiement sécurisé via Mobile Money
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
