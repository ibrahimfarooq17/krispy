import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import krispyAxios from '../../utilities/krispyAxios';
import Spinner from '../@generalComponents/Spinner';

ChartJS.register(ArcElement, Tooltip, Legend);

const MessagesRatingChart = () => {
  const [chatAnalytics, setChatAnalytics] = useState();

  useEffect(() => {
    setChatAnalytics();
    getChatAnalytics();
  }, []);

  const getChatAnalytics = async () => {
    const { analytics } = await krispyAxios({
      method: 'GET',
      url: `analytics/messages/rating-count`
    });
    const nullRatingCount = analytics?.find(obj => obj?.feedbackRating == null)?.count || 0;
    const tenRatingCount = analytics?.find(obj => obj?.feedbackRating == 10)?.count || 0;
    const zeroRatingCount = analytics?.find(obj => obj?.feedbackRating == 0)?.count || 0;
    setChatAnalytics({
      nullRatingCount,
      tenRatingCount,
      zeroRatingCount,
      totalCount: nullRatingCount + tenRatingCount + zeroRatingCount
    });
  };

  if (chatAnalytics)
    return (
      <React.Fragment>
        <p className='f-2xl-regular black text-center'>
          {chatAnalytics?.totalChats != 0 ?
            Number((
              (chatAnalytics?.tenRatingCount + chatAnalytics?.nullRatingCount)
              / chatAnalytics?.totalCount
            ) * 100).toFixed(2)
            : 0.00
          }%
        </p>
        <div style={{ height: '200px' }}>
          <Doughnut
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'right'
                }
              }
            }}
            data={{
              labels: ['Unrated', "Satisfactory", "Unsatisfactory"],
              datasets: [
                {
                  fill: true,
                  data: [
                    chatAnalytics?.nullRatingCount,
                    chatAnalytics?.tenRatingCount,
                    chatAnalytics?.zeroRatingCount
                  ],
                  borderColor: ['rgb(245, 245, 245)', '#5C78FF', '#10324F'],
                  backgroundColor: ['rgba(245, 245, 245, 1)', '#5C78FF', '#10324F'],
                },
              ],
            }}
          />
        </div>
      </React.Fragment>
    );
  else return <Spinner />
}

export default MessagesRatingChart;