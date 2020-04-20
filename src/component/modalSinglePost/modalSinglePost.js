import './modalSinglePost.scss';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import parse from 'html-react-parser';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

const {
	Component,
	Fragment,
} = wp.element;



class ModalSinglePost extends Component{

	constructor( props ) {
		super( props );

		this.handleClose = this.handleClose.bind( this );
	}

	componentDidMount() {
		// window.addEventListener( 'scroll', this.handleScroll , true );
	}

	handleClose( bool ) {
		this.props.onClick( bool );
	}

	render() {
		return(
			<Fragment>
				<div className="spl-single-post-main-container">
					<div className="spl-single-post-close">
						<button className="spl-single-post-close-button" onClick={ () => this.handleClose( false ) }>
							<span class="spl-icon-close">
								<svg height="20px" width="20px" viewBox="0 0 24 24">
									<path fill-rule="evenodd" d="M13.414 12l5.293-5.293a.999.999 0 10-1.414-1.414L12 10.586 6.707 5.293a.999.999 0 10-1.414 1.414L10.586 12l-5.293 5.293a.999.999 0 101.414 1.414L12 13.414l5.293 5.293a.997.997 0 001.414 0 .999.999 0 000-1.414L13.414 12z">
									</path>
								</svg>
							</span>
						</button>
					</div>

					<div className="spl-single-post-wrapper">
						<div className="spl-single-post-content">
							<div className="spl-single-post-content-fader"></div>

							<div className="spl-single-post-content-scrollable">
								<article>
									{ this.props.content }
								</article>
							</div>
						</div>

						<div className="spl-single-post-review-conatiner">
							<div className="spl-single-post-review-content">
								<p className="spl-single-post-review-text">
									Did this answer to your question?
								</p>

								<div className="spl-single-post-review-reaction">
									<button className="spl-single-post-reaction-button spl-like">
										<span>
											<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
												<path class="reaction-head" fill-rule="evenodd" clip-rule="evenodd" d="M12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12z" fill="#FFDA6A"></path>
												<path class="reaction-face" fill-rule="evenodd" clip-rule="evenodd" d="M7.385 10.84a1.846 1.846 0 100-3.692 1.846 1.846 0 000 3.693zm10.07 3.939c.552.161.826.774.533 1.268-1.243 2.096-3.46 3.491-5.988 3.491-2.528 0-4.745-1.395-5.988-3.49-.293-.495-.019-1.108.532-1.27A19.403 19.403 0 0112 14c1.89 0 3.72.271 5.456.779zM18.463 9a1.846 1.846 0 11-3.693 0 1.846 1.846 0 013.693 0z" fill="#2E2D2E"></path>
											</svg>
										</span>
									</button>
									<button className="spl-single-post-reaction-button spl-dislike">
										<span>
											<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
												<path class="reaction-head" fill-rule="evenodd" clip-rule="evenodd" d="M12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12z" fill="#BDD6FF"></path>
												<path class="reaction-face" fill-rule="evenodd" clip-rule="evenodd" d="M7.383 12.092a1.846 1.846 0 100-3.69 1.846 1.846 0 000 3.69zm9.231 0a1.846 1.846 0 100-3.69 1.846 1.846 0 000 3.69zm-7.507 5.415c.334-.334 1.177-.843 2.276-.99 1.055-.143 2.325.05 3.592 1.064a1 1 0 001.25-1.562c-1.733-1.386-3.563-1.693-5.108-1.485-1.501.202-2.758.893-3.424 1.559a1 1 0 001.414 1.414z" fill="#2E2D2E"></path>
											</svg>
										</span>
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</Fragment>
		)
	}
}

export default ModalSinglePost;