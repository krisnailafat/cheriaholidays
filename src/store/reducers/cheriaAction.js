import { SET_PROFILE, SET_LOGIN, SET_LOGGED, SET_PEMBELIAN, RESET_POINT } from "../actions/actionTypes";

const initialState = {
    // profile: null,
    profile: {},
    isLogin: false,
    // pembelian: null,
    pembelian: [],
    point: 0
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_PROFILE:
            return {
                ...state,
                profile: action.profile,
            };
        case SET_LOGIN:
            return {
                ...state,
                isLogin: true,
            };
        case SET_LOGGED:
            return {
                ...state,
                isLogin: false,
            };
        case SET_PEMBELIAN:
            return {
                ...state,
                pembelian: action.pembelian,
                point: action.point
            };
        case RESET_POINT:
            return {
                ...state,
                point: 0,
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
