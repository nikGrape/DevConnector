import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';

import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Alert from './components/layout/Alert';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import Protected from './components/routing/Protected';
import CreateProfile from './components/profile-form/CreateProfile';
import EditProfile from './components/profile-form/EditProfile';
import AddExperience from './components/profile-form/AddExperience';
import AddEducation from './components/profile-form/AddEducation';
import Profiles from './components/profiles/Profiles';
import Profile from './components/profile/Profile';
import Posts from './components/posts/Posts';
import Post from './components/post/Post';

import './App.css';
import setAuthToken from './utils/setAuthToken';
import { loadUser } from './actions/auth';

//Redux
import { Provider } from 'react-redux';
import store from './store';

//Axios
axios.defaults.baseURL = 'http://localhost:4900';

if (localStorage.token) {
	setAuthToken(localStorage.token);
}

const App = () => {
	useEffect(() => {
		store.dispatch(loadUser());
	}, []); // useEffect works like componentDidMount (need [] as the second argument)
	return (
		<Provider store={store}>
			<Router>
				<Navbar />
				<section className='container'>
					<Alert />
					<Routes>
						<Route exact path='/' element={<Landing />} />
						<Route path='/register' element={<Register />} />
						<Route path='/login' element={<Login />} />
						<Route path='/profiles' element={<Profiles />} />
						<Route path='/profile/:id' element={<Profile />} />
						<Route
							path='/dashboard'
							element={<Protected component={Dashboard} />}
						/>
						<Route
							path='/create-profile'
							element={<Protected component={CreateProfile} />}
						/>
						<Route
							path='/edit-profile'
							element={<Protected component={EditProfile} />}
						/>
						<Route
							path='/add-experience'
							element={<Protected component={AddExperience} />}
						/>
						<Route
							path='/add-education'
							element={<Protected component={AddEducation} />}
						/>
						<Route path='/posts' element={<Protected component={Posts} />} />
						<Route path='/post/:id' element={<Protected component={Post} />} />
					</Routes>
				</section>
			</Router>
		</Provider>
	);
};

export default App;
