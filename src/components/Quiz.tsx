import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Clock, Brain, Zap } from "lucide-react";
import { quizQuestions } from "@/data/questions";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface QuizProps {
  onComplete: (score: number) => void;
  userProfile: any;
}

const Quiz = ({ onComplete, userProfile }: QuizProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(7);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [startTime] = useState(Date.now());
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const question = quizQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

  useEffect(() => {
    if (timeLeft > 0 && !isAnswered) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isAnswered) {
      handleTimeUp();
    }
  }, [timeLeft, isAnswered]);

  const handleTimeUp = () => {
    setIsAnswered(true);
    setShowResult(true);
    toast({
      title: "Time's up!",
      description: "Moving to next question...",
      variant: "destructive",
    });
    setTimeout(nextQuestion, 2000);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (isAnswered) return;
    
    setSelectedAnswer(answerIndex);
    setIsAnswered(true);
    setShowResult(true);

    if (answerIndex === question.correctAnswer) {
      setScore(score + 1);
      toast({
        title: "Correct! 🎉",
        description: "Well done! Moving to next question...",
      });
    } else {
      toast({
        title: "Incorrect 😔",
        description: `The correct answer was: ${question.answers[question.correctAnswer]}`,
        variant: "destructive",
      });
    }

    setTimeout(nextQuestion, 2500);
  };

  const nextQuestion = () => {
    if (currentQuestion + 1 < quizQuestions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setShowResult(false);
      setTimeLeft(7);
    } else {
      handleQuizComplete();
    }
  };

  const handleQuizComplete = async () => {
    const completionTime = Math.floor((Date.now() - startTime) / 1000);
    setIsSaving(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('save-quiz-result', {
        body: {
          twitter_username: userProfile.username,
          display_name: userProfile.displayName,
          avatar_url: userProfile.avatar,
          score,
          completion_time: completionTime
        }
      });

      if (error) {
        console.error('Error saving quiz result:', error);
        toast({
          title: "Error",
          description: "Failed to save your quiz result. Your score may not appear on the leaderboard.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Quiz Complete!",
          description: `Your score of ${score}/10 has been saved to the leaderboard!`,
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Something went wrong while saving your result.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
      onComplete(score);
    }
  };

  return (
    <div className="min-h-screen bg-sentient-gradient flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-glass-white/10 rounded-full floating"></div>
        <div className="absolute bottom-1/3 left-1/4 w-24 h-24 bg-tech-purple/20 rounded-lg rotate-45 floating" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="max-w-4xl mx-auto w-full relative z-10">
        {/* Header */}
        <div className="text-center mb-8 slide-in">
          <div className="flex items-center justify-center gap-4 mb-4">
            <img 
              src={userProfile?.avatar} 
              alt="Profile" 
              className="w-12 h-12 rounded-full shadow-tech"
            />
            <div className="text-glass-white">
              <div className="font-semibold">{userProfile?.displayName}</div>
              <div className="text-sm opacity-75">Current Score: {score}/{currentQuestion}</div>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-8 text-glass-white/90">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-sentient-pink" />
              <span>Question {currentQuestion + 1} of {quizQuestions.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-tech-purple" />
              <span className={`font-bold ${timeLeft <= 2 ? 'text-destructive animate-pulse' : ''}`}>
                {timeLeft}s
              </span>
            </div>
          </div>
          
          <Progress value={progress} className="mt-4 h-2 bg-glass-white/20" />
        </div>

        {/* Question Card */}
        <Card className="glass-card border-0 shadow-sentient slide-in">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <Badge variant="outline" className="mb-4 bg-tech-gradient text-glass-white border-0">
                <Zap className="w-4 h-4 mr-2" />
                Sentient Knowledge
              </Badge>
              <h2 className="text-2xl font-bold text-glass-dark leading-relaxed">
                {question.question}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {question.answers.map((answer, index) => (
                <Button
                  key={index}
                  variant="quiz"
                  size="lg"
                  onClick={() => handleAnswerSelect(index)}
                  disabled={isAnswered}
                  className={`
                    h-auto p-6 text-left whitespace-normal transition-all duration-300
                    ${showResult && index === question.correctAnswer 
                      ? 'ring-2 ring-green-500 bg-green-100 hover:bg-green-100' 
                      : ''}
                    ${showResult && selectedAnswer === index && index !== question.correctAnswer 
                      ? 'ring-2 ring-red-500 bg-red-100 hover:bg-red-100' 
                      : ''}
                  `}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-sentient-pink/20 flex items-center justify-center text-sentient-pink font-bold flex-shrink-0">
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="text-base leading-relaxed">{answer}</span>
                  </div>
                </Button>
              ))}
            </div>

            {showResult && (
              <div className="mt-6 text-center">
                <div className="text-sm text-muted-foreground">
                  {selectedAnswer === question.correctAnswer ? (
                    <span className="text-green-600 font-medium">✓ Correct!</span>
                  ) : (
                    <span className="text-red-600 font-medium">
                      ✗ Incorrect. The answer was: {question.answers[question.correctAnswer]}
                    </span>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Timer Bar */}
        <div className="mt-4 bg-glass-white/20 rounded-full h-2 overflow-hidden">
          <div 
            className="h-full bg-sentient-gradient transition-all duration-1000 ease-linear"
            style={{ width: `${(timeLeft / 7) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default Quiz;