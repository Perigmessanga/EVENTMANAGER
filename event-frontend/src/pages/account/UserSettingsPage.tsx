import { Settings, Bell, Shield, Smartphone, Globe, Trash2 } from 'lucide-react';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function UserSettingsPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="font-display font-bold text-3xl mb-1">Paramètres</h1>
        <p className="text-muted-foreground">
          Personnalisez votre expérience Tikerama.
        </p>
      </div>

      <Tabs defaultValue="notifications" className="animate-fade-in">
        <TabsList className="mb-6">
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="h-4 w-4" />
            Sécurité
          </TabsTrigger>
          <TabsTrigger value="preferences" className="gap-2">
            <Settings className="h-4 w-4" />
            Préférences
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="space-y-6">
          <div className="dashboard-widget">
            <div className="dashboard-widget-header">
              <CardTitle>Notifications par email</CardTitle>
            </div>
            <div className="dashboard-widget-content space-y-4">
              {[
                { title: 'Confirmation d\'achat', description: 'Recevoir un email après chaque achat de billet', default: true },
                { title: 'Rappels d\'événements', description: 'Être rappelé 24h et 2h avant l\'événement', default: true },
                { title: 'Mises à jour d\'événements', description: 'Changements d\'horaire, lieu, annulations', default: true },
                { title: 'Newsletter', description: 'Actualités, nouveaux événements et promotions', default: false },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  <Switch defaultChecked={item.default} />
                </div>
              ))}
            </div>
          </div>

          <div className="dashboard-widget">
            <div className="dashboard-widget-header">
              <div className="flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-muted-foreground" />
                <CardTitle>Notifications push</CardTitle>
              </div>
            </div>
            <div className="dashboard-widget-content space-y-4">
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium">Activer les notifications push</p>
                  <p className="text-sm text-muted-foreground">Recevoir des notifications sur cet appareil</p>
                </div>
                <Switch />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <div className="dashboard-widget">
            <div className="dashboard-widget-header">
              <CardTitle>Mot de passe</CardTitle>
            </div>
            <div className="dashboard-widget-content space-y-4">
              <div>
                <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                <Input id="currentPassword" type="password" className="mt-2" />
              </div>
              <div>
                <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                <Input id="newPassword" type="password" className="mt-2" />
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</Label>
                <Input id="confirmPassword" type="password" className="mt-2" />
              </div>
              <div className="flex justify-end pt-4">
                <Button>Modifier le mot de passe</Button>
              </div>
            </div>
          </div>

          <div className="dashboard-widget">
            <div className="dashboard-widget-header">
              <CardTitle>Sessions actives</CardTitle>
            </div>
            <div className="dashboard-widget-content space-y-4">
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                    <Smartphone className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">Cet appareil</p>
                    <p className="text-sm text-muted-foreground">Chrome sur macOS • Abidjan, CI</p>
                  </div>
                </div>
                <span className="text-xs text-success font-medium">Actif maintenant</span>
              </div>
            </div>
          </div>

          <div className="dashboard-widget border-destructive/20">
            <div className="dashboard-widget-header">
              <CardTitle className="text-destructive">Zone dangereuse</CardTitle>
            </div>
            <div className="dashboard-widget-content">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Supprimer mon compte</p>
                  <p className="text-sm text-muted-foreground">Cette action est irréversible</p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" className="gap-2">
                      <Trash2 className="h-4 w-4" />
                      Supprimer
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Cette action est irréversible. Toutes vos données, billets et historique seront définitivement supprimés.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        Supprimer mon compte
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <div className="dashboard-widget">
            <div className="dashboard-widget-header">
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-muted-foreground" />
                <CardTitle>Langue et région</CardTitle>
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
                  <Label htmlFor="region">Région</Label>
                  <Select defaultValue="ci">
                    <SelectTrigger id="region" className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ci">Côte d'Ivoire</SelectItem>
                      <SelectItem value="sn">Sénégal</SelectItem>
                      <SelectItem value="ml">Mali</SelectItem>
                      <SelectItem value="bf">Burkina Faso</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          <div className="dashboard-widget">
            <div className="dashboard-widget-header">
              <CardTitle>Apparence</CardTitle>
            </div>
            <div className="dashboard-widget-content space-y-4">
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium">Mode sombre</p>
                  <p className="text-sm text-muted-foreground">Basculer entre thème clair et sombre</p>
                </div>
                <Switch />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
