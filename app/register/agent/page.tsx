import AgentRegistrationForm from "@/components/agent-registration-form"

export default function AgentRegistrationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Become a DataFlex Agent</h1>
          <p className="text-gray-600">Join thousands of successful agents earning with data bundles</p>
        </div>
        <AgentRegistrationForm />
      </div>
    </div>
  )
}
