"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";

interface FiltersProps {
    onFilterChange: (key: string, value: any) => void;
    filters: {
        location: string;
        budgetRange: [number, number];
        selectedTypes: string[];
        selectedGenders: string[];
        selectedPets: string[];
    };
    availableTypes: string[];
    budgetRange: {
        min: number;
        max: number;
    };
}

export function Filters({ onFilterChange, filters, availableTypes, budgetRange }: FiltersProps) {
    const handleTypeToggle = (type: string) => {
        const newTypes = filters.selectedTypes.includes(type)
            ? filters.selectedTypes.filter(t => t !== type)
            : [...filters.selectedTypes, type];
        onFilterChange("selectedTypes", newTypes);
    };

    return (
        <div className="space-y-6 p-6 border rounded-lg bg-card">
            <h3 className="font-semibold text-lg">篩選條件</h3>

            {/* Location Filter */}
            <div className="space-y-2">
                <label className="text-sm font-medium">地點</label>
                <Input
                    placeholder="例如：中山區、古亭"
                    value={filters.location}
                    onChange={(e) => onFilterChange("location", e.target.value)}
                />
            </div>

            {/* Budget Slider */}
            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <label className="text-sm font-medium">租金範圍</label>
                    <span className="text-sm text-muted-foreground">
                        ${filters.budgetRange[0].toLocaleString()} - ${filters.budgetRange[1].toLocaleString()}
                    </span>
                </div>
                <Slider
                    min={budgetRange.min}
                    max={budgetRange.max}
                    step={1000}
                    value={filters.budgetRange}
                    onValueChange={(value) => onFilterChange("budgetRange", value as [number, number])}
                    className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                    <span>${budgetRange.min.toLocaleString()}</span>
                    <span>${budgetRange.max.toLocaleString()}</span>
                </div>
            </div>

            {/* Type Checkboxes */}
            <div className="space-y-3">
                <label className="text-sm font-medium block">房型</label>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                    {availableTypes.map((type) => (
                        <div key={type} className="flex items-center space-x-2">
                            <Checkbox
                                id={type}
                                checked={filters.selectedTypes.includes(type)}
                                onCheckedChange={() => handleTypeToggle(type)}
                            />
                            <label
                                htmlFor={type}
                                className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                                {type}
                            </label>
                        </div>
                    ))}
                </div>
                {filters.selectedTypes.length > 0 && (
                    <div className="text-xs text-muted-foreground">
                        已選擇 {filters.selectedTypes.length} 項
                    </div>
                )}
            </div>

            {/* Gender Checkboxes */}
            <div className="space-y-3">
                <label className="text-sm font-medium block">性別</label>
                <div className="space-y-2">
                    {["男", "女", "男女皆可", "不明"].map((gender) => (
                        <div key={gender} className="flex items-center space-x-2">
                            <Checkbox
                                id={`gender-${gender}`}
                                checked={filters.selectedGenders.includes(gender)}
                                onCheckedChange={() => {
                                    const newGenders = filters.selectedGenders.includes(gender)
                                        ? filters.selectedGenders.filter(g => g !== gender)
                                        : [...filters.selectedGenders, gender];
                                    onFilterChange("selectedGenders", newGenders);
                                }}
                            />
                            <label
                                htmlFor={`gender-${gender}`}
                                className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                                {gender}
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Pet Checkboxes */}
            <div className="space-y-3">
                <label className="text-sm font-medium block">寵物</label>
                <div className="space-y-2">
                    {["可", "無", "禁止"].map((pet) => (
                        <div key={pet} className="flex items-center space-x-2">
                            <Checkbox
                                id={`pet-${pet}`}
                                checked={filters.selectedPets.includes(pet)}
                                onCheckedChange={() => {
                                    const newPets = filters.selectedPets.includes(pet)
                                        ? filters.selectedPets.filter(p => p !== pet)
                                        : [...filters.selectedPets, pet];
                                    onFilterChange("selectedPets", newPets);
                                }}
                            />
                            <label
                                htmlFor={`pet-${pet}`}
                                className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                                {pet === "可" ? "可養寵物" : pet === "無" ? "未提及" : "禁止寵物"}
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Reset Button */}
            <Button
                variant="secondary"
                className="w-full mt-4"
                onClick={() => {
                    onFilterChange("location", "");
                    onFilterChange("budgetRange", [budgetRange.min, budgetRange.max]);
                    onFilterChange("selectedTypes", []);
                    onFilterChange("selectedGenders", []);
                    onFilterChange("selectedPets", []);
                }}
            >
                重置篩選
            </Button>
        </div>
    );
}
