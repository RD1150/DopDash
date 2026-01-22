import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-8">
            <CardTitle className="text-4xl mb-2">Privacy Policy</CardTitle>
            <p className="text-gray-600">Effective Date: January 22, 2026</p>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <div className="space-y-8 text-gray-700">
              <section>
                <h2 className="text-2xl font-bold mb-4 text-gray-900">1. Introduction</h2>
                <p>
                  Dopamine Dasher ("the App," "we," "us," or "our") is a task management application designed for individuals with ADHD. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our App.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-gray-900">2. Information We Collect</h2>
                <h3 className="text-lg font-semibold mb-2">Account Registration</h3>
                <p>When you create an account, we collect your email address, name, password, and optional profile information.</p>
                <h3 className="text-lg font-semibold mb-2 mt-4">Task and Activity Data</h3>
                <p>We collect tasks you create, nervous system state selections, task completion history, engagement metrics, and brain dump entries.</p>
                <h3 className="text-lg font-semibold mb-2 mt-4">Automatic Information</h3>
                <p>We automatically collect device information, usage analytics, and general location data based on IP address.</p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-gray-900">3. How We Use Your Information</h2>
                <p>We use your information to deliver core services, communicate with you, improve the App, and comply with legal obligations.</p>
              </section>

              <section className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <h2 className="text-2xl font-bold mb-4 text-red-900">4. IMPORTANT: Health and Wellness Disclaimer</h2>
                <p className="font-semibold text-red-900 mb-2">DOPAMINE DASHER IS NOT A MEDICAL DEVICE OR TREATMENT</p>
                <p>We do NOT claim that Dopamine Dasher treats, cures, or prevents ADHD or any other medical condition. It is not a substitute for professional medical care. If you have ADHD or any medical condition, consult with a licensed healthcare provider.</p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-gray-900">5. Data Sharing</h2>
                <p>We may share your information with third-party service providers, as required by law, or in connection with business transfers. We do NOT sell your personal information.</p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-gray-900">6. Data Security</h2>
                <p>We implement industry-standard security measures including encryption, secure password storage, and regular security audits. However, no method is completely secure.</p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-gray-900">7. Your Privacy Rights</h2>
                <p>You have the right to access, correct, and delete your personal information. You may also opt out of promotional emails.</p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-gray-900">8. Contact Us</h2>
                <p>
                  If you have questions about this Privacy Policy, please contact us at:
                  <br />
                  <strong>Email:</strong> privacy@mindrocket.com
                </p>
              </section>

              <p className="text-sm text-gray-500 mt-8">
                For the complete Privacy Policy, please see the full document included with the App.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
