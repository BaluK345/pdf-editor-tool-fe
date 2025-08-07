import { FileText, Users, Shield, Zap, Brain, Cloud, Edit3, Search, Palette } from "lucide-react"

const features = [
  {
    icon: Edit3,
    title: "Advanced Text Editing",
    description: "Edit text directly in PDFs with full formatting control, font selection, and layout preservation.",
  },
  {
    icon: Users,
    title: "Real-time Collaboration",
    description: "Work together with your team in real-time with comments, suggestions, and live editing.",
  },
  {
    icon: Brain,
    title: "AI-Powered Tools",
    description: "Leverage AI for content generation, translation, OCR, and intelligent document analysis.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-grade encryption, SSO integration, and compliance with GDPR, HIPAA standards.",
  },
  {
    icon: Search,
    title: "OCR Technology",
    description: "Convert scanned documents to editable text with industry-leading OCR accuracy.",
  },
  {
    icon: Cloud,
    title: "Cloud Sync",
    description: "Access your documents anywhere with seamless cloud synchronization across devices.",
  },
  {
    icon: Palette,
    title: "Design Tools",
    description: "Professional design tools with templates, shapes, annotations, and digital signatures.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Optimized performance with sub-second rendering and minimal memory footprint.",
  },
  {
    icon: FileText,
    title: "Format Support",
    description: "Import and export multiple formats including PDF, Word, PowerPoint, and images.",
  },
]

export default function Features() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Everything You Need to Edit PDFs</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From basic editing to advanced AI-powered features, PDFCraft provides all the tools you need for
            professional document editing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Transform Your PDF Workflow?</h3>
            <p className="text-gray-600 mb-6">
              Join thousands of professionals who trust PDFCraft for their document editing needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Start Free Trial
              </button>
              <button className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                Schedule Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
