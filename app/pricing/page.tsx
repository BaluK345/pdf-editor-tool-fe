import Pricing from "@/components/pricing"

export default function PricingPage() {
  return (
    <div className="pt-16">
      <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Choose Your Perfect Plan</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Start with our free plan and upgrade as your needs grow. All plans include our core PDF editing features
            with no hidden fees.
          </p>
        </div>
      </div>
      <div className="bg-gray-50 -mt-8">
        <Pricing />
      </div>
    </div>
  )
}
