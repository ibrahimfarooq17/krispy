import generateRandomString from '../../utilities/generateRandomString';
import * as SubFlowActions from '../actions/subFlow.actions';

const initialState = {
	currentSubFlow: {
		nodes: [
			{
				id: generateRandomString(20),
				type: 'subFlowStartNode',
				position: { x: 20, y: 20 },
			},
		],
		edges: [],
	},
	allSubFlows: {
		subFlows: [],
	},
};

export const subFlowReducer = (state = initialState, action) => {
	const { type, payload } = action;

	switch (type) {
		case SubFlowActions.SAVE_SUB_FLOW: {
			let updatedAllSubflows = [];
			const foundSubFlow = state.allSubFlows.subFlows.find(
				(subFlow) => subFlow.startNode === payload.startNode
			);
			const filteredSubFlows = state.allSubFlows.subFlows.filter(
				(subFlow) => subFlow.startNode !== payload.startNode
			);

			if (foundSubFlow) {
				const updatedSubFlow = {
					...foundSubFlow,
					nodes: state.currentSubFlow.nodes,
					edges: state.currentSubFlow.edges,
				};
				updatedAllSubflows = [...filteredSubFlows, updatedSubFlow];
			} else {
				updatedAllSubflows = [
					...filteredSubFlows,
					{ startNode: payload.startNode, ...state.currentSubFlow },
				];
			}
			return (state = {
				...state,
				currentSubFlow: {
					nodes: initialState.currentSubFlow.nodes,
					edges: initialState.currentSubFlow.edges,
				},
				allSubFlows: {
					subFlows: updatedAllSubflows,
				},
			});
		}
		case SubFlowActions.REMOVE_SUB_FLOW:
			return (state = {
				...state,
				allSubFlows: {
					...state.allSubFlows,
					subFlows: state.allSubFlows.subFlows.filter(
						(subFlow) => subFlow.startNode !== payload.id
					),
				},
			});
		case SubFlowActions.SET_ALL_SUB_FLOWS:
			return (state = {
				...state,
				allSubFlows: {
					subFlows: payload,
				},
			});
		case SubFlowActions.ADD_SUB_FLOW_EDGE:
			return (state = {
				...state,
				currentSubFlow: {
					...state.currentSubFlow,
					edges: [...state.currentSubFlow.edges, payload],
				},
			});
		case SubFlowActions.ADD_SUB_FLOW_NODE:
			return (state = {
				...state,
				currentSubFlow: {
					...state.currentSubFlow,
					nodes: [...state.currentSubFlow.nodes, payload],
				},
			});
		case SubFlowActions.SET_SUB_FLOW_NODES:
			return (state = {
				...state,
				currentSubFlow: {
					...state.currentSubFlow,
					nodes: payload,
				},
			});
		case SubFlowActions.SET_SUB_FLOW_EDGES:
			return (state = {
				...state,
				currentSubFlow: {
					...state.currentSubFlow,
					edges: payload,
				},
			});
		case SubFlowActions.UPDATE_SUB_FLOW_NODE_DATA: {
			const foundNode = state.currentSubFlow.nodes.find(
				(node) => node.id === payload.id
			);
			const filteredNodes = state.currentSubFlow.nodes.filter(
				(node) => node.id !== payload.id
			);

			if (foundNode) {
				return (state = {
					...state,
					currentSubFlow: {
						...state.currentSubFlow,
						nodes: [
							...filteredNodes,
							{
								...foundNode,
								data: payload.data,
							},
						],
					},
				});
			}
		}
		case SubFlowActions.UPDATE_SUB_FLOW_NODE_POSITION: {
			const foundNode = state.currentSubFlow.nodes.find(
				(node) => node.id === payload.id
			);
			const filteredNodes = state.currentSubFlow.nodes.filter(
				(node) => node.id !== payload.id
			);
			return (state = {
				...state,
				currentSubFlow: {
					...state.currentSubFlow,
					nodes: [
						...filteredNodes,
						{
							...foundNode,
							position: payload.position,
						},
					],
				},
			});
		}
		case SubFlowActions.REMOVE_SUB_FLOW_EDGE:
			return (state = {
				...state,
				currentSubFlow: {
					...state.currentSubFlow,
					edges: state.currentSubFlow.edges.filter(
						(edge) => edge.id !== payload.id
					),
				},
			});
		case SubFlowActions.REMOVE_SUB_FLOW_NODE:
			return (state = {
				...state,
				currentSubFlow: {
					...state.currentSubFlow,
					nodes: state.currentSubFlow.nodes.filter(
						(node) => node.id !== payload.id
					),
				},
			});
		case SubFlowActions.RESET_CURRENT_SUB_FLOW_EDGES:
			return (state = {
				...state,
				currentSubFlow: {
					...state.currentSubFlow,
					edges: initialState.currentSubFlow.edges,
				},
			});
		case SubFlowActions.RESET_CURRENT_SUB_FLOW_NODES:
			return (state = {
				...state,
				currentSubFlow: {
					...state.currentSubFlow,
					nodes: initialState.currentSubFlow.nodes,
				},
			});
		case SubFlowActions.RESET_ALL_SUB_FLOWS:
			return (state = {
				...state,
				allSubFlows: initialState.allSubFlows,
			});
		case SubFlowActions.SET_CURRENT_SUB_FLOW: {
			const foundSubFlow = state.allSubFlows.subFlows.find(
				(subFlow) => subFlow.startNode === payload.startNode
			);
			return (state = {
				...state,
				currentSubFlow: foundSubFlow
					? foundSubFlow
					: initialState.currentSubFlow,
			});
		}
		default:
			return state;
	}
};
