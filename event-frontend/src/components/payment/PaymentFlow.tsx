import { useState } from 'react';
import { Phone, Loader2, AlertCircle, CheckCircle2, Clock, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { usePaymentStore } from '@/stores/paymentStore';
import { useCartStore } from '@/stores/cartStore';
import { formatCurrency, formatPhoneNumber, isValidPhoneNumber } from '@/lib/format';
import { MOMO_PROVIDERS } from '@/config/api';
import type { PaymentProvider } from '@/types';
import { cn } from '@/lib/utils';

interface PaymentFlowProps {
  onSuccess?: () => void;
  onBack?: () => void;
}

export function PaymentFlow({ onSuccess, onBack }: PaymentFlowProps) {
  const { total, currency } = useCartStore();
  const {
    status,
    error,
    initiatePayment,
    checkPaymentStatus,
    resetPayment,
    transactionId,
    reference,
  } = usePaymentStore();

  const [selectedProvider, setSelectedProvider] = useState<PaymentProvider | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState<string | null>(null);

  const handleProviderSelect = (provider: PaymentProvider) => {
    setSelectedProvider(provider);
    setPhoneError(null);
  };

  const handlePhoneChange = (value: string) => {
    setPhoneNumber(value);
    if (phoneError) setPhoneError(null);
  };

  const handleSubmit = async () => {
    if (!selectedProvider) return;
    
    if (!isValidPhoneNumber(phoneNumber)) {
      setPhoneError('Numéro de téléphone invalide');
      return;
    }

    await initiatePayment(selectedProvider, phoneNumber, total);
  };

  const handleCheckStatus = async () => {
    const newStatus = await checkPaymentStatus();
    if (newStatus === 'success' && onSuccess) {
      onSuccess();
    }
  };

  const handleReset = () => {
    resetPayment();
    setSelectedProvider(null);
    setPhoneNumber('');
    setPhoneError(null);
  };

  // Render based on payment status
  if (status === 'pending' || status === 'processing') {
    return (
      <PaymentPending
        provider={selectedProvider!}
        phoneNumber={phoneNumber}
        amount={total}
        transactionId={transactionId}
        reference={reference}
        isProcessing={status === 'processing'}
        onCheckStatus={handleCheckStatus}
        onCancel={handleReset}
      />
    );
  }

  if (status === 'success') {
    return <PaymentSuccess onContinue={onSuccess} />;
  }

  if (status === 'failed') {
    return (
      <PaymentFailed
        error={error}
        onRetry={handleReset}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        {onBack && (
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <div>
          <h2 className="font-display font-bold text-xl">Paiement Mobile Money</h2>
          <p className="text-muted-foreground">
            Montant à payer: <span className="font-bold text-foreground">{formatCurrency(total)}</span>
          </p>
        </div>
      </div>

      {/* Provider Selection */}
      <div className="space-y-3">
        <Label>Choisissez votre opérateur</Label>
        <div className="grid grid-cols-3 gap-3">
          {(Object.entries(MOMO_PROVIDERS) as [PaymentProvider, typeof MOMO_PROVIDERS.orange_money][]).map(
            ([id, provider]) => (
              <button
                key={id}
                onClick={() => handleProviderSelect(id)}
                className={cn(
                  'p-4 rounded-xl border-2 transition-all text-center',
                  selectedProvider === id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                )}
              >
                <div
                  className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: provider.color }}
                >
                  {provider.name.charAt(0)}
                </div>
                <span className="text-sm font-medium">{provider.name}</span>
              </button>
            )
          )}
        </div>
      </div>

      {/* Phone Number Input */}
      {selectedProvider && (
        <div className="space-y-3 animate-fade-in">
          <Label htmlFor="phone">Numéro de téléphone</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              id="phone"
              type="tel"
              placeholder="07 XX XX XX XX"
              value={phoneNumber}
              onChange={(e) => handlePhoneChange(e.target.value)}
              className={cn(
                'pl-10 text-lg',
                phoneError && 'border-destructive focus-visible:ring-destructive'
              )}
            />
          </div>
          {phoneError && (
            <p className="text-sm text-destructive flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {phoneError}
            </p>
          )}
          <p className="text-sm text-muted-foreground">
            Vous recevrez une notification pour confirmer le paiement
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-destructive/10 text-destructive rounded-lg p-3 flex items-start gap-2">
          <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Submit Button */}
      <Button
        className="w-full"
        size="lg"
        disabled={!selectedProvider || !phoneNumber || status === 'initiating'}
        onClick={handleSubmit}
      >
        {status === 'initiating' ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
            Initiation en cours...
          </>
        ) : (
          `Payer ${formatCurrency(total)}`
        )}
      </Button>

      {/* Security Note */}
      <p className="text-xs text-center text-muted-foreground">
        🔒 Paiement sécurisé. Vos données sont protégées.
      </p>
    </div>
  );
}

// Pending Payment Component
interface PaymentPendingProps {
  provider: PaymentProvider;
  phoneNumber: string;
  amount: number;
  transactionId: string | null;
  reference: string | null;
  isProcessing: boolean;
  onCheckStatus: () => void;
  onCancel: () => void;
}

function PaymentPending({
  provider,
  phoneNumber,
  amount,
  transactionId,
  reference,
  isProcessing,
  onCheckStatus,
  onCancel,
}: PaymentPendingProps) {
  const providerInfo = MOMO_PROVIDERS[provider];

  return (
    <div className="text-center space-y-6 py-8">
      {/* Animated Icon */}
      <div className="relative w-24 h-24 mx-auto">
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center animate-pulse-slow"
          style={{ backgroundColor: providerInfo.color }}
        >
          <Phone className="h-10 w-10 text-white" />
        </div>
        <div className="absolute -bottom-1 -right-1 bg-pending text-pending-foreground rounded-full p-2">
          <Clock className="h-4 w-4" />
        </div>
      </div>

      {/* Instructions */}
      <div className="space-y-2">
        <h2 className="font-display font-bold text-xl">En attente de confirmation</h2>
        <p className="text-muted-foreground">
          Une demande de paiement a été envoyée au{' '}
          <span className="font-semibold text-foreground">{formatPhoneNumber(phoneNumber)}</span>
        </p>
      </div>

      {/* Steps */}
      <div className="bg-muted rounded-xl p-4 text-left space-y-3">
        <p className="font-semibold">Pour finaliser votre paiement :</p>
        <ol className="space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">1</span>
            <span>Ouvrez la notification {providerInfo.name} sur votre téléphone</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">2</span>
            <span>Vérifiez le montant: <strong>{formatCurrency(amount)}</strong></span>
          </li>
          <li className="flex items-start gap-2">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">3</span>
            <span>Entrez votre code PIN pour confirmer</span>
          </li>
        </ol>
      </div>

      {/* Transaction Info */}
      {(transactionId || reference) && (
        <div className="text-xs text-muted-foreground space-y-1">
          {reference && <p>Référence: {reference}</p>}
          {transactionId && <p>Transaction: {transactionId}</p>}
        </div>
      )}

      {/* Actions */}
      <div className="space-y-3">
        <Button
          className="w-full"
          size="lg"
          onClick={onCheckStatus}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              Vérification en cours...
            </>
          ) : (
            "J'ai confirmé le paiement"
          )}
        </Button>
        
        <Button variant="ghost" onClick={onCancel} disabled={isProcessing}>
          Annuler
        </Button>
      </div>
    </div>
  );
}

// Success Component
function PaymentSuccess({ onContinue }: { onContinue?: () => void }) {
  return (
    <div className="text-center space-y-6 py-8">
      <div className="w-20 h-20 mx-auto rounded-full bg-success/10 flex items-center justify-center">
        <CheckCircle2 className="h-10 w-10 text-success" />
      </div>
      
      <div className="space-y-2">
        <h2 className="font-display font-bold text-2xl">Paiement réussi!</h2>
        <p className="text-muted-foreground">
          Votre paiement a été confirmé. Vos billets sont prêts!
        </p>
      </div>

      {onContinue && (
        <Button className="w-full" size="lg" onClick={onContinue}>
          Voir mes billets
        </Button>
      )}
    </div>
  );
}

// Failed Component
function PaymentFailed({ error, onRetry }: { error: string | null; onRetry: () => void }) {
  return (
    <div className="text-center space-y-6 py-8">
      <div className="w-20 h-20 mx-auto rounded-full bg-destructive/10 flex items-center justify-center">
        <AlertCircle className="h-10 w-10 text-destructive" />
      </div>
      
      <div className="space-y-2">
        <h2 className="font-display font-bold text-2xl">Paiement échoué</h2>
        <p className="text-muted-foreground">
          {error || 'Une erreur est survenue lors du paiement.'}
        </p>
      </div>

      <Button className="w-full" size="lg" onClick={onRetry}>
        Réessayer
      </Button>
    </div>
  );
}
