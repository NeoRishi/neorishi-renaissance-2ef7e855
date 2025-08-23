import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle2, XCircle } from 'lucide-react';
import { DoshaGunaBlock } from '@/types/panchanga';
import { motion } from 'framer-motion';

interface DoshaGunaTimelineProps {
  blocks: DoshaGunaBlock[];
}

export const DoshaGunaTimeline: React.FC<DoshaGunaTimelineProps> = ({ blocks }) => {
  const getGunaColor = (guna: string) => {
    switch (guna) {
      case 'Sattva': return 'bg-tulsi/20 text-tulsi border-tulsi/30';
      case 'Rajas': return 'bg-kesari/20 text-kesari border-kesari/30';
      case 'Tamas': return 'bg-secondary/20 text-secondary-foreground border-secondary/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getDoshaColor = (dosha: string) => {
    switch (dosha) {
      case 'Vāta': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Pitta': return 'bg-red-100 text-red-800 border-red-200'; 
      case 'Kapha': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Doṣa-Guṇa Windowing
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Align your activities with natural rhythms throughout the day
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {blocks.map((block, index) => (
            <motion.div
              key={`${block.from}-${block.to}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border rounded-lg p-4 hover:shadow-md transition-all"
            >
              {/* Time Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="font-mono">
                    {block.from} - {block.to}
                  </Badge>
                  <Badge className={getGunaColor(block.guna)}>
                    {block.guna}
                  </Badge>
                  <Badge variant="outline" className={getDoshaColor(block.dosha)}>
                    {block.dosha}
                  </Badge>
                </div>
              </div>

              {/* Activities Grid */}
              <div className="grid md:grid-cols-2 gap-4">
                {/* Do Activities */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-tulsi" />
                    <span className="text-sm font-medium text-tulsi">Best to do</span>
                  </div>
                  <ul className="space-y-1 ml-6">
                    {block.do.map((activity, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground">
                        • {activity}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Avoid Activities */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-destructive" />
                    <span className="text-sm font-medium text-destructive">Avoid</span>
                  </div>
                  <ul className="space-y-1 ml-6">
                    {block.avoid.map((activity, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground">
                        • {activity}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};