import { NextRequest, NextResponse } from 'next/server';
import { verifyJwtToken, COOKIE_NAME } from '@/lib/erp/auth';
import { query } from '@/lib/db';
import {
  fetchPublicProjectsFromDb,
  upsertPublicProjectInDb,
  deletePublicProjectInDb,
  fetchPublicServicesFromDb,
  upsertPublicServiceInDb,
  deletePublicServiceInDb,
} from '@/lib/publicDb';
import { DEFAULT_PROJECTS, DEFAULT_SERVICES, PublicProject, PublicService } from '@/lib/publicData';

async function getAuthUser(req: NextRequest) {
  let token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) {
    const authHeader = req.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
  }
  if (!token) return null;
  return await verifyJwtToken(token);
}

async function recordAudit(actorName: string, actorEmail: string, role: string, action: string, details: string) {
  await query(
    `INSERT INTO audit_logs (id, company_id, actor_name, actor_email, role, action, module, details, severity)
     VALUES (?, 'COMP_A', ?, ?, ?, ?, 'SYSTEM', ?, 'INFO')`,
    [`aud-${Date.now()}`, actorName, actorEmail, role, action, details]
  );
}

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized: Valid JWT session required' }, { status: 401 });
  }

  const [projects, services] = await Promise.all([
    fetchPublicProjectsFromDb(),
    fetchPublicServicesFromDb(),
  ]);

  return NextResponse.json({ success: true, projects, services });
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized: Valid JWT session required' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { type, item, action } = body;

    if (action === 'RESET_DEFAULTS') {
      await query('DELETE FROM public_projects');
      await query('DELETE FROM public_services');
      for (const p of DEFAULT_PROJECTS) {
        await upsertPublicProjectInDb(p);
      }
      for (let i = 0; i < DEFAULT_SERVICES.length; i++) {
        await upsertPublicServiceInDb(DEFAULT_SERVICES[i], i);
      }
      await recordAudit(user.name, user.email, user.role, 'RESET_PUBLIC_CONTENT', 'Reset website projects & services to defaults');
      return NextResponse.json({ success: true, projects: DEFAULT_PROJECTS, services: DEFAULT_SERVICES });
    }

    if (type === 'PROJECT' && item) {
      const proj = item as PublicProject;
      if (!proj.title) {
        return NextResponse.json({ error: 'Project title is required' }, { status: 400 });
      }
      if (!proj.id) proj.id = `proj-${Date.now()}`;
      await upsertPublicProjectInDb(proj);
      await recordAudit(user.name, user.email, user.role, 'UPSERT_PUBLIC_PROJECT', `Saved project: ${proj.title}`);
      const projects = await fetchPublicProjectsFromDb();
      return NextResponse.json({ success: true, projects });
    }

    if (type === 'SERVICE' && item) {
      const serv = item as PublicService;
      if (!serv.title) {
        return NextResponse.json({ error: 'Service title is required' }, { status: 400 });
      }
      if (!serv.id) serv.id = `serv-${Date.now()}`;
      await upsertPublicServiceInDb(serv, body.order ?? 0);
      await recordAudit(user.name, user.email, user.role, 'UPSERT_PUBLIC_SERVICE', `Saved service: ${serv.title}`);
      const services = await fetchPublicServicesFromDb();
      return NextResponse.json({ success: true, services });
    }

    return NextResponse.json({ error: 'Invalid request payload' }, { status: 400 });
  } catch (err) {
    console.error('[ERP PUBLIC CONTENT POST ERROR]', err);
    return NextResponse.json({ error: 'Database operation failed' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized: Valid JWT session required' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');

    if (!type || !id) {
      return NextResponse.json({ error: 'Missing type or id parameter' }, { status: 400 });
    }

    if (type === 'PROJECT') {
      await deletePublicProjectInDb(id);
      await recordAudit(user.name, user.email, user.role, 'DELETE_PUBLIC_PROJECT', `Deleted project ID: ${id}`);
      const projects = await fetchPublicProjectsFromDb();
      return NextResponse.json({ success: true, projects });
    }

    if (type === 'SERVICE') {
      await deletePublicServiceInDb(id);
      await recordAudit(user.name, user.email, user.role, 'DELETE_PUBLIC_SERVICE', `Deleted service ID: ${id}`);
      const services = await fetchPublicServicesFromDb();
      return NextResponse.json({ success: true, services });
    }

    return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });
  } catch (err) {
    console.error('[ERP PUBLIC CONTENT DELETE ERROR]', err);
    return NextResponse.json({ error: 'Database delete failed' }, { status: 500 });
  }
}
