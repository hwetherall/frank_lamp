"use server";

import { revalidatePath } from "next/cache";
import { saveExpert } from "@/lib/data";
import { seedExperts } from "@/lib/seed-data";

export async function resetDemoAction() {
  const target = seedExperts.find((expert) => expert.is_demo_target);

  if (!target) {
    return;
  }

  try {
    await saveExpert({
      ...target,
      enrichment_status: "skeleton",
      updated_at: new Date().toISOString(),
    });
    revalidatePath("/");
  } catch {
    revalidatePath("/");
  }
}
