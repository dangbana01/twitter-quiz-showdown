import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award, Home, Timer, RefreshCw } from "lucide-react";
import sentientLogo from "@/assets/sentient-logo.png";

interface LeaderboardProps {
  onBackToHome: () => void;
}

// Mock leaderboard data - in real app this would come from Supabase
const mockLeaderboard = [
  { rank: 1, username: "@ai_researcher", displayName: "AI Researcher", score: 15, time: "3m 42s", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1" },
  { rank: 2, username: "@tech_guru", displayName: "Tech Guru", score: 14, time: "4m 12s", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=2" },
  { rank: 3, username: "@future_mind", displayName: "Future Mind", score: 14, time: "4m 28s", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=3" },
  { rank: 4, username: "@neural_net", displayName: "Neural Network", score: 13, time: "3m 56s", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=4" },
  { rank: 5, username: "@sentient_soul", displayName: "Sentient Soul", score: 13, time: "4m 33s", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=5" },
  { rank: 6, username: "@code_master", displayName: "Code Master", score: 12, time: "4m 01s", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=6" },
  { rank: 7, username: "@quantum_leap", displayName: "Quantum Leap", score: 12, time: "4m 17s", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=7" },
  { rank: 8, username: "@digital_sage", displayName: "Digital Sage", score: 11, time: "4m 45s", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=8" }
];

const Leaderboard = ({ onBackToHome }: LeaderboardProps) => {
  const [timeUntilReset, setTimeUntilReset] = useState("29m 42s");
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    // Simulate countdown timer
    const interval = setInterval(() => {
      // This would be calculated based on actual reset time in production
      const minutes = Math.floor(Math.random() * 30);
      const seconds = Math.floor(Math.random() * 60);
      setTimeUntilReset(`${minutes}m ${seconds}s`);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
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
        <div className="grid grid-cols-3 gap-4 mb-8 slide-in">
          {mockLeaderboard.slice(0, 3).map((player, index) => (
            <Card key={player.rank} className={`glass-card border-0 ${index === 0 ? 'shadow-sentient transform scale-105' : 'shadow-glass'} transition-transform hover:scale-105`}>
              <CardContent className="p-6 text-center">
                <div className="mb-4">
                  {getRankIcon(player.rank)}
                </div>
                <img 
                  src={player.avatar} 
                  alt={player.displayName} 
                  className="w-16 h-16 rounded-full mx-auto mb-3 shadow-tech"
                />
                <div className="space-y-1">
                  <h3 className="font-bold text-glass-dark">{player.displayName}</h3>
                  <p className="text-sm text-muted-foreground">{player.username}</p>
                  <div className="text-2xl font-black text-sentient-pink">{player.score}/15</div>
                  <div className="text-xs text-muted-foreground">{player.time}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Full Leaderboard */}
        <Card className="glass-card border-0 shadow-sentient slide-in">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-glass-dark">Full Rankings</h2>
              <Badge variant="outline" className="bg-tech-gradient text-glass-white border-0">
                {mockLeaderboard.length} Players
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1">
              {mockLeaderboard.map((player) => (
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
                    src={player.avatar} 
                    alt={player.displayName} 
                    className="w-10 h-10 rounded-full shadow-sm"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-glass-dark">{player.displayName}</div>
                    <div className="text-sm text-muted-foreground">{player.username}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-sentient-pink">{player.score}/15</div>
                    <div className="text-xs text-muted-foreground">{player.time}</div>
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