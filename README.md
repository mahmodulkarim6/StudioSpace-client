# StudioSpace - Peer-to-Peer Creative Studio Marketplace

**Live Site:** https://studiospace-client-iota.vercel.app
**Server API:** https://studiospace-server-lovat.vercel.app
**Server Repository:** https://github.com/YOUR-USERNAME/studiospace-server

StudioSpace is a peer-to-peer marketplace where filmmakers, photographers, podcasters and musicians discover, filter and book creative studios by the hour, and studio owners list their spaces and manage booking requests.

## Examiner Test Credentials

| Role | Email | Password |
| --- | --- | --- |
| Creator / Examiner | `examiner@studiospace.com` | `Examiner1` |
| Studio Host | `host@studiospace.com` | `Host1234` |

Log in as the **Host** and open **My Bookings > Requests for my studios** to confirm a booking. Then log in as the **Examiner** and try to book the same time slot to see the double-booking prevention.

> The API runs on a free Render plan, so the first request after a period of inactivity can take 30 to 60 seconds.

## Key Features

- **Home page:** Swiper hero slider with 3 slides, featured studios fetched from MongoDB with `.limit(6)`, category cards that open `/studios` with the category pre-selected, "How StudioSpace Works" and "Host Guarantee" sections.
- **Authentication with Better Auth:** email/password and Google login, password validation (uppercase, lowercase, 6+ characters), registration with a Photo URL box and a photo import option, session stored in an HTTPOnly cookie.
- **Protected private routes:** `/add-studio`, `/my-listings`, `/studios/edit/[id]`, `/my-bookings` and `/dashboard`. A logged-in user stays logged in when reloading any private route.
- **Full studio CRUD:** add, view, update and delete studios, with owner-only access, image upload through imgbb, amenities, deposit and capacity, and a confirmation modal before deleting.
- **Studio details page:** gallery carousel, amenities, host details, reviews and a booking modal with a live price breakdown.
- **Booking system:** requests start as Pending, hosts can confirm, decline or complete them, and users can cancel pending bookings. Status badges show Pending, Confirmed, Completed or Cancelled.
- **Double-booking prevention:** the server rejects a booking that overlaps an existing Confirmed booking and returns a clear error message.
- **API security:** all create, update and delete requests are checked on the server and return `401 Unauthorized` when the user is not logged in.
- **Search, filter and sort:** search studios by name or location, filter by category and sort by newest, rating or price.
- **Theme toggle:** a light and dark mode switch that changes the whole site and remembers the choice.
- **Polished experience:** skeleton loaders, a custom 404 page, friendly empty states, Sonner toast notifications and custom modals instead of browser alerts, and a layout that works on mobile, tablet and desktop.
- **Optional extras:** downloadable PDF invoice for confirmed bookings and a saved studios wishlist stored in MongoDB.

## Tech Stack

- **Frontend:** Next.js 14 (App Router), React 18, Tailwind CSS, daisyUI, Swiper, Sonner, React Icons, jsPDF
- **Authentication:** Better Auth (MongoDB adapter, JWT session cookie), Google OAuth
- **Backend:** Node.js, Express.js, MongoDB (Atlas)
- **Image hosting:** imgbb
- **Deployment:** Vercel (client) and Render (server)

## Local Setup

**Requirements:** Node.js 18 or newer, a MongoDB Atlas database, and optionally a Google OAuth client and an imgbb API key.

### 1. Start the server
```bash
git clone https://github.com/YOUR-USERNAME/studiospace-server.git
cd studiospace-server
npm install
cp .env
```
Fill in `.env`:
```
PORT=5000
MONGODB_URI=your MongoDB connection string (database name: studiospace)
BETTER_AUTH_SECRET=a random string of 32 or more characters
CLIENT_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your Google OAuth client id
GOOGLE_CLIENT_SECRET=your Google OAuth client secret
NODE_ENV=development
```
Then add demo studios and the test users, and start the server:
```bash
npm run seed
npm run dev
```

### 2. Start the client
```bash
git clone https://github.com/YOUR-USERNAME/studiospace-client.git
cd studiospace-client
npm install
cp .env.example .env
```
Fill in `.env`:
```
SERVER_URL=https://studiospace-server-lovat.vercel.app
NEXT_PUBLIC_IMGBB_KEY=your imgbb API key
```
Then run:
```bash
npm run dev
```
Open http://localhost:3000.

### Google login (optional)
In Google Cloud Console, add this **Authorized redirect URI** to your OAuth client:
`http://localhost:3000/api/auth/callback/google`
For the live site, add `https://YOUR-VERCEL-URL.vercel.app/api/auth/callback/google` as well.

## Project Structure
```
app/            Pages and routes (App Router)
components/     Navbar, Footer, Logo, StudioCard, BookingModal and more
context/        Auth context (Better Auth session)
lib/            API helper and Better Auth client
```
