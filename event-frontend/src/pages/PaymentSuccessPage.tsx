import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Download } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';

export default function PaymentSuccessPage() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          {/* Success Icon */}
          <div className="w-24 h-24 mx-auto rounded-full bg-success/10 flex items-center justify-center mb-8 animate-fade-in">
            <CheckCircle2 className="h-12 w-12 text-success" />
          </div>

          <h1 className="font-display font-bold text-3xl mb-4">
            Paiement confirmé !
          </h1>
          
          <p className="text-muted-foreground mb-8">
            Votre paiement a été traité avec succès. Vos billets sont maintenant disponibles dans votre compte.
          </p>

          {/* Order Info */}
          <div className="bg-card rounded-xl border border-border p-6 mb-8 text-left">
            <h3 className="font-semibold mb-4">Détails de la commande</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Numéro de commande</span>
                <span className="font-mono">ORD-{Date.now().toString(36).toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date</span>
                <span>{new Date().toLocaleDateString('fr-CI')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Statut</span>
                <span className="text-success font-medium">Confirmé</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Link to="/my-tickets" className="block">
              <Button className="w-full gap-2" size="lg">
                Voir mes billets
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            
            <Button variant="outline" className="w-full gap-2">
              <Download className="h-4 w-4" />
              Télécharger le reçu
            </Button>

            <Link to="/">
              <Button variant="ghost" className="w-full">
                Retour à l'accueil
              </Button>
            </Link>
          </div>

          {/* Info */}
          <p className="text-xs text-muted-foreground mt-8">
            Un email de confirmation a été envoyé à votre adresse email avec tous les détails de votre commande.
          </p>
        </div>
      </div>
    </Layout>
  );
}
