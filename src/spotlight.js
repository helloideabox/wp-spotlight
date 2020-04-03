import './spotlight.scss';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

const {
	Component,
	Fragment,
} = wp.element;



class Spotlight extends Component {

	render() {
		return(
			<Fragment>
				<h1>This is react</h1>
			</Fragment>
		);
	}
}

export default Spotlight;