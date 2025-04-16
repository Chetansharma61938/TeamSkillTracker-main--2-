import { createServer } from 'http';
import express from 'express';
import { registerRoutes } from '../server/routes';
import { closePool } from '../server/db';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Initialize routes
const initializeApp = async () => {
  const server = await registerRoutes(app);
  
  if (!process.env.VERCEL) {
    // Start the server normally for local development
    const port = process.env.PORT || 5000;
    server.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  }

  // Add error handling middleware
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  });
  
  return app;
};

// Initialize the app
const handler = initializeApp();

// Export the Express app for Vercel serverless deployment
export default handler;

// Cleanup function for serverless environment
export const config = {
  api: {
    bodyParser: false,
  },
}; 