import generateRandomString from '../../utilities/generateRandomString';
import * as Actions from '../actions/flow.actions';

const initialState = {
	nodes: [
		{
			id: generateRandomString(20),
			type: 'startNode',
			position: { x: 100, y: 100 },
			data: {
				triggerType: 'SHOPIFY_ORDER_RECEIVED',
			},
		},
	],
	edges: [],
	analytics: null,
	flows: null,
};

export const flowReducer = (state = initialState, action) => {
	const { type, payload } = action;

	switch (type) {
		case Actions.GET_ALL_FLOWS:
			return (state = {
				...state,
				flows: payload,
			});
		case Actions.CLEAR_ALL_FLOWS:
			return (state = {
				...state,
				flows: payload,
			});
		case Actions.SET_NODES:
			return (state = {
				...state,
				nodes: payload,
			});
		case Actions.SET_EDGES:
			return (state = {
				...state,
				edges: payload,
			});
		case Actions.ADD_NODE:
			return (state = {
				...state,
				nodes: [...state.nodes, payload],
			});
		case Actions.ADD_EDGE:
			return (state = {
				...state,
				edges: [...state.edges, payload],
			});
		case Actions.UPDATE_NODE_POSITION: {
			const foundNode = state.nodes.find((node) => node.id === payload.id);
			const filteredNodes = state.nodes.filter(
				(node) => node.id !== payload.id
			);
			if (foundNode) {
				return (state = {
					...state,
					nodes: [
						...filteredNodes,
						{
							...foundNode,
							position: payload.position,
						},
					],
				});
			}
		}
		case Actions.UPDATE_NODE_DATA: {
			const foundNode = state.nodes.find((node) => node.id === payload.id);
			const filteredNodes = state.nodes.filter(
				(node) => node.id !== payload.id
			);

			if (foundNode) {
				return (state = {
					...state,
					nodes: [
						...filteredNodes,
						{
							...foundNode,
							data: payload.data,
						},
					],
				});
			}
		}
		case Actions.REMOVE_EDGE: {
			const filteredEdges = state.edges.filter(
				(edge) => edge.id !== payload.id
			);
			return (state = {
				...state,
				edges: filteredEdges,
			});
		}
		case Actions.REMOVE_NODE: {
			const filteredNodes = state.nodes.filter(
				(node) => node.id !== payload.id
			);
			const filteredEdges = state.edges.filter(
				(edge) => edge.source !== payload.id || edge.target !== payload.id
			);
			return (state = {
				...state,
				nodes: filteredNodes,
				edges: filteredEdges,
			});
		}
		case Actions.RESET_NODES:
			return (state = {
				...state,
				nodes: initialState.nodes,
			});
		case Actions.RESET_EDGES:
			return (state = {
				...state,
				edges: initialState.edges,
			});
		case Actions.SET_FLOW_ANALYTICS:
			return (state = {
				...state,
				analytics: payload,
			});
		default:
			return state;
	}
};
