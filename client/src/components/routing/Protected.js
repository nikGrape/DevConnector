import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Navigate } from 'react-router-dom';

const Protected = ({
	component: Component,
	auth: { isAuthenticated, loading },
	...rest
}) => {
	if (isAuthenticated) {
		return <Component {...rest} />;
	} else {
		return <Navigate to='/login' />;
	}
};

Protected.propTypes = {
	auth: PropTypes.object.isRequired,
	count: PropTypes.number,
};

const mapStateToProps = (state) => ({
	auth: state.auth,
});

export default connect(mapStateToProps)(Protected);
