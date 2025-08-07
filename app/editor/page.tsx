"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import {
  Upload,
  Download,
  Type,
  ImageIcon,
  Square,
  Circle,
  Minus,
  Highlighter,
  PenTool,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  Save,
  Users,
  Settings,
} from "lucide-react"

export default function EditorPage() {
  const [selectedTool, setSelectedTool] = useState("select")
  const [zoom, setZoom] = useState(100)
  const [fileName, setFileName] = useState("Untitled Document")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const tools = [
    { id: "select", icon: PenTool, label: "Select" },
    { id: "text", icon: Type, label: "Text" },
    { id: "image", icon: ImageIcon, label: "Image" },
    { id: "rectangle", icon: Square, label: "Rectangle" },
    { id: "circle", icon: Circle, label: "Circle" },
    { id: "line", icon: Minus, label: "Line" },
    { id: "highlight", icon: Highlighter, label: "Highlight" },
  ]

  const handleFileUpload = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setFileName(file.name)
      // Handle file upload logic here
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-lg font-semibold text-gray-900">{fileName}</h1>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Undo className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Redo className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Users className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="ghost" size="sm">
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Sidebar */}
        <div className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-4 space-y-2">
          <Button variant="ghost" size="sm" className="w-12 h-12 p-0" onClick={handleFileUpload}>
            <Upload className="h-5 w-5" />
          </Button>

          <div className="w-full h-px bg-gray-200 my-2" />

          {tools.map((tool) => (
            <Button
              key={tool.id}
              variant={selectedTool === tool.id ? "default" : "ghost"}
              size="sm"
              className="w-12 h-12 p-0"
              onClick={() => setSelectedTool(tool.id)}
              title={tool.label}
            >
              <tool.icon className="h-5 w-5" />
            </Button>
          ))}

          <div className="w-full h-px bg-gray-200 my-2" />

          <Button variant="ghost" size="sm" className="w-12 h-12 p-0">
            <Settings className="h-5 w-5" />
          </Button>
        </div>

        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col">
          {/* Toolbar */}
          <div className="bg-white border-b border-gray-200 px-4 py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => setZoom(Math.max(25, zoom - 25))}>
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-gray-600 min-w-[60px] text-center">{zoom}%</span>
                  <Button variant="ghost" size="sm" onClick={() => setZoom(Math.min(500, zoom + 25))}>
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                </div>

                {selectedTool === "text" && (
                  <div className="flex items-center space-x-2 border-l border-gray-200 pl-4">
                    <select className="text-sm border border-gray-300 rounded px-2 py-1">
                      <option>Arial</option>
                      <option>Helvetica</option>
                      <option>Times New Roman</option>
                      <option>Georgia</option>
                    </select>
                    <select className="text-sm border border-gray-300 rounded px-2 py-1">
                      <option>12px</option>
                      <option>14px</option>
                      <option>16px</option>
                      <option>18px</option>
                      <option>24px</option>
                    </select>
                    <Button variant="ghost" size="sm">
                      <strong>B</strong>
                    </Button>
                    <Button variant="ghost" size="sm">
                      <em>I</em>
                    </Button>
                    <Button variant="ghost" size="sm">
                      <u>U</u>
                    </Button>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Page 1 of 1</span>
              </div>
            </div>
          </div>

          {/* Canvas Area */}
          <div className="flex-1 overflow-auto bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto">
              <div
                className="bg-white shadow-lg border border-gray-300 mx-auto"
                style={{
                  width: `${8.5 * zoom}px`,
                  height: `${11 * zoom}px`,
                  transform: `scale(${zoom / 100})`,
                  transformOrigin: "top center",
                }}
              >
                {/* PDF Content Area */}
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <Upload className="h-16 w-16 mx-auto mb-4" />
                    <p className="text-lg font-medium">Upload a PDF to get started</p>
                    <p className="text-sm mt-2">Drag and drop a file or click to browse</p>
                    <Button className="mt-4" onClick={handleFileUpload}>
                      Choose File
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Properties Panel */}
        <div className="w-64 bg-white border-l border-gray-200 p-4">
          <h3 className="font-semibold text-gray-900 mb-4">Properties</h3>

          {selectedTool === "text" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Font Family</label>
                <select className="w-full border border-gray-300 rounded px-3 py-2">
                  <option>Arial</option>
                  <option>Helvetica</option>
                  <option>Times New Roman</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Font Size</label>
                <input type="number" className="w-full border border-gray-300 rounded px-3 py-2" defaultValue="14" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                <input type="color" className="w-full h-10 border border-gray-300 rounded" defaultValue="#000000" />
              </div>
            </div>
          )}

          {selectedTool === "rectangle" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fill Color</label>
                <input type="color" className="w-full h-10 border border-gray-300 rounded" defaultValue="#3B82F6" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Border Width</label>
                <input type="number" className="w-full border border-gray-300 rounded px-3 py-2" defaultValue="1" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Border Color</label>
                <input type="color" className="w-full h-10 border border-gray-300 rounded" defaultValue="#000000" />
              </div>
            </div>
          )}

          <div className="mt-8">
            <h4 className="font-medium text-gray-900 mb-2">Recent Actions</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <div>Added text element</div>
              <div>Changed font size</div>
              <div>Inserted image</div>
            </div>
          </div>
        </div>
      </div>

      <input ref={fileInputRef} type="file" accept=".pdf" onChange={handleFileChange} className="hidden" />
    </div>
  )
}
