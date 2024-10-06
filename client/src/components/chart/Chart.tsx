import React, { useState, useEffect, useMemo } from "react";
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
import {
  format,
  getDay,
  getMonth,
  getWeekOfMonth,
  getWeeksInMonth,
} from "date-fns";
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
    value: 1,
  },
  {
    name: "February",
    value: 2,
  },
  {
    name: "March",
    value: 3,
  },
  {
    name: "April",
    value: 4,
  },
  {
    name: "May",
    value: 5,
  },
  {
    name: "June",
    value: 6,
  },
  {
    name: "July",
    value: 7,
  },
  {
    name: "August",
    value: 8,
  },
  {
    name: "September",
    value: 9,
  },
  {
    name: "October",
    value: 10,
  },
  {
    name: "November",
    value: 11,
  },
  {
    name: "December",
    value: 12,
  },
];

const weeks = [
  {
    name: "Week 1",
    value: 1,
  },
  {
    name: "Week 2",
    value: 2,
  },
  {
    name: "Week 3",
    value: 3,
  },
  {
    name: "Week 4",
    value: 4,
  },
  {
    name: "Week 5",
    value: 5,
  },
  {
    name: "Week 6",
    value: 6,
  },
];

const days = [
  {
    name: "Sunday",
    value: 0,
  },
  {
    name: "Monday",
    value: 1,
  },
  {
    name: "Tuesday",
    value: 2,
  },
  {
    name: "Wednesday",
    value: 3,
  },
  {
    name: "Thursday",
    value: 4,
  },
  {
    name: "Friday",
    value: 5,
  },
  {
    name: "Saturday",
    value: 6,
  },
];

const filterInvoices = (invoices: Invoice[], filter: FilterStatus) => {
  return invoices.filter((invoice) => {
    const date = new Date(invoice.date);

    if (filter.year && format(date, "yyyy") !== filter.year) return false;
    if (filter.month && format(date, "M") !== filter.month) return false;
    if (filter.week && getWeekOfMonth(date) !== Number(filter.week))
      return false;

    return true;
  });
};

const ChartComponent: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  // const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);

  const [filter, setFilter] = useState<FilterStatus>({
    day: "",
    month: "",
    week: "",
    year: format(Date.now(), "yyyy"),
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
    if (filter.week) {
      groupedPriceByDay(filteredInvoices);
    } else if (filter.month) {
      groupedPriceByWeek(filteredInvoices);
    } else {
      groupedPriceByMonth(filteredInvoices);
    }
  }, [filteredInvoices]);

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFilter((prev) => {
      if (name === "month" && value === "")
        return { ...prev, month: "", week: "", day: "" };

      if (name === "week" && value === "")
        return { ...prev, week: "", day: "" };

      return { ...prev, [name]: value };
    });
  };

  const groupedPriceByMonth = (invoices: Invoice[]) => {
    let groupedPrice = new Map<number, number>();
    months.map((month) => {
      groupedPrice.set(Number(month.value), 0);
    });

    for (let i = 0; i < invoices.length; i++) {
      const { date, total_price } = invoices[i];
      const month = getMonth(new Date(date));
      groupedPrice.set(
        month,
        (groupedPrice.get(month) || 0) + Number(total_price)
      );
    }

    setChartLabel(months.map((month) => month.name));
    setChartData(Array.from(groupedPrice.values()).map((price) => price));
    // return Array.from(groupedPrice.values()).map((price) => price);
  };

  const groupedPriceByWeek = (invoices: Invoice[]) => {
    let groupedPrice = new Map<number, number>();

    const totalWeeks = getWeeksInMonth(
      new Date(Number(filter.year), Number(filter.month) - 1)
    );

    const weeks: string[] = [];

    for (let i = 1; i <= totalWeeks; i++) {
      groupedPrice.set(Number(i), 0);
      weeks.push(`Week ${i}`);
    }

    for (let i = 0; i < invoices.length; i++) {
      const { date, total_price } = invoices[i];
      const week = getWeekOfMonth(new Date(date));

      groupedPrice.set(
        week,
        (groupedPrice.get(week) || 0) + Number(total_price)
      );
    }
    setChartLabel(weeks);
    setChartData(Array.from(groupedPrice.values()).map((price) => price));
  };

  const groupedPriceByDay = (invoices: Invoice[]) => {
    let groupedPrice = new Map<number, number>();
    days.map((day) => {
      groupedPrice.set(Number(day.value), 0);
    });
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
        {filter.year && (
          // !== ""
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
        {filter.month && (
          // !== ""
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

      {/* <div className="flex flex-wrap gap-2">
        {filteredInvoices.map((item) => (
          <p>
            {item.date} {item.total_price} |
          </p>
        ))}
      </div> */}
    </div>
  );
};

export default ChartComponent;
