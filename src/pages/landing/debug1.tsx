import { Builder, RenderContent, builder } from '@builder.io/react';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const BUILDER_API_KEY = process.env.NEXT_PUBLIC_BUILDER_API_KEY || '';

// Initialize Builder.io
builder.init(BUILDER_API_KEY);

// Register custom components
Builder.registerComponent(
  dynamic(() => import('@/components/Engagement')),
  {
    name: 'Engagement',
    inputs: [
      { name: 'text', type: 'string', required: true },
      { name: 'link', type: 'string', required: true },
      { name: 'image', type: 'file', required: true },
      { name: 'color', type: 'string', required: true, enum: ['XLIGHT_GREEN', 'NEGATIVE_LIGHT', 'POSITIVE_LIGHT'] },
    ]
  }
)
Builder.registerComponent(
  dynamic(() => import('@/components/Engagements')),
  {
    name: 'Engagements',
    inputs: [
      { name: 'image', type: 'file', required: true },
      { name: 'title', type: 'string', required: true },
      { name: 'items', type: 'list', required: true, subFields: [
        { name: 'text', type: 'string', required: true },
        { name: 'link', type: 'string', required: true },
        { name: 'image', type: 'file', required: true },
        { name: 'color', type: 'string', required: true, enum: ['XLIGHT_GREEN', 'NEGATIVE_LIGHT', 'POSITIVE_LIGHT'] },
      ] },
    ]
  }
)

// Content fetcher
const fetchContent = () => builder.get('page', {
  userAttributes: { urlPath: '/landing/debug1' },
}).promise();

// Server side fetching
export const getServerSideProps = async () => {
  const loadedOnServer = await fetchContent();
  return { props: { loadedOnServer } };
};

// Page component
type Props = Awaited<ReturnType<typeof getServerSideProps>>['props'];
export default function Page({ loadedOnServer }: Props) {
  // Client side fetching
  const [loadedOnBrowser, setLoadedOnBrowser] = useState<typeof loadedOnServer>(null);
  useEffect(() => {
    if (loadedOnBrowser) return;
    fetchContent().then(setLoadedOnBrowser);
  }, [loadedOnBrowser]);

  // Render with whichever is available
  const content = loadedOnBrowser; // Server side disabled disabled due to hydration issues
  return <RenderContent content={content} />;
}