import { SET_LOKASI } from "../actions/actionTypes";

const initialState = {
    lokasi: null
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_LOKASI:
            return {
                ...state,
                lokasi: action.lokasi,
            };
        // case AUTH_REMOVE_TOKEN:
        //   return {
        //     ...state,
        //     token: null,
        //     expiryDate: null
        //   };
        default:
            return state;
    }
};

export default reducer;
