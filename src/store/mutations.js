export default {
	setToken(state, payload) {
		state.token = payload;
	},

	addElems(state, data) {
		state.elems.push(data);
		let i = state.elems.length - 1;
		state.elems[i].position = i;
	},

	changeElem(state, payload) {
		state.elems[payload.pos] = {
			...state.elems[payload.pos],
			...payload.data
		}
		state.elems = [...state.elems];
	},

	changeCategory(state, payload) {
		state.elems[payload.pos].category = payload.category
	},

	sortElems(state, itemRows) {
		itemRows.forEach((itemRow, index) => {
			const {
				id
			} = itemRow.dataset;
			if (state.elems[id]) {
				state.elems[id].position = index;
			}
		});

		state.elems = state.elems.sort(function (a, b) {
			return a.position - b.position;
		});
	},

	filterElems(state) {
		state.blocks = [];
		state.elems.forEach((item) => {
			state.blocks.push(item.id);
		});
	},

	elemsDelete(state, id) {
		state.elems = state.elems.filter((item) => item.id !== id);
	},

	clearArr(state) {
		state.elems = [];
		state.blocks = [];
	},
}
