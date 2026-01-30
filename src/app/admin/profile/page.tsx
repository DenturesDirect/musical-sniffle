'use client';

import { useSiteConfig } from '@/context/site-config';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';

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
            </div>
        </div>
    );
}
