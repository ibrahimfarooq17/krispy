// 'use client';


// import React, { PureComponent } from 'react';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';



// // const data = [
// //   {
// //     name: 'Page A',
// //     uv: 4000,
// //     pv: 2400,
// //     amt: 2400,
// //   },
// //   {
// //     name: 'Page B',
// //     uv: 3000,
// //     pv: 1398,
// //     amt: 2210,
// //   },
// //   {
// //     name: 'Page C',
// //     uv: 2000,
// //     pv: 9800,
// //     amt: 2290,
// //   },
// //   {
// //     name: 'Page D',
// //     uv: 2780,
// //     pv: 3908,
// //     amt: 2000,
// //   },
// //   {
// //     name: 'Page E',
// //     uv: 1890,
// //     pv: 4800,
// //     amt: 2181,
// //   },
// //   {
// //     name: 'Page F',
// //     uv: 2390,
// //     pv: 3800,
// //     amt: 2500,
// //   },
// //   {
// //     name: 'Page G',
// //     uv: 3490,
// //     pv: 4300,
// //     amt: 2100,
// //   },
// // ];



//  export default function SimpleLineChart() {


//   const data = [
//     {
//       "name": 'Jun 16',
//       "uv": 1500,
//       "pv": 1800,
//       "amt": 2400
//     },
//     {
//       "name": 'Jun 18',
//       "uv": 2000,
//       "pv": 1398,
//       "amt": 2210
//     },
//     {
//       "name":  'Jun 20',
//       "uv": 2000,
//       "pv": 2000,
//       "amt": 2290
//     },
//     {
//       "name":  'Jun 22',
//       "uv": 2780,
//       "pv": 2508,
//       "amt": 2000
//     },
//     {
//       "name":'Jun 24',
//       "uv": 1890,
//       "pv": 4800,
//       "amt": 2181
//     },
//     {
//       "name":'Jun 26',
//       "uv": 2390,
//       "pv": 3800,
//       "amt": 2500
//     },
//     {
//       "name": 'Jun 28',
//       "uv": 3490,
//       "pv": 4300,
//       "amt": 2100
//     },
//     {
//       "name": 'Jun 30',
//       "uv": 3490,
//       "pv": 4300,
//       "amt": 2100
//     },
//     {
//       "name": 'Jul 02',
//       "uv": 3490,
//       "pv": 4300,
//       "amt": 2100
//     },
//     {
//       "name":'Jul 04',
//       "uv": 3490,
//       "pv": 4300,
//       "amt": 2100
//     },
//     {
//       "name": 'Jul 06',
//       "uv": 3490,
//       "pv": 4300,
//       "amt": 2100
//     },
    // {
    //   "name":'Jul 08',
    //   "uv": 3490,
    //   "pv": 4300,
    //   "amt": 2100
    // },
//   ]

//               return(
// <ResponsiveContainer width="107%" height={350}>
//   <LineChart
//     data={data}
//     margin={{ top: 30, right: 90, left: -10, bottom: 0 }}
//   >
//     <CartesianGrid vertical={false} strokeDasharray="3 3" />
//     <XAxis dataKey="name" />
//     <YAxis />
//     <Tooltip content={<CustomTooltip />} />
//     <Legend />
//     <Line type="monotone" dataKey="pv" stroke="#5C78FF" />
//     <Line type="monotone" dataKey="uv" stroke="#04A88C" />
//   </LineChart>
// </ResponsiveContainer>
//   )                
//   }
  
















// // import React, { useEffect, useState } from 'react';
// // import { LineChart } from '@mui/x-charts/LineChart';
// // import Paper from "@mui/material/Paper";
// // export default function SimpleLineChart({ interval }) {
// //   const [chatAnalytics, setChatAnalytics] = useState();

// //   const intervalStartDate = chatAnalytics?.results?.[0]?.date;
// //   const intervalEndDate =
// //     chatAnalytics?.results?.[chatAnalytics?.results?.length - 1]?.date;

// //   useEffect(() => {
// //     if (!interval) return;
// //     setChatAnalytics();
// //     getChatAnalytics();
// //   }, [interval]);

// //   const getChatAnalytics = async () => {
// //     const { analytics } = await krispyAxios({
// //       method: 'GET',
// //       url: `analytics/chats/count?interval=${interval}`,
// //     });
// //     setChatAnalytics(analytics);
// //   };

// //   const uData = [
// //     4000,
// //     3000,
// //     2000,
// //     2780,
// //     1890,
// //     2390,
// //     3490,
// //     2000,
// //     4000,
// //     3000,
// //     5000,
// //     4500,
// //     5200,
// //   ];
// //   const pData = [
// //     2400,
// //     4098,
// //     4000,
// //     3908,
// //     4000,
// //     3800,
// //     4300,
// //     4400,
// //     4600,
// //     4000,
// //     4200,
// //     4200,
// //     4800,
// //   ];
// //   const xLabels = [
// //     'Conversation',
// //     'Jun 16',
// //     'Jun 18',
// //     'Jun 20',
// //     'Jun 22',
// //     'Jun 24',
// //     'Jun 26',
// //     'Jun 28',
// //     'Jun 30',
// //     'Jul 02',
// //     'Jul 04',
// //     'Jul 06',
// //     'Jul 08', 
// //   ];

  
  
// //   const CustomItemTooltipContent = () => {

  
// //     return (
// //       <Paper sx={{ padding: 3, backgroundColor:'red' }}>
// //         <p>Zeeshi</p>
// //         <p>x:hi</p>
// //         <p>y:by</p>
// //         <p>
// //           additional value: {"by"}
// //         </p>
// //         <p>
// //           other additional value:{" "}
// //           {'hello'}
// //         </p>
// //       </Paper>
// //     );
// //   };
  
   
// //   return (
// //     <LineChart
// //       width={1200}
// //       height={450}
// //       tooltip={{ trigger: "item", itemContent: CustomItemTooltipContent }}
// //       series={[
// //         { data: pData, label: '', color: '#04A88C', marker: { enabled: false } },
// //         { data: uData, label: '', color: '#5C78FF', marker: { enabled: false } },
// //       ]}
// //       xAxis={[
// //         { scaleType: 'point', data: xLabels, position: 'top' },
// //       ]}
// //     />
// //   );
// // }
