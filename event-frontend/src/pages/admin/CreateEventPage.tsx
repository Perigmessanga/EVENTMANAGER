import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft,
  Upload,
  Calendar,
  Clock,
  MapPin,
  Save,
  Eye,
  Plus,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useEventAPI } from '@/hooks/useEventAPI';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function CreateEventPage() {
  const navigate = useNavigate();
  const { create, isLoading } = useEventAPI();
  const { toast } = useToast();

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    start_date: '',
    start_time: '00:00',
    end_date: '',
    end_time: '00:00',
    capacity: '100',
    ticket_price: '',
    status: 'draft',
  });

  const [ticketTypes, setTicketTypes] = useState<any[]>([
    { name: 'Standard', price: '', quantity_total: '100', description: 'Entrée standard' }
  ]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTicketTypeChange = (index: number, field: string, value: string) => {
    const updated = [...ticketTypes];
    updated[index] = { ...updated[index], [field]: value };
    setTicketTypes(updated);
  };

  const addTicketType = () => {
    setTicketTypes([...ticketTypes, { name: '', price: '', quantity_total: '100', description: '' }]);
  };

  const removeTicketType = (index: number) => {
    if (ticketTypes.length > 1) {
      setTicketTypes(ticketTypes.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLoading) return;

    try {
      // Validation basique
      if (!formData.start_date || !formData.start_time) {
        toast({
          title: 'Données manquantes',
          description: "La date et l'heure de début sont obligatoires.",
          variant: 'destructive',
        });
        return;
      }

      const startDateTime = new Date(`${formData.start_date}T${formData.start_time}`).toISOString();
      const endDateTime = formData.end_date && formData.end_time 
        ? new Date(`${formData.end_date}T${formData.end_time}`).toISOString()
        : startDateTime;

      const eventData = {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        start_date: startDateTime,
        end_date: endDateTime,
        capacity: parseInt(formData.capacity) || 0,
        ticket_price: parseFloat(formData.ticket_price) || 0,
        status: formData.status as 'draft' | 'published' | 'cancelled' | 'completed',
        ticketTypes: ticketTypes.map(t => ({
          name: t.name || 'Billet',
          price: parseFloat(t.price) || 0,
          quantity_total: parseInt(t.quantity_total) || 0,
          description: t.description || ''
        })),
        ...(imageFile && { image: imageFile }),
      };

      const result = await create(eventData);

      if (result) {
        // Petit délai pour laisser le toast apparaître avant navigation
        setTimeout(() => {
          navigate('/admin/events');
        }, 500);
      }
    } catch (error) {
      console.error('[ERROR] Échec création événement:', error);
      toast({
        title: 'Erreur système',
        description: "Une erreur inattendue est survenue lors de la création.",
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 animate-fade-in">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate('/admin/events')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="font-display font-bold text-3xl">Créer un événement</h1>
          <p className="text-muted-foreground">
            Remplissez les informations de votre événement
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="dashboard-widget"
        >
          <div className="dashboard-widget-header">
            <CardTitle>Informations générales</CardTitle>
          </div>
          <div className="dashboard-widget-content space-y-6">
            {/* Image Upload */}
            <div>
              <Label>Image de couverture</Label>
              <label className="mt-2 border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer group flex flex-col items-center">
                {imagePreview ? (
                  <>
                    <img src={imagePreview} alt="Preview" className="w-full h-40 object-cover rounded-lg mb-4" />
                    <p className="text-sm text-muted-foreground">Cliquez pour changer l'image</p>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 rounded-xl bg-muted/50 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/10 transition-colors">
                      <Upload className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <p className="font-medium mb-1">Cliquez pour télécharger</p>
                    <p className="text-sm text-muted-foreground">PNG, JPG jusqu'à 5MB</p>
                  </>
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Label htmlFor="title">Titre de l'événement *</Label>
                <Input 
                  id="title" 
                  name="title"
                  placeholder="Ex: Concert Magic System"
                  className="mt-2"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="description">Description complète *</Label>
                <Textarea 
                  id="description" 
                  name="description"
                  placeholder="Décrivez votre événement en détail..."
                  className="mt-2 min-h-[150px]"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Date & Location */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="dashboard-widget"
        >
          <div className="dashboard-widget-header">
            <CardTitle>Date & Lieu</CardTitle>
          </div>
          <div className="dashboard-widget-content">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="start_date">Date de début *</Label>
                <div className="relative mt-2">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="start_date" 
                    name="start_date"
                    type="date"
                    className="pl-9"
                    value={formData.start_date}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="start_time">Heure de début *</Label>
                <div className="relative mt-2">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="start_time" 
                    name="start_time"
                    type="time"
                    className="pl-9"
                    value={formData.start_time}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="end_date">Date de fin</Label>
                <div className="relative mt-2">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="end_date" 
                    name="end_date"
                    type="date"
                    className="pl-9"
                    value={formData.end_date}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="end_time">Heure de fin</Label>
                <div className="relative mt-2">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="end_time" 
                    name="end_time"
                    type="time"
                    className="pl-9"
                    value={formData.end_time}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="location">Lieu *</Label>
                <div className="relative mt-2">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="location" 
                    name="location"
                    placeholder="Nom du lieu"
                    className="pl-9"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Capacity & Price */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="dashboard-widget"
        >
          <div className="dashboard-widget-header">
            <CardTitle>Capacité & Tarification Générale</CardTitle>
          </div>
          <div className="dashboard-widget-content">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="capacity">Capacité totale *</Label>
                <Input 
                  id="capacity" 
                  name="capacity"
                  type="number"
                  placeholder="100"
                  className="mt-2"
                  value={formData.capacity}
                  onChange={handleChange}
                  min="1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="ticket_price">Prix du billet par défaut (FCFA) *</Label>
                <Input 
                  id="ticket_price" 
                  name="ticket_price"
                  type="number"
                  placeholder="5000"
                  className="mt-2"
                  value={formData.ticket_price}
                  onChange={handleChange}
                  min="0"
                  required
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Ticket Types Management */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="dashboard-widget"
        >
          <div className="dashboard-widget-header flex items-center justify-between">
            <CardTitle>Types de Billets (Détails)</CardTitle>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={addTicketType}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Ajouter un type
            </Button>
          </div>
          <div className="dashboard-widget-content space-y-6">
            {ticketTypes.map((ticket, index) => (
              <div key={index} className="p-4 border border-border rounded-xl bg-muted/30 relative animate-in fade-in slide-in-from-top-2">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="md:col-span-1">
                    <Label>Nom du ticket *</Label>
                    <Input 
                      placeholder="Ex: VIP, Early Bird"
                      value={ticket.name}
                      onChange={(e) => handleTicketTypeChange(index, 'name', e.target.value)}
                      className="mt-2"
                      required
                    />
                  </div>
                  <div>
                    <Label>Prix (FCFA) *</Label>
                    <Input 
                      type="number"
                      placeholder="0"
                      value={ticket.price}
                      onChange={(e) => handleTicketTypeChange(index, 'price', e.target.value)}
                      className="mt-2"
                      required
                    />
                  </div>
                  <div>
                    <Label>Quantité *</Label>
                    <Input 
                      type="number"
                      placeholder="100"
                      value={ticket.quantity_total}
                      onChange={(e) => handleTicketTypeChange(index, 'quantity_total', e.target.value)}
                      className="mt-2"
                      required
                    />
                  </div>
                  <div className="md:col-span-3">
                    <Label>Description</Label>
                    <Input 
                      placeholder="Courte description des avantages"
                      value={ticket.description}
                      onChange={(e) => handleTicketTypeChange(index, 'description', e.target.value)}
                      className="mt-2"
                    />
                  </div>
                </div>
                {ticketTypes.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeTicketType(index)}
                    className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Options */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="dashboard-widget"
        >
          <div className="dashboard-widget-header">
            <CardTitle>Options de publication</CardTitle>
          </div>
          <div className="dashboard-widget-content space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Statut de publication</p>
                <p className="text-sm text-muted-foreground">L'événement sera visible publiquement si publié</p>
              </div>
              <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Brouillon</SelectItem>
                  <SelectItem value="published">Publié</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <div className="flex flex-col-reverse sm:flex-row gap-4 justify-end">
          <Button type="button" variant="outline" onClick={() => navigate('/admin/events')}>
            Annuler
          </Button>
          <Button type="button" variant="secondary" className="gap-2">
            <Eye className="h-4 w-4" />
            Prévisualiser
          </Button>
          <Button type="submit" disabled={isLoading} className="gap-2 shadow-glow">
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