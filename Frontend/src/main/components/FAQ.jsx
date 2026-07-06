import React, { useState } from 'react';
import { FiPlus, FiMinus } from 'react-icons/fi';

const faqs = [
  {
    question: 'What is your delivery time?',
    answer: 'We deliver within 2 hours across Indore. Express delivery available in 45 minutes.'
  },
  {
    question: 'Do you offer cash on delivery?',
    answer: 'Yes! We accept cash on delivery, UPI, cards, and net banking.'
  },
  {
    question: 'What is your return policy?',
    answer: '100% money back guarantee if products are not fresh. Contact us within 2 hours of delivery.'
  },
  {
    question: 'Are your products organic?',
    answer: 'We source from local farmers. 70% of our vegetables are organic certified.'
  }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="py-20 bg-linear-to-br from-orange-50/50 via-white to-emerald-50/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-500 font-medium max-w-2xl mx-auto">
            Find answers to common questions about our service
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="group bg-white/70 backdrop-blur-sm rounded-2xl shadow-md hover:shadow-lg hover:border-orange-200 transition-all duration-500 border border-gray-100 overflow-hidden"
            >
              {/* Question */}
              <button 
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-orange-50/50 transition-all duration-300"
              >
                <h3 className="text-base md:text-lg font-semibold text-gray-900 pr-4 flex-1">
                  {faq.question}
                </h3>
                {openIndex === index ? 
                  <FiMinus className="w-6 h-6 text-orange-500 group-hover:text-orange-600 transition-colors" /> : 
                  <FiPlus className="w-6 h-6 text-orange-500 group-hover:text-orange-600 transition-colors" />
                }
              </button>

              {/* Answer */}
              <div 
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  openIndex === index ? 'max-h-64 opacity-100 pt-4 px-6 pb-6 bg-orange-50/30 border-t border-orange-100' : 'max-h-0 opacity-0'
                }`}
              >
                <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
