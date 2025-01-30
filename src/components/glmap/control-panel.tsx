"use client";

import { Result } from "@/types/EvStation";
import { Menu } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";

type ControlPanelProps = {
  evStations: Result[];
  onSelectStation: (
    station: { longitude: number; latitude: number },
    index: number,
  ) => void;
  selectedIndex: number | null;
  isPinging: boolean;
};

export default function ControlPanel({
  evStations,
  onSelectStation,
  selectedIndex,
  isPinging,
}: ControlPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleStationSelect = (value: string) => {
    const index = parseInt(value);
    const station = evStations[index];

    // Call the selection handler
    onSelectStation(
      {
        longitude: station.position.lon,
        latitude: station.position.lat,
      },
      index,
    );

    // Close the sheet
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="absolute right-4 top-4 z-20"
        >
          <Menu
            className={`h-6 w-6 transition-transform duration-300 ${
              isOpen ? "rotate-90" : ""
            }`}
          />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] p-0 sm:w-[540px]">
        <Card className="h-full rounded-none border-0">
          <ScrollArea className="h-full p-6">
            <RadioGroup
              value={selectedIndex?.toString()}
              onValueChange={handleStationSelect}
            >
              {evStations.map((station, index) => (
                <div
                  key={`station-${index}`}
                  className={`flex items-center space-x-2 rounded-lg p-4 transition-all duration-300 ${
                    selectedIndex === index
                      ? isPinging
                        ? "bg-blue-100/50 shadow-md"
                        : "bg-blue-50/50"
                      : "hover:bg-gray-50"
                  } ${index !== evStations.length - 1 ? "mb-2" : ""}`}
                >
                  <RadioGroupItem
                    value={index.toString()}
                    id={`station-${index}`}
                    className="data-[state=checked]:border-blue-500"
                  />
                  <label
                    htmlFor={`station-${index}`}
                    className="flex-1 cursor-pointer text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {station.poi.name} {station.dist.toFixed(2)} km
                  </label>
                </div>
              ))}
            </RadioGroup>
          </ScrollArea>
        </Card>
      </SheetContent>
    </Sheet>
  );
}
