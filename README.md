# Shri Laxmi Sweet Mart (श्री लक्ष्मी स्वीट मार्ट)
### Mapusa, Goa • Operating Since 1985

A premium modern 3D product showcase and brand experience website for **Shri Laxmi Sweet Mart**, a traditional Indian sweet shop and halwai operating in Mapusa, Goa since 1985.

---

## 📍 Verified Business Facts
- **Legal/Trade Name**: Shri Laxmi Sweet Mart
- **Category**: Sweet shop / Halwai (Khoya Sweets, Kaju Katli, Laddoo, Ras Malai, Namkeen, Dry Fruits, Bakery, Dairy Products)
- **Established**: 1985
- **Address**: Shop No. 1, Near KTC Bus Stand, Main Road, Mapusa, Goa 403507
- **Phone Numbers**: 094233 13875 (Mobile) / 0832-2250518 (Landline)
- **Business Scale**: Registered Proprietorship, GST-Registered (~11–25 employees)

---

## 🎯 Primary Purpose & Scope
This version of the website is built specifically as a **product showcase and business information website**:
- **Discover & Explore**: Customers can browse sweets across the 8 verified categories, view high-res product information, allergen notes, and interactive 3D models.
- **Call & Visit**: Clear CTAs encouraging customers to call (`094233 13875` / `0832-2250518`) or visit the shop counter in Mapusa in person to taste and purchase.
- **Strictly Non-E-Commerce**: Intentionally contains no checkout, no shopping cart, no payment gateways, no customer accounts, no warehouse stock counters, and no fake delivery services.
- **Authentic Data & Sample Disclaimers**: All sample images are clearly labeled as *"Sample Image — Replace with shop photo"*, and prices are explicitly presented as *"Indicative reference prices"*.

---

## 🛠️ Tech Stack
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide React
- **3D WebGL**: Three.js, React Three Fiber (`@react-three/fiber`), React Three Drei (`@react-three/drei`)
- **Backend**: Node.js, Express.js REST API
- **Database Engine**: Persistent JSON / SQLite Storage Engine with Prisma schema support
- **Auth**: JWT Authentication for `/admin` with `admin` role protection
- **Image Uploads**: Multer local disk storage to `/public/products` (Cloudinary ready)

---

## 🚀 Quick Start Guide

### 1. Start the Backend REST API
```bash
cd server
npm install
npm run dev
```
*Backend runs at: `http://localhost:5001`*

### 2. Start the Frontend Storefront
```bash
# In the project root
npm install
npm run dev
```
*Frontend runs at: `http://localhost:5173`*

---

## 🔐 Admin Portal (`/admin`)

The Admin Portal is a dedicated SaaS interface for the shop owner to manage the public showcase without touching code:
- **Default Admin Email**: `admin@shrilaxmisweetmart.com`
- **Default Password**: `admin1985`

### Admin Capabilities:
1. **Add / Edit / Delete Sweets**: Update product name, Devanagari title, category (from the 8 verified categories), description, indicative price, and unit.
2. **Public Visibility Toggle (`isVisible`)**: Instantly hide seasonal or out-of-season items from the public website.
3. **Festive Specials Toggle (`isFestiveSpecial`)**: Highlight celebratory specials (e.g. Diwali, Ganesh Chaturthi gift assortments) in the homepage curated section.
4. **Upload Real Shop Photos**: Upload fresh photographs taken at the Mapusa shop counter directly to the public catalog.

---

## 📸 Replacing Placeholder Content with Real Shop Data

1. Log in to the **Admin Dashboard** (`/admin`).
2. Click **"Edit"** on any item or click **"Add New Product"**.
3. Enter the authentic sweet name and today's indicative reference price.
4. Use the **Upload Photo** file picker to select a real photograph taken at Shop No. 1, Mapusa.
5. Click **"Save Product"** — the live storefront will immediately display your real photograph and pricing.

---

## 🔮 Future-Proof Expansion Path
The backend data models and REST endpoints are cleanly modularized. When Shri Laxmi Sweet Mart is ready to introduce online ordering and local delivery in a future version, a `Cart` -> `Order` -> `Payment` pipeline can be integrated seamlessly without rewriting the product showcase foundation.
