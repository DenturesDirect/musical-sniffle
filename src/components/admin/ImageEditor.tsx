'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Eraser, Save, X, Undo, Download } from 'lucide-react';

interface ImageEditorProps {
    imageUrl: string;
    onSave: (file: File) => void;
    onCancel: () => void;
}

export default function ImageEditor({ imageUrl, onSave, onCancel }: ImageEditorProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [brushSize, setBrushSize] = useState(20);
    const [imgElement, setImgElement] = useState<HTMLImageElement | null>(null);

    // History for undo (simple: just save previous image state data URL)
    const [history, setHistory] = useState<string[]>([]);

    useEffect(() => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = imageUrl;
        img.onload = () => {
            setImgElement(img);
            resetCanvas(img);
        };
    }, [imageUrl]);

    const resetCanvas = (img: HTMLImageElement) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Fit canvas to screen while maintaining aspect ratio
        const maxWidth = Math.min(800, window.innerWidth - 40);
        const scale = maxWidth / img.width;

        canvas.width = img.width;
        canvas.height = img.height;
        // Visual scaling handled by CSS, but internal resolution matches image

        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.drawImage(img, 0, 0);
            saveHistory();
        }
    };

    const saveHistory = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            if (history.length > 5) {
                setHistory(prev => [...prev.slice(1), canvas.toDataURL()]);
            } else {
                setHistory(prev => [...prev, canvas.toDataURL()]);
            }
        }
    };

    const handleUndo = () => {
        if (history.length <= 1) return;
        const previousState = history[history.length - 2];
        const newHistory = history.slice(0, history.length - 1);
        setHistory(newHistory);

        const img = new Image();
        img.onload = () => {
            const canvas = canvasRef.current;
            const ctx = canvas?.getContext('2d');
            if (canvas && ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0);
            }
        };
        img.src = previousState;
    };

    // Drawing Logic - effectively "blurring" immediately for better UX or just drawing red mask?
    // Let's implement immediate Pixalation/Blur effect on the brush stroke "Privacy Eraser"

    const applyEffect = (x: number, y: number) => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        // Create a temporary canvas to generate the blurred chunk
        // Actually, simple pixelate is faster and easier to implement manually
        const size = brushSize;
        const r = size / 2;

        // Get image data for the brush area
        // We will simple "Stack Blur" or Block Pixelate this region
        const startX = Math.max(0, x - r);
        const startY = Math.max(0, y - r);
        const w = Math.min(size, canvas.width - startX);
        const h = Math.min(size, canvas.height - startY);

        if (w <= 0 || h <= 0) return;

        // Apply automatic blur
        // We can use the filter property if we save/restore context
        ctx.save();
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.clip();

        // Draw the canvas onto itself with a blur filter? 
        // Note: ctx.filter is widely supported now
        ctx.filter = 'blur(5px)';
        ctx.drawImage(canvas, 0, 0);
        // This re-draws the WHOLE canvas blurred, but clipped to the circle. 
        // Efficient enough for typical sizes.

        ctx.restore();
    };

    const getMousePos = (e: React.MouseEvent | React.TouchEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };

        const rect = canvas.getBoundingClientRect();

        let clientX, clientY;
        if ('touches' in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = (e as React.MouseEvent).clientX;
            clientY = (e as React.MouseEvent).clientY;
        }

        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        return {
            x: (clientX - rect.left) * scaleX,
            y: (clientY - rect.top) * scaleY
        };
    };

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        setIsDrawing(true);
        const { x, y } = getMousePos(e);
        applyEffect(x, y);
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing) return;
        const { x, y } = getMousePos(e);
        applyEffect(x, y);
    };

    const stopDrawing = () => {
        if (isDrawing) {
            setIsDrawing(false);
            saveHistory();
        }
    };

    const handleSave = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.toBlob((blob) => {
            if (blob) {
                const file = new File([blob], "edited-image.png", { type: "image/png" });
                onSave(file);
            }
        }, 'image/png');
    };

    return (
        <div className="fixed inset-0 z-50 bg-slate-900/90 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden max-w-5xl w-full flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between p-4 border-b border-slate-200">
                    <h3 className="font-semibold text-slate-800">Magic Eraser (Privacy Blur)</h3>
                    <div className="flex gap-2">
                        <button onClick={onCancel} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-auto bg-slate-100 p-4 flex items-center justify-center relative">
                    <canvas
                        ref={canvasRef}
                        className="max-w-full shadow-lg cursor-crosshair bg-white"
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        onTouchStart={startDrawing}
                        onTouchMove={draw}
                        onTouchEnd={stopDrawing}
                    />
                </div>

                <div className="p-4 border-t border-slate-200 bg-white flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-slate-600">Brush Size</span>
                            <input
                                type="range"
                                min="10"
                                max="100"
                                value={brushSize}
                                onChange={(e) => setBrushSize(Number(e.target.value))}
                                className="w-32 accent-rose-500"
                            />
                        </div>
                        <button
                            onClick={handleUndo}
                            disabled={history.length <= 1}
                            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg disabled:opacity-50"
                        >
                            <Undo className="w-4 h-4" /> Undo
                        </button>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={onCancel}
                            className="px-4 py-2 text-slate-600 hover:bg-slate-50 font-medium rounded-lg"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="flex items-center gap-2 px-6 py-2 bg-rose-600 hover:bg-rose-700 text-white font-medium rounded-lg shadow-sm transition-colors"
                        >
                            <Save className="w-4 h-4" /> Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
