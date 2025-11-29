import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
    { time: '00:00', pnlA: 0, pnlB: 0 },
    { time: '00:05', pnlA: 2, pnlB: -1 },
    { time: '00:10', pnlA: 5, pnlB: 1 },
    { time: '00:15', pnlA: 3, pnlB: 4 },
    { time: '00:20', pnlA: 8, pnlB: 2 },
    { time: '00:25', pnlA: 12, pnlB: 5 },
    { time: '00:30', pnlA: 10, pnlB: 8 },
];

export function BattleChart() {
    return (
        <div className="w-full h-[300px] bg-card border border-border rounded-lg p-4">
            <h3 className="text-sm font-medium mb-4">Live PNL Performance</h3>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.1} />
                    <XAxis dataKey="time" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
                    <Tooltip
                        contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
                        itemStyle={{ fontSize: '12px' }}
                    />
                    <Line type="monotone" dataKey="pnlA" stroke="#2563eb" strokeWidth={2} dot={false} name="You" />
                    <Line type="monotone" dataKey="pnlB" stroke="#dc2626" strokeWidth={2} dot={false} name="Opponent" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
