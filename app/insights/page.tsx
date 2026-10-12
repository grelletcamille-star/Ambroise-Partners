import type { Metadata } from 'next';
import Link from 'next/link';
import Subpage from '../components/Subpage';
import { POSTS, formatDate } from './posts';

export const metadata: Metadata = {
  title: 'Insights | Ambroise Partners',
  description: 'Perspectives on healthcare financing, M&A and partnerships from the Ambroise Partners team.',
  alternates: { canonical: '/insights' },
};

export default function InsightsPage() {
  return (
    <Subpage
      eyebrow="Insights"
      title="Perspectives on healthcare financing and transactions"
      intro="Notes from our work with healthcare companies and their investors: fundraising, M&A, partnerships and licensing."
    >
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '3.5rem 4vw 5rem' }}>
        <div className="ins-grid">
          {POSTS.map((p) => (
            <Link key={p.slug} href={`/insights/${p.slug}`} className="ins-card">
              <span className="ins-meta">{p.category}</span>
              <span className="ins-title">{p.title}</span>
              <span className="ins-excerpt">{p.excerpt}</span>
              <span className="ins-foot">
                <span>{formatDate(p.date)} · {p.author}</span>
                <span className="ins-read">Read →</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </Subpage>
  );
}
