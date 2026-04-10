"use client";

import { useState, forwardRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Phone, Globe, Send, MapPin, Clock, MessageCircle, Instagram, Twitter, Facebook, Linkedin } from "lucide-react";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const schema = z.object({
  name: z.string().min(2, "Nom requis (min. 2 caractères)"),
  email: z.string().email("Adresse email invalide"),
  subject: z.string().min(3, "Sujet requis (min. 3 caractères)"),
  message: z.string().min(10, "Message trop court (min. 10 caractères)"),
});

type FormData = z.infer<typeof schema>;

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setSuccess(false);
    try {
      const res = await fetch("api/contact/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setSuccess(true);
        reset();
        setTimeout(() => setSuccess(false), 5000);
      } else alert("Erreur lors de l'envoi du message");
    } catch {
      alert("Erreur réseau - Vérifiez votre connexion");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />

      {/* Hero Section */}
      <div className="relative pt-24 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Éléments décoratifs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-200 dark:bg-orange-900/20 rounded-full blur-3xl opacity-20" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-200 dark:bg-yellow-900/20 rounded-full blur-3xl opacity-20" />
        </div>

        <div className="max-w-7xl mx-auto relative">
          {/* HEADER avec animation */}
          <div className="text-center mb-12 md:mb-16 animate-fade-in">
            <div className="inline-flex items-center justify-center p-2 bg-orange-100 dark:bg-orange-900/30 rounded-full mb-6">
              <MessageCircle className="w-5 h-5 text-orange-600 dark:text-orange-400 mr-2" />
              <span className="text-sm font-medium text-orange-600 dark:text-orange-400">Nous sommes à votre écoute</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400">
              Contactez-nous
            </h1>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-base md:text-lg">
              Une question ? Un projet ? Notre équipe est disponible 24h/24 et 7j/7 pour vous répondre dans les plus brefs délais.
            </p>
          </div>

          {/* GRID avec espacement amélioré */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

            {/* LEFT - Informations améliorées */}
            <div className="space-y-6">
              {/* Carte principale */}
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 sm:p-8 rounded-lg border border-gray-200 dark:border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-300">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
                  <span className="w-1 h-8 bg-gradient-to-b from-orange-400 to-yellow-500 rounded-full mr-3"></span>
                  Nos coordonnées
                </h2>
                
                <div className="space-y-4">
                  <ContactItem icon={<Mail className="w-5 h-5" />} title="Email" gradient="from-blue-500 to-blue-600">
                    <a href="mailto:williamsmahan@gmail.com" className="hover:text-orange-500 dark:hover:text-orange-400 transition-colors">
                      williamsmahan@gmail.com
                    </a>
                  </ContactItem>
                  
                  <ContactItem icon={<Phone className="w-5 h-5" />} title="Téléphone" gradient="from-green-500 to-green-600">
                    <a href="tel:+2250564295355" className="hover:text-orange-500 dark:hover:text-orange-400 transition-colors">
                      +225 05 64 29 53 55
                    </a>
                  </ContactItem>
                  
                  <ContactItem icon={<MapPin className="w-5 h-5" />} title="Localisation" gradient="from-red-500 to-red-600">
                    Abidjan, Côte d'Ivoire
                  </ContactItem>
                  
                  <ContactItem icon={<Globe className="w-5 h-5" />} title="Service" gradient="from-purple-500 to-purple-600">
                    Disponible partout dans le monde
                  </ContactItem>
                  
                  <ContactItem icon={<Clock className="w-5 h-5" />} title="Disponibilité" gradient="from-yellow-500 to-orange-500">
                    Lun - Ven : 9h - 19h | Samedi : 10h - 16h
                  </ContactItem>
                </div>
              </div>

              {/* Réseaux sociaux */}
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Suivez-nous</h3>
                <div className="flex gap-3">
                  <SocialIcon href="#" icon={<Instagram />} bgColor="bg-pink-500" />
                  <SocialIcon href="#" icon={<Twitter />} bgColor="bg-blue-400" />
                  <SocialIcon href="#" icon={<Facebook />} bgColor="bg-blue-600" />
                  <SocialIcon href="#" icon={<Linkedin />} bgColor="bg-blue-700" />
                </div>
              </div>
            </div>

            {/* RIGHT - FORM amélioré */}
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-6 sm:p-8 md:p-10 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 hover:shadow-3xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-orange-400 to-yellow-500 rounded-lg">
                  <Send className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
                  Envoyer un message
                </h2>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <InputField 
                    label="Nom complet" 
                    placeholder="Jean Dupont"
                    error={errors.name?.message} 
                    icon={<Mail className="w-4 h-4 text-gray-400" />}
                    {...register("name")} 
                  />
                  <InputField 
                    label="Email" 
                    type="email" 
                    placeholder="jean@exemple.com"
                    error={errors.email?.message} 
                    icon={<Mail className="w-4 h-4 text-gray-400" />}
                    {...register("email")} 
                  />
                </div>

                <InputField 
                  label="Sujet" 
                  placeholder="Demande d'information"
                  error={errors.subject?.message} 
                  icon={<MessageCircle className="w-4 h-4 text-gray-400" />}
                  {...register("subject")} 
                />

                <div>
                  <label className="block mb-2 font-semibold text-gray-900 dark:text-gray-100">
                    Message
                  </label>
                  <textarea
                    rows={5}
                    placeholder="Décrivez votre projet ou votre question..."
                    {...register("message")}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none text-sm md:text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all resize-none"
                  />
                  {errors.message && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <span>⚠️</span> {errors.message.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-orange-500 via-orange-600 to-yellow-600 hover:from-orange-600 hover:via-orange-700 hover:to-yellow-700 text-white py-4 rounded-lg flex items-center justify-center gap-2 transition-all font-semibold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      Envoyer le message 
                      <Send size={20} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                {success && (
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 animate-slide-up">
                    <p className="text-green-700 dark:text-green-300 text-sm text-center flex items-center justify-center gap-2">
                      <span className="text-xl">✅</span> 
                      Message envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.
                    </p>
                  </div>
                )}
              </form>
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

/* ================= COMPOSANTS AMÉLIORÉS ================= */

function ContactItem({ icon, title, gradient = "from-orange-500 to-yellow-500", children }: { 
  icon: React.ReactNode; 
  title: string; 
  gradient?: string;
  children: React.ReactNode; 
}) {
  return (
    <div className="flex items-start gap-4 group">
      <div className={`p-3 bg-gradient-to-br ${gradient} text-white rounded-lg shadow-lg group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-gray-700 dark:text-gray-300 text-sm uppercase tracking-wider">{title}</h3>
        <p className="text-gray-900 dark:text-gray-100 text-base md:text-lg font-medium">{children}</p>
      </div>
    </div>
  );
}

function SocialIcon({ href, icon, bgColor }: { href: string; icon: React.ReactNode; bgColor: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`w-10 h-10 ${bgColor} text-white rounded-lg flex items-center justify-center hover:scale-110 transition-all duration-300 hover:shadow-lg`}
    >
      {icon}
    </a>
  );
}

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(({ label, error, type = "text", icon, className, ...props }, ref) => (
  <div>
    <label className="block mb-2 font-semibold text-sm md:text-base text-gray-900 dark:text-gray-100">
      {label}
    </label>
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          {icon}
        </div>
      )}
      <input
        ref={ref}
        type={type}
        {...props}
        className={`w-full px-4 ${icon ? 'pl-10' : ''} py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none text-sm md:text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all ${className || ''}`}
      />
    </div>
    {error && <p className="text-red-500 text-xs mt-1 flex items-center gap-1">⚠️ {error}</p>}
  </div>
));
InputField.displayName = "InputField";

// Ajout des animations CSS globales (à ajouter dans votre fichier CSS global)
const styles = `
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes slide-up {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .animate-fade-in {
    animation: fade-in 0.6s ease-out;
  }
  
  .animate-slide-up {
    animation: slide-up 0.4s ease-out;
  }
`;