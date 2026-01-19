import { useState, useMemo, useEffect } from 'react';
import { TravelPost, FilterOptions } from '@/types/travel';
import { samplePosts } from '@/data/samplePosts';
import { addTravelPost, getTravelPosts } from '@/lib/firebase';
import { TravelPostCard } from '@/components/TravelPostCard';
import { PostDetailModal } from '@/components/PostDetailModal';
import { CreatePostModal } from '@/components/CreatePostModal';
import { FilterSheet } from '@/components/FilterSheet';
import FeedbackButton from '@/components/FeedbackButton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, SlidersHorizontal, PlaneTakeoff, Loader2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { toast } from 'sonner';

const Index = () => {
  const [posts, setPosts] = useState<TravelPost[]>(samplePosts);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<TravelPost | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({
    origin: '',
    destination: '',
    airline: '',
    requestType: '',
  });

  // Load posts from Firebase on mount
  useEffect(() => {
    const loadPosts = async () => {
      try {
        const firebasePosts = await getTravelPosts();
        // Combine Firebase posts with sample posts for demo, prioritizing Firebase
        setPosts(firebasePosts.length > 0 ? firebasePosts : samplePosts);
      } catch (error) {
        console.error('Error loading posts:', error);
        toast.error('Using sample data - configure Firebase to persist posts');
        setPosts(samplePosts);
      } finally {
        setLoading(false);
      }
    };
    loadPosts();
  }, []);

  const handlePostClick = (post: TravelPost) => {
    setSelectedPost(post);
    setDetailOpen(true);
  };

  const handleCreatePost = async (postData: Omit<TravelPost, 'id' | 'createdAt'>) => {
    try {
      const newPost = await addTravelPost(postData);
      setPosts([newPost, ...posts]);
      toast.success('Post created successfully!');
    } catch (error) {
      console.error('Error creating post:', error);
      // Fallback to local state if Firebase fails
      const localPost: TravelPost = {
        ...postData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString().split('T')[0],
      };
      setPosts([localPost, ...posts]);
      toast.error('Post saved locally - configure Firebase to persist');
    }
  };

  const clearFilters = () => {
    setFilters({ origin: '', destination: '', airline: '', requestType: '' });
  };

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const searchMatch = 
          post.origin.toLowerCase().includes(query) ||
          post.destination.toLowerCase().includes(query) ||
          post.originFull.toLowerCase().includes(query) ||
          post.destinationFull.toLowerCase().includes(query) ||
          post.airline.toLowerCase().includes(query) ||
          post.postedBy.toLowerCase().includes(query);
        if (!searchMatch) return false;
      }

      // Filter by origin
      if (filters.origin && filters.origin !== 'any' && post.origin !== filters.origin) {
        return false;
      }

      // Filter by destination
      if (filters.destination && filters.destination !== 'any' && post.destination !== filters.destination) {
        return false;
      }

      // Filter by airline
      if (filters.airline && filters.airline !== 'any' && post.airline !== filters.airline) {
        return false;
      }

      // Filter by request type
      if (filters.requestType && filters.requestType !== 'any' && post.requestType !== filters.requestType) {
        return false;
      }

      return true;
    });
  }, [posts, searchQuery, filters]);

  // Group posts by date
  const groupedPosts = useMemo(() => {
    const groups: { [key: string]: TravelPost[] } = {};
    
    filteredPosts.forEach((post) => {
      if (!groups[post.travelDate]) {
        groups[post.travelDate] = [];
      }
      groups[post.travelDate].push(post);
    });

    // Sort by date
    return Object.entries(groups)
      .sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime());
  }, [filteredPosts]);

  const hasActiveFilters = filters.origin || filters.destination || filters.airline || filters.requestType;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="container max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-2.5 mb-4">
            <PlaneTakeoff className="w-5 h-5 text-primary" strokeWidth={2.5} />
            <h1 className="text-xl font-semibold tracking-tight">TravelBuddy</h1>
          </div>
          
          <Button 
            className="w-full gap-2" 
            size="lg"
            onClick={() => setCreateOpen(true)}
          >
            <Plus className="w-5 h-5" />
            Create New Post
          </Button>
        </div>
      </header>

      {/* Search and Filter */}
      <div className="container max-w-lg mx-auto px-4 py-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search"
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button 
            variant={hasActiveFilters ? "default" : "outline"} 
            size="icon"
            onClick={() => setFilterOpen(true)}
          >
            <SlidersHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Posts List */}
      <main className="container max-w-lg mx-auto px-4 pb-8">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : groupedPosts.length === 0 ? (
          <div className="text-center py-12">
            <PlaneTakeoff className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No travel posts found</p>
            <p className="text-sm text-muted-foreground mt-1">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {groupedPosts.map(([date, datePosts]) => (
              <div key={date}>
                <h2 className="text-lg font-semibold mb-3">
                  {format(parseISO(date), 'MMMM d, yyyy')}
                </h2>
                <div className="space-y-3">
                  {datePosts.map((post) => (
                    <TravelPostCard
                      key={post.id}
                      post={post}
                      onClick={handlePostClick}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      <PostDetailModal
        post={selectedPost}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />

      <CreatePostModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={handleCreatePost}
      />

      <FilterSheet
        open={filterOpen}
        onOpenChange={setFilterOpen}
        filters={filters}
        onFiltersChange={setFilters}
        onClear={clearFilters}
      />

      {/* Feedback Button */}
      <FeedbackButton />
    </div>
  );
};

export default Index;
