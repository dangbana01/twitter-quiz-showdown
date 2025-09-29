export interface Question {
  id: number;
  question: string;
  answers: string[];
  correctAnswer: number;
  category: string;
}

export const quizQuestions: Question[] = [
  {
    id: 1,
    question: "What is the primary purpose of Sentient Chat?",
    answers: [
      "To provide AI-powered conversational experiences",
      "To create simple chatbots",
      "To replace human customer service",
      "To analyze social media sentiment"
    ],
    correctAnswer: 0,
    category: "Sentient Fundamentals"
  },
  {
    id: 2,
    question: "Which technology foundation does Sentient leverage for its AI capabilities?",
    answers: [
      "Rule-based systems only",
      "Advanced machine learning and neural networks",
      "Simple keyword matching",
      "Hardcoded response templates"
    ],
    correctAnswer: 1,
    category: "Sentient Technology"
  },
  {
    id: 3,
    question: "What makes Sentient Chat different from traditional chatbots?",
    answers: [
      "It only works in English",
      "It requires manual programming for each response",
      "It provides contextual, intelligent conversations with learning capabilities",
      "It can only answer pre-defined questions"
    ],
    correctAnswer: 2,
    category: "Sentient Features"
  },
  {
    id: 4,
    question: "What is a key feature of Sentient's conversation handling?",
    answers: [
      "Limited to yes/no responses",
      "Context-aware dialogue management",
      "Random response generation",
      "Single-turn interactions only"
    ],
    correctAnswer: 1,
    category: "Sentient Capabilities"
  },
  {
    id: 5,
    question: "How does Sentient Chat approach natural language understanding?",
    answers: [
      "Using only keyword detection",
      "Through advanced NLP and semantic analysis",
      "By matching exact phrases only",
      "Using simple pattern recognition"
    ],
    correctAnswer: 1,
    category: "Sentient NLP"
  },
  {
    id: 6,
    question: "What capability allows Sentient to maintain conversation flow?",
    answers: [
      "Memory persistence and context retention",
      "Restarting conversations frequently",
      "Ignoring previous messages",
      "Using only current message context"
    ],
    correctAnswer: 0,
    category: "Sentient Memory"
  },
  {
    id: 7,
    question: "Which aspect of AI consciousness does Sentient Chat explore?",
    answers: [
      "Basic automation only",
      "Self-awareness and adaptive learning",
      "Simple response matching",
      "Predetermined decision trees"
    ],
    correctAnswer: 1,
    category: "Sentient Consciousness"
  },
  {
    id: 8,
    question: "What is Sentient's approach to personalization?",
    answers: [
      "One-size-fits-all responses",
      "Learning user preferences and adapting communication style",
      "Using the same personality for everyone",
      "No personalization features"
    ],
    correctAnswer: 1,
    category: "Sentient Personalization"
  },
  {
    id: 9,
    question: "How does Sentient Chat handle complex multi-turn conversations?",
    answers: [
      "By forgetting previous context",
      "Using sophisticated dialogue state tracking",
      "Limiting conversations to single exchanges",
      "Requiring users to repeat information"
    ],
    correctAnswer: 1,
    category: "Sentient Dialogue"
  },
  {
    id: 10,
    question: "What represents the ultimate goal of Sentient AI technology?",
    answers: [
      "Replacing all human interaction",
      "Creating truly intelligent, empathetic AI companions",
      "Building simple task automation",
      "Generating basic text responses"
    ],
    correctAnswer: 1,
    category: "Sentient Vision"
  }
];