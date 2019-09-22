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

		this._setFormFields = this._setFormFields.bind(this);
	}

	componentDidMount() {
		const formId = this.props.configuration.portletInstance.formId;

		this._fetch(`/o/headless-form/v1.0/forms/${formId}/form-records`).then(
			data => {
				this.setState(
					{
						formEntries: JSON.parse(data)
					}
				);
			}
		);

		this._fetch(`/o/headless-form/v1.0/forms/${formId}`).then(
			data => {
				this.setState(
					{
						form: JSON.parse(data)
					}
				);

				this._setFormFields(JSON.parse(data));
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

	_setFormFields(form) {
		let formFields = [];

		form.structure.formPages.forEach(
			formPage => {
				formPage.formFields.forEach(
					formField => {
						formFields.push(formField);
					}
				);
			}
		);

		this.setState(
			{
				formFields: formFields
			}
		);
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

									{item.formFieldValues.map(formFieldValue =>
										(
											<td key={item.id + formFieldValue.name}>{formFieldValue.value}</td>
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