import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import krispyAxios from '../../utilities/krispyAxios';
import moment from 'moment';
import Spinner from '../@generalComponents/Spinner';
import { useSelector } from 'react-redux';

const RevenueChart = () => {
  const [analytics, setAnalytics] = useState();

  const knowledgeBase = useSelector(
    (state) => state.knowledgeBaseReducer.knowledgeBase
  );

  useEffect(() => {
    setAnalytics();
    getAnalytics();
  }, []);

  const getAnalytics = async () => {
    const { analytics } = await krispyAxios({
      method: 'GET',
      url: `analytics`
    });
    setAnalytics(analytics);
  };

  if (analytics)
    return (
      <React.Fragment>
        <h1 className='f-2xl-regular black mt-2'>
          {analytics?.shopifyAttributionRevenue + ' ' + knowledgeBase?.currency}
        </h1>
        <p className='settings-subtext mb-0' style={{ fontWeight: 600, fontSize: 10 }}>
          This amount represents the total sum of your
          Shopify store orders that came directly or
          indirectly through Krispy.
          Contact support to learn more about how we
          calculate this attribution.
        </p>
      </React.Fragment>
    );
  else return <Spinner />
}

export default RevenueChart;