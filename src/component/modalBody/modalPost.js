import './modalPost.scss';
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



class ModalPost extends Component{

	constructor( props ) {
		super( props );

		this.state = {
			posts:[],
			isPostFetch: false,
		}
		this.post_types = [ 'post' ];

		this.handleSinglePost = this.handleSinglePost.bind( this );
	}

	componentDidMount() {

		let query = '';

		// Making query for fetch function.
		this.post_types.map( value => {
			query += 'post_types[]=' + value + '&';
		} );

		// To trim the last '&' in the string.
		query = query.substring( 0, query.length-1 );

		fetch( `${siteName}/wp-json/spotlight/v1/posts/?${query}` )
			.then( response => response.json() )
			.then( data => {

				let {posts} = this.state;
				posts.push( ...data );
				this.setState( { posts } );
				this.setState( { isPostFetch: true } )

				// Passing props to parent and updating it.
				if( this.props.posts.length == 0 ) {
					this.props.posts.push( ...data );
				} else {
					data.map( value => {
						if( this.props.posts.every( val => val.title != value.title ) ) {
							this.props.posts.push( value );
						}
					} );
				}

			} )
			.catch( error => {
				console.log( error );
			} )
	}


	handleSinglePost( index, bool ) {

		// Updating the props to parent.
		this.props.onClick( index, bool );
	}


	render() {
		return(
			<Fragment>
			<div className="spl-modal-posts-container">
				<ul className="spl-modal-posts-lists">
					<TransitionGroup className="spl-modal-posts-transition" component={null}>
						{
							this.state.posts.length == 0 && this.state.isPostFetch?
							<li className="spl-modal-posts-lists-none">{ __( 'No post created till now.' ) }</li>
							:
							Object.keys( this.state.posts ).map( ( index ) => {
								return(
									<CSSTransition
										key={index}
										timeout={300}
										classNames="post"
										enter={true}
									>
									<li className="spl-single-post-container" key={ index } style={{ 'transition-delay': `${(parseInt(index)+1) * 150}ms` }}>
										<a className="spl-single-post" onClick={ () => this.handleSinglePost( index, true ) }>
											<h2 className="spl-single-post-heading">
												{ __( this.state.posts[index].title ) }
											</h2>
											<p className="spl-single-post-content">
												{ parse( __( this.state.posts[index].excerpt) ) }
											</p>
										</a>
									</li>
								</CSSTransition>	
								)
							} )
						}
					</TransitionGroup>
				</ul>

				<CSSTransition
					in={ ! this.state.isPostFetch }
					unmountOnExit
					timeout={150}
					classNames="loading"
				>
				<div className="spl-posts-loading">
					<h2 className="spl-posts-loading-heading"></h2>
					<div className="spl-posts-loading-text-line"></div>
					<div className="spl-posts-loading-text-line"></div>
					<div className="spl-posts-loading-text-line"></div>
					<div className="spl-posts-loading-text-line"></div>
					<div className="spl-posts-loading-text-line"></div>
				</div>
				</CSSTransition>
			</div>
			</Fragment>
		)
	}
}

export default ModalPost;