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
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CreatePostModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (post: Omit<TravelPost, 'id' | 'createdAt'>) => void;
}

export const CreatePostModal = ({ open, onOpenChange, onSubmit }: CreatePostModalProps) => {
  const [date, setDate] = useState<Date>();
  const [formData, setFormData] = useState({
    departureTime: '',
    origin: '',
    destination: '',
    flightNumber: '',
    airline: '',
    requestType: 'need_companion' as 'need_companion' | 'offering_companion',
    postedBy: '',
    contactMethod: 'instagram' as 'instagram' | 'whatsapp' | 'email' | 'phone',
    contactId: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) return;

    onSubmit({
      travelDate: format(date, 'yyyy-MM-dd'),
      departureTime: formData.departureTime,
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
    });
    onOpenChange(false);
  };

  const airportCodes = Object.keys(AIRPORTS);

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
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>Departure Time</Label>
            <Input
              type="time"
              value={formData.departureTime}
              onChange={(e) => setFormData({ ...formData, departureTime: e.target.value })}
              required
            />
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
                  {airportCodes.map((code) => (
                    <SelectItem key={code} value={code}>
                      {code}
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
                  {airportCodes.map((code) => (
                    <SelectItem key={code} value={code}>
                      {code}
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
                <SelectItem value="offering_companion">Offering to Accompany</SelectItem>
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
                onValueChange={(value: 'instagram' | 'whatsapp' | 'email' | 'phone') => 
                  setFormData({ ...formData, contactMethod: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="phone">Phone</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Contact ID</Label>
              <Input
                placeholder={
                  formData.contactMethod === 'instagram' ? '@username' :
                  formData.contactMethod === 'whatsapp' ? '+1234567890' :
                  formData.contactMethod === 'email' ? 'email@example.com' :
                  '+1234567890'
                }
                value={formData.contactId}
                onChange={(e) => setFormData({ ...formData, contactId: e.target.value })}
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full" size="lg">
            Create Post
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
