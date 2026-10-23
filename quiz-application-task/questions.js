/**
 * Comprehensive Question Bank for Quiz Application
 * Topics: Web Development, Computer Science, JavaScript, Science & General Trivia
 */

export const QUESTION_BANK = [
  // --- Web Development & JavaScript ---
  {
    id: 1,
    category: "Web Development",
    difficulty: "Easy",
    question: "What does HTML stand for?",
    options: [
      "Hyper Text Markup Language",
      "High Tech Multi Language",
      "Hyperlink and Text Management Language",
      "Home Tool Markup Language"
    ],
    correctAnswer: 0,
    explanation: "HTML stands for Hyper Text Markup Language. It is the standard markup language used to structure web pages."
  },
  {
    id: 2,
    category: "Web Development",
    difficulty: "Medium",
    question: "Which CSS property is used to create a flexbox layout?",
    options: [
      "display: flex;",
      "layout: flexbox;",
      "flex: active;",
      "align: flex;"
    ],
    correctAnswer: 0,
    explanation: "'display: flex;' transforms an element into a flex container and establishes a new flex formatting context for its children."
  },
  {
    id: 3,
    category: "Web Development",
    difficulty: "Medium",
    question: "In JavaScript, what is the output of 'typeof null'?",
    options: [
      "'object'",
      "'null'",
      "'undefined'",
      "'boolean'"
    ],
    correctAnswer: 0,
    explanation: "In JavaScript, 'typeof null' historically evaluates to 'object'. This is a well-known legacy quirk from the initial implementation."
  },
  {
    id: 4,
    category: "Web Development",
    difficulty: "Easy",
    question: "Which HTML tag is used to link an external JavaScript file?",
    options: [
      "<script src='app.js'></script>",
      "<javascript href='app.js'>",
      "<link rel='script' href='app.js'>",
      "<code src='app.js'></code>"
    ],
    correctAnswer: 0,
    explanation: "The <script> tag with the 'src' attribute is used to embed or reference executable JavaScript code."
  },
  {
    id: 5,
    category: "Web Development",
    difficulty: "Hard",
    question: "What is the purpose of the JavaScript 'Promise.allSettled()' method?",
    options: [
      "Resolves when all promises have completed, whether fulfilled or rejected",
      "Rejects immediately if any input promise rejects",
      "Resolves as soon as the first promise resolves successfully",
      "Cancels pending promises if any promise errors out"
    ],
    correctAnswer: 0,
    explanation: "Promise.allSettled() returns a promise that resolves after all given promises have either fulfilled or rejected, with an array of outcome objects."
  },
  {
    id: 6,
    category: "Web Development",
    difficulty: "Medium",
    question: "Which HTTP status code signifies '204 No Content'?",
    options: [
      "204",
      "200",
      "404",
      "503"
    ],
    correctAnswer: 0,
    explanation: "HTTP 204 No Content indicates that the request was processed successfully, but the server is not returning any payload body."
  },
  {
    id: 7,
    category: "Web Development",
    difficulty: "Medium",
    question: "Which of the following is NOT a JavaScript primitive data type?",
    options: [
      "Array",
      "Symbol",
      "BigInt",
      "Undefined"
    ],
    correctAnswer: 0,
    explanation: "Arrays in JavaScript are special objects, not primitive data types. Primitives include string, number, bigint, boolean, undefined, symbol, and null."
  },
  {
    id: 8,
    category: "Web Development",
    difficulty: "Easy",
    question: "Which CSS selector selects all elements with the class name 'highlight'?",
    options: [
      ".highlight",
      "#highlight",
      "*highlight",
      "highlight"
    ],
    correctAnswer: 0,
    explanation: "In CSS, a class selector is prefixed with a period (.), so '.highlight' selects all elements possessing the 'highlight' class."
  },

  // --- Computer Science & Technology ---
  {
    id: 9,
    category: "Computer Science",
    difficulty: "Medium",
    question: "What is the worst-case time complexity of QuickSort?",
    options: [
      "O(n²)",
      "O(n log n)",
      "O(log n)",
      "O(n)"
    ],
    correctAnswer: 0,
    explanation: "While QuickSort has an average time complexity of O(n log n), its worst-case occurs when the pivot chosen is consistently the smallest or largest element, resulting in O(n²)."
  },
  {
    id: 10,
    category: "Computer Science",
    difficulty: "Easy",
    question: "What does 'DNS' stand for in computer networking?",
    options: [
      "Domain Name System",
      "Digital Network Service",
      "Data Navigation Standard",
      "Direct Network Socket"
    ],
    correctAnswer: 0,
    explanation: "DNS stands for Domain Name System. It acts like the phonebook of the internet, translating domain names into IP addresses."
  },
  {
    id: 11,
    category: "Computer Science",
    difficulty: "Medium",
    question: "Which data structure operates on a Last In, First Out (LIFO) principle?",
    options: [
      "Stack",
      "Queue",
      "Binary Search Tree",
      "Linked List"
    ],
    correctAnswer: 0,
    explanation: "A Stack is a LIFO (Last In, First Out) data structure, where the most recently added item is the first one removed."
  },
  {
    id: 12,
    category: "Computer Science",
    difficulty: "Hard",
    question: "In relational databases, what does the 'ACID' acronym stand for?",
    options: [
      "Atomicity, Consistency, Isolation, Durability",
      "Accuracy, Concurrency, Indexing, Distribution",
      "Authentication, Compression, Integrity, Delivery",
      "Availability, Connectivity, Identity, Decoupling"
    ],
    correctAnswer: 0,
    explanation: "ACID represents Atomicity, Consistency, Isolation, and Durability—four core properties that guarantee database transactions are processed reliably."
  },
  {
    id: 13,
    category: "Computer Science",
    difficulty: "Easy",
    question: "How many bits are in a single byte?",
    options: [
      "8 bits",
      "4 bits",
      "16 bits",
      "32 bits"
    ],
    correctAnswer: 0,
    explanation: "There are 8 bits in one byte, capable of representing 256 (2^8) distinct binary values."
  },
  {
    id: 14,
    category: "Computer Science",
    difficulty: "Hard",
    question: "Which encryption algorithm is based on asymmetric key cryptography?",
    options: [
      "RSA",
      "AES-256",
      "DES",
      "Blowfish"
    ],
    correctAnswer: 0,
    explanation: "RSA is an asymmetric cryptographic algorithm using public and private key pairs, unlike symmetric ciphers like AES, DES, or Blowfish."
  },

  // --- Science & Nature ---
  {
    id: 15,
    category: "Science",
    difficulty: "Easy",
    question: "What is the chemical symbol for Gold?",
    options: [
      "Au",
      "Ag",
      "Fe",
      "Gd"
    ],
    correctAnswer: 0,
    explanation: "The chemical symbol for Gold is 'Au', derived from the Latin word 'aurum', meaning shining dawn."
  },
  {
    id: 16,
    category: "Science",
    difficulty: "Medium",
    question: "What is the powerhouse organelle of the eukaryotic cell?",
    options: [
      "Mitochondria",
      "Ribosome",
      "Endoplasmic Reticulum",
      "Golgi Apparatus"
    ],
    correctAnswer: 0,
    explanation: "Mitochondria generate most of the chemical energy needed to power the cell's biochemical reactions, stored as ATP."
  },
  {
    id: 17,
    category: "Science",
    difficulty: "Medium",
    question: "What is the approximate speed of light in a vacuum?",
    options: [
      "300,000 kilometers per second",
      "150,000 kilometers per second",
      "3,000,000 kilometers per second",
      "30,000 kilometers per second"
    ],
    correctAnswer: 0,
    explanation: "The speed of light in a vacuum is approximately 299,792 kilometers per second (commonly rounded to 300,000 km/s)."
  },
  {
    id: 18,
    category: "Science",
    difficulty: "Hard",
    question: "Which fundamental force is the weakest of the four universal forces?",
    options: [
      "Gravity",
      "Weak Nuclear Force",
      "Electromagnetic Force",
      "Strong Nuclear Force"
    ],
    correctAnswer: 0,
    explanation: "Despite its dominance on astronomical scales, Gravity is by far the weakest of the four fundamental physical forces."
  },
  {
    id: 19,
    category: "Science",
    difficulty: "Easy",
    question: "Which planet in our solar system is known as the Red Planet?",
    options: [
      "Mars",
      "Jupiter",
      "Venus",
      "Mercury"
    ],
    correctAnswer: 0,
    explanation: "Mars is called the Red Planet because iron oxide (rust) on its surface gives it a reddish appearance."
  },

  // --- General Knowledge & Pop Culture Trivia ---
  {
    id: 20,
    category: "General Trivia",
    difficulty: "Easy",
    question: "In what year was the World Wide Web introduced to the public by Tim Berners-Lee?",
    options: [
      "1991",
      "1985",
      "1995",
      "2000"
    ],
    correctAnswer: 0,
    explanation: "Sir Tim Berners-Lee opened the World Wide Web project to the public on August 6, 1991."
  },
  {
    id: 21,
    category: "General Trivia",
    difficulty: "Medium",
    question: "Who is widely considered the world's first computer programmer?",
    options: [
      "Ada Lovelace",
      "Alan Turing",
      "Grace Hopper",
      "Charles Babbage"
    ],
    correctAnswer: 0,
    explanation: "Ada Lovelace published the first algorithm intended to be executed by Charles Babbage's Analytical Engine in 1843."
  },
  {
    id: 22,
    category: "General Trivia",
    difficulty: "Easy",
    question: "What is the capital city of Australia?",
    options: [
      "Canberra",
      "Sydney",
      "Melbourne",
      "Brisbane"
    ],
    correctAnswer: 0,
    explanation: "Canberra is the federal capital of Australia, chosen in 1908 as a compromise between Sydney and Melbourne."
  },
  {
    id: 23,
    category: "General Trivia",
    difficulty: "Hard",
    question: "What was the codename of the original Apple Macintosh project before launch?",
    options: [
      "Bicycle",
      "Lisa",
      "Annie",
      "Project Titan"
    ],
    correctAnswer: 0,
    explanation: "Steve Jobs famously called computers a 'bicycle for our minds', and Jef Raskin led the project named Macintosh after the McIntosh apple."
  },
  {
    id: 24,
    category: "Web Development",
    difficulty: "Hard",
    question: "Which of the following is true regarding JavaScript event loop microtasks vs macrotasks?",
    options: [
      "Microtasks (Promises) execute before the next macrotask (setTimeout)",
      "Macrotasks execute before all pending microtasks",
      "Microtasks and macrotasks execute concurrently in worker threads",
      "Microtasks are reserved exclusively for DOM event listeners"
    ],
    correctAnswer: 0,
    explanation: "In the JavaScript event loop, after every macrotask completes, the entire microtask queue (e.g., Promise callbacks, queueMicrotask) is drained before the next macrotask starts."
  }
];
