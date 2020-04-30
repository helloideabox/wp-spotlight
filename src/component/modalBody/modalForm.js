import './modalForm.scss';
import axios from 'axios';
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

		this.state ={
			isForm: false,
			name: '',
			email: '',
			query: '',
			isFormSubmitLoader: false,
			success: false,
			isSuccessMsg: false,
			files: [],
			isfilesList: false,
			formErr:{
				nameErr: '',
				emailErr: '',
				queryErr: '',
			}
		}

		this.err = false;
		this.fileUpload = React.createRef();

		this.handleChange = this.handleChange.bind( this );
		this.handleFileUpload = this.handleFileUpload.bind( this );
		this.handleClick = this.handleClick.bind( this );
		this.handleSubmit = this.handleSubmit.bind( this );
		this.closeUploadList = this.closeUploadList.bind( this );
		this.openUploadList = this.openUploadList.bind( this );
		this.handleFormValidate = this.handleFormValidate.bind( this );
	}

	componentDidMount() {
		this.setState( { isForm: true } );
	}

	handleChange( e ) {
		this.setState( { [e.target.name]: e.target.value } );
	}

	handleClick( e ) {
		
		let { files } = this.state;

		Array.from( e.target.files ).map( value => {

			if( files.every( val => val.name != value.name ) ) {
				files.push( value );
			}
		} );

		this.setState( { files } );
	}

	handleFileUpload() {
		this.fileUpload.current.click();
	}

	handleFormValidate() {

		let {formErr} = this.state;

		// Reseting values.
		formErr.nameErr = '';
		formErr.emailErr = '';
		formErr.queryErr = '';

		if( this.state.name.length === 0 ) {
			formErr.nameErr = '*Please enter your name.';
			this.setState( { formErr } );
			return true;
		}
		
		if( this.state.email.length === 0 ) {
			formErr.emailErr = '*Please enter your email.';
			this.setState( { formErr } );
			return true;
		}else if( ! this.state.email.match( /^(\S+@\S+\.\S+)$/ ) ) {
			formErr.emailErr = '*Email is not valid.';
			this.setState( { formErr } );
			return true;
		}

		if( this.state.query.length === 0 ) {
			formErr.queryErr = '*Please enter your suggestions 	or questions.';
			this.setState( { formErr } );
			return true;
		}

		return false;
		
	}

	// Hangling form submit.
	async handleSubmit( e ) {
		e.preventDefault();

		this.err = this.handleFormValidate();

		if( ! this.err ) {
			let form_data = new FormData();
			form_data.append( 'action', 'handle_ask' );
			form_data.append( 'security', ajax.nonce );
			form_data.append( 'name', this.state.name );
			form_data.append( 'email', this.state.email );
			form_data.append( 'query', this.state.query );

			let { files } = this.state;
			files.forEach( file => {
				form_data.append( 'files[]', file );
			});

			this.setState( { isFormSubmitLoader: true } );

			axios.post( ajax.ajax_url, form_data )
			.then(  response => {
				console.log(response.data);
				this.setState( { isFormSubmitLoader: false } );
				this.setState( { isSuccessMsg: true } );

				if( response.data === 'success' ) {
					this.setState( { success: true } );
				} else{
					this.setState( { success: false } );
				}

				// Clearing the form after the response.
				setTimeout( () => {
					this.setState( { isSuccessMsg:false } );
				}, 3000 );

				// Fading the success response.
				setTimeout( () => {
					this.setState( { name: '' } );
					this.setState( { email: '' } );
					this.setState( { query: '' } );
				}, 100 );
			} );
		}
	}

	// Opening the upload list and restting the input value to empty.
	openUploadList() {
		this.fileUpload.current.value = '';
		this.setState( { isfilesList: true } );
	}

	// Closing list when clicked outside the file list container.
	closeUploadList( e ) {
		if( e.target.className == 'spl-modal-form-fileUploadList file-list-enter-done' ) {
			this.setState( { isfilesList: false } );
		}
	}

	// For closing the list of file uploaded.
	handleClose( index ) {

		let { files } = this.state;
		files.splice( index, 1 );

		this.setState( { files } );

		if( files.length == 0 ) {
			this.setState( { isfilesList: false } );
		} else {
			this.setState( { isfilesList: true } );
		}
	}

	render() {
		console.log( this.state );
		return(
			<Fragment>
				<CSSTransition
					in={ this.state.isForm }
					unmountOnExit
					timeout={250}
					classNames="form"
				>
					<div className="spl-modal-form-wrap">
						<form className="spl-modal-form-container" action="post">
							<div className={ "spl-modal-form-ask-name " + ( this.state.formErr.nameErr? 'form-err' : '' ) }>
								<input type="text" className="spl-modal-input-name" name="name" placeholder={ __( "Name" ) } value={ this.state.name } onChange={ this.handleChange } required style={{ 'font-family': `${(this.props.font_family)}` }}/>
							</div>
							{
								this.state.formErr.nameErr?
								<small className="spl-modal-form-name-err">
									<i>
									{
										this.state.formErr.nameErr
									}
									</i>
								</small>
								:
								null
							}

							<div className={ "spl-modal-form-ask-email " + ( this.state.formErr.emailErr? 'form-err' : '' ) }>
								<input type="email" className="spl-modal-input-email" name="email" placeholder={ __( "Eamil address" ) } value={ this.state.email } onChange={ this.handleChange } required style={{ 'font-family': `${(this.props.font_family)}` }}/>
							</div>
							{
								this.state.formErr.emailErr?
								<small className="spl-modal-form-email-err">
									<i>
									{
										this.state.formErr.emailErr
									}
									</i>
								</small>
								:
								null
							}

							<div className={ "spl-modal-form-ask-help " + ( this.state.formErr.queryErr? 'form-err' : '' ) }>
								<textarea className="spl-modal-input-help" name="query" placeholder={ __( "How can we help?" ) } value={ this.state.query } onChange={ this.handleChange } style={{ 'font-family': `${(this.props.font_family)}` }}></textarea>
								
								<div className="spl-modal-form-fileUpload">
									<input type="file" hidden name="file" onChange={ this.handleClick } ref={ this.fileUpload } />

									{
										this.state.files.length < 3?
									<button className="spl-modal-form-fileUpload-button" type="button" onClick={ this.handleFileUpload } >
										<span className="spl-modal-form-fileUpload-icon">
											<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
												<path fill-rule="evenodd" d="M21 5a1 1 0 110 2h-2v2a1 1 0 11-2 0V7h-2a1 1 0 110-2h2V3a1 1 0 112 0v2h2zm-5 14H5c-1.654 0-3-1.346-3-3V8c0-1.654 1.346-3 3-3h6a1 1 0 110 2H5c-.552 0-1 .449-1 1v3.586l2.293-2.293a.999.999 0 011.414 0L11 12.586l1.293-1.293a.999.999 0 011.414 0L17 14.586v-1.664a1 1 0 112 0V16c0 1.654-1.346 3-3 3zM4 16c0 .551.448 1 1 1h11a.97.97 0 00.501-.154c-.071-.043-.147-.077-.208-.139L13 13.414l-1.293 1.293a.999.999 0 01-1.414 0L7 11.414l-3 3V16z"></path>
											</svg>
										</span>
									</button>
									:
									''
									}
								</div>

								<CSSTransition
									in={ Boolean(this.state.files.length) }
									unmountOnExit
									timeout={200}
									classNames="file-uploaded"
								>
									<div className="spl-modal-form-fileUploaded-number">
										<button className="spl-modal-form-fileUploaded-button" type="button" onClick={ this.openUploadList }>
											<span>
												{ this.state.files.length > 0? this.state.files.length : '' }
											</span>
											<span className="spl-modal-form-fileUploaded-text">Files</span>
										</button>
									</div>
								</CSSTransition>
							</div>
							{
								this.state.formErr.queryErr?
								<small className="spl-modal-form-query-err">
									<i>
									{
										this.state.formErr.queryErr
									}
									</i>
								</small>
								:
								null
							}

							<div className="spl-modal-form-submit-wrap">
								<button className={ "spl-modal-form-submit " + ( this.state.isSuccessMsg? 'not-allowed' : '' ) + ' ' + ( this.props.background_color ) } disabled={ this.state.isSuccessMsg } type="submit" onClick={ this.handleSubmit } style={{ 'font-family': `${(this.props.font_family)}` }}>
									{ __( 'Send a message' ) }
								</button>
								

								{
									this.state.isFormSubmitLoader?
										<span className="spl-modal-form-submit-loader">
											<svg  xmlns="http://www.w3.org/2000/svg" version="1.0" width="64px" height="64px" viewBox="0 0 128 128">
												<g transform="rotate(180 64 64)">
													<circle cx="16" cy="64" r="16" fill="#fff" fill-opacity="1"/>
													<circle cx="16" cy="64" r="14.344" fill="#fff" fill-opacity="1" transform="rotate(45 64 64)"/>
													<circle cx="16" cy="64" r="12.531" fill="#fff" fill-opacity="1" transform="rotate(90 64 64)"/>
													<circle cx="16" cy="64" r="10.75" fill="#fff" fill-opacity="1" transform="rotate(135 64 64)"/>
													<circle cx="16" cy="64" r="10.063" fill="#fff" fill-opacity="1" transform="rotate(180 64 64)"/>
													<circle cx="16" cy="64" r="8.063" fill="#fff" fill-opacity="1" transform="rotate(225 64 64)"/>
													<circle cx="16" cy="64" r="6.438" fill="#fff" fill-opacity="1" transform="rotate(270 64 64)"/>
													<circle cx="16" cy="64" r="5.375" fill="#fff" fill-opacity="1" transform="rotate(315 64 64)"/>
													<animateTransform attributeName="transform" type="rotate" values="0 64 64;315 64 64;270 64 64;225 64 64;180 64 64;135 64 64;90 64 64;45 64 64" calcMode="discrete" dur="720ms" repeatCount="indefinite"/>
												</g>
											</svg>
										</span>
										:
										null
								}
							</div>
							
						</form>
					</div>
				</CSSTransition>
				
				<CSSTransition
					in={ this.state.isfilesList }
					unmountOnExit
					timeout={250}
					classNames="file-list"
				>
					<div className="spl-modal-form-fileUploadList" onClick={ (e) => this.closeUploadList( e ) }>
						<ul className="spl-fileUploadList">
							{
								Object.keys( this.state.files ).map( ( index ) => {
									return(
										<li className="spl-fileUploadSingleList">
											<div className="spl-fileUploadSingleList-icon">
												<span>
													<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
														<path fill-rule="evenodd" d="M7 7h10.001A1 1 0 0118 8v5.586l-2.293-2.293a.999.999 0 00-1.414 0L13 12.586 9.707 9.293a.999.999 0 00-1.414 0L6 11.586V8c0-.551.448-1 1-1zm10 10H7c-.552 0-1-.449-1-1v-1.586l3-3 3.293 3.293a.999.999 0 001.414 0L15 13.414l2.931 2.93A.995.995 0 0117 17zM4 16c0 1.654 1.346 3 3 3h10c1.654 0 3-1.346 3-3V8c0-1.654-1.346-3-2.999-3H7C5.346 5 4 6.346 4 8v8z"></path>
													</svg>
												</span>
											</div>

											<p className="spl-fileUploadSingleList-name">{ this.state.files[index].name }</p>

											<div className="spl-fileUploadSingleList-remove">
												<button className="spl-fileUploadSingleList-remove-button" onClick={ () => this.handleClose( index ) }>
													<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
														<path fill-rule="evenodd" d="M13.414 12l2.293-2.293a.999.999 0 10-1.414-1.414L12 10.586 9.707 8.293a.999.999 0 10-1.414 1.414L10.586 12l-2.293 2.293a.999.999 0 101.414 1.414L12 13.414l2.293 2.293a.997.997 0 001.414 0 .999.999 0 000-1.414L13.414 12z"></path>
													</svg>
												</button>
											</div>
										</li>
									);
								} )
							}
						</ul>
					</div>
				</CSSTransition>

				{
					this.state.isFormSubmitLoader?
						<div className="spl-modal-form-submit-response-background"></div>
						:
						null
				}

				<CSSTransition
					in={ this.state.isSuccessMsg }
					unmountOnExit
					timeout={250}
					classNames="response"
				>
					<div className="spl-modal-form-submit-response">
						{
							this.state.success?
								<div className="spl-modal-form-submit-response-success">
									<span className="spl-modal-form-submit-response-icon">
										<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
											<path d="M9.8 15.2l-2-2c-.4-.4-.4-1 0-1.4s1-.4 1.4 0l1.3 1.3 4.3-4.3c.4-.4 1-.4 1.4 0s.4 1 0 1.4l-5 5c-.2.2-.5.3-.7.3-.3 0-.5-.1-.7-.3z"></path>
										</svg>
									</span>
									
									<span className="spl-modal-form-submit-response-success-msg">
										{ __( 'Thank you. We will get back to you soon.' ) }
									</span>
								</div>
								:
								<div className="spl-modal-form-submit-response-failed">
									<span className="spl-modal-form-submit-response-icon">
										<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
											<path fill-rule="evenodd" d="M13.414 12l2.293-2.293a.999.999 0 10-1.414-1.414L12 10.586 9.707 8.293a.999.999 0 10-1.414 1.414L10.586 12l-2.293 2.293a.999.999 0 101.414 1.414L12 13.414l2.293 2.293a.997.997 0 001.414 0 .999.999 0 000-1.414L13.414 12z"></path>
										</svg>
									</span>

									<span className="spl-modal-form-submit-response-failed-msg">
										{ __( 'Please try again.' ) }
									</span>
								</div>
						}
					</div>
				</CSSTransition>
			</Fragment>
		)
	}
}

export default ModalPost;