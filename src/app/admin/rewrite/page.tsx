'use client';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { Sparkles, Copy, Loader2 } from 'lucide-react';

export default function RewritePage() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [loading, setLoading] = useState(false);
    const [tone, setTone] = useState('professional');

    const handleRewrite = async () => {
        if (!input) return;
        setLoading(true);
        try {
            const res = await fetch('/api/rewrite', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: input, tone }),
            });
            const data = await res.json();
            if (data.success) {
                setOutput(data.rewritten);
            }
        } catch (e) {
            alert('Error rewriting text');
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(output);
        alert('Copied to clipboard!');
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">AI Rewriter</h1>
                <p className="text-slate-500">Refine your bio and descriptions instantly.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Original Text</Label>
                        <Textarea
                            placeholder="Paste your rough draft here..."
                            className="h-[300px]"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <select
                            className="h-9 rounded-md border border-slate-200 text-sm px-3"
                            value={tone}
                            onChange={(e) => setTone(e.target.value)}
                        >
                            <option value="professional">Professional / Elegant</option>
                            <option value="warm">Warm / Intimate</option>
                            <option value="confident">Bold / Confident</option>
                        </select>
                        <Button onClick={handleRewrite} disabled={loading || !input} className="flex-1">
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                            Rewrite
                        </Button>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Polished Result</Label>
                        <div className="relative">
                            <Textarea
                                readOnly
                                className="h-[300px] bg-slate-50"
                                value={output}
                                placeholder="AI output will appear here..."
                            />
                            {output && (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="absolute top-2 right-2"
                                    onClick={copyToClipboard}
                                >
                                    <Copy className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
