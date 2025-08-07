import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Play, Star, Users, Zap } from "lucide-react"

export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="flex justify-center items-center space-x-2 mb-6">
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
              ))}
            </div>
            <span className="text-gray-600">Trusted by 50,000+ users</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            The Future of
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              {" "}
              PDF Editing
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Transform your documents with AI-powered editing, real-time collaboration, and professional-grade tools.
            Edit PDFs like never before.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link href="/editor">
              <Button size="lg" className="text-lg px-8 py-4">
                Start Editing Free
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="text-lg px-8 py-4 bg-transparent">
              <Play className="h-5 w-5 mr-2" />
              Watch Demo
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-center space-x-2">
              <Zap className="h-6 w-6 text-blue-600" />
              <span className="text-gray-700 font-medium">Lightning Fast</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Users className="h-6 w-6 text-blue-600" />
              <span className="text-gray-700 font-medium">Real-time Collaboration</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Star className="h-6 w-6 text-blue-600" />
              <span className="text-gray-700 font-medium">AI-Powered Tools</span>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <div className="relative max-w-5xl mx-auto">
            <div className="bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="ml-4 text-sm text-gray-600">PDFCraft Editor</span>
                </div>
              </div>
              <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 bg-white rounded-lg shadow-lg flex items-center justify-center mb-4 mx-auto">
                    <svg className="w-12 h-12 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-600">Professional PDF Editor Interface</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
