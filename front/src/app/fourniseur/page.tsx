"use client";
import React, { useMemo } from 'react';
import CreateCommandeFournisseur from '../types/CreateCommandeFournisseur';


export default function Page() {

    const memoizedCreateCommandeFournisseur = useMemo(() => {
        return <CreateCommandeFournisseur />;
    }, []);

    return (
        <div>
            {memoizedCreateCommandeFournisseur}
        </div>
    );
}
