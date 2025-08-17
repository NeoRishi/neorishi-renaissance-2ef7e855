// Custom hooks for Task management using TanStack Query and Supabase
import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/client';
import { 
  LunarTask, 
  TasksResponse, 
  TaskType,
  LunarDay 
} from '../types/lunar';
import { useAuth } from '../contexts/AuthContext';

/**
 * Hook to fetch tasks for a specific date range
 */
export function useTasks(
  startDate?: Date,
  endDate?: Date,
  enabled = true
): UseQueryResult<LunarTask[], Error> {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['tasks', user?.id, startDate?.toISOString(), endDate?.toISOString()],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      let query = supabase
        .from('lunar_tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('date_greg', { ascending: true });

      if (startDate) {
        query = query.gte('date_greg', startDate.toISOString());
      }
      if (endDate) {
        query = query.lte('date_greg', endDate.toISOString());
      }

      const { data, error } = await query;

      if (error) throw error;

      return (data || []).map(task => ({
        id: task.id,
        userId: task.user_id,
        dateLunar: task.date_lunar,
        dateGreg: new Date(task.date_greg),
        type: task.type as TaskType,
        title: task.title,
        description: task.description,
        completed: task.completed,
        priority: task.priority,
        category: task.category,
        reminderTime: task.reminder_time,
        createdAt: new Date(task.created_at),
        updatedAt: new Date(task.updated_at)
      })) as LunarTask[];
    },
    enabled: enabled && !!user,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  });
}

/**
 * Hook to fetch tasks for a specific lunar day
 */
export function useTasksForDay(
  lunarDay: LunarDay | null,
  enabled = true
): UseQueryResult<LunarTask[], Error> {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['tasks-day', user?.id, lunarDay?.dateLunar],
    queryFn: async () => {
      if (!user || !lunarDay) return [];

      const { data, error } = await supabase
        .from('lunar_tasks')
        .select('*')
        .eq('user_id', user.id)
        .eq('date_lunar', lunarDay.dateLunar)
        .order('priority', { ascending: false })
        .order('created_at', { ascending: true });

      if (error) throw error;

      return (data || []).map(task => ({
        id: task.id,
        userId: task.user_id,
        dateLunar: task.date_lunar,
        dateGreg: new Date(task.date_greg),
        type: task.type as TaskType,
        title: task.title,
        description: task.description,
        completed: task.completed,
        priority: task.priority,
        category: task.category,
        reminderTime: task.reminder_time,
        createdAt: new Date(task.created_at),
        updatedAt: new Date(task.updated_at)
      })) as LunarTask[];
    },
    enabled: enabled && !!user && !!lunarDay,
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 15, // 15 minutes
  });
}

/**
 * Hook to fetch tasks by type
 */
export function useTasksByType(
  type: TaskType,
  enabled = true
): UseQueryResult<LunarTask[], Error> {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['tasks-type', user?.id, type],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('lunar_tasks')
        .select('*')
        .eq('user_id', user.id)
        .eq('type', type)
        .order('date_greg', { ascending: true });

      if (error) throw error;

      return (data || []).map(task => ({
        id: task.id,
        userId: task.user_id,
        dateLunar: task.date_lunar,
        dateGreg: new Date(task.date_greg),
        type: task.type as TaskType,
        title: task.title,
        description: task.description,
        completed: task.completed,
        priority: task.priority,
        category: task.category,
        reminderTime: task.reminder_time,
        createdAt: new Date(task.created_at),
        updatedAt: new Date(task.updated_at)
      })) as LunarTask[];
    },
    enabled: enabled && !!user,
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
  });
}

/**
 * Hook to create a new task
 */
export function useCreateTask(): UseMutationResult<LunarTask, Error, Omit<LunarTask, 'id' | 'createdAt' | 'updatedAt'>> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newTask) => {
      const { data, error } = await supabase
        .from('lunar_tasks')
        .insert({
          user_id: newTask.userId,
          date_lunar: newTask.dateLunar,
          date_greg: newTask.dateGreg.toISOString(),
          type: newTask.type,
          title: newTask.title,
          description: newTask.description,
          completed: newTask.completed,
          priority: newTask.priority,
          category: newTask.category,
          reminder_time: newTask.reminderTime
        })
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        userId: data.user_id,
        dateLunar: data.date_lunar,
        dateGreg: new Date(data.date_greg),
        type: data.type as TaskType,
        title: data.title,
        description: data.description,
        completed: data.completed,
        priority: data.priority,
        category: data.category,
        reminderTime: data.reminder_time,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      } as LunarTask;
    },
    onSuccess: (newTask) => {
      // Invalidate and refetch tasks
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['tasks-day', newTask.userId, newTask.dateLunar] });
      queryClient.invalidateQueries({ queryKey: ['tasks-type', newTask.userId, newTask.type] });
      
      console.log('✅ Task created successfully');
    },
    onError: (error) => {
      console.error('❌ Failed to create task:', error);
    }
  });
}

/**
 * Hook to update a task
 */
export function useUpdateTask(): UseMutationResult<LunarTask, Error, { id: string; updates: Partial<LunarTask> }> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }) => {
      const updateData: any = {};
      
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.completed !== undefined) updateData.completed = updates.completed;
      if (updates.priority !== undefined) updateData.priority = updates.priority;
      if (updates.category !== undefined) updateData.category = updates.category;
      if (updates.reminderTime !== undefined) updateData.reminder_time = updates.reminderTime;
      if (updates.dateGreg !== undefined) updateData.date_greg = updates.dateGreg.toISOString();
      if (updates.dateLunar !== undefined) updateData.date_lunar = updates.dateLunar;
      if (updates.type !== undefined) updateData.type = updates.type;

      const { data, error } = await supabase
        .from('lunar_tasks')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        userId: data.user_id,
        dateLunar: data.date_lunar,
        dateGreg: new Date(data.date_greg),
        type: data.type as TaskType,
        title: data.title,
        description: data.description,
        completed: data.completed,
        priority: data.priority,
        category: data.category,
        reminderTime: data.reminder_time,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      } as LunarTask;
    },
    onSuccess: (updatedTask) => {
      // Invalidate and refetch tasks
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['tasks-day', updatedTask.userId, updatedTask.dateLunar] });
      queryClient.invalidateQueries({ queryKey: ['tasks-type', updatedTask.userId, updatedTask.type] });
      
      console.log('✅ Task updated successfully');
    },
    onError: (error) => {
      console.error('❌ Failed to update task:', error);
    }
  });
}

/**
 * Hook to toggle task completion
 */
export function useToggleTask(): UseMutationResult<LunarTask, Error, string> {
  const updateTask = useUpdateTask();

  return useMutation({
    mutationFn: async (taskId) => {
      // First, get the current task to toggle its completion
      const { data: currentTask, error: fetchError } = await supabase
        .from('lunar_tasks')
        .select('completed')
        .eq('id', taskId)
        .single();

      if (fetchError) throw fetchError;

      // Toggle the completion status
      return updateTask.mutateAsync({
        id: taskId,
        updates: { completed: !currentTask.completed }
      });
    }
  });
}

/**
 * Hook to delete a task
 */
export function useDeleteTask(): UseMutationResult<void, Error, string> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskId) => {
      const { error } = await supabase
        .from('lunar_tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;
    },
    onSuccess: () => {
      // Invalidate all task queries
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      
      console.log('✅ Task deleted successfully');
    },
    onError: (error) => {
      console.error('❌ Failed to delete task:', error);
    }
  });
}

/**
 * Hook to get task statistics for a user
 */
export function useTaskStats(
  enabled = true
): UseQueryResult<{
  total: number;
  completed: number;
  pending: number;
  byType: Record<TaskType, number>;
  byPriority: Record<string, number>;
}, Error> {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['task-stats', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('lunar_tasks')
        .select('type, completed, priority')
        .eq('user_id', user.id);

      if (error) throw error;

      const total = data.length;
      const completed = data.filter(task => task.completed).length;
      const pending = total - completed;

      const byType: Record<TaskType, number> = {
        nitya: 0,
        naimittika: 0,
        kamya: 0
      };

      const byPriority: Record<string, number> = {
        low: 0,
        medium: 0,
        high: 0
      };

      data.forEach(task => {
        byType[task.type as TaskType]++;
        byPriority[task.priority]++;
      });

      return {
        total,
        completed,
        pending,
        byType,
        byPriority
      };
    },
    enabled: enabled && !!user,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  });
}

/**
 * Hook to get upcoming tasks (next 7 days)
 */
export function useUpcomingTasks(
  enabled = true
): UseQueryResult<LunarTask[], Error> {
  const today = new Date();
  const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

  return useTasks(today, nextWeek, enabled);
}

/**
 * Hook to get overdue tasks
 */
export function useOverdueTasks(
  enabled = true
): UseQueryResult<LunarTask[], Error> {
  const { user } = useAuth();
  const today = new Date();

  return useQuery({
    queryKey: ['overdue-tasks', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('lunar_tasks')
        .select('*')
        .eq('user_id', user.id)
        .eq('completed', false)
        .lt('date_greg', today.toISOString())
        .order('date_greg', { ascending: true });

      if (error) throw error;

      return (data || []).map(task => ({
        id: task.id,
        userId: task.user_id,
        dateLunar: task.date_lunar,
        dateGreg: new Date(task.date_greg),
        type: task.type as TaskType,
        title: task.title,
        description: task.description,
        completed: task.completed,
        priority: task.priority,
        category: task.category,
        reminderTime: task.reminder_time,
        createdAt: new Date(task.created_at),
        updatedAt: new Date(task.updated_at)
      })) as LunarTask[];
    },
    enabled: enabled && !!user,
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 15, // 15 minutes
  });
} 