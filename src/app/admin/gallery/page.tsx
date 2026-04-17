'use client';

import { useSiteConfig } from '@/context/site-config';
import { Button } from '@/components/ui/button';
import { useState, useRef } from 'react';
import { Upload, Trash, Image as ImageIcon, Loader2, Star, Wand2 } from 'lucide-react';
import { ImageItem } from '@/types';
import ImageEditor from '@/components/admin/ImageEditor';

export default function GalleryPage() {
    const { config, updateConfig } = useSiteConfig();
    const [images, setImages] = useState<ImageItem[]>(config.gallery);
    const [isUploading, setIsUploading] = useState(false);
    const [editingImage, setEditingImage] = useState<ImageItem | null>(null);
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

    const handleSaveEditedImage = async (file: File) => {
        if (!editingImage) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();

            if (data.success) {
                // Add as a new image or replace? Let's add as new for safety, but maybe typically we replace?
                // For "Eraser" workflow, usually we want the result.
                // Let's replace the URL of the existing image ID? No, S3 cache issues.
                // Let's add as new image for now so user doesn't lose original.
                const newImage: ImageItem = {
                    id: data.id,
                    url: data.url,
                    caption: editingImage.caption,
                    tags: editingImage.tags,
                    enhanced: true
                };
                const updatedImages = [...images, newImage];
                setImages(updatedImages);
                updateConfig({ gallery: updatedImages });
                setEditingImage(null);
            } else {
                alert('Save failed: ' + data.message);
            }
        } catch (err) {
            console.error(err);
            alert('Save error');
        } finally {
            setIsUploading(false);
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
                        {config.heroImageId === img.id && (
                            <div className="absolute top-2 left-2 z-10 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded-full shadow-lg flex items-center gap-1">
                                <Star size={10} className="fill-black" />
                                Hero
                            </div>
                        )}
                        <img
                            src={img.url}
                            alt="Gallery item"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <Button size="icon" variant={config.heroImageId === img.id ? "default" : "outline"} onClick={() => updateConfig({ heroImageId: img.id })} title="Set as Hero Image">
                                <Star className={config.heroImageId === img.id ? "fill-current text-yellow-500" : ""} size={16} />
                            </Button>
                            <Button size="icon" variant="outline" onClick={() => setEditingImage(img)} title="Magic Eraser">
                                <Wand2 className="h-4 w-4 text-purple-400" />
                            </Button>
                            <Button size="icon" variant="destructive" onClick={() => handleDelete(img.id)} title="Delete Image">
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

            {editingImage && (
                <ImageEditor
                    imageUrl={editingImage.url}
                    onSave={handleSaveEditedImage}
                    onCancel={() => setEditingImage(null)}
                />
            )}
        </div>
    );
}
