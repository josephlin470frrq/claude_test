import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';

dotenv.config();

interface GoogleProfile {
  id: string;
  displayName: string;
  name?: {
    familyName: string;
    givenName: string;
  };
  emails?: Array<{
    value: string;
    verified: boolean;
  }>;
}

export const configurePassport = () => {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: process.env.CALLBACK_URL || '/auth/google/callback'
  },
  async (accessToken: string, refreshToken: string, profile: GoogleProfile, done: any) => {
    try {
      const userProfile = {
        id: profile.id,
        displayName: profile.displayName,
        name: profile.displayName,
        email: profile.emails?.[0]?.value,
        verified: profile.emails?.[0]?.verified || false
      };

      return done(null, userProfile);
    } catch (error) {
      console.error('Google strategy error:', error);
      return done(error, null);
    }
  }));

  passport.serializeUser((user: any, done) => {
    done(null, user);
  });

  passport.deserializeUser((user: any, done) => {
    done(null, user);
  });
};

export default configurePassport;