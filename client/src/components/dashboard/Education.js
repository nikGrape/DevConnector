import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import { deleteEducation } from '../../actions/profile';
import { connect } from 'react-redux';

const Education = ({ education, deleteEducation }) => {
	return (
		<Fragment>
			<h2 className='my-2'>Education Credentials</h2>
			<table className='table'>
				<thead>
					<tr>
						<th>School</th>
						<th className='hide-sm'>Degree</th>
						<th className='hide-sm'>Years</th>
						<th />
					</tr>
				</thead>
				<tbody>
					{education.map((edu) => (
						<tr key={edu._id}>
							<td className='hide-sm'>{edu.school}</td>
							<td>{edu.degree}</td>
							<td className='hide-sm'>
								<Moment format='YYYY/MM/DD'>{edu.from}</Moment> {' - '}
								{edu.current ? (
									' now'
								) : (
									<Moment format='YYYY/MM/DD'>{edu.to}</Moment>
								)}
							</td>
							<td>
								<button
									className='btn btn-danger'
									onClick={() => deleteEducation(edu._id)}
								>
									Delete
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</Fragment>
	);
};

Education.propTypes = {
	education: PropTypes.array.isRequired,
	deleteEducation: PropTypes.func.isRequired,
};

export default connect(null, { deleteEducation })(Education);
