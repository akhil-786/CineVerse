'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, List, ShieldAlert } from 'lucide-react';
import UploadForm from "@/components/admin/upload-form";
import ManageContentTable from "@/components/admin/manage-content-table";
import { useUser } from "@/firebase";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminPage() {
    const { user, userProfile, loading } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/auth');
        }
    }, [user, loading, router]);
    
    if (loading) {
        return (
             <div className="container mx-auto px-4 py-8 md:py-12">
                <Skeleton className="h-12 w-1/2 mb-2" />
                <Skeleton className="h-6 w-3/4 mb-8" />
                <div className="space-y-4">
                    <Skeleton className="h-10 w-full max-w-md" />
                    <Skeleton className="h-96 w-full" />
                </div>
            </div>
        )
    }

    if (userProfile?.role !== 'admin') {
        return (
            <div className="container mx-auto px-4 py-8 md:py-12 flex flex-col items-center justify-center text-center min-h-[calc(100vh-12rem)]">
                <ShieldAlert className="w-16 h-16 text-destructive mb-4" />
                <h1 className="text-4xl font-headline font-bold mb-2">Access Denied</h1>
                <p className="text-muted-foreground">You do not have permission to view this page.</p>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8 md:py-12">
            <h1 className="text-4xl font-headline font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground mb-8">Manage your platform's content from here.</p>
            <Tabs defaultValue="upload" className="w-full">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                    <TabsTrigger value="upload">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Content
                    </TabsTrigger>
                    <TabsTrigger value="manage">
                        <List className="w-4 h-4 mr-2" />
                        Manage Content
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="upload" className="mt-6">
                    <UploadForm />
                </TabsContent>
                <TabsContent value="manage" className="mt-6">
                    <ManageContentTable />
                </TabsContent>
            </Tabs>
        </div>
    );
}
