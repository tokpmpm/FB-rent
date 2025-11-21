-- Create the rental_posts table
CREATE TABLE rental_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_link TEXT UNIQUE NOT NULL,
    poster_name TEXT,
    post_date TEXT,
    people_count TEXT,
    gender TEXT,
    budget TEXT,
    type TEXT,
    job TEXT,
    location TEXT,
    rental_period TEXT,
    move_in_date TEXT,
    pet TEXT,
    utilities TEXT,
    requirements TEXT,
    exclusions TEXT,
    contact TEXT,
    raw_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create an index on created_at for sorting
CREATE INDEX idx_rental_posts_created_at ON rental_posts(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE rental_posts ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow public read access
CREATE POLICY "Allow public read access" ON rental_posts FOR SELECT USING (true);

-- Create a policy to allow service role write access (for the scraper)
-- Note: Service role bypasses RLS, but it's good practice to have policies.
CREATE POLICY "Allow service role insert" ON rental_posts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow service role update" ON rental_posts FOR UPDATE USING (true);
