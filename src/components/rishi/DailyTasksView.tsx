import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Plus, 
  Target, 
  Clock, 
  CheckCircle2, 
  Circle, 
  Lightbulb,
  Trash2,
  Calendar,
  Bell
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, addMinutes } from 'date-fns';
import { Task } from '@/types/panchanga';
import { getRecommendedTasks, getDinacharya } from '@/services/panchangaService';
import { useToast } from '@/hooks/use-toast';

interface DailyTasksViewProps {
  date: string;
}

export const DailyTasksView: React.FC<DailyTasksViewProps> = ({ date }) => {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [dinacharya, setDinacharya] = useState<any[]>([]);
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    notes: '',
    when: '',
    durationMin: 30,
    category: 'Personal'
  });

  useEffect(() => {
    // Load recommended tasks and dinacharya
    const recommendedTasks = getRecommendedTasks();
    setTasks(recommendedTasks);
    
    const dailyRoutine = getDinacharya();
    setDinacharya(dailyRoutine);
  }, [date]);

  const handleCompleteTask = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, status: task.status === 'completed' ? 'pending' : 'completed' as const }
        : task
    ));

    toast({
      title: "Task updated",
      description: "Great progress on your spiritual journey!",
    });
  };

  const handleCompleteDinacharya = (activityId: string) => {
    setDinacharya(prev => prev.map(activity =>
      activity.id === activityId
        ? { ...activity, completed: !activity.completed }
        : activity
    ));
  };

  const handleAddTask = () => {
    if (!newTask.title.trim() || !newTask.when) return;

    const task: Task = {
      id: `task_${Date.now()}`,
      title: newTask.title,
      notes: newTask.notes,
      when: newTask.when,
      durationMin: newTask.durationMin,
      status: 'pending',
      category: newTask.category,
      reminder: format(
        addMinutes(new Date(newTask.when), -10),
        "yyyy-MM-dd'T'HH:mm"
      ) + '+05:30'
    };

    setTasks(prev => [...prev, task]);
    setNewTask({
      title: '',
      notes: '',
      when: '',
      durationMin: 30,
      category: 'Personal'
    });
    setShowAddTask(false);

    toast({
      title: "Task added",
      description: "New task added to your schedule.",
    });
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const totalTasks = tasks.length;
  const completedDinacharya = dinacharya.filter(d => d.completed).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-2xl font-bold mb-2">Daily Tasks</h2>
          <p className="text-muted-foreground">
            {format(new Date(date), 'EEEE, MMMM do, yyyy')}
          </p>
        </div>
        <Button
          onClick={() => setShowAddTask(true)}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Task
        </Button>
      </motion.div>

      {/* Progress Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-4 text-center">
              <Target className="w-6 h-6 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-primary">{completedTasks}</div>
              <div className="text-xs text-muted-foreground">Tasks Done</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-4 text-center">
              <Circle className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
              <div className="text-2xl font-bold">{totalTasks}</div>
              <div className="text-xs text-muted-foreground">Total Tasks</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-4 text-center">
              <CheckCircle2 className="w-6 h-6 text-tulsi mx-auto mb-2" />
              <div className="text-2xl font-bold text-tulsi">{completedDinacharya}</div>
              <div className="text-xs text-muted-foreground">Dinacharya</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardContent className="p-4 text-center">
              <Clock className="w-6 h-6 text-accent mx-auto mb-2" />
              <div className="text-2xl font-bold text-accent">
                {Math.round((completedTasks / Math.max(totalTasks, 1)) * 100)}%
              </div>
              <div className="text-xs text-muted-foreground">Progress</div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* SMART Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Today's SMART Tasks
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              3 recommended tasks derived from your Sankalpa
            </p>
          </CardHeader>
          <CardContent>
            <AnimatePresence>
              {tasks.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8"
                >
                  <Lightbulb className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">No tasks yet</p>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowAddTask(true)}
                    className="flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Create your 3 for today
                  </Button>
                </motion.div>
              ) : (
                <div className="space-y-3">
                  {tasks.map((task, index) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-4 border rounded-lg ${
                        task.status === 'completed' ? 'bg-muted/50' : 'hover:bg-muted/30'
                      } transition-colors`}
                    >
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => handleCompleteTask(task.id)}
                          className="mt-1"
                        >
                          {task.status === 'completed' ? (
                            <CheckCircle2 className="w-5 h-5 text-tulsi" />
                          ) : (
                            <Circle className="w-5 h-5 text-muted-foreground hover:text-primary" />
                          )}
                        </button>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className={`font-medium ${
                              task.status === 'completed' ? 'line-through text-muted-foreground' : ''
                            }`}>
                              {task.title}
                            </h4>
                            {task.derivedFromSankalpa && (
                              <Badge variant="outline" className="text-xs">
                                From Sankalpa
                              </Badge>
                            )}
                          </div>
                          
                          {task.notes && (
                            <p className={`text-sm ${
                              task.status === 'completed' ? 'text-muted-foreground' : 'text-muted-foreground'
                            }`}>
                              {task.notes}
                            </p>
                          )}
                          
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {format(new Date(task.when), 'HH:mm')}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {task.durationMin} min
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {task.category}
                            </Badge>
                          </div>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteTask(task.id)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Recommended Dinacharya */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              Recommended Dinacharya
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Daily routine for optimal well-being
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dinacharya.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/30 transition-colors"
                >
                  <Checkbox
                    checked={activity.completed}
                    onCheckedChange={() => handleCompleteDinacharya(activity.id)}
                    className="data-[state=checked]:bg-tulsi data-[state=checked]:border-tulsi"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${
                        activity.completed ? 'line-through text-muted-foreground' : ''
                      }`}>
                        {activity.activity}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {activity.time}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Task Modal */}
      <AnimatePresence>
        {showAddTask && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddTask(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Add New Task</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="Task title"
                    value={newTask.title}
                    onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                  />
                  
                  <Textarea
                    placeholder="Notes (optional)"
                    value={newTask.notes}
                    onChange={(e) => setNewTask(prev => ({ ...prev, notes: e.target.value }))}
                    rows={3}
                  />
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium mb-2 block">When</label>
                      <Input
                        type="datetime-local"
                        value={newTask.when}
                        onChange={(e) => setNewTask(prev => ({ ...prev, when: e.target.value }))}
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">Duration (min)</label>
                      <Input
                        type="number"
                        value={newTask.durationMin}
                        onChange={(e) => setNewTask(prev => ({ 
                          ...prev, 
                          durationMin: parseInt(e.target.value) || 30 
                        }))}
                        min="5"
                        max="240"
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setShowAddTask(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleAddTask}
                      disabled={!newTask.title.trim() || !newTask.when}
                      className="flex-1"
                    >
                      Add Task
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};