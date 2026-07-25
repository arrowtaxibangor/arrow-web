# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start development server
npm run build        # Format with Prettier, then build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run format       # Run Prettier formatter only
```

There is no test suite configured in this project.

## Environment Variables

Required variables (create a `.env.local` file):
- `NEXT_PUBLIC_BACKEND_URL` — Base URL for the backend API (e.g., `https://api-arrowtaxi.binarymarvels.com`)
- `NEXT_PUBLIC_MAP_API_KEY` — Google Maps JavaScript API key (needs Places, Geometry, and Directions libraries)

The axios client (`utils/axios.ts`) reads `NEXT_PUBLIC_BACKEND_URL` and attaches an `auth-token` header from `localStorage['arrow-taxi']` on every request.

## Architecture Overview

**Next.js 14 App Router** with all pages under `src/app/`. The root layout (`src/app/layout.tsx`) is a `'use client'` component that wraps everything in Ant Design's `ConfigProvider` and a `QueryProvider` (React Query v3). It defers rendering until CSS is loaded (checks `document.styleSheets`).

### State Management

Two Zustand stores in `store/useStore.ts`:
- `useBookingStore` — holds computed `distance` / `returnDistance` (in miles) and `fare`; written by `BookingForm` after Google Maps DirectionsService resolves, read by fare calculation hooks
- `useGoogleMapsStore` — tracks whether the Google Maps JS API has loaded (`isLoaded`)

### Fare Calculation Pipeline

The fare engine is split across two layers:

1. **`useFareData` hook** (`Hooks/useFareData.ts`) — fetches fare rules from the backend per `vehicleTypeId` using `react-query`. Falls back to global/default fares when no vehicle is selected. Fetches four fare types in parallel: `regularFair`, `customRegularFairs`, `longRangeFairs`, and `meterStartData`.

2. **`useMultipleVehiclesFare` hook** (`utils/useCalculateMultiVehicleFare.ts`) — consumes `useFareData` results and the distance from Zustand to compute the total fare. Priority order: CustomLongRangeFair → LongRangeFair → CustomRegularFair → RegularFair. Distinguishes daytime (07:00–23:59) vs night pricing. Returns `{ totalFare, reasons }` where `reasons` are displayed in yellow text on the form.

### Location / Multi-Stop Logic

`useLocationSet` hook (`Hooks/useLocationSet.tsx`) manages a dynamic array of `LocationStop` objects (first = pickup, last = dropoff, middle = stops). The `BookingForm` creates two instances — `outbound` and `ret` — and passes them to the `LocationList` component. Dragging to reorder, adding/removing stops, and map click geocoding are all handled inside this hook.

### Services Layer

All API calls live in `services/` and import from `utils/axios.ts`. Key services:
- `booking.ts` — create/get/update bookings
- `vehicles.ts` — fetch vehicle types and get suggested vehicles by passenger count
- `dynamicPages.service.ts` — CMS page content by slug
- `setting..service.ts` — fetch global settings (e.g., `booking_enabled`, `booking_message`)
- `stripe.ts` — Stripe payment success handling

### Pages

| Route | Purpose |
|---|---|
| `/` | Home: booking form + payment methods + areas we cover |
| `/[slug]` | CMS-driven dynamic pages (ISR, 60s revalidation) |
| `/airport-transfers` | Airport-specific booking form |
| `/caernarfon-taxi`, `/snowdon-taxi`, `/luxury` | Specialised booking forms |
| `/top-destinations` | Static content page |
| `/contact` | Contact form |
| `/complete-booking/[id]` | Driver-facing form to record the charged amount |
| `/bookings/success` | Confirmation page after booking |
| `/bookings/cancel` | Stripe payment cancelled |
| `/thank-you` | Post-contact submission |

### Routing & Navigation

Nav items are defined in `utils/NavItems.ts`. Dynamic CMS page slugs are fetched from `/cms/pages/page-links` and rendered via `DynamicPage` component which supports rich HTML content and ad code sections.

### Styling

Tailwind CSS with custom breakpoints (all `max-width` based):
- `mobile`: 575px, `mobilelg`: 650px, `tablet`: 768px, `tabletlg`: 992px, `desktop`: 1200px

Primary brand color: `#265EA6` (blue). Accent: `#FEC601` (yellow). Components use Ant Design 5 alongside Tailwind.

### Code Conventions

- Prettier enforced: single quotes, 2-space indent, 100-char print width, trailing commas (ES5)
- `'use client'` directive is required on any component that uses hooks, browser APIs, or event handlers — the root layout itself is a client component, so most components inherently run client-side
- `utils/calculateFare.ts` is entirely commented out legacy code — do not revive it; the active fare logic lives in `utils/useCalculateMultiVehicleFare.ts`
- All timestamps are formatted in `Europe/London` timezone via `moment-timezone` before sending to the backend
