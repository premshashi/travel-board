import { useState } from 'react';
import { TravelPost, AIRPORTS, AIRLINES } from '@/types/travel';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CreatePostModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (post: Omit<TravelPost, 'id' | 'createdAt'>) => void;
}

// Generate time options in 15-minute intervals
const generateTimeOptions = () => {
  const times: string[] = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const h = hour.toString().padStart(2, '0');
      const m = minute.toString().padStart(2, '0');
      const period = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      times.push({
        value: `${h}:${m}`,
        label: `${displayHour}:${m} ${period}`
      } as any);
    }
  }
  return times as unknown as { value: string; label: string }[];
};

const TIME_OPTIONS = generateTimeOptions();

export const CreatePostModal = ({ open, onOpenChange, onSubmit }: CreatePostModalProps) => {
  const [date, setDate] = useState<Date>();
  const [timeOpen, setTimeOpen] = useState(false);
  const [formData, setFormData] = useState({
    departureTime: '',
    origin: '',
    destination: '',
    flightNumber: '',
    airline: '',
    requestType: 'need_companion' as 'need_companion' | 'offering_companion',
    postedBy: '',
    contactMethod: 'instagram' as 'instagram' | 'facebook' | 'email' | 'phone',
    contactId: '',
    additionalComments: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) return;

    // Format the time for display
    const timeOption = TIME_OPTIONS.find(t => t.value === formData.departureTime);
    const displayTime = timeOption ? timeOption.label : formData.departureTime;

    onSubmit({
      travelDate: format(date, 'yyyy-MM-dd'),
      departureTime: displayTime,
      origin: formData.origin,
      originFull: AIRPORTS[formData.origin as keyof typeof AIRPORTS] || formData.origin,
      destination: formData.destination,
      destinationFull: AIRPORTS[formData.destination as keyof typeof AIRPORTS] || formData.destination,
      flightNumber: formData.flightNumber,
      airline: formData.airline,
      requestType: formData.requestType,
      postedBy: formData.postedBy,
      contactMethod: formData.contactMethod,
      contactId: formData.contactId,
      additionalComments: formData.additionalComments || undefined,
    });

    // Reset form
    setDate(undefined);
    setFormData({
      departureTime: '',
      origin: '',
      destination: '',
      flightNumber: '',
      airline: '',
      requestType: 'need_companion',
      postedBy: '',
      contactMethod: 'instagram',
      contactId: '',
      additionalComments: '',
    });
    onOpenChange(false);
  };

  const airportEntries = Object.entries(AIRPORTS);

  const getContactPlaceholder = () => {
    switch (formData.contactMethod) {
      case 'instagram':
        return 'username';
      case 'facebook':
        return 'username';
      case 'email':
        return 'Enter Email Address';
      case 'phone':
        return '+1234567890';
      default:
        return 'Enter contact';
    }
  };

  const selectedTimeLabel = TIME_OPTIONS.find(t => t.value === formData.departureTime)?.label;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Post</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Travel Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !date && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, 'PPP') : 'Select date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  disabled={(date) => date < new Date()}
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>Departure Time</Label>
            <Popover open={timeOpen} onOpenChange={setTimeOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !formData.departureTime && 'text-muted-foreground'
                  )}
                >
                  <Clock className="mr-2 h-4 w-4" />
                  {selectedTimeLabel || 'Select time'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-0" align="start">
                <ScrollArea className="h-64">
                  <div className="p-2">
                    {TIME_OPTIONS.map((time) => (
                      <Button
                        key={time.value}
                        variant={formData.departureTime === time.value ? 'default' : 'ghost'}
                        className="w-full justify-start font-normal mb-1"
                        onClick={() => {
                          setFormData({ ...formData, departureTime: time.value });
                          setTimeOpen(false);
                        }}
                      >
                        {time.label}
                      </Button>
                    ))}
                  </div>
                </ScrollArea>
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Origin</Label>
              <Select
                value={formData.origin}
                onValueChange={(value) => setFormData({ ...formData, origin: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {airportEntries.map(([code, name]) => (
                    <SelectItem key={code} value={code}>
                      {code} - {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Destination</Label>
              <Select
                value={formData.destination}
                onValueChange={(value) => setFormData({ ...formData, destination: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {airportEntries.map(([code, name]) => (
                    <SelectItem key={code} value={code}>
                      {code} - {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Flight Number</Label>
              <Input
                placeholder="e.g., EK 523"
                value={formData.flightNumber}
                onChange={(e) => setFormData({ ...formData, flightNumber: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Airline</Label>
              <Select
                value={formData.airline}
                onValueChange={(value) => setFormData({ ...formData, airline: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {AIRLINES.map((airline) => (
                    <SelectItem key={airline} value={airline}>
                      {airline}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Request Type</Label>
            <Select
              value={formData.requestType}
              onValueChange={(value: 'need_companion' | 'offering_companion') => 
                setFormData({ ...formData, requestType: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="need_companion">Need a Travel Companion</SelectItem>
                <SelectItem value="offering_companion">Willing to Help</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Your Name</Label>
            <Input
              placeholder="Enter your name"
              value={formData.postedBy}
              onChange={(e) => setFormData({ ...formData, postedBy: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Contact Method</Label>
              <Select
                value={formData.contactMethod}
                onValueChange={(value: 'instagram' | 'facebook' | 'email' | 'phone') => 
                  setFormData({ ...formData, contactMethod: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="phone">Phone</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Contact ID</Label>
              <Input
                placeholder={getContactPlaceholder()}
                value={formData.contactId}
                onChange={(e) => setFormData({ ...formData, contactId: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Additional Comments</Label>
            <Textarea
              placeholder="Any additional information you'd like to share..."
              value={formData.additionalComments}
              onChange={(e) => setFormData({ ...formData, additionalComments: e.target.value })}
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full" size="lg">
            Create Post
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};