import { ChevronLeft, ChevronRight, Linkedin } from "lucide-react";
import { recommendations } from "../data";
import { useState } from "react";

const recommendationCard = () => {
  const [currentRecommendation, setCurrentRecommendation] = useState(0)

  const nextRecommendation = () => {
    setCurrentRecommendation((prev: number) => (prev + 1) % recommendations.length)
  }

  const prevRecommendation = () => {
    setCurrentRecommendation((prev: number) => (prev - 1 + recommendations.length) % recommendations.length)
  }

  return (
    <div className="relative max-w-4xl mx-auto">
      <div className="overflow-hidden">
        <div className="flex transition-transform duration-300 ease-in-out" style={{ transform: `translateX(-${currentRecommendation * 50}%)` }}>
          {recommendations.map((rec, index) => (
            <div key={index} className="w-1/2 flex-shrink-0 px-4">
              <div className="bg-gray-700 bg-opacity-50 rounded-lg p-6 shadow-lg hover:shadow-orange-500/20 transition-all duration-300 h-64 flex flex-col justify-between">
                <p className="mb-4 italic text-sm">&ldquo;{rec.text}&rdquo;</p>
                <div>
                  <p className="font-semibold text-lg">{rec.name}</p>
                  <p className="text-sm text-gray-400 mb-2">{rec.position}</p>
                  <a href={rec.linkedin} target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:text-orange-300 transition-colors inline-flex items-center">
        
                    <Linkedin className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <button onClick={prevRecommendation} className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 p-2 rounded-full text-white hover:bg-opacity-75 transition-colors">
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button onClick={nextRecommendation} className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 p-2 rounded-full text-white hover:bg-opacity-75 transition-colors">
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  )
}

export default recommendationCard;
