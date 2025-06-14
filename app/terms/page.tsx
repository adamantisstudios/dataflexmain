import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Terms and Conditions</CardTitle>
            <p className="text-gray-600">Last updated: December 2024</p>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By registering as an agent with DataFlex Agents, you agree to be bound by these Terms and Conditions. If
              you do not agree to these terms, please do not use our services.
            </p>

            <h2>2. Agent Registration and Subscription</h2>
            <ul>
              <li>Agents must provide accurate and complete information during registration</li>
              <li>Each agent will receive a unique Agent ID for identification and payment reference</li>
              <li>Subscription fees must be paid via Mobile Money to the designated number</li>
              <li>Account activation is subject to payment verification and admin approval</li>
              <li>Subscription periods are non-refundable once activated</li>
            </ul>

            <h2>3. Data Bundle Services</h2>
            <ul>
              <li>DataFlex Agents provides discounted data bundles for MTN, AirtelTigo, and Telecel networks</li>
              <li>Bundle prices are subject to change without prior notice</li>
              <li>All bundles have a validity period of 3 months unless otherwise specified</li>
              <li>Agents are responsible for accurate order placement and customer service</li>
            </ul>

            <h2>4. Payment and Billing</h2>
            <ul>
              <li>All payments must be made via Mobile Money to: 0551999901</li>
              <li>Agent ID must be used as payment reference for proper account crediting</li>
              <li>Subscription renewals must be completed before expiry to maintain active status</li>
              <li>Late payments may result in account suspension</li>
            </ul>

            <h2>5. Agent Responsibilities</h2>
            <ul>
              <li>Maintain accurate customer records and provide excellent customer service</li>
              <li>Use the platform responsibly and in accordance with these terms</li>
              <li>Report any technical issues or discrepancies promptly</li>
              <li>Comply with all applicable laws and regulations in Ghana</li>
            </ul>

            <h2>6. Account Suspension and Termination</h2>
            <ul>
              <li>DataFlex Agents reserves the right to suspend or terminate accounts for violations</li>
              <li>Accounts may be suspended for non-payment or fraudulent activities</li>
              <li>Terminated agents forfeit any remaining subscription period</li>
            </ul>

            <h2>7. Limitation of Liability</h2>
            <p>
              DataFlex Agents shall not be liable for any indirect, incidental, special, or consequential damages
              arising from the use of our services. Our liability is limited to the amount paid for subscription fees.
            </p>

            <h2>8. Privacy and Data Protection</h2>
            <p>
              We are committed to protecting your privacy. Personal information collected during registration will be
              used solely for account management and service provision.
            </p>

            <h2>9. Changes to Terms</h2>
            <p>
              DataFlex Agents reserves the right to modify these terms at any time. Agents will be notified of
              significant changes via email or platform notifications.
            </p>

            <h2>10. Contact Information</h2>
            <p>
              For questions about these terms, contact us:
              <br />
              WhatsApp: +233 55 199 9901
              <br />
              Email: support@dataflexagents.com
            </p>

            <div className="mt-8 pt-8 border-t">
              <Link href="/register/agent" className="text-green-600 hover:underline">
                ← Back to Registration
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
