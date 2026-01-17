import { TravelPost } from '@/types/travel';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { MessageCircle, Mail, Phone } from 'lucide-react';
import { format } from 'date-fns';

interface PostDetailModalProps {
  post: TravelPost | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PostDetailModal = ({ post, open, onOpenChange }: PostDetailModalProps) => {
  if (!post) return null;

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMMM d, yyyy');
  };

  const getContactAction = () => {
    switch (post.contactMethod) {
      case 'instagram':
        return {
          icon: MessageCircle,
          label: 'Direct Message on Instagram',
          href: `https://instagram.com/${post.contactId}`,
        };
      case 'whatsapp':
        return {
          icon: MessageCircle,
          label: 'Message on WhatsApp',
          href: `https://wa.me/${post.contactId.replace(/[^0-9]/g, '')}`,
        };
      case 'email':
        return {
          icon: Mail,
          label: 'Send Email',
          href: `mailto:${post.contactId}`,
        };
      case 'phone':
        return {
          icon: Phone,
          label: 'Call',
          href: `tel:${post.contactId}`,
        };
    }
  };

  const contactAction = getContactAction();
  const ContactIcon = contactAction.icon;

  const details = [
    { label: 'Departure Time', value: post.departureTime },
    { label: 'Origin', value: post.origin },
    { label: 'Destination', value: post.destination },
    { label: 'Flight Number', value: post.flightNumber },
    { label: 'Request Type', value: post.requestType === 'need_companion' ? 'Need a Travel Companion' : 'Offering to Accompany' },
    { label: 'Posted By', value: post.postedBy },
    { label: 'Contact Method', value: post.contactMethod.charAt(0).toUpperCase() + post.contactMethod.slice(1) },
    { label: 'Contact ID', value: post.contactId },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Travel Date – {formatDate(post.travelDate)}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-1 py-4">
          {details.map((detail, index) => (
            <div key={detail.label}>
              <div className="flex justify-between py-3">
                <span className="text-muted-foreground">{detail.label}</span>
                <span className="font-medium text-right">{detail.value}</span>
              </div>
              {index < details.length - 1 && <Separator />}
            </div>
          ))}
        </div>

        <Button 
          className="w-full gap-2" 
          size="lg"
          onClick={() => window.open(contactAction.href, '_blank')}
        >
          <ContactIcon className="w-5 h-5" />
          {contactAction.label}
        </Button>
      </DialogContent>
    </Dialog>
  );
};
