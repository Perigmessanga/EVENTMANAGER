import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Plus,
  Edit,
  Trash2,
  MoreHorizontal,
  Tags,
  DollarSign
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { formatCurrency } from '@/lib/format';
import { cn } from '@/lib/utils';

interface TicketType {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  events: number;
  totalSold: number;
  isActive: boolean;
}

const mockTicketTypes: TicketType[] = [
  { id: '1', name: 'VIP', description: 'Accès privilégié avec avantages exclusifs', basePrice: 25000, events: 8, totalSold: 245, isActive: true },
  { id: '2', name: 'Gold', description: 'Places premium avec vue optimale', basePrice: 20000, events: 6, totalSold: 189, isActive: true },
  { id: '3', name: 'Standard', description: 'Entrée générale', basePrice: 10000, events: 12, totalSold: 856, isActive: true },
  { id: '4', name: 'Tribune', description: 'Places en tribune pour événements sportifs', basePrice: 15000, events: 4, totalSold: 324, isActive: true },
  { id: '5', name: 'Étudiant', description: 'Tarif réduit sur présentation de carte', basePrice: 5000, events: 5, totalSold: 128, isActive: true },
  { id: '6', name: 'Early Bird', description: 'Prévente à tarif réduit', basePrice: 8000, events: 3, totalSold: 95, isActive: false },
];

export default function AdminTicketTypesPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const filteredTypes = mockTicketTypes.filter(type =>
    type.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    type.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 animate-fade-in">
        <div>
          <h1 className="font-display font-bold text-3xl mb-1">Types de billets</h1>
          <p className="text-muted-foreground">
            Gérez les catégories de billets disponibles pour vos événements.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 shadow-glow">
              <Plus className="h-4 w-4" />
              Nouveau type
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer un type de billet</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <Label htmlFor="typeName">Nom du type *</Label>
                <Input id="typeName" placeholder="Ex: VIP, Standard, Early Bird" className="mt-2" />
              </div>
              <div>
                <Label htmlFor="typeDesc">Description</Label>
                <Input id="typeDesc" placeholder="Description courte" className="mt-2" />
              </div>
              <div>
                <Label htmlFor="basePrice">Prix de base (FCFA)</Label>
                <Input id="basePrice" type="number" placeholder="0" className="mt-2" />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={() => setIsDialogOpen(false)}>
                  Créer
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="dashboard-widget animate-fade-in">
        <div className="dashboard-widget-content">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un type de billet..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in">
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-sm text-muted-foreground">Types actifs</p>
          <p className="text-2xl font-bold">{mockTicketTypes.filter(t => t.isActive).length}</p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-sm text-muted-foreground">Total vendus</p>
          <p className="text-2xl font-bold text-success">{mockTicketTypes.reduce((sum, t) => sum + t.totalSold, 0).toLocaleString()}</p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-sm text-muted-foreground">Prix moyen</p>
          <p className="text-2xl font-bold">{formatCurrency(Math.round(mockTicketTypes.reduce((sum, t) => sum + t.basePrice, 0) / mockTicketTypes.length))}</p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-sm text-muted-foreground">Utilisés</p>
          <p className="text-2xl font-bold">{mockTicketTypes.reduce((sum, t) => sum + t.events, 0)} événements</p>
        </div>
      </div>

      {/* Ticket Types Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-40 bg-muted/50 rounded-xl animate-pulse" />
          ))
        ) : filteredTypes.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Tags className="h-10 w-10 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-muted-foreground">Aucun type de billet trouvé</p>
          </div>
        ) : (
          filteredTypes.map((type) => (
            <div 
              key={type.id} 
              className={cn(
                'dashboard-widget group hover:border-primary/30 transition-colors',
                !type.isActive && 'opacity-60'
              )}
            >
              <div className="dashboard-widget-content">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Tags className="h-6 w-6 text-primary" />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive focus:text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-lg">{type.name}</h3>
                  {!type.isActive && (
                    <Badge variant="secondary" className="text-xs">Inactif</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{type.description}</p>
                
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-1 text-sm">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold">{formatCurrency(type.basePrice)}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {type.totalSold} vendus • {type.events} événements
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
