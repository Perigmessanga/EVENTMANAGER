import { Settings, Bell, Shield, CreditCard, Globe, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="font-display font-bold text-3xl mb-1">Paramètres</h1>
        <p className="text-muted-foreground">
          Configurez les paramètres de votre espace administrateur.
        </p>
      </div>

      <Tabs defaultValue="general" className="animate-fade-in">
        <TabsList className="mb-6">
          <TabsTrigger value="general" className="gap-2">
            <Settings className="h-4 w-4" />
            Général
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="payments" className="gap-2">
            <CreditCard className="h-4 w-4" />
            Paiements
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="h-4 w-4" />
            Sécurité
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          {/* Organization Info */}
          <div className="dashboard-widget">
            <div className="dashboard-widget-header">
              <CardTitle>Informations de l'organisation</CardTitle>
            </div>
            <div className="dashboard-widget-content space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="orgName">Nom de l'organisation</Label>
                  <Input id="orgName" defaultValue="Tikerama Events" className="mt-2" />
                </div>
                <div>
                  <Label htmlFor="orgEmail">Email de contact</Label>
                  <Input id="orgEmail" type="email" defaultValue="contact@tikerama.ci" className="mt-2" />
                </div>
                <div>
                  <Label htmlFor="orgPhone">Téléphone</Label>
                  <Input id="orgPhone" defaultValue="+225 07 00 00 00 00" className="mt-2" />
                </div>
                <div>
                  <Label htmlFor="orgCity">Ville</Label>
                  <Select defaultValue="abidjan">
                    <SelectTrigger id="orgCity" className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="abidjan">Abidjan</SelectItem>
                      <SelectItem value="bouake">Bouaké</SelectItem>
                      <SelectItem value="yamoussoukro">Yamoussoukro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <Button>Enregistrer</Button>
              </div>
            </div>
          </div>

          {/* Localization */}
          <div className="dashboard-widget">
            <div className="dashboard-widget-header">
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-muted-foreground" />
                <CardTitle>Localisation</CardTitle>
              </div>
            </div>
            <div className="dashboard-widget-content space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="language">Langue</Label>
                  <Select defaultValue="fr">
                    <SelectTrigger id="language" className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="currency">Devise</Label>
                  <Select defaultValue="xof">
                    <SelectTrigger id="currency" className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="xof">FCFA (XOF)</SelectItem>
                      <SelectItem value="eur">Euro (EUR)</SelectItem>
                      <SelectItem value="usd">Dollar (USD)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="timezone">Fuseau horaire</Label>
                  <Select defaultValue="gmt">
                    <SelectTrigger id="timezone" className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gmt">GMT (Abidjan)</SelectItem>
                      <SelectItem value="cet">CET (Paris)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Appearance */}
          <div className="dashboard-widget">
            <div className="dashboard-widget-header">
              <div className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-muted-foreground" />
                <CardTitle>Apparence</CardTitle>
              </div>
            </div>
            <div className="dashboard-widget-content space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Mode sombre</p>
                  <p className="text-sm text-muted-foreground">Activer le thème sombre</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Barre latérale compacte</p>
                  <p className="text-sm text-muted-foreground">Réduire la largeur du menu</p>
                </div>
                <Switch />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <div className="dashboard-widget">
            <div className="dashboard-widget-header">
              <CardTitle>Notifications par email</CardTitle>
            </div>
            <div className="dashboard-widget-content space-y-4">
              {[
                { title: 'Nouvelle vente', description: 'Recevoir un email à chaque vente de billet' },
                { title: 'Rapport quotidien', description: 'Recevoir un résumé quotidien des ventes' },
                { title: 'Rapport hebdomadaire', description: 'Recevoir un rapport de performance hebdomadaire' },
                { title: 'Alertes de stock', description: 'Être notifié quand les billets sont presque épuisés' },
                { title: 'Remboursements', description: 'Être notifié des demandes de remboursement' },
              ].map((item) => (
                <div key={item.title} className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  <Switch defaultChecked={item.title.includes('vente') || item.title.includes('Remboursements')} />
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          <div className="dashboard-widget">
            <div className="dashboard-widget-header">
              <CardTitle>Méthodes de paiement</CardTitle>
            </div>
            <div className="dashboard-widget-content space-y-4">
              {[
                { name: 'Orange Money', enabled: true, color: 'hsl(25, 95%, 53%)' },
                { name: 'MTN Mobile Money', enabled: true, color: 'hsl(48, 100%, 50%)' },
                { name: 'Wave', enabled: true, color: 'hsl(199, 89%, 48%)' },
              ].map((method) => (
                <div key={method.name} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: method.color + '20' }}>
                      <CreditCard className="h-5 w-5" style={{ color: method.color }} />
                    </div>
                    <span className="font-medium">{method.name}</span>
                  </div>
                  <Switch defaultChecked={method.enabled} />
                </div>
              ))}
            </div>
          </div>

          <div className="dashboard-widget">
            <div className="dashboard-widget-header">
              <CardTitle>Configuration des frais</CardTitle>
            </div>
            <div className="dashboard-widget-content space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="serviceFee">Frais de service (%)</Label>
                  <Input id="serviceFee" type="number" defaultValue="2.5" className="mt-2" />
                </div>
                <div>
                  <Label htmlFor="minFee">Frais minimum (FCFA)</Label>
                  <Input id="minFee" type="number" defaultValue="100" className="mt-2" />
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <Button>Enregistrer</Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <div className="dashboard-widget">
            <div className="dashboard-widget-header">
              <CardTitle>Sécurité du compte</CardTitle>
            </div>
            <div className="dashboard-widget-content space-y-4">
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium">Authentification à deux facteurs</p>
                  <p className="text-sm text-muted-foreground">Ajouter une couche de sécurité supplémentaire</p>
                </div>
                <Button variant="outline" size="sm">Configurer</Button>
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium">Sessions actives</p>
                  <p className="text-sm text-muted-foreground">Gérer les appareils connectés</p>
                </div>
                <Button variant="outline" size="sm">Voir</Button>
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium">Mot de passe</p>
                  <p className="text-sm text-muted-foreground">Dernière modification il y a 30 jours</p>
                </div>
                <Button variant="outline" size="sm">Modifier</Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
