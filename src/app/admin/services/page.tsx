'use client';

import { useSiteConfig } from '@/context/site-config';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { Plus, Trash, Save } from 'lucide-react';
import { ServiceItem } from '@/types';

export default function ServicesPage() {
    const { config, updateConfig } = useSiteConfig();
    const [services, setServices] = useState<ServiceItem[]>(config.services);

    // Local state to track which items are being edited is tricky if we want instant save or bulk save.
    // I'll do bulk save pattern to be consistent with Profile page.
    const [isChanged, setIsChanged] = useState(false);

    const handleUpdateService = (id: string, field: keyof ServiceItem, value: string) => {
        setServices(prev => prev.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        ));
        setIsChanged(true);
    };

    const handleAddService = () => {
        const newService: ServiceItem = {
            id: crypto.randomUUID(),
            name: '',
            description: '',
            rate: '',
            duration: ''
        };
        setServices(prev => [...prev, newService]);
        setIsChanged(true);
    };

    const handleDeleteService = (id: string) => {
        if (confirm('Are you sure you want to delete this service?')) {
            setServices(prev => prev.filter(item => item.id !== id));
            setIsChanged(true);
        }
    };

    const handleSave = () => {
        updateConfig({ services });
        setIsChanged(false);
        alert('Services saved!');
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Services</h1>
                    <p className="text-slate-500">Define your offerings and rates.</p>
                </div>
                <Button onClick={handleSave} disabled={!isChanged}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                </Button>
            </div>

            <div className="space-y-4">
                {services.length === 0 && (
                    <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                        <p className="text-slate-500 mb-4">No services listed yet.</p>
                        <Button onClick={handleAddService} variant="outline">
                            <Plus className="mr-2 h-4 w-4" />
                            Add First Service
                        </Button>
                    </div>
                )}

                {services.map((service, index) => (
                    <div key={service.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 relative group">
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button size="sm" variant="destructive" onClick={() => handleDeleteService(service.id)}>
                                <Trash className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2 mb-4">
                            <div className="space-y-2">
                                <Label>Service Name</Label>
                                <Input
                                    value={service.name}
                                    onChange={(e) => handleUpdateService(service.id, 'name', e.target.value)}
                                    placeholder="e.g. Dinner Date"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Rate</Label>
                                    <Input
                                        value={service.rate}
                                        onChange={(e) => handleUpdateService(service.id, 'rate', e.target.value)}
                                        placeholder="e.g. 300"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Duration</Label>
                                    <Input
                                        value={service.duration || ''}
                                        onChange={(e) => handleUpdateService(service.id, 'duration', e.target.value)}
                                        placeholder="e.g. 2 hours"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea
                                value={service.description}
                                onChange={(e) => handleUpdateService(service.id, 'description', e.target.value)}
                                placeholder="Describe what is included..."
                            />
                        </div>
                    </div>
                ))}

                {services.length > 0 && (
                    <Button onClick={handleAddService} variant="outline" className="w-full">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Another Service
                    </Button>
                )}
            </div>
        </div>
    );
}
