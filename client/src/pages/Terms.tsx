import { useLocation } from "wouter";
import { ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function Terms() {
  const [, navigate] = useLocation();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-background text-foreground pb-24"
    >
      {/* Header */}
      <header className="pt-6 pb-8 flex items-center gap-4 max-w-2xl mx-auto px-4">
        <button 
          onClick={() => navigate("/settings")}
          className="p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Terms of Service</h1>
          <p className="text-xs text-muted-foreground mt-1">Last Updated: January 17, 2026</p>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4">
        <article className="prose prose-invert max-w-none space-y-6 text-foreground">
          {/* Section 1 */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-foreground">1. Purchase & Payment</h2>
            <p className="text-muted-foreground">
              By purchasing Dopamine Dasher ("the App"), you agree to these Terms of Service. The App is a one-time purchase that grants you a personal, non-transferable license to use the App.
            </p>
            <p className="text-muted-foreground">
              <strong>Payment:</strong> All sales are final. Purchases are processed through Stripe and are subject to their payment terms.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-foreground">2. No Refunds</h2>
            <p className="text-muted-foreground">
              Dopamine Dasher is sold on an <strong>as-is basis with no refunds</strong>. This includes:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Purchases made in error</li>
              <li>Changes of mind</li>
              <li>Technical issues on your device</li>
              <li>Dissatisfaction with features or functionality</li>
            </ul>
            <p className="text-muted-foreground">
              Once purchased, the App license cannot be refunded, exchanged, or transferred to another user or device.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-foreground">3. License Grant</h2>
            <p className="text-muted-foreground">
              You receive a limited, personal license to use Dopamine Dasher on your personal devices. You may <strong>not</strong>:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Resell, redistribute, or share the App</li>
              <li>Reverse engineer or modify the App</li>
              <li>Use the App for commercial purposes</li>
              <li>Share your license with others</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-foreground">4. Disclaimer of Warranties</h2>
            <p className="text-muted-foreground">
              The App is provided "as-is" without any warranties, express or implied. We do not guarantee:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>The App will be error-free or uninterrupted</li>
              <li>The App will meet your specific needs</li>
              <li>The App will be compatible with all devices or future OS versions</li>
              <li>Any particular results or outcomes</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-foreground">5. Limitation of Liability</h2>
            <p className="text-muted-foreground">
              To the maximum extent permitted by law, we are not liable for:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Loss of data or functionality</li>
              <li>Indirect, incidental, or consequential damages</li>
              <li>Any damages arising from your use of the App</li>
              <li>App discontinuation or unavailability</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-foreground">6. App Discontinuation</h2>
            <p className="text-muted-foreground">
              We reserve the right to discontinue, modify, or update the App at any time without notice or liability. If the App becomes unavailable:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>No refunds will be issued</li>
              <li>Your access may be terminated</li>
              <li>We are not responsible for any losses</li>
            </ul>
          </section>

          {/* Section 7 */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-foreground">7. User Responsibilities</h2>
            <p className="text-muted-foreground">
              You agree to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Use the App only for lawful purposes</li>
              <li>Not attempt to hack, modify, or misuse the App</li>
              <li>Comply with all applicable laws and regulations</li>
              <li>Accept responsibility for your use of the App</li>
            </ul>
          </section>

          {/* Section 8 */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-foreground">8. Privacy</h2>
            <p className="text-muted-foreground">
              Your use of the App is subject to our Privacy Policy. By using the App, you consent to our collection and use of data as described in our Privacy Policy.
            </p>
          </section>

          {/* Section 9 */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-foreground">9. Changes to Terms</h2>
            <p className="text-muted-foreground">
              We may update these Terms of Service at any time. Your continued use of the App constitutes acceptance of any changes.
            </p>
          </section>

          {/* Section 10 */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-foreground">10. Contact</h2>
            <p className="text-muted-foreground">
              For questions about these Terms of Service, contact us at:
            </p>
            <p className="text-muted-foreground">
              <strong>Email:</strong> support@dopaminedasher.com
            </p>
          </section>

          {/* Acknowledgment */}
          <div className="pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground italic">
              By purchasing Dopamine Dasher, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
            </p>
            <p className="text-xs text-muted-foreground/60 mt-4">
              Also review our <button onClick={() => navigate('/privacy')} className="text-primary hover:underline">Privacy Policy</button>
            </p>
          </div>
        </article>
      </div>
    </motion.div>
  );
}
