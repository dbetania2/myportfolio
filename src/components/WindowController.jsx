// src/components/WindowController.jsx

import React, { useState, useEffect } from 'react';
import PcComponent from './pcComponent/PcComponent.jsx';
import AboutMeComponent from './aboutme/AboutMeComponent.astro';

export default function WindowController() {
    const [activeInteraction, setActiveInteraction] = useState(null);

    useEffect(() => {
        const handleInteraction = (event) => {
            const { type } = event.detail;
            setActiveInteraction(type);
        };

        document.addEventListener('object-interacted', handleInteraction);

        return () => {
            document.removeEventListener('object-interacted', handleInteraction);
        };
    }, []);

    const handleClose = () => {
        setActiveInteraction(null);
    };

    return (
        <>
            {activeInteraction === 'pc' && (
                <PcComponent onClose={handleClose} />
            )}
            {activeInteraction === 'aboutme' && (
                <AboutMeComponent onClose={handleClose} />
            )}
            {/* Agregar mas condiciones para otros objetos */}
        </>
    );
}