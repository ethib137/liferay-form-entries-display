import moment from 'moment'
import React from 'react';
import ReactDOM from 'react-dom';

export default class extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			form: {},
			formEntries: {},
			formFields: []
		};

		this._renderFieldValue = this._renderFieldValue.bind(this);
		this._formatFormFields = this._formatFormFields.bind(this);
	}

	componentDidMount() {
		const formId = this.props.configuration.portletInstance.formId;

		Promise.all(
			[
				this._fetch(`/o/headless-form/v1.0/forms/${formId}`),
				this._fetch(`/o/headless-form/v1.0/forms/${formId}/form-records`)
			]
		).then(
			data => {
				const form = JSON.parse(data[0]);
				const formEntries = JSON.parse(data[1]);

				const formFields = this._formatFormFields(form);

				this.setState(
					{
						form,
						formEntries,
						formFields
					}
				);
			}
		);
	}

	_fetch(url) {
		const {email, password} = this.props.configuration.system;

		const authorization = `Basic ${btoa(email + ':' + password)}`;

		return fetch(
			url,
			{
				method: 'GET',
				headers: {
					'Authorization': authorization
				},
			}
		).then(
			data => data.text()
		).catch(
			function (err) {
				console.log('Failed to fetch: ', err);
			}
		);
	}

	_formatFormFields(form) {
		let formFields = [];

		form.structure.formPages.forEach(
			formPage => {
				formPage.formFields.forEach(
					formField => {
						if (formField.inputControl != 'paragraph') {
							formFields.push(formField);
						}
					}
				);
			}
		);

		return formFields;
	}

	_renderFieldValue(field, i) {
		let retVal;

		var fieldType = this.state.formFields[i];

		switch (fieldType.inputControl) {
			case 'document_library':
				retVal = <a href={field.formDocument.contentUrl}>{field.formDocument.title}</a>;
			break;
			default:
				retVal = field.value;
		}

		return retVal;
	}

	render() {
		const {formEntries, formFields} = this.state;
		const {showDraft} = this.props.configuration.portletInstance;

		let {items} = formEntries;

		if (items && !showDraft) {
			items = items.filter(item => !item.draft);
		}

		return (
			<div className="table-responsive">
				<table className="table table-autofit table-hover table-list table-nowrap">
					<thead>
						<tr>
							<th className="table-head-title">
								<span className="inline-item text-truncate-inline">
									<span className="text-truncate" title="ID">{Liferay.Language.get('id')}</span>
								</span>
							</th>

							<th className="table-head-title">
								<span className="inline-item text-truncate-inline">
									<span className="text-truncate" title="Create Date">{Liferay.Language.get('create-date')}</span>
								</span>
							</th>

							{formFields && formFields.map(formField =>
								(
									<th className="table-cell-expand table-head-title" key={formField.name}>
										<span className="inline-item text-truncate-inline">
											<span className="text-truncate" title={formField.label}>{formField.label}</span>
										</span>
									</th>
								)
							)}

							<th className="table-head-title">
								<span className="inline-item text-truncate-inline">
									<span className="text-truncate" title="Status">{Liferay.Language.get('status')}</span>
								</span>
							</th>
						</tr>
					</thead>
					<tbody>
						{items && items.map(item => 
							(
								<tr key={item.id}>
									<td>{item.id}</td>

									<td>
										<span className="lfr-portal-tooltip" data-title={moment(item.dateCreated).format('MMMM Do YYYY, h:mm:ss a')}>{moment(item.dateCreated).fromNow()}</span>
									</td>

									{item.formFieldValues.map((formFieldValue, i) =>
										(
											<td key={item.id + formFieldValue.name}>{this._renderFieldValue(formFieldValue, i)}</td>
										)
									)}

									<td>
										<span className={`label ${item.draft ? 'label-secondary' : 'label-success'}`}>
											<span className="label-item label-item-expand">{item.draft ? Liferay.Language.get('draft') : Liferay.Language.get('approved')}</span>
										</span>
									</td>
								</tr>
							)
						)}
					</tbody>
				</table>
			</div>
		);
	}
}