// Mock data for enhanced BMI calculator

// Data passed as props to the root component
export const mockRootProps = {
  height: "175" as const,
  weight: "70" as const,
  calculatedBMI: 22.9,
  category: "Normal weight" as const,
  categoryColor: "text-green-600" as const,
  examples: [
    {
      title: "Example 1: Normal BMI",
      height: 170,
      weight: 65,
      bmi: 22.5,
      category: "Normal weight"
    },
    {
      title: "Example 2: Overweight BMI", 
      height: 175,
      weight: 85,
      bmi: 27.8,
      category: "Overweight"
    },
    {
      title: "Example 3: Underweight BMI",
      height: 180,
      weight: 55,
      bmi: 17.0,
      category: "Underweight"
    }
  ],
  faqItems: [
    {
      question: "What is BMI?",
      answer: "Body Mass Index (BMI) is a measure of body fat based on height and weight that applies to adult men and women. It's calculated by dividing weight in kilograms by height in meters squared."
    },
    {
      question: "Is BMI accurate for everyone?",
      answer: "BMI is a screening tool but doesn't measure body fat directly. It may not be accurate for athletes with high muscle mass, elderly people, or children. Always consult healthcare professionals for comprehensive health assessment."
    },
    {
      question: "What should I do if my BMI is outside the normal range?",
      answer: "If your BMI indicates underweight, overweight, or obesity, consider consulting with a healthcare provider or nutritionist. They can provide personalized advice based on your overall health, lifestyle, and medical history."
    },
    {
      question: "How often should I check my BMI?",
      answer: "For general health monitoring, checking BMI monthly or quarterly is sufficient. However, if you're actively trying to lose or gain weight, weekly measurements can help track progress."
    }
  ]
};

