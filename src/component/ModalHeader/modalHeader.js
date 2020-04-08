import './modalHeader.scss';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

const {
	Component,
} = wp.element;



class ModalHeader extends Component{

	constructor( props ) {
		super( props );

		this.state = {
			isActive: true
		}

		this.handleAnswer = this.handleAnswer.bind( this );
		this.handleAsk = this.handleAsk.bind( this );
	}

	handleAnswer( bool ) {
		this.setState({ isActive: bool });
		this.props.onClick( bool );
	}

	handleAsk( bool ) {
		this.setState({ isActive: bool });
		this.props.onClick( bool );
	}

	render() {
		return(
			<div className="spl-modal-header-navigation">
				<a className={"spl-navigation " + ( this.state.isActive? 'spl-active' : 'spl-inactive' ) } onClick={ () => { this.handleAnswer( true ) } }>
					<div className="spl-navigation-icon">
						<svg height="24px" width="24px"><path fill-rule="evenodd" d="M6 11.5C6 9.019 8.019 7 10.5 7S15 9.019 15 11.5 12.981 16 10.5 16A4.505 4.505 0 016 11.5m13.707 7.793l-3.965-3.966A6.456 6.456 0 0017 11.5C17 7.916 14.084 5 10.5 5A6.508 6.508 0 004 11.5c0 3.584 2.916 6.5 6.5 6.5a6.455 6.455 0 003.828-1.259l3.965 3.966a.997.997 0 001.414 0 .999.999 0 000-1.414"></path></svg>
					</div>
					<div className="spl-answer">{ __('Answer') }</div>
				</a>
				<a className={"spl-navigation " + ( this.state.isActive? 'spl-inactive' : 'spl-active' ) } onClick={ () => { this.handleAsk( false ) } }>
					<div className="spl-navigation-icon">
						<svg height="24px" width="24px">
							<path fill-rule="evenodd" d="M18.003 12.006a3 3 0 01-2.993 2.997h-.007a.997.997 0 00-.707.293l-2.294 2.293-2.292-2.291a.997.997 0 00-.707-.293h-.007c-.8 0-1.551-.311-2.117-.876A2.978 2.978 0 016 12.008v-3.01a3 3 0 012.995-2.996L15.005 6h.001c.8 0 1.553.311 2.119.877.566.566.878 1.318.878 2.119v3.01zM15.006 4h-.002l-6.009.002A5.002 5.002 0 004 8.998v3.01c0 1.336.521 2.592 1.466 3.536a4.962 4.962 0 003.105 1.443l2.724 2.724a.997.997 0 001.414 0l2.727-2.726a5.005 5.005 0 004.567-4.979v-3.01c0-1.335-.52-2.59-1.464-3.533A4.964 4.964 0 0015.006 4z"></path>
						</svg>
					</div>
					<div className="spl-ask">{ __('Ask') }</div>
				</a>
			</div>
		)
	}
}

export default ModalHeader;