import BaseHeader from '@/components/base-header'
import Footer from '@/components/footer'
import Logo from '@/components/logo'
import { Metadata } from 'next'
import BlogComponent from './blogComponent';

export const metadata: Metadata = {
  title: 'Blog - OUTAudits',
  description: 'Read proven strategies for agencies and freelancers. Learn how to win more clients, scale revenue, and build sustainable SEO businesses.',
}


export default async function Blog() {
  return (
    <>
      <BaseHeader />
      <BlogComponent />
      <Footer />
    </>
  );
}
