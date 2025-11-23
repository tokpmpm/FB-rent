"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface AdInterstitialProps {
    isOpen: boolean;
    onClose: () => void;
    targetUrl: string;
}

export function AdInterstitial({ isOpen, onClose, targetUrl }: AdInterstitialProps) {
    const [canClose, setCanClose] = useState(false);
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        if (isOpen) {
            setCanClose(false);
            setCountdown(5);

            // Countdown timer
            const interval = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        setCanClose(true);
                        clearInterval(interval);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [isOpen]);

    const handleClose = () => {
        if (canClose) {
            // Open target URL in new tab
            window.open(targetUrl, '_blank', 'noopener,noreferrer');
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
            <div className="relative w-full max-w-4xl h-[90vh] bg-white rounded-lg shadow-xl overflow-hidden">
                {/* Ad Container */}
                <div className="w-full h-full flex flex-col items-center justify-center p-8">
                    {/* Google AdSense Placeholder */}
                    <div className="w-full max-w-3xl h-[600px] bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                        <div className="text-center space-y-4">
                            <div className="text-6xl">📢</div>
                            <p className="text-xl font-semibold text-gray-700">廣告載入中...</p>
                            <p className="text-sm text-gray-500">
                                {canClose ? "可以關閉了！" : `${countdown} 秒後可關閉`}
                            </p>
                            {/* Google AdSense Ad Unit - Replace with actual ad code */}
                            <ins className="adsbygoogle"
                                style={{ display: 'block' }}
                                data-ad-client="ca-pub-9747455231872729"
                                data-ad-slot="YOUR_AD_SLOT_ID"
                                data-ad-format="auto"
                                data-full-width-responsive="true"></ins>
                        </div>
                    </div>

                    {/* Close Button */}
                    <div className="mt-8">
                        <Button
                            onClick={handleClose}
                            disabled={!canClose}
                            size="lg"
                            className="px-8"
                        >
                            {canClose ? "關閉廣告並查看貼文" : `請稍候 ${countdown} 秒...`}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
