"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Mic,
  TrendingUp,
  Cloud,
  Heart,
  Home,
  ShoppingCart,
  CloudSun,
  Activity,
  Search,
  MicIcon,
  Star,
  Truck,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Mock API data
const mockMandiData = [
  { name: "टमाटर", price: 25, unit: "kg", change: "+5%", trend: "up" },
  { name: "प्याज", price: 18, unit: "kg", change: "-2%", trend: "down" },
  { name: "आलू", price: 12, unit: "kg", change: "+3%", trend: "up" },
  { name: "गेहूं", price: 2100, unit: "quintal", change: "+1%", trend: "up" },
  { name: "चावल", price: 3200, unit: "quintal", change: "0%", trend: "stable" },
  { name: "मक्का", price: 1800, unit: "quintal", change: "+4%", trend: "up" },
  { name: "सोयाबीन", price: 4500, unit: "quintal", change: "-1%", trend: "down" },
  { name: "मिर्च", price: 80, unit: "kg", change: "+8%", trend: "up" },
]

const mockWeatherData = [
  { day: "आज", temp: "28°C", condition: "धूप", icon: "☀️" },
  { day: "कल", temp: "26°C", condition: "बादल", icon: "☁️" },
  { day: "परसों", temp: "24°C", condition: "बारिश", icon: "🌧️" },
]

type Page = "home" | "mandi" | "weather" | "health"

export default function KrishiVaaniApp() {
  const [currentPage, setCurrentPage] = useState<Page>("home")
  const [isListening, setIsListening] = useState(false)

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage onVoiceClick={() => setIsListening(true)} />
      case "mandi":
        return <MandiPage />
      case "weather":
        return <WeatherPage />
      case "health":
        return <HealthPage />
      default:
        return <HomePage onVoiceClick={() => setIsListening(true)} />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50">
      {/* Header */}
      <header className="bg-green-600 text-white p-4 shadow-lg">
        <h1 className="text-2xl font-bold text-center">कृषिवाणी (KrishiVaani)</h1>
        <p className="text-center text-green-100 text-sm mt-1">आपका कृषि सहायक</p>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 pb-20">{renderPage()}</main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="flex justify-around py-2">
          {[
            { id: "home", icon: Home, label: "होम" },
            { id: "mandi", icon: ShoppingCart, label: "मंडी" },
            { id: "weather", icon: CloudSun, label: "मौसम" },
            { id: "health", icon: Activity, label: "स्वास्थ्य" },
          ].map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setCurrentPage(id as Page)}
              className={cn(
                "flex flex-col items-center py-2 px-3 rounded-lg transition-colors",
                currentPage === id ? "text-green-600 bg-green-50" : "text-gray-600 hover:text-green-600",
              )}
            >
              <Icon className="h-6 w-6" />
              <span className="text-xs mt-1">{label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Voice Modal */}
      {isListening && <VoiceModal onClose={() => setIsListening(false)} />}
    </div>
  )
}

function HomePage({ onVoiceClick }: { onVoiceClick: () => void }) {
  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <Card className="bg-gradient-to-r from-green-100 to-yellow-100 border-green-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-green-800 font-bold">नमस्ते, राम जी!</CardTitle>
          <CardDescription className="text-green-700 font-medium">आज आपकी खेती में कैसे मदद कर सकते हैं?</CardDescription>
        </CardHeader>
      </Card>

      {/* Voice Assistant Button */}
      <div className="flex justify-center">
        <Button
          onClick={onVoiceClick}
          size="lg"
          className="h-24 w-24 rounded-full bg-green-600 hover:bg-green-700 shadow-lg"
        >
          <Mic className="h-8 w-8" />
        </Button>
      </div>
      <p className="text-center text-gray-700 text-sm font-medium">माइक दबाएं और अपनी समस्या बताएं</p>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="text-center">
            <TrendingUp className="h-8 w-8 text-green-600 mx-auto" />
            <CardTitle className="text-lg">मंडी भाव</CardTitle>
            <CardDescription>आज के ताजे भाव देखें</CardDescription>
          </CardHeader>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="text-center">
            <Cloud className="h-8 w-8 text-blue-600 mx-auto" />
            <CardTitle className="text-lg">मौसम</CardTitle>
            <CardDescription>3 दिन का मौसम पूर्वानुमान</CardDescription>
          </CardHeader>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="text-center">
            <Heart className="h-8 w-8 text-red-600 mx-auto" />
            <CardTitle className="text-lg">स्वास्थ्य</CardTitle>
            <CardDescription>स्वास्थ्य टिप्स और योजनाएं</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}

function MandiPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredData, setFilteredData] = useState(mockMandiData)

  useEffect(() => {
    const filtered = mockMandiData.filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    setFilteredData(filtered)
  }, [searchTerm])

  const handleVoiceSearch = () => {
    // Voice search functionality will be implemented
    alert("Voice search feature coming soon!")
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-green-700">मंडी भाव</h2>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="फसल खोजें..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-12"
        />
        <Button
          size="sm"
          variant="ghost"
          onClick={handleVoiceSearch}
          className="absolute right-1 top-1/2 transform -translate-y-1/2"
        >
          <MicIcon className="h-4 w-4" />
        </Button>
      </div>

      {/* Market Prices */}
      <div className="grid gap-3">
        {filteredData.map((item, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  <p className="text-sm text-gray-600">प्रति {item.unit}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600">₹{item.price}</p>
                  <p
                    className={cn(
                      "text-sm font-medium",
                      item.trend === "up" ? "text-green-600" : item.trend === "down" ? "text-red-600" : "text-gray-600",
                    )}
                  >
                    {item.change}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredData.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">कोई फसल नहीं मिली</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function WeatherPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-blue-700">मौसम पूर्वानुमान</h2>

      <div className="grid gap-4">
        {mockWeatherData.map((day, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-3xl">{day.icon}</span>
                  <div>
                    <h3 className="font-semibold text-lg">{day.day}</h3>
                    <p className="text-gray-600">{day.condition}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">{day.temp}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function HealthPage() {
  const healthTips = [
    "दिन में 8 गिलास पानी पिएं",
    "रोज 30 मिनट व्यायाम करें",
    "संतुलित आहार लें",
    "पर्याप्त नींद लें (7-8 घंटे)",
    "तनाव से बचें",
  ]

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-red-700">स्वास्थ्य जानकारी</h2>

      {/* Daily Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">आज की स्वास्थ्य टिप्स</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {healthTips.map((tip, index) => (
              <li key={index} className="flex items-center space-x-2">
                <span className="text-green-600">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Government Scheme */}
      <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <CardHeader>
          <CardTitle className="text-lg">आयुष्मान भारत योजना</CardTitle>
          <CardDescription className="text-blue-100">मुफ्त स्वास्थ्य सेवा के लिए आवेदन करें</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-blue-100 mb-3">प्रति परिवार ₹5 लाख तक का मुफ्त इलाज</p>
          <Button variant="secondary" size="sm">
            अधिक जानकारी
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

function VoiceModal({ onClose }: { onClose: () => void }) {
  const [status, setStatus] = useState<"listening" | "thinking" | "speaking" | "error">("listening")
  const [transcript, setTranscript] = useState("")
  const [response, setResponse] = useState<{
    diagnosis: string
    solution: string
    priceComparison?: Array<{
      platform: string
      price: number
      rating: number
      delivery: string
    }>
    product?: string
  } | null>(null)
  const [isListening, setIsListening] = useState(false)

  const startListening = async () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("आपका ब्राउज़र वॉइस रिकॉग्निशन को सपोर्ट नहीं करता")
      return
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    const recognition = new SpeechRecognition()

    recognition.lang = "hi-IN"
    recognition.continuous = false
    recognition.interimResults = false

    recognition.onstart = () => {
      setIsListening(true)
      setStatus("listening")
    }

    recognition.onresult = async (event: any) => {
      const transcript = event.results[0][0].transcript
      setTranscript(transcript)
      setStatus("thinking")

      try {
        const response = await fetch("/api/voice-assistant", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: transcript }),
        })

        const data = await response.json()
        setResponse(data)
        setStatus("speaking")

        // Text-to-speech
        if ("speechSynthesis" in window) {
          const utterance = new SpeechSynthesisUtterance(`${data.diagnosis}. ${data.solution}`)
          utterance.lang = "hi-IN"
          speechSynthesis.speak(utterance)
        }
      } catch (error) {
        console.error("Error:", error)
        setStatus("error")
      }
    }

    recognition.onerror = () => {
      setStatus("error")
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.start()
  }

  useEffect(() => {
    startListening()
  }, [])

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md max-h-[80vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="text-center">आवाज सहायक</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className={cn("transition-all duration-300", isListening && "animate-pulse")}>
              <Mic className="h-16 w-16 text-green-600 mx-auto" />
            </div>

            {status === "listening" && <p className="text-gray-600 mt-2">सुन रहा हूं... बोलिए</p>}

            {status === "thinking" && (
              <>
                <p className="text-blue-600 mt-2 p-2 bg-blue-50 rounded">आपने कहा: "{transcript}"</p>
                <p className="text-gray-600 mt-2">सोच रहा हूं...</p>
              </>
            )}

            {status === "speaking" && response && (
              <div className="space-y-4 mt-4">
                <p className="text-blue-600 p-2 bg-blue-50 rounded text-sm">आपने कहा: "{transcript}"</p>

                <div className="bg-green-50 p-4 rounded-lg text-left">
                  <h4 className="font-semibold text-green-800 mb-2">निदान:</h4>
                  <p className="text-green-700 mb-3">{response.diagnosis}</p>

                  <h4 className="font-semibold text-green-800 mb-2">समाधान:</h4>
                  <p className="text-green-700">{response.solution}</p>
                </div>

                {response.priceComparison && response.priceComparison.length > 0 && (
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-yellow-800 mb-3">{response.product} - मूल्य तुलना:</h4>
                    <div className="space-y-2">
                      {response.priceComparison
                        .sort((a, b) => a.price - b.price)
                        .map((item, index) => (
                          <div
                            key={index}
                            className={cn(
                              "flex justify-between items-center p-2 rounded border",
                              index === 0 ? "bg-green-100 border-green-300" : "bg-white",
                            )}
                          >
                            <div>
                              <p className="font-medium">{item.platform}</p>
                              <div className="flex items-center space-x-2 text-xs text-gray-600">
                                <div className="flex items-center">
                                  <Star className="h-3 w-3 text-yellow-500 mr-1" />
                                  {item.rating}
                                </div>
                                <div className="flex items-center">
                                  <Truck className="h-3 w-3 mr-1" />
                                  {item.delivery}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-lg">₹{item.price}</p>
                              {index === 0 && <p className="text-xs text-green-600 font-medium">सबसे सस्ता</p>}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {status === "error" && (
              <div className="bg-red-50 p-4 rounded-lg mt-4">
                <p className="text-red-600">कुछ गलत हुआ। कृपया दोबारा कोशिश करें।</p>
              </div>
            )}
          </div>

          <div className="flex space-x-2">
            {status !== "listening" && (
              <Button onClick={startListening} className="flex-1 bg-transparent" variant="outline">
                दोबारा बोलें
              </Button>
            )}
            <Button onClick={onClose} variant="outline" className="flex-1 bg-transparent">
              बंद करें
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
