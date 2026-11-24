import { query } from '@/lib/db';
import {
  DEFAULT_PROJECTS,
  DEFAULT_SERVICES,
  PublicProject,
  PublicService,
} from '@/lib/publicData';

let tablesEnsured = false;

/**
 * Ensure public_projects and public_services tables exist in MySQL and seed initial data if empty.
 */
export async function ensurePublicContentTables(): Promise<void> {
  if (tablesEnsured) return;

  await query(`
    CREATE TABLE IF NOT EXISTS public_projects (
      id VARCHAR(64) PRIMARY KEY,
      title VARCHAR(200) NOT NULL,
      category VARCHAR(100) NOT NULL,
      location VARCHAR(200) NOT NULL,
      year VARCHAR(16) NOT NULL,
      area VARCHAR(64) NOT NULL,
      solar_capacity VARCHAR(120) DEFAULT '',
      energy_rating VARCHAR(120) DEFAULT '',
      image VARCHAR(500) NOT NULL,
      tagline VARCHAR(300) DEFAULT '',
      description TEXT NOT NULL,
      highlights JSON,
      status ENUM('COMPLETED', 'UNDER_CONSTRUCTION', 'DESIGN_PHASE') DEFAULT 'COMPLETED',
      featured BOOLEAN DEFAULT FALSE,
      contract_value VARCHAR(64) DEFAULT '',
      structural_warranty VARCHAR(160) DEFAULT '',
      lead_architect VARCHAR(160) DEFAULT '',
      foundation_type VARCHAR(160) DEFAULT '',
      client_privacy ENUM('PUBLIC', 'CONFIDENTIAL') DEFAULT 'PUBLIC',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS public_services (
      id VARCHAR(64) PRIMARY KEY,
      badge VARCHAR(64) NOT NULL,
      title VARCHAR(200) NOT NULL,
      description TEXT NOT NULL,
      image VARCHAR(500) NOT NULL,
      features JSON,
      starting_price VARCHAR(120) DEFAULT '',
      timeline VARCHAR(120) DEFAULT '',
      cida_standard VARCHAR(120) DEFAULT '',
      warranty VARCHAR(120) DEFAULT '',
      featured BOOLEAN DEFAULT TRUE,
      display_order INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // Seed public_projects if empty
  const projCountRows = await query<{ cnt: number }[]>('SELECT COUNT(*) AS cnt FROM public_projects');
  if (projCountRows && projCountRows[0]?.cnt === 0) {
    for (const p of DEFAULT_PROJECTS) {
      await upsertPublicProjectInDb(p);
    }
  }

  // Seed public_services if empty
  const servCountRows = await query<{ cnt: number }[]>('SELECT COUNT(*) AS cnt FROM public_services');
  if (servCountRows && servCountRows[0]?.cnt === 0) {
    for (let i = 0; i < DEFAULT_SERVICES.length; i++) {
      await upsertPublicServiceInDb(DEFAULT_SERVICES[i], i);
    }
  }

  tablesEnsured = true;
}

function parseJsonArray(val: unknown, fallback: string[]): string[] {
  if (Array.isArray(val)) return val.map(String);
  if (typeof val === 'string') {
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return parsed.map(String);
    } catch {
      return fallback;
    }
  }
  return fallback;
}

export async function fetchPublicProjectsFromDb(): Promise<PublicProject[]> {
  await ensurePublicContentTables();
  const rows = await query<Record<string, unknown>[]>(
    'SELECT * FROM public_projects ORDER BY featured DESC, created_at DESC'
  );
  if (!rows) return DEFAULT_PROJECTS;

  return rows.map((r) => ({
    id: String(r.id),
    title: String(r.title),
    category: String(r.category),
    location: String(r.location),
    year: String(r.year),
    area: String(r.area),
    solarCapacity: String(r.solar_capacity || ''),
    energyRating: String(r.energy_rating || ''),
    image: String(r.image),
    tagline: String(r.tagline || ''),
    description: String(r.description || ''),
    highlights: parseJsonArray(r.highlights, []),
    status: (r.status as PublicProject['status']) || 'COMPLETED',
    featured: Boolean(r.featured),
    contractValue: String(r.contract_value || ''),
    structuralWarranty: String(r.structural_warranty || ''),
    leadArchitect: String(r.lead_architect || ''),
    foundationType: String(r.foundation_type || ''),
    clientPrivacy: (r.client_privacy as PublicProject['clientPrivacy']) || 'PUBLIC',
  }));
}

export async function upsertPublicProjectInDb(p: PublicProject): Promise<boolean> {
  const res = await query(
    `INSERT INTO public_projects (
      id, title, category, location, year, area, solar_capacity, energy_rating,
      image, tagline, description, highlights, status, featured,
      contract_value, structural_warranty, lead_architect, foundation_type, client_privacy
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      title=VALUES(title), category=VALUES(category), location=VALUES(location),
      year=VALUES(year), area=VALUES(area), solar_capacity=VALUES(solar_capacity),
      energy_rating=VALUES(energy_rating), image=VALUES(image), tagline=VALUES(tagline),
      description=VALUES(description), highlights=VALUES(highlights), status=VALUES(status),
      featured=VALUES(featured), contract_value=VALUES(contract_value),
      structural_warranty=VALUES(structural_warranty), lead_architect=VALUES(lead_architect),
      foundation_type=VALUES(foundation_type), client_privacy=VALUES(client_privacy)`,
    [
      p.id,
      p.title,
      p.category,
      p.location,
      p.year,
      p.area,
      p.solarCapacity || '',
      p.energyRating || '',
      p.image,
      p.tagline || '',
      p.description || '',
      JSON.stringify(p.highlights || []),
      p.status || 'COMPLETED',
      p.featured ? 1 : 0,
      p.contractValue || '',
      p.structuralWarranty || '',
      p.leadArchitect || '',
      p.foundationType || '',
      p.clientPrivacy || 'PUBLIC',
    ]
  );
  return res !== null;
}

export async function deletePublicProjectInDb(id: string): Promise<boolean> {
  const res = await query('DELETE FROM public_projects WHERE id = ?', [id]);
  return res !== null;
}

export async function fetchPublicServicesFromDb(): Promise<PublicService[]> {
  await ensurePublicContentTables();
  const rows = await query<Record<string, unknown>[]>(
    'SELECT * FROM public_services ORDER BY display_order ASC, created_at ASC'
  );
  if (!rows) return DEFAULT_SERVICES;

  return rows.map((r) => ({
    id: String(r.id),
    badge: String(r.badge),
    title: String(r.title),
    desc: String(r.description || ''),
    image: String(r.image),
    features: parseJsonArray(r.features, []),
    startingPrice: String(r.starting_price || ''),
    timeline: String(r.timeline || ''),
    cidaStandard: String(r.cida_standard || ''),
    warranty: String(r.warranty || ''),
    featured: Boolean(r.featured),
  }));
}

export async function upsertPublicServiceInDb(s: PublicService, order = 0): Promise<boolean> {
  const res = await query(
    `INSERT INTO public_services (
      id, badge, title, description, image, features,
      starting_price, timeline, cida_standard, warranty, featured, display_order
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      badge=VALUES(badge), title=VALUES(title), description=VALUES(description),
      image=VALUES(image), features=VALUES(features), starting_price=VALUES(starting_price),
      timeline=VALUES(timeline), cida_standard=VALUES(cida_standard),
      warranty=VALUES(warranty), featured=VALUES(featured), display_order=VALUES(display_order)`,
    [
      s.id,
      s.badge,
      s.title,
      s.desc,
      s.image,
      JSON.stringify(s.features || []),
      s.startingPrice || '',
      s.timeline || '',
      s.cidaStandard || '',
      s.warranty || '',
      s.featured ? 1 : 0,
      order,
    ]
  );
  return res !== null;
}

export async function deletePublicServiceInDb(id: string): Promise<boolean> {
  const res = await query('DELETE FROM public_services WHERE id = ?', [id]);
  return res !== null;
}
