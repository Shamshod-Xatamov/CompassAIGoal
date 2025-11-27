import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
    ChevronRight, Home, CornerDownRight, ArrowRightFromLine, CalendarClock,
    User, Calendar, Tag, Palette, AlignLeft, MessageSquare, Paperclip, 
    Plus, Circle, CheckSquare, Trash2, Send, File, Square, Crosshair, X,
    RotateCcw, RotateCw, Download, ArrowLeft, Lock, ChevronDown, ChevronUp
} from 'lucide-react';

// ==========================================
// 1. TYPES
// ==========================================

export interface ActionItem {
    id: string;
    text: string;
    completed: boolean;
}

export interface Comment {
    id: string;
    text: string;
    timestamp: number;
    author: string;
}

export interface Attachment {
    id: string;
    name: string;
    type: string;
    url?: string;
}

export interface Goal {
    id: string;
    name: string;
    text?: string; // Alternative text property
    progress: number; // 0-100
    importance: number; // relative weight vs siblings
    notes?: string;
    tags?: string[];
    dueDate?: string; // ISO Date string YYYY-MM-DD
    startDate?: string; // ISO Date string YYYY-MM-DD
    responsible?: string;
    color?: string; // Hex color code
    
    actions?: ActionItem[];
    comments?: Comment[];
    files?: Attachment[];
    
    children: Goal[];
}

export interface RenderItem {
    goal: Goal;
    start: number;
    end: number;
    innerR: number;
    outerR: number;
    effectiveColor: string; // The color to render (inherited or own)
    isDimmed?: boolean; // If true, render with reduced opacity
}

export interface ContextMenuState {
    visible: boolean;
    x: number;
    y: number;
    targetId: string | null;
}

// ==========================================
// 2. UTILS & HELPERS
// ==========================================

// Geometry
const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
    };
};

const describeArc = (x: number, y: number, innerRadius: number, outerRadius: number, startAngle: number, endAngle: number): string => {
    // Prevent SVG errors if angles are identical or inverted
    if (Math.abs(startAngle - endAngle) < 0.01) return "";

    // Handle full circle case (clamp to just under 360 to keep arc valid)
    let effectiveEnd = endAngle;
    if (endAngle - startAngle >= 360) {
        effectiveEnd = startAngle + 359.999;
    }

    const start = polarToCartesian(x, y, outerRadius, effectiveEnd);
    const end = polarToCartesian(x, y, outerRadius, startAngle);
    const start2 = polarToCartesian(x, y, innerRadius, effectiveEnd);
    const end2 = polarToCartesian(x, y, innerRadius, startAngle);

    // Determine if the arc is > 180 degrees
    const largeArcFlag = effectiveEnd - startAngle <= 180 ? "0" : "1";

    return [
        "M", start.x, start.y,
        "A", outerRadius, outerRadius, 0, largeArcFlag, 0, end.x, end.y,
        "L", end2.x, end2.y,
        "A", innerRadius, innerRadius, 0, largeArcFlag, 1, start2.x, start2.y,
        "Z"
    ].join(" ");
};

// Tree Helpers
const findNode = (node: Goal, id: string): Goal | null => {
    if (node.id === id) return node;
    if (node.children) {
        for (const child of node.children) {
            const found = findNode(child, id);
            if (found) return found;
        }
    }
    return null;
};

const findParent = (root: Goal, childId: string): Goal | null => {
    if (root.children) {
        for (const child of root.children) {
            if (child.id === childId) return root;
            const found = findParent(child, childId);
            if (found) return found;
        }
    }
    return null;
};

const findPath = (node: Goal, id: string, path: Goal[] = []): Goal[] | null => {
    if (node.id === id) return [...path, node];
    if (node.children) {
        for (const child of node.children) {
            const result = findPath(child, id, [...path, node]);
            if (result) return result;
        }
    }
    return null;
};

const updateNodeInTree = (root: Goal, nodeId: string, updates: Partial<Goal>): Goal => {
    if (root.id === nodeId) {
        return { ...root, ...updates };
    }
    if (root.children) {
        return {
            ...root,
            children: root.children.map(child => updateNodeInTree(child, nodeId, updates))
        };
    }
    return root;
};

const addChildToNode = (root: Goal, parentId: string): Goal => {
    const newGoal: Goal = { 
        id: Date.now().toString(), 
        name: "New Goal", 
        progress: 0, 
        importance: 20, 
        children: [],
        tags: [],
        dueDate: undefined,
        startDate: undefined,
        responsible: '',
        color: undefined,
        actions: [],
        comments: [],
        files: []
    };

    const recursiveAdd = (node: Goal): Goal => {
        if (node.id === parentId) {
            return { ...node, children: [...(node.children || []), newGoal] };
        }
        if (node.children) {
            return { ...node, children: node.children.map(recursiveAdd) };
        }
        return node;
    };
    return recursiveAdd(root);
};

const deleteNodeFromTree = (root: Goal, nodeId: string): Goal => {
    if (root.children) {
        return {
            ...root,
            children: root.children
                .filter(child => child.id !== nodeId)
                .map(child => deleteNodeFromTree(child, nodeId))
        };
    }
    return root;
};

const getTreeDepth = (node: Goal): number => {
    if (!node.children || node.children.length === 0) {
        return 0;
    }
    return 1 + Math.max(0, ...node.children.map(getTreeDepth));
};

// ==========================================
// 3. COMPONENTS
// ==========================================

// --- GoalSlice ---
interface GoalSliceProps {
    goal: Goal;
    startAngle: number;
    endAngle: number;
    innerRadius: number;
    outerRadius: number;
    effectiveColor: string;
    isSelected: boolean;
    isDimmed?: boolean;
    onSelect: (goal: Goal) => void;
    onContextMenu: (e: React.MouseEvent, goal: Goal) => void;
    onDoubleClick: (goal: Goal) => void;
}

const GoalSlice: React.FC<GoalSliceProps> = ({ 
    goal, 
    startAngle, 
    endAngle, 
    innerRadius, 
    outerRadius,
    effectiveColor,
    isSelected, 
    isDimmed = false,
    onSelect, 
    onContextMenu,
    onDoubleClick
}) => {
    // Visual Config
    const selectedStroke = "#3b82f6"; // Blue Selection
    const separatorStroke = "#000000"; // Bold Black for structure

    // Goalscape logic: fill from outside in
    const thickness = outerRadius - innerRadius;
    const filledThickness = thickness * (goal.progress / 100);
    const fillInnerRadius = outerRadius - filledThickness;
    const containerPath = describeArc(300, 300, innerRadius, outerRadius, startAngle, endAngle);

    // Text Positioning
    const midAngle = startAngle + (endAngle - startAngle) / 2;
    const textRadius = innerRadius + thickness / 2;
    const textPos = polarToCartesian(300, 300, textRadius, midAngle);
    
    // Rotate text to be readable
    let rotation = midAngle;
    if (midAngle > 90 && midAngle < 270) rotation += 180;
    
    // Check text space
    const arcLength = (endAngle - startAngle);
    const showText = arcLength > 8; 

    // Due Date Status
    const getStatusColor = () => {
        if (!goal.dueDate) return null;
        const due = new Date(goal.dueDate);
        const now = new Date();
        due.setHours(0,0,0,0);
        now.setHours(0,0,0,0);
        const diff = (due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
        
        if (diff < 0) return "#ef4444"; // Red (Overdue)
        if (diff <= 7) return "#eab308"; // Yellow (Warning)
        return null; 
    };
    const statusDotColor = getStatusColor();

    const containerClass = `cursor-pointer transition-all duration-300 ease-out ${
        isDimmed 
            ? 'opacity-20 grayscale hover:opacity-30' 
            : 'hover:opacity-90'
    }`;

    return (
        <g 
            onClick={(e) => { e.stopPropagation(); onSelect(goal); }} 
            onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); onContextMenu(e, goal); }}
            onDoubleClick={(e) => { e.stopPropagation(); onDoubleClick(goal); }}
            className={containerClass}
        >
            {/* 1. Background Tint (No border) */}
            <path 
                d={containerPath} 
                fill={effectiveColor} 
                fillOpacity={0.25} 
                stroke="none"
            />
            
            {/* 2. Progress Fill (Solid, No border) */}
            {goal.progress > 0 && (
                <path 
                    d={describeArc(300, 300, fillInnerRadius, outerRadius, startAngle, endAngle)} 
                    fill={effectiveColor}
                    fillOpacity={1}
                    stroke="none"
                    className="pointer-events-none" 
                />
            )}

            {/* 3. Structural Border (Top Layer - Wireframe) */}
            <path 
                d={containerPath}
                fill="none"
                stroke={isSelected ? selectedStroke : separatorStroke}
                strokeWidth={isSelected ? 3 : 1}
                className="pointer-events-none"
            />

            {/* Label */}
            {showText && (
                <g 
                    transform={`rotate(${rotation}, ${textPos.x}, ${textPos.y})`} 
                    className="pointer-events-none select-none"
                >
                    <text 
                        x={0} 
                        y={0} 
                        fill="#0f172a" 
                        fontSize="11"
                        fontWeight="600"
                        textAnchor="middle" 
                        alignmentBaseline="middle"
                        style={{ fontFamily: 'sans-serif', textShadow: '0 0 4px rgba(255,255,255,0.8)' }} 
                        transform={`translate(${textPos.x}, ${textPos.y})`}
                    >
                        {goal.name.length > 12 ? goal.name.substring(0, 10) + '..' : goal.name}
                    </text>

                    {statusDotColor && (
                         <circle 
                            cx={0}
                            cy={-10}
                            r={3}
                            fill={statusDotColor}
                            stroke="white"
                            strokeWidth={1}
                            transform={`translate(${textPos.x}, ${textPos.y})`}
                         />
                    )}
                </g>
            )}
        </g>
    );
};

// --- CenterGoal ---
interface CenterGoalProps {
    goal: Goal;
    onSelect: (goal: Goal) => void;
    onContextMenu: (e: React.MouseEvent, goal: Goal) => void;
    onDoubleClick: () => void;
}

const CenterGoal: React.FC<CenterGoalProps> = ({ goal, onSelect, onContextMenu, onDoubleClick }) => {
    const r = 66;
    const circumference = 2 * Math.PI * r;
    const strokeDashoffset = circumference - (goal.progress / 100) * circumference;

    return (
        <g 
            onClick={(e) => { e.stopPropagation(); onSelect(goal); }}
            onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); onContextMenu(e, goal); }}
            onDoubleClick={onDoubleClick}
            className="cursor-pointer hover:opacity-95 transition-opacity"
        >
            <circle cx="300" cy="300" r="70" fill="white" className="shadow-sm" />
            
            <text x="300" y="295" textAnchor="middle" fontWeight="bold" fontSize="14" fill="#0f172a">
                {goal.name.length > 15 ? goal.name.substring(0, 12) + '...' : goal.name}
            </text>
            <text x="300" y="315" textAnchor="middle" fontSize="10" fill="#64748b">
                {Math.round(goal.progress)}% Done
            </text>

             {/* Background Ring - Darker for visibility */}
             <circle cx="300" cy="300" r={r} fill="none" stroke="#94a3b8" strokeWidth="4" />
             
             {/* Progress Ring - Dark Slate/Black */}
             <circle 
                cx="300" 
                cy="300" 
                r={r} 
                fill="none" 
                stroke="#1e293b" 
                strokeWidth="4" 
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                transform="rotate(-90 300 300)"
                className="transition-all duration-500 ease-out"
             />
        </g>
    );
};

// --- ContextMenu ---
interface ContextMenuProps extends ContextMenuState {
    onClose: () => void;
    onAdd: () => void;
    onDelete: () => void;
    onFocus: () => void;
    onColorChange: (color: string) => void;
    isRoot: boolean;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ 
    x, y, visible, onClose, onAdd, onDelete, onFocus, onColorChange, isRoot 
}) => {
    if (!visible) return null;

    const style: React.CSSProperties = {
        top: Math.min(y, window.innerHeight - 250),
        left: Math.min(x, window.innerWidth - 180)
    };

    const colors = [
        '#38bdf8', '#4ade80', '#f472b6', '#fbbf24', '#a78bfa', '#9ca3af',
    ];

    return (
        <div 
            className="fixed z-50 min-w-[180px] bg-white border border-slate-200 rounded-lg shadow-xl overflow-hidden animate-fade-in text-slate-700"
            style={style}
            onClick={(e) => e.stopPropagation()}
        >
            <div className="flex flex-col py-1">
                <button 
                    onClick={onAdd} 
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-slate-50 text-left transition-colors"
                >
                    <Plus size={14} /> Add Subgoal
                </button>
                
                <div className="px-4 py-2 flex gap-1.5 items-center">
                    <Palette size={14} className="text-slate-400 mr-1" />
                    {colors.map(c => (
                        <button
                            key={c}
                            className="w-4 h-4 rounded-full border border-slate-300 hover:scale-110 transition-transform shadow-sm"
                            style={{ backgroundColor: c }}
                            onClick={() => onColorChange(c)}
                            title="Set Color"
                        />
                    ))}
                </div>
                
                {!isRoot && (
                    <>
                        <button 
                            onClick={onFocus} 
                            className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-slate-50 text-left transition-colors"
                        >
                            <Crosshair size={14} /> Focus View
                        </button>
                        <button 
                            onClick={onDelete} 
                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50 text-left transition-colors"
                        >
                            <Trash2 size={14} /> Delete Goal
                        </button>
                    </>
                )}
                
                <div className="h-px bg-slate-100 my-1 mx-2"></div>
                
                <button 
                    onClick={onClose} 
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-slate-400 hover:bg-slate-50 text-left transition-colors"
                >
                    <X size={14} /> Cancel
                </button>
            </div>
        </div>
    );
};

// --- Sidebar ---
interface SidebarProps {
    goal: Goal | null;
    isRoot: boolean;
    onUpdate: (field: keyof Goal, value: any) => void;
    onAddSubgoal: () => void;
    onDeleteGoal: () => void;
    onAskAI?: (goalText: string, goalNotes: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ goal, isRoot, onUpdate, onAddSubgoal, onDeleteGoal, onAskAI }) => {
    const [activeTab, setActiveTab] = useState<'notes' | 'comments' | 'files'>('notes');
    const [newAction, setNewAction] = useState('');
    const [newComment, setNewComment] = useState('');
    const [width, setWidth] = useState(400);
    const [isResizing, setIsResizing] = useState(false);
    const [isNotesExpanded, setIsNotesExpanded] = useState(true);
    const [isCommentsExpanded, setIsCommentsExpanded] = useState(false);
    const sidebarRef = useRef<HTMLDivElement>(null);
    const commentsEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when comments change
    useEffect(() => {
        if (activeTab === 'comments' && commentsEndRef.current) {
            commentsEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [goal?.comments, activeTab]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isResizing) return;
            const rawWidth = window.innerWidth - e.clientX;
            const newWidth = Math.max(300, Math.min(rawWidth, 800));
            setWidth(newWidth);
        };

        const handleMouseUp = () => {
            setIsResizing(false);
            document.body.style.cursor = 'default';
            document.body.style.userSelect = 'auto'; 
        };

        if (isResizing) {
            document.body.style.cursor = 'ew-resize';
            document.body.style.userSelect = 'none'; 
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isResizing]);

    if (!goal) {
        return (
            <div 
                className="bg-white border-l border-slate-200 p-6 flex flex-col items-center justify-center text-slate-400 h-full relative"
                style={{ width: width }}
            >
                <div 
                    className={`absolute left-0 top-0 bottom-0 w-2 cursor-ew-resize hover:bg-blue-500/10 transition-colors z-50 flex items-center justify-center group ${isResizing ? 'bg-blue-500/10' : ''}`}
                    onMouseDown={(e) => { e.preventDefault(); setIsResizing(true); }}
                >
                     <div className={`h-12 w-1 bg-slate-300 rounded-full transition-all duration-300 ${isResizing ? 'bg-blue-400 opacity-100 scale-y-110' : 'group-hover:bg-blue-400 opacity-50 group-hover:opacity-100'}`} />
                </div>
                <div className="p-4 bg-slate-50 rounded-full mb-4">
                    <Circle size={32} className="text-slate-300" />
                </div>
                <p className="font-medium">Select a goal to edit details</p>
            </div>
        );
    }

    const headerColor = goal.color || '#38bdf8'; 
    const mainBg = 'bg-white';
    const contentBg = 'bg-slate-50';
    const inputBg = 'bg-transparent';
    const labelColor = 'text-slate-500';
    const textColor = 'text-slate-700';
    const borderColor = 'border-slate-200';

    const handleAddAction = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newAction.trim()) return;
        const action: ActionItem = { id: Date.now().toString(), text: newAction, completed: false };
        onUpdate('actions', [...(goal.actions || []), action]);
        setNewAction('');
    };

    const toggleAction = (id: string) => {
        const updated = (goal.actions || []).map(a => a.id === id ? { ...a, completed: !a.completed } : a);
        onUpdate('actions', updated);
    };

    const deleteAction = (id: string) => {
        const updated = (goal.actions || []).filter(a => a.id !== id);
        onUpdate('actions', updated);
    };

    const handleAddComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        const comment: Comment = {
            id: Date.now().toString(),
            text: newComment,
            timestamp: Date.now(),
            author: 'You'
        };
        onUpdate('comments', [...(goal.comments || []), comment]);
        setNewComment('');
    };

    const handleAddFile = () => {
        const fileName = prompt("Enter file name (simulated upload):");
        if (fileName) {
            const file: Attachment = {
                id: Date.now().toString(),
                name: fileName,
                type: 'document'
            };
            onUpdate('files', [...(goal.files || []), file]);
        }
    };

    return (
        <div 
            ref={sidebarRef}
            className="flex flex-col h-full shadow-xl relative transition-none border-l border-slate-200 bg-white" 
            style={{ width: width }}
        >
            <div 
                className={`absolute -left-1 top-0 bottom-0 w-3 cursor-ew-resize hover:bg-blue-500/10 transition-colors z-50 flex items-center justify-center group ${isResizing ? 'bg-blue-500/10' : ''}`}
                onMouseDown={(e) => { e.preventDefault(); setIsResizing(true); }}
            >
                <div className={`h-12 w-1 bg-slate-300 rounded-full transition-all duration-300 ${isResizing ? 'bg-blue-400 opacity-100 scale-y-110' : 'group-hover:bg-blue-400 opacity-50 group-hover:opacity-100'}`} />
            </div>

            {/* Fixed Header */}
            <div 
                className="px-6 py-5 border-b border-slate-200 bg-white flex-shrink-0"
            >
                <div className="flex items-start gap-3">
                    <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-white flex-shrink-0 shadow-sm"
                        style={{ backgroundColor: goal.color || '#6366f1' }}
                    >
                        <Circle size={20} strokeWidth={2.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <input 
                            type="text" 
                            value={goal.name}
                            onChange={(e) => onUpdate('name', e.target.value)}
                            className="bg-transparent border-none text-slate-900 font-semibold w-full focus:outline-none placeholder-slate-400 mb-0.5"
                            placeholder="New goal"
                        />
                        <div className="text-xs text-slate-500">
                            {isRoot ? 'North Star Goal' : 'Sub Goal'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Fixed Fields Area - Always Visible */}
            <div className="px-4 py-3 space-y-3 bg-white border-b border-slate-200 flex-shrink-0 overflow-y-auto max-h-[50vh]">
                <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                        <label className="text-slate-600 text-xs font-medium">Importance</label>
                        <div className="flex items-center gap-2">
                            <span className="text-slate-900 font-semibold text-sm">{goal.importance}%</span>
                            {isRoot && (
                                <Lock size={12} className="text-slate-400" />
                            )}
                        </div>
                    </div>
                    <input 
                        type="range" min="1" max="100" 
                        value={goal.importance}
                        onChange={(e) => onUpdate('importance', parseInt(e.target.value))}
                        disabled={isRoot}
                        className="w-full h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer accent-slate-500 hover:accent-slate-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                </div>

                <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                        <label className="text-slate-600 text-xs font-medium">Progress</label>
                        <span className="text-slate-900 font-semibold text-sm">{goal.progress}%</span>
                    </div>
                    <input 
                        type="range" min="0" max="100" 
                        value={goal.progress}
                        onChange={(e) => onUpdate('progress', parseInt(e.target.value))}
                        className="w-full h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-600 transition-all"
                    />
                </div>

                <div className="space-y-3 pt-2 border-t border-slate-100">
                    <div className="space-y-1.5">
                        <label className="text-slate-600 text-xs font-medium block">Responsible</label>
                        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50/50 hover:border-slate-300 transition-colors">
                            <User size={13} className="text-slate-400 flex-shrink-0" />
                            <input 
                                type="text"
                                value={goal.responsible || ''}
                                onChange={(e) => onUpdate('responsible', e.target.value)}
                                placeholder="Add person"
                                className="bg-transparent text-slate-700 placeholder-slate-400 focus:outline-none w-full text-sm"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1.5">
                            <label className="text-slate-600 text-xs font-medium block">Start</label>
                            <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg border border-slate-200 bg-slate-50/50 hover:border-slate-300 transition-colors">
                                <Calendar size={12} className="text-slate-400 flex-shrink-0" />
                                <input 
                                    type="date"
                                    value={goal.startDate || ''}
                                    onChange={(e) => onUpdate('startDate', e.target.value)}
                                    className="bg-transparent text-slate-700 text-xs focus:outline-none w-full"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-slate-600 text-xs font-medium block">Due</label>
                            <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg border border-slate-200 bg-slate-50/50 hover:border-slate-300 transition-colors">
                                <Calendar size={12} className="text-slate-400 flex-shrink-0" />
                                <input 
                                    type="date"
                                    value={goal.dueDate || ''}
                                    onChange={(e) => onUpdate('dueDate', e.target.value)}
                                    className="bg-transparent text-slate-700 text-xs focus:outline-none w-full"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-slate-600 text-xs font-medium block">Tags</label>
                        <div className="flex flex-wrap gap-1.5 min-h-[32px] px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50/50 items-center">
                            {(goal.tags || []).length > 0 ? (
                                <>
                                    {goal.tags!.map((tag, i) => (
                                        <span key={i} className="bg-white border border-slate-300 text-slate-700 text-xs px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
                                            {tag}
                                            <button onClick={() => {
                                                const newTags = goal.tags!.filter((_, idx) => idx !== i);
                                                onUpdate('tags', newTags);
                                            }} className="hover:text-red-500 transition-colors text-xs">&times;</button>
                                        </span>
                                    ))}
                                    <button onClick={() => {
                                        const t = prompt("Tag:");
                                        if(t) onUpdate('tags', [...(goal.tags||[]), t]);
                                    }} className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">+ Add</button>
                                </>
                            ) : (
                                <button 
                                    onClick={() => {
                                        const t = prompt("Tag:");
                                        if(t) onUpdate('tags', [t]);
                                    }}
                                    className="text-slate-400 hover:text-slate-600 text-xs"
                                >
                                    Add tag
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-slate-600 text-xs font-medium block">Color</label>
                        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50/50 hover:border-slate-300 transition-colors cursor-pointer relative">
                            <div 
                                className="w-5 h-5 rounded-md border-2 border-white shadow-sm ring-1 ring-slate-200" 
                                style={{ backgroundColor: goal.color || '#e0e7ff' }} 
                            />
                            <span className="text-slate-600 text-xs">
                                {goal.color || 'Choose color'}
                            </span>
                            <input 
                                type="color"
                                value={goal.color || '#6366f1'}
                                onChange={(e) => onUpdate('color', e.target.value)}
                                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-2 border-t border-slate-100">
                    <button
                        onClick={() => {
                            if (onAskAI) {
                                onAskAI(goal.text || goal.name, goal.notes || '');
                            }
                        }}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors text-sm font-medium"
                    >
                        <MessageSquare size={14} />
                        <span>Ask AI Coach</span>
                    </button>
                </div>
            </div>

            {/* Collapsible Comments Section */}
            <div className="flex-shrink-0 border-b border-slate-200 bg-white">
                <button 
                    onClick={() => setIsCommentsExpanded(!isCommentsExpanded)}
                    className="w-full flex items-center justify-between px-6 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                    <div className="flex items-center gap-2">
                        <MessageSquare size={16} className="text-indigo-600" />
                        <span>Comments</span>
                        {(goal.comments || []).length > 0 && (
                            <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-0.5 rounded-full font-semibold">
                                {goal.comments!.length}
                            </span>
                        )}
                    </div>
                    {isCommentsExpanded ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
                </button>
            </div>

            {/* Collapsible Comments Content */}
            {isCommentsExpanded && (
                <div className="flex-shrink-0 bg-white border-b border-slate-200">
                    <div className="flex flex-col max-h-[400px] p-4 bg-slate-50">
                        <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-1 custom-scrollbar">
                            {(goal.comments || []).length === 0 && (
                                <div className="flex flex-col items-center justify-center py-8 text-slate-400">
                                    <MessageSquare size={32} className="mb-2 opacity-30" />
                                    <p className="text-sm">No comments yet.</p>
                                    <p className="text-xs mt-1">Start a conversation about this goal.</p>
                                </div>
                            )}
                            {(goal.comments || []).map(comment => (
                                <div key={comment.id} className="bg-white rounded-lg p-3 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-baseline mb-1.5">
                                        <span className="text-xs font-semibold text-indigo-600">{comment.author}</span>
                                        <span className="text-[10px] text-slate-400">
                                            {new Date(comment.timestamp).toLocaleDateString([], {month: 'short', day: 'numeric'})} at {new Date(comment.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{comment.text}</p>
                                </div>
                            ))}
                            {/* Scroll target for auto-scroll */}
                            <div ref={commentsEndRef} />
                        </div>
                        <form onSubmit={handleAddComment} className="flex gap-2 bg-white p-2 rounded-lg border border-slate-200 shadow-sm focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                            <input 
                                type="text"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Write a comment..."
                                className="flex-1 bg-transparent border-none px-2 py-2 text-sm text-slate-700 focus:outline-none placeholder-slate-400"
                            />
                            <button 
                                type="submit" 
                                className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={!newComment.trim()}
                            >
                                <Send size={16} />
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Collapsible Notes & Actions Section */}
            <div className="flex-shrink-0 border-b border-slate-200 bg-white">
                <button 
                    onClick={() => setIsNotesExpanded(!isNotesExpanded)}
                    className="w-full flex items-center justify-between px-6 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                    <div className="flex items-center gap-2">
                        <AlignLeft size={16} className="text-indigo-600" />
                        <span>Notes & Actions</span>
                    </div>
                    {isNotesExpanded ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
                </button>
            </div>

            {/* Collapsible Notes Content */}
            {isNotesExpanded && (
                <div className="flex-1 flex flex-col bg-white overflow-hidden border-b border-slate-200">
                    <div className="p-4 flex-shrink-0 border-b border-slate-200 bg-white">
                        <label className="text-xs font-medium text-slate-600 mb-2 block">Description</label>
                        <textarea 
                            value={goal.notes || ''}
                            onChange={(e) => onUpdate('notes', e.target.value)}
                            placeholder="Add notes describing this goal..."
                            className="w-full h-[100px] bg-slate-50 border border-slate-200 rounded-lg resize-none text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm leading-relaxed p-3"
                        />
                    </div>
                    
                    <div className="flex-1 flex flex-col p-4 bg-slate-50 overflow-hidden">
                        <h3 className="text-xs font-medium text-slate-600 mb-3 flex items-center gap-2">
                            <CheckSquare size={14} /> Action Plan
                        </h3>
                            
                            <div className="space-y-2 mb-4 overflow-y-auto flex-1 pr-1 custom-scrollbar">
                                {(goal.actions || []).length === 0 && (
                                    <div className="text-slate-400 text-sm italic pl-6">No actions yet. Add one below.</div>
                                )}
                                {(goal.actions || []).map(action => (
                                    <div key={action.id} className="flex items-start gap-3 group p-2.5 bg-white border border-slate-100 rounded-lg shadow-sm hover:shadow-md hover:border-slate-200 transition-all">
                                        <button 
                                            onClick={() => toggleAction(action.id)}
                                            className={`mt-0.5 transition-colors ${action.completed ? 'text-green-500 hover:text-green-600' : 'text-slate-300 hover:text-blue-500'}`}
                                        >
                                            {action.completed ? <CheckSquare size={18} /> : <Square size={18} />}
                                        </button>
                                        <div className={`text-sm flex-1 break-words pt-0.5 leading-snug ${action.completed ? 'line-through text-slate-400' : 'text-slate-700 font-medium'}`}>
                                            {action.text}
                                        </div>
                                        <button 
                                            onClick={() => deleteAction(action.id)}
                                            className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-opacity p-1"
                                            title="Delete Action"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <form onSubmit={handleAddAction} className="flex gap-2 mt-auto bg-white p-2 rounded-lg border border-slate-200 shadow-sm focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                                <button type="submit" className="text-slate-400 hover:text-blue-500 p-1.5 transition-colors">
                                    <Plus size={18} />
                                </button>
                                <input 
                                    type="text" 
                                    value={newAction}
                                    onChange={(e) => setNewAction(e.target.value)}
                                    placeholder="Add new action item..."
                                    className="flex-1 bg-transparent border-none text-sm text-slate-700 focus:outline-none placeholder-slate-400"
                                />
                            </form>
                    </div>
                </div>
            )}



            {/* Optional: Files section can be added here if needed */}
            {false && (
                    <div className="flex flex-col h-full p-4 bg-slate-50">
                         <div className="flex-1 overflow-y-auto space-y-2 mb-4 custom-scrollbar">
                            {(goal.files || []).length === 0 && (
                                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                                    <File size={32} className="mb-2 opacity-30" />
                                    <p className="text-sm">No files attached.</p>
                                </div>
                            )}
                            {(goal.files || []).map(file => (
                                <div key={file.id} className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg hover:border-blue-300 transition-colors cursor-pointer group shadow-sm">
                                    <div className="w-10 h-10 rounded bg-blue-50 flex items-center justify-center text-blue-500 flex-shrink-0 border border-blue-100">
                                        <File size={18} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm text-slate-700 truncate font-medium">{file.name}</div>
                                        <div className="text-xs text-slate-500 capitalize mt-0.5">{file.type}</div>
                                    </div>
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            const updated = (goal.files || []).filter(f => f.id !== file.id);
                                            onUpdate('files', updated);
                                        }}
                                        className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 p-2 transition-opacity"
                                        title="Remove File"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                         </div>
                         <button 
                            onClick={handleAddFile}
                            className="w-full py-3 border border-dashed border-slate-300 rounded-lg text-slate-500 hover:text-blue-600 hover:border-blue-400 hover:bg-blue-50/50 transition-all flex items-center justify-center gap-2 text-sm font-medium bg-white"
                         >
                             <Plus size={16} /> Attach File
                         </button>
                    </div>
                )}

            {!isRoot && (
                 <div className="border-t border-slate-200 p-3 flex justify-center bg-white flex-shrink-0">
                    <button 
                        onClick={onDeleteGoal} 
                        className="text-xs text-red-600 hover:text-red-700 transition-colors py-2 px-4 rounded-lg hover:bg-red-50 font-medium"
                    >
                        Delete Goal
                    </button>
                 </div>
            )}
        </div>
    );
};

// ==========================================
// 4. MAIN APP COMPONENT
// ==========================================

const todayStr = new Date().toISOString().split('T')[0];
const nextWeekStr = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const nextMonthStr = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

const initialData: Goal = {
    id: 'root',
    name: "Life Vision",
    progress: 0,
    importance: 100,
    notes: "The overarching mission for the next 5 years.",
    tags: ["Strategic"],
    dueDate: nextMonthStr,
    startDate: undefined,
    responsible: '',
    color: '#38bdf8', // Sky blue
    actions: [
        { id: 'a1', text: 'Review annual goals', completed: false },
        { id: 'a2', text: 'Create vision board', completed: true }
    ],
    comments: [],
    files: [],
    children: [
        { 
            id: '1', 
            name: "Health", 
            progress: 60, 
            importance: 40, 
            tags: ["Personal"], 
            dueDate: nextWeekStr, 
            startDate: undefined,
            responsible: '',
            color: '#4ade80', 
            notes: undefined,
            actions: [],
            comments: [],
            files: [],
            children: [
                { 
                    id: '1-1', 
                    name: "Marathon", 
                    progress: 75, 
                    importance: 60, 
                    tags: ["Fitness"], 
                    dueDate: todayStr, 
                    startDate: undefined,
                    responsible: '',
                    color: undefined,
                    notes: undefined,
                    actions: [],
                    comments: [],
                    files: [],
                    children: [] 
                },
                { 
                    id: '1-2', 
                    name: "Meditation", 
                    progress: 30, 
                    importance: 40, 
                    tags: ["Mind"], 
                    dueDate: undefined,
                    startDate: undefined,
                    responsible: '',
                    color: undefined,
                    notes: undefined,
                    actions: [],
                    comments: [],
                    files: [],
                    children: [] 
                }
            ]
        },
        { 
            id: '2', 
            name: "Career", 
            progress: 25, 
            importance: 60, 
            tags: ["Work"], 
            dueDate: undefined,
            startDate: undefined,
            responsible: '',
            color: '#f472b6', 
            notes: undefined,
            actions: [],
            comments: [],
            files: [],
            children: [
                { 
                    id: '2-1', 
                    name: "Promotion", 
                    progress: 10, 
                    importance: 50, 
                    tags: [],
                    dueDate: undefined,
                    startDate: undefined,
                    responsible: '',
                    color: undefined,
                    notes: undefined,
                    actions: [],
                    comments: [],
                    files: [],
                    children: [] 
                },
                { 
                    id: '2-2', 
                    name: "Skills", 
                    progress: 80, 
                    importance: 50, 
                    tags: [],
                    dueDate: undefined,
                    startDate: undefined,
                    responsible: '',
                    color: undefined,
                    notes: undefined,
                    actions: [],
                    comments: [],
                    files: [],
                    children: [
                        { 
                            id: '2-2-1', 
                            name: "React", 
                            progress: 90, 
                            importance: 50, 
                            tags: [],
                            dueDate: undefined,
                            startDate: undefined,
                            responsible: '',
                            color: undefined,
                            notes: undefined,
                            actions: [],
                            comments: [],
                            files: [],
                            children: [] 
                        },
                        { 
                            id: '2-2-2', 
                            name: "TypeScript", 
                            progress: 60, 
                            importance: 50, 
                            dueDate: nextWeekStr, 
                            startDate: undefined,
                            responsible: '',
                            tags: [],
                            color: undefined,
                            notes: undefined,
                            actions: [],
                            comments: [],
                            files: [],
                            children: [] 
                        }
                    ]
                }
            ]
        },
        { 
            id: '3', 
            name: "Finance", 
            progress: 45, 
            importance: 30, 
            tags: ["Money"], 
            dueDate: undefined,
            startDate: undefined,
            responsible: '',
            color: '#fbbf24', 
            notes: undefined,
            actions: [],
            comments: [],
            files: [],
            children: [] 
        }
    ]
};

type FilterType = 'all' | 'overdue' | 'week' | 'month';

interface CircleViewProps {
    onBack?: () => void;
    onAskAI?: (goalText: string, goalNotes: string) => void;
}

export const CircleView: React.FC<CircleViewProps> = ({ onBack, onAskAI }) => {
    // State
    const [data, setData] = useState<Goal>(initialData);
    const [history, setHistory] = useState<Goal[]>([]);
    const [redoStack, setRedoStack] = useState<Goal[]>([]);
    
    const [focusedId, setFocusedId] = useState<string>('root'); 
    const [selectedId, setSelectedId] = useState<string>('root'); 
    const [contextMenu, setContextMenu] = useState<ContextMenuState>({ visible: false, x: 0, y: 0, targetId: null });
    const [filter, setFilter] = useState<FilterType>('all');

    // Memoized Helpers
    const focusedGoal = useMemo(() => findNode(data, focusedId), [data, focusedId]);
    const selectedGoal = useMemo(() => findNode(data, selectedId), [data, selectedId]);
    const breadcrumbs = useMemo(() => findPath(data, focusedId) || [], [data, focusedId]);

    // History Logic
    const pushState = (newData: Goal) => {
        setHistory(prev => [...prev, data]);
        setRedoStack([]);
        setData(newData);
    };

    const undo = () => {
        if (history.length === 0) return;
        const previous = history[history.length - 1];
        setRedoStack(prev => [data, ...prev]);
        setData(previous);
        setHistory(prev => prev.slice(0, prev.length - 1));
    };

    const redo = () => {
        if (redoStack.length === 0) return;
        const next = redoStack[0];
        setHistory(prev => [...prev, data]);
        setData(next);
        setRedoStack(prev => prev.slice(1));
    };

    // Filter Logic
    const checkFilter = (goal: Goal, type: FilterType): boolean => {
        if (type === 'all') return true;
        if (!goal.dueDate) return false;
        const due = new Date(goal.dueDate);
        const now = new Date();
        now.setHours(0,0,0,0);
        due.setHours(0,0,0,0);
        if (type === 'overdue') return due < now;
        if (type === 'week') {
            const endOfWeek = new Date(now);
            endOfWeek.setDate(now.getDate() + 7);
            return due >= now && due <= endOfWeek;
        }
        if (type === 'month') {
            const endOfMonth = new Date(now);
            endOfMonth.setDate(now.getDate() + 30);
            return due >= now && due <= endOfMonth;
        }
        return false;
    };

    // Chart Calculation
    const renderItems: RenderItem[] = useMemo(() => {
        const items: RenderItem[] = [];
        if (!focusedGoal) return items;

        const CENTER_R = 70;
        const MAX_RADIUS = 280;
        const DEFAULT_COLOR = "#94a3b8"; // Slate-400
        const startColor = focusedGoal.color || DEFAULT_COLOR;

        // Calculate dynamic layer depth to ensure fixed outer radius
        const maxTreeDepth = getTreeDepth(focusedGoal);
        const effectiveDepth = Math.max(maxTreeDepth, 1); 
        const LEVEL_DEPTH = (MAX_RADIUS - CENTER_R) / effectiveDepth;

        const processLevel = (node: Goal, startAngle: number, endAngle: number, depth: number, parentColor: string) => {
            if (depth > 10) return; 

            const myEffectiveColor = node.color || parentColor;
            const totalImp = node.children.reduce((acc, c) => acc + c.importance, 0);
            const safeTotal = totalImp === 0 ? node.children.length : totalImp;

            let currentAngle = startAngle;

            node.children.forEach(child => {
                const weight = totalImp === 0 ? 1 : child.importance;
                const span = (endAngle - startAngle) * (weight / safeTotal);
                const end = currentAngle + span;
                const childEffectiveColor = child.color || myEffectiveColor;
                const isMatching = checkFilter(child, filter);

                items.push({
                    goal: child,
                    start: currentAngle,
                    end: end,
                    innerR: CENTER_R + (depth * LEVEL_DEPTH),
                    outerR: CENTER_R + ((depth + 1) * LEVEL_DEPTH),
                    effectiveColor: childEffectiveColor,
                    isDimmed: filter !== 'all' && !isMatching
                });

                if (child.children.length > 0) {
                    processLevel(child, currentAngle, end, depth + 1, childEffectiveColor);
                }
                currentAngle = end;
            });
        };

        if (focusedGoal.children) {
            processLevel(focusedGoal, 0, 360, 0, startColor);
        }
        return items;
    }, [focusedGoal, filter]);

    // Handlers
    const handleUpdate = (field: keyof Goal, value: any) => {
        pushState(updateNodeInTree(data, selectedId, { [field]: value }));
    };

    const handleAddSubgoal = () => {
        const target = selectedId; 
        if (!target) return;
        pushState(addChildToNode(data, target));
        setContextMenu(prev => ({ ...prev, visible: false }));
    };

    const handleAddSibling = () => {
        if (!selectedId || selectedId === 'root') return;
        const parent = findParent(data, selectedId);
        if (parent) {
            pushState(addChildToNode(data, parent.id));
        }
    };

    const handleDeleteGoal = () => {
        const target = contextMenu.targetId || selectedId;
        if (!target || target === 'root') return;
        if (target === focusedId) {
            const path = findPath(data, focusedId);
            if (path && path.length > 1) {
                setFocusedId(path[path.length - 2].id);
            } else {
                setFocusedId('root');
            }
        }
        pushState(deleteNodeFromTree(data, target));
        setContextMenu(prev => ({ ...prev, visible: false }));
        setSelectedId('root');
    };

    const handleContextMenu = (e: React.MouseEvent, goal: Goal) => {
        e.preventDefault();
        setContextMenu({ visible: true, x: e.clientX, y: e.clientY, targetId: goal.id });
        setSelectedId(goal.id);
    };

    const handleContextMenuColorChange = (color: string) => {
        if (contextMenu.targetId) {
            pushState(updateNodeInTree(data, contextMenu.targetId!, { color }));
            setContextMenu(prev => ({ ...prev, visible: false }));
        }
    };

    const handleBackgroundClick = () => {
        setContextMenu(prev => ({ ...prev, visible: false }));
    };

    const handleNavigateUp = () => {
        if (breadcrumbs.length > 1) {
            setFocusedId(breadcrumbs[breadcrumbs.length - 2].id);
        }
    };

    const handleDownload = () => {
        const svg = document.getElementById('main-chart-svg');
        if (!svg) return;
        const svgData = new XMLSerializer().serializeToString(svg);
        const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${data.name.replace(/\s+/g, '_')}_goalscape.svg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const canAddSibling = selectedId !== 'root';

    return (
        <div className="flex h-full w-full overflow-hidden bg-slate-50 text-slate-900 font-sans selection:bg-blue-200">
            <div className="flex-1 flex flex-col relative" onClick={handleBackgroundClick}>
                {/* Header Toolbar */}
                <div className="h-16 px-6 flex items-center justify-between border-b border-slate-200 z-10 bg-white/95 backdrop-blur shadow-sm">
                    {/* Left: Back Button, Home & Breadcrumbs */}
                    <div className="flex items-center gap-1 text-sm text-slate-500">
                        {onBack && (
                            <>
                                <button 
                                    onClick={onBack}
                                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors border border-slate-200 shadow-sm bg-white mr-2"
                                >
                                    <ArrowLeft size={16} />
                                    <span>Back to Tree View</span>
                                </button>
                                <div className="h-6 w-px bg-slate-300 mr-2"></div>
                            </>
                        )}
                        <div className="flex items-center bg-white rounded-lg p-1 mr-3 border border-slate-200 shadow-sm">
                            <button onClick={() => setFocusedId('root')} className={`p-2 rounded hover:bg-slate-100 hover:text-slate-900 transition-colors ${focusedId === 'root' ? 'text-blue-600' : 'text-slate-500'}`} title="Home">
                                <Home size={18} />
                            </button>
                             <div className="w-px h-6 bg-slate-200 mx-1"></div>
                            <button onClick={undo} disabled={history.length === 0} className={`p-2 rounded hover:bg-slate-100 transition-colors ${history.length === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:text-slate-900 text-slate-500'}`} title="Undo">
                                <RotateCcw size={18} />
                            </button>
                            <button onClick={redo} disabled={redoStack.length === 0} className={`p-2 rounded hover:bg-slate-100 transition-colors ${redoStack.length === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:text-slate-900 text-slate-500'}`} title="Redo">
                                <RotateCw size={18} />
                            </button>
                             <div className="w-px h-6 bg-slate-200 mx-1"></div>
                             <button onClick={handleDownload} className="p-2 rounded hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors" title="Download SVG">
                                <Download size={18} />
                            </button>
                        </div>
                        
                        {breadcrumbs.length > 1 && (
                            <div className="flex items-center overflow-hidden">
                                {breadcrumbs.slice(1).map((node) => (
                                    <React.Fragment key={node.id}>
                                        <ChevronRight size={14} className="text-slate-400 flex-shrink-0" />
                                        <button onClick={() => setFocusedId(node.id)} className={`hover:text-slate-900 hover:underline underline-offset-4 transition-all px-1 truncate max-w-[150px] ${node.id === focusedId ? 'text-slate-900 font-bold' : 'text-slate-600'}`}>
                                            {node.name}
                                        </button>
                                    </React.Fragment>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Filters */}
                    <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
                        <div className="flex items-center text-slate-400 px-2 gap-1 border-r border-slate-200 mr-1">
                            <CalendarClock size={14} />
                            <span className="text-xs uppercase font-bold tracking-wider">Due</span>
                        </div>
                        {[
                            { id: 'all', label: 'All' },
                            { id: 'overdue', label: 'Overdue' },
                            { id: 'week', label: 'This Week' },
                            { id: 'month', label: 'This Month' },
                        ].map((f) => (
                            <button
                                key={f.id}
                                onClick={() => setFilter(f.id as FilterType)}
                                className={`px-3 py-1 text-xs rounded-md transition-all font-medium ${
                                    filter === f.id ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                                }`}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 flex items-center justify-center relative overflow-hidden bg-slate-50 px-[100px] py-[0px]">
                     <div className="absolute top-6 right-6 flex flex-col gap-2 z-20">
                        <div className="bg-white/90 backdrop-blur border border-slate-200 p-1.5 rounded-lg shadow-lg flex flex-col gap-1">
                            <button onClick={(e) => { e.stopPropagation(); handleAddSibling(); }} disabled={!canAddSibling} className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${!canAddSibling ? 'opacity-40 cursor-not-allowed text-slate-400' : 'hover:bg-slate-100 text-slate-700'}`} title="Add Sibling (Side)">
                                <ArrowRightFromLine size={16} /> <span className="font-medium">Add Sibling</span>
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); handleAddSubgoal(); }} className="flex items-center gap-2 px-3 py-2 rounded-md text-sm hover:bg-slate-100 text-slate-700 transition-colors" title="Add Subgoal (Next Layer)">
                                <CornerDownRight size={16} /> <span className="font-medium">Add Subgoal</span>
                            </button>
                        </div>
                     </div>

                    <div className="relative w-[600px] h-[600px] animate-fade-in-scale">
                        <svg id="main-chart-svg" width="100%" height="100%" viewBox="0 0 600 600" className="drop-shadow-xl">
                            <defs>
                                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                                    <feGaussianBlur stdDeviation="5" result="blur" />
                                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                </filter>
                            </defs>
                            {renderItems.map((item) => (
                                <GoalSlice 
                                    key={item.goal.id}
                                    goal={item.goal}
                                    startAngle={item.start}
                                    endAngle={item.end}
                                    innerRadius={item.innerR}
                                    outerRadius={item.outerR}
                                    effectiveColor={item.effectiveColor}
                                    isSelected={selectedId === item.goal.id}
                                    isDimmed={item.isDimmed}
                                    onSelect={(g) => setSelectedId(g.id)}
                                    onContextMenu={handleContextMenu}
                                    onDoubleClick={(g) => setFocusedId(g.id)}
                                />
                            ))}
                            {focusedGoal && (
                                <CenterGoal goal={focusedGoal} onSelect={(g) => setSelectedId(g.id)} onContextMenu={handleContextMenu} onDoubleClick={handleNavigateUp} />
                            )}
                        </svg>
                    </div>
                    <div className="absolute bottom-6 left-6 text-slate-400 text-xs pointer-events-none">
                        <p className="mb-1"><strong className="text-slate-600">Left Click</strong> to select</p>
                        <p className="mb-1"><strong className="text-slate-600">Right Click</strong> to edit/add</p>
                        <p className="mb-1"><strong className="text-slate-600">Double Click</strong> to focus/drill-down</p>
                    </div>
                </div>
            </div>

            <Sidebar goal={selectedGoal} isRoot={selectedId === 'root'} onUpdate={handleUpdate} onAddSubgoal={handleAddSubgoal} onDeleteGoal={handleDeleteGoal} onAskAI={onAskAI} />
            <ContextMenu 
                {...contextMenu} 
                onClose={() => setContextMenu(prev => ({ ...prev, visible: false }))} 
                onAdd={handleAddSubgoal} 
                onDelete={handleDeleteGoal}
                onFocus={() => { 
                    if (contextMenu.targetId) setFocusedId(contextMenu.targetId); 
                    setContextMenu(prev => ({ ...prev, visible: false })); 
                }}
                onColorChange={handleContextMenuColorChange}
                isRoot={contextMenu.targetId === 'root'}
            />
        </div>
    );
};
