import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/preppath',
  jwtSecret: process.env.JWT_SECRET || 'super_secret_preppath_jwt_key_987654321',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  // If GEMINI_API_KEY is set, disable mockAi unless MOCK_AI is explicitly 'true' with no API key
  mockAi: process.env.GEMINI_API_KEY ? process.env.MOCK_AI === 'true' && false : process.env.MOCK_AI === 'true' || !process.env.GEMINI_API_KEY,
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  aiProvider: process.env.AI_PROVIDER || 'gemini',
};
