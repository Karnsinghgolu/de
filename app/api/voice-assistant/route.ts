import { type NextRequest, NextResponse } from "next/server"

// Mock AI response function
async function getAIResponse(query: string) {
  // Simulate AI processing delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Mock responses for common farming queries
  const responses: Record<
    string,
    { diagnosis: string; solution: string; needsPriceComparison?: boolean; product?: string }
  > = {
    "पत्ते पीले": {
      diagnosis: "यह नाइट्रोजन की कमी हो सकती है",
      solution: "यूरिया खाद का उपयोग करें। प्रति एकड़ 50 किलो यूरिया डालें।",
      needsPriceComparison: true,
      product: "यूरिया खाद",
    },
    "कीड़े लगे": {
      diagnosis: "फसल में कीट का प्रकोप है",
      solution: "नीम का तेल या कीटनाशक का छिड़काव करें।",
      needsPriceComparison: true,
      product: "नीम का तेल",
    },
    "पानी कम": {
      diagnosis: "सिंचाई की कमी है",
      solution: "ड्रिप इरिगेशन सिस्टम लगाएं या नियमित सिंचाई करें।",
    },
  }

  // Find matching response
  for (const [key, response] of Object.entries(responses)) {
    if (query.includes(key)) {
      return response
    }
  }

  // Default response
  return {
    diagnosis: "आपकी समस्या के लिए स्थानीय कृषि विशेषज्ञ से सलाह लें",
    solution: "अधिक जानकारी के लिए नजदीकी कृषि केंद्र से संपर्क करें।",
  }
}

// Mock price comparison function
async function getPriceComparison(product: string) {
  await new Promise((resolve) => setTimeout(resolve, 500))

  const prices = {
    "यूरिया खाद": [
      { platform: "Amazon", price: 280, rating: 4.2, delivery: "2 दिन" },
      { platform: "Flipkart", price: 265, rating: 4.0, delivery: "3 दिन" },
      { platform: "BigBasket", price: 290, rating: 4.5, delivery: "1 दिन" },
    ],
    "नीम का तेल": [
      { platform: "Amazon", price: 150, rating: 4.3, delivery: "2 दिन" },
      { platform: "Flipkart", price: 145, rating: 4.1, delivery: "3 दिन" },
      { platform: "BigBasket", price: 160, rating: 4.4, delivery: "1 दिन" },
    ],
  }

  return prices[product as keyof typeof prices] || []
}

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 })
    }

    const aiResponse = await getAIResponse(query)
    let priceComparison = null

    if (aiResponse.needsPriceComparison && aiResponse.product) {
      priceComparison = await getPriceComparison(aiResponse.product)
    }

    return NextResponse.json({
      diagnosis: aiResponse.diagnosis,
      solution: aiResponse.solution,
      priceComparison,
      product: aiResponse.product,
    })
  } catch (error) {
    console.error("Voice assistant error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
