---
name: otpimize
description: Optimize and follow Next16 best practices
---

# ⚡ Guide de la commande /optimize

Guide pour analyser et optimiser les performances du code Next.js 16 avec les meilleures pratiques React Server Components, App Router et optimisations modernes.

## 🎯 Objectif

Analyser le code Next.js 16 pour identifier les problèmes de performance et proposer des optimisations concrètes suivant les best practices.

## 📋 Processus d'analyse Next.js 16

### 1. 🔍 Identification des problèmes spécifiques Next.js

#### 🖥️ Server vs Client Components

- **'use client' abusif**: Composants qui devraient être Server Components
- **Props drilling**: Éviter en utilisant Server Components
- **Hydration inutile**: Trop de JavaScript côté client
- **Interactivité mal placée**: Client components trop hauts dans l'arbre

#### 🚀 App Router & Routing

- **Pas de parallel routes**: Routes qui pourraient être parallèles
- **Pas d'intercepting routes**: Modales/overlays en navigation complète
- **Loading states absents**: Pas de loading.tsx/error.tsx
- **Suspense boundaries manquants**: Chargement bloquant

#### 📦 Data Fetching

- **Fetch waterfall**: Requêtes séquentielles au lieu de parallèles
- **Pas de cache**: fetch() sans stratégies de cache
- **Over-fetching**: Données inutiles chargées
- **N+1 queries**: Requêtes en boucle
- **Client-side fetching**: Devrait être Server Component

#### 🎨 Rendering & Performance

- **Composants trop gros**: Manque de découpage
- **Re-renders inutiles**: Dépendances mal gérées
- **Pas de Streaming**: Suspense non utilisé
- **Bundle size**: Imports lourds côté client
- **Images non optimisées**: Pas de next/image

#### 🗃️ Base de données & Cache

- **Requêtes non optimisées**: Pas d'index, SELECT \*
- **Pas de revalidation**: Cache statique sans stratégie
- **unstable_cache mal utilisé**: Cache manquant ou excessif
- **Prisma N+1**: Relations non includes

#### 🔐 Metadata & SEO

- **Metadata statiques**: Devraient être dynamiques
- **generateMetadata absent**: SEO non optimisé
- **Open Graph manquant**: Partage social non configuré

### 2. 📊 Métriques à considérer (Next.js)

- ⚡ **Core Web Vitals**: LCP, FID, CLS
- 📦 **First Load JS**: < 100kb idéal
- 🎯 **Time to Interactive (TTI)**: Réduire hydration
- 🖥️ **Server/Client ratio**: Maximiser Server Components
- 💾 **Cache Hit Rate**: Utilisation cache Next.js
- 🔄 **Streaming**: Utilisation Suspense
- 🌐 **API Routes**: Temps de réponse < 200ms

### 3. 🛠️ Techniques d'optimisation Next.js 16

#### 🖥️ Server Components (RSC)

- **Default to Server**: Tout est Server Component sauf si interactivité
- **Composition pattern**: Client components imbriqués dans Server
- **Async Server Components**: fetch direct dans composants
- **Server Actions**: Mutations côté serveur

#### 📦 Data Fetching Moderne

```typescript
// ✅ Bon: Parallel fetching
async function Page() {
  const [users, posts] = await Promise.all([
    fetch("/api/users"),
    fetch("/api/posts"),
  ]);
}

// ✅ Bon: Cache & Revalidation
fetch("/api/data", {
  next: { revalidate: 3600 }, // ISR
  // cache: 'force-cache' // SSG
  // cache: 'no-store' // SSR
});

// ✅ Bon: unstable_cache pour DB queries
import { unstable_cache } from "next/cache";
const getCachedUsers = unstable_cache(
  async () => db.user.findMany(),
  ["users"],
  { revalidate: 3600, tags: ["users"] }
);
```

#### 🎨 Découpage en sous-composants

**Règles de découpage:**

1. **Single Responsibility**: 1 composant = 1 responsabilité
2. **< 200 lignes**: Si plus, découper
3. **Réutilisabilité**: Extraire logique commune
4. **Client boundary**: Isoler interactivité dans Client Components
5. **Colocation**: Garder composants proches de leur usage

```typescript
// ❌ Mauvais: Composant monolithique
"use client";
function Dashboard() {
  // 500 lignes de code...
}

// ✅ Bon: Découpé
// app/dashboard/page.tsx (Server Component)
async function DashboardPage() {
  const data = await fetchData();
  return (
    <>
      <DashboardHeader />
      <DashboardStats data={data} />
      <DashboardCharts data={data} />
      <InteractiveFilters /> {/* Client Component */}
    </>
  );
}

// app/dashboard/_components/interactive-filters.tsx
("use client");
function InteractiveFilters() {
  // Seule la partie interactive est client
}
```

#### ⚡ Optimisations React

- **React.memo()**: Éviter re-renders (Client Components uniquement)
- **useMemo/useCallback**: Cache valeurs/fonctions
- **useTransition**: Updates non-bloquantes
- **useOptimistic**: UI optimiste
- **React.lazy()**: Code splitting côté client

#### 🖼️ Images & Assets

```typescript
// ✅ Utiliser next/image
import Image from "next/image";
<Image
  src="/photo.jpg"
  width={500}
  height={300}
  alt="Description"
  priority={false} // true pour LCP images
  loading="lazy"
  placeholder="blur"
/>;

// ✅ Imports statiques
import profilePic from "./profile.jpg";
<Image src={profilePic} alt="Profile" />;
```

#### 🔄 Streaming & Suspense

```typescript
// ✅ Streaming avec Suspense
import { Suspense } from "react";

async function Page() {
  return (
    <>
      <Header /> {/* Render immédiatement */}
      <Suspense fallback={<Skeleton />}>
        <SlowComponent /> {/* Stream quand prêt */}
      </Suspense>
    </>
  );
}
```

#### 🗃️ Database Optimizations

```typescript
// ✅ Prisma: Include relations (pas N+1)
const posts = await prisma.post.findMany({
  include: { author: true, comments: true }
})

// ✅ Select only needed fields
const users = await prisma.user.findMany({
  select: { id: true, name: true }
})

// ✅ Connection pooling
// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

#### 🎯 Route Handlers & API

```typescript
// app/api/users/route.ts
export async function GET() {
  const data = await fetch("...", {
    next: { revalidate: 3600 },
  });
  return Response.json(data);
}

// ✅ Server Actions (recommandé vs API routes)
// app/actions.ts
("use server");
export async function createUser(formData: FormData) {
  const name = formData.get("name");
  await db.user.create({ data: { name } });
  revalidatePath("/users");
}
```

#### 📱 Layouts & Templates

```typescript
// ✅ Shared layouts (pas de re-render)
// app/dashboard/layout.tsx
export default function DashboardLayout({ children }) {
  return (
    <div>
      <Sidebar /> {/* Persiste entre navigations */}
      {children}
    </div>
  );
}

// ✅ Templates (re-render à chaque navigation)
// app/dashboard/template.tsx - pour animations
```

#### 🔐 Metadata dynamique

```typescript
// ✅ generateMetadata pour SEO
export async function generateMetadata({ params }) {
  const post = await getPost(params.id);
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      images: [post.coverImage],
    },
  };
}
```

## 📝 Format de réponse Next.js 16

### Structure recommandée

````markdown
## 🔍 Analyse du code Next.js

### ⚠️ Problèmes identifiés

1. **[Type de problème]** (Impact: 🔴 Élevé / 🟡 Moyen / 🟢 Faible)
   - Description du problème
   - Impact sur les performances Next.js
   - Métrique actuelle vs cible (Core Web Vitals, Bundle size, etc.)
   - Violations des best practices Next.js 16

### ⚡ Optimisations proposées

#### Optimisation 1: [Titre]

**Impact**: 🔴/🟡/🟢 | **Effort**: 🔴/🟡/🟢 | **Type**: RSC/Client/Data/Image/etc.

**Avant**:

```typescript
// Code non optimisé
```
````

**Après**:

```typescript
// Code optimisé avec découpage et best practices Next.js 16
```

**Gains attendus**:

- ⚡ LCP: -XX% (First Load JS réduit)
- 💾 Bundle Size: -XXkb
- 🖥️ Hydration: -XX% JavaScript côté client
- 🔄 Time to Interactive: -XXms
- 📊 Server/Client Ratio: amélioration

**Explication**:

- Pourquoi cette optimisation fonctionne
- Comment elle s'intègre avec l'App Router
- Impact sur le rendering (Server vs Client)
- Stratégie de cache utilisée

### 📊 Résumé des gains

| Métrique          | Avant | Après | Gain |
| ----------------- | ----- | ----- | ---- |
| First Load JS     | XXkb  | XXkb  | -XX% |
| LCP               | XXms  | XXms  | -XX% |
| Client Components | X     | X     | -XX% |
| Bundle Size       | XXkb  | XXkb  | -XX% |
| API Calls         | X     | X     | -XX% |

### 🏗️ Architecture proposée

```
app/
├── (dashboard)/
│   ├── layout.tsx          # Server Component (shared layout)
│   ├── loading.tsx         # Loading UI
│   ├── error.tsx           # Error boundary
│   └── page.tsx            # Server Component (data fetching)
│       └── _components/
│           ├── dashboard-header.tsx      # Server Component
│           ├── dashboard-stats.tsx       # Server Component
│           ├── dashboard-charts.tsx      # Server Component
│           └── interactive-filters.tsx   # Client Component (minimal)
```

### 📋 Checklist Best Practices

- [ ] Server Components par défaut
- [ ] Client Components minimaux et isolés
- [ ] Data fetching parallèle (Promise.all)
- [ ] Stratégies de cache définies (revalidate, tags)
- [ ] Images optimisées (next/image)
- [ ] Metadata dynamique (generateMetadata)
- [ ] Loading states (loading.tsx, Suspense)
- [ ] Error boundaries (error.tsx)
- [ ] Composants < 200 lignes
- [ ] Pas de N+1 queries (include Prisma)
- [ ] TypeScript strict activé

````

## 🎯 Exemples d'optimisations Next.js 16

### Exemple 1: Client Component → Server Component

**Avant** (❌ Inutilement client):
```typescript
'use client'
import { useState, useEffect } from 'react'

export default function UserList() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    fetch('/api/users')
      .then(r => r.json())
      .then(setUsers)
  }, [])

  return (
    <div>
      {users.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  )
}
````

**Après** (✅ Server Component):

```typescript
// app/users/page.tsx - Server Component
async function getUsersFromDB() {
  const users = await prisma.user.findMany({
    select: { id: true, name: true },
  });
  return users;
}

export default async function UserList() {
  const users = await getUsersFromDB();

  return (
    <div>
      {users.map((user) => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}
```

**Gains**: -15kb JS client, pas de hydration, meilleur SEO

---

### Exemple 2: Découpage avec Server/Client Mix

**Avant** (❌ Tout en Client):

```typescript
"use client";
import { useState } from "react";

export default function Dashboard({ initialData }) {
  const [filter, setFilter] = useState("all");

  return (
    <div>
      <h1>Dashboard</h1>
      <Stats data={initialData} />
      <select onChange={(e) => setFilter(e.target.value)}>
        <option value="all">All</option>
        <option value="active">Active</option>
      </select>
      <DataTable data={initialData} filter={filter} />
    </div>
  );
}
```

**Après** (✅ Découpé Server/Client):

```typescript
// app/dashboard/page.tsx - Server Component
import { Suspense } from "react";
import DashboardFilters from "./_components/dashboard-filters";
import DashboardStats from "./_components/dashboard-stats";
import DashboardTable from "./_components/dashboard-table";

async function getData() {
  const data = await fetch("/api/data", {
    next: { revalidate: 3600 },
  });
  return data.json();
}

export default async function DashboardPage() {
  const data = await getData();

  return (
    <div>
      <h1>Dashboard</h1>
      <DashboardStats data={data} />
      <Suspense fallback={<div>Loading filters...</div>}>
        <DashboardFilters />
      </Suspense>
      <DashboardTable data={data} />
    </div>
  );
}

// app/dashboard/_components/dashboard-stats.tsx - Server Component
export default function DashboardStats({ data }) {
  return <div>{/* Affichage stats */}</div>;
}

// app/dashboard/_components/dashboard-filters.tsx - Client Component
("use client");
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function DashboardFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleFilterChange = (filter: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("filter", filter);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <select onChange={(e) => handleFilterChange(e.target.value)}>
      <option value="all">All</option>
      <option value="active">Active</option>
    </select>
  );
}

// app/dashboard/_components/dashboard-table.tsx - Server Component
export default function DashboardTable({ data }) {
  return <table>{/* Rendu table */}</table>;
}
```

**Gains**: -40kb JS client, streaming, meilleur SEO, cache côté serveur

---

### Exemple 3: Data Fetching Waterfall → Parallel

**Avant** (❌ Waterfall):

```typescript
async function Page() {
  const user = await fetch("/api/user");
  const posts = await fetch(`/api/users/${user.id}/posts`);
  const comments = await fetch(`/api/posts/${posts[0].id}/comments`);

  return <div>...</div>;
}
```

**Après** (✅ Parallel + Cache):

```typescript
// lib/data.ts
import { unstable_cache } from "next/cache";

export const getUser = unstable_cache(
  async () => db.user.findFirst(),
  ["user"],
  { revalidate: 3600, tags: ["user"] }
);

export const getPosts = unstable_cache(
  async (userId: string) =>
    db.post.findMany({
      where: { userId },
      include: { comments: true }, // Évite N+1
    }),
  ["posts"],
  { revalidate: 3600, tags: ["posts"] }
);

// app/page.tsx
async function Page() {
  // Parallel fetching
  const [user, posts] = await Promise.all([getUser(), getPosts("user-id")]);

  return (
    <div>
      <UserProfile user={user} />
      <Suspense fallback={<PostsSkeleton />}>
        <PostsList posts={posts} />
      </Suspense>
    </div>
  );
}
```

**Gains**: 60% réduction temps chargement, cache optimisé, pas de N+1

---

## 🚀 Quick Wins Next.js 16

1. **Convertir pages en Server Components** → -30% JS client
2. **Ajouter next/image partout** → +20% LCP
3. **Implémenter Suspense boundaries** → Meilleur UX
4. **Cache fetch() avec revalidate** → +50% vitesse
5. **Découper composants > 200 lignes** → Maintenabilité
6. **Ajouter loading.tsx/error.tsx** → UX professionnelle
7. **Utiliser Server Actions** → Pas d'API routes
8. **Include Prisma relations** → Pas de N+1

## 📚 Ressources

- [Next.js 16 Docs](https://nextjs.org/docs)
- [React Server Components](https://react.dev/reference/rsc/server-components)
- [Core Web Vitals](https://web.dev/vitals/)
- [Next.js Performance](https://nextjs.org/docs/app/building-your-application/optimizing)

---

**💡 Rappel**: Toujours privilégier Server Components et ne descendre en Client Component que pour l'interactivité strictement nécessaire.
