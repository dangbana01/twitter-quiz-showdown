import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award, Home, Timer, RefreshCw } from "lucide-react";
import sentientLogo from "@/assets/sentient-logo.png";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface LeaderboardProps {
  onBackToHome: () => void;
}

// Real-time leaderboard data from Supabase

const Leaderboard = ({ onBackToHome }: LeaderboardProps) => {
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
  const [timeUntilReset, setTimeUntilReset] = useState("29m 42s");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchLeaderboard = async () => {
    try {
      const { data, error } = await supabase.rpc('get_current_leaderboard');
      
      if (error) {
        console.error('Error fetching leaderboard:', error);
        toast({
          title: "Error",
          description: "Failed to load leaderboard data.",
          variant: "destructive",
        });
        return;
      }

      setLeaderboardData(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Something went wrong while loading the leaderboard.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();

    // Set up real-time subscription
    const channel = supabase
      .channel('leaderboard-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'quiz_sessions'
        },
        () => {
          // Refresh leaderboard when new data is inserted
          fetchLeaderboard();
        }
      )
      .subscribe();

    // Countdown timer
    const timer = setInterval(() => {
      const now = new Date();
      const nextReset = new Date(now);
      nextReset.setMinutes(Math.ceil(now.getMinutes() / 30) * 30, 0, 0);
      const diff = nextReset.getTime() - now.getTime();
      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setTimeUntilReset(`${minutes}m ${seconds}s`);
    }, 1000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(timer);
    };
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchLeaderboard();
    setIsRefreshing(false);
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2: return <Medal className="w-6 h-6 text-gray-400" />;
      case 3: return <Award className="w-6 h-6 text-amber-600" />;
      default: return <div className="w-6 h-6 rounded-full bg-sentient-pink/20 flex items-center justify-center text-sm font-bold text-sentient-pink">{rank}</div>;
    }
  };

  return (
    <div className="min-h-screen bg-sentient-gradient p-4 relative overflow-hidden">
      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/6 left-1/6 w-16 h-16 bg-glass-white/15 rounded-lg rotate-12 floating"></div>
        <div className="absolute top-2/3 right-1/4 w-20 h-20 bg-tech-purple/20 rounded-full floating" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-1/4 left-2/3 w-12 h-12 bg-glass-white/20 rounded-lg -rotate-45 floating" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8 slide-in">
          <div className="flex justify-center mb-6">
            <img 
              src={sentientLogo} 
              alt="Sentient Logo" 
              className="w-16 h-16 pulse-glow rounded-xl shadow-sentient"
            />
          </div>
          <h1 className="text-4xl font-black text-glass-white mb-4">
            <Trophy className="w-8 h-8 inline mr-3 text-yellow-500" />
            Live Leaderboard
          </h1>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-glass-white/90">
            <Badge variant="outline" className="bg-glass-white/20 text-glass-white border-glass-white/30">
              <Timer className="w-4 h-4 mr-2" />
              Resets in {timeUntilReset}
            </Badge>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="text-glass-white hover:bg-glass-white/20"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Top 3 Podium */}
        {isLoading ? (
          <div className="text-center text-glass-white/70 mb-8">Loading leaderboard...</div>
        ) : leaderboardData.length === 0 ? (
          <Card className="glass-card border-0 shadow-glass mb-8">
            <CardContent className="p-8 text-center">
              <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-bold text-glass-dark mb-2">No Quiz Results Yet</h3>
              <p className="text-muted-foreground">Be the first to take the quiz and claim the top spot!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-3 gap-4 mb-8 slide-in">
            {leaderboardData.slice(0, 3).map((player, index) => (
            <Card key={player.rank} className={`glass-card border-0 ${index === 0 ? 'shadow-sentient transform scale-105' : 'shadow-glass'} transition-transform hover:scale-105`}>
              <CardContent className="p-6 text-center">
                <div className="mb-4">
                  {getRankIcon(player.rank)}
                </div>
                <img 
                  src={player.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${player.twitter_username}`} 
                  alt={player.display_name} 
                  className="w-16 h-16 rounded-full mx-auto mb-3 shadow-tech"
                />
                <div className="space-y-1">
                  <h3 className="font-bold text-glass-dark">{player.display_name}</h3>
                  <p className="text-sm text-muted-foreground">@{player.twitter_username}</p>
                  <div className="text-2xl font-black text-sentient-pink">{player.score}/10</div>
                  <div className="text-xs text-muted-foreground">{player.time_display}</div>
                </div>
              </CardContent>
            </Card>
            ))}
          </div>
        )}

        {/* Full Leaderboard */}
        <Card className="glass-card border-0 shadow-sentient slide-in">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-glass-dark">Full Rankings</h2>
              <Badge variant="outline" className="bg-tech-gradient text-glass-white border-0">
                {leaderboardData.length} Players
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1">
              {leaderboardData.map((player) => (
                <div 
                  key={player.rank}
                  className={`flex items-center gap-4 p-4 hover:bg-glass-white/10 transition-colors ${
                    player.rank <= 3 ? 'bg-glass-white/5' : ''
                  }`}
                >
                  <div className="flex items-center justify-center w-8">
                    {getRankIcon(player.rank)}
                  </div>
                  <img 
                    src={player.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${player.twitter_username}`} 
                    alt={player.display_name} 
                    className="w-10 h-10 rounded-full shadow-sm"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-glass-dark">{player.display_name}</div>
                    <div className="text-sm text-muted-foreground">@{player.twitter_username}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-sentient-pink">{player.score}/10</div>
                    <div className="text-xs text-muted-foreground">{player.time_display}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8 slide-in">
          <Button 
            onClick={onBackToHome}
            variant="sentient"
            size="lg"
            className="flex items-center gap-2"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </Button>
          <Button 
            variant="tech"
            size="lg"
            onClick={() => window.location.reload()}
          >
            Take Quiz Again
          </Button>
        </div>

        {/* Backend Notice */}
        <Card className="glass-card border-0 shadow-glass mt-8 slide-in">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">
              <strong>Real-time updates:</strong> Connect to Supabase for live leaderboard updates, 
              automatic resets, and persistent score tracking.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Leaderboard;