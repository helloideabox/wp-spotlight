import './modalForm.scss';
import { CSSTransition } from 'react-transition-group';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

const {
	Component,
	Fragment,
} = wp.element;



class ModalPost extends Component{

	constructor( props ) {
		super( props );
	}

	render() {
		return(
			<Fragment>
			<div className="spl-modal-form">
				This is Form page.
			</div>
			</Fragment>
		)
	}
}

export default ModalPost;