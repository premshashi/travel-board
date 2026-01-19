import { useState, useMemo } from 'react';
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
import { CalendarIcon, Clock, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';

interface CreatePostModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (post: Omit<TravelPost, 'id' | 'createdAt'>) => void;
}

// Generate time options for every 5 minutes
const generateTimeOptions = () => {
  const times: { value: string; label: string }[] = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 5) {
      const h = hour.toString().padStart(2, '0');
      const m = minute.toString().padStart(2, '0');
      const period = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      times.push({
        value: `${h}:${m}`,
        label: `${displayHour}:${m.padStart(2, '0')} ${period}`
      });
    }
  }
  return times;
};

const TIME_OPTIONS = generateTimeOptions();

// Generate random captcha
const generateCaptcha = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let captcha = '';
  for (let i = 0; i < 6; i++) {
    captcha += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return captcha;
};

// Email validation regex
const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Required field label component
const RequiredLabel = ({ children }: { children: React.ReactNode }) => (
  <Label>
    {children} <span className="text-red-500">*</span>
  </Label>
);

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
    contactMethod: 'instagram' as 'instagram' | 'facebook' | 'email',
    contactId: '',
    additionalComments: '',
  });
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [captchaInput, setCaptchaInput] = useState('');
  const [emailError, setEmailError] = useState('');

  // Check if all required fields are filled
  const isFormValid = useMemo(() => {
    const hasRequiredFields = 
      date &&
      formData.departureTime &&
      formData.origin &&
      formData.destination &&
      formData.flightNumber &&
      formData.airline &&
      formData.requestType &&
      formData.postedBy &&
      formData.contactMethod &&
      formData.contactId &&
      captchaInput.toUpperCase() === captcha;

    // Additional email validation
    if (formData.contactMethod === 'email' && formData.contactId) {
      return hasRequiredFields && isValidEmail(formData.contactId);
    }

    return hasRequiredFields;
  }, [date, formData, captchaInput, captcha]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) return;

    // Validate email if email method selected
    if (formData.contactMethod === 'email' && !isValidEmail(formData.contactId)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    // Validate captcha
    if (captchaInput.toUpperCase() !== captcha) {
      return;
    }

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
    setCaptcha(generateCaptcha());
    setCaptchaInput('');
    setEmailError('');
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
      default:
        return 'Enter contact';
    }
  };

  const selectedTimeLabel = TIME_OPTIONS.find(t => t.value === formData.departureTime)?.label;

  const handleFlightNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow digits
    const value = e.target.value.replace(/\D/g, '');
    setFormData({ ...formData, flightNumber: value });
  };

  const handleContactIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData({ ...formData, contactId: value });
    
    // Clear error when user starts typing
    if (emailError) {
      setEmailError('');
    }

    // Validate email in real-time if email method selected
    if (formData.contactMethod === 'email' && value && !isValidEmail(value)) {
      setEmailError('Please enter a valid email address');
    }
  };

  const refreshCaptcha = () => {
    setCaptcha(generateCaptcha());
    setCaptchaInput('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Post</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <RequiredLabel>Travel Date</RequiredLabel>
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
            <RequiredLabel>Departure Time</RequiredLabel>
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
              <RequiredLabel>Origin</RequiredLabel>
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
              <RequiredLabel>Destination</RequiredLabel>
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
              <RequiredLabel>Airline</RequiredLabel>
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

            <div className="space-y-2">
              <RequiredLabel>Flight Number</RequiredLabel>
              <Input
                placeholder="e.g., 523"
                value={formData.flightNumber}
                onChange={handleFlightNumberChange}
                inputMode="numeric"
                pattern="[0-9]*"
              />
            </div>
          </div>

          <div className="space-y-2">
            <RequiredLabel>Request Type</RequiredLabel>
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
            <RequiredLabel>Your Name</RequiredLabel>
            <Input
              placeholder="Enter your name"
              value={formData.postedBy}
              onChange={(e) => setFormData({ ...formData, postedBy: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <RequiredLabel>Contact Method</RequiredLabel>
              <Select
                value={formData.contactMethod}
                onValueChange={(value: 'instagram' | 'facebook' | 'email') => {
                  setFormData({ ...formData, contactMethod: value, contactId: '' });
                  setEmailError('');
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <RequiredLabel>Contact ID</RequiredLabel>
              <Input
                placeholder={getContactPlaceholder()}
                value={formData.contactId}
                onChange={handleContactIdChange}
                type={formData.contactMethod === 'email' ? 'email' : 'text'}
              />
              {emailError && (
                <p className="text-sm text-red-500">{emailError}</p>
              )}
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

          {/* Captcha Section */}
          <div className="space-y-2 p-4 bg-muted rounded-lg">
            <RequiredLabel>Verify you're human</RequiredLabel>
            <div className="flex items-center gap-3">
              <div className="bg-background px-4 py-2 rounded border font-mono text-lg tracking-widest select-none">
                {captcha}
              </div>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={refreshCaptcha}
                title="Get new captcha"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
            <Input
              placeholder="Enter the code above"
              value={captchaInput}
              onChange={(e) => setCaptchaInput(e.target.value.toUpperCase())}
              className="mt-2"
              maxLength={6}
            />
            {captchaInput && captchaInput.toUpperCase() !== captcha && (
              <p className="text-sm text-red-500">Captcha does not match</p>
            )}
          </div>

          <Button 
            type="submit" 
            className={cn(
              "w-full transition-colors",
              isFormValid 
                ? "bg-green-600 hover:bg-green-700 text-white" 
                : "bg-muted text-muted-foreground cursor-not-allowed"
            )}
            size="lg"
            disabled={!isFormValid}
          >
            Submit Post
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};