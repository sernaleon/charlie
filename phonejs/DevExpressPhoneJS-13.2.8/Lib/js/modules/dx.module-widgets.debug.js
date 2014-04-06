/*! 
* DevExpress Mobile Widgets (part of PhoneJS)
* Version: 13.2.8
* Build date: Mar 11, 2014
*
* Copyright (c) 2012 - 2014 Developer Express Inc. ALL RIGHTS RESERVED
* EULA: http://phonejs.devexpress.com/EULA
*/

"use strict";
if (!DevExpress.MOD_WIDGETS) {
    if (!window.DevExpress)
        throw Error('Required module is not referenced: core');
    /*! Module widgets, file ui.scrollable.js */
    (function($, DX, undefined) {
        var ui = DX.ui;
        var SCROLLABLE = "dxScrollable",
            SCROLLABLE_CLASS = "dx-scrollable",
            SCROLLABLE_DISABLED_CLASS = "dx-scrollable-disabled",
            SCROLLABLE_CONTAINER_CLASS = "dx-scrollable-container",
            SCROLLABLE_CONTENT_CLASS = "dx-scrollable-content",
            VERTICAL = "vertical",
            HORIZONTAL = "horizontal",
            BOTH = "both";
        ui.registerComponent(SCROLLABLE, ui.Component.inherit({
            _defaultOptions: function() {
                return $.extend(this.callBase(), {
                        scrollAction: null,
                        direction: VERTICAL,
                        showScrollbar: true,
                        useNative: true,
                        updateAction: null,
                        useSimulatedScrollBar: false,
                        useKeyboard: true,
                        inertiaEnabled: true,
                        bounceEnabled: true,
                        scrollByContent: true,
                        scrollByThumb: false,
                        startAction: null,
                        endAction: null,
                        bounceAction: null,
                        stopAction: null
                    })
            },
            _init: function() {
                this.callBase();
                this._initMarkup();
                this._attachWindowResizeCallback();
                this._attachNativeScrollbarsCustomizationCss();
                this._locked = false
            },
            _initMarkup: function() {
                var $element = this._element().addClass(SCROLLABLE_CLASS),
                    $container = this._$container = $("<div>").addClass(SCROLLABLE_CONTAINER_CLASS),
                    $content = this._$content = $("<div>").addClass(SCROLLABLE_CONTENT_CLASS);
                $content.append($element.contents()).appendTo($container);
                $container.appendTo($element)
            },
            _attachWindowResizeCallback: function() {
                var self = this;
                self._windowResizeCallback = function() {
                    self.update()
                };
                DX.utils.windowResizeCallbacks.add(self._windowResizeCallback)
            },
            _attachNativeScrollbarsCustomizationCss: function() {
                if (!(navigator.platform.indexOf('Mac') > -1 && DevExpress.browser['webkit']))
                    this._element().addClass("dx-scrollable-customizable-scrollbars")
            },
            _render: function() {
                this.callBase();
                this._renderDisabledState();
                this._renderDirection();
                this._createStrategy();
                this._createActions();
                this.update()
            },
            _renderDisabledState: function() {
                this._$element.toggleClass(SCROLLABLE_DISABLED_CLASS, this.option("disabled"))
            },
            _renderDirection: function() {
                this._element().removeClass("dx-scrollable-" + HORIZONTAL).removeClass("dx-scrollable-" + VERTICAL).removeClass("dx-scrollable-" + BOTH).addClass("dx-scrollable-" + this.option("direction"))
            },
            _createStrategy: function() {
                this._strategy = this.option("useNative") || DX.designMode ? new ui.NativeScrollableStrategy(this) : new ui.SimulatedScrollableStrategy(this);
                this._strategy.render()
            },
            _createActions: function() {
                this._strategy.createActions()
            },
            _clean: function() {
                this._strategy.dispose()
            },
            _dispose: function() {
                this._detachWindowResizeCallback();
                this.callBase()
            },
            _detachWindowResizeCallback: function() {
                DX.utils.windowResizeCallbacks.remove(this._windowResizeCallback)
            },
            _optionChanged: function(optionName) {
                switch (optionName) {
                    case"disabled":
                        this._renderDisabledState();
                        break;
                    case"startAction":
                    case"endAction":
                    case"stopAction":
                    case"updateAction":
                    case"scrollAction":
                    case"bounceAction":
                        this._createActions();
                        break;
                    case"inertiaEnabled":
                    case"bounceEnabled":
                    case"scrollByContent":
                    case"scrollByThumb":
                    case"bounceEnabled":
                    case"useNative":
                    case"useKeyboard":
                    case"direction":
                    case"showScrollbar":
                    case"useSimulatedScrollBar":
                        this._invalidate();
                        break;
                    default:
                        this.callBase.apply(this, arguments)
                }
            },
            _location: function() {
                return this._strategy.location()
            },
            _normalizeLocation: function(location) {
                var direction = this.option("direction");
                return {
                        x: $.isPlainObject(location) ? -location.x || 0 : direction !== VERTICAL ? -location : 0,
                        y: $.isPlainObject(location) ? -location.y || 0 : direction !== HORIZONTAL ? -location : 0
                    }
            },
            _isLocked: function() {
                return this._locked
            },
            _lock: function() {
                this._locked = true
            },
            _unlock: function() {
                this._locked = false
            },
            content: function() {
                return this._$content
            },
            scrollOffset: function() {
                var location = this._location();
                return {
                        top: -location.top,
                        left: -location.left
                    }
            },
            clientHeight: function() {
                return this._$container.height()
            },
            scrollHeight: function() {
                return this.content().height()
            },
            clientWidth: function() {
                return this._$container.width()
            },
            scrollWidth: function() {
                return this.content().width()
            },
            update: function() {
                this._strategy.update();
                return $.Deferred().resolve().promise()
            },
            scrollBy: function(distance) {
                distance = this._normalizeLocation(distance);
                this._strategy.scrollBy(distance)
            },
            scrollTo: function(targetLocation) {
                targetLocation = this._normalizeLocation(targetLocation);
                var location = this._location();
                this.scrollBy({
                    x: location.left - targetLocation.x,
                    y: location.top - targetLocation.y
                })
            }
        }))
    })(jQuery, DevExpress);
    /*! Module widgets, file ui.scrollbar.js */
    (function($, DX, undefined) {
        var ui = DX.ui,
            events = ui.events;
        var SCROLLBAR = "dxScrollbar",
            SCROLLABLE_SCROLLBAR_CLASS = "dx-scrollable-scrollbar",
            SCROLLABLE_SCROLL_CLASS = "dx-scrollable-scroll",
            SCROLLABLE_SCROLLBARS_HIDDEN = "dx-scrollable-scrollbars-hidden",
            VERTICAL = "vertical",
            HORIZONTAL = "horizontal",
            THUMB_MIN_SIZE = 15;
        var SCROLLBAR_VISIBLE = {
                onScroll: "onScroll",
                onHover: "onHover",
                always: "always",
                never: "never"
            };
        ui.registerComponent(SCROLLBAR, ui.Widget.inherit({
            _defaultOptions: function() {
                return $.extend(this.callBase(), {
                        direction: null,
                        visible: false,
                        activeStateEnabled: false,
                        visibilityMode: SCROLLBAR_VISIBLE.onScroll,
                        containerSize: 0,
                        contentSize: 0
                    })
            },
            _init: function() {
                this.callBase();
                this._isHovered = false
            },
            _render: function() {
                this._renderThumb();
                this.callBase();
                this._renderDirection();
                this._update()
            },
            _renderThumb: function() {
                this._$thumb = $("<div>").addClass(SCROLLABLE_SCROLL_CLASS);
                this._element().addClass(SCROLLABLE_SCROLLBAR_CLASS).append(this._$thumb)
            },
            isThumb: function($element) {
                return !!this._element().find($element).length
            },
            _isHoverMode: function() {
                return this.option("visibilityMode") === SCROLLBAR_VISIBLE.onHover
            },
            _renderDirection: function() {
                var direction = this.option("direction");
                this._element().addClass("dx-scrollbar-" + direction);
                this._dimension = direction === HORIZONTAL ? "width" : "height";
                this._prop = direction === HORIZONTAL ? "left" : "top"
            },
            cursorEnter: function() {
                this._isHovered = true;
                this.option("visible", true)
            },
            cursorLeave: function() {
                this._isHovered = false;
                this.option("visible", false)
            },
            _renderDimensions: function() {
                this._$thumb.height(this.option("height"));
                this._$thumb.width(this.option("width"))
            },
            _toggleVisibility: function(visible) {
                visible = this._adjustVisibility(visible);
                this.option().visible = visible;
                this._$thumb.toggleClass("dx-state-invisible", !visible)
            },
            _adjustVisibility: function(visible) {
                if (this.containerToContentRatio() && !this._needScrollbar())
                    return false;
                switch (this.option("visibilityMode")) {
                    case SCROLLBAR_VISIBLE.onScroll:
                        break;
                    case SCROLLBAR_VISIBLE.onHover:
                        visible = visible || !!this._isHovered;
                        break;
                    case SCROLLBAR_VISIBLE.never:
                        visible = false;
                        break;
                    case SCROLLBAR_VISIBLE.always:
                        visible = true;
                        break
                }
                return visible
            },
            moveTo: function(location) {
                if (this._isHidden())
                    return;
                if ($.isPlainObject(location))
                    location = location[this._prop] || 0;
                var scrollBarLocation = {};
                scrollBarLocation[this._prop] = this._calculateScrollBarPosition(location);
                DX.translator.move(this._$thumb, scrollBarLocation)
            },
            _calculateScrollBarPosition: function(location) {
                return -location * this._thumbRatio
            },
            _update: function() {
                var containerSize = this.option("containerSize"),
                    contentSize = this.option("contentSize");
                this._containerToContentRatio = containerSize / contentSize;
                var thumbSize = Math.round(Math.max(Math.round(containerSize * this._containerToContentRatio), THUMB_MIN_SIZE));
                this._thumbRatio = (containerSize - thumbSize) / (contentSize - containerSize);
                this.option(this._dimension, thumbSize);
                this._element().toggle(this._needScrollbar())
            },
            _isHidden: function() {
                return this.option("visibilityMode") === SCROLLBAR_VISIBLE.never
            },
            _needScrollbar: function() {
                return !this._isHidden() && this._containerToContentRatio < 1
            },
            containerToContentRatio: function() {
                return this._containerToContentRatio
            },
            _normalizeSize: function(size) {
                return $.isPlainObject(size) ? size[this._dimension] || 0 : size
            },
            _optionChanged: function(name, value) {
                if (this._isHidden())
                    return;
                switch (name) {
                    case"containerSize":
                    case"contentSize":
                        this.option()[name] = this._normalizeSize(value);
                        this._update();
                        break;
                    case"visibilityMode":
                    case"direction":
                        this._invalidate();
                        break;
                    default:
                        this.callBase.apply(this, arguments)
                }
            }
        }))
    })(jQuery, DevExpress);
    /*! Module widgets, file ui.scrollable.native.js */
    (function($, DX, undefined) {
        var ui = DX.ui,
            events = ui.events,
            devices = DX.devices,
            abs = Math.abs;
        var SCROLLABLE_NATIVE = "dxNativeScrollable",
            SCROLLABLE_NATIVE_CLASS = "dx-scrollable-native",
            SCROLLABLE_SCROLLBAR_SIMULATED = "dx-scrollable-scrollbar-simulated",
            SCROLLABLE_SCROLLBARS_HIDDEN = "dx-scrollable-scrollbars-hidden",
            VERTICAL = "vertical",
            HORIZONTAL = "horizontal",
            HIDE_SCROLLBAR_TIMOUT = 500,
            GESTURE_LOCK_KEY = "dxGesture";
        ui.NativeScrollableStrategy = DX.Class.inherit({
            ctor: function(scrollable) {
                this._init(scrollable);
                this._attachScrollHandler()
            },
            _init: function(scrollable) {
                this._component = scrollable;
                this._$element = scrollable._element();
                this._$container = scrollable._$container;
                this._$content = scrollable._$content;
                this.option = $.proxy(scrollable.option, scrollable);
                this._createActionByOption = $.proxy(scrollable._createActionByOption, scrollable);
                this._useSimulatedScrollBar = scrollable.option("useSimulatedScrollBar");
                this._direction = scrollable.option("direction");
                this._isLocked = $.proxy(scrollable._isLocked, scrollable)
            },
            _attachScrollHandler: function() {
                this._$container.on(events.addNamespace("scroll", SCROLLABLE_NATIVE), $.proxy(this._handleScroll, this))
            },
            render: function() {
                this._$element.addClass(SCROLLABLE_NATIVE_CLASS);
                this._$element.addClass(SCROLLABLE_NATIVE_CLASS + "-" + devices.real.platform);
                this._renderScrollbar()
            },
            _renderScrollbar: function() {
                this._scrollbars = {};
                this._$element.toggleClass(SCROLLABLE_SCROLLBARS_HIDDEN, !this.option("showScrollbar"));
                if (!this.option("showScrollbar"))
                    return;
                if (!this._useSimulatedScrollBar)
                    return;
                if (this._direction !== HORIZONTAL) {
                    var $scrollbarVertical = $("<div>").dxScrollbar({
                            direction: VERTICAL,
                            disable: this._useSimulatedScrollBar
                        }).appendTo(this._$element);
                    this._scrollbars[VERTICAL] = $scrollbarVertical.dxScrollbar("instance")
                }
                if (this._direction !== VERTICAL) {
                    var $scrollbarHorizontal = $("<div>").dxScrollbar({
                            direction: HORIZONTAL,
                            disable: this._useSimulatedScrollBar
                        }).appendTo(this._$element);
                    this._scrollbars[VERTICAL] = $scrollbarHorizontal.dxScrollbar("instance")
                }
                this._hideScrollbarTimeout = 0;
                this._$element.addClass(SCROLLABLE_SCROLLBAR_SIMULATED)
            },
            createActions: function() {
                var actionConfig = {excludeValidators: ["gesture"]};
                this._scrollAction = this._createActionByOption("scrollAction", actionConfig);
                this._updateAction = this._createActionByOption("updateAction", actionConfig)
            },
            _createActionArgs: function() {
                var location = this.location();
                return {
                        jQueryEvent: eventForUserAction,
                        scrollOffset: {
                            top: -location.top,
                            left: -location.left
                        },
                        reachedLeft: this._direction !== VERTICAL ? location.left >= 0 : undefined,
                        reachedRight: this._direction !== VERTICAL ? location.left <= this._containerSize.width - this._contentSize.width : undefined,
                        reachedTop: this._direction !== HORIZONTAL ? location.top >= 0 : undefined,
                        reachedBottom: this._direction !== HORIZONTAL ? location.top <= this._containerSize.height - this._contentSize.height : undefined
                    }
            },
            dispose: function() {
                if (this === activeScrollable)
                    activeScrollable = null;
                this._$element.removeClass(function(index, className) {
                    var nativeClass = className.match(new RegExp(SCROLLABLE_NATIVE_CLASS + "\\S*", "g"));
                    if (nativeClass.length)
                        return nativeClass.join(" ")
                });
                this._$container.off(events.addNamespace("scroll", SCROLLABLE_NATIVE));
                this._removeScrollbars();
                clearTimeout(this._gestureEndTimer)
            },
            _removeScrollbars: function() {
                $.each(this._scrollbars, function() {
                    this._element().remove()
                })
            },
            _handleScroll: function(e) {
                if (!this._isScrollLocationChanged()) {
                    e.stopImmediatePropagation();
                    return
                }
                eventForUserAction = e;
                this._moveScrollbars();
                this._scrollAction(this._createActionArgs());
                this._treatNativeGesture();
                this._lastLocation = this.location()
            },
            _isScrollLocationChanged: function() {
                var currentLocation = this.location(),
                    lastLocation = this._lastLocation || {},
                    isTopChanged = lastLocation.top !== currentLocation.top,
                    isLeftChanged = lastLocation.left !== currentLocation.left;
                return isTopChanged || isLeftChanged
            },
            _moveScrollbars: function() {
                var self = this;
                $.each(self._scrollbars, function() {
                    this.moveTo(self.location());
                    this.option("visible", true)
                });
                this._hideScrollbars()
            },
            _hideScrollbars: function() {
                var self = this;
                clearTimeout(self._hideScrollbarTimeout);
                self._hideScrollbarTimeout = setTimeout(function() {
                    $.each(self._scrollbars, function() {
                        this.option("visible", false)
                    })
                }, HIDE_SCROLLBAR_TIMOUT)
            },
            _treatNativeGesture: function() {
                this._prepareGesture();
                this._forgetGesture()
            },
            _prepareGesture: function() {
                if (this._gestureEndTimer) {
                    clearTimeout(this._gestureEndTimer);
                    this._gestureEndTimer = null
                }
                else
                    this._$element.data(GESTURE_LOCK_KEY, true);
                ui.feedback.reset()
            },
            _forgetGesture: function() {
                this._gestureEndTimer = setTimeout($.proxy(function() {
                    this._$element.data(GESTURE_LOCK_KEY, false);
                    this._gestureEndTimer = null
                }, this), 400)
            },
            location: function() {
                return {
                        left: -this._$container.scrollLeft(),
                        top: -this._$container.scrollTop()
                    }
            },
            update: function() {
                this._updateDimensions();
                this._updateAction(this._createActionArgs());
                this._updateScrollbars()
            },
            _updateDimensions: function() {
                this._containerSize = {
                    height: this._$container.height(),
                    width: this._$container.width()
                };
                this._contentSize = {
                    height: this._component.content().height(),
                    width: this._component.content().width()
                }
            },
            _updateScrollbars: function() {
                if (!this._useSimulatedScrollBar)
                    return;
                var self = this,
                    containerSize = this._containerSize,
                    contentSize = this._contentSize;
                $.each(self._scrollbars, function() {
                    this.option({
                        containerSize: containerSize,
                        contentSize: contentSize
                    })
                })
            },
            _handleStart: $.noop,
            _handleMove: $.noop,
            _handleEnd: $.noop,
            scrollBy: function(distance) {
                var location = this.location();
                this._$container.scrollTop(-location.top - distance.y);
                this._$container.scrollLeft(-location.left - distance.x)
            }
        });
        var STAGE_SLEEP = 0,
            STAGE_TOUCHED = 1,
            STAGE_SCROLLING = 2;
        var activeScrollable,
            scrollStage = STAGE_SLEEP,
            parentsLength,
            eventForUserAction,
            startEventData = null;
        var GESTURE_LOCK_DISTANCE = 10;
        var closestScrollable = function(element) {
                var $closestScrollable = $(element).closest("." + SCROLLABLE_NATIVE_CLASS);
                if (!$closestScrollable.length)
                    return;
                var components = $closestScrollable.data("dxComponents"),
                    scrollable;
                $.each(components, function(index, componentName) {
                    var componentClass = ui[componentName];
                    if (componentClass === ui.dxScrollable || componentClass.subclassOf(ui.dxScrollable)) {
                        scrollable = $closestScrollable.data(componentName);
                        return false
                    }
                });
                return scrollable && scrollable.option("disabled") ? closestScrollable($closestScrollable.parent()) : scrollable._strategy
            };
        var reset = function() {
                scrollStage = STAGE_SLEEP;
                activeScrollable = null
            };
        var preventHangingCursorAndHideKeyboard = function(e) {
                if (devices.real.platform !== "ios")
                    return;
                if ($(":focus", activeScrollable._$element).length)
                    DX.utils.resetActiveElement()
            };
        var handleStart = function(e) {
                if (events.needSkipEvent(e))
                    return;
                activeScrollable = closestScrollable(e.target);
                if (activeScrollable) {
                    parentsLength = activeScrollable._$element.parents().length;
                    scrollStage = STAGE_TOUCHED;
                    activeScrollable._handleStart(e);
                    startEventData = events.eventData(e)
                }
            };
        var handleBodyPointerMove = function(e) {
                if (activeScrollable && scrollStage == STAGE_TOUCHED && e.originalEvent) {
                    var pointerMoveData = e.originalEvent.pointerMoveData || {},
                        direction = activeScrollable.option("direction"),
                        directionValue = pointerMoveData[direction];
                    if (directionValue && directionValue > parentsLength) {
                        handleEnd();
                        return
                    }
                    pointerMoveData[direction] = parentsLength;
                    e.originalEvent.pointerMoveData = pointerMoveData
                }
            };
        var handleMove = function(e) {
                if (activeScrollable) {
                    var pointerMoveData = e.originalEvent.pointerMoveData,
                        direction = activeScrollable.option("direction");
                    if (pointerMoveData && pointerMoveData[direction] !== parentsLength)
                        return;
                    e.originalEvent.isScrollingEvent = true;
                    if (activeScrollable._isLocked()) {
                        e.preventDefault();
                        return
                    }
                    if (scrollStage == STAGE_TOUCHED) {
                        preventHangingCursorAndHideKeyboard(e);
                        scrollStage = STAGE_SCROLLING
                    }
                    activeScrollable._handleMove(e);
                    if (startEventData) {
                        var delta = events.eventDelta(startEventData, events.eventData(e));
                        if (abs(delta.x) > GESTURE_LOCK_DISTANCE || abs(delta.y) > GESTURE_LOCK_DISTANCE) {
                            activeScrollable._prepareGesture();
                            startEventData = null
                        }
                    }
                }
            };
        var handleEnd = function(e) {
                if (activeScrollable) {
                    activeScrollable._handleEnd(e);
                    activeScrollable._forgetGesture();
                    reset()
                }
            };
        $(function() {
            var actionArguments = {
                    context: ui.dxScrollable,
                    excludeValidators: ["gesture", "designMode"]
                },
                startAction = new DX.Action(handleStart, actionArguments),
                scrollAction = new DX.Action(handleMove, actionArguments),
                endAction = new DX.Action(handleEnd, actionArguments),
                bodyMoveAction = new DX.Action(handleBodyPointerMove, actionArguments);
            $("body").on(events.addNamespace("dxpointermove", SCROLLABLE_NATIVE), function(e) {
                bodyMoveAction.execute(e)
            });
            $(document).on(events.addNamespace("dxpointerdown", SCROLLABLE_NATIVE), function(e) {
                startAction.execute(e)
            }).on(events.addNamespace("dxpointermove", SCROLLABLE_NATIVE), function(e) {
                scrollAction.execute(e)
            }).on(events.addNamespace("dxpointerup dxpointercancel", SCROLLABLE_NATIVE), function(e) {
                endAction.execute(e)
            })
        })
    })(jQuery, DevExpress);
    /*! Module widgets, file ui.scrollable.simulated.js */
    (function($, DX, undefined) {
        var ui = DX.ui,
            events = ui.events,
            math = Math;
        var SCROLLABLE_SIMULATED = "dxSimulatedScrollable",
            SCROLLABLE_SIMULATED_CLASS = "dx-scrollable-simulated",
            SCROLLBAR = "dxScrollbar",
            SCROLLABLE_SCROLLBAR_CLASS = "dx-scrollable-scrollbar",
            SCROLLABLE_SCROLL_CLASS = "dx-scrollable-scroll",
            SCROLLABLE_SCROLLBARS_HIDDEN = "dx-scrollable-scrollbars-hidden",
            VERTICAL = "vertical",
            HORIZONTAL = "horizontal",
            ACCELERATION = 0.92,
            OUT_BOUNDS_ACCELERATION = 0.5,
            BOUNCE_DURATION = 400,
            MIN_VELOCITY_LIMIT = 1,
            SCROLL_LINE_HEIGHT = 20,
            MIN_BOUNCE_VELOCITY_LIMIT = MIN_VELOCITY_LIMIT / 5,
            FRAME_DURATION = math.round(1000 / 60),
            BOUNCE_FRAMES = BOUNCE_DURATION / FRAME_DURATION,
            BOUNCE_ACCELERATION_SUM = (1 - math.pow(ACCELERATION, BOUNCE_FRAMES)) / (1 - ACCELERATION),
            ELASTIC = OUT_BOUNDS_ACCELERATION,
            GESTURE_LOCK_KEY = "dxGesture";
        var KEY_CODES = {
                PAGE_UP: 33,
                PAGE_DOWN: 34,
                END: 35,
                HOME: 36,
                LEFT: 37,
                UP: 38,
                RIGHT: 39,
                DOWN: 40
            };
        var InertiaAnimator = DX.Animator.inherit({
                ctor: function(scroller) {
                    this.callBase();
                    this.scroller = scroller
                },
                VELOCITY_LIMIT: MIN_VELOCITY_LIMIT,
                _isFinished: function() {
                    return math.abs(this.scroller._velocity) <= this.VELOCITY_LIMIT
                },
                _step: function() {
                    this.scroller._scrollStep(this.scroller._velocity);
                    this.scroller._velocity *= this._acceleration()
                },
                _acceleration: function() {
                    return this.scroller._inBounds() ? ACCELERATION : OUT_BOUNDS_ACCELERATION
                },
                _complete: function() {
                    this.scroller._scrollComplete()
                },
                _stop: function() {
                    this.scroller._handleStop()
                }
            });
        var BounceAnimator = InertiaAnimator.inherit({
                VELOCITY_LIMIT: MIN_BOUNCE_VELOCITY_LIMIT,
                _isFinished: function() {
                    return this.scroller._crossBoundOnNextStep() || this.callBase()
                },
                _acceleration: function() {
                    return ACCELERATION
                },
                _complete: function() {
                    this.scroller._move(this.scroller._bounceLocation);
                    this.callBase()
                }
            });
        var Scroller = ui.Scroller = DX.Class.inherit({
                ctor: function(options) {
                    this._initOptions(options);
                    this._initAnimators();
                    this._initScrollbar();
                    this._initCallbacks();
                    this._topReached = false;
                    this._bottomReached = false
                },
                _initOptions: function(options) {
                    var self = this;
                    this._location = 0;
                    this._axis = options.direction === HORIZONTAL ? "x" : "y";
                    this._prop = options.direction === HORIZONTAL ? "left" : "top";
                    this._dimension = options.direction === HORIZONTAL ? "width" : "height";
                    this._scrollProp = options.direction === HORIZONTAL ? "scrollLeft" : "scrollTop";
                    $.each(options, function(optionName, optionValue) {
                        self["_" + optionName] = optionValue
                    })
                },
                _initAnimators: function() {
                    this._inertiaAnimator = new InertiaAnimator(this);
                    this._bounceAnimator = new BounceAnimator(this)
                },
                _initScrollbar: function() {
                    this._$scrollbar = $("<div>").dxScrollbar({
                        direction: this._direction,
                        visible: this._scrollByThumb,
                        visibilityMode: this._visibilityModeNormalize(this._scrollbarVisible),
                        containerSize: this._containerSize(),
                        contentSize: this._contentSize()
                    }).appendTo(this._$container);
                    this._scrollbar = this._$scrollbar.dxScrollbar("instance")
                },
                _visibilityModeNormalize: function(mode) {
                    return mode === true ? "onScroll" : mode === false ? "never" : mode
                },
                _initCallbacks: function() {
                    this.topBouncedCallbacks = $.Callbacks();
                    this.bottomBouncedCallbacks = $.Callbacks()
                },
                _scrollStep: function(delta) {
                    var prevLocation = this._location;
                    this._location = this._location + delta;
                    this._suppressBounce();
                    this._move();
                    this._scrollAction();
                    if (prevLocation !== this._location)
                        this._$element.triggerHandler("scroll")
                },
                _move: function(location) {
                    this._location = location !== undefined ? location : this._location;
                    this._moveContent();
                    this._moveScrollbar()
                },
                _moveContent: function() {
                    var targetLocation = {};
                    targetLocation[this._prop] = this._location;
                    DX.translator.move(this._$content, targetLocation)
                },
                _moveScrollbar: function() {
                    this._scrollbar.moveTo(this._calculateScrollBarPosition())
                },
                _calculateScrollBarPosition: function() {
                    return this._location
                },
                _suppressBounce: function() {
                    if (this._bounceEnabled || this._inBounds(this._location))
                        return;
                    this._velocity = 0;
                    this._location = this._boundLocation()
                },
                _boundLocation: function() {
                    var location = this._location;
                    if (location > this._maxOffset)
                        location = this._maxOffset;
                    else if (location < this._minOffset)
                        location = this._minOffset;
                    return location
                },
                _scrollComplete: function() {
                    if (this._inBounds()) {
                        this._hideScrollbar();
                        this._roundLocation();
                        if (this._completeDeferred)
                            this._completeDeferred.resolve()
                    }
                    this._scrollToBounds()
                },
                _roundLocation: function() {
                    this._location = math.round(this._location);
                    this._move()
                },
                _scrollToBounds: function() {
                    if (this._inBounds())
                        return;
                    this._bounceAction();
                    this._setupBounce();
                    this._bounceAnimator.start()
                },
                _setupBounce: function() {
                    var boundLocation = this._bounceLocation = this._boundLocation(),
                        bounceDistance = boundLocation - this._location;
                    this._velocity = bounceDistance / BOUNCE_ACCELERATION_SUM
                },
                _inBounds: function(location) {
                    location = location !== undefined ? location : this._location;
                    return location >= this._minOffset && location <= this._maxOffset
                },
                _crossBoundOnNextStep: function() {
                    var location = this._location,
                        nextLocation = location + this._velocity;
                    return location < this._minOffset && nextLocation >= this._minOffset || location > this._maxOffset && nextLocation <= this._maxOffset
                },
                _handleStart: function($target) {
                    this._stopDeferred = $.Deferred();
                    this._stopScrolling();
                    this._thumbScrolling = this._isThumb($target);
                    this._update();
                    return this._stopDeferred.promise()
                },
                _stopScrolling: function() {
                    this._hideScrollbar();
                    this._inertiaAnimator.stop();
                    this._bounceAnimator.stop()
                },
                _handleStop: function() {
                    if (this._stopDeferred)
                        this._stopDeferred.resolve()
                },
                _handleFirstMove: function() {
                    this._showScrollbar()
                },
                _handleMove: function(delta) {
                    delta = delta[this._axis];
                    if (this._thumbScrolling)
                        delta = -delta / this._containerToContentRatio();
                    if (!this._inBounds())
                        delta *= ELASTIC;
                    this._scrollStep(delta)
                },
                _containerToContentRatio: function() {
                    return this._scrollbar.containerToContentRatio()
                },
                _handleMoveEnd: function(velocity) {
                    this._completeDeferred = $.Deferred();
                    this._velocity = velocity[this._axis];
                    this._suppressVelocity();
                    this._handleInertia();
                    return this._completeDeferred.promise()
                },
                _suppressVelocity: function() {
                    if (!this._inertiaEnabled || this._thumbScrolling)
                        this._velocity = 0
                },
                _handleTapEnd: function() {
                    this._scrollToBounds()
                },
                _handleInertia: function() {
                    this._inertiaAnimator.start()
                },
                _handleDispose: function() {
                    this._$scrollbar.remove();
                    this._stopScrolling()
                },
                _handleUpdate: function() {
                    this._update();
                    this._moveToBounds()
                },
                _update: function() {
                    this._stopScrolling();
                    this._updateLocation();
                    this._updateBounds();
                    this._updateScrollbar();
                    this._moveScrollbar()
                },
                _updateLocation: function() {
                    this._location = DX.translator.locate(this._$content)[this._prop]
                },
                _updateBounds: function() {
                    this._maxOffset = 0;
                    this._minOffset = math.min(this._containerSize() - this._contentSize(), 0)
                },
                _updateScrollbar: function() {
                    this._scrollbar.option({
                        containerSize: this._containerSize(),
                        contentSize: this._contentSize()
                    })
                },
                _moveToBounds: function() {
                    this._location = this._boundLocation();
                    this._move()
                },
                _handleCreateActions: function(actions) {
                    this._scrollAction = actions.scrollAction;
                    this._bounceAction = actions.bounceAction
                },
                _showScrollbar: function() {
                    this._scrollbar.option("visible", true)
                },
                _hideScrollbar: function() {
                    this._scrollbar.option("visible", false)
                },
                _containerSize: function() {
                    return this._$container[this._dimension]()
                },
                _contentSize: function() {
                    return this._$content[this._dimension]()
                },
                _validateEvent: function(e) {
                    var $target = $(e.target);
                    return this._isThumb($target) || this._isContent($target)
                },
                _isContent: function($element) {
                    return this._scrollByContent && !!$element.closest(this._$element).length
                },
                _isThumb: function($element) {
                    return this._scrollByThumb && this._scrollbar.isThumb($element)
                },
                _validateDirection: function(deltaEventData) {
                    return math.abs(deltaEventData[this._axis]) >= math.abs(deltaEventData[this._axis === "x" ? "y" : "x"])
                },
                _reachedMin: function() {
                    return this._location <= this._minOffset
                },
                _reachedMax: function() {
                    return this._location >= this._maxOffset
                },
                _handleCursorEnter: function() {
                    this._scrollbar.cursorEnter()
                },
                _handleCursorLeave: function() {
                    this._scrollbar.cursorLeave()
                }
            });
        ui.SimulatedScrollableStrategy = DX.Class.inherit({
            ctor: function(scrollable) {
                this._init(scrollable);
                this._attachEventHandlers()
            },
            _init: function(scrollable) {
                this._component = scrollable;
                this._$element = scrollable._element();
                this._$container = scrollable._$container.prop("tabindex", 0);
                this._$content = scrollable._$content;
                this.option = $.proxy(scrollable.option, scrollable);
                this._createActionByOption = $.proxy(scrollable._createActionByOption, scrollable);
                this._isLocked = $.proxy(scrollable._isLocked, scrollable)
            },
            _attachEventHandlers: function() {
                this._$container.on(events.addNamespace("scroll", SCROLLABLE_SIMULATED), $.proxy(this._handleScroll, this)).on(events.addNamespace("mouseenter", SCROLLABLE_SIMULATED), $.proxy(this._handleCursorEnter, this)).on(events.addNamespace("mouseleave", SCROLLABLE_SIMULATED), $.proxy(this._handleCursorLeave, this))
            },
            _handleScroll: function(e) {
                var distance = {
                        x: this._$container.scrollLeft(),
                        y: this._$container.scrollTop()
                    };
                this._$container.scrollLeft(-distance.x);
                this._$container.scrollTop(-distance.y);
                this.scrollBy(distance)
            },
            render: function() {
                this._$element.addClass(SCROLLABLE_SIMULATED_CLASS);
                this._createScrollers();
                this._renderKeyboardHandler()
            },
            _createScrollers: function() {
                var direction = this.option("direction");
                this._scrollers = {};
                if (direction !== VERTICAL)
                    this._createScroller(HORIZONTAL);
                if (direction !== HORIZONTAL)
                    this._createScroller(VERTICAL);
                this._$element.toggleClass(SCROLLABLE_SCROLLBARS_HIDDEN, !this.option("showScrollbar"))
            },
            _createScroller: function(direction) {
                this._scrollers[direction] = new Scroller(this._scrollerOptions(direction))
            },
            _scrollerOptions: function(direction) {
                return {
                        direction: direction,
                        $content: this._$content,
                        $container: this._$container,
                        $element: this._$element,
                        scrollByContent: this.option("scrollByContent"),
                        scrollByThumb: this.option("scrollByThumb"),
                        scrollbarVisible: this.option("showScrollbar"),
                        bounceEnabled: this.option("bounceEnabled"),
                        inertiaEnabled: this.option("inertiaEnabled")
                    }
            },
            _renderKeyboardHandler: function() {
                if (this.option("useKeyboard"))
                    this._$container.on(events.addNamespace("keydown", SCROLLABLE_SIMULATED), $.proxy(this._handleKeyDown, this));
                else
                    this._$container.off(events.addNamespace("keydown", SCROLLABLE_SIMULATED), this._handleKeyDown)
            },
            _handleKeyDown: function(e) {
                var handled = true;
                switch (e.keyCode) {
                    case KEY_CODES.DOWN:
                        this._scrollByLine({y: 1});
                        break;
                    case KEY_CODES.UP:
                        this._scrollByLine({y: -1});
                        break;
                    case KEY_CODES.RIGHT:
                        this._scrollByLine({x: 1});
                        break;
                    case KEY_CODES.LEFT:
                        this._scrollByLine({x: -1});
                        break;
                    case KEY_CODES.PAGE_DOWN:
                        this._scrollByPage(1);
                        break;
                    case KEY_CODES.PAGE_UP:
                        this._scrollByPage(-1);
                        break;
                    case KEY_CODES.HOME:
                        this._scrollToHome();
                        break;
                    case KEY_CODES.END:
                        this._scrollToEnd();
                        break;
                    default:
                        handled = false;
                        break
                }
                if (handled) {
                    e.stopPropagation();
                    e.preventDefault()
                }
            },
            _scrollByLine: function(lines) {
                this.scrollBy({
                    y: (lines.y || 0) * -SCROLL_LINE_HEIGHT,
                    x: (lines.x || 0) * -SCROLL_LINE_HEIGHT
                })
            },
            _scrollByPage: function(page) {
                var axis = this._wheelAxis(),
                    dimension = this._dimensionByAxis(axis);
                var distance = {};
                distance[axis] = page * -this._$container[dimension]();
                this.scrollBy(distance)
            },
            _dimensionByAxis: function(axis) {
                return axis === "x" ? "width" : "height"
            },
            _scrollToHome: function() {
                var axis = this._wheelAxis().toLowerCase();
                var distance = {};
                distance[axis] = 0;
                this._component.scrollTo(distance)
            },
            _scrollToEnd: function() {
                var axis = this._wheelAxis(),
                    dimension = this._dimensionByAxis(axis);
                var distance = {};
                distance[axis] = this._$content[dimension]() - this._$container[dimension]();
                this._component.scrollTo(distance)
            },
            createActions: function() {
                this._startAction = this._createActionHandler("startAction");
                this._stopAction = this._createActionHandler("stopAction");
                this._endAction = this._createActionHandler("endAction");
                this._updateAction = this._createActionHandler("updateAction");
                this._createScrollerActions()
            },
            _createScrollerActions: function() {
                this._handleEvent("CreateActions", {
                    scrollAction: this._createActionHandler("scrollAction"),
                    bounceAction: this._createActionHandler("bounceAction")
                })
            },
            _createActionHandler: function(optionName) {
                var self = this,
                    actionHandler = self._createActionByOption(optionName, {excludeValidators: ["gesture"]});
                return function() {
                        actionHandler($.extend(self._createActionArgs(), arguments))
                    }
            },
            _createActionArgs: function() {
                var scrollerX = this._scrollers[HORIZONTAL],
                    scrollerY = this._scrollers[VERTICAL];
                return {
                        jQueryEvent: eventForUserAction,
                        scrollOffset: {
                            top: scrollerY && -scrollerY._location,
                            left: scrollerX && -scrollerX._location
                        },
                        reachedLeft: scrollerX && scrollerX._reachedMax(),
                        reachedRight: scrollerX && scrollerX._reachedMin(),
                        reachedTop: scrollerY && scrollerY._reachedMax(),
                        reachedBottom: scrollerY && scrollerY._reachedMin()
                    }
            },
            dispose: function() {
                if (this === activeScrollable)
                    reset();
                this._handleEvent("Dispose");
                this._detachScrollHandler();
                this._$element.removeClass(SCROLLABLE_SIMULATED_CLASS);
                clearTimeout(this._gestureEndTimer)
            },
            _detachScrollHandler: function() {
                $(this._$container).off("." + SCROLLABLE_SIMULATED)
            },
            _handleEvent: function(eventName) {
                var args = $.makeArray(arguments).slice(1),
                    deferreds = $.map(this._scrollers, function(scroller) {
                        return scroller["_handle" + eventName].apply(scroller, args)
                    });
                return $.when.apply($, deferreds).promise()
            },
            _handleStart: function($target) {
                this._handleEvent("Start", $target).done($.proxy(this._forgetGesture, this)).done(this._stopAction)
            },
            _handleFirstMove: function() {
                this._$content.css("user-select", "none");
                return this._handleEvent("FirstMove").done(this._startAction)
            },
            _prepareGesture: function() {
                clearTimeout(this._gestureEndTimer);
                this._$element.data(GESTURE_LOCK_KEY, true);
                ui.feedback.reset()
            },
            _handleMove: function(delta) {
                this._adjustDistance(delta);
                this._handleEvent("Move", delta)
            },
            _handleMoveEnd: function(velocity) {
                this._$content.css("user-select", this._userSelectDefaultValue);
                this._adjustDistance(velocity);
                return this._handleEvent("MoveEnd", velocity).done(this._endAction)
            },
            _adjustDistance: function(distance) {
                distance.x *= this._allowedDirections[HORIZONTAL];
                distance.y *= this._allowedDirections[VERTICAL]
            },
            _forgetGesture: function() {
                this._gestureEndTimer = setTimeout($.proxy(function() {
                    this._$element.data(GESTURE_LOCK_KEY, false)
                }, this), 400)
            },
            _handleTapEnd: function() {
                this._handleEvent("TapEnd")
            },
            location: function() {
                return DX.translator.locate(this._$content)
            },
            _validateEvent: function(e) {
                if (this.option("disabled"))
                    return false;
                if (e.type === "dxmousewheel") {
                    this._prepareDirections(true);
                    return true
                }
                this._prepareDirections();
                var allowedDirections = this._allowedDirections;
                var result = false;
                $.each(this._scrollers, function(direction) {
                    var isValid = this._validateEvent(e);
                    allowedDirections[direction] = isValid;
                    result = result || isValid
                });
                return result
            },
            _prepareDirections: function(value) {
                value = value || false;
                this._allowedDirections = {};
                this._allowedDirections[HORIZONTAL] = value;
                this._allowedDirections[VERTICAL] = value
            },
            _validateDirection: function(deltaEventData) {
                var result = false;
                $.each(this._scrollers, function() {
                    result = result || this._validateDirection(deltaEventData)
                });
                return result
            },
            _handleCursorEnter: function(e) {
                e.originalEvent = e.originalEvent || {};
                if (scrollStage !== STAGE_SLEEP || e.originalEvent._hoverHandled)
                    return;
                if (hoveredScrollable)
                    hoveredScrollable._handleCursorLeave();
                hoveredScrollable = this;
                this._handleEvent("CursorEnter");
                e.originalEvent._hoverHandled = true
            },
            _handleCursorLeave: function() {
                if (activeScrollable === hoveredScrollable)
                    return;
                if (hoveredScrollable === this) {
                    this._handleEvent("CursorLeave");
                    hoveredScrollable = null
                }
            },
            _wheelAxis: function() {
                switch (this.option("direction")) {
                    case HORIZONTAL:
                        return "x";
                    case VERTICAL:
                        return "y";
                    default:
                        return this._scrollers[VERTICAL]._containerToContentRatio() >= 1 ? "x" : "y"
                }
            },
            _prepareWheelEvent: function(e) {
                var axis = this._wheelAxis(),
                    direction = this._directionByAxis(axis),
                    prop = "page" + axis.toUpperCase();
                if (this._scrollers[direction]._containerToContentRatio() < 1) {
                    e[prop] += e.delta;
                    e.preventDefault()
                }
            },
            _directionByAxis: function(axis) {
                return axis === "x" ? HORIZONTAL : VERTICAL
            },
            update: function() {
                this._userSelectDefaultValue = this._$content.css("user-select");
                return this._handleEvent("Update").done(this._updateAction)
            },
            scrollBy: function(distance) {
                this._prepareDirections(true);
                this._handleFirstMove();
                this._handleMove(distance);
                this._handleMoveEnd({
                    x: 0,
                    y: 0
                })
            }
        });
        var hoveredScrollable;
        var STAGE_SLEEP = 0,
            STAGE_TOUCHED = 1,
            STAGE_SCROLLING = 2;
        var INTERTIA_TIMEOUT = 100,
            VELOCITY_CALC_TIMEOUT = 200;
        var activeScrollable,
            parentsLength,
            scrollStage = STAGE_SLEEP,
            prevEventData,
            savedEventData,
            eventForUserAction,
            startEventData = null;
        var GESTURE_LOCK_DISTANCE = 10;
        var closestScrollable = function(element) {
                var $closestScrollable = $(element).closest("." + SCROLLABLE_SIMULATED_CLASS);
                if (!$closestScrollable.length)
                    return;
                var components = $closestScrollable.data("dxComponents"),
                    scrollable;
                $.each(components, function(index, componentName) {
                    var componentClass = ui[componentName];
                    if (componentClass === ui.dxScrollable || componentClass.subclassOf(ui.dxScrollable)) {
                        scrollable = $closestScrollable.data(componentName);
                        return false
                    }
                });
                return scrollable && scrollable.option("disabled") ? closestScrollable($closestScrollable.parent()) : scrollable._strategy
            };
        var reset = function() {
                scrollStage = STAGE_SLEEP;
                activeScrollable = null
            };
        var preventHangingCursorAndHideKeyboard = function() {
                DX.utils.resetActiveElement()
            };
        var preventSelectStartEvent = function(e) {
                e.preventDefault()
            };
        var handleStart = function(e) {
                if (events.needSkipEvent(e))
                    return;
                activeScrollable = closestScrollable(e.target);
                if (activeScrollable && activeScrollable._validateEvent(e)) {
                    parentsLength = activeScrollable._$element.parents().length;
                    eventForUserAction = e;
                    startEventData = prevEventData = savedEventData = events.eventData(e);
                    scrollStage = STAGE_TOUCHED;
                    activeScrollable._handleStart($(e.target))
                }
            };
        var handleScroll = function(e) {
                if (!activeScrollable)
                    return;
                if (e.originalEvent) {
                    var pointerMoveData = e.originalEvent.pointerMoveData,
                        direction = activeScrollable.option("direction");
                    if (pointerMoveData && pointerMoveData[direction] !== parentsLength) {
                        reset();
                        return
                    }
                }
                eventForUserAction = e;
                if (scrollStage === STAGE_SLEEP)
                    return;
                var currentEventData = events.eventData(e),
                    deltaEventData = events.eventDelta(prevEventData, currentEventData);
                if (scrollStage === STAGE_TOUCHED)
                    handleFirstMove(deltaEventData);
                if (scrollStage === STAGE_SCROLLING)
                    handleMove(currentEventData, deltaEventData)
            };
        var handleFirstMove = function(deltaEventData) {
                if (!activeScrollable._validateDirection(deltaEventData)) {
                    reset();
                    return
                }
                if ($(":focus", activeScrollable._$content).length)
                    preventHangingCursorAndHideKeyboard();
                activeScrollable._handleFirstMove();
                scrollStage = STAGE_SCROLLING
            };
        var handleBodyPointerMove = function(e) {
                if (scrollStage === STAGE_TOUCHED && e.originalEvent) {
                    var pointerMoveData = e.originalEvent.pointerMoveData || {},
                        direction = activeScrollable.option("direction"),
                        directionValue = pointerMoveData[direction];
                    if (directionValue && directionValue > parentsLength)
                        return;
                    pointerMoveData[direction] = parentsLength;
                    e.originalEvent.pointerMoveData = pointerMoveData
                }
            };
        var handleMove = function(currentEventData, deltaEventData) {
                if (activeScrollable._isLocked()) {
                    reset();
                    return
                }
                if (events.eventDelta(savedEventData, prevEventData).time > VELOCITY_CALC_TIMEOUT)
                    savedEventData = prevEventData;
                prevEventData = currentEventData;
                if (startEventData) {
                    var delta = events.eventDelta(startEventData, currentEventData);
                    if (math.abs(delta.x) > GESTURE_LOCK_DISTANCE || math.abs(delta.y) > GESTURE_LOCK_DISTANCE) {
                        activeScrollable._prepareGesture();
                        startEventData = null
                    }
                }
                activeScrollable._handleMove(deltaEventData)
            };
        var handleEnd = function(e) {
                if (!activeScrollable)
                    return;
                eventForUserAction = e;
                if (scrollStage === STAGE_SCROLLING) {
                    var endEventData = events.eventData(e),
                        deltaEndEventData = events.eventDelta(prevEventData, endEventData),
                        velocity = {
                            x: 0,
                            y: 0
                        };
                    if (deltaEndEventData.time < INTERTIA_TIMEOUT) {
                        var deltaSavedEventData = events.eventDelta(savedEventData, prevEventData);
                        velocity = {
                            x: deltaSavedEventData.x * FRAME_DURATION / deltaSavedEventData.time,
                            y: deltaSavedEventData.y * FRAME_DURATION / deltaSavedEventData.time
                        }
                    }
                    activeScrollable._handleMoveEnd(velocity).done($.proxy(activeScrollable._forgetGesture, activeScrollable))
                }
                else if (scrollStage === STAGE_TOUCHED)
                    activeScrollable._handleTapEnd();
                reset()
            };
        var handleWheel = function(e) {
                handleStart(e);
                if (scrollStage !== STAGE_TOUCHED)
                    return;
                activeScrollable._prepareWheelEvent(e);
                handleScroll(e);
                handleEnd(e)
            };
        $(function() {
            var actionArguments = {
                    context: ui.dxScrollable,
                    excludeValidators: ["gesture"]
                },
                startAction = new DX.Action(handleStart, actionArguments),
                scrollAction = new DX.Action(handleScroll, actionArguments),
                endAction = new DX.Action(handleEnd, actionArguments),
                bodyMoveAction = new DX.Action(handleBodyPointerMove, actionArguments),
                wheelAction = new DX.Action(handleWheel, actionArguments);
            $("body").on(events.addNamespace("dxpointermove", SCROLLABLE_SIMULATED), function(e) {
                bodyMoveAction.execute(e)
            });
            $(document).on(events.addNamespace("dxpointerdown", SCROLLABLE_SIMULATED), function(e) {
                startAction.execute(e)
            }).on(events.addNamespace("dxpointermove", SCROLLABLE_SIMULATED), function(e) {
                scrollAction.execute(e)
            }).on(events.addNamespace("dxpointerup dxpointercancel", SCROLLABLE_SIMULATED), function(e) {
                endAction.execute(e)
            }).on(events.addNamespace("dxmousewheel", SCROLLABLE_SIMULATED), function(e) {
                wheelAction.execute(e)
            })
        })
    })(jQuery, DevExpress);
    /*! Module widgets, file ui.scrollView.js */
    (function($, DX, undefined) {
        var ui = DX.ui;
        var SCROLLVIEW_CLASS = "dx-scrollview",
            SCROLLVIEW_CONTENT_CLASS = "dx-scrollview-content",
            SCROLLVIEW_TOP_POCKET_CLASS = "dx-scrollview-top-pocket",
            SCROLLVIEW_BOTTOM_POCKET_CLASS = "dx-scrollview-bottom-pocket",
            SCROLLVIEW_PULLDOWN_CLASS = SCROLLVIEW_CLASS + "-pull-down",
            SCROLLVIEW_PULLDOWN_IMAGE_CLASS = SCROLLVIEW_PULLDOWN_CLASS + "-image",
            SCROLLVIEW_PULLDOWN_INDICATOR_CLASS = SCROLLVIEW_PULLDOWN_CLASS + "-indicator",
            SCROLLVIEW_PULLDOWN_TEXT_CLASS = SCROLLVIEW_PULLDOWN_CLASS + "-text",
            SCROLLVIEW_REACHBOTTOM_CLASS = SCROLLVIEW_CLASS + "-scrollbottom",
            SCROLLVIEW_REACHBOTTOM_INDICATOR_CLASS = SCROLLVIEW_REACHBOTTOM_CLASS + "-indicator",
            SCROLLVIEW_REACHBOTTOM_TEXT_CLASS = SCROLLVIEW_REACHBOTTOM_CLASS + "-text";
        ui.registerComponent("dxScrollView", ui.dxScrollable.inherit({
            _defaultOptions: function() {
                return $.extend(this.callBase(), {
                        pullingDownText: Globalize.localize("dxScrollView-pullingDownText"),
                        pulledDownText: Globalize.localize("dxScrollView-pulledDownText"),
                        refreshingText: Globalize.localize("dxScrollView-refreshingText"),
                        reachBottomText: Globalize.localize("dxScrollView-reachBottomText"),
                        pullDownAction: null,
                        reachBottomAction: null,
                        refreshStrategy: "pullDown"
                    })
            },
            _initMarkup: function() {
                this.callBase();
                this._element().addClass(SCROLLVIEW_CLASS);
                this._initContent();
                this._initTopPocket();
                this._initBottomPocket()
            },
            _initContent: function() {
                var $content = $("<div>").addClass(SCROLLVIEW_CONTENT_CLASS);
                this._$content.wrapInner($content)
            },
            _initTopPocket: function() {
                var $topPocket = this._$topPocket = $("<div>").addClass(SCROLLVIEW_TOP_POCKET_CLASS),
                    $pullDown = this._$pullDown = $("<div>").addClass(SCROLLVIEW_PULLDOWN_CLASS);
                $topPocket.append($pullDown);
                this._$content.prepend($topPocket)
            },
            _initBottomPocket: function() {
                var $bottomPocket = this._$bottomPocket = $("<div>").addClass(SCROLLVIEW_BOTTOM_POCKET_CLASS),
                    $reachBottom = this._$reachBottom = $("<div>").addClass(SCROLLVIEW_REACHBOTTOM_CLASS),
                    $loadContainer = $("<div>").addClass(SCROLLVIEW_REACHBOTTOM_INDICATOR_CLASS),
                    $loadIndicator = $("<div>").dxLoadIndicator(),
                    $text = this._$reachBottomText = $("<div>").addClass(SCROLLVIEW_REACHBOTTOM_TEXT_CLASS);
                this._updateReachBottomText();
                $reachBottom.append($loadContainer.append($loadIndicator)).append($text);
                $bottomPocket.append($reachBottom);
                this._$content.append($bottomPocket)
            },
            _updateReachBottomText: function() {
                this._$reachBottomText.text(this.option("reachBottomText"))
            },
            _createStrategy: function() {
                var strategyName = this.option("useNative") || DX.designMode ? this.option("refreshStrategy") : "simulated";
                var strategyClass = ui.scrollViewRefreshStrategies[strategyName];
                if (!strategyClass)
                    throw Error("Unknown dxScrollView refresh strategy " + this.option("refreshStrategy"));
                this._strategy = new strategyClass(this);
                this._strategy.pullDownCallbacks.add($.proxy(this._handlePullDown, this));
                this._strategy.releaseCallbacks.add($.proxy(this._handleRelease, this));
                this._strategy.reachBottomCallbacks.add($.proxy(this._handleReachBottom, this));
                this._strategy.render()
            },
            _createActions: function() {
                this.callBase();
                this._pullDownAction = this._createActionByOption("pullDownAction", {excludeValidators: ["gesture"]});
                this._reachBottomAction = this._createActionByOption("reachBottomAction", {excludeValidators: ["gesture"]});
                this._pullDownEnable(!!this.option("pullDownAction") && !DX.designMode);
                this._reachBottomEnable(!!this.option("reachBottomAction") && !DX.designMode)
            },
            _pullDownEnable: function(enabled) {
                this._$pullDown.toggle(enabled);
                this._strategy.pullDownEnable(enabled)
            },
            _reachBottomEnable: function(enabled) {
                this._$reachBottom.toggle(enabled);
                this._strategy.reachBottomEnable(enabled)
            },
            _handlePullDown: function() {
                this._pullDownAction();
                this._lock()
            },
            _handleRelease: function() {
                this._unlock()
            },
            _handleReachBottom: function() {
                this._reachBottomAction();
                this._lock()
            },
            _optionChanged: function(optionName, optionValue) {
                switch (optionName) {
                    case"pullDownAction":
                    case"reachBottomAction":
                        this._createActions();
                        break;
                    case"pullingDownText":
                    case"pulledDownText":
                    case"refreshingText":
                    case"refreshStrategy":
                        this._invalidate();
                        break;
                    case"reachBottomText":
                        this._updateReachBottomText();
                        break;
                    default:
                        this.callBase.apply(this, arguments)
                }
            },
            content: function() {
                return this._$content.children().eq(1)
            },
            release: function(preventReachBottom) {
                if (preventReachBottom !== undefined)
                    this.toggleLoading(!preventReachBottom);
                return this._strategy.release()
            },
            toggleLoading: function(showOrHide) {
                this._reachBottomEnable(showOrHide)
            },
            isFull: function() {
                return this.content().prop("scrollHeight") > this._$container.height()
            }
        }));
        ui.scrollViewRefreshStrategies = {}
    })(jQuery, DevExpress);
    /*! Module widgets, file ui.scrollView.native.pullDown.js */
    (function($, DX, undefined) {
        var ui = DX.ui,
            math = Math;
        var SCROLLVIEW_PULLDOWN_REFRESHING_CLASS = "dx-scrollview-pull-down-loading",
            SCROLLVIEW_PULLDOWN_READY_CLASS = "dx-scrollview-pull-down-ready",
            SCROLLVIEW_PULLDOWN_IMAGE_CLASS = "dx-scrollview-pull-down-image",
            SCROLLVIEW_PULLDOWN_INDICATOR_CLASS = "dx-scrollview-pull-down-indicator",
            SCROLLVIEW_PULLDOWN_TEXT_CLASS = "dx-scrollview-pull-down-text",
            STATE_RELEASED = 0,
            STATE_READY = 1,
            STATE_REFRESHING = 2,
            STATE_LOADING = 3;
        var PullDownNativeScrollViewStrategy = ui.NativeScrollableStrategy.inherit({
                _init: function(scrollView) {
                    this.callBase(scrollView);
                    this._$topPocket = scrollView._$topPocket;
                    this._$pullDown = scrollView._$pullDown;
                    this._$bottomPocket = scrollView._$bottomPocket;
                    this._$refreshingText = scrollView._$refreshingText;
                    this._$scrollViewContent = scrollView.content();
                    this._initCallbacks()
                },
                _initCallbacks: function() {
                    this.pullDownCallbacks = $.Callbacks();
                    this.releaseCallbacks = $.Callbacks();
                    this.reachBottomCallbacks = $.Callbacks()
                },
                render: function() {
                    this.callBase();
                    this._renderPullDown();
                    this._releaseState()
                },
                _renderPullDown: function() {
                    var $image = $("<div>").addClass(SCROLLVIEW_PULLDOWN_IMAGE_CLASS),
                        $loadContainer = $("<div>").addClass(SCROLLVIEW_PULLDOWN_INDICATOR_CLASS),
                        $loadIndicator = $("<div>").dxLoadIndicator(),
                        $text = this._$pullDownText = $("<div>").addClass(SCROLLVIEW_PULLDOWN_TEXT_CLASS);
                    this._$pullingDownText = $("<div>").text(this.option("pullingDownText")).appendTo($text);
                    this._$pulledDownText = $("<div>").text(this.option("pulledDownText")).appendTo($text);
                    this._$refreshingText = $("<div>").text(this.option("refreshingText")).appendTo($text);
                    this._$pullDown.empty().append($image).append($loadContainer.append($loadIndicator)).append($text)
                },
                _releaseState: function() {
                    this._state = STATE_RELEASED;
                    this._refreshPullDownText()
                },
                _refreshPullDownText: function() {
                    this._$pullingDownText.css("opacity", this._state === STATE_RELEASED ? 1 : 0);
                    this._$pulledDownText.css("opacity", this._state === STATE_READY ? 1 : 0);
                    this._$refreshingText.css("opacity", this._state === STATE_REFRESHING ? 1 : 0)
                },
                update: function() {
                    this.callBase();
                    this._setTopPocketOffset()
                },
                _updateDimensions: function() {
                    this.callBase();
                    this._topPocketSize = this._$topPocket.height();
                    this._bottomPocketSize = this._$bottomPocket.height();
                    this._scrollOffset = this._$container.height() - this._$content.height()
                },
                _setTopPocketOffset: function() {
                    this._$topPocket.css({
                        height: this._topPocketSize,
                        top: -this._topPocketSize
                    })
                },
                _handleEnd: function() {
                    var self = this;
                    if (self._state === STATE_READY) {
                        self._setPullDownOffset(self._topPocketSize);
                        setTimeout(function() {
                            self._pullDownRefreshing()
                        }, 400)
                    }
                },
                _setPullDownOffset: function(offset) {
                    DX.translator.move(this._$topPocket, {top: offset});
                    DX.translator.move(this._$scrollViewContent, {top: offset})
                },
                _handleScroll: function(e) {
                    this.callBase(e);
                    if (this._state === STATE_REFRESHING)
                        return;
                    this._location = this.location().top;
                    if (this._isPullDown())
                        this._pullDownReady();
                    else if (this._isReachBottom())
                        this._reachBottom();
                    else
                        this._stateReleased()
                },
                _isPullDown: function() {
                    return this._pullDownEnabled && this._location >= this._topPocketSize
                },
                _isReachBottom: function() {
                    return this._reachBottomEnabled && this._location <= this._scrollOffset + this._bottomPocketSize
                },
                _reachBottom: function() {
                    if (this._state === STATE_LOADING)
                        return;
                    this._state = STATE_LOADING;
                    this.reachBottomCallbacks.fire()
                },
                _pullDownReady: function() {
                    if (this._state === STATE_READY)
                        return;
                    this._state = STATE_READY;
                    this._$pullDown.addClass(SCROLLVIEW_PULLDOWN_READY_CLASS);
                    this._refreshPullDownText()
                },
                _stateReleased: function() {
                    if (this._state === STATE_RELEASED)
                        return;
                    this._$pullDown.removeClass(SCROLLVIEW_PULLDOWN_REFRESHING_CLASS).removeClass(SCROLLVIEW_PULLDOWN_READY_CLASS);
                    this._releaseState()
                },
                _pullDownRefreshing: function() {
                    if (this._state === STATE_REFRESHING)
                        return;
                    this._state = STATE_REFRESHING;
                    this._$pullDown.addClass(SCROLLVIEW_PULLDOWN_REFRESHING_CLASS).removeClass(SCROLLVIEW_PULLDOWN_READY_CLASS);
                    this._refreshPullDownText();
                    this.pullDownCallbacks.fire()
                },
                pullDownEnable: function(enabled) {
                    this._pullDownEnabled = enabled
                },
                reachBottomEnable: function(enabled) {
                    this._reachBottomEnabled = enabled
                },
                release: function() {
                    var deferred = $.Deferred();
                    this._updateDimensions();
                    setTimeout($.proxy(function() {
                        this._setPullDownOffset(0);
                        this._stateReleased();
                        this.releaseCallbacks.fire();
                        this._updateAction();
                        deferred.resolve()
                    }, this), 400);
                    return deferred.promise()
                }
            });
        ui.scrollViewRefreshStrategies.pullDown = PullDownNativeScrollViewStrategy
    })(jQuery, DevExpress);
    /*! Module widgets, file ui.scrollView.native.swipeDown.js */
    (function($, DX, undefined) {
        var ui = DX.ui,
            events = ui.events,
            math = Math;
        var SCROLLVIEW_PULLDOWN_REFRESHING_CLASS = "dx-scrollview-pull-down-loading",
            SCROLLVIEW_OBSOLETE_ANDROID_CLASS = "dx-scrollview-obsolete-android-browser",
            PULLDOWN_HEIGHT = 160,
            STATE_RELEASED = 0,
            STATE_REFRESHING = 2,
            STATE_LOADING = 3,
            STATE_TOUCHED = 4,
            STATE_PULLED = 5;
        var SwipeDownNativeScrollViewStrategy = ui.NativeScrollableStrategy.inherit({
                _init: function(scrollView) {
                    this.callBase(scrollView);
                    this._$topPocket = scrollView._$topPocket;
                    this._$bottomPocket = scrollView._$bottomPocket;
                    this._$pullDown = scrollView._$pullDown;
                    this._$scrollViewContent = scrollView.content();
                    this._initCallbacks();
                    this._releaseState();
                    this._location = 0
                },
                _initCallbacks: function() {
                    this.pullDownCallbacks = $.Callbacks();
                    this.releaseCallbacks = $.Callbacks();
                    this.reachBottomCallbacks = $.Callbacks()
                },
                render: function() {
                    this.callBase();
                    this._renderPullDown()
                },
                _renderPullDown: function() {
                    this._$pullDown.empty().append($("<div class='dx-scrollview-pulldown-pointer1'>")).append($("<div class='dx-scrollview-pulldown-pointer2'>")).append($("<div class='dx-scrollview-pulldown-pointer3'>")).append($("<div class='dx-scrollview-pulldown-pointer4'>"))
                },
                _releaseState: function() {
                    this._state = STATE_RELEASED;
                    this._$pullDown.css({
                        width: "0%",
                        opacity: 0
                    });
                    this._updateDimensions()
                },
                _updateDimensions: function() {
                    this.callBase();
                    this._topPocketSize = this._$topPocket.height();
                    this._bottomPocketSize = this._$bottomPocket.height();
                    this._scrollOffset = this._$container.height() - this._$content.height()
                },
                _handleStart: function(e) {
                    if (this._state === STATE_RELEASED && this._location === 0) {
                        this._startClientY = events.eventData(e).y;
                        this._state = STATE_TOUCHED
                    }
                },
                _handleMove: function(e) {
                    this._deltaY = events.eventData(e).y - this._startClientY;
                    if (this._state === STATE_TOUCHED)
                        if (this._deltaY > 0) {
                            e.preventDefault();
                            this._state = STATE_PULLED
                        }
                        else
                            this._handleEnd();
                    if (this._state === STATE_PULLED) {
                        if (this._deltaY < 0) {
                            this._handleEnd();
                            return
                        }
                        this._$pullDown.css({
                            opacity: 1,
                            width: math.min(math.abs(this._deltaY * 100 / PULLDOWN_HEIGHT), 100) + "%"
                        });
                        if (this._isPullDown())
                            this._pullDownRefreshing()
                    }
                },
                _isPullDown: function() {
                    return this._pullDownEnabled && this._deltaY >= PULLDOWN_HEIGHT
                },
                _handleEnd: function() {
                    if (this._state === STATE_TOUCHED || this._state === STATE_PULLED)
                        this._releaseState()
                },
                _handleScroll: function(e) {
                    this.callBase(e);
                    if (this._state === STATE_REFRESHING)
                        return;
                    var currentLocation = this.location().top,
                        scrollDelta = this._location - currentLocation;
                    this._location = currentLocation;
                    if (scrollDelta > 0 && this._isReachBottom())
                        this._reachBottom();
                    else
                        this._stateReleased()
                },
                _isReachBottom: function() {
                    return this._reachBottomEnabled && this._location <= this._scrollOffset + this._bottomPocketSize
                },
                _reachBottom: function() {
                    this.reachBottomCallbacks.fire()
                },
                _stateReleased: function() {
                    if (this._state === STATE_RELEASED)
                        return;
                    this._$pullDown.removeClass(SCROLLVIEW_PULLDOWN_REFRESHING_CLASS);
                    this._releaseState()
                },
                _pullDownRefreshing: function() {
                    if (this._state === STATE_REFRESHING)
                        return;
                    this._state = STATE_REFRESHING;
                    var self = this;
                    setTimeout(function() {
                        self._$pullDown.addClass(SCROLLVIEW_PULLDOWN_REFRESHING_CLASS);
                        self.pullDownCallbacks.fire()
                    }, 400)
                },
                pullDownEnable: function(enabled) {
                    this._$topPocket.toggle(enabled);
                    this._pullDownEnabled = enabled
                },
                reachBottomEnable: function(enabled) {
                    this._reachBottomEnabled = enabled
                },
                release: function() {
                    var self = this,
                        deferred = $.Deferred();
                    self._updateDimensions();
                    setTimeout(function() {
                        self._stateReleased();
                        self.releaseCallbacks.fire();
                        self._updateAction();
                        deferred.resolve()
                    }, 800);
                    return deferred.promise()
                }
            });
        ui.scrollViewRefreshStrategies.swipeDown = SwipeDownNativeScrollViewStrategy
    })(jQuery, DevExpress);
    /*! Module widgets, file ui.scrollView.native.slideDown.js */
    (function($, DX, undefined) {
        var ui = DX.ui,
            math = Math,
            events = ui.events;
        var DX_SLIDE_DOWN_NATIVE_SCROLLVIEW_STRATEGY = "dxSlideDownNativeScrollViewStrategy",
            SCROLLVIEW_LOCKED_CLASS = "dx-scrollview-locked",
            SCROLLVIEW_PULLDOWN_REFRESHING_CLASS = "dx-scrollview-pull-down-refreshing",
            SCROLLVIEW_PULLDOWN_LOADING_CLASS = "dx-scrollview-pull-down-loading",
            SCROLLVIEW_PULLDOWN_READY_CLASS = "dx-scrollview-pull-down-ready",
            SCROLLVIEW_PULLDOWN_IMAGE_CLASS = "dx-scrollview-pull-down-image",
            SCROLLVIEW_PULLDOWN_INDICATOR_CLASS = "dx-scrollview-pull-down-indicator",
            SCROLLVIEW_PULLDOWN_TEXT_CLASS = "dx-scrollview-pull-down-text",
            STATE_RELEASED = 0,
            STATE_READY = 1,
            STATE_REFRESHING = 2,
            STATE_LOADING = 3,
            STATE_AFTER_REFRESHING = 4,
            LOADING_HEIGHT = 80,
            SCROLLING_STEP = 4;
        var SlideUpAnimator = DX.Animator.inherit({
                ctor: function(refreshStrategy) {
                    this.callBase();
                    this.refreshStrategy = refreshStrategy;
                    this._$content = refreshStrategy._$content
                },
                _isFinished: function() {
                    return this._$content.scrollTop() === 0
                },
                _step: function() {
                    this._lock();
                    var scrollTop = this._$content.scrollTop();
                    scrollTop -= Math.min(scrollTop, 2 * SCROLLING_STEP);
                    this._$content.scrollTop(scrollTop)
                },
                _complete: function() {
                    this._unlock()
                },
                _stop: function() {
                    this._unlock()
                },
                _lock: function() {
                    this.refreshStrategy._$container.addClass(SCROLLVIEW_LOCKED_CLASS)
                },
                _unlock: function() {
                    this.refreshStrategy._$container.removeClass(SCROLLVIEW_LOCKED_CLASS)
                }
            });
        var SlideDownAnimator = SlideUpAnimator.inherit({
                _isFinished: function() {
                    this._currentPosition = this._$content.scrollTop();
                    return this._currentPosition === this.refreshStrategy._topPocketSize
                },
                _step: function() {
                    this._lock();
                    var scrollTop = this._$content.scrollTop();
                    var currentPosition = this.refreshStrategy._topPocketSize - scrollTop;
                    scrollTop += currentPosition < 0 ? -Math.min(Math.abs(currentPosition), SCROLLING_STEP) : Math.min(currentPosition, SCROLLING_STEP);
                    this._$content.scrollTop(scrollTop)
                },
                _complete: function() {
                    this.callBase();
                    this.refreshStrategy._releaseState()
                }
            });
        var SlideDownNativeScrollViewStrategy = ui.NativeScrollableStrategy.inherit({
                _init: function(scrollView) {
                    this.callBase(scrollView);
                    this._$topPocket = scrollView._$topPocket;
                    this._$pullDown = scrollView._$pullDown;
                    this._$bottomPocket = scrollView._$bottomPocket;
                    this._$refreshingText = scrollView._$refreshingText;
                    this._$content = scrollView._$content;
                    this._$scrollViewContent = scrollView.content();
                    this._initCallbacks();
                    this._initAnimators();
                    $(document).on("dx.viewchanged", $.proxy(this._hidePullDown, this))
                },
                _initCallbacks: function() {
                    this.pullDownCallbacks = $.Callbacks();
                    this.releaseCallbacks = $.Callbacks();
                    this.reachBottomCallbacks = $.Callbacks()
                },
                _initAnimators: function() {
                    this._slideDown = new SlideDownAnimator(this);
                    this._slideUp = new SlideUpAnimator(this)
                },
                render: function() {
                    this.callBase();
                    this._renderPullDown();
                    this._renderBottom();
                    this._releaseState();
                    this._updateDimensions();
                    this._hidePullDown()
                },
                _renderPullDown: function() {
                    var $image = $("<div>").addClass(SCROLLVIEW_PULLDOWN_IMAGE_CLASS),
                        $loadContainer = $("<div>").addClass(SCROLLVIEW_PULLDOWN_INDICATOR_CLASS),
                        $loadIndicator = $("<progress>");
                    var $pullDownText = this._$pullDownText = $("<div>").addClass(SCROLLVIEW_PULLDOWN_TEXT_CLASS);
                    this._$pullingDownText = $("<div>").text(this.option("pullingDownText")).appendTo($pullDownText);
                    this._$pulledDownText = $("<div>").text(this.option("pulledDownText")).appendTo($pullDownText);
                    this._$refreshingText = $("<div>").text(this.option("refreshingText")).appendTo($pullDownText);
                    this._$pullDown.empty().append($image).append($loadContainer.append($loadIndicator)).append($pullDownText)
                },
                _renderBottom: function() {
                    this._$bottomPocket.empty().append("<progress>")
                },
                _releaseState: function() {
                    this._state = STATE_RELEASED;
                    this._$container.removeClass(SCROLLVIEW_PULLDOWN_REFRESHING_CLASS).removeClass(SCROLLVIEW_PULLDOWN_LOADING_CLASS);
                    this._refreshPullDownText()
                },
                _hidePullDown: function() {
                    if (this._$content.scrollTop() < this._topPocketSize)
                        this._$content.scrollTop(this._topPocketSize)
                },
                _refreshPullDownText: function() {
                    this._$pullingDownText.css("opacity", this._state === STATE_RELEASED ? 1 : 0);
                    this._$pulledDownText.css("opacity", this._state === STATE_READY ? 1 : 0);
                    this._$refreshingText.css("opacity", this._state === STATE_REFRESHING ? 1 : 0)
                },
                update: function() {
                    this.callBase();
                    this._hidePullDown();
                    this._updateScrollbars()
                },
                _updateDimensions: function() {
                    this._topPocketSize = this._$topPocket.height();
                    this._scrollOffset = this._$scrollViewContent.prop("scrollHeight") - this._$scrollViewContent.prop("clientHeight");
                    this._containerSize = {
                        height: this._$scrollViewContent.prop("clientHeight"),
                        width: this._$scrollViewContent.prop("clientWidth")
                    };
                    this._contentSize = {
                        height: this._$scrollViewContent.prop("scrollHeight"),
                        width: this._$scrollViewContent.prop("scrollWidth")
                    }
                },
                _contentSize: function() {
                    return {
                            height: this._$scrollViewContent.prop("scrollHeight"),
                            width: this._$scrollViewContent.prop("scrollWidth")
                        }
                },
                location: function() {
                    return {
                            left: -this._$scrollViewContent.scrollLeft(),
                            top: -this._$scrollViewContent.scrollTop()
                        }
                },
                _attachScrollHandler: function() {
                    this.callBase();
                    $(this._$content).on(events.addNamespace("scroll", DX_SLIDE_DOWN_NATIVE_SCROLLVIEW_STRATEGY), $.proxy(this._handleContentScroll, this));
                    $(this._$scrollViewContent).on(events.addNamespace("scroll", DX_SLIDE_DOWN_NATIVE_SCROLLVIEW_STRATEGY), $.proxy(this._handleScrollViewContentScroll, this))
                },
                _handleContentScroll: function(e) {
                    var contentLocation = this._$content.scrollTop();
                    if (this._isPullDown(contentLocation))
                        this._pullDownRefreshing();
                    else if (this._isReachBottom(contentLocation))
                        this._reachBottom();
                    else
                        this._pullDownReady()
                },
                _isPullDown: function(location) {
                    return this._pullDownEnabled && location === 0
                },
                _pullDownRefreshing: function() {
                    if (this._state === STATE_REFRESHING)
                        return;
                    this._state = STATE_REFRESHING;
                    this._stopAnimators();
                    this._refreshPullDownText();
                    this._$container.addClass(SCROLLVIEW_PULLDOWN_REFRESHING_CLASS);
                    this.pullDownCallbacks.fire()
                },
                _isReachBottom: function(location) {
                    this._scrollContent = this._$content.prop("scrollHeight") - this._$content.prop("clientHeight");
                    return this._reachBottomEnabled && location === this._scrollContent
                },
                _reachBottom: function() {
                    if (this._state === STATE_LOADING || !this._reachBottomEnabled)
                        return;
                    this._state = STATE_LOADING;
                    this._stopAnimators();
                    this._$container.addClass(SCROLLVIEW_PULLDOWN_LOADING_CLASS);
                    this.reachBottomCallbacks.fire()
                },
                _pullDownReady: function() {
                    if (this._state === STATE_READY || this._state === STATE_AFTER_REFRESHING)
                        return;
                    if (this._state === STATE_REFRESHING) {
                        if (!this._slideUp.inProgress())
                            this._startUpAnimation();
                        return
                    }
                    this._state = STATE_READY;
                    this._startDownAnimation()
                },
                _startUpAnimation: function() {
                    this._slideDown.stop();
                    this._slideUp.start()
                },
                _startDownAnimation: function() {
                    this._slideUp.stop();
                    this._slideDown.start()
                },
                _stopAnimators: function() {
                    this._slideDown.stop();
                    this._slideUp.stop()
                },
                _handleScrollViewContentScroll: function(e) {
                    this._handleScroll(e)
                },
                pullDownEnable: function(enabled) {
                    this._pullDownEnabled = enabled
                },
                reachBottomEnable: function(enabled) {
                    this._reachBottomEnabled = enabled;
                    this._$bottomPocket.toggle(enabled)
                },
                release: function() {
                    var deferred = $.Deferred();
                    this._updateDimensions();
                    this._updateScrollbars();
                    setTimeout($.proxy(function() {
                        this._state = STATE_AFTER_REFRESHING;
                        this._startDownAnimation();
                        this.releaseCallbacks.fire();
                        this._updateAction();
                        deferred.resolve()
                    }, this), 400);
                    return deferred.promise()
                },
                scrollBy: function(distance) {
                    var location = this.location();
                    this._component.content().scrollTop(-location.top - distance.y);
                    this._component.content().scrollLeft(-location.left - distance.x)
                }
            });
        ui.scrollViewRefreshStrategies.slideDown = SlideDownNativeScrollViewStrategy;
        ui.scrollViewRefreshStrategies.slideDown.__internals = {
            slideDownAnimator: function(cls) {
                if (cls === undefined)
                    return SlideDownAnimator;
                SlideDownAnimator = cls
            },
            slideUpAnimator: function(cls) {
                if (cls === undefined)
                    return SlideUpAnimator;
                SlideUpAnimator = cls
            },
            LOADING_HEIGHT: LOADING_HEIGHT
        }
    })(jQuery, DevExpress);
    /*! Module widgets, file ui.scrollView.simulated.js */
    (function($, DX, undefined) {
        var ui = DX.ui,
            math = Math;
        var SCROLLVIEW_PULLDOWN_REFRESHING_CLASS = "dx-scrollview-pull-down-loading",
            SCROLLVIEW_PULLDOWN_READY_CLASS = "dx-scrollview-pull-down-ready",
            SCROLLVIEW_PULLDOWN_IMAGE_CLASS = "dx-scrollview-pull-down-image",
            SCROLLVIEW_PULLDOWN_INDICATOR_CLASS = "dx-scrollview-pull-down-indicator",
            SCROLLVIEW_PULLDOWN_TEXT_CLASS = "dx-scrollview-pull-down-text",
            STATE_RELEASED = 0,
            STATE_READY = 1,
            STATE_REFRESHING = 2,
            STATE_LOADING = 3;
        var ScrollViewScroller = ui.ScrollViewScroller = ui.Scroller.inherit({
                ctor: function() {
                    this.callBase.apply(this, arguments);
                    this._releaseState()
                },
                _releaseState: function() {
                    this._state = STATE_RELEASED;
                    this._refreshPullDownText()
                },
                _refreshPullDownText: function() {
                    this._$pullingDownText.css("opacity", this._state === STATE_RELEASED ? 1 : 0);
                    this._$pulledDownText.css("opacity", this._state === STATE_READY ? 1 : 0);
                    this._$refreshingText.css("opacity", this._state === STATE_REFRESHING ? 1 : 0)
                },
                _initCallbacks: function() {
                    this.callBase();
                    this.pullDownCallbacks = $.Callbacks();
                    this.releaseCallbacks = $.Callbacks();
                    this.reachBottomCallbacks = $.Callbacks()
                },
                _updateBounds: function() {
                    var considerPockets = this._direction !== "horizontal";
                    this._topPocketSize = considerPockets ? this._$topPocket[this._dimension]() : 0;
                    this._bottomPocketSize = considerPockets ? this._$bottomPocket[this._dimension]() : 0;
                    this._updateOffsets()
                },
                _updateOffsets: function() {
                    this._minOffset = math.min(this._containerSize() - this._contentSize() + this._bottomPocketSize, -this._topPocketSize);
                    this._maxOffset = -this._topPocketSize;
                    this._bottomBound = this._minOffset - this._bottomPocketSize
                },
                _updateScrollbar: function() {
                    this._scrollbar.option({
                        containerSize: this._containerSize(),
                        contentSize: this._contentSize() - this._topPocketSize - this._bottomPocketSize
                    })
                },
                _calculateScrollBarPosition: function() {
                    return this._topPocketSize + this._location
                },
                _moveContent: function() {
                    this.callBase();
                    if (this._isPullDown())
                        this._pullDownReady();
                    else if (this._isReachBottom())
                        this._reachBottomReady();
                    else if (this._state !== STATE_RELEASED)
                        this._stateReleased()
                },
                _isPullDown: function() {
                    return this._pullDownEnabled && this._location >= 0
                },
                _isReachBottom: function() {
                    return this._reachBottomEnabled && this._location <= this._bottomBound
                },
                _scrollComplete: function() {
                    if (this._inBounds() && this._state === STATE_READY)
                        this._pullDownRefreshing();
                    else if (this._inBounds() && this._state === STATE_LOADING)
                        this._reachBottomLoading();
                    else
                        this.callBase()
                },
                _reachBottomReady: function() {
                    if (this._state === STATE_LOADING)
                        return;
                    this._state = STATE_LOADING;
                    this._minOffset = math.min(this._containerSize() - this._contentSize(), 0)
                },
                _reachBottomLoading: function() {
                    this.reachBottomCallbacks.fire()
                },
                _pullDownReady: function() {
                    if (this._state === STATE_READY)
                        return;
                    this._state = STATE_READY;
                    this._maxOffset = 0;
                    this._$pullDown.addClass(SCROLLVIEW_PULLDOWN_READY_CLASS);
                    this._refreshPullDownText()
                },
                _stateReleased: function() {
                    if (this._state === STATE_RELEASED)
                        return;
                    this._releaseState();
                    this._updateOffsets();
                    this._$pullDown.removeClass(SCROLLVIEW_PULLDOWN_REFRESHING_CLASS).removeClass(SCROLLVIEW_PULLDOWN_READY_CLASS);
                    this.releaseCallbacks.fire()
                },
                _pullDownRefreshing: function() {
                    if (this._state === STATE_REFRESHING)
                        return;
                    this._state = STATE_REFRESHING;
                    this._$pullDown.addClass(SCROLLVIEW_PULLDOWN_REFRESHING_CLASS).removeClass(SCROLLVIEW_PULLDOWN_READY_CLASS);
                    this._refreshPullDownText();
                    this.pullDownCallbacks.fire()
                },
                _handleRelease: function() {
                    this._update();
                    return DX.utils.executeAsync($.proxy(this._release, this))
                },
                _release: function() {
                    this._stateReleased();
                    this._scrollComplete()
                },
                _handleReachBottomEnabling: function(enabled) {
                    if (this._reachBottomEnabled === enabled)
                        return;
                    this._reachBottomEnabled = enabled;
                    this._updateBounds()
                },
                _handlePullDownEnabling: function(enabled) {
                    if (this._pullDownEnabled === enabled)
                        return;
                    this._pullDownEnabled = enabled;
                    this._considerTopPocketChange();
                    this._handleUpdate()
                },
                _considerTopPocketChange: function() {
                    this._location -= this._$topPocket.height() || -this._topPocketSize;
                    this._move()
                }
            });
        var SimulatedScrollViewStrategy = ui.SimulatedScrollableStrategy.inherit({
                _init: function(scrollView) {
                    this.callBase(scrollView);
                    this._$pullDown = scrollView._$pullDown;
                    this._$topPocket = scrollView._$topPocket;
                    this._$bottomPocket = scrollView._$bottomPocket;
                    this._initCallbacks()
                },
                _initCallbacks: function() {
                    this.pullDownCallbacks = $.Callbacks();
                    this.releaseCallbacks = $.Callbacks();
                    this.reachBottomCallbacks = $.Callbacks()
                },
                render: function() {
                    this._renderPullDown();
                    this.callBase()
                },
                _renderPullDown: function() {
                    var $image = $("<div>").addClass(SCROLLVIEW_PULLDOWN_IMAGE_CLASS),
                        $loadContainer = $("<div>").addClass(SCROLLVIEW_PULLDOWN_INDICATOR_CLASS),
                        $loadIndicator = $("<div>").dxLoadIndicator(),
                        $text = this._$pullDownText = $("<div>").addClass(SCROLLVIEW_PULLDOWN_TEXT_CLASS);
                    this._$pullingDownText = $("<div>").text(this.option("pullingDownText")).appendTo($text);
                    this._$pulledDownText = $("<div>").text(this.option("pulledDownText")).appendTo($text);
                    this._$refreshingText = $("<div>").text(this.option("refreshingText")).appendTo($text);
                    this._$pullDown.empty().append($image).append($loadContainer.append($loadIndicator)).append($text)
                },
                pullDownEnable: function(enabled) {
                    this._handleEvent("PullDownEnabling", enabled)
                },
                reachBottomEnable: function(enabled) {
                    this._handleEvent("ReachBottomEnabling", enabled)
                },
                _createScroller: function(direction) {
                    var self = this;
                    var scroller = self._scrollers[direction] = new ScrollViewScroller(self._scrollerOptions(direction));
                    scroller.pullDownCallbacks.add(function() {
                        self.pullDownCallbacks.fire()
                    });
                    scroller.releaseCallbacks.add(function() {
                        self.releaseCallbacks.fire()
                    });
                    scroller.reachBottomCallbacks.add(function() {
                        self.reachBottomCallbacks.fire()
                    })
                },
                _scrollerOptions: function(direction) {
                    return $.extend(this.callBase(direction), {
                            $topPocket: this._$topPocket,
                            $bottomPocket: this._$bottomPocket,
                            $pullDown: this._$pullDown,
                            $pullDownText: this._$pullDownText,
                            $pullingDownText: this._$pullingDownText,
                            $pulledDownText: this._$pulledDownText,
                            $refreshingText: this._$refreshingText
                        })
                },
                release: function() {
                    return this._handleEvent("Release").done(this._updateAction)
                }
            });
        ui.scrollViewRefreshStrategies.simulated = SimulatedScrollViewStrategy
    })(jQuery, DevExpress);
    /*! Module widgets, file ui.map.js */
    (function($, DX, undefined) {
        var ui = DX.ui,
            events = ui.events,
            utils = DX.utils,
            winJS = DX.support.winJS;
        ui.MapProvider = DX.Class.inherit({
            _defaultRouteWeight: function() {
                return 5
            },
            _defaultRouteOpacity: function() {
                return .5
            },
            _defaultRouteColor: function() {
                return "#0000FF"
            },
            ctor: function(map, $container) {
                this._mapInstance = map;
                this._$container = $container
            },
            load: $.noop,
            render: DX.abstract,
            updateDimensions: DX.abstract,
            updateMapType: DX.abstract,
            updateLocation: DX.abstract,
            updateZoom: DX.abstract,
            updateControls: DX.abstract,
            updateMarkers: DX.abstract,
            addMarkers: DX.abstract,
            updateRoutes: DX.abstract,
            addRoutes: DX.abstract,
            clean: DX.abstract,
            cancelEvents: false,
            map: function() {
                return this._map
            },
            mapRendered: function() {
                return !!this._map
            },
            _option: function(name, value) {
                if (value === undefined)
                    return this._mapInstance.option(name);
                this._mapInstance.setOptionSilent(name, value)
            },
            _key: function(providerName) {
                var key = this._option("key");
                return key[providerName] === undefined ? key : key[providerName]
            },
            _parseTooltipOptions: function(option) {
                return {
                        text: option.text || option,
                        visible: option.isShown || false
                    }
            },
            _createAction: function() {
                return this._mapInstance._createAction.apply(this._mapInstance, $.makeArray(arguments))
            },
            _handleClickAction: function() {
                var clickAction = this._createAction(this._option("clickAction") || $.noop);
                clickAction()
            }
        });
        var providers = {};
        ui.registerMapProvider = function(name, provider) {
            providers[name] = provider
        };
        var MAP_CLASS = "dx-map",
            MAP_CONTAINER_CLASS = "dx-map-container",
            MAP_SHIELD_CLASS = "dx-map-shield";
        var wrapToArray = function(entity) {
                return $.isArray(entity) ? entity : [entity]
            };
        ui.registerComponent("dxMap", ui.Widget.inherit({
            _defaultOptions: function() {
                return $.extend(this.callBase(), {
                        location: {
                            lat: 0,
                            lng: 0
                        },
                        width: 300,
                        height: 300,
                        zoom: 1,
                        type: "roadmap",
                        provider: "google",
                        markers: [],
                        markerIconSrc: null,
                        routes: [],
                        key: {
                            bing: "",
                            google: "",
                            googleStatic: ""
                        },
                        controls: false,
                        readyAction: null,
                        updateAction: null
                    })
            },
            _init: function() {
                this.callBase();
                this._initContainer();
                this._grabEvents();
                this._initProvider()
            },
            _initContainer: function() {
                this._$container = $("<div />").addClass(MAP_CONTAINER_CLASS);
                this._element().append(this._$container)
            },
            _grabEvents: function() {
                var eventName = events.addNamespace("dxpointerdown", this.NAME);
                this._element().on(eventName, $.proxy(this._cancelEvent, this))
            },
            _cancelEvent: function(e) {
                var cancelByProvider = this._provider.cancelEvents && !this.option("disabled");
                if (!DX.designMode && cancelByProvider)
                    e.stopPropagation()
            },
            _initProvider: function() {
                var provider = this.option("provider");
                if (winJS && this.option("provider") === "google")
                    throw new Error("Google provider cannot be used in winJS application");
                if (this._provider)
                    this._provider.clean();
                this._provider = new providers[provider](this, this._$container);
                this._mapLoader = this._provider.load()
            },
            _render: function() {
                this.callBase();
                this._element().addClass(MAP_CLASS);
                this._renderShield();
                this._execAsyncProviderAction("render")
            },
            _renderShield: function() {
                if (DX.designMode || this.option("disabled")) {
                    var $shield = $("<div/>").addClass(MAP_SHIELD_CLASS);
                    this._element().append($shield)
                }
                else {
                    var $shield = this._element().find("." + MAP_SHIELD_CLASS);
                    $shield.remove()
                }
            },
            _clean: function() {
                this._provider.clean()
            },
            _optionChanged: function(name, value, prevValue) {
                if (this._cancelOptionChange)
                    return;
                switch (name) {
                    case"disabled":
                        this._renderShield();
                        this.callBase.apply(this, arguments);
                        break;
                    case"width":
                    case"height":
                        this.callBase.apply(this, arguments);
                        this._execAsyncProviderAction("updateDimensions");
                        break;
                    case"type":
                        this._execAsyncProviderAction("updateMapType");
                        break;
                    case"location":
                        this._execAsyncProviderAction("updateLocation");
                        break;
                    case"zoom":
                        this._execAsyncProviderAction("updateZoom");
                        break;
                    case"controls":
                        this._execAsyncProviderAction("updateControls");
                        break;
                    case"markers":
                    case"markerIconSrc":
                        this._execAsyncProviderAction("updateMarkers");
                        break;
                    case"routes":
                        this._execAsyncProviderAction("updateRoutes");
                        break;
                    case"key":
                        utils.logger.warn("Key option can not be modified after initialisation");
                    case"provider":
                        this._initProvider();
                        this._invalidate();
                        break;
                    case"clickAction":
                    case"readyAction":
                    case"updateAction":
                        break;
                    default:
                        this.callBase.apply(this, arguments)
                }
            },
            _execAsyncProviderAction: function(name) {
                if (!this._provider.mapRendered() && !(name === "render"))
                    return;
                var deferred = $.Deferred(),
                    self = this,
                    options = $.makeArray(arguments).slice(1);
                $.when(this._mapLoader).done(function() {
                    var provider = self._provider;
                    provider[name].apply(provider, options).done(function(mapRefreshed) {
                        self._triggerUpdateAction();
                        if (mapRefreshed)
                            self._triggerReadyAction();
                        deferred.resolve.apply(deferred, $.makeArray(arguments).slice(1))
                    })
                });
                return deferred.promise()
            },
            _triggerReadyAction: function() {
                this._createActionByOption("readyAction")({originalMap: this._provider.map()})
            },
            _triggerUpdateAction: function() {
                this._createActionByOption("updateAction")()
            },
            setOptionSilent: function(name, value) {
                this._cancelOptionChange = true;
                this.option(name, value);
                this._cancelOptionChange = false
            },
            addMarker: function(markerOptions) {
                var d = $.Deferred(),
                    self = this,
                    markersOption = this._options.markers,
                    markers = wrapToArray(markerOptions);
                markersOption.push.apply(markersOption, markers);
                this._execAsyncProviderAction("addMarkers", markers).done(function(instance) {
                    d.resolveWith(self, markers.length > 1 ? [instance] : instance)
                });
                return d.promise()
            },
            removeMarker: function(marker) {
                var d = $.Deferred(),
                    self = this,
                    markersOption = this._options.markers,
                    markers = wrapToArray(marker);
                $.each(markers, function(_, marker) {
                    var index = $.isNumeric(marker) ? marker : $.inArray(marker, markersOption);
                    if (index !== -1)
                        markersOption.splice(index, 1);
                    else
                        throw new Error("Marker '" + marker + "' you are trying to remove does not exist");
                });
                this._execAsyncProviderAction("updateMarkers").done(function() {
                    d.resolveWith(self)
                });
                return d.promise()
            },
            addRoute: function(routeOptions) {
                var d = $.Deferred(),
                    self = this,
                    routesOption = this._options.routes,
                    routes = wrapToArray(routeOptions);
                routesOption.push.apply(routesOption, routes);
                this._execAsyncProviderAction("addRoutes", routes).done(function(instance) {
                    d.resolveWith(self, routes.length > 1 ? [instance] : instance)
                });
                return d.promise()
            },
            removeRoute: function(route) {
                var d = $.Deferred(),
                    self = this,
                    routesOption = this._options.routes,
                    routes = wrapToArray(route);
                $.each(routes, function(_, route) {
                    var index = $.isNumeric(route) ? route : $.inArray(route, routesOption);
                    if (index !== -1)
                        routesOption.splice(index, 1);
                    else
                        throw new Error("Route '" + route + "' you are trying to remove does not exist");
                });
                this._execAsyncProviderAction("updateRoutes").done(function() {
                    d.resolveWith(self)
                });
                return d.promise()
            }
        }))
    })(jQuery, DevExpress);
    /*! Module widgets, file ui.map.bing.js */
    (function($, DX, undefined) {
        var ui = DX.ui,
            winJS = DX.support.winJS;
        var BING_MAP_READY = "_bingScriptReady",
            BING_URL = "https://ecn.dev.virtualearth.net/mapcontrol/mapcontrol.ashx?v=7.0&s=1&onScriptLoad=" + BING_MAP_READY,
            BING_LOCAL_FILES1 = "ms-appx:///Bing.Maps.JavaScript/js/veapicore.js",
            BING_LOCAL_FILES2 = "ms-appx:///Bing.Maps.JavaScript/js/veapiModules.js",
            BING_CREDENTIALS = "AhuxC0dQ1DBTNo8L-H9ToVMQStmizZzBJdraTSgCzDSWPsA1Qd8uIvFSflzxdaLH",
            MIN_LOCATION_RECT_LENGTH = 0.0000000000000001;
        var msMapsLoader;
        ui.registerMapProvider("bing", ui.MapProvider.inherit({
            _mapType: function(type) {
                var mapTypes = {
                        roadmap: Microsoft.Maps.MapTypeId.road,
                        hybrid: Microsoft.Maps.MapTypeId.aerial
                    };
                return mapTypes[type] || mapTypes.roadmap
            },
            _movementMode: function(type) {
                var movementTypes = {
                        driving: Microsoft.Maps.Directions.RouteMode.driving,
                        walking: Microsoft.Maps.Directions.RouteMode.walking
                    };
                return movementTypes[type] || movementTypes.driving
            },
            _resolveLocation: function(location) {
                var d = $.Deferred();
                if (typeof location === "string") {
                    var searchManager = new Microsoft.Maps.Search.SearchManager(this._map);
                    var searchRequest = {
                            where: location,
                            count: 1,
                            callback: function(searchResponse) {
                                var boundsBox = searchResponse.results[0].location;
                                d.resolve(new Microsoft.Maps.Location(boundsBox.latitude, boundsBox.longitude))
                            }
                        };
                    searchManager.geocode(searchRequest)
                }
                else if ($.isPlainObject(location) && $.isNumeric(location.lat) && $.isNumeric(location.lng))
                    d.resolve(new Microsoft.Maps.Location(location.lat, location.lng));
                else if ($.isArray(location))
                    d.resolve(new Microsoft.Maps.Location(location[0], location[1]));
                return d.promise()
            },
            _normalizeLocation: function(location) {
                return {
                        lat: location.latitude,
                        lng: location.longitude
                    }
            },
            load: function() {
                if (!msMapsLoader) {
                    msMapsLoader = $.Deferred();
                    window[BING_MAP_READY] = $.proxy(this._mapReady, this);
                    if (winJS)
                        $.when($.getScript(BING_LOCAL_FILES1), $.getScript(BING_LOCAL_FILES2)).done(function() {
                            Microsoft.Maps.loadModule("Microsoft.Maps.Map", {callback: window[BING_MAP_READY]})
                        });
                    else
                        $.getScript(BING_URL)
                }
                this._markers = [];
                this._routes = [];
                return msMapsLoader
            },
            _mapReady: function() {
                try {
                    delete window[BING_MAP_READY]
                }
                catch(e) {
                    window[BING_MAP_READY] = undefined
                }
                var searchModulePromise = $.Deferred();
                var directionsModulePromise = $.Deferred();
                Microsoft.Maps.loadModule('Microsoft.Maps.Search', {callback: $.proxy(searchModulePromise.resolve, searchModulePromise)});
                Microsoft.Maps.loadModule('Microsoft.Maps.Directions', {callback: $.proxy(directionsModulePromise.resolve, directionsModulePromise)});
                $.when(searchModulePromise, directionsModulePromise).done(function() {
                    msMapsLoader.resolve()
                })
            },
            render: function() {
                var deferred = $.Deferred(),
                    initPromise = $.Deferred(),
                    controls = this._option("controls");
                var options = {
                        credentials: this._key("bing") || BING_CREDENTIALS,
                        mapTypeId: this._mapType(this._option("type")),
                        zoom: this._option("zoom"),
                        showDashboard: controls,
                        showMapTypeSelector: controls,
                        showScalebar: controls
                    };
                this._map = new Microsoft.Maps.Map(this._$container[0], options);
                var handler = Microsoft.Maps.Events.addHandler(this._map, 'tiledownloadcomplete', $.proxy(initPromise.resolve, initPromise));
                this._viewChangeHandler = Microsoft.Maps.Events.addHandler(this._map, 'viewchange', $.proxy(this._handleViewChange, this));
                this._clickHandler = Microsoft.Maps.Events.addHandler(this._map, 'click', $.proxy(this._handleClickAction, this));
                var locationPromise = this._renderLocation();
                var markersPromise = this._refreshMarkers();
                var routesPromise = this._renderRoutes();
                $.when(initPromise, locationPromise, markersPromise, routesPromise).done(function() {
                    Microsoft.Maps.Events.removeHandler(handler);
                    deferred.resolve(true)
                });
                return deferred.promise()
            },
            _handleViewChange: function() {
                var center = this._map.getCenter();
                this._option("location", this._normalizeLocation(center));
                this._option("zoom", this._map.getZoom())
            },
            updateDimensions: function() {
                return $.Deferred().resolve().promise()
            },
            updateMapType: function() {
                this._map.setView({mapTypeId: this._mapType(this._option("type"))});
                return $.Deferred().resolve().promise()
            },
            updateLocation: function() {
                return this._renderLocation()
            },
            _renderLocation: function() {
                var deferred = $.Deferred(),
                    self = this;
                this._resolveLocation(this._option("location")).done(function(location) {
                    self._map.setView({
                        animate: false,
                        center: location
                    });
                    deferred.resolve()
                });
                return deferred.promise()
            },
            updateZoom: function() {
                this._map.setView({
                    animate: false,
                    zoom: this._option("zoom")
                });
                return $.Deferred().resolve().promise()
            },
            updateControls: function() {
                this.clean();
                return this.render()
            },
            _clearBounds: function() {
                this._bounds = null
            },
            _extendBounds: function(location) {
                if (this._bounds)
                    this._bounds = new Microsoft.Maps.LocationRect.fromLocations(this._bounds.getNorthwest(), this._bounds.getSoutheast(), location);
                else
                    this._bounds = new Microsoft.Maps.LocationRect(location, MIN_LOCATION_RECT_LENGTH, MIN_LOCATION_RECT_LENGTH)
            },
            _fitBounds: function() {
                if (!this._bounds)
                    return;
                this._bounds.height = this._bounds.height * 1.1;
                this._bounds.width = this._bounds.width * 1.1;
                this._map.setView({
                    animate: false,
                    bounds: this._bounds
                })
            },
            updateMarkers: function() {
                return this._refreshMarkers()
            },
            _refreshMarkers: function() {
                this._clearMarkers();
                return this._renderMarkers()
            },
            _clearMarkers: function() {
                var self = this;
                this._clearBounds();
                $.each(this._markers, function(_, marker) {
                    self._map.entities.remove(marker.pushpin);
                    if (marker.infobox)
                        self._map.entities.remove(marker.infobox);
                    if (marker.handler)
                        Microsoft.Maps.Events.removeHandler(marker.handler)
                });
                this._markers = []
            },
            addMarkers: function(options) {
                return this._renderMarkers(options)
            },
            _renderMarkers: function(options) {
                options = options || this._option("markers");
                var deferred = $.Deferred(),
                    self = this;
                var markerPromises = $.map(options, function(markerOptions) {
                        return self._addMarker(markerOptions)
                    });
                $.when.apply($, markerPromises).done(function() {
                    var instances = $.map($.makeArray(arguments), function(marker) {
                            return marker.pushpin
                        });
                    deferred.resolve(false, instances)
                });
                deferred.done(function() {
                    self._fitBounds()
                });
                return deferred.promise()
            },
            _addMarker: function(options) {
                var self = this;
                return this._renderMarker(options).done(function(marker) {
                        self._markers.push(marker)
                    })
            },
            _renderMarker: function(options) {
                var d = $.Deferred(),
                    self = this;
                this._resolveLocation(options.location).done(function(location) {
                    var pushpin = new Microsoft.Maps.Pushpin(location, {icon: options.iconSrc || self._option("markerIconSrc")});
                    self._map.entities.push(pushpin);
                    var infobox = self._renderTooltip(location, options.tooltip);
                    var handler;
                    if (options.clickAction || options.tooltip) {
                        var markerClickAction = self._createAction(options.clickAction || $.noop);
                        handler = Microsoft.Maps.Events.addHandler(pushpin, "click", function() {
                            markerClickAction({location: self._normalizeLocation(location)});
                            if (infobox)
                                infobox.setOptions({visible: true})
                        })
                    }
                    self._extendBounds(location);
                    d.resolve({
                        pushpin: pushpin,
                        infobox: infobox,
                        handler: handler
                    })
                });
                return d.promise()
            },
            _renderTooltip: function(location, options) {
                if (!options)
                    return;
                options = this._parseTooltipOptions(options);
                var infobox = new Microsoft.Maps.Infobox(location, {
                        description: options.text,
                        offset: new Microsoft.Maps.Point(0, 33),
                        visible: options.visible
                    });
                this._map.entities.push(infobox, null);
                return infobox
            },
            updateRoutes: function() {
                return this._refreshRoutes()
            },
            addRoutes: function(options) {
                return this._renderRoutes(options)
            },
            _refreshRoutes: function() {
                this._clearRoutes();
                return this._renderRoutes()
            },
            _renderRoutes: function(options) {
                options = options || this._option("routes");
                var deferred = $.Deferred(),
                    self = this;
                var routePromises = $.map(options, function(routeOptions) {
                        return self._addRoute(routeOptions)
                    });
                $.when.apply($, routePromises).done(function() {
                    deferred.resolve(false, $.makeArray(arguments))
                });
                return deferred.promise()
            },
            _clearRoutes: function() {
                var self = this;
                $.each(this._routes, function(_, route) {
                    route.dispose()
                });
                this._routes = []
            },
            _addRoute: function(routeOptions) {
                var self = this;
                return this._renderRoute(routeOptions).done(function(route) {
                        self._routes.push(route)
                    })
            },
            _renderRoute: function(options) {
                var d = $.Deferred(),
                    self = this;
                var points = $.map(options.locations, function(point) {
                        return self._resolveLocation(point)
                    });
                $.when.apply($, points).done(function() {
                    var locations = $.makeArray(arguments),
                        direction = new Microsoft.Maps.Directions.DirectionsManager(self._map),
                        color = new DX.Color(options.color || self._defaultRouteColor()).toHex(),
                        routeColor = new Microsoft.Maps.Color.fromHex(color);
                    routeColor.a = (options.opacity || self._defaultRouteOpacity()) * 255;
                    direction.setRenderOptions({
                        autoUpdateMapView: false,
                        displayRouteSelector: false,
                        waypointPushpinOptions: {visible: false},
                        drivingPolylineOptions: {
                            strokeColor: routeColor,
                            strokeThickness: options.weight || self._defaultRouteWeight()
                        },
                        walkingPolylineOptions: {
                            strokeColor: routeColor,
                            strokeThickness: options.weight || self._defaultRouteWeight()
                        }
                    });
                    direction.setRequestOptions({
                        routeMode: self._movementMode(options.mode),
                        routeDraggable: false
                    });
                    $.each(locations, function(_, location) {
                        var waypoint = new Microsoft.Maps.Directions.Waypoint({location: location});
                        direction.addWaypoint(waypoint)
                    });
                    var handler = Microsoft.Maps.Events.addHandler(direction, 'directionsUpdated', function() {
                            Microsoft.Maps.Events.removeHandler(handler);
                            d.resolve(direction)
                        });
                    direction.calculateDirections()
                });
                return d.promise()
            },
            clean: function() {
                if (this._map) {
                    Microsoft.Maps.Events.removeHandler(this._viewChangeHandler);
                    Microsoft.Maps.Events.removeHandler(this._clickHandler);
                    this._clearMarkers();
                    this._clearRoutes();
                    this._map.dispose()
                }
            },
            cancelEvents: true
        }));
        if (!ui.dxMap.__internals)
            ui.dxMap.__internals = {};
        var prevRemapConstant = ui.dxMap.__internals.remapConstant || $.noop;
        ui.dxMap.__internals.remapConstant = function(variable, newValue) {
            switch (variable) {
                case"BING_URL":
                    BING_URL = newValue;
                    break;
                default:
                    prevRemapConstant.apply(this, arguments)
            }
        }
    })(jQuery, DevExpress);
    /*! Module widgets, file ui.map.google.js */
    (function($, DX, undefined) {
        var ui = DX.ui;
        var GOOGLE_MAP_READY = "_googleScriptReady",
            GOOGLE_URL = "https://maps.google.com/maps/api/js?v=3.9&sensor=false&callback=" + GOOGLE_MAP_READY;
        var googleMapsLoader;
        ui.registerMapProvider("google", ui.MapProvider.inherit({
            _mapType: function(type) {
                var mapTypes = {
                        hybrid: google.maps.MapTypeId.HYBRID,
                        roadmap: google.maps.MapTypeId.ROADMAP
                    };
                return mapTypes[type] || mapTypes.hybrid
            },
            _movementMode: function(type) {
                var movementTypes = {
                        driving: google.maps.TravelMode.DRIVING,
                        walking: google.maps.TravelMode.WALKING
                    };
                return movementTypes[type] || movementTypes.driving
            },
            _resolveLocation: function(location) {
                var d = $.Deferred();
                if (typeof location === "string") {
                    var geocoder = new google.maps.Geocoder;
                    geocoder.geocode({address: location}, function(results, status) {
                        if (status === google.maps.GeocoderStatus.OK)
                            d.resolve(results[0].geometry.location)
                    })
                }
                else if ($.isArray(location))
                    d.resolve(new google.maps.LatLng(location[0], location[1]));
                else if ($.isPlainObject(location) && $.isNumeric(location.lat) && $.isNumeric(location.lng))
                    d.resolve(new google.maps.LatLng(location.lat, location.lng));
                return d.promise()
            },
            _normalizeLocation: function(location) {
                return {
                        lat: location.lat(),
                        lng: location.lng()
                    }
            },
            load: function() {
                if (!googleMapsLoader) {
                    googleMapsLoader = $.Deferred();
                    var key = this._key("google");
                    window[GOOGLE_MAP_READY] = $.proxy(this._mapReady, this);
                    $.getScript(GOOGLE_URL + (key ? "&key=" + key : ""))
                }
                this._markers = [];
                this._routes = [];
                return googleMapsLoader.promise()
            },
            _mapReady: function() {
                try {
                    delete window[GOOGLE_MAP_READY]
                }
                catch(e) {
                    window[GOOGLE_MAP_READY] = undefined
                }
                googleMapsLoader.resolve()
            },
            render: function() {
                var deferred = $.Deferred(),
                    initPromise = $.Deferred(),
                    controls = this._option("controls");
                var options = {
                        zoom: this._option("zoom"),
                        center: new google.maps.LatLng(0, 0),
                        mapTypeId: this._mapType(this._option("type")),
                        panControl: controls,
                        zoomControl: controls,
                        mapTypeControl: controls,
                        streetViewControl: controls
                    };
                this._map = new google.maps.Map(this._$container[0], options);
                var listner = google.maps.event.addListener(this._map, 'idle', $.proxy(initPromise.resolve, initPromise));
                this._zoomChangeListener = google.maps.event.addListener(this._map, 'zoom_changed', $.proxy(this._handleZoomChange, this));
                this._centerChangeListener = google.maps.event.addListener(this._map, 'center_changed', $.proxy(this._handleCenterChange, this));
                this._clickListener = google.maps.event.addListener(this._map, 'click', $.proxy(this._handleClickAction, this));
                var locationPromise = this._renderLocation();
                var markersPromise = this._refreshMarkers();
                var routesPromise = this._renderRoutes();
                $.when(initPromise, locationPromise, markersPromise, routesPromise).done(function() {
                    google.maps.event.removeListener(listner);
                    deferred.resolve(true)
                });
                return deferred.promise()
            },
            updateDimensions: function() {
                google.maps.event.trigger(this._map, 'resize');
                return $.Deferred().resolve().promise()
            },
            updateMapType: function() {
                this._map.setMapTypeId(this._mapType(this._option("type")));
                return $.Deferred().resolve().promise()
            },
            updateLocation: function() {
                return this._renderLocation()
            },
            _handleCenterChange: function() {
                var center = this._map.getCenter();
                this._option("location", this._normalizeLocation(center))
            },
            _renderLocation: function() {
                var deferred = $.Deferred(),
                    self = this;
                this._resolveLocation(this._option("location")).done(function(location) {
                    self._map.setCenter(location);
                    deferred.resolve()
                });
                return deferred.promise()
            },
            _handleZoomChange: function() {
                this._option("zoom", this._map.getZoom())
            },
            updateZoom: function() {
                this._map.setZoom(this._option("zoom"));
                return $.Deferred().resolve().promise()
            },
            updateControls: function() {
                var controls = this._option("controls");
                this._map.setOptions({
                    panControl: controls,
                    zoomControl: controls,
                    mapTypeControl: controls,
                    streetViewControl: controls
                });
                return $.Deferred().resolve().promise()
            },
            _clearBounds: function() {
                this._bounds = null
            },
            _extendBounds: function(location) {
                if (this._bounds)
                    this._bounds.extend(location);
                else {
                    this._bounds = new google.maps.LatLngBounds;
                    this._bounds.extend(location)
                }
            },
            _fitBounds: function() {
                if (!this._bounds)
                    return;
                this._map.fitBounds(this._bounds)
            },
            updateMarkers: function() {
                return this._refreshMarkers()
            },
            _refreshMarkers: function() {
                this._clearMarkers();
                return this._renderMarkers()
            },
            _clearMarkers: function() {
                var self = this;
                this._clearBounds();
                $.each(this._markers, function(_, marker) {
                    marker.instance.setMap(null);
                    if (marker.listner)
                        google.maps.event.removeListener(marker.listner)
                });
                this._markers = []
            },
            addMarkers: function(options) {
                return this._renderMarkers(options)
            },
            _renderMarkers: function(options) {
                options = options || this._option("markers");
                var deferred = $.Deferred(),
                    self = this;
                var markerPromises = $.map(options, function(markerOptions) {
                        return self._addMarker(markerOptions)
                    });
                $.when.apply($, markerPromises).done(function() {
                    var instances = $.map($.makeArray(arguments), function(marker) {
                            return marker.instance
                        });
                    deferred.resolve(false, instances)
                });
                deferred.done(function() {
                    self._fitBounds()
                });
                return deferred.promise()
            },
            _addMarker: function(options) {
                var self = this;
                return this._renderMarker(options).done(function(marker) {
                        self._markers.push(marker)
                    })
            },
            _renderMarker: function(options) {
                var d = $.Deferred(),
                    self = this;
                this._resolveLocation(options.location).done(function(location) {
                    var marker = new google.maps.Marker({
                            position: location,
                            map: self._map,
                            icon: options.iconSrc || self._option("markerIconSrc")
                        }),
                        listner;
                    var infoWindow = self._renderTooltip(marker, options.tooltip);
                    if (options.clickAction || options.tooltip) {
                        var markerClickAction = self._createAction(options.clickAction || $.noop);
                        listner = google.maps.event.addListener(marker, "click", function() {
                            markerClickAction({location: self._normalizeLocation(location)});
                            if (infoWindow)
                                infoWindow.open(self._map, marker)
                        })
                    }
                    self._extendBounds(location);
                    d.resolve({
                        instance: marker,
                        listner: listner
                    })
                });
                return d.promise()
            },
            _renderTooltip: function(marker, options) {
                if (!options)
                    return;
                options = this._parseTooltipOptions(options);
                var infoWindow = new google.maps.InfoWindow({content: options.text});
                if (options.visible)
                    infoWindow.open(this._map, marker);
                return infoWindow
            },
            updateRoutes: function() {
                return this._refreshRoutes()
            },
            addRoutes: function(options) {
                return this._renderRoutes()
            },
            _refreshRoutes: function() {
                this._clearRoutes();
                return this._renderRoutes()
            },
            _clearRoutes: function() {
                var self = this;
                $.each(this._routes, function(_, route) {
                    route.setMap(null)
                });
                this._routes = []
            },
            _renderRoutes: function(options) {
                options = options || this._option("routes");
                var deferred = $.Deferred(),
                    self = this;
                var routePromises = $.map(options, function(routeOptions) {
                        return self._addRoute(routeOptions)
                    });
                $.when.apply($, routePromises).done(function() {
                    deferred.resolve(false, $.makeArray(arguments))
                });
                return deferred.promise()
            },
            _addRoute: function(options) {
                var self = this;
                return this._renderRoute(options).done(function(route) {
                        self._routes.push(route)
                    })
            },
            _renderRoute: function(options) {
                var d = $.Deferred(),
                    self = this,
                    directionsService = new google.maps.DirectionsService;
                var points = $.map(options.locations, function(point) {
                        return self._resolveLocation(point)
                    });
                $.when.apply($, points).done(function() {
                    var locations = $.makeArray(arguments),
                        origin = locations.shift(),
                        destination = locations.pop(),
                        waypoints = $.map(locations, function(location) {
                            return {
                                    location: location,
                                    stopover: true
                                }
                        });
                    var request = {
                            origin: origin,
                            destination: destination,
                            waypoints: waypoints,
                            optimizeWaypoints: true,
                            travelMode: self._movementMode(options.mode)
                        };
                    directionsService.route(request, function(response, status) {
                        if (status === google.maps.DirectionsStatus.OK) {
                            var color = new DX.Color(options.color || self._defaultRouteColor()).toHex(),
                                directionOptions = {
                                    directions: response,
                                    map: self._map,
                                    suppressMarkers: true,
                                    preserveViewport: true,
                                    polylineOptions: {
                                        strokeWeight: options.weight || self._defaultRouteWeight(),
                                        strokeOpacity: options.opacity || self._defaultRouteOpacity(),
                                        strokeColor: color
                                    }
                                };
                            var route = new google.maps.DirectionsRenderer(directionOptions);
                            d.resolve(route)
                        }
                    })
                });
                return d.promise()
            },
            clean: function() {
                if (this._map) {
                    google.maps.event.removeListener(this._zoomChangeListener);
                    google.maps.event.removeListener(this._centerChangeListener);
                    google.maps.event.removeListener(this._clickListener);
                    this._clearMarkers();
                    this._clearRoutes();
                    delete this._map;
                    this._$container.empty()
                }
            },
            cancelEvents: true
        }));
        if (!ui.dxMap.__internals)
            ui.dxMap.__internals = {};
        var prevRemapConstant = ui.dxMap.__internals.remapConstant || $.noop;
        ui.dxMap.__internals.remapConstant = function(variable, newValue) {
            switch (variable) {
                case"GOOGLE_URL":
                    GOOGLE_URL = newValue;
                    break;
                default:
                    prevRemapConstant.apply(this, arguments)
            }
        }
    })(jQuery, DevExpress);
    /*! Module widgets, file ui.map.googleStatic.js */
    (function($, DX, undefined) {
        var ui = DX.ui;
        var GOOGLE_STATIC_URL = "https://maps.google.com/maps/api/staticmap?";
        ui.registerMapProvider("googleStatic", ui.MapProvider.inherit({
            _locationToString: function(location) {
                return !$.isPlainObject(location) ? location.toString().replace(/ /g, "+") : location.lat + "," + location.lng
            },
            render: function() {
                return this._updateMap()
            },
            updateDimensions: function() {
                return this._updateMap()
            },
            updateMapType: function() {
                return this._updateMap()
            },
            updateLocation: function() {
                return this._updateMap()
            },
            updateZoom: function() {
                return this._updateMap()
            },
            updateControls: function() {
                return $.Deferred().resolve().promise()
            },
            updateMarkers: function() {
                return this._updateMap()
            },
            addMarkers: function() {
                return this._updateMap()
            },
            updateRoutes: function() {
                return this._updateMap()
            },
            addRoutes: function() {
                return this._updateMap()
            },
            clean: function() {
                this._$container.css("background-image", "none")
            },
            mapRendered: function() {
                return true
            },
            _updateMap: function() {
                var key = this._key("googleStatic");
                var requestOptions = ["sensor=false", "size=" + this._option("width") + "x" + this._option("height"), "maptype=" + this._option("type"), "center=" + this._locationToString(this._option("location")), "zoom=" + this._option("zoom"), this._markersSubstring()];
                requestOptions.push.apply(requestOptions, this._routeSubstrings());
                if (key)
                    requestOptions.push("key=" + this._key("googleStatic"));
                var request = GOOGLE_STATIC_URL + requestOptions.join("&");
                this._$container.css("background", "url(\"" + request + "\") no-repeat 0 0");
                return $.Deferred().resolve(true).promise()
            },
            _markersSubstring: function() {
                var self = this,
                    markers = [],
                    markerIcon = this._option("markerIconSrc");
                if (markerIcon)
                    markers.push("icon:" + markerIcon);
                $.each(this._option("markers"), function(_, marker) {
                    markers.push(self._locationToString(marker.location))
                });
                return "markers=" + markers.join("|")
            },
            _routeSubstrings: function() {
                var self = this,
                    routes = [];
                $.each(this._option("routes"), function(_, route) {
                    var color = new DX.Color(route.color || ROUTE_COLOR_DEFAULT).toHex().replace('#', '0x'),
                        opacity = Math.round((route.opacity || ROUTE_OPACITY_DEFAULT) * 255).toString(16),
                        width = route.weight || ROUTE_WEIGHT_DEFAULT,
                        locations = [];
                    $.each(route.locations, function(_, routePoint) {
                        locations.push(self._locationToString(routePoint))
                    });
                    routes.push("path=color:" + color + opacity + "|weight:" + width + "|" + locations.join("|"))
                });
                return routes
            }
        }));
        if (!ui.dxMap.__internals)
            ui.dxMap.__internals = {};
        var prevRemapConstant = ui.dxMap.__internals.remapConstant || $.noop;
        ui.dxMap.__internals.remapConstant = function(variable, newValue) {
            switch (variable) {
                case"GOOGLE_STATIC_URL":
                    GOOGLE_STATIC_URL = newValue;
                    break;
                case"GOOGLE_DIRECTIONS_URL":
                    GOOGLE_DIRECTIONS_URL = newValue;
                    break;
                default:
                    prevRemapConstant.apply(this, arguments)
            }
        }
    })(jQuery, DevExpress);
    /*! Module widgets, file ui.swipeable.js */
    (function($, DX, undefined) {
        var ui = DX.ui,
            events = ui.events,
            DX_SWIPEABLE = "dxSwipeable",
            SWIPEABLE_CLASS = "dx-swipeable",
            ACTION_TO_EVENT_MAP = {
                startAction: "dxswipestart",
                updateAction: "dxswipe",
                endAction: "dxswipeend",
                cancelAction: "dxswipecancel"
            };
        ui.registerComponent(DX_SWIPEABLE, ui.Component.inherit({
            _defaultOptions: function() {
                return $.extend(this.callBase(), {
                        elastic: true,
                        direction: "horizontal",
                        itemSizeFunc: null,
                        startAction: null,
                        updateAction: null,
                        endAction: null,
                        cancelAction: null
                    })
            },
            _render: function() {
                this.callBase();
                this._element().addClass(SWIPEABLE_CLASS);
                this._attachEventHandlers()
            },
            _attachEventHandlers: function() {
                if (this.option("disabled"))
                    return;
                var NAME = this.NAME;
                this._createEventData();
                $.each(ACTION_TO_EVENT_MAP, $.proxy(function(actionName, eventName) {
                    var action = this._createActionByOption(actionName, {
                            context: this,
                            excludeValidators: ["gesture"]
                        }),
                        eventName = events.addNamespace(eventName, NAME);
                    this._element().off(eventName).on(eventName, this._eventData, function(e) {
                        return action({jQueryEvent: e})
                    })
                }, this))
            },
            _createEventData: function() {
                this._eventData = {
                    elastic: this.option("elastic"),
                    itemSizeFunc: this.option("itemSizeFunc"),
                    direction: this.option("direction")
                }
            },
            _detachEventHanlers: function() {
                this._element().off("." + DX_SWIPEABLE)
            },
            _optionChanged: function(name) {
                switch (name) {
                    case"disabled":
                    case"startAction":
                    case"updateAction":
                    case"endAction":
                    case"cancelAction":
                    case"elastic":
                    case"itemSizeFunc":
                    case"direction":
                        this._detachEventHanlers();
                        this._attachEventHandlers();
                        break;
                    default:
                        this.callBase.apply(this, arguments)
                }
            }
        }))
    })(jQuery, DevExpress);
    /*! Module widgets, file ui.button.js */
    (function($, DX, undefined) {
        var ui = DX.ui;
        var BUTTON_CLASS = "dx-button",
            BUTTON_CONTENT_CLASS = "dx-button-content",
            BUTTON_CONTENT_SELECTOR = ".dx-button-content",
            BUTTON_TEXT_CLASS = "dx-button-text",
            BUTTON_TEXT_SELECTOR = ".dx-button-text",
            BUTTON_BACK_ARROW_CLASS = "dx-button-back-arrow",
            ICON_CLASS = "dx-icon",
            ICON_SELECTOR = ".dx-icon",
            BUTTON_FEEDBACK_HIDE_TIMEOUT = 100;
        ui.registerComponent("dxButton", ui.Widget.inherit({
            _defaultOptions: function() {
                return $.extend(this.callBase(), {
                        type: "normal",
                        text: "",
                        icon: "",
                        iconSrc: "",
                        hoverStateEnabled: true
                    })
            },
            _init: function() {
                this.callBase();
                this._feedbackHideTimeout = BUTTON_FEEDBACK_HIDE_TIMEOUT
            },
            _render: function() {
                this.callBase();
                this._element().addClass(BUTTON_CLASS).append($("<div />").addClass(BUTTON_CONTENT_CLASS));
                this._renderIcon();
                this._renderType();
                this._renderText()
            },
            _clean: function() {
                this.callBase();
                this._removeTypesCss()
            },
            _removeTypesCss: function() {
                var css = this._element().attr("class");
                css = css.replace(/\bdx-button-[-a-z0-9]+\b/gi, "");
                this._element().attr("class", css)
            },
            _renderIcon: function() {
                var contentElement = this._element().find(BUTTON_CONTENT_SELECTOR),
                    iconElement = contentElement.find(ICON_SELECTOR),
                    icon = this.option("icon"),
                    iconSrc = this.option("iconSrc");
                iconElement.remove();
                if (this.option("type") === "back" && !icon)
                    icon = "back";
                if (!icon && !iconSrc)
                    return;
                if (icon)
                    iconElement = $("<span />").addClass("dx-icon-" + icon);
                else if (iconSrc)
                    iconElement = $("<img />").attr("src", iconSrc);
                contentElement.prepend(iconElement.addClass(ICON_CLASS))
            },
            _renderType: function() {
                var type = this.option("type");
                if (type)
                    this._element().addClass("dx-button-" + type);
                if (type === "back")
                    this._element().prepend($("<span />").addClass(BUTTON_BACK_ARROW_CLASS))
            },
            _renderText: function() {
                var text = this.option("text"),
                    contentElement = this._element().find(BUTTON_CONTENT_SELECTOR),
                    back = this.option("type") === "back";
                var textElement = contentElement.find(BUTTON_TEXT_SELECTOR);
                if (!text && !back) {
                    textElement.remove();
                    return
                }
                if (!textElement.length)
                    textElement = $('<span />').addClass(BUTTON_TEXT_CLASS).appendTo(contentElement);
                textElement.text(text || DX.localization.localizeString("@Back"))
            },
            _optionChanged: function(name) {
                switch (name) {
                    case"icon":
                    case"iconSrc":
                        this._renderIcon();
                        break;
                    case"text":
                        this._renderText();
                        break;
                    case"type":
                        this._invalidate();
                        break;
                    default:
                        this.callBase.apply(this, arguments)
                }
            }
        }))
    })(jQuery, DevExpress);
    /*! Module widgets, file ui.checkBox.js */
    (function($, DX, undefined) {
        var ui = DX.ui,
            events = ui.events;
        var CHECKBOX_CLASS = "dx-checkbox",
            CHECKBOX_ICON_CLASS = "dx-checkbox-icon",
            CHECKBOX_CHECKED_CLASS = "dx-checkbox-checked",
            CHECKBOX_FEEDBACK_HIDE_TIMEOUT = 100;
        ui.registerComponent("dxCheckBox", ui.Widget.inherit({
            _defaultOptions: function() {
                return $.extend(this.callBase(), {
                        checked: false,
                        hoverStateEnabled: true
                    })
            },
            _init: function() {
                this.callBase();
                this._feedbackHideTimeout = CHECKBOX_FEEDBACK_HIDE_TIMEOUT
            },
            _render: function() {
                this.callBase();
                this._element().addClass(CHECKBOX_CLASS);
                $("<span />").addClass(CHECKBOX_ICON_CLASS).appendTo(this._element());
                this._renderValue()
            },
            _renderClick: function() {
                var self = this,
                    eventName = events.addNamespace("dxclick", this.NAME),
                    action = this._createActionByOption("clickAction", {beforeExecute: function() {
                            self.option("checked", !self.option("checked"))
                        }});
                this._element().off(eventName).on(eventName, function(e) {
                    action({jQueryEvent: e})
                })
            },
            _renderValue: function() {
                this._element().toggleClass(CHECKBOX_CHECKED_CLASS, Boolean(this.option("checked")))
            },
            _optionChanged: function(name) {
                switch (name) {
                    case"checked":
                        this._renderValue();
                        break;
                    default:
                        this.callBase.apply(this, arguments)
                }
            }
        }))
    })(jQuery, DevExpress);
    /*! Module widgets, file ui.switch.js */
    (function($, DX, undefined) {
        var ui = DX.ui,
            events = ui.events,
            fx = DX.fx;
        var SWITCH_CLASS = "dx-switch",
            SWITCH_WRAPPER_CLASS = SWITCH_CLASS + "-wrapper",
            SWITCH_INNER_CLASS = SWITCH_CLASS + "-inner",
            SWITCH_HANDLE_CLASS = SWITCH_CLASS + "-handle",
            SWITCH_ON_VALUE_CLASS = SWITCH_CLASS + "-on-value",
            SWITCH_ON_CLASS = SWITCH_CLASS + "-on",
            SWITCH_OFF_CLASS = SWITCH_CLASS + "-off",
            SWITCH_ANIMATION_DURATION = 100;
        ui.registerComponent("dxSwitch", ui.Widget.inherit({
            _defaultOptions: function() {
                return $.extend(this.callBase(), {
                        onText: Globalize.localize("dxSwitch-onText"),
                        offText: Globalize.localize("dxSwitch-offText"),
                        value: false,
                        valueChangeAction: null
                    })
            },
            _init: function() {
                this.callBase();
                this._animating = false;
                this._animationDuration = SWITCH_ANIMATION_DURATION
            },
            _render: function() {
                var element = this._element();
                this._$switchInner = $("<div />").addClass(SWITCH_INNER_CLASS);
                this._$handle = $("<div />").addClass(SWITCH_HANDLE_CLASS).appendTo(this._$switchInner);
                this._$labelOn = $("<div />").addClass(SWITCH_ON_CLASS).prependTo(this._$switchInner);
                this._$labelOff = $("<div />").addClass(SWITCH_OFF_CLASS).appendTo(this._$switchInner);
                this._$switchWrapper = $("<div />").addClass(SWITCH_WRAPPER_CLASS).append(this._$switchInner);
                element.addClass(SWITCH_CLASS).append(this._$switchWrapper);
                element.dxSwipeable({
                    elastic: false,
                    startAction: $.proxy(this._handleSwipeStart, this),
                    updateAction: $.proxy(this._handleSwipeUpdate, this),
                    endAction: $.proxy(this._handleSwipeEnd, this)
                });
                this._renderLabels();
                this.callBase();
                this._updateMarginBound();
                this._renderValue();
                this._renderValueChangeAction()
            },
            _renderValueChangeAction: function() {
                this._changeAction = this._createActionByOption("valueChangeAction", {excludeValidators: ["gesture"]})
            },
            _updateMarginBound: function() {
                this._marginBound = this._$switchWrapper.outerWidth(true) - this._$handle.width()
            },
            _renderPosition: function(state, swipeOffset) {
                var stateInt = state ? 1 : 0;
                this._$switchInner.css("marginLeft", this._marginBound * (stateInt + swipeOffset - 1))
            },
            _validateValue: function() {
                var check = this.option("value");
                if (typeof check !== "boolean")
                    this._options["value"] = !!check
            },
            _renderClick: function() {
                this.callBase();
                var eventName = events.addNamespace("dxclick", this.NAME),
                    clickAction = this._createAction($.proxy(this._handleClick, this));
                this._element().on(eventName, function(e) {
                    clickAction({jQueryEvent: e})
                })
            },
            _handleClick: function(args) {
                var self = args.component;
                if (self._animating || self._swiping)
                    return;
                self._animating = true;
                var startValue = self.option("value"),
                    endValue = !startValue;
                fx.animate(this._$switchInner, {
                    from: {marginLeft: (Number(startValue) - 1) * this._marginBound},
                    to: {marginLeft: (Number(endValue) - 1) * this._marginBound},
                    duration: self._animationDuration,
                    complete: function() {
                        self._animating = false;
                        self.option("value", endValue)
                    }
                })
            },
            _handleSwipeStart: function(e) {
                var state = this.option("value");
                e.jQueryEvent.maxLeftOffset = state ? 1 : 0;
                e.jQueryEvent.maxRightOffset = state ? 0 : 1;
                this._swiping = true
            },
            _handleSwipeUpdate: function(e) {
                this._renderPosition(this.option("value"), e.jQueryEvent.offset)
            },
            _handleSwipeEnd: function(e) {
                var self = this;
                fx.animate(this._$switchInner, {
                    to: {marginLeft: this._marginBound * (self.option("value") + e.jQueryEvent.targetOffset - 1)},
                    duration: self._animationDuration,
                    complete: function() {
                        self._swiping = false;
                        var pos = self.option("value") + e.jQueryEvent.targetOffset;
                        self.option("value", Boolean(pos))
                    }
                })
            },
            _renderValue: function() {
                this._validateValue();
                var val = this.option("value");
                this._renderPosition(val, 0);
                this._element().toggleClass(SWITCH_ON_VALUE_CLASS, val)
            },
            _renderLabels: function() {
                this._$labelOn.text(this.option("onText"));
                this._$labelOff.text(this.option("offText"))
            },
            _optionChanged: function(name, value, prevValue) {
                switch (name) {
                    case"visible":
                    case"width":
                        this._refresh();
                        break;
                    case"value":
                        this._renderValue();
                        this._changeAction(value);
                        break;
                    case"valueChangeAction":
                        this._renderValueChangeAction();
                        break;
                    case"onText":
                    case"offText":
                        this._renderLabels();
                        break;
                    default:
                        this.callBase(name, value, prevValue)
                }
            },
            _feedbackOff: function(isGestureStart) {
                if (isGestureStart)
                    return;
                this.callBase.apply(this, arguments)
            }
        }))
    })(jQuery, DevExpress);
    /*! Module widgets, file ui.editBox.js */
    (function($, DX, undefined) {
        var ui = DX.ui,
            events = ui.events;
        var EDITBOX_CLASS = "dx-editbox",
            EDITBOX_INPUT_CLASS = "dx-editbox-input",
            EDITBOX_INPUT_SELECTOR = "." + EDITBOX_INPUT_CLASS,
            EDITBOX_BORDER_CLASS = "dx-editbox-border",
            EDITBOX_PLACEHOLDER_CLASS = "dx-placeholder",
            EVENTS_LIST = ["focusIn", "focusOut", "keyDown", "keyPress", "keyUp", "change"];
        var nativePlaceholderSupport = function() {
                var check = document.createElement("input");
                return "placeholder" in check
            }();
        ui.registerComponent("dxEditBox", ui.Widget.inherit({
            _defaultOptions: function() {
                return $.extend(this.callBase(), {
                        value: "",
                        valueUpdateEvent: "change",
                        valueUpdateAction: null,
                        placeholder: "",
                        readOnly: false,
                        focusInAction: null,
                        focusOutAction: null,
                        keyDownAction: null,
                        keyPressAction: null,
                        keyUpAction: null,
                        changeAction: null,
                        enterKeyAction: null,
                        mode: "text"
                    })
            },
            _input: function() {
                return this._element().find(EDITBOX_INPUT_SELECTOR)
            },
            _render: function() {
                this._element().addClass(EDITBOX_CLASS);
                this._renderInput();
                this._renderInputType();
                this._renderValue();
                this._renderProps();
                this._renderPlaceholder();
                this._renderEvents();
                this._renderEnterKeyAction();
                this.callBase()
            },
            _renderInput: function() {
                this._element().append($("<input />").addClass(EDITBOX_INPUT_CLASS)).append($("<div />").addClass(EDITBOX_BORDER_CLASS))
            },
            _renderValue: function() {
                if (this._input().val() !== this.option("value"))
                    this._input().val(this.option("value"))
            },
            _renderProps: function() {
                this._input().prop({
                    placeholder: this.option("placeholder"),
                    readOnly: this._readOnlyPropValue(),
                    disabled: this.option("disabled")
                })
            },
            _readOnlyPropValue: function() {
                return this.option("readOnly")
            },
            _renderPlaceholder: function() {
                if (nativePlaceholderSupport)
                    return;
                var self = this,
                    placeholderText = self.option("placeholder"),
                    $input = self._input(),
                    $placeholder = $('<div />').addClass(EDITBOX_PLACEHOLDER_CLASS).addClass("dx-hide").attr("data-dx_placeholder", placeholderText),
                    startEvent = events.addNamespace("dxpointerdown", this.NAME);
                $placeholder.on(startEvent, function() {
                    $input.focus()
                });
                $input.wrap($placeholder).on("focus.dxEditBox focusin.dxEditBox", function() {
                    self._setStatePlaceholder.call(self, true)
                }).on("blur.dxEditBox focusout.dxEditBox", function() {
                    self._setStatePlaceholder.call(self, false)
                });
                self._setStatePlaceholder()
            },
            _renderEvents: function() {
                var self = this,
                    $input = self._input();
                $.each(EVENTS_LIST, function(_, event) {
                    var eventName = events.addNamespace(event.toLowerCase(), self.NAME),
                        action = self._createActionByOption(event + "Action");
                    $input.off(eventName).on(eventName, function(e) {
                        action({jQueryEvent: e})
                    })
                });
                self._renderValueUpdateEvent()
            },
            _renderValueUpdateEvent: function() {
                var valueUpdateEventName = events.addNamespace(this.option("valueUpdateEvent"), this.NAME);
                this._input().off("." + this.NAME, this._handleValueChange).on(valueUpdateEventName, $.proxy(this._handleValueChange, this));
                this._changeAction = this._createActionByOption("valueUpdateAction")
            },
            _setStatePlaceholder: function(state) {
                if (nativePlaceholderSupport)
                    return;
                var $input = this._input(),
                    $placeholder = $input.parent("." + EDITBOX_PLACEHOLDER_CLASS);
                if (state === undefined)
                    if (!$input.val() && !$input.prop("disabled") && $input.prop("placeholder"))
                        state = false;
                if ($input.val())
                    state = true;
                $placeholder.toggleClass("dx-hide", state)
            },
            _handleValueChange: function(e) {
                this._currentValueUpdateEvent = e;
                this.option("value", this._input().val());
                if (this._currentValueUpdateEvent)
                    this._dispatchChangeAction()
            },
            _renderEnterKeyAction: function() {
                if (this.option("enterKeyAction")) {
                    this._enterKeyAction = this._createActionByOption("enterKeyAction");
                    this._input().on("keyup.enterKey.dxEditBox", $.proxy(this._onKeyDownHandler, this))
                }
                else {
                    this._input().off("keyup.enterKey.dxEditBox");
                    this._enterKeyAction = undefined
                }
            },
            _onKeyDownHandler: function(e) {
                if (e.which === 13)
                    this._enterKeyAction({jQueryEvent: e})
            },
            _toggleDisabledState: function() {
                this.callBase.apply(this, arguments);
                this._renderProps()
            },
            _dispatchChangeAction: function() {
                this._changeAction({
                    actionValue: this.option("value"),
                    jQueryEvent: this._currentValueUpdateEvent
                });
                this._currentValueUpdateEvent = undefined
            },
            _updateValue: function() {
                this._renderValue();
                this._setStatePlaceholder();
                this._dispatchChangeAction()
            },
            _optionChanged: function(optionName) {
                if ($.inArray(optionName.replace("Action", ""), EVENTS_LIST) > -1) {
                    this._renderEvents();
                    return
                }
                switch (optionName) {
                    case"value":
                        this._updateValue();
                        break;
                    case"valueUpdateEvent":
                    case"valueUpdateAction":
                        this._renderValueUpdateEvent();
                        break;
                    case"readOnly":
                        this._renderProps();
                        break;
                    case"mode":
                        this._renderInputType();
                        break;
                    case"enterKeyAction":
                        this._renderEnterKeyAction();
                        break;
                    case"placeholder":
                        this._invalidate();
                        break;
                    default:
                        this.callBase.apply(this, arguments)
                }
            },
            _renderInputType: function() {
                var input = this._input();
                try {
                    input.prop("type", this.option("mode"))
                }
                catch(e) {
                    input.prop("type", "text")
                }
            },
            focus: function() {
                this._input().trigger("focus")
            }
        }));
        ui.dxEditBox.__internals = {nativePlaceholderSupport: function(newState) {
                if (arguments.length)
                    nativePlaceholderSupport = !!newState;
                return nativePlaceholderSupport
            }}
    })(jQuery, DevExpress);
    /*! Module widgets, file ui.textBox.js */
    (function($, DX, undefined) {
        var ui = DX.ui,
            events = ui.events,
            devices = DX.devices,
            ua = window.navigator.userAgent,
            ignoreCode = [8, 9, 13, 33, 34, 35, 36, 37, 38, 39, 40, 46],
            TEXTBOX_CLASS = "dx-textbox",
            SEARCHBOX_CLASS = "dx-searchbox",
            INFOCUS_CLASS = "dx-infocus",
            EMPTY_INPUT_CLASS = "dx-empty-input",
            SEARCH_ICON_CLASS = "dx-icon-search",
            CLEAR_ICON_CLASS = "dx-icon-clear",
            CLEAR_BUTTON_CLASS = "dx-clear-button-area";
        ui.registerComponent("dxTextBox", ui.dxEditBox.inherit({
            _defaultOptions: function() {
                return $.extend(this.callBase(), {
                        mode: "text",
                        maxLength: null
                    })
            },
            _render: function() {
                this.callBase();
                this._element().addClass(TEXTBOX_CLASS);
                this._renderMaxLengthHandlers();
                this._renderSearchMode()
            },
            _renderMaxLengthHandlers: function() {
                if (this._isAndroid())
                    this._input().on(events.addNamespace("keydown", this.NAME), $.proxy(this._onKeyDownAndroidHandler, this)).on(events.addNamespace("change", this.NAME), $.proxy(this._onChangeAndroidHandler, this))
            },
            _renderProps: function() {
                this.callBase();
                if (this._isAndroid())
                    return;
                var maxLength = this.option("maxLength");
                if (maxLength > 0)
                    this._input().prop("maxLength", maxLength)
            },
            _renderSearchMode: function() {
                var $element = this._$element,
                    targetIsSearchMode = this.option("mode") === "search",
                    currentIsSearchMode = this._$element.hasClass(SEARCHBOX_CLASS),
                    switchingOn = !currentIsSearchMode && targetIsSearchMode,
                    switchingOff = currentIsSearchMode && !targetIsSearchMode;
                if (switchingOn) {
                    this._renderSearchIcon();
                    this._renderClearButton();
                    this._bindInFocusSuperviser($element);
                    this._bindEmptinessSuperviser($element);
                    $element.addClass(SEARCHBOX_CLASS)
                }
                if (switchingOff) {
                    $element.removeClass(SEARCHBOX_CLASS);
                    $element.find("input").unbind("click focusin focusout");
                    this._$clearButton.remove();
                    this._$searchIcon.remove()
                }
            },
            _renderSearchIcon: function() {
                var $searchIcon = $("<span>").addClass(SEARCH_ICON_CLASS).text(this.option("placeholder"));
                this._$element.append($searchIcon);
                this._$searchIcon = $searchIcon
            },
            _renderClearButton: function() {
                var $element = this._$element,
                    $input = $element.find("input"),
                    valueUpdateEvent = this.option("valueUpdateEvent");
                var $clearButton = $("<span>").addClass(CLEAR_BUTTON_CLASS).append($("<span>").addClass(CLEAR_ICON_CLASS)).click(function() {
                        $input.val("").focus();
                        valueUpdateEvent && $input.trigger(valueUpdateEvent.split(" ")[0]);
                        $element.addClass(EMPTY_INPUT_CLASS)
                    });
                $element.append($clearButton);
                this._$clearButton = $clearButton
            },
            _bindInFocusSuperviser: function($element) {
                $element.find("input").focusin(function() {
                    $element.addClass(INFOCUS_CLASS)
                }).focusout(function() {
                    $element.removeClass(INFOCUS_CLASS)
                }).filter(":focus").addClass(INFOCUS_CLASS)
            },
            _bindEmptinessSuperviser: function($element) {
                var $input = $element.find("input"),
                    toggleEmptyClass = function() {
                        $element.toggleClass(EMPTY_INPUT_CLASS, $input.val() === "")
                    };
                $element.addClass(EMPTY_INPUT_CLASS);
                $input.bind("input", toggleEmptyClass);
                toggleEmptyClass()
            },
            _optionChanged: function(name) {
                switch (name) {
                    case"maxLength":
                        this._renderProps();
                        this._renderMaxLengthHandlers();
                        break;
                    case"mode":
                        this._renderSearchMode();
                    default:
                        this.callBase.apply(this, arguments)
                }
            },
            _onKeyDownAndroidHandler: function(e) {
                var maxLength = this.option("maxLength");
                if (maxLength) {
                    var $input = $(e.target),
                        code = e.keyCode;
                    this._cutOffExtraChar($input);
                    return $input.val().length < maxLength || $.inArray(code, ignoreCode) !== -1 || window.getSelection().toString() !== ""
                }
                else
                    return true
            },
            _onChangeAndroidHandler: function(e) {
                var $input = $(e.target);
                if (this.option("maxLength"))
                    this._cutOffExtraChar($input)
            },
            _cutOffExtraChar: function($input) {
                var maxLength = this.option("maxLength"),
                    textInput = $input.val();
                if (textInput.length > maxLength)
                    $input.val(textInput.substr(0, maxLength))
            },
            _isAndroid: function() {
                var version = devices.real.version.join(".");
                return devices.real.platform === "android" && version && /^(2\.|4\.1)/.test(version) && !/chrome/i.test(ua)
            }
        }));
        ui.dxTextBox.__internals = {
            uaAccessor: function(value) {
                if (!arguments.length)
                    return ui;
                ua = value
            },
            SEARCHBOX_CLASS: SEARCHBOX_CLASS,
            INFOCUS_CLASS: INFOCUS_CLASS,
            EMPTY_INPUT_CLASS: EMPTY_INPUT_CLASS,
            SEARCH_ICON_CLASS: SEARCH_ICON_CLASS,
            CLEAR_ICON_CLASS: CLEAR_ICON_CLASS,
            CLEAR_BUTTON_CLASS: CLEAR_BUTTON_CLASS
        }
    })(jQuery, DevExpress);
    /*! Module widgets, file ui.textArea.js */
    (function($, DX, undefined) {
        var ui = DX.ui,
            events = ui.events;
        var TEXTAREA_CLASS = "dx-textarea",
            EDITBOX_INPUT_CLASS = "dx-editbox-input",
            EDITBOX_BORDER_CLASS = "dx-editbox-border";
        ui.registerComponent("dxTextArea", ui.dxTextBox.inherit({
            _defaultOptions: function() {
                return $.extend(this.callBase(), {})
            },
            _render: function() {
                this.callBase();
                this._element().addClass(TEXTAREA_CLASS)
            },
            _renderInput: function() {
                this._element().append($("<textarea>").addClass(EDITBOX_INPUT_CLASS)).append($("<div />").addClass(EDITBOX_BORDER_CLASS));
                this._renderScrollHandler()
            },
            _renderScrollHandler: function() {
                var $input = this._input(),
                    eventY = 0;
                $input.on(events.addNamespace("dxpointerdown", this.NAME), function(e) {
                    eventY = events.eventData(e).y
                });
                $input.on(events.addNamespace("dxpointermove", this.NAME), function(e) {
                    var scrollTopPos = $input.scrollTop(),
                        scrollBottomPos = $input.prop("scrollHeight") - $input.prop("clientHeight") - scrollTopPos;
                    if (scrollTopPos === 0 && scrollBottomPos === 0)
                        return;
                    var currentEventY = events.eventData(e).y;
                    var isScrollFromTop = scrollTopPos === 0 && eventY >= currentEventY,
                        isScrollFromBottom = scrollBottomPos === 0 && eventY <= currentEventY,
                        isScrollFromMiddle = scrollTopPos > 0 && scrollBottomPos > 0;
                    if (isScrollFromTop || isScrollFromBottom || isScrollFromMiddle)
                        e.originalEvent.isScrollingEvent = true;
                    eventY = currentEventY
                })
            },
            _renderInputType: $.noop,
            _renderDimensions: function() {
                this.callBase();
                var width = this.option("width"),
                    height = this.option("height");
                this._input().width(width);
                this._input().height(height)
            }
        }))
    })(jQuery, DevExpress);
    /*! Module widgets, file ui.numberBox.js */
    (function($, DX, undefined) {
        var ui = DX.ui,
            math = Math,
            events = ui.events;
        ui.registerComponent("dxNumberBox", ui.dxEditBox.inherit({
            _defaultOptions: function() {
                return $.extend(this.callBase(), {
                        value: 0,
                        min: -Number.MAX_VALUE,
                        max: Number.MAX_VALUE,
                        mode: "number"
                    })
            },
            _render: function() {
                this.callBase();
                this._element().addClass("dx-numberbox");
                this._setInputInvalidHandler()
            },
            _renderProps: function() {
                this.callBase();
                this._input().prop({
                    min: this.option("min"),
                    max: this.option("max")
                })
            },
            _setInputInvalidHandler: function() {
                var self = this,
                    valueUpdateEvent = events.addNamespace(this.option("valueUpdateEvent"), this.NAME);
                this._input().on(valueUpdateEvent, function() {
                    var validatingInput = self._input()[0];
                    if (typeof validatingInput.checkValidity === "function")
                        validatingInput.checkValidity()
                }).focusout($.proxy(this._trimInputValue, this)).on("invalid", $.proxy(this._inputInvalidHandler, this))
            },
            _renderValue: function() {
                var value = this.option("value") ? this.option("value").toString() : this.option("value");
                if (this._input().val() !== value) {
                    var inputType = this._input().attr("type");
                    this._input().attr("type", "text");
                    this._input().val(this.option("value"));
                    this._input().attr("type", inputType)
                }
            },
            _trimInputValue: function() {
                var $input = this._input(),
                    value = $.trim($input.val());
                if (value[value.length - 1] === ".")
                    value = value.slice(0, -1);
                this._forceRefreshInputValue(value)
            },
            _inputInvalidHandler: function() {
                var $input = this._input(),
                    value = $input.val();
                if (this._oldValue) {
                    this.option("value", this._oldValue);
                    $input.val(this._oldValue);
                    this._oldValue = null;
                    return
                }
                if (value && !/,/.test(value))
                    return;
                this.option("value", "");
                $input.val("")
            },
            _handleValueChange: function() {
                var $input = this._input(),
                    value = $.trim($input.val());
                value = value.replace(",", ".");
                if (!this._validateValue(value))
                    return;
                value = this._parseValue(value);
                if (!value && value !== 0)
                    return;
                this.option("value", value);
                if ($input.val() != value)
                    $input.val(value)
            },
            _forceRefreshInputValue: function(value) {
                var $input = this._input();
                $input.val("").val(value)
            },
            _validateValue: function(value) {
                var valueUpdateEvent = events.addNamespace(this.option("valueUpdateEvent"), this.NAME),
                    $input = this._input();
                this._oldValue = null;
                if (!value) {
                    this._oldValue = this.option("value");
                    this.option("value", "");
                    return false
                }
                if (value[value.length - 1] === ".")
                    return false;
                return true
            },
            _parseValue: function(value) {
                var number = parseFloat(value);
                number = math.max(number, this.option("min"));
                number = math.min(number, this.option("max"));
                return number
            },
            _optionChanged: function(name) {
                if (name === "min" || name === "max")
                    this._renderProps(arguments);
                else
                    this.callBase.apply(this, arguments)
            }
        }))
    })(jQuery, DevExpress);
    /*! Module widgets, file ui.slider.js */
    (function($, DX, undefined) {
        var ui = DX.ui,
            events = ui.events,
            translator = DX.translator,
            utils = DX.utils;
        var SLIDER_CLASS = "dx-slider",
            SLIDER_WRAPPER_CLASS = SLIDER_CLASS + "-wrapper",
            SLIDER_HANDLE_CLASS = SLIDER_CLASS + "-handle",
            SLIDER_HANDLE_SELECTOR = "." + SLIDER_HANDLE_CLASS,
            SLIDER_BAR_CLASS = SLIDER_CLASS + "-bar",
            SLIDER_RANGE_CLASS = SLIDER_CLASS + "-range";
        ui.registerComponent("dxSlider", ui.Widget.inherit({
            _activeStateUnit: SLIDER_HANDLE_SELECTOR,
            _defaultOptions: function() {
                return $.extend(this.callBase(), {
                        min: 0,
                        max: 100,
                        step: 1,
                        value: 50
                    })
            },
            _init: function() {
                this.callBase();
                utils.windowResizeCallbacks.add(this._refreshHandler = $.proxy(this._refresh, this))
            },
            _dispose: function() {
                this.callBase();
                utils.windowResizeCallbacks.remove(this._refreshHandler)
            },
            _render: function() {
                this.callBase();
                this._$wrapper = $("<div />").addClass(SLIDER_WRAPPER_CLASS);
                this._$bar = $("<div />").addClass(SLIDER_BAR_CLASS).appendTo(this._$wrapper);
                this._$selectedRange = $("<div />").addClass(SLIDER_RANGE_CLASS).appendTo(this._$bar);
                this._$handle = $("<div />").addClass(SLIDER_HANDLE_CLASS).appendTo(this._$bar);
                this._element().addClass(SLIDER_CLASS).append(this._$wrapper);
                this._$wrapper.dxSwipeable({
                    elastic: false,
                    startAction: $.proxy(this._handleSwipeStart, this),
                    updateAction: $.proxy(this._handleSwipeUpdate, this),
                    cancelAction: $.proxy(this._handleSwipeCancel, this),
                    itemWidthFunc: $.proxy(this._itemWidthFunc, this)
                });
                this._renderValue();
                this._renderStartHandler()
            },
            _renderDimensions: function() {
                this._element().width(this.option("width"))
            },
            _renderStartHandler: function() {
                var eventName = events.addNamespace("dxpointerdown", this.NAME),
                    startAction = this._createAction($.proxy(this._handleStart, this), {excludeValidators: ["gesture"]});
                this._element().off(eventName).on(eventName, function(e) {
                    startAction({jQueryEvent: e})
                })
            },
            _itemWidthFunc: function() {
                return this._element().width()
            },
            _handleSwipeStart: function(e) {
                this._startOffset = this._currentRatio;
                e.jQueryEvent.maxLeftOffset = this._startOffset;
                e.jQueryEvent.maxRightOffset = 1 - this._startOffset
            },
            _handleSwipeUpdate: function(e) {
                this._handleValueChange(this._startOffset + e.jQueryEvent.offset)
            },
            _handleSwipeCancel: function(e) {
                this._feedbackOff()
            },
            _handleValueChange: function(ratio) {
                var min = this.option("min"),
                    max = this.option("max"),
                    step = this.option("step"),
                    newChange = ratio * (max - min),
                    newValue = min + newChange;
                if (!step || isNaN(step))
                    step = 1;
                step = parseFloat(step.toFixed(5));
                if (step === 0)
                    step = 0.00001;
                if (step < 0)
                    return;
                if (newValue === max || newValue === min)
                    this.option("value", newValue);
                else {
                    var stepChunks = (step + "").split('.'),
                        exponent = stepChunks.length > 1 ? stepChunks[1].length : exponent;
                    newValue = Number((Math.round(newChange / step) * step + min).toFixed(exponent));
                    this.option("value", this._fitValue(newValue))
                }
            },
            _fitValue: function(value) {
                value = Math.min(value, this.option("max"));
                value = Math.max(value, this.option("min"));
                return value
            },
            _handleStart: function(args) {
                var e = args.jQueryEvent;
                if (events.needSkipEvent(e))
                    return;
                this._currentRatio = (ui.events.eventData(e).x - this._$bar.offset().left) / this._$bar.width();
                this._handleValueChange(this._currentRatio)
            },
            _renderValue: function() {
                var val = this.option("value"),
                    min = this.option("min"),
                    max = this.option("max");
                if (min > max)
                    return;
                if (val < min) {
                    this.option("value", min);
                    this._currentRatio = 0;
                    return
                }
                if (val > max) {
                    this.option("value", max);
                    this._currentRatio = 1;
                    return
                }
                var handleWidth = this._$handle.outerWidth(),
                    barWidth = this._$bar.width(),
                    ratio = min === max ? 0 : (val - min) / (max - min);
                this._$selectedRange.width(ratio * barWidth);
                translator.move(this._$handle, {left: ratio * barWidth - handleWidth / 2});
                this._currentRatio = ratio
            },
            _optionChanged: function(name) {
                switch (name) {
                    case"min":
                    case"max":
                    case"step":
                    case"value":
                        this._renderValue();
                        break;
                    default:
                        this.callBase.apply(this, arguments)
                }
            },
            _feedbackOff: function(isGestureStart) {
                if (isGestureStart)
                    return;
                this.callBase.apply(this, arguments)
            }
        }))
    })(jQuery, DevExpress);
    /*! Module widgets, file ui.rangeSlider.js */
    (function($, DX, undefined) {
        var ui = DX.ui,
            events = ui.events,
            translator = DX.translator;
        var SLIDER_HANDLE_CLASS = "dx-slider-handle";
        ui.registerComponent("dxRangeSlider", ui.dxSlider.inherit({
            _defaultOptions: function() {
                return $.extend(this.callBase(), {
                        start: 40,
                        end: 60,
                        value: 50
                    })
            },
            _render: function() {
                this._$handleRight = $("<div />").addClass(SLIDER_HANDLE_CLASS);
                this.callBase();
                this._$handleRight.appendTo(this._$bar)
            },
            _handleStart: function(args) {
                var e = args.jQueryEvent;
                var eventOffsetX = events.eventData(e).x - this._$bar.offset().left,
                    leftHandleX = this._$handle.position().left,
                    rightHandleX = this._$handleRight.position().left;
                this._$handlersDistance = Math.abs(leftHandleX - rightHandleX);
                this._capturedHandle = (leftHandleX + rightHandleX) / 2 > eventOffsetX ? this._$handle : this._$handleRight;
                this.callBase(args)
            },
            _handleSwipeUpdate: function(e) {
                if (Math.abs(this.option("start") - this.option("end")) === 0 && this._$handlersDistance < this._$handle.outerWidth()) {
                    this._feedbackOff(true);
                    this._capturedHandle = e.jQueryEvent.offset <= 0 ? this._$handle : this._$handleRight;
                    this._feedbackOn(this._capturedHandle, true)
                }
                this.callBase(e)
            },
            _handleValueChange: function(ratio) {
                this.callBase(ratio);
                var option = this._capturedHandle === this._$handle ? "start" : "end",
                    start = this.option("start"),
                    end = this.option("end"),
                    newValue = this.option("value"),
                    max = this.option("max"),
                    min = this.option("min");
                if (start > max) {
                    start = max;
                    this.option("start", max)
                }
                if (start < min) {
                    start = min;
                    this.option("start", min)
                }
                if (end > max) {
                    end = max;
                    this.option("end", max)
                }
                if (newValue > end && option === "start")
                    newValue = end;
                if (newValue < start && option === "end")
                    newValue = start;
                this.option(option, newValue)
            },
            _renderValue: function() {
                var valStart = this.option("start"),
                    valEnd = this.option("end"),
                    min = this.option("min"),
                    max = this.option("max");
                if (valStart < min)
                    valStart = min;
                if (valStart > max)
                    valStart = max;
                if (valEnd > max)
                    valEnd = max;
                if (valEnd < valStart)
                    valEnd = valStart;
                var handleWidth = this._$handle.outerWidth(),
                    barWidth = this._$bar.width(),
                    ratio1 = max === min ? 0 : (valStart - min) / (max - min),
                    ratio2 = max === min ? 0 : (valEnd - min) / (max - min);
                this._$selectedRange.width((ratio2 - ratio1) * barWidth);
                translator.move(this._$selectedRange, {left: ratio1 * barWidth});
                translator.move(this._$handle, {left: ratio1 * barWidth - handleWidth / 2});
                translator.move(this._$handleRight, {left: ratio2 * barWidth - handleWidth / 2})
            },
            _optionChanged: function(name) {
                switch (name) {
                    case"start":
                    case"end":
                        this._renderValue();
                        break;
                    default:
                        this.callBase.apply(this, arguments)
                }
            }
        }))
    })(jQuery, DevExpress);
    /*! Module widgets, file ui.radioGroup.js */
    (function($, DX, undefined) {
        var ui = DX.ui,
            events = ui.events;
        var RADIO_GROUP_CLASS = "dx-radio-group",
            RADIO_GROUP_VERTICAL_CLASS = "dx-radio-group-vertical",
            RADIO_GROUP_HORIZONTAL_CLASS = "dx-radio-group-horizontal",
            RADIO_BUTTON_CLASS = "dx-radio-button",
            RADIO_BUTTON_SELECTOR = "." + RADIO_BUTTON_CLASS,
            RADIO_BUTTON_VALUE_CLASS = "dx-radio-button-value",
            RADIO_VALUE_CONTAINER_CLASS = "dx-radio-value-container",
            RADIO_BUTTON_ACTIVE_STATE = "dx-state-active",
            RADIO_BUTTON_CHECKED_CLASS = "dx-radio-button-checked",
            RADIO_BUTTON_DATA_KEY = "dxRadioButtonData",
            RADIO_FEEDBACK_HIDE_TIMEOUT = 100;
        ui.registerComponent("dxRadioGroup", ui.SelectableCollectionWidget.inherit({
            _activeStateUnit: RADIO_BUTTON_SELECTOR,
            _defaultOptions: function() {
                return $.extend(this.callBase(), {
                        layout: "vertical",
                        value: undefined,
                        valueExpr: null,
                        hoverStateEnabled: true
                    })
            },
            _itemClass: function() {
                return RADIO_BUTTON_CLASS
            },
            _itemDataKey: function() {
                return RADIO_BUTTON_DATA_KEY
            },
            _itemContainer: function() {
                return this._element()
            },
            _init: function() {
                this.callBase();
                if (!this._dataSource)
                    this._itemsToDataSource();
                this._feedbackHideTimeout = RADIO_FEEDBACK_HIDE_TIMEOUT
            },
            _itemsToDataSource: function() {
                this._dataSource = new DevExpress.data.DataSource(this.option("items"))
            },
            _render: function() {
                this._element().addClass(RADIO_GROUP_CLASS);
                this._compileValueGetter();
                this.callBase();
                this._renderLayout();
                this._renderValue()
            },
            _compileValueGetter: function() {
                this._valueGetter = DX.data.utils.compileGetter(this._valueGetterExpr())
            },
            _valueGetterExpr: function() {
                return this.option("valueExpr") || this._dataSource && this._dataSource._store._key || "this"
            },
            _renderLayout: function() {
                var layout = this.option("layout");
                this._element().toggleClass(RADIO_GROUP_VERTICAL_CLASS, layout === "vertical");
                this._element().toggleClass(RADIO_GROUP_HORIZONTAL_CLASS, layout === "horizontal")
            },
            _renderValue: function() {
                this.option("value") ? this._setIndexByValue() : this._setValueByIndex()
            },
            _setIndexByValue: function(value) {
                var self = this;
                value = value === undefined ? self.option("value") : value;
                self._searchValue(value).done(function(item) {
                    if (self._dataSource.isLoaded())
                        self._setIndexByItem(item);
                    else
                        self._dataSource.load().done(function() {
                            self._setIndexByItem(item)
                        })
                })
            },
            _setIndexByItem: function(item) {
                this.option("selectedIndex", $.inArray(item, this._dataSource.items()))
            },
            _searchValue: function(value) {
                var self = this,
                    store = self._dataSource.store(),
                    valueExpr = self._valueGetterExpr();
                var deffered = $.Deferred();
                if (valueExpr === store.key() || store instanceof DX.data.CustomStore)
                    store.byKey(value).done(function(result) {
                        deffered.resolveWith(self, [result])
                    });
                else
                    store.load({filter: [valueExpr, value]}).done(function(result) {
                        deffered.resolveWith(self, result)
                    });
                return deffered.promise()
            },
            _setValueByIndex: function() {
                var index = this.option("selectedIndex"),
                    $items = this._itemElements();
                if (index < 0 || index >= $items.length)
                    return undefined;
                var itemElement = this._selectedItemElement(index),
                    itemData = this._getItemData(itemElement);
                this.option("value", this._getItemValue(itemData))
            },
            _getItemValue: function(item) {
                return this._valueGetter(item) || item.text
            },
            _renderSelectedIndex: function(index) {
                var $items = this._itemElements();
                if (index >= 0 && index < $items.length) {
                    var $selectedItem = $items.eq(index),
                        $radioGroup = $selectedItem.closest("." + RADIO_GROUP_CLASS);
                    $radioGroup.find(RADIO_BUTTON_SELECTOR).removeClass(RADIO_BUTTON_CHECKED_CLASS);
                    $selectedItem.closest(RADIO_BUTTON_SELECTOR).addClass(RADIO_BUTTON_CHECKED_CLASS)
                }
            },
            _createItemByRenderer: function(itemRenderer, renderArgs) {
                var $itemElement = this.callBase.apply(this, arguments);
                this._renderInput($itemElement, renderArgs.item);
                return $itemElement
            },
            _createItemByTemplate: function(itemTemplate, renderArgs) {
                var $itemElement = this.callBase.apply(this, arguments);
                this._renderInput($itemElement, renderArgs.item);
                return $itemElement
            },
            _renderInput: function($element, item) {
                if (item.html)
                    return;
                var $radio = $("<div>").addClass(RADIO_BUTTON_VALUE_CLASS),
                    $radioContainer = $("<div>").append($radio).addClass(RADIO_VALUE_CONTAINER_CLASS);
                $element.prepend($radioContainer)
            },
            _optionChanged: function(name, value) {
                switch (name) {
                    case"value":
                        this._setIndexByValue(value);
                        break;
                    case"selectedIndex":
                        this.callBase.apply(this, arguments);
                        this._setValueByIndex();
                        break;
                    case"layout":
                        this._renderLayout();
                        break;
                    case"valueExpr":
                        this._compileValueGetter();
                        this._setValueByIndex();
                        break;
                    default:
                        this.callBase.apply(this, arguments)
                }
            }
        }))
    })(jQuery, DevExpress);
    /*! Module widgets, file ui.tabs.js */
    (function($, DX, undefined) {
        var ui = DX.ui,
            events = ui.events,
            TABS_CLASS = "dx-tabs",
            TABS_WRAPPER_CLASS = "dx-indent-wrapper",
            TABS_ITEM_CLASS = "dx-tab",
            TABS_ITEM_SELECTOR = ".dx-tab",
            TABS_ITEM_SELECTED_CLASS = "dx-tab-selected",
            TABS_ITEM_TEXT_CLASS = "dx-tab-text",
            ICON_CLASS = "dx-icon",
            TABS_ITEM_DATA_KEY = "dxTabData",
            FEEDBACK_HIDE_TIMEOUT = 100;
        ui.registerComponent("dxTabs", ui.SelectableCollectionWidget.inherit({
            _activeStateUnit: TABS_ITEM_SELECTOR,
            _defaultOptions: function() {
                return $.extend(this.callBase(), {})
            },
            _init: function() {
                this.callBase();
                this._feedbackHideTimeout = FEEDBACK_HIDE_TIMEOUT
            },
            _itemClass: function() {
                return TABS_ITEM_CLASS
            },
            _itemDataKey: function() {
                return TABS_ITEM_DATA_KEY
            },
            _itemRenderDefault: function(item, index, itemElement) {
                this.callBase(item, index, itemElement);
                if (item.html)
                    return;
                var text = item.text,
                    icon = item.icon,
                    iconSrc = item.iconSrc,
                    iconElement;
                if (text)
                    itemElement.wrapInner($("<span />").addClass(TABS_ITEM_TEXT_CLASS));
                if (icon)
                    iconElement = $("<span />").addClass(ICON_CLASS + "-" + icon);
                else if (iconSrc)
                    iconElement = $("<img />").attr("src", iconSrc);
                if (iconElement)
                    iconElement.addClass(ICON_CLASS).prependTo(itemElement)
            },
            _render: function() {
                this.callBase();
                this._element().addClass(TABS_CLASS);
                this._renderWrapper()
            },
            _renderWrapper: function() {
                this._element().wrapInner($("<div />").addClass(TABS_WRAPPER_CLASS))
            },
            _renderSelectedIndex: function(current, previous) {
                var $tabs = this._itemElements();
                if (previous >= 0)
                    $tabs.eq(previous).removeClass(TABS_ITEM_SELECTED_CLASS);
                if (current >= 0)
                    $tabs.eq(current).addClass(TABS_ITEM_SELECTED_CLASS)
            }
        }))
    })(jQuery, DevExpress);
    /*! Module widgets, file ui.navBar.js */
    (function($, DX, undefined) {
        var ui = DX.ui,
            NAVBAR_CLASS = "dx-navbar",
            NABAR_ITEM_CLASS = "dx-nav-item",
            NAVBAR_ITEM_CONTENT_CLASS = "dx-nav-item-content";
        ui.registerComponent("dxNavBar", ui.dxTabs.inherit({
            _render: function() {
                this.callBase();
                this._element().addClass(NAVBAR_CLASS)
            },
            _renderItem: function(index, item) {
                var itemElement = this.callBase(index, item);
                return itemElement.addClass(NABAR_ITEM_CLASS).wrapInner($("<div />").addClass(NAVBAR_ITEM_CONTENT_CLASS))
            }
        }))
    })(jQuery, DevExpress);
    /*! Module widgets, file ui.pivotTabs.js */
    (function($, DX, undefined) {
        var ui = DX.ui,
            fx = DX.fx,
            translator = DX.translator,
            events = ui.events;
        var PIVOT_TABS_CLASS = "dx-pivottabs",
            PIVOT_TAB_CLASS = "dx-pivottabs-tab",
            PIVOT_TAB_SELECTED_CLASS = "dx-pivottabs-tab-selected",
            PIVOT_GHOST_TAB_CLASS = "dx-pivottabs-ghosttab",
            PIVOT_TAB_DATA_KEY = "dxPivotTabData",
            PIVOT_TAB_MOVE_DURATION = 200,
            PIVOT_TAB_MOVE_EASING = "cubic-bezier(.40, .80, .60, 1)";
        var animation = {
                moveTo: function($tab, position, completeAction) {
                    return fx.animate($tab, {
                            type: "slide",
                            to: {left: position},
                            duration: PIVOT_TAB_MOVE_DURATION,
                            easing: PIVOT_TAB_MOVE_EASING,
                            complete: completeAction
                        })
                },
                slideAppear: function($tab, position) {
                    return fx.animate($tab, {
                            type: "slide",
                            to: {
                                left: position,
                                opacity: 1
                            },
                            duration: PIVOT_TAB_MOVE_DURATION,
                            easing: PIVOT_TAB_MOVE_EASING
                        })
                },
                slideDisappear: function($tab, position) {
                    return fx.animate($tab, {
                            type: "slide",
                            to: {
                                left: position,
                                opacity: 0
                            },
                            duration: PIVOT_TAB_MOVE_DURATION,
                            easing: PIVOT_TAB_MOVE_EASING
                        })
                }
            };
        var completeAnimation = function(elements) {
                if (!elements)
                    return;
                $.each(elements, function(_, element) {
                    fx.stop(element, true)
                })
            };
        var stopAnimation = function(elements) {
                $.each(elements, function(_, element) {
                    fx.stop(element)
                })
            };
        ui.registerComponent("dxPivotTabs", ui.SelectableCollectionWidget.inherit({
            _defaultOptions: function() {
                return $.extend(this.callBase(), {
                        selectedIndex: 0,
                        prepareAction: null,
                        updatePositionAction: null,
                        rollbackAction: null,
                        completeAction: null
                    })
            },
            _itemClass: function() {
                return PIVOT_TAB_CLASS
            },
            _itemDataKey: function() {
                return PIVOT_TAB_DATA_KEY
            },
            _itemContainer: function() {
                return this._element()
            },
            _init: function() {
                this.callBase();
                this._initGhostTab();
                this._initSwipeHandlers();
                this._initActions()
            },
            _initGhostTab: function() {
                this._$ghostTab = $("<div>").addClass(PIVOT_GHOST_TAB_CLASS)
            },
            _initActions: function() {
                var excludeValidators = {excludeValidators: ["gesture"]};
                this._updatePositionAction = this._createActionByOption("updatePositionAction", excludeValidators);
                this._rollbackAction = this._createActionByOption("rollbackAction", excludeValidators);
                this._completeAction = this._createActionByOption("completeAction", excludeValidators);
                this._prepareAction = this._createActionByOption("prepareAction", excludeValidators)
            },
            _render: function() {
                this._element().addClass(PIVOT_TABS_CLASS);
                this.callBase();
                this._renderGhostTab()
            },
            _dispose: function() {
                this.callBase();
                stopAnimation(this._allTabElements())
            },
            _renderGhostTab: function() {
                this._itemContainer().append(this._$ghostTab);
                this._toggleGhostTab(false)
            },
            _toggleGhostTab: function(visible) {
                var $ghostTab = this._$ghostTab;
                if (visible) {
                    this._updateGhostTabContent();
                    $ghostTab.css("opacity", 1)
                }
                else
                    $ghostTab.css("opacity", 0)
            },
            _isGhostTabVisible: function() {
                return this._$ghostTab.css("opacity") == 1
            },
            _updateGhostTabContent: function(prevIndex) {
                prevIndex = prevIndex === undefined ? this._previousIndex() : prevIndex;
                var $ghostTab = this._$ghostTab,
                    $items = this._itemElements();
                $ghostTab.html($items.eq(prevIndex).html())
            },
            _updateTabsPositions: function(offset) {
                var $tabs = this._allTabElements(),
                    offset = this._applyOffsetBoundaries(offset),
                    isRightSwipeHandled = offset > 0,
                    tabPositions = this._calculateTabPositions(isRightSwipeHandled ? "replace" : "append");
                this._moveTabs(tabPositions, offset);
                this._toggleGhostTab(isRightSwipeHandled)
            },
            _moveTabs: function(positions, offset) {
                offset = offset || 0;
                var $tabs = this._allTabElements();
                $tabs.each(function(index) {
                    translator.move($(this), {left: positions[index] + offset})
                })
            },
            _applyOffsetBoundaries: function(offset) {
                offset = offset || 0;
                var maxOffset = offset > 0 ? this._maxRightOffset : this._maxLeftOffset;
                return offset * maxOffset
            },
            _animateRollback: function() {
                var self = this,
                    $tabs = this._itemElements(),
                    positions = this._calculateTabPositions("prepend");
                if (this._isGhostTabVisible()) {
                    this._swapGhostWithTab($tabs.eq(this._previousIndex()));
                    animation.moveTo(this._$ghostTab, positions[this._indexBoundary()], function() {
                        self._toggleGhostTab(false)
                    })
                }
                $tabs.each(function(index) {
                    animation.moveTo($(this), positions[index])
                })
            },
            _animateComplete: function(newIndex, currentIndex) {
                var self = this,
                    $tabs = this._itemElements(),
                    isRightSwipeHandled = this._isGhostTabVisible();
                $tabs.eq(currentIndex).removeClass(PIVOT_TAB_SELECTED_CLASS);
                var animations = isRightSwipeHandled ? this._animateIndexDecreasing(newIndex) : this._animateIndexIncreasing(newIndex);
                $tabs.eq(newIndex).addClass(PIVOT_TAB_SELECTED_CLASS);
                animations.done(function() {
                    self._indexChangeOnAnimation = true;
                    self.option("selectedIndex", newIndex);
                    self._indexChangeOnAnimation = false
                })
            },
            _animateIndexDecreasing: function(newIndex) {
                var $tabs = this._itemElements(),
                    positions = this._calculateTabPositions("append", newIndex),
                    animations = [];
                $tabs.each(function(index) {
                    animations.push(animation.moveTo($(this), positions[index]))
                });
                animations.push(animation.slideDisappear(this._$ghostTab, positions[this._indexBoundary()]));
                return $.when.apply($, animations)
            },
            _animateIndexIncreasing: function(newIndex) {
                var self = this,
                    $tabs = this._itemElements(),
                    positions = this._calculateTabPositions("prepend", newIndex),
                    previousIndex = this._previousIndex(newIndex),
                    isLeftSwipeHandled = translator.locate($tabs.eq(previousIndex)).left < 0,
                    animations = [];
                if (!isLeftSwipeHandled)
                    this._moveTabs(this._calculateTabPositions("append", previousIndex));
                this._updateGhostTabContent(previousIndex);
                this._swapGhostWithTab($tabs.eq(previousIndex));
                $tabs.each(function(index) {
                    var $tab = $(this),
                        newPosition = positions[index];
                    animations.push(index === previousIndex ? animation.slideAppear($tab, newPosition) : animation.moveTo($tab, newPosition))
                });
                animations.push(animation.moveTo(this._$ghostTab, positions[this._indexBoundary()], function() {
                    self._toggleGhostTab(false)
                }));
                return $.when.apply($, animations)
            },
            _swapGhostWithTab: function($tab) {
                var $ghostTab = this._$ghostTab,
                    lastTabPosition = translator.locate($tab).left,
                    lastTabOpacity = $tab.css("opacity");
                translator.move($tab, {left: translator.locate($ghostTab).left});
                $tab.css("opacity", $ghostTab.css("opacity"));
                translator.move($ghostTab, {left: lastTabPosition});
                $ghostTab.css("opacity", lastTabOpacity)
            },
            _calculateTabPositions: function(ghostPosition, index) {
                index = index === undefined ? this.option("selectedIndex") : index;
                var mark = index + ghostPosition;
                if (this._calculetedPositionsMark !== mark) {
                    this._calculetedPositions = this._calculateTabPositionsImpl(index, ghostPosition);
                    this._calculetedPositionsMark = mark
                }
                return this._calculetedPositions
            },
            _calculateTabPositionsImpl: function(currentIndex, ghostPosition) {
                var prevIndex = this._normalizeIndex(currentIndex - 1),
                    $tabs = this._itemElements(),
                    widths = [],
                    nextPosition = 0,
                    positions = [];
                $tabs.each(function() {
                    widths.push($(this).outerWidth())
                });
                var calculateTabPosition = function(currentIndex, width) {
                        positions.splice(currentIndex, 0, nextPosition);
                        nextPosition += width
                    };
                $.each(widths.slice(currentIndex), calculateTabPosition);
                $.each(widths.slice(0, currentIndex), calculateTabPosition);
                switch (ghostPosition) {
                    case"replace":
                        var lastTabPosition = positions[prevIndex];
                        positions.splice(prevIndex, 1, -widths[prevIndex]);
                        positions.push(lastTabPosition);
                        break;
                    case"prepend":
                        positions.push(-widths[prevIndex]);
                        break;
                    case"append":
                        positions.push(nextPosition);
                        break
                }
                return positions
            },
            _allTabElements: function() {
                return this._itemContainer().find("." + PIVOT_TAB_CLASS + ", ." + PIVOT_GHOST_TAB_CLASS)
            },
            _initSwipeHandlers: function() {
                this._element().on(events.addNamespace("dxswipestart", this.NAME), $.proxy(this._swipeStartHandler, this)).on(events.addNamespace("dxswipe", this.NAME), $.proxy(this._swipeUpdateHandler, this)).on(events.addNamespace("dxswipeend", this.NAME), $.proxy(this._swipeEndHandler, this))
            },
            _swipeStartHandler: function(e) {
                this._prepareAnimation();
                this._prepareAction();
                if (this.option("disabled") || this._indexBoundary() <= 1)
                    e.cancel = true
            },
            _prepareAnimation: function() {
                this._stopAnimation()
            },
            _stopAnimation: function() {
                completeAnimation(this._allTabElements())
            },
            _swipeUpdateHandler: function(e) {
                var offset = e.offset;
                this._updatePositionAction({offset: offset});
                this._updateTabsPositions(offset)
            },
            _swipeEndHandler: function(e) {
                var selectedIndex = this.option("selectedIndex"),
                    targetOffset = e.targetOffset;
                if (targetOffset === 0) {
                    this._animateRollback();
                    this._rollbackAction()
                }
                else {
                    var newIndex = this._normalizeIndex(selectedIndex - targetOffset);
                    this._animateComplete(newIndex, selectedIndex);
                    this._completeAction({newIndex: newIndex})
                }
            },
            _previousIndex: function(atIndex) {
                atIndex = atIndex === undefined ? this.option("selectedIndex") : atIndex;
                return this._normalizeIndex(atIndex - 1)
            },
            _normalizeIndex: function(index) {
                var boundary = this._indexBoundary();
                if (index < 0)
                    index = boundary + index;
                if (index >= boundary)
                    index = index - boundary;
                return index
            },
            _indexBoundary: function() {
                return this.option("items").length
            },
            _onItemSelectAction: function(newIndex) {
                this._prepareAnimation();
                this._prepareAction();
                this._animateComplete(newIndex, this.option("selectedIndex"));
                this._completeAction({newIndex: newIndex})
            },
            _renderSelectedIndex: function(current, previous) {
                var $tabs = this._itemElements();
                this._calculateMaxOffsets(current);
                if (!this._indexChangeOnAnimation) {
                    $tabs.eq(previous).removeClass(PIVOT_TAB_SELECTED_CLASS);
                    this._updateTabsPositions();
                    $tabs.eq(current).addClass(PIVOT_TAB_SELECTED_CLASS)
                }
            },
            _calculateMaxOffsets: function(index) {
                var $tabs = this._itemElements();
                this._maxLeftOffset = $tabs.eq(index).outerWidth();
                this._maxRightOffset = $tabs.eq(this._previousIndex(index)).outerWidth()
            },
            _itemRenderDefault: function(item, index, $itemElement) {
                var $itemText = $("<span>").text(item.title);
                $itemElement.html($itemText)
            },
            _optionChanged: function(name) {
                switch (name) {
                    case"items":
                        delete this._calculetedPositionsMark;
                        this.callBase.apply(this, arguments);
                        break;
                    case"prepareAction":
                    case"updatePositionAction":
                    case"rollbackAction":
                    case"completeAction":
                        this._initActions();
                        break;
                    default:
                        this.callBase.apply(this, arguments)
                }
            },
            prepare: function() {
                this._prepareAnimation()
            },
            updatePosition: function(offset) {
                this._updateTabsPositions(offset)
            },
            rollback: function() {
                this._animateRollback()
            },
            complete: function(newIndex) {
                this._animateComplete(newIndex, this.option("selectedIndex"))
            }
        }));
        ui.dxPivotTabs.__internals = {animation: animation}
    })(jQuery, DevExpress);
    /*! Module widgets, file ui.pivot.js */
    (function($, DX, undefined) {
        var ui = DX.ui,
            events = ui.events,
            fx = DX.fx,
            translator = DX.translator;
        var PIVOT_CLASS = "dx-pivot",
            PIVOT_TABS_CONTAINER_CLASS = "dx-pivottabs-container",
            PIVOT_ITEM_CONTAINER_CLASS = "dx-pivot-itemcontainer",
            PIVOT_ITEM_WRAPPER_CLASS = "dx-pivot-itemwrapper",
            PIVOT_ITEM_CLASS = "dx-pivot-item",
            PIVOT_ITEM_HIDDEN_CLASS = "dx-pivot-item-hidden",
            PIVOT_ITEM_DATA_KEY = "dxPivotItemData",
            PIVOT_RETURN_BACK_DURATION = 200,
            PIVOT_SLIDE_AWAY_DURATION = 50,
            PIVOT_SLIDE_BACK_DURATION = 250,
            PIVOT_SLIDE_BACK_EASING = "cubic-bezier(.10, 1, 0, 1)";
        var animation = {
                returnBack: function($element) {
                    fx.animate($element, {
                        type: "slide",
                        to: {left: 0},
                        duration: PIVOT_RETURN_BACK_DURATION
                    })
                },
                slideAway: function($element, position, completeAction) {
                    fx.animate($element, {
                        type: "slide",
                        to: {left: position},
                        duration: PIVOT_SLIDE_AWAY_DURATION,
                        complete: completeAction
                    })
                },
                slideBack: function($element) {
                    fx.animate($element, {
                        type: "slide",
                        to: {left: 0},
                        easing: PIVOT_SLIDE_BACK_EASING,
                        duration: PIVOT_SLIDE_BACK_DURATION
                    })
                }
            };
        var completeAnimation = function(element) {
                fx.stop(element, true)
            };
        var stopAnimation = function(element) {
                fx.stop(element)
            };
        ui.registerComponent("dxPivot", ui.SelectableCollectionWidget.inherit({
            _defaultOptions: function() {
                return $.extend(this.callBase(), {selectedIndex: 0})
            },
            _itemClass: function() {
                return PIVOT_ITEM_CLASS
            },
            _itemDataKey: function() {
                return PIVOT_ITEM_DATA_KEY
            },
            _itemContainer: function() {
                return this._$itemWrapper
            },
            _init: function() {
                this.callBase();
                this._initTabs();
                this._initItemContainer();
                this._clearItemsCache();
                this._initSwipeHandlers()
            },
            _initItemContainer: function() {
                var $itemContainer = $("<div>").addClass(PIVOT_ITEM_CONTAINER_CLASS);
                this._element().append($itemContainer);
                this._$itemWrapper = $("<div>").addClass(PIVOT_ITEM_WRAPPER_CLASS);
                $itemContainer.append(this._$itemWrapper)
            },
            _clearItemsCache: function() {
                this._itemsCache = []
            },
            _initTabs: function() {
                var self = this,
                    $tabsContainer = $("<div>").addClass(PIVOT_TABS_CONTAINER_CLASS);
                this._element().append($tabsContainer);
                $tabsContainer.dxPivotTabs({
                    items: this.option("items"),
                    selectedIndex: this.option("selectedIndex"),
                    prepareAction: function() {
                        self._prepareAnimation()
                    },
                    updatePositionAction: function(args) {
                        self._updateContentPosition(args.offset)
                    },
                    rollbackAction: function() {
                        self._animateRollback()
                    },
                    completeAction: function(args) {
                        self._animateComplete(args.newIndex)
                    }
                });
                this._tabs = $tabsContainer.dxPivotTabs("instance")
            },
            _render: function() {
                this._element().addClass(PIVOT_CLASS);
                this.callBase()
            },
            _renderCurrentContent: function(currentIndex, previousIndex) {
                var itemsCache = this._itemsCache;
                itemsCache[previousIndex] = this._selectedItemElement();
                itemsCache[previousIndex].addClass(PIVOT_ITEM_HIDDEN_CLASS);
                if (itemsCache[currentIndex])
                    itemsCache[currentIndex].removeClass(PIVOT_ITEM_HIDDEN_CLASS);
                else
                    this._renderContent()
            },
            _updateContentPosition: function(offset) {
                translator.move(this._$itemWrapper, {left: this._calculatePixelOffset(offset)})
            },
            _animateRollback: function() {
                animation.returnBack(this._$itemWrapper)
            },
            _animateComplete: function(newIndex) {
                var self = this,
                    $itemWrapper = this._$itemWrapper,
                    isRightSwipeHandled = this._isRightSwipeHandled(),
                    intermediatePosition = isRightSwipeHandled ? this._itemWrapperWidth : -this._itemWrapperWidth;
                animation.slideAway($itemWrapper, intermediatePosition, function() {
                    translator.move($itemWrapper, {left: -intermediatePosition});
                    self._indexChangeOnAnimation = true;
                    self.option("selectedIndex", newIndex);
                    self._indexChangeOnAnimation = false;
                    animation.slideBack($itemWrapper)
                })
            },
            _calculatePixelOffset: function(offset) {
                offset = offset || 0;
                return offset * this._itemWrapperWidth
            },
            _isRightSwipeHandled: function() {
                return translator.locate(this._$itemWrapper).left > 0
            },
            _initSwipeHandlers: function() {
                this._element().on(events.addNamespace("dxswipestart", this.NAME), $.proxy(this._swipeStartHandler, this)).on(events.addNamespace("dxswipe", this.NAME), $.proxy(this._swipeUpdateHandler, this)).on(events.addNamespace("dxswipeend", this.NAME), $.proxy(this._swipeEndHandler, this))
            },
            _swipeStartHandler: function(e) {
                this._prepareAnimation();
                this._tabs.prepare();
                if (this.option("disabled") || this._indexBoundary() <= 1)
                    e.cancel = true
            },
            _prepareAnimation: function() {
                this._stopAnimation();
                this._itemWrapperWidth = this._$itemWrapper.outerWidth()
            },
            _stopAnimation: function() {
                completeAnimation(this._$itemWrapper);
                completeAnimation(this._$itemWrapper)
            },
            _swipeUpdateHandler: function(e) {
                var offset = e.offset;
                this._updateContentPosition(offset);
                this._tabs.updatePosition(offset)
            },
            _swipeEndHandler: function(e) {
                var selectedIndex = this.option("selectedIndex"),
                    targetOffset = e.targetOffset;
                if (targetOffset === 0) {
                    this._animateRollback();
                    this._tabs.rollback()
                }
                else {
                    var newIndex = this._normalizeIndex(selectedIndex - targetOffset);
                    this._animateComplete(newIndex, selectedIndex);
                    this._tabs.complete(newIndex)
                }
            },
            _renderSelectedIndex: function(current, previous) {
                if (previous !== undefined)
                    this._renderCurrentContent(current, previous)
            },
            _normalizeIndex: function(index) {
                var boundary = this._indexBoundary();
                if (index < 0)
                    index = boundary + index;
                if (index >= boundary)
                    index = index - boundary;
                return index
            },
            _indexBoundary: function() {
                return this.option("items").length
            },
            _renderContentImpl: function() {
                var items = this.option("items"),
                    selectedIndex = this.option("selectedIndex");
                if (items.length)
                    this._renderItems([items[selectedIndex]])
            },
            _selectedItemElement: function() {
                return this._$itemWrapper.children(":not(." + PIVOT_ITEM_HIDDEN_CLASS + ")")
            },
            _dispose: function() {
                this.callBase();
                stopAnimation(this._$itemWrapper)
            },
            _optionChanged: function(name, value) {
                switch (name) {
                    case"disabled":
                        this._tabs.option("disabled", value);
                        this.callBase.apply(this, arguments);
                        break;
                    case"selectedIndex":
                        if (!this._indexChangeOnAnimation)
                            this._tabs.option("selectedIndex", value);
                        this.callBase.apply(this, arguments);
                        break;
                    case"items":
                        this._tabs.option("items", value);
                        this._clearItemsCache();
                        this.callBase.apply(this, arguments);
                        break;
                    default:
                        this.callBase.apply(this, arguments)
                }
            }
        }));
        ui.dxPivot.__internals = {animation: animation}
    })(jQuery, DevExpress);
    /*! Module widgets, file ui.toolbar.js */
    (function($, DX, undefined) {
        var ui = DX.ui,
            fx = DX.fx,
            utils = DX.utils,
            translator = DX.translator;
        var TOOLBAR_CLASS = "dx-toolbar",
            TOOLBAR_BOTTOM_CLASS = "dx-toolbar-bottom",
            TOOLBAR_MINI_CLASS = "dx-toolbar-mini",
            TOOLBAR_ITEM_CLASS = "dx-toolbar-item",
            TOOLBAR_LABEL_CLASS = "dx-toolbar-label",
            TOOLBAR_BUTTON_CLASS = "dx-toolbar-button",
            TOOLBAR_MENU_CONTAINER_CLASS = "dx-toolbar-menu-container",
            TOOLBAR_MENU_BUTTON_CLASS = "dx-toolbar-menu-button",
            TOOLBAR_ITEMS_CONTAINER_CLASS = "dx-toolbar-items-container",
            TOOLBAR_LABEL_SELECTOR = "." + TOOLBAR_LABEL_CLASS,
            TOOLBAR_ITEM_DATA_KEY = "dxToolbarItemDataKey",
            SUBMENU_SWIPE_EASING = "easeOutCubic",
            SUBMENU_HIDE_DURATION = 200,
            SUBMENU_SHOW_DURATION = 400;
        var slideSubmenu = function($element, position, isShowAnimation) {
                var duration = isShowAnimation ? SUBMENU_SHOW_DURATION : SUBMENU_HIDE_DURATION;
                fx.animate($element, {
                    type: "slide",
                    to: {top: position},
                    easing: SUBMENU_SWIPE_EASING,
                    duration: duration
                })
            };
        ui.registerComponent("dxToolbar", ui.CollectionContainerWidget.inherit({
            _defaultOptions: function() {
                return $.extend(this.callBase(), {
                        menuItemRender: null,
                        menuItemTemplate: "item",
                        submenuType: "dxDropDownMenu",
                        renderAs: "topToolbar"
                    })
            },
            _itemContainer: function() {
                return this._$toolbarItemsContainer.find([".dx-toolbar-left", ".dx-toolbar-center", ".dx-toolbar-right"].join(","))
            },
            _itemClass: function() {
                return TOOLBAR_ITEM_CLASS
            },
            _itemDataKey: function() {
                return TOOLBAR_ITEM_DATA_KEY
            },
            _itemRenderDefault: function(item, index, itemElement) {
                this.callBase(item, index, itemElement);
                var widget = item.widget;
                if (widget) {
                    var widgetElement = $("<div>").appendTo(itemElement),
                        widgetName = DX.inflector.camelize("dx-" + widget),
                        options = item.options || {};
                    widgetElement[widgetName](options)
                }
                else if (item.text)
                    itemElement.wrapInner("<div>")
            },
            _render: function() {
                this._renderToolbar();
                this._renderSections();
                this.callBase();
                this._renderMenu();
                this._arrangeTitle();
                this._windowTitleResizeCallback = $.proxy(this._arrangeTitle, this);
                utils.windowResizeCallbacks.add(this._windowTitleResizeCallback)
            },
            _renderToolbar: function() {
                this._element().addClass(TOOLBAR_CLASS).toggleClass(TOOLBAR_BOTTOM_CLASS, this.option("renderAs") === "bottomToolbar");
                this._$toolbarItemsContainer = $("<div>").appendTo(this._element());
                this._$toolbarItemsContainer.addClass(TOOLBAR_ITEMS_CONTAINER_CLASS)
            },
            _renderSections: function() {
                var $container = this._$toolbarItemsContainer,
                    self = this;
                $.each(["left", "center", "right"], function() {
                    var sectionClass = "dx-toolbar-" + this,
                        $section = $container.find("." + sectionClass);
                    if (!$section.length)
                        self["_$" + this + "Section"] = $section = $("<div>").addClass(sectionClass).appendTo($container)
                })
            },
            _arrangeTitle: function() {
                var $container = this._$toolbarItemsContainer,
                    $centerSection = this._$centerSection,
                    $label = $centerSection.children(TOOLBAR_LABEL_SELECTOR).eq(0);
                if ($label.length === 0)
                    return;
                var containerWidth = $container.width(),
                    leftWidth = this._$leftSection.outerWidth(),
                    rightWidth = this._$rightSection.outerWidth();
                var elemsAtCenterWidth = 10;
                $centerSection.children().not(TOOLBAR_LABEL_SELECTOR).each(function() {
                    elemsAtCenterWidth += $(this).outerWidth()
                });
                var maxLabelWidth = containerWidth - leftWidth - rightWidth - elemsAtCenterWidth;
                var labelLongerThanMax = $label.width() > maxLabelWidth;
                $centerSection.css({
                    marginLeft: labelLongerThanMax ? leftWidth : "",
                    marginRight: labelLongerThanMax ? rightWidth : ""
                });
                $label.css("max-width", maxLabelWidth)
            },
            _renderItem: function(index, item) {
                if (item.align)
                    utils.logger.warn("dxToolbar.items.align is deprecated. Please use dxToolbar.items.location instead.");
                var align = item.location || item.align || "center",
                    container = this._$toolbarItemsContainer.find(".dx-toolbar-" + align);
                var itemElement = this.callBase(index, item, container);
                itemElement.addClass(TOOLBAR_BUTTON_CLASS);
                if (item.text)
                    itemElement.addClass(TOOLBAR_LABEL_CLASS).removeClass(TOOLBAR_BUTTON_CLASS);
                return itemElement
            },
            _hasVisibleMenuItems: function() {
                var menuItems = this._getMenuItems(),
                    result = false;
                var optionGetter = DevExpress.data.utils.compileGetter("visible");
                $.each(menuItems, function(index, item) {
                    var itemVisible = optionGetter(item, {functionsAsIs: true});
                    if (itemVisible !== false)
                        result = true
                });
                return result
            },
            _getToolbarItems: function() {
                return $.grep(this.option("items") || [], function(item) {
                        return item.location !== "menu"
                    })
            },
            _getMenuItems: function() {
                return $.grep(this.option("items") || [], function(item) {
                        return item.location === "menu"
                    })
            },
            _renderContentImpl: function() {
                var items = this._getToolbarItems();
                this._element().toggleClass(TOOLBAR_MINI_CLASS, items.length === 0);
                if (this._renderedItemsCount)
                    this._renderItems(items.slice(this._renderedItemsCount));
                else
                    this._renderItems(items)
            },
            _renderMenu: function() {
                var self = this,
                    itemClickAction = this._createActionByOption("itemClickAction");
                var options = {
                        itemRender: this.option("menuItemRender"),
                        itemTemplate: this.option("menuItemTemplate"),
                        itemClickAction: function(e) {
                            self._toggleMenuVisibility(false, true);
                            itemClickAction(e)
                        }
                    };
                this._menuType = this.option("submenuType");
                if (this._menuType === "dxList" && this.option("renderAs") === "topToolbar")
                    this._menuType = "dxDropDownMenu";
                switch (this._menuType) {
                    case"dxActionSheet":
                        this._renderActionSheet(options);
                        break;
                    case"dxDropDownMenu":
                        this._renderDropDown(options);
                        break;
                    case"dxList":
                        this._renderList(options);
                        break
                }
            },
            _renderMenuButton: function(options) {
                var buttonOptions = $.extend({clickAction: $.proxy(this._handleMenuButtonClick, this)}, options);
                this._renderMenuButtonContainer();
                this._$button = $("<div>").appendTo(this._$menuButtonContainer).addClass(TOOLBAR_MENU_BUTTON_CLASS).dxButton(buttonOptions)
            },
            _renderMenuButtonContainer: function() {
                var $rightSection = this._$rightSection;
                this._$menuButtonContainer = $("<div>").appendTo($rightSection).addClass(TOOLBAR_BUTTON_CLASS).addClass(TOOLBAR_MENU_CONTAINER_CLASS)
            },
            _renderDropDown: function(options) {
                if (!this._hasVisibleMenuItems())
                    return;
                this._renderMenuButtonContainer();
                this._menu = $("<div>").appendTo(this._$menuButtonContainer).dxDropDownMenu(options).dxDropDownMenu("instance");
                this._renderMenuItems()
            },
            _renderActionSheet: function(options) {
                if (!this._hasVisibleMenuItems())
                    return;
                this._renderMenuButton({icon: "overflow"});
                var actionSheetOptions = $.extend({
                        target: this._$button,
                        showTitle: false
                    }, options);
                this._menu = $("<div>").appendTo(this._element()).dxActionSheet(actionSheetOptions).dxActionSheet("instance");
                this._renderMenuItems()
            },
            _renderList: function(options) {
                this._renderMenuButton({
                    activeStateEnabled: false,
                    text: "..."
                });
                var listOptions = $.extend({width: "100%"}, options);
                this._renderListOverlay();
                this._renderContainerSwipe();
                if (this._hasVisibleMenuItems()) {
                    this._menu = $("<div>").appendTo(this._listOverlay.content()).dxList(listOptions).dxList("instance");
                    this._renderMenuItems()
                }
                this._changeListVisible(this.option("visible"));
                this._windowResizeCallback = $.proxy(this._toggleMenuVisibility, this);
                utils.windowResizeCallbacks.add(this._windowResizeCallback)
            },
            _renderMenuItems: function() {
                this._menu.addExternalTemplate(this._templates);
                this._menu.option("items", this._getMenuItems())
            },
            _getListHeight: function() {
                var listHeight = this._listOverlay.content().find(".dx-list").height(),
                    semiHiddenHeight = this._$toolbarItemsContainer.height() - this._element().height();
                return listHeight + semiHiddenHeight
            },
            _renderListOverlay: function() {
                var element = this._element();
                this._listOverlay = $("<div>").appendTo(element).dxOverlay({
                    targetContainer: false,
                    deferRendering: false,
                    shading: false,
                    height: "auto",
                    width: "100%",
                    showTitle: false,
                    closeOnOutsideClick: $.proxy(this._handleListOutsideClick, this),
                    position: null,
                    animation: null,
                    backButtonHandler: null
                }).dxOverlay("instance")
            },
            _backButtonHandler: function() {
                this._toggleMenuVisibility(false, true)
            },
            _toggleBackButtonCallback: function() {
                if (this._closeCallback)
                    DX.backButtonCallback.remove(this._closeCallback);
                if (this._menuShown) {
                    this._closeCallback = $.proxy(this._backButtonHandler, this);
                    DX.backButtonCallback.add(this._closeCallback)
                }
            },
            _renderContainerSwipe: function() {
                this._$toolbarItemsContainer.appendTo(this._listOverlay.content()).dxSwipeable({
                    elastic: false,
                    startAction: $.proxy(this._handleSwipeStart, this),
                    updateAction: $.proxy(this._handleSwipeUpdate, this),
                    endAction: $.proxy(this._handleSwipeEnd, this),
                    itemSizeFunc: $.proxy(this._getListHeight, this),
                    direction: "vertical"
                })
            },
            _handleListOutsideClick: function(e) {
                if (!$(e.target).closest(this._listOverlay.content()).length)
                    this._toggleMenuVisibility(false, true)
            },
            _calculatePixelOffset: function(offset) {
                offset = (offset || 0) - 1;
                var maxOffset = this._getListHeight();
                return offset * maxOffset
            },
            _handleSwipeStart: function(e) {
                e.jQueryEvent.maxTopOffset = this._menuShown ? 0 : 1;
                e.jQueryEvent.maxBottomOffset = this._menuShown ? 1 : 0
            },
            _handleSwipeUpdate: function(e) {
                var offset = this._menuShown ? e.jQueryEvent.offset : 1 + e.jQueryEvent.offset;
                this._renderMenuPosition(offset, false)
            },
            _handleSwipeEnd: function(e) {
                var targetOffset = e.jQueryEvent.targetOffset;
                targetOffset -= this._menuShown - 1;
                this._toggleMenuVisibility(targetOffset === 0, true)
            },
            _renderMenuPosition: function(offset, animate) {
                var pos = this._calculatePixelOffset(offset),
                    element = this._listOverlay.content();
                if (animate)
                    slideSubmenu(element, pos, this._menuShown);
                else
                    translator.move(element, {top: pos})
            },
            _handleMenuButtonClick: function() {
                this._toggleMenuVisibility(!this._menuShown, true)
            },
            _toggleMenuVisibility: function(visible, animate) {
                this._menuShown = visible;
                switch (this._menuType) {
                    case"dxList":
                        this._toggleBackButtonCallback();
                        this._renderMenuPosition(this._menuShown ? 0 : 1, animate);
                        break;
                    case"dxActionSheet":
                        this._menu.toggle(this._menuShown);
                        this._menuShown = false;
                        break
                }
            },
            _renderEmptyMessage: $.noop,
            _clean: function() {
                this._$toolbarItemsContainer.children().empty();
                this._element().empty()
            },
            _changeMenuOption: function(name, value) {
                if (this._menu)
                    this._menu.option(name, value)
            },
            _changeListVisible: function(value) {
                if (this._listOverlay) {
                    this._listOverlay.option("visible", value);
                    this._toggleMenuVisibility(false, false)
                }
            },
            _optionChanged: function(name, value) {
                switch (name) {
                    case"renderAs":
                    case"submenuType":
                        this._invalidate();
                        break;
                    case"visible":
                        this._changeListVisible(value);
                        this.callBase.apply(this, arguments);
                        break;
                    case"menuItemRender":
                        this._changeMenuOption("itemRender", value);
                        break;
                    case"menuItemTemplate":
                        this._changeMenuOption("itemTemplate", value);
                        break;
                    case"itemClickAction":
                        this._changeMenuOption(name, value);
                        this.callBase.apply(this, arguments);
                        break;
                    default:
                        this.callBase.apply(this, arguments)
                }
            },
            _dispose: function() {
                if (this._windowResizeCallback)
                    utils.windowResizeCallbacks.remove(this._windowResizeCallback);
                if (this._windowTitleResizeCallback)
                    utils.windowResizeCallbacks.remove(this._windowTitleResizeCallback);
                this.callBase()
            }
        }))
    })(jQuery, DevExpress);
    /*! Module widgets, file ui.listEdit.js */
    (function($, DX, undefined) {
        var ui = DX.ui,
            events = ui.events,
            translator = DX.translator,
            fx = DX.fx,
            utils = DX.utils;
        var editOptionsRegistry = [];
        var registerOption = function(option) {
                editOptionsRegistry.push(option)
            };
        registerOption("delete");
        registerOption("selection");
        var LIST_ITEM_BAG_CONTAINER_CLASS = "dx-list-item-bag-container",
            LIST_ITEM_CONTENT_CLASS = "dx-list-item-content",
            LIST_ITEM_LEFT_BAG_CLASS = "dx-list-item-left-bag",
            LIST_ITEM_RIGHT_BAG_CLASS = "dx-list-item-right-bag",
            DECORATOR_LEFT_BAG_CREATE_METHOD = "leftBag",
            DECORATOR_RIGHT_BAG_CREATE_METHOD = "rightBag",
            DECORATOR_MODIFY_ELEMENT_METHOD = "modifyElement";
        var ListEditProvider = DX.Class.inherit({
                ctor: function(list, config) {
                    this._list = list;
                    this._config = config;
                    if (this.isModifyingByDecorators())
                        this._fetchRequiredDecorators()
                },
                dispose: function() {
                    if (this._decorators && this._decorators.length)
                        $.each(this._decorators, function(_, decorator) {
                            decorator.dispose()
                        })
                },
                isModifyingByDecorators: function() {
                    return !(this.isRenderingByRenderer() || this.isRenderingByTemplate())
                },
                isRenderingByRenderer: function() {
                    return !!this.getItemRenderer()
                },
                getItemRenderer: function() {
                    return this._config.itemRender
                },
                isRenderingByTemplate: function() {
                    return !!this.getItemTemplateName()
                },
                getItemTemplateName: function() {
                    return this._config.itemTemplate
                },
                _fetchRequiredDecorators: function() {
                    this._decorators = [];
                    $.each(editOptionsRegistry, $.proxy(function(_, option) {
                        var enabledOptionName = option + "Enabled",
                            modeOptionName = option + "Mode";
                        if (this._config[enabledOptionName]) {
                            var decorator = this._createDecorator(option, this._config[modeOptionName]);
                            this._decorators.push(decorator)
                        }
                    }, this))
                },
                _createDecorator: function(option, type) {
                    var decoratorClass = this._findDecorator(option, type);
                    return new decoratorClass(this._list)
                },
                _findDecorator: function(option, type) {
                    var foundDecorator = decoratorsRegistry[option][type];
                    if (!foundDecorator)
                        throw new Error("Decorator with editing option: \"" + option + "\" and type: \"" + type + "\" not found");
                    return foundDecorator
                },
                modifyItemElement: function() {
                    var proxyArgs = [this._modifyItemElementImpl, this];
                    proxyArgs.push.apply(proxyArgs, arguments);
                    utils.executeAsync($.proxy.apply($, proxyArgs))
                },
                _modifyItemElementImpl: function(args) {
                    var $itemElement = $(args.itemElement);
                    $itemElement.addClass(LIST_ITEM_BAG_CONTAINER_CLASS);
                    this._wrapContent($itemElement);
                    var config = {$itemElement: $itemElement};
                    this._prependLeftBags($itemElement, config);
                    this._appendRightBags($itemElement, config);
                    this._applyDecorators(DECORATOR_MODIFY_ELEMENT_METHOD, config)
                },
                _wrapContent: function($itemElement) {
                    var $contentContainer = $("<div />").addClass(LIST_ITEM_CONTENT_CLASS);
                    $itemElement.wrapInner($contentContainer)
                },
                _prependLeftBags: function($itemElement, config) {
                    var $leftBags = this._collectDecoratorsMarkup(DECORATOR_LEFT_BAG_CREATE_METHOD, config, LIST_ITEM_LEFT_BAG_CLASS);
                    $itemElement.prepend($leftBags)
                },
                _appendRightBags: function($itemElement, config) {
                    var $rightBags = this._collectDecoratorsMarkup(DECORATOR_RIGHT_BAG_CREATE_METHOD, config, LIST_ITEM_RIGHT_BAG_CLASS);
                    $itemElement.append($rightBags)
                },
                _collectDecoratorsMarkup: function(method, config, containerClass) {
                    var $collector = $("<div />");
                    $.each(this._decorators, function() {
                        var $container = $("<div />").addClass(containerClass);
                        this[method]($.extend({$container: $container}, config));
                        if ($container.children().length)
                            $collector.append($container)
                    });
                    return $collector.children()
                },
                _applyDecorators: function(method, config) {
                    $.each(this._decorators, function() {
                        this[method](config)
                    })
                },
                _handlerExists: function(name) {
                    if (!this._decorators)
                        return false;
                    var decorators = this._decorators,
                        length = decorators.length;
                    for (var i = 0; i < length; i++)
                        if (decorators[i][name] !== $.noop)
                            return true;
                    return false
                },
                _handleEvent: function(name, $itemElement) {
                    if (!this._decorators)
                        return false;
                    var response = false,
                        decorators = this._decorators,
                        length = decorators.length;
                    for (var i = 0; i < length; i++) {
                        response = decorators[i][name]($itemElement);
                        if (response)
                            break
                    }
                    return response
                },
                handleClick: function($itemElement) {
                    return this._handleEvent("handleClick", $itemElement)
                },
                holdHandlerExists: function() {
                    return this._handlerExists("handleHold")
                },
                handleHold: function($itemElement) {
                    return this._handleEvent("handleHold", $itemElement)
                }
            });
        var decoratorsRegistry = {};
        var registerDecorator = function(option, type, decoratorClass) {
                var decoratorConfig = {};
                decoratorConfig[option] = decoratorsRegistry[option] ? decoratorsRegistry[option] : {};
                decoratorConfig[option][type] = decoratorClass;
                decoratorsRegistry = $.extend(decoratorsRegistry, decoratorConfig)
            };
        var DX_LIST_EDIT_DECORATOR = "dxListEditDecorator";
        var ListEditDecorator = DX.Class.inherit({
                ctor: function(list) {
                    this._list = list;
                    this._init()
                },
                _init: $.noop,
                _shouldHandleSwipe: false,
                _attachSwipeEvent: function(config) {
                    var startEventName = events.addNamespace("dxswipestart", DX_LIST_EDIT_DECORATOR),
                        updateEventName = events.addNamespace("dxswipe", DX_LIST_EDIT_DECORATOR),
                        endEventName = events.addNamespace("dxswipeend", DX_LIST_EDIT_DECORATOR);
                    config.$itemElement.on(startEventName, $.proxy(this._handleItemSwipeStart, this)).on(updateEventName, $.proxy(this._handleItemSwipeUpdate, this)).on(endEventName, $.proxy(this._handleItemSwipeEnd, this))
                },
                _handleItemSwipeStart: function(e) {
                    var $itemElement = $(e.currentTarget);
                    if ($itemElement.is(".dx-state-disabled, .dx-state-disabled *")) {
                        e.cancel = true;
                        return
                    }
                    this._handleSwipeStart($itemElement, e)
                },
                _handleItemSwipeUpdate: function(e) {
                    var $itemElement = $(e.currentTarget);
                    this._handleSwipeUpdate($itemElement, e)
                },
                _handleItemSwipeEnd: function(e) {
                    var $itemElement = $(e.currentTarget);
                    this._handleSwipeEnd($itemElement, e)
                },
                leftBag: $.noop,
                rightBag: $.noop,
                modifyElement: function(config) {
                    if (this._shouldHandleSwipe)
                        this._attachSwipeEvent(config)
                },
                handleClick: $.noop,
                handleHold: $.noop,
                _handleSwipeStart: $.noop,
                _handleSwipeUpdate: $.noop,
                _handleSwipeEnd: $.noop,
                dispose: $.noop
            });
        var SWITCHABLE_DELETE_READY_CLASS = "dx-switchable-delete-ready",
            SWITCHABLE_DELETE_TOP_SHIELD_CLASS = "dx-switchable-delete-top-shield",
            SWITCHABLE_DELETE_BOTTOM_SHIELD_CLASS = "dx-switchable-delete-bottom-shield",
            SWITCHABLE_DELETE_ITEM_CONTENT_SHIELD_CLASS = "dx-switchable-delete-item-content-shield";
        var SwitchableDeleteDecorator = ListEditDecorator.inherit({
                _init: function() {
                    this._$topShield = $("<div />").addClass(SWITCHABLE_DELETE_TOP_SHIELD_CLASS);
                    this._$bottomShield = $("<div />").addClass(SWITCHABLE_DELETE_BOTTOM_SHIELD_CLASS);
                    this._$itemContentShield = $("<div />").addClass(SWITCHABLE_DELETE_ITEM_CONTENT_SHIELD_CLASS);
                    this._$topShield.on(events.addNamespace("dxpointerdown", DX_LIST_EDIT_DECORATOR), $.proxy(this._cancelDeleteReadyItem, this));
                    this._$bottomShield.on(events.addNamespace("dxpointerdown", DX_LIST_EDIT_DECORATOR), $.proxy(this._cancelDeleteReadyItem, this));
                    this._list._element().append(this._$topShield.toggle(false)).append(this._$bottomShield.toggle(false));
                    this._list._element().on("dxpreparetodelete", ".dx-list-item", $.proxy(function(e) {
                        this._toggleDeleteReady($(e.currentTarget), true)
                    }, this))
                },
                handleClick: function($itemElement) {
                    return this._cancelDeleteReadyItem()
                },
                _cancelDeleteReadyItem: function() {
                    if (!this._$readyToDeleteItem)
                        return false;
                    this._cancelDelete(this._$readyToDeleteItem);
                    return true
                },
                _cancelDelete: function($itemElement) {
                    this._toggleDeleteReady($itemElement, false)
                },
                _toggleDeleteReady: function($itemElement, readyToDelete) {
                    readyToDelete = readyToDelete || !this._isReadyToDelete($itemElement);
                    $itemElement.toggleClass(SWITCHABLE_DELETE_READY_CLASS, readyToDelete);
                    this._toggleShields($itemElement, readyToDelete);
                    this._cacheReadyToDeleteItem($itemElement, readyToDelete)
                },
                _isReadyToDelete: function($itemElement) {
                    return $itemElement.hasClass(SWITCHABLE_DELETE_READY_CLASS)
                },
                _toggleShields: function($itemElement, enabled) {
                    this._$topShield.toggle(enabled);
                    this._$bottomShield.toggle(enabled);
                    if (enabled)
                        this._updateShieldsHeight($itemElement);
                    this._toggleContentShield($itemElement, enabled)
                },
                _updateShieldsHeight: function($itemElement) {
                    var $list = this._list._element(),
                        listTopOffset = $list.offset().top,
                        listHeight = $list.outerHeight(),
                        itemTopOffset = $itemElement.offset().top,
                        itemHeight = $itemElement.outerHeight(),
                        dirtyTopShieldHeight = itemTopOffset - listTopOffset,
                        dirtyBottomShieldHeight = listHeight - itemHeight - dirtyTopShieldHeight;
                    this._$topShield.height(Math.max(dirtyTopShieldHeight, 0));
                    this._$bottomShield.height(Math.max(dirtyBottomShieldHeight, 0))
                },
                _toggleContentShield: function($itemElement, enabled) {
                    if (enabled)
                        $itemElement.find("." + LIST_ITEM_CONTENT_CLASS).append(this._$itemContentShield);
                    else
                        this._$itemContentShield.detach()
                },
                _cacheReadyToDeleteItem: function($itemElement, cache) {
                    if (cache)
                        this._$readyToDeleteItem = $itemElement;
                    else
                        delete this._$readyToDeleteItem
                },
                _deleteItem: function($itemElement) {
                    if ($itemElement.is(".dx-state-disabled, .dx-state-disabled *"))
                        return;
                    this._cancelDelete($itemElement);
                    this._list.deleteItem($itemElement)
                }
            });
        registerDecorator("delete", "_switchable", SwitchableDeleteDecorator);
        var SWITCHABLE_DELETE_BUTTON_CONTAINER_CLASS = "dx-switchable-delete-button-container",
            SWITCHABLE_DELETE_BUTTON_WRAPPER_CLASS = "dx-switchable-delete-button-wrapper",
            SWITCHABLE_DELETE_BUTTON_INNER_WRAPPER_CLASS = "dx-switchable-delete-button-inner-wrapper",
            SWITCHABLE_DELETE_BUTTON_CLASS = "dx-switchable-delete-button";
        var SwitchableButtonDeleteDecorator = SwitchableDeleteDecorator.inherit({modifyElement: function(config) {
                    this.callBase.apply(this, arguments);
                    var $itemElement = config.$itemElement;
                    var $buttonContainer = $("<div />").addClass(SWITCHABLE_DELETE_BUTTON_CONTAINER_CLASS),
                        $buttonWrapper = $("<div />").addClass(SWITCHABLE_DELETE_BUTTON_WRAPPER_CLASS),
                        $buttonInnerWrapper = $("<div />").addClass(SWITCHABLE_DELETE_BUTTON_INNER_WRAPPER_CLASS),
                        $button = $("<div />").addClass(SWITCHABLE_DELETE_BUTTON_CLASS);
                    $button.dxButton({
                        text: Globalize.localize("dxListEditDecorator-delete"),
                        type: "danger",
                        clickAction: $.proxy(function(e) {
                            this._deleteItem($itemElement);
                            e.jQueryEvent.stopPropagation()
                        }, this)
                    });
                    $buttonContainer.append($buttonWrapper);
                    $buttonWrapper.append($buttonInnerWrapper);
                    $buttonInnerWrapper.append($button);
                    $itemElement.append($buttonContainer);
                    if (!this._buttonContainerWidth)
                        this._buttonContainerWidth = $buttonContainer.outerWidth();
                    $buttonContainer.css("right", -this._buttonContainerWidth)
                }});
        registerDecorator("delete", "_switchableButton", SwitchableButtonDeleteDecorator);
        var TOGGLE_DELETE_SWITCH_CONTAINER_CLASS = "dx-toggle-delete-switch-container",
            TOGGLE_DELETE_SWITCH_CLASS = "dx-toggle-delete-switch";
        registerDecorator("delete", "toggle", SwitchableButtonDeleteDecorator.inherit({leftBag: function(config) {
                var $itemElement = config.$itemElement,
                    $container = config.$container;
                var $toggle = $("<div />").dxButton({
                        icon: "toggle-delete",
                        clickAction: $.proxy(function(e) {
                            this._toggleDeleteReady($itemElement);
                            e.jQueryEvent.stopPropagation()
                        }, this)
                    }).addClass(TOGGLE_DELETE_SWITCH_CLASS);
                $container.addClass(TOGGLE_DELETE_SWITCH_CONTAINER_CLASS);
                $container.append($toggle)
            }}));
        registerDecorator("delete", "slideButton", SwitchableButtonDeleteDecorator.inherit({
            _shouldHandleSwipe: true,
            _handleSwipeEnd: function($itemElement, args) {
                if (args.targetOffset !== 0)
                    this._toggleDeleteReady($itemElement);
                return true
            }
        }));
        var SLIDE_ITEM_WRAPPER_CLASS = "dx-slide-item-wrapper",
            SLIDE_ITEM_CONTENT_CLASS = "dx-slide-item-content",
            SLIDE_ITEM_DELETE_BUTTON_CONTAINER_CLASS = "dx-slide-item-delete-button-container",
            SLIDE_ITEM_DELETE_BUTTON_CLASS = "dx-slide-item-delete-button",
            SLIDE_ITEM_DELETE_BUTTON_HIDDEN_CLASS = "dx-slide-item-delete-button-hidden",
            SLIDE_ITEM_DELETE_BUTTON_CONTENT_CLASS = "dx-slide-item-delete-button-content";
        registerDecorator("delete", "slideItem", SwitchableDeleteDecorator.inherit({
            _shouldHandleSwipe: true,
            modifyElement: function(config) {
                this.callBase.apply(this, arguments);
                var $itemElement = config.$itemElement;
                var $buttonContent = $("<div/>").addClass(SLIDE_ITEM_DELETE_BUTTON_CONTENT_CLASS).text(Globalize.localize("dxListEditDecorator-delete")),
                    $button = $("<div/>").addClass(SLIDE_ITEM_DELETE_BUTTON_CLASS).append($buttonContent),
                    $buttonContainer = $("<div/>").addClass(SLIDE_ITEM_DELETE_BUTTON_CONTAINER_CLASS).append($button);
                $itemElement.wrapInner($("<div/>").addClass(SLIDE_ITEM_CONTENT_CLASS)).append($buttonContainer).addClass(SLIDE_ITEM_WRAPPER_CLASS);
                $button.on(events.addNamespace("dxclick", DX_LIST_EDIT_DECORATOR), $.proxy(function() {
                    this._deleteItem($itemElement)
                }, this))
            },
            _handleSwipeUpdate: function($itemElement, args) {
                this._cacheItemData($itemElement);
                var offset = this._cachedItemWidth * args.offset,
                    startOffset = this._isReadyToDelete($itemElement) ? -this._cachedButtonWidth : 0,
                    position = offset + startOffset < 0 ? offset + startOffset : 0;
                translator.move(this._$cachedContent, {left: position});
                this._$cachedBottonContainer.css("left", Math.max(this._cachedItemWidth + position, this._minButtonContainerLeftOffset()));
                return true
            },
            _cacheItemData: function($itemElement) {
                if ($itemElement[0] === this._cachedNode)
                    return;
                this._$cachedContent = $itemElement.find("." + SLIDE_ITEM_CONTENT_CLASS);
                this._$cachedBottonContainer = $itemElement.find("." + SLIDE_ITEM_DELETE_BUTTON_CONTAINER_CLASS);
                this._cachedItemWidth = $itemElement.outerWidth();
                this._cachedButtonWidth = this._cachedButtonWidth || $itemElement.find("." + SLIDE_ITEM_DELETE_BUTTON_CLASS).outerWidth();
                if (this._$cachedContent.length && this._$cachedBottonContainer.length)
                    this._cachedNode = $itemElement[0]
            },
            _minButtonContainerLeftOffset: function() {
                return this._cachedItemWidth - this._cachedButtonWidth
            },
            _handleSwipeEnd: function($itemElement, args) {
                this._cacheItemData($itemElement);
                var offset = this._cachedItemWidth * args.offset,
                    endedAtReadyToDelete = !this._isReadyToDelete($itemElement) && -offset > this._cachedButtonWidth * .8,
                    readyToDelete = args.targetOffset === -1 || endedAtReadyToDelete;
                this._toggleDeleteState($itemElement, readyToDelete);
                return true
            },
            _toggleDeleteState: function($itemElement, state) {
                if (state)
                    this._prepareToDelete($itemElement);
                else
                    this._cancelDelete($itemElement)
            },
            _prepareToDelete: function($itemElement) {
                this._toggleDeleteReady($itemElement, true);
                fx.animate(this._$cachedContent, {
                    to: {left: -this._cachedButtonWidth},
                    type: "slide",
                    duration: 200
                });
                fx.animate(this._$cachedBottonContainer, {
                    to: {left: this._minButtonContainerLeftOffset()},
                    duration: 200
                })
            },
            _cancelDelete: function($itemElement) {
                this._cacheItemData($itemElement);
                this.callBase.apply(this, arguments);
                fx.animate(this._$cachedContent, {
                    to: {left: 0},
                    type: "slide",
                    duration: 200
                });
                fx.animate(this._$cachedBottonContainer, {
                    to: {left: this._cachedItemWidth},
                    duration: 200,
                    complete: $.proxy(function() {
                        this._$cachedBottonContainer.css("left", "100%")
                    }, this)
                })
            }
        }));
        registerDecorator("delete", "swipe", ListEditDecorator.inherit({
            _shouldHandleSwipe: true,
            _renderItemPosition: function($itemElement, offset, animate) {
                var deferred = $.Deferred(),
                    itemOffset = offset * this._itemElementWidth;
                if (animate)
                    fx.animate($itemElement, {
                        to: {left: itemOffset},
                        type: "slide",
                        complete: function() {
                            deferred.resolve($itemElement, offset)
                        }
                    });
                else {
                    translator.move($itemElement, {left: itemOffset});
                    deferred.resolve()
                }
                return deferred.promise()
            },
            _handleSwipeStart: function($itemElement) {
                this._itemElementWidth = $itemElement.width();
                return true
            },
            _handleSwipeUpdate: function($itemElement, args) {
                this._renderItemPosition($itemElement, args.offset);
                return true
            },
            _handleSwipeEnd: function($itemElement, args) {
                var offset = args.targetOffset;
                this._renderItemPosition($itemElement, offset, true).done($.proxy(function($itemElement, offset) {
                    if (Math.abs(offset))
                        this._list.deleteItem($itemElement)
                }, this));
                return true
            }
        }));
        var HOLDDELETE_MENU = "dx-holddelete-menu",
            HOLDDELETE_MENUCONTENT = "dx-holddelete-menucontent",
            HOLDDELETE_MENUITEM = "dx-holddelete-menuitem";
        registerDecorator("delete", "hold", ListEditDecorator.inherit({
            _init: function() {
                this._$menu = $("<div/>").addClass(HOLDDELETE_MENU);
                this._list._element().append(this._$menu);
                this._menu = this._renderOverlay(this._$menu)
            },
            _renderOverlay: function($element) {
                return $element.dxOverlay({
                        shading: false,
                        deferRendering: true,
                        closeOnOutsideClick: function(e) {
                            return !$(e.target).closest("." + HOLDDELETE_MENU).length
                        },
                        animation: {
                            show: {
                                type: "custom",
                                duration: 300,
                                from: {
                                    height: 0,
                                    opacity: 1
                                },
                                to: {
                                    height: $.proxy(function() {
                                        return this._$menuContent.height()
                                    }, this),
                                    opacity: 1
                                }
                            },
                            hide: {
                                type: "custom",
                                duration: 0,
                                from: {opacity: 1},
                                to: {opacity: 0}
                            }
                        },
                        contentReadyAction: $.proxy(this._renderMenuContent, this)
                    }).dxOverlay("instance")
            },
            _renderMenuContent: function(e) {
                var $menuContent = $("<div/>").addClass(HOLDDELETE_MENUCONTENT),
                    $deleteMenuItem = $("<div/>").addClass(HOLDDELETE_MENUITEM).text(Globalize.localize("dxListEditDecorator-delete"));
                $deleteMenuItem.on(events.addNamespace("dxclick", DX_LIST_EDIT_DECORATOR), $.proxy(this._deleteItem, this));
                this._$menuContent = $menuContent.append($deleteMenuItem);
                e.component.content().append(this._$menuContent);
                e.component.option("height", $.proxy(function() {
                    return this._$menuContent.height()
                }, this))
            },
            _deleteItem: function() {
                this._menu.hide();
                this._list.deleteItem(this._$itemWithMenu)
            },
            dispose: function() {
                this._$menu.remove()
            },
            handleHold: function($itemElement) {
                this._menu.option({
                    position: {
                        my: "top",
                        at: "bottom",
                        of: $itemElement,
                        collision: "flip"
                    },
                    width: function() {
                        return $itemElement.width()
                    }
                });
                this._menu.show();
                this._$itemWithMenu = $itemElement;
                return true
            }
        }));
        var LIST_ITEM_SELECTED_CLASS = "dx-list-item-selected",
            SELECT_CHECKBOX_CONTAINER_CLASS = "dx-select-checkbox-container",
            SELECT_CHECKBOX_CLASS = "dx-select-checkbox";
        registerDecorator("selection", "control", ListEditDecorator.inherit({
            leftBag: function(config) {
                var $itemElement = config.$itemElement,
                    $container = config.$container;
                var $checkBox = $("<div />").addClass(SELECT_CHECKBOX_CLASS);
                $checkBox.dxCheckBox({
                    checked: this._isSelected($itemElement),
                    clickAction: $.proxy(function(e) {
                        this._processCheckedState($itemElement, e.component.option("checked"));
                        e.jQueryEvent.stopPropagation()
                    }, this)
                });
                $container.addClass(SELECT_CHECKBOX_CONTAINER_CLASS);
                $container.append($checkBox)
            },
            modifyElement: function(config) {
                this.callBase.apply(this, arguments);
                var $itemElement = config.$itemElement,
                    checkBox = $itemElement.find("." + SELECT_CHECKBOX_CLASS).dxCheckBox("instance");
                $itemElement.on("stateChanged", $.proxy(function() {
                    checkBox.option("checked", this._isSelected($itemElement))
                }, this))
            },
            _isSelected: function($itemElement) {
                return $itemElement.hasClass(LIST_ITEM_SELECTED_CLASS)
            },
            _processCheckedState: function($itemElement, checked) {
                if (!$itemElement.hasClass("dx-list-item"))
                    throw new Error("SelectingControlDecorator._processCheckedState called with wrong parametrs");
                if (checked)
                    this._list.selectItem($itemElement);
                else
                    this._list.unselectItem($itemElement)
            }
        }));
        registerDecorator("selection", "item", decoratorsRegistry.selection.control.inherit({handleClick: function($itemElement) {
                var newCheckBoxState = !this._isSelected($itemElement);
                this._processCheckedState($itemElement, newCheckBoxState);
                return true
            }}));
        ui.ListEditProvider = ListEditProvider
    })(jQuery, DevExpress);
    /*! Module widgets, file ui.list.js */
    (function($, DX, undefined) {
        var ui = DX.ui,
            events = ui.events;
        var DX_PREVENT_ITEM_CLICK_ACTION = "dxPreventItemClickAction";
        var ListEditStrategy = DX.Class.inherit({
                ctor: function(list) {
                    this._list = list
                },
                isItemIndex: DX.abstract,
                getItemElementIndex: DX.abstract,
                normalizeItemIndex: DX.abstract,
                deleteItemAtIndex: DX.abstract,
                updateSelectionAfterDelete: DX.abstract,
                fetchSelectedItems: DX.abstract,
                selectedItemIndecies: DX.abstract,
                getItemByIndex: DX.abstract
            });
        var PlainListEditStrategy = ListEditStrategy.inherit({
                isItemIndex: function(index) {
                    return $.isNumeric(index)
                },
                getItemElementIndex: function(itemElement) {
                    return this._list._itemElements().index(itemElement)
                },
                normalizeItemIndex: function(index) {
                    return index
                },
                deleteItemAtIndex: function(index) {
                    this._list.option("items").splice(index, 1)
                },
                updateSelectionAfterDelete: function(fromIndex) {
                    var selectedItemIndices = this._list._selectedItemIndices;
                    $.each(selectedItemIndices, function(i, index) {
                        if (index > fromIndex)
                            selectedItemIndices[i] -= 1
                    })
                },
                fetchSelectedItems: function() {
                    var items = this._list.option("items"),
                        selectedItems = [];
                    $.each(this._list._selectedItemIndices, function(_, index) {
                        selectedItems.push(items[index])
                    });
                    return selectedItems
                },
                selectedItemIndecies: function() {
                    var selectedIndices = [],
                        items = this._list.option("items"),
                        selected = this._list.option("selectedItems");
                    $.each(selected, function(_, selectedItem) {
                        var index = $.inArray(selectedItem, items);
                        if (index !== -1)
                            selectedIndices.push(index);
                        else
                            throw new Error("Item '" + selectedItem + "' you are trying to select does not exist");
                    });
                    return selectedIndices
                },
                getItemByIndex: function(index) {
                    return this._list._itemElements().eq(index)
                }
            });
        var SELECTION_SHIFT = 20,
            SELECTION_MASK = 0x8FF;
        var combineIndex = function(indices) {
                return (indices.group << SELECTION_SHIFT) + indices.item
            };
        var splitIndex = function(combinedIndex) {
                return {
                        group: combinedIndex >> SELECTION_SHIFT,
                        item: combinedIndex & SELECTION_MASK
                    }
            };
        var createGroupSelection = function(group, selectedItems) {
                var groupItems = group.items,
                    groupSelection = {
                        key: group.key,
                        items: []
                    };
                $.each(selectedItems, function(_, itemIndex) {
                    groupSelection.items.push(groupItems[itemIndex])
                });
                return groupSelection
            };
        var groupByKey = function(groups, key) {
                var length = groups.length;
                for (var i = 0; i < length; i++)
                    if (groups[i].key === key)
                        return groups[i]
            };
        var GroupedListEditStrategy = ListEditStrategy.inherit({
                _groupElements: function() {
                    return this._list._itemContainer().find("." + LIST_GROUP_CLASS)
                },
                _groupItemElements: function($group) {
                    return $group.find("." + LIST_ITEM_CLASS)
                },
                isItemIndex: function(index) {
                    return $.isNumeric(index.group) && $.isNumeric(index.item)
                },
                getItemElementIndex: function(itemElement) {
                    var $item = $(itemElement),
                        $group = $item.closest("." + LIST_GROUP_CLASS);
                    return combineIndex({
                            group: this._groupElements().index($group),
                            item: this._groupItemElements($group).index($item)
                        })
                },
                normalizeItemIndex: function(index) {
                    return combineIndex(index)
                },
                deleteItemAtIndex: function(index) {
                    var indices = splitIndex(index),
                        itemGroup = this._list.option("items")[indices.group].items;
                    itemGroup.splice(indices.item, 1)
                },
                updateSelectionAfterDelete: function(fromIndex) {
                    var deletedIndices = splitIndex(fromIndex),
                        selectedItemIndices = this._list._selectedItemIndices;
                    $.each(selectedItemIndices, function(i, index) {
                        var indices = splitIndex(index);
                        if (indices.group === deletedIndices.group && indices.item > deletedIndices.item)
                            selectedItemIndices[i] -= 1
                    })
                },
                fetchSelectedItems: function() {
                    var items = this._list.option("items"),
                        selectedItemIndices = this._list._selectedItemIndices,
                        selectedItems = [];
                    selectedItemIndices.sort(function(a, b) {
                        return a - b
                    });
                    var currentGroupIndex = 0,
                        groupSelectedIndices = [];
                    $.each(selectedItemIndices, function(_, combinedIndex) {
                        var index = splitIndex(combinedIndex);
                        if (index.group !== currentGroupIndex && groupSelectedIndices.length) {
                            selectedItems.push(createGroupSelection(items[currentGroupIndex], groupSelectedIndices));
                            groupSelectedIndices.length = 0
                        }
                        currentGroupIndex = index.group;
                        groupSelectedIndices.push(index.item)
                    });
                    if (groupSelectedIndices.length)
                        selectedItems.push(createGroupSelection(items[currentGroupIndex], groupSelectedIndices));
                    return selectedItems
                },
                selectedItemIndecies: function() {
                    var selectedIndices = [],
                        items = this._list.option("items"),
                        selected = this._list.option("selectedItems");
                    $.each(selected, function(_, selectionInGroup) {
                        var group = groupByKey(items, selectionInGroup.key),
                            groupIndex = $.inArray(group, items);
                        if (!group)
                            throw new Error("Group with key '" + selectionInGroup.key + "' in which you are trying to select items does not exist.");
                        $.each(selectionInGroup.items, function(_, selectedGroupItem) {
                            var itemIndex = $.inArray(selectedGroupItem, group.items);
                            if (itemIndex !== -1)
                                selectedIndices.push(combineIndex({
                                    group: groupIndex,
                                    item: itemIndex
                                }));
                            else
                                throw new Error("Item '" + selectedGroupItem + "' you are trying to select in group '" + selectionInGroup.key + "' does not exist");
                        })
                    });
                    return selectedIndices
                },
                getItemByIndex: function(index) {
                    var indices = splitIndex(index),
                        $group = this._groupElements().eq(indices.group);
                    return this._groupItemElements($group).eq(indices.item)
                }
            });
        var removeDublicates = function(a, b) {
                var c = [];
                $.each(a, function(_, value) {
                    var bIndex = $.inArray(value, b);
                    if (bIndex === -1)
                        c.push(value)
                });
                return c
            };
        var LIST_CLASS = "dx-list",
            LIST_ITEM_CLASS = "dx-list-item",
            LIST_ITEM_SELECTOR = "." + LIST_ITEM_CLASS,
            LIST_GROUP_CLASS = "dx-list-group",
            LIST_GROUP_HEADER_CLASS = "dx-list-group-header",
            LIST_HAS_NEXT_CLASS = "dx-has-next",
            LIST_NEXT_BUTTON_CLASS = "dx-list-next-button",
            LIST_EDITING_CLASS = "dx-list-editing",
            LIST_ITEM_SELECTED_CLASS = "dx-list-item-selected",
            LIST_ITEM_RESPONSE_WAIT_CLASS = "dx-list-item-response-wait",
            LIST_ITEM_DATA_KEY = "dxListItemData",
            LIST_FEEDBACK_SHOW_TIMEOUT = 70;
        ui.registerComponent("dxList", ui.CollectionContainerWidget.inherit({
            _activeStateUnit: LIST_ITEM_SELECTOR,
            _defaultOptions: function() {
                return $.extend(this.callBase(), {
                        pullRefreshEnabled: false,
                        autoPagingEnabled: true,
                        scrollingEnabled: true,
                        showScrollbar: true,
                        useNativeScrolling: true,
                        pullingDownText: Globalize.localize("dxList-pullingDownText"),
                        pulledDownText: Globalize.localize("dxList-pulledDownText"),
                        refreshingText: Globalize.localize("dxList-refreshingText"),
                        pageLoadingText: Globalize.localize("dxList-pageLoadingText"),
                        scrollAction: null,
                        pullRefreshAction: null,
                        pageLoadingAction: null,
                        showNextButton: false,
                        nextButtonText: Globalize.localize("dxList-nextButtonText"),
                        itemHoldAction: null,
                        itemHoldTimeout: 750,
                        itemSwipeAction: null,
                        grouped: false,
                        groupTemplate: "group",
                        groupRender: null,
                        editEnabled: false,
                        editConfig: {
                            itemTemplate: null,
                            itemRender: null,
                            deleteEnabled: false,
                            deleteMode: "toggle",
                            selectionEnabled: false,
                            selectionMode: "item"
                        },
                        itemDeleteAction: null,
                        selectedItems: [],
                        itemSelectAction: null,
                        itemUnselectAction: null
                    })
            },
            _itemClass: function() {
                return LIST_ITEM_CLASS
            },
            _itemDataKey: function() {
                return LIST_ITEM_DATA_KEY
            },
            _itemContainer: function() {
                return this._$container
            },
            _allowDinamicItemsAppend: function() {
                return true
            },
            _init: function() {
                this.callBase();
                this._$container = this._element();
                this._initScrollView();
                this._initEditProvider();
                this._initEditStrategy(this.option("grouped"));
                this._initSelectedItems();
                this._feedbackShowTimeout = LIST_FEEDBACK_SHOW_TIMEOUT
            },
            _initSelectedItems: function() {
                this._selectedItemIndices = this._editStrategy.selectedItemIndecies()
            },
            _clearSelectedItems: function() {
                this._selectedItemIndices = [];
                this._updateSelectedItems()
            },
            _dataSourceOptions: function() {
                return $.extend(this.callBase(), {paginate: true})
            },
            _initScrollView: function() {
                var scrollingEnabled = this.option("scrollingEnabled"),
                    pullRefreshEnabled = scrollingEnabled && this.option("pullRefreshEnabled"),
                    autoPagingEnabled = scrollingEnabled && this.option("autoPagingEnabled") && !!this._dataSource;
                var $scrollView = this._element().dxScrollView({
                        disabled: this.option("disabled") || !scrollingEnabled,
                        scrollAction: $.proxy(this._handleScroll, this),
                        pullDownAction: pullRefreshEnabled ? $.proxy(this._handlePullDown, this) : null,
                        reachBottomAction: autoPagingEnabled ? $.proxy(this._handleScrollBottom, this) : null,
                        showScrollbar: this.option("showScrollbar"),
                        useNative: this.option("useNativeScrolling"),
                        pullingDownText: this.option("pullingDownText"),
                        pulledDownText: this.option("pulledDownText"),
                        refreshingText: this.option("refreshingText"),
                        reachBottomText: this.option("pageLoadingText")
                    });
                this._scrollView = $scrollView.dxScrollView("instance");
                this._scrollView.toggleLoading(autoPagingEnabled);
                this._$container = this._scrollView.content();
                this._createScrollViewActions()
            },
            _createScrollViewActions: function() {
                this._scrollAction = this._createActionByOption("scrollAction", {excludeValidators: ["gesture"]});
                this._pullRefreshAction = this._createActionByOption("pullRefreshAction", {excludeValidators: ["gesture"]});
                this._pageLoadingAction = this._createActionByOption("pageLoadingAction", {excludeValidators: ["gesture"]})
            },
            _handleScroll: function(e) {
                this._scrollAction(e)
            },
            _afterItemsRendered: function(tryLoadMore) {
                var isLastPage = this._isLastPage(),
                    allDataLoaded = !tryLoadMore || isLastPage,
                    autoPagingEnabled = this.option("autoPagingEnabled"),
                    stopLoading = !autoPagingEnabled || allDataLoaded,
                    scrollViewIsFull = this._scrollViewIsFull();
                if (stopLoading || scrollViewIsFull) {
                    this._scrollView.release(stopLoading);
                    if (this._shouldRenderNextButton() && this._dataSource.isLoaded())
                        this._toggleNextButton(!allDataLoaded)
                }
                else
                    this._infiniteDataLoading()
            },
            _isLastPage: function() {
                return !this._dataSource || this._dataSource.isLastPage()
            },
            _scrollViewIsFull: function() {
                return !this._scrollView || this._scrollView.isFull()
            },
            _handlePullDown: function(e) {
                this._pullRefreshAction(e);
                if (this._dataSource && !this._dataSource.isLoading()) {
                    this._dataSource.pageIndex(0);
                    this._dataSource.load()
                }
                else
                    this._afterItemsRendered()
            },
            _infiniteDataLoading: function() {
                var dataSource = this._dataSource;
                if (!this._scrollViewIsFull() && dataSource && !dataSource.isLoading() && !this._isLastPage())
                    DX.utils.executeAsync(this._loadNextPage, this)
            },
            _handleScrollBottom: function(e) {
                this._pageLoadingAction(e);
                var dataSource = this._dataSource;
                if (dataSource && !dataSource.isLoading())
                    this._loadNextPage();
                else
                    this._afterItemsRendered()
            },
            _loadNextPage: function() {
                var dataSource = this._dataSource;
                this._expectNextPageLoading();
                dataSource.pageIndex(1 + dataSource.pageIndex());
                return dataSource.load()
            },
            _renderItems: function(items) {
                if (this.option("grouped")) {
                    $.each(items, $.proxy(this._renderGroup, this));
                    this._renderEmptyMessage()
                }
                else
                    this.callBase.apply(this, arguments);
                this._afterItemsRendered(true)
            },
            _handleDataSourceLoadError: function() {
                this.callBase.apply(this, arguments);
                if (this._initialized)
                    this._afterItemsRendered()
            },
            _initEditProvider: function() {
                if (this._editProvider)
                    this._editProvider.dispose();
                this._editProvider = new ui.ListEditProvider(this, this.option("editConfig"))
            },
            _initEditStrategy: function(grouped) {
                var strategy = grouped ? GroupedListEditStrategy : PlainListEditStrategy;
                this._editStrategy = new strategy(this)
            },
            _render: function() {
                this._element().addClass(LIST_CLASS);
                this._renderEditing();
                this.callBase();
                this._attachHoldEvent()
            },
            _attachClickEvent: function() {
                var eventName = events.addNamespace("dxclick", this.NAME),
                    itemSelector = this._itemSelector();
                this._itemContainer().off(eventName, itemSelector).on(eventName, itemSelector, $.proxy(this._handleItemClick, this))
            },
            _handleItemClick: function(e) {
                var $itemElement = $(e.currentTarget);
                if ($itemElement.is(".dx-state-disabled, .dx-state-disabled *"))
                    return;
                var handledByEditProvider = this.option("editEnabled") && this._editProvider.handleClick($itemElement);
                if (handledByEditProvider)
                    return;
                this.callBase.apply(this, arguments)
            },
            _attachHoldEvent: function() {
                var $itemConteiner = this._itemContainer(),
                    eventName = events.addNamespace("dxhold", this.NAME),
                    itemSelector = this._itemSelector();
                $itemConteiner.off(eventName, itemSelector);
                if (this.option("itemHoldAction") || this._editProvider.holdHandlerExists())
                    $itemConteiner.on(eventName, itemSelector, {timeout: this.option("itemHoldTimeout")}, $.proxy(this._handleItemHold, this))
            },
            _handleItemHold: function(e) {
                var $itemElement = $(e.currentTarget);
                if ($itemElement.is(".dx-state-disabled, .dx-state-disabled *"))
                    return;
                var handledByEditProvider = this.option("editEnabled") && this._editProvider.handleHold($itemElement);
                if (handledByEditProvider)
                    return;
                this._handleItemJQueryEvent(e, "itemHoldAction")
            },
            _renderEditing: function() {
                this._element().toggleClass(LIST_EDITING_CLASS, this.option("editEnabled"))
            },
            _shouldRenderNextButton: function() {
                return this.option("showNextButton") && this._dataSource
            },
            _getNextButtonContainer: function() {
                if (!this._nextButtonContainer)
                    this._nextButtonContainer = this._createNextButtonContainer();
                return this._nextButtonContainer
            },
            _createNextButtonContainer: function() {
                var $buttonContainer = $("<div>").addClass(LIST_NEXT_BUTTON_CLASS);
                this._nextButton = $("<div>").dxButton({
                    text: this.option("nextButtonText"),
                    clickAction: $.proxy(this._handleNextButton, this)
                });
                return $buttonContainer.append(this._nextButton)
            },
            _getItemRenderer: function() {
                if (this.option("editEnabled") && this._editProvider.isRenderingByRenderer())
                    return this._editProvider.getItemRenderer();
                return this.callBase()
            },
            _getItemTemplateName: function() {
                if (this.option("editEnabled") && this._editProvider.isRenderingByTemplate())
                    return this._editProvider.getItemTemplateName();
                return this.callBase()
            },
            _postprocessRenderItem: function(args) {
                var $itemElement = $(args.itemElement);
                if (this._isItemSelected(this._getItemIndex($itemElement)))
                    $itemElement.addClass(LIST_ITEM_SELECTED_CLASS);
                if (this.option("itemSwipeAction"))
                    this._attachSwipeEvent($itemElement);
                if (this.option("editEnabled") && this._editProvider.isModifyingByDecorators())
                    this._editProvider.modifyItemElement(args)
            },
            _attachSwipeEvent: function($itemElement) {
                var endEventName = events.addNamespace("dxswipeend", this.NAME);
                $itemElement.on(endEventName, $.proxy(this._handleItemSwipeEnd, this))
            },
            _handleItemSwipeEnd: function(e) {
                this._handleItemJQueryEvent(e, "itemSwipeAction", {direction: e.offset < 0 ? "left" : "right"}, {excludeValidators: ["gesture"]})
            },
            _handleNextButton: function() {
                var source = this._dataSource;
                if (source && !source.isLoading()) {
                    this._scrollView.toggleLoading(true);
                    this._expectNextPageLoading();
                    source.pageIndex(1 + source.pageIndex());
                    source.load();
                    this._nextButtonContainer.detach()
                }
            },
            _groupRenderDefault: function(group) {
                return String(group.key || group)
            },
            _renderGroup: function(index, group) {
                var self = this;
                var groupElement = $("<div>").addClass(LIST_GROUP_CLASS).appendTo(self._itemContainer());
                var groupRenderer = self.option("groupRender"),
                    groupTemplateName = self.option("groupTemplate"),
                    groupTemplate = self._getTemplate(group.template || groupTemplateName, index, group),
                    groupHeaderElement,
                    renderArgs = {
                        index: index,
                        group: group,
                        container: groupElement
                    };
                if (groupRenderer)
                    groupHeaderElement = self._createGroupByRenderer(groupRenderer, renderArgs);
                else if (groupTemplate)
                    groupHeaderElement = self._createGroupByTemplate(groupTemplate, renderArgs);
                else
                    groupHeaderElement = self._createGroupByRenderer(self._groupRenderDefault, renderArgs);
                groupHeaderElement.addClass(LIST_GROUP_HEADER_CLASS);
                this._renderingGroupIndex = index;
                $.each(group.items || [], function(index, item) {
                    self._renderItem(index, item, groupElement)
                })
            },
            _createGroupByRenderer: function(groupRenderer, renderArgs) {
                var groupElement = $("<div>").appendTo(renderArgs.container);
                var rendererResult = groupRenderer(renderArgs.group, renderArgs.index, groupElement);
                if (rendererResult && groupElement[0] !== rendererResult[0])
                    groupElement.append(rendererResult);
                return groupElement
            },
            _createGroupByTemplate: function(groupTemplate, renderArgs) {
                return groupTemplate.render(renderArgs.container, renderArgs.group)
            },
            _clean: function() {
                this._toggleNextButton(false);
                this.callBase.apply(this, arguments)
            },
            _dispose: function() {
                clearTimeout(this._holdTimer);
                this.callBase()
            },
            _toggleNextButton: function(value) {
                var dataSource = this._dataSource,
                    nextButtonContainer = this._getNextButtonContainer();
                this._element().toggleClass(LIST_HAS_NEXT_CLASS, value);
                if (value && dataSource && dataSource.isLoaded())
                    nextButtonContainer.appendTo(this._itemContainer());
                if (!value)
                    nextButtonContainer.detach()
            },
            _optionChanged: function(name, value, prevValue) {
                switch (name) {
                    case"nextButtonText":
                        this._nextButton.dxButton("option", "text", value);
                        break;
                    case"showNextButton":
                        this._toggleNextButton(value);
                        break;
                    case"itemHoldAction":
                    case"itemHoldTimeout":
                        this._attachHoldEvent();
                        break;
                    case"dataSource":
                        this.callBase.apply(this, arguments);
                        this._initScrollView();
                        break;
                    case"pullingDownText":
                    case"pulledDownText":
                    case"refreshingText":
                    case"pageLoadingText":
                    case"useNativeScrolling":
                    case"showScrollbar":
                    case"scrollingEnabled":
                    case"pullRefreshEnabled":
                    case"autoPagingEnabled":
                        this._initScrollView();
                        break;
                    case"selectedItems":
                        if (!this._selectedItemsInternalChange)
                            this._refreshSelectedItems();
                        break;
                    case"itemSwipeAction":
                        this._invalidate();
                        break;
                    case"scrollAction":
                    case"pullRefreshAction":
                    case"pageLoadingAction":
                        this._createScrollViewActions();
                        this._invalidate();
                        break;
                    case"grouped":
                        this._clearSelectedItems();
                        delete this._renderingGroupIndex;
                        this._initEditStrategy(value);
                        this._invalidate();
                        break;
                    case"groupTemplate":
                    case"groupRender":
                        this._invalidate();
                        break;
                    case"items":
                    case"editEnabled":
                        this._clearSelectedItems();
                        this._invalidate();
                        break;
                    case"editConfig":
                        this._initEditProvider();
                        this._invalidate();
                        break;
                    case"width":
                    case"height":
                        this.callBase.apply(this, arguments);
                        this._scrollView.update();
                        break;
                    case"itemDeleteAction":
                    case"itemSelectAction":
                    case"itemUnselectAction":
                        break;
                    default:
                        this.callBase.apply(this, arguments)
                }
            },
            _getItemIndex: function(itemElement) {
                if (this._editStrategy.isItemIndex(itemElement))
                    return this._editStrategy.normalizeItemIndex(itemElement);
                return this._editStrategy.getItemElementIndex(itemElement)
            },
            _getItemElement: function(index) {
                if (this._editStrategy.isItemIndex(index))
                    return this._editStrategy.getItemByIndex(this._editStrategy.normalizeItemIndex(index));
                return $(index)
            },
            _isItemSelected: function(index) {
                return $.inArray(index, this._selectedItemIndices) > -1
            },
            _updateSelectedItems: function() {
                this._selectedItemsInternalChange = true;
                this.option("selectedItems", this._editStrategy.fetchSelectedItems());
                this._selectedItemsInternalChange = false
            },
            _updateSelectionAfterDelete: function(fromIndex) {
                var self = this,
                    itemIndex = $.inArray(fromIndex, this._selectedItemIndices);
                if (itemIndex > -1)
                    this._selectedItemIndices.splice(itemIndex, 1);
                this._editStrategy.updateSelectionAfterDelete(fromIndex);
                this._updateSelectedItems()
            },
            _selectItem: function($itemElement) {
                var index = this._getItemIndex($itemElement);
                if (this.option("editEnabled") && index > -1 && !this._isItemSelected(index)) {
                    $itemElement.addClass(LIST_ITEM_SELECTED_CLASS);
                    this._selectedItemIndices.push(index);
                    $itemElement.trigger("stateChanged");
                    this._updateSelectedItems();
                    this._handleItemEvent($itemElement, "itemSelectAction")
                }
            },
            _unselectItem: function($itemElement) {
                var itemSelectionIndex = $.inArray(this._getItemIndex($itemElement), this._selectedItemIndices);
                if (this.option("editEnabled") && itemSelectionIndex > -1) {
                    $itemElement.removeClass(LIST_ITEM_SELECTED_CLASS);
                    this._selectedItemIndices.splice(itemSelectionIndex, 1);
                    $itemElement.trigger("stateChanged");
                    this._updateSelectedItems();
                    this._handleItemEvent($itemElement, "itemUnselectAction")
                }
            },
            _refreshSelectedItems: function() {
                var self = this,
                    newSelection = this._editStrategy.selectedItemIndecies();
                var unselected = removeDublicates(this._selectedItemIndices, newSelection);
                $.each(unselected, function(_, index) {
                    var $itemElement = self._editStrategy.getItemByIndex(index);
                    self._unselectItem($itemElement)
                });
                var selected = removeDublicates(newSelection, this._selectedItemIndices);
                $.each(selected, function(_, index) {
                    var $itemElement = self._editStrategy.getItemByIndex(index);
                    self._selectItem($itemElement)
                })
            },
            _deleteItemFromDS: function($item) {
                var self = this,
                    deferred = $.Deferred(),
                    disabledState = this.option("disabled"),
                    dataStore = this._dataSource.store();
                this.option("disabled", true);
                if (!dataStore.remove)
                    throw new Error("You have to implement 'remove' method in dataStore used by dxList to be able to delete items");
                dataStore.remove(dataStore.keyOf(this._getItemData($item))).done(function(key) {
                    if (key !== undefined)
                        deferred.resolveWith(self);
                    else
                        deferred.rejectWith(self)
                }).fail(function() {
                    deferred.rejectWith(self)
                });
                deferred.always(function() {
                    self.option("disabled", disabledState)
                });
                return deferred
            },
            _refreshLastPage: function() {
                this._expectLastItemLoading();
                return this._dataSource.load()
            },
            deleteItem: function(itemElement) {
                var self = this,
                    deferred = $.Deferred(),
                    $item = this._getItemElement(itemElement),
                    index = this._getItemIndex(itemElement),
                    changingOption;
                if (this.option("editEnabled") && index > -1) {
                    $item.addClass(LIST_ITEM_RESPONSE_WAIT_CLASS);
                    if (this._dataSource) {
                        changingOption = "dataSource";
                        deferred = this._deleteItemFromDS($item)
                    }
                    else {
                        changingOption = "items";
                        deferred.resolveWith(this)
                    }
                }
                else
                    deferred.rejectWith(this);
                deferred.done(function() {
                    $item.detach();
                    self._editStrategy.deleteItemAtIndex(index);
                    self.optionChanged.fireWith(self, [changingOption, self.option(changingOption)]);
                    self._updateSelectionAfterDelete(index);
                    self._handleItemEvent($item, "itemDeleteAction", {}, {excludeValidators: ["gesture"]});
                    self._renderEmptyMessage()
                }).fail(function() {
                    $item.removeClass(LIST_ITEM_RESPONSE_WAIT_CLASS)
                });
                if (this._isLastPage() || this.option("grouped"))
                    return deferred.promise();
                var newDeferred = $.Deferred();
                deferred.done(function() {
                    self._refreshLastPage().done(function() {
                        newDeferred.resolveWith(self)
                    })
                });
                deferred.fail(function() {
                    newDeferred.rejectWith(self)
                });
                return newDeferred.promise()
            },
            isItemSelected: function(itemElement) {
                return this._isItemSelected(this._getItemIndex(itemElement))
            },
            selectItem: function(itemElement) {
                this._selectItem(this._getItemElement(itemElement))
            },
            unselectItem: function(itemElement) {
                this._unselectItem(this._getItemElement(itemElement))
            },
            update: function() {
                var self = this,
                    deferred = $.Deferred();
                if (self._scrollView)
                    self._scrollView.update().done(function() {
                        deferred.resolveWith(self)
                    });
                else
                    deferred.resolveWith(self);
                return deferred.promise()
            },
            scrollTop: function() {
                return this._scrollView.scrollOffset().top
            },
            clientHeight: function() {
                return this._scrollView.clientHeight()
            },
            scrollHeight: function() {
                return this._scrollView.scrollHeight()
            },
            scrollBy: function(distance) {
                this._scrollView.scrollBy(distance)
            },
            scrollTo: function(location) {
                this._scrollView.scrollTo(location)
            }
        }))
    })(jQuery, DevExpress);
    /*! Module widgets, file ui.tileView.js */
    (function($, DX, undefined) {
        var ui = DX.ui,
            utils = DX.utils;
        var TILEVIEW_CLASS = "dx-tileview",
            TILEVIEW_WRAPPER_CLASS = "dx-tiles-wrapper",
            TILEVIEW_ITEM_CLASS = "dx-tile",
            TILEVIEW_ITEM_SELECTOR = "." + TILEVIEW_ITEM_CLASS,
            TILEVIEW_ITEM_DATA_KEY = "dxTileData";
        ui.registerComponent("dxTileView", ui.CollectionContainerWidget.inherit({
            _activeStateUnit: TILEVIEW_ITEM_SELECTOR,
            _defaultOptions: function() {
                return $.extend(this.callBase(), {
                        items: null,
                        showScrollbar: false,
                        listHeight: 500,
                        baseItemWidth: 100,
                        baseItemHeight: 100,
                        itemMargin: 20
                    })
            },
            _itemClass: function() {
                return TILEVIEW_ITEM_CLASS
            },
            _itemDataKey: function() {
                return TILEVIEW_ITEM_DATA_KEY
            },
            _itemContainer: function() {
                return this._$wrapper
            },
            _init: function() {
                var self = this;
                self.callBase();
                self._refreshHandler = function() {
                    self._renderGeometry()
                };
                utils.windowResizeCallbacks.add(self._refreshHandler)
            },
            _dispose: function() {
                this.callBase();
                utils.windowResizeCallbacks.remove(this._refreshHandler)
            },
            _render: function() {
                this.cellsPerColumn = 1;
                this._element().addClass(TILEVIEW_CLASS);
                this._renderListHeight();
                this._initScrollable();
                if (!this._$wrapper)
                    this._renderWrapper();
                this.callBase();
                this._renderGeometry();
                this._fireContentReadyAction()
            },
            _renderListHeight: function() {
                this._element().height(this.option("listHeight"))
            },
            _renderContent: function() {
                this._renderContentImpl()
            },
            _renderWrapper: function() {
                this._$wrapper = $("<div />").addClass(TILEVIEW_WRAPPER_CLASS).appendTo(this._scrollView.content())
            },
            _initScrollable: function() {
                this._scrollView = this._element().dxScrollable({
                    direction: "horizontal",
                    showScrollbar: this.option("showScrollbar"),
                    disabled: this.option("disabled")
                }).data("dxScrollable")
            },
            _renderGeometry: function() {
                var items = this.option("items") || [],
                    maxItemHeight = Math.max.apply(Math, $.map(items || [], function(item) {
                        return Math.round(item.heightRatio || 1)
                    }));
                this.cellsPerColumn = Math.floor(this._element().height() / (this.option("baseItemHeight") + this.option("itemMargin")));
                this.cellsPerColumn = Math.max(this.cellsPerColumn, maxItemHeight);
                this.cells = [];
                this.cells.push(new Array(this.cellsPerColumn));
                this._arrangeItems(items);
                this._$wrapper.width(this.cells.length * this.option("baseItemWidth") + (this.cells.length + 1) * this.option("itemMargin"))
            },
            _arrangeItems: function(items) {
                var self = this;
                $.each(items, function(index, item) {
                    var currentItem = {};
                    currentItem.widthRatio = item.widthRatio || 1;
                    currentItem.heightRatio = item.heightRatio || 1;
                    currentItem.text = item.text || "";
                    currentItem.widthRatio = currentItem.widthRatio <= 0 ? 0 : Math.round(currentItem.widthRatio);
                    currentItem.heightRatio = currentItem.heightRatio <= 0 ? 0 : Math.round(currentItem.heightRatio);
                    var $item = self._itemElements().eq(index),
                        itemPosition = self._getItemPosition(currentItem);
                    if (itemPosition.x === -1)
                        itemPosition.x = self.cells.push(new Array(self.cellsPerColumn)) - 1;
                    self._occupyCells(currentItem, itemPosition);
                    self._arrangeItem($item, currentItem, itemPosition)
                })
            },
            _getItemPosition: function(item) {
                var position = {
                        x: -1,
                        y: 0
                    };
                for (var col = 0; col < this.cells.length; col++) {
                    for (var row = 0; row < this.cellsPerColumn; row++)
                        if (this._itemFit(col, row, item)) {
                            position.x = col;
                            position.y = row;
                            break
                        }
                    if (position.x > -1)
                        break
                }
                return position
            },
            _itemFit: function(column, row, item) {
                var result = true;
                if (row + item.heightRatio > this.cellsPerColumn)
                    return false;
                for (var columnIndex = column; columnIndex < column + item.widthRatio; columnIndex++)
                    for (var rowIndex = row; rowIndex < row + item.heightRatio; rowIndex++)
                        if (this.cells.length - 1 < columnIndex)
                            this.cells.push(new Array(this.cellsPerColumn));
                        else if (this.cells[columnIndex][rowIndex]) {
                            result = false;
                            break
                        }
                return result
            },
            _occupyCells: function(item, itemPosition) {
                for (var i = itemPosition.x; i < itemPosition.x + item.widthRatio; i++)
                    for (var j = itemPosition.y; j < itemPosition.y + item.heightRatio; j++)
                        this.cells[i][j] = true
            },
            _arrangeItem: function($item, item, itemPosition) {
                var baseItemHeight = this.option("baseItemHeight"),
                    baseItemWidth = this.option("baseItemWidth"),
                    itemMargin = this.option("itemMargin");
                $item.css({
                    height: item.heightRatio * baseItemHeight + (item.heightRatio - 1) * itemMargin,
                    width: item.widthRatio * baseItemWidth + (item.widthRatio - 1) * itemMargin,
                    top: itemPosition.y * baseItemHeight + (itemPosition.y + 1) * itemMargin,
                    left: itemPosition.x * baseItemWidth + (itemPosition.x + 1) * itemMargin,
                    display: item.widthRatio <= 0 || item.heightRatio <= 0 ? "none" : ""
                })
            },
            _optionChanged: function(name, value) {
                switch (name) {
                    case"showScrollbar":
                        this._initScrollable();
                        break;
                    case"disabled":
                        this._scrollView.option("disabled", value);
                        break;
                    case"baseItemWidth":
                    case"baseItemHeight":
                    case"itemMargin":
                        this._renderGeometry();
                        break;
                    case"listHeight":
                        this._renderListHeight();
                        break;
                    default:
                        this.callBase.apply(this, arguments)
                }
            }
        }))
    })(jQuery, DevExpress);
    /*! Module widgets, file ui.gallery.js */
    (function($, DX, undefined) {
        var ui = DX.ui,
            utils = DX.utils,
            events = ui.events,
            fx = DX.fx,
            translator = DX.translator,
            GALLERY_CLASS = "dx-gallery",
            GALLERY_LOOP_CLASS = "dx-gallery-loop",
            GALLERY_ITEM_CONTAINER_CLASS = GALLERY_CLASS + "-wrapper",
            GALLERY_ACTIVE_CLASS = GALLERY_CLASS + "-active",
            GALLERY_ITEM_CLASS = GALLERY_CLASS + "-item",
            GALLERY_LOOP_ITEM_CLASS = GALLERY_ITEM_CLASS + "-loop",
            GALLERY_ITEM_SELECTOR = "." + GALLERY_ITEM_CLASS,
            GALLERY_ITEM_SELECTED_CLASS = GALLERY_ITEM_CLASS + "-selected",
            GALLERY_INDICATOR_CLASS = GALLERY_CLASS + "-indicator",
            GALLERY_INDICATOR_ITEM_CLASS = GALLERY_INDICATOR_CLASS + "-item",
            GALLERY_INDICATOR_ITEM_SELECTOR = "." + GALLERY_INDICATOR_ITEM_CLASS,
            GALLERY_INDICATOR_ITEM_SELECTED_CLASS = GALLERY_INDICATOR_ITEM_CLASS + "-selected",
            GALLERY_ITEM_DATA_KEY = "dxGalleryItemData";
        ui.registerComponent("dxGalleryNavButton", ui.Widget.inherit({
            _defaultOptions: function() {
                return $.extend(this.callBase(), {direction: "next"})
            },
            _render: function() {
                this.callBase();
                this._element().addClass(GALLERY_CLASS + "-nav-button-" + this.option("direction"))
            },
            _optionChanged: function(name, value, prevValue) {
                switch (name) {
                    case"clickAction":
                    case"direction":
                        this._invalidate();
                        break;
                    default:
                        this.callBase(name, value, prevValue)
                }
            }
        }));
        ui.registerComponent("dxGallery", ui.CollectionContainerWidget.inherit({
            _activeStateUnit: GALLERY_ITEM_SELECTOR,
            _defaultOptions: function() {
                return $.extend(this.callBase(), {
                        activeStateEnabled: false,
                        animationDuration: 400,
                        loop: false,
                        swipeEnabled: true,
                        indicatorEnabled: true,
                        showIndicator: true,
                        selectedIndex: 0,
                        slideshowDelay: 0,
                        showNavButtons: false
                    })
            },
            _dataSourceOptions: function() {
                return {paginate: false}
            },
            _itemContainer: function() {
                return this._$container
            },
            _itemClass: function() {
                return GALLERY_ITEM_CLASS
            },
            _itemDataKey: function() {
                return GALLERY_ITEM_DATA_KEY
            },
            _itemWidth: function() {
                return this._itemElements().first().outerWidth()
            },
            _itemsCount: function() {
                return (this.option("items") || []).length
            },
            _itemRenderDefault: function(item, index, itemElement) {
                this.callBase(item, index, itemElement);
                if (!$.isPlainObject(item))
                    itemElement.append($("<img />").attr("src", String(item)))
            },
            _render: function() {
                this._element().addClass(GALLERY_CLASS);
                this._element().toggleClass(GALLERY_LOOP_CLASS, this.option("loop"));
                this._renderDragHandler();
                this._renderItemContainer();
                this.callBase();
                this._renderContainerPosition();
                this._renderItemPositions();
                this._renderIndicator();
                this._renderSelectedIndicatorItem();
                this._renderUserInteraction();
                this._renderNavButtons();
                this._setupSlideShow();
                this._reviseDimensions();
                this._windowResizeCallback = $.proxy(this._handleResize, this);
                utils.windowResizeCallbacks.add(this._windowResizeCallback)
            },
            _renderDragHandler: function() {
                var eventName = events.addNamespace("dragstart", this.NAME);
                this._element().off(eventName).on(eventName, "img", function() {
                    return false
                })
            },
            _renderItems: function(items) {
                this.callBase(items);
                this._renderDuplicateItems()
            },
            _renderItemContainer: function() {
                if (this._$container)
                    return;
                this._$container = $("<div />").addClass(GALLERY_ITEM_CONTAINER_CLASS).appendTo(this._element())
            },
            _renderDuplicateItems: function() {
                var items = this.option("items") || [],
                    itemsCount = items.length;
                if (!itemsCount)
                    return;
                this._element().find("." + GALLERY_LOOP_ITEM_CLASS).remove();
                var itemsPerPage = this._element().width() / this._itemWidth(),
                    duplicateCount = Math.min(itemsPerPage, itemsCount);
                for (var i = 0; i < duplicateCount; i++)
                    this._renderItem(0, items[i]).addClass(GALLERY_LOOP_ITEM_CLASS);
                this._renderItem(0, items[this._itemsCount() - 1]).addClass(GALLERY_LOOP_ITEM_CLASS)
            },
            _handleResize: function() {
                this._renderDuplicateItems();
                this._renderItemPositions();
                this._renderContainerPosition()
            },
            _renderItemPositions: function() {
                var itemWidth = this._itemWidth(),
                    loopItemsCount = this._element().find("." + GALLERY_LOOP_ITEM_CLASS).length,
                    lastItemDuplicateIndex = this._itemsCount() + loopItemsCount - 1;
                this._itemElements().each(function(index) {
                    var realIndex = index;
                    if (index === lastItemDuplicateIndex)
                        realIndex = -1;
                    translator.move($(this), {left: realIndex * itemWidth})
                })
            },
            _renderContainerPosition: function(offset, animate) {
                offset = offset || 0;
                var self = this,
                    itemWidth = this._itemWidth(),
                    selectedIndex = this.option("selectedIndex"),
                    targetIndex = offset - selectedIndex,
                    targetPosition = targetIndex * itemWidth,
                    positionReady;
                if (animate) {
                    self._startSwipe();
                    positionReady = self._animate(targetPosition).done($.proxy(self._endSwipe, self))
                }
                else {
                    translator.move(this._$container, {left: targetPosition});
                    positionReady = $.Deferred().resolveWith(self)
                }
                return positionReady.promise()
            },
            _startSwipe: function() {
                this._element().addClass(GALLERY_ACTIVE_CLASS)
            },
            _endSwipe: function() {
                this._element().removeClass(GALLERY_ACTIVE_CLASS)
            },
            _animate: function(targetPosition, extraConfig) {
                var self = this,
                    animationComplete = $.Deferred();
                fx.animate(this._$container, $.extend({
                    type: "slide",
                    to: {left: targetPosition},
                    duration: self.option("animationDuration"),
                    complete: function() {
                        animationComplete.resolveWith(self)
                    }
                }, extraConfig || {}));
                return animationComplete
            },
            _reviseDimensions: function() {
                var self = this,
                    $firstItem = self._itemElements().first();
                if (!$firstItem)
                    return;
                if (!self.option("height"))
                    self.option("height", $firstItem.outerHeight());
                if (!self.option("width"))
                    self.option("width", $firstItem.outerWidth())
            },
            _renderIndicator: function() {
                if (!this.option("showIndicator")) {
                    this._cleanIndicators();
                    return
                }
                var indicator = this._$indicator = $("<div />").addClass(GALLERY_INDICATOR_CLASS).appendTo(this._element());
                $.each(this.option("items") || [], function() {
                    $("<div />").addClass(GALLERY_INDICATOR_ITEM_CLASS).appendTo(indicator)
                })
            },
            _cleanIndicators: function() {
                if (this._$indicator)
                    this._$indicator.remove()
            },
            _renderSelectedIndicatorItem: function() {
                var selectedIndex = this.option("selectedIndex");
                this._itemElements().removeClass(GALLERY_ITEM_SELECTED_CLASS).eq(selectedIndex).addClass(GALLERY_ITEM_SELECTED_CLASS);
                this._element().find(GALLERY_INDICATOR_ITEM_SELECTOR).removeClass(GALLERY_INDICATOR_ITEM_SELECTED_CLASS).eq(selectedIndex).addClass(GALLERY_INDICATOR_ITEM_SELECTED_CLASS)
            },
            _renderUserInteraction: function() {
                var self = this,
                    rootElement = self._element(),
                    swipeEnabled = self.option("swipeEnabled") && this._itemsCount() > 1,
                    cursor = swipeEnabled ? "pointer" : "default";
                rootElement.dxSwipeable({
                    startAction: swipeEnabled ? $.proxy(self._handleSwipeStart, self) : function(e) {
                        e.jQueryEvent.cancel = true
                    },
                    disabled: this.option("disabled"),
                    updateAction: $.proxy(self._handleSwipeUpdate, self),
                    endAction: $.proxy(self._handleSwipeEnd, self),
                    itemSizeFunc: $.proxy(self._itemWidth, self)
                });
                var indicatorSelectAction = this._createAction(this._handleIndicatorSelect);
                rootElement.find(GALLERY_INDICATOR_ITEM_SELECTOR).off(events.addNamespace("dxclick", this.NAME)).on(events.addNamespace("dxclick", this.NAME), function(e) {
                    indicatorSelectAction({jQueryEvent: e})
                })
            },
            _handleIndicatorSelect: function(args) {
                var e = args.jQueryEvent,
                    instance = args.component;
                if (events.needSkipEvent(e))
                    return;
                if (!instance.option("indicatorEnabled"))
                    return;
                var index = $(e.target).index();
                instance._renderContainerPosition(instance.option("selectedIndex") - index, true).done(function() {
                    this._suppressRenderItemPositions = true;
                    instance.option("selectedIndex", index)
                })
            },
            _renderNavButtons: function() {
                var self = this;
                if (!self.option("showNavButtons")) {
                    self._cleanNavButtons();
                    return
                }
                self._prevNavButton = $("<div />").dxGalleryNavButton({
                    direction: "prev",
                    clickAction: function() {
                        self.prevItem(true)
                    }
                }).appendTo(this._element());
                self._nextNavButton = $("<div />").dxGalleryNavButton({
                    direction: "next",
                    clickAction: function() {
                        self.nextItem(true)
                    }
                }).appendTo(this._element());
                this._renderNavButtonsVisibility()
            },
            _cleanNavButtons: function() {
                if (this._prevNavButton)
                    this._prevNavButton.remove();
                if (this._prevNavButton)
                    this._nextNavButton.remove()
            },
            _renderNavButtonsVisibility: function() {
                if (!this.option("showNavButtons"))
                    return;
                var selectedIndex = this.option("selectedIndex"),
                    loop = this.option("loop"),
                    itemsCount = this._itemsCount();
                if (selectedIndex < itemsCount && selectedIndex > 0 || loop) {
                    this._prevNavButton.show();
                    this._nextNavButton.show()
                }
                if (this._itemsCount() < 2) {
                    this._prevNavButton.hide();
                    this._nextNavButton.hide()
                }
                if (!loop) {
                    if (selectedIndex < 1)
                        this._prevNavButton.hide();
                    if (selectedIndex === itemsCount - 1)
                        this._nextNavButton.hide()
                }
            },
            _setupSlideShow: function() {
                var self = this,
                    slideshowDelay = self.option("slideshowDelay");
                if (!slideshowDelay)
                    return;
                clearTimeout(self._slideshowTimer);
                self._slideshowTimer = setTimeout(function() {
                    if (self._userInteraction) {
                        self._setupSlideShow();
                        return
                    }
                    self.nextItem(true).done(self._setupSlideShow)
                }, slideshowDelay)
            },
            _handleSwipeStart: function(e) {
                var itemsCount = this._itemsCount();
                if (!itemsCount) {
                    e.jQueryEvent.cancel = true;
                    return
                }
                this._stopItemAnimations();
                this._startSwipe();
                this._userInteraction = true;
                if (!this.option("loop")) {
                    var selectedIndex = this.option("selectedIndex");
                    e.jQueryEvent.maxLeftOffset = itemsCount - selectedIndex - 1;
                    e.jQueryEvent.maxRightOffset = selectedIndex
                }
            },
            _stopItemAnimations: function() {
                if (fx.animating(this._$container))
                    fx.stop(this._$container, true)
            },
            _handleSwipeUpdate: function(e) {
                this._renderContainerPosition(e.jQueryEvent.offset)
            },
            _handleSwipeEnd: function(e) {
                this._renderContainerPosition(e.jQueryEvent.targetOffset, true).done(function() {
                    var selectedIndex = this.option("selectedIndex"),
                        newIndex = this._fitIndex(selectedIndex - e.jQueryEvent.targetOffset);
                    this._suppressRenderItemPositions = true;
                    this.option("selectedIndex", newIndex);
                    this._renderContainerPosition();
                    this._userInteraction = false;
                    this._setupSlideShow()
                })
            },
            _flipIndex: function(index) {
                if (!this.option("loop"))
                    return index;
                var itemsCount = this._itemsCount();
                index = index % itemsCount;
                if (index > (itemsCount + 1) / 2)
                    index -= itemsCount;
                if (index < -(itemsCount - 1) / 2)
                    index += itemsCount;
                return index
            },
            _fitIndex: function(index) {
                if (!this.option("loop"))
                    return index;
                var itemsCount = this._itemsCount();
                index = index % itemsCount;
                if (index < 0)
                    index += itemsCount;
                return index
            },
            _clean: function() {
                this.callBase();
                this._cleanIndicators();
                this._cleanNavButtons()
            },
            _dispose: function() {
                utils.windowResizeCallbacks.remove(this._windowResizeCallback);
                clearTimeout(this._slideshowTimer);
                this.callBase()
            },
            _handleSelectedIndexChanged: function() {
                if (!this._suppressRenderItemPositions)
                    this._renderContainerPosition();
                this._suppressRenderItemPositions = false;
                this._renderSelectedIndicatorItem();
                this._renderNavButtonsVisibility()
            },
            _optionChanged: function(name, value, prevValue) {
                switch (name) {
                    case"width":
                        this.callBase(name, value, prevValue);
                        this._handleResize();
                        break;
                    case"animationDuration":
                        this._renderNavButtonsVisibility();
                        break;
                    case"loop":
                        this._element().toggleClass(GALLERY_LOOP_CLASS, value);
                        this._renderNavButtonsVisibility();
                        return;
                    case"selectedIndex":
                        this._handleSelectedIndexChanged();
                        return;
                    case"showIndicator":
                        this._renderIndicator();
                        return;
                    case"showNavButtons":
                        this._renderNavButtons();
                        return;
                    case"slideshowDelay":
                        this._setupSlideShow();
                        return;
                    case"swipeEnabled":
                    case"indicatorEnabled":
                        this._renderUserInteraction();
                        return;
                    default:
                        this.callBase(name, value, prevValue)
                }
            },
            goToItem: function(itemIndex, animation) {
                var d = new $.Deferred,
                    selectedIndex = this.option("selectedIndex"),
                    itemsCount = this._itemsCount();
                itemIndex = this._fitIndex(itemIndex);
                if (itemIndex > itemsCount - 1 || itemIndex < 0)
                    return d.resolveWith(this).promise();
                this._renderContainerPosition(selectedIndex - itemIndex, animation).done(function() {
                    this._suppressRenderItemPositions = true;
                    this.option("selectedIndex", itemIndex);
                    d.resolveWith(this)
                });
                return d.promise()
            },
            prevItem: function(animation) {
                return this.goToItem(this.option("selectedIndex") - 1, animation)
            },
            nextItem: function(animation) {
                return this.goToItem(this.option("selectedIndex") + 1, animation)
            }
        }))
    })(jQuery, DevExpress);
    /*! Module widgets, file ui.overlay.js */
    (function($, DX, undefined) {
        var ui = DX.ui,
            utils = DX.utils,
            events = ui.events,
            fx = DX.fx;
        var OVERLAY_CLASS = "dx-overlay",
            OVERLAY_WRAPPER_CLASS = OVERLAY_CLASS + "-wrapper",
            OVERLAY_CONTENT_CLASS = OVERLAY_CLASS + "-content",
            OVERLAY_SHADER_CLASS = OVERLAY_CLASS + "-shader",
            OVERLAY_MODAL_CLASS = OVERLAY_CLASS + "-modal",
            OVERLAY_SHOW_EVENT_TOLERANCE = 500,
            ACTIONS = ["showingAction", "shownAction", "hidingAction", "hiddenAction", "positioningAction", "positionedAction"],
            LAST_Z_INDEX = 1000,
            DISABLED_STATE_CLASS = "dx-state-disabled";
        ui.registerComponent("dxOverlay", ui.ContainerWidget.inherit({
            _defaultOptions: function() {
                return $.extend(this.callBase(), {
                        activeStateEnabled: false,
                        visible: false,
                        deferRendering: true,
                        shading: true,
                        position: {
                            my: "center",
                            at: "center",
                            of: window
                        },
                        width: function() {
                            return $(window).width() * 0.8
                        },
                        height: function() {
                            return $(window).height() * 0.8
                        },
                        animation: {
                            show: {
                                type: "pop",
                                duration: 400
                            },
                            hide: {
                                type: "pop",
                                duration: 400,
                                to: {
                                    opacity: 0,
                                    scale: 0
                                },
                                from: {
                                    opacity: 1,
                                    scale: 1
                                }
                            }
                        },
                        closeOnOutsideClick: false,
                        closeOnTargetScroll: false,
                        showingAction: null,
                        shownAction: null,
                        positioningAction: null,
                        positionedAction: null,
                        hidingAction: null,
                        hiddenAction: null,
                        targetContainer: undefined,
                        backButtonHandler: undefined
                    })
            },
            _optionsByReference: function() {
                return $.extend(this.callBase(), {animation: true})
            },
            _wrapper: function() {
                return this._$wrapper
            },
            _container: function() {
                return this._$container
            },
            _init: function() {
                this.callBase();
                this._actions = {};
                this._initWindowResizeHandler();
                this._initCloseOnOutsideClickHandler();
                this._$wrapper = $("<div>").addClass(OVERLAY_WRAPPER_CLASS);
                this._$container = $("<div>").addClass(OVERLAY_CONTENT_CLASS);
                this._$wrapper.on("MSPointerDown", $.noop)
            },
            _initOptions: function(options) {
                this._initTargetContainer(options.targetContainer);
                this._initBackButtonHandler(options.backButtonHandler);
                this.callBase(options)
            },
            _initTargetContainer: function(targetContainer) {
                targetContainer = targetContainer === undefined ? DX.overlayTargetContainer() : targetContainer;
                var $element = this._element(),
                    $targetContainer = $element.closest(targetContainer);
                if (!$targetContainer.length)
                    $targetContainer = $(targetContainer).first();
                this._$targetContainer = $targetContainer.length ? $targetContainer : $element.parent()
            },
            _initBackButtonHandler: function(handler) {
                this._backButtonHandler = handler !== undefined ? handler : $.proxy(this._defaultBackButtonHandler, this)
            },
            _defaultBackButtonHandler: function() {
                this.hide()
            },
            _initWindowResizeHandler: function() {
                this._windowResizeCallback = $.proxy(this._renderGeometry, this)
            },
            _initCloseOnOutsideClickHandler: function() {
                this._documentDownHandler = $.proxy(function() {
                    this._handleDocumentDown.apply(this, arguments)
                }, this)
            },
            _handleDocumentDown: function(e) {
                var closeOnOutsideClick = this.option("closeOnOutsideClick");
                if ($.isFunction(closeOnOutsideClick))
                    closeOnOutsideClick = closeOnOutsideClick(e);
                if (closeOnOutsideClick) {
                    var $container = this._$container,
                        outsideClick = !$container.is(e.target) && !$.contains($container.get(0), e.target),
                        showingEvent = Math.abs(e.timeStamp - this._showTimestamp) < OVERLAY_SHOW_EVENT_TOLERANCE;
                    if (outsideClick && !showingEvent)
                        this.hide()
                }
            },
            _render: function() {
                var $element = this._element();
                this._$wrapper.addClass($element.attr("class"));
                this._setActions();
                this._renderModalState();
                this.callBase();
                $element.addClass(OVERLAY_CLASS)
            },
            _setActions: function() {
                var self = this;
                $.each(ACTIONS, function(_, action) {
                    self._actions[action] = self._createActionByOption(action) || function(){}
                })
            },
            _renderModalState: function(visible) {
                this._$wrapper.toggleClass(OVERLAY_MODAL_CLASS, this.option("shading") && !this.option("targetContainer"))
            },
            _renderVisibilityAnimate: function(visible) {
                if (visible)
                    this._showTimestamp = $.now();
                this._stopAnimation();
                if (visible)
                    return this._makeVisible();
                else
                    return this._makeHidden()
            },
            _makeVisible: function() {
                var self = this,
                    deferred = $.Deferred(),
                    animation = self.option("animation") || {},
                    showAnimation = animation.show,
                    completeShowAnimation = showAnimation && showAnimation.complete || $.noop;
                var zIndex = ++LAST_Z_INDEX;
                this._$wrapper.css("z-index", zIndex);
                this._$container.css("z-index", zIndex);
                this._actions.showingAction();
                this._toggleVisibility(true);
                this._animate(showAnimation, function() {
                    completeShowAnimation.apply(this, arguments);
                    self._actions.shownAction();
                    deferred.resolve()
                });
                return deferred.promise()
            },
            _makeHidden: function() {
                var self = this,
                    deferred = $.Deferred(),
                    animation = this.option("animation") || {},
                    hideAnimation = animation.hide,
                    completeHideAnimation = hideAnimation && hideAnimation.complete || $.noop;
                this._actions.hidingAction();
                this._toggleShading(false);
                this._animate(hideAnimation, function() {
                    self._toggleVisibility(false);
                    completeHideAnimation.apply(this, arguments);
                    self._actions.hiddenAction();
                    deferred.resolve()
                });
                return deferred.promise()
            },
            _animate: function(animation, completeCallback) {
                if (animation)
                    fx.animate(this._$container, $.extend({}, animation, {complete: completeCallback}));
                else
                    completeCallback()
            },
            _stopAnimation: function() {
                fx.stop(this._$container, true)
            },
            _toggleVisibility: function(visible) {
                this._stopAnimation();
                this.callBase.apply(this, arguments);
                this._$container.toggle(visible);
                this._toggleShading(visible);
                this._toggleSubscriptions(visible);
                if (visible) {
                    this._renderContent();
                    this._moveToTargetContainer();
                    this._renderGeometry()
                }
                else
                    this._moveFromTargetContainer()
            },
            _toggleShading: function(visible) {
                this._$wrapper.toggleClass(OVERLAY_SHADER_CLASS, visible && this.option("shading"))
            },
            _toggleSubscriptions: function(enabled) {
                this._toggleWindowResizeSubscription(enabled);
                this._toggleBackButtonCallback(enabled);
                this._toggleDocumentDownHandler(enabled);
                this._toggleParentsScrollSubscription(enabled)
            },
            _toggleWindowResizeSubscription: function(subscribe) {
                if (subscribe)
                    utils.windowResizeCallbacks.add(this._windowResizeCallback);
                else
                    utils.windowResizeCallbacks.remove(this._windowResizeCallback)
            },
            _toggleBackButtonCallback: function(subscribe) {
                if (!this._backButtonHandler)
                    return;
                if (subscribe)
                    DX.backButtonCallback.add(this._backButtonHandler);
                else
                    DX.backButtonCallback.remove(this._backButtonHandler)
            },
            _toggleDocumentDownHandler: function(enabled) {
                var self = this,
                    eventName = events.addNamespace("dxpointerdown", self.NAME);
                if (enabled)
                    $(document).on(eventName, this._documentDownHandler);
                else
                    $(document).off(eventName, this._documentDownHandler)
            },
            _toggleParentsScrollSubscription: function(subscribe) {
                var position = this.option("position");
                if (!position || !position.of)
                    return;
                var self = this,
                    closeOnScroll = this.option("closeOnTargetScroll"),
                    $parents = $(position.of).parents();
                $parents.off(events.addNamespace("scroll", self.NAME));
                if (subscribe && closeOnScroll)
                    $parents.on(events.addNamespace("scroll", self.NAME), function(e) {
                        if (e.overlayProcessed)
                            return;
                        e.overlayProcessed = true;
                        self.hide()
                    })
            },
            _renderContent: function() {
                if (this._contentAlreadyRendered || !this.option("visible") && this.option("deferRendering"))
                    return;
                this._contentAlreadyRendered = true;
                this.callBase()
            },
            _renderContentImpl: function(template) {
                var $element = this._element();
                this._$container.append($element.contents()).appendTo($element);
                (template || this._templates.template).render(this.content())
            },
            _fireContentReadyAction: function() {
                if (this.option("visible"))
                    this._moveToTargetContainer();
                this.callBase.apply(this, arguments)
            },
            _moveToTargetContainer: function() {
                this._attachWrapperToTargetContainer();
                this._$container.appendTo(this._$wrapper)
            },
            _attachWrapperToTargetContainer: function() {
                var $element = this._element();
                if (this._$targetContainer && !(this._$targetContainer[0] === $element.parent()[0]))
                    this._$wrapper.appendTo(this._$targetContainer);
                else
                    this._$wrapper.appendTo($element)
            },
            _moveFromTargetContainer: function() {
                this._$container.appendTo(this._element());
                this._detachWrapperFromTargetContainer()
            },
            _detachWrapperFromTargetContainer: function() {
                this._$wrapper.detach()
            },
            _renderGeometry: function() {
                if (this.option("visible"))
                    this._renderGeometryImpl()
            },
            _renderGeometryImpl: function() {
                this._renderDimensions();
                this._renderPosition()
            },
            _renderDimensions: function() {
                this._$container.width(this.option("width")).height(this.option("height"))
            },
            _renderPosition: function() {
                var position = this.option("position"),
                    $wrapper = this._$wrapper,
                    $positionOf = position ? $(position.of) : $();
                $wrapper.css("position", $positionOf.get(0) === window ? "fixed" : "absolute");
                if (this.option("shading")) {
                    this._$wrapper.show();
                    $wrapper.css({
                        width: $positionOf.outerWidth(),
                        height: $positionOf.outerHeight()
                    });
                    DX.position($wrapper, {
                        my: "top left",
                        at: "top left",
                        of: $positionOf
                    })
                }
                this._$container.css("transform", "none");
                var containerPosition = DX.calculatePosition(this._$container, position);
                this._actions.positioningAction({position: containerPosition});
                var resultPosition = DX.position(this._$container, containerPosition);
                this._actions.positionedAction({position: resultPosition})
            },
            _refresh: function() {
                this._renderModalState();
                this._toggleVisibility(this.option("visible"))
            },
            _dispose: function() {
                this._stopAnimation();
                this._toggleSubscriptions(false);
                this._actions = null;
                this.callBase();
                this._$wrapper.remove();
                this._$container.remove()
            },
            _toggleDisabledState: function(value) {
                this.callBase.apply(this, arguments);
                this._$container.toggleClass(DISABLED_STATE_CLASS, value)
            },
            _optionChanged: function(name, value) {
                if ($.inArray(name, ACTIONS) > -1) {
                    this._setActions();
                    return
                }
                switch (name) {
                    case"shading":
                        this._toggleShading(this.option("visible"));
                        break;
                    case"width":
                    case"height":
                    case"position":
                        this._renderGeometry();
                        break;
                    case"visible":
                        this._renderVisibilityAnimate(value).done($.proxy(function() {
                            if (!this._animateDeferred)
                                return;
                            this._animateDeferred.resolveWith(this);
                            delete this._animateDeferred
                        }, this));
                        break;
                    case"targetContainer":
                        this._initTargetContainer(value);
                        this._invalidate();
                        break;
                    case"deferRendering":
                        this._invalidate();
                        break;
                    case"closeOnOutsideClick":
                        this._toggleDocumentDownHandler(this.option("visible"));
                        break;
                    case"closeOnTargetScroll":
                        this._toggleParentsScrollSubscription(this.option("visible"));
                        break;
                    case"overlayShowEventTolerance":
                    case"animation":
                        break;
                    default:
                        this.callBase.apply(this, arguments)
                }
            },
            toggle: function(showing) {
                showing = showing === undefined ? !this.option("visible") : showing;
                if (showing === this.option("visible"))
                    return $.Deferred().resolve().promise();
                var animateDeferred = $.Deferred();
                this._animateDeferred = animateDeferred;
                this.option("visible", showing);
                return animateDeferred.promise()
            },
            show: function() {
                return this.toggle(true)
            },
            hide: function() {
                return this.toggle(false)
            },
            content: function() {
                return this._$container
            },
            repaint: function() {
                this._renderGeometry()
            }
        }));
        ui.dxOverlay.__internals = {
            OVERLAY_SHOW_EVENT_TOLERANCE: OVERLAY_SHOW_EVENT_TOLERANCE,
            OVERLAY_CLASS: OVERLAY_CLASS,
            OVERLAY_WRAPPER_CLASS: OVERLAY_WRAPPER_CLASS,
            OVERLAY_CONTENT_CLASS: OVERLAY_CONTENT_CLASS,
            OVERLAY_SHADER_CLASS: OVERLAY_SHADER_CLASS,
            OVERLAY_MODAL_CLASS: OVERLAY_MODAL_CLASS
        }
    })(jQuery, DevExpress);
    /*! Module widgets, file ui.toast.js */
    (function($, DX, undefined) {
        var ui = DX.ui;
        var TOAST_CLASS = "dx-toast",
            TOAST_CLASS_PREFIX = TOAST_CLASS + "-",
            TOAST_WRAPPER_CLASS = TOAST_CLASS_PREFIX + "wrapper",
            TOAST_CONTENT_CLASS = TOAST_CLASS_PREFIX + "content",
            TOAST_MESSAGE_CLASS = TOAST_CLASS_PREFIX + "message",
            TOAST_ICON_CLASS = TOAST_CLASS_PREFIX + "icon",
            WIDGET_NAME = "dxToast",
            toastTypes = ["info", "warning", "error", "success"];
        ui.registerComponent(WIDGET_NAME, ui.dxOverlay.inherit({
            _defaultOptions: function() {
                return $.extend(this.callBase(), {
                        message: "",
                        type: "info",
                        displayTime: 2000,
                        position: {
                            my: "bottom center",
                            at: "bottom center",
                            of: window,
                            offset: "0 -20"
                        },
                        animation: {
                            show: {
                                type: "fade",
                                duration: 400,
                                from: 0,
                                to: 1
                            },
                            hide: {
                                type: "fade",
                                duration: 400,
                                to: 0
                            }
                        },
                        shading: false,
                        disabled: false,
                        height: "auto"
                    })
            },
            _renderContentImpl: function() {
                if (this.option("message"))
                    this._message = $("<div>").addClass(TOAST_MESSAGE_CLASS).text(this.option("message")).appendTo(this.content());
                if ($.inArray(this.option("type").toLowerCase(), toastTypes) > -1)
                    this.content().prepend($("<div>").addClass(TOAST_ICON_CLASS));
                this.callBase()
            },
            _render: function() {
                this.callBase();
                this._element().addClass(TOAST_CLASS);
                this._wrapper().addClass(TOAST_WRAPPER_CLASS);
                this._$container.addClass(TOAST_CLASS_PREFIX + String(this.option("type")).toLowerCase());
                this.content().addClass(TOAST_CONTENT_CLASS)
            },
            _makeVisible: function() {
                return this.callBase.apply(this, arguments).done($.proxy(function() {
                        clearTimeout(this._hideTimeout);
                        this._hideTimeout = setTimeout($.proxy(function() {
                            this.hide()
                        }, this), this.option("displayTime"))
                    }, this))
            },
            _dispose: function() {
                clearTimeout(this._hideTimeout);
                this.callBase()
            },
            _optionChanged: function(name, value, prevValue) {
                switch (name) {
                    case"type":
                        this._$container.removeClass(TOAST_CLASS_PREFIX + prevValue);
                        this._$container.addClass(TOAST_CLASS_PREFIX + String(value).toLowerCase());
                        break;
                    case"message":
                        if (this._message)
                            this._message.text(value);
                        break;
                    case"displayTime":
                        break;
                    default:
                        this.callBase.apply(this, arguments)
                }
            }
        }));
        ui.dxToast.__internals = {
            TOAST_CLASS: TOAST_CLASS,
            TOAST_WRAPPER_CLASS: TOAST_WRAPPER_CLASS,
            TOAST_CONTENT_CLASS: TOAST_CONTENT_CLASS,
            TOAST_MESSAGE_CLASS: TOAST_MESSAGE_CLASS,
            TOAST_ICON_CLASS: TOAST_ICON_CLASS,
            TOAST_CLASS_PREFIX: TOAST_CLASS_PREFIX,
            WIDGET_NAME: WIDGET_NAME
        }
    })(jQuery, DevExpress);
    /*! Module widgets, file ui.popup.js */
    (function($, DX, undefined) {
        var ui = DX.ui;
        var POPUP_CLASS = "dx-popup",
            POPUP_WRAPPER_CLASS = POPUP_CLASS + "-wrapper",
            POPUP_FULL_SCREEN_CLASS = POPUP_CLASS + "-fullscreen",
            POPUP_CONTENT_CLASS = POPUP_CLASS + "-content",
            POPUP_TITLE_CLASS = POPUP_CLASS + "-title",
            POPUP_TITLE_SELECTOR = "." + POPUP_TITLE_CLASS,
            POPUP_TITLE_CLOSEBUTTON_CLASS = "dx-closebutton",
            POPUP_BOTTOM_CLASS = "dx-popup-bottom",
            TOOLBAR_LEFT_CLASS = "dx-toolbar-left",
            TOOLBAR_RIGHT_CLASS = "dx-toolbar-right",
            OVERLAY_CONTENT_SELECTOR = ".dx-overlay-content";
        var getButtonContainer = function(force) {
                var device = DX.devices.current(force),
                    container = {
                        cancel: {subclass: "dx-popup-cancel"},
                        clear: {subclass: "dx-popup-clear"},
                        done: {subclass: "dx-popup-done"}
                    };
                if (device.ios) {
                    $.extend(container.cancel, {
                        parent: POPUP_TITLE_SELECTOR,
                        wraperClass: TOOLBAR_LEFT_CLASS
                    });
                    $.extend(container.clear, {
                        parent: POPUP_TITLE_SELECTOR,
                        wraperClass: TOOLBAR_RIGHT_CLASS
                    });
                    $.extend(container.done, {wraperClass: POPUP_BOTTOM_CLASS})
                }
                if (device.android || device.platform === "desktop" || device.win8 || device.tizen || device.generic) {
                    $.extend(container.cancel, {wraperClass: POPUP_BOTTOM_CLASS});
                    $.extend(container.clear, {wraperClass: POPUP_BOTTOM_CLASS});
                    $.extend(container.done, {wraperClass: POPUP_BOTTOM_CLASS})
                }
                return container
            };
        ui.registerComponent("dxPopup", ui.dxOverlay.inherit({
            _defaultOptions: function() {
                return $.extend(this.callBase(), {
                        title: "",
                        showTitle: true,
                        fullScreen: false,
                        cancelButton: null,
                        doneButton: null,
                        clearButton: null,
                        closeButton: null
                    })
            },
            _init: function() {
                this.callBase();
                this._$content = this._container().wrapInner($("<div />").addClass(POPUP_CONTENT_CLASS)).children().eq(0)
            },
            _render: function() {
                this.callBase();
                this._element().addClass(POPUP_CLASS);
                this._wrapper().addClass(POPUP_WRAPPER_CLASS)
            },
            _renderContent: function() {
                this.callBase()
            },
            _renderContentImpl: function() {
                this._container().toggleClass(POPUP_FULL_SCREEN_CLASS, this.option("fullScreen"));
                this.callBase(this._templates.content);
                this._renderTitle();
                this._renderCloseButton();
                this._renderCancelButton();
                this._renderClearButton();
                this._renderDoneButton()
            },
            _renderTitle: function() {
                if (this.option("showTitle")) {
                    this._$title = this._$title || $("<div />").addClass(POPUP_TITLE_CLASS);
                    this._element().append(this._$title);
                    var titleTemplate = this._templates.title;
                    if (titleTemplate)
                        titleTemplate.render(this._$title.html(""));
                    else
                        this._defaultTitleRender();
                    this._$title.prependTo(this._$container)
                }
                else if (this._$title)
                    this._$title.detach()
            },
            _defaultTitleRender: function() {
                this._$title.text(this.option("title"))
            },
            _renderCloseButton: function() {
                if (!this._templates.title && this.option("closeButton") && this.option("showTitle")) {
                    var clickAction = this._createButtonAction();
                    $("<div/>").addClass(POPUP_TITLE_CLOSEBUTTON_CLASS).on(ui.events.addNamespace("dxclick", this.NAME + "TitleCloseButton"), function(e) {
                        clickAction({jQueryEvent: e})
                    }).appendTo(this._$title)
                }
            },
            _renderCancelButton: function() {
                this._renderSpecificButton(this.option("cancelButton"), {
                    type: "cancel",
                    text: Globalize.localize("Cancel")
                })
            },
            _renderClearButton: function() {
                this._renderSpecificButton(this.option("clearButton"), {
                    type: "clear",
                    text: Globalize.localize("Clear")
                })
            },
            _renderDoneButton: function() {
                this._renderSpecificButton(this.option("doneButton"), {
                    type: "done",
                    text: Globalize.localize("Done")
                })
            },
            _renderSpecificButton: function(show, buttonConfig) {
                var renderParams = this._getRenderButtonParams(buttonConfig.type);
                this._removeButton(renderParams);
                this._wrapper().toggleClass(POPUP_CLASS + "-" + buttonConfig.type + "-visible", !!show);
                if (!show)
                    return;
                var userButtonOptions = this.option(buttonConfig.type + "Button");
                this._renderButton({
                    text: userButtonOptions.text || buttonConfig.text,
                    clickAction: this._createButtonAction(userButtonOptions.clickAction)
                }, renderParams)
            },
            _createButtonAction: function(clickAction) {
                return this._createAction(clickAction, {afterExecute: function(e) {
                            e.component.hide()
                        }})
            },
            _getRenderButtonParams: function(type) {
                return $.extend({}, getButtonContainer()[type])
            },
            _renderButton: function(buttonParams, renderParams) {
                var $button = $("<div/>").addClass(renderParams.subclass).dxButton(buttonParams),
                    $parentContainer = renderParams.parent ? this._container().find(renderParams.parent) : this._container(),
                    $buttonContainer = this._container().find("." + renderParams.wraperClass);
                if (!$buttonContainer.length)
                    $buttonContainer = $("<div/>").addClass(renderParams.wraperClass).appendTo($parentContainer);
                $button.appendTo($buttonContainer);
                this._container().find("." + POPUP_BOTTOM_CLASS).addClass(renderParams.subclass)
            },
            _removeButton: function(params) {
                var removeSelector = "." + (params.subclass || params.wraperClass);
                if (this.content())
                    this.content().removeClass(params.subclass);
                this._container().find(removeSelector).remove()
            },
            _renderGeometryImpl: function() {
                this.callBase.apply(this, arguments);
                this._setContentHeight()
            },
            _renderDimensions: function() {
                if (this.option("fullScreen")) {
                    this._wrapper().css({
                        width: "100%",
                        height: "100%"
                    });
                    this._container().css({
                        width: "100%",
                        height: "100%"
                    })
                }
                else
                    this.callBase.apply(this, arguments)
            },
            _renderPosition: function() {
                if (this.option("fullScreen"))
                    this._container().css({
                        top: 0,
                        left: 0
                    });
                else
                    this.callBase.apply(this, arguments)
            },
            _setContentHeight: function() {
                if (!this._$content)
                    return;
                var contentHeight = this._$container.height(),
                    hasBottomButtons = this.option("cancelButton") || this.option("doneButton") || this.option("clearButton"),
                    $bottomButtons = this._$wrapper.find(".dx-popup-bottom");
                if (this._$title)
                    contentHeight -= this._$title.outerHeight(true) || 0;
                if (hasBottomButtons) {
                    var bottomButtonsMargin = $bottomButtons.outerHeight(true) || 0;
                    contentHeight -= bottomButtonsMargin;
                    this._$content.css("margin-bottom", bottomButtonsMargin)
                }
                if (this.option("height") === "auto")
                    this._$content.css("height", "auto");
                else if (contentHeight > 0)
                    this._$content.css("height", contentHeight)
            },
            _optionChanged: function(name, value) {
                switch (name) {
                    case"showTitle":
                    case"title":
                        this._renderTitle();
                        this._renderCloseButton();
                        this._setContentHeight();
                        break;
                    case"cancelButton":
                        this._renderCancelButton();
                        break;
                    case"clearButton":
                        this._renderClearButton();
                        break;
                    case"doneButton":
                        this._renderDoneButton();
                        break;
                    case"closeButton":
                        this._renderCloseButton();
                        break;
                    case"fullScreen":
                        this._container().toggleClass(POPUP_FULL_SCREEN_CLASS, value);
                        this._refresh();
                        break;
                    default:
                        this.callBase.apply(this, arguments)
                }
            },
            content: function() {
                return this._$content
            }
        }));
        ui.dxPopup.__internals = {
            POPUP_CLASS: POPUP_CLASS,
            POPUP_WRAPPER_CLASS: POPUP_WRAPPER_CLASS,
            POPUP_CONTENT_CLASS: POPUP_CONTENT_CLASS,
            POPUP_FULL_SCREEN_CLASS: POPUP_FULL_SCREEN_CLASS,
            POPUP_TITLE_CLASS: POPUP_TITLE_CLASS,
            POPUP_TITLE_CLOSEBUTTON_CLASS: POPUP_TITLE_CLOSEBUTTON_CLASS
        }
    })(jQuery, DevExpress);
    /*! Module widgets, file ui.popover.js */
    (function($, DX, undefined) {
        var ui = DX.ui,
            fx = DX.fx;
        var POPOVER_CLASS = "dx-popover",
            POPOVER_WRAPPER_CLASS = "dx-popover-wrapper",
            ARROW_CLASS = "dx-popover-arrow",
            ARROW_FLIPPED_CLASS = "dx-popover-arrow-flipped",
            POPOVER_WITHOUT_TITLE_CLASS = "dx-popover-without-title",
            TOOLTIP_CLASS = "dx-tooltip";
        ui.registerComponent("dxPopover", ui.dxPopup.inherit({
            _defaultOptions: function() {
                return $.extend(this.callBase(), {
                        target: window,
                        shading: false,
                        position: {
                            my: "top center",
                            at: "bottom center",
                            collision: "flip flip"
                        },
                        closeOnOutsideClick: $.proxy(this._isOutsideClick, this),
                        animation: {
                            show: {
                                type: "fade",
                                from: 0,
                                to: 1
                            },
                            hide: {
                                type: "fade",
                                to: 0
                            }
                        },
                        showTitle: false,
                        width: "auto",
                        height: "auto",
                        isTooltip: false,
                        closeOnTargetScroll: true
                    })
            },
            _render: function() {
                this._$arrow = $("<div>").addClass(ARROW_CLASS);
                this._wrapper().addClass(POPOVER_WRAPPER_CLASS);
                if (this.option("isTooltip"))
                    this._wrapper().addClass(TOOLTIP_CLASS);
                this.callBase();
                this._element().addClass(POPOVER_CLASS);
                this._renderTarget()
            },
            _renderContentImpl: function() {
                this.callBase();
                this._$arrow.appendTo(this._wrapper())
            },
            _renderGeometryImpl: function() {
                this.callBase.apply(this, arguments);
                this._updateContentSize()
            },
            _updateContentSize: function() {
                if (!this._$content)
                    return;
                var target = $(this.option("target")),
                    targetOffsetTop = 0;
                if (typeof target.offset() !== "undefined")
                    targetOffsetTop = target.offset().top;
                var containerMargin = this._$container.outerHeight() - this._$content.height(),
                    heightUnderTarget = $(window).height() - targetOffsetTop - target.outerHeight(),
                    maxHeight;
                if (heightUnderTarget > targetOffsetTop)
                    maxHeight = heightUnderTarget - this._$arrow.height() - containerMargin;
                else
                    maxHeight = targetOffsetTop - this._$arrow.height() - containerMargin;
                if (this._$content.height() > maxHeight)
                    this._$content.height(maxHeight - 0)
            },
            _isOutsideClick: function(e) {
                return !$(e.target).closest(this.option("target")).length
            },
            _animate: function(animation) {
                this.callBase.apply(this, arguments);
                if (animation)
                    DX.fx.animate(this._$arrow, $.extend({}, animation, {complete: $.noop}))
            },
            _stopAnimation: function() {
                this.callBase.apply(this, arguments);
                fx.stop(this._$arrow)
            },
            _renderTitle: function() {
                this._wrapper().toggleClass(POPOVER_WITHOUT_TITLE_CLASS, !this.option("showTitle"));
                this.callBase()
            },
            _renderTarget: function() {
                this.option("position.of", this.option("target"))
            },
            _positionAlias: null,
            _setPositionAlias: function() {
                this._positionAlias = this.option("position").at.split(" ")[0]
            },
            _renderPosition: function() {
                this._setPositionAlias();
                this._$wrapper.addClass("dx-position-" + this._positionAlias);
                DX.translator.move(this._$arrow, {
                    left: 0,
                    top: 0
                });
                DX.translator.move(this._$container, {
                    left: 0,
                    top: 0
                });
                this._updateContentSize();
                var arrowPosition = $.extend({}, this.option("position"));
                var containerPosition = $.extend({}, arrowPosition, {offset: this._$arrow.width() + " " + this._$arrow.height()}),
                    containerLocation = DX.calculatePosition(this._$container, containerPosition),
                    isFlippedByVertical = containerLocation.v.flip,
                    isFlippedByHorizontal = containerLocation.h.flip;
                this._$arrow.toggleClass(ARROW_FLIPPED_CLASS, isFlippedByVertical || isFlippedByHorizontal);
                if (isFlippedByVertical || isFlippedByHorizontal)
                    $.extend(arrowPosition, {
                        my: arrowPosition.at,
                        at: arrowPosition.my
                    });
                DX.position(this._$arrow, arrowPosition);
                var contentPosition = {
                        my: arrowPosition.my,
                        at: arrowPosition.at,
                        of: this._$arrow,
                        collision: "fit"
                    };
                contentPosition.offset = this._updateContentOffset(isFlippedByVertical, isFlippedByHorizontal);
                DX.position(this._$container, contentPosition)
            },
            _updateContentOffset: function(isFlippedByVertical, isFlippedByHorizontal) {
                var tooltipPosition = this._positionAlias;
                var isTopPosition = tooltipPosition === "top" && !isFlippedByVertical || tooltipPosition === "bottom" && isFlippedByVertical,
                    isBottomPosition = tooltipPosition === "bottom" && !isFlippedByVertical || tooltipPosition === "top" && isFlippedByVertical,
                    isLeftPosition = tooltipPosition === "left" && !isFlippedByHorizontal || tooltipPosition === "right" && isFlippedByHorizontal,
                    isRightPosition = tooltipPosition === "right" && !isFlippedByHorizontal || tooltipPosition === "left" && isFlippedByHorizontal;
                if (isTopPosition)
                    return "0 1";
                if (isBottomPosition)
                    return "0 -1";
                if (isLeftPosition)
                    return "1 0";
                if (isRightPosition)
                    return "-1 0"
            },
            _optionChanged: function(name, value) {
                switch (name) {
                    case"isTooltip":
                        this._invalidate();
                        break;
                    case"target":
                        this._renderTarget();
                        break;
                    case"fullScreen":
                        if (value)
                            this.option("fullScreen", false);
                        break;
                    default:
                        this.callBase.apply(this, arguments)
                }
            }
        }));
        ui.dxPopover.__internals = {
            POPOVER_CLASS: POPOVER_CLASS,
            POPOVER_WRAPPER_CLASS: POPOVER_WRAPPER_CLASS,
            ARROW_CLASS: ARROW_CLASS,
            ARROW_FLIPPED_CLASS: ARROW_FLIPPED_CLASS,
            POPOVER_WITHOUT_TITLE_CLASS: POPOVER_WITHOUT_TITLE_CLASS,
            TOOLTIP_CLASS: TOOLTIP_CLASS
        }
    })(jQuery, DevExpress);
    /*! Module widgets, file ui.dateBox.js */
    (function($, DX, undefined) {
        var ui = DX.ui,
            events = ui.events,
            support = DX.support,
            globalize = Globalize;
        var DATEBOX_CLASS = "dx-datebox",
            DATEPICKER_CLASS = "dx-datepicker",
            DATEPICKER_WRAPPER_CLASS = "dx-datepicker-wrapper",
            DATEPICKER_ROLLER_CONTAINER_CLASS = "dx-datepicker-rollers",
            DATEPICKER_ROLLER_CLASS = "dx-datepicker-roller",
            DATEPICKER_ROLLER_ACTIVE_CLASS = "dx-state-active",
            DATEPICKER_ROLLER_CURRENT_CLASS = "dx-datepicker-roller-current",
            DATEPICKER_ROLLER_ITEM_CLASS = "dx-datepicker-item",
            DATEPICKER_ROLLER_ITEM_SELECTED_CLASS = "dx-datepicker-item-selected",
            DATEPICKER_ROLLER_ITEM_SELECTED_FRAME_CLASS = "dx-datepicker-item-selected-frame",
            DATEPICKER_ROLLER_BUTTON_UP_CLASS = "dx-datepicker-button-up",
            DATEPICKER_ROLLER_BUTTON_DOWN_CLASS = "dx-datepicker-button-down",
            DATEPICKER_FORMATTER_CONTAINER = "dx-datepicker-formatter-container",
            DATEPICKER_VALUE_FORMATTER = "dx-datepicker-value-formatter",
            DATEPICKER_NAME_FORMATTER = "dx-datepicker-name-formatter",
            SUPPORTED_FORMATS = ["date", "time", "datetime"],
            DEFAULT_FORMATTER = function(value) {
                return value
            },
            DATE_COMPONENT_TEXT_FORMATTER = function(value, name) {
                var $container = $("<div />").addClass(DATEPICKER_FORMATTER_CONTAINER);
                $("<span>").text(value).addClass(DATEPICKER_VALUE_FORMATTER).appendTo($container);
                $("<span>").text(name).addClass(DATEPICKER_NAME_FORMATTER).appendTo($container);
                return $container
            },
            YEAR = "year",
            MONTH = "month",
            DAY = "day",
            HOURS = "hours",
            MINUTES = "minutes",
            SECONDS = "seconds",
            MILLISECONDS = "milliseconds",
            TEN_YEARS = 1000 * 60 * 60 * 24 * 365 * 10;
        var DATE_COMPONENTS_INFO = {};
        DATE_COMPONENTS_INFO[YEAR] = {
            getter: "getFullYear",
            setter: "setFullYear",
            possibleFormats: ["yy", "yyyy"],
            formatter: DEFAULT_FORMATTER,
            startValue: undefined,
            endValue: undefined
        };
        DATE_COMPONENTS_INFO[DAY] = {
            getter: "getDate",
            setter: "setDate",
            possibleFormats: ["d", "dd"],
            formatter: function(value, showNames, date) {
                if (!showNames)
                    return value;
                var formatDate = new Date(date.getTime());
                formatDate.setDate(value);
                return DATE_COMPONENT_TEXT_FORMATTER(value, globalize.culture().calendar.days.names[formatDate.getDay()])
            },
            startValue: 1,
            endValue: undefined
        };
        DATE_COMPONENTS_INFO[MONTH] = {
            getter: "getMonth",
            setter: "setMonth",
            possibleFormats: ["M", "MM", "MMM", "MMMM"],
            formatter: function(value, showNames) {
                var monthName = globalize.culture().calendar.months.names[value];
                return showNames ? DATE_COMPONENT_TEXT_FORMATTER(value + 1, monthName) : monthName
            },
            startValue: 0,
            endValue: 11
        };
        DATE_COMPONENTS_INFO[HOURS] = {
            getter: "getHours",
            setter: "setHours",
            possibleFormats: ["H", "HH", "h", "hh"],
            formatter: function(value) {
                return globalize.format(new Date(0, 0, 0, value), "HH")
            },
            startValue: 0,
            endValue: 23
        };
        DATE_COMPONENTS_INFO[MINUTES] = {
            getter: "getMinutes",
            setter: "setMinutes",
            possibleFormats: ["m", "mm"],
            formatter: function(value) {
                return globalize.format(new Date(0, 0, 0, 0, value), "mm")
            },
            startValue: 0,
            endValue: 59
        };
        DATE_COMPONENTS_INFO[SECONDS] = {
            getter: "getSeconds",
            setter: "setSeconds",
            possibleFormats: ["s", "ss"],
            formatter: function(value) {
                return globalize.format(new Date(0, 0, 0, 0, 0, value), "ss")
            },
            startValue: 0,
            endValue: 59
        };
        DATE_COMPONENTS_INFO[MILLISECONDS] = {
            getter: "getMilliseconds",
            setter: "setMilliseconds",
            possibleFormats: ["f", "ff", "fff"],
            formatter: function(value) {
                return globalize.format(new Date(0, 0, 0, 0, 0, 0, value), "fff")
            },
            startValue: 0,
            endValue: 999
        };
        var FORMATS_INFO = {
                date: {
                    standardPattern: "yyyy-MM-dd",
                    components: [YEAR, DAY, MONTH]
                },
                datetime: {
                    standardPattern: "yyyy'-'MM'-'dd'T'HH':'mm':'ss'Z'",
                    components: [YEAR, DAY, MONTH, HOURS, MINUTES, SECONDS, MILLISECONDS]
                },
                datetimeAndroid: {
                    standardPattern: "yyyy'-'MM'-'dd'T'HH':'mm'Z'",
                    components: [YEAR, DAY, MONTH, HOURS, MINUTES, SECONDS, MILLISECONDS]
                },
                time: {
                    standardPattern: "HH:mm",
                    components: [HOURS, MINUTES]
                }
            };
        var toStandardDateFormat = function(date, mode) {
                return Globalize.format(date, FORMATS_INFO[mode].standardPattern)
            };
        var fromStandardDateFormat = function(date) {
                return Globalize.parseDate(date, FORMATS_INFO.datetime.standardPattern) || Globalize.parseDate(date, FORMATS_INFO.datetimeAndroid.standardPattern) || Globalize.parseDate(date, FORMATS_INFO.time.standardPattern) || Globalize.parseDate(date, FORMATS_INFO.date.standardPattern)
            };
        var getMaxMonthDay = function(year, month) {
                return new Date(year, month + 1, 0).getDate()
            };
        var mergeDates = function(target, source, format) {
                if (!source)
                    return undefined;
                if (isNaN(target.getTime()))
                    target = new Date(0, 0, 0, 0, 0, 0);
                var formatInfo = FORMATS_INFO[format];
                $.each(formatInfo.components, function() {
                    var componentInfo = DATE_COMPONENTS_INFO[this];
                    target[componentInfo.setter](source[componentInfo.getter]())
                });
                return target
            };
        ui.registerComponent("dxDatePickerRoller", ui.dxScrollable.inherit({
            _defaultOptions: function() {
                return $.extend(this.callBase(), {
                        clickableItems: false,
                        showScrollbar: false,
                        useNative: false,
                        selectedIndex: 0,
                        items: []
                    })
            },
            _init: function() {
                this.callBase();
                this._renderSelectedItemFrame();
                this._renderControlButtons()
            },
            _render: function() {
                this.callBase();
                this._element().addClass(DATEPICKER_ROLLER_CLASS);
                this._renderItems();
                this._renderSelectedValue();
                this._renderItemsClick();
                this._wrapAction("_endAction", $.proxy(this._handleEndAction, this))
            },
            _wrapAction: function(actionName, callback) {
                var strategy = this._strategy,
                    originalAction = strategy[actionName];
                strategy[actionName] = function() {
                    callback.apply(this, arguments);
                    return originalAction.apply(this, arguments)
                }
            },
            _renderItems: function() {
                var items = this.option("items") || [],
                    $items = $();
                this._$content.empty();
                $.each(items, function() {
                    $items = $items.add($("<div>").addClass(DATEPICKER_ROLLER_ITEM_CLASS).append(this))
                });
                this._$content.append($items);
                this._$items = $items;
                this.update()
            },
            _renderSelectedItemFrame: function() {
                $("<div>").addClass(DATEPICKER_ROLLER_ITEM_SELECTED_FRAME_CLASS).insertAfter(this._$container)
            },
            _renderControlButtons: function() {
                $("<div>").addClass(DATEPICKER_ROLLER_BUTTON_UP_CLASS).insertAfter(this._$container).dxButton({clickAction: $.proxy(this._handleUpButtonClick, this)});
                $("<div>").addClass(DATEPICKER_ROLLER_BUTTON_DOWN_CLASS).insertAfter(this._$container).dxButton({clickAction: $.proxy(this._handleDownButtonClick, this)})
            },
            _renderSelectedValue: function(selectedIndex) {
                if (selectedIndex === undefined)
                    selectedIndex = this.option("selectedIndex");
                selectedIndex = this._fitIndex(selectedIndex);
                var correctedPosition = this._getItemPosition(selectedIndex);
                this.option().selectedIndex = selectedIndex;
                this._moveTo({y: correctedPosition});
                this._renderActiveStateItem()
            },
            _fitIndex: function(index) {
                var items = this.option("items") || [],
                    itemCount = items.length;
                if (index >= itemCount)
                    return itemCount - 1;
                if (index < 0)
                    return 0;
                return index
            },
            _renderItemsClick: function() {
                var itemSelector = "." + DATEPICKER_ROLLER_ITEM_CLASS,
                    eventName = events.addNamespace("dxclick", this.NAME);
                this._element().off(eventName, itemSelector);
                if (this.option("clickableItems"))
                    this._element().on(eventName, itemSelector, $.proxy(this._handleItemClick, this))
            },
            _handleItemClick: function(e) {
                this._renderSelectedValue(this._itemElementIndex(this._closestItemElement(e)))
            },
            _itemElementIndex: function(itemElement) {
                return this._itemElements().index(itemElement)
            },
            _closestItemElement: function(e) {
                return e.currentTarget
            },
            _itemElements: function() {
                return this._element().find("." + DATEPICKER_ROLLER_ITEM_CLASS)
            },
            _renderActiveStateItem: function() {
                var selectedIndex = this.option("selectedIndex");
                $.each(this._$items, function(index) {
                    $(this).toggleClass(DATEPICKER_ROLLER_ITEM_SELECTED_CLASS, selectedIndex === index)
                })
            },
            _handleUpButtonClick: function() {
                this._animation = true;
                this.option("selectedIndex", this.option("selectedIndex") - 1)
            },
            _handleDownButtonClick: function() {
                this._animation = true;
                this.option("selectedIndex", this.option("selectedIndex") + 1)
            },
            _getItemPosition: function(index) {
                return this._itemHeight() * index
            },
            _moveTo: function(targetLocation) {
                targetLocation = this._normalizeLocation(targetLocation);
                var location = this._location(),
                    moveComplete,
                    delta = {
                        x: -(location.left - targetLocation.x),
                        y: -(location.top - targetLocation.y)
                    };
                if (this._isVisible() && (delta.x || delta.y)) {
                    this._strategy._prepareDirections(true);
                    if (this._animation) {
                        moveComplete = DX.fx.animate(this._$content, {
                            duration: 200,
                            type: "slide",
                            to: {top: targetLocation.y}
                        });
                        delete this._animation
                    }
                    else {
                        moveComplete = $.Deferred().resolve().promise();
                        this._strategy._handleMove(delta)
                    }
                    moveComplete.done($.proxy(function() {
                        this._strategy.update();
                        this._strategy._handleMoveEnd({
                            x: 0,
                            y: 0
                        })
                    }, this))
                }
            },
            _handleEndAction: function() {
                var ratio = -this._location().top / this._itemHeight(),
                    selectedIndex = Math.round(ratio);
                this._animation = true;
                this._renderSelectedValue(selectedIndex)
            },
            _itemHeight: function() {
                var $item = this._$items.first(),
                    height = $item.outerHeight() + parseFloat($item.css("margin-top") || 0);
                return height
            },
            _toggleActive: function(state) {
                this._element().toggleClass(DATEPICKER_ROLLER_ACTIVE_CLASS, state)
            },
            _isVisible: function() {
                return this._$container.is(":visible")
            },
            _optionChanged: function(name) {
                switch (name) {
                    case"selectedIndex":
                        this._renderSelectedValue();
                        break;
                    case"items":
                        this._renderItems();
                        this._renderSelectedValue();
                        break;
                    case"clickableItems":
                        this._renderItemsClick();
                        break;
                    default:
                        this.callBase.apply(this, arguments)
                }
            }
        }));
        ui.registerComponent("dxDatePicker", ui.dxPopup.inherit({
            _valueOption: function() {
                return new Date(this.option("value")) == "Invalid Date" ? new Date : new Date(this.option("value"))
            },
            _defaultOptions: function() {
                return $.extend(this.callBase(), {
                        minDate: new Date(1990, 1, 1),
                        maxDate: new Date($.now() + TEN_YEARS),
                        format: "date",
                        value: new Date,
                        culture: Globalize.culture().name,
                        showNames: false,
                        cancelButton: {
                            text: "Cancel",
                            icon: "close",
                            clickAction: $.proxy(function() {
                                this._value = this._valueOption()
                            }, this)
                        },
                        doneButton: {
                            text: "Done",
                            icon: "save",
                            clickAction: $.proxy(function() {
                                this.option("value", new Date(this._value));
                                this.hide()
                            }, this)
                        }
                    })
            },
            _render: function() {
                this.callBase();
                this._element().addClass(DATEPICKER_CLASS);
                this._wrapper().addClass(DATEPICKER_WRAPPER_CLASS);
                this._value = this._valueOption()
            },
            _renderContentImpl: function() {
                this.callBase();
                this._value = this._valueOption();
                this._renderRollers()
            },
            _renderRollers: function() {
                var self = this;
                if (!self._$rollersContainer)
                    self._$rollersContainer = $("<div>").appendTo(self.content()).addClass(DATEPICKER_ROLLER_CONTAINER_CLASS);
                self._$rollersContainer.empty();
                self._createRollerConfigs();
                self._rollers = {};
                $.each(self._rollerConfigs, function() {
                    var rollerItem = this,
                        $roller = $("<div>").appendTo(self._$rollersContainer).dxDatePickerRoller({
                            items: rollerItem.displayItems,
                            selectedIndex: rollerItem.selectedIndex,
                            showScrollbar: false,
                            startAction: function(e) {
                                var roller = e.component;
                                roller._toggleActive(true);
                                self._setActiveRoller(rollerItem, roller.option("selectedIndex"))
                            },
                            endAction: function(e) {
                                var roller = e.component;
                                self._setRollerState(rollerItem, roller.option("selectedIndex"));
                                roller._toggleActive(false)
                            }
                        });
                    self._rollers[rollerItem.type] = $roller.dxDatePickerRoller("instance")
                })
            },
            _setActiveRoller: function(currentRoller) {
                var activeRoller = this._rollers[currentRoller.type];
                $.each(this._rollers, function() {
                    this._$element.toggleClass(DATEPICKER_ROLLER_CURRENT_CLASS, this === activeRoller)
                })
            },
            _refreshRollers: function() {
                var self = this;
                $.each(this._rollers, function(type) {
                    var correctIndex = self._rollerConfigs[type].getIndex(self._value);
                    this.update();
                    this._renderSelectedValue(correctIndex)
                })
            },
            _setRollerState: function(roller, selectedIndex) {
                if (selectedIndex !== roller.selectedIndex) {
                    var value = roller.valueItems[selectedIndex],
                        setValue = roller.setValue,
                        currentDate = this._value.getDate();
                    if (roller.type === MONTH) {
                        currentDate = Math.min(currentDate, getMaxMonthDay(this._value.getFullYear(), value));
                        this._value.setDate(currentDate)
                    }
                    else if (roller.type === YEAR) {
                        currentDate = Math.min(currentDate, getMaxMonthDay(value, this._value.getMonth()));
                        this._value.setDate(currentDate)
                    }
                    this._value[setValue](value);
                    roller.selectedIndex = selectedIndex
                }
                var dayRoller = this._rollers[DAY];
                if ((roller.type === MONTH || roller.type === YEAR) && dayRoller) {
                    this._createRollerConfig(DAY);
                    var dayRollerConfig = this._rollerConfigs[DAY];
                    window.setTimeout(function() {
                        dayRoller.option("items", dayRollerConfig.displayItems)
                    }, 100)
                }
            },
            _createRollerConfigs: function(format) {
                var self = this;
                format = format || self.option("format");
                self._rollerConfigs = {};
                $.each(self._getFormatPattern(format).split(/\W+/), function(_, formatPart) {
                    $.each(DATE_COMPONENTS_INFO, function(componentName, componentInfo) {
                        if ($.inArray(formatPart, componentInfo.possibleFormats) > -1)
                            self._createRollerConfig(componentName)
                    })
                })
            },
            _getFormatPattern: function(format) {
                var culture = Globalize.culture(this.option("culture")),
                    result = "";
                if (format === "date")
                    result = culture.calendar.patterns.d;
                else if (format === "time")
                    result = culture.calendar.patterns.t;
                else if (format === "datetime")
                    result = [culture.calendar.patterns.d, culture.calendar.patterns.t].join(" ");
                return result
            },
            _createRollerConfig: function(componentName) {
                var componentInfo = DATE_COMPONENTS_INFO[componentName],
                    startValue = componentInfo.startValue,
                    endValue = componentInfo.endValue,
                    formatter = componentInfo.formatter,
                    showNames = this.option("showNames");
                if (componentName === YEAR) {
                    startValue = this.option("minDate").getFullYear();
                    endValue = this.option("maxDate").getFullYear()
                }
                if (componentName === DAY)
                    endValue = getMaxMonthDay(this._value.getFullYear(), this._value.getMonth());
                var config = {
                        type: componentName,
                        setValue: componentInfo.setter,
                        valueItems: [],
                        displayItems: [],
                        getIndex: function(value) {
                            return value[componentInfo.getter]() - startValue
                        }
                    };
                for (var i = startValue; i <= endValue; i++) {
                    config.valueItems.push(i);
                    config.displayItems.push(formatter(i, showNames, this._value))
                }
                config.selectedIndex = config.getIndex(this._value);
                this._rollerConfigs[componentName] = config
            },
            _optionChanged: function(name, value, prevValue) {
                switch (name) {
                    case"showNames":
                    case"minDate":
                    case"maxDate":
                    case"culture":
                    case"format":
                        this._renderRollers();
                        break;
                    case"visible":
                        this.callBase(name, value, prevValue);
                        if (value)
                            this._refreshRollers();
                        break;
                    case"value":
                        this._value = this._valueOption();
                        this._renderRollers();
                    default:
                        this.callBase(name, value, prevValue)
                }
            }
        }));
        ui.registerComponent("dxDateBox", ui.dxEditBox.inherit({
            _defaultOptions: function() {
                return $.extend(this.callBase(), {
                        format: "date",
                        value: new Date,
                        useNativePicker: true
                    })
            },
            _init: function() {
                this.callBase();
                if ($.inArray(this.option("format"), SUPPORTED_FORMATS) === -1)
                    this.option("format", "date");
                this.option("mode", this.option("format"))
            },
            _render: function() {
                this.callBase();
                this._element().addClass(DATEBOX_CLASS);
                this._renderDatePicker()
            },
            _renderDatePicker: function() {
                if (this._usingNativeDatePicker() || this.option("readOnly")) {
                    if (this._datePicker) {
                        this._datePicker._element().remove();
                        this._datePicker = null
                    }
                    return
                }
                var datePickerOptions = {
                        value: this.option("value"),
                        format: this.option("format")
                    };
                if (this._datePicker)
                    this._datePicker.option(datePickerOptions);
                else {
                    this._datePicker = $("<div>").appendTo(this._element()).dxDatePicker($.extend(datePickerOptions, {hidingAction: $.proxy(function(e) {
                            this.option("value", e.component.option("value"))
                        }, this)})).dxDatePicker("instance");
                    var inputClickAction = this._createAction(function(e) {
                            e.component._datePicker.show()
                        });
                    this._input().on(events.addNamespace("dxclick", this.NAME), function(e) {
                        return inputClickAction({jQuery: e})
                    })
                }
            },
            _usingNativeDatePicker: function() {
                return support.inputType(this.option("format")) || this.option("useNativePicker")
            },
            _readOnlyPropValue: function() {
                if (this._usingNativeDatePicker())
                    return this.callBase();
                return true
            },
            _handleValueChange: function() {
                var value = fromStandardDateFormat(this._input().val()),
                    modelValue = new Date(this.option("value") && this.option("value").valueOf()),
                    newValue = mergeDates(modelValue, value, this.option("format"));
                this.option({value: newValue});
                if (newValue !== modelValue)
                    this._renderValue()
            },
            _renderValue: function() {
                this._input().val(toStandardDateFormat(this.option("value"), this.option("format")))
            },
            _renderProps: function() {
                this.callBase();
                this._input().attr("autocomplete", "off")
            },
            _optionChanged: function(name, value, prevValue) {
                switch (name) {
                    case"value":
                        this._renderValue();
                        this._changeAction(value);
                        this._renderDatePicker();
                        break;
                    case"format":
                        this.option("mode", value);
                        this._renderValue();
                        this._renderDatePicker();
                        break;
                    case"readOnly":
                    case"useNativePicker":
                        this._invalidate();
                        break;
                    default:
                        this.callBase(name, value, prevValue)
                }
            }
        }));
        ui.dxDatePicker.__internals = {
            DATEPICKER_CLASS: DATEPICKER_CLASS,
            DATEPICKER_WRAPPER_CLASS: DATEPICKER_WRAPPER_CLASS,
            DATEPICKER_ROLLER_CONTAINER_CLASS: DATEPICKER_ROLLER_CONTAINER_CLASS,
            DATEPICKER_ROLLER_CLASS: DATEPICKER_ROLLER_CLASS,
            DATEPICKER_ROLLER_ACTIVE_CLASS: DATEPICKER_ROLLER_ACTIVE_CLASS,
            DATEPICKER_ROLLER_ITEM_CLASS: DATEPICKER_ROLLER_ITEM_CLASS,
            DATEPICKER_ROLLER_ITEM_SELECTED_CLASS: DATEPICKER_ROLLER_ITEM_SELECTED_CLASS,
            DATEPICKER_ROLLER_ITEM_SELECTED_FRAME_CLASS: DATEPICKER_ROLLER_ITEM_SELECTED_FRAME_CLASS,
            DATEPICKER_ROLLER_BUTTON_UP_CLASS: DATEPICKER_ROLLER_BUTTON_UP_CLASS,
            DATEPICKER_ROLLER_BUTTON_DOWN_CLASS: DATEPICKER_ROLLER_BUTTON_DOWN_CLASS,
            DATEPICKER_ROLLER_CURRENT_CLASS: DATEPICKER_ROLLER_CURRENT_CLASS
        };
        ui.dxDateBox.__internals = {
            toStandardDateFormat: toStandardDateFormat,
            fromStandardDateFormat: fromStandardDateFormat
        }
    })(jQuery, DevExpress);
    /*! Module widgets, file ui.loadIndicator.js */
    (function($, DX, undefined) {
        var ui = DX.ui;
        var LOADINDICATOR_CLASS = "dx-loadindicator",
            LOADINDICATOR_WRAPPER = LOADINDICATOR_CLASS + "-wrapper",
            LOADINDICATOR_ICON = LOADINDICATOR_CLASS + "-icon",
            LOADINDICATOR_SEGMENT = LOADINDICATOR_CLASS + "-segment",
            LOADINDICATOR_SEGMENT_N = LOADINDICATOR_CLASS + "-segment",
            LOADINDICATOR_SEGMENT_WIN8 = LOADINDICATOR_CLASS + "-win8-segment",
            LOADINDICATOR_SEGMENT_N_WIN8 = LOADINDICATOR_CLASS + "-win8-segment",
            LOADINDICATOR_INNER_SEGMENT_WIN8 = LOADINDICATOR_CLASS + "-win8-inner-segment",
            LOADINDICATOR_IMAGE = LOADINDICATOR_CLASS + "-image",
            LOADINDICATOR_SIZES = ["small", "medium", "large"];
        ui.registerComponent("dxLoadIndicator", ui.Widget.inherit({
            _defaultOptions: function() {
                return $.extend(this.callBase(), {
                        disabled: false,
                        visible: true,
                        size: ""
                    })
            },
            _render: function() {
                this.callBase();
                this._element().addClass(LOADINDICATOR_CLASS);
                this._clearSizes();
                this._setSize();
                if (DX.support.animation && !this.option("viaImage"))
                    this._renderMarkupForAnimation();
                else
                    this._renderMarkupForImage()
            },
            _renderMarkupForAnimation: function() {
                var indicator = $("<div>").addClass(LOADINDICATOR_ICON);
                indicator.append($("<div>").addClass(LOADINDICATOR_SEGMENT).addClass(LOADINDICATOR_SEGMENT_N + "0"));
                for (var i = 15; i > 0; --i)
                    indicator.append($("<div>").addClass(LOADINDICATOR_SEGMENT).addClass(LOADINDICATOR_SEGMENT_N + i));
                for (var i = 1; i <= 5; ++i)
                    indicator.append($("<div>").addClass(LOADINDICATOR_SEGMENT_WIN8).addClass(LOADINDICATOR_SEGMENT_N_WIN8 + i).append($("<div>").addClass(LOADINDICATOR_INNER_SEGMENT_WIN8)));
                $("<div>").addClass(LOADINDICATOR_WRAPPER).append(indicator).appendTo(this._element())
            },
            _renderMarkupForImage: function() {
                var size = this.option("size");
                if (size === "small" || size === "large")
                    this._element().addClass(LOADINDICATOR_IMAGE + "-" + size);
                else
                    this._element().addClass(LOADINDICATOR_IMAGE)
            },
            _clearSizes: function() {
                var self = this;
                $.each(LOADINDICATOR_SIZES, function(index, size) {
                    self._element().removeClass(LOADINDICATOR_CLASS + "-" + size)
                })
            },
            _setSize: function() {
                var size = this.option("size");
                if (size && $.inArray(size, LOADINDICATOR_SIZES) !== -1)
                    this._element().addClass(LOADINDICATOR_CLASS + "-" + size)
            },
            _optionChanged: function(name) {
                switch (name) {
                    case"size":
                        this._clearSizes();
                        this._setSize();
                        break;
                    default:
                        this.callBase.apply(this, arguments)
                }
            }
        }))
    })(jQuery, DevExpress);
    /*! Module widgets, file ui.loadPanel.js */
    (function($, DX, undefined) {
        var ui = DX.ui;
        var LOADPANEL_CLASS = "dx-loadpanel",
            LOADPANEL_WRAPPER_CLASS = LOADPANEL_CLASS + "-wrapper",
            LOADPANEL_INDICATOR_CLASS = LOADPANEL_CLASS + "-indicator",
            LOADPANEL_MESSAGE_CLASS = LOADPANEL_CLASS + "-message",
            LOADPANEL_CONTENT_CLASS = LOADPANEL_CLASS + "-content",
            LOADPANEL_CONTENT_WRAPPER_CLASS = LOADPANEL_CONTENT_CLASS + "-wrapper",
            LOADPANEL_PANE_HIDDEN_CLASS = LOADPANEL_CLASS + "-pane-hidden";
        ui.registerComponent("dxLoadPanel", ui.dxOverlay.inherit({
            _defaultOptions: function() {
                return $.extend(this.callBase(), {
                        message: Globalize.localize("Loading"),
                        width: 200,
                        height: 70,
                        animation: null,
                        disabled: false,
                        showIndicator: true,
                        showPane: true
                    })
            },
            _render: function() {
                this._$contentWrapper = $("<div>").addClass(LOADPANEL_CONTENT_WRAPPER_CLASS).appendTo(this.content());
                this.callBase();
                this._element().addClass(LOADPANEL_CLASS);
                this._wrapper().addClass(LOADPANEL_WRAPPER_CLASS)
            },
            _renderContentImpl: function() {
                this.callBase();
                this.content().addClass(LOADPANEL_CONTENT_CLASS);
                this._togglePaneVisible();
                this._cleanPreviousContent();
                this._renderLoadIndicator();
                this._renderMessage()
            },
            _renderMessage: function() {
                var message = this.option("message");
                if (!message)
                    return;
                var $message = $("<div>").addClass(LOADPANEL_MESSAGE_CLASS).text(message);
                this._$contentWrapper.append($message)
            },
            _renderLoadIndicator: function() {
                if (!this.option("showIndicator"))
                    return;
                var $indicator = $("<div>").addClass(LOADPANEL_INDICATOR_CLASS);
                this._$contentWrapper.append($indicator);
                $indicator.dxLoadIndicator()
            },
            _cleanPreviousContent: function() {
                this.content().find("." + LOADPANEL_MESSAGE_CLASS).remove();
                this.content().find("." + LOADPANEL_INDICATOR_CLASS).remove()
            },
            _togglePaneVisible: function() {
                this.content().toggleClass(LOADPANEL_PANE_HIDDEN_CLASS, !this.option("showPane"))
            },
            _optionChanged: function(name, value) {
                switch (name) {
                    case"message":
                    case"showIndicator":
                        this._cleanPreviousContent();
                        this._renderLoadIndicator();
                        this._renderMessage();
                        break;
                    case"showPane":
                        this._togglePaneVisible();
                        break;
                    default:
                        this.callBase.apply(this, arguments)
                }
            },
            _defaultBackButtonHandler: $.noop
        }));
        ui.dxLoadPanel.__internals = {
            LOADPANEL_CLASS: LOADPANEL_CLASS,
            LOADPANEL_WRAPPER_CLASS: LOADPANEL_WRAPPER_CLASS,
            LOADPANEL_MESSAGE_CLASS: LOADPANEL_MESSAGE_CLASS,
            LOADPANEL_CONTENT_CLASS: LOADPANEL_CONTENT_CLASS,
            LOADPANEL_PANE_HIDDEN_CLASS: LOADPANEL_PANE_HIDDEN_CLASS
        }
    })(jQuery, DevExpress);
    /*! Module widgets, file ui.lookup.js */
    (function($, DX, undefined) {
        var ui = DX.ui,
            utils = DX.utils,
            events = ui.events;
        var LOOKUP_CLASS = "dx-lookup",
            LOOKUP_SELECTED_CLASS = LOOKUP_CLASS + "-selected",
            LOOKUP_SEARCH_CLASS = LOOKUP_CLASS + "-search",
            LOOKUP_SEARCH_WRAPPER_CLASS = LOOKUP_CLASS + "-search-wrapper",
            LOOKUP_FIELD_CLASS = LOOKUP_CLASS + "-field",
            LOOKUP_POPUP_CLASS = LOOKUP_CLASS + "-popup",
            LOOKUP_POPUP_WRAPPER_CLASS = LOOKUP_POPUP_CLASS + "-wrapper",
            LOOKUP_POPUP_SEARCH_CLASS = LOOKUP_POPUP_CLASS + "-search",
            LOOKUP_POPOVER_MODE = LOOKUP_CLASS + "-popover-mode",
            LIST_ITEM_SELECTOR = ".dx-list-item",
            LIST_ITEM_DATA_KEY = "dxListItemData",
            POPUP_HIDE_TIMEOUT = 200;
        ui.registerComponent("dxLookup", ui.ContainerWidget.inherit({
            _defaultOptions: function() {
                return $.extend(this.callBase(), {
                        dataSource: null,
                        value: undefined,
                        displayValue: undefined,
                        title: "",
                        valueExpr: null,
                        displayExpr: "this",
                        placeholder: Globalize.localize("Select"),
                        searchPlaceholder: Globalize.localize("Search"),
                        searchEnabled: true,
                        noDataText: Globalize.localize("dxCollectionContainerWidget-noDataText"),
                        searchTimeout: 1000,
                        minFilterLength: 0,
                        fullScreen: false,
                        valueChangeAction: null,
                        itemTemplate: null,
                        itemRender: null,
                        showCancelButton: true,
                        cancelButtonText: Globalize.localize("Cancel"),
                        showClearButton: false,
                        clearButtonText: Globalize.localize("Clear"),
                        showDoneButton: false,
                        doneButtonText: Globalize.localize("Done"),
                        contentReadyAction: null,
                        shownAction: null,
                        hiddenAction: null,
                        popupWidth: function() {
                            return $(window).width() * 0.8
                        },
                        popupHeight: function() {
                            return $(window).height() * 0.8
                        },
                        animation: {
                            show: {
                                type: "fade",
                                to: 1
                            },
                            hide: {
                                type: "fade",
                                to: 0
                            }
                        },
                        usePopover: false
                    })
            },
            _optionsByReference: function() {
                return $.extend(this.callBase(), {value: true})
            },
            _init: function() {
                this.callBase();
                this._initDataSource();
                this._searchTimer = null;
                this._compileValueGetter();
                this._compileDisplayGetter();
                this._createEventActions();
                if (!this._dataSource)
                    this._itemsToDataSource()
            },
            _compileValueGetter: function() {
                this._valueGetter = DX.data.utils.compileGetter(this._valueGetterExpr())
            },
            _valueGetterExpr: function() {
                return this.option("valueExpr") || this._dataSource && this._dataSource._store._key || "this"
            },
            _compileDisplayGetter: function() {
                this._displayGetter = DX.data.utils.compileGetter(this.option("displayExpr"))
            },
            _createEventActions: function() {
                this._valueChangeAction = this._createActionByOption("valueChangeAction")
            },
            _itemsToDataSource: function() {
                this._dataSource = new DevExpress.data.DataSource(this.option("items"))
            },
            _render: function() {
                this.callBase();
                this._element().addClass(LOOKUP_CLASS).toggleClass(LOOKUP_POPOVER_MODE, this.option("usePopover"));
                this._renderField();
                this._needRenderContent = true;
                this._calcSelectedItem($.proxy(this._setFieldText, this))
            },
            _renderContent: $.noop,
            _renderField: function() {
                var fieldClickAction = this._createAction(this._handleFieldClick);
                this._$field = $("<div>").addClass(LOOKUP_FIELD_CLASS).appendTo(this._element()).on(events.addNamespace("dxclick", this.NAME), function(e) {
                    fieldClickAction({jQueryEvent: e})
                })
            },
            _handleFieldClick: function(args) {
                var self = args.component;
                self._renderContentIfNeed();
                self._setListDataSource();
                self._refreshSelected();
                self._popup.show();
                self._lastSelectedItem = self._selectedItem
            },
            _renderContentIfNeed: function() {
                if (this._needRenderContent) {
                    this._renderPopup();
                    this._needRenderContent = false
                }
            },
            _renderPopup: function() {
                var $popup = $("<div>").addClass(LOOKUP_POPUP_CLASS).appendTo(this._element());
                var popupOptions = {
                        title: this.option("title"),
                        contentReadyAction: $.proxy(this._popupContentReadyAction, this),
                        width: this.option("popupWidth"),
                        height: this.option("popupHeight"),
                        cancelButton: this._getCancelButtonConfig(),
                        doneButton: this._getDoneButtonConfig(),
                        clearButton: this._getClearButtonConfig(),
                        shownAction: this._createActionByOption("shownAction"),
                        hiddenAction: this._createActionByOption("hiddenAction")
                    };
                this._popup = this.option("usePopover") && !this.option("fullScreen") ? this._createPopover($popup, popupOptions) : this._createPopup($popup, popupOptions);
                this._popup._wrapper().addClass(LOOKUP_POPUP_WRAPPER_CLASS).toggleClass(LOOKUP_POPUP_SEARCH_CLASS, this.option("searchEnabled"))
            },
            _createPopover: function($element, options) {
                return $element.dxPopover($.extend(options, {
                        showTitle: true,
                        target: this._element(),
                        animation: this.option("animation")
                    })).dxPopover("instance")
            },
            _createPopup: function($element, options) {
                return $element.dxPopup($.extend(options, {
                        fullScreen: this.option("fullScreen"),
                        shading: !this.option("fullScreen"),
                        animation: this.option("animation")
                    })).dxPopup("instance")
            },
            _getCancelButtonConfig: function() {
                return this.option("showCancelButton") ? {text: this.option("cancelButtonText")} : null
            },
            _getDoneButtonConfig: function() {
                return this.option("showDoneButton") ? {
                        text: this.option("doneButtonText"),
                        clickAction: $.proxy(function() {
                            this.option("value", this._valueGetter(this._lastSelectedItem))
                        }, this)
                    } : null
            },
            _getClearButtonConfig: function() {
                return this.option("showClearButton") ? {
                        text: this.option("clearButtonText"),
                        clickAction: $.proxy(function() {
                            this.option("value", undefined)
                        }, this)
                    } : null
            },
            _renderCancelButton: function() {
                this._popup && this._popup.option("cancelButton", this._getCancelButtonConfig())
            },
            _renderDoneButton: function() {
                this._popup && this._popup.option("doneButton", this._getDoneButtonConfig())
            },
            _renderClearButton: function() {
                this._popup && this._popup.option("clearButton", this._getClearButtonConfig())
            },
            _popupContentReadyAction: function() {
                this._renderSearch();
                this._renderList();
                this._setListDataSource()
            },
            _renderSearch: function() {
                this._$search = $("<div>").addClass(LOOKUP_SEARCH_CLASS).dxTextBox({
                    mode: "search",
                    placeholder: this._getSearchPlaceholder(),
                    valueUpdateEvent: "change input",
                    valueUpdateAction: $.proxy(this._searchChangedHandler, this)
                }).appendTo(this._popup.content()).wrap($("<div>").addClass(LOOKUP_SEARCH_WRAPPER_CLASS).toggle(this.option("searchEnabled")));
                this._search = this._$search.dxTextBox("instance")
            },
            _getSearchPlaceholder: function() {
                var minFilterLength = this.option("minFilterLength"),
                    placeholder = this.option("searchPlaceholder");
                if (minFilterLength && placeholder === Globalize.localize("Search"))
                    return utils.stringFormat(Globalize.localize("dxLookup-searchPlaceholder"), minFilterLength);
                return placeholder
            },
            _renderList: function() {
                this._list = $("<div>").appendTo(this._popup.content()).dxList({
                    dataSource: null,
                    itemClickAction: $.proxy(function(e) {
                        this._toggleSelectedClass(e.jQueryEvent);
                        this._updateOptions(e)
                    }, this),
                    itemRenderedAction: $.proxy(function(e) {
                        this._setSelectedClass(e.itemElement, e.itemData)
                    }, this),
                    itemRender: this._getItemRender(),
                    itemTemplate: this.option("itemTemplate"),
                    noDataText: this.option("noDataText")
                }).data("dxList");
                this._list.addExternalTemplate(this._templates);
                if (this._needSetItemRenderToList) {
                    this._updateListItemRender();
                    this._needSetItemRenderToList = false
                }
                this._list.option("contentReadyAction", this.option("contentReadyAction"))
            },
            _setListDataSource: function(force) {
                if (!this._list)
                    return;
                var needsToLoad = this._search.option("value").length >= this.option("minFilterLength"),
                    dataSourceLoaded = !!this._list.option("dataSource"),
                    skip = needsToLoad === dataSourceLoaded;
                if (!force && skip)
                    return;
                this._list.option("dataSource", needsToLoad ? this._dataSource : null);
                if (!needsToLoad)
                    this._list.option("items", undefined)
            },
            _refreshSelected: function() {
                var self = this;
                if (!self._list)
                    return;
                $.each(this._list._element().find(LIST_ITEM_SELECTOR), function() {
                    var item = $(this);
                    self._setSelectedClass(item, item.data(LIST_ITEM_DATA_KEY))
                })
            },
            _calcSelectedItem: function(callback) {
                var ds = this._dataSource,
                    store,
                    valueExpr,
                    thisWidget = this,
                    value = this.option("value");
                function handleLoadSuccess(result) {
                    thisWidget._selectedItem = result;
                    callback()
                }
                if (!ds || value === undefined) {
                    this._selectedItem = undefined;
                    callback();
                    return
                }
                store = ds.store();
                valueExpr = this._valueGetterExpr();
                if (valueExpr === store.key() || store instanceof DX.data.CustomStore)
                    store.byKey(value).done(handleLoadSuccess);
                else
                    store.load({filter: [valueExpr, value]}).done(function(result) {
                        handleLoadSuccess(result[0])
                    })
            },
            _setFieldText: function(text) {
                if (!arguments.length)
                    text = this._getDisplayText();
                this._$field.text(text);
                this.option("displayValue", text)
            },
            _getDisplayText: function() {
                if (this.option("value") === undefined || !this._dataSource)
                    return this.option("placeholder");
                return this._displayGetter(this._selectedItem) || this.option("placeholder")
            },
            _searchChangedHandler: function() {
                if (!this._search)
                    return;
                var searchValue = this._search.option("value"),
                    needsToLoad = searchValue.length >= this.option("minFilterLength");
                clearTimeout(this._searchTimer);
                this._search.option("placeholder", this._getSearchPlaceholder());
                if (!needsToLoad) {
                    this._setListDataSource();
                    return
                }
                if (this.option("searchTimeout"))
                    this._searchTimer = setTimeout($.proxy(this._doSearch, this, searchValue), this.option("searchTimeout"));
                else
                    this._doSearch(searchValue)
            },
            _doSearch: function(searchValue) {
                if (!this._dataSource)
                    return;
                if (!arguments.length)
                    searchValue = this.option("searchEnabled") ? this._search.option("value") : "";
                this._filterStore(searchValue);
                this._setListDataSource()
            },
            _filterStore: function(searchValue) {
                if (!this._dataSource.searchExpr())
                    this._dataSource.searchExpr(this.option("displayExpr"));
                this._dataSource.searchValue(searchValue);
                this._dataSource.pageIndex(0);
                this._dataSource.load()
            },
            _updateOptions: function(e) {
                if (this._lastSelectedItem === e.itemData)
                    this._updateAndHidePopup();
                this._lastSelectedItem = e.itemData;
                if (!this.option("showDoneButton"))
                    this._updateAndHidePopup()
            },
            _setSelectedClass: function(item, itemData) {
                var selected = this._optionValuesEqual("value", this._valueGetter(itemData), this.option("value"));
                item.toggleClass(LOOKUP_SELECTED_CLASS, selected)
            },
            _getItemRender: function() {
                if (!this.option("itemTemplate"))
                    return this.option("itemRender") || $.proxy(this._displayGetter, this)
            },
            _toggleSelectedClass: function(e) {
                var $selectedItem = this._list._element().find("." + LOOKUP_SELECTED_CLASS);
                if ($selectedItem.length)
                    $selectedItem.removeClass(LOOKUP_SELECTED_CLASS);
                $(e.target).closest(LIST_ITEM_SELECTOR).addClass(LOOKUP_SELECTED_CLASS)
            },
            _hidePopup: function() {
                this._popup.hide()
            },
            _updateAndHidePopup: function() {
                this.option("value", this._valueGetter(this._lastSelectedItem));
                clearTimeout(this._hidePopupTimer);
                this._hidePopupTimer = setTimeout($.proxy(this._hidePopup, this), POPUP_HIDE_TIMEOUT);
                this._setFieldText(this._displayGetter(this._lastSelectedItem))
            },
            _updateListItemRender: function() {
                if (this._list)
                    this._list.option("itemRender", this._getItemRender());
                else
                    this._needSetItemRenderToList = true
            },
            _updateListItemTemplate: function() {
                if (this._list)
                    this._list.option("itemTemplate", this.option("itemTemplate"))
            },
            _handleDataSourceChanged: function(items) {
                this._calcSelectedItem($.proxy(this._setFieldText, this))
            },
            _clean: function() {
                if (this._popup)
                    this._popup._element().remove();
                if (this._$field)
                    this._$field.remove();
                this.callBase()
            },
            _dispose: function() {
                clearTimeout(this._searchTimer);
                clearTimeout(this._hidePopupTimer);
                $(window).off(events.addNamespace("popstate", this.NAME));
                this.callBase()
            },
            _changeListOption: function(name, value) {
                if (this._list)
                    this._list.option(name, value)
            },
            _optionChanged: function(name, value) {
                switch (name) {
                    case"valueExpr":
                    case"value":
                        this._calcSelectedItem($.proxy(function() {
                            if (name === "value")
                                this._valueChangeAction({selectedItem: this._selectedItem});
                            this._compileValueGetter();
                            this._compileDisplayGetter();
                            this._refreshSelected();
                            this._setFieldText()
                        }, this));
                        break;
                    case"displayExpr":
                        this._compileDisplayGetter();
                        this._updateListItemRender();
                        this._refreshSelected();
                        this._setFieldText();
                        break;
                    case"displayValue":
                        break;
                    case"itemRender":
                        this._updateListItemRender();
                    case"itemTemplate":
                        this._updateListItemTemplate();
                        break;
                    case"items":
                    case"dataSource":
                        if (name === "items")
                            this._itemsToDataSource();
                        else
                            this._initDataSource();
                        this._setListDataSource(true);
                        this._compileValueGetter();
                        this._calcSelectedItem($.proxy(this._setFieldText, this));
                        break;
                    case"searchEnabled":
                        if (this._$search)
                            this._$search.toggle(value);
                        if (this._popup)
                            this._popup._wrapper().toggleClass(LOOKUP_POPUP_SEARCH_CLASS, value);
                        break;
                    case"minFilterLength":
                        this._setListDataSource();
                        this._setFieldText();
                        this._searchChangedHandler();
                        break;
                    case"placeholder":
                        this._setFieldText();
                        break;
                    case"searchPlaceholder":
                        if (this._$search)
                            this._$search.dxTextBox("instance").option("placeholder", value);
                        break;
                    case"shownAction":
                    case"hiddenAction":
                    case"animation":
                        this._renderPopup();
                        break;
                    case"title":
                    case"fullScreen":
                        if (this._popup)
                            if (!this.option("usePopover"))
                                this._popup.option(name, value);
                            else
                                this._renderPopup();
                        break;
                    case"valueChangeAction":
                        this._createEventActions();
                        break;
                    case"clearButtonText":
                    case"showClearButton":
                        this._renderClearButton();
                        break;
                    case"cancelButtonText":
                    case"showCancelButton":
                        this._renderCancelButton();
                        break;
                    case"doneButtonText":
                    case"showDoneButton":
                        this._renderDoneButton();
                        break;
                    case"contentReadyAction":
                        this._changeListOption("contentReadyAction", value);
                        break;
                    case"popupWidth":
                        if (this._popup)
                            this._popup.option("width", value);
                        break;
                    case"popupHeight":
                        if (this._popup)
                            this._popup.option("height", value);
                        break;
                    case"usePopover":
                        this._invalidate();
                        break;
                    case"noDataText":
                        this._changeListOption("noDataText", this.option("noDataText"));
                        break;
                    case"searchTimeout":
                        break;
                    default:
                        this.callBase.apply(this, arguments)
                }
            }
        }).include(ui.DataHelperMixin))
    })(jQuery, DevExpress);
    /*! Module widgets, file ui.actionSheet.js */
    (function($, DX, undefined) {
        var ui = DX.ui;
        var ACTION_SHEET_CLASS = "dx-action-sheet",
            ACTION_SHEET_CONTAINER_CLASS = "dx-action-sheet-container",
            ACTION_SHEET_POPUP_WRAPPER_CLASS = "dx-action-sheet-popup-wrapper",
            ACTION_SHEET_POPOVER_WRAPPER_CLASS = "dx-action-sheet-popover-wrapper",
            ACTION_SHEET_CANCEL_BUTTON_CLASS = "dx-action-sheet-cancel",
            ACTION_SHEET_ITEM_CLASS = "dx-action-sheet-item",
            ACTION_SHEET_ITEM_DATA_KEY = "dxActionSheetItemData",
            ACTION_SHEET_WITHOUT_TITLE_CLASS = "dx-action-sheet-without-title";
        ui.registerComponent("dxActionSheet", ui.CollectionContainerWidget.inherit({
            _defaultOptions: function() {
                return $.extend(this.callBase(), {
                        usePopover: false,
                        target: null,
                        title: "",
                        showTitle: true,
                        showCancelButton: true,
                        cancelText: Globalize.localize("Cancel"),
                        cancelClickAction: null,
                        noDataText: "",
                        visible: false
                    })
            },
            _itemContainer: function() {
                return this._$itemContainer
            },
            _itemClass: function() {
                return ACTION_SHEET_ITEM_CLASS
            },
            _itemDataKey: function() {
                return ACTION_SHEET_ITEM_DATA_KEY
            },
            _toggleVisibility: $.noop,
            _renderDimensions: $.noop,
            _render: function() {
                this._element().addClass(ACTION_SHEET_CLASS);
                this._createItemContainer();
                this._renderPopup();
                this._renderClick()
            },
            _createItemContainer: function() {
                this._$itemContainer = $("<div>").addClass(ACTION_SHEET_CONTAINER_CLASS);
                this._renderDisabled()
            },
            _renderClick: function() {
                this._popup.option("clickAction", this.option("clickAction"))
            },
            _renderDisabled: function() {
                this._$itemContainer.toggleClass("dx-state-disabled", this.option("disabled"))
            },
            _renderPopup: function() {
                this._$popup = $("<div>").appendTo(this._element());
                this._popup = this._isPopoverMode() ? this._createPopover() : this._createPopup();
                $.extend(this._popup._templates, this._templates);
                this._renderPopupTitle();
                this._mapPopupOption("visible")
            },
            _mapPopupOption: function(optionName) {
                this._popup.option(optionName, this.option(optionName))
            },
            _isPopoverMode: function() {
                return this.option("usePopover") && this.option("target")
            },
            _renderPopupTitle: function() {
                this._mapPopupOption("showTitle");
                this._popup._wrapper().toggleClass(ACTION_SHEET_WITHOUT_TITLE_CLASS, !this.option("showTitle"))
            },
            _clean: function() {
                if (this._$popup)
                    this._$popup.remove();
                this.callBase()
            },
            _createPopover: function() {
                var popover = this._$popup.dxPopover({
                        showTitle: true,
                        title: this.option("title"),
                        width: this.option("width") || 200,
                        height: this.option("height") || "auto",
                        target: this.option("target"),
                        hiddenAction: $.proxy(this.hide, this),
                        contentReadyAction: $.proxy(this._popupContentReadyAction, this)
                    }).dxPopover("instance");
                popover._wrapper().addClass(ACTION_SHEET_POPOVER_WRAPPER_CLASS);
                return popover
            },
            _createPopup: function() {
                var popup = this._$popup.dxPopup({
                        title: this.option("title"),
                        width: this.option("width") || "100%",
                        height: this.option("height") || "auto",
                        contentReadyAction: $.proxy(this._popupContentReadyAction, this),
                        position: {
                            my: "bottom",
                            at: "bottom",
                            of: window
                        },
                        animation: {
                            show: {
                                type: "slide",
                                duration: 400,
                                from: {position: {
                                        my: "top",
                                        at: "bottom",
                                        of: window
                                    }},
                                to: {position: {
                                        my: "bottom",
                                        at: "bottom",
                                        of: window
                                    }}
                            },
                            hide: {
                                type: "slide",
                                duration: 400,
                                from: {position: {
                                        my: "bottom",
                                        at: "bottom",
                                        of: window
                                    }},
                                to: {position: {
                                        my: "top",
                                        at: "bottom",
                                        of: window
                                    }}
                            }
                        }
                    }).dxPopup("instance");
                popup.optionChanged.add($.proxy(function(name, value) {
                    if (name !== "visible")
                        return;
                    this.option("visible", value)
                }, this));
                popup._wrapper().addClass(ACTION_SHEET_POPUP_WRAPPER_CLASS);
                return popup
            },
            _popupContentReadyAction: function() {
                this._popup.content().append(this._$itemContainer);
                this._attachClickEvent();
                this._renderContent();
                this._renderCancelButton()
            },
            _renderCancelButton: function() {
                if (this._isPopoverMode())
                    return;
                if (this._$cancelButton)
                    this._$cancelButton.remove();
                if (this.option("showCancelButton")) {
                    var cancelClickAction = new DX.Action($.proxy(this.hide, this), {beforeExecute: this.option("cancelClickAction")});
                    this._$cancelButton = $("<div>").addClass(ACTION_SHEET_CANCEL_BUTTON_CLASS).appendTo(this._popup.content()).dxButton({
                        text: this.option("cancelText"),
                        clickAction: function(e) {
                            cancelClickAction.execute(e)
                        }
                    })
                }
            },
            _handleItemClick: function(e) {
                this.callBase(e);
                if (!$(e.target).is(".dx-state-disabled, .dx-state-disabled *"))
                    this.hide()
            },
            _itemRenderDefault: function(item, index, itemElement) {
                itemElement.dxButton(item)
            },
            _optionChanged: function(name) {
                switch (name) {
                    case"width":
                    case"height":
                    case"visible":
                    case"title":
                        this._mapPopupOption(name);
                        break;
                    case"disabled":
                        this._renderDisabled();
                        break;
                    case"showTitle":
                        this._renderPopupTitle();
                        break;
                    case"showCancelButton":
                    case"cancelClickAction":
                    case"cancelText":
                        this._renderCancelButton();
                        break;
                    case"target":
                    case"usePopover":
                    case"items":
                        this._invalidate();
                        break;
                    default:
                        this.callBase.apply(this, arguments)
                }
            },
            toggle: function(showing) {
                var self = this,
                    d = $.Deferred();
                self._popup.toggle(showing).done(function() {
                    self.option("visible", showing);
                    d.resolveWith(self)
                });
                return d.promise()
            },
            show: function() {
                return this.toggle(true)
            },
            hide: function() {
                return this.toggle(false)
            }
        }))
    })(jQuery, DevExpress);
    /*! Module widgets, file ui.autocomplete.js */
    (function($, DX, undefined) {
        var ui = DX.ui,
            utils = DX.utils;
        var KEY_DOWN = 40,
            KEY_UP = 38,
            KEY_ENTER = 13,
            KEY_ESC = 27,
            KEY_RIGHT = 39,
            KEY_TAB = 9,
            AUTOCOMPLETE_CLASS = "dx-autocomplete",
            AUTOCOMPLETE_POPUP_WRAPPER_CLASS = AUTOCOMPLETE_CLASS + "-popup-wrapper",
            SELECTED_ITEM_CLASS = "dx-autocomplete-selected",
            SELECTED_ITEM_SELECTOR = "." + SELECTED_ITEM_CLASS,
            LIST_SELECTOR = ".dx-list",
            EDITBOX_INPUT_SELECTOR = ".dx-editbox-input",
            LIST_ITEM_SELECTOR = ".dx-list-item",
            LIST_ITEM_DATA_KEY = "dxListItemData",
            SEARCH_OPERATORS = ["startswith", "contains", "endwith", "notcontains"];
        ui.registerComponent("dxAutocomplete", ui.ContainerWidget.inherit({
            _defaultOptions: function() {
                return $.extend(this.callBase(), {
                        value: "",
                        items: [],
                        dataSource: null,
                        itemTemplate: null,
                        itemRender: null,
                        minSearchLength: 1,
                        searchTimeout: 0,
                        placeholder: "",
                        filterOperator: "contains",
                        displayExpr: "this",
                        valueUpdateAction: null,
                        valueUpdateEvent: "change",
                        maxLength: null
                    })
            },
            _listElement: function() {
                return this._popup.content().find(LIST_SELECTOR)
            },
            _listItemElement: function() {
                return this._popup.content().find(LIST_ITEM_SELECTOR)
            },
            _listSelectedItemElement: function() {
                return this._popup.content().find(SELECTED_ITEM_SELECTOR)
            },
            _inputElement: function() {
                return this._element().find(EDITBOX_INPUT_SELECTOR)
            },
            _textboxElement: function() {
                return this._textbox._element()
            },
            _init: function() {
                this.callBase();
                this._validateFilterOperator();
                this._compileDisplayGetter();
                this._initDataSource();
                this._fillDataSourceFromItemsIfNeeded()
            },
            _fillDataSourceFromItemsIfNeeded: function() {
                if (!this.option("dataSource") && this.option("items"))
                    this._itemsToDataSource()
            },
            _validateFilterOperator: function() {
                var filterOperator = this.option("filterOperator"),
                    normalizedFilterOperator = filterOperator.toLowerCase();
                if ($.inArray(normalizedFilterOperator, SEARCH_OPERATORS) > -1)
                    return;
                throw Error(DX.utils.stringFormat("Filter operator \"{0}\" is unavailable", filterOperator));
            },
            _compileDisplayGetter: function() {
                this._displayGetter = DX.data.utils.compileGetter(this.option("displayExpr"))
            },
            _render: function() {
                this.callBase();
                this._element().addClass(AUTOCOMPLETE_CLASS);
                this._checkExceptions()
            },
            _renderDimensions: function() {
                this._element().width(this.option("width"));
                if (this._popup)
                    this._popup.option("width", this._textboxElement().width())
            },
            _renderContentImpl: function() {
                this._renderTextbox();
                this._renderPopup();
                this._renderValueUpdateEvent()
            },
            _renderTextbox: function() {
                this._textbox = $("<div />").dxTextBox({
                    value: this.option("value"),
                    placeholder: this.option("placeholder"),
                    disabled: this.option("disabled"),
                    maxLength: this.option("maxLength"),
                    keyDownAction: $.proxy(this._handleTextboxKeyDown, this),
                    keyUpAction: $.proxy(this._handleTextboxKeyUp, this),
                    valueUpdateAction: $.proxy(this._updateValue, this),
                    focusOutAction: $.proxy(function() {
                        this._popup.hide()
                    }, this)
                }).appendTo(this._element()).data("dxTextBox");
                this._caretPosition = {
                    start: 0,
                    end: 0
                }
            },
            _renderValueUpdateEvent: function() {
                this._changeAction = this._createActionByOption("valueUpdateAction");
                this._textboxOptionChange("valueUpdateEvent", this._getValueUpdateEvent())
            },
            _getValueUpdateEvent: function() {
                var result = this.option("valueUpdateEvent");
                if (!this._hasUpdateEvent("keyup"))
                    result += " keyup";
                if (!this._hasUpdateEvent("change"))
                    result += " change";
                return result
            },
            _hasUpdateEvent: function(eventName) {
                return eventName && this.option("valueUpdateEvent").indexOf(eventName) !== -1
            },
            _handleTextboxKeyDown: function(e) {
                var $list = this._listElement(),
                    preventedKeys = [KEY_TAB, KEY_UP, KEY_DOWN],
                    key = e.jQueryEvent.which;
                if ($list.is(":hidden"))
                    return;
                if ($.inArray(key, preventedKeys) > -1)
                    e.jQueryEvent.preventDefault()
            },
            _updateValue: function(e) {
                var inputElement = this._inputElement();
                this.option("value", this._textbox.option("value"));
                inputElement.prop("selectionStart", this._caretPosition.start);
                inputElement.prop("selectionEnd", this._caretPosition.end);
                var hasUpdateEvent = e.jQueryEvent && this._hasUpdateEvent(e.jQueryEvent.type);
                if (!e.jQueryEvent || hasUpdateEvent)
                    this._changeAction(this.option("value"))
            },
            _handleTextboxKeyUp: function(e) {
                var key = e.jQueryEvent.which;
                this._caretPosition = {
                    start: this._inputElement().prop("selectionStart"),
                    end: this._inputElement().prop("selectionEnd")
                };
                switch (key) {
                    case KEY_DOWN:
                        this._handleTextboxDownKey();
                        break;
                    case KEY_UP:
                        this._handleTextboxUpKey();
                        break;
                    case KEY_ENTER:
                        this._handleTextboxEnterKey();
                        break;
                    case KEY_RIGHT:
                    case KEY_TAB:
                        this._handleTextboxCompleteKeys();
                        break;
                    case KEY_ESC:
                        this._handleTextboxEscKey();
                        break;
                    default:
                        return
                }
            },
            _handleTextboxDownKey: function() {
                var $selectedItem = this._listSelectedItemElement(),
                    $nextItem;
                if ($selectedItem.length) {
                    $nextItem = $selectedItem.next();
                    $nextItem.addClass(SELECTED_ITEM_CLASS);
                    $selectedItem.removeClass(SELECTED_ITEM_CLASS)
                }
                else
                    this._listItemElement().first().addClass(SELECTED_ITEM_CLASS)
            },
            _handleTextboxUpKey: function() {
                var $selectedItem = this._listSelectedItemElement(),
                    $prevItem,
                    $list = this._listElement();
                if ($list.is(":hidden"))
                    return;
                if (!$selectedItem.length) {
                    this._listItemElement().last().addClass(SELECTED_ITEM_CLASS);
                    return
                }
                $selectedItem.removeClass(SELECTED_ITEM_CLASS);
                $prevItem = $selectedItem.prev();
                if ($prevItem.length)
                    $prevItem.addClass(SELECTED_ITEM_CLASS)
            },
            _handleTextboxEnterKey: function() {
                var $selectedItem = this._listSelectedItemElement(),
                    receivedValue;
                if (!$selectedItem.length) {
                    this._popup.hide();
                    return
                }
                receivedValue = this._selectedItemDataGetter();
                this._caretPosition = {
                    start: receivedValue.length,
                    end: receivedValue.length
                };
                this.option("value", receivedValue);
                this._popup.hide();
                this._inputElement().blur()
            },
            _handleTextboxCompleteKeys: function() {
                var $list = this._listElement(),
                    newValue,
                    receivedValue;
                if ($list.is(":hidden"))
                    return;
                receivedValue = this._selectedItemDataGetter();
                newValue = receivedValue.length ? receivedValue : this._dataSource.items()[0];
                this._caretPosition = {
                    start: newValue.length,
                    end: newValue.length
                };
                newValue = this._displayGetter(newValue);
                this.option("value", newValue);
                this._popup.hide()
            },
            _selectedItemDataGetter: function() {
                var $selectedItem = this._listSelectedItemElement();
                if (!$selectedItem.length)
                    return [];
                return this._displayGetter($selectedItem.data(LIST_ITEM_DATA_KEY))
            },
            _handleTextboxEscKey: function() {
                this._popup.hide()
            },
            _renderPopup: function() {
                var $textbox = this._textboxElement(),
                    textWidth = $textbox.width(),
                    $input = this._textbox._input(),
                    vOffset = 0,
                    hOffset = 0;
                if (DX.devices.current().win8)
                    vOffset = -2;
                else if (DX.devices.current().platform === "desktop" || DX.devices.current().tizen)
                    vOffset = -1;
                if (DX.devices.current().platform === "desktop")
                    hOffset = -1;
                this._popup = $("<div/>").appendTo(this._element()).dxPopup({
                    shading: false,
                    closeOnOutsideClick: false,
                    closeOnTargetScroll: true,
                    showTitle: false,
                    width: textWidth,
                    shownAction: $.proxy(this._handlePopupShown, this),
                    showingAction: $.proxy(this._handlePopupShowing, this),
                    height: "auto",
                    deferRendering: false,
                    position: {
                        my: "left top",
                        at: "left bottom",
                        of: $input,
                        offset: {
                            h: hOffset,
                            v: vOffset
                        },
                        collision: "flip"
                    },
                    animation: {
                        show: {
                            type: "pop",
                            duration: 400,
                            from: {
                                opacity: 0,
                                scale: 1
                            },
                            to: {
                                opacity: 1,
                                scale: 1
                            }
                        },
                        hide: {
                            type: "fade",
                            duration: 400,
                            from: 1,
                            to: 0
                        }
                    }
                }).data("dxPopup");
                this._popup._wrapper().addClass(AUTOCOMPLETE_POPUP_WRAPPER_CLASS);
                this._renderList();
                this._autocompleteResizeCallback = $.proxy(this._calculatePopupWidth, this);
                utils.windowResizeCallbacks.add(this._autocompleteResizeCallback)
            },
            _handlePopupShown: function() {
                var maxHeight = $(window).height() * 0.5;
                if (this._popup.content().height() > maxHeight)
                    this._popup.option("height", maxHeight)
            },
            _handlePopupShowing: function() {
                this._calculatePopupWidth()
            },
            _calculatePopupWidth: function() {
                var $textbox = this._textboxElement(),
                    textWidth = $textbox.width();
                this._popup.option("width", textWidth)
            },
            _renderList: function() {
                this._list = $("<div />").appendTo(this._popup.content()).dxList({
                    itemClickAction: $.proxy(this._handleListItemClick, this),
                    itemTemplate: this.option("itemTemplate"),
                    itemRender: this._getItemRender(),
                    noDataText: "",
                    showNextButton: false,
                    autoPagingEnabled: false,
                    dataSource: this._dataSource
                }).data("dxList");
                this._list.addExternalTemplate(this._templates)
            },
            _getItemRender: function() {
                if (!this.option("itemTemplate"))
                    return this.option("itemRender") || $.proxy(this._displayGetter, this)
            },
            _handleListItemClick: function(e) {
                var value = this._displayGetter(e.itemData);
                this._caretPosition = {
                    start: value.length,
                    end: value.length
                };
                this.option("value", value);
                this._popup.hide();
                this._inputElement().blur()
            },
            _itemsToDataSource: function() {
                this._dataSource = new DevExpress.data.DataSource(this.option("items"));
                return this._dataSource
            },
            _filterDataSource: function() {
                var searchValue = this._textbox.option("value");
                this._reloadDataSource(searchValue);
                this._clearSearchTimer()
            },
            _reloadDataSource: function(searchValue, searchMethod) {
                var self = this,
                    ds = self._dataSource;
                ds.searchExpr(self.option("displayExpr"));
                ds.searchOperation(searchMethod || self.option("filterOperator"));
                ds.searchValue(searchValue);
                self._dataSource.pageIndex(0);
                self._dataSource.load().done(function() {
                    self._refreshVisibility()
                })
            },
            _refreshVisibility: function() {
                var canFilter = this._textbox.option("value").length >= this.option("minSearchLength"),
                    dataSource = this._dataSource,
                    items = dataSource && dataSource.items(),
                    hasResults = items.length;
                if (canFilter && hasResults)
                    if (items.length === 1 && this._displayGetter(items[0]) === this.option("value"))
                        this._popup.hide();
                    else if (this._displayGetter(items[0]).length < this.option("value").length)
                        this._popup.hide();
                    else {
                        this._popup._refresh();
                        this._popup.show()
                    }
                else
                    this._popup.hide()
            },
            _dispose: function() {
                this._clearSearchTimer();
                utils.windowResizeCallbacks.remove(this._autocompleteResizeCallback);
                this.callBase()
            },
            _textboxOptionChange: function(name, value) {
                this._textbox.option(name, value)
            },
            _optionChanged: function(name, value) {
                switch (name) {
                    case"disabled":
                        this.callBase(name, value);
                        this._textboxOptionChange(name, value);
                        break;
                    case"value":
                        this._checkExceptions();
                        this._textboxOptionChange(name, value);
                        this._applyFilter();
                        break;
                    case"maxLength":
                    case"placeholder":
                        this._textboxOptionChange(name, value);
                        break;
                    case"items":
                    case"dataSource":
                        if (name === "items")
                            this._itemsToDataSource();
                        else
                            this._initDataSource();
                    case"itemTemplate":
                    case"itemRender":
                        this._list.option(name, value);
                        break;
                    case"filterOperator":
                        this._validateFilterOperator();
                        break;
                    case"displayExpr":
                        this._compileDisplayGetter();
                        this._list.option("itemRender", this._getItemRender());
                        break;
                    case"minSearchLength":
                    case"searchTimeout":
                        break;
                    case"valueUpdateEvent":
                    case"valueUpdateAction":
                        this._renderValueUpdateEvent();
                        break;
                    case"shouldActivateFocusOut":
                        this._invalidate();
                        break;
                    default:
                        this.callBase.apply(this, arguments)
                }
            },
            _applyFilter: function() {
                var searchValue = this._textbox.option("value"),
                    canFilter = searchValue.length >= this.option("minSearchLength");
                if (!canFilter) {
                    this._clearSearchTimer();
                    this._popup.hide();
                    return
                }
                if (this.option("searchTimeout") > 0) {
                    if (!this._searchTimer)
                        this._searchTimer = setTimeout($.proxy(this._filterDataSource, this), this.option("searchTimeout"))
                }
                else
                    this._filterDataSource()
            },
            _clearSearchTimer: function() {
                clearTimeout(this._searchTimer);
                delete this._searchTimer
            },
            _checkExceptions: function() {
                if (this.option("value") === undefined)
                    throw Error("Value option should not be undefined");
            },
            _clean: function() {
                this.callBase();
                this._element().empty()
            }
        }).include(ui.DataHelperMixin))
    })(jQuery, DevExpress);
    /*! Module widgets, file ui.dropDownMenu.js */
    (function($, DX, undefined) {
        var ui = DX.ui,
            events = ui.events;
        var DROP_DOWN_MENU_CLASS = "dx-dropdownmenu",
            DROP_DOWN_MENU_POPUP_WRAPPER_CLASS = DROP_DOWN_MENU_CLASS + "-popup-wrapper",
            DROP_DOWN_MENU_LIST_CLASS = "dx-dropdownmenu-list",
            DROP_DOWN_MENU_BUTTON_CLASS = "dx-dropdownmenu-button";
        ui.registerComponent("dxDropDownMenu", ui.ContainerWidget.inherit({
            _defaultOptions: function() {
                return $.extend(this.callBase(), {
                        items: [],
                        itemClickAction: null,
                        dataSource: null,
                        itemTemplate: "item",
                        itemRender: null,
                        buttonText: "",
                        buttonIcon: null,
                        buttonIconSrc: null,
                        buttonClickAction: null,
                        usePopover: false
                    })
            },
            _init: function() {
                this.callBase();
                this._initDataSource();
                this._initItemClickAction()
            },
            _initItemClickAction: function() {
                this._itemClickAction = this._createActionByOption("itemClickAction")
            },
            _render: function() {
                this._element().addClass(DROP_DOWN_MENU_CLASS);
                this._renderButton();
                this.callBase()
            },
            _clean: function() {
                this.callBase();
                this._popup._element().remove()
            },
            _renderContentImpl: function() {
                this._renderPopup()
            },
            _renderButton: function() {
                var buttonIconSrc = this.option("buttonIconSrc"),
                    buttonIcon = this.option("buttonIcon");
                if (!buttonIconSrc && !buttonIcon)
                    buttonIcon = "overflow";
                this._button = this._element().addClass(DROP_DOWN_MENU_BUTTON_CLASS).dxButton({
                    text: this.option("buttonText"),
                    icon: buttonIcon,
                    iconSrc: buttonIconSrc,
                    clickAction: this.option("buttonClickAction")
                }).dxButton("instance")
            },
            _renderClick: function() {
                this.callBase();
                var action = this._createAction(this._handleButtonClick);
                this._element().on(events.addNamespace("dxclick", this.NAME), function(e) {
                    action({jQueryEvent: e})
                });
                if (this._popup)
                    this._popup.option("clickAction", this.option("clickAction"))
            },
            _handleButtonClick: function(e) {
                e.component._popup.toggle()
            },
            _renderList: function(instance) {
                var $content = instance.content(),
                    self = this;
                self._list = $content.addClass(DROP_DOWN_MENU_LIST_CLASS).dxList({
                    autoPagingEnabled: false,
                    noDataText: "",
                    itemRender: self.option("itemRender"),
                    itemTemplate: self.option("itemTemplate"),
                    itemClickAction: function(e) {
                        self._popup.hide();
                        self._itemClickAction(e)
                    }
                }).data("dxList");
                self._list.addExternalTemplate(self._templates);
                self._setListDataSource();
                self._attachListClick();
                var listMaxHeight = $(window).height() * 0.5;
                if ($content.height() > listMaxHeight)
                    $content.height(listMaxHeight)
            },
            _toggleVisibility: function(visible) {
                this.callBase(visible);
                this._button.option("visible", visible)
            },
            _attachListClick: function() {
                var action = this._createAction(this._handleListClick);
                this._list._element().off("." + this.NAME).on(events.addNamespace("dxclick", this.NAME), function(e) {
                    action({jQueryEvent: e})
                })
            },
            _handleListClick: function(e) {
                e.component._popup.hide()
            },
            _renderPopup: function() {
                var $popup = this._$popup = $("<div>").appendTo(this._element());
                var popupOptions = {
                        clickAction: this.option("clickAction"),
                        contentReadyAction: $.proxy(this._popupContentReadyHandler, this),
                        deferRendering: false
                    };
                this._popup = this.option("usePopover") ? this._createPopover($popup, popupOptions) : this._createPopup($popup, popupOptions);
                this._popup._wrapper().addClass(DROP_DOWN_MENU_POPUP_WRAPPER_CLASS)
            },
            _popupContentReadyHandler: function() {
                var popup = this._$popup[this.option("usePopover") ? "dxPopover" : "dxPopup"]("instance");
                this._renderList(popup)
            },
            _createPopover: function($element, popupOptions) {
                return $element.dxPopover($.extend(popupOptions, {target: this._element()})).dxPopover("instance")
            },
            _createPopup: function($element, popupOptions) {
                return $element.dxPopup($.extend(popupOptions, {
                        showTitle: false,
                        width: "auto",
                        height: "auto",
                        shading: false,
                        closeOnOutsideClick: $.proxy(function(e) {
                            return !$(e.target).closest(this._button._element()).length
                        }, this),
                        closeOnTargetScroll: true,
                        position: {
                            my: "right top",
                            at: "right bottom",
                            of: this._element(),
                            collision: "fit flip"
                        },
                        animation: {
                            show: {
                                type: "fade",
                                to: 1
                            },
                            hide: {
                                type: "fade",
                                to: 0
                            }
                        }
                    })).dxPopup("instance")
            },
            _setListDataSource: function() {
                if (this._list)
                    this._list.option("dataSource", this._dataSource || this.option("items"))
            },
            _optionChanged: function(name, value) {
                if (/^button/.test(name)) {
                    this._renderButton();
                    return
                }
                switch (name) {
                    case"items":
                    case"dataSource":
                        this._refreshDataSource();
                        this._setListDataSource();
                        break;
                    case"itemRender":
                    case"itemTemplate":
                        if (this._list)
                            this._list.option(name, value);
                        break;
                    case"itemClickAction":
                        this._initItemClickAction();
                        break;
                    case"usePopover":
                        this._invalidate();
                        break;
                    default:
                        this.callBase.apply(this, arguments)
                }
            }
        }).include(ui.DataHelperMixin))
    })(jQuery, DevExpress);
    /*! Module widgets, file ui.selectBox.js */
    (function($, DX, undefined) {
        var ui = DX.ui,
            events = ui.events,
            WIDGET_CLASS = "dx-selectbox",
            POPUP_CLASS = "dx-selectbox-popup",
            SELECTBOX_ARROW_CONTAINER_CLASS = "dx-selectbox-arrow-container",
            SELECTBOX_ARROW_CLASS = "dx-selectbox-arrow";
        ui.registerComponent("dxSelectBox", ui.dxAutocomplete.inherit({
            _defaultOptions: function() {
                return $.extend(this.callBase(), {
                        items: [],
                        value: undefined,
                        valueChangeAction: null,
                        placeholder: Globalize.localize("Select"),
                        valueExpr: null,
                        tooltipEnabled: false
                    })
            },
            _init: function() {
                this.callBase();
                if (!this._dataSource)
                    this._itemsToDataSource()
            },
            _itemsToDataSource: function() {
                this._dataSource = new DevExpress.data.DataSource(this.option("items"))
            },
            _getValueWidth: function(value) {
                var $div = $("<div />").html(value).css({
                        width: "auto",
                        position: "fixed",
                        top: "-3000px",
                        left: "-3000px"
                    }).appendTo("body");
                return $div.width()
            },
            _setTooltip: function(value) {
                if (!this.option("tooltipEnabled"))
                    return;
                if (this._$element.context.scrollWidth <= this._getValueWidth(value))
                    this._$element.context.title = value;
                else
                    this._$element.context.title = ""
            },
            _render: function() {
                this._compileValueGetter();
                this.callBase();
                this._setTooltip(this.option("value"));
                this._setWidgetClasses();
                this._renderArrowDown()
            },
            _renderPopup: function() {
                this.callBase();
                this._popup.beginUpdate();
                if (DX.devices.current().win8) {
                    var popupPosition = this._popup.option("position");
                    $.extend(popupPosition, {
                        at: "left top",
                        offset: {
                            h: 0,
                            v: 2
                        }
                    });
                    this._popup.option("position", popupPosition)
                }
                this._popup.option("closeOnOutsideClick", true);
                this._popup.endUpdate()
            },
            _renderValueUpdateEvent: function() {
                this._changeAction = this._createActionByOption("valueChangeAction")
            },
            _setWidgetClasses: function() {
                var $selectbox = this._element(),
                    $popup = this._popup._element();
                $selectbox.addClass(WIDGET_CLASS);
                $popup.addClass(POPUP_CLASS)
            },
            _renderArrowDown: function() {
                var clickActionHandler = this._createAction(function(e) {
                        e.component._popup.toggle()
                    });
                $("<div />").addClass(SELECTBOX_ARROW_CONTAINER_CLASS).appendTo(this._element()).on(events.addNamespace("dxclick", this.NAME), function(e) {
                    clickActionHandler({jQueryEvent: e})
                });
                $("<div />").addClass(SELECTBOX_ARROW_CLASS).appendTo(this._element().find("." + SELECTBOX_ARROW_CONTAINER_CLASS))
            },
            _applyFilter: $.noop,
            _updateValue: $.noop,
            _renderTextbox: function() {
                this.callBase();
                this._searchValue(this.option("value")).done($.proxy(this._updateTextBox, this))
            },
            _updateTextBox: function(result) {
                this._selectedItem = result;
                this._textbox.option({
                    readOnly: true,
                    value: this._displayGetter(this._selectedItem),
                    clickAction: $.proxy(function() {
                        this._popup.toggle()
                    }, this)
                })
            },
            _compileValueGetter: function() {
                this._valueGetter = DX.data.utils.compileGetter(this._valueGetterExpr())
            },
            _valueGetterExpr: function() {
                return this.option("valueExpr") || this._dataSource && this._dataSource._store._key || "this"
            },
            _handleListItemClick: function(e) {
                this.option("value", this._valueGetter(e.itemData));
                this._popup.hide()
            },
            _searchValue: function(value) {
                var self = this,
                    store = this._dataSource.store(),
                    valueExpr = this._valueGetterExpr();
                var deffered = $.Deferred();
                if (valueExpr === store.key() || store instanceof DX.data.CustomStore)
                    store.byKey(value).done(function(result) {
                        deffered.resolveWith(self, [result])
                    });
                else
                    store.load({filter: [valueExpr, value]}).done(function(result) {
                        deffered.resolveWith(self, result)
                    });
                return deffered.promise()
            },
            _changeValueExpr: function() {
                this._compileValueGetter();
                this.option("value", this._valueGetter(this._selectedItem))
            },
            _changeValue: function(value) {
                this._searchValue(value).done($.proxy(this._handleSearchComplete, this));
                this._setTooltip(value)
            },
            _handleSearchComplete: function(result) {
                this._selectedItem = result;
                this._textboxOptionChange("value", this._displayGetter(result));
                this._changeAction(this.option("value"))
            },
            _renderList: function() {
                this.callBase();
                this._list.option("autoPagingEnabled", true)
            },
            _optionChanged: function(name, value) {
                switch (name) {
                    case"tooltipEnabled":
                        this._setTooltip(this.option("value"));
                        break;
                    case"valueExpr":
                        this._changeValueExpr();
                        break;
                    case"displayExpr":
                        this._compileDisplayGetter();
                        this._refresh();
                        break;
                    case"value":
                        this._changeValue(value);
                        break;
                    case"valueChangeAction":
                        this._renderValueUpdateEvent();
                        break;
                    default:
                        this.callBase.apply(this, arguments)
                }
            }
        }))
    })(jQuery, DevExpress);
    /*! Module widgets, file ui.panorama.js */
    (function($, DX, undefined) {
        var ui = DX.ui,
            events = ui.events,
            fx = DX.fx,
            translator = DX.translator,
            utils = DX.utils;
        var PANORAMA_CLASS = "dx-panorama",
            PANORAMA_TITLE_CLASS = "dx-panorama-title",
            PANORAMA_GHOST_TITLE_CLASS = "dx-panorama-ghosttitle",
            PANORAMA_ITEMS_CONTAINER_CLASS = "dx-panorama-itemscontainer",
            PANORAMA_ITEM_CLASS = "dx-panorama-item",
            PANORAMA_GHOST_ITEM_CLASS = "dx-panorama-ghostitem",
            PANORAMA_ITEM_HEADER_CLASS = "dx-panorama-item-header",
            PANORAMA_ITEM_DATA_KEY = "dxPanoramaItemData",
            PANORAMA_ITEM_MARGIN_SCALE = .02,
            PANORAMA_TITLE_MARGIN_SCALE = .02,
            PANORAMA_BACKGROUND_MOVE_DURATION = 300,
            PANORAMA_BACKGROUND_MOVE_EASING = "cubic-bezier(.40, .80, .60, 1)",
            PANORAMA_TITLE_MOVE_DURATION = 300,
            PANORAMA_TITLE_MOVE_EASING = "cubic-bezier(.40, .80, .60, 1)",
            PANORAMA_ITEM_MOVE_DURATION = 300,
            PANORAMA_ITEM_MOVE_EASING = "cubic-bezier(.40, .80, .60, 1)";
        var moveBackground = function($element, position) {
                $element.css("background-position", position + "px 0%")
            };
        var position = function($element) {
                return translator.locate($element).left
            };
        var move = function($element, position) {
                translator.move($element, {left: position})
            };
        var animation = {
                backgroundMove: function($element, position, completeAction) {
                    return fx.animate($element, {
                            to: {"background-position": position + "px 0%"},
                            duration: PANORAMA_BACKGROUND_MOVE_DURATION,
                            easing: PANORAMA_BACKGROUND_MOVE_EASING,
                            complete: completeAction
                        })
                },
                titleMove: function($title, position, completeAction) {
                    return fx.animate($title, {
                            type: "slide",
                            to: {left: position},
                            duration: PANORAMA_TITLE_MOVE_DURATION,
                            easing: PANORAMA_TITLE_MOVE_EASING,
                            complete: completeAction
                        })
                },
                itemMove: function($item, position, completeAction) {
                    return fx.animate($item, {
                            type: "slide",
                            to: {left: position},
                            duration: PANORAMA_ITEM_MOVE_DURATION,
                            easing: PANORAMA_ITEM_MOVE_EASING,
                            complete: completeAction
                        })
                }
            };
        var endAnimation = function(elements) {
                if (!elements)
                    return;
                $.each(elements, function(_, element) {
                    fx.stop(element, true)
                })
            };
        var PanoramaItemsRenderStrategy = DX.Class.inherit({
                ctor: function(panorama) {
                    this._panorama = panorama
                },
                init: $.noop,
                render: $.noop,
                allItemElements: function() {
                    return this._panorama._itemElements()
                },
                updatePositions: DX.abstract,
                animateRollback: DX.abstract,
                detectBoundsTransition: DX.abstract,
                animateComplete: DX.abstract,
                _itemMargin: function() {
                    return this._panorama._$itemsContainer.width() * PANORAMA_ITEM_MARGIN_SCALE
                },
                _indexBoundary: function() {
                    return this._panorama._indexBoundary()
                },
                _normalizeIndex: function(index) {
                    return this._panorama._normalizeIndex(index)
                }
            });
        var PanoramaOneAndLessItemsRenderStrategy = PanoramaItemsRenderStrategy.inherit({
                updatePositions: function() {
                    var $items = this._panorama._itemElements(),
                        itemMargin = this._itemMargin();
                    $items.each(function() {
                        move($(this), itemMargin)
                    })
                },
                animateRollback: $.noop,
                detectBoundsTransition: $.noop,
                animateComplete: $.noop
            });
        var PanoramaTwoItemsRenderStrategy = PanoramaItemsRenderStrategy.inherit({
                init: function() {
                    this._initGhostItem()
                },
                render: function() {
                    this._renderGhostItem()
                },
                _initGhostItem: function() {
                    this._$ghostItem = $("<div>").addClass(PANORAMA_GHOST_ITEM_CLASS)
                },
                _renderGhostItem: function() {
                    this._panorama._itemContainer().append(this._$ghostItem);
                    this._toggleGhostItem(false)
                },
                _toggleGhostItem: function(visible) {
                    var $ghostItem = this._$ghostItem;
                    if (visible)
                        $ghostItem.css("opacity", 1);
                    else
                        $ghostItem.css("opacity", 0)
                },
                _updateGhostItemContent: function(index) {
                    if (index !== false && index !== this._prevGhostIndex) {
                        this._$ghostItem.html(this._panorama._itemElements().eq(index).html());
                        this._prevGhostIndex = index
                    }
                },
                _isGhostItemVisible: function() {
                    return this._$ghostItem.css("opacity") == 1
                },
                _swapGhostWithItem: function($item) {
                    var $ghostItem = this._$ghostItem,
                        lastItemPosition = position($item);
                    move($item, position($ghostItem));
                    move($ghostItem, lastItemPosition)
                },
                allItemElements: function() {
                    return this._panorama._itemContainer().find("." + PANORAMA_ITEM_CLASS + ", ." + PANORAMA_GHOST_ITEM_CLASS)
                },
                updatePositions: function(offset) {
                    var $items = this.allItemElements(),
                        selectedIndex = this._panorama.option("selectedIndex"),
                        isGhostReplaceLast = offset > 0 && selectedIndex === 0 || offset < 0 && selectedIndex === 1,
                        isGhostReplaceFirst = offset < 0 && selectedIndex === 0 || offset > 0 && selectedIndex === 1,
                        ghostPosition = isGhostReplaceLast && "replaceLast" || isGhostReplaceFirst && "replaceFirst",
                        ghostContentIndex = isGhostReplaceLast && 1 || isGhostReplaceFirst && 0,
                        positions = this._calculateItemPositions(selectedIndex, ghostPosition);
                    this._updateGhostItemContent(ghostContentIndex);
                    this._toggleGhostItem(isGhostReplaceLast || isGhostReplaceFirst);
                    $items.each(function(index) {
                        move($(this), positions[index] + offset)
                    })
                },
                animateRollback: function(currentIndex) {
                    var self = this,
                        $items = this._panorama._itemElements(),
                        itemMargin = this._itemMargin(),
                        offset = position($items.eq(currentIndex)) - itemMargin,
                        ghostOffset = position(this._$ghostItem) - itemMargin,
                        positions = this._calculateItemPositions(currentIndex, ghostOffset > 0 ? "prepend" : "append"),
                        isLastReplasedByGhost = currentIndex === 0 && offset > 0 && ghostOffset > 0 || currentIndex === 1 && ghostOffset < 0;
                    if (isLastReplasedByGhost)
                        this._swapGhostWithItem($items.eq(1));
                    else
                        this._swapGhostWithItem($items.eq(0));
                    $items.each(function(index) {
                        animation.itemMove($(this), positions[index])
                    });
                    animation.itemMove(this._$ghostItem, positions[2], function() {
                        self._toggleGhostItem(false)
                    })
                },
                detectBoundsTransition: function(newIndex, currentIndex) {
                    var ghostLocation = position(this._$ghostItem),
                        itemMargin = this._itemMargin();
                    if (newIndex === 0 && ghostLocation < itemMargin)
                        return "left";
                    if (currentIndex === 0 && ghostLocation > itemMargin)
                        return "right"
                },
                animateComplete: function(boundCross, newIndex, currentIndex) {
                    var self = this,
                        ghostPosition = !boundCross ^ !(currentIndex === 0) ? "prepend" : "append",
                        $items = this._panorama._itemElements(),
                        positions = this._calculateItemPositions(newIndex, ghostPosition),
                        animations = [];
                    $items.each(function(index) {
                        animations.push(animation.itemMove($(this), positions[index]))
                    });
                    animations.push(animation.itemMove(this._$ghostItem, positions[2], function() {
                        self._toggleGhostItem(false)
                    }));
                    return $.when.apply($, animations)
                },
                _calculateItemPositions: function(atIndex, ghostPosition) {
                    var positions = [],
                        $items = this._panorama._itemElements(),
                        itemMargin = this._itemMargin(),
                        itemWidth = $items.eq(0).outerWidth(),
                        itemPositionOffset = itemWidth + itemMargin,
                        normalFlow = atIndex === 0,
                        nextNegativePosition = -itemWidth,
                        nextPositivePosition = itemMargin;
                    positions.push(nextPositivePosition);
                    nextPositivePosition += itemPositionOffset;
                    if (normalFlow)
                        positions.push(nextPositivePosition);
                    else
                        positions.splice(0, 0, nextPositivePosition);
                    nextPositivePosition += itemPositionOffset;
                    switch (ghostPosition) {
                        case"replaceFirst":
                            positions.push(positions[0]);
                            if (normalFlow)
                                positions[0] = nextPositivePosition;
                            else
                                positions[0] = nextNegativePosition;
                            break;
                        case"replaceLast":
                            if (normalFlow)
                                positions.splice(1, 0, nextNegativePosition);
                            else
                                positions.splice(1, 0, nextPositivePosition);
                            break;
                        case"prepend":
                            positions.push(nextNegativePosition);
                            break;
                        case"append":
                            positions.push(nextPositivePosition);
                            break
                    }
                    return positions
                }
            });
        var PanoramaThreeAndMoreItemsRenderStrategy = PanoramaItemsRenderStrategy.inherit({
                updatePositions: function(offset) {
                    var $items = this._panorama._itemElements(),
                        positions = this._calculateItemPositions(this._panorama.option("selectedIndex"), offset < 0);
                    $items.each(function(index) {
                        move($(this), positions[index] + offset)
                    })
                },
                animateRollback: function() {
                    var $items = this._panorama._itemElements(),
                        selectedIndex = this._panorama.option("selectedIndex"),
                        positions = this._calculateItemPositions(selectedIndex),
                        animatingItems = [selectedIndex, this._normalizeIndex(selectedIndex + 1)];
                    if (position($items.eq(selectedIndex)) > this._itemMargin())
                        animatingItems.push(this._normalizeIndex(selectedIndex - 1));
                    $items.each(function(index) {
                        var $item = $(this);
                        if ($.inArray(index, animatingItems) !== -1)
                            animation.itemMove($item, positions[index]);
                        else
                            move($item, positions[index])
                    })
                },
                detectBoundsTransition: function(newIndex, currentIndex) {
                    var lastIndex = this._indexBoundary() - 1;
                    if (currentIndex === lastIndex && newIndex === 0)
                        return "left";
                    if (currentIndex === 0 && newIndex === lastIndex)
                        return "right"
                },
                animateComplete: function(boundCross, newIndex, currentIndex) {
                    var animations = [],
                        $items = this._panorama._itemElements(),
                        positions = this._calculateItemPositions(newIndex);
                    var transitionToRight = this._normalizeIndex(currentIndex - 1) === newIndex,
                        cyclingItemIndex = $items.length === 3 && transitionToRight ? this._normalizeIndex(currentIndex + 1) : null,
                        cyclingItemPosition = positions[this._indexBoundary()];
                    var animatingItems = [newIndex, currentIndex],
                        rightAnimatedItemIndex = transitionToRight ? currentIndex : newIndex;
                    if (!transitionToRight)
                        animatingItems.push(this._normalizeIndex(rightAnimatedItemIndex + 1));
                    $items.each(function(index) {
                        var $item = $(this);
                        if ($.inArray(index, animatingItems) === -1) {
                            move($item, positions[index]);
                            return
                        }
                        animations.push(index !== cyclingItemIndex ? animation.itemMove($item, positions[index]) : animation.itemMove($item, cyclingItemPosition, function() {
                            move($item, positions[index])
                        }))
                    });
                    return $.when.apply($, animations)
                },
                _calculateItemPositions: function(atIndex, preferRight) {
                    var previousIndex = this._normalizeIndex(atIndex - 1),
                        $items = this._panorama._itemElements(),
                        itemMargin = this._itemMargin(),
                        itemWidth = $items.eq(0).outerWidth(),
                        itemPositionOffset = itemWidth + itemMargin,
                        positions = [],
                        nextNegativePosition = -itemWidth,
                        nextPositivePosition = itemMargin;
                    for (var i = atIndex; i !== previousIndex; i = this._normalizeIndex(i + 1)) {
                        positions[i] = nextPositivePosition;
                        nextPositivePosition += itemPositionOffset
                    }
                    if (preferRight) {
                        positions[previousIndex] = nextPositivePosition;
                        nextPositivePosition += itemPositionOffset
                    }
                    else
                        positions[previousIndex] = nextNegativePosition;
                    positions.push(nextPositivePosition);
                    return positions
                }
            });
        ui.registerComponent("dxPanorama", ui.SelectableCollectionWidget.inherit({
            _defaultOptions: function() {
                return $.extend(this.callBase(), {
                        selectedIndex: 0,
                        title: "panorama",
                        backgroundImage: {
                            url: null,
                            width: 0,
                            height: 0
                        }
                    })
            },
            _itemClass: function() {
                return PANORAMA_ITEM_CLASS
            },
            _itemDataKey: function() {
                return PANORAMA_ITEM_DATA_KEY
            },
            _itemContainer: function() {
                return this._$itemsContainer
            },
            _init: function() {
                this.callBase();
                this._initItemsRenderStrategy();
                this._initTitle();
                this._initItemsContainer();
                utils.windowResizeCallbacks.add(this._windowResizeCallBack = $.proxy(this._handleWindowResize, this));
                this._initSwipeHandlers()
            },
            _dispose: function() {
                this.callBase.apply(this, arguments);
                utils.windowResizeCallbacks.remove(this._windowResizeCallBack)
            },
            _initItemsRenderStrategy: function() {
                var itemsRenderStrategy;
                switch (this.option("items").length) {
                    case 0:
                    case 1:
                        itemsRenderStrategy = PanoramaOneAndLessItemsRenderStrategy;
                        break;
                    case 2:
                        itemsRenderStrategy = PanoramaTwoItemsRenderStrategy;
                        break;
                    default:
                        itemsRenderStrategy = PanoramaThreeAndMoreItemsRenderStrategy
                }
                this._itemsRenderStrategy = new itemsRenderStrategy(this);
                this._itemsRenderStrategy.init()
            },
            _initBackgroundImage: function() {
                var bgUrl = this.option("backgroundImage.url");
                if (bgUrl)
                    this._element().css("background-image", "url(" + bgUrl + ")")
            },
            _initTitle: function() {
                this._$title = $("<div>").addClass(PANORAMA_TITLE_CLASS);
                this._$ghostTitle = $("<div>").addClass(PANORAMA_GHOST_TITLE_CLASS);
                this._element().append(this._$title);
                this._element().append(this._$ghostTitle);
                this._updateTitle()
            },
            _updateTitle: function() {
                var title = this.option("title");
                this._$title.text(title);
                this._$ghostTitle.text(title);
                this._toggleGhostTitle(false)
            },
            _toggleGhostTitle: function(visible) {
                var $ghostTitle = this._$ghostTitle;
                if (visible)
                    $ghostTitle.css("opacity", 1);
                else
                    $ghostTitle.css("opacity", 0)
            },
            _initItemsContainer: function() {
                this._$itemsContainer = $("<div>").addClass(PANORAMA_ITEMS_CONTAINER_CLASS);
                this._element().append(this._$itemsContainer)
            },
            _handleWindowResize: function() {
                this._updatePositions()
            },
            _render: function() {
                this._element().addClass(PANORAMA_CLASS);
                this.callBase();
                this._initBackgroundImage();
                this._itemsRenderStrategy.render()
            },
            _updatePositions: function(offset) {
                offset = offset || 0;
                this._updateBackgroundPosition(offset * this._calculateBackgroundStep());
                this._updateTitlePosition(offset * this._calculateTitleStep());
                this._itemsRenderStrategy.updatePositions(offset * this._$itemsContainer.width())
            },
            _updateBackgroundPosition: function(offset) {
                moveBackground(this._element(), this._calculateBackgroundPosition(this.option("selectedIndex")) + offset)
            },
            _updateTitlePosition: function(offset) {
                move(this._$title, this._calculateTitlePosition(this.option("selectedIndex")) + offset)
            },
            _animateRollback: function(currentIndex) {
                this._animateBackgroundMove(currentIndex);
                this._animateTitleMove(currentIndex);
                this._itemsRenderStrategy.animateRollback(currentIndex)
            },
            _animateBackgroundMove: function(toIndex) {
                return animation.backgroundMove(this._element(), this._calculateBackgroundPosition(toIndex))
            },
            _animateTitleMove: function(toIndex) {
                return animation.titleMove(this._$title, this._calculateTitlePosition(toIndex))
            },
            _animateComplete: function(newIndex, currentIndex) {
                var self = this,
                    boundCross = this._itemsRenderStrategy.detectBoundsTransition(newIndex, currentIndex);
                var backgroundAnimation = this._performBackgroundAnimation(boundCross, newIndex);
                var titleAnimation = this._performTitleAnimation(boundCross, newIndex);
                var itemsAnimation = this._itemsRenderStrategy.animateComplete(boundCross, newIndex, currentIndex);
                $.when(backgroundAnimation, titleAnimation, itemsAnimation).done(function() {
                    self._indexChangeOnAnimation = true;
                    self.option("selectedIndex", newIndex);
                    self._indexChangeOnAnimation = false
                })
            },
            _performBackgroundAnimation: function(boundCross, newIndex) {
                if (boundCross)
                    return this._animateBackgroundBoundsTransition(boundCross, newIndex);
                return this._animateBackgroundMove(newIndex)
            },
            _animateBackgroundBoundsTransition: function(bound, newIndex) {
                var self = this,
                    isLeft = bound === "left",
                    afterAnimationPosition = this._calculateBackgroundPosition(newIndex),
                    animationEndPositionShift = isLeft ? -this._calculateBackgroundScaledWidth() : this._calculateBackgroundScaledWidth(),
                    animationEndPosition = afterAnimationPosition + animationEndPositionShift;
                return animation.backgroundMove(this._element(), animationEndPosition, function() {
                        moveBackground(self._element(), afterAnimationPosition)
                    })
            },
            _performTitleAnimation: function(boundCross, newIndex) {
                if (boundCross)
                    return this._animateTitleBoundsTransition(boundCross, newIndex);
                return this._animateTitleMove(newIndex)
            },
            _animateTitleBoundsTransition: function(bound, newIndex) {
                var self = this,
                    $ghostTitle = this._$ghostTitle,
                    ghostWidth = $ghostTitle.outerWidth(),
                    panoramaWidth = this._element().width(),
                    isLeft = bound === "left",
                    ghostTitleStartPosition = isLeft ? panoramaWidth : -ghostWidth,
                    ghostTitleEndPosition = isLeft ? -(panoramaWidth + ghostWidth) : panoramaWidth;
                move($ghostTitle, ghostTitleStartPosition);
                this._toggleGhostTitle(true);
                this._swapGhostWithTitle();
                var ghostAnimation = animation.titleMove($ghostTitle, ghostTitleEndPosition, function() {
                        self._toggleGhostTitle(false)
                    });
                var titleAnimation = animation.titleMove(this._$title, this._calculateTitlePosition(newIndex));
                return $.when(ghostAnimation, titleAnimation)
            },
            _swapGhostWithTitle: function() {
                var $ghostTitle = this._$ghostTitle,
                    $title = this._$title,
                    lastTitlePosition = position($title);
                move($title, position($ghostTitle));
                move($ghostTitle, lastTitlePosition)
            },
            _calculateTitlePosition: function(atIndex) {
                var panoramaWidth = this._element().width(),
                    titleMargin = panoramaWidth * PANORAMA_TITLE_MARGIN_SCALE;
                return titleMargin - atIndex * this._calculateTitleStep()
            },
            _calculateTitleStep: function() {
                var panoramaWidth = this._element().width(),
                    titleWidth = this._$title.outerWidth(),
                    indexBoundary = this._indexBoundary() || 1;
                return Math.max((titleWidth - panoramaWidth) / indexBoundary, titleWidth / indexBoundary)
            },
            _calculateBackgroundPosition: function(atIndex) {
                return -(atIndex * this._calculateBackgroundStep())
            },
            _calculateBackgroundStep: function() {
                var itemWidth = this._itemElements().eq(0).outerWidth(),
                    backgroundScaledWidth = this._calculateBackgroundScaledWidth();
                return Math.max((backgroundScaledWidth - itemWidth) / (this._indexBoundary() || 1), 0)
            },
            _calculateBackgroundScaledWidth: function() {
                return this._element().height() * this.option("backgroundImage.width") / (this.option("backgroundImage.height") || 1)
            },
            _initSwipeHandlers: function() {
                this._element().on(events.addNamespace("dxswipestart", this.NAME), $.proxy(this._swipeStartHandler, this)).on(events.addNamespace("dxswipe", this.NAME), $.proxy(this._swipeUpdateHandler, this)).on(events.addNamespace("dxswipeend", this.NAME), $.proxy(this._swipeEndHandler, this))
            },
            _swipeStartHandler: function(e) {
                this._stopAnimations();
                if (this.option("disabled") || this._indexBoundary() <= 1)
                    e.cancel = true
            },
            _stopAnimations: function() {
                endAnimation([this._element(), this._$ghostTitle, this._$title]);
                endAnimation(this._itemsRenderStrategy.allItemElements())
            },
            _swipeUpdateHandler: function(e) {
                this._updatePositions(e.offset)
            },
            _swipeEndHandler: function(e) {
                var currentIndex = this.option("selectedIndex"),
                    targetOffset = e.targetOffset;
                if (targetOffset === 0)
                    this._animateRollback(currentIndex);
                else
                    this._animateComplete(this._normalizeIndex(currentIndex - targetOffset), currentIndex)
            },
            _renderSelectedIndex: function(current, previous) {
                if (!this._indexChangeOnAnimation)
                    this._updatePositions()
            },
            _normalizeIndex: function(index) {
                var boundary = this._indexBoundary();
                if (index < 0)
                    index = boundary + index;
                if (index >= boundary)
                    index = index - boundary;
                return index
            },
            _indexBoundary: function() {
                return this.option("items").length
            },
            _optionChanged: function(name, value, prevValue) {
                switch (name) {
                    case"backgroundImage":
                        this._invalidate();
                        break;
                    case"title":
                        this._updateTitle();
                        break;
                    case"items":
                        this._initItemsRenderStrategy();
                        this.callBase.apply(this, arguments);
                        break;
                    default:
                        this.callBase.apply(this, arguments)
                }
            },
            _itemRenderDefault: function(item, index, $itemElement) {
                this.callBase(item, index, $itemElement);
                if (!item.header)
                    return;
                var $itemHeader = $("<div>").addClass(PANORAMA_ITEM_HEADER_CLASS).text(item.header);
                $itemElement.prepend($itemHeader)
            }
        }));
        ui.dxPanorama.__internals = {animation: animation}
    })(jQuery, DevExpress);
    /*! Module widgets, file ui.slideout.js */
    (function($, DX, undefined) {
        var ui = DX.ui,
            events = ui.events,
            fx = DX.fx,
            utils = DX.utils,
            translator = DX.translator;
        var SLIDEOUT_CLASS = "dx-slideout",
            SLIDEOUT_ITEM_CONTAINER_CLASS = "dx-slideout-item-container",
            SLIDEOUT_MENU = "dx-slideout-menu",
            SLIDEOUT_SHIELD = "dx-slideout-shield",
            SLIDEOUT_ITEM_CLASS = "dx-slideout-item",
            SLIDEOUT_ITEM_DATA_KEY = "dxSlideoutItemData",
            INVISIBLE_STATE_CLASS = "dx-state-invisible",
            CONTENT_OFFSET = 45,
            ANIMATION_DURATION = 400;
        ui.registerComponent("dxSlideOut", ui.SelectableCollectionWidget.inherit({
            _defaultOptions: function() {
                return $.extend(this.callBase(), {
                        activeStateEnabled: false,
                        menuItemRender: null,
                        menuItemTemplate: "menuItem",
                        swipeEnabled: true,
                        menuVisible: false
                    })
            },
            _itemClass: function() {
                return SLIDEOUT_ITEM_CLASS
            },
            _itemDataKey: function() {
                return SLIDEOUT_ITEM_DATA_KEY
            },
            _init: function() {
                this.callBase();
                this._deferredAnimate = undefined
            },
            _render: function() {
                this._renderItemsContainer();
                this._renderShield();
                this._renderList();
                this._initSwipeHandlers();
                this._element().addClass(SLIDEOUT_CLASS);
                this.callBase();
                this._initWindowResizeCallback();
                this._renderPosition(this.option("menuVisible") ? 1 : 0, false)
            },
            _renderShield: function() {
                this._$shield = $("<div />").addClass(SLIDEOUT_SHIELD);
                this._$shield.appendTo(this._$container);
                this._$shield.on("dxclick", $.proxy(this.hideMenu, this));
                this._toggleShieldVisibility()
            },
            _initWindowResizeCallback: function() {
                var self = this;
                this._windowResizeCallback = function() {
                    self._renderPosition(self.option("menuVisible") ? 1 : 0, false)
                };
                utils.windowResizeCallbacks.add(this._windowResizeCallback)
            },
            _renderItemsContainer: function() {
                this._$container = $("<div />").addClass(SLIDEOUT_ITEM_CONTAINER_CLASS).appendTo(this._element());
                this._$container.on("MSPointerDown", function(e){})
            },
            _renderContentImpl: function(template) {
                var items = this.option("items"),
                    selectedIndex = this.option("selectedIndex");
                if (items.length && selectedIndex > -1)
                    this._renderItems([items[selectedIndex]])
            },
            _renderList: function() {
                this._$list = $("<div />").addClass(SLIDEOUT_MENU).prependTo(this._element());
                this._renderItemClickAction();
                var list = this._$list.dxList().dxList("instance");
                list.addExternalTemplate(this._templates);
                this._$list.dxList({
                    height: "100%",
                    itemClickAction: $.proxy(this._handleListItemClick, this),
                    items: this.option("items"),
                    dataSource: this.option("dataSource"),
                    itemRender: this.option("menuItemRender"),
                    itemTemplate: this.option("menuItemTemplate")
                })
            },
            _handleListItemClick: function(e) {
                var selectedIndex = this._$list.find(".dx-list-item").index(e.itemElement);
                this.option("selectedIndex", selectedIndex);
                this._itemClickAction(e)
            },
            _renderItemClickAction: function() {
                this._itemClickAction = this._createActionByOption("itemClickAction")
            },
            _renderItem: function(index, item, container) {
                this._$container.find("." + SLIDEOUT_ITEM_CLASS).remove();
                this.callBase(index, item, this._$container)
            },
            _renderSelectedIndex: function() {
                this._renderContent()
            },
            _initSwipeHandlers: function() {
                this._$container.dxSwipeable({
                    elastic: false,
                    itemSizeFunc: $.proxy(this._getListWidth, this),
                    startAction: $.proxy(this.option("swipeEnabled") ? this._handleSwipeStart : function(e) {
                        e.jQueryEvent.cancel = true
                    }, this),
                    updateAction: $.proxy(this._handleSwipeUpdate, this),
                    endAction: $.proxy(this._handleSwipeEnd, this)
                })
            },
            _handleSwipeStart: function(e) {
                this._$shield.addClass(INVISIBLE_STATE_CLASS);
                fx.stop(this._$container);
                e.jQueryEvent.maxLeftOffset = this.option("menuVisible") ? 1 : 0;
                e.jQueryEvent.maxRightOffset = this.option("menuVisible") ? 0 : 1
            },
            _handleSwipeUpdate: function(e) {
                var offset = this.option("menuVisible") ? e.jQueryEvent.offset + 1 : e.jQueryEvent.offset;
                this._renderPosition(offset, false)
            },
            _handleSwipeEnd: function(e) {
                var targetOffset = e.jQueryEvent.targetOffset + this.option("menuVisible"),
                    menuVisible = targetOffset !== 0;
                if (this.option("menuVisible") === menuVisible)
                    this._renderPosition(this.option("menuVisible") ? 1 : 0, true);
                else
                    this.option("menuVisible", targetOffset !== 0)
            },
            _handleMenuButtonClick: function() {
                this.option("menuVisible", !this.option("menuVisible"))
            },
            _toggleMenuVisibility: function(visible, animate) {
                this.option("menuVisible", visible)
            },
            _renderPosition: function(offset, animate) {
                var pos = this._calculatePixelOffset(offset);
                if (animate) {
                    this._$shield.addClass(INVISIBLE_STATE_CLASS);
                    fx.animate(this._$container, {
                        type: "slide",
                        to: {left: pos},
                        duration: ANIMATION_DURATION,
                        complete: $.proxy(this._handleAnimationComplete, this)
                    })
                }
                else
                    translator.move(this._$container, {left: pos})
            },
            _calculatePixelOffset: function(offset) {
                var offset = offset || 0,
                    maxOffset = this._getListWidth();
                return offset * maxOffset
            },
            _getListWidth: function() {
                var listWidth = this._$list.width(),
                    elementWidth = this._element().width() - CONTENT_OFFSET;
                return Math.min(elementWidth, listWidth)
            },
            _changeMenuOption: function(name, value) {
                this._$list.dxList("instance").option(name, value)
            },
            _optionChanged: function(name, value, prevValue) {
                switch (name) {
                    case"menuVisible":
                        this._renderPosition(value ? 1 : 0, true);
                        break;
                    case"swipeEnabled":
                        this._initSwipeHandlers();
                        break;
                    case"menuItemRender":
                        this._changeMenuOption("itemRender", value);
                        break;
                    case"menuItemTemplate":
                        this._changeMenuOption("itemTemplate", value);
                        break;
                    case"items":
                    case"dataSource":
                        this._changeMenuOption(name, value);
                        break;
                    case"itemClickAction":
                        this._renderItemClickAction();
                        break;
                    default:
                        this.callBase(name, value, prevValue)
                }
            },
            _toggleShieldVisibility: function() {
                this._$shield.toggleClass(INVISIBLE_STATE_CLASS, !this.option("menuVisible"))
            },
            _handleAnimationComplete: function() {
                this._toggleShieldVisibility();
                if (this._deferredAnimate)
                    this._deferredAnimate.resolveWith(this)
            },
            _dispose: function() {
                utils.windowResizeCallbacks.remove(this._windowResizeCallback);
                this.callBase()
            },
            showMenu: function() {
                return this.toggleMenuVisibility(true)
            },
            hideMenu: function() {
                return this.toggleMenuVisibility(false)
            },
            toggleMenuVisibility: function(showing) {
                showing = showing === undefined ? !this.option("menuVisible") : showing;
                this._deferredAnimate = $.Deferred();
                this.option("menuVisible", showing);
                return this._deferredAnimate.promise()
            }
        }))
    })(jQuery, DevExpress);
    DevExpress.MOD_WIDGETS = true
}