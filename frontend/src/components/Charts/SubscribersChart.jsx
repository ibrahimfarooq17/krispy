import React, { useEffect, useState } from "react";
import { Chart, Tooltip } from "chart.js/auto";
import { Bar } from "react-chartjs-2";
import krispyAxios from "../../utilities/krispyAxios";
import Spinner from "../@generalComponents/Spinner";
import moment from "moment";

const chartOptions = {
  maintainAspectRatio: false,
  plugins: {
    tooltip: {
      displayColors: false,
      backgroundColor: '#fff',
      titleColor: '#5E5E5E',
      titleFontSize: '14px',
      bodyColor: 'black',
      yAlign: 'bottom',
      textAlign: 'center',
      boxShadow: '0px 6px 12px -6px #0000001A',
      boxShadow: '0px 12px 24px -12px #00000014',
      borderColor: '#DBDBDB',
      borderWidth: 1,
      bodyAlign: 'center',
      bodyFont: '500',
      bodyFontSize: '24px',

      callbacks: {
        title: function () {
          var label = "Subscribers"
          return label
        }
      }

    },
    legend: { display: false },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      grid: {
        display: true,
      },
      border: {
        dash: [6, 4],
      },

    },
  },
};

const SubscribersChart = ({ interval }) => {

  const [contactAnalytics, setContactAnalytics] = useState();

  useEffect(() => {
    if (!interval) return;
    getContactAnalytics();
  }, [interval]);

  const getContactAnalytics = async () => {
    setContactAnalytics();
    const { analytics } = await krispyAxios({
      method: 'GET',
      url: `analytics/contacts/count?interval=${interval}&consent=true`
    });
    setContactAnalytics(analytics);
  }

  return (
    <div style={{ height: '400px', width: '100%' }}>
      {contactAnalytics ?
        <Bar
          data={{
            labels: contactAnalytics?.results?.map(res => moment(res?.date).format('MMM DD')),
            datasets: [
              {
                backgroundColor: "#5C78FF",
                borderColor: "#5C78FF",
                borderRadius: 4,
                barThickness: 24,
                data: contactAnalytics?.results?.map(res => res?.totalContacts),
              },
            ],
          }}
          options={chartOptions}
        />
        :
        <Spinner />
      }
    </div>
  );
};

export default SubscribersChart;
