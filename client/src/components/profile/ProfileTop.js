import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const http = (link) => {
	return link.startsWith('http') ? link : 'http://' + link;
};

const ProfileTop = ({
	profile: {
		user: { name, avatar },
		company,
		location,
		website,
		social,
		status,
	},
}) => {
	return (
		<div className='profile-top bg-primary p-2'>
			<img className='round-img my-1' src={avatar} alt='avatar' />
			<h1 className='large'>{name}</h1>
			<p className='lead'>
				{status} {company && <span> at {company}</span>}
			</p>
			<p>{location && <span>{location}</span>}</p>
			<div className='icons my-1'>
				{website && (
					<a href={http(website)} target='_blank' rel='noopener noreferrer'>
						<i className='fas fa-globe fa-2x' />
					</a>
				)}
				{social &&
					Object.keys(social).map((media, index) => (
						<a
							href={http(social[media])}
							target='_blank'
							rel='noopener noreferrer'
							key={social + index}
						>
							<i className={`fab fa-${media} fa-2x`}></i>
						</a>
					))}
			</div>
		</div>
	);
};

ProfileTop.propTypes = {
	profile: PropTypes.object.isRequired,
};

export default ProfileTop;
