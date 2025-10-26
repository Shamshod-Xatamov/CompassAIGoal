import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface GoalProgressProps {
  quest: any;
}

export function GoalProgress({ quest }: GoalProgressProps) {
  // Mock data for different quest types
  const getChartData = () => {
    if (quest.name === 'Launch Side Project') {
      return [
        { week: 'Week 1', progress: 5 },
        { week: 'Week 2', progress: 12 },
        { week: 'Week 3', progress: 18 },
        { week: 'Week 4', progress: 25 },
        { week: 'Week 5', progress: 35 },
      ];
    } else if (quest.name === 'Learn Guitar') {
      return [
        { week: 'Week 1', progress: 10 },
        { week: 'Week 2', progress: 22 },
        { week: 'Week 3', progress: 35 },
        { week: 'Week 4', progress: 48 },
        { week: 'Week 5', progress: 60 },
      ];
    } else {
      return [
        { week: 'Week 1', progress: 8 },
        { week: 'Week 2', progress: 15 },
        { week: 'Week 3', progress: 28 },
        { week: 'Week 4', progress: 35 },
        { week: 'Week 5', progress: 45 },
      ];
    }
  };

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-slate-600">Overall Progress</span>
          <span className="text-2xl text-indigo-600">{quest.progress}%</span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-600 transition-all duration-500"
            style={{ width: `${quest.progress}%` }}
          />
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={getChartData()}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="week" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
              }}
            />
            <Line
              type="monotone"
              dataKey="progress"
              stroke="#4f46e5"
              strokeWidth={3}
              dot={{ fill: '#4f46e5', r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
