import { Router, Request, Response } from 'express';
import { FreqCivilService } from '@services/FreqCivilService';

const router = Router();
const freqCivilService = new FreqCivilService();

interface AuthenticatedRequest extends Request {
  session: Request['session'] & {
    civilId?: string;
  };
}

const requireAuth = (req: AuthenticatedRequest, res: Response, next: Function) => {
  if (!req.session.civilId) {
    return res.redirect('/civil_login');
  }
  next();
};

router.post('/update-name', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { civilName } = req.body;
    const civilId = req.session.civilId!;

    if (!civilName || civilName.trim().length === 0) {
      return res.json({ success: false, error: 'Name cannot be empty' });
    }

    const isUnique = await freqCivilService.isNameUnique(civilName.trim(), civilId);
    if (!isUnique) {
      return res.json({ success: false, error: 'Name already exists. Please choose a different name.' });
    }

    const success = await freqCivilService.updateCivilName(civilId, civilName.trim());
    if (success) {
      return res.json({ success: true });
    } else {
      return res.json({ success: false, error: 'Failed to update name' });
    }
  } catch (error) {
    console.error('Update name error:', error);
    return res.json({ success: false, error: 'Server error occurred' });
  }
});

router.get('/profile', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const civilId = req.session.civilId!;
    const civil = await freqCivilService.findById(civilId);

    if (!civil) {
      return res.status(404).json({ error: 'User not found' });
    }

    const mainRootFreq = await freqCivilService.getRootFreqDetails(civil.main_root_freq);
    const subRootFreq = await freqCivilService.getRootFreqDetails(civil.sub_root_freq);
    const soulType = await freqCivilService.getSoulTypeDetails(civil.soul_id);

    return res.json({
      civil,
      mainRootFreq,
      subRootFreq,
      soulType
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({ error: 'Server error occurred' });
  }
});

export default router;