import type { Metadata } from 'next';
import Subpage from '../components/Subpage';
import { COMPANY } from '../lib/company';

export const metadata: Metadata = {
  title: 'Privacy Policy | Ambroise Partners',
  description: 'How Ambroise Partners collects and uses personal data.',
  alternates: { canonical: '/privacy' },
};

export default function PrivacyPolicyPage() {
  return (
    <Subpage eyebrow="Legal" title="Privacy Policy" intro="Last updated: February 2026">
      <div className="sp-content">
        <h2>Introduction</h2>
        <p>Ambroise Partners (&ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;us&rdquo;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal data when you visit our website or interact with our services.</p>

        <h2>Data Controller</h2>
        <p><strong>{COMPANY.legalName}</strong>, {COMPANY.legalFormShort} with a share capital of {COMPANY.shareCapital}<br />{COMPANY.address}<br />{COMPANY.rcs}<br />Contact: <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a></p>

        <h2>Data We Collect</h2>
        <p>We may collect the following categories of personal data:</p>
        <ul>
          <li><strong>Identity data:</strong> name, job title, company name</li>
          <li><strong>Contact data:</strong> email address, phone number</li>
          <li><strong>Communication data:</strong> messages submitted via our contact form</li>
          <li><strong>Technical data:</strong> IP address, browser type and version, operating system, referral source, pages visited, and duration of visit</li>
        </ul>

        <h2>How We Use Your Data</h2>
        <p>We process your personal data for the following purposes:</p>
        <ul>
          <li>To respond to your inquiries and provide our advisory services</li>
          <li>To maintain and improve our website</li>
          <li>To comply with legal and regulatory obligations</li>
          <li>To protect our legitimate business interests</li>
        </ul>

        <h2>Legal Basis for Processing</h2>
        <p>We process your personal data based on:</p>
        <ul>
          <li><strong>Consent:</strong> when you submit information through our contact form</li>
          <li><strong>Legitimate interest:</strong> to improve our services and website performance</li>
          <li><strong>Legal obligation:</strong> to comply with applicable laws and regulations</li>
        </ul>

        <h2>Data Retention</h2>
        <p>We retain your personal data only for as long as necessary to fulfill the purposes for which it was collected, typically no longer than 3 years from the last interaction, unless a longer retention period is required by law.</p>

        <h2>Data Sharing</h2>
        <p>We do not sell your personal data. We may share your data with:</p>
        <ul>
          <li>Service providers who assist us in operating our website (hosting, analytics)</li>
          <li>Professional advisors (legal, accounting) when required</li>
          <li>Authorities when required by law</li>
        </ul>

        <h2>Your Rights</h2>
        <p>Under the General Data Protection Regulation (GDPR), you have the right to:</p>
        <ul>
          <li>Access your personal data</li>
          <li>Rectify inaccurate or incomplete data</li>
          <li>Request erasure of your data</li>
          <li>Restrict or object to processing</li>
          <li>Data portability</li>
          <li>Withdraw consent at any time</li>
        </ul>
        <p>To exercise any of these rights, email us at <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>. You may also lodge a complaint with the CNIL (www.cnil.fr).</p>

        <h2>International Transfers</h2>
        <p>Your data may be transferred to, and processed in, countries outside the European Economic Area (EEA). When we do so, we ensure appropriate safeguards are in place in accordance with GDPR requirements.</p>

        <h2>Security</h2>
        <p>We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction.</p>

        <h2>Changes to This Policy</h2>
        <p>We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date.</p>
      </div>
    </Subpage>
  );
}
