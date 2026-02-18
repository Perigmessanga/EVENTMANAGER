import { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Camera,
  Save
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/stores/authStore';
import { toast } from 'sonner';

export default function UserProfilePage() {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success('Profil mis à jour avec succès');
    setIsLoading(false);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="font-display font-bold text-3xl mb-1">Mon Profil</h1>
        <p className="text-muted-foreground">
          Gérez vos informations personnelles.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Avatar */}
        <div className="dashboard-widget animate-fade-in">
          <div className="dashboard-widget-content">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center">
                  <span className="text-primary-foreground text-3xl font-bold">
                    {user?.firstName?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
                <button 
                  type="button"
                  className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center hover:bg-muted transition-colors"
                >
                  <Camera className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
              <div>
                <h2 className="font-semibold text-lg">{user?.firstName} {user?.lastName}</h2>
                <p className="text-muted-foreground">{user?.email}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Membre depuis {new Date(user?.createdAt || '').toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Info */}
        <div className="dashboard-widget animate-fade-in">
          <div className="dashboard-widget-header">
            <CardTitle>Informations personnelles</CardTitle>
          </div>
          <div className="dashboard-widget-content space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">Prénom</Label>
                <div className="relative mt-2">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="firstName" 
                    defaultValue={user?.firstName}
                    className="pl-9"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="lastName">Nom</Label>
                <div className="relative mt-2">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="lastName" 
                    defaultValue={user?.lastName}
                    className="pl-9"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="dashboard-widget animate-fade-in">
          <div className="dashboard-widget-header">
            <CardTitle>Coordonnées</CardTitle>
          </div>
          <div className="dashboard-widget-content space-y-4">
            <div>
              <Label htmlFor="email">Adresse email</Label>
              <div className="relative mt-2">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="email" 
                  type="email"
                  defaultValue={user?.email}
                  className="pl-9"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="phone">Numéro de téléphone</Label>
              <div className="relative mt-2">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="phone" 
                  type="tel"
                  defaultValue={user?.phone}
                  className="pl-9"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="city">Ville</Label>
              <div className="relative mt-2">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="city" 
                  defaultValue="Abidjan"
                  className="pl-9"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading} className="gap-2">
            {isLoading ? (
              <span className="loading-spinner" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Enregistrer
          </Button>
        </div>
      </form>
    </div>
  );
}
