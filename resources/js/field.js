Nova.booting((Vue) => {
	Vue.component('IndexNovaActionButton', require('./components/IndexField').default);
	Vue.component('DetailNovaActionButton', require('./components/DetailField').default);
	// Vue.component('form-nova-action-button', require('./components/FormField'))
});
