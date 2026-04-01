import Head from 'next/head';

type SEOProps = {
  title: string;
  description: string;
  tags?: string[];
};

export default function SEO({ title, description, tags }: SEOProps) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      {tags && (
        <meta name="keywords" content={tags.join(', ')} />
      )}
      {/* ...other meta tags */}
    </Head>
  );
}