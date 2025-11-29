import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, Reorder } from 'motion/react';
import { 
  CheckCircle2, Circle, MapPin, X, Calendar, Target, Trophy, Sparkles, Star, Flag, 
  Edit2, Trash2, Plus, GripVertical, Check, XCircle, MessageCircle, User, ChevronRight,
  SkipForward, Snowflake, Pause
} from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
}

interface SubGoal {
  id: string;
  title: string;
  completed: boolean;
  side: 'left' | 'right';
  tasks: Task[];
}

interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  isCurrent: boolean;
  status?: 'active' | 'skipped' | 'frozen';
  tasks: Task[];
  subGoals: SubGoal[];
  y: number;
}

interface QuestMapProps {
  quest: any;
  onAskAI?: (taskText: string, questName: string, context: string) => void;
  onQuestComplete?: (questId: string) => void;
  onConfirmQuest?: (questId: string) => void;
  onRegenerateQuest?: () => void;
}

export function QuestMap({ quest, onAskAI, onQuestComplete, onConfirmQuest, onRegenerateQuest }: QuestMapProps) {
  const [selectedMilestone, setSelectedMilestone] = useState<string | null>(null);
  const [selectedSubGoal, setSelectedSubGoal] = useState<{ milestoneId: string; subGoalId: string } | null>(null);
  const [editingTask, setEditingTask] = useState<{ parentId: string; taskId: string } | null>(null);
  const [editText, setEditText] = useState('');
  const [editingSubGoal, setEditingSubGoal] = useState<{ milestoneId: string; subGoalId: string } | null>(null);
  const [editSubGoalText, setEditSubGoalText] = useState('');
  const [editingMilestone, setEditingMilestone] = useState<string | null>(null);
  const [editMilestoneText, setEditMilestoneText] = useState('');
  const [celebrationDismissed, setCelebrationDismissed] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    type: 'milestone' | 'subgoal' | 'task';
    id: string;
    parentId?: string;
    title: string;
  } | null>(null);

  // Generate roadmap structure from milestones
  const generateRoadmapStructure = (): Milestone[] => {
    const totalMilestones = quest.milestones.length;
    const completedCount = Math.floor((quest.progress / 100) * totalMilestones);

    return quest.milestones.map((milestone: string, index: number) => {
      const isCompleted = index < completedCount;
      const isCurrent = index === completedCount;
      
      // Vertical spacing - evenly distributed
      const y = 15 + (index / (totalMilestones - 1)) * 70;

      // Generate sub-goals that branch off with their own tasks
      const subGoals: SubGoal[] = [
        {
          id: `${index}-sub-1`,
          title: `Learn Fundamentals`,
          completed: isCompleted,
          side: 'right',
          tasks: [
            {
              id: `${index}-sub-1-task-1`,
              text: `Study core concepts of ${milestone}`,
              completed: isCompleted,
              priority: 'high'
            },
            {
              id: `${index}-sub-1-task-2`,
              text: `Watch tutorial videos`,
              completed: isCompleted,
              priority: 'medium'
            },
            {
              id: `${index}-sub-1-task-3`,
              text: `Take notes and create summary`,
              completed: isCompleted,
              priority: 'low'
            }
          ]
        },
        {
          id: `${index}-sub-2`,
          title: `Practice & Apply`,
          completed: isCompleted,
          side: 'right',
          tasks: [
            {
              id: `${index}-sub-2-task-1`,
              text: `Complete practice exercises`,
              completed: isCompleted,
              priority: 'high'
            },
            {
              id: `${index}-sub-2-task-2`,
              text: `Work on coding challenges`,
              completed: isCompleted,
              priority: 'medium'
            },
            {
              id: `${index}-sub-2-task-3`,
              text: `Review and debug solutions`,
              completed: isCompleted,
              priority: 'low'
            }
          ]
        },
        {
          id: `${index}-sub-3`,
          title: `Build Project`,
          completed: isCompleted,
          side: 'right',
          tasks: [
            {
              id: `${index}-sub-3-task-1`,
              text: `Plan project structure`,
              completed: isCompleted,
              priority: 'high'
            },
            {
              id: `${index}-sub-3-task-2`,
              text: `Implement core features`,
              completed: isCompleted,
              priority: 'high'
            },
            {
              id: `${index}-sub-3-task-3`,
              text: `Test and deploy project`,
              completed: isCompleted,
              priority: 'medium'
            }
          ]
        }
      ];

      // Generate tasks for the milestone itself
      const tasks: Task[] = [
        {
          id: `${index}-task-1`,
          text: `Complete: ${milestone}`,
          completed: isCompleted,
          priority: 'high'
        },
        {
          id: `${index}-task-2`,
          text: `Review progress and document learnings`,
          completed: isCompleted,
          priority: 'medium'
        },
        {
          id: `${index}-task-3`,
          text: `Share insights with community`,
          completed: isCompleted,
          priority: 'low'
        }
      ];

      return {
        id: `milestone-${index}`,
        title: milestone,
        completed: isCompleted,
        isCurrent,
        tasks,
        subGoals,
        y
      };
    });
  };

  const [milestones, setMilestones] = useState<Milestone[]>(generateRoadmapStructure());

  // Reset milestones when quest changes
  useEffect(() => {
    setMilestones(generateRoadmapStructure());
    setSelectedMilestone(null);
    setSelectedSubGoal(null);
    setEditingTask(null);
    setEditingSubGoal(null);
    setEditingMilestone(null);
    setCelebrationDismissed(false);
    setDeleteConfirmation(null);
  }, [quest.id]);

  // Task management functions for milestones
  const toggleTaskComplete = (milestoneId: string, taskId: string) => {
    setMilestones(prev => prev.map(m => {
      if (m.id === milestoneId) {
        const updatedTasks = m.tasks.map(task =>
          task.id === taskId ? { ...task, completed: !task.completed } : task
        );
        const allSubGoalsComplete = m.subGoals.every(sg => sg.completed);
        // Milestone is complete when all subgoals are complete
        // (milestone overview tasks are optional and don't block progress)
        const allComplete = allSubGoalsComplete;
        return { ...m, tasks: updatedTasks, completed: allComplete };
      }
      return m;
    }).map((m, index, array) => {
      // Recalculate isCurrent for each milestone based on completion status
      // Find the first incomplete milestone (excluding skipped ones)
      const firstIncompleteIndex = array.findIndex(milestone => !milestone.completed && milestone.status !== 'skipped');
      return {
        ...m,
        isCurrent: index === firstIncompleteIndex && firstIncompleteIndex !== -1
      };
    }));
  };

  // Task management functions for subgoals
  const toggleSubGoalTaskComplete = (milestoneId: string, subGoalId: string, taskId: string) => {
    setMilestones(prev => prev.map(m => {
      if (m.id === milestoneId) {
        const updatedSubGoals = m.subGoals.map(sg => {
          if (sg.id === subGoalId) {
            const updatedTasks = sg.tasks.map(task =>
              task.id === taskId ? { ...task, completed: !task.completed } : task
            );
            const allComplete = updatedTasks.every(t => t.completed);
            return { ...sg, tasks: updatedTasks, completed: allComplete };
          }
          return sg;
        });
        
        // Update milestone completion based on all subgoals only
        // (milestone overview tasks are optional and don't block progress)
        const allSubGoalsComplete = updatedSubGoals.every(sg => sg.completed);
        const allComplete = allSubGoalsComplete;
        
        return { ...m, subGoals: updatedSubGoals, completed: allComplete };
      }
      return m;
    }).map((m, index, array) => {
      // Recalculate isCurrent for each milestone based on completion status
      // Find the first incomplete milestone (excluding skipped ones)
      const firstIncompleteIndex = array.findIndex(milestone => !milestone.completed && milestone.status !== 'skipped');
      return {
        ...m,
        isCurrent: index === firstIncompleteIndex && firstIncompleteIndex !== -1
      };
    }));
  };

  const startEditTask = (parentId: string, taskId: string, currentText: string) => {
    setEditingTask({ parentId, taskId });
    setEditText(currentText);
  };

  const saveEditTask = (parentId: string, taskId: string, isSubGoal: boolean = false) => {
    if (editText.trim()) {
      if (isSubGoal && selectedSubGoal) {
        setMilestones(prev => prev.map(m =>
          m.id === selectedSubGoal.milestoneId ? {
            ...m,
            subGoals: m.subGoals.map(sg =>
              sg.id === selectedSubGoal.subGoalId ? {
                ...sg,
                tasks: sg.tasks.map(task =>
                  task.id === taskId ? { ...task, text: editText.trim() } : task
                )
              } : sg
            )
          } : m
        ));
      } else {
        setMilestones(prev => prev.map(m =>
          m.id === parentId ? {
            ...m,
            tasks: m.tasks.map(task =>
              task.id === taskId ? { ...task, text: editText.trim() } : task
            )
          } : m
        ));
      }
    }
    setEditingTask(null);
    setEditText('');
  };

  const deleteTask = (parentId: string, taskId: string, isSubGoal: boolean = false) => {
    let taskTitle = '';
    if (isSubGoal && selectedSubGoal) {
      const milestone = milestones.find(m => m.id === selectedSubGoal.milestoneId);
      const subGoal = milestone?.subGoals.find(sg => sg.id === selectedSubGoal.subGoalId);
      const task = subGoal?.tasks.find(t => t.id === taskId);
      taskTitle = task?.text || '';
    } else {
      const milestone = milestones.find(m => m.id === parentId);
      const task = milestone?.tasks.find(t => t.id === taskId);
      taskTitle = task?.text || '';
    }
    
    setDeleteConfirmation({
      type: 'task',
      id: taskId,
      parentId: parentId,
      title: taskTitle
    });
  };

  const confirmDeleteTask = (parentId: string, taskId: string, isSubGoal: boolean = false) => {
    if (isSubGoal && selectedSubGoal) {
      setMilestones(prev => prev.map(m => {
        if (m.id === selectedSubGoal.milestoneId) {
          const updatedSubGoals = m.subGoals.map(sg => {
            if (sg.id === selectedSubGoal.subGoalId) {
              const updatedTasks = sg.tasks.filter(task => task.id !== taskId);
              const allComplete = updatedTasks.every(t => t.completed);
              return { ...sg, tasks: updatedTasks, completed: allComplete };
            }
            return sg;
          });
          
          // Update milestone completion based on all subgoals only
          // (milestone overview tasks are optional and don't block progress)
          const allSubGoalsComplete = updatedSubGoals.every(sg => sg.completed);
          const allComplete = allSubGoalsComplete;
          
          return { ...m, subGoals: updatedSubGoals, completed: allComplete };
        }
        return m;
      }).map((m, index, array) => {
        // Recalculate isCurrent for each milestone
        const firstIncompleteIndex = array.findIndex(milestone => !milestone.completed && milestone.status !== 'skipped');
        return {
          ...m,
          isCurrent: index === firstIncompleteIndex && firstIncompleteIndex !== -1
        };
      }));
    } else {
      setMilestones(prev => prev.map(m => {
        if (m.id === parentId) {
          const updatedTasks = m.tasks.filter(task => task.id !== taskId);
          const allTasksComplete = updatedTasks.every(t => t.completed);
          const allSubGoalsComplete = m.subGoals.every(sg => sg.completed);
          const allComplete = allTasksComplete && allSubGoalsComplete;
          return { ...m, tasks: updatedTasks, completed: allComplete };
        }
        return m;
      }).map((m, index, array) => {
        // Recalculate isCurrent for each milestone
        const firstIncompleteIndex = array.findIndex(milestone => !milestone.completed && milestone.status !== 'skipped');
        return {
          ...m,
          isCurrent: index === firstIncompleteIndex && firstIncompleteIndex !== -1
        };
      }));
    }
    setDeleteConfirmation(null);
  };

  const addNewTask = (parentId: string, isSubGoal: boolean = false) => {
    const newTask: Task = {
      id: `${parentId}-${Date.now()}`,
      text: 'New task',
      completed: false,
      priority: 'medium'
    };
    
    if (isSubGoal && selectedSubGoal) {
      setMilestones(prev => prev.map(m => {
        if (m.id === selectedSubGoal.milestoneId) {
          const updatedSubGoals = m.subGoals.map(sg =>
            sg.id === selectedSubGoal.subGoalId ? {
              ...sg,
              tasks: [...sg.tasks, newTask],
              completed: false // Adding incomplete task makes subgoal incomplete
            } : sg
          );
          // Recalculate milestone completion
          const allSubGoalsComplete = updatedSubGoals.every(sg => sg.completed);
          return { ...m, subGoals: updatedSubGoals, completed: allSubGoalsComplete };
        }
        return m;
      }).map((m, index, array) => {
        // Recalculate isCurrent for each milestone
        const firstIncompleteIndex = array.findIndex(milestone => !milestone.completed && milestone.status !== 'skipped');
        return {
          ...m,
          isCurrent: index === firstIncompleteIndex && firstIncompleteIndex !== -1
        };
      }));
    } else {
      setMilestones(prev => prev.map(m =>
        m.id === parentId ? {
          ...m,
          tasks: [...m.tasks, newTask]
        } : m
      ));
    }
    startEditTask(parentId, newTask.id, newTask.text);
  };

  const changePriority = (parentId: string, taskId: string, isSubGoal: boolean = false) => {
    const priorities: Array<'high' | 'medium' | 'low'> = ['high', 'medium', 'low'];
    
    if (isSubGoal && selectedSubGoal) {
      setMilestones(prev => prev.map(m => {
        if (m.id === selectedSubGoal.milestoneId) {
          return {
            ...m,
            subGoals: m.subGoals.map(sg => {
              if (sg.id === selectedSubGoal.subGoalId) {
                return {
                  ...sg,
                  tasks: sg.tasks.map(task => {
                    if (task.id === taskId) {
                      const currentIndex = priorities.indexOf(task.priority);
                      const nextPriority = priorities[(currentIndex + 1) % 3];
                      return { ...task, priority: nextPriority };
                    }
                    return task;
                  })
                };
              }
              return sg;
            })
          };
        }
        return m;
      }));
    } else {
      setMilestones(prev => prev.map(m => {
        if (m.id === parentId) {
          return {
            ...m,
            tasks: m.tasks.map(task => {
              if (task.id === taskId) {
                const currentIndex = priorities.indexOf(task.priority);
                const nextPriority = priorities[(currentIndex + 1) % 3];
                return { ...task, priority: nextPriority };
              }
              return task;
            })
          };
        }
        return m;
      }));
    }
  };

  const reorderTasks = (parentId: string, newOrder: Task[], isSubGoal: boolean = false) => {
    if (isSubGoal && selectedSubGoal) {
      setMilestones(prev => prev.map(m =>
        m.id === selectedSubGoal.milestoneId ? {
          ...m,
          subGoals: m.subGoals.map(sg =>
            sg.id === selectedSubGoal.subGoalId ? { ...sg, tasks: newOrder } : sg
          )
        } : m
      ));
    } else {
      setMilestones(prev => prev.map(m =>
        m.id === parentId ? { ...m, tasks: newOrder } : m
      ));
    }
  };

  // SubGoal management functions
  const addNewSubGoal = (milestoneId: string) => {
    const newSubGoal: SubGoal = {
      id: `${milestoneId}-sub-${Date.now()}`,
      title: 'New Subgoal',
      completed: false,
      side: 'right',
      tasks: [
        {
          id: `${milestoneId}-sub-${Date.now()}-task-1`,
          text: 'First task',
          completed: false,
          priority: 'medium'
        }
      ]
    };
    
    setMilestones(prev => prev.map(m => {
      if (m.id === milestoneId) {
        const updatedSubGoals = [...m.subGoals, newSubGoal];
        // Recalculate milestone completion - adding incomplete subgoal makes milestone incomplete
        // (milestone overview tasks are optional and don't block progress)
        const allSubGoalsComplete = updatedSubGoals.every(sg => sg.completed);
        const allComplete = allSubGoalsComplete;
        return { ...m, subGoals: updatedSubGoals, completed: allComplete };
      }
      return m;
    }).map((m, index, array) => {
      // Recalculate isCurrent for each milestone
      const firstIncompleteIndex = array.findIndex(milestone => !milestone.completed && milestone.status !== 'skipped');
      return {
        ...m,
        isCurrent: index === firstIncompleteIndex && firstIncompleteIndex !== -1
      };
    }));
    
    // Auto-edit the new subgoal
    setEditingSubGoal({ milestoneId, subGoalId: newSubGoal.id });
    setEditSubGoalText(newSubGoal.title);
  };

  const startEditSubGoal = (milestoneId: string, subGoalId: string, currentTitle: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingSubGoal({ milestoneId, subGoalId });
    setEditSubGoalText(currentTitle);
  };

  const saveEditSubGoal = (milestoneId: string, subGoalId: string) => {
    if (editSubGoalText.trim()) {
      setMilestones(prev => prev.map(m =>
        m.id === milestoneId ? {
          ...m,
          subGoals: m.subGoals.map(sg =>
            sg.id === subGoalId ? { ...sg, title: editSubGoalText.trim() } : sg
          )
        } : m
      ));
    }
    setEditingSubGoal(null);
    setEditSubGoalText('');
  };

  const deleteSubGoal = (milestoneId: string, subGoalId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const milestone = milestones.find(m => m.id === milestoneId);
    const subGoal = milestone?.subGoals.find(sg => sg.id === subGoalId);
    if (subGoal) {
      setDeleteConfirmation({
        type: 'subgoal',
        id: subGoalId,
        parentId: milestoneId,
        title: subGoal.title
      });
    }
  };

  const confirmDeleteSubGoal = (milestoneId: string, subGoalId: string) => {
    setMilestones(prev => prev.map(m => {
      if (m.id === milestoneId) {
        const updatedSubGoals = m.subGoals.filter(sg => sg.id !== subGoalId);
        // Update milestone completion based on remaining subgoals only
        // (milestone overview tasks are optional and don't block progress)
        const allSubGoalsComplete = updatedSubGoals.every(sg => sg.completed);
        const allComplete = allSubGoalsComplete;
        return { ...m, subGoals: updatedSubGoals, completed: allComplete };
      }
      return m;
    }).map((m, index, array) => {
      // Recalculate isCurrent for each milestone
      const firstIncompleteIndex = array.findIndex(milestone => !milestone.completed && milestone.status !== 'skipped');
      return {
        ...m,
        isCurrent: index === firstIncompleteIndex && firstIncompleteIndex !== -1
      };
    }));
    setDeleteConfirmation(null);
  };

  // Milestone management functions
  const startEditMilestone = (milestoneId: string, currentTitle: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingMilestone(milestoneId);
    setEditMilestoneText(currentTitle);
  };

  const saveEditMilestone = (milestoneId: string) => {
    if (editMilestoneText.trim()) {
      setMilestones(prev => prev.map(m =>
        m.id === milestoneId ? { ...m, title: editMilestoneText.trim() } : m
      ));
    }
    setEditingMilestone(null);
    setEditMilestoneText('');
  };

  const deleteMilestone = (milestoneId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const milestone = milestones.find(m => m.id === milestoneId);
    if (milestone) {
      setDeleteConfirmation({
        type: 'milestone',
        id: milestoneId,
        title: milestone.title
      });
    }
  };

  const confirmDeleteMilestone = (milestoneId: string) => {
    setMilestones(prev => {
      const filtered = prev.filter(m => m.id !== milestoneId);
      
      // Recalculate isCurrent for remaining milestones
      return filtered.map((m, index, array) => {
        const firstIncompleteIndex = array.findIndex(milestone => !milestone.completed && milestone.status !== 'skipped');
        return {
          ...m,
          isCurrent: index === firstIncompleteIndex && firstIncompleteIndex !== -1
        };
      });
    });
    setDeleteConfirmation(null);
  };

  const addMilestoneAfter = (afterIndex: number) => {
    const newMilestone: Milestone = {
      id: `milestone-${Date.now()}`,
      title: 'New Milestone',
      completed: false,
      isCurrent: false,
      tasks: [
        {
          id: `milestone-${Date.now()}-task-1`,
          text: 'First task',
          completed: false,
          priority: 'medium'
        }
      ],
      subGoals: [
        {
          id: `milestone-${Date.now()}-sub-1`,
          title: 'New Subgoal',
          completed: false,
          side: 'right',
          tasks: [
            {
              id: `milestone-${Date.now()}-sub-1-task-1`,
              text: 'First subtask',
              completed: false,
              priority: 'medium'
            }
          ]
        }
      ],
      y: 0
    };

    setMilestones(prev => {
      const newMilestones = [...prev];
      newMilestones.splice(afterIndex + 1, 0, newMilestone);
      
      // Recalculate y positions and isCurrent
      const totalMilestones = newMilestones.length;
      return newMilestones.map((m, idx, array) => {
        const firstIncompleteIndex = array.findIndex(milestone => !milestone.completed && milestone.status !== 'skipped');
        return {
          ...m,
          y: 15 + (idx / (totalMilestones - 1)) * 70,
          isCurrent: idx === firstIncompleteIndex && firstIncompleteIndex !== -1
        };
      });
    });

    // Auto-edit the new milestone
    setEditingMilestone(newMilestone.id);
    setEditMilestoneText(newMilestone.title);
  };

  const skipMilestone = (milestoneId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setMilestones(prev => prev.map(m =>
      m.id === milestoneId ? { ...m, status: m.status === 'skipped' ? 'active' : 'skipped' as 'active' | 'skipped' | 'frozen' } : m
    ).map((m, index, array) => {
      // Recalculate isCurrent after skipping/unskipping
      const firstIncompleteIndex = array.findIndex(milestone => !milestone.completed && milestone.status !== 'skipped');
      return {
        ...m,
        isCurrent: index === firstIncompleteIndex && firstIncompleteIndex !== -1
      };
    }));
  };

  const freezeMilestone = (milestoneId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setMilestones(prev => prev.map(m =>
      m.id === milestoneId ? { ...m, status: m.status === 'frozen' ? 'active' : 'frozen' as 'active' | 'skipped' | 'frozen' } : m
    ).map((m, index, array) => {
      // Recalculate isCurrent after freezing/unfreezing
      const firstIncompleteIndex = array.findIndex(milestone => !milestone.completed && milestone.status !== 'skipped');
      return {
        ...m,
        isCurrent: index === firstIncompleteIndex && firstIncompleteIndex !== -1
      };
    }));
  };

  const handleReorder = (newOrder: Milestone[]) => {
    // Recalculate y positions and isCurrent
    const totalMilestones = newOrder.length;
    const reordered = newOrder.map((m, idx, array) => {
      const firstIncompleteIndex = array.findIndex(milestone => !milestone.completed && milestone.status !== 'skipped');
      return {
        ...m,
        y: 15 + (idx / (totalMilestones - 1)) * 70,
        isCurrent: idx === firstIncompleteIndex && firstIncompleteIndex !== -1
      };
    });
    setMilestones(reordered);
  };

  const handleSubGoalsReorder = (milestoneId: string, newOrder: SubGoal[]) => {
    setMilestones(prev => prev.map(m =>
      m.id === milestoneId ? { ...m, subGoals: newOrder } : m
    ));
  };

  const toggleMilestoneComplete = (milestoneId: string) => {
    setMilestones(prev => {
      const updatedMilestones = prev.map(m => {
        if (m.id === milestoneId) {
          return { ...m, completed: !m.completed };
        }
        return m;
      });

      // Move avatar to next incomplete milestone
      const completedIndex = updatedMilestones.findIndex(m => m.id === milestoneId);
      if (completedIndex !== -1 && updatedMilestones[completedIndex].completed) {
        // Find next incomplete milestone (excluding skipped ones)
        const nextIncomplete = updatedMilestones.findIndex((m, idx) => 
          idx > completedIndex && !m.completed && m.status !== 'skipped'
        );
        
        return updatedMilestones.map((m, idx) => ({
          ...m,
          isCurrent: nextIncomplete !== -1 ? idx === nextIncomplete : m.isCurrent
        }));
      }

      return updatedMilestones;
    });
  };

  const addSubGoalAfter = (milestoneId: string, afterIndex: number) => {
    const newSubGoal: SubGoal = {
      id: `subgoal-${Date.now()}`,
      title: 'New Subgoal',
      completed: false,
      side: 'right',
      tasks: [
        {
          id: `subgoal-${Date.now()}-task-1`,
          text: 'First task',
          completed: false,
          priority: 'medium'
        }
      ]
    };

    setMilestones(prev => prev.map(m =>
      m.id === milestoneId ? {
        ...m,
        subGoals: [
          ...m.subGoals.slice(0, afterIndex + 1),
          newSubGoal,
          ...m.subGoals.slice(afterIndex + 1)
        ]
      } : m
    ));

    // Auto-edit the new subgoal
    setEditingSubGoal({ milestoneId, subGoalId: newSubGoal.id });
    setEditSubGoalText(newSubGoal.title);
  };

  const getPriorityColor = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'low': return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const getPriorityIcon = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '⚪';
    }
  };

  const getProgress = (milestone: Milestone) => {
    const completed = milestone.subGoals.filter(sg => sg.completed).length;
    return Math.round((completed / milestone.subGoals.length) * 100);
  };

  const selectedMilestoneData = milestones.find(m => m.id === selectedMilestone);
  const selectedSubGoalData = selectedSubGoal ? 
    milestones.find(m => m.id === selectedSubGoal.milestoneId)?.subGoals.find(sg => sg.id === selectedSubGoal.subGoalId) : 
    null;

  // Check if ALL subgoals in ALL milestones are complete
  const allSubGoalsComplete = milestones.every(m => 
    m.subGoals.length > 0 && m.subGoals.every(sg => sg.completed)
  );

  return (
    <>
      <div className="w-full bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-8 shadow-2xl overflow-x-auto">
        {/* Confirmation Banner - Shows when quest is not confirmed */}
        {!quest.confirmed && onConfirmQuest && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 bg-white/80 backdrop-blur-sm border-2 border-indigo-200 rounded-xl p-5 shadow-lg"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-slate-900 mb-1">AI-Generated Quest Map</h3>
                <p className="text-sm text-slate-600">
                  Please review the generated plan below. The AI has broken down your goal into milestones, subgoals, and tasks. 
                  Scroll through and confirm when you're ready to start your journey.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Header */}
        <div className="mb-12 text-center">
          <motion.div 
            className="inline-flex items-center gap-4 bg-white px-8 py-5 rounded-2xl shadow-xl border-4 border-indigo-500"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 150 }}
          >
            <Trophy className="w-10 h-10 text-indigo-500" />
            <h1 className="text-3xl text-gray-900">{quest.name}</h1>
          </motion.div>
        </div>

        {/* Legend */}
        <motion.div 
          className="mb-10 flex justify-center gap-8 text-sm"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-yellow-400 border-2 border-yellow-600"></div>
            <span className="text-gray-600 font-medium">Upcoming</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500 border-2 border-green-700"></div>
            <span className="text-gray-600 font-medium">Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-blue-400 animate-pulse border-2 border-blue-600"></div>
            <span className="text-gray-600 font-medium">Current Focus</span>
          </div>
        </motion.div>

        {/* Roadmap */}
        <Reorder.Group axis="y" values={milestones} onReorder={handleReorder} className="max-w-6xl mx-auto">
          {milestones.map((milestone, idx) => {
            const isCompleted = milestone.completed;
            const isCurrent = milestone.isCurrent;
            const progress = getProgress(milestone);
            const isSkipped = milestone.status === 'skipped';
            const isFrozen = milestone.status === 'frozen';
            const isLastStep = idx === milestones.length - 1;

            return (
              <Reorder.Item 
                key={milestone.id}
                value={milestone}
                className="mb-16 last:mb-0"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1, type: 'spring' }}
              >
                {/* Milestone Row */}
                <div className="flex items-start gap-8 relative">
                  {/* Drag Handle - Left side */}
                  <div className="flex flex-col items-center pt-6 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity -ml-6">
                    <GripVertical className="w-5 h-5 text-gray-400" />
                  </div>

                  {/* Left: Milestone Icon Box */}
                  <div className="flex flex-col items-center flex-shrink-0 group/milestone">
                    <div className="relative">
                      {/* Status badges */}
                      {isSkipped && (
                        <Badge className="absolute -top-3 -left-3 z-10 bg-orange-500 text-white text-[10px] px-1.5 py-0.5">
                          Skipped
                        </Badge>
                      )}
                      {isFrozen && (
                        <Badge className="absolute -top-3 -left-3 z-10 bg-blue-400 text-white text-[10px] px-1.5 py-0.5">
                          Frozen
                        </Badge>
                      )}
                      {isLastStep && !isSkipped && !isFrozen && (
                        <Badge className="absolute -top-3 -left-3 z-10 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-[10px] px-2 py-0.5 shadow-lg">
                          🏁 FINAL STEP
                        </Badge>
                      )}

                      <motion.div
                        className={`relative w-20 h-20 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden ${
                          isSkipped
                            ? 'bg-gradient-to-br from-orange-300 via-orange-400 to-orange-500 shadow-lg shadow-orange-400/30 opacity-60'
                            : isFrozen
                            ? 'bg-gradient-to-br from-blue-300 via-blue-400 to-blue-500 shadow-lg shadow-blue-400/30'
                            : isCompleted 
                            ? isLastStep 
                              ? 'bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-500 shadow-2xl shadow-yellow-500/60'
                              : 'bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 shadow-xl shadow-green-500/40'
                            : isCurrent
                            ? isLastStep
                              ? 'bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 shadow-2xl shadow-orange-500/60'
                              : 'bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 shadow-2xl shadow-blue-500/50'
                            : isLastStep
                            ? 'bg-gradient-to-br from-amber-300 via-yellow-400 to-orange-400 shadow-xl shadow-amber-500/50'
                            : 'bg-gradient-to-br from-yellow-300 via-amber-400 to-orange-500 shadow-xl shadow-yellow-500/40'
                        }`}
                        whileHover={{ scale: 1.05, rotate: 3 }}
                        whileTap={{ scale: 0.95 }}
                        animate={isCurrent ? {
                          scale: [1, 1.05, 1],
                        } : {}}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {/* Background decoration */}
                        <div className="absolute inset-0 bg-white/10" />
                        <motion.div
                          className="absolute -top-2 -right-2 w-12 h-12 bg-white/20 rounded-full blur-xl"
                          animate={{
                            scale: [1, 1.3, 1],
                            opacity: [0.3, 0.6, 0.3]
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                        
                        {/* Sparkles for last step */}
                        {isLastStep && (
                          <>
                            <motion.div
                              className="absolute top-1 left-1"
                              animate={{
                                scale: [0, 1, 0],
                                rotate: [0, 180, 360],
                                opacity: [0, 1, 0]
                              }}
                              transition={{ duration: 2, repeat: Infinity, delay: 0 }}
                            >
                              <Sparkles className="w-3 h-3 text-yellow-200" />
                            </motion.div>
                            <motion.div
                              className="absolute bottom-1 right-1"
                              animate={{
                                scale: [0, 1, 0],
                                rotate: [0, -180, -360],
                                opacity: [0, 1, 0]
                              }}
                              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                            >
                              <Sparkles className="w-3 h-3 text-yellow-200" />
                            </motion.div>
                          </>
                        )}
                        
                        {/* Step number or checkmark */}
                        <div className="relative z-10 flex flex-col items-center">
                          {isCompleted ? (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1, rotate: 360 }}
                              transition={{ type: 'spring', stiffness: 200 }}
                            >
                              <div className="w-8 h-8 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center mb-1">
                                {isLastStep ? (
                                  <Trophy className="w-5 h-5 text-white" />
                                ) : (
                                  <div className="w-4 h-4 border-l-3 border-b-3 border-white transform rotate-[-45deg] translate-y-[-2px]" />
                                )}
                              </div>
                            </motion.div>
                          ) : (
                            <>
                              {isLastStep ? (
                                <Flag className="w-7 h-7 text-white drop-shadow-lg mb-1" />
                              ) : (
                                <span className="text-3xl font-bold text-white drop-shadow-lg">
                                  {idx + 1}
                                </span>
                              )}
                            </>
                          )}
                          <span className="text-[8px] uppercase tracking-wider text-white/90 font-semibold mt-0.5">
                            {isCompleted ? (isLastStep ? 'Victory!' : 'Done') : isCurrent ? (isLastStep ? 'Final!' : 'Active') : (isLastStep ? 'Finish' : 'Step')}
                          </span>
                        </div>
                        
                        {isCurrent && (
                          <motion.div 
                            className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full shadow-lg flex items-center justify-center"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.5, type: 'spring' }}
                          >
                            <motion.div
                              className="w-2 h-2 bg-white rounded-full"
                              animate={{ scale: [1, 1.3, 1] }}
                              transition={{ duration: 1, repeat: Infinity }}
                            />
                          </motion.div>
                        )}
                      </motion.div>

                      {/* Hover action buttons for milestone */}
                      <div className="absolute -right-20 top-0 flex flex-col gap-1 opacity-0 group-hover/milestone:opacity-100 transition-opacity z-20">
                        {onAskAI && (
                          <motion.button
                            onClick={(e) => {
                              e.stopPropagation();
                              onAskAI(milestone.title, quest.name, 'milestone');
                            }}
                            className="p-1.5 hover:bg-indigo-100 rounded-md transition-colors bg-white shadow-md"
                            whileHover={{ scale: 1.15 }}
                            whileTap={{ scale: 0.9 }}
                            title="Ask AI about this milestone"
                          >
                            <MessageCircle className="w-3.5 h-3.5 text-indigo-600" />
                          </motion.button>
                        )}
                        <motion.button
                          onClick={(e) => startEditMilestone(milestone.id, milestone.title, e)}
                          className="p-1.5 hover:bg-slate-200 rounded-md transition-colors bg-white shadow-md"
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.9 }}
                          title="Edit milestone"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-slate-600" />
                        </motion.button>
                        <motion.button
                          onClick={(e) => skipMilestone(milestone.id, e)}
                          className={`p-1.5 hover:bg-orange-100 rounded-md transition-colors ${isSkipped ? 'bg-orange-100' : 'bg-white'} shadow-md`}
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.9 }}
                          title={isSkipped ? 'Unskip milestone' : 'Skip milestone'}
                        >
                          <SkipForward className="w-3.5 h-3.5 text-orange-600" />
                        </motion.button>
                        <motion.button
                          onClick={(e) => freezeMilestone(milestone.id, e)}
                          className={`p-1.5 hover:bg-blue-100 rounded-md transition-colors ${isFrozen ? 'bg-blue-100' : 'bg-white'} shadow-md`}
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.9 }}
                          title={isFrozen ? 'Unfreeze milestone' : 'Freeze milestone'}
                        >
                          <Snowflake className="w-3.5 h-3.5 text-blue-600" />
                        </motion.button>
                        <motion.button
                          onClick={(e) => deleteMilestone(milestone.id, e)}
                          className="p-1.5 hover:bg-red-100 rounded-md transition-colors bg-white shadow-md"
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.9 }}
                          title="Delete milestone"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-red-500" />
                        </motion.button>
                      </div>
                    </div>

                    {/* Avatar indicator at current position */}
                    {isCurrent && (
                      <motion.div
                        className="mt-3"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.7, type: 'spring' }}
                      >
                        <motion.div
                          className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 via-pink-500 to-rose-500 border-2 border-white shadow-xl flex items-center justify-center text-white text-lg"
                          animate={{
                            y: [0, -6, 0],
                            boxShadow: [
                              '0 4px 20px rgba(249, 115, 22, 0.4)',
                              '0 6px 30px rgba(236, 72, 153, 0.5)',
                              '0 4px 20px rgba(249, 115, 22, 0.4)'
                            ]
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          👤
                        </motion.div>
                      </motion.div>
                    )}

                    {/* Progress Bar */}
                    {!isCompleted && (
                      <motion.div 
                        className={`${isCurrent ? 'mt-2' : 'mt-4'} w-20`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        <div className="h-2 bg-white/20 rounded-full overflow-hidden shadow-inner backdrop-blur-sm">
                          <motion.div 
                            className={`h-full transition-all ${isCurrent ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-gradient-to-r from-indigo-500 to-blue-500'}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                          />
                        </div>
                        <p className="text-xs text-center text-gray-700 mt-1 font-bold">{progress}%</p>
                      </motion.div>
                    )}

                    {/* Connecting Line with Insert Button */}
                    {idx < milestones.length - 1 && (
                      <div className="relative group/connector my-5">
                        <motion.div 
                          className="w-1 h-20 bg-gradient-to-b from-gray-400 to-gray-300 rounded-full"
                          initial={{ height: 0 }}
                          animate={{ height: 80 }}
                          transition={{ delay: 0.3 + idx * 0.1 }}
                        />
                        {/* Insert milestone button */}
                        <motion.button
                          onClick={() => addMilestoneAfter(idx)}
                          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-7 h-7 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover/connector:opacity-100 transition-all"
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          title="Insert milestone here"
                        >
                          <Plus className="w-4 h-4" />
                        </motion.button>
                      </div>
                    )}
                  </div>

                  {/* Right: Milestone Content */}
                  <div className="flex-1 min-w-0">
                    {editingMilestone === milestone.id ? (
                      <div className="flex items-center gap-2 mb-5">
                        <Input
                          value={editMilestoneText}
                          onChange={(e) => setEditMilestoneText(e.target.value)}
                          className="h-10 text-xl"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') saveEditMilestone(milestone.id);
                            if (e.key === 'Escape') setEditingMilestone(null);
                          }}
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-10 w-10 p-0"
                          onClick={() => saveEditMilestone(milestone.id)}
                        >
                          <Check className="w-5 h-5 text-emerald-600" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-10 w-10 p-0"
                          onClick={() => setEditingMilestone(null)}
                        >
                          <XCircle className="w-5 h-5 text-slate-400" />
                        </Button>
                      </div>
                    ) : (
                      <motion.h2 
                        className="text-xl text-gray-900 mb-5"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        {milestone.title}
                      </motion.h2>
                    )}

                    {/* Branch Cards Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      {milestone.subGoals.map((branch, branchIdx) => (
                        <div 
                          key={branch.id}
                          className="relative group/subgoal-container"
                        >
                          <motion.div
                            className={`group/branch relative p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-lg ${
                              branch.completed
                                ? 'bg-green-50 border-green-500'
                                : 'bg-white border-gray-300 hover:border-indigo-400 hover:bg-indigo-50/30'
                            }`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + branchIdx * 0.05 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              if (!editingSubGoal || editingSubGoal.subGoalId !== branch.id) {
                                setSelectedSubGoal({ milestoneId: milestone.id, subGoalId: branch.id });
                              }
                            }}
                          >
                          {/* Action buttons on hover */}
                          <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover/branch:opacity-100 transition-opacity z-10">
                            {onAskAI && (
                              <motion.button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onAskAI(branch.title, quest.name, milestone.title);
                                }}
                                className="p-1.5 hover:bg-indigo-100 rounded-md transition-colors bg-white shadow-sm"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                title="Ask AI about this subgoal"
                              >
                                <MessageCircle className="w-3.5 h-3.5 text-indigo-600" />
                              </motion.button>
                            )}
                            <motion.button
                              onClick={(e) => startEditSubGoal(milestone.id, branch.id, branch.title, e)}
                              className="p-1.5 hover:bg-slate-200 rounded-md transition-colors bg-white shadow-sm"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              title="Edit subgoal"
                            >
                              <Edit2 className="w-3.5 h-3.5 text-slate-600" />
                            </motion.button>
                            <motion.button
                              onClick={(e) => deleteSubGoal(milestone.id, branch.id, e)}
                              className="p-1.5 hover:bg-red-100 rounded-md transition-colors bg-white shadow-sm"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              title="Delete subgoal"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-red-500" />
                            </motion.button>
                          </div>

                          <div className="flex items-start justify-between">
                            {editingSubGoal?.milestoneId === milestone.id && editingSubGoal?.subGoalId === branch.id ? (
                              <div className="flex items-center gap-2 flex-1 mr-2" onClick={(e) => e.stopPropagation()}>
                                <Input
                                  value={editSubGoalText}
                                  onChange={(e) => setEditSubGoalText(e.target.value)}
                                  className="h-8 text-sm"
                                  autoFocus
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') saveEditSubGoal(milestone.id, branch.id);
                                    if (e.key === 'Escape') setEditingSubGoal(null);
                                  }}
                                />
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 w-8 p-0"
                                  onClick={() => saveEditSubGoal(milestone.id, branch.id)}
                                >
                                  <Check className="w-4 h-4 text-emerald-600" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 w-8 p-0"
                                  onClick={() => setEditingSubGoal(null)}
                                >
                                  <XCircle className="w-4 h-4 text-slate-400" />
                                </Button>
                              </div>
                            ) : (
                              <>
                                <h3 className="font-semibold text-gray-900 pr-2 text-sm">{branch.title}</h3>
                                {branch.completed ? (
                                  <Check className="w-4 h-4 text-green-600 flex-shrink-0" strokeWidth={3} />
                                ) : (
                                  <Circle className="w-4 h-4 text-gray-400 flex-shrink-0 group-hover/branch:text-indigo-500 transition-colors" />
                                )}
                              </>
                            )}
                          </div>
                          {!editingSubGoal || editingSubGoal.subGoalId !== branch.id ? (
                            <p className="text-xs text-gray-500 mt-1.5">
                              {branch.tasks.filter(t => t.completed).length}/{branch.tasks.length} tasks • Click to view
                            </p>
                          ) : null}
                          </motion.div>
                        </div>
                      ))}
                    </div>

                    {/* Add subgoal button */}
                    <motion.button
                      onClick={() => addNewSubGoal(milestone.id)}
                      className="mt-3 w-full px-4 py-2.5 border-2 border-dashed border-indigo-300 hover:border-indigo-400 hover:bg-indigo-50/50 text-indigo-600 hover:text-indigo-700 text-sm rounded-lg transition-all flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <Plus className="w-4 h-4" />
                      Add New Subgoal
                    </motion.button>
                  </div>
                </div>
              </Reorder.Item>
            );
          })}
        </Reorder.Group>

        {/* Epic Celebration Animation - Only shows when ALL subgoals are complete */}
        {allSubGoalsComplete && !celebrationDismissed && (
          <>
            {/* Confetti burst particles */}
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={`confetti-${i}`}
                className="absolute w-3 h-3 rounded-full pointer-events-none z-50"
                style={{
                  background: [
                    'linear-gradient(135deg, #fbbf24, #f59e0b)',
                    'linear-gradient(135deg, #34d399, #10b981)',
                    'linear-gradient(135deg, #60a5fa, #3b82f6)',
                    'linear-gradient(135deg, #f472b6, #ec4899)',
                    'linear-gradient(135deg, #a78bfa, #8b5cf6)',
                  ][i % 5],
                  left: '50%',
                  top: '50%',
                }}
                initial={{ 
                  x: 0, 
                  y: 0, 
                  scale: 0,
                  opacity: 1
                }}
                animate={{
                  x: Math.cos((i / 50) * Math.PI * 2) * (300 + Math.random() * 400),
                  y: Math.sin((i / 50) * Math.PI * 2) * (300 + Math.random() * 400) - 100,
                  scale: [0, 1.5, 1],
                  opacity: [1, 1, 0],
                  rotate: Math.random() * 720 - 360,
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  repeat: Infinity,
                  repeatDelay: 1,
                  delay: Math.random() * 0.5,
                  ease: 'easeOut'
                }}
              />
            ))}

            {/* Sparkle stars */}
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={`star-${i}`}
                className="absolute pointer-events-none z-50"
                style={{
                  left: `${20 + Math.random() * 60}%`,
                  top: `${20 + Math.random() * 60}%`,
                }}
                initial={{ scale: 0, rotate: 0, opacity: 0 }}
                animate={{
                  scale: [0, 1, 0],
                  rotate: [0, 180, 360],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  repeatDelay: 1 + Math.random(),
                }}
              >
                <Star className="w-6 h-6 text-yellow-400 fill-yellow-300" />
              </motion.div>
            ))}

            {/* Central celebration card */}
            <motion.div
              className="mt-12 text-center relative"
              initial={{ opacity: 0, scale: 0.5, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            >
              {/* Glowing ring effect */}
              <motion.div
                className="absolute inset-0 -m-8 rounded-full bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 blur-3xl opacity-30"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              />

              <div className="relative inline-flex flex-col items-center gap-6 bg-gradient-to-br from-amber-50 via-white to-emerald-50 px-12 py-8 rounded-3xl shadow-2xl border-4 border-transparent bg-clip-padding">
                {/* Animated trophy */}
                <motion.div
                  animate={{
                    rotate: [0, -10, 10, -10, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 1,
                  }}
                >
                  <div className="relative">
                    <Trophy className="w-24 h-24 text-yellow-500 drop-shadow-2xl" />
                    <motion.div
                      className="absolute inset-0 bg-yellow-400 rounded-full blur-2xl opacity-50"
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 0.8, 0.5],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                    />
                  </div>
                </motion.div>

                {/* Success message */}
                <div className="space-y-2">
                  <motion.h2
                    className="text-4xl bg-gradient-to-r from-yellow-600 via-orange-500 to-pink-500 bg-clip-text text-transparent"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    🎉 QUEST COMPLETE! 🎉
                  </motion.h2>
                  <motion.p
                    className="text-lg text-gray-600"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    You've achieved your North Star!
                  </motion.p>
                </div>

                {/* Achievement badges */}
                <motion.div
                  className="flex gap-4 items-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 text-sm shadow-lg">
                    ✓ All Milestones
                  </Badge>
                  <Badge className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 text-sm shadow-lg">
                    ✓ All Subgoals
                  </Badge>
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-2 text-sm shadow-lg">
                    ✓ 100% Complete
                  </Badge>
                </motion.div>

                {/* Sparkle decorations */}
                <motion.div
                  className="absolute -top-6 -left-6"
                  animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Sparkles className="w-8 h-8 text-yellow-400" />
                </motion.div>
                <motion.div
                  className="absolute -top-6 -right-6"
                  animate={{ rotate: -360, scale: [1, 1.2, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Sparkles className="w-8 h-8 text-pink-400" />
                </motion.div>
                <motion.div
                  className="absolute -bottom-6 -left-6"
                  animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                >
                  <Sparkles className="w-8 h-8 text-blue-400" />
                </motion.div>
                <motion.div
                  className="absolute -bottom-6 -right-6"
                  animate={{ rotate: -360, scale: [1, 1.2, 1] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                >
                  <Sparkles className="w-8 h-8 text-purple-400" />
                </motion.div>

                {/* Dismiss Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="mt-4"
                >
                  <Button
                    onClick={() => {
                      setCelebrationDismissed(true);
                      if (onQuestComplete) {
                        onQuestComplete(quest.id);
                      }
                    }}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 text-base shadow-xl"
                  >
                    Mark Quest as Complete
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}

        {/* Quest Completed State - Shows after celebration is dismissed */}
        {allSubGoalsComplete && celebrationDismissed && (
          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <div className="inline-flex flex-col items-center gap-4 bg-white px-10 py-6 rounded-2xl shadow-xl border-2 border-green-500">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center">
                  <Trophy className="w-7 h-7 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="text-2xl text-gray-900">Quest Completed</h3>
                  <p className="text-sm text-gray-600">All milestones and subgoals achieved!</p>
                </div>
              </div>
              <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2">
                ✓ 100% Complete
              </Badge>
            </div>
          </motion.div>
        )}

        {/* Confirmation Button - Shows at the end when quest is not confirmed */}
        {!quest.confirmed && onConfirmQuest && !allSubGoalsComplete && (
          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="bg-white/80 backdrop-blur-sm border-2 border-indigo-200 rounded-xl p-8 shadow-lg inline-block">
              <div className="mb-4">
                <CheckCircle2 className="w-12 h-12 mx-auto text-indigo-500 mb-3" />
                <h3 className="text-xl text-slate-900 mb-2">Ready to Begin?</h3>
                <p className="text-sm text-slate-600 max-w-md">
                  You've reviewed the AI-generated quest map. Confirm to start tracking your progress and working towards your goal.
                </p>
              </div>
              <div className="flex gap-3 justify-center">
                <Button
                  onClick={() => onRegenerateQuest && onRegenerateQuest()}
                  size="lg"
                  variant="outline"
                  className="border-2 border-slate-300 hover:border-indigo-400 hover:bg-indigo-50 px-8 py-6"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Regenerate with AI
                </Button>
                <Button
                  onClick={() => onConfirmQuest(quest.id)}
                  size="lg"
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 px-8 py-6 shadow-xl"
                >
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  Confirm & Start Quest
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Milestone Overview Modal */}
      <AnimatePresence>
        {selectedMilestone && selectedMilestoneData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
            onClick={() => setSelectedMilestone(null)}
          >
            <motion.div
              initial={{ scale: 0.85, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.85, y: 30, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-2xl max-h-[85vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="overflow-hidden shadow-2xl border-0 bg-white/95 backdrop-blur-xl">
                {/* Header */}
                <div className="relative bg-gradient-to-r from-indigo-500 via-indigo-600 to-blue-600 text-white p-6 overflow-hidden">
                  {/* Animated background */}
                  <div className="absolute inset-0 overflow-hidden opacity-20">
                    <motion.div
                      className="absolute -top-10 -left-10 w-40 h-40 bg-white/30 rounded-full blur-3xl"
                      animate={{ x: [0, 20, 0], y: [0, 15, 0], scale: [1, 1.1, 1] }}
                      transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                    />
                  </div>

                  {/* Close button */}
                  <motion.button
                    onClick={() => setSelectedMilestone(null)}
                    className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-xl flex items-center justify-center transition-colors z-10"
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <X className="w-4 h-4" />
                  </motion.button>

                  {/* Header content */}
                  <div className="relative flex items-center gap-4">
                    <motion.div
                      className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', delay: 0.2 }}
                    >
                      <Target className="w-7 h-7" />
                    </motion.div>
                    
                    <div className="flex-1">
                      <motion.p 
                        className="text-xs uppercase tracking-wider text-white/70 mb-1"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        Milestone {milestones.findIndex(m => m.id === selectedMilestone) + 1} of {milestones.length}
                      </motion.p>
                      <motion.h3 
                        className="text-xl mb-1"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        {selectedMilestoneData.title}
                      </motion.h3>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <Badge className="bg-white/20 hover:bg-white/30 text-white border-0">
                          {selectedMilestoneData.completed ? '✓ Completed' : 
                           selectedMilestoneData.isCurrent ? '● Current' : 
                           '○ Upcoming'}
                        </Badge>
                      </motion.div>
                    </div>
                  </div>
                </div>

                {/* Tasks */}
                <div className="p-6 bg-gradient-to-b from-slate-50 to-white max-h-[calc(85vh-180px)] overflow-y-auto">
                  <motion.div
                    className="flex items-center justify-between mb-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-indigo-600" />
                      <h4 className="text-sm uppercase tracking-wider text-slate-600 font-semibold">Milestone Overview Tasks</h4>
                    </div>
                    <span className="text-xs text-slate-500">
                      {selectedMilestoneData.tasks.filter(t => t.completed).length}/{selectedMilestoneData.tasks.length} completed
                    </span>
                  </motion.div>

                  <Reorder.Group 
                    axis="y" 
                    values={selectedMilestoneData.tasks} 
                    onReorder={(newOrder) => reorderTasks(selectedMilestone, newOrder, false)}
                    className="space-y-3"
                  >
                    {selectedMilestoneData.tasks.map((task, taskIndex) => (
                      <Reorder.Item 
                        key={task.id} 
                        value={task}
                        className="group/task"
                      >
                        <motion.div
                          className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50/50 transition-colors border border-slate-100"
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 + taskIndex * 0.05 }}
                        >
                          {/* Drag handle */}
                          <motion.div
                            className="opacity-0 group-hover/task:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
                            whileHover={{ scale: 1.1 }}
                          >
                            <GripVertical className="w-4 h-4 text-slate-400 mt-1" />
                          </motion.div>

                          {/* Checkbox */}
                          <motion.button
                            onClick={() => toggleTaskComplete(selectedMilestone, task.id)}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            className="mt-1"
                          >
                            {task.completed ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                            ) : (
                              <Circle className="w-5 h-5 text-slate-400 flex-shrink-0 group-hover/task:text-slate-600 transition-colors" />
                            )}
                          </motion.button>

                          {/* Task content */}
                          <div className="flex-1 min-w-0">
                            {editingTask?.parentId === selectedMilestone && editingTask?.taskId === task.id ? (
                              <div className="flex items-center gap-2">
                                <Input
                                  value={editText}
                                  onChange={(e) => setEditText(e.target.value)}
                                  className="h-9 text-sm"
                                  autoFocus
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') saveEditTask(selectedMilestone, task.id, false);
                                    if (e.key === 'Escape') setEditingTask(null);
                                  }}
                                />
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-9 w-9 p-0"
                                  onClick={() => saveEditTask(selectedMilestone, task.id, false)}
                                >
                                  <Check className="w-4 h-4 text-emerald-600" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-9 w-9 p-0"
                                  onClick={() => setEditingTask(null)}
                                >
                                  <XCircle className="w-4 h-4 text-slate-400" />
                                </Button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className={`text-sm text-slate-700 ${task.completed ? 'line-through text-slate-400' : ''}`}>
                                  {task.text}
                                </span>
                                {/* Priority badge */}
                                <motion.button
                                  onClick={() => changePriority(selectedMilestone, task.id, false)}
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  <Badge 
                                    variant="outline" 
                                    className={`text-xs px-2 py-0 h-5 ${getPriorityColor(task.priority)} cursor-pointer`}
                                  >
                                    {getPriorityIcon(task.priority)} {task.priority}
                                  </Badge>
                                </motion.button>
                              </div>
                            )}
                          </div>

                          {/* Action buttons */}
                          {editingTask?.parentId !== selectedMilestone || editingTask?.taskId !== task.id ? (
                            <div className="flex items-center gap-1 opacity-0 group-hover/task:opacity-100 transition-opacity">
                              {onAskAI && (
                                <motion.button
                                  onClick={() => onAskAI(task.text, quest.name, selectedMilestoneData.title)}
                                  className="p-1.5 hover:bg-indigo-100 rounded-md transition-colors"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  title="Ask AI about this task"
                                >
                                  <MessageCircle className="w-3.5 h-3.5 text-indigo-600" />
                                </motion.button>
                              )}
                              <motion.button
                                onClick={() => startEditTask(selectedMilestone, task.id, task.text)}
                                className="p-1.5 hover:bg-slate-200 rounded-md transition-colors"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <Edit2 className="w-3.5 h-3.5 text-slate-500" />
                              </motion.button>
                              <motion.button
                                onClick={() => deleteTask(selectedMilestone, task.id, false)}
                                className="p-1.5 hover:bg-red-100 rounded-md transition-colors"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <Trash2 className="w-3.5 h-3.5 text-red-500" />
                              </motion.button>
                            </div>
                          ) : null}
                        </motion.div>
                      </Reorder.Item>
                    ))}
                  </Reorder.Group>

                  {/* Add task button */}
                  <motion.button
                    onClick={() => addNewTask(selectedMilestone, false)}
                    className="w-full mt-4 px-4 py-3 border-2 border-dashed border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 rounded-xl text-sm text-slate-500 hover:text-indigo-600 transition-all flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <Plus className="w-4 h-4" />
                    Add new task
                  </motion.button>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SubGoal Tasks Modal */}
      <AnimatePresence>
        {selectedSubGoal && selectedSubGoalData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
            onClick={() => setSelectedSubGoal(null)}
          >
            <motion.div
              initial={{ scale: 0.85, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.85, y: 30, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-2xl max-h-[85vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="overflow-hidden shadow-2xl border-0 bg-white/95 backdrop-blur-xl">
                {/* Header */}
                <div className={`relative text-white p-6 overflow-hidden ${
                  selectedSubGoalData.completed
                    ? 'bg-gradient-to-r from-green-500 via-green-600 to-emerald-600'
                    : 'bg-gradient-to-r from-purple-500 via-purple-600 to-pink-600'
                }`}>
                  {/* Animated background */}
                  <div className="absolute inset-0 overflow-hidden opacity-20">
                    <motion.div
                      className="absolute -top-10 -left-10 w-40 h-40 bg-white/30 rounded-full blur-3xl"
                      animate={{ x: [0, 20, 0], y: [0, 15, 0], scale: [1, 1.1, 1] }}
                      transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                    />
                  </div>

                  {/* Close button */}
                  <motion.button
                    onClick={() => setSelectedSubGoal(null)}
                    className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-xl flex items-center justify-center transition-colors z-10"
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <X className="w-4 h-4" />
                  </motion.button>

                  {/* Header content */}
                  <div className="relative flex items-center gap-4">
                    <motion.div
                      className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', delay: 0.2 }}
                    >
                      <Star className="w-7 h-7" />
                    </motion.div>
                    
                    <div className="flex-1">
                      <motion.h3 
                        className="text-xl mb-1"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        {selectedSubGoalData.title}
                      </motion.h3>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <Badge className="bg-white/20 hover:bg-white/30 text-white border-0">
                          {selectedSubGoalData.completed ? '✓ Completed' : '○ In Progress'}
                        </Badge>
                      </motion.div>
                    </div>
                  </div>
                </div>

                {/* Tasks */}
                <div className="p-6 bg-gradient-to-b from-slate-50 to-white max-h-[calc(85vh-180px)] overflow-y-auto">
                  <motion.div
                    className="flex items-center justify-between mb-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-600" />
                      <h4 className="text-sm uppercase tracking-wider text-slate-600 font-semibold">Subtask Details</h4>
                    </div>
                    <span className="text-xs text-slate-500">
                      {selectedSubGoalData.tasks.filter(t => t.completed).length}/{selectedSubGoalData.tasks.length} completed
                    </span>
                  </motion.div>

                  <Reorder.Group 
                    axis="y" 
                    values={selectedSubGoalData.tasks} 
                    onReorder={(newOrder) => reorderTasks(selectedSubGoal.subGoalId, newOrder, true)}
                    className="space-y-3"
                  >
                    {selectedSubGoalData.tasks.map((task, taskIndex) => (
                      <Reorder.Item 
                        key={task.id} 
                        value={task}
                        className="group/task"
                      >
                        <motion.div
                          className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50/50 transition-colors border border-slate-100"
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 + taskIndex * 0.05 }}
                        >
                          {/* Drag handle */}
                          <motion.div
                            className="opacity-0 group-hover/task:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
                            whileHover={{ scale: 1.1 }}
                          >
                            <GripVertical className="w-4 h-4 text-slate-400 mt-1" />
                          </motion.div>

                          {/* Checkbox */}
                          <motion.button
                            onClick={() => toggleSubGoalTaskComplete(selectedSubGoal.milestoneId, selectedSubGoal.subGoalId, task.id)}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            className="mt-1"
                          >
                            {task.completed ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                            ) : (
                              <Circle className="w-5 h-5 text-slate-400 flex-shrink-0 group-hover/task:text-slate-600 transition-colors" />
                            )}
                          </motion.button>

                          {/* Task content */}
                          <div className="flex-1 min-w-0">
                            {editingTask?.parentId === selectedSubGoal.subGoalId && editingTask?.taskId === task.id ? (
                              <div className="flex items-center gap-2">
                                <Input
                                  value={editText}
                                  onChange={(e) => setEditText(e.target.value)}
                                  className="h-9 text-sm"
                                  autoFocus
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') saveEditTask(selectedSubGoal.subGoalId, task.id, true);
                                    if (e.key === 'Escape') setEditingTask(null);
                                  }}
                                />
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-9 w-9 p-0"
                                  onClick={() => saveEditTask(selectedSubGoal.subGoalId, task.id, true)}
                                >
                                  <Check className="w-4 h-4 text-emerald-600" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-9 w-9 p-0"
                                  onClick={() => setEditingTask(null)}
                                >
                                  <XCircle className="w-4 h-4 text-slate-400" />
                                </Button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className={`text-sm text-slate-700 ${task.completed ? 'line-through text-slate-400' : ''}`}>
                                  {task.text}
                                </span>
                                {/* Priority badge */}
                                <motion.button
                                  onClick={() => changePriority(selectedSubGoal.subGoalId, task.id, true)}
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  <Badge 
                                    variant="outline" 
                                    className={`text-xs px-2 py-0 h-5 ${getPriorityColor(task.priority)} cursor-pointer`}
                                  >
                                    {getPriorityIcon(task.priority)} {task.priority}
                                  </Badge>
                                </motion.button>
                              </div>
                            )}
                          </div>

                          {/* Action buttons */}
                          {editingTask?.parentId !== selectedSubGoal.subGoalId || editingTask?.taskId !== task.id ? (
                            <div className="flex items-center gap-1 opacity-0 group-hover/task:opacity-100 transition-opacity">
                              {onAskAI && (
                                <motion.button
                                  onClick={() => onAskAI(task.text, quest.name, selectedSubGoalData.title)}
                                  className="p-1.5 hover:bg-purple-100 rounded-md transition-colors"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  title="Ask AI about this task"
                                >
                                  <MessageCircle className="w-3.5 h-3.5 text-purple-600" />
                                </motion.button>
                              )}
                              <motion.button
                                onClick={() => startEditTask(selectedSubGoal.subGoalId, task.id, task.text)}
                                className="p-1.5 hover:bg-slate-200 rounded-md transition-colors"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <Edit2 className="w-3.5 h-3.5 text-slate-500" />
                              </motion.button>
                              <motion.button
                                onClick={() => deleteTask(selectedSubGoal.subGoalId, task.id, true)}
                                className="p-1.5 hover:bg-red-100 rounded-md transition-colors"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <Trash2 className="w-3.5 h-3.5 text-red-500" />
                              </motion.button>
                            </div>
                          ) : null}
                        </motion.div>
                      </Reorder.Item>
                    ))}
                  </Reorder.Group>

                  {/* Add task button */}
                  <motion.button
                    onClick={() => addNewTask(selectedSubGoal.subGoalId, true)}
                    className="w-full mt-4 px-4 py-3 border-2 border-dashed border-slate-200 hover:border-purple-300 hover:bg-purple-50/50 rounded-xl text-sm text-slate-500 hover:text-purple-600 transition-all flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <Plus className="w-4 h-4" />
                    Add new task
                  </motion.button>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteConfirmation} onOpenChange={() => setDeleteConfirmation(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteConfirmation?.type === 'milestone' && (
                <>
                  Do you want to delete the milestone <strong>"{deleteConfirmation.title}"</strong>?
                  <br />
                  This will also delete all subgoals and tasks within it.
                </>
              )}
              {deleteConfirmation?.type === 'subgoal' && (
                <>
                  Do you want to delete the subgoal <strong>"{deleteConfirmation.title}"</strong>?
                  <br />
                  This will also delete all tasks within it.
                </>
              )}
              {deleteConfirmation?.type === 'task' && (
                <>
                  Do you want to delete the task <strong>"{deleteConfirmation.title}"</strong>?
                </>
              )}
              <br />
              <br />
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteConfirmation(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (!deleteConfirmation) return;
                
                if (deleteConfirmation.type === 'milestone') {
                  confirmDeleteMilestone(deleteConfirmation.id);
                } else if (deleteConfirmation.type === 'subgoal' && deleteConfirmation.parentId) {
                  confirmDeleteSubGoal(deleteConfirmation.parentId, deleteConfirmation.id);
                } else if (deleteConfirmation.type === 'task' && deleteConfirmation.parentId) {
                  const isSubGoal = !!selectedSubGoal;
                  confirmDeleteTask(deleteConfirmation.parentId, deleteConfirmation.id, isSubGoal);
                }
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}