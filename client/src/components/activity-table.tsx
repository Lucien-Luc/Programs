import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  List, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Calendar, 
  Trophy, 
  Clock,
  Target,
  Handshake,
  Sprout,
  Rocket,
  TrendingUp
} from "lucide-react";
import { formatDate, getStatusColor } from "@/lib/utils";
import type { Activity, Program } from "@shared/schema";

interface ActivityTableProps {
  activities: Activity[];
  programs: Program[];
}

const iconMap = {
  "bullseye": Target,
  "handshake": Handshake,
  "seedling": Sprout,
  "rocket": Rocket,
  "chart-line": TrendingUp,
};

const actionIconMap = {
  "completed": Eye,
  "in_progress": Edit,
  "scheduled": Calendar,
  "pending": Clock,
};

export function ActivityTable({ activities, programs }: ActivityTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(activities.length / itemsPerPage);
  
  const paginatedActivities = activities.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getProgramById = (id: number) => programs.find(p => p.id === id);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <List className="w-5 h-5 text-primary" />
            <span>Recent Program Activity</span>
          </CardTitle>
          <div className="flex space-x-3">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Program</TableHead>
                <TableHead>Activity Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedActivities.map((activity) => {
                const program = getProgramById(activity.programId!);
                if (!program) return null;
                
                const IconComponent = iconMap[program.icon as keyof typeof iconMap] || Target;
                const ActionIcon = actionIconMap[activity.status as keyof typeof actionIconMap] || Eye;
                
                return (
                  <TableRow key={activity.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-8 h-8 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: program.color }}
                        >
                          <IconComponent className="text-white w-4 h-4" />
                        </div>
                        <span className="font-medium">{program.type}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {activity.type}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(activity.date)}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={getStatusColor(activity.status)}
                        variant="secondary"
                      >
                        {activity.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {activity.details}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-primary hover:text-primary/80"
                      >
                        <ActionIcon className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        
        {/* Pagination */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, activities.length)} of {activities.length} results
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
