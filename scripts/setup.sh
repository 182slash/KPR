#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# KPR Website — Full Setup Script
# Usage: chmod +x scripts/setup.sh && ./scripts/setup.sh
# ─────────────────────────────────────────────────────────────────────────────

set -e

RESET="\033[0m"
BOLD="\033[1m"
BLUE="\033[34m"
CYAN="\033[36m"
GREEN="\033[32m"
YELLOW="\033[33m"
RED="\033[31m"

print_banner() {
  echo -e "${BLUE}${BOLD}"
  echo "  ██╗  ██╗██████╗ ██████╗ "
  echo "  ██║ ██╔╝██╔══██╗██╔══██╗"
  echo "  █████╔╝ ██████╔╝██████╔╝"
  echo "  ██╔═██╗ ██╔═══╝ ██╔══██╗"
  echo "  ██║  ██╗██║     ██║  ██║"
  echo "  ╚═╝  ╚═╝╚═╝     ╚═╝  ╚═╝"
  echo -e "${RESET}"
  echo -e "${CYAN}${BOLD}  Kelompok Penerbang Roket — Setup Script${RESET}"
  echo -e "  ${BLUE}https://github.com/182slash/Bataknese${RESET}\n"
}

step() {
  echo -e "\n${CYAN}${BOLD}▶  $1${RESET}"
}

success() {
  echo -e "${GREEN}✓  $1${RESET}"
}

warn() {
  echo -e "${YELLOW}⚠  $1${RESET}"
}

error_exit() {
  echo -e "${RED}✗  ERROR: $1${RESET}" >&2
  exit 1
}

# ─── Check prerequisites ──────────────────────────────────────────────────────
check_prereqs() {
  step "Checking prerequisites..."

  command -v node >/dev/null 2>&1 || error_exit "Node.js is required. Install from https://nodejs.org (v20+)"
  command -v npm  >/dev/null 2>&1 || error_exit "npm is required."

  NODE_VERSION=$(node --version | sed 's/v//')
  NODE_MAJOR=$(echo "$NODE_VERSION" | cut -d. -f1)
  if [ "$NODE_MAJOR" -lt 18 ]; then
    error_exit "Node.js 18+ required. Current: $NODE_VERSION"
  fi

  success "Node.js $(node --version) — OK"
  success "npm $(npm --version) — OK"
}

# ─── Root install ─────────────────────────────────────────────────────────────
install_root() {
  step "Installing root workspace dependencies..."
  npm install
  success "Root dependencies installed"
}

# ─── Frontend setup ───────────────────────────────────────────────────────────
setup_frontend() {
  step "Setting up frontend (Next.js 14)..."

  cd frontend

  npm install
  success "Frontend dependencies installed"

  if [ ! -f ".env.local" ]; then
    cp .env.example .env.local
    warn ".env.local created from .env.example — EDIT IT before running!"
  else
    warn ".env.local already exists — skipping copy"
  fi

  cd ..
}

# ─── Backend setup ────────────────────────────────────────────────────────────
setup_backend() {
  step "Setting up backend (Express + Prisma)..."

  cd backend

  npm install
  success "Backend dependencies installed"

  if [ ! -f ".env" ]; then
    cp .env.example .env
    warn ".env created from .env.example — EDIT IT with real credentials before running!"
  else
    warn ".env already exists — skipping copy"
  fi

  # Generate Prisma client (even without DB connection for type generation)
  if grep -q "DATABASE_URL=postgresql" .env 2>/dev/null; then
    echo "  Generating Prisma client..."
    npx prisma generate 2>/dev/null && success "Prisma client generated" || warn "Prisma generate failed — run manually after setting DATABASE_URL"
  else
    warn "DATABASE_URL not set yet — run 'npx prisma generate' after configuring .env"
  fi

  cd ..
}

# ─── Database setup ───────────────────────────────────────────────────────────
setup_database() {
  step "Database setup..."

  cd backend

  if [ -f ".env" ] && grep -q "^DATABASE_URL=postgresql://postgres:\[PASSWORD\]" .env 2>/dev/null; then
    warn "DATABASE_URL still has placeholder — skipping DB migration & seed"
    warn "After setting DATABASE_URL, run:"
    echo "    cd backend && npx prisma migrate deploy && npm run db:seed"
    cd ..
    return
  fi

  # Run migrations
  echo "  Running Prisma migrations..."
  if npx prisma migrate deploy 2>/dev/null; then
    success "Database migrations applied"
  else
    warn "Migration failed — check DATABASE_URL in backend/.env"
    cd ..
    return
  fi

  # Seed
  echo "  Seeding database..."
  if npm run db:seed 2>/dev/null; then
    success "Database seeded"
  else
    warn "Seed failed — you can run it manually: cd backend && npm run db:seed"
  fi

  cd ..
}

# ─── Git remote check ─────────────────────────────────────────────────────────
check_git() {
  step "Git repository..."

  if [ -d ".git" ]; then
    REMOTE=$(git remote get-url origin 2>/dev/null || echo "none")
    success "Git repo found — remote: $REMOTE"
  else
    warn "No git repo found. Initialize with:"
    echo "    git init && git remote add origin https://github.com/182slash/Bataknese.git"
  fi
}

# ─── Print dev instructions ───────────────────────────────────────────────────
print_instructions() {
  echo ""
  echo -e "${BLUE}${BOLD}═══════════════════════════════════════════════════════════${RESET}"
  echo -e "${GREEN}${BOLD}  ✓  KPR Website Setup Complete!${RESET}"
  echo -e "${BLUE}${BOLD}═══════════════════════════════════════════════════════════${RESET}"

  echo ""
  echo -e "${BOLD}  BEFORE YOU RUN:${RESET}"
  echo -e "  ${YELLOW}1. Edit ${BOLD}frontend/.env.local${RESET}${YELLOW} with your credentials${RESET}"
  echo -e "  ${YELLOW}2. Edit ${BOLD}backend/.env${RESET}${YELLOW} with your credentials${RESET}"
  echo -e "  ${YELLOW}3. Create accounts: Supabase, Cloudinary, Midtrans, Resend${RESET}"
  echo ""
  echo -e "${BOLD}  DEVELOPMENT:${RESET}"
  echo -e "  ${CYAN}# Terminal 1 — Backend API${RESET}"
  echo -e "  cd backend && npm run dev"
  echo ""
  echo -e "  ${CYAN}# Terminal 2 — Frontend${RESET}"
  echo -e "  cd frontend && npm run dev"
  echo ""
  echo -e "  ${CYAN}# Or run both at once from root:${RESET}"
  echo -e "  npm run dev"
  echo ""
  echo -e "${BOLD}  URLS:${RESET}"
  echo -e "  Frontend : ${CYAN}http://localhost:3000${RESET}"
  echo -e "  API      : ${CYAN}http://localhost:4000${RESET}"
  echo -e "  Health   : ${CYAN}http://localhost:4000/health${RESET}"
  echo -e "  Prisma   : ${CYAN}cd backend && npx prisma studio${RESET}"
  echo ""
  echo -e "${BOLD}  DATABASE COMMANDS:${RESET}"
  echo -e "  cd backend"
  echo -e "  npx prisma generate        # Regenerate client"
  echo -e "  npx prisma migrate deploy  # Apply migrations"
  echo -e "  npm run db:seed            # Seed with sample data"
  echo -e "  npx prisma studio          # GUI database browser"
  echo ""
  echo -e "${BOLD}  DEPLOY:${RESET}"
  echo -e "  Frontend → ${CYAN}https://vercel.com${RESET} (connect GitHub, set root to frontend/)"
  echo -e "  Backend  → ${CYAN}https://cloud.digitalocean.com/apps${RESET} (use .do/app.yaml)"
  echo ""
  echo -e "${BLUE}${BOLD}═══════════════════════════════════════════════════════════${RESET}"
  echo -e "${CYAN}  Kelompok Penerbang Roket — kpr.band${RESET}"
  echo -e "${BLUE}${BOLD}═══════════════════════════════════════════════════════════${RESET}"
  echo ""
}

# ─── Main ─────────────────────────────────────────────────────────────────────
main() {
  print_banner
  check_prereqs
  install_root
  setup_frontend
  setup_backend
  setup_database
  check_git
  print_instructions
}

main "$@"
