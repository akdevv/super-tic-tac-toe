import { PrismaClient } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";

const prisma = new PrismaClient();
// const supabase = createClient(
// 	process.env.SUPABASE_URL,
// 	process.env.SUPABASE_ANON_KEY
// );

export default prisma;
