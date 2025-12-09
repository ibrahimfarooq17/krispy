import * as Actions from '../actions/template.actions';

const initialState = {
	allTemplates: null,
};

export const templateReducer = (state = initialState, action) => {
	const { type, payload } = action;

	switch (type) {
		case Actions.GET_ALL_TEMPLATES:
			return (state = {
				...state,
				allTemplates: payload,
			});
		case Actions.REMOVE_SINGLE_TEMPLATE:
			return (state = {
				...state,
				allTemplates: state.allTemplates?.filter(
					(template) => template?.templateId != payload
				),
			});
		default:
			return state;
	}
};
