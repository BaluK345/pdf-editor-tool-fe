import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for personal use and trying out PDFCraft",
    features: [
      "5 documents per month",
      "Basic editing tools",
      "10MB file size limit",
      "Community support",
      "Standard templates",
    ],
    limitations: ["No OCR capabilities", "No collaboration features", "No AI-powered tools", "No priority support"],
    cta: "Get Started Free",
    popular: false,
  },
  {
    name: "Personal",
    price: "$9.99",
    period: "per month",
    description: "Ideal for individuals and freelancers",
    features: [
      "Unlimited documents",
      "Advanced editing tools",
      "100MB file size limit",
      "OCR capabilities",
      "Premium templates",
      "Email support",
      "Cloud sync",
    ],
    limitations: ["Single user only", "No team collaboration", "Limited AI features"],
    cta: "Start Personal Plan",
    popular: false,
  },
  {
    name: "Professional",
    price: "$19.99",
    period: "per month",
    description: "Best for teams and small businesses",
    features: [
      "Everything in Personal",
      "Real-time collaboration",
      "Advanced AI tools",
      "API access",
      "Priority support",
      "Team management",
      "Advanced security",
      "Custom workflows",
    ],
    limitations: ["Up to 10 team members", "Standard integrations only"],
    cta: "Start Professional Plan",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$49.99",
    period: "per user/month",
    description: "For large organizations with advanced needs",
    features: [
      "Everything in Professional",
      "Unlimited team members",
      "SSO integration",
      "Advanced compliance",
      "Custom integrations",
      "Dedicated support",
      "On-premise deployment",
      "Advanced analytics",
      "Custom training",
    ],
    limitations: [],
    cta: "Contact Sales",
    popular: false,
  },
]

export default function Pricing() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the perfect plan for your needs. All plans include our core PDF editing features.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`bg-white rounded-lg shadow-lg border-2 ${
                plan.popular ? "border-blue-500 relative" : "border-gray-200"
              } p-6`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="mb-2">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-600 ml-1">/{plan.period}</span>
                </div>
                <p className="text-gray-600">{plan.description}</p>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">What's included:</h4>
                <ul className="space-y-2">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-gray-600 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {plan.limitations.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Limitations:</h4>
                  <ul className="space-y-2">
                    {plan.limitations.map((limitation, limitationIndex) => (
                      <li key={limitationIndex} className="flex items-center">
                        <X className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                        <span className="text-gray-500 text-sm">{limitation}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <Button
                className={`w-full ${plan.popular ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-900 hover:bg-gray-800"}`}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-4">
            All plans include 14-day free trial • No credit card required • Cancel anytime
          </p>
          <div className="flex justify-center space-x-8 text-sm text-gray-500">
            <span>✓ 99.9% Uptime SLA</span>
            <span>✓ 24/7 Support</span>
            <span>✓ GDPR Compliant</span>
          </div>
        </div>
      </div>
    </section>
  )
}
