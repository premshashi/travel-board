import { FilterOptions, AIRPORTS, AIRLINES } from '@/types/travel';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ChevronRight } from 'lucide-react';

interface FilterSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onClear: () => void;
}

export const FilterSheet = ({ 
  open, 
  onOpenChange, 
  filters, 
  onFiltersChange, 
  onClear 
}: FilterSheetProps) => {
  const airportCodes = Object.keys(AIRPORTS);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-2xl">
        <SheetHeader className="pb-4">
          <SheetTitle>Filter</SheetTitle>
        </SheetHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Origin</Label>
            <Select
              value={filters.origin}
              onValueChange={(value) => onFiltersChange({ ...filters, origin: value })}
            >
              <SelectTrigger className="justify-between">
                <SelectValue placeholder="Any" />
                <ChevronRight className="h-4 w-4 opacity-50" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                {airportCodes.map((code) => (
                  <SelectItem key={code} value={code}>
                    {code} – {AIRPORTS[code as keyof typeof AIRPORTS]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Destination</Label>
            <Select
              value={filters.destination}
              onValueChange={(value) => onFiltersChange({ ...filters, destination: value })}
            >
              <SelectTrigger className="justify-between">
                <SelectValue placeholder="Any" />
                <ChevronRight className="h-4 w-4 opacity-50" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                {airportCodes.map((code) => (
                  <SelectItem key={code} value={code}>
                    {code} – {AIRPORTS[code as keyof typeof AIRPORTS]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Airline</Label>
            <Select
              value={filters.airline}
              onValueChange={(value) => onFiltersChange({ ...filters, airline: value })}
            >
              <SelectTrigger className="justify-between">
                <SelectValue placeholder="Any" />
                <ChevronRight className="h-4 w-4 opacity-50" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                {AIRLINES.map((airline) => (
                  <SelectItem key={airline} value={airline}>
                    {airline}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <SheetFooter className="flex-row gap-4 pt-4">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={onClear}
          >
            Clear all
          </Button>
          <Button 
            className="flex-1"
            onClick={() => onOpenChange(false)}
          >
            Done
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
