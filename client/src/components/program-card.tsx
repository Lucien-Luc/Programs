import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn, getProgramTypeClass } from "@/lib/utils";
import { 
  Target, 
  Handshake, 
  Sprout, 
  Rocket, 
  TrendingUp 
} from "lucide-react";
import type { Program } from "@shared/schema";

const iconMap = {
  "bullseye": Target,
  "handshake": Handshake,
  "seedling": Sprout,
  "rocket": Rocket,
  "chart-line": TrendingUp,
};

interface ProgramCardProps {
  program: Program;
  onClick?: () => void;
}

export function ProgramCard({ program, onClick }: ProgramCardProps) {
  const IconComponent = iconMap[program.icon as keyof typeof iconMap] || Target;
  const typeClass = getProgramTypeClass(program.type);

  const CardContent = (
    <Card 
      className={cn(
        "program-card card-hover group",
        typeClass
      )}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div 
          className="w-12 h-12 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: program.color }}
        >
          <IconComponent className="text-white text-xl w-6 h-6" />
        </div>
        <Badge 
          variant="secondary" 
          className="bg-green-100 text-green-800 hover:bg-green-100"
        >
          {program.status === 'active' ? 'Active' : program.status}
        </Badge>
      </div>
      
      <div 
        className="text-3xl font-bold mb-2"
        style={{ color: program.color }}
      >
        {program.participants}
      </div>
      
      <div className="text-sm font-medium text-muted-foreground mb-4 uppercase">
        {program.name.replace('Program', '').trim()} {program.type === 'MCF' ? 'SUB-PROJECTS' : program.type === 'i-ACC' ? 'STARTUPS' : program.type === 'AGUKA' ? 'BUSINESSES' : program.type === 'RIN' ? 'BENEFICIARIES' : 'PARTICIPANTS'}
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Progress</span>
          <span>{program.progress}%</span>
        </div>
        <Progress 
          value={program.progress} 
          className="h-2"
          style={{ 
            '--progress-background': program.color 
          } as React.CSSProperties}
        />
      </div>

      {program.type === 'MCF' && (
        <div 
          className="absolute invisible group-hover:visible bg-black text-white p-3 rounded-lg text-xs -mt-16 ml-4 z-10 shadow-lg"
          style={{ top: '-80px', left: '16px' }}
        >
          <div className="space-y-1">
            <div>• Financial Services: 6 projects</div>
            <div>• Digital Innovation: 4 projects</div>
            <div>• Market Access: 5 projects</div>
            <div>• Capacity Building: 3 projects</div>
          </div>
        </div>
      )}
    </Card>
  );

  if (onClick) {
    return CardContent;
  }

  return (
    <Link href={`/program/${program.id}`}>
      {CardContent}
    </Link>
  );
}
