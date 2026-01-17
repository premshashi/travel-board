import { TravelPost } from '@/types/travel';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronDown } from 'lucide-react';

interface TravelPostCardProps {
  post: TravelPost;
  onClick: (post: TravelPost) => void;
}

export const TravelPostCard = ({ post, onClick }: TravelPostCardProps) => {
  return (
    <Card 
      className="cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.99]"
      onClick={() => onClick(post)}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-2 text-foreground">
          <span className="font-semibold">{post.origin}</span>
          <span className="text-muted-foreground">–</span>
          <span className="text-sm text-muted-foreground">{post.originFull}</span>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <ChevronDown className="w-3.5 h-3.5 text-primary" strokeWidth={2.5} />
          <span className="font-semibold">{post.destination}</span>
          <span className="text-muted-foreground">–</span>
          <span className="text-sm text-muted-foreground">{post.destinationFull}</span>
        </div>
        <p className="text-sm text-muted-foreground mt-3">
          {post.requestType === 'need_companion' 
            ? 'Need a Travel Companion' 
            : 'Offering to Accompany'}
        </p>
      </CardContent>
    </Card>
  );
};
