'use client';

import { useSiteConfig } from '@/context/site-config';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { Save } from 'lucide-react';

export default function AvailabilityPage() {
    const { config, updateConfig } = useSiteConfig();
    const [formData, setFormData] = useState(config.availability);
    const [isChanged, setIsChanged] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const updated = { ...prev, [name]: value };
            setIsChanged(true);
            return updated;
        });
    };

    const handleSave = () => {
        updateConfig({ availability: formData });
        setIsChanged(false);
        alert('Availability saved!');
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Availability</h1>
                    <p className="text-slate-500">Manage your schedule and status.</p>
                </div>
                <Button onClick={handleSave} disabled={!isChanged}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                </Button>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="status">Current Status</Label>
                    <select
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="flex h-9 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950"
                    >
                        <option value="available">Available</option>
                        <option value="limited">Limited Availability</option>
                        <option value="unavailable">Unavailable / Booked</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="schedule">General Schedule</Label>
                    <Textarea
                        id="schedule"
                        name="schedule"
                        value={formData.schedule}
                        onChange={handleChange}
                        placeholder="e.g. Mon-Fri: 6pm - 12am"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Input
                        id="notes"
                        name="notes"
                        value={formData.notes || ''}
                        onChange={handleChange}
                        placeholder="e.g. Please book 24 hours in advance."
                    />
                </div>
            </div>
        </div>
    );
}
