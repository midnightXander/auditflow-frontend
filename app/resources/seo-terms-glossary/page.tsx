import GlossaryComponent from "./glossaryComponent";
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'The Plain-English SEO Glossary',
  description: ' Every term an agency uses — explained like you\'re not a specialist. Client-friendly explanations of the words agencies throw around — so clients actually understand what\'s happening with their website.',
}


export default function GlossaryPage() {
  
  return (
    <GlossaryComponent />
  );
}