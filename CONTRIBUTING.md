# Guía de contribución — SoF4-Games

Este documento define los estándares de trabajo del equipo. Léelo completo antes de hacer tu primer commit. Si tienes dudas, consulta con [@raiksha](https://github.com/raiksha) antes de proceder.

---

## Índice

- [Flujo de trabajo con Git](#flujo-de-trabajo-con-git)
- [Convención de ramas](#convención-de-ramas)
- [Convención de commits](#convención-de-commits)
- [Pull Requests](#pull-requests)
- [Estándares de código](#estándares-de-código)
- [Variables de entorno y seguridad](#variables-de-entorno-y-seguridad)

---

## Flujo de trabajo con Git

El proyecto usa el siguiente flujo de ramas:

```
main          ← producción (solo acepta merges desde develop vía PR aprobado)
  └── develop ← integración (aquí se integran las features terminadas)
        └── feature/nombre-feature   ← trabajo individual o en subgrupo
```

**Este flujo aplica a todos los miembros del equipo, incluida la dueña del repo.** Nadie hace push directo a `main` o `develop` — ambas ramas tienen protección activada y el push será rechazado.

### Configuración inicial del fork

Al hacer fork en GitHub, asegúrate de **desmarcar** la opción *"Copy the `main` branch only"*. Si ya hiciste el fork y solo tienes `main`, ejecuta esto una sola vez:

```bash
# 1. Clona tu fork (si aún no lo tienes local)
git clone https://github.com/TU_USUARIO/repo.git
cd repo

# 2. Agrega el repositorio original como remote
git remote add upstream https://github.com/raiksha/repo.git

# 3. Trae todas las ramas del upstream
git fetch upstream

# 4. Crea tu rama develop local basada en la del upstream
git checkout -b develop upstream/develop

# 5. Súbela a tu fork
git push origin develop
```

Con esto tu fork queda con `main` y `develop`. No repitas esto después — es solo configuración inicial.

---

### Pasos para trabajar en una feature nueva

```bash
# 1. Asegúrate de estar en develop y tenerlo actualizado
git checkout develop
git pull upstream develop        # trae los cambios del repo original
git push origin develop          # mantiene tu fork sincronizado

# 2. Crea tu rama de feature
git checkout -b feature/descriptive-name

# 3. Trabaja, commitea con la convención de abajo
git add .
git commit -m "feat: brief description of what you did"

# 4. Antes de abrir la PR, trae los cambios de develop y resuelve conflictos LOCALMENTE
git fetch upstream
git rebase upstream/develop
# Si hay conflictos: resuélvelos, luego git add + git rebase --continue

# 5. Sube tu rama — en este momento se hace visible en GitHub
git push origin feature/descriptive-name

# 6. Abre una Pull Request hacia develop en GitHub
```

> **Importante:** los conflictos se resuelven en tu máquina, antes de abrir la PR. Una PR con conflictos no se mergea.

**Sobre las ramas remotas:** una rama solo aparece en GitHub cuando haces `git push`. Después de que su PR se mergea a `develop`, la rama feature debe borrarse del remoto — GitHub muestra un botón "Delete branch" justo después del merge. Mantén el repo limpio.

---

## Convención de ramas

Los nombres de ramas van en inglés, minúsculas y kebab-case:

```
feature/store-page
feature/auth-login
feature/game-card-component
fix/cart-total-calculation
docs/update-readme
refactor/game-service-cleanup
```

| Prefijo | Cuándo usarlo |
|---------|--------------|
| `feature/` | Nueva funcionalidad |
| `fix/` | Corrección de bug |
| `docs/` | Solo documentación |
| `refactor/` | Mejora de código sin cambiar comportamiento |
| `style/` | Solo cambios de estilos CSS |
| `test/` | Agregar o modificar tests |

---

## Convención de commits

Los commits van en inglés. Formato obligatorio:

```
type(scope): brief description in lowercase
```

**Tipos válidos:**

| Tipo | Cuándo usarlo |
|------|--------------|
| `feat` | Nueva funcionalidad |
| `fix` | Corrección de bug |
| `docs` | Cambios en documentación |
| `style` | Formato, estilos CSS (sin cambios de lógica) |
| `refactor` | Mejora de código sin cambiar comportamiento |
| `test` | Agregar o modificar tests |
| `chore` | Tareas de mantenimiento (dependencias, config) |

**Scopes válidos:**

El scope indica qué área del proyecto afecta el commit. Usa siempre uno de los siguientes — si no encaja ninguno, consulta con [@raiksha](https://github.com/raiksha).

| Scope | Cuándo usarlo |
|-------|--------------|
| `store` | Página de tienda / landing y sus componentes |
| `gamepage` | Página de detalle de juego |
| `navbar` | Barra de navegación |
| `footer` | Footer |
| `auth` | Login, registro y flujo de autenticación |
| `cart` | Carrito de compras |
| `checkout` | Flujo de pago y confirmación |
| `library` | Biblioteca del usuario |
| `profile` | Perfil y configuración del usuario |
| `games` | Endpoints y lógica de backend para juegos |
| `users` | Endpoints y lógica de backend para usuarios |
| `purchases` | Endpoints y lógica de backend para compras |
| `db` | Schema SQL, migraciones, seed data |
| `types` | Interfaces y tipos TypeScript compartidos |
| `deps` | Instalación o actualización de dependencias |
| `config` | Archivos de configuración (vite, tailwind, eslint, etc.) |

**Ejemplos correctos:**

```bash
git commit -m "feat(store): add GameCard component with image and price"
git commit -m "feat(gamepage): add screenshots gallery with thumbnail navigation"
git commit -m "fix(cart): correct total when duplicate items are present"
git commit -m "docs(contributing): add scope convention to commit guidelines"
git commit -m "chore(deps): install tailwindcss and lucide-react"
git commit -m "chore(config): add tailwind vite plugin to vite.config.ts"
git commit -m "refactor(auth): extract login logic into useAuth hook"
git commit -m "style(navbar): adjust search bar collapse animation on mobile"
git commit -m "feat(db): add screenshots table to schema"
git commit -m "feat(games): add GET /api/v1/games endpoint with pagination"
```

**Ejemplos incorrectos:**

```bash
git commit -m "cambios"                      # ← demasiado vago, sin tipo ni scope
git commit -m "feat: add GameCard"           # ← falta el scope
git commit -m "Fixed the bug"                # ← sin tipo ni scope, con mayúscula
git commit -m "WIP"                          # ← nunca subir trabajo sin terminar
git commit -m "feat(store): GameCard"        # ← no describe qué hace
git commit -m "feat(frontend): add stuff"    # ← scope demasiado amplio
```

Un commit debe representar **una sola cosa**. Si tu descripción necesita la palabra "and", probablemente son dos commits.

---

## Pull Requests

### Antes de abrir una PR

Verifica que tu código cumpla todo esto:

- [ ] El código compila sin errores (`npm run build` o `./mvnw package`)
- [ ] No hay errores de ESLint (`npm run lint`)
- [ ] No dejaste `console.log()` ni código comentado
- [ ] Las variables de entorno nuevas están documentadas en `.env.example`
- [ ] El título de la PR sigue conventional commits (ver ejemplos abajo)
- [ ] La PR apunta a `develop`, no a `main`

### Títulos de PR — conventional commits

El título de una PR sigue el mismo formato que los commits individuales. La diferencia es que describe el trabajo completo de la rama, no un cambio puntual. Usamos **squash and merge**, así que el título de la PR se convierte en el único commit que queda en la historia de `develop`.

Formato:

```
type(scope): brief description of the complete feature
```

**Ejemplos correctos:**

```
feat(store): add store page with game grid and search
feat(auth): implement JWT authentication (register and login)
feat(cart): add shopping cart with persistent state
fix(config): resolve CORS error between frontend and backend
refactor(store): split GameCard into smaller sub-components
chore(config): configure Vercel deployment and environment variables
docs(contributing): add scope convention to commit guidelines
```

**Ejemplos incorrectos:**

```
Store page                               ← sin tipo ni scope
feat: add store page                     ← falta el scope
Feat(Store): Add Store Page              ← mayúsculas
feat(store): add store page and fix bug  ← dos cosas distintas en una PR
fix stuff                                ← sin tipo ni scope
```

La misma regla que los commits: si el título necesita "and" para dos cosas no relacionadas, probablemente son dos PRs.

### Proceso de revisión

1. Abre la PR en GitHub con un título siguiendo la convención de arriba
2. En la descripción explica brevemente **qué hace** y **cómo probarlo**
3. **[@alexandercanario225](https://github.com/alexandercanario225)** (QA) revisa primero: bugs, buenas prácticas, que el código cumpla este CONTRIBUTING
4. **[@raiksha](https://github.com/raiksha)** (Dev Lead) hace el merge final con **squash and merge**

Una PR no se mergea si:

- Tiene conflictos sin resolver
- No pasó la revisión de QA
- Rompe funcionalidad existente
- Tiene credenciales o datos sensibles commiteados

### Tamaño de las PRs

Mantén las PRs pequeñas y enfocadas. Una PR que toca 15 archivos distintos es difícil de revisar y fácil de romper. Si una feature es grande, divídela en PRs más chicas que se puedan revisar por separado.

---

## Estándares de código

### Frontend (TypeScript + React)

**Nomenclatura:**

| Elemento | Convención | Ejemplo |
|----------|-----------|---------|
| Componentes | PascalCase | `GameCard.tsx` |
| Archivos de lógica | camelCase | `gameService.ts` |
| Interfaces y tipos | PascalCase | `interface Game {}` |
| Variables y funciones | camelCase | `const gameList` |
| Clases CSS | kebab-case | `.game-card` |
| Constantes globales | UPPER_SNAKE_CASE | `const MAX_ITEMS = 10` |

**Estructura de un componente:**

```tsx
// 1. Imports externos
import { useState } from 'react'

// 2. Imports internos
import { Game } from '../types/Game'

// 3. Definición de props (siempre tipadas)
interface Props {
  game: Game
  onAddToCart: (gameId: number) => void
}

// 4. Componente
const GameCard = ({ game, onAddToCart }: Props) => {
  return (
    <div className="game-card">
      <img src={game.headerImage} alt={game.name} />
      <h3>{game.name}</h3>
    </div>
  )
}

// 5. Export al final
export default GameCard
```

**Reglas generales:**
- Máximo ~200 líneas por componente. Si crece más, divide en sub-componentes
- No uses `any` como tipo si puedes evitarlo. Si no sabes el tipo, pregunta
- Un componente hace una sola cosa
- Las llamadas a la API van siempre en `src/services/`, nunca directamente en los componentes

### Backend (Java + Spring Boot)

**Nomenclatura:**

| Elemento | Convención | Ejemplo |
|----------|-----------|---------|
| Clases | PascalCase | `GameService.java` |
| Métodos y variables | camelCase | `findByEmail()` |
| Constantes | UPPER_SNAKE_CASE | `MAX_TOKEN_LENGTH` |
| Tablas en BD | snake_case plural | `game_purchases` |
| Endpoints REST | kebab-case | `/api/v1/game-purchases` |

**Reglas generales:**
- La lógica de negocio va en `service/`, nunca en `controller/`
- Los controllers solo manejan HTTP: recibir request, llamar al service, devolver respuesta
- Usa DTOs para las respuestas de la API. Nunca devuelvas una entidad JPA directamente (puede exponer campos sensibles como `passwordHash`)
- Anota los DTOs con `@Valid` y usa `@NotBlank`, `@Email`, etc. para validar inputs

---

## Variables de entorno y seguridad

**Regla principal: ninguna credencial se sube a GitHub jamás.**

Si commiteaste una credencial por error, avisa inmediatamente a [@raiksha](https://github.com/raiksha). El historial de Git guarda todo y hay que actuar rápido.

**Lo que nunca va en el código ni en archivos commiteados:**

- Contraseñas de base de datos
- Claves JWT (`jwt.secret`)
- Connection strings de Neon.tech
- Tokens de API de cualquier servicio

**Archivos que van en `.gitignore` y nunca se tocan:**

```
frontend/.env.local
backend/src/main/resources/application-local.yaml
```

**Archivos que sí van a GitHub (sin valores reales):**

```
frontend/.env.example
backend/src/main/resources/application-local.example.yaml
```

Si necesitas agregar una variable de entorno nueva al proyecto:

1. Agrégala en `application.yaml` o `.env.example` sin el valor real
2. Documéntala en la tabla de variables del `README.md`
3. Avisa al equipo para que cada quien la agregue en su archivo local

---

*¿Algo no está cubierto en esta guía? Abre un issue o habla con [@raiksha](https://github.com/raiksha).* 🙂