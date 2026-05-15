import { NextResponse } from "next/server";
import { seedExperts } from "@/lib/seed-data";

export async function GET() {
  return NextResponse.json({
    source: "stub",
    experts: seedExperts.map((expert) => ({
      id: expert.id,
      name: expert.name.value,
      role: expert.role.value,
      company: expert.company.value,
      geography: expert.geography.value,
      linkedin: expert.contact.value?.linkedin,
    })),
  });
}
