import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QuizGame } from '../QuizGame';
import { useQuizStore } from '../../../store/quizStore';

// Mock questions for testing
const mockQuestions = [
  {
    id: 1,
    category: 'colors',
    text: 'What sign is shown in the image?',
    imageUrl: 'https://example.com/red.jpg',
    correctAnswer: 'red',
    hint: 'The color of a stop sign'
  },
  {
    id: 2,
    category: 'colors',
    text: 'What color is being signed?',
    imageUrl: 'https://example.com/blue.jpg',
    correctAnswer: 'blue',
    hint: 'The color of the sky'
  }
];

// Mock store
vi.mock('../../../store/quizStore', () => ({
  useQuizStore: vi.fn()
}));

describe('QuizGame', () => {
  beforeEach(() => {
    // Reset mock store before each test
    (useQuizStore as any).mockImplementation(() => ({
      currentQuestion: 0,
      score: 0,
      streak: 0,
      isComplete: false,
      showFeedback: false,
      isCorrect: false,
      initQuiz: vi.fn(),
      submitAnswer: vi.fn(),
      nextQuestion: vi.fn(),
      resetQuiz: vi.fn()
    }));
  });

  it('renders quiz game with first question', () => {
    render(<QuizGame questions={mockQuestions} />);
    
    expect(screen.getByText(mockQuestions[0].text)).toBeInTheDocument();
    expect(screen.getByAltText(/sign/i)).toHaveAttribute('src', mockQuestions[0].imageUrl);
  });

  it('shows hint when hint button is clicked', async () => {
    render(<QuizGame questions={mockQuestions} />);
    
    const hintButton = screen.getByText(/show hint/i);
    await userEvent.click(hintButton);
    
    expect(screen.getByText(mockQuestions[0].hint)).toBeInTheDocument();
  });

  it('submits answer and shows feedback', async () => {
    const mockSubmitAnswer = vi.fn().mockReturnValue(true);
    (useQuizStore as any).mockImplementation(() => ({
      currentQuestion: 0,
      score: 0,
      streak: 0,
      isComplete: false,
      showFeedback: false,
      isCorrect: true,
      initQuiz: vi.fn(),
      submitAnswer: mockSubmitAnswer,
      nextQuestion: vi.fn(),
      resetQuiz: vi.fn()
    }));

    render(<QuizGame questions={mockQuestions} />);
    
    const input = screen.getByPlaceholderText(/type your answer/i);
    const submitButton = screen.getByText(/submit/i);

    await userEvent.type(input, 'red');
    await userEvent.click(submitButton);

    expect(mockSubmitAnswer).toHaveBeenCalledWith('red');
  });

  it('shows completion screen after last question', async () => {
    (useQuizStore as any).mockImplementation(() => ({
      currentQuestion: mockQuestions.length - 1,
      score: 20,
      streak: 2,
      isComplete: true,
      showFeedback: false,
      isCorrect: true,
      initQuiz: vi.fn(),
      submitAnswer: vi.fn(),
      nextQuestion: vi.fn(),
      resetQuiz: vi.fn()
    }));

    render(<QuizGame questions={mockQuestions} />);
    
    expect(screen.getByText(/quiz complete/i)).toBeInTheDocument();
    expect(screen.getByText(/20/)).toBeInTheDocument(); // Score display
  });

  it('handles keyboard navigation', async () => {
    const mockNextQuestion = vi.fn();
    (useQuizStore as any).mockImplementation(() => ({
      currentQuestion: 0,
      score: 0,
      streak: 0,
      isComplete: false,
      showFeedback: false,
      isCorrect: false,
      initQuiz: vi.fn(),
      submitAnswer: vi.fn(),
      nextQuestion: mockNextQuestion,
      resetQuiz: vi.fn()
    }));

    render(<QuizGame questions={mockQuestions} />);
    
    // Test Enter key submission
    const input = screen.getByPlaceholderText(/type your answer/i);
    await userEvent.type(input, 'red{enter}');
    
    expect(input).toHaveValue('');
  });

  it('maintains streak for correct answers', async () => {
    let streak = 0;
    const mockSubmitAnswer = vi.fn().mockImplementation(() => {
      streak += 1;
      return true;
    });

    (useQuizStore as any).mockImplementation(() => ({
      currentQuestion: 0,
      score: 0,
      streak,
      isComplete: false,
      showFeedback: false,
      isCorrect: true,
      initQuiz: vi.fn(),
      submitAnswer: mockSubmitAnswer,
      nextQuestion: vi.fn(),
      resetQuiz: vi.fn()
    }));

    render(<QuizGame questions={mockQuestions} />);
    
    const input = screen.getByPlaceholderText(/type your answer/i);
    const submitButton = screen.getByText(/submit/i);

    // Submit two correct answers
    await userEvent.type(input, 'red');
    await userEvent.click(submitButton);
    await userEvent.type(input, 'blue');
    await userEvent.click(submitButton);

    expect(mockSubmitAnswer).toHaveBeenCalledTimes(2);
    expect(streak).toBe(2);
  });
});