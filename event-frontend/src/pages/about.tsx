/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Layout } from "@/components/layout/Layout";
import { 
  Shield, 
  Zap, 
  Globe, 
  Users, 
  Target, 
  Rocket, 
  Heart, 
  Sparkles,
  Award,
  Star,
  Clock,
  Coffee,
  Smile
} from "lucide-react";
import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-24 px-4">
        <div className="max-w-6xl mx-auto">

          {/* HERO - Version plus soft */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center justify-center p-2 bg-orange-50 dark:bg-orange-900/20 rounded-full mb-6">
              <Sparkles className="w-5 h-5 text-orange-500 dark:text-orange-400 mr-2" />
              <span className="text-sm font-medium text-orange-600 dark:text-orange-400">Notre histoire</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900 dark:text-gray-100">
              À propos d'
              <span className="bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
                AWARD
              </span>
            </h1>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg leading-relaxed">
              Une plateforme moderne qui révolutionne la billetterie et le paiement digital en Afrique, 
              avec une approche humaine et innovante.
            </p>
          </motion.div>

          {/* MISSION + VISION - Design épuré */}
          <div className="grid md:grid-cols-2 gap-8 mb-20">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 group">
                <div className="w-14 h-14 bg-orange-50 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Target className="w-7 h-7 text-orange-500 dark:text-orange-400" />
                </div>
                <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Notre mission</h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Simplifier l'accès aux événements et offrir une expérience de paiement rapide,
                  sécurisée et accessible à tous grâce au Mobile Money, pour que chacun puisse 
                  profiter pleinement de la culture et du divertissement.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 group">
                <div className="w-14 h-14 bg-orange-50 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Rocket className="w-7 h-7 text-orange-500 dark:text-orange-400" />
                </div>
                <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Notre vision</h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Devenir la référence en Afrique pour la gestion d'événements et les solutions
                  de paiement numérique, en créant un écosystème qui connecte les talents, 
                  les organisateurs et le public.
                </p>
              </div>
            </motion.div>
          </div>

          {/* STATS - Nouvelle section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20"
          >
            <StatCard number="5000+" label="Utilisateurs" icon={<Users className="w-5 h-5" />} />
            <StatCard number="100+" label="Événements" icon={<Star className="w-5 h-5" />} />
            <StatCard number="50k+" label="Transactions" icon={<Zap className="w-5 h-5" />} />
            <StatCard number="98%" label="Satisfaction" icon={<Smile className="w-5 h-5" />} />
          </motion.div>

          {/* VALEURS - Version plus soft */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mb-20"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                Ce qui nous rend <span className="text-orange-500">spéciaux</span>
              </h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Des valeurs qui guident chacune de nos actions et façonnent notre relation avec vous.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <ValueCard 
                icon={<Zap />} 
                title="Rapidité" 
                desc="Paiements instantanés et fluides, pour ne jamais manquer un événement." 
                color="from-yellow-400 to-orange-400"
              />
              <ValueCard 
                icon={<Shield />} 
                title="Sécurité" 
                desc="Protection maximale de vos transactions et données personnelles." 
                color="from-blue-400 to-indigo-400"
              />
              <ValueCard 
                icon={<Globe />} 
                title="Accessibilité" 
                desc="Disponible partout en Afrique, sur tous types d'appareils." 
                color="from-green-400 to-emerald-400"
              />
              <ValueCard 
                icon={<Heart />} 
                title="Bienveillance" 
                desc="Une équipe à l'écoute qui place l'humain au cœur de ses priorités." 
                color="from-pink-400 to-rose-400"
              />
            </div>
          </motion.div>

          {/* TIMELINE - Design épuré */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mb-20"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                Notre parcours
              </h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Les étapes clés qui ont façonné AWARD et continuent de nous faire évoluer.
              </p>
            </div>
            <div className="relative">
              {/* Ligne de timeline */}
              <div className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-orange-200 to-yellow-200 dark:from-orange-800 dark:to-yellow-800"></div>
              
              <div className="space-y-8">
                <TimelineItem 
                  year="2024" 
                  text="Création de AWARD et lancement du projet avec une vision claire : révolutionner la billetterie en Afrique."
                  icon={<Award className="w-5 h-5" />}
                  position="left"
                />
                <TimelineItem 
                  year="2025" 
                  text="Développement de la plateforme et intégration des solutions Mobile Money pour une accessibilité maximale."
                  icon={<Coffee className="w-5 h-5" />}
                  position="right"
                />
                <TimelineItem 
                  year="2026" 
                  text="Expansion et lancement officiel au public, avec une communauté grandissante d'utilisateurs et d'organisateurs."
                  icon={<Rocket className="w-5 h-5" />}
                  position="left"
                />
              </div>
            </div>
          </motion.div>

          {/* TEAM - Design plus humain */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mb-20"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                L'équipe derrière AWARD
              </h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Des passionnés qui travaillent chaque jour pour vous offrir la meilleure expérience.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
              <TeamCard 
                name="Jean Williams" 
                role="Fondateur & CEO" 
                bio="Passionné par l'innovation et la tech au service de l'Afrique."
                color="from-orange-500 to-yellow-500"
              />
              <TeamCard 
                name="Marie Konan" 
                role="Marketing & Communication" 
                bio="Créative et stratégique, elle donne vie à notre vision."
                color="from-blue-500 to-indigo-500"
              />
              <TeamCard 
                name="Paul Kouamé" 
                role="Support Client" 
                bio="Toujours à l'écoute pour résoudre vos questions avec le sourire."
                color="from-green-500 to-emerald-500"
              />
            </div>
          </motion.div>

          {/* CTA - Version plus douce */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="relative overflow-hidden"
          >
            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-gray-800 dark:to-gray-700 p-12 rounded-3xl shadow-xl border border-orange-100 dark:border-gray-600 text-center">
              {/* Éléments décoratifs */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-orange-200/20 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-yellow-200/20 rounded-full blur-3xl"></div>
              
              <Sparkles className="w-12 h-12 text-orange-400 mx-auto mb-6" />
              <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                Rejoignez l'aventure AWARD
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-xl mx-auto text-lg">
                Découvrez les meilleurs événements et réservez en quelques secondes, 
                où que vous soyez en Afrique.
              </p>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="/events"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white px-8 py-4 rounded-2xl transition-all font-semibold text-lg shadow-lg hover:shadow-xl"
              >
                Explorer les événements
                <Rocket className="w-5 h-5" />
              </motion.a>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}

/* ================= COMPOSANTS AMÉLIORÉS ================= */

function StatCard({ number, label, icon }: any) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm p-6 rounded-2xl border border-gray-100 dark:border-gray-700 text-center shadow-sm hover:shadow-md transition-all"
    >
      <div className="w-10 h-10 bg-orange-50 dark:bg-orange-900/30 rounded-xl flex items-center justify-center mx-auto mb-3 text-orange-500">
        {icon}
      </div>
      <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">{number}</div>
      <div className="text-sm text-gray-600 dark:text-gray-400">{label}</div>
    </motion.div>
  );
}

function ValueCard({ icon, title, desc, color = "from-orange-400 to-yellow-400" }: any) {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 group"
    >
      <div className={`w-14 h-14 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center mb-4 text-white group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
        {icon}
      </div>
      <h3 className="font-semibold text-xl mb-2 text-gray-900 dark:text-gray-100">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{desc}</p>
    </motion.div>
  );
}

function TimelineItem({ year, text, icon, position }: any) {
  return (
    <motion.div 
      whileHover={{ x: position === 'left' ? 5 : -5 }}
      className={`flex items-center gap-6 ${position === 'right' ? 'md:flex-row-reverse' : ''}`}
    >
      <div className="hidden md:block w-1/2"></div>
      <div className="relative flex items-center justify-center">
        <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-2xl flex items-center justify-center text-white shadow-lg z-10">
          {icon}
        </div>
      </div>
      <div className="flex-1 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700">
        <span className="text-orange-500 font-bold text-lg block mb-2">{year}</span>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{text}</p>
      </div>
    </motion.div>
  );
}

function TeamCard({ name, role, bio, color }: any) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 group"
    >
      <div className="relative mb-4">
        <div className={`w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-white font-bold text-3xl shadow-lg group-hover:scale-105 transition-transform duration-300`}>
          {name.charAt(0)}
        </div>
        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center shadow-md">
          <Smile className="w-4 h-4 text-orange-500" />
        </div>
      </div>
      <h3 className="font-semibold text-xl text-center text-gray-900 dark:text-gray-100 mb-1">{name}</h3>
      <p className="text-orange-500 text-sm text-center mb-3">{role}</p>
      <p className="text-gray-600 dark:text-gray-400 text-sm text-center leading-relaxed">{bio}</p>
    </motion.div>
  );
}