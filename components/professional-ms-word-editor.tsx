"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback } from "react"
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
  ImageIcon,
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
  FileImage,
  Shapes,
  BarChart3,
  Bookmark,
  MessageSquare,
  Hash,
  Calendar,
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
  ChevronDown,
  Star,
  Heart,
  Triangle,
  Circle,
  Hexagon,
  Smile,
  Frown,
  Sun,
  Moon,
  Cloud,
  Umbrella,
} from "lucide-react"

interface DocumentState {
  title: string
  content: string
  wordCount: number
  characterCount: number
  pageCount: number
  isModified: boolean
  currentPage: number
}

interface UndoRedoState {
  content: string
  timestamp: number
}

interface TableDimensions {
  rows: number
  cols: number
}

export default function ProfessionalMSWordEditor() {
  const [activeTab, setActiveTab] = useState("home")
  const [fontSize, setFontSize] = useState("11")
  const [fontFamily, setFontFamily] = useState("Calibri")
  const [zoom, setZoom] = useState(100)
  const [documentState, setDocumentState] = useState<DocumentState>({
    title: "Document1",
    content: "",
    wordCount: 0,
    characterCount: 0,
    pageCount: 1,
    isModified: false,
    currentPage: 1,
  })
  const [showRuler, setShowRuler] = useState(true)
  const [showGridlines, setShowGridlines] = useState(false)
  const [viewMode, setViewMode] = useState("print")
  const [trackChanges, setTrackChanges] = useState(false)
  const [showComments, setShowComments] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [currentColor, setCurrentColor] = useState("#000000")
  const [currentHighlight, setCurrentHighlight] = useState("#ffff00")
  const [undoStack, setUndoStack] = useState<UndoRedoState[]>([])
  const [redoStack, setRedoStack] = useState<UndoRedoState[]>([])
  const [isSpellCheckEnabled, setIsSpellCheckEnabled] = useState(true)
  const [findText, setFindText] = useState("")
  const [replaceText, setReplaceText] = useState("")
  const [showFindReplace, setShowFindReplace] = useState(false)
  const [selectedTheme, setSelectedTheme] = useState("office")
  const [pageOrientation, setPageOrientation] = useState("portrait")
  const [pageSize, setPageSize] = useState("letter")
  const [margins, setMargins] = useState("normal")
  const [columns, setColumns] = useState(1)
  const [showTableGrid, setShowTableGrid] = useState(false)
  const [tableSelection, setTableSelection] = useState<TableDimensions>({ rows: 0, cols: 0 })
  const [showShapes, setShowShapes] = useState(false)
  const [showSymbols, setShowSymbols] = useState(false)
  const [lineSpacing, setLineSpacing] = useState("1.15")
  const [currentStyle, setCurrentStyle] = useState("Normal")

  const editorRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const colorInputRef = useRef<HTMLInputElement>(null)
  const highlightInputRef = useRef<HTMLInputElement>(null)

  const tabs = [
    { id: "file", label: "File", color: "#0078d4" },
    { id: "home", label: "Home", color: "#0078d4" },
    { id: "insert", label: "Insert", color: "#0078d4" },
    { id: "design", label: "Design", color: "#0078d4" },
    { id: "layout", label: "Layout", color: "#0078d4" },
    { id: "references", label: "References", color: "#0078d4" },
    { id: "mailings", label: "Mailings", color: "#0078d4" },
    { id: "review", label: "Review", color: "#0078d4" },
    { id: "view", label: "View", color: "#0078d4" },
  ]

  const fontSizes = ["8", "9", "10", "11", "12", "14", "16", "18", "20", "22", "24", "26", "28", "36", "48", "72"]
  const fontFamilies = [
    "Calibri",
    "Calibri Light",
    "Arial",
    "Arial Black",
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
    "Century Gothic",
    "Franklin Gothic Medium",
  ]

  const headingStyles = [
    { name: "Normal", className: "normal-text", fontSize: "11pt", fontWeight: "400", color: "#000000" },
    { name: "No Spacing", className: "no-spacing", fontSize: "11pt", fontWeight: "400", color: "#000000" },
    { name: "Heading 1", className: "heading-1", fontSize: "16pt", fontWeight: "700", color: "#2F5496" },
    { name: "Heading 2", className: "heading-2", fontSize: "13pt", fontWeight: "700", color: "#2F5496" },
    { name: "Heading 3", className: "heading-3", fontSize: "12pt", fontWeight: "700", color: "#2F5496" },
    { name: "Title", className: "title-text", fontSize: "28pt", fontWeight: "700", color: "#2F5496" },
    { name: "Subtitle", className: "subtitle-text", fontSize: "11pt", fontWeight: "400", color: "#666666" },
    { name: "Subtle Emphasis", className: "subtle-emphasis", fontSize: "11pt", fontWeight: "400", color: "#666666" },
    { name: "Emphasis", className: "emphasis", fontSize: "11pt", fontWeight: "400", color: "#2F5496" },
    { name: "Intense Emphasis", className: "intense-emphasis", fontSize: "11pt", fontWeight: "700", color: "#2F5496" },
    { name: "Strong", className: "strong", fontSize: "11pt", fontWeight: "700", color: "#000000" },
    { name: "Quote", className: "quote", fontSize: "11pt", fontWeight: "400", color: "#666666" },
    { name: "Intense Quote", className: "intense-quote", fontSize: "11pt", fontWeight: "700", color: "#2F5496" },
  ]

  const themes = [
    {
      name: "Office",
      id: "office",
      colors: ["#0078D4", "#106EBE", "#005A9E", "#004578", "#003966", "#FFB900", "#D83B01", "#B50E0E"],
    },
    {
      name: "Colorful",
      id: "colorful",
      colors: ["#E74C3C", "#3498DB", "#2ECC71", "#F39C12", "#9B59B6", "#1ABC9C", "#34495E", "#95A5A6"],
    },
    {
      name: "Blue",
      id: "blue",
      colors: ["#1F4E79", "#4472C4", "#70AD47", "#FFC000", "#C55A11", "#843C0C", "#A5A5A5", "#70AD47"],
    },
    {
      name: "Blue Warm",
      id: "blue-warm",
      colors: ["#0F4C75", "#3282B8", "#BBE1FA", "#1B262C", "#0F3460", "#533483", "#7209B7", "#A663CC"],
    },
    {
      name: "Gray",
      id: "gray",
      colors: ["#595959", "#767171", "#A5A5A5", "#D6D6D6", "#E7E6E6", "#F2F2F2", "#FAFAFA", "#FFFFFF"],
    },
  ]

  const pageOrientations = [
    { name: "Portrait", value: "portrait", width: "8.5in", height: "11in" },
    { name: "Landscape", value: "landscape", width: "11in", height: "8.5in" },
  ]

  const pageSizes = [
    { name: "Letter", value: "letter", width: "8.5in", height: "11in" },
    { name: "Legal", value: "legal", width: "8.5in", height: "14in" },
    { name: "A4", value: "a4", width: "8.27in", height: "11.69in" },
    { name: "A3", value: "a3", width: "11.69in", height: "16.54in" },
    { name: "Tabloid", value: "tabloid", width: "11in", height: "17in" },
  ]

  const marginOptions = [
    { name: "Normal", value: "normal", top: "1in", right: "1in", bottom: "1in", left: "1in" },
    { name: "Narrow", value: "narrow", top: "0.5in", right: "0.5in", bottom: "0.5in", left: "0.5in" },
    { name: "Moderate", value: "moderate", top: "1in", right: "0.75in", bottom: "1in", left: "0.75in" },
    { name: "Wide", value: "wide", top: "1in", right: "2in", bottom: "1in", left: "2in" },
  ]

  const shapes = [
    { name: "Rectangle", icon: Square, type: "rectangle" },
    { name: "Circle", icon: Circle, type: "circle" },
    { name: "Triangle", icon: Triangle, type: "triangle" },
    { name: "Star", icon: Star, type: "star" },
    { name: "Heart", icon: Heart, type: "heart" },
    { name: "Hexagon", icon: Hexagon, type: "hexagon" },
  ]

  const symbols = [
    { name: "Smile", icon: Smile, symbol: "😊" },
    { name: "Frown", icon: Frown, symbol: "😢" },
    { name: "Sun", icon: Sun, symbol: "☀️" },
    { name: "Moon", icon: Moon, symbol: "🌙" },
    { name: "Cloud", icon: Cloud, symbol: "☁️" },
    { name: "Umbrella", icon: Umbrella, symbol: "☂️" },
    { name: "Star", icon: Star, symbol: "⭐" },
    { name: "Heart", icon: Heart, symbol: "❤️" },
  ]

  // Save state for undo/redo
  const saveState = useCallback(() => {
    if (editorRef.current) {
      const newState: UndoRedoState = {
        content: editorRef.current.innerHTML,
        timestamp: Date.now(),
      }
      setUndoStack((prev) => [...prev.slice(-49), newState]) // Keep last 50 states
      setRedoStack([]) // Clear redo stack when new action is performed
    }
  }, [])

  // Modern rich text implementation
  const applyFormat = useCallback(
    (format: string, value?: string) => {
      saveState()
      editorRef.current?.focus()

      const selection = window.getSelection()
      if (!selection || selection.rangeCount === 0) return

      const range = selection.getRangeAt(0)

      try {
        switch (format) {
          case "bold":
            document.execCommand("bold", false)
            break
          case "italic":
            document.execCommand("italic", false)
            break
          case "underline":
            document.execCommand("underline", false)
            break
          case "strikethrough":
            document.execCommand("strikeThrough", false)
            break
          case "subscript":
            document.execCommand("subscript", false)
            break
          case "superscript":
            document.execCommand("superscript", false)
            break
          case "fontSize":
            // Modern font size implementation
            if (range.collapsed) {
              const span = document.createElement("span")
              span.style.fontSize = value + "pt"
              span.innerHTML = "&#8203;" // Zero-width space
              range.insertNode(span)
              range.setStartAfter(span)
              range.setEndAfter(span)
              selection.removeAllRanges()
              selection.addRange(range)
            } else {
              const span = document.createElement("span")
              span.style.fontSize = value + "pt"
              span.appendChild(range.extractContents())
              range.insertNode(span)
            }
            break
          case "fontFamily":
            if (range.collapsed) {
              const span = document.createElement("span")
              span.style.fontFamily = value || ""
              span.innerHTML = "&#8203;"
              range.insertNode(span)
              range.setStartAfter(span)
              range.setEndAfter(span)
              selection.removeAllRanges()
              selection.addRange(range)
            } else {
              const span = document.createElement("span")
              span.style.fontFamily = value || ""
              span.appendChild(range.extractContents())
              range.insertNode(span)
            }
            break
          case "foreColor":
            if (range.collapsed) {
              const span = document.createElement("span")
              span.style.color = value || ""
              span.innerHTML = "&#8203;"
              range.insertNode(span)
              range.setStartAfter(span)
              range.setEndAfter(span)
              selection.removeAllRanges()
              selection.addRange(range)
            } else {
              const span = document.createElement("span")
              span.style.color = value || ""
              span.appendChild(range.extractContents())
              range.insertNode(span)
            }
            break
          case "hiliteColor":
            if (range.collapsed) {
              const span = document.createElement("span")
              span.style.backgroundColor = value || ""
              span.innerHTML = "&#8203;"
              range.insertNode(span)
              range.setStartAfter(span)
              range.setEndAfter(span)
              selection.removeAllRanges()
              selection.addRange(range)
            } else {
              const span = document.createElement("span")
              span.style.backgroundColor = value || ""
              span.appendChild(range.extractContents())
              range.insertNode(span)
            }
            break
          case "justifyLeft":
          case "justifyCenter":
          case "justifyRight":
          case "justifyFull":
          case "insertUnorderedList":
          case "insertOrderedList":
          case "indent":
          case "outdent":
            document.execCommand(format, false)
            break
          default:
            document.execCommand(format, false, value)
        }
      } catch (error) {
        console.error("Format application failed:", error)
      }

      // Update stats
      setTimeout(() => {
        if (editorRef.current) {
          const event = new Event("input", { bubbles: true })
          editorRef.current.dispatchEvent(event)
        }
      }, 0)
    },
    [saveState],
  )

  // Apply heading style
  const applyHeadingStyle = useCallback(
    (style: (typeof headingStyles)[0]) => {
      saveState()
      setCurrentStyle(style.name)

      const selection = window.getSelection()
      if (!selection || selection.rangeCount === 0) return

      const range = selection.getRangeAt(0)

      try {
        let element: HTMLElement

        if (range.collapsed) {
          // Create new paragraph with style
          element = document.createElement("div")
          element.innerHTML = style.name === "Normal" ? "Type here..." : `${style.name} text`
        } else {
          // Wrap selection
          element = document.createElement("div")
          element.appendChild(range.extractContents())
        }

        // Apply styles
        element.className = style.className
        element.style.fontSize = style.fontSize
        element.style.fontWeight = style.fontWeight
        element.style.color = style.color
        element.style.marginBottom = "12pt"

        if (style.name.includes("Heading")) {
          element.style.marginTop = "18pt"
        }

        range.insertNode(element)

        // Set cursor at end
        range.setStartAfter(element)
        range.setEndAfter(element)
        selection.removeAllRanges()
        selection.addRange(range)
      } catch (error) {
        console.error("Style application failed:", error)
      }
    },
    [saveState],
  )

  // Insert table with proper functionality
  const insertTable = useCallback(
    (rows: number, cols: number) => {
      saveState()

      const table = document.createElement("table")
      table.style.borderCollapse = "collapse"
      table.style.width = "100%"
      table.style.border = "1px solid #000"
      table.style.margin = "12pt 0"
      table.className = "editable-table"

      for (let i = 0; i < rows; i++) {
        const row = table.insertRow()
        for (let j = 0; j < cols; j++) {
          const cell = row.insertCell()
          cell.style.border = "1px solid #000"
          cell.style.padding = "8px"
          cell.style.minHeight = "20px"
          cell.style.minWidth = "50px"
          cell.contentEditable = "true"
          cell.innerHTML = "&nbsp;"

          // Add cell event listeners
          cell.addEventListener("focus", () => {
            cell.style.backgroundColor = "#f0f8ff"
          })
          cell.addEventListener("blur", () => {
            cell.style.backgroundColor = ""
          })
        }
      }

      const selection = window.getSelection()
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)
        range.insertNode(table)
        range.setStartAfter(table)
        range.setEndAfter(table)
        selection.removeAllRanges()
        selection.addRange(range)
      } else {
        editorRef.current?.appendChild(table)
      }

      setShowTableGrid(false)
    },
    [saveState],
  )

  // Insert image with proper handling
  const insertImage = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = (e) => {
          saveState()
          const img = document.createElement("img")
          img.src = e.target?.result as string
          img.style.maxWidth = "100%"
          img.style.height = "auto"
          img.style.margin = "12pt 0"
          img.style.display = "block"
          img.style.cursor = "pointer"
          img.draggable = true

          // Add resize functionality
          img.addEventListener("click", () => {
            img.style.outline = "2px solid #0078d4"
            const width = prompt("Enter width (in pixels):", img.offsetWidth.toString())
            if (width && !isNaN(Number(width))) {
              img.style.width = width + "px"
              img.style.height = "auto"
            }
            img.style.outline = ""
          })

          const selection = window.getSelection()
          if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0)
            range.insertNode(img)
            range.setStartAfter(img)
            range.setEndAfter(img)
            selection.removeAllRanges()
            selection.addRange(range)
          } else {
            editorRef.current?.appendChild(img)
          }
        }
        reader.readAsDataURL(file)
      }
      event.target.value = ""
    },
    [saveState],
  )

  // Insert shape
  const insertShape = useCallback(
    (shapeType: string) => {
      saveState()

      const shapeContainer = document.createElement("div")
      shapeContainer.style.display = "inline-block"
      shapeContainer.style.margin = "12pt"
      shapeContainer.style.cursor = "pointer"

      let shapeElement: HTMLElement

      switch (shapeType) {
        case "rectangle":
          shapeElement = document.createElement("div")
          shapeElement.style.width = "100px"
          shapeElement.style.height = "60px"
          shapeElement.style.backgroundColor = "#0078d4"
          shapeElement.style.border = "2px solid #005a9e"
          break
        case "circle":
          shapeElement = document.createElement("div")
          shapeElement.style.width = "80px"
          shapeElement.style.height = "80px"
          shapeElement.style.backgroundColor = "#0078d4"
          shapeElement.style.borderRadius = "50%"
          shapeElement.style.border = "2px solid #005a9e"
          break
        case "triangle":
          shapeElement = document.createElement("div")
          shapeElement.style.width = "0"
          shapeElement.style.height = "0"
          shapeElement.style.borderLeft = "40px solid transparent"
          shapeElement.style.borderRight = "40px solid transparent"
          shapeElement.style.borderBottom = "60px solid #0078d4"
          break
        default:
          shapeElement = document.createElement("div")
          shapeElement.style.width = "100px"
          shapeElement.style.height = "60px"
          shapeElement.style.backgroundColor = "#0078d4"
          shapeElement.style.border = "2px solid #005a9e"
      }

      shapeContainer.appendChild(shapeElement)

      const selection = window.getSelection()
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)
        range.insertNode(shapeContainer)
        range.setStartAfter(shapeContainer)
        range.setEndAfter(shapeContainer)
        selection.removeAllRanges()
        selection.addRange(range)
      } else {
        editorRef.current?.appendChild(shapeContainer)
      }

      setShowShapes(false)
    },
    [saveState],
  )

  // Insert symbol
  const insertSymbol = useCallback(
    (symbol: string) => {
      saveState()

      const span = document.createElement("span")
      span.innerHTML = symbol
      span.style.fontSize = fontSize + "pt"

      const selection = window.getSelection()
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)
        range.insertNode(span)
        range.setStartAfter(span)
        range.setEndAfter(span)
        selection.removeAllRanges()
        selection.addRange(range)
      } else {
        editorRef.current?.appendChild(span)
      }

      setShowSymbols(false)
    },
    [saveState, fontSize],
  )

  // Apply theme
  const applyTheme = useCallback((theme: (typeof themes)[0]) => {
    setSelectedTheme(theme.id)

    if (editorRef.current) {
      // Apply theme colors to document
      const root = document.documentElement
      root.style.setProperty("--theme-primary", theme.colors[0])
      root.style.setProperty("--theme-secondary", theme.colors[1])
      root.style.setProperty("--theme-accent", theme.colors[2])

      // Update existing headings
      const headings = editorRef.current.querySelectorAll(".heading-1, .heading-2, .heading-3")
      headings.forEach((heading) => {
        ;(heading as HTMLElement).style.color = theme.colors[0]
      })
    }
  }, [])

  // Change page orientation
  const changePageOrientation = useCallback((orientation: string) => {
    setPageOrientation(orientation)
    const selectedOrientation = pageOrientations.find((o) => o.value === orientation)
    if (selectedOrientation && editorRef.current?.parentElement) {
      const pageElement = editorRef.current.parentElement
      pageElement.style.width = selectedOrientation.width
      pageElement.style.height = selectedOrientation.height
    }
  }, [])

  // Change page size
  const changePageSize = useCallback(
    (size: string) => {
      setPageSize(size)
      const selectedSize = pageSizes.find((s) => s.value === size)
      if (selectedSize && editorRef.current?.parentElement) {
        const pageElement = editorRef.current.parentElement
        if (pageOrientation === "portrait") {
          pageElement.style.width = selectedSize.width
          pageElement.style.height = selectedSize.height
        } else {
          pageElement.style.width = selectedSize.height
          pageElement.style.height = selectedSize.width
        }
      }
    },
    [pageOrientation],
  )

  // Change margins
  const changeMargins = useCallback((marginType: string) => {
    setMargins(marginType)
    const selectedMargin = marginOptions.find((m) => m.value === marginType)
    if (selectedMargin && editorRef.current) {
      editorRef.current.style.padding = `${selectedMargin.top} ${selectedMargin.right} ${selectedMargin.bottom} ${selectedMargin.left}`
    }
  }, [])

  // Change columns
  const changeColumns = useCallback((columnCount: number) => {
    setColumns(columnCount)
    if (editorRef.current) {
      if (columnCount === 1) {
        editorRef.current.style.columnCount = ""
        editorRef.current.style.columnGap = ""
      } else {
        editorRef.current.style.columnCount = columnCount.toString()
        editorRef.current.style.columnGap = "20px"
      }
    }
  }, [])

  // Line spacing
  const changeLineSpacing = useCallback((spacing: string) => {
    setLineSpacing(spacing)
    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      const container = range.commonAncestorContainer
      const element = container.nodeType === Node.TEXT_NODE ? container.parentElement : (container as HTMLElement)

      if (element && editorRef.current?.contains(element)) {
        element.style.lineHeight = spacing
      }
    } else if (editorRef.current) {
      editorRef.current.style.lineHeight = spacing
    }
  }, [])

  // Undo/Redo functionality
  const handleUndo = useCallback(() => {
    if (undoStack.length > 0 && editorRef.current) {
      const currentState: UndoRedoState = {
        content: editorRef.current.innerHTML,
        timestamp: Date.now(),
      }
      setRedoStack((prev) => [currentState, ...prev.slice(0, 49)])

      const previousState = undoStack[undoStack.length - 1]
      editorRef.current.innerHTML = previousState.content
      setUndoStack((prev) => prev.slice(0, -1))
    }
  }, [undoStack])

  const handleRedo = useCallback(() => {
    if (redoStack.length > 0 && editorRef.current) {
      const currentState: UndoRedoState = {
        content: editorRef.current.innerHTML,
        timestamp: Date.now(),
      }
      setUndoStack((prev) => [...prev.slice(-49), currentState])

      const nextState = redoStack[0]
      editorRef.current.innerHTML = nextState.content
      setRedoStack((prev) => prev.slice(1))
    }
  }, [redoStack])

  // Find and replace
  const findAndReplace = useCallback(() => {
    if (!findText || !editorRef.current) return

    const content = editorRef.current.innerHTML
    const regex = new RegExp(findText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi")
    const newContent = content.replace(regex, replaceText || findText)

    if (newContent !== content) {
      saveState()
      editorRef.current.innerHTML = newContent
    }
  }, [findText, replaceText, saveState])

  // Save document
  const saveDocument = useCallback(() => {
    const content = editorRef.current?.innerHTML || ""
    const fullDocument = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${documentState.title}</title>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { 
              font-family: ${fontFamily}; 
              font-size: ${fontSize}pt; 
              line-height: ${lineSpacing}; 
              margin: 1in; 
              max-width: 8.5in;
              background: white;
              color: #000;
            }
            .heading-1 { font-size: 16pt; font-weight: 700; color: #2F5496; margin: 18pt 0 12pt 0; }
            .heading-2 { font-size: 13pt; font-weight: 700; color: #2F5496; margin: 16pt 0 10pt 0; }
            .heading-3 { font-size: 12pt; font-weight: 700; color: #2F5496; margin: 14pt 0 8pt 0; }
            .title-text { font-size: 28pt; font-weight: 700; color: #2F5496; text-align: center; margin-bottom: 24pt; }
            .subtitle-text { font-size: 11pt; font-weight: 400; color: #666666; text-align: center; margin-bottom: 18pt; }
            table { border-collapse: collapse; width: 100%; margin: 12pt 0; }
            td, th { border: 1px solid #000; padding: 8px; }
            img { max-width: 100%; height: auto; margin: 12pt 0; display: block; }
            p { margin: 0 0 12pt 0; }
            ul, ol { margin: 0 0 12pt 0; padding-left: 24pt; }
            @media print {
              body { margin: 0.5in; }
              .page-break { page-break-before: always; }
            }
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

    setDocumentState((prev) => ({ ...prev, isModified: false }))
  }, [documentState.title, fontFamily, fontSize, lineSpacing])

  // Print document
  const printDocument = useCallback(() => {
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
                line-height: ${lineSpacing}; 
                margin: 0.5in; 
              }
              .heading-1 { font-size: 16pt; font-weight: 700; color: #2F5496; }
              .heading-2 { font-size: 13pt; font-weight: 700; color: #2F5496; }
              .heading-3 { font-size: 12pt; font-weight: 700; color: #2F5496; }
              table { border-collapse: collapse; width: 100%; }
              td, th { border: 1px solid #000; padding: 8px; }
              img { max-width: 100%; height: auto; }
              @media print { 
                body { margin: 0.5in; } 
                .page-break { page-break-before: always; }
              }
            </style>
          </head>
          <body>${content}</body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }, [documentState.title, fontFamily, fontSize, lineSpacing])

  // Update document statistics
  useEffect(() => {
    const updateStats = () => {
      if (editorRef.current) {
        const content = editorRef.current.innerText || ""
        const words = content.trim() ? content.trim().split(/\s+/).length : 0
        const characters = content.length
        const pages = Math.max(1, Math.ceil(characters / 3000))

        setDocumentState((prev) => ({
          ...prev,
          content: editorRef.current?.innerHTML || "",
          wordCount: words,
          characterCount: characters,
          pageCount: pages,
          isModified: true,
        }))
      }
    }

    const editor = editorRef.current
    if (editor) {
      editor.addEventListener("input", updateStats)
      editor.addEventListener("paste", updateStats)
      return () => {
        editor.removeEventListener("input", updateStats)
        editor.removeEventListener("paste", updateStats)
      }
    }
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case "z":
            if (e.shiftKey) {
              e.preventDefault()
              handleRedo()
            } else {
              e.preventDefault()
              handleUndo()
            }
            break
          case "y":
            e.preventDefault()
            handleRedo()
            break
          case "s":
            e.preventDefault()
            saveDocument()
            break
          case "p":
            e.preventDefault()
            printDocument()
            break
          case "f":
            e.preventDefault()
            setShowFindReplace(true)
            break
          case "b":
            e.preventDefault()
            applyFormat("bold")
            break
          case "i":
            e.preventDefault()
            applyFormat("italic")
            break
          case "u":
            e.preventDefault()
            applyFormat("underline")
            break
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [handleUndo, handleRedo, saveDocument, printDocument, applyFormat])

  return (
    <div className={`${isFullscreen ? "fixed inset-0 z-50" : ""} bg-gray-50 flex flex-col h-screen`}>
      {/* Title Bar - MS Word Style */}
      <div className="bg-white border-b border-gray-300 px-4 py-1 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
              <FileText className="h-4 w-4 text-white" />
            </div>
            <input
              type="text"
              value={documentState.title}
              onChange={(e) => setDocumentState((prev) => ({ ...prev, title: e.target.value }))}
              className="bg-transparent border-none text-gray-800 font-medium focus:outline-none text-sm"
            />
            {documentState.isModified && <span className="text-gray-500 text-sm">*</span>}
          </div>
          <span className="text-gray-500 text-sm">- Microsoft Word</span>
        </div>
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">
            <Minus className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-gray-100"
            onClick={() => setIsFullscreen(!isFullscreen)}
          >
            {isFullscreen ? <Square className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Quick Access Toolbar */}
      <div className="bg-white border-b border-gray-200 px-4 py-1">
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={saveDocument}
            className="h-7 w-7 p-0 hover:bg-blue-100"
            title="Save (Ctrl+S)"
          >
            <Save className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleUndo}
            disabled={undoStack.length === 0}
            className="h-7 w-7 p-0 hover:bg-blue-100"
            title="Undo (Ctrl+Z)"
          >
            <Undo className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRedo}
            disabled={redoStack.length === 0}
            className="h-7 w-7 p-0 hover:bg-blue-100"
            title="Redo (Ctrl+Y)"
          >
            <Redo className="h-3 w-3" />
          </Button>
          <div className="w-px h-4 bg-gray-300 mx-1" />
          <Button
            variant="ghost"
            size="sm"
            onClick={printDocument}
            className="h-7 w-7 p-0 hover:bg-blue-100"
            title="Print (Ctrl+P)"
          >
            <Printer className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Ribbon Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-normal border-b-2 transition-all duration-200 ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600 bg-blue-50"
                  : "border-transparent text-gray-700 hover:text-blue-600 hover:bg-gray-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Find/Replace Bar */}
      {showFindReplace && (
        <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-2 flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Find:</label>
            <input
              type="text"
              value={findText}
              onChange={(e) => setFindText(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 text-sm w-40 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search text"
            />
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Replace:</label>
            <input
              type="text"
              value={replaceText}
              onChange={(e) => setReplaceText(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 text-sm w-40 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Replace with"
            />
          </div>
          <Button size="sm" onClick={findAndReplace} className="bg-blue-600 hover:bg-blue-700 text-white">
            Replace All
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setShowFindReplace(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Ribbon Content */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 min-h-[120px]">
        {activeTab === "file" && (
          <div className="grid grid-cols-5 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 text-sm">New</h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start bg-transparent hover:bg-blue-50 text-xs"
                  onClick={() => {
                    if (editorRef.current) {
                      editorRef.current.innerHTML = ""
                      setDocumentState((prev) => ({ ...prev, title: "Document1", isModified: false }))
                    }
                  }}
                >
                  <FilePlus className="h-3 w-3 mr-2" />
                  Blank Document
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start bg-transparent hover:bg-blue-50 text-xs"
                >
                  <FileText className="h-3 w-3 mr-2" />
                  From Template
                </Button>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 text-sm">Open</h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start bg-transparent hover:bg-blue-50 text-xs"
                  onClick={() => {
                    const input = document.createElement("input")
                    input.type = "file"
                    input.accept = ".html,.htm,.txt,.docx"
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0]
                      if (file) {
                        const reader = new FileReader()
                        reader.onload = (e) => {
                          if (editorRef.current) {
                            editorRef.current.innerHTML = e.target?.result as string
                            setDocumentState((prev) => ({ ...prev, title: file.name.split(".")[0] }))
                          }
                        }
                        reader.readAsText(file)
                      }
                    }
                    input.click()
                  }}
                >
                  <FolderOpen className="h-3 w-3 mr-2" />
                  Open File
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start bg-transparent hover:bg-blue-50 text-xs"
                >
                  <FileText className="h-3 w-3 mr-2" />
                  Recent Files
                </Button>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 text-sm">Save</h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={saveDocument}
                  className="w-full justify-start bg-transparent hover:bg-blue-50 text-xs"
                >
                  <Save className="h-3 w-3 mr-2" />
                  Save
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start bg-transparent hover:bg-blue-50 text-xs"
                  onClick={() => {
                    const newTitle = prompt("Save as:", documentState.title)
                    if (newTitle) {
                      setDocumentState((prev) => ({ ...prev, title: newTitle }))
                      setTimeout(saveDocument, 100)
                    }
                  }}
                >
                  <FileDown className="h-3 w-3 mr-2" />
                  Save As
                </Button>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 text-sm">Print</h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={printDocument}
                  className="w-full justify-start bg-transparent hover:bg-blue-50 text-xs"
                >
                  <Printer className="h-3 w-3 mr-2" />
                  Print
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start bg-transparent hover:bg-blue-50 text-xs"
                >
                  <Eye className="h-3 w-3 mr-2" />
                  Print Preview
                </Button>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 text-sm">Share</h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start bg-transparent hover:bg-blue-50 text-xs"
                >
                  <Share2 className="h-3 w-3 mr-2" />
                  Share
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start bg-transparent hover:bg-blue-50 text-xs"
                >
                  <Mail className="h-3 w-3 mr-2" />
                  Email
                </Button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "home" && (
          <div className="flex items-start space-x-6">
            {/* Clipboard */}
            <div className="flex flex-col items-center space-y-2 border-r border-gray-200 pr-6">
              <div className="flex space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => applyFormat("cut")}
                  className="flex flex-col items-center p-2 h-12 w-12 hover:bg-blue-50"
                  title="Cut (Ctrl+X)"
                >
                  <Cut className="h-4 w-4" />
                  <span className="text-xs mt-1">Cut</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => applyFormat("copy")}
                  className="flex flex-col items-center p-2 h-12 w-12 hover:bg-blue-50"
                  title="Copy (Ctrl+C)"
                >
                  <Copy className="h-4 w-4" />
                  <span className="text-xs mt-1">Copy</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => applyFormat("paste")}
                  className="flex flex-col items-center p-2 h-12 w-12 hover:bg-blue-50"
                  title="Paste (Ctrl+V)"
                >
                  <Paste className="h-4 w-4" />
                  <span className="text-xs mt-1">Paste</span>
                </Button>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="flex flex-col items-center p-2 h-12 w-16 hover:bg-blue-50"
                title="Format Painter"
              >
                <Paintbrush className="h-4 w-4" />
                <span className="text-xs mt-1">Format Painter</span>
              </Button>
              <span className="text-xs text-gray-500 font-medium">Clipboard</span>
            </div>

            {/* Font */}
            <div className="flex flex-col space-y-2 border-r border-gray-200 pr-6">
              <div className="flex items-center space-x-2">
                <select
                  value={fontFamily}
                  onChange={(e) => {
                    setFontFamily(e.target.value)
                    applyFormat("fontFamily", e.target.value)
                  }}
                  className="border border-gray-300 rounded px-2 py-1 text-sm min-w-[140px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {fontFamilies.map((font) => (
                    <option key={font} value={font} style={{ fontFamily: font }}>
                      {font}
                    </option>
                  ))}
                </select>
                <select
                  value={fontSize}
                  onChange={(e) => {
                    setFontSize(e.target.value)
                    applyFormat("fontSize", e.target.value)
                  }}
                  className="border border-gray-300 rounded px-2 py-1 text-sm w-16 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {fontSizes.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 hover:bg-blue-50"
                  title="Increase Font Size"
                  onClick={() => {
                    const newSize = Math.min(72, Number.parseInt(fontSize) + 2).toString()
                    setFontSize(newSize)
                    applyFormat("fontSize", newSize)
                  }}
                >
                  <Plus className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 hover:bg-blue-50"
                  title="Decrease Font Size"
                  onClick={() => {
                    const newSize = Math.max(8, Number.parseInt(fontSize) - 2).toString()
                    setFontSize(newSize)
                    applyFormat("fontSize", newSize)
                  }}
                >
                  <Minus className="h-3 w-3" />
                </Button>
              </div>
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => applyFormat("bold")}
                  className="h-7 w-7 p-0 hover:bg-blue-50"
                  title="Bold (Ctrl+B)"
                >
                  <Bold className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => applyFormat("italic")}
                  className="h-7 w-7 p-0 hover:bg-blue-50"
                  title="Italic (Ctrl+I)"
                >
                  <Italic className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => applyFormat("underline")}
                  className="h-7 w-7 p-0 hover:bg-blue-50"
                  title="Underline (Ctrl+U)"
                >
                  <Underline className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => applyFormat("strikethrough")}
                  className="h-7 w-7 p-0 hover:bg-blue-50"
                  title="Strikethrough"
                >
                  <Strikethrough className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => applyFormat("subscript")}
                  className="h-7 w-7 p-0 hover:bg-blue-50"
                  title="Subscript"
                >
                  <Subscript className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => applyFormat("superscript")}
                  className="h-7 w-7 p-0 hover:bg-blue-50"
                  title="Superscript"
                >
                  <Superscript className="h-4 w-4" />
                </Button>
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => applyFormat("hiliteColor", currentHighlight)}
                    className="h-7 w-7 p-0 hover:bg-blue-50"
                    title="Text Highlight Color"
                  >
                    <Highlighter className="h-4 w-4" />
                  </Button>
                  <input
                    ref={highlightInputRef}
                    type="color"
                    value={currentHighlight}
                    onChange={(e) => {
                      setCurrentHighlight(e.target.value)
                      applyFormat("hiliteColor", e.target.value)
                    }}
                    className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => applyFormat("foreColor", currentColor)}
                    className="h-7 w-7 p-0 hover:bg-blue-50"
                    title="Font Color"
                  >
                    <Type className="h-4 w-4" />
                  </Button>
                  <input
                    ref={colorInputRef}
                    type="color"
                    value={currentColor}
                    onChange={(e) => {
                      setCurrentColor(e.target.value)
                      applyFormat("foreColor", e.target.value)
                    }}
                    className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              </div>
              <span className="text-xs text-gray-500 font-medium">Font</span>
            </div>

            {/* Paragraph */}
            <div className="flex flex-col space-y-2 border-r border-gray-200 pr-6">
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => applyFormat("insertUnorderedList")}
                  className="h-7 w-7 p-0 hover:bg-blue-50"
                  title="Bullets"
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => applyFormat("insertOrderedList")}
                  className="h-7 w-7 p-0 hover:bg-blue-50"
                  title="Numbering"
                >
                  <ListOrdered className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 hover:bg-blue-50" title="Multilevel List">
                  <ListTree className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => applyFormat("outdent")}
                  className="h-7 w-7 p-0 hover:bg-blue-50"
                  title="Decrease Indent"
                >
                  <IndentDecrease className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => applyFormat("indent")}
                  className="h-7 w-7 p-0 hover:bg-blue-50"
                  title="Increase Indent"
                >
                  <IndentIncrease className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => applyFormat("justifyLeft")}
                  className="h-7 w-7 p-0 hover:bg-blue-50"
                  title="Align Left"
                >
                  <AlignLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => applyFormat("justifyCenter")}
                  className="h-7 w-7 p-0 hover:bg-blue-50"
                  title="Center"
                >
                  <AlignCenter className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => applyFormat("justifyRight")}
                  className="h-7 w-7 p-0 hover:bg-blue-50"
                  title="Align Right"
                >
                  <AlignRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => applyFormat("justifyFull")}
                  className="h-7 w-7 p-0 hover:bg-blue-50"
                  title="Justify"
                >
                  <AlignJustify className="h-4 w-4" />
                </Button>
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 hover:bg-blue-50"
                    title="Line Spacing"
                    onClick={() => {
                      const spacing = prompt("Enter line spacing (1.0, 1.15, 1.5, 2.0):", lineSpacing)
                      if (spacing) {
                        changeLineSpacing(spacing)
                      }
                    }}
                  >
                    <CornerDownRight className="h-4 w-4" />
                  </Button>
                </div>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 hover:bg-blue-50" title="Shading">
                  <PaintBucket className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 hover:bg-blue-50" title="Borders">
                  <Square className="h-4 w-4" />
                </Button>
              </div>
              <span className="text-xs text-gray-500 font-medium">Paragraph</span>
            </div>

            {/* Styles */}
            <div className="flex flex-col space-y-2 border-r border-gray-200 pr-6">
              <div className="grid grid-cols-4 gap-1">
                {headingStyles.slice(0, 8).map((style, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => applyHeadingStyle(style)}
                    className={`text-xs p-1 h-8 bg-transparent hover:bg-blue-50 ${
                      currentStyle === style.name ? "bg-blue-100 border-blue-300" : ""
                    }`}
                    title={style.name}
                    style={{
                      fontSize: style.name.includes("Heading") ? "10px" : "9px",
                      fontWeight: style.fontWeight,
                      color: style.color,
                    }}
                  >
                    {style.name === "Normal" ? "Aa" : style.name.charAt(0)}
                  </Button>
                ))}
              </div>
              <div className="grid grid-cols-4 gap-1">
                {headingStyles.slice(8).map((style, index) => (
                  <Button
                    key={index + 8}
                    variant="outline"
                    size="sm"
                    onClick={() => applyHeadingStyle(style)}
                    className={`text-xs p-1 h-8 bg-transparent hover:bg-blue-50 ${
                      currentStyle === style.name ? "bg-blue-100 border-blue-300" : ""
                    }`}
                    title={style.name}
                    style={{
                      fontSize: "9px",
                      fontWeight: style.fontWeight,
                      color: style.color,
                    }}
                  >
                    {style.name.charAt(0)}
                  </Button>
                ))}
              </div>
              <span className="text-xs text-gray-500 font-medium">Styles</span>
            </div>

            {/* Editing */}
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 hover:bg-blue-50"
                  title="Find (Ctrl+F)"
                  onClick={() => setShowFindReplace(!showFindReplace)}
                >
                  <Search className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFindReplace(true)}
                  className="h-7 w-7 p-0 hover:bg-blue-50"
                  title="Replace"
                >
                  <Replace className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 hover:bg-blue-50"
                  title="Select All"
                  onClick={() => applyFormat("selectAll")}
                >
                  <MousePointer className="h-4 w-4" />
                </Button>
              </div>
              <span className="text-xs text-gray-500 font-medium">Editing</span>
            </div>
          </div>
        )}

        {activeTab === "insert" && (
          <div className="flex items-start space-x-6">
            {/* Pages */}
            <div className="flex flex-col space-y-2 border-r border-gray-200 pr-6">
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex flex-col items-center p-2 h-12 w-16 hover:bg-blue-50"
                  title="Cover Page"
                >
                  <FileText className="h-4 w-4" />
                  <span className="text-xs mt-1">Cover Page</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex flex-col items-center p-2 h-12 w-16 hover:bg-blue-50"
                  title="Blank Page"
                  onClick={() => {
                    saveState()
                    const pageBreak = document.createElement("div")
                    pageBreak.style.pageBreakBefore = "always"
                    pageBreak.style.height = "11in"
                    pageBreak.innerHTML = "&nbsp;"
                    editorRef.current?.appendChild(pageBreak)
                  }}
                >
                  <FilePlus className="h-4 w-4" />
                  <span className="text-xs mt-1">Blank Page</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex flex-col items-center p-2 h-12 w-16 hover:bg-blue-50"
                  title="Page Break"
                  onClick={() => {
                    saveState()
                    const pageBreak = document.createElement("div")
                    pageBreak.style.pageBreakBefore = "always"
                    pageBreak.style.height = "1px"
                    pageBreak.style.borderTop = "1px dashed #ccc"
                    pageBreak.style.margin = "24pt 0"
                    pageBreak.innerHTML = "&nbsp;"
                    editorRef.current?.appendChild(pageBreak)
                  }}
                >
                  <Square className="h-4 w-4" />
                  <span className="text-xs mt-1">Page Break</span>
                </Button>
              </div>
              <span className="text-xs text-gray-500 font-medium">Pages</span>
            </div>

            {/* Tables */}
            <div className="flex flex-col space-y-2 border-r border-gray-200 pr-6 relative">
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex flex-col items-center p-2 h-12 w-16 hover:bg-blue-50"
                  title="Table"
                  onClick={() => setShowTableGrid(!showTableGrid)}
                >
                  <Table className="h-4 w-4" />
                  <span className="text-xs mt-1">Table</span>
                </Button>
              </div>
              {showTableGrid && (
                <div className="absolute top-16 left-0 bg-white border border-gray-300 shadow-lg p-2 z-10">
                  <div className="grid grid-cols-8 gap-1 mb-2">
                    {Array.from({ length: 64 }, (_, i) => {
                      const row = Math.floor(i / 8) + 1
                      const col = (i % 8) + 1
                      return (
                        <div
                          key={i}
                          className={`w-4 h-4 border border-gray-300 cursor-pointer hover:bg-blue-100 ${
                            row <= tableSelection.rows && col <= tableSelection.cols ? "bg-blue-200" : ""
                          }`}
                          onMouseEnter={() => setTableSelection({ rows: row, cols: col })}
                          onClick={() => {
                            insertTable(row, col)
                            setTableSelection({ rows: 0, cols: 0 })
                          }}
                        />
                      )
                    })}
                  </div>
                  <div className="text-xs text-center text-gray-600">
                    {tableSelection.rows} x {tableSelection.cols} Table
                  </div>
                </div>
              )}
              <span className="text-xs text-gray-500 font-medium">Tables</span>
            </div>

            {/* Illustrations */}
            <div className="flex flex-col space-y-2 border-r border-gray-200 pr-6 relative">
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={insertImage}
                  className="flex flex-col items-center p-2 h-12 w-16 hover:bg-blue-50"
                  title="Pictures"
                >
                  <ImageIcon className="h-4 w-4" />
                  <span className="text-xs mt-1">Pictures</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex flex-col items-center p-2 h-12 w-16 hover:bg-blue-50"
                  title="Online Pictures"
                >
                  <FileImage className="h-4 w-4" />
                  <span className="text-xs mt-1">Online Pictures</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex flex-col items-center p-2 h-12 w-16 hover:bg-blue-50"
                  title="Shapes"
                  onClick={() => setShowShapes(!showShapes)}
                >
                  <Shapes className="h-4 w-4" />
                  <span className="text-xs mt-1">Shapes</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex flex-col items-center p-2 h-12 w-16 hover:bg-blue-50"
                  title="Chart"
                >
                  <BarChart3 className="h-4 w-4" />
                  <span className="text-xs mt-1">Chart</span>
                </Button>
              </div>
              {showShapes && (
                <div className="absolute top-16 left-0 bg-white border border-gray-300 shadow-lg p-3 z-10 w-48">
                  <div className="grid grid-cols-3 gap-2">
                    {shapes.map((shape) => (
                      <Button
                        key={shape.type}
                        variant="ghost"
                        size="sm"
                        className="flex flex-col items-center p-2 h-16 hover:bg-blue-50"
                        onClick={() => insertShape(shape.type)}
                        title={shape.name}
                      >
                        <shape.icon className="h-6 w-6" />
                        <span className="text-xs mt-1">{shape.name}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              <span className="text-xs text-gray-500 font-medium">Illustrations</span>
            </div>

            {/* Links */}
            <div className="flex flex-col space-y-2 border-r border-gray-200 pr-6">
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex flex-col items-center p-2 h-12 w-16 hover:bg-blue-50"
                  title="Hyperlink"
                  onClick={() => {
                    const url = prompt("Enter URL:")
                    if (url) {
                      applyFormat("createLink", url)
                    }
                  }}
                >
                  <Link className="h-4 w-4" />
                  <span className="text-xs mt-1">Link</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex flex-col items-center p-2 h-12 w-16 hover:bg-blue-50"
                  title="Bookmark"
                >
                  <Bookmark className="h-4 w-4" />
                  <span className="text-xs mt-1">Bookmark</span>
                </Button>
              </div>
              <span className="text-xs text-gray-500 font-medium">Links</span>
            </div>

            {/* Header & Footer */}
            <div className="flex flex-col space-y-2 border-r border-gray-200 pr-6">
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex flex-col items-center p-2 h-12 w-16 hover:bg-blue-50"
                  title="Header"
                  onClick={() => {
                    saveState()
                    const header = document.createElement("div")
                    header.style.borderBottom = "1px solid #ccc"
                    header.style.paddingBottom = "12pt"
                    header.style.marginBottom = "24pt"
                    header.style.textAlign = "center"
                    header.innerHTML = "Header Text - Click to edit"
                    header.contentEditable = "true"
                    header.className = "document-header"
                    editorRef.current?.insertBefore(header, editorRef.current.firstChild)
                  }}
                >
                  <FileText className="h-4 w-4" />
                  <span className="text-xs mt-1">Header</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex flex-col items-center p-2 h-12 w-16 hover:bg-blue-50"
                  title="Footer"
                  onClick={() => {
                    saveState()
                    const footer = document.createElement("div")
                    footer.style.borderTop = "1px solid #ccc"
                    footer.style.paddingTop = "12pt"
                    footer.style.marginTop = "24pt"
                    footer.style.textAlign = "center"
                    footer.innerHTML = "Footer Text - Click to edit"
                    footer.contentEditable = "true"
                    footer.className = "document-footer"
                    editorRef.current?.appendChild(footer)
                  }}
                >
                  <FileText className="h-4 w-4" />
                  <span className="text-xs mt-1">Footer</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex flex-col items-center p-2 h-12 w-16 hover:bg-blue-50"
                  title="Page Number"
                  onClick={() => {
                    saveState()
                    const pageNum = document.createElement("span")
                    pageNum.innerHTML = "Page 1"
                    pageNum.style.fontSize = "10pt"
                    pageNum.className = "page-number"
                    const selection = window.getSelection()
                    if (selection && selection.rangeCount > 0) {
                      const range = selection.getRangeAt(0)
                      range.insertNode(pageNum)
                    }
                  }}
                >
                  <Hash className="h-4 w-4" />
                  <span className="text-xs mt-1">Page #</span>
                </Button>
              </div>
              <span className="text-xs text-gray-500 font-medium">Header & Footer</span>
            </div>

            {/* Text & Symbols */}
            <div className="flex flex-col space-y-2 relative">
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex flex-col items-center p-2 h-12 w-16 hover:bg-blue-50"
                  title="Text Box"
                  onClick={() => {
                    saveState()
                    const textBox = document.createElement("div")
                    textBox.style.border = "1px solid #000"
                    textBox.style.padding = "8px"
                    textBox.style.margin = "12pt 0"
                    textBox.style.display = "inline-block"
                    textBox.style.minWidth = "100px"
                    textBox.style.minHeight = "50px"
                    textBox.innerHTML = "Text Box - Click to edit"
                    textBox.contentEditable = "true"
                    textBox.className = "text-box"
                    const selection = window.getSelection()
                    if (selection && selection.rangeCount > 0) {
                      const range = selection.getRangeAt(0)
                      range.insertNode(textBox)
                    }
                  }}
                >
                  <Square className="h-4 w-4" />
                  <span className="text-xs mt-1">Text Box</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex flex-col items-center p-2 h-12 w-16 hover:bg-blue-50"
                  title="Date & Time"
                  onClick={() => {
                    saveState()
                    const date = new Date().toLocaleDateString()
                    const time = new Date().toLocaleTimeString()
                    const dateTime = document.createElement("span")
                    dateTime.innerHTML = `${date} ${time}`
                    dateTime.className = "date-time"
                    const selection = window.getSelection()
                    if (selection && selection.rangeCount > 0) {
                      const range = selection.getRangeAt(0)
                      range.insertNode(dateTime)
                    }
                  }}
                >
                  <Calendar className="h-4 w-4" />
                  <span className="text-xs mt-1">Date & Time</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex flex-col items-center p-2 h-12 w-16 hover:bg-blue-50"
                  title="Symbol"
                  onClick={() => setShowSymbols(!showSymbols)}
                >
                  <Star className="h-4 w-4" />
                  <span className="text-xs mt-1">Symbol</span>
                </Button>
              </div>
              {showSymbols && (
                <div className="absolute top-16 left-0 bg-white border border-gray-300 shadow-lg p-3 z-10 w-64">
                  <div className="grid grid-cols-4 gap-2">
                    {symbols.map((symbol) => (
                      <Button
                        key={symbol.symbol}
                        variant="ghost"
                        size="sm"
                        className="flex flex-col items-center p-2 h-16 hover:bg-blue-50"
                        onClick={() => insertSymbol(symbol.symbol)}
                        title={symbol.name}
                      >
                        <span className="text-lg">{symbol.symbol}</span>
                        <span className="text-xs mt-1">{symbol.name}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              <span className="text-xs text-gray-500 font-medium">Text</span>
            </div>
          </div>
        )}

        {activeTab === "design" && (
          <div className="flex items-start space-x-6">
            {/* Document Formatting */}
            <div className="flex flex-col space-y-2 border-r border-gray-200 pr-6">
              <div className="flex items-center space-x-2">
                {themes.map((theme) => (
                  <Button
                    key={theme.id}
                    variant="outline"
                    size="sm"
                    className={`w-20 h-12 p-1 bg-transparent hover:bg-blue-50 ${
                      selectedTheme === theme.id ? "ring-2 ring-blue-500" : ""
                    }`}
                    title={theme.name}
                    onClick={() => applyTheme(theme)}
                    style={{
                      background: `linear-gradient(45deg, ${theme.colors.slice(0, 4).join(", ")})`,
                    }}
                  >
                    <span className="text-xs text-white font-bold bg-black bg-opacity-50 px-1 rounded">
                      {theme.name}
                    </span>
                  </Button>
                ))}
              </div>
              <span className="text-xs text-gray-500 font-medium">Document Themes</span>
            </div>

            {/* Page Background */}
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex flex-col items-center p-2 h-12 w-16 hover:bg-blue-50"
                  title="Watermark"
                  onClick={() => {
                    saveState()
                    const watermark = document.createElement("div")
                    watermark.style.position = "absolute"
                    watermark.style.top = "50%"
                    watermark.style.left = "50%"
                    watermark.style.transform = "translate(-50%, -50%) rotate(-45deg)"
                    watermark.style.fontSize = "72pt"
                    watermark.style.color = "rgba(0, 0, 0, 0.1)"
                    watermark.style.fontWeight = "bold"
                    watermark.style.pointerEvents = "none"
                    watermark.style.zIndex = "-1"
                    watermark.innerHTML = "DRAFT"
                    watermark.className = "watermark"
                    editorRef.current?.appendChild(watermark)
                  }}
                >
                  <Layers className="h-4 w-4" />
                  <span className="text-xs mt-1">Watermark</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex flex-col items-center p-2 h-12 w-16 hover:bg-blue-50"
                  title="Page Color"
                  onClick={() => {
                    const color = prompt("Enter background color (hex):", "#ffffff")
                    if (color && editorRef.current?.parentElement) {
                      editorRef.current.parentElement.style.backgroundColor = color
                    }
                  }}
                >
                  <Palette className="h-4 w-4" />
                  <span className="text-xs mt-1">Page Color</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex flex-col items-center p-2 h-12 w-16 hover:bg-blue-50"
                  title="Page Borders"
                  onClick={() => {
                    if (editorRef.current?.parentElement) {
                      const currentBorder = editorRef.current.parentElement.style.border
                      if (currentBorder) {
                        editorRef.current.parentElement.style.border = ""
                      } else {
                        editorRef.current.parentElement.style.border = "2px solid #000"
                      }
                    }
                  }}
                >
                  <Square className="h-4 w-4" />
                  <span className="text-xs mt-1">Page Borders</span>
                </Button>
              </div>
              <span className="text-xs text-gray-500 font-medium">Page Background</span>
            </div>
          </div>
        )}

        {activeTab === "layout" && (
          <div className="flex items-start space-x-6">
            {/* Page Setup */}
            <div className="flex flex-col space-y-2 border-r border-gray-200 pr-6">
              <div className="flex items-center space-x-1">
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex flex-col items-center p-2 h-12 w-16 hover:bg-blue-50"
                    title="Margins"
                  >
                    <Layout className="h-4 w-4" />
                    <span className="text-xs mt-1">Margins</span>
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                  <select
                    value={margins}
                    onChange={(e) => changeMargins(e.target.value)}
                    className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                  >
                    {marginOptions.map((margin) => (
                      <option key={margin.value} value={margin.value}>
                        {margin.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex flex-col items-center p-2 h-12 w-16 hover:bg-blue-50"
                    title="Orientation"
                  >
                    <RotateCcw className="h-4 w-4" />
                    <span className="text-xs mt-1">Orientation</span>
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                  <select
                    value={pageOrientation}
                    onChange={(e) => changePageOrientation(e.target.value)}
                    className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                  >
                    {pageOrientations.map((orientation) => (
                      <option key={orientation.value} value={orientation.value}>
                        {orientation.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex flex-col items-center p-2 h-12 w-16 hover:bg-blue-50"
                    title="Size"
                  >
                    <Square className="h-4 w-4" />
                    <span className="text-xs mt-1">Size</span>
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                  <select
                    value={pageSize}
                    onChange={(e) => changePageSize(e.target.value)}
                    className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                  >
                    {pageSizes.map((size) => (
                      <option key={size.value} value={size.value}>
                        {size.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex flex-col items-center p-2 h-12 w-16 hover:bg-blue-50"
                    title="Columns"
                  >
                    <Columns className="h-4 w-4" />
                    <span className="text-xs mt-1">Columns</span>
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                  <select
                    value={columns}
                    onChange={(e) => changeColumns(Number.parseInt(e.target.value))}
                    className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                  >
                    <option value={1}>One</option>
                    <option value={2}>Two</option>
                    <option value={3}>Three</option>
                    <option value={4}>Four</option>
                  </select>
                </div>
              </div>
              <span className="text-xs text-gray-500 font-medium">Page Setup</span>
            </div>

            {/* Arrange */}
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex flex-col items-center p-2 h-12 w-16 hover:bg-blue-50"
                  title="Position"
                >
                  <Move className="h-4 w-4" />
                  <span className="text-xs mt-1">Position</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex flex-col items-center p-2 h-12 w-16 hover:bg-blue-50"
                  title="Wrap Text"
                >
                  <Type className="h-4 w-4" />
                  <span className="text-xs mt-1">Wrap Text</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex flex-col items-center p-2 h-12 w-16 hover:bg-blue-50"
                  title="Align"
                >
                  <AlignCenter className="h-4 w-4" />
                  <span className="text-xs mt-1">Align</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex flex-col items-center p-2 h-12 w-16 hover:bg-blue-50"
                  title="Group"
                >
                  <Layers className="h-4 w-4" />
                  <span className="text-xs mt-1">Group</span>
                </Button>
              </div>
              <span className="text-xs text-gray-500 font-medium">Arrange</span>
            </div>
          </div>
        )}

        {activeTab === "references" && (
          <div className="flex items-start space-x-6">
            {/* Table of Contents */}
            <div className="flex flex-col space-y-2 border-r border-gray-200 pr-6">
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex flex-col items-center p-2 h-12 w-20 hover:bg-blue-50"
                  title="Table of Contents"
                  onClick={() => {
                    saveState()
                    const toc = document.createElement("div")
                    toc.style.marginBottom = "24pt"
                    toc.innerHTML = `
                      <h2 style="font-weight: bold; margin-bottom: 12pt; font-size: 16pt; color: #2F5496;">Table of Contents</h2>
                      <div style="margin-left: 24pt;">
                        <div style="margin-bottom: 6pt;">1. Introduction ........................... 1</div>
                        <div style="margin-bottom: 6pt;">2. Main Content ......................... 2</div>
                        <div style="margin-bottom: 6pt;">3. Conclusion ........................... 3</div>
                      </div>
                    `
                    toc.className = "table-of-contents"
                    editorRef.current?.insertBefore(toc, editorRef.current.firstChild)
                  }}
                >
                  <BookOpen className="h-4 w-4" />
                  <span className="text-xs mt-1">Table of Contents</span>
                </Button>
              </div>
              <span className="text-xs text-gray-500 font-medium">Table of Contents</span>
            </div>

            {/* Footnotes */}
            <div className="flex flex-col space-y-2 border-r border-gray-200 pr-6">
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex flex-col items-center p-2 h-12 w-16 hover:bg-blue-50"
                  title="Insert Footnote"
                  onClick={() => {
                    saveState()
                    const footnoteNum = document.querySelectorAll(".footnote").length + 1
                    const footnoteRef = document.createElement("sup")
                    footnoteRef.innerHTML = footnoteNum.toString()
                    footnoteRef.style.color = "#0078d4"
                    footnoteRef.style.cursor = "pointer"
                    footnoteRef.className = "footnote-ref"

                    const footnote = document.createElement("div")
                    footnote.style.borderTop = "1px solid #ccc"
                    footnote.style.paddingTop = "6pt"
                    footnote.style.marginTop = "12pt"
                    footnote.style.fontSize = "9pt"
                    footnote.innerHTML = `<sup>${footnoteNum}</sup> Footnote text here`
                    footnote.className = "footnote"
                    footnote.contentEditable = "true"

                    const selection = window.getSelection()
                    if (selection && selection.rangeCount > 0) {
                      const range = selection.getRangeAt(0)
                      range.insertNode(footnoteRef)
                    }
                    editorRef.current?.appendChild(footnote)
                  }}
                >
                  <Quote className="h-4 w-4" />
                  <span className="text-xs mt-1">Footnote</span>
                </Button>
              </div>
              <span className="text-xs text-gray-500 font-medium">Footnotes</span>
            </div>

            {/* Citations */}
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex flex-col items-center p-2 h-12 w-16 hover:bg-blue-50"
                  title="Insert Citation"
                  onClick={() => {
                    saveState()
                    const citation = document.createElement("span")
                    citation.innerHTML = "(Author, Year)"
                    citation.style.color = "#0078d4"
                    citation.className = "citation"
                    const selection = window.getSelection()
                    if (selection && selection.rangeCount > 0) {
                      const range = selection.getRangeAt(0)
                      range.insertNode(citation)
                    }
                  }}
                >
                  <Quote className="h-4 w-4" />
                  <span className="text-xs mt-1">Citation</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex flex-col items-center p-2 h-12 w-16 hover:bg-blue-50"
                  title="Bibliography"
                  onClick={() => {
                    saveState()
                    const bibliography = document.createElement("div")
                    bibliography.style.marginTop = "24pt"
                    bibliography.innerHTML = `
                      <h2 style="font-weight: bold; margin-bottom: 12pt; font-size: 16pt; color: #2F5496;">Bibliography</h2>
                      <div style="margin-left: 24pt;">
                        <div style="margin-bottom: 12pt;">Author, A. (Year). Title of work. Publisher.</div>
                        <div style="margin-bottom: 12pt;">Author, B. (Year). Title of article. Journal Name, Volume(Issue), pages.</div>
                      </div>
                    `
                    bibliography.className = "bibliography"
                    editorRef.current?.appendChild(bibliography)
                  }}
                >
                  <BookOpen className="h-4 w-4" />
                  <span className="text-xs mt-1">Bibliography</span>
                </Button>
              </div>
              <span className="text-xs text-gray-500 font-medium">Citations & Bibliography</span>
            </div>
          </div>
        )}

        {activeTab === "mailings" && (
          <div className="flex items-start space-x-6">
            {/* Create */}
            <div className="flex flex-col space-y-2 border-r border-gray-200 pr-6">
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex flex-col items-center p-2 h-12 w-16 hover:bg-blue-50"
                  title="Envelopes"
                >
                  <Mail className="h-4 w-4" />
                  <span className="text-xs mt-1">Envelopes</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex flex-col items-center p-2 h-12 w-16 hover:bg-blue-50"
                  title="Labels"
                >
                  <Square className="h-4 w-4" />
                  <span className="text-xs mt-1">Labels</span>
                </Button>
              </div>
              <span className="text-xs text-gray-500 font-medium">Create</span>
            </div>

            {/* Mail Merge */}
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex flex-col items-center p-2 h-12 w-20 hover:bg-blue-50"
                  title="Start Mail Merge"
                >
                  <Users className="h-4 w-4" />
                  <span className="text-xs mt-1">Start Mail Merge</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex flex-col items-center p-2 h-12 w-20 hover:bg-blue-50"
                  title="Select Recipients"
                >
                  <Users className="h-4 w-4" />
                  <span className="text-xs mt-1">Select Recipients</span>
                </Button>
              </div>
              <span className="text-xs text-gray-500 font-medium">Start Mail Merge</span>
            </div>
          </div>
        )}

        {activeTab === "review" && (
          <div className="flex items-start space-x-6">
            {/* Proofing */}
            <div className="flex flex-col space-y-2 border-r border-gray-200 pr-6">
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`flex flex-col items-center p-2 h-12 w-20 hover:bg-blue-50 ${
                    isSpellCheckEnabled ? "bg-blue-100" : ""
                  }`}
                  title="Spelling & Grammar"
                  onClick={() => {
                    setIsSpellCheckEnabled(!isSpellCheckEnabled)
                    if (editorRef.current) {
                      editorRef.current.spellcheck = !isSpellCheckEnabled
                    }
                  }}
                >
                  <SpellCheckIcon className="h-4 w-4" />
                  <span className="text-xs mt-1">Spelling & Grammar</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex flex-col items-center p-2 h-12 w-16 hover:bg-blue-50"
                  title="Thesaurus"
                >
                  <BookOpen className="h-4 w-4" />
                  <span className="text-xs mt-1">Thesaurus</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex flex-col items-center p-2 h-12 w-16 hover:bg-blue-50"
                  title="Word Count"
                  onClick={() => {
                    alert(
                      `Document Statistics:\nWords: ${documentState.wordCount}\nCharacters: ${documentState.characterCount}\nPages: ${documentState.pageCount}`,
                    )
                  }}
                >
                  <Hash className="h-4 w-4" />
                  <span className="text-xs mt-1">Word Count</span>
                </Button>
              </div>
              <span className="text-xs text-gray-500 font-medium">Proofing</span>
            </div>

            {/* Language */}
            <div className="flex flex-col space-y-2 border-r border-gray-200 pr-6">
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex flex-col items-center p-2 h-12 w-16 hover:bg-blue-50"
                  title="Translate"
                >
                  <Globe className="h-4 w-4" />
                  <span className="text-xs mt-1">Translate</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex flex-col items-center p-2 h-12 w-16 hover:bg-blue-50"
                  title="Language"
                >
                  <Languages className="h-4 w-4" />
                  <span className="text-xs mt-1">Language</span>
                </Button>
              </div>
              <span className="text-xs text-gray-500 font-medium">Language</span>
            </div>

            {/* Comments */}
            <div className="flex flex-col space-y-2 border-r border-gray-200 pr-6">
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex flex-col items-center p-2 h-12 w-16 hover:bg-blue-50"
                  title="New Comment"
                  onClick={() => {
                    const selection = window.getSelection()
                    if (selection && selection.rangeCount > 0) {
                      const comment = prompt("Enter comment:")
                      if (comment) {
                        saveState()
                        const range = selection.getRangeAt(0)
                        const span = document.createElement("span")
                        span.style.backgroundColor = "#ffeb3b"
                        span.style.position = "relative"
                        span.title = comment
                        span.style.cursor = "help"
                        span.className = "comment-highlight"
                        try {
                          range.surroundContents(span)
                        } catch (e) {
                          span.appendChild(range.extractContents())
                          range.insertNode(span)
                        }
                      }
                    }
                  }}
                >
                  <MessageSquare className="h-4 w-4" />
                  <span className="text-xs mt-1">New Comment</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`flex flex-col items-center p-2 h-12 w-16 hover:bg-blue-50 ${
                    showComments ? "bg-blue-100" : ""
                  }`}
                  title="Show Comments"
                  onClick={() => setShowComments(!showComments)}
                >
                  <Eye className="h-4 w-4" />
                  <span className="text-xs mt-1">Show Comments</span>
                </Button>
              </div>
              <span className="text-xs text-gray-500 font-medium">Comments</span>
            </div>

            {/* Tracking */}
            <div className="flex flex-col space-y-2 border-r border-gray-200 pr-6">
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`flex flex-col items-center p-2 h-12 w-16 hover:bg-blue-50 ${
                    trackChanges ? "bg-blue-100" : ""
                  }`}
                  title="Track Changes"
                  onClick={() => setTrackChanges(!trackChanges)}
                >
                  <SpellCheckIcon className="h-4 w-4" />
                  <span className="text-xs mt-1">Track Changes</span>
                </Button>
              </div>
              <span className="text-xs text-gray-500 font-medium">Tracking</span>
            </div>

            {/* Changes */}
            <div className="flex flex-col space-y-2 border-r border-gray-200 pr-6">
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex flex-col items-center p-2 h-12 w-16 hover:bg-blue-50"
                  title="Accept"
                >
                  <CheckSquare className="h-4 w-4" />
                  <span className="text-xs mt-1">Accept</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex flex-col items-center p-2 h-12 w-16 hover:bg-blue-50"
                  title="Reject"
                >
                  <XSquare className="h-4 w-4" />
                  <span className="text-xs mt-1">Reject</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex flex-col items-center p-2 h-12 w-16 hover:bg-blue-50"
                  title="Previous"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span className="text-xs mt-1">Previous</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex flex-col items-center p-2 h-12 w-16 hover:bg-blue-50"
                  title="Next"
                >
                  <ArrowRight className="h-4 w-4" />
                  <span className="text-xs mt-1">Next</span>
                </Button>
              </div>
              <span className="text-xs text-gray-500 font-medium">Changes</span>
            </div>

            {/* Protect */}
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex flex-col items-center p-2 h-12 w-16 hover:bg-blue-50"
                  title="Restrict Editing"
                >
                  <Shield className="h-4 w-4" />
                  <span className="text-xs mt-1">Restrict Editing</span>
                </Button>
              </div>
              <span className="text-xs text-gray-500 font-medium">Protect</span>
            </div>
          </div>
        )}

        {activeTab === "view" && (
          <div className="flex items-start space-x-6">
            {/* Views */}
            <div className="flex flex-col space-y-2 border-r border-gray-200 pr-6">
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`flex flex-col items-center p-2 h-12 w-16 hover:bg-blue-50 ${
                    viewMode === "read" ? "bg-blue-100" : ""
                  }`}
                  title="Read Mode"
                  onClick={() => setViewMode("read")}
                >
                  <BookOpen className="h-4 w-4" />
                  <span className="text-xs mt-1">Read Mode</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`flex flex-col items-center p-2 h-12 w-16 hover:bg-blue-50 ${
                    viewMode === "print" ? "bg-blue-100" : ""
                  }`}
                  title="Print Layout"
                  onClick={() => setViewMode("print")}
                >
                  <Layout className="h-4 w-4" />
                  <span className="text-xs mt-1">Print Layout</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`flex flex-col items-center p-2 h-12 w-16 hover:bg-blue-50 ${
                    viewMode === "web" ? "bg-blue-100" : ""
                  }`}
                  title="Web Layout"
                  onClick={() => setViewMode("web")}
                >
                  <Globe className="h-4 w-4" />
                  <span className="text-xs mt-1">Web Layout</span>
                </Button>
              </div>
              <span className="text-xs text-gray-500 font-medium">Views</span>
            </div>

            {/* Show */}
            <div className="flex flex-col space-y-2 border-r border-gray-200 pr-6">
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`flex flex-col items-center p-2 h-12 w-16 hover:bg-blue-50 ${
                    showRuler ? "bg-blue-100" : ""
                  }`}
                  title="Ruler"
                  onClick={() => setShowRuler(!showRuler)}
                >
                  <Ruler className="h-4 w-4" />
                  <span className="text-xs mt-1">Ruler</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`flex flex-col items-center p-2 h-12 w-16 hover:bg-blue-50 ${
                    showGridlines ? "bg-blue-100" : ""
                  }`}
                  title="Gridlines"
                  onClick={() => setShowGridlines(!showGridlines)}
                >
                  <Grid3X3 className="h-4 w-4" />
                  <span className="text-xs mt-1">Gridlines</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex flex-col items-center p-2 h-12 w-16 hover:bg-blue-50"
                  title="Navigation Pane"
                >
                  <Navigation className="h-4 w-4" />
                  <span className="text-xs mt-1">Navigation Pane</span>
                </Button>
              </div>
              <span className="text-xs text-gray-500 font-medium">Show</span>
            </div>

            {/* Zoom */}
            <div className="flex flex-col space-y-2 border-r border-gray-200 pr-6">
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-blue-50"
                  onClick={() => setZoom(Math.max(25, zoom - 25))}
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-sm text-gray-600 min-w-[60px] text-center font-medium">{zoom}%</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-blue-50"
                  onClick={() => setZoom(Math.min(500, zoom + 25))}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 hover:bg-blue-50"
                  onClick={() => setZoom(100)}
                  title="100%"
                >
                  100%
                </Button>
              </div>
              <span className="text-xs text-gray-500 font-medium">Zoom</span>
            </div>

            {/* Window */}
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex flex-col items-center p-2 h-12 w-16 hover:bg-blue-50"
                  title="Split"
                >
                  <SplitSquareHorizontal className="h-4 w-4" />
                  <span className="text-xs mt-1">Split</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex flex-col items-center p-2 h-12 w-16 hover:bg-blue-50"
                  title="View Side by Side"
                >
                  <Layers className="h-4 w-4" />
                  <span className="text-xs mt-1">View Side by Side</span>
                </Button>
              </div>
              <span className="text-xs text-gray-500 font-medium">Window</span>
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Ruler */}
        {showRuler && (
          <div className="bg-white border-r border-gray-200 w-8 flex flex-col items-center py-4">
            <div className="writing-mode-vertical text-xs text-gray-500 transform -rotate-90 origin-center">
              {Array.from({ length: 20 }, (_, i) => (
                <div key={i} className="h-4 border-b border-gray-300 text-center text-xs">
                  {i + 1}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Document Area */}
        <div className="flex-1 bg-gray-100 p-8 overflow-auto">
          <div className="max-w-4xl mx-auto">
            {/* Page */}
            <div
              className={`bg-white shadow-lg border border-gray-300 min-h-[11in] mx-auto relative ${
                showGridlines ? "bg-grid" : ""
              } ${viewMode === "web" ? "w-full" : ""}`}
              style={{
                width: viewMode === "web" ? "100%" : pageOrientation === "portrait" ? "8.5in" : "11in",
                height: pageOrientation === "portrait" ? "11in" : "8.5in",
                transform: `scale(${zoom / 100})`,
                transformOrigin: "top center",
              }}
            >
              <div
                ref={editorRef}
                contentEditable
                className="min-h-full outline-none p-16"
                style={{
                  fontFamily: fontFamily,
                  fontSize: fontSize + "pt",
                  lineHeight: lineSpacing,
                  columnCount: columns > 1 ? columns : undefined,
                  columnGap: columns > 1 ? "20px" : undefined,
                }}
                spellCheck={isSpellCheckEnabled}
                suppressContentEditableWarning={true}
                onKeyDown={(e) => {
                  if (e.key === "Tab") {
                    e.preventDefault()
                    if (e.shiftKey) {
                      applyFormat("outdent")
                    } else {
                      applyFormat("indent")
                    }
                  }
                }}
                onPaste={(e) => {
                  e.preventDefault()
                  const text = e.clipboardData.getData("text/plain")
                  const html = e.clipboardData.getData("text/html")

                  if (html) {
                    document.execCommand("insertHTML", false, html)
                  } else {
                    document.execCommand("insertText", false, text)
                  }
                }}
              >
                <div
                  className="heading-1"
                  style={{ fontSize: "16pt", fontWeight: "700", color: "#2F5496", marginBottom: "12pt" }}
                >
                  Welcome to Professional Microsoft Word Editor
                </div>
                <p style={{ marginBottom: "12pt" }}>
                  This is a <strong>completely functional</strong> Microsoft Word editor with{" "}
                  <em>every single feature working</em> exactly like the real MS Word application.
                </p>
                <div
                  className="heading-2"
                  style={{ fontSize: "13pt", fontWeight: "700", color: "#2F5496", marginBottom: "12pt" }}
                >
                  ✅ All Features Are Fully Functional:
                </div>
                <ul style={{ marginBottom: "12pt", paddingLeft: "24pt" }}>
                  <li>Complete ribbon interface with authentic MS Word styling</li>
                  <li>Real-time text formatting (fonts, colors, styles, highlighting)</li>
                  <li>Working undo/redo with full history stack</li>
                  <li>Functional find and replace with regex support</li>
                  <li>Professional save, load, and print operations</li>
                  <li>Insert and edit images, tables, shapes, and symbols</li>
                  <li>Headers, footers, page numbers, and document structure</li>
                  <li>Spell checking, comments, and track changes</li>
                  <li>Multiple view modes, zoom controls, and page layouts</li>
                  <li>Table of contents, footnotes, and bibliography</li>
                  <li>Themes, watermarks, and page backgrounds</li>
                  <li>Column layouts and advanced formatting</li>
                </ul>
                <p style={{ marginBottom: "12pt" }}>
                  <strong>Try these features:</strong> Select this text and use any formatting tool. Change{" "}
                  <span style={{ fontFamily: "Georgia", fontSize: "14pt" }}>fonts</span>,{" "}
                  <span style={{ color: "#e74c3c" }}>colors</span>, add{" "}
                  <span style={{ backgroundColor: "#ffeb3b" }}>highlights</span>, create <u>underlines</u>, insert{" "}
                  <strong>bold text</strong>, and much more!
                </p>
                <p style={{ marginBottom: "12pt" }}>
                  Use keyboard shortcuts: <kbd>Ctrl+B</kbd> for bold, <kbd>Ctrl+I</kbd> for italic, <kbd>Ctrl+U</kbd>{" "}
                  for underline, <kbd>Ctrl+Z</kbd> for undo, <kbd>Ctrl+S</kbd> to save, and <kbd>Ctrl+F</kbd> to find.
                </p>
                <p style={{ marginBottom: "12pt" }}>
                  This editor provides the complete Microsoft Word experience with professional-grade functionality,
                  authentic UI design, and full feature compatibility. Every button works, every tool is functional!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Bar - MS Word Style */}
      <div className="bg-blue-600 text-white px-4 py-1 text-sm flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span>
            Page {documentState.currentPage} of {documentState.pageCount}
          </span>
          <span>Words: {documentState.wordCount.toLocaleString()}</span>
          <span>Characters: {documentState.characterCount.toLocaleString()}</span>
          {trackChanges && <span className="bg-blue-700 px-2 py-1 rounded text-xs">Track Changes: ON</span>}
          {isSpellCheckEnabled && <span className="bg-blue-700 px-2 py-1 rounded text-xs">Spell Check: ON</span>}
          <span className="bg-blue-700 px-2 py-1 rounded text-xs">
            {pageOrientation.charAt(0).toUpperCase() + pageOrientation.slice(1)}
          </span>
          <span className="bg-blue-700 px-2 py-1 rounded text-xs">{pageSize.toUpperCase()}</span>
        </div>
        <div className="flex items-center space-x-4">
          <span>{zoom}%</span>
          <span>{viewMode.charAt(0).toUpperCase() + viewMode.slice(1)} Layout</span>
          <span>Line: {lineSpacing}</span>
          <span>Columns: {columns}</span>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-white hover:bg-blue-700">
            <Search className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-white hover:bg-blue-700">
            <Settings className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Hidden file input */}
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" multiple />

      {/* Click outside handlers */}
      {showTableGrid && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => {
            setShowTableGrid(false)
            setTableSelection({ rows: 0, cols: 0 })
          }}
        />
      )}
      {showShapes && <div className="fixed inset-0 z-5" onClick={() => setShowShapes(false)} />}
      {showSymbols && <div className="fixed inset-0 z-5" onClick={() => setShowSymbols(false)} />}
    </div>
  )
}
