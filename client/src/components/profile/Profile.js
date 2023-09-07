import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link, useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import { getProfileById } from '../../actions/profile';

import ProfileTop from './ProfileTop';
import ProfileAbout from './ProfileAbout';
import ProfileExperience from './ProfileExperience';
import ProfileEducation from './ProfileEducation';
import ProfileGitHub from './ProfileGitHub';

const Profile = ({ getProfileById, profile: { profile, loading }, auth }) => {
	const { id } = useParams();
	useEffect(() => {
		getProfileById(id);
	}, [getProfileById, id]);

	return (
		<Fragment>
			{!profile || loading ? (
				<Spinner />
			) : (
				<Fragment>
					<section className='container'>
						<Link to='/profiles' className='btn btn-light'>
							Back To Profiles
						</Link>

						{auth.isAuthenticated &&
							!auth.loading &&
							auth.user._id === profile.user._id && (
								<Link to='/edit-profile'>Edit Profile</Link>
							)}

						<div className='profile-grid my-1'>
							<ProfileTop profile={profile} />
							<ProfileAbout profile={profile} />
							<ProfileExperience profile={profile} />
							<ProfileEducation profile={profile} />
							{profile.githubusername && (
								<ProfileGitHub username={profile.githubusername} />
							)}
						</div>
					</section>
				</Fragment>
			)}
		</Fragment>
	);
};

Profile.propTypes = {
	getProfileById: PropTypes.func.isRequired,
	profile: PropTypes.object.isRequired,
	auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	profile: state.profile,
	auth: state.auth,
});

export default connect(mapStateToProps, { getProfileById })(Profile);
