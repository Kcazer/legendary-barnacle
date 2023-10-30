import { Content, fetchOneEntry } from '@builder.io/sdk-react';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const BUILDER_API_KEY = process.env.NEXT_PUBLIC_BUILDER_API_KEY || '';

const BUILDER_COMPONENTS = [
  {
    component: dynamic(() => import('@/components/Engagement')),
    name: 'Engagement',
    inputs: [
      { name: 'text', type: 'string', required: true },
      { name: 'link', type: 'string', required: true },
      { name: 'image', type: 'file', required: true },
      { name: 'color', type: 'string', required: true, enum: ['XLIGHT_GREEN', 'NEGATIVE_LIGHT', 'POSITIVE_LIGHT'] },
    ]
  },
  {
    component: dynamic(() => import('@/components/Engagements')),
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
];

// Content fetcher
const fetchContent = () => fetchOneEntry({
  model: 'page',
  apiKey: BUILDER_API_KEY,
  userAttributes: { urlPath: '/landing/debug2' },
});

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
  const content = loadedOnBrowser || loadedOnServer;
  return <Content content={content} apiKey={BUILDER_API_KEY} customComponents={BUILDER_COMPONENTS} />;
}