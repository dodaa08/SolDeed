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

  // 1. Get wallet address from the request/session (you must pass it from the frontend)
  const wallet_address = formData.get("wallet_address") as string;
  if (!wallet_address) {
    return NextResponse.json({ error: "Missing wallet address." }, { status: 400 });
  }

  // 2. Look up user_id in users_walletA
  const { data: userRows, error: userError } = await supabase
    .from("users_walletA")
    .select("id")
    .eq("walletaddress", wallet_address)
    .single();

  if (userError || !userRows) {
    return NextResponse.json({ error: "User not found." }, { status: 400 });
  }

  const user_id = userRows.id;

  // 3. Insert into jobs table with user_id
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
      user_id, // <-- This is required!
    },
  ]);

  if (error) {
    return NextResponse.json({ error: "Failed to insert job." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
} 