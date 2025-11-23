"use client";

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

interface PublicRentalTableProps {
    posts: RentalPost[];
    onViewPost: (url: string) => void;
}

export default function PublicRentalTable({ posts, onViewPost }: PublicRentalTableProps) {
    if (posts.length === 0) {
        return <div className="text-center p-8 text-gray-500">No posts found.</div>;
    }

    return (
        <div className="space-y-4">
            {/* Mobile View: Cards */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
                {posts.map((post) => (
                    <div key={post.id} className="bg-card border rounded-lg p-4 space-y-3 shadow-sm">
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="font-medium text-lg">{post.poster_name}</div>
                                <div className="text-sm text-muted-foreground">{post.post_date?.split(" ")[0] || post.post_date}</div>
                            </div>
                            <div className="text-right">
                                <div className="font-bold text-primary text-lg">${parseInt(post.budget).toLocaleString()}</div>
                                <div className="text-xs text-muted-foreground">{post.people_count}</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                                <span className="text-muted-foreground">地點:</span> {post.location}
                            </div>
                            <div>
                                <span className="text-muted-foreground">房型:</span> {post.type}
                            </div>
                            <div>
                                <span className="text-muted-foreground">性別:</span> {post.gender}
                            </div>
                            <div>
                                <span className="text-muted-foreground">寵物:</span> {post.pet}
                            </div>
                            <div className="col-span-2">
                                <span className="text-muted-foreground">入住:</span> {post.move_in_date}
                            </div>
                        </div>

                        <Button
                            asChild={false}
                            className="w-full"
                            variant="outline"
                            onClick={() => onViewPost(post.post_link)}
                        >
                            查看貼文
                        </Button>
                    </div>
                ))}
            </div>

            {/* Desktop View: Table */}
            <div className="hidden md:block rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>People</TableHead>
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
                                <TableCell className="whitespace-nowrap">{post.post_date?.split(" ")[0] || post.post_date}</TableCell>
                                <TableCell className="max-w-[150px] truncate" title={post.poster_name}>{post.poster_name}</TableCell>
                                <TableCell>{post.people_count}</TableCell>
                                <TableCell className="max-w-[150px] truncate" title={post.location}>{post.location}</TableCell>
                                <TableCell className="max-w-[100px] truncate" title={post.type}>{post.type}</TableCell>
                                <TableCell>{post.budget}</TableCell>
                                <TableCell>{post.gender}</TableCell>
                                <TableCell>{post.move_in_date}</TableCell>
                                <TableCell>{post.pet}</TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        asChild={false}
                                        size="sm"
                                        variant="outline"
                                        onClick={() => onViewPost(post.post_link)}
                                    >
                                        View
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
