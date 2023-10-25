import { shallowMount } from '@vue/test-utils';
import IndexField from './IndexField.vue';

const props = {
	resourceName: 'test',
	resourceId: 1,
	resource: {},
	field: {
		action: {
			component: 'test',
		},
		readonly: false,
		hidden: false,
		showLoadingAnimation: false,
		buttonColor: null,
		loadingColor: null,
		svg: null,
	},
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
};

const data = () => ({
	errors: [],
	loading: false,
	working: false,
	confirmActionModalOpened: false,
});

const modalStub = {
	name: 'test',
	template: '<div></div>',
};

const svgStub = {
	name: 'svg-stub',
	template: '<div></div>',
};

afterEach(() => {
	global.Nova = null;
});

describe('State tests', () => {
	it('is hidden or shown', async ()=> {
		const wrapper = shallowMount(IndexField, {
			props,
		});

		expect(wrapper.vm.hidden).toEqual(false);

		await wrapper.setProps({
			field: {
				hidden: true,
			},
		});

		expect(wrapper.vm.hidden).toEqual(true);
	});

	it('shows or hides the loaders', async () => {
		const wrapper = shallowMount(IndexField, {
			props,
			data,
		});

		// Loading set to false
		// field.showLoadingAnimation set to false
		expect(wrapper.vm.showLoading).toEqual(false);

		await wrapper.setData({
			loading: true,
		});
		await wrapper.setProps({
			field: {
				showLoadingAnimation: true,
			},
		});

		expect(wrapper.vm.showLoading).toEqual(true);
	});

	test('button is disabled or enabled', async () => {
		const wrapper = shallowMount(IndexField, {
			props,
			data,
		});

		const button = await wrapper.find('button');

		// field.readonly set to false
		// Not currently loading
		expect(wrapper.vm.disabled).toEqual(false);
		expect(button.attributes()).not.toHaveProperty('disabled');

		await wrapper.setProps({
			field: {
				readonly: true,
			},
		});

		// field.readonly set to true
		// not currently loading
		expect(wrapper.vm.disabled).toEqual(true);
		expect(button.attributes()).toHaveProperty('disabled');

		await wrapper.setData({
			loading: true,
		});
		await wrapper.setProps({
			field: {
				readonly: false,
				showLoadingAnimation: true,
			},
		});

		// field.readonly set to false
		// Loading set to true
		expect(wrapper.vm.disabled).toEqual(true);
		expect(button.attributes()).toHaveProperty('disabled');
	});

	it('has button color', async () => {
		const wrapper = shallowMount(IndexField, {
			props,
		});

		const button = await wrapper.find('button');

		// field.buttonColor set to null
		expect(wrapper.vm.buttonColor).toEqual('');
		expect(button.attributes()['style']).not.toContain('background-color');

		await wrapper.setProps({
			field: {
				buttonColor: 'red',
			},
		});

		// field.buttonColor set to red
		expect(wrapper.vm.buttonColor).toEqual('red');
		expect(button.attributes()['style']).toContain('background-color: red !important;');
	});

	it('shows or hides the modal component', async () => {
		const wrapper = shallowMount(IndexField, {
			props,
			data,
			global: {
				stubs: {
					'test': modalStub,
				},
			},
		});

		const button = await wrapper.find('button');

		// Modal is not shown
		expect(wrapper.vm.confirmActionModalOpened).toEqual(false);
		expect(wrapper.find('#confirm-action-modal').exists()).toEqual(false);

		await button.trigger('click');

		// Modal is shown
		expect(wrapper.vm.confirmActionModalOpened).toEqual(true);
		expect(wrapper.find('#confirm-action-modal').exists()).toEqual(true);
	});

	it('shows an svg', async () => {
		const wrapper = shallowMount(IndexField, {
			global: {
				stubs: {
					'svg-stub': svgStub,
				},
			},
			props: {
				...props,
				field: {
					...props.field,
					svg: 'svg-stub',
				},
			},
		});

		// field.svg set to null
		expect(wrapper.vm.svg).toEqual('svg-stub');
		expect(wrapper.findComponent(svgStub).exists()).toEqual(true);
	});

	it('does not show an svg', async () => {
		const wrapper = shallowMount(IndexField, {
			global: {
				stubs: {
					'svg-stub': svgStub,
				},
			},
			props: {
				...props,
				field: {
					...props.field,
					svg: null,
				},
			},
		});

		// field.svg set to null
		expect(wrapper.vm.svg).toEqual(false);
		expect(wrapper.findComponent(svgStub).exists()).toEqual(false);
	});

	it('shows default button text', async () => {
		const wrapper = shallowMount(IndexField, {
			props,
		});

		// field.buttonText set to null
		expect(wrapper.vm.buttonText).toEqual('Run');
		expect(wrapper.find('button').text()).toEqual('Run');
	});

	it('shows custom button text', async () => {
		const wrapper = shallowMount(IndexField, {
			props: {
				...props,
				field: {
					...props.field,
					text: 'Test',
				},
			},
		});

		// field.buttonText set to null
		expect(wrapper.vm.buttonText).toEqual('Test');
		expect(wrapper.find('button').text()).toEqual('Test');
	});
});
