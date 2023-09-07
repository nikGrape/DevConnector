import { legacy_createStore as createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import rootReducer from './reducers'; //don't have to type './reducers/index.js' only for index.js

const initialState = {};

const middleware = [thunk];

const store = createStore(  //use ConfigureStore instead!
	rootReducer,
	initialState,
	composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
