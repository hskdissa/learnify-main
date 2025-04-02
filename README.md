# Learnify 

## 🚀 Getting Started

### **1. Install Dependencies**
Run the following command in the project root:
```sh
bun install
```

### **2. Running the App**
To start both the **frontend** (React) and **backend** (Express):
```sh
bun run dev
```
This will:
- Start the **backend** using Bun (`backend/server.js`)
- Start the **frontend** using Vite (`frontend/`)
- Run both processes concurrently

If you want to start them separately:
```sh
bun run server   # Starts backend
bun run client   # Starts frontend
```

### **3. Building for Production**
To build the frontend for production:
```sh
bun run build
```

To preview the production build:
```sh
bun run preview
```

## 🛠 Testing
### **Run Tests**
This project uses **Vitest** for testing:
```sh
bun run test
```

## 📂 Project Structure
```
Learnify/
│── backend/          # Mongo/Express API Backend
│── frontend/         # React Frontend with Vite
│── node_modules/     # Installed dependencies
│── package.json      # Project configuration
│── bun.lockb         # Bun package lockfile
│── README.md         # Documentation
```

## 🔹 Notes on Migration from CRA to Vite
- **`react-scripts` removed** → `vite` now handles builds
- **Jest replaced with Vitest** → Faster unit testing
- **No `browserslist`** → Vite doesn’t require it
- **Removed `reportWebVitals.js`** → CRA specific, not needed

## 📜 License
This project is licensed under the ISC License.

---

This project is now powered by **Bun** and **Vite**, replacing Create React App (CRA).
