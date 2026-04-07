import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Skeleton from '../components/ui/Skeleton';

const fetchAbout = async () => {
  const res = await fetch('http://localhost:4000/api/pages/about');
  if (!res.ok) throw new Error('Failed to load about');
  return res.json();
};

export default function About() {
  const { data, isLoading, error } = useQuery({ queryKey: ['aboutPage'], queryFn: fetchAbout });

  if (isLoading) return <div className="pt-40"><Skeleton className="max-w-4xl mx-auto px-6" lines={4} count={1} /></div>;
  if (error) return <div className="pt-40 text-center">Failed to load content.</div>;

  return (
    <div className="pt-32 pb-20 bg-bg">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-6">
            <span className="text-[10px] uppercase tracking-[0.5em] font-bold text-gold">{data?.eyebrow || 'Our Story'}</span>
            <h1 className="text-6xl md:text-8xl font-light tracking-tighter uppercase leading-[0.8]">{data?.title}</h1>
            <p className="text-muted max-w-2xl mx-auto">{data?.subtitle}</p>
          </div>

          <div className="prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: data?.content || '' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
