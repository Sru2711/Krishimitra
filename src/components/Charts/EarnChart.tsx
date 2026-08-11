import { useEffect, useState } from "react";
import { FarmHistory as FarmHistoryType } from "@/src/types/farmer";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
interface earnChartProps {
  data: any[];
}

interface ChartData {
  yield: number;
  earned: number;
}

const EarnChart = ({ data }: earnChartProps) => {
  const [dataForChart, setDataForChart] = useState<ChartData[]>([]);

  useEffect(() => {
    if (!data.length) return;

    const newData = data.map((entry) => {
      return {
        yield: Number(entry.cropYield),
        earned: Number(entry?.earned) - Number(entry?.price),
      };
    });

    setDataForChart(newData);
  }, [data]);
  return (
    <div className="w-full h-auto">
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={dataForChart}>
          <CartesianGrid strokeDasharray="1 1" />
          <XAxis
            dataKey="earned"
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
              boxShadow: "0 8px 12px rgba(0,0,0,0.15)",
            }}
          />
          <Line
            dataKey="yield"
            stroke="#FFB300"
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

export default EarnChart;
