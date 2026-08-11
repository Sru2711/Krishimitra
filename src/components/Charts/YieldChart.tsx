import { FarmHistory } from "@/src/types/farmer";
import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface YieldChartProps {
  data: FarmHistory[];
}

interface ChartData {
  date: number;
  yield: number;
}

const YieldChart = ({ data }: YieldChartProps) => {
  const [dataForChart, setDataForChart] = useState<ChartData[]>([]);
  //  #FFB300
  useEffect(() => {
    if (!data.length) return;

    const newData = data.map((entry) => ({
      yield: Number(entry.cropYield),
      date: new Date(entry.createdAt!).getFullYear(),
    }));

    setDataForChart(newData);
  }, [data]);
  return (
    <div className="w-full h-auto overflow-auto">
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={dataForChart}>
          <CartesianGrid strokeDasharray="1 1" />
          <XAxis
            dataKey="date"
            padding={{
              left: 20,
              right: 20,
            }}
          />
          <YAxis />
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              border: "none",
              boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
            }}
          />
          <Line
            dataKey="yield"
            stroke="#4FC3F7"
            type="monotone"
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 8 }}
            isAnimationActive
            animationDuration={2000}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default YieldChart;
