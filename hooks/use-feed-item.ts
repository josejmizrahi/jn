"use client";

import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { getEngagement } from '@/lib/feed';

export function useFeedItem(itemId: string) {
  const [engagement, setEngagement] = useState({
    likes: 0,
    comments: 0,
    shares: 0,
    isLiked: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchEngagement = async () => {
    try {
      setIsLoading(true);
      const data = await getEngagement(itemId);
      setEngagement(data);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to load engagement data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEngagement();
  }, [itemId]);

  return {
    engagement,
    isLoading,
    refetch: fetchEngagement,
  };
}