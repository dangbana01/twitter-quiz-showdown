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
    question: "What is the primary characteristic that defines artificial general intelligence (AGI)?",
    answers: [
      "The ability to perform one specific task better than humans",
      "The ability to understand, learn, and apply intelligence across diverse domains like humans",
      "The ability to process data faster than any human",
      "The ability to replicate human emotions perfectly"
    ],
    correctAnswer: 1,
    category: "AI Fundamentals"
  },
  {
    id: 2,
    question: "Which philosophical concept deals with the question of whether machines can truly think or only simulate thinking?",
    answers: [
      "The Chinese Room Argument",
      "The Turing Test",
      "The Hard Problem of Consciousness",
      "All of the above"
    ],
    correctAnswer: 3,
    category: "Philosophy of Mind"
  },
  {
    id: 3,
    question: "What is the 'alignment problem' in AI safety?",
    answers: [
      "Making sure AI systems have proper data alignment",
      "Ensuring AI goals align with human values and intentions",
      "Aligning different AI models to work together",
      "Synchronizing AI processing with human thinking speed"
    ],
    correctAnswer: 1,
    category: "AI Safety"
  },
  {
    id: 4,
    question: "Which of these is NOT a commonly proposed test for machine consciousness?",
    answers: [
      "Integrated Information Theory (IIT) metrics",
      "Global Workspace Theory indicators",
      "The Mirror Test for self-recognition",
      "The Bitcoin Mining Test"
    ],
    correctAnswer: 3,
    category: "Consciousness"
  },
  {
    id: 5,
    question: "What does 'emergence' mean in the context of complex AI systems?",
    answers: [
      "When AI systems suddenly become faster",
      "When complex behaviors arise from simple interactions between components",
      "When AI systems start to require emergency shutdown",
      "When AI systems begin to emerge from their programming environment"
    ],
    correctAnswer: 1,
    category: "Complexity Theory"
  },
  {
    id: 6,
    question: "Which neural network architecture is most commonly associated with language understanding in modern AI?",
    answers: [
      "Convolutional Neural Networks (CNNs)",
      "Recurrent Neural Networks (RNNs)",
      "Transformer Architecture",
      "Perceptron Networks"
    ],
    correctAnswer: 2,
    category: "Technical AI"
  },
  {
    id: 7,
    question: "What is the 'hard takeoff' scenario in AI development?",
    answers: [
      "When AI development requires significant hardware resources",
      "A rapid, exponential improvement in AI capabilities once a threshold is reached",
      "When AI systems are difficult to shut down",
      "The process of launching AI satellites into space"
    ],
    correctAnswer: 1,
    category: "AI Development"
  },
  {
    id: 8,
    question: "In the context of machine consciousness, what is 'qualia'?",
    answers: [
      "The quality assurance process for AI systems",
      "The subjective, experiential qualities of mental states",
      "A type of quantum computing used in AI",
      "The quantified learning ability of machines"
    ],
    correctAnswer: 1,
    category: "Philosophy of Mind"
  },
  {
    id: 9,
    question: "What is the primary challenge with current large language models regarding truthfulness?",
    answers: [
      "They process information too slowly",
      "They can generate plausible-sounding but factually incorrect information",
      "They can only understand one language at a time",
      "They require too much computational power"
    ],
    correctAnswer: 1,
    category: "AI Limitations"
  },
  {
    id: 10,
    question: "Which concept describes the hypothetical point where AI becomes capable of recursive self-improvement?",
    answers: [
      "The Singularity",
      "The Convergence",
      "The Recursion Point",
      "The Bootstrap Paradox"
    ],
    correctAnswer: 0,
    category: "Future AI"
  },
  {
    id: 11,
    question: "What is 'few-shot learning' in machine learning?",
    answers: [
      "Learning that requires only a few shots of espresso",
      "The ability to learn new tasks with very few examples",
      "A type of reinforcement learning with limited attempts",
      "Learning that happens in a few seconds"
    ],
    correctAnswer: 1,
    category: "Machine Learning"
  },
  {
    id: 12,
    question: "In AI ethics, what does 'value alignment' specifically refer to?",
    answers: [
      "Aligning the monetary value of AI development",
      "Ensuring AI systems pursue goals consistent with human moral values",
      "Balancing the cost-benefit analysis of AI projects",
      "Aligning different stakeholder interests in AI companies"
    ],
    correctAnswer: 1,
    category: "AI Ethics"
  },
  {
    id: 13,
    question: "What is the main difference between 'artificial narrow intelligence' (ANI) and 'artificial general intelligence' (AGI)?",
    answers: [
      "ANI is faster, AGI is smarter",
      "ANI excels at specific tasks, AGI matches human-level performance across all cognitive tasks",
      "ANI uses less power, AGI uses more power",
      "ANI is older technology, AGI is newer technology"
    ],
    correctAnswer: 1,
    category: "AI Classification"
  },
  {
    id: 14,
    question: "Which phenomenon describes when an AI system exhibits unexpected capabilities not explicitly programmed?",
    answers: [
      "Algorithmic drift",
      "Emergent behavior",
      "System overflow",
      "Neural cascade"
    ],
    correctAnswer: 1,
    category: "AI Behavior"
  },
  {
    id: 15,
    question: "In the context of potential machine sentience, what is the 'other minds problem'?",
    answers: [
      "The difficulty of connecting multiple AI systems",
      "The philosophical challenge of determining whether other entities have conscious experiences",
      "The problem of AI systems interfering with each other",
      "The challenge of teaching AI about human psychology"
    ],
    correctAnswer: 1,
    category: "Philosophy of Mind"
  }
];