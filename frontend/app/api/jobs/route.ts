import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/app/utils/supabaseClient";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const logoUrlFromForm = formData.get('logo_url') as string | null;
  let logoUrl = logoUrlFromForm || null;
  const logoFile = formData.get('logo') as File | null;

  if (!logoUrl && logoFile && logoFile instanceof File && logoFile.size > 0) {
    const fileExt = logoFile.name.split(".").pop();

    // ✅ Check for .jpg extension
    if (!fileExt || fileExt.toLowerCase() !== "jpg") {
      return NextResponse.json({ error: "Only .jpg files are allowed." }, { status: 400 });
    }

    const fileName = `${Date.now()}.${fileExt}`;
    const arrayBuffer = await logoFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("job-logos")
      .upload(`public/${fileName}`, buffer, {
        contentType: logoFile.type || "image/jpeg",
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError);
      return NextResponse.json({ error: "Failed to upload logo" }, { status: 500 });
    }

    const { data: publicUrlData } = supabase.storage
      .from("job-logos")
      .getPublicUrl(`public/${fileName}`);

    logoUrl = publicUrlData.publicUrl;
  }

  const company_name = formData.get("company_name") as string;
  const position = formData.get("position") as string;
  const job_description = formData.get("job_description") as string;
  const type = formData.get("type") as string;
  const primary_tag = formData.get("primary_tag") as string;
  const location = formData.get("location") as string;
  const apply_url = formData.get("apply_url") as string;

  const wallet_address = formData.get("wallet_address") as string;
  if (!wallet_address) {
    return NextResponse.json({ error: "Missing wallet address." }, { status: 400 });
  }

  const { data: userRows, error: userError } = await supabase
    .from("users_walletA")
    .select("id")
    .eq("walletaddress", wallet_address)
    .single();

  if (userError || !userRows) {
    return NextResponse.json({ error: "User not found." }, { status: 400 });
  }

  const user_id = userRows.id;

  const { error } = await supabase.from("jobs").insert([
    {
      company_name,
      position,
      job_description,
      type,
      primary_tag,
      location,
      apply_url,
      logo: logoUrl,
      user_id,
    },
  ]);

  if (error) {
    return NextResponse.json({ error: "Failed to insert job." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
