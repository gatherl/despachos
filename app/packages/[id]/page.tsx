'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import PackageDetail from '@/components/PackageDetail';
import DownloadLabel from '@/components/DownloadLabel';

export default function PackageDetailPage() {
  const params = useParams();
  const packageId = params.id as string;
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6 flex justify-between items-center">
        <Link 
          href="/packages"
          className="text-blue-600 hover:text-blue-800 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Packages
        </Link>
        
        <DownloadLabel packageId={packageId} />
      </div>
      
      <PackageDetail packageId={packageId} />
    </div>
  );
}