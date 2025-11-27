import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, ChevronLeft, ChevronRight, Home, MoreVertical, X, CircleDot, GitBranch } from 'lucide-react';
import '../styles/goalscape.css';

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
  onClose?: () => void;
}

export function GoalScape({ quest, onClose }: GoalScapeProps) {
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
  const [animatingGoals, setAnimatingGoals] = useState<Record<string, Goal>>({});
  const animationFrameRef = useRef<number | null>(null);

  const colors = [
    '#60d5f5', '#a78bfa', '#fbbf24', '#fb923c', 
    '#f472b6', '#34d399', '#818cf8', '#fde047'
  ];

  const currentGoal = goals[currentGoalId];

  // Set main goal as selected by default on mount
  useEffect(() => {
    if (!selectedGoal) {
      setSelectedGoal(goals['main']);
    }
  }, []);

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
    
    // Store old values for animation
    const oldImportances: Record<string, number> = {};
    parent.subgoals.forEach(gId => {
      oldImportances[gId] = goals[gId].importance;
    });
    
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

    // Animate the transition
    const startTime = Date.now();
    const duration = 500; // 500ms animation
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease-in-out function
      const easeProgress = progress < 0.5 
        ? 2 * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      
      const interpolatedGoals = { ...goals };
      parent.subgoals.forEach(gId => {
        const oldValue = oldImportances[gId];
        const newValue = updatedGoals[gId].importance;
        const currentValue = oldValue + (newValue - oldValue) * easeProgress;
        interpolatedGoals[gId] = {
          ...interpolatedGoals[gId],
          importance: currentValue
        };
      });
      
      setAnimatingGoals(interpolatedGoals);
      
      // Update selectedGoal during animation if it's one of the affected goals
      if (selectedGoal && interpolatedGoals[selectedGoal.id]) {
        setSelectedGoal(interpolatedGoals[selectedGoal.id]);
      }
      
      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setGoals(updatedGoals);
        setAnimatingGoals({});
        // Update selectedGoal with final values after animation completes
        if (selectedGoal && updatedGoals[selectedGoal.id]) {
          setSelectedGoal(updatedGoals[selectedGoal.id]);
        }
      }
    };
    
    animate();
  };

  const handleGoalClick = (goalId: string) => {
    const goal = goals[goalId];
    // Always select the goal on click
    setSelectedGoal(goal);
  };

  const handleGoalDoubleClick = (goalId: string) => {
    const goal = goals[goalId];
    // Only navigate if goal has children
    if (goal.subgoals && goal.subgoals.length > 0) {
      navigateToGoal(goalId);
    }
  };

  const renderCircularChart = () => {
    const cx = 250;
    const cy = 250;
    const baseInnerRadius = 80;
    const ringWidth = 60;

    // Use animating goals if available, otherwise use regular goals
    const displayGoals = Object.keys(animatingGoals).length > 0 ? animatingGoals : goals;

    if (!currentGoal.subgoals || currentGoal.subgoals.length === 0) {
      return (
        <svg width="500" height="500" style={{ display: 'block', margin: '0 auto' }}>
          <circle cx={cx} cy={cy} r={baseInnerRadius} fill="#f8fafc" stroke="#e2e8f0" strokeWidth="2" />
          <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fill="#1a3b5d" fontSize="16" fontWeight="600">
            {currentGoal.name}
          </text>
          <text x={cx} y={cy + 30} textAnchor="middle" dominantBaseline="middle" fill="#666" fontSize="14">
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
        const goal = displayGoals[goalId];
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
            <path
              d={pathData}
              fill={colors[(level + index) % colors.length]}
              opacity={isHovered || isSelected ? 1 : 0.85}
              stroke="#475569"
              strokeWidth="1"
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHoveredGoal(goal)}
              onMouseLeave={() => setHoveredGoal(null)}
              onClick={() => handleGoalClick(goal.id)}
              onDoubleClick={() => handleGoalDoubleClick(goal.id)}
            />
            <text
              x={labelX}
              y={labelY}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#333"
              fontSize="12"
              fontWeight="500"
              style={{ pointerEvents: 'none', userSelect: 'none' }}
              transform={`rotate(${(midAngle * 180 / Math.PI) + 90}, ${labelX}, ${labelY})`}
            >
              {goal.name}
            </text>
          </g>
        );

        if (hasChildren && level < 2) {
          elements.push(...renderRing(goal.subgoals, level + 1, startAngle, endAngle));
        }

        currentAngle = endAngle;
      });

      return elements;
    };

    return (
      <svg width="500" height="500" style={{ display: 'block', margin: '0 auto' }}>
        {renderRing(currentGoal.subgoals, 0, -Math.PI / 2, (3 * Math.PI) / 2)}

        <circle cx={cx} cy={cy} r={baseInnerRadius} fill="#f8fafc" stroke="#e2e8f0" strokeWidth="2" />
        <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fill="#1a3b5d" fontSize="16" fontWeight="600">
          {currentGoal.name}
        </text>
        {currentGoal.id !== 'main' && (
          <text x={cx} y={cy + 25} textAnchor="middle" dominantBaseline="middle" fill="#666" fontSize="12">
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

  // Cleanup animation on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div className="h-full w-full flex bg-white relative">
      {/* Top Bar with View Toggle and Close */}
      <div className="absolute top-6 left-0 right-0 z-50 flex items-center justify-between px-8">
        {/* View Toggle - Left Side */}
        <div className="inline-flex items-center gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-white hover:bg-gray-50 transition-colors text-slate-700 text-sm flex items-center gap-2 border border-slate-200 shadow-sm"
          >
            <GitBranch className="w-4 h-4" />
            Tree View
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm flex items-center gap-2 shadow-sm"
          >
            <CircleDot className="w-4 h-4" />
            Circle View
          </button>
          <button
            onClick={navigateToHome}
            className="p-2 rounded-lg bg-white hover:bg-gray-50 transition-colors text-slate-600 border border-slate-200 shadow-sm"
            title="Go to Main Goal"
          >
            <Home className="w-4 h-4" />
          </button>
          <button
            onClick={() => addSubgoal()}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition-colors text-white flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Subgoal
          </button>
        </div>
      </div>

      {/* Left Side - Circular Diagram (60%) */}
      <div className="w-[60%] flex flex-col items-center justify-center p-8 pt-24 relative">
        {/* Circular Action Buttons - Top Right */}
        <div className="absolute top-24 right-8 flex flex-col gap-2">
          <button
            onClick={() => addSubgoal(currentGoalId)}
            className="w-12 h-12 rounded-full bg-white hover:bg-indigo-50 transition-colors border border-slate-200 shadow-sm flex items-center justify-center group relative"
            title="Add Subgoal to Current Level"
          >
            <CircleDot className="w-5 h-5 text-indigo-600" />
            <Plus className="w-3 h-3 text-indigo-600 absolute top-1 right-1 bg-white rounded-full" />
          </button>
          {selectedGoal && selectedGoal.id !== currentGoalId && (
            <button
              onClick={() => addSubgoal(selectedGoal.id)}
              className="w-12 h-12 rounded-full bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm flex items-center justify-center relative"
              title={`Add Subgoal to ${selectedGoal.name}`}
            >
              <Plus className="w-5 h-5 text-white" />
              <div className="w-2 h-2 rounded-full bg-amber-400 absolute top-1 right-1 border border-white" />
            </button>
          )}
        </div>

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-slate-600 text-sm">
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

        {/* Circular Chart */}
        <div className="flex-1 flex items-center justify-center">
          {renderCircularChart()}
        </div>

        {/* Hint Text */}
        {currentGoal.subgoals.length > 0 && (
          <div className="text-slate-500 text-sm mt-4">
            Click to select • Double-click to drill down
          </div>
        )}
        {currentGoal.id !== 'main' && currentGoal.subgoals.length === 0 && (
          <div className="text-slate-500 text-sm mt-4">
            Use the + buttons above to add subgoals to {currentGoal.name}
          </div>
        )}
      </div>

      {/* Right Side - Detail Panel (40%) */}
      <div className="w-[40%] border-l border-slate-200 bg-white overflow-y-auto">
        <div className="p-8">
          {selectedGoal ? (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <h2 className="text-2xl text-slate-900">{selectedGoal.name}</h2>
                <button
                  onClick={() => deleteSubgoal(selectedGoal.id)}
                  className="p-2 rounded-lg bg-white hover:bg-red-50 transition-colors text-red-600 border border-red-200"
                  title="Delete Goal"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Goal Name */}
              <div>
                <label className="block text-sm text-slate-700 mb-2">Goal Name</label>
                <input
                  type="text"
                  value={selectedGoal.name}
                  onChange={(e) => updateGoal(selectedGoal.id, 'name', e.target.value)}
                  className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
                />
              </div>

              {/* Importance Slider */}
              <div>
                <label className="block text-sm text-slate-700 mb-2">
                  Importance: <span className="text-indigo-600">{Math.round(selectedGoal.importance)}%</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={selectedGoal.importance}
                  onChange={(e) => updateImportance(selectedGoal.id, e.target.value)}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider-indigo"
                />
              </div>

              {/* Progress Slider */}
              <div>
                <label className="block text-sm text-slate-700 mb-2">
                  Progress: <span className="text-emerald-600">{selectedGoal.progress}%</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={selectedGoal.progress}
                  onChange={(e) => updateGoal(selectedGoal.id, 'progress', parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider-green"
                />
                <div className="mt-2 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-300"
                    style={{ width: `${selectedGoal.progress}%` }}
                  />
                </div>
              </div>

              {/* Notes & Actions */}
              <div>
                <label className="block text-sm text-slate-700 mb-2">Notes & Actions</label>
                <textarea
                  value={selectedGoal.notes}
                  onChange={(e) => updateGoal(selectedGoal.id, 'notes', e.target.value)}
                  placeholder="Add notes, action items, or details..."
                  rows={6}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all resize-none"
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center py-20">
              <div className="w-20 h-20 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center mb-4">
                <CircleDot className="w-10 h-10 text-indigo-300" />
              </div>
              <h3 className="text-xl text-slate-800 mb-2">No Goal Selected</h3>
              <p className="text-slate-600 text-sm max-w-xs">
                Click on a segment in the circle to view and edit goal details
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}