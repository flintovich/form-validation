
/*
 * jQuery Form Validation plugin
 */
(function ($) {
	function FormValidation(options) {
		this.options = $.extend({
			dataRequired: 'validate',
			inputWrap: '.form-item',
			submitButton: 'input[type=submit]',
			event: 'keyup change',
			errorClass: 'error',
			correctClass: 'correct',
			successEvent: function(){}
		}, options);
		this.init();
	}

	FormValidation.prototype = {
		init: function () {
			this.findElements();
			this.events();
		},
		findElements: function () {
			this.form = jQuery(this.options.holder);
			this.requiredItems = this.form.find('[data-'+this.options.dataRequired+']');
			this.submitButton = this.form.find(this.options.submitButton);
		},
		events: function(){
			var self = this;
			self.requiredItems.on(self.options.event, function(){
				var item = jQuery(this);
				var val = item.val();
				self.validateInputs(item, val);
			});
			self.form.on('submit', function(){
				self.requiredItems.trigger('change'); // need for first load page with not empty form item
				var result = self.checkValidate();
				if(!result){
					return false
				}
			});
		},
		validateInputs: function(item, value){
			switch (item.data(this.options.dataRequired)){
				case 'required' :
					if(value === ""){
						item.closest(this.options.inputWrap).addClass(this.options.errorClass).removeClass(this.options.correctClass);
					} else {
						item.closest(this.options.inputWrap).removeClass(this.options.errorClass).addClass(this.options.correctClass);
					}
					break;
				case 'required-email' :
					var pattern = /^([a-z0-9_\.-])+@[a-z0-9-]+\.([a-z]{2,4}\.)?[a-z]{2,4}$/i;
					if(!pattern.test(value)){
						item.closest(this.options.inputWrap).addClass(this.options.errorClass).removeClass(this.options.correctClass);
					} else {
						item.closest(this.options.inputWrap).removeClass(this.options.errorClass).addClass(this.options.correctClass);
					}
					break;
				case 'required-number':
					var reg = /^[0-9]+$/;
					if(!reg.test(value) || value === ""){
						item.closest(this.options.inputWrap).addClass(this.options.errorClass).removeClass(this.options.correctClass);
					} else {
						item.closest(this.options.inputWrap).removeClass(this.options.errorClass).addClass(this.options.correctClass);
					}
					break;
				case 'required-select':
					if(value === ""){
						item.closest(this.options.inputWrap).addClass(this.options.errorClass).removeClass(this.options.correctClass);
					} else {
						item.closest(this.options.inputWrap).removeClass(this.options.errorClass).addClass(this.options.correctClass);

					}
					break;
			}
		},
		checkValidate: function(){
			var self = this;
			if(self.requiredItems.length !== self.form.find('.'+this.options.correctClass).length){
				self.requiredItems.each(function(){
					var item = jQuery(this);
					var val = item.val();
					self.validateInputs(item, val);
				});
				return false
			} else {
				if(typeof self.options.successEvent === 'function'){
					self.options.successEvent();
				}
				return true
			}
		}
	};

	// jquery plugin
	$.fn.formValidation = function (opt) {
		return this.each(function () {
			$(this).data('FormValidation', new FormValidation($.extend(opt, {holder: this})));
		});
	};
})(jQuery);