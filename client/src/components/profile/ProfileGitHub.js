import React from 'react';

const ProfileGitHub = ({username}) => {
	return (
		<div className='profile-github'>
			<h2 className='text-primary my-1'>
				<i className='fab fa-github'></i> Github Repos
			</h2>
			<div className='repo bg-white p-1 my-1'>
				<div>
					<h4>
						<a to='#' target='_blank' rel='noopener noreferrer'>
							Repo One
						</a>
					</h4>
					<p>
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat,
						laborum!
					</p>
				</div>
				<div>
					<ul>
						<li className='badge badge-primary'>Stars: 44</li>
						<li className='badge badge-dark'>Watchers: 21</li>
						<li className='badge badge-light'>Forks: 25</li>
					</ul>
				</div>
			</div>
			<div className='repo bg-white p-1 my-1'>
				<div>
					<h4>
						<a to='#' target='_blank' rel='noopener noreferrer'>
							Repo Two
						</a>
					</h4>
					<p>
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat,
						laborum!
					</p>
				</div>
				<div>
					<ul>
						<li className='badge badge-primary'>Stars: 44</li>
						<li className='badge badge-dark'>Watchers: 21</li>
						<li className='badge badge-light'>Forks: 25</li>
					</ul>
				</div>
			</div>
		</div>
	);
};

export default ProfileGitHub;
