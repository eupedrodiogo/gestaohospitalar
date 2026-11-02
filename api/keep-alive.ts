import { createClient } from '@supabase/supabase-js';

// Consulta leve diária para o Supabase (plano Free) não pausar o projeto por inatividade
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req: any, res: any) {
  // A Vercel envia "Bearer <CRON_SECRET>" nas chamadas do cron quando a variável existe
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && req.headers.authorization !== `Bearer ${cronSecret}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { count, error } = await supabase
    .from('role_permissions')
    .select('*', { count: 'exact', head: true });

  if (error) {
    console.error('Keep-alive falhou:', error.message);
    return res.status(500).json({ ok: false, error: error.message });
  }

  return res.status(200).json({ ok: true, count, at: new Date().toISOString() });
}
