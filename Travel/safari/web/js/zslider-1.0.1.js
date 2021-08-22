/*~
 * jQuery slider plug-in zslider v1.0.1
 *
 * Released under the MIT license
 * Author: Riccio Zhang(ÕÅç÷)
 * Contact me:
 * 		blog: http://blog.csdn.net/ricciozhang
 * 		GitHub: https://github.com/ricciozhang
 * 		email: 791967024@qq.com
 * 			   13265318433@163.com
 * 			   ricciozhang@gmail.com
 * Date: 2015-8-13
 *
 * Related Articles:
 * 			http://blog.csdn.net/ricciozhang/article/details/47403283
 * 			http://blog.csdn.net/ricciozhang/article/details/47725725
 *~
 */
(function($, window, document) {
	//---- Statics
	var DEFAULT_ANIMATE_TYPE = 'fade',
		ARRAY_SLICE = [].slice,
		ARRAY_CONCAT = [].concat
		;

	//---- Methods
	function concatArray() {
		var deep = false,
			result = [];
		if(arguments.length > 0 &&
				arguments[arguments.length - 1] === true) {
			deep = true;
		}
		for(var i = 0; i < arguments.length; i++) {
			if(!!arguments[i].length) {
				if(deep) {
					for(var j = 0; j < arguments[i].length; j++) {
						//recursive call
						result =  ARRAY_CONCAT.call(result,
								concatArray(arguments[i][j], true));
					}
				} else {
					result = ARRAY_CONCAT.call(result, arguments[i]);
				}
			} else if(i != arguments.length - 1 ||
					(arguments[arguments.length - 1] !== true &&
							arguments[arguments.length - 1] !== false)) {
				result.push(arguments[i]);
			}
		}
		return result;
	}

	//----- Core
	$.fn.extend({
		zslider: function(zsliderSetting, autoStart) {
			var itemLenght = 0,
				currItemIndex = 0,
				started = false,
				oInterval = {},
				setting =  {
					intervalTime: 3000,
					step: 1,
					imagePanels: $(),
					animateConfig: {
						atype: 'fade',
						fadeInSpeed: 500,
						fadeOutSpeed: 1000
					},
					panelHoverStop: true,
					ctrlItems: $(),
					ctrlItemActivateType: 'hover' || 'click',
					ctrlItemHoverCls: '',
					flipBtn: {},
					panelHoverShowFlipBtn: true,
					callbacks: {
					    animate: null
					}
				},
				that = this
				;

			//core methods
			var slider = {
					pre: function() {
						var toIndex = itemLenght +
							(currItemIndex - setting.step) % itemLenght;
						slider.to(toIndex);
					},
					next: function() {
						var toIndex = (currItemIndex + setting.step) % itemLenght;
						slider.to(toIndex);
					},
					to: function(toIndex) {
						//handle the index value
						if(typeof toIndex === 'function') {
							toIndex = toIndex.call(that, concatArray(setting.imagePanels, true),
										concatArray(setting.ctrlItems, true),
											currItemIndex, step);
						}
						if(window.isNaN(toIndex)) {
							toIndex = 0;
						}
						toIndex = Math.round(+toIndex) % itemLenght;
						if(toIndex < 0) {
							toIndex = itemLenght + toIndex;
						}

						var currentPanel = setting.imagePanels.eq(currItemIndex),
						toPanel = setting.imagePanels.eq(toIndex),
						currrntCtrlItem = setting.ctrlItems.eq(currItemIndex)
						toCtrlItem = setting.ctrlItems.eq(toIndex)
						;
						if(!setting.callbacks.animate ||
								setting.callbacks.animate.call(that,
										concatArray(setting.imagePanels, true),
											concatArray(setting.ctrlItems, true),
												currItemIndex, toIndex) === true) {
							currrntCtrlItem.removeClass(setting.ctrlItemHoverCls);
							toCtrlItem.addClass(setting.ctrlItemHoverCls);

							toPanel.fadeIn(setting.animateConfig.fadeInSpeed);
							currentPanel.fadeOut(setting.animateConfig.fadeOutSpeed);
						}

						//set the current item index
						currItemIndex = toIndex;
					},
					start: function() {
						if(!started) {
							started = true;
							oInterval =
								window.setInterval(slider.next, setting.intervalTime);
						}
					},
					stop: function() {
						if(started) {
							started = false;
							window.clearInterval(oInterval);
						}
					},
					isStarted: function() {
						return started;
					}
			};
			function initData() {
				if(zsliderSetting) {
					var temp_callbacks = zsliderSetting.callbacks;

					$.extend(setting, zsliderSetting);
					$.extend(setting.callbacks, temp_callbacks);

					itemLenght = setting.imagePanels.length;
				}
				//convert to the jquery object
				setting.imagePanels = $(setting.imagePanels);
				setting.ctrlItems = $(setting.ctrlItems);
				setting.flipBtn.container = $(setting.flipBtn.container);
				setting.flipBtn.preBtn = $(setting.flipBtn.preBtn);
				setting.flipBtn.nextBtn = $(setting.flipBtn.nextBtn);
			}
			function initLook() {
				//show the first image panel and hide other
				setting.imagePanels.hide();
				setting.imagePanels.filter(':first').show();
				//activate the first control item and deactivate other
				setting.ctrlItems.removeClass(setting.ctrlItemHoverCls);
				setting.ctrlItems.filter(':first').addClass(setting.ctrlItemHoverCls);
				$(that).css('overflow', 'hidden');
				if(setting.panelHoverShowFlipBtn) {
					showFlipBtn(false);
				}
			}
			function initEvent() {
				$(concatArray(setting.imagePanels,
						setting.flipBtn.preBtn, setting.flipBtn.nextBtn, true)).hover(function() {
					if(setting.panelHoverStop) {
						slider.stop();
					}
					if(setting.panelHoverShowFlipBtn) {
						showFlipBtn(true);
					}
				}, function() {
					slider.start();
					if(setting.panelHoverShowFlipBtn) {
						showFlipBtn(false);
					}
				});
				if(setting.ctrlItemActivateType === 'click') {
					setting.ctrlItems.unbind('click');
					setting.ctrlItems.bind('click', function() {
						slider.to($(this).index());
					});
				} else {
					setting.ctrlItems.hover(function() {
						slider.stop();
						slider.to($(this).index());
					}, function() {
						slider.start();
					});
				}
				setting.flipBtn.preBtn.unbind('click');
				setting.flipBtn.preBtn.bind('click', function() {
					slider.pre();
				});
				setting.flipBtn.nextBtn.unbind('click');
				setting.flipBtn.nextBtn.bind('click', function() {
					slider.next();
				});
			}
			function init() {
				initData();

				initLook();

				initEvent();
			}

			function showFlipBtn(show) {
				var hasContainer = setting.flipBtn.container.length > 0,
					eles;
				eles = hasContainer ? setting.flipBtn.container :
					//to the dom array:
					/*ARRAY_CONCAT.call(ARRAY_SLICE.apply(setting.flipBtn.preBtn),
							ARRAY_SLICE.apply(setting.flipBtn.nextBtn));*/
					concatArray(setting.flipBtn.preBtn,
									setting.flipBtn.nextBtn, true);
				if(show) {
					$(eles).show();
				} else {
					$(eles).hide();
				}
			}

			init();
			if(arguments.length < 2 || !!autoStart){
				slider.start();
			}
			return slider;
		}
	});
})(jQuery, window, document);
