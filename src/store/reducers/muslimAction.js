import { SET_LOKASI, SET_LOKASIGOOGLE } from "../actions/actionTypes";

const initialState = {
    lokasi: null,
    lokasiGoogle: null
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_LOKASI:
            return {
                ...state,
                lokasi: action.lokasi,
            };

        case SET_LOKASIGOOGLE:
            return {
                ...state,
                lokasiGoogle: action.lokasiGoogle,
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
