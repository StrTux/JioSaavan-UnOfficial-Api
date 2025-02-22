import { execSync } from 'child_process';

try {
  // Kill any existing processes on port 3001
  try {
    execSync('npx kill-port 3001');
  } catch {
    // Ignore errors if no process was running
  }

  // Start the development server
  process.env.NODE_ENV = 'development';
  process.env.PORT = '3001';
  
  execSync('vercel dev -l 3001', { stdio: 'inherit' });
} catch (error) {
  console.error('Failed to start server:', error);
  process.exit(1);
} 