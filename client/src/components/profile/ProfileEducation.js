import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';

const ProfileEducation = ({ profile: { education } }) => {
	return (
		<div className='profile-edu bg-white p-2'>
			<h2 className='text-primary'>Education</h2>
			{education.length > 0 ? (
				<Fragment>
					{education.map((edu) => {
						const {
							school,
							degree,
							fieldofstudy,
							from,
							to,
							current,
							description,
							_id,
						} = edu;

						return (
							<div key={_id}>
								<h3>{school}</h3>
								<p>
									<Moment format='MMM YYYY'>{from}</Moment>
									{' - '}
									{current ? (
										'Current'
									) : (
										<Moment format='MMM YYYY'>{to}</Moment>
									)}
								</p>
								<p>
									<strong>Degree: </strong>
									{degree}
								</p>
								{fieldofstudy && (
									<p>
										<strong>Field Of Study: </strong>
										{fieldofstudy}
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
				<h4>No education credentials</h4>
			)}
		</div>
	);
};

ProfileEducation.propTypes = {
	profile: PropTypes.object.isRequired,
};

export default ProfileEducation;
