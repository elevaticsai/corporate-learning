import React, { useState } from 'react';
import { Plus, Trash2, CheckCircle } from 'lucide-react';

const QuizCreation = ({ quizzes, onUpdate }) => {
  const [newQuestion, setNewQuestion] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswers: [], // Now an array to support multiple correct answers
    type: 'single' // 'single' or 'multiple'
  });

  const handleAddQuestion = () => {
    if (newQuestion.question && newQuestion.options.every(option => option) && newQuestion.correctAnswers.length > 0) {
      onUpdate([...quizzes, { ...newQuestion, id: Date.now() }]);
      setNewQuestion({
        question: '',
        options: ['', '', '', ''],
        correctAnswers: [],
        type: 'single'
      });
    }
  };

  const handleRemoveQuestion = (id) => {
    onUpdate(quizzes.filter(quiz => quiz.id !== id));
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...newQuestion.options];
    newOptions[index] = value;
    setNewQuestion({ ...newQuestion, options: newOptions });
  };

  const toggleCorrectAnswer = (index) => {
    const currentAnswers = [...newQuestion.correctAnswers];
    if (newQuestion.type === 'single') {
      // For single choice, replace the current answer
      setNewQuestion({ ...newQuestion, correctAnswers: [index] });
    } else {
      // For multiple choice, toggle the answer
      const answerIndex = currentAnswers.indexOf(index);
      if (answerIndex === -1) {
        currentAnswers.push(index);
      } else {
        currentAnswers.splice(answerIndex, 1);
      }
      setNewQuestion({ ...newQuestion, correctAnswers: currentAnswers });
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Question</h3>
        <div className="space-y-4">
          {/* Question Type Selection */}
          <div className="flex items-center space-x-4 mb-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="questionType"
                checked={newQuestion.type === 'single'}
                onChange={() => setNewQuestion({ ...newQuestion, type: 'single', correctAnswers: [] })}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">Single Choice</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="questionType"
                checked={newQuestion.type === 'multiple'}
                onChange={() => setNewQuestion({ ...newQuestion, type: 'multiple', correctAnswers: [] })}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">Multiple Choice</span>
            </label>
          </div>

          <textarea
            value={newQuestion.question}
            onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
            placeholder="Enter your question"
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          <div className="space-y-3">
            {newQuestion.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={() => toggleCorrectAnswer(index)}
                  className={`flex items-center justify-center w-6 h-6 rounded-full border-2 transition-colors ${
                    newQuestion.correctAnswers.includes(index)
                      ? 'border-green-500 bg-green-500 text-white'
                      : 'border-gray-300 hover:border-green-500'
                  }`}
                >
                  {newQuestion.correctAnswers.includes(index) && (
                    <CheckCircle className="w-4 h-4" />
                  )}
                </button>
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-4">
            <p className="text-sm text-gray-500">
              {newQuestion.type === 'single' 
                ? 'Select one correct answer'
                : 'Select all correct answers'}
            </p>
            <button
              onClick={handleAddQuestion}
              disabled={!newQuestion.question || !newQuestion.options.every(option => option) || newQuestion.correctAnswers.length === 0}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Question
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {quizzes.map((quiz) => (
          <div
            key={quiz.id}
            className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-medium text-gray-900">{quiz.question}</h4>
                <span className="text-sm text-gray-500">
                  {quiz.type === 'single' ? 'Single Choice' : 'Multiple Choice'}
                </span>
              </div>
              <button
                onClick={() => handleRemoveQuestion(quiz.id)}
                className="p-2 text-gray-400 hover:text-red-500 transition"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2">
              {quiz.options.map((option, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg flex items-center space-x-3 ${
                    quiz.correctAnswers.includes(index)
                      ? 'bg-green-50 border border-green-200'
                      : 'bg-gray-50 border border-gray-200'
                  }`}
                >
                  {quiz.correctAnswers.includes(index) && (
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  )}
                  <span>{option}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuizCreation;