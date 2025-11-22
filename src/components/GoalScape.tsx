import React, { useState } from 'react';
import { Plus, Trash2, ChevronLeft, ChevronRight, Home, MoreVertical } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';

interface Goal {
  id: string;
  name: string;
  parentId: string | null;
  importance: number;
  progress: number;
  notes: string;
  subgoals: string[];
}

interface GoalScapeProps {
  quest?: any;
}

export function GoalScape({ quest }: GoalScapeProps) {
  const [goals, setGoals] = useState<Record<string, Goal>>({
    main: {
      id: 'main',
      name: quest?.name || 'Main Goal',
      parentId: null,
      importance: 100,
      progress: quest?.progress || 0,
      notes: '',
      subgoals: ['1', '2', '3']
    },
    '1': {
      id: '1',
      name: 'Subgoal 1',
      parentId: 'main',
      importance: 33,
      progress: 0,
      notes: '',
      subgoals: []
    },
    '2': {
      id: '2',
      name: 'Subgoal 2',
      parentId: 'main',
      importance: 33,
      progress: 0,
      notes: '',
      subgoals: []
    },
    '3': {
      id: '3',
      name: 'Subgoal 3',
      parentId: 'main',
      importance: 34,
      progress: 0,
      notes: '',
      subgoals: []
    }
  });

  const [currentGoalId, setCurrentGoalId] = useState('main');
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [hoveredGoal, setHoveredGoal] = useState<string | null>(null);
  const [history, setHistory] = useState(['main']);
  const [historyIndex, setHistoryIndex] = useState(0);

  const colors = [
    '#60d5f5', '#a78bfa', '#fbbf24', '#fb923c', 
    '#f472b6', '#34d399', '#818cf8', '#fde047'
  ];

  const currentGoal = goals[currentGoalId];

  const navigateToGoal = (goalId: string) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(goalId);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setCurrentGoalId(goalId);
    setSelectedGoal(null);
  };

  const navigateBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setCurrentGoalId(history[historyIndex - 1]);
      setSelectedGoal(null);
    }
  };

  const navigateForward = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setCurrentGoalId(history[historyIndex + 1]);
      setSelectedGoal(null);
    }
  };

  const navigateToHome = () => {
    setCurrentGoalId('main');
    setHistory(['main']);
    setHistoryIndex(0);
    setSelectedGoal(null);
  };

  const addSubgoal = (parentId = currentGoalId) => {
    const parent = goals[parentId];
    const newId = Date.now().toString();
    const newGoal: Goal = {
      id: newId,
      name: `Subgoal ${parent.subgoals.length + 1}`,
      parentId: parentId,
      importance: 0,
      progress: 0,
      notes: '',
      subgoals: []
    };

    const updatedGoals = {
      ...goals,
      [newId]: newGoal,
      [parentId]: {
        ...parent,
        subgoals: [...parent.subgoals, newId]
      }
    };

    setGoals(updatedGoals);
    redistributeImportance(parentId, updatedGoals);
  };

  const deleteSubgoal = (goalId: string) => {
    const goal = goals[goalId];
    const parent = goals[goal.parentId!];
    
    const updatedParent = {
      ...parent,
      subgoals: parent.subgoals.filter(id => id !== goalId)
    };

    const updatedGoals = {
      ...goals,
      [goal.parentId!]: updatedParent
    };

    delete updatedGoals[goalId];
    
    // Also delete all children recursively
    const deleteChildren = (id: string) => {
      const g = goals[id];
      if (g && g.subgoals) {
        g.subgoals.forEach(childId => {
          deleteChildren(childId);
          delete updatedGoals[childId];
        });
      }
    };
    deleteChildren(goalId);

    setGoals(updatedGoals);
    redistributeImportance(goal.parentId!, updatedGoals);
    if (selectedGoal?.id === goalId) setSelectedGoal(null);
  };

  const redistributeImportance = (parentId: string, goalState = goals) => {
    const parent = goalState[parentId];
    if (!parent.subgoals || parent.subgoals.length === 0) return;

    const each = Math.floor(100 / parent.subgoals.length);
    const remainder = 100 - (each * parent.subgoals.length);

    const updated = { ...goalState };
    parent.subgoals.forEach((id, i) => {
      if (updated[id]) {
        updated[id] = {
          ...updated[id],
          importance: i === parent.subgoals.length - 1 ? each + remainder : each
        };
      }
    });

    setGoals(updated);
  };

  const updateGoal = (id: string, field: keyof Goal, value: any) => {
    const updated = {
      ...goals,
      [id]: { ...goals[id], [field]: value }
    };
    setGoals(updated);
    if (selectedGoal?.id === id) {
      setSelectedGoal({ ...selectedGoal, [field]: value });
    }
  };

  const updateImportance = (id: string, value: string) => {
    const numValue = parseInt(value) || 0;
    const clamped = Math.max(0, Math.min(100, numValue));
    
    const goal = goals[id];
    const parent = goals[goal.parentId!];
    
    const updatedGoal = { ...goal, importance: clamped };
    let updatedGoals = { ...goals, [id]: updatedGoal };

    const total = parent.subgoals.reduce((sum, gId) => 
      sum + (gId === id ? clamped : updatedGoals[gId].importance), 0
    );

    if (total !== 100 && parent.subgoals.length > 1) {
      const otherGoalIds = parent.subgoals.filter(gId => gId !== id);
      const diff = 100 - total;
      const eachAdjust = diff / otherGoalIds.length;
      
      otherGoalIds.forEach(gId => {
        const current = updatedGoals[gId].importance;
        updatedGoals[gId] = {
          ...updatedGoals[gId],
          importance: Math.max(0, Math.round(current + eachAdjust))
        };
      });
    }

    setGoals(updatedGoals);
    if (selectedGoal?.id === id) {
      setSelectedGoal({ ...selectedGoal, importance: clamped });
    }
  };

  const renderCircle = () => {
    const centerX = 400;
    const centerY = 400;
    const radius = 300;

    return (
      <svg width="800" height="800" className="mx-auto">
        {/* Center circle for current goal */}
        <g>
          <circle
            cx={centerX}
            cy={centerY}
            r={80}
            fill={currentGoal.id === 'main' ? '#6366f1' : colors[0]}
            opacity={0.9}
            stroke="#fff"
            strokeWidth="3"
            className="cursor-pointer transition-all hover:opacity-100"
            onClick={() => setSelectedGoal(currentGoal)}
          />
          <text
            x={centerX}
            y={centerY - 10}
            textAnchor="middle"
            fill="white"
            className="pointer-events-none select-none"
          >
            {currentGoal.name}
          </text>
          <text
            x={centerX}
            y={centerY + 15}
            textAnchor="middle"
            fill="white"
            fontSize="24"
            className="pointer-events-none select-none"
          >
            {currentGoal.progress}%
          </text>
        </g>

        {/* Subgoal circles */}
        {currentGoal.subgoals.map((goalId, index) => {
          const goal = goals[goalId];
          if (!goal) return null;

          const angle = (index / currentGoal.subgoals.length) * 2 * Math.PI - Math.PI / 2;
          const x = centerX + radius * Math.cos(angle);
          const y = centerY + radius * Math.sin(angle);
          const size = 40 + (goal.importance / 100) * 60;

          return (
            <g key={goalId}>
              {/* Connection line */}
              <line
                x1={centerX}
                y1={centerY}
                x2={x}
                y2={y}
                stroke={colors[index % colors.length]}
                strokeWidth={Math.max(2, goal.importance / 10)}
                opacity={0.3}
              />
              
              {/* Subgoal circle */}
              <circle
                cx={x}
                cy={y}
                r={size}
                fill={colors[index % colors.length]}
                opacity={hoveredGoal === goalId ? 1 : 0.8}
                stroke="#fff"
                strokeWidth="2"
                className="cursor-pointer transition-all"
                onMouseEnter={() => setHoveredGoal(goalId)}
                onMouseLeave={() => setHoveredGoal(null)}
                onClick={() => {
                  if (goal.subgoals.length > 0) {
                    navigateToGoal(goalId);
                  } else {
                    setSelectedGoal(goal);
                  }
                }}
                onDoubleClick={() => goal.subgoals.length > 0 && navigateToGoal(goalId)}
              />
              
              {/* Goal name */}
              <text
                x={x}
                y={y - 5}
                textAnchor="middle"
                fill="white"
                fontSize="12"
                className="pointer-events-none select-none"
              >
                {goal.name}
              </text>
              
              {/* Progress */}
              <text
                x={x}
                y={y + 10}
                textAnchor="middle"
                fill="white"
                fontSize="14"
                className="pointer-events-none select-none"
              >
                {goal.progress}%
              </text>

              {/* Importance */}
              <text
                x={x}
                y={y + 25}
                textAnchor="middle"
                fill="white"
                fontSize="10"
                opacity={0.7}
                className="pointer-events-none select-none"
              >
                {goal.importance}%
              </text>
            </g>
          );
        })}
      </svg>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      {/* Navigation Bar */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={navigateToHome}
            disabled={currentGoalId === 'main'}
          >
            <Home className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={navigateBack}
            disabled={historyIndex === 0}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={navigateForward}
            disabled={historyIndex === history.length - 1}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
          <span className="ml-4 text-slate-600">{currentGoal.name}</span>
        </div>
        <Button
          onClick={() => addSubgoal()}
          size="sm"
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Subgoal
        </Button>
      </div>

      {/* Main Circle View */}
      <div className="mb-6">
        {renderCircle()}
      </div>

      {/* Selected Goal Details */}
      {selectedGoal && (
        <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg">Goal Details</h4>
            {selectedGoal.id !== 'main' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteSubgoal(selectedGoal.id)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Name</label>
              <Input
                value={selectedGoal.name}
                onChange={(e) => updateGoal(selectedGoal.id, 'name', e.target.value)}
                disabled={selectedGoal.id === 'main'}
              />
            </div>
            
            {selectedGoal.id !== 'main' && (
              <div>
                <label className="block text-sm mb-1">Importance (%)</label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={selectedGoal.importance}
                  onChange={(e) => updateImportance(selectedGoal.id, e.target.value)}
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm mb-1">Progress (%)</label>
              <Input
                type="number"
                min="0"
                max="100"
                value={selectedGoal.progress}
                onChange={(e) => updateGoal(selectedGoal.id, 'progress', parseInt(e.target.value) || 0)}
              />
            </div>
            
            <div>
              <label className="block text-sm mb-1">Notes</label>
              <Textarea
                value={selectedGoal.notes}
                onChange={(e) => updateGoal(selectedGoal.id, 'notes', e.target.value)}
                rows={3}
              />
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-4 p-3 bg-indigo-50 rounded-lg text-sm text-slate-600">
        <p><strong>How to use:</strong></p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>Click on a circle to view/edit its details</li>
          <li>Double-click a circle with subgoals to navigate into it</li>
          <li>Circle size represents importance</li>
          <li>Use navigation buttons to move between levels</li>
        </ul>
      </div>
    </div>
  );
}
