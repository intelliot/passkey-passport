## Installation

1. Clone the repository.

2. Install dependencies:
   ```
   npm install
   ```

3. Set up local HTTPS:
   - Install mkcert: https://github.com/FiloSottile/mkcert
   - Run:
     ```
     mkcert -install
     mkcert localhost
     ```
   - This will generate `localhost.pem` and `localhost-key.pem` in your current directory

4. Start the development server:
   ```
   npm run dev
   ```

5. Open your browser and navigate to `https://localhost:5173` to view the app.

## Project Structure

- `src/`: Contains the source code of the application
- `public/`: Contains the public assets of the application
- `scripts/`: Contains the scripts for the application
- `index.css`: Contains the global styles of the application
- `main.js`: The entry point of the application
