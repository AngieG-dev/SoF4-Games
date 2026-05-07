# SoF4-Games

> *"System.out.Five() for Games"* — una tienda de videojuegos inspirada en Steam, creada como proyecto integrador para la Cohorte 24 del Java Full Stack Bootcamp de Generation Chile.

<div align="center">
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=flat" alt="License: MIT" />
  <img src="https://img.shields.io/badge/Java-21-ED8B00?style=flat&logo=openjdk&logoColor=white" alt="Java 21" />
  <img src="https://img.shields.io/badge/Spring_Boot-3.2-6DB33F?style=flat&logo=springboot&logoColor=white" alt="Spring Boot 3.2" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript&logoColor=white" alt="TypeScript 5" />
  <img src="https://img.shields.io/badge/PostgreSQL-Neon.tech-336791?style=flat&logo=postgresql&logoColor=white" alt="PostgreSQL" />
</div>

---

## Descripción

SoF4-Games es un MVP de tienda de videojuegos inspirado en Steam. Permite a los usuarios explorar un catálogo de juegos, gestionar una biblioteca personal, agregar juegos al carrito, realizar checkout simulado y mantener una lista de amigos.

Construido con React + TypeScript en el frontend y Spring Boot + PostgreSQL en el backend.

---

## Funcionalidades

- Catálogo de juegos con imágenes desde la CDN de Steam
- Página de detalle por juego (descripción, screenshots, precio)
- Carrito de compras y checkout simulado
- Biblioteca personal de juegos comprados
- Perfil de usuario
- Lista de amigos (sidebar overlay)
- Registro e inicio de sesión con autenticación JWT

---

## Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | React 19 + TypeScript 5 (Vite) |
| Backend | Java 21 + Spring Boot 3.2 |
| Base de datos | PostgreSQL en Neon.tech |
| Autenticación | Spring Security + JWT (jjwt) |
| Deploy frontend | Vercel |
| Deploy backend | Railway |
| Diseño | Figma |
| Gestión de tareas | Jira |

---

## Requisitos previos

Asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) v22 LTS o superior
- [Java 21](https://adoptium.net/)
- [Maven](https://maven.apache.org/) (o usar el `mvnw` incluido)
- Una cuenta en [Neon.tech](https://neon.tech) para la base de datos local (o PostgreSQL local)

---

## Instalación y ejecución local

### 1. Clonar el repositorio

```bash
git clone https://github.com/raiksha/SoF4-Games.git
cd SoF4-Games
```

### 2. Configurar el backend

```bash
cd backend
```

Copia el archivo de ejemplo y rellena tus credenciales:

```bash
cp src/main/resources/application-local.example.yaml \
   src/main/resources/application-local.yaml
```

Edita `application-local.yaml` con tu URL de Neon.tech, usuario, contraseña y una clave JWT.

En IntelliJ, ve a **Edit Configurations → Environment variables** y agrega:

```
SPRING_PROFILES_ACTIVE=local
```

Luego corre el backend:

```bash
./mvnw spring-boot:run
```

El servidor queda disponible en `http://localhost:8080`.

### 3. Configurar el frontend

```bash
cd ../frontend
```

Copia el archivo de ejemplo:

```bash
cp .env.example .env.local
```

El archivo `.env.example` ya tiene los valores correctos para desarrollo local, no necesitas editarlo a menos que tu backend corra en un puerto distinto.

Instala las dependencias y levanta el servidor de desarrollo:

```bash
npm install
npm run dev
```

La aplicación queda disponible en `http://localhost:5173`.

---

## Variables de entorno

### Frontend (`frontend/.env.local`)

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `VITE_API_URL` | URL base de la API REST | `http://localhost:8080/api/v1` |

### Backend (`backend/src/main/resources/application-local.yaml`)

| Variable | Descripción |
|----------|-------------|
| `DATABASE_URL` | Connection string de Neon.tech |
| `DB_USER` | Usuario de la base de datos |
| `DB_PASSWORD` | Contraseña de la base de datos |
| `JWT_SECRET` | Clave secreta para firmar tokens JWT (mínimo 32 caracteres) |

---

## Estructura del proyecto

```
SoF4-Games/
├── frontend/                  # React + TypeScript (Vite)
│   ├── src/
│   │   ├── assets/
│   │   ├── components/        # Componentes reutilizables
│   │   ├── context/           # Estado global (AuthContext, CartContext)
│   │   ├── hooks/             # Custom hooks
│   │   ├── pages/             # Una por cada ruta
│   │   ├── services/          # Llamadas HTTP (Axios)
│   │   ├── types/             # Interfaces TypeScript
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── .env.example
│   └── vite.config.ts
│
└── backend/                   # Spring Boot (Java 21)
    └── src/main/java/com/sofagames/backend/
        ├── controller/        # Endpoints REST
        ├── dto/               # Objetos de transferencia de datos
        ├── model/             # Entidades JPA
        ├── repository/        # Interfaces JPA
        ├── security/          # Spring Security + JWT
        └── service/           # Lógica de negocio
```

---

## Scripts disponibles

### Frontend

```bash
npm run dev       # Servidor de desarrollo (localhost:5173)
npm run build     # Build de producción → /dist
npm run preview   # Preview del build localmente
npm run lint      # Revisar errores de ESLint
```

### Backend

```bash
./mvnw spring-boot:run   # Corre el backend en desarrollo
./mvnw package           # Genera el JAR de producción
./mvnw test              # Corre los tests
```

---

## Equipo

| Rol | Nombre | GitHub | LinkedIn |
|-----|--------|--------|----------|
| Scrum Master | Diego Castillo | [@MiskTake](https://github.com/MiskTake) | [LinkedIn](https://www.linkedin.com/in/diegocastillorojas/) |
| Dev Lead & Arquitectura | María Constanza Riquelme | [@raiksha](https://github.com/raiksha) | [LinkedIn](https://www.linkedin.com/in/mariariquelme-dev/) |
| QA & PR Reviewer | Alexander Canario | [@alexandercanario225](https://github.com/alexandercanario225) | [LinkedIn](https://www.linkedin.com/in/alexander-canario-619530265/) |
| Documentación | Pablo Fuentes | [@PabloDesk](https://github.com/PabloDesk) | [LinkedIn](https://www.linkedin.com/in/pablodesk/) |
| Dev Frontend | Angela Galleguillos | [@AngieG-dev](https://github.com/AngieG-dev) | [LinkedIn](https://www.linkedin.com/in/angela-galleguillos/) |
| Dev Frontend | Julio Oyarzún | [@mkjota](https://github.com/mkjota) | [LinkedIn](https://www.linkedin.com/in/julio-oyarzun-5853873b8/) |

---

## Licencia

Este proyecto está bajo la licencia [MIT](LICENSE).

---

*Generation Chile — Bootcamp Java Full Stack — Cohorte 24 — 2026*