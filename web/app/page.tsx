import { supabase } from "@/lib/supabase";
import Dashboard from "@/components/Dashboard";

export const revalidate = 3600; // Revalidate every hour

export default async function Home() {
    const { data: posts } = await supabase
        .from("rental_posts")
        .select("*")
        .order("post_date", { ascending: false });

    return (
        <div className="min-h-screen bg-background">
            <header className="border-b">
                <div className="container mx-auto py-4 px-4 flex items-center justify-between">
                    <h1 className="text-xl font-bold">FB Rental Scraper</h1>
                </div>
            </header>
            <div className="container mx-auto py-8 px-4">
                <Dashboard initialPosts={posts || []} />
            </div>
        </div>
    );
}
