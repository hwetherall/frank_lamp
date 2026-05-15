import rawExperts from "../../seed/experts.json";
import { expertListSchema } from "@/lib/schema";

export const seedExperts = expertListSchema.parse(rawExperts);
