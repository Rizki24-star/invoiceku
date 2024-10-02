import React, { useState, useEffect } from "react";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type ChartDataType = {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
  }[];
};

const initialChartData: ChartDataType = {
  labels: [],
  datasets: [
    {
      label: "Income",
      data: [],
      backgroundColor: "rgba(75, 192, 192, 0.2)",
    },
  ],
};

const ChartComponent: React.FC<{
  date: string[];
  totalPrice: number[];
}> = ({ date, totalPrice }) => {
  const dateData = {
    labels: date,
    datasets: [
      {
        label: "Daily Income",
        data: totalPrice,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  return (
    <div className="w-full overflow-scroll">
      <Bar
        data={dateData}
        options={{ responsive: true, plugins: { legend: { position: "top" } } }}
      />
    </div>
  );
};

export default ChartComponent;
