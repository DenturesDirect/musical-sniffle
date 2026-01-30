'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { SiteConfig, DEFAULT_CONFIG, ThemeVariant } from '@/types';

interface SiteConfigContextType {
    config: SiteConfig;
    updateConfig: (updates: Partial<SiteConfig>) => void;
    setTheme: (theme: ThemeVariant) => void;
    resetConfig: () => void;
}

const SiteConfigContext = createContext<SiteConfigContextType | undefined>(undefined);

export const SiteConfigProvider = ({ children }: { children: ReactNode }) => {
    const [config, setConfig] = useState<SiteConfig>(DEFAULT_CONFIG);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from API on mount
    useEffect(() => {
        const loadConfig = async () => {
            try {
                const res = await fetch('/api/config');
                if (res.ok) {
                    const data = await res.json();
                    setConfig(data);
                }
            } catch (e) {
                console.error('Failed to load config', e);
            } finally {
                setIsLoaded(true);
            }
        };
        loadConfig();
    }, []);

    const updateConfig = (updates: Partial<SiteConfig>) => {
        setConfig((prev) => {
            const newConfig = { ...prev, ...updates };
            // Fire and forget save to API
            fetch('/api/config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newConfig)
            }).catch(err => console.error('Failed to save config', err));

            return newConfig;
        });
    };

    const setTheme = (theme: ThemeVariant) => {
        updateConfig({ theme });
    };

    const resetConfig = () => {
        setConfig(DEFAULT_CONFIG);
        updateConfig(DEFAULT_CONFIG);
    };

    if (!isLoaded) {
        return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-400">Loading Site...</div>;
    }

    return (
        <SiteConfigContext.Provider value={{ config, updateConfig, setTheme, resetConfig }}>
            {children}
        </SiteConfigContext.Provider>
    );
};

export const useSiteConfig = () => {
    const context = useContext(SiteConfigContext);
    if (context === undefined) {
        throw new Error('useSiteConfig must be used within a SiteConfigProvider');
    }
    return context;
};
