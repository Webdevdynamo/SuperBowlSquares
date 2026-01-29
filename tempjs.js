/* jscripts/jquery.scroll-follow.js */
(function($) {
    $.scrollFollow = function(box, options) {
        box = $(box);
        var position = box.css('position');

        function ani() {
            box.queue([]);
            var viewportHeight = parseInt($(window).height());
            var pageScroll = parseInt($(document).scrollTop());
            var parentTop = parseInt(box.cont.offset().top);
            var parentHeight = parseInt(box.cont.attr('offsetHeight'));
            var boxHeight = parseInt(box.attr('offsetHeight') + (parseInt(box.css('marginTop')) || 0) + (parseInt(box.css('marginBottom')) || 0));
            var aniTop;
            if (isActive) {
                if (options.relativeTo == 'top') {
                    if (box.initialOffsetTop >= (pageScroll + options.offset)) {
                        aniTop = box.initialTop;
                    } else {
                        aniTop = Math.min((Math.max((-parentTop), (pageScroll - box.initialOffsetTop + box.initialTop)) + options.offset), (parentHeight - boxHeight - box.paddingAdjustment));
                    }
                } else if (options.relativeTo == 'bottom') {
                    if ((box.initialOffsetTop + boxHeight) >= (pageScroll + options.offset + viewportHeight)) {
                        aniTop = box.initialTop;
                    } else {
                        aniTop = Math.min((pageScroll + viewportHeight - boxHeight - options.offset), (parentHeight - boxHeight));
                    }
                }
                if ((new Date().getTime() - box.lastScroll) >= (options.delay - 20)) {
                    box.animate({
                        top: aniTop
                    }, options.speed, options.easing);
                }
            }
        };
        var isActive = true;
        if ($.cookie != undefined) {
            if ($.cookie('scrollFollowSetting' + box.attr('id')) == 'false') {
                var isActive = false;
                $('#' + options.killSwitch).text(options.offText).toggle(function() {
                    isActive = true;
                    $(this).html(options.onText);
                    $.cookie('scrollFollowSetting' + box.attr('id'), true, {
                        expires: 365,
                        path: '/'
                    });
                    ani();
                }, function() {
                    isActive = false;
                    $(this).text(options.offText);
                    box.animate({
                        top: box.initialTop
                    }, options.speed, options.easing);
                    $.cookie('scrollFollowSetting' + box.attr('id'), false, {
                        expires: 365,
                        path: '/'
                    });
                });
            } else {
                $('#' + options.killSwitch).html(options.onText).toggle(function() {
                    isActive = false;
                    $(this).text(options.offText);
                    box.animate({
                        top: box.initialTop
                    }, 0);
                    $.cookie('scrollFollowSetting' + box.attr('id'), false, {
                        expires: 365,
                        path: '/'
                    });
                }, function() {
                    isActive = true;
                    $(this).html(options.onText);
                    $.cookie('scrollFollowSetting' + box.attr('id'), true, {
                        expires: 365,
                        path: '/'
                    });
                    ani();
                });
            }
        }
        if (options.containerElement) {
            box.cont = options.containerElement;
        } else {
            if (options.container == '') {
                box.cont = box.parent();
            } else {
                box.cont = $('#' + options.container);
            }
        }
        box.initialOffsetTop = parseInt(box.offset().top);
        box.initialTop = parseInt(box.css('top')) || 0;
        if (box.css('position') == 'relative') {
            box.paddingAdjustment = parseInt(box.cont.css('paddingTop')) + parseInt(box.cont.css('paddingBottom'));
        } else {
            box.paddingAdjustment = 0;
        }
        $(window).scroll(function() {
            $.fn.scrollFollow.interval = setTimeout(function() {
                ani();
            }, options.delay);
            box.lastScroll = new Date().getTime();
        });
        $(window).resize(function() {
            $.fn.scrollFollow.interval = setTimeout(function() {
                ani();
            }, options.delay);
            box.lastScroll = new Date().getTime();
        });
        box.lastScroll = 0;
        ani();
    };
    $.fn.scrollFollow = function(options) {
        options = options || {};
        options.relativeTo = options.relativeTo || 'top';
        options.speed = options.speed || 500;
        options.offset = options.offset || 0;
        options.easing = options.easing || 'swing';
        options.container = options.container || this.parent().attr('id');
        options.containerElement = options.containerElement || this.parent();
        options.killSwitch = options.killSwitch || 'killSwitch';
        options.onText = options.onText || 'Turn Slide Off';
        options.offText = options.offText || 'Turn Slide On';
        options.delay = options.delay || 0;
        this.each(function() {
            new $.scrollFollow(this, options);
        });
        return this;
    };
})(jQuery);

/* jscripts/jquery.cookie.js */

jQuery.cookie = function(name, value, options) {
    if (typeof value != 'undefined') {
        options = options || {};
        if (value === null) {
            value = '';
            options.expires = -1;
        }
        var expires = '';
        if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
            var date;
            if (typeof options.expires == 'number') {
                date = new Date();
                date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
            } else {
                date = options.expires;
            }
            expires = '; expires=' + date.toUTCString();
        }
        var path = options.path ? '; path=' + (options.path) : '';
        var domain = options.domain ? '; domain=' + (options.domain) : '';
        var secure = options.secure ? '; secure' : '';
        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
    } else {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
};

/* jscripts/jquery.scrollTo-min.js */
;
(function(d) {
    var k = d.scrollTo = function(a, i, e) {
        d(window).scrollTo(a, i, e)
    };
    k.defaults = {
        axis: 'xy',
        duration: parseFloat(d.fn.jquery) >= 1.3 ? 0 : 1
    };
    k.window = function(a) {
        return d(window)._scrollable()
    };
    d.fn._scrollable = function() {
        return this.map(function() {
            var a = this,
                i = !a.nodeName || d.inArray(a.nodeName.toLowerCase(), ['iframe', '#document', 'html', 'body']) != -1;
            if (!i) return a;
            var e = (a.contentWindow || a).document || a.ownerDocument || a;
            return d.browser.safari || e.compatMode == 'BackCompat' ? e.body : e.documentElement
        })
    };
    d.fn.scrollTo = function(n, j, b) {
        if (typeof j == 'object') {
            b = j;
            j = 0
        }
        if (typeof b == 'function') b = {
            onAfter: b
        };
        if (n == 'max') n = 9e9;
        b = d.extend({}, k.defaults, b);
        j = j || b.speed || b.duration;
        b.queue = b.queue && b.axis.length > 1;
        if (b.queue) j /= 2;
        b.offset = p(b.offset);
        b.over = p(b.over);
        return this._scrollable().each(function() {
            var q = this,
                r = d(q),
                f = n,
                s, g = {},
                u = r.is('html,body');
            switch (typeof f) {
                case 'number':
                case 'string':
                    if (/^([+-]=)?\d+(\.\d+)?(px|%)?$/.test(f)) {
                        f = p(f);
                        break
                    }
                    f = d(f, this);
                case 'object':
                    if (f.is || f.style) s = (f = d(f)).offset()
            }
            d.each(b.axis.split(''), function(a, i) {
                var e = i == 'x' ? 'Left' : 'Top',
                    h = e.toLowerCase(),
                    c = 'scroll' + e,
                    l = q[c],
                    m = k.max(q, i);
                if (s) {
                    g[c] = s[h] + (u ? 0 : l - r.offset()[h]);
                    if (b.margin) {
                        g[c] -= parseInt(f.css('margin' + e)) || 0;
                        g[c] -= parseInt(f.css('border' + e + 'Width')) || 0
                    }
                    g[c] += b.offset[h] || 0;
                    if (b.over[h]) g[c] += f[i == 'x' ? 'width' : 'height']() * b.over[h]
                } else {
                    var o = f[h];
                    g[c] = o.slice && o.slice(-1) == '%' ? parseFloat(o) / 100 * m : o
                }
                if (/^\d+$/.test(g[c])) g[c] = g[c] <= 0 ? 0 : Math.min(g[c], m);
                if (!a && b.queue) {
                    if (l != g[c]) t(b.onAfterFirst);
                    delete g[c]
                }
            });
            t(b.onAfter);

            function t(a) {
                r.animate(g, j, b.easing, a && function() {
                    a.call(this, n, b)
                })
            }
        }).end()
    };
    k.max = function(a, i) {
        var e = i == 'x' ? 'Width' : 'Height',
            h = 'scroll' + e;
        if (!d(a).is('html,body')) return a[h] - d(a)[e.toLowerCase()]();
        var c = 'client' + e,
            l = a.ownerDocument.documentElement,
            m = a.ownerDocument.body;
        return Math.max(l[h], m[h]) - Math.min(l[c], m[c])
    };

    function p(a) {
        return typeof a == 'object' ? a : {
            top: a,
            left: a
        }
    }
})(jQuery);

/* jscripts/jquery.validate.js */

(function($) {
    $.extend($.fn, {
        validate: function(options) {
            if (!this.length) {
                options && options.debug && window.console && console.warn("nothing selected, can't validate, returning nothing");
                return;
            }
            var validator = $.data(this[0], 'validator');
            if (validator) {
                return validator;
            }
            validator = new $.validator(options, this[0]);
            $.data(this[0], 'validator', validator);
            if (validator.settings.onsubmit) {
                this.find("input, button").filter(".cancel").click(function() {
                    validator.cancelSubmit = true;
                });
                if (validator.settings.submitHandler) {
                    this.find("input, button").filter(":submit").click(function() {
                        validator.submitButton = this;
                    });
                }
                this.submit(function(event) {
                    if (validator.settings.debug)
                        event.preventDefault();

                    function handle() {
                        if (validator.settings.submitHandler) {
                            if (validator.submitButton) {
                                var hidden = $("<input type='hidden'/>").attr("name", validator.submitButton.name).val(validator.submitButton.value).appendTo(validator.currentForm);
                            }
                            validator.settings.submitHandler.call(validator, validator.currentForm);
                            if (validator.submitButton) {
                                hidden.remove();
                            }
                            return false;
                        }
                        return true;
                    }
                    if (validator.cancelSubmit) {
                        validator.cancelSubmit = false;
                        return handle();
                    }
                    if (validator.form()) {
                        if (validator.pendingRequest) {
                            validator.formSubmitted = true;
                            return false;
                        }
                        return handle();
                    } else {
                        validator.focusInvalid();
                        return false;
                    }
                });
            }
            return validator;
        },
        valid: function() {
            if ($(this[0]).is('form')) {
                return this.validate().form();
            } else {
                var valid = true;
                var validator = $(this[0].form).validate();
                this.each(function() {
                    valid &= validator.element(this);
                });
                return valid;
            }
        },
        removeAttrs: function(attributes) {
            var result = {},
                $element = this;
            $.each(attributes.split(/\s/), function(index, value) {
                result[value] = $element.attr(value);
                $element.removeAttr(value);
            });
            return result;
        },
        rules: function(command, argument) {
            var element = this[0];
            if (command) {
                var settings = $.data(element.form, 'validator').settings;
                var staticRules = settings.rules;
                var existingRules = $.validator.staticRules(element);
                switch (command) {
                    case "add":
                        $.extend(existingRules, $.validator.normalizeRule(argument));
                        staticRules[element.name] = existingRules;
                        if (argument.messages)
                            settings.messages[element.name] = $.extend(settings.messages[element.name], argument.messages);
                        break;
                    case "remove":
                        if (!argument) {
                            delete staticRules[element.name];
                            return existingRules;
                        }
                        var filtered = {};
                        $.each(argument.split(/\s/), function(index, method) {
                            filtered[method] = existingRules[method];
                            delete existingRules[method];
                        });
                        return filtered;
                }
            }
            var data = $.validator.normalizeRules($.extend({}, $.validator.metadataRules(element), $.validator.classRules(element), $.validator.attributeRules(element), $.validator.staticRules(element)), element);
            if (data.required) {
                var param = data.required;
                delete data.required;
                data = $.extend({
                    required: param
                }, data);
            }
            return data;
        }
    });
    $.extend($.expr[":"], {
        blank: function(a) {
            return !$.trim("" + a.value);
        },
        filled: function(a) {
            return !!$.trim("" + a.value);
        },
        unchecked: function(a) {
            return !a.checked;
        }
    });
    $.validator = function(options, form) {
        this.settings = $.extend(true, {}, $.validator.defaults, options);
        this.currentForm = form;
        this.init();
    };
    $.validator.format = function(source, params) {
        if (arguments.length == 1)
            return function() {
                var args = $.makeArray(arguments);
                args.unshift(source);
                return $.validator.format.apply(this, args);
            };
        if (arguments.length > 2 && params.constructor != Array) {
            params = $.makeArray(arguments).slice(1);
        }
        if (params.constructor != Array) {
            params = [params];
        }
        $.each(params, function(i, n) {
            source = source.replace(new RegExp("\\{" + i + "\\}", "g"), n);
        });
        return source;
    };
    $.extend($.validator, {
        defaults: {
            messages: {},
            groups: {},
            rules: {},
            errorClass: "error",
            validClass: "valid",
            errorElement: "label",
            focusInvalid: true,
            errorContainer: $([]),
            errorLabelContainer: $([]),
            onsubmit: true,
            ignore: [],
            ignoreTitle: false,
            onfocusin: function(element) {
                this.lastActive = element;
                if (this.settings.focusCleanup && !this.blockFocusCleanup) {
                    this.settings.unhighlight && this.settings.unhighlight.call(this, element, this.settings.errorClass, this.settings.validClass);
                    this.errorsFor(element).hide();
                }
            },
            onfocusout: function(element) {
                if (!this.checkable(element) && (element.name in this.submitted || !this.optional(element))) {
                    this.element(element);
                }
            },
            onkeyup: function(element) {
                if (element.name in this.submitted || element == this.lastElement) {
                    this.element(element);
                }
            },
            onclick: function(element) {
                if (element.name in this.submitted)
                    this.element(element);
                else if (element.parentNode.name in this.submitted)
                    this.element(element.parentNode);
            },
            highlight: function(element, errorClass, validClass) {
                $(element).addClass(errorClass).removeClass(validClass);
                if (($(element).attr("type") == "radio" || $(element).attr("type") == "checkbox") && $("#" + $(element).attr("name")).length > 0)
                    $("#" + $(element).attr("name")).addClass(errorClass).removeClass(validClass);
            },
            unhighlight: function(element, errorClass, validClass) {
                $(element).removeClass(errorClass).addClass(validClass);
                if (($(element).attr("type") == "radio" || $(element).attr("type") == "checkbox") && $("#" + $(element).attr("name")).length > 0)
                    $("#" + $(element).attr("name")).removeClass(errorClass).addClass(validClass);
            }
        },
        setDefaults: function(settings) {
            $.extend($.validator.defaults, settings);
        },
        messages: {
            required: "This field is required.",
            remote: "Please fix this field.",
            email: "Please enter a valid email address.",
            url: "Please enter a valid URL.",
            date: "Please enter a valid date.",
            dateISO: "Please enter a valid date (ISO).",
            number: "Please enter a valid number.",
            digits: "Please enter only digits.",
            creditcard: "Please enter a valid credit card number.",
            equalTo: "Please enter the same value again.",
            accept: "Please enter a value with a valid extension.",
            maxlength: $.validator.format("Please enter no more than {0} characters."),
            minlength: $.validator.format("Please enter at least {0} characters."),
            rangelength: $.validator.format("Please enter a value between {0} and {1} characters long."),
            range: $.validator.format("Please enter a value between {0} and {1}."),
            max: $.validator.format("Please enter a value less than or equal to {0}."),
            min: $.validator.format("Please enter a value greater than or equal to {0}.")
        },
        autoCreateRanges: false,
        prototype: {
            init: function() {
                this.labelContainer = $(this.settings.errorLabelContainer);
                this.errorContext = this.labelContainer.length && this.labelContainer || $(this.currentForm);
                this.containers = $(this.settings.errorContainer).add(this.settings.errorLabelContainer);
                this.submitted = {};
                this.valueCache = {};
                this.pendingRequest = 0;
                this.pending = {};
                this.invalid = {};
                this.reset();
                var groups = (this.groups = {});
                $.each(this.settings.groups, function(key, value) {
                    $.each(value.split(/\s/), function(index, name) {
                        groups[name] = key;
                    });
                });
                var rules = this.settings.rules;
                $.each(rules, function(key, value) {
                    rules[key] = $.validator.normalizeRule(value);
                });

                function delegate(event) {
                    var validator = $.data(this[0].form, "validator"),
                        eventType = "on" + event.type.replace(/^validate/, "");
                    validator.settings[eventType] && validator.settings[eventType].call(validator, this[0]);
                }
                $(this.currentForm).validateDelegate(":text, :password, :file, select, textarea", "focusin focusout keyup", delegate).validateDelegate(":radio, :checkbox, select, option", "click", delegate);
                if (this.settings.invalidHandler)
                    $(this.currentForm).bind("invalid-form.validate", this.settings.invalidHandler);
            },
            form: function() {
                this.checkForm();
                $.extend(this.submitted, this.errorMap);
                this.invalid = $.extend({}, this.errorMap);
                if (!this.valid())
                    $(this.currentForm).triggerHandler("invalid-form", [this]);
                this.showErrors();
                return this.valid();
            },
            checkForm: function() {
                this.prepareForm();
                for (var i = 0, elements = (this.currentElements = this.elements()); elements[i]; i++) {
                    this.check(elements[i]);
                }
                return this.valid();
            },
            element: function(element) {
                element = this.clean(element);
                this.lastElement = element;
                this.prepareElement(element);
                this.currentElements = $(element);
                var result = this.check(element);
                if (result) {
                    delete this.invalid[element.name];
                } else {
                    this.invalid[element.name] = true;
                }
                if (!this.numberOfInvalids()) {
                    this.toHide = this.toHide.add(this.containers);
                }
                this.showErrors();
                return result;
            },
            showErrors: function(errors) {
                if (errors) {
                    $.extend(this.errorMap, errors);
                    this.errorList = [];
                    for (var name in errors) {
                        this.errorList.push({
                            message: errors[name],
                            element: this.findByName(name)[0]
                        });
                    }
                    this.successList = $.grep(this.successList, function(element) {
                        return !(element.name in errors);
                    });
                }
                this.settings.showErrors ? this.settings.showErrors.call(this, this.errorMap, this.errorList) : this.defaultShowErrors();
            },
            resetForm: function() {
                if ($.fn.resetForm)
                    $(this.currentForm).resetForm();
                this.submitted = {};
                this.prepareForm();
                this.hideErrors();
                this.elements().removeClass(this.settings.errorClass);
            },
            numberOfInvalids: function() {
                return this.objectLength(this.invalid);
            },
            objectLength: function(obj) {
                var count = 0;
                for (var i in obj)
                    count++;
                return count;
            },
            hideErrors: function() {
                this.addWrapper(this.toHide).hide();
            },
            valid: function() {
                return this.size() == 0;
            },
            size: function() {
                return this.errorList.length;
            },
            focusInvalid: function() {
                if (this.settings.focusInvalid) {
                    try {
                        $(this.findLastActive() || this.errorList.length && this.errorList[0].element || []).filter(":visible").focus().trigger("focusin");
                    } catch (e) {}
                }
            },
            findLastActive: function() {
                var lastActive = this.lastActive;
                return lastActive && $.grep(this.errorList, function(n) {
                    return n.element.name == lastActive.name;
                }).length == 1 && lastActive;
            },
            elements: function() {
                var validator = this,
                    rulesCache = {};
                return $([]).add(this.currentForm.elements).filter(":input").not(":submit, :reset, :image").not(this.settings.ignore).filter(function() {
                    !this.name && validator.settings.debug && window.console && console.error("%o has no name assigned", this);
                    if (this.name in rulesCache || !validator.objectLength($(this).rules()))
                        return false;
                    rulesCache[this.name] = true;
                    return true;
                });
            },
            clean: function(selector) {
                return $(selector)[0];
            },
            errors: function() {
                return $(this.settings.errorElement + "." + this.settings.errorClass, this.errorContext);
            },
            reset: function() {
                this.successList = [];
                this.errorList = [];
                this.errorMap = {};
                this.toShow = $([]);
                this.toHide = $([]);
                this.currentElements = $([]);
            },
            prepareForm: function() {
                this.reset();
                this.toHide = this.errors().add(this.containers);
            },
            prepareElement: function(element) {
                this.reset();
                this.toHide = this.errorsFor(element);
            },
            check: function(element) {
                element = this.clean(element);
                if (this.checkable(element)) {
                    element = this.findByName(element.name)[0];
                }
                var rules = $(element).rules();
                var dependencyMismatch = false;
                for (method in rules) {
                    var rule = {
                        method: method,
                        parameters: rules[method]
                    };
                    try {
                        var result = true;
                        if (typeof $.validator.methods[method] != 'undefined')
                            result = $.validator.methods[method].call(this, element.value.replace(/\r/g, ""), element, rule.parameters);
                        if (result == "dependency-mismatch") {
                            dependencyMismatch = true;
                            continue;
                        }
                        dependencyMismatch = false;
                        if (result == "pending") {
                            this.toHide = this.toHide.not(this.errorsFor(element));
                            return;
                        }
                        if (!result) {
                            this.formatAndAdd(element, rule);
                            return false;
                        }
                    } catch (e) {
                        this.settings.debug && window.console && console.log("exception occured when checking element " + element.id +
                            ", check the '" + rule.method + "' method", e);
                        throw e;
                    }
                }
                if (dependencyMismatch)
                    return;
                if (this.objectLength(rules))
                    this.successList.push(element);
                return true;
            },
            customMetaMessage: function(element, method) {
                if (!$.metadata)
                    return;
                var meta = this.settings.meta ? $(element).metadata()[this.settings.meta] : $(element).metadata();
                return meta && meta.messages && meta.messages[method];
            },
            customMessage: function(name, method) {
                var m = this.settings.messages[name];
                return m && (m.constructor == String ? m : m[method]);
            },
            findDefined: function() {
                for (var i = 0; i < arguments.length; i++) {
                    if (arguments[i] !== undefined)
                        return arguments[i];
                }
                return undefined;
            },
            defaultMessage: function(element, method) {
                return this.findDefined(this.customMessage(element.name, method), this.customMetaMessage(element, method), !this.settings.ignoreTitle && element.title || undefined, $.validator.messages[method], "<strong>Warning: No message defined for " + element.name + "</strong>");
            },
            formatAndAdd: function(element, rule) {
                var message = this.defaultMessage(element, rule.method),
                    theregex = /\$?\{(\d+)\}/g;
                if (typeof message == "function") {
                    message = message.call(this, rule.parameters, element);
                } else if (theregex.test(message)) {
                    message = jQuery.format(message.replace(theregex, '{$1}'), rule.parameters);
                }
                this.errorList.push({
                    message: message,
                    element: element
                });
                this.errorMap[element.name] = message;
                this.submitted[element.name] = message;
            },
            addWrapper: function(toToggle) {
                if (this.settings.wrapper)
                    toToggle = toToggle.add(toToggle.parent(this.settings.wrapper));
                return toToggle;
            },
            defaultShowErrors: function() {
                for (var i = 0; this.errorList[i]; i++) {
                    var error = this.errorList[i];
                    this.settings.highlight && this.settings.highlight.call(this, error.element, this.settings.errorClass, this.settings.validClass);
                    this.showLabel(error.element, error.message);
                }
                if (this.errorList.length) {
                    this.toShow = this.toShow.add(this.containers);
                }
                if (this.settings.success) {
                    for (var i = 0; this.successList[i]; i++) {
                        this.showLabel(this.successList[i]);
                    }
                }
                if (this.settings.unhighlight) {
                    for (var i = 0, elements = this.validElements(); elements[i]; i++) {
                        this.settings.unhighlight.call(this, elements[i], this.settings.errorClass, this.settings.validClass);
                    }
                }
                this.toHide = this.toHide.not(this.toShow);
                this.hideErrors();
                this.addWrapper(this.toShow).show();
            },
            validElements: function() {
                return this.currentElements.not(this.invalidElements());
            },
            invalidElements: function() {
                return $(this.errorList).map(function() {
                    return this.element;
                });
            },
            showLabel: function(element, message) {
                var label = this.errorsFor(element);
                if (message == "")
                    return;
                if (label.length) {
                    label.removeClass().addClass(this.settings.errorClass);
                    label.attr("generated") && label.html(message);
                } else {
                    label = $("<" + this.settings.errorElement + "/>").attr({
                        "for": this.idOrName(element),
                        generated: true
                    }).addClass(this.settings.errorClass).html(message || "");
                    if (this.settings.wrapper) {
                        label = label.hide().show().wrap("<" + this.settings.wrapper + "/>").parent();
                    }
                    if (!this.labelContainer.append(label).length)
                        this.settings.errorPlacement ? this.settings.errorPlacement(label, $(element)) : label.insertAfter(element);
                }
                if (!message && this.settings.success) {
                    label.text("");
                    typeof this.settings.success == "string" ? label.addClass(this.settings.success) : this.settings.success(label);
                }
                this.toShow = this.toShow.add(label);
            },
            errorsFor: function(element) {
                var name = this.idOrName(element);
                return this.errors().filter(function() {
                    return $(this).attr('for') == name;
                });
            },
            idOrName: function(element) {
                return this.groups[element.name] || (this.checkable(element) ? element.name : element.id || element.name);
            },
            checkable: function(element) {
                return /radio|checkbox/i.test(element.type);
            },
            findByName: function(name) {
                var form = this.currentForm;
                return $(document.getElementsByName(name)).map(function(index, element) {
                    return element.form == form && element.name == name && element || null;
                });
            },
            getLength: function(value, element) {
                switch (element.nodeName.toLowerCase()) {
                    case 'select':
                        return $("option:selected", element).length;
                    case 'input':
                        if (this.checkable(element))
                            return this.findByName(element.name).filter(':checked').length;
                }
                return value.length;
            },
            depend: function(param, element) {
                return this.dependTypes[typeof param] ? this.dependTypes[typeof param](param, element) : true;
            },
            dependTypes: {
                "boolean": function(param, element) {
                    return param;
                },
                "string": function(param, element) {
                    return !!$(param, element.form).length;
                },
                "function": function(param, element) {
                    return param(element);
                }
            },
            optional: function(element) {
                return !$.validator.methods.required.call(this, $.trim(element.value), element) && "dependency-mismatch";
            },
            startRequest: function(element) {
                if (!this.pending[element.name]) {
                    this.pendingRequest++;
                    this.pending[element.name] = true;
                }
            },
            stopRequest: function(element, valid) {
                this.pendingRequest--;
                if (this.pendingRequest < 0)
                    this.pendingRequest = 0;
                delete this.pending[element.name];
                if (valid && this.pendingRequest == 0 && this.formSubmitted && this.form()) {
                    $(this.currentForm).submit();
                    this.formSubmitted = false;
                } else if (!valid && this.pendingRequest == 0 && this.formSubmitted) {
                    $(this.currentForm).triggerHandler("invalid-form", [this]);
                    this.formSubmitted = false;
                }
            },
            previousValue: function(element) {
                return $.data(element, "previousValue") || $.data(element, "previousValue", {
                    old: null,
                    valid: true,
                    message: this.defaultMessage(element, "remote")
                });
            }
        },
        classRuleSettings: {
            required: {
                required: true
            },
            email: {
                email: true
            },
            url: {
                url: true
            },
            date: {
                date: true
            },
            dateISO: {
                dateISO: true
            },
            dateDE: {
                dateDE: true
            },
            number: {
                number: true
            },
            numberDE: {
                numberDE: true
            },
            digits: {
                digits: true
            },
            creditcard: {
                creditcard: true
            }
        },
        addClassRules: function(className, rules) {
            className.constructor == String ? this.classRuleSettings[className] = rules : $.extend(this.classRuleSettings, className);
        },
        classRules: function(element) {
            var rules = {};
            var classes = $(element).attr('class');
            classes && $.each(classes.split(' '), function() {
                if (this in $.validator.classRuleSettings) {
                    $.extend(rules, $.validator.classRuleSettings[this]);
                }
            });
            return rules;
        },
        attributeRules: function(element) {
            var rules = {};
            var $element = $(element);
            for (method in $.validator.methods) {
                var value = $element.attr(method);
                if (value) {
                    rules[method] = value;
                }
            }
            if (rules.maxlength && /-1|2147483647|524288/.test(rules.maxlength)) {
                delete rules.maxlength;
            }
            return rules;
        },
        metadataRules: function(element) {
            if (!$.metadata) return {};
            var meta = $.data(element.form, 'validator').settings.meta;
            return meta ? $(element).metadata()[meta] : $(element).metadata();
        },
        staticRules: function(element) {
            var rules = {};
            var validator = $.data(element.form, 'validator');
            if (validator.settings.rules) {
                rules = $.validator.normalizeRule(validator.settings.rules[element.name]) || {};
            }
            return rules;
        },
        normalizeRules: function(rules, element) {
            $.each(rules, function(prop, val) {
                if (val === false) {
                    delete rules[prop];
                    return;
                }
                if (val.param || val.depends) {
                    var keepRule = true;
                    switch (typeof val.depends) {
                        case "string":
                            keepRule = !!$(val.depends, element.form).length;
                            break;
                        case "function":
                            keepRule = val.depends.call(element, element);
                            break;
                    }
                    if (keepRule) {
                        rules[prop] = val.param !== undefined ? val.param : true;
                    } else {
                        delete rules[prop];
                    }
                }
            });
            $.each(rules, function(rule, parameter) {
                rules[rule] = $.isFunction(parameter) ? parameter(element) : parameter;
            });
            $.each(['minlength', 'maxlength', 'min', 'max'], function() {
                if (rules[this]) {
                    rules[this] = Number(rules[this]);
                }
            });
            $.each(['rangelength', 'range'], function() {
                if (rules[this]) {
                    rules[this] = [Number(rules[this][0]), Number(rules[this][1])];
                }
            });
            if ($.validator.autoCreateRanges) {
                if (rules.min && rules.max) {
                    rules.range = [rules.min, rules.max];
                    delete rules.min;
                    delete rules.max;
                }
                if (rules.minlength && rules.maxlength) {
                    rules.rangelength = [rules.minlength, rules.maxlength];
                    delete rules.minlength;
                    delete rules.maxlength;
                }
            }
            if (rules.messages) {
                delete rules.messages;
            }
            return rules;
        },
        normalizeRule: function(data) {
            if (typeof data == "string") {
                var transformed = {};
                $.each(data.split(/\s/), function() {
                    transformed[this] = true;
                });
                data = transformed;
            }
            return data;
        },
        addMethod: function(name, method, message) {
            $.validator.methods[name] = method;
            $.validator.messages[name] = message != undefined ? message : $.validator.messages[name];
            if (method.length < 3) {
                $.validator.addClassRules(name, $.validator.normalizeRule(name));
            }
        },
        methods: {
            required: function(value, element, param) {
                if (!this.depend(param, element))
                    return "dependency-mismatch";
                switch (element.nodeName.toLowerCase()) {
                    case 'select':
                        var val = $(element).val();
                        return val && val.length > 0;
                    case 'input':
                        if (this.checkable(element))
                            return this.getLength(value, element) > 0;
                    default:
                        return $.trim(value).length > 0;
                }
            },
            remote: function(value, element, param) {
                if (this.optional(element))
                    return "dependency-mismatch";
                var previous = this.previousValue(element);
                if (!this.settings.messages[element.name])
                    this.settings.messages[element.name] = {};
                previous.originalMessage = this.settings.messages[element.name].remote;
                this.settings.messages[element.name].remote = previous.message;
                param = typeof param == "string" && {
                    url: param
                } || param;
                if (previous.old !== value) {
                    previous.old = value;
                    var validator = this;
                    this.startRequest(element);
                    var data = {};
                    data[element.name] = value;
                    $.ajax($.extend(true, {
                        url: param,
                        mode: "abort",
                        port: "validate" + element.name,
                        dataType: "json",
                        data: data,
                        success: function(response) {
                            validator.settings.messages[element.name].remote = previous.originalMessage;
                            var valid = response === true;
                            if (valid) {
                                var submitted = validator.formSubmitted;
                                validator.prepareElement(element);
                                validator.formSubmitted = submitted;
                                validator.successList.push(element);
                                validator.showErrors();
                            } else {
                                var errors = {};
                                var message = (previous.message = response || validator.defaultMessage(element, "remote"));
                                errors[element.name] = $.isFunction(message) ? message(value) : message;
                                validator.showErrors(errors);
                            }
                            previous.valid = valid;
                            validator.stopRequest(element, valid);
                        }
                    }, param));
                    return "pending";
                } else if (this.pending[element.name]) {
                    return "pending";
                }
                return previous.valid;
            },
            minlength: function(value, element, param) {
                return this.optional(element) || this.getLength($.trim(value), element) >= param;
            },
            maxlength: function(value, element, param) {
                return this.optional(element) || this.getLength($.trim(value), element) <= param;
            },
            rangelength: function(value, element, param) {
                var length = this.getLength($.trim(value), element);
                return this.optional(element) || (length >= param[0] && length <= param[1]);
            },
            min: function(value, element, param) {
                return this.optional(element) || value >= param;
            },
            max: function(value, element, param) {
                return this.optional(element) || value <= param;
            },
            range: function(value, element, param) {
                return this.optional(element) || (value >= param[0] && value <= param[1]);
            },
            email: function(value, element) {
                return this.optional(element) || /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i.test(value);
            },
            url: function(value, element) {
                return this.optional(element) || /^(((ht|f)tp(s?))\:\/\/)?(www.|[a-zA-Z].)(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value);
            },
            date: function(value, element) {
                return this.optional(element) || !/Invalid|NaN/.test(new Date(value));
            },
            dateISO: function(value, element) {
                return this.optional(element) || /^\d{4}[\/-]\d{1,2}[\/-]\d{1,2}$/.test(value);
            },
            number: function(value, element) {
                return this.optional(element) || /^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(value);
            },
            digits: function(value, element) {
                return this.optional(element) || /^\d+$/.test(value);
            },
            creditcard: function(value, element) {
                if (this.optional(element))
                    return "dependency-mismatch";
                if (/[^0-9-]+/.test(value))
                    return false;
                var nCheck = 0,
                    nDigit = 0,
                    bEven = false;
                value = value.replace(/\D/g, "");
                for (var n = value.length - 1; n >= 0; n--) {
                    var cDigit = value.charAt(n);
                    var nDigit = parseInt(cDigit, 10);
                    if (bEven) {
                        if ((nDigit *= 2) > 9)
                            nDigit -= 9;
                    }
                    nCheck += nDigit;
                    bEven = !bEven;
                }
                return (nCheck % 10) == 0;
            },
            accept: function(value, element, param) {
                param = typeof param == "string" ? param.replace(/,/g, '|') : "png|jpe?g|gif";
                return this.optional(element) || value.match(new RegExp(".(" + param + ")$", "i"));
            },
            equalTo: function(value, element, param) {
                var target = $(param).unbind(".validate-equalTo").bind("blur.validate-equalTo", function() {
                    $(element).valid();
                });
                return value == target.val();
            }
        }
    });
    $.format = $.validator.format;
})(jQuery);;
(function($) {
    var ajax = $.ajax;
    var pendingRequests = {};
    $.ajax = function(settings) {
        settings = $.extend(settings, $.extend({}, $.ajaxSettings, settings));
        var port = settings.port;
        if (settings.mode == "abort") {
            if (pendingRequests[port]) {
                pendingRequests[port].abort();
            }
            return (pendingRequests[port] = ajax.apply(this, arguments));
        }
        return ajax.apply(this, arguments);
    };
})(jQuery);;
(function($) {
    if (!jQuery.event.special.focusin && !jQuery.event.special.focusout && document.addEventListener) {
        $.each({
            focus: 'focusin',
            blur: 'focusout'
        }, function(original, fix) {
            $.event.special[fix] = {
                setup: function() {
                    this.addEventListener(original, handler, true);
                },
                teardown: function() {
                    this.removeEventListener(original, handler, true);
                },
                handler: function(e) {
                    arguments[0] = $.event.fix(e);
                    arguments[0].type = fix;
                    return $.event.handle.apply(this, arguments);
                }
            };

            function handler(e) {
                e = $.event.fix(e);
                e.type = fix;
                return $.event.handle.call(this, e);
            }
        });
    };
    $.extend($.fn, {
        validateDelegate: function(delegate, type, handler) {
            return this.bind(type, function(event) {
                var target = $(event.target);
                if (target.is(delegate)) {
                    return handler.apply(target, arguments);
                }
            });
        }
    });
})(jQuery);

/* jscripts/tools.js */

var $moveBoxStyle = $("<style></style>");
$moveBoxStyle.appendTo("head");
var originalElementTop = -1;
var _is_debug = false,
    _redirect = function(url, new_window) {
        if (typeof url == 'undefined')
            url = document.location.href;
        if (typeof new_window == 'undefined')
            new_window = false;
        if (new_window === true) {
            window.open(url);
        } else {
            if (document.location.href == url && url.indexOf("#") != -1) {
                location.reload(true);
            } else {
                document.location.href = url;
            }
        }
        return false;
    },
    alerts = {
        del: function(type) {
            type = parseInt(type);
            if (confirm(type < 0 ? "Are you sure you want to delete all the existing alerts?" : "Are you sure you want to delete all the existing alerts for this type?"))
                _redirect("/myalerts.php?action=delete&type=" + type);
            return false;
        }
    },
    ugallery = {
        lib: "/ajax_usergallery_folder.php",
        showAll: function() {
            var $this = this;
            $.each($("#tgl_all").val().split("|"), function(k, v) {
                if (v != "")
                    if (!$("#ug_" + v).is(":visible"))
                        $this.toggle(v);
            });
            $("#ug_showAll").hide();
            $("#ug_hideAll").show();
            return false;
        },
        hideAll: function() {
            var $this = this;
            $.each($("#tgl_all").val().split("|"), function(k, v) {
                if (v != "")
                    if ($("#ug_" + v).is(":visible"))
                        $this.toggle(v);
            });
            $("#ug_showAll").show();
            $("#ug_hideAll").hide();
            return false;
        },
        toggle: function(id) {
            if ($("#ug_" + id).html() == "") {
                $("#ug_" + id).html("<img src='/img/ajax-loader.gif'> Loading...");
                var $this = this;
                $.ajax({
                    url: $this.lib,
                    type: "GET",
                    data: "id=" + id + "&userid=" + $("input[id=userid_input]").val(),
                    dataType: 'html',
                    cache: true,
                    async: true,
                    timeout: 12000000,
                    scriptCharset: "UTF-8",
                    success: function(r, s) {
                        $("#ug_" + id).html(r == "" ? "<i>Empty</i>" : r);
                    }
                });
            }
            $("#ug_" + id).slideToggle("fast", function() {
                if ($(this).is(":visible")) {
                    $("#img_" + id).attr("src", "/img/arrow_down.gif");
                } else {
                    $("#img_" + id).attr("src", "/img/arrow_left.gif");
                }
            });
            return false;
        }
    }
msg = {
    loaded: false,
    load: function() {
        if (this.loaded)
            return;
        $.ajax({
            url: "/ajax_last_messages.php",
            type: "GET",
            dataType: 'html',
            cache: true,
            async: true,
            timeout: 12000000,
            scriptCharset: "UTF-8",
            success: function(r, s) {
                $(".msgCont").html(r);
            }
        });
        this.loaded = true;
    }
}, captch = {
    i: 0,
    retry: function() {
        alert("Confirmation code is wrong, please try again.");
        this.refresh();
    },
    refresh: function() {
        var rand = Math.random();
        $("img[id=captcha]").each(function() {
            $(this).attr("src", "/captcha.php?" + rand);
        });
        this.i++;
        return false;
    },
    init: function() {
        if (this.i == 0)
            this.refresh();
    }
}, region = {
    load: function(countryid, sel) {
        if (typeof sel == 'undefined')
            sel = "";
        if (countryid == "" || countryid == 0) {
            $("#formregion").html("<option value=''>Select a country first</option>");
        } else {
            $.ajax({
                url: "/ajax_region.php",
                type: "POST",
                data: "countryid=" + countryid + "&sel=" + sel,
                dataType: 'html',
                cache: true,
                async: true,
                timeout: 12000000,
                scriptCharset: "UTF-8",
                beforeSend: function() {
                    $("#formregion").html("<option value=''>Loading...</option>");
                },
                success: function(r, s) {
                    switch (parseInt(r)) {
                        case 500:
                            alert("Invalid post data");
                            break;
                        case 501:
                            alert("Missing inputs");
                            break;
                        case 502:
                            alert("Invalid input");
                            break;
                        default:
                            $("#formregion").html(r);
                    }
                }
            });
        }
    },
    init: function() {
        var $this = this;
        if ($("#formcountry").length > 0) {
            $("#formcountry").change(function() {
                $this.load($(this).val());
            });
            $this.load($("#formcountry").val(), $("#formregion_hidden").length > 0 && $("#formregion_hidden").val() != "" ? $("#formregion_hidden").val() : "");
        }
    }
}, comment = {
    id: null,
    replyCancel: function() {
        $(this.id + "_cid").val("");
        $(this.id + "_content").val("");
        $(this.id + "_reply").hide();
        $(this.id + "_first").hide();
        $(this.id + "_many").show();
        return false;
    },
    reply: function(id, who) {
        if (typeof id == 'undefined' || id == "" || parseInt(id) <= 0)
            return false;
        $(this.id + "_many").hide();
        $(this.id + "_first").hide();
        $(this.id + "_reply").show();
        $(this.id + "_reply_who").html(who);
        $(this.id + "_cid").val(id);
        $(this.id + "_content").click().focus();
        $.scrollTo($(this.id + "_content"), {
            offset: -50
        });
        return false;
    },
    clean: function() {
        $("#cntComments").html('');
        $(this.id + "_cid").val("");
        $(this.id + "_reply").hide();
        $(this.id + "_many").hide();
        $(this.id + "_first").show();
    },
    load: function(id, comments) {
        var $this = this;
        if (typeof comments != 'undefined') {
            $("#cntComments").html(comments);
            $($this.id + "_cid").val("");
            if (comments != "") {
                $($this.id + "_many").show();
                $($this.id + "_first").hide();
                $($this.id + "_reply").hide();
            } else {
                $($this.id + "_reply").hide();
                $($this.id + "_many").hide();
                $($this.id + "_first").show();
            }
        } else {
            $.ajax({
                url: "/ajax_comments.php",
                type: "POST",
                data: "id=" + id,
                dataType: 'html',
                cache: true,
                async: true,
                timeout: 12000000,
                scriptCharset: "UTF-8",
                success: function(r, s) {
                    $("#cntComments").html(r);
                    $($this.id + "_cid").val("");
                    if (r != "") {
                        $($this.id + "_many").show();
                        $($this.id + "_first").hide();
                        $($this.id + "_reply").hide();
                    } else {
                        $($this.id + "_reply").hide();
                        $($this.id + "_many").hide();
                        $($this.id + "_first").show();
                    }
                }
            });
        }
    },
    loadVideo: function(id) {
        var $this = this;
        $.ajax({
            url: "/ajax_comments.php",
            type: "POST",
            data: "vid=" + id,
            dataType: 'html',
            cache: true,
            async: true,
            timeout: 12000000,
            scriptCharset: "UTF-8",
            success: function(r, s) {
                $("#cntComments").html(r);
                $($this.id + "_cid").val("");
                if (r != "") {
                    $($this.id + "_many").show();
                    $($this.id + "_first").hide();
                    $($this.id + "_reply").hide();
                } else {
                    $($this.id + "_reply").hide();
                    $($this.id + "_many").hide();
                    $($this.id + "_first").show();
                }
            }
        });
    },
    send: function(cid) {
        if (cid)
            this.id = "#comments" + cid;
        if ($(this.id).valid()) {
            var $this = this;
            $.ajax({
                url: "/ajax_comment.php",
                data: "comment=" + $(this.id + "_content").val() + "&comments_captcha=" + $(this.id + "_captcha").val() +
                    ($("input[id=imageid" + cid + "_input]").length > 0 ? "&imgid=" + $("input[id=imageid" + cid + "_input]").val() : "") +
                    ($("input[id=videoid" + cid + "_input]").length > 0 ? "&vid=" + $("input[id=videoid" + cid + "_input]").val() : "") +
                    ($("input[id=galleryid" + cid + "_input]").length > 0 ? "&gid=" + $("input[id=galleryid" + cid + "_input]").val() : "") +
                    ($("input[id=profileid" + cid + "_input]").length > 0 ? "&pid=" + $("input[id=profileid" + cid + "_input]").val() : "") +
                    ($("input[id=shoutid" + cid + "_input]").length > 0 ? "&sid=" + $("input[id=shoutid" + cid + "_input]").val() : "") +
                    ($(this.id + "_cid").val() != "" ? "&cid=" + $(this.id + "_cid").val() : ""),
                type: "POST",
                dataType: "html",
                async: false,
                timeout: 12000000,
                scriptCharset: "UTF-8",
                beforeSend: function() {
                    $($this.id).find("#cf").hide();
                    $($this.id).find("#cf_loading").show();
                },
                complete: function() {
                    $($this.id).find("#cf").show();
                    $($this.id).find("#cf_loading").hide();
                },
                success: function(r, s) {
                    switch (parseInt(r)) {
                        case 500:
                            captch.retry();
                            break;
                        case 501:
                            alert("The owner of this gallery has blocked you, can't add comment.");
                            break;
                        case 502:
                            alert("Invalid inputs.");
                            break;
                        case 503:
                            alert("Missing inputs.");
                            break;
                        case 504:
                            alert("You're not logged in, redirecting to login page...");
                            _redirect("/login.php?backurl=" + document.location.href.replace(/#/g, "@@@"));
                            break;
                        case 200:
                            $($this.id)[0].reset();
                            if ($("input[id=videoid_input]").length > 0)
                                $this.loadVideo($("input[id=videoid_input]").val());
                            else
                                $this.load($("input[id=imageid_input]").val());
                            break;
                    }
                }
            });
        }
        return false;
    },
    init: function(id) {
        this.id = id;
        $(this.id).validate({
            rules: {
                "comments_content": "required",
                "comments_captcha": {
                    "required": true,
                    "minlength": 4
                }
            },
            messages: {
                "comments_content": "",
                "comments_captcha": ""
            }
        });
        $(this.id + "_content").click(function() {
            $(".cntCommentControls").show();
            captch.init();
        });
        $(this.id + ($("#cntComments").html() != "" ? "_many" : "_first")).show();
    }
}, share = {
    api: null,
    id: null,
    send: function() {
        if ($(this.id + "_form").valid()) {
            var $this = this;
            $.ajax({
                url: "/ajax_share.php",
                data: "who=" + $("#share_who").val() + "&share_eml=" + $("#share_eml").val() + "&share_usr=" + $("#share_usr").val() + "&share_captcha=" + $("#share_captcha").val() + ($("input[id=imageid_input]").length > 0 ? "&imgid=" + $("input[id=imageid_input]").val() : "") + "&gid=" + $("input[id=galleryid_input]").val(),
                type: "POST",
                dataType: "html",
                async: true,
                timeout: 12000000,
                scriptCharset: "UTF-8",
                beforeSend: function() {
                    $($this.id).find("#cf").hide();
                    $($this.id).find("#cf_loading").show();
                },
                complete: function() {
                    $($this.id).find("#cf").show();
                    $($this.id).find("#cf_loading").hide();
                },
                success: function(r, s) {
                    switch (parseInt(r)) {
                        case 500:
                            captch.retry();
                            break;
                        case 501:
                            alert("None of the friends you added are valid usernames or emails.");
                            break;
                        case 502:
                            alert("One or more of your recommended friends are invalid.");
                            break;
                        case 200:
                            $($this.id + "_form")[0].reset();
                            $this.close();
                            break;
                    }
                }
            });
        }
        return false;
    },
    show: function() {
        if (this.api == null)
            this.init("#share");
        captch.init();
        this.api.load();
        return false;
    },
    close: function() {
        this.api.close();
        return false;
    },
    init: function(id) {
        if (this.api != null)
            return;
        $(id).overlay({
            mask: {
                color: "#fff",
                loadSpeed: 500,
                opacity: 0.7
            },
            load: false
        });
        this.api = $(id).data("overlay");
        this.id = id;
        $(this.id + "_form").validate({
            rules: {
                "share_who": "required",
                "share_usr": "required",
                "share_eml": {
                    "required": true,
                    "email": true
                },
                "share_captcha": {
                    "required": true,
                    "minlength": 4
                }
            },
            messages: {
                "share_who": "",
                "share_usr": "",
                "share_eml": "",
                "share_captcha": ""
            }
        });
    }
}, flag = {
    api: null,
    id: null,
    send: function() {
        if ($(this.id + "_form").valid()) {
            var $this = this;
            $.ajax({
                url: "/ajax_flag.php",
                data: ($("input[id=imageid_input]").length > 0 ? "abuse=1&imgid=" + $("input[id=imageid_input]").val() : "abuse=2") + "&gid=" + $("input[id=galleryid_input]").val() + "&flag_usr=" + $("#flag_usr").val() + "&flag_eml=" + $("#flag_eml").val() + "&flag_reason=" + $("#flag_reason").val() + "&flag_captcha=" + $("#flag_captcha").val(),
                type: "POST",
                dataType: "html",
                async: true,
                timeout: 12000000,
                scriptCharset: "UTF-8",
                beforeSend: function() {
                    $($this.id).find("#cf").hide();
                    $($this.id).find("#cf_loading").show();
                },
                complete: function() {
                    $($this.id).find("#cf").show();
                    $($this.id).find("#cf_loading").hide();
                },
                success: function(r, s) {
                    if (r == "500") {
                        captch.retry();
                    } else {
                        $($this.id + "_form")[0].reset();
                        $this.close();
                    }
                }
            });
        }
        return false;
    },
    show: function() {
        if (this.api == null)
            this.init("#flag");
        captch.init();
        this.api.load();
        return false;
    },
    close: function() {
        this.api.close();
        return false;
    },
    init: function(id) {
        if (this.api != null)
            return;
        $(id).overlay({
            mask: {
                color: "#fff",
                loadSpeed: 500,
                opacity: 0.7
            },
            load: false
        });
        this.api = $(id).data("overlay");
        this.id = id;
        $(this.id + "_form").validate({
            rules: {
                "flag_usr": "required",
                "flag_eml": {
                    "required": true,
                    "email": true
                },
                "flag_reason": "required",
                "flag_captcha": {
                    "required": true,
                    "minlength": 4
                }
            },
            messages: {
                "flag_usr": "",
                "flag_eml": "",
                "flag_reason": "",
                "flag_captcha": ""
            }
        });
    }
}, announce = {
    close: function() {
        $(".announceBox").hide();
        $.ajax({
            url: "/ajax_announce.php",
            dataType: "html",
            async: true,
            timeout: 12000000,
            scriptCharset: "UTF-8"
        });
        return false;
    }
}, favorites = {
    id: null,
    init: function(id) {
        this.id = id;
        $("#" + id).change(function() {
            var $this = $(this),
                opts = "",
                fid = $(this).val();
            $(this).find("option").each(function() {
                opts += $(this).val() + "|";
            });
            switch ($(this).val()) {
                case "__NEW_PICTURE__":
                    var name = prompt("What's the name of the new picture folder you want to create?");
                    name = $.trim(name);
                    if (name != "") {
                        $.ajax({
                            url: "/ajax_favorites.php",
                            data: "action=0&name=" + name + "&imgid=" + $("input[id=imageid_input]").val() + "&gid=" + $("input[id=galleryid_input]").val(),
                            type: "POST",
                            dataType: "html",
                            async: true,
                            timeout: 12000000,
                            scriptCharset: "UTF-8",
                            beforeSend: function() {
                                $(".addTo_loading").show();
                            },
                            complete: function() {
                                $(".addTo_loading").hide();
                            },
                            success: function(r, s) {
                                switch (parseInt(r)) {
                                    case 500:
                                        alert("Invalid name");
                                        $this.val("");
                                        break;
                                    case 501:
                                        alert("You're not logged in, redirecting to login page...");
                                        _redirect("/login.php?backurl=" + document.location.href.replace(/#/g, "@@@"));
                                        break;
                                    case 502:
                                        alert("This folder name already exists");
                                        $this.val("");
                                        break;
                                    default:
                                        $this.html(r);
                                        $this.find("option").each(function() {
                                            if (opts.indexOf($(this).val()) == -1)
                                                fid = $(this).val();
                                        });
                                        favorites.updateSpan(fid);
                                        break;
                                }
                            }
                        });
                    } else {
                        alert("Invalid name.");
                    }
                    break;
                case "__NEW_GALLERY__":
                    var name = prompt("What's the name of the new gallery folder you want to create?")
                    name = $.trim(name);
                    if (name != "") {
                        $.ajax({
                            url: "/ajax_favorites.php",
                            data: "action=1&name=" + name + "&imgid=" + $("input[id=imageid_input]").val() + "&gid=" + $("input[id=galleryid_input]").val(),
                            type: "POST",
                            dataType: "html",
                            async: true,
                            timeout: 12000000,
                            scriptCharset: "UTF-8",
                            beforeSend: function() {
                                $(".addTo_loading").show();
                            },
                            complete: function() {
                                $(".addTo_loading").hide();
                            },
                            success: function(r, s) {
                                switch (parseInt(r)) {
                                    case 500:
                                        alert("Invalid name");
                                        $this.val("");
                                        break;
                                    case 501:
                                        alert("You're not logged in, redirecting to login page...");
                                        _redirect("/login.php?backurl=" + document.location.href.replace(/#/g, "@@@"));
                                        break;
                                    case 502:
                                        alert("This folder name already exists");
                                        $this.val("");
                                        break;
                                    default:
                                        $this.html(r);
                                        $this.find("option").each(function() {
                                            if (opts.indexOf($(this).val()) == -1)
                                                fid = $(this).val();
                                        });
                                        favorites.updateSpan(fid);
                                        break;
                                }
                            }
                        });
                    } else {
                        alert("Invalid name.");
                    }
                    break;
                case "":
                    break;
                default:
                    $.ajax({
                        url: "/ajax_favorites.php",
                        data: "action=2&name=" + $(this).val() + "&imgid=" + $("input[id=imageid_input]").val() + "&gid=" + $("input[id=galleryid_input]").val(),
                        type: "POST",
                        dataType: "html",
                        async: true,
                        timeout: 12000000,
                        scriptCharset: "UTF-8",
                        beforeSend: function() {
                            $(".addTo_loading").show();
                        },
                        complete: function() {
                            $(".addTo_loading").hide();
                        },
                        success: function(r, s) {
                            switch (parseInt(r)) {
                                case 502:
                                    alert("This item already exists inside the folder you're trying to add.");
                                    break;
                                default:
                                    favorites.updateSpan(fid);
                                    break;
                            }
                            $this.val("");
                        }
                    });
                    break;
            }
            $(this).val("");
        });
    },
    updateSpan: function(fid) {
        if (fid.indexOf("|") != -1)
            fid = fid.substr(fid.indexOf("|") + 1);
        $("." + this.id + "_result").html("<BR>Added to favorites, <a href='/favoritesmap.php?mid=" + fid + "' target='_blank'>view my favorites</a>.").show();
    }
}, search = {
    loaded: false,
    show: function(type) {
        $("#cnt_searches").show();
        if (!this.loaded)
            this.load(type);
        return false;
    },
    save: function(type) {
        var name = prompt("Please choose a name for your search:", $("#search_val").val()),
            $this = this,
            search_params;
        name = $.trim(name);
        if (name != "" && name.length <= 32) {
            switch (type) {
                case "gallery":
                    search_params = $("#search_val").val() + "||" + $("select[name=gen]").val() + "||" + $("select[name=numthumbs]").val() + "||" + $("select[name=perpage]").val();
                    break;
                default:
                    alert("Not implemented ..?");
                    return;
            }
            $.ajax({
                url: "/ajax_search_man.php",
                "type": "POST",
                data: "action=save&type=" + type + "&name=" + name + "&search=" + search_params,
                dataType: "html",
                async: true,
                timeout: 12000000,
                scriptCharset: "UTF-8",
                success: function(r, s) {
                    switch (parseInt(r)) {
                        case 500:
                            alert("There was an error processing your request, please try again.");
                            break;
                        default:
                            $this.load(type);
                            break;
                    }
                }
            });
        } else {
            alert("Invalid name.");
        }
        return false;
    },
    load: function(type) {
        this.loaded = true;
        $.ajax({
            url: "/ajax_search_man.php",
            "type": "POST",
            data: "action=load&type=" + type,
            dataType: "html",
            async: true,
            timeout: 12000000,
            scriptCharset: "UTF-8",
            beforeSend: function() {
                $("#cnt_searches").find(".scroll").html("<ul><li><img src='/img/ajax-loader.gif'>Loading...</li></ul>");
            },
            success: function(r, s) {
                $("#cnt_searches").find(".scroll").html(r);
            }
        });
    }
}, internalBlock = function(userid) {
    if (typeof userid == 'undefined')
        return;
    userid = parseInt(userid);
    if (userid <= 0)
        return;
    $.ajax({
        url: "/myblockedusers.php",
        type: "POST",
        data: "action=block&blockid=" + userid,
        dataType: "json",
        async: true,
        timeout: 12000000,
        scriptCharset: "UTF-8",
        success: function(i, r) {
            alert("User has been blocked!");
        }
    });
    return false;
}, _dom_trackActiveElement = function(evt) {
    if (evt && evt.target)
        document.activeElement = evt.target == document ? null : evt.target;
}, _dom_trackActiveElementLost = function(evt) {
    document.activeElement = null;
}, ScaleSize = function(maxW, maxH, currW, currH) {
    var ratio = currH / currW;
    if (currW > maxW) {
        currW = maxW;
        currH = currW * ratio;
    } else if (currH > maxH) {
        currH = maxH;
        currW = currH / ratio;
    }
    return {
        "width": Math.round(currW),
        "height": Math.round(currH)
    };
}, _dbg = function(x) {
    if (_is_debug && typeof console != 'undefined') {
        console.log(x);
    }
};
$(document).ready(function() {
    $('.gallerylist a, .blk_galleries a, #postswrapper a, .blk_favorites a, .msnrRandom a').click(function(e) {
        var scroll = $(document).scrollTop();
        $.cookie("listingHash", 'to-' + scroll, {
            path: '/',
            expires: 1
        });
        $.cookie("searchHash", '', {
            path: '/',
            expires: 1
        });
        if (location.pathname == '/gallery.php' && location.search == '' && $('#search_val').length)
            $.cookie("searchHash", $('#search_val').val(), {
                path: '/',
                expires: 1
            });
    });
    if (location.hash && location.hash.indexOf('to-') != -1)
        $(document).scrollTop(parseInt(location.hash.replace('#to-', '')));
    if ($("#cntZZ").length > 0) {
        if (typeof Buu !== 'undefined' && Buu.abEnabled()) {
            $(window).scroll(function() {
                moveBox($("#cntZZ"), $("#cntZZ").closest('tr'));
            });
            $(window).resize(function() {
                moveBox($("#cntZZ"), $("#cntZZ").closest('tr'));
            });
        } else {
            $("#cntZZ").scrollFollow({
                speed: 0,
                containerElement: $("#cntZZ").closest('tr')
            });
        }
    }
    if ($("#mbBanner").length > 0) {
        $("#mbBanner").scrollFollow({
            easing: "linear_mb",
            killSwitch: "mbBannerCloseLNK",
            onText: '<img src="/img/close.gif" height=16 width=16 border=0>',
            offText: ' ',
            speed: 1
        });
    }
    if ($("#lst_visitors").length > 0)
        $("#lst_visitors").click(function() {
            $("#cnt_lst_visitors").toggle();
            return false;
        });
    if ($("#flag_lnk").length > 0)
        flag.init("#flag");
    if ($("#share_lnk").length > 0)
        share.init("#share");
    if ($("#comments").length > 0)
        comment.init("#comments");
    if ($("#addTo").length > 0)
        favorites.init("addTo");
    if (!document.activeElement) {
        document.addEventListener("focus", _dom_trackActiveElement, true);
        document.addEventListener("blur", _dom_trackActiveElementLost, true);
    }
    region.init();
    $(".relHover, .msgHover").hover(function() {
        var p = $(this).attr("class").substr(0, 3);
        $("." + p + "Cont").show();
        if (p == "msg")
            msg.load();
    }, function() {
        var p = $(this).attr("class").substr(0, 3);
        $("." + p + "Cont").hide();
    });
    if ($("#alertSel").length > 0)
        $("#alertSel").change(function() {
            _redirect("/myalerts.php" + ($(this).val() != "" ? "?type=" + $(this).val() : ""));
        });
    if ($("#fanSel").length > 0)
        $("#fanSel").change(function() {
            _redirect("/myfanbase.php" + ($(this).val() != "" ? "?gender=" + $(this).val() : ""));
        });
    if ($("#fanMeSel").length > 0)
        $("#fanMeSel").change(function() {
            _redirect("/myfanbase.php?rq_page=me" + ($(this).val() != "" ? "&gender=" + $(this).val() : ""));
        });
    if ($("#img_tooltip").length > 0)
        $("[id=img_tooltip]").each(function() {
            $(this).find("a[title]").tooltip({
                position: "center right"
            });
        });
    $(".user_edit").click(function(e) {
        e.preventDefault();
        window.open($(this).attr('data-url'), 'Edit user ' + $(this).attr('data-uname'), 'height=600,width=900, scrollbars=yes');
    });
});
jQuery.extend(jQuery.easing, {
    linear_mb: function(p, n, firstNum, diff) {
        if ($("#mbBanner").css("top") != "0px")
            $("#mbBannerClose").show();
        else
            $("#mbBannerClose").hide();
        return firstNum + diff * p;
    }
});

function update_title_len() {
    var title_len = $("#title_text").val().length;
    $("#current_title_len").html(title_len);
    if (title_len > 64) {
        $("#current_title_len").css('color', 'red');
        $("#current_title_len").css('font-weight', 'bold');
    } else {
        $("#current_title_len").css('color', 'black');
        $("#current_title_len").css('font-weight', 'normal');
    }
}

function moveBox(element, parentElement) {
    if (typeof parentElement === 'undefined') {
        parentElement = element;
    }
    var pageScroll = parseInt($(document).scrollTop());
    if (originalElementTop < 0) {
        originalElementTop = parseInt(parentElement.offset().top);
    }
    if (pageScroll >= originalElementTop) {
        var text = "#" + element.attr('id') + "{position:fixed !important; top:0 !important}";
        if ($moveBoxStyle.text() != text) {
            $moveBoxStyle.text(text);
        }
    } else {
        var text = "#" + element.attr('id') + "{position:absolute !important; top: " + originalElementTop + "px !important}";
        if ($moveBoxStyle.text() != text) {
            $moveBoxStyle.text(text);
        }
    }
}

/* jscripts/jquery.rating.js */
;
if (window.jQuery)(function($) {
    if ($.browser.msie) try {
        document.execCommand("BackgroundImageCache", false, true)
    } catch (e) {};
    $.fn.rating = function(options) {
        if (this.length == 0) return this;
        if (typeof arguments[0] == 'string') {
            if (this.length > 1) {
                var args = arguments;
                return this.each(function() {
                    $.fn.rating.apply($(this), args);
                });
            };
            $.fn.rating[arguments[0]].apply(this, $.makeArray(arguments).slice(1) || []);
            return this;
        };
        var options = $.extend({}, $.fn.rating.options, options || {});
        $.fn.rating.calls++;
        this.not('.star-rating-applied').addClass('star-rating-applied').each(function() {
            var control, input = $(this);
            var eid = (this.name || 'unnamed-rating').replace(/\[|\]/g, '_').replace(/^\_+|\_+$/g, '');
            var context = $(this.form || document.body);
            var raters = context.data('rating');
            if (!raters || raters.call != $.fn.rating.calls) raters = {
                count: 0,
                call: $.fn.rating.calls
            };
            var rater = raters[eid];
            if (rater) control = rater.data('rating');
            if (rater && control)
                control.count++;
            else {
                control = $.extend({}, options || {}, ($.metadata ? input.metadata() : ($.meta ? input.data() : null)) || {}, {
                    count: 0,
                    stars: [],
                    inputs: []
                });
                control.serial = raters.count++;
                rater = $('<span class="star-rating-control"/>');
                input.before(rater);
                rater.addClass('rating-to-be-drawn');
                if (input.attr('disabled')) control.readOnly = true;
            };
            var star = $('<div class="star-rating rater-' + control.serial + '"><a title="' + (this.title || this.value) + '">' + this.value + '</a></div>');
            rater.append(star);
            if (this.id) star.attr('id', this.id);
            if (this.className) star.addClass(this.className);
            if (control.half) control.split = 2;
            if (typeof control.split == 'number' && control.split > 0) {
                var stw = ($.fn.width ? star.width() : 0) || control.starWidth;
                var spi = (control.count % control.split),
                    spw = Math.floor(stw / control.split);
                star.width(spw).find('a').css({
                    'margin-left': '-' + (spi * spw) + 'px'
                })
            };
            if (control.readOnly)
                star.addClass('star-rating-readonly');
            else
                star.addClass('star-rating-live').mouseover(function() {
                    $(this).rating('fill');
                    $(this).rating('focus');
                }).mouseout(function() {
                    $(this).rating('draw');
                    $(this).rating('blur');
                }).click(function() {
                    $(this).rating('select');
                });
            if (this.checked) control.current = star;
            input.hide();
            input.change(function() {
                $(this).rating('select');
            });
            star.data('rating.input', input.data('rating.star', star));
            control.stars[control.stars.length] = star[0];
            control.inputs[control.inputs.length] = input[0];
            control.rater = raters[eid] = rater;
            control.context = context;
            input.data('rating', control);
            rater.data('rating', control);
            star.data('rating', control);
            context.data('rating', raters);
        });
        $('.rating-to-be-drawn').rating('draw').removeClass('rating-to-be-drawn');
        return this;
    };
    $.extend($.fn.rating, {
        calls: 0,
        focus: function() {
            var control = this.data('rating');
            if (!control) return this;
            if (!control.focus) return this;
            var input = $(this).data('rating.input') || $(this.tagName == 'INPUT' ? this : null);
            if (control.focus) control.focus.apply(input[0], [input.val(), $('a', input.data('rating.star'))[0]]);
        },
        blur: function() {
            var control = this.data('rating');
            if (!control) return this;
            if (!control.blur) return this;
            var input = $(this).data('rating.input') || $(this.tagName == 'INPUT' ? this : null);
            if (control.blur) control.blur.apply(input[0], [input.val(), $('a', input.data('rating.star'))[0]]);
        },
        fill: function() {
            var control = this.data('rating');
            if (!control) return this;
            if (control.readOnly) return;
            this.rating('drain');
            this.prevAll().andSelf().filter('.rater-' + control.serial).addClass('star-rating-hover');
        },
        drain: function() {
            var control = this.data('rating');
            if (!control) return this;
            if (control.readOnly) return;
            control.rater.children().filter('.rater-' + control.serial).removeClass('star-rating-on').removeClass('star-rating-hover');
        },
        draw: function() {
            var control = this.data('rating');
            if (!control) return this;
            this.rating('drain');
            if (control.current) {
                control.current.data('rating.input').attr('checked', 'checked');
                control.current.prevAll().andSelf().filter('.rater-' + control.serial).addClass('star-rating-on');
            } else
                $(control.inputs).removeAttr('checked');
            this.siblings()[control.readOnly ? 'addClass' : 'removeClass']('star-rating-readonly');
        },
        select: function(value, wantCallBack) {
            var control = this.data('rating');
            if (!control) return this;
            if (control.readOnly) return;
            control.current = null;
            if (typeof value != 'undefined') {
                if (typeof value == 'number')
                    return $(control.stars[value]).rating('select', undefined, wantCallBack);
                if (typeof value == 'string')
                    $.each(control.stars, function() {
                        if ($(this).data('rating.input').val() == value) $(this).rating('select', undefined, wantCallBack);
                    });
            } else
                control.current = this[0].tagName == 'INPUT' ? this.data('rating.star') : (this.is('.rater-' + control.serial) ? this : null);
            this.data('rating', control);
            this.rating('draw');
            var input = $(control.current ? control.current.data('rating.input') : null);
            if ((wantCallBack || wantCallBack == undefined) && control.callback) control.callback.apply(input[0], [input.val(), $('a', control.current)[0]]);
        },
        readOnly: function(toggle, disable) {
            var control = this.data('rating');
            if (!control) return this;
            control.readOnly = toggle || toggle == undefined ? true : false;
            if (disable) $(control.inputs).attr("disabled", "disabled");
            else $(control.inputs).removeAttr("disabled");
            this.data('rating', control);
            this.rating('draw');
        },
        disable: function() {
            this.rating('readOnly', true, true);
        },
        enable: function() {
            this.rating('readOnly', false, false);
        }
    });
    $.fn.rating.options = {
        cancel: 'Cancel Rating',
        cancelValue: '',
        split: 0,
        starWidth: 16
    };
    $(function() {
        $('input[type=radio].star').rating();
    });
})(jQuery);

/* jscripts/jquery.tools.overlay.js */

(function($) {
    $.tools = $.tools || {
        version: '1.2.2'
    };
    $.tools.overlay = {
        addEffect: function(name, loadFn, closeFn) {
            effects[name] = [loadFn, closeFn];
        },
        conf: {
            close: null,
            closeOnClick: true,
            closeOnEsc: true,
            closeSpeed: 'fast',
            effect: 'default',
            fixed: !$.browser.msie || $.browser.version > 6,
            left: 'center',
            load: false,
            mask: null,
            oneInstance: true,
            speed: 'normal',
            target: null,
            top: '10%'
        }
    };
    var instances = [],
        effects = {};
    $.tools.overlay.addEffect('default', function(pos, onLoad) {
        var conf = this.getConf(),
            w = $(window);
        if (!conf.fixed) {
            pos.top += w.scrollTop();
            pos.left += w.scrollLeft();
        }
        pos.position = conf.fixed ? 'fixed' : 'absolute';
        this.getOverlay().css(pos).fadeIn(conf.speed, onLoad);
    }, function(onClose) {
        this.getOverlay().fadeOut(this.getConf().closeSpeed, onClose);
    });

    function Overlay(trigger, conf) {
        var self = this,
            fire = trigger.add(self),
            w = $(window),
            closers, overlay, opened, maskConf = $.tools.expose && (conf.mask || conf.expose),
            uid = Math.random().toString().slice(10);
        if (maskConf) {
            if (typeof maskConf == 'string') {
                maskConf = {
                    color: maskConf
                };
            }
            maskConf.closeOnClick = maskConf.closeOnEsc = false;
        }
        var jq = conf.target || trigger.attr("rel");
        overlay = jq ? $(jq) : null || trigger;
        if (!overlay.length) {
            throw "Could not find Overlay: " + jq;
        }
        if (trigger && trigger.index(overlay) == -1) {
            trigger.click(function(e) {
                self.load(e);
                return e.preventDefault();
            });
        }
        $.extend(self, {
            load: function(e) {
                if (self.isOpened()) {
                    return self;
                }
                var eff = effects[conf.effect];
                if (!eff) {
                    throw "Overlay: cannot find effect : \"" + conf.effect + "\"";
                }
                if (conf.oneInstance) {
                    $.each(instances, function() {
                        this.close(e);
                    });
                }
                e = e || $.Event();
                e.type = "onBeforeLoad";
                fire.trigger(e);
                if (e.isDefaultPrevented()) {
                    return self;
                }
                opened = true;
                if (maskConf) {
                    $(overlay).expose(maskConf);
                }
                var top = conf.top,
                    left = conf.left,
                    oWidth = overlay.outerWidth({
                        margin: true
                    }),
                    oHeight = overlay.outerHeight({
                        margin: true
                    });
                if (typeof top == 'string') {
                    top = top == 'center' ? Math.max((w.height() - oHeight) / 2, 0) : parseInt(top, 10) / 100 * w.height();
                }
                if (left == 'center') {
                    left = Math.max((w.width() - oWidth) / 2, 0);
                }
                eff[0].call(self, {
                    top: top,
                    left: left
                }, function() {
                    if (opened) {
                        e.type = "onLoad";
                        fire.trigger(e);
                    }
                });
                if (maskConf && conf.closeOnClick) {
                    $.emask.getMask().one("click", self.close);
                }
                if (conf.closeOnClick) {
                    $(document).bind("click." + uid, function(e) {
                        if (!$(e.target).parents(overlay).length) {
                            self.close(e);
                        }
                    });
                }
                if (conf.closeOnEsc) {
                    $(document).bind("keydown." + uid, function(e) {
                        if (e.keyCode == 27) {
                            self.close(e);
                        }
                    });
                }
                return self;
            },
            close: function(e) {
                if (!self.isOpened()) {
                    return self;
                }
                e = e || $.Event();
                e.type = "onBeforeClose";
                fire.trigger(e);
                if (e.isDefaultPrevented()) {
                    return;
                }
                opened = false;
                effects[conf.effect][1].call(self, function() {
                    e.type = "onClose";
                    fire.trigger(e);
                });
                $(document).unbind("click." + uid).unbind("keydown." + uid);
                if (maskConf) {
                    $.emask.close();
                }
                return self;
            },
            getOverlay: function() {
                return overlay;
            },
            getTrigger: function() {
                return trigger;
            },
            getClosers: function() {
                return closers;
            },
            isOpened: function() {
                return opened;
            },
            getConf: function() {
                return conf;
            }
        });
        $.each("onBeforeLoad,onStart,onLoad,onBeforeClose,onClose".split(","), function(i, name) {
            if ($.isFunction(conf[name])) {
                $(self).bind(name, conf[name]);
            }
            self[name] = function(fn) {
                $(self).bind(name, fn);
                return self;
            };
        });
        closers = overlay.find(conf.close || ".close");
        if (!closers.length && !conf.close) {
            closers = $('<div class="close"></div>');
            overlay.prepend(closers);
        }
        closers.click(function(e) {
            self.close(e);
        });
        if (conf.load) {
            self.load();
        }
    }
    $.fn.overlay = function(conf) {
        var el = this.data("overlay");
        if (el) {
            return el;
        }
        if ($.isFunction(conf)) {
            conf = {
                onBeforeLoad: conf
            };
        }
        conf = $.extend(true, {}, $.tools.overlay.conf, conf);
        this.each(function() {
            el = new Overlay($(this), conf);
            instances.push(el);
            $(this).data("overlay", el);
        });
        return conf.api ? el : this;
    };
})(jQuery);

/* jscripts/jquery.tools.toolbox.expose.js */

(function($) {
    $.tools = $.tools || {
        version: '1.2.2'
    };
    var tool;
    tool = $.tools.expose = {
        conf: {
            maskId: 'exposeMask',
            loadSpeed: 'slow',
            closeSpeed: 'fast',
            closeOnClick: true,
            closeOnEsc: true,
            zIndex: 9998,
            opacity: 0.8,
            startOpacity: 0,
            color: '#fff',
            onLoad: null,
            onClose: null
        }
    };

    function viewport() {
        if ($.browser.msie) {
            var d = $(document).height(),
                w = $(window).height();
            return [window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth, d - w < 20 ? w : d];
        }
        return [$(window).width(), $(document).height()];
    }

    function call(fn) {
        if (fn) {
            return fn.call($.emask);
        }
    }
    var emask, exposed, loaded, config, overlayIndex;
    $.emask = {
        load: function(conf, els) {
            if (loaded) {
                return this;
            }
            if (typeof conf == 'string') {
                conf = {
                    color: conf
                };
            }
            conf = conf || config;
            config = conf = $.extend($.extend({}, tool.conf), conf);
            mask = $("#" + conf.maskId);
            if (!mask.length) {
                mask = $('<div/>').attr("id", conf.maskId);
                $("body").append(mask);
            }
            var size = viewport();
            mask.css({
                position: 'absolute',
                top: 0,
                left: 0,
                width: size[0],
                height: size[1],
                display: 'none',
                opacity: conf.startOpacity,
                zIndex: conf.zIndex
            });
            if (conf.color) {
                mask.css("backgroundColor", conf.color);
            }
            if (call(conf.onBeforeLoad) === false) {
                return this;
            }
            if (conf.closeOnEsc) {
                $(document).bind("keydown.mask", function(e) {
                    if (e.keyCode == 27) {
                        $.emask.close(e);
                    }
                });
            }
            if (conf.closeOnClick) {
                mask.bind("click.mask", function(e) {
                    $.emask.close(e);
                });
            }
            $(window).bind("resize.mask", function() {
                $.emask.fit();
            });
            if (els && els.length) {
                overlayIndex = els.eq(0).css("zIndex");
                $.each(els, function() {
                    var el = $(this);
                    if (!/relative|absolute|fixed/i.test(el.css("position"))) {
                        el.css("position", "relative");
                    }
                });
                exposed = els.css({
                    zIndex: Math.max(conf.zIndex + 1, overlayIndex == 'auto' ? 0 : overlayIndex)
                });
            }
            mask.css({
                display: 'block'
            }).fadeTo(conf.loadSpeed, conf.opacity, function() {
                $.emask.fit();
                call(conf.onLoad);
            });
            loaded = true;
            return this;
        },
        close: function() {
            if (loaded) {
                if (call(config.onBeforeClose) === false) {
                    return this;
                }
                mask.fadeOut(config.closeSpeed, function() {
                    call(config.onClose);
                    if (exposed) {
                        exposed.css({
                            zIndex: overlayIndex
                        });
                    }
                });
                $(document).unbind("keydown.mask");
                mask.unbind("click.mask");
                $(window).unbind("resize.mask");
                loaded = false;
            }
            return this;
        },
        fit: function() {
            if (loaded) {
                var size = viewport();
                mask.css({
                    width: size[0],
                    height: size[1]
                });
            }
        },
        getMask: function() {
            return mask;
        },
        isLoaded: function() {
            return loaded;
        },
        getConf: function() {
            return config;
        },
        getExposed: function() {
            return exposed;
        }
    };
    $.fn.emask = function(conf) {
        $.emask.load(conf);
        return this;
    };
    $.fn.expose = function(conf) {
        $.emask.load(conf, this);
        return this;
    };
})(jQuery);

/* jscripts/019ce.js */

var Buu = (function() {
    var version = '2.14';
    var abCheck = false;
    var theClasses = ["ad-width-728", "ad-windowshade-full", "ad-wings__link", "ad-with-background", "ad-with-us", "ad-wrap", "ad-wrap--leaderboard", "ad-wrapper", "ad-x10x20x30", "ad-x31-full", "ad-zone", "ad-zone-container", "ad-zone-s-q-l", "ad.super", "ad01", "ad02", "ad03", "ad04", "ad08sky", "ad1-left", "ad1-right", "ad10", "ad100", "ad1000", "ad1001", "ad100x100", "ad120", "ad120_600", "ad120x120", "ad120x240GrayBorder", "ad120x240backgroundGray", "ad120x60", "ad120x600", "ad125", "ad125x125", "ad125x125a", "ad125x125b", "ad140", "ad160", "ad160600", "ad160_blk", "ad160_l", "ad160_r", "ad160x160", "ad160x600", "ad160x600GrayBorder"];
    var theIds = ["a1", "ad1", "cntBanner"];
    var theStyles = ["height: 90px", "font-weight: bold; font-family: Arial; font-size: 13px;"];
    var setCookie = function(name, value, minutes_ttl) {
        var exdate = new Date();
        exdate.setMinutes(exdate.getMinutes() + minutes_ttl);
        var c_value = encodeURI(value) + "; expires=" + exdate.toUTCString() + "; path=/";
        document.cookie = name + "=" + c_value;
    };
    var URLToArray = function(url) {
        var request = {};
        var pairs = url.substring(url.indexOf('?') + 1).split('&');
        for (var i = 0; i < pairs.length; i++) {
            if (!pairs[i])
                continue;
            var pair = pairs[i].split('=');
            request[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
        }
        return request;
    };
    var openLink = function(event, dest) {
        if (typeof(event) != "undefined") {
            event.returnValue = false;
            if (event.preventDefault) {
                event.preventDefault();
            }
            event.stopPropagation();
        }
        var url_parts = dest.split('?', 2);
        var parameters = URLToArray(url_parts[1]);
        var f = document.createElement("form");
        f.setAttribute("action", url_parts[0]);
        f.setAttribute("method", "post");
        f.setAttribute("target", "_blank");
        document.getElementsByTagName("body").item(0).appendChild(f);
        for (var i in parameters) {
            var input = document.createElement("input");
            input.setAttribute("type", "hidden");
            input.setAttribute("name", i);
            input.setAttribute("value", parameters[i]);
            f.appendChild(input);
        }
        f.submit();
        document.getElementsByTagName("body").item(0).removeChild(f);
        return false;
    };
    var stylesheet = "{ border: 0px solid #000000; width: %width%px; height: %height%px; display: inline-block; background-color: rgba(0, 0, 0, 0); margin: 0px 0px; padding: 0px 0px; }";
    var ad_types = ['banner', 'popunder'];
    var zone_params = {};
    var dom = {};
    var debug_messages = [];
    var error_messages = [];
    var addDebugMessage = function(message) {
        var date = new Date();
        debug_messages.push(date.toISOString() + ": " + message);
    };
    var addErrorMessage = function(message) {
        var date = new Date();
        error_messages.push(date.toISOString() + ": " + message);
        console.error(message);
    };
    var stringify = function(value) {
        var reassign_when_finished = false;
        if (typeof Array.prototype.toJSON !== 'undefined') {
            reassign_when_finished = true;
            var array_to_json = Array.prototype.toJSON;
            delete Array.prototype.toJSON;
        }
        var val = JSON.stringify(value);
        if (reassign_when_finished) {
            Array.prototype.toJSON = array_to_json;
        }
        return val;
    };
    var randStr = function(length, possibleChars) {
        var text = "";
        var possible = possibleChars || "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < length; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    };
    var createStyle = function(doc, dom_anchor, style_text) {
        var class_name = randStr(1, "abcdefghijklmnopqrstuvwxyz") + randStr(7);
        style_text = "." + class_name + " " + style_text;
        var style = doc.createElement('style');
        style.setAttribute('type', 'text/css');
        style.innerHTML = style_text;
        document.getElementsByTagName("head").item(0).appendChild(style);
        return class_name;
    };
    var loader = {
        cookie_name: "exo_zones",
        addZone: function(params) {
            if (this.abEnabled() === false) {
                return false;
            }
            if (typeof params != 'object' || typeof params.type == 'undefined' || ad_types.indexOf(params.type) == -1) {
                addErrorMessage("addZone() invalid params");
                return false;
            }
            var doc = params.doc || document;
            var scripts = doc.getElementsByTagName('script');
            var here = scripts[scripts.length - 1];
            var type = params.type;
            delete params.type;
            if (typeof zone_params[type] == 'undefined') {
                dom[type] = [];
                zone_params[type] = [];
            }
            zone_params[type].push(params);
            if (type == 'banner') {
                var style_text = stylesheet.replace('%width%', params.width).replace('%height%', params.height);
                var class_name = createStyle(doc, here, style_text);
                var placeholder = doc.createElement('div');
                placeholder.setAttribute('class', class_name);
                here.parentNode.insertBefore(placeholder, here);
                dom[type].push({
                    'placeholder': placeholder,
                    'doc_reference': doc
                });
            }
            addDebugMessage("addZone() " + type + " " + params.idzone + " added");
            return true;
        },
        renderBannerZone: function(id, img_data, dest) {
            var idzone = zone_params['banner'][id]['idzone'];
            addDebugMessage("renderBannerZone() #" + id + " called for zone " + idzone);
            if (typeof dom['banner'][id] == 'undefined' || typeof img_data != 'object' || typeof img_data.img == 'undefined' || typeof img_data.content_type == 'undefined' || typeof dest == 'undefined') {
                addErrorMessage("renderBannerZone() #" + id + " corrupt params for zone " + idzone);
                return false;
            }
            if (typeof dom['banner'][id]["doc_reference"] == 'undefined' || typeof dom['banner'][id]["doc_reference"].body == 'undefined' || !dom['banner'][id]["doc_reference"].body.contains(dom['banner'][id]['placeholder'])) {
                addErrorMessage("renderBannerZone() #" + id + " dom placeholder is not present for zone " + idzone);
                return false;
            }
            if (typeof img_data.file == 'undefined') {
                var style_text = "{ background-image: url('data:" + img_data.content_type + ";base64," + img_data.img + "'); background-repeat: no-repeat; cursor: pointer; }";
            } else {
                var style_text = "{ background-image: url('" + img_data.file + "'); background-repeat: no-repeat; cursor: pointer; }";
            }
            var class_name = createStyle(dom['banner'][id]["doc_reference"], dom['banner'][id]['placeholder'], style_text);
            var current_class = dom['banner'][id]['placeholder'].getAttribute('class');
            dom['banner'][id]['placeholder'].setAttribute('class', current_class + " " + class_name);
            dom['banner'][id]['placeholder'].onclick = (function(dest) {
                return function(event) {
                    openLink(event, dest);
                };
            })(dest);
        },
        renderBannerZones: function(response) {
            addDebugMessage("renderBannerZones() called");
            if (typeof response != 'object' || typeof response.zones != 'object' || typeof response.images != 'object') {
                addDebugMessage("renderBannerZones() empty zones or images");
                return;
            }
            for (var i = 0; i < response.zones.length; i++) {
                if (typeof zone_params['banner'][i] == 'undefined' || typeof zone_params['banner'][i]['idzone'] == 'undefined') {
                    addErrorMessage("renderBannerZones() zone info missing");
                }
                var idzone = zone_params['banner'][i]['idzone'];
                if (response.zones[i] == false) {
                    addDebugMessage("renderBannerZones() nothing to show for zone " + idzone);
                    continue;
                }
                var img_key = response.zones[i].img_key;
                this.renderBannerZone(i, response.images[img_key], response.zones[i].dest);
            }
        },
        serve: function(params) {
            if (this.abEnabled() === false) {
                addDebugMessage("serve() ad blocker not enabledd");
                return false;
            }
            var zones_added = false;
            for (var type_index = 0; type_index < ad_types.length; type_index++) {
                if (typeof zone_params[ad_types[type_index]] !== 'undefined' && zone_params[ad_types[type_index]].length > 0) {
                    zones_added = true;
                    break;
                }
            }
            if (!zones_added) {
                addErrorMessage("serve() called but no zones added");
                return false;
            }
            window.exoNoExternalUI38djdkjDDJsio96 = true;
            addDebugMessage("serve() called");
            setCookie(this.cookie_name, stringify(zone_params), 5);
            var loadDataScript = function() {
                var dataScript = document.createElement("script");
                dataScript.async = true;
                dataScript.setAttribute('type', 'text/javascript');
                dataScript.setAttribute('src', params.script_url);
                dataScript.onload = function() {
                    addDebugMessage("serve() hosted script loaded");
                };
                document.getElementsByTagName("body").item(0).appendChild(dataScript);
            };
            if (!params.force) {
                if (window.addEventListener) {
                    window.addEventListener("load", loadDataScript, false);
                } else if (window.attachEvent) {
                    window.attachEvent("onload", loadDataScript);
                } else {
                    window.onload = loadDataScript;
                }
            } else {
                loadDataScript();
            }
            return true;
        },
        getDebug: function() {
            for (var i = 0; i < debug_messages.length; i++) {
                console.log(debug_messages[i]);
            }
        },
        getVersion: function() {
            return version;
        },
        detectAb: function() {
            $.get('/img/logo.gif', function(data) {
                if (!data || data.status == 0) {
                    abCheck = true;
                }
            });
            $.get('/jscripts/ad_loader.js', function(data) {
                if (!data || data.status == 0) {
                    abCheck = true;
                }
            });
        },
        abEnabled: function() {
            if (typeof exo99HL3903jjdxtrnLoad == "undefined" || exo99HL3903jjdxtrnLoad == false || abCheck) {
                return true;
            }
            var item = theClasses[Math.floor(Math.random() * theClasses.length)];
            var style = theStyles[Math.floor(Math.random() * theStyles.length)];
            var id = theIds[Math.floor(Math.random() * theIds.length)];
            var testTag = $("<div id='" + id + "' class='" + item + "' style='background-image:url(\"data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==\"); height:1px; width: 1px; display:block " + style + "'></div>");
            $("body").append(testTag);
            result = isBlocked(testTag);
            testTag.remove();
            return result;
        }
    };
    loader.detectAb();
    return loader;
})();

function isBlocked(element) {
    if (isVisible(element)) {
        return false;
    }
    if (isHiddenInline(element)) {
        return false;
    }
    var display = element.css("display");
    $(element).css('display', 'block');
    if (!isVisible(element)) {
        return true;
    }
    $(element).css('display', display);
    return false;
}

function isVisible(element) {
    return $(element).is(":visible");
}

function isHiddenInline(element) {
    return $(element).attr('style') != null && $(element).attr('style').indexOf('display: none') >= 0;
}

/* jscripts/gallerificPlus.js */

(function($) {
    document.write("<style type='text/css'>.noscript{display:none}</style>");
    var ver = 'gallerifficPlus0.3';
    var galleryOffset = 0;
    var galleries = [];
    var allImages = [];
    var historyCurrentHash;
    var historyBackStack;
    var historyForwardStack;
    var isFirst = false;
    var dontCheck = false;
    var isInitialized = false;

    function getHash() {
        var hash = location.hash;
        if (!hash) return -1;
        hash = hash.replace(/^.*#/, '');
        if (isNaN(hash)) return -1;
        return (+hash);
    }

    function registerGallery(gallery) {
        galleries.push(gallery);
        galleryOffset += gallery.data.length;
    }

    function getGallery(hash) {
        for (i = 0; i < galleries.length; i++) {
            var gallery = galleries[i];
            if (hash < (gallery.data.length + gallery.offset))
                return gallery;
        }
        return 0;
    }

    function historyCallback() {
        var hash = getHash();
        if (hash < 0) return;
        var gallery = getGallery(hash);
        if (!gallery) return;
        var index = hash - gallery.offset;
        gallery.goto(index);
    }

    function historyInit() {
        if (isInitialized) return;
        isInitialized = true;
        var current_hash = location.hash;
        historyCurrentHash = current_hash;
        if ($.browser.msie) {
            if (historyCurrentHash == '') {
                historyCurrentHash = '#';
            }
        } else if ($.browser.safari) {
            historyBackStack = [];
            historyBackStack.length = history.length;
            historyForwardStack = [];
            isFirst = true;
        }
        setInterval(function() {
            historyCheck();
        }, 100);
    }

    function historyAddHistory(hash) {
        historyBackStack.push(hash);
        historyForwardStack.length = 0;
        isFirst = true;
    }

    function historyCheck() {
        if (0 && $.browser.safari) {
            if (!dontCheck) {
                var historyDelta = history.length - historyBackStack.length;
                if (historyDelta) {
                    isFirst = false;
                    if (historyDelta < 0) {
                        for (var i = 0; i < Math.abs(historyDelta); i++) historyForwardStack.unshift(historyBackStack.pop());
                    } else {
                        for (var i = 0; i < historyDelta; i++) historyBackStack.push(historyForwardStack.shift());
                    }
                    var cachedHash = historyBackStack[historyBackStack.length - 1];
                    if (cachedHash != undefined) {
                        historyCurrentHash = location.hash;
                        historyCallback();
                    }
                } else if (historyBackStack[historyBackStack.length - 1] == undefined && !isFirst) {
                    historyCallback();
                    isFirst = true;
                }
            }
        } else {
            var current_hash = location.hash;
            if (current_hash != historyCurrentHash) {
                historyCurrentHash = current_hash;
                historyCallback();
            }
        }
    }
    var defaults = {
        delay: 3000,
        numThumbs: 8,
        preloadAhead: 0,
        startIndex: 0,
        enableTopPager: true,
        enableBottomPager: true,
        refreshCallback: null,
        imageContainerSel: '',
        thumbsContainerSel: '',
        controlsContainerSel: '',
        titleContainerSel: '',
        viewsContainerSel: '',
        addedContainerSel: '',
        dimensionContainerSel: '',
        votesContainerSel: '',
        votedContainerSel: '',
        fadeSpeed: 0,
        descContainerSel: '',
        downloadLinkSel: '',
        renderSSControls: true,
        renderNavControls: true,
        playLinkText: 'Play',
        pauseLinkText: 'Pause',
        prevLinkText: 'Previous',
        nextLinkText: 'Next',
        nextPageLinkText: 'Next Page &rsaquo;',
        prevPageLinkText: '&lsaquo; Prev Page',
        fullLinkText: 'Full Image',
        autoPlay: true,
        overlayBgColor: '#000',
        overlayOpacity: 0.8,
        fixedNavigation: false,
        imageLoading: '/images/lightbox-ico-loading.gif',
        imageBtnPrev: '/images/lightbox-btn-prev.gif',
        imageBtnNext: '/images/lightbox-btn-next.gif',
        imageBtnClose: '/images/lightbox-btn-close.gif',
        imageBlank: '/images/lightbox-blank.gif',
        containerBorderSize: 0,
        containerResizeSpeed: 0,
        txtImage: 'Image',
        txtOf: 'of',
        keyToClose: '',
        keyToPrev: '',
        keyToNext: '',
        keyToSlideShow: 'p',
        imageArray: [],
        activeImage: 0,
        galleryKeyboardNav: true
    };

    function _enable_keyboard_navigation() {
        $(document).keydown(function(objEvent) {
            return _keyboard_action(objEvent);
        });
    }

    function _disable_keyboard_navigation() {
        $(document).unbind();
    }

    function _keyboard_action(objEvent) {
        if ((document.activeElement != 'undefined' && (typeof document.activeElement.tagName != 'undefined' && (document.activeElement.tagName == "TEXTAREA" || document.activeElement.tagName == "INPUT")) || (typeof document.activeElement.nodeName != 'undefined' && (document.activeElement.nodeName == "TEXTAREA" || document.activeElement.nodeName == "INPUT"))))
            return true;
        var isAlt = false;
        if (objEvent == null) {
            keycode = event.keyCode;
            escapeKey = 27;
            isAlt = event.altKey;
        } else {
            keycode = objEvent.keyCode;
            escapeKey = objEvent.DOM_VK_ESCAPE;
            isAlt = objEvent.altKey;
        }
        key = String.fromCharCode(keycode).toLowerCase();
        if ((key == defaults.keyToPrev) || (keycode == 37 && !isAlt)) {
            if (defaults.activeImage != 0) {
                defaults.activeImage = defaults.activeImage - 1;
                changeThumbnail(defaults.activeImage);
            }
            return false;
        }
        if ((key == defaults.keyToNext) || (keycode == 39 && !isAlt)) {
            if (defaults.activeImage != (galleries[0].data.length - 1)) {
                defaults.activeImage = defaults.activeImage + 1;
                changeThumbnail(defaults.activeImage);
            }
            return false;
        }
        if (key == defaults.keyToSlideShow)
            _gallery.toggleSlideshow();
        return true;
    }

    function changeThumbnail(activeImg) {
        location.href = '#' + activeImg;
    }

    function clickHandler(gallery) {
        gallery.pause();
        return false;
    }
    $.fn.galleriffic = function(thumbsContainerSel, settings) {
        $.extend(this, {
            ver: function() {
                return ver;
            },
            buildDataFromThumbs: function() {
                this.data = [];
                var gallery = this;
                var totalImages = $(thumbsContainerSel).attr('data-total');
                var idx = $(thumbsContainerSel).attr('data-idx');
                var offset = idx % this.settings.numThumbs;
                var startIndex = this.settings.startIndex;
                console.log("totalImages: " + totalImages);
                console.log("numThumbs: " + this.settings.numThumbs);
                console.log("idx: " + idx);
                console.log("offset: " + offset);
                console.log("startIndex: " + startIndex);
                for (var j = 0; j < startIndex - offset; j++) {
                //for (var j = 0; j < totalImages; j++) {
                    gallery.data.push({
                        lazyLoad: true,
                        loadDirection: 'back',
                        dimension: 'x',
                        xdel: 0,
                        hash: gallery.offset + j
                    });
                }
                this.$thumbsContainer.find('li').each(function(i) {
                    var $a = $(this).find('a');
                    var $img = $a.find('img:first');
                    gallery.data.push({
                        lazyLoad: false,
                        slide: $a.attr('href'),
                        framed: $a.attr('framed'),
                        thumb: $img.attr('src2'),
                        original: $a.attr('original'),
                        xdel: $a.attr('xdel'),
                        title: $a.attr('title'),
                        imageid: $a.attr('imageid'),
                        views: $a.attr('views'),
                        added: $a.attr('added'),
                        dimension: $a.attr('dimension'),
                        votes: $a.attr('votes'),
                        galleryid: $a.attr('galleryid'),
                        gallery_title: $a.attr('gallery_title'),
                        ownerid: $a.attr('ownerid'),
                        username: $a.attr('username'),
                        avatar: $a.attr('avatar'),
                        description: $a.attr('description'),
                        hash: startIndex + i - offset
                    });
                });
				console.log(gallery.data);
                for (var j = gallery.data.length; j < totalImages; j++) {
                    gallery.data.push({
                        lazyLoad: true,
                        loadDirection: 'forth',
                        dimension: 'x',
                        xdel: 0,
                        hash: gallery.offset + j
                    });
                }
                return this;
            },
            isPreloadComplete: false,
            preloadInit: function() {
                if (this.settings.preloadAhead == 0) return this;
                this.preloadStartIndex = this.currentIndex;
                var nextIndex = this.getNextIndex(this.preloadStartIndex);
                return this.preloadRecursive(this.preloadStartIndex, nextIndex);
            },
            preloadRelocate: function(index) {
                this.preloadStartIndex = index;
                return this;
            },
            preloadRecursive: function(startIndex, currentIndex) {
                if (startIndex != this.preloadStartIndex) {
                    var nextIndex = this.getNextIndex(this.preloadStartIndex);
                    return this.preloadRecursive(this.preloadStartIndex, nextIndex);
                }
                var gallery = this;
                var preloadCount = currentIndex - startIndex;
                if (preloadCount < 0)
                    preloadCount = this.data.length - 1 - startIndex + currentIndex;
                if (this.settings.preloadAhead >= 0 && preloadCount > this.settings.preloadAhead) {
                    setTimeout(function() {
                        gallery.preloadRecursive(startIndex, currentIndex);
                    }, 500);
                    return this;
                }
                var imageData = this.data[currentIndex];
                if (imageData.$image)
                    return this.preloadNext(startIndex, currentIndex);
                var image = new Image();
                image.onload = function() {
                    imageData.$image = this;
                    gallery.preloadNext(startIndex, currentIndex);
                };
                image.alt = imageData.title;
                image.src = imageData.slide;
                if (imageData.dimension != "x") {
                    var size = imageData.dimension.split("x");
                    size = imgScale(size[0], size[1], true, docWidth, _getInnerHeight());
                    image.width = size[0];
                    image.height = size[1];
                    image.scaled = size[0] + "x" + size[1] != imageData.dimension ? 1 : 0;
                }
                return this;
            },
            preloadNext: function(startIndex, currentIndex) {
                var nextIndex = this.getNextIndex(currentIndex);
                if (nextIndex == startIndex) {
                    this.isPreloadComplete = true;
                } else {
                    var gallery = this;
                    setTimeout(function() {
                        gallery.preloadRecursive(startIndex, nextIndex);
                    }, 100);
                }
                return this;
            },
            getNextIndex: function(index) {
                var nextIndex = index + 1;
                if (nextIndex >= this.data.length)
                    nextIndex = 0;
                return nextIndex;
            },
            getPrevIndex: function(index) {
                var prevIndex = index - 1;
                if (prevIndex < 0)
                    prevIndex = this.data.length - 1;
                return prevIndex;
            },
            pause: function() {
                if (this.interval)
                    this.toggleSlideshow();
                return this;
            },
            play: function() {
                if (!this.interval)
                    this.toggleSlideshow();
                return this;
            },
            toggleSlideshow: function() {
                if (this.interval) {
                    clearInterval(this.interval);
                    this.interval = 0;
                    if (this.$controlsContainer) {
                        this.$controlsContainer.find('div.ss-controls span').removeClass().addClass('play').attr('title', this.settings.playLinkText).html(this.settings.playLinkText);
                    }
                } else {
                    this.ssAdvance();
                    var gallery = this;
                    this.interval = setInterval(function() {
                        gallery.ssAdvance();
                    }, this.settings.delay);
                    if (this.$controlsContainer) {
                        this.$controlsContainer.find('div.ss-controls span').removeClass().addClass('pause').attr('title', this.settings.pauseLinkText).html(this.settings.pauseLinkText);
                    }
                }
                return this;
            },
            ssAdvance: function() {
                var nextIndex = this.getNextIndex(this.currentIndex);
                if (this.data[nextIndex].$image) {
                    _dbg("next image loaded");
                    var nextHash = this.data[nextIndex].hash;
                    location.href = '#' + nextHash;
                    if ($.browser.msie) {
                        this.goto(nextIndex);
                    }
                } else {
                    _dbg("next image not loaded .. waiting");
                }
                return this;
            },
            goto: function(index) {
                defaults.activeImage = index;
                if (index < 0) index = 0;
                else if (index >= this.data.length) index = this.data.length - 1;
                this.currentIndex = index;
                imgReset(true);
                this.preloadRelocate(index);
                this.refresh();
                if ((this.data[this.currentIndex].xdel != "0") && $('#al_input').val() != "") {
                    $('#adelimg').show();
                } else {
                    $('#adelimg').hide();
                }
            },
            refresh: function() {
                if (this.$imageContainer) {
                    var lazyLoad = this.data[this.currentIndex].lazyLoad;
                    if (lazyLoad) {
                        if (typeof _gallery == 'undefined')
                            _gallery = this;
                        _lazyLoad(this.currentIndex, this.data[this.currentIndex].loadDirection, this, this.addImage);
                    } else {
                        this.addImage(this);
                    }
                } else {
                    this.syncThumbs();
                }
            },
            addImage: function(gallery) {
                var imageData = gallery.data[gallery.currentIndex];
                var isFading = 1;
                imageLoc = imageData.imageid;
                gallery.$imageContainer.find('a').html("");
                isFading = 0;
                if (gallery.$controlsContainer) {
                    gallery.$controlsContainer.find('div.nav-controls a.prev').attr('href', '#' + gallery.data[gallery.getPrevIndex(gallery.currentIndex)].hash).end().find('div.nav-controls a.next').attr('href', '#' + gallery.data[gallery.getNextIndex(gallery.currentIndex)].hash);
                }
                if (gallery.$titleContainer)
                    gallery.$titleContainer.empty().html(imageData.title);
                if (gallery.$viewsContainer)
                    gallery.$viewsContainer.empty().html(imageData.views);
                if (gallery.$addedContainer)
                    gallery.$addedContainer.empty().html(imageData.added);
                if (gallery.$dimensionContainer)
                    gallery.$dimensionContainer.empty().html(imageData.dimension == "x" ? "Unknown" : imageData.dimension);
                if (gallery.$votesContainer) {
                    var rate = 0;
                    if (typeof imageData.votes != 'undefined' && imageData.votes != "|") {
                        var data = imageData.votes.split("|");
                        rate = parseFloat(data[0] / data[1]).toFixed(1);
                    }
                    gman.bindRate(rate);
                    if (typeof data != 'undefined')
                        data[1] = parseInt(data[1]);
                    else
                        var data = [0, 0];
                    gallery.$votedContainer.html((data[1] == 0 ? "no" : data[1]) + " vote" + (data[1] > 1 || data[1] == 0 ? "s" : ""));
                }
                if (gallery.$descContainer) {
                    if ($.trim(imageData.description) != "")
                        gallery.$descContainer.empty().html(imageData.description).show();
                    else
                        gallery.$descContainer.empty().hide();
                }
                if (gallery.$downloadLink)
                    gallery.$downloadLink.attr('href', imageData.original);
                if (imageData.$image) {
                    imgReset(true);
                }
                if (gallery.onFadeOut) gallery.onFadeOut();
                if (!imageData.$image) {
                    var image = new Image();
                    image.onload = function() {
                        imageData.$image = this;
                        if (imageData.dimension != "x") {
                            var size = imageData.dimension.split("x");
                            size = imgScale(size[0], size[1], true, docWidth, _getInnerHeight());
                            imageData.$image.width = size[0];
                            imageData.$image.height = size[1];
                            imageData.$image.scaled = size[0] + "x" + size[1] != imageData.dimension ? 1 : 0;
                        }
                        imgReset(true);
                        if (gallery.settings.refreshCallback != null)
                            gallery.settings.refreshCallback(imageData);
                    };
                    image.alt = imageData.title;
                    image.src = imageData.slide;
                    if (imageData.dimension != "x") {
                        var size = imageData.dimension.split("x");
                        size = imgScale(size[0], size[1], true, docWidth, _getInnerHeight());
                        image.width = size[0];
                        image.height = size[1];
                        image.scaled = size[0] + "x" + size[1] != imageData.dimension ? 1 : 0;
                    }
                    gallery.$imageContainer.html("<div style='background:url(/images/lightbox-ico-loading.gif) 50% 0 no-repeat;'><img src='" + image.src + "'" + (imageData.dimension != "x" ? " style='width:" + image.width + "px;height:" + image.height + "px;'" : "") + "></div>");
                } else {
                    if (gallery.settings.refreshCallback != null)
                        gallery.settings.refreshCallback(imageData);
                }
                gallery.relocatePreload = true;
                gallery.syncThumbs();
            },
            buildImage: function(image) {
                if (this.$imageContainer) {
                    this.$imageContainer.empty();
                    var gallery = this;
                    var thisImageIndex = this.currentIndex;
                    this.$imageContainer.append('<center><div class="image-wrapper" style="height:' + image.height + 'px;width:' + image.width + 'px"><span class="advance-link" rel="history" title="' + image.alt + '"></span></div><div class="image-description"></div></center>').find('span').append(image).click(function() {
                        imgFullSize();
                    }).end().fadeIn(gallery.settings.fadeSpeed);
                    if (this.onFadeIn) this.onFadeIn();
                } else {
                    _dbg("No container");
                }
                return this;
            },
            syncThumbs: function() {
                if (this.$thumbsContainer) {
                    var page = Math.floor(this.currentIndex / this.settings.numThumbs);
                    if (page != this.currentPage) {
                        this.currentPage = page;
                        this.updateThumbs();
                    } else {
                        var selectedThumb = this.currentIndex % this.settings.numThumbs;
                        this.$thumbsContainer.find('ul.thumbs li.selected').removeClass('selected').end().find('ul.thumbs li').eq(selectedThumb).addClass('selected');
                    }
                }
                return this;
            },
            updateThumbs: function() {
                if (this.$thumbsContainer) {
                    if (this.currentPage < 0)
                        this.currentPage = 0;
                    var startIndex = this.currentPage * this.settings.numThumbs;
                    var stopIndex = startIndex + this.settings.numThumbs - 1;
                    if (stopIndex >= this.data.length)
                        stopIndex = this.data.length - 1;
                    var needsPagination = this.data.length > this.settings.numThumbs;
                    this.$thumbsContainer.empty();
                    this.$thumbsContainer.append('<div class="top pagination"></div>');
                    if (needsPagination && this.settings.enableTopPager) {
                        this.buildPager(this.$thumbsContainer.find('div.top'));
                    }
                    var $ulThumbs = this.$thumbsContainer.append('<ul class="thumbs"></ul>').find('ul.thumbs');
                    for (i = startIndex; i <= stopIndex; i++) {
                        var selected = '';
                        if (i == this.currentIndex)
                            selected = ' class="selected"';
                        var imageData = this.data[i];
                        $ulThumbs.append('<li' + selected + '><a class="expp" rel="history" href="#' + imageData.hash + '" title="' + imageData.title + '"><img src="' + imageData.thumb + '" alt="' + imageData.title + '" /></a></li>');
                    }
                    if (needsPagination && this.settings.enableBottomPager) {
                        this.$thumbsContainer.append('<div class="bottom pagination"></div>');
                        this.buildPager(this.$thumbsContainer.find('div.bottom'));
                    }
                    var gallery = this;
                    this.$thumbsContainer.find('a[rel="history"]').click(function() {
                        clickHandler(gallery);
                    });
                }
                return this;
            },
            buildPager: function(pager) {
				console.log("Current Page", this.currentPage);
                var startIndex = this.currentPage * this.settings.numThumbs;
                if (this.currentPage > 0) {
                    var prevPage = startIndex - this.settings.numThumbs;
                    pager.append('<a class="prev" rel="history" href="#' + this.data[prevPage].hash + '" title="' + this.settings.prevPageLinkText + '"><img src="/img/PreviousPage.gif" border=0 alt="' + this.settings.prevPageLinkText + '"></a>');
                }
                for (i = this.currentPage - 3; i <= this.currentPage + 3; i++) {
                    var pageNum = i + 1;
                    if (i == this.currentPage)
                        pager.append('<strong class="page current">' + pageNum + '</strong>');
                    else {
                        var imageIndex = i * this.settings.numThumbs;
                        if (i >= 0 && i < this.numPages) {
                            pager.append('<a class="page" rel="history" href="#' + this.data[imageIndex].hash + '" title="' + pageNum + '">' + pageNum + '</a>');
                        }
                    }
                }
                var nextPage = startIndex + this.settings.numThumbs;
				console.log("Next Page", nextPage);
                if (nextPage < this.data.length) {
                    pager.append('<a class="next" rel="history" href="#' + this.data[nextPage].hash + '" title="' + this.settings.nextPageLinkText + '"><img src="/img/NextPage.gif" border=0 alt="' + this.settings.nextPageLinkText + '"></a>');
                }
                return this;
            }
        });
        this.settings = $.extend({}, defaults, settings);
        if (this.settings.galleryKeyboardNav)
            _enable_keyboard_navigation();
        if (this.interval)
            clearInterval(this.interval);
        this.interval = 0;
        if (this.settings.imageContainerSel) this.$imageContainer = $(this.settings.imageContainerSel);
        if (this.settings.thumbsContainerSel) this.$thumbsContainer = $(this.settings.thumbsContainerSel);
        if (this.settings.titleContainerSel) this.$titleContainer = $(this.settings.titleContainerSel);
        if (this.settings.viewsContainerSel) this.$viewsContainer = $(this.settings.viewsContainerSel);
        if (this.settings.addedContainerSel) this.$addedContainer = $(this.settings.addedContainerSel);
        if (this.settings.dimensionContainerSel) this.$dimensionContainer = $(this.settings.dimensionContainerSel);
        if (this.settings.votesContainerSel) this.$votesContainer = $(this.settings.votesContainerSel);
        if (this.settings.votedContainerSel) this.$votedContainer = $(this.settings.votedContainerSel);
        if (this.settings.descContainerSel) this.$descContainer = $(this.settings.descContainerSel);
        if (this.settings.downloadLinkSel) this.$downloadLink = $(this.settings.downloadLinkSel);
        this.offset = galleryOffset;
        if (thumbsContainerSel instanceof Array) {
            this.data = thumbsContainerSel;
        } else {
            this.$thumbsContainer = $(thumbsContainerSel);
            this.buildDataFromThumbs();
        }
        registerGallery(this);
        this.numPages = Math.ceil(this.data.length / this.settings.numThumbs);
        this.currentPage = -1;
        this.currentIndex = 0;
        var gallery = this;
        if (this.settings.controlsContainerSel) {
            this.$controlsContainer = $(this.settings.controlsContainerSel).empty();
            if (this.settings.renderSSControls) {
                this.$controlsContainer.append('<div class="ss-controls"><span class="play" title="' + this.settings.playLinkText + '">' + this.settings.playLinkText + '</span></div>').find('div.ss-controls span').click(function() {
                    gallery.toggleSlideshow();
                });
            }
            if (this.settings.renderNavControls) {
                this.$controlsContainer.append('<div class="nav-controls"><a class="prev" rel="history" title="' + this.settings.prevLinkText + '"><img src="/img/icon_previous.gif" border=0 alt="' + this.settings.prevLinkText + '"></a><a class="next" rel="history" title="Next"><img src="/img/icon_next.gif" border=0 alt="' + this.settings.nextLinkText + '"></a></div>').find('a[rel="history"]').click(function() {
                    clickHandler(gallery);
                });
            }
        }
        historyInit();
        var hash = getHash();
        var hashGallery = (hash >= 0) ? getGallery(hash) : 0;
        var gotoIndex = (hashGallery && this == hashGallery) ? (hash - this.offset) : this.settings.startIndex;
        this.goto(gotoIndex);
        setTimeout(function() {
            gallery.preloadInit();
        }, 1000);
        if (this.settings.autoPlay)
            gallery.play();
        return this;
    };
})(jQuery);

/* jscripts/gallery.js */

var _is_premium = 0,
    _is_permissive = 0,
    _is_playlist = 0,
    _pics = 0,
    _start_img, _gallery, _real_size, _resized, _is_full_size, docHeight, docWidth, updDocSize = function() {
        docHeight = typeof window.innerHeight != 'undefined' ? window.innerHeight : document.body.clientHeight;
        docWidth = Math.max(window.innerWidth ? window.innerWidth : document.body.clientWidth, 950);
    },
    loadFavoritesPage = function(gid, page) {
        jQuery.get("/gallery_display_favorites.php?gid=" + gid + "&page=" + page, function(r) {
            jQuery("div#galleryUsersFavorites").html(r);
        });
        return false;
    },
    resizeImageProportionally = function(img) {
        img = jQuery(img);
        var s = ScaleSize(100, 100, img.width(), img.height());
        s = ScaleSize(100, 100, s.width, s.height);
        img.css({
            "width": s.width + "px",
            "height": s.height + "px"
        }).fadeIn("medium");
    },
    load_favorites_folders = function(gid, type) {
        var cont = jQuery("div#favorites_container").html("&nbsp;").addClass("ajaxloadercenter");
        jQuery.get("/gallery_add_favorites.php?gid=" + gid + "&type=" + type, function(r) {
            cont.removeClass("ajaxloadercenter").html(r);
        });
        return false;
    },
    addToFavorites = function(gid, type) {
        var mapid = jQuery("select#user_favorite_maps").val();
        var cont = jQuery("div#favorites_container");
        if (mapid == 0) {
            var map = jQuery("input#new_folder_name").val();
            if ($.trim(map) != "") {
                jQuery.get("/gallery_add_favorites.php?gid=" + gid + "&name=" + encodeURIComponent(map) + "&type=" + type, function(r) {
                    switch (parseInt(r)) {
                        case 502:
                            alert("Duplicated folder name.");
                            break;
                        default:
                            cont.html((type == "image" ? "Image" : "Gallery") + " added to <a href='/favoritesmap.php?mid=" + r + "' target='_blank'>your favorites</a>.");
                    }
                });
            } else {
                alert("Folder name cannot be empty.");
            }
        } else {
            jQuery.get("/gallery_add_favorites.php?gid=" + gid + "&folder=" + mapid + "&type=" + type, function(r) {
                switch (parseInt(r)) {
                    case 502:
                        alert("This gallery already exists on the folder.");
                        break;
                    default:
                        cont.html((type == "image" ? "Image" : "Gallery") + " added to <a href='/favoritesmap.php?mid=" + r + "' target='_blank'>your favorites</a>.");
                }
            });
        }
        return false;
    },
    toggleNewFolderField = function() {
        var mapid = jQuery("select#user_favorite_maps").val();
        if (mapid == 0) {
            jQuery("#new_favorite_container").show();
        } else {
            jQuery("#new_favorite_container").hide();
        }
    },
    legacyResize = function() {
        $("#mainPhoto").show();
        if (typeof _resized == 'undefined') {
            _resized = imgScale($("#mainPhoto").attr("width"), $("#mainPhoto").attr("height"), true, docWidth, _getInnerHeight());
        }
        if (typeof _real_size == 'undefined') {
            _real_size = [$("#mainPhoto").attr("width"), $("#mainPhoto").attr("height")];
        }
        if (_resized[0] != _real_size[0] || _resized[1] != _real_size[1]) {
            $("#mainPhoto").attr("width", _resized[0]);
            $("#mainPhoto").attr("height", _resized[1]);
            _is_full_size = false;
            $("#mainPhoto").click(function() {
                if (!_is_full_size) {
                    $("#mainPhoto").attr("width", _real_size[0]);
                    $("#mainPhoto").attr("height", _real_size[1]);
                    _is_full_size = true;
                } else {
                    $("#mainPhoto").attr("width", _resized[0]);
                    $("#mainPhoto").attr("height", _resized[1]);
                    _is_full_size = false;
                }
            });
        }
    },
    imgFullSize = function() {
        var image = _gallery.data[_gallery.currentIndex].$image;
        if (image.resized == 1) {
            imgReset();
        } else {
            image.resized = 1;
            var x = $(".image-wrapper").find("img");
            $(".image-wrapper").attr("style", "");
            x.removeAttr("height").removeAttr("width");
        }
        return false;
    },
    imgReset = function(force) {
        if (typeof _gallery == 'undefined') {
            return;
        }
        if (typeof force == 'undefined')
            force = false;
        var image = _gallery.data[_gallery.currentIndex].$image,
            size = _gallery.data[_gallery.currentIndex].dimension.split("x");
        w = parseInt(size[0]);
        h = parseInt(size[1]);
        if (w > 700) {
            h = h * (700 / w);
            w = 700;
        }
        if (typeof image != 'undefined') {
            if (image.resized == 1 || force) {
                if (_gallery.data[_gallery.currentIndex].dimension != "x") {
                    size = imgScale(size[0], size[1], true, docWidth, _getInnerHeight());
                    image.resized = 0;
                    image.width = w;
                    image.height = h;
                }
                _gallery.buildImage(image);
            }
        }
    },
    imgScale = function(width, height, compensate, defWidth, defHeight) {
        var newWidth = orig_width = width;
        var newHeight = orig_height = height;
        if (typeof compensate == 'undefined')
            compensate = true;
        if (newHeight == 0 || newWidth == 0)
            return;
        newHeight = typeof defHeight != 'undefined' ? defHeight : docHeight;
        newWidth = typeof defWidth != 'undefined' ? defWidth : docWidth;
        if (compensate)
            newWidth -= 270;
        if (newWidth < 200)
            newWidth = 200;
        if (newHeight < 200)
            newHeight = 200;
        if (newWidth > orig_width)
            newWidth = orig_width;
        if (newHeight > orig_height)
            newHeight = orig_height;
        var w = orig_width;
        var h = orig_height;
        if (w > 700) {
            h = h * (700 / w);
            w = 700;
        }
        return [w, h];
    },
    _lazyLoad = function(index, direction, gallery, callback) {
        var imageid, gid, startIndex, currentIndex, endIndex, max = _gallery.data.length;
        gid = $("input[id=galleryid_input]").val();
        if (direction === 'forth') {
            imageid = _gallery.data[index - 1].imageid;
            startIndex = index - (index % 8);
        } else {
            startIndex = index - 16 - (index % 8);
            if (startIndex < 0)
                startIndex = 0;
        }
        if (typeof imageid == 'undefined')
            imageid = $('#imageid_input').val();
        endIndex = startIndex + 23;
        currentIndex = startIndex;
        if (endIndex > max)
            endIndex = max;
        $.ajax({
            url: '/photo/' + imageid + '/',
            type: "GET",
            data: "gid=" + gid + '&idx=' + startIndex + '&partial=true',
            dataType: 'html',
            cache: true,
            async: true,
            success: function(result) {
                var $html = $(result);
                $html.find('li').each(function(i) {
                    var $a = $(this).find('a');
                    var $img = $a.find('img:first');
                    if (currentIndex <= endIndex) {
                        _gallery.data[currentIndex] = {
                            lazyLoad: false,
                            slide: $a.attr('href'),
                            thumb: $img.attr('src2'),
                            original: $a.attr('original'),
                            framed: $a.attr('framed'),
                            xdel: $a.attr('xdel'),
                            title: $a.attr('title'),
                            imageid: $a.attr('imageid'),
                            views: $a.attr('views'),
                            added: $a.attr('added'),
                            dimension: $a.attr('dimension'),
                            votes: $a.attr('votes'),
                            galleryid: $a.attr('galleryid'),
                            gallery_title: $a.attr('gallery_title'),
                            ownerid: $a.attr('ownerid'),
                            username: $a.attr('username'),
                            avatar: $a.attr('avatar'),
                            description: $a.attr('description'),
                            hash: currentIndex
                        };
                        currentIndex++;
                    }
                });
                callback(gallery);
            }
        });
    },
    _getInnerHeight = function() {
        var r = (typeof window.innerHeight != 'undefined' ? window.innerHeight : document.body.clientHeight) - 50;
        return r;
    },
    gman = {
        bindRate: function(rate) {
            var rate_html = "",
                ratings = ["Awful", "Poor", "Regular", "Good", "Great"],
                $this = this;
            rate = Math.ceil(rate);
            for (var i = 1; i <= 5; i++)
                rate_html += "<input type='radio' name='__GALLERY__VOTE__' class='star'" + (rate == i ? " checked='checked'" : "") + " value='" + i + "' title='" + ratings[i - 1] + "'>";
            $('#img_votes').html(rate_html);
            $('#img_votes > .star').rating({
                callback: function(rating, link) {
                    $.ajax({
                        url: "/ajax_rating.php",
                        data: "gid=" + $("input[id=galleryid_input]").val() + "&imgid=" + $("input[id=imageid_input]").val() + "&rating=" + rating,
                        type: "POST",
                        dataType: "html",
                        async: true,
                        timeout: 12000000,
                        scriptCharset: "UTF-8",
                        beforeSend: function() {
                            $(".vote_loading").show();
                        },
                        complete: function() {
                            $(".vote_loading").hide();
                        },
                        success: function(r, s) {
                            switch (parseInt(r)) {
                                case 504:
                                    alert("You're not logged in, redirecting to login page...");
                                    _redirect("/login.php?backurl=" + document.location.href.replace(/#/g, "@@@"));
                                    break;
                                case 500:
                                case 503:
                                    alert("Invalid inputs");
                                    break;
                                case 200:
                                    alert("You already rated this picture");
                                    var rate = _gallery.data[_gallery.currentIndex].votes.split("|");
                                    $this.bindRate(parseFloat(rate[0] / rate[1]));
                                    break;
                                default:
                                    if (r.indexOf("|") != -1) {
                                        var rate = r.split("|");
                                        $this.bindRate(parseFloat(rate[0] / rate[1]));
                                        $("#img_voted").html((parseInt(rate[1]) == 0 ? "no" : rate[1]) + " vote" + (parseInt(rate[1]) > 1 || parseInt(rate[1]) == 0 ? "s" : ""));
                                        if (typeof _gallery != 'undefined')
                                            _gallery.data[_gallery.currentIndex].votes = r;
                                    }
                            }
                        }
                    });
                }
            });
        },
        getData: function() {
            return "ajax=1&pgid=" + $("#gal_pgid").val() + "&gid=" + $("#gal_gid").val() + "&page=" + $("#gal_page").val() + "&edit=1";
        },
        getURL: function() {
            return "/pictures/" + $("#gal_gid").val() + "/";
        },
        title: {
            show: function() {
                $("#title_edit").show();
            },
            save: function() {
                if ($("#title_text").val() == "") {
                    alert("Please fill up a gallery title before saving.");
                    return false;
                }
                $.ajax({
                    url: gman.getURL(),
                    type: "POST",
                    data: "title_text=" + $("#title_text").val() + "&" + gman.getData(),
                    dataType: 'html',
                    cache: true,
                    async: true,
                    timeout: 12000000,
                    scriptCharset: "UTF-8",
                    beforeSend: function() {
                        $("#title_saved").hide();
                        $("#title_ld").show();
                    },
                    complete: function() {
                        $("#title_ld").hide();
                        $("#title_saved").show();
                    }
                });
            }
        },
        img: {
            show: function(id) {
                $("#img_ed_" + id).show();
            },
            hide: function(id, delay) {
                if (typeof delay == 'undefined') delay = 200;
                $("#img_ed_" + id).hide(delay);
                $("#img_ed_" + id + "_lnk").show();
            },
            save: function(id) {
                if ($("#img_text_" + id).val() == "") {
                    alert("Please fill up a description before saving.");
                    return false;
                }
                var $this = this;
                $.ajax({
                    url: gman.getURL(),
                    type: "POST",
                    data: "desc_text=" + $("#img_text_" + id).val() + "&imgid=" + id + "&" + gman.getData(),
                    dataType: 'html',
                    cache: true,
                    async: true,
                    timeout: 12000000,
                    scriptCharset: "UTF-8",
                    beforeSend: function() {
                        $("#img_" + id + "_saved").hide();
                        $("#img_" + id + "_ld").show();
                    },
                    success: function(r, s) {
                        $("#img_" + id + "_ld").hide();
                        $("#img_" + id + "_saved").show();
                        $("#img_" + id + "_desc").html(r);
                        setTimeout(function() {
                            $this.hide(id, 500);
                        }, 2000);
                    }
                });
            }
        },
        description: {
            show: function() {
                $("#gal_desc").show();
            },
            hide: function(delay) {
                if (typeof delay == 'undefined') delay = 200;
                $("#gal_desc").hide(delay);
                $("#gal_edit_lnk").show();
            },
            save: function() {
                if ($("#gdesc_text").val() == "") {
                    alert("Please fill up a description before saving.");
                    return false;
                }
                var $this = this;
                $.ajax({
                    url: gman.getURL(),
                    type: "POST",
                    data: "gdesc_text=" + $("#gdesc_text").val() + "&" + gman.getData(),
                    dataType: 'html',
                    cache: true,
                    async: true,
                    timeout: 12000000,
                    scriptCharset: "UTF-8",
                    beforeSend: function() {
                        $("#gal_desc_saved").hide();
                        $("#gal_desc_ld").show();
                    },
                    success: function(r, s) {
                        $("#gal_desc_ld").hide();
                        $("#gal_desc_saved").show();
                        $("#cnt_description").html('<center><BR><table><tr><td width="650" style="border: solid 1px #999999;" bgcolor="#FCFFE0"><font face=verdana><span style="font-size:9px;">' + r + '</span></font></td></tr></table></center>');
                        setTimeout(function() {
                            $this.hide(500);
                        }, 2000);
                    }
                });
            }
        },
        tags: {
            show: function() {
                $("#gal_tags").show();
            },
            hide: function(delay) {
                if (typeof delay == 'undefined') delay = 200;
                $("#gal_tags").hide(delay);
                $("#gal_tags_lnk").show();
            },
            save: function() {
                if ($("#gdesc_tags").val() == "") {
                    alert("Please write at least one tag before saving.");
                    return false;
                }
                var $this = this;
                $.ajax({
                    url: gman.getURL(),
                    type: "POST",
                    data: "tags_text=" + $("#tags_text").val() + "&" + gman.getData(),
                    dataType: 'json',
                    cache: true,
                    async: true,
                    timeout: 12000000,
                    scriptCharset: "UTF-8",
                    beforeSend: function() {
                        $("#gal_tags_saved").hide();
                        $("#gal_tags_ld").show();
                    },
                    success: function(r, s) {
                        $("#gal_tags_ld").hide();
                        $("#gal_tags_saved").show();
                        $("#tags_text").val(r.valid);
                        $("#cnt_tags").html(r.html);
                        setTimeout(function() {
                            $this.hide(500);
                        }, 2000);
                    }
                });
            }
        }
    };
$(window).resize(function() {
    updDocSize();
});
$(document).ready(function() {
    updDocSize();
    if ($("#is_empty").length > 0) {
        $("#slideshow").html("");
        $("#navigation").html("This gallery is empty.");
        return;
    }
    $('i.likeBtn').click(function() {
        var t = $(this);
        var url = '/ajax/actions.php?action=like&i=' + t.attr('data-image') +
            '&g=' + t.attr('data-gallery') +
            '&o=' + t.attr('data-owner') +
            '&v=' + t.attr('data-token');
        $.ajax({
            url: url,
            type: "POST"
        });
        $('i').parent().html('You liked this picture.');
    });
    if (_is_premium || _is_permissive) {
        _gallery = $('#gallery').galleriffic('#navigation', {
            delay: 3000,
            numThumbs: 8,
            preloadAhead: 0,
            startIndex: _start_img,
            imageContainerSel: '#slideshow',
            controlsContainerSel: '#controls',
            titleContainerSel: '#img_filename',
            viewsContainerSel: '#img_views',
            addedContainerSel: '#img_added',
            dimensionContainerSel: '#img_dimension',
            votesContainerSel: '#img_votes',
            votedContainerSel: '#img_voted',
            descContainerSel: '#img_description',
            containerBorderSize: 0,
            fixedNavigation: true,
            galleryKeyboardNav: true,
            autoPlay: false,
            renderNavControls: true,
            renderSSControls: _is_premium,
            refreshCallback: function(imageData) {
                $("#img_link_html").val("<a target='_blank' href='https://www.imagefap.com/photo/" + imageData.imageid + "'><img src='" + imageData.framed + "' border='0'/></a>");
                $("#img_link_forum").val("[URL=https://www.imagefap.com/photo/" + imageData.imageid + "][IMG]" + imageData.framed + "[/IMG][/URL]");
                $("#img_link_im").val("https://www.imagefap.com/photo/" + imageData.imageid);
                var loadCommentsAjax = true;
                if ($('#related_cont').length > 0 || $('#webai_cont').length > 0) {
                    loadCommentsAjax = false;
                    comment.clean();
                    $.get('/ajax/image_related.php?id=' + imageData.imageid, function(r) {
                        if (typeof r.related != 'undefined' && $('#related_cont').length > 0)
                            $('#related_cont').html(r.related);
                        if (typeof r.webai != 'undefined' && $('#webai_cont').length > 0)
                            $('#webai_cont').html(r.webai);
                        comment.load(imageData.imageid, r.comments);
                    });
                }
                if (_is_playlist) {
                    $("[id=img_uploader]").html(imageData.username + " <img src='/is_online.php?userid=" + imageData.ownerid + "'>");
                    $("[id=img_title]").html(typeof imageData.gallery_title != "undefined" && imageData.gallery_title != "" ? imageData.gallery_title + "<BR>" : "");
                    $("[id=img_uprofile]").html("<a href='/profile.php?user=" + imageData.username + "'>Profile</a>");
                    $("[id=img_uploader_online_lnk]").html("<a href='/profile.php?user=" + imageData.username + "'>" + imageData.username + "</a> <img src='/is_online.php?userid=" + imageData.ownerid + "'>");
                    $("[id=img_ugallery]").html("<a href='/usergallery.php?userid=" + imageData.ownerid + "'>Galleries</a>");
                    $("[id=img_ufavorites]").html("<a href='/showfavorites.php?userid=" + imageData.ownerid + "'>Favorites</a>");
                    $("[id=img_ufanbase]").html("<a href='/fanbase.php?userid=" + imageData.ownerid + "'>Fanbase</a>");
                    $("[id=img_uclubs]").html("<a href='/showclubs.php?userid=" + imageData.ownerid + "'>Clubs</a>");
                    $("[id=img_ucomments]").html("<a href='/comments.php?userid=" + imageData.ownerid + "'>Comments</a>");
                    $("[id=img_ublog]").html("<a href='/blog.php?userid=" + imageData.ownerid + "'>Blog</a>");
                    $("[id=img_gallery]").html("<a href='/gallery.php?gid=" + imageData.galleryid + "'>" + imageData.gallery_title + "</a>");
                    $("[id=img_uploader_lnk]").html("<a href='/profile.php?user=" + imageData.username + "'>" + imageData.username + "</a>");
                    $("[id=img_uavatar]").html(imageData.avatar);
                    $("input[id=galleryid_input]").val(imageData.galleryid);
                }
                $("input[id=imageid_input]").val(imageData.imageid);
                $("#frmRate, #frmComment, #frmCommentRemove").attr("action", "/photo/" + imageData.imageid + "/" + imageData.title);
                if ($("#imgdel").length > 0)
                    $("#imgdel").attr("href", $("#imgdel").attr("href").substr(0, $("#imgdel").attr("href").indexOf("imgdelete=") + 10) + imageData.imageid);
                if (loadCommentsAjax)
                    comment.load(imageData.imageid, comments);
            }
        });
    } else {
        $("#mainPhoto").load(function() {
            legacyResize();
        });
    }
});

/* jscripts/tools.comments.js */

$(document).ready(function() {
    $('.edit-comment').live('click', function(e) {
        e.preventDefault();
        $(this).overlay({
            mask: {
                color: '#ebecff',
                loadSpeed: 200,
                opacity: 0.9
            },
            onBeforeLoad: function() {
                var wrap = this.getOverlay().find(".edit-comment-content");
                wrap.html('<img src="/images/lightbox-ico-loading.gif">');
                wrap.load(this.getTrigger().attr("href"));
            },
            closeOnClick: true,
            load: true
        });
    });
    if ($("#chk_all").length > 0)
        $("#chk_all").click(function() {
            var chk = $(this).is(":checked");
            $("[id=mid_chk], [id=rid_chk]").each(function() {
                $(this).attr("checked", chk);
            });
        });
    if ($(".chk_root").length > 0)
        $("input[class=chk_root]").each(function() {
            var id = $(this).val();
            $(this).click(function() {
                var chk = $(this).is(":checked");
                if ($("#expanded_" + id).length > 0)
                    $("#expanded_" + id).find("input[type=checkbox]").each(function() {
                        $(this).attr("checked", chk);
                    });
            });
            if ($("#expanded_" + id).length > 0)
                $("#expanded_" + id).find("input[type=checkbox]").each(function() {
                    $(this).click(function() {
                        var chk = $(this).is(":checked"),
                            root = "#row_" + id + " > td > input[class=chk_root]",
                            valid = true;
                        if (!chk && $(root).is(":checked"))
                            $(root).attr("checked", chk);
                    });
                });
        });
    if ($("#comments_bulk_action").length > 0)
        $("#comments_bulk_action").change(function() {
            if ($(this).val() != "-1") {
                var chk = "",
                    chk2 = "";
                $("[id=mid_chk]").each(function() {
                    if ($(this).is(":checked"))
                        chk += $(this).val() + "|";
                });
                $("[id=rid_chk]").each(function() {
                    if ($(this).is(":checked"))
                        chk2 += $(this).val() + "|";
                });
                if (chk == "" && chk2 == "") {
                    alert("Please select at least one entry");
                    $(this).val("-1");
                } else {
                    chk = chk.substr(0, chk.length - 1);
                    chk2 = chk2.substr(0, chk2.length - 1);
                    if ($(this).val() == "delete") {
                        if (confirm("Are you sure that you want to delete the selected items?"))
                            $.ajax({
                                url: "/img_comments.php?ajax=1&action=del&profile=" + $("#profile").val(),
                                type: "POST",
                                data: "id=" + chk + "&rid=" + chk2,
                                dataType: 'html',
                                cache: false,
                                async: true,
                                timeout: 12000000,
                                scriptCharset: "UTF-8",
                                success: function(r, s) {
                                    switch (parseInt(r)) {
                                        case 200:
                                            _redirect();
                                            break;
                                        default:
                                            alert("There was an error processing your request, please try again later.");
                                            break;
                                    }
                                }
                            });
                    }
                }
            }
        });
});

/* jscripts/adsmanager.js */

var adsManager = new function() {
    var ads = new Array();
    this.add = function(target, content) {
        ads.push({
            t: $(target),
            c: content
        });
    }
    $(window).load(function() {
        setTimeout(function() {
            $(ads).each(function() {
                $(this.t).html(this.c);
            });
        }, 500);
    });
}
$(document).ready(function() {
    _unsetCookie('AdBlockerState');
    if (typeof _getCookie('show_only_once_per_day6') == 'undefined')
        _setCookie('show_only_once_per_day6', '1', 28800);
    if (typeof is_external != 'undefined' && is_external === true) {
        if (typeof window.history != 'undefined' && typeof window.history.pushState != 'undefined') {
            var s = document.location.href;
            window.history.pushState('/exo1234.html', '_', '/exo1234.html');
            window.history.pushState(s, 'iFAP', s);
            window.addEventListener("popstate", function(e) {
                if (document.URL.indexOf("exo1234.html") >= 0)
                    document.location.href = bbH;
            });
        } else {}
    }
});

/* jscripts/facets.js */

var facetExpand = function(elm) {
    $(elm).parent().parent().find('li').each(function() {
        $(this).show();
    });
    $(elm).parent().remove();
    return false;
};
$(document).ready(function() {});