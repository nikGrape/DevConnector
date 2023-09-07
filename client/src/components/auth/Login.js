import React, { Fragment, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from '../../actions/auth';
import { setAlert } from '../../actions/alert';

function Login({ login, isAuthenticated, loading, setAlert }) {
	const [formData, setFormData] = useState({
		email: '',
		password: '',
	});

	const { email, password } = formData;

	// const onChange = (e) => setFormData({ name: e.target.value });
	// take name attribute and use it to change the formData object field
	// works beacuse name attribute is the same for inputs with object fields names
	// if do not put ...formData it will be eraise to only one field in []
	const onChange = (e) =>
		setFormData({ ...formData, [e.target.name]: e.target.value });

	const onSubmit = async (e) => {
		e.preventDefault();
		login(email, password);

		console.log('success');
	};

	// Redirect if loged in
	if (isAuthenticated) {
		// if (!loading) setAlert('Already logged in', 'alert', 1000);
		return <Navigate to='/dashboard' />;
	}

	return (
		<Fragment>
			<h1 className='large text-primary'>Sign In</h1>
			<p className='lead'>
				<i className='fas fa-user'></i> Sign into Your Account
			</p>
			<form className='form' onSubmit={(e) => onSubmit(e)}>
				<div className='form-group'>
					<input
						type='email'
						placeholder='Email Address'
						name='email'
						value={email}
						onChange={(e) => onChange(e)}
						required
						autoComplete='on'
					/>
				</div>
				<div className='form-group'>
					<input
						type='password'
						placeholder='Password'
						name='password'
						value={password}
						onChange={(e) => onChange(e)}
						required
						autoComplete='on'
					/>
				</div>
				<input type='submit' className='btn btn-primary' value='Login' />
			</form>
			<p className='my-1'>
				Don't have an account? <Link to='/register'>Sign Up</Link>
			</p>
		</Fragment>
	);
}

Login.propTypes = {
	login: PropTypes.func.isRequired,
	setAlert: PropTypes.func,
	isAuthenticated: PropTypes.bool,
	loading: PropTypes.bool,
};

const mapStateToProps = (state) => ({
	isAuthenticated: state.auth.isAuthenticated,
	loading: state.auth.loading,
});

export default connect(mapStateToProps, { login, setAlert })(Login);
