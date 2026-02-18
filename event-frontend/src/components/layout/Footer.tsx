import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const socialLinks = [
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
];

export function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand & Newsletter */}
          <div className="col-span-2 lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4 group">
              <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-sm transition-transform duration-300 group-hover:scale-105">
                <span className="text-primary-foreground font-display font-bold text-lg">T</span>
              </div>
              <span className="font-display font-bold text-xl">Tikerama</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs">
              La billetterie en ligne #1 en Côte d'Ivoire. Réservez vos billets en toute sécurité avec Mobile Money.
            </p>
            
            {/* Newsletter */}
            <div className="space-y-3">
              <p className="text-sm font-medium">Restez informé</p>
              <div className="flex gap-2">
                <Input 
                  type="email" 
                  placeholder="Votre email" 
                  className="bg-muted/50 border-border/50 h-10"
                />
                <Button size="sm" className="h-10 px-4">
                  S'abonner
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Recevez les meilleurs événements en avant-première.
              </p>
            </div>
          </div>

          {/* Events Links */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Événements</h4>
            <ul className="space-y-3">
              {[
                { label: 'Tous les événements', href: '/events' },
                { label: 'Concerts', href: '/events?category=Musique' },
                { label: 'Sport', href: '/events?category=Sport' },
                { label: 'Culture', href: '/events?category=Culture' },
                { label: 'Humour', href: '/events?category=Humour' },
              ].map((link) => (
                <li key={link.href}>
                  <Link 
                    to={link.href} 
                    className="text-sm text-muted-foreground hover:text-primary transition-colors link-underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Support</h4>
            <ul className="space-y-3">
              {[
                { label: 'Centre d\'aide', href: '#' },
                { label: 'Nous contacter', href: '#' },
                { label: 'FAQ', href: '#' },
                { label: 'Remboursements', href: '#' },
              ].map((link) => (
                <li key={link.label}>
                  <a 
                    href={link.href} 
                    className="text-sm text-muted-foreground hover:text-primary transition-colors link-underline"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>Cocody, Abidjan<br />Côte d'Ivoire</span>
              </li>
              <li>
                <a 
                  href="tel:+2250701234567" 
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  +225 07 01 23 45 67
                </a>
              </li>
              <li>
                <a 
                  href="mailto:contact@tikerama.ci" 
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  contact@tikerama.ci
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Copyright & Legal */}
            <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-muted-foreground">
              <p>© {new Date().getFullYear()} Tikerama. Tous droits réservés.</p>
              <div className="flex gap-4">
                <a href="#" className="hover:text-foreground transition-colors">CGV</a>
                <a href="#" className="hover:text-foreground transition-colors">Confidentialité</a>
                <a href="#" className="hover:text-foreground transition-colors">Mentions légales</a>
              </div>
            </div>

            {/* Social & Payment */}
            <div className="flex items-center gap-6">
              {/* Social Links */}
              <div className="flex items-center gap-1">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                  >
                    <social.icon className="h-4 w-4" />
                  </a>
                ))}
              </div>

              {/* Payment Methods */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground hidden sm:inline">Paiement via</span>
                <div className="flex gap-1.5">
                  <div className="px-2.5 py-1.5 rounded-md text-xs font-semibold momo-orange shadow-sm">
                    Orange
                  </div>
                  <div className="px-2.5 py-1.5 rounded-md text-xs font-semibold momo-mtn shadow-sm">
                    MTN
                  </div>
                  <div className="px-2.5 py-1.5 rounded-md text-xs font-semibold momo-wave shadow-sm">
                    Wave
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
