import { prisma } from '../config/database';

export class SettingsService {
  async getAll() {
    const settings = await prisma.salonSetting.findMany();
    const map: Record<string, string> = {};
    settings.forEach((s) => {
      map[s.key] = s.value;
    });
    return { list: settings, map };
  }

  async update(key: string, value: string, description?: string) {
    return prisma.salonSetting.upsert({
      where: { key },
      update: { value, ...(description ? { description } : {}) },
      create: { key, value, description },
    });
  }
}

export const settingsService = new SettingsService();
