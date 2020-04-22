import './modalSearch.scss';
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



class ModalSearch extends Component{

	constructor( props ) {
		super( props );

		this.state = {
			posts: [],
			isSearchResult: false,
		}

		this.handleSinglePost = this.handleSinglePost.bind( this );
	}

	componentDidMount() {

			let { posts } = this.state;
			posts.push( ...this.props.searchResult );
			
			this.setState( { posts } );
			this.setState( { isSearchResult: this.props.isSearchResult } );
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
							this.state.posts.length == 0 && this.state.isSearchResult?
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
			</div>
			</Fragment>
		)
	}
}

export default ModalSearch;