'use client';

import { useSiteConfig } from '@/context/site-config';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useState, useEffect, useRef } from 'react';
import { Save, Loader2, Camera, User } from 'lucide-react';

export default function ProfilePage() {
    const { config, updateConfig } = useSiteConfig();
    const [formData, setFormData] = useState(config.profile);
    const [isChanged, setIsChanged] = useState(false);

    // Sync internal state if config changes externally (unlikely here but good practice)
    useEffect(() => {
        setFormData(config.profile);
    }, [config.profile]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const updated = { ...prev, [name]: value };
            setIsChanged(true);
            return updated;
        });
    };

    const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const updated = {
                ...prev,
                socials: {
                    ...prev.socials,
                    [name]: value
                }
            };
            setIsChanged(true);
            return updated;
        });
    };

    const handleSave = () => {
        updateConfig({ profile: formData });
        setIsChanged(false);
        // Could add toast notification here
        alert('Profile saved!');
    };

    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
    const avatarInputRef = useRef<HTMLInputElement>(null);

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setIsUploadingAvatar(true);
        const file = files[0];
        const uploadFormData = new FormData();
        uploadFormData.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: uploadFormData,
            });
            const data = await res.json();

            if (data.success) {
                setFormData(prev => {
                    const updated = { ...prev, avatar: data.url };
                    setIsChanged(true);
                    return updated;
                });
            } else {
                alert('Upload failed: ' + data.message);
            }
        } catch (err) {
            console.error(err);
            alert('Upload error');
        } finally {
            setIsUploadingAvatar(false);
            if (avatarInputRef.current) avatarInputRef.current.value = '';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Profile & Bio</h1>
                    <p className="text-slate-500">Manage your public persona information.</p>
                </div>
                <Button onClick={handleSave} disabled={!isChanged}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                </Button>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 space-y-6">
                <div className="flex flex-col items-center mb-6 border-b border-slate-100 pb-6">
                    <div className="relative group cursor-pointer" onClick={() => avatarInputRef.current?.click()}>
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-slate-100 bg-slate-200 relative">
                            {formData.avatar ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={formData.avatar} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-400">
                                    <User size={48} />
                                </div>
                            )}
                            {isUploadingAvatar && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Camera className="w-8 h-8 text-white" />
                            </div>
                        </div>
                        <input
                            type="file"
                            ref={avatarInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleAvatarUpload}
                        />
                    </div>
                    <p className="text-sm text-center text-slate-500 mt-2">Tap to change photo</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="name">Display Name</Label>
                        <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g. Jane Doe"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="tagline">Tagline</Label>
                        <Input
                            id="tagline"
                            name="tagline"
                            value={formData.tagline}
                            onChange={handleChange}
                            placeholder="e.g. Exclusive & Elegant"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                        id="bio"
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        className="min-h-[150px]"
                        placeholder="Tell your story..."
                    />
                    <p className="text-xs text-slate-400">
                        Tip: Use the AI Rewriter in the dashboard to polish this text.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                            id="location"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="contactEmail">Contact Email</Label>
                        <Input
                            id="contactEmail"
                            name="contactEmail"
                            value={formData.contactEmail}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="contactPhone">Phone (Optional)</Label>
                        <Input
                            id="contactPhone"
                            name="contactPhone"
                            value={formData.contactPhone || ''}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="whatsapp">WhatsApp (Optional)</Label>
                        <Input
                            id="whatsapp"
                            name="whatsapp"
                            value={formData.whatsapp || ''}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="spName">Service Provider Name (Internal)</Label>
                        <Input
                            id="spName"
                            name="spName"
                            value={formData.spName || ''}
                            onChange={handleChange}
                            placeholder="Legal/Internal Name"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="suggestedDomain">Suggested Domain</Label>
                        <Input
                            id="suggestedDomain"
                            name="suggestedDomain"
                            value={formData.suggestedDomain || ''}
                            onChange={handleChange}
                            placeholder="client-name.com"
                        />
                    </div>
                </div>

            </div>
        </div>
    );
}
