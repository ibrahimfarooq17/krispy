import React, { useEffect, useState } from 'react'
import SearchInput from '../../../components/@generalComponents/SearchInput';
import krispyAxios from '../../../utilities/krispyAxios';
import { useSelector } from 'react-redux';
import Spinner from '../../@generalComponents/Spinner';
import Input from '../../@generalComponents/Input';

const SuggestedCampaigns = ({ campaign, setCampaign }) => {

  const [query, setQuery] = useState('');
  const [suggestedCampaigns, setSuggestedCampaigns] = useState();
  const [loadingCampaigns, setLoadingCampaigns] = useState(false);

  const currentUser = useSelector((state) => state.userReducer.currentUser);

  useEffect(() => {
    getSuggestedCampaigns();
  }, []);

  const getSuggestedCampaigns = async () => {
    const { campaign_list } = await krispyAxios({
      method: 'POST',
      url: `https://krispy-ai-dev-dot-krispy-388910.ew.r.appspot.com/campaign/${currentUser?.entity?.entityId}`,
      body: {
        query: query,
        product_id: campaign?.selectedProduct
      },
      loadingStateSetter: setLoadingCampaigns
    });
    setSuggestedCampaigns(campaign_list);
  };

  const onSelectCampaignSuggestion = (suggestion) => {
    setCampaign({
      ...campaign,
      campaignText: suggestion
    });
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  };

  const onCampaignTextChange = (e) => {
    setCampaign({
      ...campaign,
      campaignText: e?.target?.value
    });
  };

  return (
    <div>
      <Input
        label='Campaign Text'
        placeholder="Experience the magic of Amber Dream, a radiant and modern fragrance that embodies the essence of jasmine. With notes of cashmere wood, solar notes, and vanilla, this playful and voluptuous scent is a rare and exhilarating experience. Discover Amber Dream, our interpretation of Alien. Available in 50ml size."
        rows={10}
        maxRows={10}
        type='textarea'
        value={campaign?.campaignText}
        onChange={onCampaignTextChange}
      />
      <form
        className='mt-4'
        onSubmit={(e) => {
          e.preventDefault();
          getSuggestedCampaigns();
        }}
      >
        <SearchInput
          placeholder='How would you like to engage your customers?'
          value={query}
          disabled={loadingCampaigns}
          onChange={(e) => setQuery(e?.target?.value)}
          onSearch={getSuggestedCampaigns}
        />
      </form>
      {loadingCampaigns ?
        <Spinner />
        : suggestedCampaigns?.length == 0 ?
          <div className='empty-chat-container mt-4'>
            <p className='empty-chat-text'>
              No suggestions found.
            </p>
          </div>
          : (
            <div className='row'>
              {suggestedCampaigns?.map(suggestedCampaign => {
                return (
                  <div
                    className='suggested-campaign-container m-2'
                    onClick={() => onSelectCampaignSuggestion(suggestedCampaign)}
                  >
                    <p className='m-0'>{suggestedCampaign}</p>
                  </div>
                )
              })}
            </div>
          )
      }
    </div>
  )
}

export default SuggestedCampaigns