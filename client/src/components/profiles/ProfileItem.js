import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const ProfileItem = ({ profile }) => {
	const {
		user, //obj
		company,
		location,
		status,
		skills, //arr
	} = profile;

	return (
		<div className='profiles'>
			<div className='profile bg-light'>
				<img className='round-img' src={user.avatar} alt='avatar' />
				<div>
					<h2>{user.name}</h2>
					<p>
						{status} {company && <span> at {company}</span>}
					</p>
					<p>{location && <span>{location}</span>}</p>
					<Link to={`/profile/${user._id}`} className='btn btn-primary'>
						View Profile
					</Link>
				</div>

				<ul>
					{skills.slice(0, 4).map((skill, index) => (
						<li key={index} className='text-primary'>
							<i className='fas fa-check'></i> {skill}
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};

ProfileItem.propTypes = {
	profile: PropTypes.object.isRequired,
};

export default ProfileItem;
