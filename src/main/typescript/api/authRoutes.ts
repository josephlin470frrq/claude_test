import { Router } from 'express';
import passport from 'passport';
import { FreqCivilService } from '@services/FreqCivilService';

const router = Router();
const freqCivilService = new FreqCivilService();

router.get('/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    accessType: 'offline'
  })
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/civil_login' }),
  async (req, res) => {
    try {
      const user = req.user as any;
      if (!user) {
        return res.redirect('/civil_login?error=auth_failed');
      }

      const existingCivil = await freqCivilService.findByEmail(user.email);

      if (existingCivil && existingCivil.civil_particip) {
        req.session.civilId = existingCivil.civil_id;
        return res.redirect('/civil_main');
      }

      if (existingCivil && !existingCivil.civil_particip) {
        return res.redirect('/civil_login?error=account_not_active');
      }

      const civilId = freqCivilService.generateCivilId(user.email);
      const success = await freqCivilService.createCivil({
        civilId,
        civilName: user.displayName || user.name || '',
        civilEmail: user.email
      });

      if (success) {
        req.session.civilId = civilId;
        return res.redirect('/civil_new');
      } else {
        return res.redirect('/civil_login?error=registration_failed');
      }
    } catch (error) {
      console.error('Google auth callback error:', error);
      return res.redirect('/civil_login?error=server_error');
    }
  }
);

router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Logout error:', err);
    }
    req.session.destroy((err) => {
      if (err) {
        console.error('Session destroy error:', err);
      }
      res.redirect('/civil_login');
    });
  });
});

export default router;