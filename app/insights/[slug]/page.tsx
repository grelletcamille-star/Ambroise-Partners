import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Subpage from '../../components/Subpage';
import { POSTS, getPost, formatDate } from '../posts';

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} | Ambroise Partners`,
    description: post.excerpt,
    alternates: { canonical: `/insights/${post.slug}` },
    openGraph: { title: post.title, description: post.excerpt, type: 'article', publishedTime: post.date, authors: [post.author] },
  };
}

export default async function InsightPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    datePublished: post.date,
    author: { '@type': 'Person', name: post.author },
    publisher: { '@type': 'Organization', name: 'Ambroise Partners' },
    description: post.excerpt,
  };

  return (
    <Subpage eyebrow={post.category} title={post.title} intro={`${formatDate(post.date)} · ${post.author}`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article className="sp-content">
        {post.body.map((b, i) =>
          'h2' in b ? <h2 key={i}>{b.h2}</h2>
          : 'ul' in b ? <ul key={i}>{b.ul.map((li) => <li key={li}>{li}</li>)}</ul>
          : <p key={i}>{b.p}</p>
        )}
        <p style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--line)' }}>
          <Link href="/insights">← All insights</Link> · <Link href="/#contact">Discuss your project with us</Link>
        </p>
      </article>
    </Subpage>
  );
}
