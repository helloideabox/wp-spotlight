import './modalPost.scss';
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
			<div className="spl-modal-post">
				This is Post page.
				loremLorem ipsum dolor sit amet consectetur adipisicing elit. Enim perferendis consequuntur molestias hic quis doloribus veritatis. Quas nisi ullam provident tempora culpa voluptatibus, explicabo saepe! Sapiente ex alias vitae pariatur.Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim perferendis consequuntur molestias hic quis doloribus veritatis. Quas nisi ullam provident tempora culpa voluptatibus, explicabo saepe! Sapiente ex alias vitae pariatur.Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim perferendis consequuntur molestias hic quis doloribus veritatis. Quas nisi ullam provident tempora culpa voluptatibus, explicabo saepe! Sapiente ex alias vitae pariatur.Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim perferendis consequuntur molestias hic quis doloribus veritatis. Quas nisi ullam provident tempora culpa voluptatibus, explicabo saepe! Sapiente ex alias vitae pariatur.Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim perferendis consequuntur molestias hic quis doloribus veritatis. Quas nisi ullam provident tempora culpa voluptatibus, explicabo saepe! Sapiente ex alias vitae pariatur.Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim perferendis consequuntur molestias hic quis doloribus veritatis. Quas nisi ullam provident tempora culpa voluptatibus, explicabo saepe! Sapiente ex alias vitae pariatur.Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim perferendis consequuntur molestias hic quis doloribus veritatis. Quas nisi ullam provident tempora culpa voluptatibus, explicabo saepe! Sapiente ex alias vitae pariatur.
			</div>
			</Fragment>
		)
	}
}

export default ModalPost;