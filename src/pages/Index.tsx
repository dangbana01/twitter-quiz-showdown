import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Timer, Users, Zap } from "lucide-react";
import sentientLogo from "@/assets/sentient-logo.png";
import Quiz from "@/components/Quiz";
import Leaderboard from "@/components/Leaderboard";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [currentView, setCurrentView] = useState<'home' | 'quiz' | 'leaderboard'>('home');
  const [twitterUsername, setTwitterUsername] = useState('');
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleTwitterLogin = async () => {
    if (!twitterUsername.trim()) {
      toast({
        title: "Username Required",
        description: "Please enter your Twitter username first!",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('twitter-user', {
        body: { username: twitterUsername }
      });

      if (error) {
        console.error('Error fetching Twitter data:', error);
        toast({
          title: "Error",
          description: "Failed to fetch Twitter profile. Please try again.",
          variant: "destructive",
        });
        return;
      }

      if (!data) {
        toast({
          title: "User Not Found",
          description: "Twitter user not found. Please check the username.",
          variant: "destructive",
        });
        return;
      }

      setUserProfile({
        username: data.username,
        displayName: data.display_name,
        followers: data.followers_count,
        following: data.following_count,
        tweets: data.tweet_count,
        avatar: data.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.username}`,
        verified: data.verified
      });

      toast({
        title: "Profile Loaded",
        description: `Welcome, ${data.display_name}!`,
      });

    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const startQuiz = () => {
    setCurrentView('quiz');
  };

  if (currentView === 'quiz') {
    return <Quiz onComplete={() => setCurrentView('leaderboard')} userProfile={userProfile} />;
  }

  if (currentView === 'leaderboard') {
    return <Leaderboard onBackToHome={() => setCurrentView('home')} />;
  }

  return (
    <div className="min-h-screen bg-sentient-gradient flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Floating geometric elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-20 h-20 bg-glass-white/20 rounded-lg rotate-45 floating"></div>
        <div className="absolute top-1/3 right-1/3 w-16 h-16 bg-glass-white/15 rounded-lg rotate-12 floating" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-1/4 left-1/3 w-24 h-24 bg-glass-white/10 rounded-lg -rotate-12 floating" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-1/3 right-1/4 w-12 h-12 bg-glass-white/25 rounded-lg rotate-45 floating" style={{animationDelay: '3s'}}></div>
      </div>

      <div className="max-w-4xl mx-auto text-center space-y-8 slide-in relative z-10">
        {/* Logo and Header */}
        <div className="space-y-6">
          <div className="flex justify-center">
            <img 
              src={sentientLogo} 
              alt="Sentient Logo" 
              className="w-24 h-24 pulse-glow rounded-2xl shadow-sentient"
            />
          </div>
          <div className="space-y-4">
            <h1 className="text-6xl font-black text-glass-white drop-shadow-lg">
              Sentient
              <span className="bg-tech-gradient bg-clip-text text-transparent ml-3">Quiz</span>
            </h1>
            <p className="text-xl text-glass-white/90 max-w-2xl mx-auto leading-relaxed">
              Test your knowledge about AI, consciousness, and the future of sentient technology. 
              Connect your Twitter to join the challenge!
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="glass-card border-0 shadow-glass">
            <CardContent className="p-6 text-center">
              <Timer className="w-8 h-8 text-sentient-pink mx-auto mb-2" />
              <div className="text-2xl font-bold text-glass-dark">7</div>
              <div className="text-sm text-muted-foreground">Seconds per Question</div>
            </CardContent>
          </Card>
          <Card className="glass-card border-0 shadow-glass">
            <CardContent className="p-6 text-center">
              <Zap className="w-8 h-8 text-tech-purple mx-auto mb-2" />
              <div className="text-2xl font-bold text-glass-dark">15</div>
              <div className="text-sm text-muted-foreground">Total Questions</div>
            </CardContent>
          </Card>
          <Card className="glass-card border-0 shadow-glass">
            <CardContent className="p-6 text-center">
              <Trophy className="w-8 h-8 text-sentient-coral mx-auto mb-2" />
              <div className="text-2xl font-bold text-glass-dark">Live</div>
              <div className="text-sm text-muted-foreground">Leaderboard</div>
            </CardContent>
          </Card>
        </div>

        {/* Twitter Connection */}
        {!userProfile ? (
          <Card className="glass-card border-0 shadow-sentient max-w-md mx-auto">
            <CardHeader>
              <h2 className="text-2xl font-bold text-glass-dark text-center">Connect Twitter</h2>
              <p className="text-muted-foreground text-center">
                Enter your Twitter username to display your profile and join the quiz
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="Twitter username (without @)"
                  value={twitterUsername}
                  onChange={(e) => setTwitterUsername(e.target.value)}
                  className="bg-glass-white/50 border-glass-white/30"
                />
              </div>
              <Button 
                onClick={handleTwitterLogin}
                disabled={!twitterUsername.trim() || isLoading}
                variant="sentient"
                size="lg"
                className="w-full"
              >
                {isLoading ? "Loading Profile..." : "Connect & View Profile"}
              </Button>
            </CardContent>
          </Card>
        ) : (
          /* User Profile Display */
          <Card className="glass-card border-0 shadow-sentient max-w-md mx-auto">
            <CardContent className="p-6 text-center space-y-4">
              <img 
                src={userProfile.avatar} 
                alt="Profile" 
                className="w-20 h-20 rounded-full mx-auto shadow-tech"
              />
              <div>
                <h3 className="text-xl font-bold text-glass-dark">{userProfile.displayName}</h3>
                <div className="flex justify-center gap-4 mt-2 text-sm text-muted-foreground">
                  <span><strong>{userProfile.followers}</strong> Followers</span>
                  <span><strong>{userProfile.following}</strong> Following</span>
                  <span><strong>{userProfile.tweets}</strong> Tweets</span>
                </div>
              </div>
              <Button 
                onClick={startQuiz}
                variant="sentient"
                size="lg"
                className="w-full"
              >
                Start Sentient Quiz
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            onClick={() => setCurrentView('leaderboard')}
            variant="tech"
            size="lg"
            className="flex items-center gap-2"
          >
            <Users className="w-5 h-5" />
            View Leaderboard
          </Button>
          <Badge variant="outline" className="bg-glass-white/20 text-glass-white border-glass-white/30">
            Updates every 30 minutes
          </Badge>
        </div>

        {/* Backend Notice */}
        <Card className="glass-card border-0 shadow-glass max-w-2xl mx-auto">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">
              <strong>Note:</strong> For full Twitter API integration and real-time leaderboard features, 
              connect your project to Supabase using the integration button above.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;