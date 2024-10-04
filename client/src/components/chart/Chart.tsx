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
import { getInvoicesByYear } from "../../services/invoiceService";
import { Invoice } from "../../types";
import { format, getDay, getMonth, getWeekOfMonth } from "date-fns";
import "./chart.scss";
import { Bar } from "react-chartjs-2";

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type FilterStatus = {
  year: string;
  month: string;
  week: string;
  day: string;
};

const months = [
  {
    name: "January",
    value: "01",
  },
  {
    name: "February",
    value: "02",
  },
  {
    name: "March",
    value: "03",
  },
  {
    name: "April",
    value: "04",
  },
  {
    name: "May",
    value: "05",
  },
  {
    name: "June",
    value: "06",
  },
  {
    name: "July",
    value: "07",
  },
  {
    name: "August",
    value: "08",
  },
  {
    name: "September",
    value: "09",
  },
  {
    name: "October",
    value: "10",
  },
  {
    name: "November",
    value: "11",
  },
  {
    name: "December",
    value: "12",
  },
];

const weeks = [
  {
    name: "Week 1",
    value: "1",
  },
  {
    name: "Week 2",
    value: "2",
  },
  {
    name: "Week 3",
    value: "3",
  },
  {
    name: "Week 4",
    value: "4",
  },
  {
    name: "Week 5",
    value: "5",
  },
];

const days = [
  {
    name: "Monday",
    value: "1",
  },
  {
    name: "Tuesday",
    value: "2",
  },
  {
    name: "Wednesday",
    value: "3",
  },
  {
    name: "Thursday",
    value: "4",
  },
  {
    name: "Friday",
    value: "5",
  },
  {
    name: "Saturday",
    value: "6",
  },
  {
    name: "Sunday",
    value: "7",
  },
];

const ChartComponent: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [chartLabel, setChartLabel] = useState<string[]>();
  const [chartData, setChartData] = useState<number[]>();
  const [filter, setFilter] = useState<FilterStatus>({
    day: "",
    month: "",
    week: "",
    year: "",
  });

  useEffect(() => {
    getInvoicesByYear("2024")
      .then((response) => {
        setInvoices(response.data);
        setFilteredInvoices(response.data);
        setChartLabel(months.map((month) => month.name));
        setChartData(groupedPriceByMonth(response.data));
      })
      .catch((error) => {
        console.log(error);
      });

    setFilter({
      day: "",
      month: "",
      week: "",
      year: format(Date.now(), "yyyy"),
    });
  }, [filter.year]);

  const handleFilterInvoices = () => {
    let filtered = invoices;

    if (filter.month && filter.month !== "") {
      filtered = filtered.filter((invoice) => {
        return format(new Date(invoice.date), "MM") === filter.month;
      });
      groupedPriceByWeek(filtered);
    } else {
      setChartLabel(months.map((month) => month.name));
      setChartData(groupedPriceByMonth(filtered));
    }

    if (filter.week) {
      filtered = filtered.filter((invoice) => {
        const invoiceWeek = getWeekOfMonth(new Date(invoice.date));
        return invoiceWeek === Number(filter.week);
      });
      groupedPriceByDay(filtered);
    }

    setFilteredInvoices(filtered);
  };

  useEffect(() => {
    handleFilterInvoices();
  }, [filter.month, filter.week, filter.day]);

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

  const groupedPriceByMonth = (invoices: Invoice[]): number[] => {
    let groupedPrice = new Map<number, number>();
    for (let i = 0; i < invoices.length; i++) {
      const { date, total_price } = invoices[i];
      const month = getMonth(new Date(date));
      groupedPrice.set(
        month,
        (groupedPrice.get(month) || 0) + Number(total_price)
      );
    }

    return Array.from(groupedPrice.values()).map((price) => price);
  };

  const groupedPriceByWeek = (invoices: Invoice[]) => {
    let groupedPrice = new Map<number, number>();
    for (let i = 0; i < invoices.length; i++) {
      const { date, total_price } = invoices[i];
      const week = getWeekOfMonth(new Date(date));
      groupedPrice.set(
        week,
        (groupedPrice.get(week) || 0) + Number(total_price)
      );
    }
    setChartLabel(weeks.map((week) => week.name));
    setChartData(Array.from(groupedPrice.values()).map((price) => price));
  };

  const groupedPriceByDay = (invoices: Invoice[]) => {
    let groupedPrice = new Map<number, number>();
    for (let i = 0; i < invoices.length; i++) {
      const { date, total_price } = invoices[i];
      const day = getDay(new Date(date));
      groupedPrice.set(day, (groupedPrice.get(day) || 0) + Number(total_price));
    }
    setChartLabel(days.map((day) => day.name));
    setChartData(Array.from(groupedPrice.values()).map((price) => price));
  };

  return (
    <div className="w-full overflow-scroll">
      <div className="dates-filters flex items-center gap-2">
        <div className="filter">
          <select name="year" value={filter.year} onChange={handleFilterChange}>
            <option value="2024">2024</option>
          </select>
        </div>
        {filter.year !== "" && (
          <div className="filter">
            <select
              name="month"
              value={filter.month}
              onChange={handleFilterChange}
            >
              <option value="">All months</option>
              {months.map(({ name, value }) => (
                <option value={value}>{name}</option>
              ))}
            </select>
          </div>
        )}
        {filter.month !== "" && (
          <div className="filter">
            <select
              name="week"
              value={filter.week}
              onChange={handleFilterChange}
            >
              <option value="">All weeks</option>
              {weeks.map(({ name, value }) => (
                <option value={value}>{name}</option>
              ))}
            </select>
          </div>
        )}
      </div>
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
        options={{ responsive: true, plugins: { legend: { position: "top" } } }}
      />
      {/* {groupedPriceByMonth().map((item) => (
        <div>{item}</div>
      ))} */}

      <div className="flex flex-wrap gap-2">
        {filteredInvoices.map((item) => (
          <p>{item.total_price}</p>
        ))}
      </div>
      {/* {JSON.stringify(setInvoicesbyMonth())} */}
    </div>
  );
};

export default ChartComponent;
