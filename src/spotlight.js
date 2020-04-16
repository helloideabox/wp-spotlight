import './spotlight.scss';
import ModalHeader from './component/modalHeader/modalHeader';
import ModalPost from './component/modalBody/modalPost';
import ModalForm from './component/modalBody/modalForm';
import ModalSinglePost from './component/modalSinglePost/modalSinglePost';
import { CSSTransition } from 'react-transition-group';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import parse from 'html-react-parser';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

const {
	Component,
	Fragment,
} = wp.element;



class Spotlight extends Component {

	constructor( props ) {
		super( props );

		this.state = {
			isModalShow: false,
			isAnswer: true,
			isFocus: false,
			posts: [],
			isFocusAnimation: false,
			isSinglePostOpen: false,
			singlePostIndex: 0,
		}

		// For having reference of input element in dom.
		this.inputText = React.createRef();

		this.showModal = this.showModal.bind( this );
		this.handleClick = this.handleClick.bind( this );
		this.handleFocus = this.handleFocus.bind( this );
		this.handleBlur = this.handleBlur.bind( this );
		this.handlePost = this.handlePost.bind( this );
	}

	componentDidUpdate( prevProps, prevState ) {

		// Check to see if input exits in dom.
		if( this.inputText.current ) {

			// Focus input element only if current state has changed.
			if( this.state.isAnswer != prevState.isFocusAnimation ) {
				this.inputText.current.focus();
			}
		}
	}

	handleFocus() {
		this.setState( { isFocus: true } );
	}

	handleBlur() {
		this.setState( { isFocus: false } );
	}

	handleClick( bool ) {
		this.setState( { isAnswer: bool } );
		this.setState( { isFocusAnimation: bool } );
	}

	showModal() {
		this.setState( { isModalShow: ! this.state.isModalShow } );

		if( ! this.state.isModalShow && this.state.isAnswer)  {
			this.setState( { isFocusAnimation: true } );
		} else{
			this.setState( { isFocusAnimation: false } );
		}
	}

	handlePost( index ) {
		this.setState( { singlePostIndex: index } );
		this.setState( { isSinglePostOpen: true } );
	}

	render() {
		console.log( this.state );
		return(
			<Fragment>
				<CSSTransition
					in={ this.state.isModalShow }
					unmountOnExit
					timeout={50}
					classNames="modal-background"
				>
					<div className="spl-modal-container-background"></div>
				</CSSTransition>

				<CSSTransition
					in={ this.state.isModalShow }
					unmountOnExit
					timeout={300}
					classNames="modal"
				>
					<div className="spl-modal-container">
						<div className="spl-modal-scroll-container">
							<ModalHeader onClick={ this.handleClick } isAnswer={ this.state.isAnswer } />

							<div className={ this.state.isAnswer? "spl-heading-post-container" : "spl-heading-form-container"}>
								{
									this.state.isAnswer?
									<div>
										<h2 className="spl-post-heading">{ __( 'Instant Answers' ) }</h2>
									</div>
									:
									<div></div>
								}
							</div>
							
							<main className="spl-main-container">
							{
								this.state.isAnswer?
								<ModalPost 
									posts={ this.state.posts }
									onClick={ this.handlePost }
								/>
								:
								<ModalForm />
							}
							</main>

							{
								this.state.isAnswer?
								<div className={ "spl-search-container " + ( this.state.isFocus? 'is-focussed' : 'not-focussed' ) }>
									<input type="text" ref={ this.inputText } placeholder="What can we help you with?" className="spl-search-text" onFocus={ this.handleFocus } onBlur={ this.handleBlur }/>

									<div className="spl-search-button-container">
										<button className="spl-search-button">
											<svg height="20px" width="20px">
												<path fill-rule="evenodd" d="M10.5 17.917c1.7 0 3.3-.597 4.5-1.492l4.3 4.277c.2.199.5.298.7.298.2 0 .5-.1.7-.298.4-.398.4-.995 0-1.393l-4.2-4.375c1-1.293 1.5-2.785 1.5-4.475C18 6.38 14.6 3 10.5 3S3 6.381 3 10.459c0 4.077 3.4 7.458 7.5 7.458zm0-12.928c3 0 5.5 2.486 5.5 5.47 0 2.983-2.5 5.47-5.5 5.47S5 13.441 5 10.458c0-2.984 2.5-5.47 5.5-5.47z">
												</path>
											</svg>
										</button>
									</div>
								</div>
								:
								null
							}
						</div>

						<CSSTransition
							in={ this.state.isSinglePostOpen }
							timeout={ 450 }
							unmountOnExit
							classNames="single-post"
						>
							<div className="spl-modal-single-post-container">
								{ this.state.posts.length > 0?
									<ModalSinglePost content={ parse( __( this.state.posts[this.state.singlePostIndex].content) ) }/>
									:
									null	
								}
							</div>
						</CSSTransition>
					</div>
				</CSSTransition>

				<ReactCSSTransitionGroup
					transitionName="start"
					transitionAppear={ true }
					transitionEnterTimeout={150}
					component="div"
				>
				<div className="spl-button-container">
					<CSSTransition
						in={ this.state.isModalShow }
						timeout={130}
						classNames="button"
					>
					<button className="spl-button" onClick={ this.showModal }>
							<CSSTransition
							in={ this.state.isModalShow }
							unmountOnExit
							timeout={300}
							classNames="icon"
							>
							<span className="spl-icon-close" >
								<svg width="14" height="14" xmlns="http://www.w3.org/2000/svg">
									<path d="M13.707.293a.999.999 0 0 0-1.414 0L7 5.586 1.707.293A.999.999 0 1 0 .293 1.707L5.586 7 .293 12.293a.999.999 0 1 0 1.414 1.414L7 8.414l5.293 5.293a.997.997 0 0 0 1.414 0 .999.999 0 0 0 0-1.414L8.414 7l5.293-5.293a.999.999 0 0 0 0-1.414" fill="#FFF" fill-rule="evenodd"></path>
								</svg>
							</span>
							</CSSTransition>
							<CSSTransition
							in={ ! this.state.isModalShow  }
							unmountOnExit
							timeout={300}
							classNames="icon"
							>
							<span className="spl-icon-open">
								<svg width="24" height="22" xmlns="http://www.w3.org/2000/svg">
									<path d="M20.347 20.871l-.003-.05c0 .017.001.034.003.05zm-.243-4.278a2 2 0 0 1 .513-1.455c1.11-1.226 1.383-2.212 1.383-4.74C22 5.782 18.046 2 13.125 2h-2.25C5.954 2 2 5.78 2 10.399c0 4.675 4.01 8.626 8.875 8.626h2.25c.834 0 1.606-.207 3.212-.798a2 2 0 0 1 1.575.083l2.355 1.161-.163-2.878zM10.875 0h2.25C19.13 0 24 4.656 24 10.399c0 2.6-.25 4.257-1.9 6.08l.243 4.279c.072.845-.807 1.471-1.633 1.162l-3.682-1.816c-1.212.446-2.527.921-3.903.921h-2.25C4.869 21.025 0 16.142 0 10.4 0 4.656 4.869 0 10.875 0z" fill="#FFF"></path>
								</svg>
							</span>
							</CSSTransition>
					</button>
					</CSSTransition>
				</div>
				</ReactCSSTransitionGroup>
			</Fragment>
		);
	}
}

export default Spotlight;