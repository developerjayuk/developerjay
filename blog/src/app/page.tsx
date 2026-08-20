import { createClient } from "@/lib/supabase/server";
import { ThemeToggle } from "@/lib/theme/theme-toggle";

export default async function Home() {
  const supabase = createClient();
  const { count, error } = await supabase
    .from("posts")
    .select("*", { count: "exact", head: true });

  if (error) {
    throw error;
  }

  return (
    <div className="flex flex-col flex-1 items-center justify-center gap-6 bg-zinc-50 font-sans dark:bg-black">
      <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
        {count ?? 0} posts
      </h1>
      <ThemeToggle />
    </div>
  );
}
