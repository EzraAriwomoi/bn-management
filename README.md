# Booking Management Dashboard

A modern, responsive **Booking Management Dashboard** built with **React (JSX)**, **Vite**, **Tailwind CSS**, and **shadcn/ui**. The application is designed for managing, filtering, and viewing bookings efficiently across all device sizes.

---

## Features

* **Fast development** with Vite + React
* **Clean UI** using Tailwind CSS & shadcn/ui
* **Fully responsive** (mobile, tablet, desktop)
* **Booking filters** (search, platform, payment status, stay status)
* **Data tables** with badges and actions
* **Light & Dark mode** support
* Component-based, scalable structure

---

## Tech Stack

* **React** (JSX)
* **Vite**
* **Tailwind CSS**
* **shadcn/ui**
* **Lucide Icons**

---

## Project Structure

```
src/
├── components/
│   ├── ui/            # shadcn UI components
│   ├── bookings/      # Booking-related components
│
├── data/
│   └── types.js       # Shared data structures (Booking shape)
│
├── pages/
│   └── dashboard.jsx
│
├── App.jsx
├── main.jsx
├── index.css
```

---

## Getting Started

### 1️ Clone the repository

```bash
git clone <your-repo-url>
cd <project-folder>
```

### 2️ Install dependencies

```bash
npm install
```

### 3️ Start the development server

```bash
npm run dev
```

The app will be available at:

```
http://localhost:5173
```

---

## Styling & Layout Notes

* The app uses **Tailwind CSS** for layout and spacing
* Global styles are configured to allow **full-width dashboards**
* No forced centering on `body` or `#root`
* Responsiveness is handled via Tailwind breakpoints (`sm`, `md`, `lg`, `xl`)

---

## UI Components

Reusable UI components are provided via **shadcn/ui**, including:

* `Table`, `TableRow`, `TableCell`
* `Badge`
* `Button`

These live in:

```
src/components/ui/
```

---

## State & Data Flow

* Booking data is passed as props
* Filtering logic lives in `BookingsFilter`
* Filtered results are returned via callbacks
* No TypeScript is used — **pure JSX + JavaScript**

---

## Build for Production

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

---

## Future Improvements

* Pagination & server-side filtering
* Export bookings (CSV / PDF)
* Role-based access
* API integration
* Authentication

---

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

---

## License

This project is licensed under the **MIT License**.

---
