import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/app/utils/supabaseClient";



export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const company_name = formData.get("company_name") as string;
  const position = formData.get("position") as string;
  const job_description = formData.get("job_description") as string;
  const type = formData.get("type") as string;
  const primary_tag = formData.get("primary_tag") as string;
  const location = formData.get("location") as string;
  const apply_url = formData.get("apply_url") as string;
  // For now, skip logo upload and just store null
  const logo = null;

  // Insert into jobs table
  const { error } = await supabase.from("jobs").insert([
    {
      company_name,
      position,
      job_description,
      type,
      primary_tag,
      location,
      apply_url,
      logo,
    },
  ]);

  if (error) {
    return NextResponse.json({ error: "Failed to insert job." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
} 