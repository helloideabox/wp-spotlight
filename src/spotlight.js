import './spotlight.scss';
import ModalHeader from './component/modalHeader/modalHeader';
import ModalPost from './component/modalBody/modalPost';
import ModalForm from './component/modalBody/modalForm';
import ModalSinglePost from './component/modalSinglePost/modalSinglePost';
import ModalSearch from './component/modalSearch/modalSearch';
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
			post_types: [],
			posts: [],
			isPostFetch: false,
			search_posts: [],
			isFocusAnimation: false,
			isSinglePostOpen: false,
			singlePostIndex: 0,
			isSearch: false,
			query: '',
			isApiLoaded: false,
			isSearchResult: false,
			enable_search_box: true,
			enable_contact_tab: true,
			font_family: '',
			post_heading_size: 13,
			upload_image_url: '',
			primary_color: '',
		}

		this.avatar = [];

		// For having reference of input element in dom.
		this.inputText = React.createRef();

		this.showModal = this.showModal.bind( this );
		this.handleClick = this.handleClick.bind( this );
		this.handleFocus = this.handleFocus.bind( this );
		this.handleBlur = this.handleBlur.bind( this );
		this.handlePost = this.handlePost.bind( this );
		this.handleClose = this.handleClose.bind( this );
		this.handleSearch = this.handleSearch.bind( this );
		this.searchText = this.searchText.bind( this );
	}

	async componentDidMount() {

		// Getting data from setting model api.
		wp.api.loadPromise.then( () => {
			this.widget = new wp.api.models.Settings();

			this.widget.fetch().then( response => {
				console.log( response );

				this.setState( { enable_search_box: response.spl_enable_search_box } );
				this.setState( { enable_contact_tab: response.spl_enable_contact_tab } );
				this.setState( { font_family: response.spl_font_family } );
				this.setState( { post_heading_size: response.spl_post_heading_size } );
				this.setState( { upload_image_url: response.spl_upload_image_url } );
				this.setState( { primary_color: response.spl_primary_color } );
				this.setState( { isApiLoaded: true } );

				for( var i=0; i<1; i++ ) {
					this.avatar.push(
						<div
							className="spl-form-heading-avatars"
							style={{ backgroundImage: this.state.upload_image_url != ''? `url(${(this.state.upload_image_url)})` : null }}
						></div>
					);
				}

				let { post_types } = this.state;
				post_types.push( ...response.spl_post_types );

				this.setState( { post_types } );

				let query = '';

				// Making query for fetch function.
				if( post_types.length > 0 ) {
					post_types.map( value => {
						query += 'post_types[]=' + value + '&';
					} );

					// To trim the last '&' in the string.
					query = query.substring( 0, query.length-1 );
				}

				// fetching from wp api.
				fetch( `${ajax.siteName}/wp-json/spotlight/v1/posts/?${query}` )
					.then( response => response.json() )
					.then( data => {
						let {posts} = this.state;
						posts.push( ...data );
						this.setState( { posts } );
						this.setState( { isPostFetch: true } );
					} )
					.catch( error => {
						console.log( error );
					} )
			} );
		} );
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
		this.setState( { isSearch: false } );

		// To clear the input text and the query string if back button is clicked.
		if( this.state.isSearch ) {
			this.setState( { query: '' } );
			this.inputText.current.value = '';
			this.inputText.current.focus();
		}
	}

	showModal() {
		this.setState( { isModalShow: ! this.state.isModalShow } );

		if( ! this.state.isModalShow && this.state.isAnswer)  {
			this.setState( { isFocusAnimation: true } );
		} else{
			this.setState( { isFocusAnimation: false } );
		}
	}

	handlePost( index, bool ) {
		this.setState( { singlePostIndex: index } );
		this.setState( { isSinglePostOpen: bool } );
		this.setState( { isFocus: false } );
	}

	handleClose( bool ) {
		this.setState( { isSinglePostOpen: bool } );
		this.inputText.current.focus();
	}

	searchText( e ) {
		this.setState( { query: e.target.value } )
	}

	handleSearch() {
		if( this.state.query != '' ) {
			// this.setState( { isFocusAnimation: false } );
			this.setState( { isSearch: true } );
			this.setState( { singlePostIndex: 0 } );
			this.setState( { isSearchResult: false } );
			this.inputText.current.focus();

			// Getting data from setting model api.
			wp.api.loadPromise.then( () => {
				this.posts = new wp.api.models.Settings();

				this.posts.fetch().then( response => {

					let query = '';

					// Making query for fetch function.
					response.spl_post_types.map( value => {
						query += 'post_types[]=' + value + '&';
					} );

					// To trim the last '&' in the string.
					query = query.substring( 0, query.length-1 );

					fetch( `${ajax.siteName}/wp-json/spotlight/v1/posts/?${query}` )
						.then( response => response.json() )
						.then( data => {

							let { search_posts } = this.state;
							search_posts = [];

							// Split query for words.
							let query = this.state.query.split( ' ' );

							// Search for title related to query.
							data.map( value => {
								if( query.some( val =>{
										if( value.title.toUpperCase().indexOf( val.toUpperCase() ) >= 0 ) {
											return true;
										}
									} ) 
								) {
									search_posts.push( value );
								}
							} );

							this.setState( { search_posts } );
							this.setState( { isSearchResult: true } );
						} )
						.catch( error => {
							console.log( error );
						} )
				} );
			} );
		}
	}

	render() {
		console.log( this.state );
		return(
			this.state.isApiLoaded?
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
					<div className="spl-modal-container" style={{ 'font-family': `${(this.state.font_family)}` }}>
						<div className={ "spl-modal-scroll-container " + ( this.state.isSinglePostOpen? 'overflow' : '' ) + ( this.state.isSearch? 'spl-modal-search-container' : '' ) + ' ' + ( this.state.isAnswer? 'spl-modal-scroll-answer' : 'spl-modal-scroll-form' ) + ' ' + ( this.state.enable_search_box? '' : 'height' ) }>
							<ModalHeader
								onClick={ this.handleClick }
								isAnswer={ this.state.isAnswer }
								isSearch = { this.state.isSearch }
								enable_contact_tab={ this.state.enable_contact_tab }
								primary_color={ this.state.primary_color }
							/>

							<div className={ ( this.state.isAnswer? ! this.state.isSearch?"spl-heading-post-container" : 'spl-heading-search-container' : "spl-heading-form-wrap" ) } style={{ 'background-color': `${(this.state.primary_color)}` }}>
								{
									this.state.isAnswer?
										! this.state.isSearch?
										<div>
											<h2 className="spl-post-heading">{ __( 'Instant Answers' ) }</h2>
										</div>
										:
										null
									:
									<div className="spl-heading-form-container">
										<div className="spl-heading-form-content">
											{ this.avatar }
										</div>

										<h2 className="spl-form-heading">
											{ __( 'Let’s begin with a few questions' ) }
										</h2>

										<h4 className="spl-form-sub-heading">
											{ __( 'We usually respond in a few hours' ) }
										</h4>
									</div>
								}
							</div>
							
							<main className={ "spl-main-container " + ( this.state.isAnswer? 'spl-main-answer-container' : 'spl-main-form-container' ) }>
							{
								this.state.isAnswer?
									this.state.isSearch?
										this.state.isSearchResult?
											<ModalSearch
												onSinglePost={ this.handlePost }
												searchResult={ this.state.search_posts }
												isSearchResult={ this.state.isSearchResult }
												onClick={ this.handleClick }
												post_heading_size={ this.state.post_heading_size }
											/>
										:
										<div className="spl-posts-loading-container">
											<div className="spl-posts-loading">
												<h2 className="spl-posts-loading-heading"></h2>
												<div className="spl-posts-loading-text-line"></div>
												<div className="spl-posts-loading-text-line"></div>
												<div className="spl-posts-loading-text-line"></div>
												<div className="spl-posts-loading-text-line"></div>
												<div className="spl-posts-loading-text-line"></div>
											</div>

											<div className="spl-posts-loading">
												<h2 className="spl-posts-loading-heading"></h2>
												<div className="spl-posts-loading-text-line"></div>
												<div className="spl-posts-loading-text-line"></div>
												<div className="spl-posts-loading-text-line"></div>
												<div className="spl-posts-loading-text-line"></div>
												<div className="spl-posts-loading-text-line"></div>
											</div>

											<div className="spl-posts-loading">
												<h2 className="spl-posts-loading-heading"></h2>
												<div className="spl-posts-loading-text-line"></div>
												<div className="spl-posts-loading-text-line"></div>
												<div className="spl-posts-loading-text-line"></div>
												<div className="spl-posts-loading-text-line"></div>
												<div className="spl-posts-loading-text-line"></div>
											</div>
										</div>
									:
									this.state.isPostFetch?
									<ModalPost 
										posts={ this.state.posts }
										isPostFetch={ this.state.isPostFetch }
										onClick={ this.handlePost }
										post_heading_size={ this.state.post_heading_size }
									/>
									:
									<div className="spl-posts-loading-container">
										<div className="spl-posts-loading">
											<h2 className="spl-posts-loading-heading"></h2>
											<div className="spl-posts-loading-text-line"></div>
											<div className="spl-posts-loading-text-line"></div>
											<div className="spl-posts-loading-text-line"></div>
											<div className="spl-posts-loading-text-line"></div>
											<div className="spl-posts-loading-text-line"></div>
										</div>

										<div className="spl-posts-loading">
											<h2 className="spl-posts-loading-heading"></h2>
											<div className="spl-posts-loading-text-line"></div>
											<div className="spl-posts-loading-text-line"></div>
											<div className="spl-posts-loading-text-line"></div>
											<div className="spl-posts-loading-text-line"></div>
											<div className="spl-posts-loading-text-line"></div>
										</div>

										<div className="spl-posts-loading">
											<h2 className="spl-posts-loading-heading"></h2>
											<div className="spl-posts-loading-text-line"></div>
											<div className="spl-posts-loading-text-line"></div>
											<div className="spl-posts-loading-text-line"></div>
											<div className="spl-posts-loading-text-line"></div>
											<div className="spl-posts-loading-text-line"></div>
										</div>
									</div>
								:
								<ModalForm
									font_family={ this.state.font_family }
									primary_color={ this.state.primary_color }
								/>
							}
							</main>

							{
								this.state.enable_search_box?
									this.state.isAnswer?
									<div className={ "spl-search-container " + ( this.state.isFocus? 'is-focussed' : 'not-focussed' ) } style={{ '--before-background-color': `${( this.state.primary_color )}` }}>
										<input type="text" ref={ this.inputText } placeholder="What can we help you with?" className="spl-search-text" onFocus={ this.handleFocus } onBlur={ this.handleBlur } onChange={ this.searchText } style={{ 'font-family': `${(this.state.font_family)}` }}/>

										<div className="spl-search-button-container">
											<button className="spl-search-button" onClick={ this.handleSearch }>
												<svg height="20px" width="20px">
													<path fill-rule="evenodd" d="M10.5 17.917c1.7 0 3.3-.597 4.5-1.492l4.3 4.277c.2.199.5.298.7.298.2 0 .5-.1.7-.298.4-.398.4-.995 0-1.393l-4.2-4.375c1-1.293 1.5-2.785 1.5-4.475C18 6.38 14.6 3 10.5 3S3 6.381 3 10.459c0 4.077 3.4 7.458 7.5 7.458zm0-12.928c3 0 5.5 2.486 5.5 5.47 0 2.983-2.5 5.47-5.5 5.47S5 13.441 5 10.458c0-2.984 2.5-5.47 5.5-5.47z">
													</path>
												</svg>
											</button>
										</div>
									</div>
									:
									null
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
								{ 
									this.state.isSearch?
										this.state.search_posts.length > 0 ?
											<ModalSinglePost 
												content={ parse( __( this.state.search_posts[this.state.singlePostIndex].content ) ) }
												post-id={ this.state.search_posts[this.state.singlePostIndex].id }
												onClick={ this.handleClose }
											/>
											:
											null
										:
										this.state.posts.length > 0 ?
											<ModalSinglePost 
												content={ parse( __( this.state.posts[this.state.singlePostIndex].content ) ) }
												post_id={ this.state.posts[this.state.singlePostIndex].id }
												onClick={ this.handleClose }
											/>
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
					<button className="spl-button" onClick={ this.showModal } style={{ 'background-color': `${( this.state.primary_color )}` }}>
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
			:
			null
		);
	}
}

export default Spotlight;