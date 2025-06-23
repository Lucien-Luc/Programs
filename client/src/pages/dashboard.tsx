import { useState } from "react";
import { Navigation, useLanguage } from "@/components/navigation";
import { useTranslation } from "@/lib/i18n";
import { ProgramCard } from "@/components/program-card";
import { ActivityTable } from "@/components/activity-table";
import { ProgramModal } from "@/components/program-modal";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { usePrograms, useActivities } from "@/hooks/use-programs";
import { RefreshCw, BarChart3, Plus } from "lucide-react";
import type { Program } from "@shared/schema";
import logo from "@assets/logo_1750430330014.png";

export default function Dashboard() {
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { language } = useLanguage();
  const { t } = useTranslation(language);
  
  const { data: programs, isLoading: programsLoading, refetch: refetchPrograms } = usePrograms();
  const { data: activities, isLoading: activitiesLoading } = useActivities();

  const handleProgramClick = (program: Program) => {
    setSelectedProgram(program);
    setModalOpen(true);
  };

  const handleRefresh = () => {
    refetchPrograms();
  };

  if (programsLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="max-w-7xl mx-auto px-6 py-8">
          <div className="bg-primary text-primary-foreground rounded-xl p-8 mb-8">
            <Skeleton className="h-8 w-48 mb-2 bg-primary-foreground/20" />
            <Skeleton className="h-6 w-96 bg-primary-foreground/20" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6 mb-12">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-xl" />
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Dashboard Header */}
        <div className="bg-primary text-primary-foreground rounded-xl p-8 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src={logo} alt="BPN Logo" className="h-12 w-12 object-contain" />
              <div>
                <h1 className="text-3xl font-bold mb-2 flex items-center">
                  <BarChart3 className="mr-3 w-8 h-8" />
                  {t("welcome_title")}
                </h1>
                <p className="text-primary-foreground/80 text-lg">
                  {t("welcome_message")}
                </p>
              </div>
            </div>
            <div className="flex space-x-4">
              <Button 
                variant="outline" 
                className="space-x-2 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                onClick={handleRefresh}
              >
                <RefreshCw className="w-4 h-4" />
                <span>{t("refresh")}</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Program Overview Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center">
            <BarChart3 className="mr-2 w-6 h-6 text-primary" />
            Program Overview
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
            {programs?.map((program) => (
              <ProgramCard
                key={program.id}
                program={program}
                onClick={() => handleProgramClick(program)}
              />
            ))}
          </div>
        </section>

        {/* Recent Activity Section */}
        {activities && programs && (
          <section className="mb-12">
            <ActivityTable 
              activities={activities} 
              programs={programs} 
            />
          </section>
        )}
      </main>

      {/* Program Modal */}
      <ProgramModal
        program={selectedProgram}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
