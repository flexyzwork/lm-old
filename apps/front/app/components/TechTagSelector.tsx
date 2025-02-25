"use client";

import { useState, useEffect } from "react";

interface TechTagSelectorProps {
  selectedTech?: string[];
  setSelectedTech?: (tech: string[]) => void;
}

const techOptions = ["React", "Next.js", "Tailwind", "Node.js", "NestJS", "TypeScript"];

function TechTagSelector({ selectedTech = [], setSelectedTech }: TechTagSelectorProps) {
  const [internalSelectedTech, setInternalSelectedTech] = useState<string[]>(selectedTech);

  useEffect(() => {
    setInternalSelectedTech(selectedTech);
  }, [selectedTech]);

  const toggleTech = (tech: string) => {
    const updatedTech = internalSelectedTech.includes(tech)
      ? internalSelectedTech.filter((t) => t !== tech)
      : [...internalSelectedTech, tech];

    setInternalSelectedTech(updatedTech);
    if (setSelectedTech) setSelectedTech(updatedTech);
  };

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {techOptions.map((tech) => {
        const isSelected = internalSelectedTech.includes(tech);

        return (
          <button
            key={tech}
            type="button"
            onClick={() => toggleTech(tech)}
            className={`px-3 py-1 rounded-full text-sm border transition-all ${
              isSelected ? "bg-blue-500 text-white border-blue-600 shadow-md" : "bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300"
            }`}
            aria-pressed={isSelected}
          >
            {tech}
          </button>
        );
      })}
    </div>
  );
}

export default  TechTagSelector;