import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Simple test data
const testData = [
  { name: '9:00', value: 175.50 },
  { name: '10:00', value: 176.20 },
  { name: '11:00', value: 175.80 },
  { name: '12:00', value: 177.10 },
  { name: '13:00', value: 178.40 },
  { name: '14:00', value: 179.20 },
  { name: '15:00', value: 178.90 },
];

export function TestChart() {
  console.log('TestChart rendering with data:', testData);
  
  return (
    <div className="w-full h-80 bg-gray-900 rounded-lg p-4 border border-green-500">
      <h3 className="text-white text-lg mb-4">Test Chart (Should Always Work)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={testData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="name" 
            stroke="#9CA3AF"
            fontSize={12}
          />
          <YAxis 
            stroke="#9CA3AF"
            fontSize={12}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1F2937', 
              border: '1px solid #22c55e',
              borderRadius: '8px',
              color: 'white'
            }}
          />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke="#22c55e" 
            strokeWidth={2}
            dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
