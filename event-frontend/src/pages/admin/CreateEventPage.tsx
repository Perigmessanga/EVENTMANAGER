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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const startDateTime = new Date(`${formData.start_date}T${formData.start_time}`).toISOString();
    const endDateTime = new Date(`${formData.end_date}T${formData.end_time}`).toISOString();

    const eventData = {
      title: formData.title,
      description: formData.description,
      location: formData.location,
      start_date: startDateTime,
      end_date: endDateTime,
      capacity: parseInt(formData.capacity),
      ticket_price: parseFloat(formData.ticket_price),
      status: formData.status as 'draft' | 'published' | 'cancelled' | 'completed',
      ...(imageFile && { image: imageFile }),
    };

    const result = await create(eventData);
    if (result) {
      navigate('/admin/events');
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
            <CardTitle>Capacité & Tarification</CardTitle>
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
                <Label htmlFor="ticket_price">Prix du billet (FCFA) *</Label>
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
