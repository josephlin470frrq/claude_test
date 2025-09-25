import { db } from './database';
import { FreqCivil, CivilRole, RootFreq, RootFreqUI, SoulTypeUI } from '@models/FreqCivil';

export class FreqCivilService {
  async findByEmail(email: string): Promise<FreqCivil | null> {
    const query = 'SELECT * FROM freq0097.freq_civil WHERE civil_email = $1';
    const result = await db.query<FreqCivil>(query, [email]);
    return result.rows[0] || null;
  }

  async findById(civilId: string): Promise<FreqCivil | null> {
    const query = 'SELECT * FROM freq0097.freq_civil WHERE civil_id = $1';
    const result = await db.query<FreqCivil>(query, [civilId]);
    return result.rows[0] || null;
  }

  async isNameUnique(name: string, excludeId?: string): Promise<boolean> {
    let query = 'SELECT COUNT(*) as count FROM freq0097.freq_civil WHERE civil_name = $1';
    const params: any[] = [name];

    if (excludeId) {
      query += ' AND civil_id != $2';
      params.push(excludeId);
    }

    const result = await db.query<{ count: string }>(query, params);
    return parseInt(result.rows[0].count) === 0;
  }

  async createCivil(civilData: {
    civilId: string;
    civilName: string;
    civilEmail: string;
  }): Promise<boolean> {
    try {
      await db.transaction(async (query) => {
        await query(`
          INSERT INTO freq0097.freq_civil (
            civil_id, civil_name, civil_email, gmail_bind, civil_particip,
            main_root_freq, sub_root_freq, soul_id, character_id
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        `, [
          civilData.civilId,
          civilData.civilName,
          civilData.civilEmail,
          true, // gmail_bind
          true, // civil_particip
          '01', // main_root_freq
          '05', // sub_root_freq
          '02', // soul_id
          '01050000' // character_id
        ]);

        await query(`
          INSERT INTO freq0097.civil_role (civil_id, role_type, role_date, role_action)
          VALUES ($1, $2, $3, $4)
        `, [
          civilData.civilId,
          '01', // role_type
          new Date(), // role_date
          '1' // role_action
        ]);
      });
      return true;
    } catch (error) {
      console.error('Error creating civil:', error);
      return false;
    }
  }

  async updateCivilName(civilId: string, newName: string): Promise<boolean> {
    try {
      const query = 'UPDATE freq0097.freq_civil SET civil_name = $1 WHERE civil_id = $2';
      await db.query(query, [newName, civilId]);
      return true;
    } catch (error) {
      console.error('Error updating civil name:', error);
      return false;
    }
  }

  async getRootFreqDetails(freqId: string, uiLang: string = '01'): Promise<{
    freq_id: string;
    spell: string;
    name: string;
    detailed: string;
  } | null> {
    try {
      const query = `
        SELECT
          rf.root_freq_id as freq_id,
          rf.root_freq_spell as spell,
          rfu.root_freq_name as name,
          rfu.root_freq_detailed as detailed
        FROM freq0097.root_freq rf
        LEFT JOIN freq0097.root_freq_ui rfu ON rf.root_freq_id = rfu.root_freq_id AND rfu.ui_lang = $2
        WHERE rf.root_freq_id = $1
      `;
      const result = await db.query(query, [freqId, uiLang]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error getting root freq details:', error);
      return null;
    }
  }

  async getSoulTypeDetails(soulId: string, uiLang: string = '01'): Promise<{
    soul_id: string;
    name: string;
    core: string;
    mapping: string;
    app: string;
  } | null> {
    try {
      const query = `
        SELECT
          soul_id,
          soul_id_name as name,
          soul_id_core as core,
          soul_id_mapping as mapping,
          soul_id_app as app
        FROM freq0097.soul_type_ui
        WHERE soul_id = $1 AND ui_lang = $2
      `;
      const result = await db.query(query, [soulId, uiLang]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error getting soul type details:', error);
      return null;
    }
  }

  generateCivilId(email: string): string {
    const now = new Date();
    const dateStr = now.getFullYear().toString().slice(2) +
                   String(now.getMonth() + 1).padStart(2, '0') +
                   String(now.getDate()).padStart(2, '0');

    const emailPrefix = email.substring(0, 8).padEnd(8, '0');
    const randomChars = this.generateRandomString(3);

    return dateStr + emailPrefix + randomChars;
  }

  private generateRandomString(length: number): string {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}