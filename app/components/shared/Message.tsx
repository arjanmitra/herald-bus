'use client';

import React, { useState, useEffect } from 'react';

interface MessageProps {
    message: string;
    type: 'success' | 'error' | '';
    onClose: () => void;
}

export default function Message({ message, type, onClose }: MessageProps) {
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                onClose();
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [message, onClose]);

    if (!message) return null;

    return (
        <div className={`message ${type}`}>
            <span>{message}</span>
            <button
                className="message-close"
                onClick={onClose}
                aria-label="Close message"
            >
                ×
            </button>
        </div>
    );
}