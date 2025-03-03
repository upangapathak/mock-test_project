import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from "react-router-dom";

const questions = [
  { id: 1, question: "What is the capital of France?", options: ["Paris", "London", "Rome", "Berlin"], type: "mcq" },
  { id: 2, question: "What is 2 + 2?", options: ["3", "4", "5", "6"], type: "mcq" },
  { id: 3, question: "What is the largest ocean?", options: ["Atlantic", "Indian", "Arctic", "Pacific"], type: "mcq" },
  { id: 4, question: "Who wrote 'Hamlet'?", options: ["Shakespeare", "Dickens", "Hemingway", "Fitzgerald"], type: "mcq" },
  { id: 5, question: "What is the square root of 16?", options: ["2", "4", "8", "16"], type: "mcq"},
  { id: 6, question: "Explain Newton’s Third Law of Motion.", type: "descriptive"  },
  { id: 7, question: "Describe the process of photosynthesis.", type: "descriptive" },
  { id: 8, question: "What are the main causes of global warming?", type: "descriptive" },
  { id: 9, question: "Define Artificial Intelligence and its applications.", type: "descriptive" },
  { id: 10, question: "Explain the importance of cybersecurity in today's world.", type: "descriptive" }
];

const HomePage = () => {
  return (
    <div className="p-5 text-center relative">
      <nav className="absolute top-4 right-4">
        <Link to="/signin" className="p-2 bg-blue-500 text-white rounded">Sign In</Link>
      </nav>
      <h1 className="text-2xl font-bold mt-10">Mock Test Portal</h1>
      <nav className="mt-6">
        <Link to="/how-it-works" className="block p-2 bg-gray-500 text-white rounded mt-2">How It Works</Link>
        <Link to="/our-services" className="block p-2 bg-gray-500 text-white rounded mt-2">Our Services</Link>
        <Link to="/pricing-insurance" className="block p-2 bg-gray-500 text-white rounded mt-2">Pricing & Insurance</Link>
        <Link to="/inside-docta" className="block p-2 bg-gray-500 text-white rounded mt-2">Inside Docta</Link>
        <Link to="/reviews" className="block p-2 bg-gray-500 text-white rounded mt-2">Reviews</Link>
      </nav>
    </div>
  );
};

const SignInPage = ({ setSignedIn }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignIn = () => {
    if (username && password) {
      setSignedIn(true);
      navigate("/exam");
    }
  };

  return (
    <div className="p-5 text-center">
      <h1 className="text-xl font-bold">Customer Login</h1>
      <h4><input type="text" placeholder="Email Address" className="p-2 border rounded m-2" value={username} onChange={(e) => setUsername(e.target.value)} /></h4>
      <h4><input type="password" placeholder="Password" className="p-2 border rounded m-2" value={password} onChange={(e) => setPassword(e.target.value)} /></h4>
      <h3><button className="p-2 mt-4 bg-blue-500 text-white" onClick={handleSignIn}>Start Exam</button></h3>
    </div>
  );
};

const MockTestPortal = () => {
  const [signedIn, setSignedIn] = useState(false);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signin" element={<SignInPage setSignedIn={setSignedIn} />} />
        <Route path="/exam" element={<ExamPage />} />
      </Routes>
    </Router>
  );
};

const ExamPage = () => {
  const [examStarted, setExamStarted] = useState(false);
  const [timer, setTimer] = useState(30 * 60);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [files, setFiles] = useState({});

  useEffect(() => {
    if (examStarted && timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [examStarted, timer]);

  const handleStartExam = () => setExamStarted(true);

  const handleAnswerChange = (answer) => {
    setAnswers({ ...answers, [questions[currentQuestion].id]: answer });
  };

  const handleFileUpload = (e) => {
    setFiles({ ...files, [questions[currentQuestion].id]: e.target.files[0] });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  // if (!examStarted) {
  //   return (
  //     <div className="p-5 text-center">
  //       <h1 className="text-xl font-bold">Welcome to the Mock Test</h1>
  //       <button className="p-2 mt-4 bg-green-500 text-white" onClick={handleStartExam}>Start Exam</button>
  //     </div>
  //   );
  // }

  if (submitted) {
    return (
      <div className="p-5 text-center">
        <h1 className="text-xl font-bold">Thank You for your time</h1>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="p-5">
      <h1 className="text-xl font-bold">Mock Test</h1>
      <p>Time Left: {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, "0")}</p>
      <div className="mb-4">
        <h2>{currentQ.question}</h2>
        {currentQ.type === "mcq" ? (
          currentQ.options.map((option) => (
            <div key={option} className="flex items-center">
              <input
                type="radio"
                name={`question-${currentQ.id}`}
                value={option}
                checked={answers[currentQ.id] === option}
                onChange={() => handleAnswerChange(option)}
                className="mr-2"
              />
              <label>{option}</label>
            </div>
          ))
        ) : (
          <>
            <textarea className="w-full p-2 border rounded" onChange={(e) => handleAnswerChange(e.target.value)} />
            <input type="file" className="mt-2" onChange={handleFileUpload} />
          </>
        )}
      </div>
      <div className="flex justify-between">
        {currentQuestion > 0 && <button className="p-2 bg-gray-500 text-white" onClick={handlePrevious}>Previous</button>}
        {currentQuestion < questions.length - 1 ? (
          <button className="p-2 bg-blue-500 text-white" onClick={handleNext}>Next</button>
        ) : (
          <button className="p-2 bg-red-500 text-white" onClick={handleSubmit}>Submit</button>
        )}
      </div>
    </div>
  );
};

export default MockTestPortal;
