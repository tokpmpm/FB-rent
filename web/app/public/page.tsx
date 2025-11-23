import { supabase } from "@/lib/supabase";
import PublicDashboard from "@/components/PublicDashboard";

export const revalidate = 0; // Always revalidate

export default async function PublicPage() {
    const { data: posts } = await supabase
        .from("rental_posts")
        .select("*")
        .order("post_date", { ascending: false });

    return (
        <div className="min-h-screen bg-background">
            <header className="border-b">
                <div className="container mx-auto py-4 px-4 flex items-center justify-between">
                    <h1 className="text-xl font-bold">FB 租屋資訊</h1>
                </div>
            </header>
            <div className="container mx-auto py-8 px-4">
                <PublicDashboard initialPosts={posts || []} />
            </div>
        </div>
    );
}
