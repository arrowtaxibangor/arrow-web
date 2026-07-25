'use client';
import { useQuery } from 'react-query';
import { getPagesLink } from '../services/dynamicPages.service';

export function usePagesLink() {
  return useQuery(['get-pages-link'], getPagesLink, {
    retry: false,
    refetchInterval: false,
    staleTime: Infinity,
  });
}
