import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, 
  Target, 
  Clock, 
  CheckCircle2, 
  Circle, 
  Lightbulb,
  Trash2,
  Calendar,
  Bell,
  Edit3,
  RotateCcw,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, addMinutes } from 'date-fns';
import { Task } from '@/types/panchanga';
import { getRecommendedTasks, getDinacharya } from '@/services/panchangaService';
import { useToast } from '@/hooks/use-toast';

interface DailyTasksViewProps {
  date: string;
}

const TASK_CATEGORIES = ['Spiritual', 'Health', 'Work', 'Personal', 'Learning', 'Creative'];
const RECURRENCE_OPTIONS = ['None', 'Daily', 'Weekly', 'Monthly'];

// Task persistence helpers
const getTasksFromStorage = (date: string): Task[] => {
  const stored = localStorage.getItem(`rishi-tasks-${date}`);
  if (stored) {
    return JSON.parse(stored);
  }
  // Return default recommended tasks for new dates
  return getRecommendedTasks();
};

const saveTasksToStorage = (date: string, tasks: Task[]): void => {
  localStorage.setItem(`rishi-tasks-${date}`, JSON.stringify(tasks));
};

const getDinacharyaFromStorage = (): any[] => {
  const stored = localStorage.getItem('rishi-dinacharya');
  if (stored) {
    return JSON.parse(stored);
  }
  return getDinacharya();
};

const saveDinacharyaToStorage = (dinacharya: any[]): void => {
  localStorage.setItem('rishi-dinacharya', JSON.stringify(dinacharya));
};

export const DailyTasksView: React.FC<DailyTasksViewProps> = ({ date }) => {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [dinacharya, setDinacharya] = useState<any[]>([]);
  const [showAddTask, setShowAddTask] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newTask, setNewTask] = useState({
    title: '',
    notes: '',
    when: `${date}T08:00`,
    durationMin: 30,
    category: 'Personal',
    recurrence: 'None'
  });

  useEffect(() => {
    setIsLoading(true);
    // Load tasks for the specific date with localStorage persistence
    const loadedTasks = getTasksFromStorage(date);
    setTasks(loadedTasks);
    
    // Load dinacharya with persistence
    const dailyRoutine = getDinacharyaFromStorage();
    setDinacharya(dailyRoutine);
    
    setTimeout(() => setIsLoading(false), 300); // Skeleton loader delay
  }, [date]);

  const handleCompleteTask = (taskId: string) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId 
        ? { ...task, status: (task.status === 'completed' ? 'pending' : 'completed') as 'pending' | 'completed' }
        : task
    );
    setTasks(updatedTasks);
    saveTasksToStorage(date, updatedTasks);

    toast({
      title: "Task updated",
      description: "Great progress on your spiritual journey!",
    });
  };

  const handleCompleteDinacharya = (activityId: string) => {
    const updatedDinacharya = dinacharya.map(activity =>
      activity.id === activityId
        ? { ...activity, completed: !activity.completed }
        : activity
    );
    setDinacharya(updatedDinacharya);
    saveDinacharyaToStorage(updatedDinacharya);
  };

  const handleAddTask = () => {
    if (!newTask.title.trim() || !newTask.when) return;

    const task: Task = {
      id: `task_${Date.now()}`,
      title: newTask.title,
      notes: newTask.notes,
      when: newTask.when + '+05:30',
      durationMin: newTask.durationMin,
      status: 'pending',
      category: newTask.category,
      reminder: format(
        addMinutes(new Date(newTask.when), -10),
        "yyyy-MM-dd'T'HH:mm"
      ) + '+05:30'
    };

    const updatedTasks = [...tasks, task];
    setTasks(updatedTasks);
    saveTasksToStorage(date, updatedTasks);
    
    resetTaskForm();
    setShowAddTask(false);

    toast({
      title: "Task added",
      description: "New task added to your schedule.",
    });
  };

  const handleEditTask = (updatedTask: Task) => {
    const updatedTasks = tasks.map(task =>
      task.id === updatedTask.id ? updatedTask : task
    );
    setTasks(updatedTasks);
    saveTasksToStorage(date, updatedTasks);
    setEditingTask(null);
    
    toast({
      title: "Task updated",
      description: "Your task has been successfully updated.",
    });
  };

  const handleDeleteTask = (taskId: string) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
    saveTasksToStorage(date, updatedTasks);
    
    toast({
      title: "Task deleted",
      description: "Task removed from your schedule.",
    });
  };

  const resetTaskForm = () => {
    setNewTask({
      title: '',
      notes: '',
      when: `${date}T08:00`,
      durationMin: 30,
      category: 'Personal',
      recurrence: 'None'
    });
  };

  const generateRecommendedTasks = () => {
    const recommended = getRecommendedTasks();
    const updatedTasks = [...tasks, ...recommended.filter(rec => 
      !tasks.some(task => task.title === rec.title)
    )];
    setTasks(updatedTasks);
    saveTasksToStorage(date, updatedTasks);
    
    toast({
      title: "Tasks generated",
      description: `Added ${recommended.length} recommended SMART tasks.`,
    });
  };

  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const totalTasks = tasks.length;
  const completedDinacharya = dinacharya.filter(d => d.completed).length;
  const totalDinacharya = dinacharya.length;

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Loading skeletons */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-8 bg-muted animate-pulse rounded w-48"></div>
            <div className="h-4 bg-muted animate-pulse rounded w-64"></div>
          </div>
          <div className="h-10 bg-muted animate-pulse rounded w-32"></div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-muted animate-pulse rounded-lg"></div>
          ))}
        </div>
        
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="h-96 bg-muted animate-pulse rounded-lg"></div>
          <div className="h-96 bg-muted animate-pulse rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h2 className="text-2xl font-bold mb-2">Daily Tasks</h2>
          <p className="text-muted-foreground">
            {format(new Date(date), 'EEEE, MMMM do, yyyy')}
          </p>
        </div>
        <div className="flex gap-2">
          {tasks.length === 0 && (
            <Button
              onClick={generateRecommendedTasks}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Zap className="w-4 h-4" />
              Generate SMART Tasks
            </Button>
          )}
          <Button
            onClick={() => setShowAddTask(true)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Task
          </Button>
        </div>
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
              <div className="text-2xl font-bold text-tulsi">
                {completedDinacharya}/{totalDinacharya}
              </div>
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
                  <p className="text-muted-foreground mb-4">No tasks yet for today</p>
                  <div className="space-y-3">
                    <Button 
                      onClick={generateRecommendedTasks}
                      className="flex items-center gap-2"
                    >
                      <Zap className="w-4 h-4" />
                      Generate 3 SMART Tasks
                    </Button>
                    <p className="text-xs text-muted-foreground">or</p>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowAddTask(true)}
                      className="flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Custom Task
                    </Button>
                  </div>
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
                        task.status === 'completed' ? 'bg-muted/50 border-tulsi/30' : 'hover:bg-muted/30'
                      } transition-all duration-200`}
                    >
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => handleCompleteTask(task.id)}
                          className="mt-1 transition-transform hover:scale-110"
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
                              <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/30">
                                From Sankalpa
                              </Badge>
                            )}
                          </div>
                          
                          {task.notes && (
                            <p className={`text-sm mb-2 ${
                              task.status === 'completed' ? 'text-muted-foreground' : 'text-muted-foreground'
                            }`}>
                              {task.notes}
                            </p>
                          )}
                          
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
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
                        
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingTask(task)}
                            className="text-muted-foreground hover:text-primary h-8 w-8 p-0"
                          >
                            <Edit3 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteTask(task.id)}
                            className="text-muted-foreground hover:text-destructive h-8 w-8 p-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
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

      {/* Add/Edit Task Dialog */}
      <Dialog open={showAddTask} onOpenChange={(open) => {
        setShowAddTask(open);
        if (!open) resetTaskForm();
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Task title (specific and actionable)"
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

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium mb-2 block">Category</label>
                <Select value={newTask.category} onValueChange={(value) => 
                  setNewTask(prev => ({ ...prev, category: value }))
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TASK_CATEGORIES.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Recurrence</label>
                <Select value={newTask.recurrence} onValueChange={(value) => 
                  setNewTask(prev => ({ ...prev, recurrence: value }))
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {RECURRENCE_OPTIONS.map(option => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Task Dialog */}
      <Dialog open={!!editingTask} onOpenChange={(open) => {
        if (!open) setEditingTask(null);
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          {editingTask && (
            <EditTaskForm
              task={editingTask}
              onSave={handleEditTask}
              onCancel={() => setEditingTask(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Edit Task Form Component
const EditTaskForm: React.FC<{
  task: Task;
  onSave: (task: Task) => void;
  onCancel: () => void;
}> = ({ task, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: task.title,
    notes: task.notes || '',
    when: task.when.slice(0, 19), // Remove timezone for input
    durationMin: task.durationMin,
    category: task.category
  });

  const handleSubmit = () => {
    if (!formData.title.trim() || !formData.when) return;

    const updatedTask: Task = {
      ...task,
      title: formData.title,
      notes: formData.notes,
      when: formData.when + '+05:30',
      durationMin: formData.durationMin,
      category: formData.category,
      reminder: format(
        addMinutes(new Date(formData.when), -10),
        "yyyy-MM-dd'T'HH:mm"
      ) + '+05:30'
    };

    onSave(updatedTask);
  };

  return (
    <div className="space-y-4">
      <Input
        placeholder="Task title"
        value={formData.title}
        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
      />
      
      <Textarea
        placeholder="Notes (optional)"
        value={formData.notes}
        onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
        rows={3}
      />
      
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium mb-2 block">When</label>
          <Input
            type="datetime-local"
            value={formData.when}
            onChange={(e) => setFormData(prev => ({ ...prev, when: e.target.value }))}
          />
        </div>
        
        <div>
          <label className="text-sm font-medium mb-2 block">Duration (min)</label>
          <Input
            type="number"
            value={formData.durationMin}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              durationMin: parseInt(e.target.value) || 30 
            }))}
            min="5"
            max="240"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Category</label>
        <Select value={formData.category} onValueChange={(value) => 
          setFormData(prev => ({ ...prev, category: value }))
        }>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TASK_CATEGORIES.map(category => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={onCancel}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!formData.title.trim() || !formData.when}
          className="flex-1"
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
};