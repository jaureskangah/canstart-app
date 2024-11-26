import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

type ScreeningQuestion = {
  id: string;
  question: string;
  type: 'text' | 'yesno' | 'multiple' | 'number';
  options?: string[];
  required: boolean;
  eliminatory: boolean;
  correctAnswer?: string | number | boolean;
};

type ScreeningQuestionsProps = {
  questions: ScreeningQuestion[];
  onChange: (questions: ScreeningQuestion[]) => void;
};

export function ScreeningQuestions({ questions, onChange }: ScreeningQuestionsProps) {
  const addQuestion = () => {
    const newQuestion: ScreeningQuestion = {
      id: Date.now().toString(),
      question: '',
      type: 'text',
      required: false,
      eliminatory: false
    };
    onChange([...questions, newQuestion]);
  };

  const removeQuestion = (id: string) => {
    onChange(questions.filter(q => q.id !== id));
  };

  const updateQuestion = (id: string, updates: Partial<ScreeningQuestion>) => {
    onChange(questions.map(q => 
      q.id === id ? { ...q, ...updates } : q
    ));
  };

  const addOption = (questionId: string) => {
    const question = questions.find(q => q.id === questionId);
    if (question) {
      const options = question.options || [];
      updateQuestion(questionId, {
        options: [...options, '']
      });
    }
  };

  const updateOption = (questionId: string, index: number, value: string) => {
    const question = questions.find(q => q.id === questionId);
    if (question && question.options) {
      const newOptions = [...question.options];
      newOptions[index] = value;
      updateQuestion(questionId, { options: newOptions });
    }
  };

  const removeOption = (questionId: string, index: number) => {
    const question = questions.find(q => q.id === questionId);
    if (question && question.options) {
      const newOptions = question.options.filter((_, i) => i !== index);
      updateQuestion(questionId, { options: newOptions });
    }
  };

  return (
    <div className="space-y-6">
      {questions.map((question) => (
        <div key={question.id} className="border rounded-lg p-4">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1 mr-4">
              <input
                type="text"
                value={question.question}
                onChange={(e) => updateQuestion(question.id, { question: e.target.value })}
                placeholder="Enter your question"
                className="w-full rounded-md border-gray-300 focus:border-red-500 focus:ring-red-500"
              />
            </div>
            <button
              onClick={() => removeQuestion(question.id)}
              className="text-gray-400 hover:text-red-600"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Question Type
              </label>
              <select
                value={question.type}
                onChange={(e) => updateQuestion(question.id, { 
                  type: e.target.value as ScreeningQuestion['type'],
                  options: e.target.value === 'multiple' ? [''] : undefined
                })}
                className="w-full rounded-md border-gray-300 focus:border-red-500 focus:ring-red-500"
              >
                <option value="text">Text Answer</option>
                <option value="yesno">Yes/No</option>
                <option value="multiple">Multiple Choice</option>
                <option value="number">Number</option>
              </select>
            </div>

            {question.type === 'multiple' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Correct Answer
                </label>
                <select
                  value={question.correctAnswer as string}
                  onChange={(e) => updateQuestion(question.id, { correctAnswer: e.target.value })}
                  className="w-full rounded-md border-gray-300 focus:border-red-500 focus:ring-red-500"
                >
                  <option value="">Select correct answer</option>
                  {question.options?.map((option, index) => (
                    <option key={index} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            )}

            {question.type === 'yesno' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Correct Answer
                </label>
                <select
                  value={String(question.correctAnswer)}
                  onChange={(e) => updateQuestion(question.id, { 
                    correctAnswer: e.target.value === 'true'
                  })}
                  className="w-full rounded-md border-gray-300 focus:border-red-500 focus:ring-red-500"
                >
                  <option value="">Select correct answer</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
            )}
          </div>

          {question.type === 'multiple' && (
            <div className="space-y-2 mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Options
              </label>
              {question.options?.map((option, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => updateOption(question.id, index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    className="flex-1 rounded-md border-gray-300 focus:border-red-500 focus:ring-red-500"
                  />
                  <button
                    onClick={() => removeOption(question.id, index)}
                    className="text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addOption(question.id)}
                className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700"
              >
                <Plus className="h-4 w-4" />
                Add Option
              </button>
            </div>
          )}

          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={question.required}
                onChange={(e) => updateQuestion(question.id, { required: e.target.checked })}
                className="rounded border-gray-300 text-red-600 focus:ring-red-500"
              />
              <span className="text-sm text-gray-700">Required</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={question.eliminatory}
                onChange={(e) => updateQuestion(question.id, { eliminatory: e.target.checked })}
                className="rounded border-gray-300 text-red-600 focus:ring-red-500"
              />
              <span className="text-sm text-gray-700">Eliminatory</span>
            </label>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addQuestion}
        className="flex items-center gap-2 text-red-600 hover:text-red-700"
      >
        <Plus className="h-5 w-5" />
        Add Question
      </button>
    </div>
  );
}