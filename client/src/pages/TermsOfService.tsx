import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-8">
            <CardTitle className="text-4xl mb-2">Terms of Service</CardTitle>
            <p className="text-gray-600">Effective Date: January 22, 2026</p>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <div className="space-y-8 text-gray-700">
              <section>
                <h2 className="text-2xl font-bold mb-4 text-gray-900">1. Agreement to Terms</h2>
                <p>
                  By accessing and using Dopamine Dasher, you accept and agree to be bound by the terms and provisions of this agreement. This Terms of Service is entered into between you ("User") and Mindrocket LLC ("Company").
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-gray-900">2. Use License</h2>
                <p>
                  Mindrocket LLC grants you a limited, non-exclusive, non-transferable license to use Dopamine Dasher for personal, non-commercial purposes. You agree not to reproduce, modify, sell, reverse engineer, or misuse the App in any way.
                </p>
              </section>

              <section className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <h2 className="text-2xl font-bold mb-4 text-red-900">3. Disclaimer of Health and Wellness Claims</h2>
                <p className="font-semibold text-red-900 mb-2">NOT A MEDICAL DEVICE</p>
                <p>
                  Dopamine Dasher is NOT a medical device, treatment, or cure for any condition, including ADHD. We do NOT claim that the App treats ADHD, increases dopamine levels, improves focus as a medical treatment, or replaces professional care.
                </p>
                <p className="mt-2">
                  <strong>Individual results vary</strong> and are not guaranteed. If you have ADHD or any medical condition, consult with a licensed healthcare provider.
                </p>
              </section>

              <section className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
                <h2 className="text-2xl font-bold mb-4 text-orange-900">4. Limitation of Liability</h2>
                <p className="font-semibold text-orange-900 mb-2">DISCLAIMER OF WARRANTIES</p>
                <p>
                  The App is provided "AS IS" without warranty of any kind. Mindrocket LLC does not warrant that the App will be uninterrupted, error-free, or meet your specific requirements.
                </p>
                <p className="mt-2">
                  <strong>Limitation of Damages:</strong> To the maximum extent permitted by law, Mindrocket LLC is not liable for any indirect, incidental, special, consequential, or punitive damages, including health-related damages or claims related to ADHD management.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-gray-900">5. User Accounts and Responsibilities</h2>
                <p>You agree to provide accurate information, maintain account confidentiality, and accept responsibility for all activities under your account. You agree not to engage in illegal, abusive, or prohibited conduct.</p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-gray-900">6. Intellectual Property Rights</h2>
                <p>Dopamine Dasher and all its content are owned by Mindrocket LLC and protected by copyright and trademark laws. You retain ownership of content you create, but grant us a license to use it to provide the App.</p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-gray-900">7. Payment and Premium Features</h2>
                <p>
                  If you purchase premium features, you agree to pay the stated price at the selected frequency. You may cancel anytime, and cancellation takes effect at the end of your billing period. No refunds are provided for partial periods.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-gray-900">8. Governing Law and Dispute Resolution</h2>
                <p>
                  These Terms are governed by applicable law. Any disputes shall be resolved through binding arbitration rather than court proceedings, except for injunctive relief or intellectual property claims.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-gray-900">9. Contact Us</h2>
                <p>
                  If you have questions about these Terms of Service, please contact us at:
                  <br />
                  <strong>Email:</strong> legal@mindrocket.com
                </p>
              </section>

              <p className="text-sm text-gray-500 mt-8">
                For the complete Terms of Service, please see the full document included with the App.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
