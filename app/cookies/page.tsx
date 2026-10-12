import type { Metadata } from 'next';
import Subpage from '../components/Subpage';

export const metadata: Metadata = {
  title: 'Cookie Policy | Ambroise Partners',
  description: 'How the Ambroise Partners website uses cookies.',
  alternates: { canonical: '/cookies' },
};

export default function CookiePolicyPage() {
  return (
    <Subpage eyebrow="Legal" title="Cookie Policy" intro="Last updated: February 2026">
      <div className="sp-content">
        <h2>What Are Cookies</h2>
        <p>Cookies are small text files stored on your device when you visit a website. They help the website remember your preferences and understand how you interact with the site.</p>

        <h2>How We Use Cookies</h2>
        <p>Ambroise Partners uses cookies to ensure the proper functioning of our website and to improve your browsing experience. We use the following types of cookies:</p>

        <h3>Strictly Necessary Cookies</h3>
        <p>These cookies are essential for the website to function properly. They cannot be disabled.</p>
        <table className="cookie-table">
          <thead>
            <tr><th>Cookie</th><th>Purpose</th><th>Duration</th></tr>
          </thead>
          <tbody>
            <tr><td>session_id</td><td>Maintains your session state</td><td>Session</td></tr>
          </tbody>
        </table>

        <h3>Analytics Cookies</h3>
        <p>These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.</p>
        <table className="cookie-table">
          <thead>
            <tr><th>Cookie</th><th>Purpose</th><th>Duration</th></tr>
          </thead>
          <tbody>
            <tr><td>_ga</td><td>Google Analytics &mdash; distinguishes unique users</td><td>2 years</td></tr>
            <tr><td>_ga_*</td><td>Google Analytics &mdash; maintains session state</td><td>2 years</td></tr>
          </tbody>
        </table>

        <h2>Managing Cookies</h2>
        <p>You can control and manage cookies through your browser settings. Most browsers allow you to:</p>
        <ul>
          <li>View what cookies are stored and delete them individually</li>
          <li>Block third-party cookies</li>
          <li>Block cookies from specific sites</li>
          <li>Block all cookies</li>
          <li>Delete all cookies when you close your browser</li>
        </ul>
        <p>Please note that disabling cookies may affect the functionality of this website.</p>

        <h2>Browser Settings</h2>
        <p>To manage cookies in your browser:</p>
        <ul>
          <li><strong>Chrome:</strong> Settings &rarr; Privacy and Security &rarr; Cookies</li>
          <li><strong>Safari:</strong> Preferences &rarr; Privacy &rarr; Manage Website Data</li>
          <li><strong>Firefox:</strong> Settings &rarr; Privacy &amp; Security &rarr; Cookies</li>
          <li><strong>Edge:</strong> Settings &rarr; Cookies and Site Permissions</li>
        </ul>

        <h2>Changes to This Policy</h2>
        <p>We may update this Cookie Policy from time to time. Any changes will be posted on this page with an updated revision date.</p>

        <h2>Contact</h2>
        <p>For questions about our use of cookies, please contact us through our usual channels.</p>
      </div>
    </Subpage>
  );
}
