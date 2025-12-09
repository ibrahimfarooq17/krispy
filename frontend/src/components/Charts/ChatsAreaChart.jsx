import { Badge } from "@mui/material";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import krispyAxios from "../../utilities/krispyAxios";
import Spinner from "../@generalComponents/Spinner";

const ChatsAreaChart = ({ chatAnalytics }) => {
  if (chatAnalytics)
    return (
      <React.Fragment>
        <ResponsiveContainer width="105%" height={350}>
          <LineChart
            data={chatAnalytics?.results?.map((analytic) => {
              return {
                name: moment(analytic?.date).format("MMM DD"),
                currentMonth: analytic?.totalChats,
              };
            })}
            margin={{ top: 30, right: 90, left: -10, bottom: 0 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line type="monotone" dataKey="currentMonth" stroke="#5C78FF" />
          </LineChart>
        </ResponsiveContainer>
      </React.Fragment>
    );
  else return <Spinner />;
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload;

    return (
      <div className="custom-tooltip bg-[#FFFFFF] w-[250px] h-[124px] ">
        <p className="label font-inter font-medium text-[18px] ">
          Conversations
        </p>
        <div className="flex items-center justify-between mt-[-10px]">
          <p>
            <Badge color="secondary" variant="dot" className="badgeChart1" />
            <span className="ml-2">{item.currentMonth}</span>
          </p>
          <p className="text-[#A5A5A5]"> {label} </p>
        </div>
      </div>
    );
  }

  return null;
};

export default ChatsAreaChart;
