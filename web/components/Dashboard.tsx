"use client";

import { useState, useMemo } from "react";
import { RentalPost } from "@/types";
import { RentalTable } from "@/components/RentalTable";
import { Filters } from "@/components/Filters";

interface DashboardProps {
    initialPosts: RentalPost[];
}

export default function Dashboard({ initialPosts }: DashboardProps) {
    const [filters, setFilters] = useState({
        location: "",
        budgetRange: [0, 50000] as [number, number],
        selectedTypes: [] as string[],
        selectedGenders: [] as string[],
        selectedPets: [] as string[],
    });

    // Extract all unique types from posts
    const availableTypes = useMemo(() => {
        const typesSet = new Set<string>();
        initialPosts.forEach(post => {
            // Split types by comma and trim
            const types = post.type.split(',').map(t => t.trim()).filter(t => t && t !== '未指定房型');
            types.forEach(type => typesSet.add(type));
        });
        return Array.from(typesSet).sort();
    }, [initialPosts]);

    // Get budget range from data
    const budgetRange = useMemo(() => {
        const budgets = initialPosts
            .map(post => {
                const num = parseInt(post.budget.replace(/\D/g, ""));
                return isNaN(num) || num === 0 ? null : num;
            })
            .filter((b): b is number => b !== null);

        if (budgets.length === 0) return { min: 0, max: 50000 };

        return {
            min: Math.floor(Math.min(...budgets) / 1000) * 1000,
            max: Math.ceil(Math.max(...budgets) / 1000) * 1000
        };
    }, [initialPosts]);

    const handleFilterChange = (key: string, value: any) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const filteredPosts = useMemo(() => {
        return initialPosts.filter((post) => {
            // Location filter  
            const matchLocation = !filters.location ||
                post.location.toLowerCase().includes(filters.location.toLowerCase());

            // Budget filter
            let matchBudget = true;
            const budgetNum = parseInt(post.budget.replace(/\D/g, ""));
            if (!isNaN(budgetNum) && budgetNum > 0) {
                matchBudget = budgetNum >= filters.budgetRange[0] && budgetNum <= filters.budgetRange[1];
            }

            // Type filter
            const matchType = filters.selectedTypes.length === 0 ||
                filters.selectedTypes.some(selectedType => post.type.includes(selectedType));

            // Gender filter
            const matchGender = filters.selectedGenders.length === 0 ||
                filters.selectedGenders.includes(post.gender);

            // Pet filter
            const matchPet = filters.selectedPets.length === 0 ||
                filters.selectedPets.includes(post.pet);

            return matchLocation && matchBudget && matchType && matchGender && matchPet;
        });
    }, [initialPosts, filters]);

    return (
        <div className="flex flex-col md:flex-row gap-6">
            <aside className="w-full md:w-80 flex-shrink-0">
                <Filters
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    availableTypes={availableTypes}
                    budgetRange={budgetRange}
                />
            </aside>
            <main className="flex-1">
                <div className="mb-4 flex justify-between items-center">
                    <h2 className="text-2xl font-bold">租屋貼文 ({filteredPosts.length})</h2>
                </div>
                <RentalTable posts={filteredPosts} />
            </main>
        </div>
    );
}
