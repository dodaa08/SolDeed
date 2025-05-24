import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/utils/supabaseClient';

function extractIdFromUrl(url: string) {
  // Remove query parameters and hash fragments
  const cleanUrl = url.split('?')[0].split('#')[0];
  // Remove trailing slash if present
  const trimmedUrl = cleanUrl.endsWith('/') ? cleanUrl.slice(0, -1) : cleanUrl;
  const parts = trimmedUrl.split('/');
  return parts[parts.length - 1];
}

export async function GET(req: NextRequest) {
  const id = extractIdFromUrl(req.url);

  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: error?.message || 'Job not found' }, { status: 404 });
  }

  return NextResponse.json({ job: data });
}

export async function DELETE(req: NextRequest) {
  const id = extractIdFromUrl(req.url);

  const { error } = await supabase
    .from('jobs')
    .delete()
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}




// import { NextRequest, NextResponse } from 'next/server';
// import { supabase } from '@/app/utils/supabaseClient';

// export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
//   const { id } = params;

//   const { data, error } = await supabase
//     .from('jobs')
//     .select('*')
//     .eq('id', id)
//     .single();

//   if (error || !data) {
//     return NextResponse.json({ error: error?.message || 'Job not found' }, { status: 404 });
//   }

//   return NextResponse.json({ job: data });
// }

// export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
//   const { id } = params;

//   const { error } = await supabase
//     .from('jobs')
//     .delete()
//     .eq('id', id);

//   if (error) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }

//   return NextResponse.json({ success: true });
// }
