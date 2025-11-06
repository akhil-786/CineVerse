import Image from 'next/image';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { contentData } from '@/lib/mock-data';
import { Badge } from '../ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';

export default function ManageContentTable() {
    return (
        <Card className="border-white/10 bg-card/80 backdrop-blur-lg">
            <CardHeader>
                <CardTitle>Manage Content</CardTitle>
                <CardDescription>View, edit, or delete existing content on the platform.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="hidden w-[100px] sm:table-cell">
                                <span className="sr-only">Image</span>
                            </TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead className="hidden md:table-cell">Year</TableHead>
                            <TableHead className="hidden md:table-cell">Rating</TableHead>
                            <TableHead>
                                <span className="sr-only">Actions</span>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {contentData.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="hidden sm:table-cell">
                                    <Image
                                        alt={item.title}
                                        className="aspect-square rounded-md object-cover"
                                        height="64"
                                        src={item.thumbnail.imageUrl}
                                        width="64"
                                    />
                                </TableCell>
                                <TableCell className="font-medium">{item.title}</TableCell>
                                <TableCell>
                                    <Badge variant={item.type === 'anime' ? 'outline' : 'secondary'}>
                                        {item.type}
                                    </Badge>
                                </TableCell>
                                <TableCell className="hidden md:table-cell">{item.year}</TableCell>
                                <TableCell className="hidden md:table-cell">{item.rating?.toFixed(1) ?? 'N/A'}</TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button aria-haspopup="true" size="icon" variant="ghost">
                                                <MoreHorizontal className="h-4 w-4" />
                                                <span className="sr-only">Toggle menu</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem><Pencil className="w-4 h-4 mr-2" />Edit</DropdownMenuItem>
                                            <DropdownMenuItem className="text-destructive"><Trash2 className="w-4 h-4 mr-2" />Delete</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
