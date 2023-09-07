import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import { getProfiles } from '../../actions/profile';
import ProfileItem from './ProfileItem';
import { Link } from 'react-router-dom';

const Profiles = ({ getProfiles, profile: { profiles, loading } }) => {
	useEffect(() => {
		getProfiles();
	}, [getProfiles]);

	return (
		<Fragment>
			{
				<Fragment>
					<h1 className='large text-primary'>Developers</h1>
					<p className='lead'>
						<i className='fab fa-connectevelop'></i> Browse and connect with
						developers
					</p>
					<div className='profiles'>
						<div className='profile bg-light'>
							<img
								className='round-img'
								src='https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=200'
								alt=''
							/>
							<div>
								<h2>John Doe</h2>
								<p>Developer at Microsoft</p>
								<p>Seattle, WA</p>
								<Link to='' className='btn btn-primary'>
									View Profile
								</Link>
							</div>

							<ul>
								<li className='text-primary'>
									<i className='fas fa-check'></i> HTML
								</li>
								<li className='text-primary'>
									<i className='fas fa-check'></i> CSS
								</li>
								<li className='text-primary'>
									<i className='fas fa-check'></i> JavaScript
								</li>
							</ul>
						</div>
						{profiles.length > 0 ? (
							profiles.map((profile) => (
								<ProfileItem key={profile._id} profile={profile}></ProfileItem>
							))
						) : (
							<h4> No profiles found...</h4>
						)}
					</div>
				</Fragment>
			}
		</Fragment>
	);
};

Profiles.propTypes = {
	getProfiles: PropTypes.func.isRequired,
	profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	profile: state.profile,
});

export default connect(mapStateToProps, { getProfiles })(Profiles);
