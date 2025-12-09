'use client';
import { useEffect } from 'react';
import { getCurrentUser } from '../../redux/actions/user.actions';
import { getPreferences } from '../../redux/actions/preference.actions';
import { useDispatch } from 'react-redux';
import { getAllConnectors } from '../../redux/actions/connector.actions';
import { getKnowledgeBase } from '../../redux/actions/knowledgeBase.actions';

const GlobalCalls = () => {
  const dispatch = useDispatch();

  //global calls
  useEffect(() => {
    if (typeof window == 'undefined' || !localStorage.getItem('accessToken'))
      return;
    dispatch(getCurrentUser());
    dispatch(getPreferences());
    dispatch(getAllConnectors());
    dispatch(getKnowledgeBase());
  }, [window]);

  return null;
};

export default GlobalCalls;
