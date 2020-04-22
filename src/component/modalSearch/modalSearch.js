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
		this.handleAsk = this.handleAsk.bind( this );
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

	handleAsk( bool ) {
		this.props.onClick( bool );
	}


	render() {
		return(
			<Fragment>
			<div className="spl-modal-posts-container">
				<ul className="spl-modal-posts-lists">
					<TransitionGroup className="spl-modal-posts-transition" component={null}>
						{
							this.state.posts.length == 0 && this.state.isSearchResult?
							<li className="spl-modal-posts-search-lists-none">
								<div className="spl-modal-posts-search-lists-none-wrap">
									<div className="spl-modal-posts-search-lists-none-img-container">
										<img src="https://beacon-v2.helpscout.net/static/png/02.png" alt="shapes" />
									</div>

									<h4>{ __( 'Hmm...' ) }</h4>

									<p className="spl-modal-posts-search-lists-none-msg-wrap">
										<span className="spl-modal-posts-search-lists-none-msg">
											{ __( 'We couldn’t find any articles that match your search. Try searching a broader term, or ' ) }
										</span>

										<span className="spl-modal-posts-search-lists-none-getInTouch">
											{ __( 'Get in touch.' ) }
										</span>
									</p>
								</div>
							</li>
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
				{
					this.state.posts.length != 0?
						<div className="spl-results-getInTouch">
							<p className="spl-results-getInTouch-text">
								{ __( "Can't find an answer?" ) }
							</p>

							<a className="spl-results-getInTouch-link" onClick={ () => { this.handleAsk( false ) } }>
								<div className="spl-results-getInTouch-icon">
									<svg height="24px" width="24px">
										<path fill-rule="evenodd" d="M18.003 12.006a3 3 0 01-2.993 2.997h-.007a.997.997 0 00-.707.293l-2.294 2.293-2.292-2.291a.997.997 0 00-.707-.293h-.007c-.8 0-1.551-.311-2.117-.876A2.978 2.978 0 016 12.008v-3.01a3 3 0 012.995-2.996L15.005 6h.001c.8 0 1.553.311 2.119.877.566.566.878 1.318.878 2.119v3.01zM15.006 4h-.002l-6.009.002A5.002 5.002 0 004 8.998v3.01c0 1.336.521 2.592 1.466 3.536a4.962 4.962 0 003.105 1.443l2.724 2.724a.997.997 0 001.414 0l2.727-2.726a5.005 5.005 0 004.567-4.979v-3.01c0-1.335-.52-2.59-1.464-3.533A4.964 4.964 0 0015.006 4z"></path>
									</svg>
								</div>

								<div className="spl-results-getInTouch-ask">{ __( 'Get in touch' ) }</div>
							</a>
						</div>
						:
						''
				}
			</div>
			</Fragment>
		)
	}
}

export default ModalSearch;