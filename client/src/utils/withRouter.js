import { useLocation, useNavigate } from 'react-router-dom';

// adds history property to props of a child component
// to navigate from action use history.navigate(to, options)
export default function withRouter(Child) {
	return (props) => {
		const history = {
			location: useLocation(),
			navigate: useNavigate()
		}
		return <Child {...props} history={history} />;
	};
}
