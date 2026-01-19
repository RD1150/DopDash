import { useLocation } from 'wouter';
import { ChevronLeft } from 'lucide-react';

/**
 * Privacy Policy Page
 * Displays comprehensive privacy policy for Dopamine Dasher
 * Users can access from Settings footer or navigate directly to /privacy
 */
export default function Privacy() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header with back button */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="container max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => navigate('/settings')}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            aria-label="Back to Settings"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold">Privacy Policy</h1>
        </div>
      </div>

      {/* Content */}
      <div className="container max-w-3xl mx-auto px-4 py-8 animate-in fade-in duration-500">
        <div className="prose prose-sm dark:prose-invert max-w-none space-y-6">
          <div className="text-sm text-muted-foreground mb-6">
            <p>Last Updated: January 17, 2026</p>
          </div>

          {/* Section 1 */}
          <section>
            <h2 className="text-xl font-bold mt-8 mb-4">1. Introduction</h2>
            <p>
              Dopamine Dasher ("the App") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application and services.
            </p>
            <p>
              Please read this Privacy Policy carefully. If you do not agree with our policies and practices, please do not use our App.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-xl font-bold mt-8 mb-4">2. Information We Collect</h2>
            <h3 className="font-semibold mt-4 mb-2">2.1 Information You Provide Directly</h3>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong>Account Information:</strong> Email address, name, and authentication credentials</li>
              <li><strong>Task Data:</strong> Tasks, subtasks, categories, contexts, and completion history</li>
              <li><strong>Preferences:</strong> Theme settings, sound preferences, notification settings, and app configuration</li>
              <li><strong>Mood Data:</strong> Mood check-ins and energy level selections (optional)</li>
              <li><strong>Payment Information:</strong> Processed securely through Stripe (we do not store credit card details)</li>
              <li><strong>Communication:</strong> Support emails, feedback, and bug reports</li>
            </ul>

            <h3 className="font-semibold mt-4 mb-2">2.2 Information Collected Automatically</h3>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong>Device Information:</strong> Device type, operating system, and app version</li>
              <li><strong>Usage Analytics:</strong> Features used, session duration, and interaction patterns (anonymized)</li>
              <li><strong>Crash Reports:</strong> Error logs and performance metrics to improve stability</li>
              <li><strong>IP Address:</strong> For security and fraud prevention purposes</li>
            </ul>

            <h3 className="font-semibold mt-4 mb-2">2.3 Information from Third Parties</h3>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong>OAuth Providers:</strong> Basic profile information from your login provider (Google, Microsoft, Apple)</li>
              <li><strong>Payment Processor:</strong> Stripe provides transaction confirmations and payment status</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-xl font-bold mt-8 mb-4">3. How We Use Your Information</h2>
            <p>We use the information we collect for the following purposes:</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Providing and maintaining the App and its features</li>
              <li>Processing payments and managing your Premium subscription</li>
              <li>Personalizing your experience (themes, preferences, task templates)</li>
              <li>Sending transactional emails (purchase confirmations, password resets)</li>
              <li>Improving the App through analytics and user feedback</li>
              <li>Detecting and preventing fraud or security issues</li>
              <li>Complying with legal obligations</li>
              <li>Communicating about updates, features, or service changes</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-xl font-bold mt-8 mb-4">4. Data Storage and Security</h2>
            <p>
              <strong>Local Storage:</strong> Your task data, preferences, and mood history are stored locally on your device by default. We do not automatically send this data to our servers unless you enable cloud sync.
            </p>
            <p className="mt-4">
              <strong>Cloud Sync (Optional):</strong> If you enable cloud sync, your data is encrypted and stored on secure servers. You maintain full control and can disable sync or delete your data at any time.
            </p>
            <p className="mt-4">
              <strong>Security Measures:</strong> We use industry-standard encryption (TLS/SSL), secure authentication (OAuth), and regular security audits to protect your information. However, no method of transmission over the internet is 100% secure.
            </p>
            <p className="mt-4">
              <strong>Data Retention:</strong> We retain your data for as long as your account is active. You can request deletion of your account and all associated data at any time.
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-xl font-bold mt-8 mb-4">5. Data Sharing and Disclosure</h2>
            <p>
              We do <strong>not sell, trade, or rent</strong> your personal information to third parties. We only share your information in the following circumstances:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong>Service Providers:</strong> Third-party vendors (Stripe, analytics providers) who assist in operating the App under strict confidentiality agreements</li>
              <li><strong>Legal Requirements:</strong> When required by law, court order, or government request</li>
              <li><strong>Safety:</strong> To protect against fraud, security threats, or harm to users</li>
              <li><strong>Business Transfer:</strong> In the event of merger, acquisition, or bankruptcy</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-xl font-bold mt-8 mb-4">6. Your Privacy Rights</h2>
            <p>Depending on your location, you may have the following rights:</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Correction:</strong> Update or correct inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your account and all associated data</li>
              <li><strong>Portability:</strong> Export your data in a machine-readable format</li>
              <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications or disable analytics</li>
            </ul>
            <p className="mt-4">
              To exercise any of these rights, contact us at <strong>privacy@dopaminedasher.com</strong>. We will respond within 30 days.
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-xl font-bold mt-8 mb-4">7. Cookies and Tracking</h2>
            <p>
              We use cookies and similar tracking technologies to enhance your experience and analyze usage patterns. You can control cookie preferences through your browser settings. Disabling cookies may affect some App functionality.
            </p>
            <p className="mt-4">
              <strong>Analytics:</strong> We use anonymized analytics to understand how users interact with the App. This data cannot identify you personally.
            </p>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-xl font-bold mt-8 mb-4">8. Third-Party Links</h2>
            <p>
              The App may contain links to third-party websites and services. We are not responsible for their privacy practices. We encourage you to review their privacy policies before providing any information.
            </p>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className="text-xl font-bold mt-8 mb-4">9. Children's Privacy</h2>
            <p>
              Dopamine Dasher is not intended for children under 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected information from a child under 13, we will take steps to delete such information and terminate the child's account.
            </p>
          </section>

          {/* Section 10 */}
          <section>
            <h2 className="text-xl font-bold mt-8 mb-4">10. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Changes will be effective immediately upon posting. Your continued use of the App constitutes acceptance of the updated Privacy Policy. We will notify you of significant changes via email or in-app notification.
            </p>
          </section>

          {/* Section 11 */}
          <section>
            <h2 className="text-xl font-bold mt-8 mb-4">11. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy or our privacy practices, please contact us at:
            </p>
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <p><strong>Email:</strong> privacy@dopaminedasher.com</p>
              <p className="mt-2"><strong>Mailing Address:</strong> Dopamine Dasher Support</p>
              <p>We will respond to your inquiry within 30 days.</p>
            </div>
          </section>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-border text-sm text-muted-foreground">
            <p>
              By using Dopamine Dasher, you acknowledge that you have read, understood, and agree to be bound by this Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
