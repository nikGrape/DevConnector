import React, { Fragment, useState } from 'react';
import { Link, Navigate } from 'react-router-dom'; // Use everywhere instead <a>
import axios from 'axios'; // Sends json to back-end
import { connect } from 'react-redux';
import { setAlert } from '../../actions/alert';
import { register } from '../../actions/auth';
import PropTypes from 'prop-types'; // TODO find out what that is!

const Register = (props) => {
	// now here will be avalible props.alert (see below line133!)
	/**
	 * formData is the same as if we add
	 * state = {
	  		formData: {
	  			name: '',
				email: '',
				password: '',
				password2: '',
			}
		}
	 * setFormData is a function like 
		this.setState({formData = {...}})
	 */
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		password: '',
		password2: '',
	});

	const { name, email, password, password2 } = formData;

	// const onChange = (e) => setFormData({ name: e.target.value });
	// take name attribute and use it to change the formData object field
	// works beacuse name attribute is the same for inputs with object fields names
	// if do not put ...formData it will be eraise to only one field in []
	const onChange = (e) =>
		setFormData({ ...formData, [e.target.name]: e.target.value });

	const onSubmit = async (e) => {
		e.preventDefault();
		if (password !== password2) {
			props.setAlert("Passwords don't mutch", 'danger', 3000);
		} else {
			console.log('success');
			props.register({ name, email, password });
		}
	};

	if (props.isAuthenticated) {
		// props.setAlert('Already registred', 'alert', 1000);
		return <Navigate to='/' />;
	}

	return (
		<Fragment>
			<h1 className='large text-primary'>Sign Up</h1>
			<p className='lead'>
				<i className='fas fa-user'></i> Create Your Account
			</p>
			<form className='form' onSubmit={(e) => onSubmit(e)}>
				<div className='form-group'>
					<input
						type='text'
						placeholder='Name'
						name='name'
						value={name}
						onChange={(e) => onChange(e)}
						required
					/>
				</div>
				<div className='form-group'>
					<input
						type='email'
						placeholder='Email Address'
						name='email'
						value={email}
						onChange={(e) => onChange(e)}
						required
					/>
					<small className='form-text'>
						This site uses Gravatar so if you want a profile image, use a
						Gravatar email
					</small>
				</div>
				<div className='form-group'>
					<input
						type='password'
						placeholder='Password'
						name='password'
						minLength='6'
						value={password}
						onChange={(e) => onChange(e)}
						autoComplete='off'
						required
					/>
				</div>
				<div className='form-group'>
					<input
						type='password'
						placeholder='Confirm Password'
						name='password2'
						minLength='6'
						value={password2}
						onChange={(e) => onChange(e)}
						autoComplete='off'
						required
					/>
				</div>
				<input type='submit' className='btn btn-primary' value='Register' />
			</form>
			<p className='my-1'>
				Already have an account? <Link to='/login'>Sign In</Link>
			</p>
		</Fragment>
	);
};

Register.propTypes = {
	setAlert: PropTypes.func.isRequired,
	register: PropTypes.func.isRequired,
	isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
	isAuthenticated: state.auth.isAuthenticated,
});

//	connect(mapStateToProps, mapDispatchToProps)(MyElement)
//	mapStateToProps is what state fields will be avalible in the element
//  mapDispathcToProps is what behavour will be avalible in the element
// check your notes!
export default connect(mapStateToProps, { setAlert, register })(Register);
