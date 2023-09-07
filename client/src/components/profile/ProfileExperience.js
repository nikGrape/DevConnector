import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';

const ProfileExperience = ({ profile: { experience } }) => {
	return (
		<div className='profile-exp bg-white p-2'>
			<h2 className='text-primary'>Experience</h2>
			{experience.length > 0 ? (
				<Fragment>
					{experience.map((exp) => {
						const { company, title, from, to, current, description, _id } = exp;
						return (
							<div key={_id}>
								<h3 className='text-dark'>{company}</h3>
								<p>
									<Moment format='MMM YYYY'>{from}</Moment>
									{' - '}
									{current ? (
										'Current'
									) : (
										<Moment format='MMM YYYY'>{to}</Moment>
									)}
								</p>
								{title && (
									<p>
										<strong>Position: </strong>
										{title}
									</p>
								)}
								{description && (
									<p>
										<strong>Description: </strong>
										{description}
									</p>
								)}
							</div>
						);
					})}
				</Fragment>
			) : (
				<h4>No experience credentials</h4>
			)}
		</div>
	);
};

ProfileExperience.propTypes = {
	profile: PropTypes.object.isRequired,
};

export default ProfileExperience;
