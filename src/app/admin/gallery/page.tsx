'use client';

import { useSiteConfig } from '@/context/site-config';
import { Button } from '@/components/ui/button';
import { useState, useRef } from 'react';
import { Upload, Trash, Image as ImageIcon, Loader2 } from 'lucide-react';
import { ImageItem } from '@/types';

export default function GalleryPage() {
    const { config, updateConfig } = useSiteConfig();
    const [images, setImages] = useState<ImageItem[]>(config.gallery);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setIsUploading(true);
        const file = files[0];
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();

            if (data.success) {
                const newImage: ImageItem = {
                    id: data.id,
                    url: data.url,
                    caption: '',
                };
                const updatedImages = [...images, newImage];
                setImages(updatedImages);
                updateConfig({ gallery: updatedImages });
            } else {
                alert('Upload failed: ' + data.message);
            }
        } catch (err) {
            console.error(err);
            alert('Upload error');
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleDelete = (id: string) => {
        if (confirm('Delete this image?')) {
            const updatedImages = images.filter(img => img.id !== id);
            setImages(updatedImages);
            updateConfig({ gallery: updatedImages });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Gallery</h1>
                    <p className="text-slate-500">Manage your portfolio and photos.</p>
                </div>
                <div className="flex gap-2">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/*"
                    />
                    <Button onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
                        {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                        Upload Photo
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((img) => (
                    <div key={img.id} className="relative group bg-slate-100 rounded-lg overflow-hidden aspect-[3/4]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={img.url}
                            alt="Gallery item"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <Button size="icon" variant="outline" onClick={() => {
                                const updated = images.map(i => i.id === img.id ? { ...i, enhanced: !i.enhanced } : i);
                                setImages(updated);
                                updateConfig({ gallery: updated });
                            }}>
                                <div className={img.enhanced ? "text-blue-500" : "text-slate-500"}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 18 14-14" /><path d="M21 21s-5 0-5-5" /><path d="M5 21s5 0 5-5" /><path d="M2 12h1" /><path d="M21 12h1" /><path d="M12 2v1" /><path d="M12 21v1" /><path d="M18.4 5.6 19 5" /><path d="M5.6 18.4 5 19" /></svg>
                                </div>
                            </Button>
                            <Button size="icon" variant="destructive" onClick={() => handleDelete(img.id)}>
                                <Trash className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                ))}
                {images.length === 0 && (
                    <div className="col-span-2 md:col-span-4 py-12 text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
                        <ImageIcon className="mx-auto h-12 w-12 mb-4 opacity-50" />
                        <p>No images uploaded yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
