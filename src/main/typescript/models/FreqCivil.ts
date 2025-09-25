export interface FreqCivil {
  civil_id: string;
  civil_name: string;
  civil_email: string;
  gmail_bind: boolean;
  main_root_freq: string;
  sub_root_freq: string;
  third_root_freq: string;
  character_id: string;
  hope_freq_id: string;
  soul_id: string;
  main_rf_task_01: string;
  civil_luv_balance: number;
  civil_point_balance: number;
  civil_creator: boolean;
  civil_particip: boolean;
  civil_volunteer: boolean;
  civil_undertake: boolean;
}

export interface CivilRole {
  civil_id: string;
  role_type: string;
  role_date: Date;
  role_action: string;
}

export interface RootFreq {
  root_freq_id: string;
  root_freq_spell: string;
  root_freq_audio: Buffer;
}

export interface RootFreqUI {
  root_freq_id: string;
  ui_lang: string;
  root_freq_name: string;
  root_freq_detailed: string;
  root_freq_audio: Buffer;
}

export interface SoulType {
  soul_id: string;
  soul_id_card: Buffer;
}

export interface SoulTypeUI {
  soul_id: string;
  ui_lang: string;
  soul_id_name: string;
  soul_id_core: string;
  soul_id_mapping: string;
  soul_id_app: string;
}