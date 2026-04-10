# Configuration de l'Authentification - Backend + Frontend

## 🚀 Démarrage du Backend Django

### 1. Préparation de l'environnement

```bash
cd event-backend

# Créer un environnement virtuel
python -m venv venv

# Activer l'environnement virtuel
# Sur Windows:
venv\Scripts\activate
# Sur macOS/Linux:
source venv/bin/activate

# Installer les dépendances
pip install -r requirements/base.txt
```

### 2. Appliquer les migrations

```bash
# Créer et appliquer les migrations
python manage.py makemigrations

python manage.py migrate

# Créer un superuser (administrateur)
python manage.py createsuperuser
# Email: admin@example.com
# Username: admin
# Password: (votre mot de passe)
```

### 3. Démarrer le serveur Django

```bash
# Mode développement avec SQLite
python manage.py runserver

# Le serveur sera accessible à http://localhost:8000
```

### 4. Accéder à l'API

- **API Documentation Swagger**: <http://localhost:8000/api/docs/>
- **API Documentation ReDoc**: <http://localhost:8000/api/redoc/>
- **Admin Django**: <http://localhost:8000/admin/>

---

## 🔗 Endpoints d'Authentification disponibles

### 1. Inscription

```
POST /api/v1/auth/register/
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "username",
  "first_name": "John",
  "last_name": "Doe",
  "phone": "+22507000000",
  "password": "SecurePassword123!",
  "password_confirm": "SecurePassword123!"
}

Response:
{
  "message": "User registered successfully",
  "user": { ... },
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

### 2. Connexion (Email + Mot de passe)

```
POST /api/v1/auth/login/
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}

Response:
{
  "message": "Login successful",
  "user": { ... },
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

### 3. Demander un OTP par SMS

```
POST /api/v1/auth/request_phone_otp/
Content-Type: application/json

{
  "phone": "+22507000000"
}

Response:
{
  "message": "OTP sent successfully",
  "otp": "123456"  // En développement, l'OTP est retourné
}
```

### 4. Connexion par OTP (Téléphone)

```
POST /api/v1/auth/login_phone_otp/
Content-Type: application/json

{
  "phone": "+22507000000",
  "otp_code": "123456"
}

Response:
{
  "message": "Login successful",
  "user": { ... },
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

### 5. Renouveler le token d'accès

```
POST /api/v1/auth/refresh_token/
Content-Type: application/json

{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}

Response:
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

### 6. Récupérer le profil actuel

```
GET /api/v1/auth/me/
Authorization: Bearer {access_token}

Response:
{
  "id": 1,
  "email": "user@example.com",
  "username": "username",
  "first_name": "John",
  "last_name": "Doe",
  "phone": "+22507000000",
  "role": "buyer",
  "is_email_verified": true,
  "is_phone_verified": true,
  "created_at": "2026-02-06T10:00:00Z"
}
```

### 7. Changer le mot de passe

```
POST /api/v1/auth/change_password/
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "old_password": "OldPassword123!",
  "new_password": "NewPassword123!",
  "new_password_confirm": "NewPassword123!"
}

Response:
{
  "message": "Password changed successfully"
}
```

---

## 🎨 Configuration du Frontend

### 1. Configuration d'environnement

Le fichier `.env.local` a déjà été configuré:

```env
VITE_API_URL=http://localhost:8000/api/v1
```

### 2. Utilisation du Store d'Authentification

```typescript
import { useAuthStore } from '@/stores/authStore';

// Inscription
const { register, isLoading, error } = useAuthStore();
await register({
  email: 'user@example.com',
  username: 'user',
  firstName: 'John',
  lastName: 'Doe',
  phone: '+22507000000',
  password: 'SecurePassword123!',
  password_confirm: 'SecurePassword123!'
});

// Connexion
const { login } = useAuthStore();
await login('user@example.com', 'SecurePassword123!');

// Vérifier l'authentification
const { checkAuth } = useAuthStore();
await checkAuth();

// Déconnexion
const { logout } = useAuthStore();
logout();

// Accéder aux données utilisateur
const { user, isAuthenticated } = useAuthStore();
```

### 3. Faire des appels API authentifiés

```typescript
import { get, post, patch } from '@/lib/api-client';
import { ENDPOINTS } from '@/config/api';

// GET avec authentification automatique
const events = await get(ENDPOINTS.events.list);

// POST avec authentification automatique
const newEvent = await post(ENDPOINTS.events.create, {
  title: 'Event Name',
  description: 'Event Description',
  // ...
});
```

---

## 🧪 Tests manuels

### Avec cURL

```bash
# 1. Inscription
curl -X POST http://localhost:8000/api/v1/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "first_name": "Test",
    "last_name": "User",
    "password": "TestPassword123!",
    "password_confirm": "TestPassword123!"
  }'

# 2. Connexion
curl -X POST http://localhost:8000/api/v1/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123!"
  }'

# 3. Utiliser le token pour accéder aux ressources protégées
curl -X GET http://localhost:8000/api/v1/auth/me/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Avec Postman

Importez la collection API depuis: `http://localhost:8000/api/docs/`

---

## 🔧 Configuration avancée

### Variables d'environnement requises

```bash
# .env.dev pour le développement
DEBUG=True
SECRET_KEY=votre-cle-secrete
DB_ENGINE=sqlite3
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000,http://localhost:4173/
```

### Structure des données User

```typescript
interface User {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  phone?: string;
  role: 'buyer' | 'organizer' | 'admin';
  profile_picture?: string;
  bio?: string;
  is_email_verified: boolean;
  is_phone_verified: boolean;
  created_at: string;
}
```

---

## 📝 Notes importantes

1. **Tokens JWT**:
   - `access_token`: Durée de vie 1 heure
   - `refresh_token`: Durée de vie 7 jours
   - Stockés automatiquement dans `localStorage`

2. **CORS**:
   - Configuré pour accepter les requêtes du frontend
   - Assurez-vous que `CORS_ALLOWED_ORIGINS` inclut votre URL frontend

3. **OTP en développement**:
   - L'OTP est retourné dans la réponse API
   - À remplacer par un vrai provider SMS en production

4. **Sécurité**:
   - Changez `SECRET_KEY` en production
   - Utilisez HTTPS en production
   - Stockez les tokens de manière sécurisée

---

## 🆘 Dépannage

### Erreur: "No such table: authentication_customuser"

```bash
python manage.py makemigrations
python manage.py migrate
```

### Erreur CORS

Vérifiez que `CORS_ALLOWED_ORIGINS` dans `.env.dev` inclut votre URL frontend.

### Erreur: "Invalid token"

Le token a expiré. Utilisez le `refresh_token` pour obtenir un nouveau `access_token`.

---

## 📚 Prochaines étapes

- [ ] Implémenter les modèles Event, Order, Payment
- [ ] Créer les viewsets pour Events
- [ ] Implémenter le panier d'achat
- [ ] Intégrer un système de paiement
- [ ] Ajouter la vérification d'email
- [ ] Configurer les SMS pour l'OTP
