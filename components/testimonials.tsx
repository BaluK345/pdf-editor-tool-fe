import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Marketing Director",
    company: "TechCorp",
    image: "/placeholder.svg?height=60&width=60",
    content:
      "PDFCraft has revolutionized how our team handles document collaboration. The real-time editing and AI features save us hours every week.",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "Legal Counsel",
    company: "Law Firm Associates",
    image: "/placeholder.svg?height=60&width=60",
    content:
      "The security features and compliance standards make PDFCraft perfect for our legal documents. The OCR accuracy is outstanding.",
    rating: 5,
  },
  {
    name: "Emily Rodriguez",
    role: "Project Manager",
    company: "Design Studio",
    image: "/placeholder.svg?height=60&width=60",
    content:
      "As a creative professional, I love the design tools and template library. PDFCraft makes creating beautiful documents effortless.",
    rating: 5,
  },
  {
    name: "David Kim",
    role: "Operations Manager",
    company: "StartupXYZ",
    image: "/placeholder.svg?height=60&width=60",
    content:
      "The workflow automation features have streamlined our document processes. PDFCraft scales perfectly with our growing team.",
    rating: 5,
  },
  {
    name: "Lisa Thompson",
    role: "HR Director",
    company: "Global Enterprises",
    image: "/placeholder.svg?height=60&width=60",
    content:
      "Managing employee documents is so much easier now. The enterprise features and SSO integration work flawlessly.",
    rating: 5,
  },
  {
    name: "James Wilson",
    role: "Freelance Consultant",
    company: "Independent",
    image: "/placeholder.svg?height=60&width=60",
    content:
      "PDFCraft gives me all the professional tools I need at an affordable price. The personal plan is perfect for my consulting work.",
    rating: 5,
  },
]

export default function Testimonials() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Trusted by Professionals Worldwide</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See what our customers are saying about their experience with PDFCraft.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>

              <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>

              <div className="flex items-center">
                <img
                  src={testimonial.image || "/placeholder.svg"}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-gray-600 text-sm">
                    {testimonial.role} at {testimonial.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-blue-50 rounded-2xl p-8">
            <div className="flex justify-center items-center space-x-8 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">50K+</div>
                <div className="text-gray-600">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">1M+</div>
                <div className="text-gray-600">Documents Edited</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">99.9%</div>
                <div className="text-gray-600">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">4.9/5</div>
                <div className="text-gray-600">User Rating</div>
              </div>
            </div>
            <p className="text-gray-600">
              Join thousands of satisfied customers who trust PDFCraft for their document editing needs.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
