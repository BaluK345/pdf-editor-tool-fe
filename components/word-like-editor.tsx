"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Image,
  Table,
  Link,
  Save,
  FileText,
  Printer,
  Undo,
  Redo,
  Copy,
  ScissorsIcon as Cut,
  ClipboardPasteIcon as Paste,
  Search,
  ZoomIn,
  ZoomOut,
  ChevronDown,
  Type,
  Highlighter,
  Minus,
  MoreHorizontal,
} from "lucide-react"

export default function WordLikeEditor() {
  const [activeTab, setActiveTab] = useState("home")
  const [fontSize, setFontSize] = useState("12")
  const [fontFamily, setFontFamily] = useState("Calibri")
  const [zoom, setZoom] = useState(100)
  const [documentTitle, setDocumentTitle] = useState("Document1")
  const editorRef = useRef<HTMLDivElement>(null)

  const tabs = [
    { id: "file", label: "File" },
    { id: "home", label: "Home" },
    { id: "insert", label: "Insert" },
    { id: "layout", label: "Layout" },
    { id: "references", label: "References" },
    { id: "review", label: "Review" },
    { id: "view", label: "View" },
  ]

  const fontSizes = ["8", "9", "10", "11", "12", "14", "16", "18", "20", "24", "28", "32", "36", "48", "72"]
  const fontFamilies = ["Calibri", "Arial", "Times New Roman", "Georgia", "Verdana", "Helvetica", "Comic Sans MS"]

  const executeCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    editorRef.current?.focus()
  }

  const handleFontSizeChange = (size: string) => {
    setFontSize(size)
    executeCommand("fontSize", "3")
    // Apply custom font size
    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      if (!range.collapsed) {
        const span = document.createElement("span")
        span.style.fontSize = size + "pt"
        try {
          range.surroundContents(span)
        } catch (e) {
          span.appendChild(range.extractContents())
          range.insertNode(span)
        }
      }
    }
  }

  const handleFontFamilyChange = (family: string) => {
    setFontFamily(family)
    executeCommand("fontName", family)
  }

  const insertImage = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const img = document.createElement("img")
          img.src = e.target?.result as string
          img.style.maxWidth = "100%"
          img.style.height = "auto"
          editorRef.current?.appendChild(img)
        }
        reader.readAsDataURL(file)
      }
    }
    input.click()
  }

  const insertTable = () => {
    const table = document.createElement("table")
    table.style.borderCollapse = "collapse"
    table.style.width = "100%"
    table.style.border = "1px solid #ccc"

    for (let i = 0; i < 3; i++) {
      const row = table.insertRow()
      for (let j = 0; j < 3; j++) {
        const cell = row.insertCell()
        cell.style.border = "1px solid #ccc"
        cell.style.padding = "8px"
        cell.innerHTML = "&nbsp;"
      }
    }

    editorRef.current?.appendChild(table)
  }

  const saveDocument = () => {
    const content = editorRef.current?.innerHTML || ""
    const blob = new Blob([content], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${documentTitle}.html`
    a.click()
    URL.revokeObjectURL(url)
  }

  const printDocument = () => {
    const content = editorRef.current?.innerHTML || ""
    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${documentTitle}</title>
            <style>
              body { font-family: ${fontFamily}; font-size: ${fontSize}pt; line-height: 1.6; margin: 1in; }
              table { border-collapse: collapse; width: 100%; }
              td, th { border: 1px solid #ccc; padding: 8px; }
            </style>
          </head>
          <body>${content}</body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Title Bar */}
      <div className="bg-blue-600 text-white px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FileText className="h-5 w-5" />
          <input
            type="text"
            value={documentTitle}
            onChange={(e) => setDocumentTitle(e.target.value)}
            className="bg-transparent border-none text-white placeholder-blue-200 focus:outline-none"
          />
          <span className="text-blue-200">- PDFCraft</span>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="text-white hover:bg-blue-700">
            <Minus className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-white hover:bg-blue-700">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Ribbon Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex space-x-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600 bg-blue-50"
                  : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Ribbon Content */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        {activeTab === "file" && (
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" onClick={saveDocument}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button variant="outline" size="sm" onClick={printDocument}>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button variant="outline" size="sm">
              <FileText className="h-4 w-4 mr-2" />
              New
            </Button>
          </div>
        )}

        {activeTab === "home" && (
          <div className="flex items-center space-x-6">
            {/* Clipboard */}
            <div className="flex items-center space-x-1 border-r border-gray-200 pr-4">
              <Button variant="ghost" size="sm" onClick={() => executeCommand("cut")}>
                <Cut className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => executeCommand("copy")}>
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => executeCommand("paste")}>
                <Paste className="h-4 w-4" />
              </Button>
            </div>

            {/* Font */}
            <div className="flex items-center space-x-2 border-r border-gray-200 pr-4">
              <select
                value={fontFamily}
                onChange={(e) => handleFontFamilyChange(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 text-sm min-w-[120px]"
              >
                {fontFamilies.map((font) => (
                  <option key={font} value={font}>
                    {font}
                  </option>
                ))}
              </select>
              <select
                value={fontSize}
                onChange={(e) => handleFontSizeChange(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 text-sm w-16"
              >
                {fontSizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>

            {/* Formatting */}
            <div className="flex items-center space-x-1 border-r border-gray-200 pr-4">
              <Button variant="ghost" size="sm" onClick={() => executeCommand("bold")}>
                <Bold className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => executeCommand("italic")}>
                <Italic className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => executeCommand("underline")}>
                <Underline className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => executeCommand("hiliteColor", "yellow")}>
                <Highlighter className="h-4 w-4" />
              </Button>
              <div className="flex items-center">
                <Button variant="ghost" size="sm" onClick={() => executeCommand("foreColor", "#000000")}>
                  <Type className="h-4 w-4" />
                </Button>
                <ChevronDown className="h-3 w-3" />
              </div>
            </div>

            {/* Alignment */}
            <div className="flex items-center space-x-1 border-r border-gray-200 pr-4">
              <Button variant="ghost" size="sm" onClick={() => executeCommand("justifyLeft")}>
                <AlignLeft className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => executeCommand("justifyCenter")}>
                <AlignCenter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => executeCommand("justifyRight")}>
                <AlignRight className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => executeCommand("justifyFull")}>
                <AlignJustify className="h-4 w-4" />
              </Button>
            </div>

            {/* Lists */}
            <div className="flex items-center space-x-1">
              <Button variant="ghost" size="sm" onClick={() => executeCommand("insertUnorderedList")}>
                <List className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => executeCommand("insertOrderedList")}>
                <ListOrdered className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {activeTab === "insert" && (
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" onClick={insertImage}>
              <Image className="h-4 w-4 mr-2" />
              Picture
            </Button>
            <Button variant="outline" size="sm" onClick={insertTable}>
              <Table className="h-4 w-4 mr-2" />
              Table
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => executeCommand("createLink", prompt("Enter URL:") || "")}
            >
              <Link className="h-4 w-4 mr-2" />
              Link
            </Button>
          </div>
        )}

        {activeTab === "view" && (
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
          </div>
        )}
      </div>

      {/* Quick Access Toolbar */}
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-2">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={() => executeCommand("undo")}>
            <Undo className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => executeCommand("redo")}>
            <Redo className="h-4 w-4" />
          </Button>
          <div className="w-px h-4 bg-gray-300 mx-2" />
          <Button variant="ghost" size="sm" onClick={saveDocument}>
            <Save className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex">
        {/* Ruler */}
        <div className="bg-white border-r border-gray-200 w-8 flex flex-col items-center py-4">
          <div className="writing-mode-vertical text-xs text-gray-500 transform -rotate-90 origin-center">Ruler</div>
        </div>

        {/* Document Area */}
        <div className="flex-1 bg-gray-100 p-8 overflow-auto">
          <div className="max-w-4xl mx-auto">
            {/* Page */}
            <div
              className="bg-white shadow-lg border border-gray-300 min-h-[11in] p-16 mx-auto"
              style={{
                width: "8.5in",
                transform: `scale(${zoom / 100})`,
                transformOrigin: "top center",
              }}
            >
              <div
                ref={editorRef}
                contentEditable
                className="min-h-full outline-none"
                style={{
                  fontFamily: fontFamily,
                  fontSize: fontSize + "pt",
                  lineHeight: "1.6",
                }}
                onInput={() => {
                  // Auto-save functionality could go here
                }}
                suppressContentEditableWarning={true}
              >
                <p>
                  <strong>Welcome to PDFCraft Editor</strong>
                </p>
                <p>
                  Start typing your document here. You can use all the formatting tools in the ribbon above to style
                  your text, insert images, create tables, and more.
                </p>
                <p>
                  This editor works just like Microsoft Word, with familiar tools and shortcuts. Try selecting text and
                  using the formatting options!
                </p>
                <ul>
                  <li>Bold, italic, and underline text</li>
                  <li>Change fonts and font sizes</li>
                  <li>Align text left, center, right, or justify</li>
                  <li>Create bulleted and numbered lists</li>
                  <li>Insert images and tables</li>
                </ul>
                <p>Happy editing!</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="bg-blue-600 text-white px-4 py-2 text-sm flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span>Page 1 of 1</span>
          <span>Words: 0</span>
          <span>Characters: 0</span>
        </div>
        <div className="flex items-center space-x-4">
          <span>{zoom}%</span>
          <Button variant="ghost" size="sm" className="text-white hover:bg-blue-700">
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
