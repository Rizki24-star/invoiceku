import {
  format,
  getDay,
  getMonth,
  getWeekOfMonth,
  getWeeksInMonth,
} from "date-fns";
import { Invoice } from "../types";

export type FilterStatus = {
  year: string;
  month: string;
  week: string;
  day: string;
};

export const months = [
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

export const weeks = [
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

export const days = [
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

export const filterInvoices = (invoices: Invoice[], filter: FilterStatus) => {
  return invoices.filter((invoice) => {
    const date = new Date(invoice.date);

    if (filter.year && format(date, "yyyy") !== filter.year) return false;
    if (filter.month && format(date, "M") !== filter.month) return false;
    if (filter.week && getWeekOfMonth(date) !== Number(filter.week))
      return false;

    return true;
  });
};

export const groupedPriceByMonth = (
  invoices: Invoice[]
): { label: string[]; data: number[] } => {
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

  return {
    label: months.map((month) => month.name),
    data: Array.from(groupedPrice.values()).map((price) => price),
  };
};

export const groupedPriceByWeek = (
  month: string,
  year: string,
  invoices: Invoice[]
): { label: string[]; data: number[] } => {
  let groupedPrice = new Map<number, number>();

  const totalWeeks = getWeeksInMonth(new Date(Number(year), Number(month) - 1));

  const weeks: string[] = [];

  for (let i = 1; i <= totalWeeks; i++) {
    groupedPrice.set(Number(i), 0);
    weeks.push(`Week ${i}`);
  }

  for (let i = 0; i < invoices.length; i++) {
    const { date, total_price } = invoices[i];
    const week = getWeekOfMonth(new Date(date));

    groupedPrice.set(week, (groupedPrice.get(week) || 0) + Number(total_price));
  }

  return {
    label: weeks.map((week) => week),
    data: Array.from(groupedPrice.values()).map((price) => price),
  };
};

export const groupedPriceByDay = (invoices: Invoice[]) => {
  let groupedPrice = new Map<number, number>();
  days.forEach((day) => {
    groupedPrice.set(Number(day.value), 0);
  });
  for (let i = 0; i < invoices.length; i++) {
    const { date, total_price } = invoices[i];
    const day = getDay(new Date(date));
    groupedPrice.set(day, (groupedPrice.get(day) || 0) + Number(total_price));
  }

  return {
    label: days.map((day) => day.name),
    data: Array.from(groupedPrice.values()).map((price) => price),
  };
};
