import { RentalPost } from "@/types";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface RentalTableProps {
    posts: RentalPost[];
}

export function RentalTable({ posts }: RentalTableProps) {
    if (posts.length === 0) {
        return <div className="text-center p-8 text-gray-500">No posts found.</div>;
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Budget</TableHead>
                        <TableHead>Gender</TableHead>
                        <TableHead>Move In</TableHead>
                        <TableHead>Pet</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {posts.map((post) => (
                        <TableRow key={post.id}>
                            <TableCell>{post.post_date}</TableCell>
                            <TableCell>{post.poster_name}</TableCell>
                            <TableCell>{post.location}</TableCell>
                            <TableCell>{post.type}</TableCell>
                            <TableCell>{post.budget}</TableCell>
                            <TableCell>{post.gender}</TableCell>
                            <TableCell>{post.move_in_date}</TableCell>
                            <TableCell>{post.pet}</TableCell>
                            <TableCell className="text-right">
                                <Button asChild size="sm" variant="outline">
                                    <a href={post.post_link} target="_blank" rel="noopener noreferrer">
                                        View
                                    </a>
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
