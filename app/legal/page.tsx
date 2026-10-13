import type { Metadata } from 'next';
import Link from 'next/link';
import Subpage from '../components/Subpage';
import { COMPANY } from '../lib/company';

export const metadata: Metadata = {
  title: 'Legal Notice | Ambroise Partners',
  description: 'Legal notice of the Ambroise Partners website.',
  alternates: { canonical: '/legal' },
};

export default function LegalNoticePage() {
  return (
    <Subpage eyebrow="Legal" title="Legal Notice" intro="Last updated: October 2026">
      <div className="sp-content">
        <h2>Publisher</h2>
        <p>
          This website is published by <strong>{COMPANY.legalName}</strong>, an {COMPANY.legalForm} with a share capital of {COMPANY.shareCapital}.
        </p>
        <ul>
          <li>Registered office: {COMPANY.address}</li>
          <li>Registration: {COMPANY.rcs} (SIREN {COMPANY.siren})</li>
          <li>EU VAT number: {COMPANY.vat}</li>
          <li>Email: <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a></li>
        </ul>

        <h2>Publication Director</h2>
        <p>{COMPANY.director}, {COMPANY.directorTitle}.</p>

        <h2>Hosting</h2>
        <p>This website is hosted by Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, United States.</p>

        <h2>Intellectual Property</h2>
        <p>All content on this website, including but not limited to text, graphics, logos, images and software, is the property of Ambroise Partners or its content suppliers and is protected by intellectual property laws.</p>
        <p>No reproduction, distribution or transmission of any content is permitted without prior written consent from Ambroise Partners. Company names mentioned on this website belong to their respective owners and are cited for reference only.</p>

        <h2>Nature of the Information</h2>
        <p>The information on this website is provided for general information purposes only. It does not constitute an offer, a solicitation or investment advice. Transactions and figures presented include work carried out by members of the team in previous roles.</p>

        <h2>Limitation of Liability</h2>
        <p>Ambroise Partners makes every effort to ensure the accuracy and reliability of the information provided on this website. However, we cannot guarantee that the information is complete, accurate or up to date at all times.</p>
        <p>Ambroise Partners shall not be held liable for any direct or indirect damages arising from the use of this website or the information contained herein.</p>

        <h2>Personal Data</h2>
        <p>Personal data sent through the contact form is processed only to answer your request. See our <Link href="/privacy">privacy policy</Link> for details and for how to exercise your rights.</p>

        <h2>External Links</h2>
        <p>This website may contain links to external websites. Ambroise Partners has no control over the content of these sites and accepts no responsibility for them or for any loss or damage that may arise from their use.</p>

        <h2>Applicable Law</h2>
        <p>This legal notice is governed by French law. Any disputes arising from the use of this website shall be subject to the exclusive jurisdiction of the courts of Paris, France.</p>
      </div>
    </Subpage>
  );
}
