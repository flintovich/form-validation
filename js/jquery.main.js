// page init
jQuery(function(){
    initFormValidation();
});

function initFormValidation(){
	jQuery('.form-validate').formValidation();
}

/*
 * jQuery Form Validation plugin
 */
(function ($) {
	function FormValidation(options) {
		this.options = $.extend({
			dataRequired: 'validate',
			dataItem: '[data-validate]',
			inputWrapClass: '.form-item',
			submitButton: 'input[type=submit]',
			event: 'keyup change'
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
			this.requiredItems = this.form.find(this.options.dataItem);
			this.submitButton = this.form.find(this.options.submitButton);
		},
		events: function(){
			var self = this;
			self.requiredItems.on(self.options.event, function(){
				var item = jQuery(this);
				var val = item.val();
				self.validateInputs(item, val);
			});

			this.submitButton.on('click', function(){
				self.requiredItems.trigger('change'); // need for first load page with not empty form item
				var result = self.checkValidate();
				console.log(result)
				if(!result){
					return false
				}
			});
		},
		validateInputs: function(item, value){
			switch (item.data(this.options.dataRequired)){
				case 'required' :
					if(value === ""){
						item.closest(this.options.inputWrapClass).addClass('error').removeClass('correct');
					} else {
						item.closest(this.options.inputWrapClass).removeClass('error').addClass('correct');
					}
					break;
				case 'email' :
					var pattern = /^([a-z0-9_\.-])+@[a-z0-9-]+\.([a-z]{2,4}\.)?[a-z]{2,4}$/i;
					if(!pattern.test(value)){
						item.closest(this.options.inputWrapClass).addClass('error').removeClass('correct');
					} else {
						item.closest(this.options.inputWrapClass).removeClass('error').addClass('correct');
					}
					break;
				case 'required-number':
					var reg = /^[0-9]+$/;
					if(!reg.test(value) || value === ""){
						item.closest(this.options.inputWrapClass).addClass('error').removeClass('correct');
					} else {
						item.closest(this.options.inputWrapClass).removeClass('error').addClass('correct');
					}
					break;
			}
		},
		checkValidate: function(){
			var self = this;
			if(self.requiredItems.length !== self.form.find('.correct').length){
				self.requiredItems.each(function(){
					var item = jQuery(this);
					var val = item.val();
					self.validateInputs(item, val);
				});
				return false
			} else {
				console.log('Ok event');
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

function initFormValidation1(){
	var form = jQuery('.wpcf7-form');
	var inputWrap = jQuery('.wpcf7-form-control-wrap');
	form.each(function(){
		var item = jQuery(this);
		var dataRequired = item.find('[data-validate]');
		var submitButton = item.find('input[type=submit]');
		dataRequired.on('keyup change', function(){
			var item = jQuery(this);
			var val = item.val();
			validateInputs(item, val);
		});
		// check validate on submit
		submitButton.on('click', function(){
			dataRequired.trigger('change');
			if(dataRequired.length !== item.find('.correct').length){
				dataRequired.each(function(){
					var item = jQuery(this);
					var val = item.val();
					validateInputs(item, val);
				});
				return false
			} else {
				jQuery.ajax({
					url: item.attr('action'),
					type: item.attr('method') || 'post',
					data: item.serialize()
				});
				jQuery('.product-lightbox').modal('hide');
			}
		});
	});

	function validateInputs(item, val){
		switch (item.data('validate')){
			case 'required' :
				if(val === ""){
					item.closest(inputWrap).addClass('error').removeClass('correct');
				} else {
					item.closest(inputWrap).removeClass('error').addClass('correct');
				}
				break;
			case 'email' :
				var pattern = /^([a-z0-9_\.-])+@[a-z0-9-]+\.([a-z]{2,4}\.)?[a-z]{2,4}$/i;
				if(!pattern.test(val)){
					item.closest(inputWrap).addClass('error').removeClass('correct');
				} else {
					item.closest(inputWrap).removeClass('error').addClass('correct');
				}
				break;
			case 'required-number':
				var reg = /^[0-9]+$/;
				if(!reg.test(val) || val === ""){
					item.closest(inputWrap).addClass('error').removeClass('correct');
				} else {
					item.closest(inputWrap).removeClass('error').addClass('correct');
				}
				break;
		}
	}
}
