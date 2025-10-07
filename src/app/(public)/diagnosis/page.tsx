"use client";

import { useState } from "react";
import { HealthMetricsForm } from "@/app/(public)/diagnosis/components/DiagnosisForm";
import { AIResultsDisplay } from "@/app/(public)/diagnosis/components/PredictionDisplay";
import { AIChatInterface } from "@/app/(public)/diagnosis/components/ChatBox";
import { DiagnosisHeader } from "./components/DiagnosisHeader";
interface HealthMetrics {
  age: string;
  gender: string;
  chestPainType: string;
  restingBP: string;
  cholesterol: string;
  fastingBS: string;
  restingECG: string;
  maxHR: string;
  exerciseAngina: string;
  oldpeak: string;
  stSlope: string;
  ca: string;
  thal: string;
}

interface DiagnosisResult {
  riskLevel: "low" | "medium" | "high";
  riskPercentage: number;
  recommendations: string[];
  keyFactors: string[];
  explanation: string;
}

export default function DiagnosisPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DiagnosisResult | null>(null);

  const handleFormSubmit = async (metrics: HealthMetrics) => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/diagnosis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(metrics),
      });

      if (!response.ok) {
        throw new Error("Failed to get diagnosis");
      }

      const diagnosisResult = await response.json();
      setResult(diagnosisResult);
    } catch (error) {
      console.error("Error getting diagnosis:", error);
      // Handle error state in UI, e.g., show a notification
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50/30 to-blue-50/20">
      <DiagnosisHeader />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-[calc(100vh-200px)]">
          {/* Left Column - Form and Results */}
          <div className="lg:col-span-2 space-y-8">
            <HealthMetricsForm
              onSubmit={handleFormSubmit}
              isLoading={isLoading}
            />

            {result && <AIResultsDisplay result={result} />}
          </div>

          {/* Right Column - Chat Interface */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <AIChatInterface />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
