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

const defaultButtonStub = {
	name: 'DefaultButton',
	template: '<div><slot /></div>',
};

const global = {
	stubs: {
		'test': modalStub,
		'svg-stub': svgStub,
		'DefaultButton': defaultButtonStub,
	},
};

afterEach(() => {
	global.Nova = null;
});

describe('State tests', () => {
	it('is hidden or shown', async ()=> {
		const wrapper = shallowMount(IndexField, {
			global,
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
			global,
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

	it('shows an svg', async () => {
		const wrapper = shallowMount(IndexField, {
			global,
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
			global,
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
			global,
			props,
		});

		// field.buttonText set to null
		expect(wrapper.vm.buttonText).toEqual('Run');
		expect(wrapper.html()).toContain('Run');
	});

	it('shows custom button text', async () => {
		const wrapper = shallowMount(IndexField, {
			global,
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
		expect(wrapper.html()).toContain('Test');
	});
});
