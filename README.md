# Wreetfy — AI-Native Collaborative Novel Creation SaaS

> **Operating System for Collaborative Novel Creation**

**Wreetfy** is a production-ready, AI-native collaborative novel creation SaaS platform built with Next.js 15, TypeScript, Tailwind CSS, Prisma ORM, Framer Motion, and Tiptap.

---

## Key Features

1. **Collaborative Novel Writing**: Real-time rich-text editing (Tiptap engine) with live collaborator presence, word metrics, reading time, auto-save, version history diffs, and paragraph `@mention` comments.
2. **Explainable Contribution Intelligence**: Multi-factor scoring system evaluating Volume, Writing, Idea Provenance, Narrative Impact, Downstream Influence, and Structural Reorganizations.
3. **Counterfactual Impact Analysis**: Evaluates probabilistic story impacts if a user's contribution were absent.
4. **Story Brain & Memory (RAG)**: Interactive AI Story Assistant indexing lore, character secrets, and past chapter events for natural language retrieval.
5. **Story & Timeline Consistency Radar**: Automated detection of character trait contradictions and impossible travel speeds.
6. **Creative Domain Gating**: Domain selection dashboard passthrough (`/domains`) gating non-novel domains with modern modal dialogs.
7. **Demo Novel Seed**: Pre-populated novel *"The Last Kingdom of Arken"* with rich chapters, characters, worldbuilding entries, timeline events, and contribution history.

---

## Tech Stack

- **Frontend**: Next.js 15 App Router, React 19, TypeScript Strict Mode, Tailwind CSS v4, Framer Motion, Lucide Icons
- **Rich-Text Editor**: Tiptap Editor (`@tiptap/react`, `@tiptap/starter-kit`)
- **Backend & API**: Next.js App Router API Routes (`src/app/api/...`)
- **Database & ORM**: Prisma ORM with SQLite (`file:./dev.db`)
- **Auth & Security**: JWT HTTP-Only Cookie Auth (`jose`, `bcryptjs`), protected route middleware

---

## Getting Started

### 1. Prerequisites
- Node.js 18+ & npm

### 2. Installation
```bash
git clone <repository-url>
cd wreetfy
npm install
```

### 3. Database Migration & Seed
```bash
# Push schema and populate sample novel "The Last Kingdom of Arken"
npm run db:push
npm run db:seed
```

### 4. Running Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Demo Credentials

You can log in with the pre-populated demo author credentials:
- **Email**: `sarah@novel.app`
- **Password**: `password123`

---

## Project Structure Overview

```text
src/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx          # Login Page
│   │   └── register/page.tsx       # Register Page
│   ├── api/
│   │   ├── auth/                   # login, register, logout, me
│   │   ├── projects/               # CRUD projects
│   │   ├── chapters/               # chapter save & versioning
│   │   ├── contributions/          # 6-factor score calculator
│   │   └── intelligence/           # RAG assistant & consistency radar
│   ├── domains/page.tsx            # Domain Selection Gating
│   ├── dashboard/page.tsx          # Novel Workspace Dashboard
│   ├── novel/[projectId]/
│   │   ├── layout.tsx              # Collapsible Workspace Sidebar
│   │   ├── overview/page.tsx       # Project Overview
│   │   ├── chapters/page.tsx       # Chapter Management
│   │   ├── editor/page.tsx         # Tiptap Collaborative Editor
│   │   ├── characters/page.tsx     # Character Profiles
│   │   ├── worldbuilding/page.tsx   # World Wiki
│   │   ├── timeline/page.tsx       # Chronological Story Timeline
│   │   ├── plot/page.tsx           # Plot Flow Visualizer
│   │   ├── ideas/page.tsx          # Idea Provenance System
│   │   ├── contribution/page.tsx   # Explainable Contribution Intelligence
│   │   ├── intelligence/page.tsx   # Story Brain Assistant
│   │   ├── team/page.tsx           # Collaborators & Permissions
│   │   └── settings/page.tsx       # Project Configuration
│   └── profile/page.tsx            # User Profile
├── lib/
│   ├── auth.ts                     # JWT & Password Hash utils
│   ├── db.ts                       # Prisma Client Singleton
│   ├── ai-provider.ts              # Abstracted AI Provider Interface
│   └── contribution-engine.ts      # Diff & 6-Factor Score Algorithm
└── prisma/
    ├── schema.prisma               # Database Schema
    └── seed.ts                     # Pre-populated Demo Seed Data