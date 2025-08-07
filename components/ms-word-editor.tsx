"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
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
  Type,
  Highlighter,
  Minus,
  Plus,
  Paintbrush,
  Strikethrough,
  Subscript,
  Superscript,
  IndentDecrease,
  IndentIncrease,
  Palette,
  FlagIcon as BorderAll,
  FileImage,
  Shapes,
  BarChart3,
  Video,
  Bookmark,
  MessageSquare,
  HeadingIcon as Header,
  FootprintsIcon as Footer,
  Hash,
  Calendar,
  Calculator,
  Layers,
  RotateCcw,
  Eye,
  Grid3X3,
  Navigation,
  SplitSquareHorizontal,
  Settings,
  SpellCheckIcon,
  Globe,
  Users,
  CheckSquare,
  XSquare,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Layout,
  Columns,
  BookmarkIcon as PageBreak,
  Ruler,
  Square,
  Maximize2,
  X,
  FilePlus,
  FolderOpen,
  FileDown,
  Share2,
  ListTree,
  CornerDownRight,
  PaintBucket,
  Replace,
  MousePointer,
  Move,
  Quote,
  Mail,
  Languages,
  Shield,
} from "lucide-react"

interface DocumentState {
  title: string
  content: string
  wordCount: number
  characterCount: number
  pageCount: number
}

export default function MSWordEditor() {
  const [activeTab, setActiveTab] = useState("home")
  const [fontSize, setFontSize] = useState("12")
  const [fontFamily, setFontFamily] = useState("Calibri")
  const [zoom, setZoom] = useState(100)
  const [documentState, setDocumentState] = useState<DocumentState>({
    title: "Document1",
    content: "",
    wordCount: 0,
    characterCount: 0,
    pageCount: 1,
  })
  const [showRuler, setShowRuler] = useState(true)
  const [showGridlines, setShowGridlines] = useState(false)
  const [viewMode, setViewMode] = useState("print")
  const [trackChanges, setTrackChanges] = useState(false)
  const [showComments, setShowComments] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const editorRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const tabs = [
    { id: "file", label: "File" },
    { id: "home", label: "Home" },
    { id: "insert", label: "Insert" },
    { id: "design", label: "Design" },
    { id: "layout", label: "Layout" },
    { id: "references", label: "References" },
    { id: "mailings", label: "Mailings" },
    { id: "review", label: "Review" },
    { id: "view", label: "View" },
  ]

  const fontSizes = ["8", "9", "10", "11", "12", "14", "16", "18", "20", "24", "28", "32", "36", "48", "72", "96"]
  const fontFamilies = [
    "Calibri",
    "Arial",
    "Times New Roman",
    "Georgia",
    "Verdana",
    "Helvetica",
    "Comic Sans MS",
    "Impact",
    "Trebuchet MS",
    "Courier New",
    "Lucida Console",
    "Tahoma",
    "Palatino",
    "Garamond",
    "Book Antiqua",
  ]

  const headingStyles = [
    { name: "Normal", tag: "p", style: "font-size: 12pt; font-weight: normal;" },
    { name: "Heading 1", tag: "h1", style: "font-size: 18pt; font-weight: bold; color: #2F5496;" },
    { name: "Heading 2", tag: "h2", style: "font-size: 16pt; font-weight: bold; color: #2F5496;" },
    { name: "Heading 3", tag: "h3", style: "font-size: 14pt; font-weight: bold; color: #2F5496;" },
    { name: "Title", tag: "h1", style: "font-size: 28pt; font-weight: bold; text-align: center;" },
    { name: "Subtitle", tag: "h2", style: "font-size: 18pt; font-style: italic; text-align: center;" },
  ]

  const themes = [
    { name: "Office", colors: ["#2F5496", "#E7E6E6", "#44546A", "#5B9BD5"] },
    { name: "Colorful", colors: ["#E74C3C", "#3498DB", "#2ECC71", "#F39C12"] },
    { name: "Blue", colors: ["#1F4E79", "#4472C4", "#70AD47", "#FFC000"] },
    { name: "Green", colors: ["#70AD47", "#4472C4", "#E7E6E6", "#A5A5A5"] },
  ]

  useEffect(() => {
    const updateStats = () => {
      if (editorRef.current) {
        const content = editorRef.current.innerText || ""
        const words = content.trim() ? content.trim().split(/\s+/).length : 0
        const characters = content.length
        const pages = Math.max(1, Math.ceil(characters / 3000)) // Rough estimate

        setDocumentState((prev) => ({
          ...prev,
          content: editorRef.current?.innerHTML || "",
          wordCount: words,
          characterCount: characters,
          pageCount: pages,
        }))
      }
    }

    const editor = editorRef.current
    if (editor) {
      editor.addEventListener("input", updateStats)
      return () => editor.removeEventListener("input", updateStats)
    }
  }, [])

  const executeCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    editorRef.current?.focus()
  }

  const handleFontSizeChange = (size: string) => {
    setFontSize(size)
    executeCommand("fontSize", "3")
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

  const applyHeadingStyle = (style: (typeof headingStyles)[0]) => {
    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      const element = document.createElement(style.tag)
      element.setAttribute("style", style.style)
      try {
        range.surroundContents(element)
      } catch (e) {
        element.appendChild(range.extractContents())
        range.insertNode(element)
      }
    }
  }

  const insertImage = () => {
    fileInputRef.current?.click()
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = document.createElement("img")
        img.src = e.target?.result as string
        img.style.maxWidth = "100%"
        img.style.height = "auto"
        img.style.margin = "12pt 0"
        editorRef.current?.appendChild(img)
      }
      reader.readAsDataURL(file)
    }
  }

  const insertTable = (rows = 3, cols = 3) => {
    const table = document.createElement("table")
    table.style.borderCollapse = "collapse"
    table.style.width = "100%"
    table.style.border = "1px solid #000"
    table.style.margin = "12pt 0"

    for (let i = 0; i < rows; i++) {
      const row = table.insertRow()
      for (let j = 0; j < cols; j++) {
        const cell = row.insertCell()
        cell.style.border = "1px solid #000"
        cell.style.padding = "8px"
        cell.style.minHeight = "20px"
        cell.innerHTML = "&nbsp;"
      }
    }

    editorRef.current?.appendChild(table)
  }

  const insertPageBreak = () => {
    const pageBreak = document.createElement("div")
    pageBreak.style.pageBreakBefore = "always"
    pageBreak.style.height = "1px"
    pageBreak.innerHTML = "&nbsp;"
    editorRef.current?.appendChild(pageBreak)
  }

  const insertHeader = () => {
    const header = document.createElement("div")
    header.style.borderBottom = "1px solid #ccc"
    header.style.paddingBottom = "12pt"
    header.style.marginBottom = "24pt"
    header.style.textAlign = "center"
    header.innerHTML = "Header Text"
    editorRef.current?.insertBefore(header, editorRef.current.firstChild)
  }

  const insertFooter = () => {
    const footer = document.createElement("div")
    footer.style.borderTop = "1px solid #ccc"
    footer.style.paddingTop = "12pt"
    footer.style.marginTop = "24pt"
    footer.style.textAlign = "center"
    footer.innerHTML = "Footer Text"
    editorRef.current?.appendChild(footer)
  }

  const insertTOC = () => {
    const toc = document.createElement("div")
    toc.style.marginBottom = "24pt"
    toc.innerHTML = `
      <h2 style="font-weight: bold; margin-bottom: 12pt;">Table of Contents</h2>
      <div style="margin-left: 24pt;">
        <div>1. Introduction ........................... 1</div>
        <div>2. Main Content ......................... 2</div>
        <div>3. Conclusion ........................... 3</div>
      </div>
    `
    editorRef.current?.insertBefore(toc, editorRef.current.firstChild)
  }

  const saveDocument = () => {
    const content = editorRef.current?.innerHTML || ""
    const fullDocument = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${documentState.title}</title>
          <style>
            body { 
              font-family: ${fontFamily}; 
              font-size: ${fontSize}pt; 
              line-height: 1.6; 
              margin: 1in; 
              max-width: 8.5in;
            }
            table { border-collapse: collapse; width: 100%; margin: 12pt 0; }
            td, th { border: 1px solid #000; padding: 8px; }
            h1, h2, h3 { margin: 18pt 0 12pt 0; }
            p { margin: 0 0 12pt 0; }
            ul, ol { margin: 0 0 12pt 0; padding-left: 24pt; }
            img { max-width: 100%; height: auto; margin: 12pt 0; }
          </style>
        </head>
        <body>${content}</body>
      </html>
    `
    const blob = new Blob([fullDocument], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${documentState.title}.html`
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
            <title>${documentState.title}</title>
            <style>
              body { 
                font-family: ${fontFamily}; 
                font-size: ${fontSize}pt; 
                line-height: 1.6; 
                margin: 1in; 
              }
              table { border-collapse: collapse; width: 100%; }
              td, th { border: 1px solid #000; padding: 8px; }
              @media print { body { margin: 0.5in; } }
            </style>
          </head>
          <body>${content}</body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  const findAndReplace = () => {
    const searchTerm = prompt("Find:")
    if (searchTerm) {
      const replaceTerm = prompt("Replace with:")
      if (replaceTerm !== null) {
        const content = editorRef.current?.innerHTML || ""
        const newContent = content.replace(new RegExp(searchTerm, "gi"), replaceTerm)
        if (editorRef.current) {
          editorRef.current.innerHTML = newContent
        }
      }
    }
  }

  const spellCheck = () => {
    if (editorRef.current) {
      editorRef.current.spellcheck = !editorRef.current.spellcheck
    }
  }

  const insertComment = () => {
    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      const comment = prompt("Enter comment:")
      if (comment) {
        const span = document.createElement("span")
        span.style.backgroundColor = "#ffeb3b"
        span.style.position = "relative"
        span.title = comment
        try {
          range.surroundContents(span)
        } catch (e) {
          span.appendChild(range.extractContents())
          range.insertNode(span)
        }
      }
    }
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  return (
    <div className={`${isFullscreen ? "fixed inset-0 z-50" : ""} bg-gray-100 flex flex-col h-screen`}>
      {/* Title Bar */}
      <div className="bg-blue-600 text-white px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FileText className="h-5 w-5" />
          <input
            type="text"
            value={documentState.title}
            onChange={(e) => setDocumentState((prev) => ({ ...prev, title: e.target.value }))}
            className="bg-transparent border-none text-white placeholder-blue-200 focus:outline-none"
          />
          <span className="text-blue-200">- PDFCraft Word Editor</span>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="text-white hover:bg-blue-700">
            <Minus className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-white hover:bg-blue-700" onClick={toggleFullscreen}>
            {isFullscreen ? <Square className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="sm" className="text-white hover:bg-blue-700">
            <X className="h-4 w-4" />
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
      <div className="bg-white border-b border-gray-200 px-4 py-3 min-h-[100px]">
        {activeTab === "file" && (
          <div className="grid grid-cols-4 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">New</h3>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                  <FilePlus className="h-4 w-4 mr-2" />
                  Blank Document
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                  <FileText className="h-4 w-4 mr-2" />
                  Template
                </Button>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Open</h3>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                  <FolderOpen className="h-4 w-4 mr-2" />
                  Open File
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                  <FileText className="h-4 w-4 mr-2" />
                  Recent
                </Button>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Save</h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={saveDocument}
                  className="w-full justify-start bg-transparent"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                  <FileDown className="h-4 w-4 mr-2" />
                  Save As
                </Button>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Share</h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={printDocument}
                  className="w-full justify-start bg-transparent"
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "home" && (
          <div className="flex items-center space-x-6">
            {/* Clipboard */}
            <div className="flex flex-col items-center space-y-1 border-r border-gray-200 pr-4">
              <div className="flex space-x-1">
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
              <div className="flex space-x-1">
                <Button variant="ghost" size="sm" title="Format Painter">
                  <Paintbrush className="h-4 w-4" />
                </Button>
              </div>
              <span className="text-xs text-gray-500">Clipboard</span>
            </div>

            {/* Font */}
            <div className="flex flex-col space-y-2 border-r border-gray-200 pr-4">
              <div className="flex items-center space-x-2">
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
                <Button variant="ghost" size="sm" title="Increase Font Size">
                  <Plus className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="sm" title="Decrease Font Size">
                  <Minus className="h-3 w-3" />
                </Button>
              </div>
              <div className="flex items-center space-x-1">
                <Button variant="ghost" size="sm" onClick={() => executeCommand("bold")}>
                  <Bold className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => executeCommand("italic")}>
                  <Italic className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => executeCommand("underline")}>
                  <Underline className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => executeCommand("strikethrough")}>
                  <Strikethrough className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => executeCommand("subscript")}>
                  <Subscript className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => executeCommand("superscript")}>
                  <Superscript className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => executeCommand("hiliteColor", "yellow")}>
                  <Highlighter className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => executeCommand("foreColor", "#000000")}>
                  <Type className="h-4 w-4" />
                </Button>
              </div>
              <span className="text-xs text-gray-500">Font</span>
            </div>

            {/* Paragraph */}
            <div className="flex flex-col space-y-2 border-r border-gray-200 pr-4">
              <div className="flex items-center space-x-1">
                <Button variant="ghost" size="sm" onClick={() => executeCommand("insertUnorderedList")}>
                  <List className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => executeCommand("insertOrderedList")}>
                  <ListOrdered className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" title="Multilevel List">
                  <ListTree className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => executeCommand("outdent")}>
                  <IndentDecrease className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => executeCommand("indent")}>
                  <IndentIncrease className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center space-x-1">
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
                <Button variant="ghost" size="sm" title="Line Spacing">
                  <CornerDownRight className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" title="Shading">
                  <PaintBucket className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" title="Borders">
                  <BorderAll className="h-4 w-4" />
                </Button>
              </div>
              <span className="text-xs text-gray-500">Paragraph</span>
            </div>

            {/* Styles */}
            <div className="flex flex-col space-y-2 border-r border-gray-200 pr-4">
              <div className="grid grid-cols-3 gap-1">
                {headingStyles.slice(0, 6).map((style, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => applyHeadingStyle(style)}
                    className="text-xs p-1 h-8"
                    title={style.name}
                  >
                    {style.name === "Normal" ? "N" : style.name.charAt(0)}
                  </Button>
                ))}
              </div>
              <span className="text-xs text-gray-500">Styles</span>
            </div>

            {/* Editing */}
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-1">
                <Button variant="ghost" size="sm" title="Find">
                  <Search className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={findAndReplace} title="Replace">
                  <Replace className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" title="Select All" onClick={() => executeCommand("selectAll")}>
                  <MousePointer className="h-4 w-4" />
                </Button>
              </div>
              <span className="text-xs text-gray-500">Editing</span>
            </div>
          </div>
        )}

        {activeTab === "insert" && (
          <div className="flex items-center space-x-6">
            {/* Pages */}
            <div className="flex flex-col space-y-2 border-r border-gray-200 pr-4">
              <div className="flex items-center space-x-1">
                <Button variant="ghost" size="sm" title="Cover Page">
                  <FileText className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" title="Blank Page">
                  <FilePlus className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={insertPageBreak} title="Page Break">
                  <PageBreak className="h-4 w-4" />
                </Button>
              </div>
              <span className="text-xs text-gray-500">Pages</span>
            </div>

            {/* Tables */}
            <div className="flex flex-col space-y-2 border-r border-gray-200 pr-4">
              <div className="flex items-center space-x-1">
                <Button variant="ghost" size="sm" onClick={() => insertTable(3, 3)} title="Table">
                  <Table className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" title="Draw Table">
                  <Grid3X3 className="h-4 w-4" />
                </Button>
              </div>
              <span className="text-xs text-gray-500">Tables</span>
            </div>

            {/* Illustrations */}
            <div className="flex flex-col space-y-2 border-r border-gray-200 pr-4">
              <div className="flex items-center space-x-1">
                <Button variant="ghost" size="sm" onClick={insertImage} title="Pictures">
                  <Image className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" title="Online Pictures">
                  <FileImage className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" title="Shapes">
                  <Shapes className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" title="Chart">
                  <BarChart3 className="h-4 w-4" />
                </Button>
              </div>
              <span className="text-xs text-gray-500">Illustrations</span>
            </div>

            {/* Links */}
            <div className="flex flex-col space-y-2 border-r border-gray-200 pr-4">
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => executeCommand("createLink", prompt("Enter URL:") || "")}
                  title="Hyperlink"
                >
                  <Link className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" title="Bookmark">
                  <Bookmark className="h-4 w-4" />
                </Button>
              </div>
              <span className="text-xs text-gray-500">Links</span>
            </div>

            {/* Header & Footer */}
            <div className="flex flex-col space-y-2 border-r border-gray-200 pr-4">
              <div className="flex items-center space-x-1">
                <Button variant="ghost" size="sm" onClick={insertHeader} title="Header">
                  <Header className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={insertFooter} title="Footer">
                  <Footer className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" title="Page Number">
                  <Hash className="h-4 w-4" />
                </Button>
              </div>
              <span className="text-xs text-gray-500">Header & Footer</span>
            </div>

            {/* Text */}
            <div className="flex flex-col space-y-2 border-r border-gray-200 pr-4">
              <div className="flex items-center space-x-1">
                <Button variant="ghost" size="sm" title="Text Box">
                  <Square className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" title="Date & Time">
                  <Calendar className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" title="Object">
                  <Calculator className="h-4 w-4" />
                </Button>
              </div>
              <span className="text-xs text-gray-500">Text</span>
            </div>

            {/* Media */}
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-1">
                <Button variant="ghost" size="sm" title="Online Video">
                  <Video className="h-4 w-4" />
                </Button>
              </div>
              <span className="text-xs text-gray-500">Media</span>
            </div>
          </div>
        )}

        {activeTab === "design" && (
          <div className="flex items-center space-x-6">
            {/* Document Formatting */}
            <div className="flex flex-col space-y-2 border-r border-gray-200 pr-4">
              <div className="flex items-center space-x-2">
                {themes.map((theme, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="w-16 h-12 p-1 bg-transparent"
                    title={theme.name}
                    style={{
                      background: `linear-gradient(45deg, ${theme.colors.join(", ")})`,
                    }}
                  >
                    <span className="text-xs text-white font-bold">{theme.name.charAt(0)}</span>
                  </Button>
                ))}
              </div>
              <span className="text-xs text-gray-500">Themes</span>
            </div>

            {/* Page Background */}
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-1">
                <Button variant="ghost" size="sm" title="Watermark">
                  <Layers className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" title="Page Color">
                  <Palette className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" title="Page Borders">
                  <BorderAll className="h-4 w-4" />
                </Button>
              </div>
              <span className="text-xs text-gray-500">Page Background</span>
            </div>
          </div>
        )}

        {activeTab === "layout" && (
          <div className="flex items-center space-x-6">
            {/* Page Setup */}
            <div className="flex flex-col space-y-2 border-r border-gray-200 pr-4">
              <div className="flex items-center space-x-1">
                <Button variant="ghost" size="sm" title="Margins">
                  <Layout className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" title="Orientation">
                  <RotateCcw className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" title="Size">
                  <Square className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" title="Columns">
                  <Columns className="h-4 w-4" />
                </Button>
              </div>
              <span className="text-xs text-gray-500">Page Setup</span>
            </div>

            {/* Arrange */}
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-1">
                <Button variant="ghost" size="sm" title="Position">
                  <Move className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" title="Wrap Text">
                  <Type className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" title="Align">
                  <AlignCenter className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" title="Group">
                  <Layers className="h-4 w-4" />
                </Button>
              </div>
              <span className="text-xs text-gray-500">Arrange</span>
            </div>
          </div>
        )}

        {activeTab === "references" && (
          <div className="flex items-center space-x-6">
            {/* Table of Contents */}
            <div className="flex flex-col space-y-2 border-r border-gray-200 pr-4">
              <div className="flex items-center space-x-1">
                <Button variant="ghost" size="sm" onClick={insertTOC} title="Table of Contents">
                  <BookOpen className="h-4 w-4" />
                </Button>
              </div>
              <span className="text-xs text-gray-500">Table of Contents</span>
            </div>

            {/* Footnotes */}
            <div className="flex flex-col space-y-2 border-r border-gray-200 pr-4">
              <div className="flex items-center space-x-1">
                <Button variant="ghost" size="sm" title="Insert Footnote">
                  <Quote className="h-4 w-4" />
                </Button>
              </div>
              <span className="text-xs text-gray-500">Footnotes</span>
            </div>

            {/* Citations */}
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-1">
                <Button variant="ghost" size="sm" title="Insert Citation">
                  <Quote className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" title="Bibliography">
                  <BookOpen className="h-4 w-4" />
                </Button>
              </div>
              <span className="text-xs text-gray-500">Citations & Bibliography</span>
            </div>
          </div>
        )}

        {activeTab === "mailings" && (
          <div className="flex items-center space-x-6">
            {/* Create */}
            <div className="flex flex-col space-y-2 border-r border-gray-200 pr-4">
              <div className="flex items-center space-x-1">
                <Button variant="ghost" size="sm" title="Envelopes">
                  <Mail className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" title="Labels">
                  <Square className="h-4 w-4" />
                </Button>
              </div>
              <span className="text-xs text-gray-500">Create</span>
            </div>

            {/* Mail Merge */}
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-1">
                <Button variant="ghost" size="sm" title="Start Mail Merge">
                  <Users className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" title="Select Recipients">
                  <Users className="h-4 w-4" />
                </Button>
              </div>
              <span className="text-xs text-gray-500">Start Mail Merge</span>
            </div>
          </div>
        )}

        {activeTab === "review" && (
          <div className="flex items-center space-x-6">
            {/* Proofing */}
            <div className="flex flex-col space-y-2 border-r border-gray-200 pr-4">
              <div className="flex items-center space-x-1">
                <Button variant="ghost" size="sm" onClick={spellCheck} title="Spelling & Grammar">
                  <SpellCheckIcon className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" title="Thesaurus">
                  <BookOpen className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" title="Word Count">
                  <Hash className="h-4 w-4" />
                </Button>
              </div>
              <span className="text-xs text-gray-500">Proofing</span>
            </div>

            {/* Language */}
            <div className="flex flex-col space-y-2 border-r border-gray-200 pr-4">
              <div className="flex items-center space-x-1">
                <Button variant="ghost" size="sm" title="Translate">
                  <Globe className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" title="Language">
                  <Languages className="h-4 w-4" />
                </Button>
              </div>
              <span className="text-xs text-gray-500">Language</span>
            </div>

            {/* Comments */}
            <div className="flex flex-col space-y-2 border-r border-gray-200 pr-4">
              <div className="flex items-center space-x-1">
                <Button variant="ghost" size="sm" onClick={insertComment} title="New Comment">
                  <MessageSquare className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setShowComments(!showComments)} title="Show Comments">
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
              <span className="text-xs text-gray-500">Comments</span>
            </div>

            {/* Tracking */}
            <div className="flex flex-col space-y-2 border-r border-gray-200 pr-4">
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setTrackChanges(!trackChanges)}
                  title="Track Changes"
                  className={trackChanges ? "bg-blue-100" : ""}
                >
                  <SpellCheckIcon className="h-4 w-4" />
                </Button>
              </div>
              <span className="text-xs text-gray-500">Tracking</span>
            </div>

            {/* Changes */}
            <div className="flex flex-col space-y-2 border-r border-gray-200 pr-4">
              <div className="flex items-center space-x-1">
                <Button variant="ghost" size="sm" title="Accept">
                  <CheckSquare className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" title="Reject">
                  <XSquare className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" title="Previous">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" title="Next">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
              <span className="text-xs text-gray-500">Changes</span>
            </div>

            {/* Protect */}
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-1">
                <Button variant="ghost" size="sm" title="Restrict Editing">
                  <Shield className="h-4 w-4" />
                </Button>
              </div>
              <span className="text-xs text-gray-500">Protect</span>
            </div>
          </div>
        )}

        {activeTab === "view" && (
          <div className="flex items-center space-x-6">
            {/* Views */}
            <div className="flex flex-col space-y-2 border-r border-gray-200 pr-4">
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode("read")}
                  title="Read Mode"
                  className={viewMode === "read" ? "bg-blue-100" : ""}
                >
                  <BookOpen className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode("print")}
                  title="Print Layout"
                  className={viewMode === "print" ? "bg-blue-100" : ""}
                >
                  <Layout className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode("web")}
                  title="Web Layout"
                  className={viewMode === "web" ? "bg-blue-100" : ""}
                >
                  <Globe className="h-4 w-4" />
                </Button>
              </div>
              <span className="text-xs text-gray-500">Views</span>
            </div>

            {/* Show */}
            <div className="flex flex-col space-y-2 border-r border-gray-200 pr-4">
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowRuler(!showRuler)}
                  title="Ruler"
                  className={showRuler ? "bg-blue-100" : ""}
                >
                  <Ruler className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowGridlines(!showGridlines)}
                  title="Gridlines"
                  className={showGridlines ? "bg-blue-100" : ""}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" title="Navigation Pane">
                  <Navigation className="h-4 w-4" />
                </Button>
              </div>
              <span className="text-xs text-gray-500">Show</span>
            </div>

            {/* Zoom */}
            <div className="flex flex-col space-y-2 border-r border-gray-200 pr-4">
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" onClick={() => setZoom(Math.max(25, zoom - 25))}>
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-sm text-gray-600 min-w-[60px] text-center">{zoom}%</span>
                <Button variant="ghost" size="sm" onClick={() => setZoom(Math.min(500, zoom + 25))}>
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setZoom(100)} title="100%">
                  100%
                </Button>
              </div>
              <span className="text-xs text-gray-500">Zoom</span>
            </div>

            {/* Window */}
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-1">
                <Button variant="ghost" size="sm" title="Split">
                  <SplitSquareHorizontal className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" title="View Side by Side">
                  <Layers className="h-4 w-4" />
                </Button>
              </div>
              <span className="text-xs text-gray-500">Window</span>
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
          <Button variant="ghost" size="sm" onClick={printDocument}>
            <Printer className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Ruler */}
        {showRuler && (
          <div className="bg-white border-r border-gray-200 w-8 flex flex-col items-center py-4">
            <div className="writing-mode-vertical text-xs text-gray-500 transform -rotate-90 origin-center">Ruler</div>
          </div>
        )}

        {/* Document Area */}
        <div className="flex-1 bg-gray-100 p-8 overflow-auto">
          <div className="max-w-4xl mx-auto">
            {/* Page */}
            <div
              className={`bg-white shadow-lg border border-gray-300 min-h-[11in] p-16 mx-auto relative ${
                showGridlines ? "bg-grid" : ""
              }`}
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
                  // Stats are updated via useEffect
                }}
                suppressContentEditableWarning={true}
                spellCheck={true}
              >
                <h1 style={{ fontSize: "18pt", fontWeight: "bold", color: "#2F5496", marginBottom: "12pt" }}>
                  Welcome to PDFCraft Word Editor
                </h1>
                <p style={{ marginBottom: "12pt" }}>
                  This is a comprehensive Microsoft Word-like editor with all the features you need for professional
                  document creation and editing.
                </p>
                <h2 style={{ fontSize: "16pt", fontWeight: "bold", color: "#2F5496", marginBottom: "12pt" }}>
                  Key Features:
                </h2>
                <ul style={{ marginBottom: "12pt", paddingLeft: "24pt" }}>
                  <li>Complete ribbon interface with all MS Word tabs</li>
                  <li>Rich text formatting with fonts, colors, and styles</li>
                  <li>Insert images, tables, headers, footers, and more</li>
                  <li>Track changes and collaboration features</li>
                  <li>Print and export capabilities</li>
                  <li>Spell check and grammar tools</li>
                  <li>Multiple view modes and zoom options</li>
                </ul>
                <p style={{ marginBottom: "12pt" }}>
                  <strong>Try the features:</strong> Select this text and use the formatting tools in the ribbon above.
                  You can make text <em>italic</em>, <u>underlined</u>, or{" "}
                  <span style={{ backgroundColor: "yellow" }}>highlighted</span>.
                </p>
                <p style={{ marginBottom: "12pt" }}>
                  Use the Insert tab to add images, tables, and other elements. The Review tab provides spell checking
                  and collaboration tools. The View tab lets you change how the document appears.
                </p>
                <p>Happy editing with PDFCraft!</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="bg-blue-600 text-white px-4 py-2 text-sm flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span>
            Page {documentState.pageCount} of {documentState.pageCount}
          </span>
          <span>Words: {documentState.wordCount}</span>
          <span>Characters: {documentState.characterCount}</span>
          {trackChanges && <span className="bg-blue-700 px-2 py-1 rounded">Track Changes: ON</span>}
        </div>
        <div className="flex items-center space-x-4">
          <span>{zoom}%</span>
          <Button variant="ghost" size="sm" className="text-white hover:bg-blue-700">
            <Search className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-white hover:bg-blue-700">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Hidden file input */}
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" multiple />
    </div>
  )
}
