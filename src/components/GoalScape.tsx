import React, { useState } from 'react';
import { Plus, Trash2, ChevronLeft, ChevronRight, Home, MoreVertical } from 'lucide-react';
import { motion } from 'framer-motion';
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
  const [hoveredGoal, setHoveredGoal] = useState<Goal | null>(null);
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
      const remaining = 100 - clamped;
      const eachOther = Math.floor(remaining / otherGoalIds.length);
      const remainder = remaining - (eachOther * otherGoalIds.length);

      otherGoalIds.forEach((gId, i) => {
        updatedGoals[gId] = {
          ...updatedGoals[gId],
          importance: i === otherGoalIds.length - 1 ? eachOther + remainder : eachOther
        };
      });
    }

    setGoals(updatedGoals);
  };

  const handleGoalClick = (goalId: string) => {
    const goal = goals[goalId];
    if (goal.subgoals && goal.subgoals.length > 0) {
      // If goal has subgoals, drill down into it
      navigateToGoal(goalId);
    } else {
      // If no subgoals, just select it for editing
      setSelectedGoal(goal);
    }
  };

  const renderCircularChart = () => {
    const cx = 250;
    const cy = 250;
    const baseInnerRadius = 80;
    const ringWidth = 60;

    if (!currentGoal.subgoals || currentGoal.subgoals.length === 0) {
      return (
        <svg width="500" height="500" className="mx-auto">
          <circle cx={cx} cy={cy} r={baseInnerRadius} fill="#f8fafc" stroke="#e2e8f0" strokeWidth="2" />
          <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" className="fill-slate-700 text-base font-semibold select-none">
            {currentGoal.name}
          </text>
          <text x={cx} y={cy + 30} textAnchor="middle" dominantBaseline="middle" className="fill-slate-500 text-sm select-none">
            No subgoals yet
          </text>
        </svg>
      );
    }

    const renderRing = (goalIds: string[], level: number, parentStartAngle: number, parentEndAngle: number) => {
      const elements: JSX.Element[] = [];
      const innerRadius = baseInnerRadius + (level * ringWidth);
      const outerRadius = innerRadius + ringWidth;
      
      let currentAngle = parentStartAngle;
      const totalAngle = parentEndAngle - parentStartAngle;

      goalIds.forEach((goalId, index) => {
        const goal = goals[goalId];
        if (!goal) return;

        const angle = (goal.importance / 100) * totalAngle;
        const startAngle = currentAngle;
        const endAngle = currentAngle + angle;

        const x1 = cx + innerRadius * Math.cos(startAngle);
        const y1 = cy + innerRadius * Math.sin(startAngle);
        const x2 = cx + outerRadius * Math.cos(startAngle);
        const y2 = cy + outerRadius * Math.sin(startAngle);
        const x3 = cx + outerRadius * Math.cos(endAngle);
        const y3 = cy + outerRadius * Math.sin(endAngle);
        const x4 = cx + innerRadius * Math.cos(endAngle);
        const y4 = cy + innerRadius * Math.sin(endAngle);

        const largeArc = angle > Math.PI ? 1 : 0;

        const pathData = [
          `M ${x1} ${y1}`,
          `L ${x2} ${y2}`,
          `A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x3} ${y3}`,
          `L ${x4} ${y4}`,
          `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x1} ${y1}`,
          'Z'
        ].join(' ');

        const midAngle = startAngle + angle / 2;
        const labelRadius = (innerRadius + outerRadius) / 2;
        const labelX = cx + labelRadius * Math.cos(midAngle);
        const labelY = cy + labelRadius * Math.sin(midAngle);

        const isHovered = hoveredGoal?.id === goal.id;
        const isSelected = selectedGoal?.id === goal.id;
        const hasChildren = goal.subgoals && goal.subgoals.length > 0;

        elements.push(
          <g key={`${goal.id}-${level}`}>
            <motion.path
              d={pathData}
              fill={colors[(level + index) % colors.length]}
              opacity={isHovered || isSelected ? 1 : 0.85}
              stroke="#475569"
              strokeWidth="1"
              className="cursor-pointer"
              onMouseEnter={() => setHoveredGoal(goal)}
              onMouseLeave={() => setHoveredGoal(null)}
              onClick={() => handleGoalClick(goal.id)}
              initial={false}
              animate={{ d: pathData, opacity: isHovered || isSelected ? 1 : 0.85 }}
              transition={{ 
                d: { duration: 0.6, ease: "easeInOut" },
                opacity: { duration: 0.2 }
              }}
            />
            <motion.text
              x={labelX}
              y={labelY}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-slate-800 text-xs font-medium pointer-events-none select-none"
              transform={`rotate(${(midAngle * 180 / Math.PI) + 90}, ${labelX}, ${labelY})`}
              initial={false}
              animate={{ 
                x: labelX, 
                y: labelY,
                transform: `rotate(${(midAngle * 180 / Math.PI) + 90}, ${labelX}, ${labelY})`
              }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            >
              {goal.name}
            </motion.text>
          </g>
        );

        // Recursively render children in the next ring
        if (hasChildren && level < 2) {
          elements.push(...renderRing(goal.subgoals, level + 1, startAngle, endAngle));
        }

        currentAngle = endAngle;
      });

      return elements;
    };

    return (
      <svg width="500" height="500" className="mx-auto">
        {renderRing(currentGoal.subgoals, 0, -Math.PI / 2, (3 * Math.PI) / 2)}

        <circle cx={cx} cy={cy} r={baseInnerRadius} fill="#f8fafc" stroke="#e2e8f0" strokeWidth="2" />
        <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" className="fill-slate-700 text-base font-semibold select-none">
          {currentGoal.name}
        </text>
        {currentGoal.id !== 'main' && (
          <text x={cx} y={cy + 25} textAnchor="middle" dominantBaseline="middle" className="fill-slate-500 text-xs select-none">
            Progress: {currentGoal.progress}%
          </text>
        )}
      </svg>
    );
  };

  const getBreadcrumb = () => {
    const path = [];
    let current = currentGoalId;
    while (current) {
      path.unshift(goals[current]);
      current = goals[current].parentId;
    }
    return path;
  };

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-500 text-sm">Visualize and prioritize your goals hierarchically</p>
        </div>
        <Button
          onClick={() => addSubgoal()}
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Subgoal
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart Area */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-8 border border-slate-200 relative">
          {/* Navigation Controls - Top Right */}
          <div className="absolute top-4 right-4 flex gap-2 z-10">
            <Button
              variant="ghost"
              size="sm"
              onClick={navigateBack}
              disabled={historyIndex === 0}
              className="w-10 h-10 p-0"
              title="Go Back"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={navigateForward}
              disabled={historyIndex === history.length - 1}
              className="w-10 h-10 p-0"
              title="Go Forward"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={navigateToHome}
              className="w-10 h-10 p-0"
              title="Go to Main Goal"
            >
              <Home className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-10 h-10 p-0"
              title="More Options"
            >
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
            {getBreadcrumb().map((goal, i) => (
              <React.Fragment key={goal.id}>
                {i > 0 && <span>/</span>}
                <button
                  onClick={() => navigateToGoal(goal.id)}
                  className="hover:text-indigo-600 transition-colors"
                >
                  {goal.name}
                </button>
              </React.Fragment>
            ))}
          </div>

          {renderCircularChart()}
          
          {currentGoal.id !== 'main' && currentGoal.subgoals.length === 0 && (
            <div className="mt-4 text-center text-slate-500 text-sm">
              Click "Add Subgoal" to create sub-tasks for {currentGoal.name}
            </div>
          )}
          {currentGoal.subgoals.length > 0 && (
            <div className="mt-4 text-center text-slate-500 text-sm">
              Click on a segment to drill down into its subgoals
            </div>
          )}
        </div>

        {/* Sidebar Panel */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          {selectedGoal ? (
            <div>
              <div className="flex items-center justify-between mb-6">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedGoal(null)}
                  className="p-0"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteSubgoal(selectedGoal.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 p-0"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm text-slate-600 mb-2">Goal Name</label>
                  <Input
                    type="text"
                    value={selectedGoal.name}
                    onChange={(e) => updateGoal(selectedGoal.id, 'name', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-600 mb-2">
                    Importance: {selectedGoal.importance}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={selectedGoal.importance}
                    onChange={(e) => updateImportance(selectedGoal.id, e.target.value)}
                    className="w-full accent-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-600 mb-2">
                    Progress: {selectedGoal.progress}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={selectedGoal.progress}
                    onChange={(e) => updateGoal(selectedGoal.id, 'progress', parseInt(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                  <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full transition-all"
                      style={{ width: `${selectedGoal.progress}%` }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-slate-600 mb-2">Notes & Actions</label>
                  <Textarea
                    value={selectedGoal.notes}
                    onChange={(e) => updateGoal(selectedGoal.id, 'notes', e.target.value)}
                    placeholder="Add notes, action items, or details..."
                    className="min-h-[150px] resize-none"
                  />
                </div>

                <Button
                  onClick={() => addSubgoal(selectedGoal.id)}
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Subgoal to {selectedGoal.name}
                </Button>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500">
              <p className="text-center text-sm">
                Click on a goal segment to view details<br />
                or click to drill down if it has subgoals
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Current Level Details */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200">
        <h2 className="text-lg text-slate-800 mb-4">Current Level: {currentGoal.name}</h2>
        <div className="space-y-3">
          {currentGoal.subgoals && currentGoal.subgoals.length > 0 ? (
            currentGoal.subgoals.map((goalId, index) => {
              const goal = goals[goalId];
              if (!goal) return null;
              return (
                <div
                  key={goal.id}
                  onClick={() => setSelectedGoal(goal)}
                  onDoubleClick={() => goal.subgoals?.length > 0 && navigateToGoal(goal.id)}
                  className="bg-slate-50 rounded-lg p-4 cursor-pointer hover:bg-slate-100 transition-colors border border-slate-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: colors[index % colors.length] }}
                      />
                      <span className="text-slate-800">{goal.name}</span>
                      {goal.subgoals?.length > 0 && (
                        <span className="text-xs text-slate-500">
                          ({goal.subgoals.length} subgoals)
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <span>Importance: {goal.importance}%</span>
                      <span>Progress: {goal.progress}%</span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-slate-500 text-center py-4 text-sm">No subgoals at this level</p>
          )}
        </div>
      </div>
    </div>
  );
}