<template>
	<DefaultField
		:field="field"
		:errors="errors"
		:show-help-text="showHelpText"
		:full-width-content="fullWidthContent"
	>
		<template #field>
			<input
				:id="field.name"
				v-model="value"
				type="text"
				class="w-full form-control form-input form-input-bordered"
				:class="errorClasses"
				:placeholder="field.name"
			>
		</template>
	</DefaultField>
</template>

<script>
import { FormField, HandlesValidationErrors } from 'laravel-nova';

export default {
	mixins: [FormField, HandlesValidationErrors],

	props: ['resourceName', 'resourceId', 'field'],

	methods: {
		/*
         * Set the initial, internal value for the field.
         */
		setInitialValue() {
			this.value = this.field.value || '';
		},

		/**
         * Fill the given FormData object with the field's internal value.
         */
		fill(formData) {
			formData.append(this.field.attribute, this.value || '');
		},

		/**
         * Update the field's internal value.
         */
		handleChange(value) {
			this.value = value;
		},
	},
};
</script>
