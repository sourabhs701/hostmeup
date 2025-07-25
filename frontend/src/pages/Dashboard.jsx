import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { UploadCloud, Power, File, Trash2 } from "lucide-react";
import ThemeSwitch from "@/components/ThemeSwitch";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";


export default function Dashboard() {
    const [files, setFiles] = useState([]);
    const [storage, setStorage] = useState({ usedSizeMB: 0, totalSizeGB: 1, usagePercentage: 0 });
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) {
            navigate("/");
            return;
        }
        loadFilesAndStorage();
    }, [token, navigate]);

    async function loadFilesAndStorage() {
        setLoading(true);
        try {
            const res = await axiosInstance.get("/files", { headers: { Authorization: `Bearer ${token}` } });
            const data = res.data;
            const fileList = Array.isArray(data) ? data : data.files || data.data || [];
            setFiles(fileList);
            if (data.storage) {
                setStorage(data.storage);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to load files and storage");
        } finally {
            setLoading(false);
        }
    }

    async function handleUpload(e) {
        const selectedFiles = e.target.files;
        if (!selectedFiles.length) return;

        setUploading(true);
        const loadingToast = toast.loading(`Uploading ${selectedFiles.length} files...`);

        try {
            for (let i = 0; i < selectedFiles.length; i++) {
                const file = selectedFiles[i];

                // Update loading message
                toast.loading(`Uploading ${i + 1} of ${selectedFiles.length}: ${file.name}`, { id: loadingToast });

                // get presigned URL
                const uploadRes = await axiosInstance.get(
                    `/upload?filename=${encodeURIComponent(file.name)}&contentType=${encodeURIComponent(file.type)}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                const { uploadUrl, key } = uploadRes.data;

                // upload to S3
                await axiosInstance.put(uploadUrl, file, { headers: { "Content-Type": file.type } });

                // confirm
                await axiosInstance.post(
                    "/files/confirm",
                    { filename: file.name, size: file.size, key },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            }

            toast.success(`Successfully uploaded ${selectedFiles.length} file${selectedFiles.length > 1 ? "s" : ""}`, { id: loadingToast });
            fileInputRef.current.value = null;
            loadFilesAndStorage();
        } catch (error) {
            console.error(error);
            toast.error(`Upload failed: ${error.response?.data?.error || error.message}`, { id: loadingToast });
        } finally {
            setUploading(false);
        }
    }



    async function handleDelete(id) {
        try {
            await axiosInstance.delete(`/files/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            toast.success("File deleted");
            loadFilesAndStorage();
        } catch (error) {
            console.error(error);
            toast.error("Delete failed");
        }
    }

    function handleDownload(key) {
        window.open(`https://cdn.srb.codes/${key}`, "_blank");
    }

    function handleLogout() {
        localStorage.removeItem("token");
        navigate("/");
    }

    return (
        <div className="min-h-screen bg-background p-6 top-0">
            <header className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold"><a href="/">HostMeUp</a></h1>
                    <p className="text-sm text-muted-foreground">File Management Dashboard</p>
                </div>
                <div className="flex items-center gap-2">

                    <Button variant="secondary" onClick={handleLogout}>
                        <Power className="mr-2 h-4 w-4" />
                        Logout
                    </Button>
                    <ThemeSwitch />
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Storage Usage</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-2">
                            {storage.usedSizeMB} MB of {storage.totalSizeGB}GB used
                        </div>
                        <Progress value={storage.usagePercentage} />
                    </CardContent>
                </Card>

                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Upload Files</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div
                            onClick={() => !uploading && fileInputRef.current.click()}
                            className={`border border-dashed border-border rounded-md p-6 text-center cursor-pointer ${uploading ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary'
                                }`}
                        >
                            <UploadCloud className="mx-auto mb-2" size={48} />
                            <p className="font-medium">
                                {uploading ? 'Uploading...' : 'Click to upload files'}
                            </p>
                            <p className="text-xs text-muted-foreground">Multiple files supported (max 100MB each)</p>
                            <input
                                type="file"
                                multiple
                                accept="*/*"
                                className="hidden"
                                ref={fileInputRef}
                                onChange={handleUpload}
                                disabled={uploading}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card className="md:col-span-3">
                    <CardHeader className="flex justify-between items-center">
                        <CardTitle>Your Files</CardTitle>
                        <span>{files.length} file{files.length !== 1 ? 's' : ''}</span>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex flex-col items-center py-10">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
                                <p>Loading your files...</p>
                            </div>
                        ) : files.length === 0 ? (
                            <div className="flex flex-col items-center py-10 text-muted-foreground">
                                <File size={48} className="mb-2" />
                                <h3 className="text-lg">No files yet</h3>
                                <p>Upload your first file to get started</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {files.map((file) => (
                                    <div key={file.id} className="flex justify-between items-center p-4 border rounded-md">
                                        <div>
                                            <h3 className="font-medium truncate max-w-xs" title={file.name}>{file.name}</h3>
                                            <div className="text-xs text-muted-foreground mt-1">
                                                {formatFileSize(file.size)} • {new Date(file.uploadedAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button size="sm" onClick={() => handleDownload(file.key)}>
                                                <File className="h-4 w-4 mr-1" />
                                                Open
                                            </Button>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button size="sm" variant="destructive">
                                                        <Trash2 className="h-4 w-4 mr-1" />
                                                        Delete
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Delete File</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Are you sure you want to delete "{file.name}"? This action cannot be undone.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() => handleDelete(file.id)}
                                                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                        >
                                                            Delete
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

// Helper for formatting file sizes
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
