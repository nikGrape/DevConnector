import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';
import { connect } from 'react-redux';
import { deleteComment } from '../../actions/post';

const CommentItem = ({
	deleteComment,
	comment: { text, user, avatar, name, date, _id },
	auth,
	postId,
}) => {
	return (
		<div className='post bg-white p-1 my-1'>
			<div>
				<Link to={`/profile/${user}`}>
					<img className='round-img' src={avatar} alt='' />
					<h4>{name}</h4>
				</Link>
			</div>
			<div>
				<p className='my-1'>{text}</p>
				<p className='post-date'>
					Posted on <Moment format='YYYY-MMM-DD'>{date}</Moment>
				</p>
				{!auth.loading && user === auth.user._id && (
					<button
						type='button'
						className='btn btn-danger'
						onClick={() => deleteComment(postId, _id)}
					>
						<i className='fas fa-times'></i>
					</button>
				)}
			</div>
		</div>
	);
};

CommentItem.propTypes = {
	deleteComment: PropTypes.func.isRequired,
	comment: PropTypes.object.isRequired,
	auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	auth: state.auth,
});

export default connect(mapStateToProps, { deleteComment })(CommentItem);
