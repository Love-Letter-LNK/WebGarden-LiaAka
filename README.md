# Lia & Zekk Digital Garden 🌸

Welcome to our Digital Garden! This is a personal space for Lia and Zekk to share memories, updates, and our journey together. The website is designed with a nostalgic "2005-2010 Kawaii" retro aesthetic, featuring pixel art, pastel colors, and a cozy atmosphere.

![Digital Garden Preview](client/public/glia.png)

## ✨ Features

- **Memories**: A photo gallery to store our precious moments.
- **Journey**: A timeline of our milestones and story.
- **News**: Updates and announcements about us.
- **Profiles**: Personalized profile pages for Zekk and Lia with fun facts and bios.
- **Interactive Elements**: Music player, guestbook, and retro-themed UI components.
- **Admin Panel**: A secured dashboard to manage all content (photos, news, milestones, messages).

## 🛠️ Tech Stack

### Client (`/client`)
- **Framework**: [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + Custom CSS for Retro effects.
- **Key Libraries**: `framer-motion` (animations), `lucide-react` (icons), `howler` (audio).

### Server (`/server`)
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: SQLite (Dev) / PostgreSQL (Prod) via [Prisma ORM](https://www.prisma.io/).
- **Authentication**: JWT (JSON Web Tokens) in HttpOnly cookies.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- NPM or Yarn

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/zekkcode/liaaka.git
    cd liaaka
    ```

2.  **Install Dependencies**
    ```bash
    # Install root dependencies
    npm install

    # Install client dependencies
    cd client && npm install

    # Install server dependencies
    cd ../server && npm install
    ```

3.  **Setup Database (Server)**
    ```bash
    cd server
    # Create .env file based on example
    # Run migrations
    npx prisma db push
    # Seed data
    npm run db:seed
    ```

4.  **Run Development Servers**
    ```bash
    # Run both client and server (from root if configured, or separately)
    
    # Terminal 1 (Server)
    cd server
    npm run dev

    # Terminal 2 (Client)
    cd client
    npm run dev
    ```

## 🛡️ Security

Specific security measures have been implemented:
- **Rate Limiting**: Protection against brute-force and DDoS.
- **Secure Headers**: Using `helmet` for HTTP security.
- **Secure Cookies**: HttpOnly and Secure flags for JWT.

## 📄 License

Private repository for Zekk & Lia. All rights reserved.
