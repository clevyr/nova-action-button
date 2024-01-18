<template>
	<div>
		<DefaultButton
			:class="{ hidden: hidden }"
			:disabled="disabled"
			:style="`background-color: ${buttonColor} !important`"
			@click.stop.prevent="openConfirmationModal"
		>
			<loading
				v-if="showLoading"
				:color="field.loadingColor"
			/>
			<span v-else>{{ buttonText }}</span>
			<component
				:is="svg"
				v-if="svg"
			/>
		</DefaultButton>

		<!-- Action Confirmation Modal -->
		<component
			:is="selectedAction?.component"
			v-if="confirmActionModalOpened"
			id="confirm-action-modal"
			class="text-left"
			:working="working"
			:selected-resources="selectedResources"
			:resource-name="resourceName"
			:action="selectedAction"
			:errors="errors"
			:show="confirmActionModalOpened"
			@confirm="executeAction"
			@close="closeConfirmationModal"
		/>
	</div>
</template>

<script>
import {
	FormField,
	HandlesValidationErrors,
} from 'laravel-nova';

import Loading from './Loading';

export default {
	components: {
		Loading,
	},
	mixins: [
		FormField,
		HandlesValidationErrors,
	],
	props: {
		resourceName: String,
		field: Object,
		resource: {},
		queryString: {
			type: Object,
			default: () => ({
				currentSearch: '',
				encodedFilters: '',
				currentTrashed: '',
				viaResource: '',
				viaResourceId: '',
				viaRelationship: '',
			}),
		},
	},

	data: () => ({
		working: false,
		loading: false,
		confirmActionModalOpened: false,
	}),

	computed: {
		selectedResources() {
			return [this.field.resourceId];
		},

		selectedAction() {
			return this.field.action;
		},

		/**
		 * Get the query string for an action request.
		 */
		actionRequestQueryString() {
			return {
				action: this.selectedAction.uriKey,
				search: this.queryString.currentSearch,
				filters: this.queryString.encodedFilters,
				trashed: this.queryString.currentTrashed,
				viaResource: this.queryString.viaResource,
				viaResourceId: this.queryString.viaResourceId,
				viaRelationship: this.queryString.viaRelationship,
			};
		},

		buttonText() {
			return this.field.text || this.__('Run');
		},

		buttonColor() {
			return this.field.buttonColor || '';
		},

		hidden() {
			return this.field.hidden || false;
		},

		showLoading() {
			return (this.field.showLoadingAnimation || false) && this.loading;
		},

		disabled() {
			return this.field.readonly || ((this.field.showLoadingAnimation || false) && this.loading);
		},

		svg() {
			return this.field.svg || false;
		},
	},
	methods: {
		/**
		 * Confirm with the user that they actually want to run the selected action.
		 */
		openConfirmationModal() {
			this.loading = true;
			this.confirmActionModalOpened = true;
		},

		/**
		 * Close the action confirmation modal.
		 */
		closeConfirmationModal() {
			this.confirmActionModalOpened = false;
			this.errors.clear();
			this.loading = false;
		},

		/**
		 * Execute the selected action.
		 */
		executeAction() {
			this.working = true;
			this.loading = true;

			if (this.selectedResources.length === 0) {
				alert(this.__('Please select a resource to perform this action on.'));
				return;
			}

			Nova.request({
				method: 'post',
				url: this.endpoint || `/nova-api/${this.resourceName}/action`,
				params: this.actionRequestQueryString,
				data: this.actionFormData(),
			})
				.then((response) => {
					this.confirmActionModalOpened = false;
					this.handleActionResponse(response.data);
					this.working = false;
					this.loading = false;
				})
				.catch((error) => {
					this.working = false;
					this.loading = false;

					if (error.response.status === 422) {
						this.errors.add(error.response.data.errors);
						Nova.error(this.__('There was a problem executing the action.'));
					}
				});
		},

		/**
		 * Gather the action FormData for the given action.
		 */
		actionFormData() {
			return _.tap(new FormData(), (formData) => {
				formData.append('resources', this.selectedResources);

				_.each(this.selectedAction.fields, (field) => {
					field.fill(formData);
				});
			});
		},

		/**
		 * Handle the action response. Typically either a message, download or a redirect.
		 */
		handleActionResponse(data) {
			if (data.message) {
				this.$parent.$emit('actionExecuted');
				Nova.$emit('action-executed');
				Nova.success(data.message);
			} else if (data.deleted) {
				this.$parent.$emit('actionExecuted');
				Nova.$emit('action-executed');
			} else if (data.danger) {
				this.$parent.$emit('actionExecuted');
				Nova.$emit('action-executed');
				Nova.error(data.danger);
			} else if (data.download) {
				const link = document.createElement('a');
				link.href = data.download;
				link.download = data.name;
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
			} else if (data.redirect) {
				window.location = data.redirect;
			} else if (data.push) {
				this.$router.push(data.push);
			} else if (data.openInNewTab) {
				window.open(data.openInNewTab, '_blank');
			} else {
				this.$parent.$emit('actionExecuted');
				Nova.$emit('action-executed');
				Nova.success(this.__('The action ran successfully!'));
			}
		},
	},
};
</script>
