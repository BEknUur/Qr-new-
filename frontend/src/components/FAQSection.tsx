import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";

const FAQSection: React.FC = () => {
  
  const faqs = [
    {
      question: "What documents are required?",
      answer: "You need a valid driver's license and a credit card for deposit...",
    },
    {
      question: "Can I cancel my booking?",
      answer: "Yes, cancellations are free up to 24 hours before pick-up...",
    },
    {
      question: "Do you offer insurance?",
      answer: "All vehicles come with basic insurance included in the price...",
    },
    {
      question: "Is there a mileage limit?",
      answer: "Some cars come with unlimited mileage, others have a daily cap...",
    },
    {
      question: "Can I pick up the car in one city and return it to another?",
      answer: "Yes, we offer one-way rentals for an additional fee...",
    },
  ];

  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const toggleFAQ = (index: number) => {
    if (expandedIndex === index) {
      setExpandedIndex(null);
    } else {
      setExpandedIndex(index);
    }
  };

  return (
    <section className="py-16 bg-gray-800">
      <h2 className="text-3xl font-bold text-center mb-8">
        Frequently Asked Questions
      </h2>
      <div className="max-w-3xl mx-auto space-y-4 px-6">
        {faqs.map((faq, i) => {
          const isOpen = expandedIndex === i;
          return (
            <div
              key={i}
              className="bg-gray-900 p-4 rounded-lg cursor-pointer"
              onClick={() => toggleFAQ(i)}
            >
             
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg text-white">
                  {faq.question}
                </h3>
                {isOpen ? (
                  <Minus className="text-green-400" />
                ) : (
                  <Plus className="text-green-400" />
                )}
              </div>

              
              {isOpen && (
                <p className="text-gray-300 mt-2 transition-all duration-300">
                  {faq.answer}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FAQSection;
