import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, ListManage } from 'lucide-react';
import UploadForm from "@/components/admin/upload-form";
import ManageContentTable from "@/components/admin/manage-content-table";

export default function AdminPage() {
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
                        <ListManage className="w-4 h-4 mr-2" />
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
