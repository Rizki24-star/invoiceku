import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { getInvoicesByYear } from "../../services/invoiceService";
import { Invoice } from "../../types";

import "./chart.scss";
import { Bar } from "react-chartjs-2";
import {
  filterInvoices,
  FilterStatus,
  groupedPriceByDay,
  groupedPriceByMonth,
  groupedPriceByWeek,
  months,
  weeks,
} from "../../utils/invoiceFilter";

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ChartComponent: React.FC<{ year: string }> = ({ year }) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  const [filter, setFilter] = useState<FilterStatus>({
    day: "",
    month: "",
    week: "",
    year: year,
  });

  const [chartLabel, setChartLabel] = useState<string[]>();
  const [chartData, setChartData] = useState<number[]>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getInvoicesByYear(filter.year)
      .then((response) => {
        setInvoices(response.data);
        groupedPriceByMonth(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [filter.year]);

  const filteredInvoices = useMemo(() => {
    return filterInvoices(invoices, filter);
  }, [invoices, filter]);

  useEffect(() => {
    setLoading(true);
    let label, data;
    if (filter.week) {
      ({ label, data } = groupedPriceByDay(filteredInvoices));
    } else if (filter.month) {
      ({ label, data } = groupedPriceByWeek(
        filter.month,
        filter.year,
        filteredInvoices
      ));
    } else {
      ({ label, data } = groupedPriceByMonth(filteredInvoices));
    }

    setChartLabel(label);
    setChartData(data);
    setLoading(false);
  }, [filteredInvoices]);

  const handleFilterChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const { name, value } = event.target;
      setFilter((prev) => {
        if (name === "month" && value === "")
          return { ...prev, month: "", week: "", day: "" };
        if (name === "week" && value === "")
          return { ...prev, week: "", day: "" };
        return { ...prev, [name]: value };
      });
    },
    []
  );

  return (
    <div className="w-full overflow-scroll">
      <div className="dates-filters flex items-center gap-2">
        <div className="filter">
          <select name="year" value={filter.year} onChange={handleFilterChange}>
            <option value={year}>{year}</option>
          </select>
        </div>
        {filter.year && (
          <div className="filter">
            <select
              name="month"
              value={filter.month}
              onChange={handleFilterChange}
            >
              <option value="">All months</option>
              {months.map(({ name, value }, i) => (
                <option key={i} value={value}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        )}
        {filter.month && (
          <div className="filter">
            <select
              name="week"
              value={filter.week}
              onChange={handleFilterChange}
            >
              <option value="">All weeks</option>
              {weeks.map(({ name, value }, i) => (
                <option key={i} value={value}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
      {loading === true ? (
        <div>Loading...</div>
      ) : (
        <Bar
          data={{
            labels: chartLabel,
            datasets: [
              {
                label: "Income",
                data: chartData,
                animation: false,

                backgroundColor: "rgba(75, 192, 192, 0.6)",
              },
            ],
          }}
          options={{
            responsive: true,
            plugins: { legend: { position: "top" } },
          }}
        />
      )}

      <div className="flex flex-wrap gap-2">
        {/* {filteredInvoices.map((item) => (
          <p>
            {item.date} {item.total_price} |
          </p>
        ))} */}
      </div>
    </div>
  );
};

export default ChartComponent;
