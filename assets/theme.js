window.slate = window.slate || {};
window.theme = window.theme || {};

/*================ Slate ================*/
/**
 * A11y Helpers
 * -----------------------------------------------------------------------------
 * A collection of useful functions that help make your theme more accessible
 * to users with visual impairments.
 *
 *
 * @namespace a11y
 */

slate.a11y = {

  /**
   * For use when focus shifts to a container rather than a link
   * eg for In-page links, after scroll, focus shifts to content area so that
   * next `tab` is where user expects if focusing a link, just $link.focus();
   *
   * @param {JQuery} $element - The element to be acted upon
   */
  pageLinkFocus: function($element) {
    var focusClass = 'js-focus-hidden';

    $element.first()
      .attr('tabIndex', '-1')
      .focus()
      .addClass(focusClass)
      .one('blur', callback);

    function callback() {
      $element.first()
        .removeClass(focusClass)
        .removeAttr('tabindex');
    }
  },

  /**
   * If there's a hash in the url, focus the appropriate element
   */
  focusHash: function() {
    var hash = window.location.hash;

    // is there a hash in the url? is it an element on the page?
    if (hash && document.getElementById(hash.slice(1))) {
      this.pageLinkFocus($(hash));
    }
  },

  /**
   * When an in-page (url w/hash) link is clicked, focus the appropriate element
   */
  bindInPageLinks: function() {
    $('a[href*=#]').on('click', function(evt) {
      this.pageLinkFocus($(evt.currentTarget.hash));
    }.bind(this));
  },

  /**
   * Traps the focus in a particular container
   *
   * @param {object} options - Options to be used
   * @param {jQuery} options.$container - Container to trap focus within
   * @param {jQuery} options.$elementToFocus - Element to be focused when focus leaves container
   * @param {string} options.namespace - Namespace used for new focus event handler
   */
  trapFocus: function(options) {
    var eventName = options.namespace
      ? 'focusin.' + options.namespace
      : 'focusin';

    if (!options.$elementToFocus) {
      options.$elementToFocus = options.$container;
    }

    options.$container.attr('tabindex', '-1');
    options.$elementToFocus.focus();

    $(document).on(eventName, function(evt) {
      if (options.$container[0] !== evt.target && !options.$container.has(evt.target).length) {
        options.$container.focus();
      }
    });
  },

  /**
   * Removes the trap of focus in a particular container
   *
   * @param {object} options - Options to be used
   * @param {jQuery} options.$container - Container to trap focus within
   * @param {string} options.namespace - Namespace used for new focus event handler
   */
  removeTrapFocus: function(options) {
    var eventName = options.namespace
      ? 'focusin.' + options.namespace
      : 'focusin';

    if (options.$container && options.$container.length) {
      options.$container.removeAttr('tabindex');
    }

    $(document).off(eventName);
  }
};

/**
 * Cart Template Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Cart template.
 *
 * @namespace cart
 */

slate.cart = {
  
  /**
   * Browser cookies are required to use the cart. This function checks if
   * cookies are enabled in the browser.
   */
  cookiesEnabled: function() {
    var cookieEnabled = navigator.cookieEnabled;

    if (!cookieEnabled){
      document.cookie = 'testcookie';
      cookieEnabled = (document.cookie.indexOf('testcookie') !== -1);
    }
    return cookieEnabled;
  }
};

/**
 * Utility helpers
 * -----------------------------------------------------------------------------
 * A collection of useful functions for dealing with arrays and objects
 *
 * @namespace utils
 */

slate.utils = {

  /**
   * Return an object from an array of objects that matches the provided key and value
   *
   * @param {array} array - Array of objects
   * @param {string} key - Key to match the value against
   * @param {string} value - Value to get match of
   */
  findInstance: function(array, key, value) {
    for (var i = 0; i < array.length; i++) {
      if (array[i][key] === value) {
        return array[i];
      }
    }
  },

  /**
   * Remove an object from an array of objects by matching the provided key and value
   *
   * @param {array} array - Array of objects
   * @param {string} key - Key to match the value against
   * @param {string} value - Value to get match of
   */
  removeInstance: function(array, key, value) {
    var i = array.length;
    while(i--) {
      if (array[i][key] === value) {
        array.splice(i, 1);
        break;
      }
    }

    return array;
  },

  /**
   * _.compact from lodash
   * Remove empty/false items from array
   * Source: https://github.com/lodash/lodash/blob/master/compact.js
   *
   * @param {array} array
   */
  compact: function(array) {
    var index = -1;
    var length = array == null ? 0 : array.length;
    var resIndex = 0;
    var result = [];

    while (++index < length) {
      var value = array[index];
      if (value) {
        result[resIndex++] = value;
      }
    }
    return result;
  },

  /**
   * _.defaultTo from lodash
   * Checks `value` to determine whether a default value should be returned in
   * its place. The `defaultValue` is returned if `value` is `NaN`, `null`,
   * or `undefined`.
   * Source: https://github.com/lodash/lodash/blob/master/defaultTo.js
   *
   * @param {*} value - Value to check
   * @param {*} defaultValue - Default value
   * @returns {*} - Returns the resolved value
   */
  defaultTo: function(value, defaultValue) {
    return (value == null || value !== value) ? defaultValue : value
  }
};

/**
 * Rich Text Editor
 * -----------------------------------------------------------------------------
 * Wrap videos in div to force responsive layout.
 *
 * @namespace rte
 */

slate.rte = {

  wrapTable: function() {
    $('.rte table').wrap('<div class="rte__table-wrapper"></div>');
  },

  iframeReset: function() {
    var $iframeVideo = $('.rte iframe[src*="youtube.com/embed"], .rte iframe[src*="youtube-nocookie.com/embed"], .rte iframe[src*="player.vimeo"]');
    var $iframeReset = $iframeVideo.add('.rte iframe#admin_bar_iframe');

    $iframeVideo.each(function() {
      // Add wrapper to make video responsive
      $(this).wrap('<div class="rte__video-wrapper"></div>');
    });

    $iframeReset.each(function() {
      // Re-set the src attribute on each iframe after page load
      // for Chrome's "incorrect iFrame content on 'back'" bug.
      // https://code.google.com/p/chromium/issues/detail?id=395791
      // Need to specifically target video and admin bar
      this.src = this.src;
    });
  }
};

slate.Sections = function Sections() {
  this.constructors = {};
  this.instances = [];

  $(document)
    .on('shopify:section:load', this._onSectionLoad.bind(this))
    .on('shopify:section:unload', this._onSectionUnload.bind(this))
    .on('shopify:section:select', this._onSelect.bind(this))
    .on('shopify:section:deselect', this._onDeselect.bind(this))
    .on('shopify:section:reorder', this._onReorder.bind(this))
    .on('shopify:block:select', this._onBlockSelect.bind(this))
    .on('shopify:block:deselect', this._onBlockDeselect.bind(this));
};

slate.Sections.prototype = $.extend({}, slate.Sections.prototype, {
  _createInstance: function(container, constructor) {
    var $container = $(container);
    var id = $container.attr('data-section-id');
    var type = $container.attr('data-section-type');

    constructor = constructor || this.constructors[type];

    if (typeof constructor === 'undefined') {
      return;
    }

    var instance = $.extend(new constructor(container), {
      id: id,
      type: type,
      container: container
    });

    this.instances.push(instance);
  },

  _onSectionLoad: function(evt) {
    var container = $('[data-section-id]', evt.target)[0];
    if (container) {
      this._createInstance(container);
    }
  },

  _onSectionUnload: function(evt) {
    var instance = slate.utils.findInstance(this.instances, 'id', evt.detail.sectionId);

    if (!instance) {
      return;
    }

    if (typeof instance.onUnload === 'function') {
      instance.onUnload(evt);
    }

    this.instances = slate.utils.removeInstance(this.instances, 'id', evt.detail.sectionId);
  },

  _onSelect: function(evt) {
    var instance = slate.utils.findInstance(this.instances, 'id', evt.detail.sectionId);

    if (instance && typeof instance.onSelect === 'function') {
      instance.onSelect(evt);
    }
  },

  _onDeselect: function(evt) {
    var instance = slate.utils.findInstance(this.instances, 'id', evt.detail.sectionId);

    if (instance && typeof instance.onDeselect === 'function') {
      instance.onDeselect(evt);
    }
  },

  _onReorder: function(evt) {
    var instance = slate.utils.findInstance(this.instances, 'id', evt.detail.sectionId);

    if (instance && typeof instance.onReorder === 'function') {
      instance.onReorder(evt);
    }
  },

  _onBlockSelect: function(evt) {
    var instance = slate.utils.findInstance(this.instances, 'id', evt.detail.sectionId);

    if (instance && typeof instance.onBlockSelect === 'function') {
      instance.onBlockSelect(evt);
    }
  },

  _onBlockDeselect: function(evt) {
    var instance = slate.utils.findInstance(this.instances, 'id', evt.detail.sectionId);

    if (instance && typeof instance.onBlockDeselect === 'function') {
      instance.onBlockDeselect(evt);
    }
  },

  register: function(type, constructor) {
    this.constructors[type] = constructor;

    $('[data-section-type=' + type + ']').each(function(index, container) {
      this._createInstance(container, constructor);
    }.bind(this));
  }
});

/**
 * Currency Helpers
 * -----------------------------------------------------------------------------
 * A collection of useful functions that help with currency formatting
 *
 * Current contents
 * - formatMoney - Takes an amount in cents and returns it as a formatted dollar value.
 *
 */

slate.Currency = (function() {
  var moneyFormat = '${{amount}}';

  /**
   * Format money values based on your shop currency settings
   * @param  {Number|string} cents - value in cents or dollar amount e.g. 300 cents
   * or 3.00 dollars
   * @param  {String} format - shop money_format setting
   * @return {String} value - formatted value
   */
  function formatMoney(cents, format) {
    if (typeof cents === 'string') {
      cents = cents.replace('.', '');
    }
    var value = '';
    var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
    var formatString = (format || moneyFormat);

    function formatWithDelimiters(number, precision, thousands, decimal) {
      precision = slate.utils.defaultTo(precision, 2);
      thousands = slate.utils.defaultTo(thousands, ',');
      decimal = slate.utils.defaultTo(decimal, '.');

      if (isNaN(number) || number == null) {
        return 0;
      }

      number = (number / 100.0).toFixed(precision);

      var parts = number.split('.');
      var dollarsAmount = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands);
      var centsAmount = parts[1] ? (decimal + parts[1]) : '';

      return dollarsAmount + centsAmount;
    }

    switch (formatString.match(placeholderRegex)[1]) {
      case 'amount':
        value = formatWithDelimiters(cents, 2);
        break;
      case 'amount_no_decimals':
        value = formatWithDelimiters(cents, 0);
        break;
      case 'amount_with_space_separator':
        value = formatWithDelimiters(cents, 2, ' ', '.');
        break;
      case 'amount_no_decimals_with_comma_separator':
        value = formatWithDelimiters(cents, 0, ',', '.');
        break;
      case 'amount_no_decimals_with_space_separator':
        value = formatWithDelimiters(cents, 0, ' ');
        break;
    }

    return formatString.replace(placeholderRegex, value);
  }

  return {
    formatMoney: formatMoney
  };
})();

/**
 * Image Helper Functions
 * -----------------------------------------------------------------------------
 * A collection of functions that help with basic image operations.
 *
 */

slate.Image = (function() {

  /**
   * Preloads an image in memory and uses the browsers cache to store it until needed.
   *
   * @param {Array} images - A list of image urls
   * @param {String} size - A shopify image size attribute
   */

  function preload(images, size) {
    if (typeof images === 'string') {
      images = [images];
    }

    for (var i = 0; i < images.length; i++) {
      var image = images[i];
      this.loadImage(this.getSizedImageUrl(image, size));
    }
  }

  /**
   * Loads and caches an image in the browsers cache.
   * @param {string} path - An image url
   */
  function loadImage(path) {
    new Image().src = path;
  }

  /**
   * Find the Shopify image attribute size
   *
   * @param {string} src
   * @returns {null}
   */
  function imageSize(src) {
    var match = src.match(/.+_((?:pico|icon|thumb|small|compact|medium|large|grande)|\d{1,4}x\d{0,4}|x\d{1,4})[_\.@]/);

    if (match) {
      return match[1];
    } else {
      return null;
    }
  }

  /**
   * Adds a Shopify size attribute to a URL
   *
   * @param src
   * @param size
   * @returns {*}
   */
  function getSizedImageUrl(src, size) {
    if (size === null) {
      return src;
    }

    if (size === 'master') {
      return this.removeProtocol(src);
    }

    var match = src.match(/\.(jpg|jpeg|gif|png|bmp|bitmap|tiff|tif)(\?v=\d+)?$/i);

    if (match) {
      var prefix = src.split(match[0]);
      var suffix = match[0];

      return this.removeProtocol(prefix[0] + '_' + size + suffix);
    } else {
      return null;
    }
  }

  function removeProtocol(path) {
    return path.replace(/http(s)?:/, '');
  }

  return {
    preload: preload,
    loadImage: loadImage,
    imageSize: imageSize,
    getSizedImageUrl: getSizedImageUrl,
    removeProtocol: removeProtocol
  };
})();

/**
 * Variant Selection scripts
 * ------------------------------------------------------------------------------
 *
 * Handles change events from the variant inputs in any `cart/add` forms that may
 * exist. Also updates the master select and triggers updates when the variants
 * price or image changes.
 *
 * @namespace variants
 */

slate.Variants = (function() {

  /**
   * Variant constructor
   *
   * @param {object} options - Settings from `product.js`
   */
  function Variants(options) {
    this.$container = options.$container;
    this.product = options.product;
    this.singleOptionSelector = options.singleOptionSelector;
    this.originalSelectorId = options.originalSelectorId;
    this.enableHistoryState = options.enableHistoryState;
    this.currentVariant = this._getVariantFromOptions();

    $(this.singleOptionSelector, this.$container).on('change', this._onSelectChange.bind(this));
  }

  Variants.prototype = $.extend({}, Variants.prototype, {

    /**
     * Get the currently selected options from add-to-cart form. Works with all
     * form input elements.
     *
     * @return {array} options - Values of currently selected variants
     */
    _getCurrentOptions: function() {
      var currentOptions = $.map($(this.singleOptionSelector, this.$container), function(element) {
        var $element = $(element);
        var type = $element.attr('type');
        var currentOption = {};

        if (type === 'radio' || type === 'checkbox') {
          if ($element[0].checked) {
            currentOption.value = $element.val();
            currentOption.index = $element.data('index');

            return currentOption;
          } else {
            return false;
          }
        } else {
          currentOption.value = $element.val();
          currentOption.index = $element.data('index');

          return currentOption;
        }
      });

      // remove any unchecked input values if using radio buttons or checkboxes
      currentOptions = slate.utils.compact(currentOptions);

      return currentOptions;
    },

    /**
     * Find variant based on selected values.
     *
     * @param  {array} selectedValues - Values of variant inputs
     * @return {object || undefined} found - Variant object from product.variants
     */
    _getVariantFromOptions: function() {
      var selectedValues = this._getCurrentOptions();
      var variants = this.product.variants;
      var found = false;

      variants.forEach(function(variant) {
        var satisfied = true;

        selectedValues.forEach(function(option) {
          if (satisfied) {
            satisfied = (option.value === variant[option.index]);
          }
        });

        if (satisfied) {
          found = variant;
        }
      });

      return found || null;
    },

    /**
     * Event handler for when a variant input changes.
     */
    _onSelectChange: function() {
      var variant = this._getVariantFromOptions();

      this.$container.trigger({
        type: 'variantChange',
        variant: variant
      });

      if (!variant) {
        return;
      }

      this._updateMasterSelect(variant);
      this._updateImages(variant);
      this._updatePrice(variant);
      this._updateOptions(variant);
      this._updateSKU(variant);
      this.currentVariant = variant;

      if (this.enableHistoryState) {
        this._updateHistoryState(variant);
      }
    },

    /**
     * Trigger event when variant image changes
     *
     * @param  {object} variant - Currently selected variant
     * @return {event}  variantImageChange
     */
    _updateImages: function(variant) {
      var variantImage = variant.featured_image || {};
      var currentVariantImage = this.currentVariant.featured_image || {};

      if (!variant.featured_image || variantImage.src === currentVariantImage.src) {
        return;
      }

      this.$container.trigger({
        type: 'variantImageChange',
        variant: variant
      });
    },

    /**
     * Trigger event when variant price changes.
     *
     * @param  {object} variant - Currently selected variant
     * @return {event} variantPriceChange
     */
    _updatePrice: function(variant) {
      if (variant.price === this.currentVariant.price && variant.compare_at_price === this.currentVariant.compare_at_price) {
        return;
      }

      this.$container.trigger({
        type: 'variantPriceChange',
        variant: variant
      });
    },

    /**
     * Trigger event when available variant options change.
     *
     * @param  {object} variant - Currently selected variant
     * @return {event} variantOptionChange
     */
    _updateOptions: function(variant) {
      if (!variant) {
        return;
      }

      this.$container.trigger({
        type: 'variantOptionChange',
        variant: variant
      });
    },

    /**
     * Trigger event when variant sku changes.
     *
     * @param  {object} variant - Currently selected variant
     * @return {event} variantSKUChange
     */
    _updateSKU: function(variant) {
      if (variant.sku === this.currentVariant.sku) {
        return;
      }

      this.$container.trigger({
        type: 'variantSKUChange',
        variant: variant
      });
    },

    /**
     * Update history state for product deeplinking
     *
     * @param  {variant} variant - Currently selected variant
     * @return {k}         [description]
     */
    _updateHistoryState: function(variant) {
      if (!history.replaceState || !variant) {
        return;
      }

      var newurl = window.location.protocol + '//' + window.location.host + window.location.pathname + '?variant=' + variant.id;
      window.history.replaceState({path: newurl}, '', newurl);
    },

    /**
     * Update hidden master select of variant change
     *
     * @param  {variant} variant - Currently selected variant
     */
    _updateMasterSelect: function(variant) {
      $(this.originalSelectorId, this.$container)[0].value = variant.id;
    }
  });

  return Variants;
})();


/*================ Global ================*/
/*============================================================================
  Helper utilities
==============================================================================*/
window.theme = window.theme || {};

theme.utils = {
  /**
   * Turns a string into a handle. Mimics Shopify's format.
   */
  handleize: function(str) {
    return str.toLowerCase().replace(/[^\w\u00C0-\u024f]+/g, "-").replace(/^-+|-+$/g, "");
  },

  /**
   * Cross-browser URL query param getter
   */
  getQueryParams: function(qs) {
    qs = qs || document.location.search;

    if (!qs) { 
      return;
    }

    qs = qs.split('+').join(' ');

    var params = {},
        tokens,
        re = /[?&]?([^=]+)=([^&]*)/g;

    while (tokens = re.exec(qs)) {
      params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
    }

    return params;
  },

  updateQueryStringParameter: function(key, value, url) {
    if (!url) url = window.location.href;

    var re = new RegExp("([?&])" + key + "=.*?(&|#|$)(.*)", "gi"),
    hash;

    if (re.test(url)) {
      if (typeof value !== 'undefined' && value !== null)
        return url.replace(re, '$1' + key + "=" + value + '$2$3');
      else {
        hash = url.split('#');
        url = hash[0].replace(re, '$1$3').replace(/(&|\?)$/, '');
        if (typeof hash[1] !== 'undefined' && hash[1] !== null) 
          url += '#' + hash[1];
        return url;
      }
    } else {
      if (typeof value !== 'undefined' && value !== null) {
        var separator = url.indexOf('?') !== -1 ? '&' : '?';
        hash = url.split('#');
        url = hash[0] + separator + key + '=' + value;
        if (typeof hash[1] !== 'undefined' && hash[1] !== null) 
          url += '#' + hash[1];
        return url;
      }
      else
        return url;
    }
  },

  getYoutubeId: function(url) {
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    var match = url.match(regExp);
    return (match&&match[7].length==11)? match[7] : false;
  },

  getProductJSON: function(handle, callback) {
    return $.get('/products/' + handle + '?view=json', null, callback, 'text');
  },

  hexToRgb: function(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  },

  flash: function(elements, color, duration) {
    var opacity = 100;
    color = color || '255, 255, 136';
    duration = duration || 1500;
    
    if (color.indexOf('#') > -1) {
      var rgbColor = theme.utils.hexToRgb(color);
      color = [rgbColor.r,rgbColor.g,rgbColor.b].join(',');
    }
    
    var interval = setInterval(function() {
      opacity -= 2.5;
      
      $(elements).css({ background: 'rgba(' + color + ', ' + opacity / 100 + ')' });
      
      if (opacity <= 0) {
        clearInterval(interval);
        return;
      }
    }, duration / 40);
  },

  // Gets the rendered size of an image using object-fit
  getRenderedImgSize: function(contains, cWidth, cHeight, width, height, pos){
    var oRatio = width / height,
    cRatio = cWidth / cHeight;
    return function() {
      if (contains ? (oRatio > cRatio) : (oRatio < cRatio)) {
        this.width = cWidth;
        this.height = cWidth / oRatio;
      } else {
        this.width = cHeight * oRatio;
        this.height = cHeight;
      }      
      this.left = (cWidth - this.width)*(pos/100);
      this.right = this.width + this.left;
      return this;
    }.call({});
  },

  // Returns size info for an image rendered with object-fit
  getImgSizeInfo: function(img) {
    var pos = window.getComputedStyle(img).getPropertyValue('object-position').split(' ');
    return theme.utils.getRenderedImgSize(true,
      img.width,
      img.height,
      img.naturalWidth,
      img.naturalHeight,
      parseInt(pos[0]));
  },

  // Returns content of template placed into snippets/js-tempales.liquid
  getTemplate: function(template) {
    return $('[data-template-for="' + template + '"]').html();
  },

  // Returns deep differences between objects, ignoring functions
  difference: function(object, base) {
    function changes(object, base) {
      return _.transform(object, function(result, value, key) {
        if (typeof value !== 'function' && !_.isEqual(value, base[key])) {
          var comparison = (_.isObject(value) && _.isObject(base[key])) ? changes(value, base[key]) : value;

          if (!_.isNil(comparison)) {
            result[key] = comparison;
          }
        }
      });
    }
    return changes(object, base);
  },

  // Adds syntax highlighting to JSON output
  syntaxHighlight: function(json) {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    json = json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
      var cls = 'number';
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'key';
        } else {
          cls = 'string';
        }
      } else if (/true|false/.test(match)) {
        cls = 'boolean';
      } else if (/null/.test(match)) {
        cls = 'null';
      }
      return '<span class="' + cls + '">' + match + '</span>';
    });
    json = json.replace(/([\n\r]|^)(\s*){/g, '<span class="group">$2<span class="group-handle">{</span>').replace(/([\n\r]|^)(\s*)}(,|)/g, '$1$2}$3</span>');
    json = json.replace(/(<\/span>|^)(\s*)\[/g, '$1<span class="group group--inline">$2<span class="group-handle">[</span>').replace(/([\n\r]|^)(\s*)](,|)/g, '$2]$3</span>');
    return json;
  },

  getStyleValue: function(variable) {
    var value = window.getComputedStyle(document.documentElement).getPropertyValue(variable);
    if (value) {
      return value.trim();
    }
    return '';
  },

  errorTippy: function(target, message) {
    var $el = $(target);
    var tip = tippy($el[0], {
      showOnInit: true,
      content: message,
      theme: 'light',
      animation: 'shift-away',
      arrow: true,
      delay: [0, 1000],
      onHidden: function(e) {
        e.destroy();
      }
    });
  },

  getVariantCustomerPrice: function(product, variant) {
    var productType = product.type.toLowerCase(),
        price = variant.price,
        discountPercentage = 0,
        discountedPrice,
        allowDiscount = true,
        isCustomProduct = productType.indexOf('custom') > -1,
        isSmartassProduct = productType.indexOf('smartass') > -1;

    if (!shop.customer || !shop.customer.tags) {
      return price;
    }

    // no-discount :: SKU => [sku]
    _.forEach(product.tags, function(tag, index) {

      var tagSplit,
          tagType,
          property,
          propertyValue,
          variantProperty;

      if (tag.indexOf('::') > -1) {
        tagSplit = tag.toLowerCase().split('::');
        tagType = $.trim(tagSplit[0]);

        if (tagType == 'no-discount') {

          tagSplit = tagSplit[1].split('=>');
          property = $.trim(tagSplit[0].toLowerCase());
          propertyValue = $.trim(tagSplit[1].toLowerCase());

          if (propertyValue == 'all') {
            allowDiscount = false;
          }

          variantProperty = variant[property];

          if (variantProperty) {
            variantProperty = $.trim(variantProperty.toLowerCase());
          }

          if (variantProperty == propertyValue) {
            allowDiscount = false;
          }

        }
      }
    });

    if (!allowDiscount) {
      return price;
    }

    if (!shop.customer.discounts || !shop.customer.smartassDiscounts) {
      shop.customer.discounts = {};
      shop.customer.smartassDiscounts = {};

      _.forEach(shop.customer.tags, function(tag, index) {

        var tagSplit,
            tagType,
            discountSplit,
            discountProductType,
            discountAmount,
            discountVariantSKU;


        if (tag.indexOf('::') > -1) {
          tagSplit = tag.toLowerCase().split('::');
          tagType = $.trim(tagSplit[0]);

          if (tagType == 'discount') {

            discountSplit = tagSplit[1].split('=>');
            discountProductType = $.trim(discountSplit[0]);
            discountAmount = parseInt($.trim(discountSplit[1].replace('%', '')));
            shop.customer.discounts[discountProductType] = Math.min(discountAmount, 100);

          } else if (tagType == 'smartass') {

            discountSplit = tagSplit[1].split('=>');
            discountVariantSKU = $.trim(discountSplit[0]);
            discountAmount = parseInt($.trim(discountSplit[1].replace('%', '')));
            shop.customer.smartassDiscounts[discountVariantSKU] = Math.min(discountAmount, 100);

          }

        }
      });
    }

    if (productType.indexOf('half carton') == -1 && !isSmartassProduct) {
      if (shop.customer.discounts[productType]) {
        discountPercentage = shop.customer.discounts[productType];
      } else if (shop.customer.discounts.custom && isCustomProduct) {
        discountPercentage = shop.customer.discounts.custom;
      } else if (shop.customer.discounts.all && !isCustomProduct) {
        discountPercentage = shop.customer.discounts.all;
      }
    } else if (isSmartassProduct) {
      if (variant.sku) {
        var variantSKU = variant.sku.toLowerCase();

        if (shop.customer.smartassDiscounts[variantSKU]) {
          discountPercentage = shop.customer.smartassDiscounts[variantSKU];
        } else if (shop.customer.smartassDiscounts.all) {
          discountPercentage = shop.customer.smartassDiscounts.all;
        }
      }
    }

    discountedPrice = price - (price * discountPercentage / 100);
    return discountedPrice;

  }
  
};

window.theme = window.theme || {};
window.theme.drawers = window.theme.drawers || {};
/*============================================================================
  Drawer modules
==============================================================================*/
theme.Drawers = (function() {

  if (isMobile.any) {
    theme.pageSwipeObject = new Hammer.Manager(document.getElementById('PageContainer'), {
      touchAction: 'auto',
      inputClass: Hammer.SUPPORT_POINTER_EVENTS ? Hammer.PointerEventInput : Hammer.TouchMouseInput,
      recognizers: [
        [Hammer.Swipe, {
          direction: Hammer.DIRECTION_HORIZONTAL
        }]
      ]
    });

    theme.pageSwipeObject.on('swiperight', function(evt) {
      if ($('body').hasClass('js-drawer-open-right')) {
        var $drawer = $('.drawer.drawer--right');
        theme[$drawer.attr('id')].close();
        return;
      }

      var $drawer = $('.drawer.drawer--left');
      if (!$drawer.length) {
        return;
      }
      var delta_x = evt.deltaX;
      var final_x = evt.srcEvent.pageX || evt.srcEvent.screenX || 0;
      var startPosition = final_x - delta_x;
      if (startPosition >= 0 && startPosition <= 25) {
        theme[$drawer.attr('id')].open();
      }
      return false;
    });

    theme.pageSwipeObject.on('swipeleft', function(evt) {
      if ($('body').hasClass('js-drawer-open-left')) {
        var $drawer = $('.drawer.drawer--left');
        theme[$drawer.attr('id')].close();
        return;
      }

      var $drawer = $('.drawer.drawer--right');
      if (!$drawer.length) {
        return;
      }
      var delta_x = evt.deltaX;
      var final_x = evt.center.x || 0;
      var startPosition = final_x + -delta_x;
      var windowWidthOffset = $(window).width() - 25;
      if (startPosition >= windowWidthOffset) {
        theme[$drawer.attr('id')].open();
      }
      return false;
    });
  }
  
  function Drawer(id, position, options) {
    var defaults = {
      close: '.js-drawer-close',
      open: '.js-drawer-open-' + position,
      openClass: 'js-drawer-open',
      dirOpenClass: 'js-drawer-open-' + position,
      pageContentSelector: '#PageContent',
    };

    this.config = $.extend(defaults, options);
    this.position = position;

    this.nodes = {
      $parent: $('html').add('body'),
      $page: $(this.config.pageContentSelector)
    };

    this.$drawer = $('#' + id);

    if (!this.$drawer.length) {
      return false;
    }

    theme.drawers[id] = this;

    this.drawerIsOpen = false;
    this.init();
  }

  Drawer.prototype.init = function() {
    $(this.config.open).on('click', $.proxy(this.open, this));
    this.$drawer.on('click', this.config.close, $.proxy(this.close, this));
  };

  Drawer.prototype.closeAllDrawers = function(evt) {
    // Close all drawers
    _.forEach(theme.drawers, function(drawer) {
      if (drawer.drawerIsOpen) {
        drawer.close();
      }
    });
  };

  Drawer.prototype.open = function(evt) {
    // Keep track if drawer was opened from a click, or called by another function
    var externalCall = false;

    // Prevent following href if link is clicked
    if (evt) {
      evt.preventDefault();
    } else {
      externalCall = true;
    }

    // Without this, the drawer opens, the click event bubbles up to nodes.$page
    // which closes the drawer.
    if (evt && evt.stopPropagation) {
      evt.stopPropagation();
      // save the source of the click, we'll focus to this on close
      this.$activeSource = $(evt.currentTarget);
    }

    if (this.drawerIsOpen && !externalCall) {
      return this.close();
    }

    this.closeAllDrawers();

    // Add is-transitioning class to moved elements on open so drawer can have
    // transition for close animation
    this.$drawer.prepareTransition();

    this.nodes.$parent.addClass(this.config.openClass + ' ' + this.config.dirOpenClass);
    this.drawerIsOpen = true;

    // Set focus on drawer
    slate.a11y.trapFocus({
      $container: this.$drawer,
      namespace: 'drawer_focus'
    });

    // Run function when draw opens if set
    if (this.config.onDrawerOpen && typeof this.config.onDrawerOpen === 'function') {
      if (!externalCall) {
        this.config.onDrawerOpen();
      }
    }

    if (this.$activeSource && this.$activeSource.attr('aria-expanded')) {
      this.$activeSource.attr('aria-expanded', 'true');
    }

    this.bindEvents();

    return this;
  };

  Drawer.prototype.close = function() {
    if (!this.drawerIsOpen) { // don't close a closed drawer
      return;
    }

    // deselect any focused form elements
    $(document.activeElement).trigger('blur');

    // Ensure closing transition is applied to moved elements, like the nav
    this.$drawer.prepareTransition();

    this.nodes.$parent.removeClass(this.config.dirOpenClass + ' ' + this.config.openClass);

    this.drawerIsOpen = false;

    // Remove focus on drawer
    slate.a11y.removeTrapFocus({
      $container: this.$drawer,
      namespace: 'drawer_focus'
    });

    // Run function when draw opens if set
    if (this.config.onDrawerClose && typeof this.config.onDrawerClose === 'function') {
      this.config.onDrawerClose();
    }

    this.unbindEvents();
  };

  Drawer.prototype.bindEvents = function() {
    this.nodes.$parent.on('keyup.drawer', $.proxy(function(evt) {
      // close on 'esc' keypress
      if (evt.keyCode === 27) {
        this.close();
        return false;
      } else {
        return true;
      }
    }, this));

    // Lock scrolling on mobile
    // this.nodes.$page.on('touchmove.drawer', function() {
    //   return false;
    // });

    this.nodes.$page.on('click.drawer', $.proxy(function() {
      this.close();
      return false;
    }, this));
  };

  Drawer.prototype.unbindEvents = function() {
    this.nodes.$page.off('.drawer');
    this.nodes.$parent.off('.drawer');
  };

  return Drawer;
})();

window.theme = window.theme || {};

theme.Index = (function(last, first) {

  var self = {
    version: '1.0.5',
    loop: false,
    removed: [],
    added: [],
    active: [],
    first: first || 0,
    last: last,
    span: last - (first || 0) + 1,
    back: [],

    set: function(index) {

      self.curr = clip(index);

      // set active indices
      var active = [self.curr];
      (self.prev = self.curr - 1) < self.first || active.unshift(self.prev);
      (self.next = self.curr + 1) > self.last || active.push(self.next);

      self.prev = clip(self.prev);
      self.next = clip(self.next);


      // save to self
      if(typeof _ === 'function') { // features only available with Underscore

        self.removed = _.difference(self.active, active),
        self.added = _.difference(active, self.active);
      }
      self.active = active;

      // direction
      if(self.back[0]) self.direction = self.curr > self.back[0].prev ? 1 : -1;

      // keep a history of past indices
      self.back.unshift({
        prev: self.prev,
        curr: self.curr,
        next: self.next,
      });

      return self;
    },
  },

  clip = function(index) {

    if(self.loop) {

      if(index > self.last) return self.first;
      else if(index < self.first) return self.last;
      else return index;
    }
    else return Math.min(Math.max(index, self.first), self.last);
  };

  return self;

});

/*============================================================================
  Modal modules
==============================================================================*/
theme.Modals = (function() {
  function Modal(id, name, options) {
    var defaults = {
      close: '.js-modal-close',
      open: '.js-modal-open-' + name,
      openClass: 'modal--is-active'
    };

    this.$modal = $(id);

    if (!this.$modal.length) {
      return false;
    }

    this.nodes = {
      $parent: $('html').add('body')
    };
    this.config = $.extend(defaults, options);
    this.modalIsOpen = false;
    // eslint-disable-next-line shopify/jquery-dollar-sign-reference
    this.$focusOnOpen = this.config.focusOnOpen ? $(this.config.focusOnOpen) : this.$modal;
    this.init();
  }

  Modal.prototype.init = function() {
    var $openBtn = $(this.config.open);

    // Add aria controls
    $openBtn.attr('aria-expanded', 'false');

    $(this.config.open).on('click', $.proxy(this.open, this));
    this.$modal.find(this.config.close).on('click', $.proxy(this.close, this));
  };

  Modal.prototype.open = function(evt) {
    // Keep track if modal was opened from a click, or called by another function
    var externalCall = false;

    // don't open an opened modal
    if (this.modalIsOpen) {
      return;
    }

    // Prevent following href if link is clicked
    if (evt) {
      evt.preventDefault();
    } else {
      externalCall = true;
    }

    // Without this, the modal opens, the click event bubbles up to $nodes.page
    // which closes the modal.
    if (evt && evt.stopPropagation) {
      evt.stopPropagation();
      // save the source of the click, we'll focus to this on close
      this.$activeSource = $(evt.currentTarget);
    }

    if (this.modalIsOpen && !externalCall) {
      this.close();
    }

    this.$modal.addClass(this.config.openClass);
    this.nodes.$parent.addClass(this.config.openClass);

    this.modalIsOpen = true;

    // Set focus on modal
    slate.a11y.trapFocus({
      $container: this.$modal,
      $elementToFocus: this.$focusOnOpen,
      namespace: 'modal_focus'
    });

    if (this.$activeSource && this.$activeSource.attr('aria-expanded')) {
      this.$activeSource.attr('aria-expanded', 'true');
    }

    this.bindEvents();
  };

  Modal.prototype.close = function() {
    // don't close a closed modal
    if (!this.modalIsOpen) {
      return;
    }

    // deselect any focused form elements
    $(document.activeElement).trigger('blur');

    this.$modal.removeClass(this.config.openClass);
    this.nodes.$parent.removeClass(this.config.openClass);

    this.modalIsOpen = false;

    // Remove focus on modal
    slate.a11y.removeTrapFocus({
      $container: this.$modal,
      namespace: 'modal_focus'
    });

    if (this.$activeSource && this.$activeSource.attr('aria-expanded')) {
      this.$activeSource.attr('aria-expanded', 'false').focus();
    }

    this.unbindEvents();
  };

  Modal.prototype.bindEvents = function() {
    // Pressing escape closes modal
    this.nodes.$parent.on('keyup.modal', $.proxy(function(evt) {
      if (evt.keyCode === 27) {
        this.close();
      }
    }, this));
  };

  Modal.prototype.unbindEvents = function() {
    this.nodes.$parent.off('.modal');
  };

  return Modal;
})();

(function() {
  var selectors = {
    tabHandles: '.tabs-menu a'
  };
  
  var classes = {
    qtySelector: 'js-qty-select'
  };

  var $tabHandles = $(selectors.tabHandles);

  if (!$tabHandles.length) {
    return;
  }

  $(selectors.tabHandles).click(function(e) {
    e.preventDefault();
    var $this = $(this);
    $this.parent().addClass("current");
    $this.parent().siblings().removeClass("current");
    var tab = $this.attr("href");
    $(".tab-content").not(tab).css("display", "none");
    $(tab).fadeIn();
  });
})();

window.theme = window.theme || {};

/*============================================================================
  TAB GROUPS
==============================================================================*/

theme.TabsGroup = (function() {

  var selectors = {
    container: '.tabs-group',
    tab: '.tabs-group__tab'
  };

  var defaultOptions = {
    activeTab: 1,
    tabsActiveClass: 'tabs-group--active',
    navContainerClass: 'tabs-group__nav',
    tabNavItemClass: 'tabs-group__nav-item',
    accordionNavItemClass: 'tabs-group__accordion-nav-item',
    breakpoint: 990,
    transitionDuration: 0.5
  };

  function TabsGroup(el, options) {
    this.$tabsGroup = $(el);

    if (!this.$tabsGroup.length) {
      return;
    }

    this.options = _.defaults(options, defaultOptions);

    this.config = {
      mediaQueryAccordion: 'screen and (max-width: ' + this.options.breakpoint + 'px)',
      mediaQueryTabs: 'screen and (min-width:  ' + (this.options.breakpoint + 1) + 'px)'
    };

    this.$tabs          = this.$tabsGroup.find(selectors.tab);
    this.$navContainer = $('<div></div>').addClass(this.options.navContainerClass);

    // Set initial tab states
    for (var j =  this.$tabs.length - 1; j >= 0; j--) {
      var $tab = $(this.$tabs[j]);
      var tabId = $tab.data('tab');
      var tabTitle = $tab.data('tabTitle');

      var $navItem = $('<div></div>')
                      .attr('data-target', tabId)
                      .attr('data-target-title', tabTitle)
                      .html(tabTitle);

      if (tabId == this.options.activeTab) {
        this.activeTab = tabId;
        $tab.attr('data-active', 'true');
        $navItem.attr('data-active', 'true');
      } else {
        $tab.attr('data-active', 'false');
        $navItem.attr('data-active', 'false');
      }

      var $tabNavItem = $navItem;
      var $accordionNavItem = $navItem.clone();

      $tabNavItem.addClass(this.options.tabNavItemClass);
      this.$navContainer.prepend($tabNavItem);

      $accordionNavItem.addClass(this.options.accordionNavItemClass).insertBefore($tab);

    }

    this.$tabsGroup.prepend(this.$navContainer);
    this.$navItems = this.$tabsGroup.find('[data-target]');

    var self = this;

    enquire.register(this.config.mediaQueryAccordion, {
      match: function() {
        self.$tabsGroup.attr('data-tabs-type', 'accordion');
      }
    });

    enquire.register(this.config.mediaQueryTabs, {
      match: function() {
        self.$tabsGroup.attr('data-tabs-type', 'tabs');
      }
    });

    // Bind nav click events
    $(this.$navItems).on('click',function() {
      var target = $(this).data('target');

      if (self.activeTab == target) {
        self._closeAll();
      } else {
        self._goTo(target);
        self.activeTab = target;
      }

    });

    $(this.$tabsGroup).addClass(this.options.tabsActiveClass);
  }

  TabsGroup.prototype = $.extend({}, TabsGroup.prototype, {

    _closeAll: function() {
      var self = this;

      if (self.$tabsGroup.attr('data-tabs-type') != 'accordion') {
        return;
      }

      var $activeTab = $('[data-tab="' + self.activeTab + '"]', self.$tabsGroup);

      var animate = false;
      if ($(window).width() < this.options.breakpoint) {
        animate = true;
      }

      var height = {
        active: {}
      };

      if (animate) {
        height.active.current = $activeTab.height();
        $activeTab.css('height', height.active.current);
      }

      $(self.$tabs).attr('data-active', 'false');
      $(self.$navItems).attr('data-active', 'false');

      if (animate) {
        height.active.new = 0;

        $activeTab.height(height.active.current);
        
        $activeTab.height(height.active.new);

        setTimeout(function(){
          $activeTab.css('height','');
         }, self.options.transitionDuration * 1000);
      }

      self.activeTab = false;

    },
    _goTo: function(target) {
      var self = this;

      this.$tabsGroup.trigger({
        type: 'tabChange',
        tabIndex: target
      });

      var $tab = $('[data-tab="' + target + '"]', self.$tabsGroup);
      var $activeTab = $('[data-tab="' + self.activeTab + '"]', self.$tabsGroup);

      var animate = false;
      if ($(window).width() < this.options.breakpoint) {
        animate = true;
      }

      var height = {
        target: {},
        active: {}
      };

      if (animate) {
        height.target.current = 0;
        $tab.css('height', height.target.current);

        height.active.current = $activeTab.height();
        $activeTab.css('height', height.active.current);
      }

      $(self.$tabs).attr('data-active', 'false');
      $(self.$navItems).attr('data-active', 'false');

      var $target = self.$tabsGroup.find('[data-tab=' + target + ']');
      $($target).attr('data-active', 'true');

      var $targetNav = self.$tabsGroup.find('[data-target=' + target + ']');
      $($targetNav).attr('data-active', 'true');

      if (animate) {
        height.target.new = $tab.css('height','auto').get(0).scrollHeight;
        height.active.new = 0;

        $tab.height(height.target.current);
        $activeTab.height(height.active.current);
        
        $tab.height(height.target.new);
        $activeTab.height(height.active.new);

        setTimeout(function(){
          $tab.css('height','');
          $activeTab.css('height','');

          $(window).scrollTo($target, {
            duration: self.options.transitionDuration * 1000,
            interrupt: !isMobile.apple.device,
            offset: -100
          });

         }, self.options.transitionDuration * 1000);
      }

      self.activeTab = target;
    }

  })

  return TabsGroup;
})();
window.theme = window.theme || {};
window.accordions = window.accordions || {};

theme.SimpleAccordion = (function() {

  var defaults = {
    activeClass: 'active',
    accordionClass: 'simple-accordion',
    accordionTitleClass: 'simple-accordion__title'
  };

  var selectors = {
    accordion: '[data-simple-accordion]',
    title: '.' + defaults.accordionTitleClass,
  };

  function SimpleAccordion(el) {

    this.$el = $(el);

    this.breakpointMax = this.$el.data().simpleAccordionMax || false;
    this.breakpointMin = this.$el.data().simpleAccordionMin || false;

    var styleValue = theme.utils.getStyleValue('--accordion-transition-duration') || '0.5s';
 
    this.animationDuration = styleValue.replace('s', '') * 1000;

    this.$titles = this.$el.find(selectors.title);
    if (!this.$titles.length) {
      this.$titles = this.$el.children().first();
      this.$titles.addClass(defaults.accordionTitleClass);
    }

    var self = this;

    function initAccordion() {
      self.$el.addClass(defaults.accordionClass);
      self.$titles.on('click.accordion', _openClose);
    }

    function destroyAccordion() {
      self.$el.removeClass(defaults.accordionClass);
      self.$titles.off('click.accordion');
    }

    if (self.breakpointMax) {
      _registerBreakpoints('max-width', self.breakpointMax);
    } else if (self.breakpointMin) {
      _registerBreakpoints('min-width', self.breakpointMax);
    } else {
      initAccordion();
    }

    function _registerBreakpoints(minmax, breakpoint) {
      enquire.register('screen and (' + minmax + ': ' + theme.breakpoints[breakpoint] + ')', {
        match: function() {
          initAccordion();
        },
        unmatch: function() {
          destroyAccordion();
        }
      });
    }

    function _openClose() {

      var $target = $(this).next();
      var $active = self.$titles.filter('.' + defaults.activeClass).next();

      var close = false;
      if ($target[0] == $active[0]) {
        close = true;
      }

      self.$titles.removeClass(defaults.activeClass);

      var height = {
        target: {},
        active: {}
      };

      height.target.current = $target.height();
      height.active.new = 0;
      height.active.current = $active.height();

      $active.height(height.active.current);

      if (!close) {
        $(this).addClass(defaults.activeClass);
        $target.height(height.target.current);
        $target.addClass(defaults.activeClass);
      }

      $active.removeClass(defaults.activeClass);

      if (!close) {
        height.target.new = $target.height('auto').get(0).scrollHeight;
        $target.height(height.target.current);
        $target.height(height.target.new);
      }

      $active.height(height.active.new);

      setTimeout(function(){
        $target.height('');
        $active.height('');
       }, self.animationDuration);

      return;
    }
  }

  (function init() {
    var $accordions = $(selectors.accordion);
    if (!$accordions.length) {
      return;
    }
    for (var i = $accordions.length - 1; i >= 0; i--) {
      window.accordions[i] = new SimpleAccordion($accordions[i]);
    }
  })();

  return;
})();

/*============================================================================
  Quantity Selectors
==============================================================================*/
window.theme = window.theme || {};

theme.QuantitySelectors = (function() {
  var selectors = {
    qtyInputs: 'input[type="number"]',
    excludeInputs: '#cart input[type="number"], .js-qty-select input[type="number"], .product-grid-item input[type="number"]',
    qtySelector: '.js-qty-select',
    qtyButtonAdd: '.js-qty-select-add',
    qtyButtonSubtract: '.js-qty-select-sub',
  };

  var classes = {
    qtySelector: 'js-qty-select',
    qtyButtonAdd: 'js-qty-select-add',
    qtyButtonSubtract: 'js-qty-select-sub',
  };

  var $qtyInputs = $(selectors.qtyInputs).not(selectors.excludeInputs);

  if ($qtyInputs.length) {
    $qtyInputs.each( function(){
      var $el = $(this);
      init($el);
    });
  }

  $(document).on('click.qtySelector', selectors.qtySelector + ' button', function(evt) {
    evt.preventDefault();
    var $button = $(this);
    var $input = $button.siblings(selectors.qtyInputs);
    var oldValue = $input.val();
    var maxQty = parseInt($input.prop('max'));
    var minQty = parseInt($input.prop('min'));
    var newValue = minQty;

    if ($button.hasClass(classes.qtyButtonAdd)) {
      newValue = parseFloat(oldValue) + 1;
      if (maxQty && newValue >= maxQty) {
        $button.prop('disabled', true);
      }
    } else {
      if (oldValue > minQty) {
        newValue = parseFloat(oldValue) - 1;
        if (maxQty && newValue < maxQty) {
          $button.siblings(selectors.qtyButtonAdd).prop('disabled', false);
        }
      }
    }

    $input.val(newValue);
    $input.trigger('update.qtySelector');
  });

  function init($el) {
    if (!$el.length) {
      return false;
    }

    var $wrapper = $el.wrap( '<div class="' + classes.qtySelector + '"></div>' ).parent();
    var value = parseInt($el.val());
    var maxQty = parseInt($el.prop('max'));
    
    $wrapper.prepend('<button class="' + classes.qtyButtonSubtract + '">-</button>');
    
    if (maxQty == 1 && value == 1) {
      $wrapper.append('<button class="' + classes.qtyButtonAdd + '" disabled>+</button>');
    } else {
      $wrapper.append('<button class="' + classes.qtyButtonAdd + '">+</button>');
    }
  }

  return {
    init: init
  };
})();

(function() {
  var classes = {
    notificationHidden: 'notification-message--hidden'
  };

  var queryParams = theme.utils.getQueryParams();

  if (queryParams === undefined || queryParams.status === undefined) {
    return;
  }

  $('[data-notification="' + queryParams.status + '"]').removeClass(classes.notificationHidden);

})();

/*
 * Currency tools
 *
 * Copyright (c) 2015 Caroline Schnapp (mllegeorgesand@gmail.com)
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/mit-license.php
 *
 */ 

if (typeof Currency === 'undefined') {
  var Currency = {};
}

Currency.cookie = {
  configuration: {
    expires: 365,
    path: '/',
    domain: window.location.hostname
  },
  name: 'currency',
  write: function(currency) {
    jQuery.cookie(this.name, currency, this.configuration);
  },
  read: function() {
    return jQuery.cookie(this.name);
  },
  destroy: function() {
    jQuery.cookie(this.name, null, this.configuration);
  }
};

Currency.moneyFormats = {
  "USD":{
    "money_format":"${{amount}}",
    "money_with_currency_format":"${{amount}} USD"
  },
  "EUR":{
    "money_format":"&euro;{{amount}}",
    "money_with_currency_format":"&euro;{{amount}} EUR"
  },
  "GBP":{
    "money_format":"&pound;{{amount}}",
    "money_with_currency_format":"&pound;{{amount}} GBP"
  },
  "CAD":{
    "money_format":"${{amount}}",
    "money_with_currency_format":"${{amount}} CAD"
  },
  "ALL":{
    "money_format":"Lek {{amount}}",
    "money_with_currency_format":"Lek {{amount}} ALL"
  },
  "DZD":{
    "money_format":"DA {{amount}}",
    "money_with_currency_format":"DA {{amount}} DZD"
  },
  "AOA":{
    "money_format":"Kz{{amount}}",
    "money_with_currency_format":"Kz{{amount}} AOA"
  },
  "ARS":{
    "money_format":"${{amount_with_comma_separator}}",
    "money_with_currency_format":"${{amount_with_comma_separator}} ARS"
  },
  "AMD":{
    "money_format":"{{amount}} AMD",
    "money_with_currency_format":"{{amount}} AMD"
  },
  "AWG":{
    "money_format":"Afl{{amount}}",
    "money_with_currency_format":"Afl{{amount}} AWG"
  },
  "AUD":{
    "money_format":"${{amount}}",
    "money_with_currency_format":"${{amount}} AUD"
  },
  "BBD":{
    "money_format":"${{amount}}",
    "money_with_currency_format":"${{amount}} Bds"
  },
  "AZN":{
    "money_format":"m.{{amount}}",
    "money_with_currency_format":"m.{{amount}} AZN"
  },
  "BDT":{
    "money_format":"Tk {{amount}}",
    "money_with_currency_format":"Tk {{amount}} BDT"
  },
  "BSD":{
    "money_format":"BS${{amount}}",
    "money_with_currency_format":"BS${{amount}} BSD"
  },
  "BHD":{
    "money_format":"{{amount}}0 BD",
    "money_with_currency_format":"{{amount}}0 BHD"
  },
  "BYR":{
    "money_format":"Br {{amount}}",
    "money_with_currency_format":"Br {{amount}} BYR"
  },
  "BZD":{
    "money_format":"BZ${{amount}}",
    "money_with_currency_format":"BZ${{amount}} BZD"
  },
  "BTN":{
    "money_format":"Nu {{amount}}",
    "money_with_currency_format":"Nu {{amount}} BTN"
  },
  "BAM":{
    "money_format":"KM {{amount_with_comma_separator}}",
    "money_with_currency_format":"KM {{amount_with_comma_separator}} BAM"
  },
  "BRL":{
    "money_format":"R$ {{amount_with_comma_separator}}",
    "money_with_currency_format":"R$ {{amount_with_comma_separator}} BRL"
  },
  "BOB":{
    "money_format":"Bs{{amount_with_comma_separator}}",
    "money_with_currency_format":"Bs{{amount_with_comma_separator}} BOB"
  },
  "BWP":{
    "money_format":"P{{amount}}",
    "money_with_currency_format":"P{{amount}} BWP"
  },
  "BND":{
    "money_format":"${{amount}}",
    "money_with_currency_format":"${{amount}} BND"
  },
  "BGN":{
    "money_format":"{{amount}} лв",
    "money_with_currency_format":"{{amount}} лв BGN"
  },
  "MMK":{
    "money_format":"K{{amount}}",
    "money_with_currency_format":"K{{amount}} MMK"
  },
  "KHR":{
    "money_format":"KHR{{amount}}",
    "money_with_currency_format":"KHR{{amount}}"
  },
  "KYD":{
    "money_format":"${{amount}}",
    "money_with_currency_format":"${{amount}} KYD"
  },
  "XAF":{
    "money_format":"FCFA{{amount}}",
    "money_with_currency_format":"FCFA{{amount}} XAF"
  },
  "CLP":{
    "money_format":"${{amount_no_decimals}}",
    "money_with_currency_format":"${{amount_no_decimals}} CLP"
  },
  "CNY":{
    "money_format":"&#165;{{amount}}",
    "money_with_currency_format":"&#165;{{amount}} CNY"
  },
  "COP":{
    "money_format":"${{amount_with_comma_separator}}",
    "money_with_currency_format":"${{amount_with_comma_separator}} COP"
  },
  "CRC":{
    "money_format":"&#8353; {{amount_with_comma_separator}}",
    "money_with_currency_format":"&#8353; {{amount_with_comma_separator}} CRC"
  },
  "HRK":{
    "money_format":"{{amount_with_comma_separator}} kn",
    "money_with_currency_format":"{{amount_with_comma_separator}} kn HRK"
  },
  "CZK":{
    "money_format":"{{amount_with_comma_separator}} K&#269;",
    "money_with_currency_format":"{{amount_with_comma_separator}} K&#269;"
  },
  "DKK":{
    "money_format":"{{amount_with_comma_separator}}",
    "money_with_currency_format":"kr.{{amount_with_comma_separator}}"
  },
  "DOP":{
    "money_format":"RD$ {{amount}}",
    "money_with_currency_format":"RD$ {{amount}}"
  },
  "XCD":{
    "money_format":"${{amount}}",
    "money_with_currency_format":"EC${{amount}}"
  },
  "EGP":{
    "money_format":"LE {{amount}}",
    "money_with_currency_format":"LE {{amount}} EGP"
  },
  "ETB":{
    "money_format":"Br{{amount}}",
    "money_with_currency_format":"Br{{amount}} ETB"
  },
  "XPF":{
    "money_format":"{{amount_no_decimals_with_comma_separator}} XPF",
    "money_with_currency_format":"{{amount_no_decimals_with_comma_separator}} XPF"
  },
  "FJD":{
    "money_format":"${{amount}}",
    "money_with_currency_format":"FJ${{amount}}"
  },
  "GMD":{
    "money_format":"D {{amount}}",
    "money_with_currency_format":"D {{amount}} GMD"
  },
  "GHS":{
    "money_format":"GH&#8373;{{amount}}",
    "money_with_currency_format":"GH&#8373;{{amount}}"
  },
  "GTQ":{
    "money_format":"Q{{amount}}",
    "money_with_currency_format":"{{amount}} GTQ"
  },
  "GYD":{
    "money_format":"G${{amount}}",
    "money_with_currency_format":"${{amount}} GYD"
  },
  "GEL":{
    "money_format":"{{amount}} GEL",
    "money_with_currency_format":"{{amount}} GEL"
  },
  "HNL":{
    "money_format":"L {{amount}}",
    "money_with_currency_format":"L {{amount}} HNL"
  },
  "HKD":{
    "money_format":"${{amount}}",
    "money_with_currency_format":"HK${{amount}}"
  },
  "HUF":{
    "money_format":"{{amount_no_decimals_with_comma_separator}}",
    "money_with_currency_format":"{{amount_no_decimals_with_comma_separator}} Ft"
  },
  "ISK":{
    "money_format":"{{amount_no_decimals}} kr",
    "money_with_currency_format":"{{amount_no_decimals}} kr ISK"
  },
  "INR":{
    "money_format":"Rs. {{amount}}",
    "money_with_currency_format":"Rs. {{amount}}"
  },
  "IDR":{
    "money_format":"{{amount_with_comma_separator}}",
    "money_with_currency_format":"Rp {{amount_with_comma_separator}}"
  },
  "ILS":{
    "money_format":"{{amount}} NIS",
    "money_with_currency_format":"{{amount}} NIS"
  },
  "JMD":{
    "money_format":"${{amount}}",
    "money_with_currency_format":"${{amount}} JMD"
  },
  "JPY":{
    "money_format":"&#165;{{amount_no_decimals}}",
    "money_with_currency_format":"&#165;{{amount_no_decimals}} JPY"
  },
  "JEP":{
    "money_format":"&pound;{{amount}}",
    "money_with_currency_format":"&pound;{{amount}} JEP"
  },
  "JOD":{
    "money_format":"{{amount}}0 JD",
    "money_with_currency_format":"{{amount}}0 JOD"
  },
  "KZT":{
    "money_format":"{{amount}} KZT",
    "money_with_currency_format":"{{amount}} KZT"
  },
  "KES":{
    "money_format":"KSh{{amount}}",
    "money_with_currency_format":"KSh{{amount}}"
  },
  "KWD":{
    "money_format":"{{amount}}0 KD",
    "money_with_currency_format":"{{amount}}0 KWD"
  },
  "KGS":{
    "money_format":"лв{{amount}}",
    "money_with_currency_format":"лв{{amount}}"
  },
  "LVL":{
    "money_format":"Ls {{amount}}",
    "money_with_currency_format":"Ls {{amount}} LVL"
  },
  "LBP":{
    "money_format":"L&pound;{{amount}}",
    "money_with_currency_format":"L&pound;{{amount}} LBP"
  },
  "LTL":{
    "money_format":"{{amount}} Lt",
    "money_with_currency_format":"{{amount}} Lt"
  },
  "MGA":{
    "money_format":"Ar {{amount}}",
    "money_with_currency_format":"Ar {{amount}} MGA"
  },
  "MKD":{
    "money_format":"ден {{amount}}",
    "money_with_currency_format":"ден {{amount}} MKD"
  },
  "MOP":{
    "money_format":"MOP${{amount}}",
    "money_with_currency_format":"MOP${{amount}}"
  },
  "MVR":{
    "money_format":"Rf{{amount}}",
    "money_with_currency_format":"Rf{{amount}} MRf"
  },
  "MXN":{
    "money_format":"$ {{amount}}",
    "money_with_currency_format":"$ {{amount}} MXN"
  },
  "MYR":{
    "money_format":"RM{{amount}} MYR",
    "money_with_currency_format":"RM{{amount}} MYR"
  },
  "MUR":{
    "money_format":"Rs {{amount}}",
    "money_with_currency_format":"Rs {{amount}} MUR"
  },
  "MDL":{
    "money_format":"{{amount}} MDL",
    "money_with_currency_format":"{{amount}} MDL"
  },
  "MAD":{
    "money_format":"{{amount}} dh",
    "money_with_currency_format":"Dh {{amount}} MAD"
  },
  "MNT":{
    "money_format":"{{amount_no_decimals}} &#8366",
    "money_with_currency_format":"{{amount_no_decimals}} MNT"
  },
  "MZN":{
    "money_format":"{{amount}} Mt",
    "money_with_currency_format":"Mt {{amount}} MZN"
  },
  "NAD":{
    "money_format":"N${{amount}}",
    "money_with_currency_format":"N${{amount}} NAD"
  },
  "NPR":{
    "money_format":"Rs{{amount}}",
    "money_with_currency_format":"Rs{{amount}} NPR"
  },
  "ANG":{
    "money_format":"&fnof;{{amount}}",
    "money_with_currency_format":"{{amount}} NA&fnof;"
  },
  "NZD":{
    "money_format":"${{amount}}",
    "money_with_currency_format":"${{amount}} NZD"
  },
  "NIO":{
    "money_format":"C${{amount}}",
    "money_with_currency_format":"C${{amount}} NIO"
  },
  "NGN":{
    "money_format":"&#8358;{{amount}}",
    "money_with_currency_format":"&#8358;{{amount}} NGN"
  },
  "NOK":{
    "money_format":"kr {{amount_with_comma_separator}}",
    "money_with_currency_format":"kr {{amount_with_comma_separator}} NOK"
  },
  "OMR":{
    "money_format":"{{amount_with_comma_separator}} OMR",
    "money_with_currency_format":"{{amount_with_comma_separator}} OMR"
  },
  "PKR":{
    "money_format":"Rs.{{amount}}",
    "money_with_currency_format":"Rs.{{amount}} PKR"
  },
  "PGK":{
    "money_format":"K {{amount}}",
    "money_with_currency_format":"K {{amount}} PGK"
  },
  "PYG":{
    "money_format":"Gs. {{amount_no_decimals_with_comma_separator}}",
    "money_with_currency_format":"Gs. {{amount_no_decimals_with_comma_separator}} PYG"
  },
  "PEN":{
    "money_format":"S/. {{amount}}",
    "money_with_currency_format":"S/. {{amount}} PEN"
  },
  "PHP":{
    "money_format":"&#8369;{{amount}}",
    "money_with_currency_format":"&#8369;{{amount}} PHP"
  },
  "PLN":{
    "money_format":"{{amount_with_comma_separator}} zl",
    "money_with_currency_format":"{{amount_with_comma_separator}} zl PLN"
  },
  "QAR":{
    "money_format":"QAR {{amount_with_comma_separator}}",
    "money_with_currency_format":"QAR {{amount_with_comma_separator}}"
  },
  "RON":{
    "money_format":"{{amount_with_comma_separator}} lei",
    "money_with_currency_format":"{{amount_with_comma_separator}} lei RON"
  },
  "RUB":{
    "money_format":"&#1088;&#1091;&#1073;{{amount_with_comma_separator}}",
    "money_with_currency_format":"&#1088;&#1091;&#1073;{{amount_with_comma_separator}} RUB"
  },
  "RWF":{
    "money_format":"{{amount_no_decimals}} RF",
    "money_with_currency_format":"{{amount_no_decimals}} RWF"
  },
  "WST":{
    "money_format":"WS$ {{amount}}",
    "money_with_currency_format":"WS$ {{amount}} WST"
  },
  "SAR":{
    "money_format":"{{amount}} SR",
    "money_with_currency_format":"{{amount}} SAR"
  },
  "STD":{
    "money_format":"Db {{amount}}",
    "money_with_currency_format":"Db {{amount}} STD"
  },
  "RSD":{
    "money_format":"{{amount}} RSD",
    "money_with_currency_format":"{{amount}} RSD"
  },
  "SCR":{
    "money_format":"Rs {{amount}}",
    "money_with_currency_format":"Rs {{amount}} SCR"
  },
  "SGD":{
    "money_format":"${{amount}}",
    "money_with_currency_format":"${{amount}} SGD"
  },
  "SYP":{
    "money_format":"S&pound;{{amount}}",
    "money_with_currency_format":"S&pound;{{amount}} SYP"
  },
  "ZAR":{
    "money_format":"R {{amount}}",
    "money_with_currency_format":"R {{amount}} ZAR"
  },
  "KRW":{
    "money_format":"&#8361;{{amount_no_decimals}}",
    "money_with_currency_format":"&#8361;{{amount_no_decimals}} KRW"
  },
  "LKR":{
    "money_format":"Rs {{amount}}",
    "money_with_currency_format":"Rs {{amount}} LKR"
  },
  "SEK":{
    "money_format":"{{amount_no_decimals}} kr",
    "money_with_currency_format":"{{amount_no_decimals}} kr SEK"
  },
  "CHF":{
    "money_format":"SFr. {{amount}}",
    "money_with_currency_format":"SFr. {{amount}} CHF"
  },
  "TWD":{
    "money_format":"${{amount}}",
    "money_with_currency_format":"${{amount}} TWD"
  },
  "THB":{
    "money_format":"{{amount}} &#xe3f;",
    "money_with_currency_format":"{{amount}} &#xe3f; THB"
  },
  "TZS":{
    "money_format":"{{amount}} TZS",
    "money_with_currency_format":"{{amount}} TZS"
  },
  "TTD":{
    "money_format":"${{amount}}",
    "money_with_currency_format":"${{amount}} TTD"
  },
  "TND":{
    "money_format":"{{amount}}",
    "money_with_currency_format":"{{amount}} DT"
  },
  "TRY":{
    "money_format":"{{amount}}TL",
    "money_with_currency_format":"{{amount}}TL"
  },
  "UGX":{
    "money_format":"Ush {{amount_no_decimals}}",
    "money_with_currency_format":"Ush {{amount_no_decimals}} UGX"
  },
  "UAH":{
    "money_format":"₴{{amount}}",
    "money_with_currency_format":"₴{{amount}} UAH"
  },
  "AED":{
    "money_format":"Dhs. {{amount}}",
    "money_with_currency_format":"Dhs. {{amount}} AED"
  },
  "UYU":{
    "money_format":"${{amount_with_comma_separator}}",
    "money_with_currency_format":"${{amount_with_comma_separator}} UYU"
  },
  "VUV":{
    "money_format":"${{amount}}",
    "money_with_currency_format":"${{amount}}VT"
  },
  "VEF":{
    "money_format":"Bs. {{amount_with_comma_separator}}",
    "money_with_currency_format":"Bs. {{amount_with_comma_separator}} VEF"
  },
  "VND":{
    "money_format":"{{amount_no_decimals_with_comma_separator}}&#8363;",
    "money_with_currency_format":"{{amount_no_decimals_with_comma_separator}} VND"
  },
  "XBT":{
    "money_format":"{{amount_no_decimals}} BTC",
    "money_with_currency_format":"{{amount_no_decimals}} BTC"
  },
  "XOF":{
    "money_format":"CFA{{amount}}",
    "money_with_currency_format":"CFA{{amount}} XOF"
  },
  "ZMW":{
    "money_format":"K{{amount_no_decimals_with_comma_separator}}",
    "money_with_currency_format":"ZMW{{amount_no_decimals_with_comma_separator}}"
  }
};

Currency.formatMoney = function(cents, format) {
  if (typeof Shopify.formatMoney === 'function') {
    return Shopify.formatMoney(cents, format);
  }
  if (typeof cents == 'string') { cents = cents.replace('.',''); }
  var value = '';
  var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
  var formatString = format || '${{amount}}';
  function defaultOption(opt, def) {
     return (typeof opt == 'undefined' ? def : opt);
  }
  function formatWithDelimiters(number, precision, thousands, decimal) {
    precision = defaultOption(precision, 2);
    thousands = defaultOption(thousands, ',');
    decimal   = defaultOption(decimal, '.');
    if (isNaN(number) || number == null) { return 0; }
    number = (number/100.0).toFixed(precision);
    var parts   = number.split('.'),
        dollars = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands),
        cents   = parts[1] ? (decimal + parts[1]) : '';
    return dollars + cents;
  }
  switch(formatString.match(placeholderRegex)[1]) {
    case 'amount':
      value = formatWithDelimiters(cents, 2);
      break;
    case 'amount_no_decimals':
      value = formatWithDelimiters(cents, 0);
      break;
    case 'amount_with_comma_separator':
      value = formatWithDelimiters(cents, 2, '.', ',');
      break;
    case 'amount_no_decimals_with_comma_separator':
      value = formatWithDelimiters(cents, 0, '.', ',');
      break;
  }
  return formatString.replace(placeholderRegex, value);
};
  
Currency.currentCurrency = '';

Currency.format = 'money_with_currency_format';

Currency.convertAll = function(oldCurrency, newCurrency, selector, format) {
  if (newCurrency === undefined) {
    return;
  }
  
  $(selector || 'span.money').each(function() {
    // If the amount has already been converted, we leave it alone.
    if ($(this).attr('data-currency') === newCurrency) return;
    // If we are converting to a currency that we have saved, we will use the saved amount.
    if ($(this).attr('data-currency-'+newCurrency)) {
      $(this).html($(this).attr('data-currency-'+newCurrency));
    }
    else {
      // Converting to Y for the first time? Let's get to it!
      var cents = 0.0;
      var oldFormat = Currency.moneyFormats[oldCurrency][format || Currency.format] || '{{amount}}';
      var newFormat = Currency.moneyFormats[newCurrency][format || Currency.format] || '{{amount}}';
      if (oldFormat.indexOf('amount_no_decimals') !== -1) {
        cents = Currency.convert(parseInt($(this).html().replace(/[^0-9]/g, ''), 10)*100, oldCurrency, newCurrency);
      }
      else if (oldCurrency === 'JOD' || oldCurrency == 'KWD' || oldCurrency == 'BHD') {
        cents = Currency.convert(parseInt($(this).html().replace(/[^0-9]/g, ''), 10)/10, oldCurrency, newCurrency);
      }
      else { 
        cents = Currency.convert(parseInt($(this).html().replace(/[^0-9]/g, ''), 10), oldCurrency, newCurrency);
      }
      var newFormattedAmount = Currency.formatMoney(cents, newFormat);
      $(this).html(newFormattedAmount);
      $(this).attr('data-currency-'+newCurrency, newFormattedAmount);
    }
    // We record the new currency locally.
    $(this).attr('data-currency', newCurrency);
  });
  this.currentFormat = Currency.moneyFormats[newCurrency][format || Currency.format] || '{{amount}}';
  this.currentCurrency = newCurrency;
  this.cookie.write(newCurrency);
};

/*============================================================================
  Development Helpers
==============================================================================*/
(function() {
  var isDevelopment = window.location.hostname == 'localhost' || $(document.documentElement).hasClass('localhost');

  if (isDevelopment) {
    document.documentElement.classList.add('localhost');
    // Shopify.designMode = true;

    // Media Query Infobox + Admin Links
    var globeIcon = '<svg aria-hidden="true" data-prefix="fas" data-icon="globe" class="svg-inline--fa fa-globe fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512"><path fill="currentColor" d="M336.5 160C322 70.7 287.8 8 248 8s-74 62.7-88.5 152h177zM152 256c0 22.2 1.2 43.5 3.3 64h185.3c2.1-20.5 3.3-41.8 3.3-64s-1.2-43.5-3.3-64H155.3c-2.1 20.5-3.3 41.8-3.3 64zm324.7-96c-28.6-67.9-86.5-120.4-158-141.6 24.4 33.8 41.2 84.7 50 141.6h108zM177.2 18.4C105.8 39.6 47.8 92.1 19.3 160h108c8.7-56.9 25.5-107.8 49.9-141.6zM487.4 192H372.7c2.1 21 3.3 42.5 3.3 64s-1.2 43-3.3 64h114.6c5.5-20.5 8.6-41.8 8.6-64s-3.1-43.5-8.5-64zM120 256c0-21.5 1.2-43 3.3-64H8.6C3.2 212.5 0 233.8 0 256s3.2 43.5 8.6 64h114.6c-2-21-3.2-42.5-3.2-64zm39.5 96c14.5 89.3 48.7 152 88.5 152s74-62.7 88.5-152h-177zm159.3 141.6c71.4-21.2 129.4-73.7 158-141.6h-108c-8.8 56.9-25.6 107.8-50 141.6zM19.3 352c28.6 67.9 86.5 120.4 158 141.6-24.4-33.8-41.2-84.7-50-141.6h-108z"></path></svg>';
    var pencilIcon = '<svg aria-hidden="true" data-prefix="fas" data-icon="pencil-alt" class="svg-inline--fa fa-pencil-alt fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M497.9 142.1l-46.1 46.1c-4.7 4.7-12.3 4.7-17 0l-111-111c-4.7-4.7-4.7-12.3 0-17l46.1-46.1c18.7-18.7 49.1-18.7 67.9 0l60.1 60.1c18.8 18.7 18.8 49.1 0 67.9zM284.2 99.8L21.6 362.4.4 483.9c-2.9 16.4 11.4 30.6 27.8 27.8l121.5-21.3 262.6-262.6c4.7-4.7 4.7-12.3 0-17l-111-111c-4.8-4.7-12.4-4.7-17.1 0zM124.1 339.9c-5.5-5.5-5.5-14.3 0-19.8l154-154c5.5-5.5 14.3-5.5 19.8 0s5.5 14.3 0 19.8l-154 154c-5.5 5.5-14.3 5.5-19.8 0zM88 424h48v36.3l-64.5 11.3-31.1-31.1L51.7 376H88v48z"></path></svg>';
    $('body').append('<div class="dev-helper"><div class="links"><a href="https://shopify.com/admin" title="Admin" target="_blank" rel="noopener noreferrer">' + globeIcon + '</a><a href="https://shopify.com/admin/themes/' + Shopify.theme.id + '/editor" title="Customise" target="_blank" rel="noopener noreferrer">' + pencilIcon + '</a></div><div class="mq" title="' + Shopify.theme.name + '"><span class="visible-xs">XS</span><span class="visible-sm">SM</span><span class="visible-md">MD</span><span class="visible-lg">LG</span><span class="visible-xl">XL</span></div></div>');

    // Janky function to make SCSS debug info easier to see on the frontend
    try {
      for (var i = 0; i < document.styleSheets.length; i++) {
        if (document.styleSheets[i].href && document.styleSheets[i].href.indexOf('/assets/theme.scss.css?') > -1) {
          if (document.styleSheets[i].cssRules !== undefined && document.styleSheets[i].cssRules.length == 0) {
            $("body > *").hide(); $("body").append("<span>Please wait...</span>");
            $.get('/collections', function(data){
              var scriptString = '<script';
              scriptString += data.split('id="theme-js"')[1].split('</script>')[0];
              scriptString += '$("body > *").hide(); $("body").append("<span>There was a problem loading styles. Check the customise area in the Shopify admin interface or </span> <a href=\'https://" + shop.permanantDomain + "/services/assets/" + Shopify.theme.id + "/editor_asset/theme.scss.css\' target=\'_blank\' rel=\'noopener noreferrer\'>click here for debug information.</a>");';
              scriptString += '</script>';
              $('head').append(scriptString);
            });
          }
          break;
        }
      }
    }
    catch(err) {}
  }

  if (Shopify.theme.role == "unpublished" || Shopify.designMode || isDevelopment) {
    var pacifierIcon = '<svg aria-hidden="true" focusable="false" role="presentation" class="icon icon--full-color icon-pacifier" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500"><defs><style>.cls-8{fill:none;stroke:#000;stroke-linecap:round;stroke-linejoin:round;stroke-width:20px}</style></defs><title>pacifier</title><path d="M200.06 391.63a71.49 71.49 0 1 1-91.69-91.69 347.93 347.93 0 0 1-27.79-42.84A121.85 121.85 0 1 0 242.9 419.42a347.93 347.93 0 0 1-42.84-27.79z" fill="#faae3b"/><path d="M200.06 391.63c-.17.47-.41.92-.59 1.38.46.26.93.55 1.39.8A121.31 121.31 0 0 1 50 456a121.47 121.47 0 0 0 192.86-36.6 347.93 347.93 0 0 1-42.8-27.77z" fill="#f7991f"/><path d="M182.85 317.15C108.65 242.94 72 159.29 101 130.3l-31.8 31.78c-29 29 7.67 112.64 81.88 186.84s157.86 110.86 186.84 81.88L369.7 399c-28.99 29-112.64-7.65-186.85-81.85z" fill="#7f2424"/><path d="M322.86 251.3a71.18 71.18 0 0 0-7.64 12.42c-23.44 48-45.91 67.22-96 17.1s-30.87-72.6 17.1-96a71.18 71.18 0 0 0 12.42-7.64c-62.5-49.91-123.81-70.83-147.74-46.88-29 29 7.67 112.64 81.87 186.85S340.71 428 369.7 399c23.95-23.93 3.03-85.24-46.84-147.7z" fill="#d73939"/><path d="M322.86 251.3a71.18 71.18 0 0 0-7.64 12.42c-5.78 11.83-11.51 21.91-17.6 29.64 27.69 46.37 36 87.16 17.53 105.66a29.55 29.55 0 0 1-5.24 4.05c26.26 8.56 47.76 8 59.79-4.05 23.95-23.95 3.03-85.26-46.84-147.72zM214.23 197a209.6 209.6 0 0 1 22.05-12.21 71.18 71.18 0 0 0 12.42-7.64c-58.33-46.58-115.64-67.88-142.48-51 26.06 8.51 56.85 26.15 87.93 51 4.02 3.02 11.25 10.31 20.08 19.85z" fill="#be3434"/><path d="M219.18 280.82c50.13 50.12 72.6 30.87 96-17.1 27.76-56.81 77.69-10 139.61-72 76.51-76.51 0-146.59 0-146.59s-70.08-76.51-146.59 0c-61.92 61.92-15.15 111.85-72 139.61-47.89 23.48-67.14 45.95-17.02 96.08z" fill="#fcf1d1"/><path d="M454.83 45.17S410.2-3.45 353.31 15.71c28.41 9.25 47 29.46 47 29.46s76.5 70.08 0 146.59c-61.92 61.92-111.85 15.15-139.61 72-7.05 14.44-14 26.24-21.68 34.37 36.72 26.74 56.12 6.76 76.22-34.37 27.76-56.81 77.69-10 139.61-72 76.49-76.51-.02-146.59-.02-146.59z" fill="#f4ddaa"/><path class="cls-8" d="M182.85 317.15C108.65 242.94 72 159.29 101 130.3l-31.8 31.78c-29 29 7.67 112.64 81.88 186.84s157.86 110.86 186.84 81.88L369.7 399c-28.99 29-112.64-7.65-186.85-81.85z"/><path class="cls-8" d="M219.18 280.82c50.13 50.12 72.6 30.87 96-17.1 27.76-56.81 77.69-10 139.61-72 76.51-76.51 0-146.59 0-146.59s-70.08-76.51-146.59 0c-61.92 61.92-15.15 111.85-72 139.61-47.89 23.48-67.14 45.95-17.02 96.08z"/><path class="cls-8" d="M322.86 251.3a71.18 71.18 0 0 0-7.64 12.42c-23.44 48-45.91 67.22-96 17.1s-30.87-72.6 17.1-96a71.18 71.18 0 0 0 12.42-7.64c-62.5-49.91-123.81-70.83-147.74-46.88-29 29 7.67 112.64 81.87 186.85S340.71 428 369.7 399c23.95-23.93 3.03-85.24-46.84-147.7zm-122.8 140.33a71.49 71.49 0 1 1-91.69-91.69 347.93 347.93 0 0 1-27.79-42.84A121.85 121.85 0 1 0 242.9 419.42a347.93 347.93 0 0 1-42.84-27.79z"/></svg>';
    var dummyLinkTooltip = '<div class="hidden"><div id="dummy-link-tooltip">' + pacifierIcon + ' This is a dummy link.</div></div>';
    $('body').append(dummyLinkTooltip);
    
    tippy('a[href="#"]:not(.btn):not("#CartDrawer a")', {
      content: document.getElementById('dummy-link-tooltip'),
      size: 'small',
      animation: 'shift-toward',
      placement: 'right',
      trigger: 'mouseenter focus',
    });

    tippy('a[href="#"].btn', {
      content: document.getElementById('dummy-link-tooltip'),
      size: 'small',
      animation: 'shift-toward',
      placement: 'right',
      trigger: 'click',
    });
  }

  // Pretty variable dump outputs
  var elems = document.getElementsByClassName('vardump');
  for (var i = 0; i < elems.length; i++) {
    var json = JSON.stringify(JSON.parse(elems[i].dataset.json), undefined, 2);
    elems[i].innerHTML = theme.utils.syntaxHighlight(json);
  }

  tippy('.vardump', {
    content: 'Click items to copy',
    trigger: 'mouseenter',
    theme: 'light',
    placement: 'bottom-end',
    offset: "-20, -50",
    distance: 0,
    animation: 'fade'
  });

  $('.vardump span:not(.group):not(.group-handle)').on('click', function(){
    var $this = $(this);
    var $elem = $('<input value="' + $this.text().replace(/^"/, '').replace(/"$/, '') + '" />').appendTo('body');
    $elem.select();
    document.execCommand('copy');
    $elem.remove();

    tippy(this, {
      content: 'Copied to clipboard!',
      trigger: 'manual',
      theme: 'light',
      showOnInit: true,
      onShown: function(tip){
        window.setTimeout(function(){
          tip.hide();
        }, 2000);
      },
      onHidden: function(tip){
        tip.destroy();
      },
    });
  });
  
  $('.vardump span.group-handle').on('click', function(){
    $(this).parent('.group').toggleClass('closed');
  });

})();
/*============================================================================
  Color utilities
==============================================================================*/
window.theme = window.theme || {};

theme.colors = (function() {

  this.themesNames = ['orange', 'blue', 'yellow'];
  this.themeTiers = ['primary', 'primary-active', 'primary-hover', 'primary-light', 'secondary', 'secondary-active', 'secondary-hover', 'secondary-light', 'tertiary', 'tertiary-active', 'tertiary-hover', 'tertiary-light'];
  this.themes = function(){
    var themeStyles = {};
    var getThemeTierValue = function(name, tier) {
      return getComputedStyle(document.body).getPropertyValue('--color-' + name + '-' + tier).trim();
    };
    themesNames.forEach(function(themeName) {
      themeStyles[themeName] = {};
      themeTiers.forEach(function(tier) {
        themeStyles[themeName][tier] = getThemeTierValue(themeName, tier);
      });
    });
    return themeStyles;
  };

  var self = this;

  function transition(toThemeName) {

    if (!toThemeName) {
      console.error('No theme defined');
      return;
    }

    if (self.themesNames.indexOf(toThemeName) == -1) {
      self.themesNames.push(toThemeName);
    }

    var newTheme = self.themes()[toThemeName];

    // Loop through the tiers
    self.themeTiers.forEach(function(tierName) {

      var newColor = newTheme[tierName];
      document.documentElement.style.setProperty('--color-' + tierName, newColor);

      if (tierName == 'primary') {
        $('meta[name=theme-color]').attr('content', newColor);
      }

    });


  }

  return {
    transition: transition
  };

})();
/*============================================================================
  Scroll to utility
==============================================================================*/
window.theme = window.theme || {};

theme.scrollTo = (function() {

  var options = {

    scrollTo: {
      duration: 700,
      interrupt: !isMobile.apple.device, // Don't allow interupt on iOS
      offset: -150
    }

  }

  function init() {

    $('a[href^="#"]').click(function(e) {
      e.preventDefault();
      $(window).stop(true).scrollTo(this.hash, options.scrollTo);
    });

    if (document.location.search && theme.utils.getQueryParams().scrollto) {
      $(window).stop(true).scrollTo('#' + theme.utils.getQueryParams().scrollto, options.scrollTo);
      history.replaceState(null, '', theme.utils.updateQueryStringParameter('scrollto', null));
    }

  }


  init();

  return;

})();
/*============================================================================
  Quantity Selectors
==============================================================================*/
window.theme = window.theme || {};

theme.ProductGridItem = (function() {

  var selectors = {
    orderForm: '.product-grid-item__order-form',
    orderSubmitButton: '.product-grid-item__order-submit',
    productJson: '[data-product-json]',
    productMetafieldsJson: '[data-product-metafields-json]',
    productVariantInventoryJson: '[data-product-variant-inventory-json]',
    productVariantCrossSell: '[data-product-variant-crosssell-item-json]'
  };

  function ProductGridItem(container) {
    this.$container = $(container);

    if (!this.$container.length) {
      return;
    }

    this.productSingleObject = JSON.parse($(selectors.productJson, this.$container).html());
    var productMetafields = JSON.parse($(selectors.productMetafieldsJson, this.$container).html());
    this.productSingleObject.metafields = productMetafields;

    var productVariantInventoryJson = JSON.parse($(selectors.productVariantInventoryJson, this.$container).html());

    var self = this;

    this.productSingleObject.variants.forEach(function(variant, index) {
      var inventoryObject = _.find(productVariantInventoryJson, ['id', variant.id]);
      self.productSingleObject.variants[index] = _.merge(self.productSingleObject.variants[index], inventoryObject);
    });

    this.$orderForms = $(selectors.orderForm, this.$container);
    this.$orderSubmitButton = $(selectors.orderSubmitButton, this.$container);

    if (!this.$orderForms.length || !this.$orderSubmitButton.length) {
      return false;
    }

    this._bindSubmitButton();
    this._initQuantitySelectors();
  }

  ProductGridItem.prototype = $.extend({}, ProductGridItem.prototype, {
    _bindSubmitButton: function() {
      var self = this;

      // Submit all forms
      this.$orderSubmitButton.on('click.product-grid-item', function() {
        self.$orderForms.each(function() {
          $(this).submit();
        });
      });

    },

    _initQuantitySelectors: function() {
      var self = this;

      this.$orderForms.each(function() {
        var $form = $(this);
        var varaintId = $form.data('varaintId');
        var variant = _.find(self.productSingleObject.variants, ['id', varaintId]);
        var $quantitySelector = $('input[type="number"]', $form);
        $quantitySelector.attr('max', variant.inventory_quantity);
        theme.QuantitySelectors.init($quantitySelector);
      });
    }
  });

  return ProductGridItem;

})();

theme.productGridItems = (function() {

  var selectors = {
    productGridItem: '.product-grid-item'
  };

  var $productGridItems = $(selectors.productGridItem);

  $productGridItems.each(function(){
    new theme.ProductGridItem(this);
  });

})();


/*================ Modules ================*/
window.theme = window.theme || {};
window.theme.tabsGroups = window.theme.tabsGroups || {};

theme.AjaxCart = (function() {
  var selectors = {
    addToCartBtn: '[type="submit"]',
    addToCartForm: 'form[action="/cart/add"]',
    cartCount: '.site-header__cart',
    cartToggle: '.cart__toggle',
    cartDrawer: '.cart-drawer',
    cartDrawerOpen: '.cart-drawer--open',
    cartDrawerTabs: '.cart-drawer__tabs'
  };

  var settings = {
    // 'aboveForm' for top of add to cart form, 
    // 'belowForm' for below the add to cart form, 
    // 'nextButton' for next to add to cart button and
    // 'afterBody' for after the main body content (used for fixed notifications).
    feedbackPosition: 'afterBody'
  };

  var options = {
    requestBodyClass: 'cart-loading',
    moneyFormat: window.shop.moneyFormat,
    moneyWithCurrencyFormat: window.shop.moneyWithCurrencyFormat,
    weightUnit: 'kg', // g, kg, oz, lb
    weightPrecision: 0,
    tinybindModels: {
      'customer': window.shop.customer
    },
    errorHandling: {
      cartError: function() {
        $('.cart-loader.loading').removeClass('loading');
        if (this.description) {
          showFeedback('error', this.description);
        }
      }
    }
  };

  var cache = {
    previousCartItems: [],
    updatedItems: []
  };

  function init() {
    if (!$(selectors.cartDrawer).length) {
      return;
    }

    var $tabsGroup = $(selectors.cartDrawerTabs);
    $.each($tabsGroup, function(index, tabsGroup) {
      window.theme.tabsGroups[tabsGroup] = new theme.TabsGroup(tabsGroup, {
        breakpoint: 0
      });
    });

    tinybind.formatters.replace = function(value, search, replace) {
      return value.replace(search, replace);
    }

    tinybind.formatters.handle = function(string) {
      return theme.utils.handleize(string);
    }

    tinybind.formatters.startsWith = function(value, prefix) {
      return value.indexOf(prefix) === 0;
    }

    tinybind.formatters.endsWith = function(value, suffix) {
      return value.indexOf(suffix, value.length - suffix.length) !== -1;
    }

    $(document).on('click', '[data-add-to-cart], [data-cart-add], [data-cart-update], [data-cart-update-id], [data-cart-remove]', function(evt){
      var $this = $(this);
      var progressElementSelector = $this.data('progress-element');
      var $progressElement = progressElementSelector ? $(progressElementSelector) : $this;
      
      if (!$this.is('.disabled')) {
        if ($progressElement.length) {
          $progressElement.addClass('cart-loader loading');
        }

        if ($this.is('[data-opens-cart-drawer]')) {
          $('body').addClass('cart-loading--opens-drawer');
        }
      } else {
        evt.preventDefault();
        evt.stopPropagation();

        $progressElement.addClass('error');
        window.setTimeout(function(){
          $progressElement.removeClass('error');
        }, 1500);

        var highlightElements = $this.data('enable-requirements');
        if (highlightElements) {
          theme.utils.flash(highlightElements);
        }
      }
    });
    
    initDrawer();

    // tippy('.cart-drawer', { 
    //   target: '.cart-drawer-item__remove',
    //   placement: 'left',
    //   offset: -4,
    //   distance: -10,
    // });

    tippy('.cart-drawer', { 
      target: '.cart-drawer-item__remove, .cart-drawer__close',
      theme: 'light',
      placement: 'left',
      animation: 'shift-away',
      arrow: true,
      offset: 0,
      distance: 5,
    });

    CartJS.init(window.shop.cart, options);




    $('#cart-drawer-note, #cart-note').on('blur', function() {
      var note = $(this).val();
      if (note) {
        CartJS.setNote(note);
      } else {
        CartJS.setNote('');
      }
    });

    $('.cart-drawer__submit').click(function(){
      $(document.body).addClass('checkout-activated');
    });



    function checkCrossSells() {
      /* Cross Sell - Dupes */
  
      const crossSellElements = document.querySelectorAll('.cart-drawer-item__cross_sell')
      const crossCartSellItems = document.querySelectorAll('.cart-drawer-item')
  
      var carItemIds = []
      var carItemCrossIds = []
  
      crossSellElements.forEach((node) => {
        const crossSellElId = node.dataset.productid

        if(crossSellElId) {
          carItemIds.push(crossSellElId)
        }
        else {
          carItemIds.push(" ")
        }
      })
  
      crossCartSellItems.forEach((node) => {

        const crossSellProductId = node.dataset.product
          carItemCrossIds.push(crossSellProductId)
      })
  
      // Find matching values

      for (let index = 0; index < carItemCrossIds.length; index++) {
           const select = document.querySelector(`[data-productid="${carItemCrossIds[index]}"]`)

          if(select !== null) {
            select.classList.add('hidden')
        }
      }
  
      /* Cross Sell - Dupes */
    }


    $(document).on('cart.requestStarted', function(event, cart) {
      cache.previousCartItems = _.values(_.omit(cart.items, _.functions(cart.items)));
      

      if ('NProgress' in window) {
        NProgress.start();
      }
    });

      $(document).on('cart.requestComplete', function(event, cart) {


      function progressBannerInit() {
      
        // const { cart } = shop

        console.log(event)
        console.log(cart)


        const { items } = cart

        const pricesBeforeDiscount = items.map(({ original_line_price, discounted_price, price, quantity }) => ({ original_line_price, discounted_price, price, quantity }))

        const totalBeforeDiscount = pricesBeforeDiscount.map((x) => {
            return x.original_line_price
        })

        const sum = totalBeforeDiscount.reduce((partialSum, a) => partialSum + a, 0);
        
        const spent = sum/15000 * 100
        const toSpend = spent > 100 ? 0 :  (100 - spent)


          $('.progress-banner__spent').css('width', spent + '%');
          $('.progress-banner__tospend').css('width', toSpend + '%');



          console.log('To Spend:', toSpend, 'Spent sum:', sum, 'Spent Ideal:', spent)
      }

      progressBannerInit()


      if ('NProgress' in window) {
        NProgress.done();
        checkCrossSells();
        progressBannerInit();
      }

      
      $('.cart-loader.loading').removeClass('loading');

      cache.updatedItems = theme.utils.difference(_.values(_.omit(cart.items, _.functions(cart.items))), cache.previousCartItems);
      _.remove(cache.updatedItems, _.isEmpty);


      if (!cache.updatedItems.length && cart.items.length > 0) {
        // showFeedback('error', theme.strings.quantityUnavailable);
      }
      




      if (theme.Favicon !== undefined) {
        if (cart.item_count > 0) {
          theme.Favicon.set(cart.item_count);
        } else {
          theme.Favicon.reset();
        }
      }



      var opensDrawer = $('body').is('.cart-loading--opens-drawer');
      
      if (opensDrawer !== undefined && opensDrawer) {
        if ((theme.cartQueue === undefined || theme.cartQueue.length == 0) && theme.cartQueueProcessing == false) {
          if (!theme.CartDrawer.drawerIsOpen) {
            $('body').removeClass('cart-loading--opens-drawer');
            theme.CartDrawer.open();
          }
        }
      }

      if (theme.CartDrawer.drawerIsOpen && cart.item_count < 1) {
        window.setTimeout(function(){
          theme.CartDrawer.close();
        }, 2500);
      }
    });



  }


  function checkCrossSells() {
    /* Cross Sell - Dupes */

    const crossSellElements = document.querySelectorAll('.cart-drawer-item__cross_sell')
    const crossCartSellItems = document.querySelectorAll('.cart-drawer-item')

    var carItemIds = []
    var carItemCrossIds = []

    crossSellElements.forEach((node) => {
      const crossSellElId = node.dataset.productid

      if(crossSellElId) {
        carItemIds.push(crossSellElId)
      }
      else {
        carItemIds.push(" ")
      }
    })

    crossCartSellItems.forEach((node) => {

      const crossSellProductId = node.dataset.product
        carItemCrossIds.push(crossSellProductId)
    })

    // Find matching values

    for (let index = 0; index < carItemCrossIds.length; index++) {
         const select = document.querySelector(`[data-productid="${carItemCrossIds[index]}"]`)

        if(select !== null) {
          select.classList.add('hidden')
      }
    }

    /* Cross Sell - Dupes */
  }

  checkCrossSells()


  function initDrawer() {
    $('#MainContent').addClass('drawer-page-content');
    $('.js-drawer-open-top').attr('aria-controls', 'CartDrawer').attr('aria-expanded', 'false');
    

    function progressBannerInit() {
      
      const { cart } = shop
      const { items } = cart

      const pricesBeforeDiscount = items.map(({ original_line_price, discounted_price, price, quantity }) => ({ original_line_price, discounted_price, price, quantity }))

      const totalBeforeDiscount = pricesBeforeDiscount.map((x) => {
          return x.original_line_price
      })

      const sum = totalBeforeDiscount.reduce((partialSum, a) => partialSum + a, 0);
      
      const spent = sum/15000 * 100
      const toSpend = spent > 100 ? 0 :  (100 - spent)

        $('.progress-banner__spent').css('width', spent + '%');
        $('.progress-banner__tospend').css('width', toSpend + '%');

        console.log('To Spend:', toSpend, 'Spent sum:', sum, 'Spent Ideal:', spent)
    }
    progressBannerInit()

    theme.CartDrawer = new theme.Drawers('CartDrawer', 'right', {
      onDrawerOpen: cartDrawerOpen,
    });
  }

  function cartDrawerOpen() {

    checkCrossSells();
  }


  function showFeedback(status, response, $addToCartForm) {
    $('.ajax-cart-feedback').remove();
    var feedback = '<div class="ajax-cart-feedback ' + status + '">' + response + '</div>';
    
    if ($addToCartForm !== undefined && $addToCartForm.length > 0) {
      switch (settings.feedbackPosition) {
        case 'aboveForm':
          $addToCartForm.before(feedback);
          break;
        case 'belowForm':
          $addToCartForm.after(feedback);
          break;
        case 'afterBody':
          $(document.body).append(feedback);
          break;
        case 'nextButton':
        default:
          $addToCartForm.find(selectors.addToCartBtn).after(feedback);
          break;
      }
    } else {
      iziToast.show({
        message: response,
        color: 'red',
        position: 'bottomCenter'
      });
    }
    
    var $feedbackElement = $('.ajax-cart-feedback');
    
    $feedbackElement.offset(); // redraw
    $feedbackElement.addClass('active');
    window.setTimeout(function(){
      $feedbackElement.removeClass('active');
    }, 6500);
  };


  return {
    init: init
  };
})();

theme.AjaxCart.init();

theme.cartQueue = [];
theme.cartQueueProcessing = false;
theme.processCartQueue = function() {
  // If there's something in the queue, process it
  if (theme.cartQueue.length) {
    theme.cartQueueProcessing = true;
    var request = theme.cartQueue.shift();
    var requestType = request.type || 'add';



    if (requestType == 'add') {
      CartJS.addItem(request.variant_id, request.quantity, request.properties, {
        "success": function(data, textStatus, jqXHR) {
          theme.processCartQueue();
        }
      });
    } else if (requestType == 'update') {

      CartJS.updateItem(line_number, quantity, properties = {}, options = {})


    } else {
      CartJS.removeItem(line_number, options = {})
      
    }
    

    ShopifyAPI.addItem(request.variant_id, request.quantity, request.properties, ShopifyAPI.processQueue, requestType);
  }
  else {
    theme.cartQueueProcessing = false;
  }
};

window.theme = window.theme || {};

theme.Header = (function() {

  var selectors = {
    body: 'body',
    navigation: '.site-nav',
    dropdownTemplate: '.site-nav__dropdown-template',
    childlistGrid: '.site-nav__childlist-grid',
    featureData: 'script#header-data',
    accountDropdown: '.site-header__account-link--dropdown'
  };

  function Header(el) {

    this.$el = $(el);
    this.$siteNav = this.$el.find(selectors.navigation);
    this.$navItems = this.$siteNav.children();

    var self = this;

    $.each(this.$navItems, function(index, navItem) {

      var $navItemLink = $(navItem).children('.site-nav__link');
      var template = $(navItem).children('.js-template').html();
      self.$dropdown = $(template);

      var first = $(navItem).is(':first-of-type');

      if (first) {
        _buildDropdownBlocks();
      }

      var navItemContent = self.$dropdown[0];

      _bindDropdown($navItemLink[0], {
        content: navItemContent,
        appendTo: navItem
      });

    });

    this.$accountDropdown = this.$el.find(selectors.accountDropdown);

    if (this.$accountDropdown.length) {

      var element = this.$accountDropdown[0];
      var content = this.$accountDropdown.find('.js-template').html();
      var appendTo = this.$accountDropdown.parent()[0];

      _bindDropdown(element, {
        content: content,
        appendTo: appendTo,
        placement: 'bottom-end'
      });

    }

    function _bindDropdown(element, options) {
      var defaults = {
        content: content,
        animation: 'shift-away',
        arrow: true,
        theme: 'light',
        interactive: true
      };

      options = _.defaults(defaults, options);

      tippy(element, options);
    }

    function _buildDropdownBlocks() {

      self.data = {};
      self.data.features = JSON.parse($(selectors.featureData).html());

      if (!self.data.features.length) {
        return;
      }

      var template = theme.utils.getTemplate('header-features');
      var features = self.$dropdown.find(selectors.childlistGrid).append(template);

      tinybind.bind($(features), { data: self.data });

      return;
    }

  }

  return Header;

})();
window.theme = window.theme || {};

theme.MobileNav = (function() {

  var selectors = {
    mobileNavDrawer: '.mobile-nav-drawer',
    accountMobileNavButton: '.js-drawer-open-account'
  };

  function init() {
    if (!$(selectors.mobileNavDrawer).length) {
      return;
    }

    initDrawer();

    theme.MobileSubNav.init();

    $(selectors.accountMobileNavButton).on('click', function() {
      if (theme.MobileNavDrawer) {
        theme.MobileNavDrawer.open();
        var $drawer = theme.MobileNavDrawer.$drawer;
        $drawer.addClass('drawer--account');
      }
    });
  }

  function initDrawer() {
    $('#MainContent').addClass('drawer-page-content');
    $('.js-drawer-open-top').attr('aria-controls', 'MobileNavDrawer').attr('aria-expanded', 'false');

    theme.MobileNavDrawer = new theme.Drawers('MobileNavDrawer', 'left', {
      onDrawerOpen: cartDrawerOpen,
      onDrawerClose: cartDrawerClose,
      pageContentSelector: '#MainContent'
    });
  }

  function cartDrawerOpen() {
    var $drawer = theme.MobileNavDrawer.$drawer;
    $drawer.removeClass('drawer--account');
  }

  function cartDrawerClose() {

  }


  return {
    init: init
  };

})();



window.theme = window.theme || {};

theme.MobileSubNav = (function() {
  var classes = {
    mobileNavOpenIcon: 'mobile-nav--open',
    mobileNavCloseIcon: 'mobile-nav--close',
    navLink: 'mobile-nav__link',
    subNavLink: 'mobile-nav__sublist-link',
    return: 'mobile-nav__return-btn',
    subNavActive: 'is-active',
    subNavClosing: 'is-closing',
    navOpen: 'js-menu--is-open',
    subNavShowing: 'sub-nav--is-open',
    thirdNavShowing: 'third-nav--is-open',
    subNavToggleBtn: 'js-toggle-submenu'
  };
  var cache = {};
  var isTransitioning;
  var $activeSubNav;
  var $activeTrigger;
  var menuLevel = 1;
  // Breakpoints from src/stylesheets/global/variables.scss.liquid
  var mediaQuerySmall = 'screen and (max-width: 767px)';

  function init() {
    cacheSelectors();

    cache.$subNavToggleBtn.on('click.subNav', toggleSubNav);

  }

  function cacheSelectors() {
    cache = {
      $pageContainer: $('#PageContent'),
      $mobileNavToggle: $('.js-mobile-nav-toggle'),
      $mobileNavContainer: $('.mobile-nav-drawer'),
      $mobileNav: $('#MobileNav'),
      $sectionHeader: $('#shopify-section-header'),
      $subNavToggleBtn: $('.' + classes.subNavToggleBtn)
    };
  }

  function toggleSubNav(evt) {
    if (isTransitioning) {
      return;
    }

    var $toggleBtn = $(evt.currentTarget);
    var isReturn = $toggleBtn.hasClass(classes.return);
    isTransitioning = true;

    if (isReturn) {
      // Close all subnavs by removing active class on buttons
      $(
        '.' + classes.subNavToggleBtn + '[data-level="' + (menuLevel - 1) + '"]'
      ).removeClass(classes.subNavActive);

      if ($activeTrigger && $activeTrigger.length) {
        $activeTrigger.removeClass(classes.subNavActive);
      }
    } else {
      $toggleBtn.addClass(classes.subNavActive);
    }

    $activeTrigger = $toggleBtn;

    goToSubnav($toggleBtn.data('target'));
  }

  function goToSubnav(target) {

    /*eslint-disable shopify/jquery-dollar-sign-reference */

    var $targetMenu = target
      ? $('.mobile-nav__dropdown[data-parent="' + target + '"]')
      : cache.$mobileNav;

    menuLevel = $targetMenu.data('level') ? $targetMenu.data('level') : 1;

    if ($activeSubNav && $activeSubNav.length) {
      $activeSubNav
        .prepareTransition()
        .addClass(classes.subNavClosing);
    }

    $activeSubNav = $targetMenu;

    var $elementToFocus = target
      ? $targetMenu.find('.' + classes.subNavLink + ':first')
      : $activeTrigger;

    /*eslint-enable shopify/jquery-dollar-sign-reference */

    var translateMenuHeight = $targetMenu[0].scrollHeight;
    if (!target) {
      translateMenuHeight = $targetMenu.outerHeight();
    }

    var openNavClass = menuLevel > 2
      ? classes.thirdNavShowing
      : classes.subNavShowing;

    var newContainerHeight = translateMenuHeight + cache.$sectionHeader.outerHeight() + cache.$sectionHeader.offset().top;
    cache.$mobileNavContainer
      // .css('height', newContainerHeight + 'px')
      .removeClass(classes.thirdNavShowing)
      .addClass('is-transitioning')
      .addClass(openNavClass);

    if (!target) {
      // Show top level nav
      cache.$mobileNavContainer
        .removeClass(classes.thirdNavShowing)
        .removeClass(classes.subNavShowing);
    }

    // Focusing an item in the subnav early forces element into view and breaks the animation.
    cache.$mobileNavContainer.one(
      'TransitionEnd.subnavToggle webkitTransitionEnd.subnavToggle transitionend.subnavToggle oTransitionEnd.subnavToggle',
      function() {
        if ($elementToFocus.length > 1) {
          slate.a11y.trapFocus({
            $container: $targetMenu,
            $elementToFocus: $elementToFocus,
            namespace: 'subNavFocus'
          });
        } else {
          slate.a11y.trapFocus({
            $container: cache.$sectionHeader,
            $elementToFocus: cache.$mobileNav
              .find('.' + classes.navLinkWrapper + ':first')
              .find('.' + classes.navLink),
            namespace: 'navFocus'
          });
        }

        cache.$mobileNavContainer.off('.subnavToggle');
        cache.$mobileNavContainer.removeClass('is-transitioning');
        isTransitioning = false;
      }
    );

    // // Match height of subnav
    // cache.$pageContainer.css({
    //   overflow: 'hidden',
    //   height: newContainerHeight + 'px'
    // });

    $activeSubNav.removeClass(classes.subNavClosing);
  }

  return {
    init: init
  };
})();

window.theme = window.theme || {};

theme.Search = (function() {
  var selectors = {
    search: '.search',
    searchSubmit: '.search__submit',
    searchInput: '.search__input',

    siteHeader: '.site-header',
    siteHeaderSearchToggle: '.js-search-toggle',

    searchHeader: '.search-header',
    searchHeaderInput: '.search-header__input',
    searchHeaderSubmit: '.search-header__submit',

    pageContent: '#PageContent'
  };

  var classes = {
    focus: 'search--focus',
    mobileNavIsOpen: 'js-menu--is-open',
    mobileSearchIsOpen: 'js-search--is-open'
  };

  var searchIsOpen = false;

  function init() {
    if (!$(selectors.siteHeader).length) {
      return;
    }

    $(selectors.searchSubmit).on('click', function(evt) {
      searchIsOpen = false;
      var $el = $(evt.target);
      var $input = $el.parents(selectors.search).find(selectors.searchInput);
      if ($input.val().length === 0) {
        evt.preventDefault();
        searchFocus($input);
      }
    });

    $(selectors.siteHeaderSearchToggle).on('click', activateSearch);

    $(selectors.searchHeaderInput).add(selectors.searchHeaderSubmit).on('focus', activateSearch);
    $(selectors.searchHeaderInput).add(selectors.searchHeaderSubmit).on('blur', deactivateSearch);
  }

  function activateSearch(evt) {
    if (evt.type != 'focus') {
      searchFocus($(selectors.searchInput));
    }
    searchIsOpen = true;

    $(selectors.searchHeader).addClass(classes.focus);
    $(selectors.pageContent).addClass(classes.mobileSearchIsOpen);
  }

  function deactivateSearch() {
    searchIsOpen = false;

    $(selectors.searchHeader).removeClass(classes.focus);
    $(selectors.pageContent).removeClass(classes.mobileSearchIsOpen);
  }

  function toggleSearch() {
    if (searchIsOpen) {
      
    } else {
      searchFocus($(selectors.searchInput));
      searchIsOpen = true;

      $(selectors.searchHeader).addClass(classes.focus);
      $(selectors.pageContent).addClass(classes.mobileSearchIsOpen);
    }
  }

  function searchFocus($el) {
    $el.focus();
    // set selection range hack for iOS
    $el[0].setSelectionRange(0, $el[0].value.length);
  }

  return {
    init: init
  };
})();

window.theme = window.theme || {};

theme.Slideshow = (function() {
  this.$slideshow = null;
  var classes = {
    wrapper: 'slideshow-wrapper',
    slideshow: 'slideshow',
    currentSlide: 'slick-current',
    video: 'slideshow__video',
    videoBackground: 'slideshow__video--background',
    closeVideoBtn: 'slideshow__video-control--close',
    pauseButton: 'slideshow__pause',
    isPaused: 'is-paused'
  };
  // #TODO: Make these more global
  var config = {
    mediaQuerySmall: 'screen and (max-width: 607px)',
    mediaQueryMedium: 'screen and (min-width: 608px) and (max-width: 991px)',
    mediaQueryLargeUp: 'screen and (min-width: 992px)'
  };
  var defaults = {
    accessibility: true,
    arrows: false,
    autoplay: false,
    autoplaySpeed: 7000,
    dots: false,
    draggable: true,
    fade: false,
    infinite: true,
    rows: 1,
    slidesPerRow: 1,
    slidesToScroll: 1,
    slidesToShow: 1,
    swipeToSlide: true,
    touchThreshold: 20,
    centerMode: false,
    centerPadding: '40px',
  };

  function slideshow(el) {
    this.$slideshow = $(el);

    if (!this.$slideshow.length) {
      return;
    }

    this.$wrapper = this.$slideshow.closest('.' + classes.wrapper) || this.parent();
    this.$pause = this.$wrapper.find('.' + classes.pauseButton);
    this.sliderActive = false;
    var elementOptions = this.$slideshow.data();

    defaults.prevArrow = '#' + this.$slideshow.attr('id') + ' ~ .slideshow__prev';
    defaults.nextArrow = '#' + this.$slideshow.attr('id') + ' ~ .slideshow__next';

    this.settings = {};
    this.settings.all = {
      fade: elementOptions.fade ,
      draggable: elementOptions.draggable,
      arrows: elementOptions.arrows,
      autoplay: elementOptions.autoplay,
      autoplaySpeed: elementOptions.speed,
      dots: elementOptions.dots,
      infinite: elementOptions.infinite,
      slidesPerRow: elementOptions.perRow,
      slidesToScroll: elementOptions.slidesScroll,
      slidesToShow: elementOptions.slidesShow,
      rows: elementOptions.rows,
      centerMode: elementOptions.centerMode,
      centerPadding: elementOptions.centerPadding,
      focusOnSelect: elementOptions.focusOnSelect,
      asNavFor: elementOptions.navFor,
      adaptiveHeight: elementOptions.adaptiveHeight
    };

    this.settings.desktop = {
      arrows: elementOptions.arrowsDesktop,
      autoplay: elementOptions.autoplayDesktop,
      autoplaySpeed: elementOptions.speedDesktop,
      dots: elementOptions.dotsDesktop,
      infinite: elementOptions.infiniteDesktop,
      slidesPerRow: elementOptions.perRowDesktop,
      slidesToScroll: elementOptions.slidesScrollDesktop,
      slidesToShow: elementOptions.slidesShowDesktop,
      rows: elementOptions.rowsDesktop,
      centerMode: elementOptions.centerModeDesktop,
      centerPadding: elementOptions.centerPaddingDesktop,
      focusOnSelect: elementOptions.focusOnSelectDesktop,
    };
    this.settings.tablet = {
      arrows: elementOptions.arrowsTablet,
      autoplay: elementOptions.autoplayTablet,
      autoplaySpeed: elementOptions.speedTablet,
      dots: elementOptions.dotsTablet,
      infinite: elementOptions.infiniteTablet,
      slidesPerRow: elementOptions.perRowTablet,
      slidesToScroll: elementOptions.slidesScrollTablet,
      slidesToShow: elementOptions.slidesShowTablet ,
      rows: elementOptions.rowsTablet,
      centerMode: elementOptions.centerModeTablet,
      centerPadding: elementOptions.centerPaddingTablet,
      focusOnSelect: elementOptions.focusOnSelectTablet,
    };
    this.settings.mobile = {
      arrows: elementOptions.arrowsMobile,
      autoplay: elementOptions.autoplayMobile,
      autoplaySpeed: elementOptions.speedMobile,
      dots: elementOptions.dotsMobile,
      infinite: elementOptions.infiniteMobile,
      slidesPerRow: elementOptions.perRowMobile,
      slidesToScroll: elementOptions.slidesScrollMobile,
      slidesToShow: elementOptions.slidesShowMobile,
      rows: elementOptions.rowsMobile,
      centerMode: elementOptions.centerModeMobile,
      centerPadding: elementOptions.centerPaddingMobile,
      focusOnSelect: elementOptions.focusOnSelectMobile,
    };

    _.defaults(this.settings.desktop, this.settings.all);
    _.defaults(this.settings.desktop, defaults);

    _.defaults(this.settings.tablet, this.settings.all);
    _.defaults(this.settings.tablet, defaults);

    _.defaults(this.settings.mobile, this.settings.all);
    _.defaults(this.settings.mobile, defaults);

    this.$slideshow.on('beforeChange', beforeChange.bind(this));
    this.$slideshow.on('init', slideshowA11y.bind(this));
    // this.$slideshow.slick(this.settings);

    var self = this;

    enquire.register(config.mediaQuerySmall, {
      match: function() {
        if (!elementOptions.disableMobile) {
          initSlider(self.$slideshow, self.settings.mobile);
        } else {
          destroySlider(self.$slideshow);
        }
      }
    });

    enquire.register(config.mediaQueryMedium, {
      match: function() {
        if (!elementOptions.disableTablet) {
          initSlider(self.$slideshow, self.settings.tablet);
        } else {
          destroySlider(self.$slideshow);
        }
      }
    });

    enquire.register(config.mediaQueryLargeUp, {
      match: function() {
        if (!elementOptions.disableDesktop) {
          initSlider(self.$slideshow, self.settings.desktop);
        } else {
          destroySlider(self.$slideshow);
        }
      }
    });

    function initSlider(sliderObj, args) {
      if (self.sliderActive) {
        sliderObj.slick('unslick');
        self.sliderActive = false;
      }

      sliderObj.slick(args);
      self.sliderActive = true;
    }

    function destroySlider(sliderObj) {
      if (self.sliderActive) {
        sliderObj.slick('unslick');
        self.sliderActive = false;
      }
    }

    this.$pause.on('click', this.togglePause.bind(this));
  }

  function slideshowA11y(event, obj) {
    var $slider = obj.$slider;
    var $list = obj.$list;
    var $wrapper = this.$wrapper;
    var autoplay = this.settings.autoplay;

    // Remove default Slick aria-live attr until slider is focused
    $list.removeAttr('aria-live');

    // When an element in the slider is focused
    // pause slideshow and set aria-live.
    $wrapper.on('focusin', function(evt) {
      if (!$wrapper.has(evt.target).length) {
        return;
      }

      $list.attr('aria-live', 'polite');

      if (autoplay) {
        $slider.slick('slickPause');
      }
    });

    // Resume autoplay
    $wrapper.on('focusout', function(evt) {
      if (!$wrapper.has(evt.target).length) {
        return;
      }

      $list.removeAttr('aria-live');

      if (autoplay) {
        // Manual check if the focused element was the video close button
        // to ensure autoplay does not resume when focus goes inside YouTube iframe
        if ($(evt.target).hasClass(classes.closeVideoBtn)) {
          return;
        }

        $slider.slick('slickPlay');
      }
    });

    // Add arrow key support when focused
    if (obj.$dots) {
      obj.$dots.on('keydown', function(evt) {
        if (evt.which === 37) {
          $slider.slick('slickPrev');
        }

        if (evt.which === 39) {
          $slider.slick('slickNext');
        }

        // Update focus on newly selected tab
        if ((evt.which === 37) || (evt.which === 39)) {
          obj.$dots.find('.slick-active button').focus();
        }
      });
    }
  }

  function beforeChange(event, slick, currentSlide, nextSlide) {
    var $slider = slick.$slider;
    var $currentSlide = $slider.find('.' + classes.currentSlide);
    var $nextSlide = $slider.find('.slideshow__slide[data-slick-index="' + nextSlide + '"]');

    if (isVideoInSlide($currentSlide)) {
      var $currentVideo = $currentSlide.find('.' + classes.video);
      var currentVideoId = $currentVideo.attr('id');
      theme.SlideshowVideo.pauseVideo(currentVideoId);
      $currentVideo.attr('tabindex', '-1');
    }

    if (isVideoInSlide($nextSlide)) {
      var $video = $nextSlide.find('.' + classes.video);
      var videoId = $video.attr('id');
      var isBackground = $video.hasClass(classes.videoBackground);
      if (isBackground) {
        theme.SlideshowVideo.playVideo(videoId);
      } else {
        $video.attr('tabindex', '0');
      }
    }
  }

  function isVideoInSlide($slide) {
    return $slide.find('.' + classes.video).length;
  }

  slideshow.prototype.togglePause = function() {
    var slideshowSelector = getSlideshowId(this.$pause);
    if (this.$pause.hasClass(classes.isPaused)) {
      this.$pause.removeClass(classes.isPaused);
      $(slideshowSelector).slick('slickPlay');
    } else {
      this.$pause.addClass(classes.isPaused);
      $(slideshowSelector).slick('slickPause');
    }
  };

  function getSlideshowId($el) {
    return '#Slideshow-' + $el.data('id');
  }

  return slideshow;
})();

// Youtube API callback
// eslint-disable-next-line no-unused-vars
function onYouTubeIframeAPIReady() {
  theme.SlideshowVideo.loadVideos();
}

theme.SlideshowVideo = (function() {
  var autoplayCheckComplete = false;
  var autoplayAvailable = false;
  var playOnClickChecked = false;
  var playOnClick = false;
  var youtubeLoaded = false;
  var videos = {};
  var videoPlayers = [];
  var videoOptions = {
    ratio: 16 / 9,
    playerVars: {
      // eslint-disable-next-line camelcase
      iv_load_policy: 3,
      modestbranding: 1,
      autoplay: 0,
      controls: 0,
      showinfo: 0,
      wmode: 'opaque',
      branding: 0,
      autohide: 0,
      rel: 0
    },
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerChange
    }
  };
  var classes = {
    playing: 'video-is-playing',
    paused: 'video-is-paused',
    loading: 'video-is-loading',
    loaded: 'video-is-loaded',
    slideshowWrapper: 'slideshow-wrapper',
    slide: 'slideshow__slide',
    slideBackgroundVideo: 'slideshow__slide--background-video',
    slideDots: 'slick-dots',
    videoChrome: 'slideshow__video--chrome',
    videoBackground: 'slideshow__video--background',
    playVideoBtn: 'slideshow__video-control--play',
    closeVideoBtn: 'slideshow__video-control--close',
    currentSlide: 'slick-current',
    slickClone: 'slick-cloned',
    supportsAutoplay: 'autoplay',
    supportsNoAutoplay: 'no-autoplay'
  };

  /**
    * Public functions
   */
  function init($video) {
    if (!$video.length) {
      return;
    }

    videos[$video.attr('id')] = {
      id: $video.attr('id'),
      videoId: $video.data('id'),
      type: $video.data('type'),
      status: $video.data('type') === 'chrome' ? 'closed' : 'background', // closed, open, background
      videoSelector: $video.attr('id'),
      $parentSlide: $video.closest('.' + classes.slide),
      $parentSlideshowWrapper: $video.closest('.' + classes.slideshowWrapper),
      controls: $video.data('type') === 'background' ? 0 : 1,
      slideshow: $video.data('slideshow')
    };

    if (!youtubeLoaded) {
      // This code loads the IFrame Player API code asynchronously.
      var tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }
  }

  function customPlayVideo(playerId) {
    // Do not autoplay just because the slideshow asked you to.
    // If the slideshow asks to play a video, make sure
    // we have done the playOnClick check first
    if (!playOnClickChecked && !playOnClick) {
      return;
    }

    if (playerId && typeof videoPlayers[playerId].playVideo === 'function') {
      privatePlayVideo(playerId);
    }
  }

  function pauseVideo(playerId) {
    if (videoPlayers[playerId] && typeof videoPlayers[playerId].pauseVideo === 'function') {
      videoPlayers[playerId].pauseVideo();
    }
  }

  function loadVideos() {
    for (var key in videos) {
      if (videos.hasOwnProperty(key)) {
        var args = $.extend({}, videoOptions, videos[key]);
        args.playerVars.controls = args.controls;
        videoPlayers[key] = new YT.Player(key, args);
      }
    }

    initEvents();
    youtubeLoaded = true;
  }

  function loadVideo(key) {
    if (!youtubeLoaded) {
      return;
    }
    var args = $.extend({}, videoOptions, videos[key]);
    args.playerVars.controls = args.controls;
    videoPlayers[key] = new YT.Player(key, args);

    initEvents();
  }

  /**
    * Private functions
   */

  function privatePlayVideo(id, clicked) {
    var videoData = videos[id];
    var player = videoPlayers[id];
    var $slide = videos[id].$parentSlide;

    if (playOnClick) {
      // playOnClick means we are probably on mobile (no autoplay).
      // setAsPlaying will show the iframe, requiring another click
      // to play the video.
      setAsPlaying(videoData);
    } else if (clicked || (autoplayCheckComplete && autoplayAvailable)) {
      // Play if autoplay is available or clicked to play
      $slide.removeClass(classes.loading);
      setAsPlaying(videoData);
      player.playVideo();
      return;
    }

    // Check for autoplay if not already done
    if (!autoplayCheckComplete) {
      autoplayCheckFunction(player, $slide);
    }
  }

  function setAutoplaySupport(supported) {
    var supportClass = supported ? classes.supportsAutoplay : classes.supportsNoAutoplay;
    $(document.documentElement).addClass(supportClass);

    if (!supported) {
      playOnClick = true;
    }

    autoplayCheckComplete = true;
  }

  function autoplayCheckFunction(player, $slide) {
    // attempt to play video
    player.playVideo();

    autoplayTest(player)
      .then(function() {
        setAutoplaySupport(true);
      })
      .fail(function() {
        // No autoplay available (or took too long to start playing).
        // Show fallback image. Stop video for safety.
        setAutoplaySupport(false);
        player.stopVideo();
      })
      .always(function() {
        autoplayCheckComplete = true;
        $slide.removeClass(classes.loading);
      });
  }

  function autoplayTest(player) {
    var deferred = $.Deferred();
    var wait;
    var timeout;

    wait = setInterval(function() {
      if (player.getCurrentTime() <= 0) {
        return;
      }

      autoplayAvailable = true;
      clearInterval(wait);
      clearTimeout(timeout);
      deferred.resolve();
    }, 500);

    timeout = setTimeout(function() {
      clearInterval(wait);
      deferred.reject();
    }, 4000); // subjective. test up to 8 times over 4 seconds

    return deferred;
  }

  function playOnClickCheck() {
    // Bail early for a few instances:
    // - small screen
    // - device sniff mobile browser

    if (playOnClickChecked) {
      return;
    }

    if ($(window).width() < 750) {
      playOnClick = true;
    } else if (isMobile.any) {
      playOnClick = true;
    }

    if (playOnClick) {
      // No need to also do the autoplay check
      setAutoplaySupport(false);
    }

    playOnClickChecked = true;
  }

  // The API will call this function when each video player is ready
  function onPlayerReady(evt) {
    evt.target.setPlaybackQuality('hd1080');
    var videoData = getVideoOptions(evt);

    playOnClickCheck();

    // Prevent tabbing through YouTube player controls until visible
    $('#' + videoData.id).attr('tabindex', '-1');

    sizeBackgroundVideos();

    // Customize based on options from the video ID
    switch (videoData.type) {
      case 'background-chrome':
      case 'background':
        evt.target.mute();
        // Only play the video if it is in the active slide
        if (videoData.$parentSlide.hasClass(classes.currentSlide)) {
          privatePlayVideo(videoData.id);
        }
        break;
    }

    videoData.$parentSlide.addClass(classes.loaded);
  }

  function onPlayerChange(evt) {
    var videoData = getVideoOptions(evt);

    switch (evt.data) {
      case 0: // ended
        setAsFinished(videoData);
        break;
      case 1: // playing
        setAsPlaying(videoData);
        break;
      case 2: // paused
        setAsPaused(videoData);
        break;
    }
  }

  function setAsFinished(videoData) {
    switch (videoData.type) {
      case 'background':
        videoPlayers[videoData.id].seekTo(0);
        break;
      case 'background-chrome':
        videoPlayers[videoData.id].seekTo(0);
        closeVideo(videoData.id);
        break;
      case 'chrome':
        closeVideo(videoData.id);
        break;
    }
  }

  function setAsPlaying(videoData) {
    var $slideshow = videoData.$parentSlideshowWrapper;
    var $slide = videoData.$parentSlide;

    $slide.removeClass(classes.loading);

    // Do not change element visibility if it is a background video
    if (videoData.status === 'background') {
      return;
    }

    $('#' + videoData.id).attr('tabindex', '0');

    switch (videoData.type) {
      case 'chrome':
      case 'background-chrome':
        $slideshow
          .removeClass(classes.paused)
          .addClass(classes.playing);
        $slide
          .removeClass(classes.paused)
          .addClass(classes.playing);
        break;
    }

    // Update focus to the close button so we stay within the slide
    $slide.find('.' + classes.closeVideoBtn).focus();
  }

  function setAsPaused(videoData) {
    var $slideshow = videoData.$parentSlideshowWrapper;
    var $slide = videoData.$parentSlide;

    if (videoData.type === 'background-chrome') {
      closeVideo(videoData.id);
      return;
    }

    // YT's events fire after our click event. This status flag ensures
    // we don't interact with a closed or background video.
    if (videoData.status !== 'closed' && videoData.type !== 'background') {
      $slideshow.addClass(classes.paused);
      $slide.addClass(classes.paused);
    }

    if (videoData.type === 'chrome' && videoData.status === 'closed') {
      $slideshow.removeClass(classes.paused);
      $slide.removeClass(classes.paused);
    }

    $slideshow.removeClass(classes.playing);
    $slide.removeClass(classes.playing);
  }

  function closeVideo(playerId) {
    var videoData = videos[playerId];
    var $slideshow = videoData.$parentSlideshowWrapper;
    var $slide = videoData.$parentSlide;
    var classesToRemove = [classes.pause, classes.playing].join(' ');

    $('#' + videoData.id).attr('tabindex', '-1');

    videoData.status = 'closed';

    switch (videoData.type) {
      case 'background-chrome':
        videoPlayers[playerId].mute();
        setBackgroundVideo(playerId);
        break;
      case 'chrome':
        videoPlayers[playerId].stopVideo();
        setAsPaused(videoData); // in case the video is already paused
        break;
    }

    $slideshow.removeClass(classesToRemove);
    $slide.removeClass(classesToRemove);
  }

  function getVideoOptions(evt) {
    return videos[evt.target.h.id];
  }

  function startVideoOnClick(playerId) {
    var videoData = videos[playerId];
    // add loading class to slide
    videoData.$parentSlide.addClass(classes.loading);

    videoData.status = 'open';

    switch (videoData.type) {
      case 'background-chrome':
        unsetBackgroundVideo(playerId, videoData);
        videoPlayers[playerId].unMute();
        privatePlayVideo(playerId, true);
        break;
      case 'chrome':
        privatePlayVideo(playerId, true);
        break;
    }

    // esc to close video player
    $(document).on('keydown.videoPlayer', function(evt) {
      if (evt.keyCode === 27) {
        closeVideo(playerId);
      }
    });
  }

  function sizeBackgroundVideos() {
    $('.' + classes.videoBackground).each(function(index, el) {
      sizeBackgroundVideo($(el));
    });
  }

  function sizeBackgroundVideo($player) {
    var $slide = $player.closest('.' + classes.slide);
    // Ignore cloned slides
    if ($slide.hasClass(classes.slickClone)) {
      return;
    }
    var slideWidth = $slide.width();
    var playerWidth = $player.width();
    var playerHeight = $player.height();

    // when screen aspect ratio differs from video, video must center and underlay one dimension
    if (slideWidth / videoOptions.ratio < playerHeight) {
      playerWidth = Math.ceil(playerHeight * videoOptions.ratio); // get new player width
      $player.width(playerWidth).height(playerHeight).css({
        left: (slideWidth - playerWidth) / 2,
        top: 0
      }); // player width is greater, offset left; reset top
    } else { // new video width < window width (gap to right)
      playerHeight = Math.ceil(slideWidth / videoOptions.ratio); // get new player height
      $player.width(slideWidth).height(playerHeight).css({
        left: 0,
        top: (playerHeight - playerHeight) / 2
      }); // player height is greater, offset top; reset left
    }

    $player
      .prepareTransition()
      .addClass(classes.loaded);
  }

  function unsetBackgroundVideo(playerId) {
    // Switch the background-chrome to a chrome-only player once played
    $('#' + playerId)
      .removeAttr('style')
      .removeClass(classes.videoBackground)
      .addClass(classes.videoChrome);

    videos[playerId].$parentSlideshowWrapper
      .removeClass(classes.slideBackgroundVideo)
      .addClass(classes.playing);

    videos[playerId].$parentSlide
      .removeClass(classes.slideBackgroundVideo)
      .addClass(classes.playing);

    videos[playerId].status = 'open';
  }

  function setBackgroundVideo(playerId) {
    // Switch back to background-chrome when closed
    var $player = $('#' + playerId)
      .addClass(classes.videoBackground)
      .removeClass(classes.videoChrome);

    videos[playerId].$parentSlide
      .addClass(classes.slideBackgroundVideo);

    videos[playerId].status = 'background';
    sizeBackgroundVideo($player);
  }

  function initEvents() {
    $(document).on('click.videoPlayer', '.' + classes.playVideoBtn, function(evt) {
      var playerId = $(evt.currentTarget).data('controls');
      startVideoOnClick(playerId);
    });

    $(document).on('click.videoPlayer', '.' + classes.closeVideoBtn, function(evt) {
      var playerId = $(evt.currentTarget).data('controls');
      closeVideo(playerId);
    });

    // Listen to resize to keep a background-size:cover-like layout
    $(window).on('resize.videoPlayer', $.debounce(250, function() {
      if (youtubeLoaded) {
        sizeBackgroundVideos();
      }
    }));
  }

  function removeEvents() {
    $(document).off('.videoPlayer');
    $(window).off('.videoPlayer');
  }

  return {
    init: init,
    loadVideos: loadVideos,
    loadVideo: loadVideo,
    playVideo: customPlayVideo,
    pauseVideo: pauseVideo,
    removeEvents: removeEvents
  };
})();

(function() {
  var selectors = {
    backButton: '.return-link'
  };

  var $backButton = $(selectors.backButton);

  if (!document.referrer || !$backButton.length || !window.history.length) {
    return;
  }

  $backButton.one('click', function(evt) {
    evt.preventDefault();

    var referrerDomain = urlDomain(document.referrer);
    var shopDomain = urlDomain(window.location.href);

    if (shopDomain === referrerDomain) {
      history.back();
    }

    return false;
  });

  function urlDomain(url) {
    var anchor = document.createElement('a');
    anchor.ref = url;

    return anchor.hostname;
  }
})();

/**
* Module to show Recently Viewed Products
*
* Copyright (c) 2014 Caroline Schnapp (11heavens.com)
* Dual licensed under the MIT and GPL licenses:
* http://www.opensource.org/licenses/mit-license.php
* http://www.gnu.org/licenses/gpl.html
*
*/

window.theme = window.theme || {};

theme.RecentlyViewed = (function() {

  var config = {
    howManyToShow: 3,
    howManyToStoreInMemory: 10,
    wrapperId: 'recently-viewed-products',
    templateId: 'recently-viewed-product-template',
    onComplete: null
  };

  var productHandleQueue = [];
  var wrapper = null;
  var template = null;
  var shown = 0;

  var cookie = {
    configuration: {
      expires: 90,
      path: '/',
      domain: window.location.hostname
    },
    name: 'shopify_recently_viewed',
    write: function(recentlyViewed) {
      jQuery.cookie(this.name, recentlyViewed.join(' '), this.configuration);
    },
    read: function() {
      var recentlyViewed = [];
      var cookieValue = jQuery.cookie(this.name);
      if (cookieValue !== null) {
        recentlyViewed = cookieValue.split(' ');
      }
      return recentlyViewed;
    },
    destroy: function() {
      jQuery.cookie(this.name, null, this.configuration);
    },
    remove: function(productHandle) {
      var recentlyViewed = this.read();
      var position = jQuery.inArray(productHandle, recentlyViewed);
      if (position !== -1) {
        recentlyViewed.splice(position, 1);
        this.write(recentlyViewed);
      }
    }
  };

  var finalize = function() {
    wrapper.show();
    // If we have a callback.
    if (config.onComplete) {
      try { config.onComplete() } catch (error) {}
    }
  };

  var moveAlong = function() {
    if (productHandleQueue.length && shown < config.howManyToShow) {
      jQuery.ajax({
        dataType: 'json',
        url: '/products/' + productHandleQueue[0] + '.js',
        cache: false,
        success: function(product) {
          template.tmpl(product).appendTo(wrapper);
          productHandleQueue.shift();
          shown++;
          moveAlong();
        },
        error: function() {
          cookie.remove(productHandleQueue[0]);
          productHandleQueue.shift();
          moveAlong();
        }
      });
    } else {
      finalize();
    }

  };

  return {

    resizeImage: function(src, size) {
      if (size == null) {
        return src;
      }

      if (size == 'master') {
        return src.replace(/http(s)?:/, "");
      }

      var match = src.match(/\.(jpg|jpeg|gif|png|bmp|bitmap|tiff|tif)(\?v=\d+)?/i);

      if (match != null) {
        var prefix = src.split(match[0]);
        var suffix = match[0];

        return (prefix[0] + "_" + size + suffix).replace(/http(s)?:/, "")
      } else {
        return null;
      }
    },

    showRecentlyViewed: function(params) {

      var params = params || {};

      // Update defaults.
      jQuery.extend(config, params);

      // Read cookie.
      productHandleQueue = cookie.read();

      // Template and element where to insert.
      template = jQuery('#' + config.templateId);
      wrapper = jQuery('#' + config.wrapperId);

      // How many products to show.
      config.howManyToShow = Math.min(productHandleQueue.length, config.howManyToShow);

      // If we have any to show.
      if (config.howManyToShow && template.length && wrapper.length) {
        // Getting each product with an Ajax call and rendering it on the page.
        moveAlong();
      }

    },

    getConfig: function() {
      return config;
    },

    clearList: function() {
      cookie.destroy();
    },

    recordRecentlyViewed: function(params) {

      var params = params || {};

      // Update defaults.
      jQuery.extend(config, params);

      // Read cookie.
      var recentlyViewed = cookie.read();

      // If we are on a product page.
      if (window.location.pathname.indexOf('/products/') !== -1) {

        // What is the product handle on this page.
        var productHandle = window.location.pathname.match(/\/products\/([a-z0-9\-]+)/)[1];
        // In what position is that product in memory.
        var position = jQuery.inArray(productHandle, recentlyViewed);
        // If not in memory.
        if (position === -1) {
          // Add product at the start of the list.
          recentlyViewed.unshift(productHandle);
          // Only keep what we need.
          recentlyViewed = recentlyViewed.splice(0, config.howManyToStoreInMemory);
        } else {
          // Remove the product and place it at start of list.
          recentlyViewed.splice(position, 1);
          recentlyViewed.unshift(productHandle);
        }

        // Update cookie.
        cookie.write(recentlyViewed);

      }

    }

  };

})();

(function() {
  var selectors = {
    backButton: '.back-to-top',
  };

  var classes = {
    visible: 'back-to-top--visible',
    fade: 'back-to-top--fade',
  };

  var config = {
    showAfter: 300,
    dimAfter: 1200,
    scrollDuration: 700,
  };

  $backButton = $(selectors.backButton);

  if (!$backButton.length) {
    return;
  }
  
  $(window).scroll(function(){
    ( $(this).scrollTop() > config.showAfter ) ? $backButton.addClass(classes.visible) : $backButton.removeClass(classes.visible + ' ' + classes.fade);
    if( $(this).scrollTop() > config.dimAfter ) {
      $backButton.addClass(classes.fade);
    }
  });

  $backButton.on('click', function(evt){
    evt.preventDefault();
    $('body,html').animate({scrollTop: 0}, config.scrollDuration);
  });
})();

/*============================================================================
  Favicon cart counter
==============================================================================*/
window.theme = window.theme || {};

theme.Favicon = (function() {

  if (window.Favico === undefined) {
    return;
  }

  var icon = new Favico({
    bgColor: '#0cbdc9',
    textColor: '#fff',
    fontFamily: 'sans-serif', // Arial, Verdana, Times New Roman, serif, sans-serif, ...
    fontStyle: 'bold', // normal, italic, oblique, bold, bolder, lighter, 100, 200, 300, 400, 500, 600, 700, 800, 900
    type: 'circle', // circle, rectangle
    position: 'down', // up, down, left, upleft
    animation: 'none', // slide, fade, pop, popFade, none
    elementId: false, // Image element ID if there is need to attach badge to regular image
    element: false, // DOM element where to change "href" attribute (useful in case of multiple link icon elements)
    dataUrl: false, // Method that will be called for each animation from with data URI parameter
  });

  if (window.shop.cart !== undefined && window.shop.cart.item_count > 0) {
    set(window.shop.cart.item_count);
  }

  function set(value) {
    icon.badge(value);
  }

  function reset() {
    icon.reset();
  }

  return {
    set: set,
    reset: reset
  };
})();

/*
 * Adapted from Currency tools by Caroline Schnapp
 *
 * Copyright (c) 2015 Caroline Schnapp (mllegeorgesand@gmail.com)
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/mit-license.php
 *
 */ 

window.theme = window.theme || {};

theme.CurrencySelectors = (function() {

  function init() {
    Currency.format = shop.currencyFormat;

    var shopCurrency = shop.currency;

    /* Sometimes merchants change their shop currency, let's tell our JavaScript file */
    Currency.moneyFormats[shopCurrency].money_with_currency_format = shop.moneyWithCurrencyFormat;
    Currency.moneyFormats[shopCurrency].money_format = shop.moneyFormat;
      
    /* Default currency */
    var defaultCurrency = shop.defaultCurrency;
      
    /* Cookie currency */
    var cookieCurrency = Currency.cookie.read();

    /* Fix for customer account pages */
    $('span.money span.money').each(function() {
      $(this).parents('span.money').removeClass('money');
    });

    /* Saving the current price */
    $('span.money').each(function() {
      $(this).attr('data-currency-' + shop.currency, $(this).html());
    });

    // If there's no cookie.
    if (cookieCurrency == null) {
      if (shopCurrency !== defaultCurrency) {
        Currency.convertAll(shopCurrency, defaultCurrency);
      }
      else {
        Currency.currentCurrency = defaultCurrency;
      }
    }
    // If the cookie value does not correspond to any value in the currency dropdown.
    else if ($('[name=currencies]').length && $('[name=currencies] option[value=' + cookieCurrency + ']').length === 0) {
      Currency.currentCurrency = shopCurrency;
      Currency.cookie.write(shopCurrency);
    }
    else if (cookieCurrency === shopCurrency) {
      Currency.currentCurrency = shopCurrency;
    }
    else {
      Currency.convertAll(shopCurrency, cookieCurrency);
    }

    $('[name=currencies]').val(Currency.currentCurrency).change(function() {
      var newCurrency = $(this).val();
      Currency.convertAll(Currency.currentCurrency, newCurrency);
      $('.selected-currency').text(Currency.currentCurrency);
    });

    var original_selectCallback = window.selectCallback;
    var selectCallback = function(variant, selector) {
      original_selectCallback(variant, selector);
      Currency.convertAll(shopCurrency, $('[name=currencies]').val());
      $('.selected-currency').text(Currency.currentCurrency);
    };

    $(document).on('cart.requestComplete', function(event, cart) {
      Currency.convertAll(shopCurrency, $('[name=currencies]').val());
      $('.selected-currency').text(Currency.currentCurrency);
    });

    $('.selected-currency').text(Currency.currentCurrency);
    $('.currency-picker__wrapper').removeClass('loading');
  }

  return {
    init: init,
  };
})();

theme.CurrencySelectors.init();

theme.videoPlayers = theme.videoPlayers || {};

(function() {
  var selectors = {
    lightboxTriggers: '.video-lightbox__trigger, .rte a[href*="youtube.com"], .rte a[href*="youtu.be"]',
    placeholderImages: '.video-lightbox__trigger img.placeholder, .video-lightbox__trigger .placeholder-svg',
  };

  $(selectors.lightboxTriggers).yu2fvl({
    minPaddingX: 60, // the space you want on *top and bottom when centering the video (value is divided by 2)
    minPaddingY: 60, // the space you want on *left and right when centering the video (value is divided by 2)
    ratio: 16/9, // choose the ration you want for your video
    cssClass: "video-lightbox", // set a namespace / global css class
    overlayCssClass: "__overlay", // give a suffix css class for the overlay
    iframeCssClass: "__iframe", // give a suffix css class for the iframe
    closeCssClass: "__close", // give a suffix css class for the close button
    // #TODO: Handle the SVG close button a little more nicely
    closeText: "<svg viewBox=\"0 0 64 64\" xmlns=\"http://www.w3.org/2000/svg\"><g transform=\"translate(381 231)\"><path d=\"M-370.7-174.7l-2.3-2.3 46-46 2.3 2.3-46 46\"/><path d=\"M-327-174.7l-46-46 2.3-2.3 46 46-2.3 2.3\"/></g></svg>", // give some text for the close button
    vid: false, // set directly a youtube video id (though using an anchor is cool for SEO !)
    open: false // Open the lightbox immediately from JavaScript. Requires vid to be set to work properly.
  });

  var frameScript = document.createElement('script');
  frameScript.src = "https://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(frameScript, firstScriptTag);

  $(selectors.lightboxTriggers).on('click', function(evt){
    var videoID = $(this).data('video-id') || $(this).parent().data('video-id') || false;
    if (!videoID) {
      return;
    }

    var $iframe = $('.video-lightbox__iframe[src*=' + $(this).data('video-id') + ']')
    if (!$iframe.length) {
      return;
    }

    if (theme.videoPlayers[videoID] == undefined) {
      $iframe.attr('id','lightbox-video-' + videoID);
      theme.videoPlayers[videoID] = new YT.Player('lightbox-video-' + videoID, {
        events: {
          'onStateChange': onPlayerStateChange
        }
      });
    }
  });

  function onPlayerStateChange(evt) {
    var player = evt.target;
    if (player.getPlayerState !== undefined && player.getPlayerState() == 0) {
      player.seekTo(0);
      var videoID = evt.target.getVideoData().video_id;
      $('#lightbox-video-' + videoID + ' ~ .video-lightbox__close').trigger('click');
    }
  }

  var $placeholders = $(selectors.placeholderImages);

  if (!$placeholders.length) {
    return;
  }

  $placeholders.each(function(){
    var $el = $(this);
    var $trigger = $el.parents('.video-lightbox__trigger');
    var videoID = $el.data('video-id') || $trigger.data('video-id') || theme.utils.getYoutubeId($trigger.href);

    if (!videoID) { 
      return;
    }

    var image = new Image();
    image.src = 'https://i.ytimg.com/vi/' + videoID + '/maxresdefault.jpg';
    image.onload = function() {
      if (image.naturalWidth !== undefined && image.naturalWidth < 200 && image.src.indexOf('hqdefault') !== -1) {
        image.src = image.src.replace('sddefault', 'hqdefault').replace('maxresdefault', 'sddefault');
        return;
      }

      if ($el.hasClass('placeholder-svg')) {
        $el.parent('.video-lightbox__placeholder').replaceWith(image);
      } else {
        $el.attr('src', image.src);
      }
    }
  });
  
})();

window.theme = window.theme || {};

theme.NewsletterModal = (function() {

  var selectors = {
    modalContainer: '#newsletter-modal'
  };

  function init() {

    if (!$(selectors.modalContainer).length) {
      return;
    }

    var activationDelay = $(selectors.modalContainer).attr('data-delay'),
        cookieExpiry = $(selectors.modalContainer).attr('data-expiry'),
        forceModal = $(selectors.modalContainer).attr('data-force-modal'),
        userHasVisited = $.cookie('newsletterModalViewed') || false;

    if (forceModal) {
      activationDelay = 0;
    }

    if (userHasVisited || forceModal) {
      activateModal(activationDelay, cookieExpiry);
    }

    $.cookie('newsletterModalViewed', 'true', { expires: cookieExpiry, path: '/' });

    function activateModal(activationDelay, cookieExpiry) {
      
      $(document).on('scroll.newsletterModal', function(){
        $(document).off('scroll.newsletterModal');

        window.setTimeout(function(){
          $.featherlight($(selectors.modalContainer));
        }, activationDelay);

      });
      
    }

  }

  return init();

})();

window.theme = window.theme || {};

theme.StickyAddToCart = (function() {

  var selectors = {
    productDetails: '.product-single__col--details'
  };

  var stickybitsDefaults = {
    useFixed: true
  };

  var defaults = {
    selectors: selectors,
    useStickybits: false,
    stickybits: stickybitsDefaults,
    parent: '#MainContent',
    templateName: 'product-sticky-add-to-cart',
    revealClass: 'show',
    showOnLoad: false
  };

  function StickyAddToCart(options) {

    this.options = _.defaultsDeep(options, defaults);
    this.product = this.options.product;

    if (!this.product) {
      console.error('No product defined');
      return;
    }

    var self = this;

    this._build();
    this._bindReveal();

    this.isHidden = true;
    if (this.options.showOnLoad) {
      this.show();
    }
  }

  StickyAddToCart.prototype = $.extend({}, StickyAddToCart.prototype, {

    _build: function() {
      var self = this;

      var template = theme.utils.getTemplate(this.options.templateName);
      self.$el = $(template);
      $(self.options.parent).prepend(self.$el);

      // Bind StickyBits
      if (self.options.useStickybits) {
        self.$el.stickybits(self.options.stickybits);
      }

      // Bind TinyBind view
      // You can either bind here or in product.js
      // self.view = tinybind.bind(self.$el, { data: self }); 

      return;
    },

    _bindReveal: function() {
      var self = this;

      var waypointElement = $(selectors.productDetails)[0];

      self.waypoint = new Waypoint({
        element: waypointElement,
        handler: function(direction) {
          if (direction == 'down') {
            self.show();
          } else {
            self.hide();
          }
        },
        offset: function() {
          return -this.element.clientHeight + 150;
        }
      });

    },

    show: function() {
      var self = this;
      if (self.isHidden) {
        self.isHidden = false;
        self.$el.addClass(self.options.revealClass);
      }

    },

    hide: function() {
      var self = this;
      if (!self.isHidden) {
        self.isHidden = true;
        self.$el.removeClass(self.options.revealClass);
      }
    },

    destroy: function() {
      var self = this;
      self.$el.remove();
    }

  });

  return StickyAddToCart;
})();
window.theme = window.theme || {};

theme.Video = (function() {

  var selectors = {
    videoContainer: '.video',
  };

  var sources = {
    vimeo: 'https://player.vimeo.com/api/player.js',
    youtube: 'https://www.youtube.com/iframe_api'
  };

  var methods = {
    vimeo: function(elem) {
      var player = new Vimeo.Player(elem);
      player.play();
    },
    youtube: function(elem) {
      if((typeof YT !== "undefined") && YT && YT.Player){
        var player = new YT.Player(elem, {
         events: {
          'onReady': onPlayerReady
          }
        });
      }

      function onPlayerReady(event) {
        event.target.playVideo();
      }
    }
  };

  var cache = {
    videoTypes: [],
    videoTypesLoaded: []
  };

  function init() {
    if (!$(selectors.videoContainer).length) {
      return;
    }

    _loadPlayerAPIs();
  };

  function _loadPlayerAPIs() {
    var videoTypes = [];

    for (i = 0; i < $(selectors.videoContainer).length; i++) {
      var $videoContainer = $(selectors.videoContainer)[i],
          videoType       = $($videoContainer).attr('data-video-type');
      if (cache.videoTypes.indexOf(videoType) === -1) {
        cache.videoTypes.push(videoType);
      }
    }

    for (i = 0; i < cache.videoTypes.length; i++) {
      var videoType = cache.videoTypes[i];
      _includePlayer(videoType);
    }
  }

  function _includePlayer(type) {
    var source = sources[type];

    if (source == undefined ) {
      console.error('Video type ' + type + ' is not supported');
      return;
    }

    if ($('script[src="' + source + '"]').length) {
      cache.videoTypesLoaded.push(type);
      return;
    }

    loadJS(source, function() {
      cache.videoTypesLoaded.push(type);

      if (_checkAdditionalSources()) {
        _bindEventListeners();
        _autoPlay();
      }
    });
  }

  function _checkAdditionalSources() {
    for (i = 0; i < cache.videoTypes.length; i++) {
      var type = cache.videoTypes[i];
      if (cache.videoTypesLoaded.indexOf(type) === -1) {
        return false;
      }
    }
    return true;
  }

  function _autoPlay() {
    for (var i = $(selectors.videoContainer).length - 1; i >= 0; i--) {
      var $videoContainer = $(selectors.videoContainer)[i],
          videoIsVisible  = $($videoContainer).is(':visible'),
          videoType       = $($videoContainer).attr('data-video-type'),
          videoAutoPlay   = $($videoContainer).attr('data-video-autoplay');
          videoVisible   = $($videoContainer).attr('data-video-visible');

      if (videoIsVisible && videoAutoPlay == 'true' && videoVisible == 'true') {
         methods[videoType]($($videoContainer).find('iframe')[0]);
      }
    }
  }

  function _bindEventListeners() {
    $(selectors.videoContainer).on('click',_revealVideo);
  }

  function _revealVideo() {
    var videoType = $(this).attr('data-video-type'),
        videoId   = $(this).attr('data-video-id');

    methods[videoType]($(this).find('iframe')[0]);

    $(this).attr('data-video-visible','true');
  }

  return {
    init: init
  };

})();

theme.Video.init();
window.theme = window.theme || {};

theme.JournalArticle = (function() {

    function Slider(section) {
        var self = this;
        self.section = section;
        self.prev = self.section.find('.sl-prev');
        self.next = self.section.find('.sl-next');
        self.wrap = self.section.find('.sl-wrap');
        self.slider = self.wrap.find('.slider');
        self.slides = self.slider.find('.slide');
        
        self.build = function() {
            if (!self.slides.length) return false;
    
            self.wrap.removeClass('not-init');
            self.slider.slick({
                infinite: true,
                speed: 300,
                prevArrow: self.prev,
                nextArrow: self.next,
                slidesToShow: 4,
                slidesToScroll: 1,
                responsive: [
                    {
                        breakpoint: 992,
                        settings: {
                            slidesToShow: 2
                        }
                    },
                    {
                        breakpoint: 608,
                        settings: {
                            slidesToShow: 1
                        }
                    }
                ]
            });
        };
    }
    
    var initSliders = {
        init: function() {
            this.sections = $('.related-articles');
            if (!this.sections.length && $.fn.slick) return false;
    
            this.sections.each(function() {
                new Slider($(this)).build();
            });
        }
    };
    
    initSliders.init();

    return;
    
})();

/*================ Sections ================*/
window.theme = window.theme || {};

theme.Cart = (function() {
  var selectors = {
    edit: '.js-edit-toggle'
  };
  var config = {
    showClass: 'cart__update--show',
    showEditClass: 'cart__edit--active',
    cartNoCookies: 'cart--no-cookies'
  };

  function Cart(container) {
    this.$container = $(container);
    this.$edit = $(selectors.edit, this.$container);

    if (!this.cookiesEnabled()) {
      this.$container.addClass(config.cartNoCookies);
    }

    this.$edit.on('click', this._onEditClick.bind(this));
  }

  Cart.prototype = _.assignIn({}, Cart.prototype, {
    onUnload: function() {
      this.$edit.off('click', this._onEditClick);
    },

    _onEditClick: function(evt) {
      var $evtTarget = $(evt.target);
      var $updateLine = $('.' + $evtTarget.data('target'));

      $evtTarget.toggleClass(config.showEditClass);
      $updateLine.toggleClass(config.showClass);
    },

    cookiesEnabled: function() {
      var cookieEnabled = navigator.cookieEnabled;

      if (!cookieEnabled){
        document.cookie = 'testcookie';
        cookieEnabled = (document.cookie.indexOf('testcookie') !== -1);
      }
      return cookieEnabled;
    }
  });

  return Cart;
})();

window.theme = window.theme || {};

theme.Filters = (function() {
  var constants = {
    SORT_BY: 'sort_by'
  };
  var selectors = {
    filterSelection: '.collection-filters__dropdown--filter',
    sortSelection: '.collection-filters__dropdown--sort',
    defaultSort: '.collection-filters__default-sort',
    filterPlaceholderDesktop: '.collection-filters-placeholder--desktop',
    filterPlaceholderMobile: '.collection-filters-placeholder--mobile',
    filterContentDesktop: '.collection-filters-content--desktop',
    filterContentMobile: '.collection-filters-content--mobile',
    filterSection: '[data-section-type="collection-filters"]',
    filterSectionWrapper: '#shopify-section-collection-filters',
  };

  function Filters(container) {
    var $container = this.$container = $(container);

    this.initFilters();
    
    this.$filterSelects = $(selectors.filterSelection, $container);
    this.$sortSelect = $(selectors.sortSelection, $container);
    this.$selects = $(selectors.filterSelection, $container).add($(selectors.sortSelection, $container));

    this.defaultSort = this._getDefaultSortValue();
    this._resizeSelect(this.$selects);
    this.$selects.removeClass('hidden');

    this.$filterSelects.on('change', this._onFilterChange.bind(this));
    this.$sortSelect.on('change', this._onSortChange.bind(this));
  }

  Filters.prototype = _.assignIn({}, Filters.prototype, {

    /**
     * Initialises filters
     */
    initFilters: function() {
      var self = this;
      var $filterSectionWrapper = $(selectors.filterSectionWrapper);

      var $filterContentMobile = $(selectors.filterContentMobile, $filterSectionWrapper).html();
      var $filterContentDesktop = $(selectors.filterContentDesktop, $filterSectionWrapper).html();

      $(selectors.filterPlaceholderMobile, this.$container).replaceWith($filterContentMobile);
      $(selectors.filterPlaceholderDesktop, this.$container).replaceWith($filterContentDesktop);
    },

    _onSortChange: function(evt) {
      var sort = this._sortValue();
      if (sort.length) {
        window.location.search = sort;
      } else {
        // clean up our url if the sort value is blank for default
        window.location.href = window.location.href.replace(window.location.search, '');
      }
      this._resizeSelect($(evt.target));
    },

    _onFilterChange: function(evt) {
      // window.location.href = $(evt.target).val() + window.location.search;
      var newLocation = $(evt.target).val();
      if (window.location.search != '') {
        var currentQueryParams = theme.utils.getQueryParams();
        for (var k in currentQueryParams) {
          if (currentQueryParams.hasOwnProperty(k)) {
            newLocation = theme.utils.updateQueryStringParameter(k, currentQueryParams[k], newLocation);
          }
        }
        var newQueryParams = theme.utils.getQueryParams(newLocation);
        for (var k in newQueryParams) {
          if (newQueryParams.hasOwnProperty(k)) {
            newLocation = theme.utils.updateQueryStringParameter(k, newQueryParams[k], newLocation);
          }
        }
        window.location.href = newLocation;
      }
      this._resizeSelect($(evt.target));
    },

    _getSortValue: function() {
      return this.$sortSelect.val() || this.defaultSort;
    },

    _getDefaultSortValue: function() {
      return $(selectors.defaultSort, this.$container).val();
    },

    _sortValue: function() {
      var sort = this._getSortValue();
      var query = '';

      if (sort !== this.defaultSort) {
        query = constants.SORT_BY + '=' + sort;
      }

      return query;
    },

    _resizeSelect: function($selection) {
      $selection.each(function() {
        var $this = $(this);
        var arrowWidth = 10;
        // create test element
        var text = $this.find('option:selected').text();
        var $test = $('<span>').html(text);

        // add to body, get width, and get out
        $test.appendTo('body');
        var width = $test.width();
        $test.remove();

        // set select width
        $this.width(width + 5 + arrowWidth);
      });
    },

    onUnload: function() {
      this.$filterSelects.off('change', this._onFilterChange);
      this.$sortSelect.off('change', this._onSortChange);
    }
  });

  return Filters;
})();

window.theme = window.theme || {};

theme.Collection = (function() {

  var selectors = {
    subNav: '.collection-sub-nav'
  }

  var options = {
    stickybits: {}
  }

function collection(container) {

      this.$container = $(container);
      this.filters = new theme.Filters(container);

      this.$subNav = $(selectors.subNav);
      this.$subNav.stickybits(options.stickybits);
  }

  return collection;
})();

theme.HeaderSection = (function() {

  function Header(container) {
    var header = new theme.Header(container);
    theme.MobileNav.init();
    theme.Search.init();
  }

  Header.prototype = _.assignIn({}, Header.prototype, {
    onUnload: function() {
      theme.Header.unload();
    }
  });

  return Header;
})();

theme.Maps = (function() {
  var config = {
    zoom: 14
  };
  var apiStatus = null;
  var mapsToLoad = [];
  var key = theme.mapKey ? theme.mapKey : '';

  function Map(container) {
    this.$container = $(container);

    if (apiStatus === 'loaded') {
      this.createMap();
    } else {
      mapsToLoad.push(this);

      if (apiStatus !== 'loading') {
        apiStatus = 'loading';
        if (typeof window.google === 'undefined') {
          $.getScript('https://maps.googleapis.com/maps/api/js?key=' + key)
            .then(function() {
              apiStatus = 'loaded';
              initAllMaps();
            });
        }
      }
    }
  }

  function initAllMaps() {
    // API has loaded, load all Map instances in queue
    $.each(mapsToLoad, function(index, instance) {
      instance.createMap();
    });
  }

  function geolocate($map) {
    var deferred = $.Deferred();
    var geocoder = new google.maps.Geocoder();
    var address = $map.data('address-setting');

    geocoder.geocode({address: address}, function(results, status) {
      if (status !== google.maps.GeocoderStatus.OK) {
        deferred.reject(status);
      }

      deferred.resolve(results);
    });

    return deferred;
  }

  Map.prototype = _.assignIn({}, Map.prototype, {
    createMap: function() {
      var $map = this.$container.find('.map-section__container');

      return geolocate($map)
        .then(function(results) {
          var mapOptions = {
            zoom: config.zoom,
            center: results[0].geometry.location,
            disableDefaultUI: true
          };

          var map = this.map = new google.maps.Map($map[0], mapOptions);
          var center = this.center = map.getCenter();

          //eslint-disable-next-line no-unused-vars
          var marker = new google.maps.Marker({
            map: map,
            position: map.getCenter()
          });

          google.maps.event.addDomListener(window, 'resize', $.debounce(250, function() {
            google.maps.event.trigger(map, 'resize');
            map.setCenter(center);
          }));
        }.bind(this))
        .fail(function() {
          var errorMessage;

          switch (status) {
            case 'ZERO_RESULTS':
              errorMessage = theme.strings.addressNoResults;
              break;
            case 'OVER_QUERY_LIMIT':
              errorMessage = theme.strings.addressQueryLimit;
              break;
            default:
              errorMessage = theme.strings.addressError;
              break;
          }

          $map
            .parent()
            .addClass('page-width map-section--load-error')
            .html('<div class="errors text-center">' + errorMessage + '</div>');
        });
    },

    onUnload: function() {
      google.maps.event.clearListeners(this.map, 'resize');
    }
  });

  return Map;
})();

// Global function called by Google on auth errors.
// Show an auto error message on all map instances.
// eslint-disable-next-line camelcase, no-unused-vars
function gm_authFailure() {
  $('.map-section').addClass('map-section--load-error');
  $('.map-section__container').remove();
  $('.map-section__link').remove();
  $('.map-section__overlay').after('<div class="errors text-center">' + theme.strings.authError + '</div>');
}

/**
 * Product Template Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Product template.
 *
 * @namespace product
 */

theme.Product = (function() {

  var selectors = {
    addToCart: '[data-add-to-cart]',
    addToCartText: '[data-add-to-cart-text]',
    comparePrice: '[data-compare-price]',
    comparePriceText: '[data-compare-text]',
    originalSelectorId: '[data-product-select]',
    priceWrapper: '[data-price-wrapper]',
    productFeaturedImage: '[data-product-featured-image]',
    productJson: '[data-product-json]',
    productMetafieldsJson: '[data-product-metafields-json]',
    productVariantInventoryJson: '[data-product-variant-inventory-json]',
    productSku: '[data-product-sku]',
    productPrice: '[data-product-price]',
    productImageWrap: '[data-product-images-wrap]',
    productImageContainer: '[data-product-images]',
    productImages: '[data-product-image]',
    productActiveImage: '[data-product-active-image]',
    productThumbContainer: '[data-product-thumbnails]',
    productThumbs: '[data-product-single-thumbnail]',
    singleOptionSelector: '[data-single-option-selector]',
    singleOptionValue: '[data-single-option-value]',
    productQtyWrapper: '.product-form__item--quantity',
    optionSelector: '[data-option-selector]',
    productDetails: '.product-single__details',
    productForm: '.product-form',
    optionsPopout: '.product-form__variants-popout',
    varaintButtons: '[data-variant-buttons]',
    activeVariant: '[data-active-variant]',
    productStringsJson: '[data-product-strings]',
    productVariantCrossSell: '[data-product-variant-crosssell-item-json]'
  };

  /**
   * Product section constructor. Runs on page load as well as Theme Editor
   * `section:load` events.
   * @param {string} container - selector for the section container DOM element
   */
  function Product(container) {
    this.$container = $(container);
    var sectionId = this.$container.attr('data-section-id');

    this.settings = {
      // Breakpoints from src/styles/settings/variables.scss.liquid // $grid-breakpoints
      mediaQueryMediumUp: 'screen and (min-width: 768px)',
      mediaQuerySmall: 'screen and (max-width: 767px)',
      enableHistoryState: this.$container.data('enable-history-state') || false,
      sectionId: sectionId,
      sliderActive: false,
      bpSmall: false,
      zoomEnabled: false
    };
    this.namespace = '.product';

    // Stop parsing if we don't have the product json script tag when loading
    // section in the Theme Editor
    if (!$(selectors.productJson, this.$container).html()) {
      return;
    }

    this.productSingleObject = JSON.parse($(selectors.productJson, this.$container).html());
    var productMetafields = JSON.parse($(selectors.productMetafieldsJson, this.$container).html());
    this.productSingleObject.metafields = productMetafields;

    var productVariantInventoryJson = JSON.parse($(selectors.productVariantInventoryJson, this.$container).html());

    var self = this;

    this.productSingleObject.variants.forEach(function(variant, index) {
      var inventoryObject = _.find(productVariantInventoryJson, ['id', variant.id])
      self.productSingleObject.variants[index] = _.merge(self.productSingleObject.variants[index], inventoryObject);
    });

    var $featureProductImageContainer = $(selectors.productFeaturedImage, this.$container);

    if ($featureProductImageContainer.length) {
      this.settings.imageSize = slate.Image.imageSize($(selectors.productFeaturedImage, this.$container).attr('src'));
      this.settings.zoomEnabled = $(selectors.productFeaturedImage).hasClass('js-zoom-enabled');
    }

    var productStrings = JSON.parse($(selectors.productStringsJson, this.$container).html());

    // slate.Image.preload(this.productSingleObject.images, this.settings.imageSize);

    this.$productForm = $(selectors.productForm);
    this.$varaintButtons = $(selectors.varaintButtons);

    this.products = {
      primary: {
        show: true
      },
      secondary: {
        metafield: 'secondary_product',
        show: true
      },
      halfCarton: {
        metafield: 'half_carton_product',
        show: false
      }
    };

    this.products = _.merge(this.products, productStrings);

    this.products.primary = _.extend(this.products.primary, this.productSingleObject);

    this.active = {};
    this.updateActiveVariant(JSON.parse($(selectors.activeVariant, this.$container).html()).id);

    this.ui = {
      additionalProductsLoaded: false
    };

    // this.initBreakpoints();
    this.initImageSlider();
    this.initGallery();
    // this.initVariants();
    this.initMultiItemOrder();
    this.initStickyAddToCart();
    this.bindViews();

    // Bind primary popout
    this.bindPopout(this.products.primary.id);

    // Get additional products
    _.forEach(this.products, function(product, key) {
      if (key != 'primary') {
        self.getAdditionalProduct(key, product.metafield);
      };

      if (shop.customer && product.id) {
        _.forEach(product.variants, function(variant, index) {
          var variantPrice = theme.utils.getVariantCustomerPrice(product, variant, variant.price);
          self.products[key].variants[index].price = variantPrice;
        });
      }
    });

    var readMoreLink = '<button aria-hidden="true" focusable="false" role="presentation" class="read-more">Read more <svg class="icon icon-fa-caret-down" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1408 704q0 26-19 45l-448 448q-19 19-45 19t-45-19L403 749q-19-19-19-45t19-45 45-19h896q26 0 45 19t19 45z"/></svg></button>';
    var productDescriptionReadMoreHeight = 200;

    // Only enable readmore if there's a decent amount of text to hide
    if ($('.product-single__description').innerHeight() >= (productDescriptionReadMoreHeight * 1.175)) {
      $('.product-single__description').readmore({
        speed: 75,
        collapsedHeight: productDescriptionReadMoreHeight,
        heightMargin: 20,
        moreLink: readMoreLink,
        lessLink: false,
        beforeToggle: function(trigger, element, expanded) {
          $(element).toggleClass('readmore-expanded');
        }
      });
    }

    // Sticky details section
    $(selectors.productDetails).stickybits();
  }

  Product.prototype = $.extend({}, Product.prototype, {

    /**
     * Uses enquire.js to handle breakpoint related actions
     */
    // initBreakpoints: function() {
      // var self = this;

      // enquire.register(this.settings.mediaQuerySmall, {
      //   match: function() {
      //     self.settings.bpSmall = true;
      //   },
      //   unmatch: function() {
      //       self.settings.bpSmall = false;
      //   }
      // });

      // enquire.register(this.settings.mediaQueryMediumUp, {
      //   match: function() {
          
      //   }
      // });
    // },

    /**
     * Creates linked sliders for product main and thumb images
     */
    initImageSlider: function() {
      var self = this;

      var thumbOptions = {
        slidesToShow: 5,
        swipeToSlide: true,
        infinite: true,
        asNavFor: selectors.productImageContainer,
        focusOnSelect: true,
        responsive: [
          {
            breakpoint: 992,
            settings: {
              slidesToShow: 5
            }
          },
          {
            breakpoint: 768,
            settings: {
              slidesToShow: 5
            }
          },
          {
            breakpoint: 600,
            settings: {
              slidesToShow: 4
            }
          },
          {
            breakpoint: 480,
            settings: {
              slidesToShow: 3
            }
          }
        ]
      };

      var mainOptions = {
        slidesToShow: 1,
        slidesToScroll: 1,
        swipe: true,
        arrows: false,
        infinite: true,
        focusOnSelect: true,
        fade: true,
        adaptiveHeight: true,
        lazyLoad: 'progressive',
        prevArrow: selectors.productImageContainer + ' ~ .product-single__images__prev',
        nextArrow: selectors.productImageContainer + ' ~ .product-single__images__next',
        responsive: [
          {
            breakpoint: 768,
            settings: {
              // arrows: true,
              fade: false,
              dots: true,
            }
          }
        ]
      };

      $activeProductImage = $(selectors.productActiveImage).first();
      if ($activeProductImage.length > 0) {
        var firstSlide = $activeProductImage.index() || 0;
        mainOptions.initialSlide = firstSlide;
      }
        
      if ($(selectors.productImageWrap, this.$container).is('[data-vertical]')) {
        thumbOptions = $.extend({}, thumbOptions, {
          vertical: true,
          verticalSwiping: true,
        });
      }

      if (this.productSingleObject.images.length > 1) {
        this.productSlideshow = $(selectors.productThumbContainer).slick(thumbOptions);
      }

      this.productSlideshow = $(selectors.productImageContainer).slick(mainOptions);

      this.settings.sliderActive = true;

      this.productSlideshow.on('afterChange', function(event, slick, currentSlide) {
        var newActiveVariantId = $(slick.$slides[currentSlide]).find('[data-variant-id]').data('variantId');
        if (newActiveVariantId) {
          self.updateActiveVariant(newActiveVariantId);
        }
      });
    },

    /**
     * Sets up product image lightbox with Photoswipe.js
     */
    initGallery: function() {
      var self = this;
      
      if (self.settings.zoomEnabled) {
        var pswpElement = document.querySelectorAll('.pswp')[0];
        var items = $('[data-pswp-items]').data('pswp-items');

        $(selectors.productImageWrap, this.$container).on('click', '.zoom-js', function(e){
          e.preventDefault();
          var thumbnail = $(this).find('img')[0];
          options = {
            index: $(this).data('index'),
            barsSize: {top:0,bottom:0},
            captionEl: false,
            fullscreenEl: false,
            shareEl: false,
            bgOpacity: 0.96,
            tapToClose: true,
            tapToToggleControls: false,
            history: false,
            getThumbBoundsFn: function(index) {
              var pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
              rect = thumbnail.getBoundingClientRect(),
              thumbInfo = theme.utils.getImgSizeInfo(thumbnail);
              return {x: rect.left + thumbInfo.left, y: rect.top + pageYScroll, w: thumbInfo.width};
            }
          };
          
          var gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);

          var realViewportWidth,
              useLargeImages = false,
              firstResize = true,
              imageSrcWillChange;
          
          // gettingData event fires each time PhotoSwipe retrieves image source & size
          gallery.listen('gettingData', function(index, item) {

            realViewportWidth = gallery.viewportSize.x * window.devicePixelRatio;

            // Set image source & size based on real viewport width
            if( useLargeImages ) {
              item.src = item.originalImage.src;
              item.w = item.originalImage.w;
              item.h = item.originalImage.h;
              item.msrc = item.originalImage.msrc;
            } else {
              if (realViewportWidth > 1024) {
                item.w = 1600;
              } else if (realViewportWidth > 768) {
                item.w = 1024;
              } else if (realViewportWidth > 640) {
                item.w = 768;
              } else if (realViewportWidth > 480) {
                item.w = 640;
              } else {
                item.w = 480;
              }
              item.w = Math.min(item.w, item[index].originalWidth);
              item.h = Math.round(item.w / item[index].ratio);
              
              var itemSrcTemplate = decodeURI(item[index].src);
              item.src = itemSrcTemplate.replace('{width}', item.w);
              // item.msrc = itemSrcTemplate.replace('{width}', 180);

              var $imageElem = $(selectors.productImageContainer + ' [data-slick-index="' + index + '"]:not(.slick-cloned) img');
              item.msrc = $imageElem.prop('currentSrc') || $imageElem.attr('src') || item[index].msrc;
            }

            // It doesn't really matter what will you do here, 
            // as long as item.src, item.w and item.h have valid values.
            // 
            // Just avoid http requests in this listener, as it fires quite often

          });

          gallery.listen('close', function() {
            if (self.settings.sliderActive) {
              self.productSlideshow.slick('slickGoTo', this.getCurrentIndex());
            }
          });

          gallery.init();

        });
      }
    },

    initStickyAddToCart: function() {
      var self = this;

      var stickyAddToCartOptions = {
        product: self.productSingleObject,
        parent: '#MainContent'
      };

      self.stickyAddToCart = new theme.StickyAddToCart(stickyAddToCartOptions);

      return;
    },

    bindViews: function() {
      var self = this;

      var methods = {
          submit: function(evt) {

            if (!(self.order.totalUnits)) {

              var variantId = $(this).data('variantid');
              var productId = $(this).data('productformid');
              var quantity = 1;
              var product;
              var variant;
              var properties = {}

              product = _.find(self.products, {'id': productId});
              variant = _.find(product.variants, {'id': variantId});

              if(product.variants.length > 1) {              
                theme.utils.errorTippy(evt.target, 'Your order is empty');
              } else {

                crossellDataElement = document.querySelector(selectors.productVariantCrossSell);
                crossellData = JSON.parse(crossellDataElement.textContent)

                crossSellProduct = crossellData.find(obj => {
                  return obj.selectedId === variantId
                })
      
                console.log(crossellData)
      
                  if (crossellData.length > 0) {
                    properties = {
                      _cross_sell_handle: crossSellProduct.productHandle,
                      _cross_sell_image: crossSellProduct.image,
                      _cross_sell_price: crossSellProduct.variantPrice,
                      _cross_sell_options: crossSellProduct.title,
                      _cross_sell_id: crossSellProduct.id,
                      _cross_sell_product_id: crossSellProduct.productId
                    }
                  }  else {
                    properties = {}
                  }
      

                self.order.totalUnits = 1
                self.order.updatedAt = variantId

                self.order.items[variantId] = {
                  productId: productId,
                  quantity:  quantity, /* 1 */
                  properties: properties
                };


                CartJS.addItem(variantId, quantity = quantity, properties);
              }
            } else {
              self.processOrder();
            }
            return;
          },

          optionsToggle: function(evt) {
            evt.stopPropagation();
            var form = $(evt.target).data('form');
            self.toggleFormOptions(form);
          },

          formToggle: function() {
            var $this = $(this);
            var form = $this.data().form;
            self.products[form].show = !self.products[form].show;
          },

          subtractVariantFromOrder: function() {
            var variantId = $(this).data('variantId');
            var variantObject = self.order.items[variantId];

            if (!variantObject) {
              return;
            }

            if (variantObject.quantity > 0) {
              self.order.items[variantId].quantity = variantObject.quantity - 1;
            } else {
              self.order.items[variantId].quantity = 0;
            }

            self.updateOrderPrice();
            return;
          },

          addVariantToOrder: function(evt) {
            var variantId = $(this).data('variantId');
            var productId = $(this).data('productId');
            var max       = $(this).data('max');
            var variantObject = self.order.items[variantId];

            if (!variantObject) {
              self.order.items[variantId] = {
                productId: productId,
                quantity: 1
              };
            } else if (self.order.items[variantId].quantity == max) {
              theme.utils.errorTippy(evt.target, 'Maximum quantity reached');
            } else {
              self.order.items[variantId].quantity = variantObject.quantity + 1;
            }

            self.updateOrderPrice();
            return;
          }
      };

      self.primaryForm = tinybind.bind(self.$productForm, {
        products: self.products,
        order: self.order,
        methods: methods,
        ui: self.ui
      });

      self.stickyAddToCartView = tinybind.bind(self.stickyAddToCart.$el, {
        products: self.products,
        order: self.order,
        methods: methods,
        ui: self.ui
      });

      self.varaintButtons = self.varaintButtons || {};
      self.$varaintButtons.each(function(index) {
         self.varaintButtons[index] = tinybind.bind($(this), {
          active: self.active,
          methods: {
            updateActiveVariant: function(evt) {
              var newActiveVariant = $(evt.target).data('variantId');
              self.updateActiveVariant(newActiveVariant);
            }
          }
        });
      });

      return;
    },

    updateActiveVariant: function(variantId) {
      var self = this;
      self.active.variant = _.find(self.productSingleObject.variants, ['id', variantId]);
      self.updateProductImage();
    },

    toggleFormOptions: function(form) {
      var self = this;

      self.ui.productOptionsShow = self.ui.productOptionsShow || {};

      var current = self.ui.productOptionsShow[form];

      if (current) {

        self.ui.productOptionsShow[form] = false;
        $('body').off('click.productOptions');

      } else {

        // Close all
        _.forEach(self.ui.productOptionsShow, function(value, key) {
          self.ui.productOptionsShow[key] = false;
        });

        self.ui.productOptionsShow[form] = true;

        $('body').on('click.productOptions', function(evt) {
          evt.preventDefault();
          evt.stopPropagation();

          var $target = $(evt.target);

          if ($(selectors.optionsPopout).find($target).length > 0) {
            return;
          }

          self.toggleFormOptions(form);
        });

      }

      return;
    },

    updateOrderTimestamp: function() {
      var self = this;
      self.order.updatedAt = Date.now();
    },

    updateOrderPrice: function() {
      var self = this;

      var newPrice = 0;
      var newUnits = 0;

      // Loop each variantid in the order, find the matching product and variant, and add variant price to total price
      _.forEach(self.order.items, function(orderItem, key) {

        var variantId = parseInt(key);
        var productId = orderItem.productId;
        var quantity = orderItem.quantity;
        var product;
        var variant;
        var unitsPerItem;
        var crossellData;

        product = _.find(self.products, {'id': productId});
        variant = _.find(product.variants, {'id': variantId});
        
        crossellDataElement = document.querySelector(selectors.productVariantCrossSell);
        crossellData = JSON.parse(crossellDataElement.textContent)

        crossSellProduct = crossellData.find(obj => {
          return obj.selectedId === variantId
        })
        

          if (crossellData.length > 0) {
            orderItem.properties = {
            _cross_sell_handle: crossSellProduct.productHandle,
            _cross_sell_image: crossSellProduct.image,
            _cross_sell_price: crossSellProduct.variantPrice,
            _cross_sell_options: crossSellProduct.title,
            _cross_sell_id: crossSellProduct.id,
            _cross_sell_product_id: crossSellProduct.productId
            }
          }  else {
            orderItem.properties = {}
          }




        if (!product) {
            console.error('Could not find product id');
          return;
        }

        try {
          unitsPerItem = product.metafields.details.carton_quantity;
        } catch(error) {

        }

        unitsPerItem = unitsPerItem || 1;

        variant = _.find(product.variants, {'id': variantId});

        if (!variant) {
          console.error('Could not find variant in product ' + product.title);
          return;
        }

        newPrice = newPrice + (variant.price * quantity);
        newUnits = newUnits + (unitsPerItem * quantity);

      });

      self.order.totalPrice = newPrice;
      self.order.totalUnits = newUnits;

      self.updateOrderTimestamp();
    },

    processOrder: function() {
      var self = this;

      _.forEach(self.order.items, function(item, variantId) {
        CartJS.addItem(variantId, quantity = item.quantity, properties = item.properties);
      });

    },

    bindPopout: function(productId) {
      var self = this;

      var $buttons = $('.product-form__item-button .btn' + '[data-product-id="' + productId + '"]');

      $buttons.each(function(index) {
        var $button = $($buttons[index]);
        var $options = $button.closest('.product-form__item').find('.product-form__variants-popout');

        self.optionSelects = self.optionSelects || {};

        self.optionSelects[productId] = new Popper($button[0], $options[0], {
          placement: 'bottom-start'
        });
      });

    },

    // may need to break this out
    initMultiItemOrder: function() {
      var self = this;

      self.order = {};

      var productVariantCount = this.products.primary.variants.length
      var productPrice = productVariantCount === 1 ? this.products.primary.price : 0


      // do stuff

      self.order = {
        totalPrice: productPrice,
        items: {}
      };

      return;
    },

    getAdditionalProduct: function(type, metafield) {
      // type:      the additioanl product type and how it
      //            will be references in the this.products
      //            object.
      //
      // metafield: the matafield name. Must be in the
      //            'realted' namespace.


      var self = this;

      var productHandle;

      try {
        productHandle = self.products.primary.metafields.related[metafield];
      } catch(error) {
        console.info('No ' + type + ' product set in metafields');
        self.products[type].show = false;
        return;
      }

      if (!productHandle) {
        self.products[type].show = false;
        return;
      }

      $.ajax({
        url: '/products/' + productHandle + '?view=json'
      }).done(function(data) {
        var product = JSON.parse(data.replace(/<!--[\s\S]*?-->/g, "")); // remove HTML comments from JSON
        self.products[type] = _.extend(self.products[type], product);

        var label = self.products[type].selectSizeLabel;

        if (product.type) {
          label = label.replace('{{ type }}', product.type);
        } else {
          label = label.replace('{{ type }}', 'secondary');
        }

        if (product.title) {
          label = label.replace('{{ product_title }}', product.title);
        }

        self.products[type].selectSizeLabel = label;

        _.forEach(product.variants, function(variant, index) {
          var variantPrice = theme.utils.getVariantCustomerPrice(product, variant);
          self.products[type].variants[index].price = variantPrice;
        });

        self.bindPopout(self.products[type].id);
      });

      return;
    },

    /**
     * Handles change events from the variant inputs
     */
    initVariants: function() {
      var options = {
        $container: this.$container,
        enableHistoryState: this.$container.data('enable-history-state') || false,
        singleOptionSelector: selectors.singleOptionSelector,
        originalSelectorId: selectors.originalSelectorId,
        product: this.productSingleObject
      };

      this.variants = new slate.Variants(options);

      this.$container.on('variantChange' + this.namespace, this.updateAddToCartState.bind(this));
      this.$container.on('variantImageChange' + this.namespace, this.updateProductImage.bind(this));
      this.$container.on('variantPriceChange' + this.namespace, this.updateProductPrices.bind(this));
      this.$container.on('variantOptionChange' + this.namespace, this.updateProductOptions.bind(this));
      this.$container.on('variantSKUChange' + this.namespace, this.updateSKU.bind(this));
    },

    /**
     * Updates the DOM state of the add to cart button
     *
     * @param {boolean} enabled - Decides whether cart is enabled or disabled
     * @param {string} text - Updates the text notification content of the cart
     */
    updateAddToCartState: function(evt) {
      var variant = evt.variant;

      if (variant) {
        $(selectors.priceWrapper, this.$container).removeClass('hide');
      } else {
        $(selectors.addToCart, this.$container).prop('disabled', true);
        $(selectors.addToCartText, this.$container).html(theme.strings.unavailable);
        $(selectors.priceWrapper, this.$container).addClass('hide');
        return;
      }

      if (variant.available) {
        var quantityAvailable = Math.max(variant.inventory_quantity, 0);
        quantityAvailable = quantityAvailable > 0 ? quantityAvailable : 999;
        $(selectors.productQtyWrapper + ' input', this.$container).prop('max', quantityAvailable);
        $(selectors.productQtyWrapper + ' input', this.$container).prop('min', 1);
        $(selectors.addToCart, this.$container).prop('disabled', false);
        $(selectors.addToCartText, this.$container).html(theme.strings.addToCart);
      } else {
        $(selectors.productQtyWrapper + ' input', this.$container).prop('max', 0);
        $(selectors.productQtyWrapper + ' input', this.$container).prop('min', 0);
        $(selectors.addToCart, this.$container).prop('disabled', true);
        $(selectors.addToCartText, this.$container).html(theme.strings.soldOut);
      }
    },

    /**
     * Updates the DOM with specified prices
     *
     * @param {string} productPrice - The current price of the product
     * @param {string} comparePrice - The original price of the product
     */
    updateProductPrices: function(evt) {
      var variant = evt.variant;
      var $comparePrice = $(selectors.comparePrice, this.$container);
      var $compareEls = $comparePrice.add(selectors.comparePriceText, this.$container);
      var comparePrefixString = $comparePrice.data('prefix-string') || '';
      var compareSuffixString = $comparePrice.data('suffix-string') || '';

      $(selectors.productPrice, this.$container)
        .html(slate.Currency.formatMoney(variant.price, theme.moneyFormat));

      if (variant.compare_at_price > variant.price) {
        $comparePrice.html(comparePrefixString + slate.Currency.formatMoney(variant.compare_at_price, theme.moneyFormat) + compareSuffixString);
        $compareEls.removeClass('hide');
      } else {
        $comparePrice.html('');
        $compareEls.addClass('hide');
      }

      var $afterpayInstallments = $('#afterpay_instalments', this.$container);
      if ($afterpayInstallments.length) {
        $afterpayInstallments.html(slate.Currency.formatMoney(variantPrice/4, theme.moneyFormat));
      }
    },

    /**
     * Updates the DOM with specified options
     */
    updateProductOptions: function(evt) {
      var enabledOptions = [];
      var selectedVariant = evt.variant;
      for (var i = 0; i < this.productSingleObject.variants.length; i++) {
        var variant = this.productSingleObject.variants[i];
        if (variant.option1 == selectedVariant.option1 && variant.available) {
          enabledOptions = _.union(enabledOptions, [variant.option2, variant.option3]);
        }
      }

      $(selectors.singleOptionSelector + ':not([data-index="option1"])').attr('disabled', 'disabled');
      for (var i = 0; i < enabledOptions.length; i++) {
        $(selectors.singleOptionSelector + ':not([data-index="option1"])[value="' + enabledOptions[i] + '"]').removeAttr('disabled');
      }

      if (!selectedVariant.available) {
        var $selectedDisabledOptions = $(selectors.singleOptionSelector + ':not([data-index="option1"]):disabled:checked');
        if ($selectedDisabledOptions.length) {
          $selectedDisabledOptions.each(function(){
            var $newOption = $(this).siblings(selectors.singleOptionSelector + ':not([data-index="option1"]):not(:disabled):not(:checked)').eq(0);
            $(this).removeAttr('checked');
            $newOption.attr('checked', 'checked').trigger('click');
          });
        }
      } else {
        $(selectors.singleOptionValue).each(function(){
          var $this = $(this);
          $this.text(selectedVariant.options[$this.data('single-option-value')]);
        });
      }
    },

    /**
     * Updates the DOM with the specified image URL
     *
     * @param {string} src - Image src URL
     */
    updateProductImage: function(evt) {
      var self = this;

      var variant;
      if (!evt) {
        try {
          variant = self.active.variant;
        }
        catch(error) {
          console.error(error);
          return;
        }
        
      } else {
        variant = evt.variant;
      }


      if (self.settings.sliderActive) {
        var imageIndex = $('[data-image-id="' + variant.featured_image.id + '"]:not(.slick-cloned)').closest('.slick-slide').data('slick-index');
        self.productSlideshow.slick('slickGoTo', imageIndex);
      } else {

        try {
          var sizedImgUrl = slate.Image.getSizedImageUrl(variant.featured_image.src, this.settings.imageSize);
          $(selectors.productFeaturedImage, this.$container).attr('src', sizedImgUrl);
        } catch(err) {}

      }
    },

    /**
     * Updates the DOM with specified Variant SKU
     */
    updateSKU: function(evt) {
      var variant = evt.variant;

      // Update the sku
      $(selectors.productSku, this.$container).html(variant.sku);
    },

    /**
     * Event callback for Theme Editor `section:unload` event
     */
    onUnload: function() {
      this.stickyAddToCart.destroy();
      this.$container.off(this.namespace);
    }
  });

  return Product;
})();

theme.Quotes = (function() {
  var config = {
    mediaQuerySmall: 'screen and (max-width: 767px)',
    mediaQueryMediumUp: 'screen and (min-width: 768px)',
    slideCount: 0
  };
  var defaults = {
    arrows: true,
    dots: false,
    autoplay: false,
    touchThreshold: 20,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  function Quotes(container) {
    var $container = this.$container = $(container);
    var sectionId = $container.attr('data-section-id');
    var wrapper = this.wrapper = '.quotes';
    var slider = this.slider = '#Quotes-' + sectionId;
    var $slider = $(slider, wrapper);

    defaults.prevArrow = '#Quotes-' + sectionId + ' ~ .slideshow__prev';
    defaults.nextArrow = '#Quotes-' + sectionId + ' ~ .slideshow__next';

    var sliderActive = false;
    var mobileOptions = $.extend({}, defaults, {
      slidesToShow: 1,
      slidesToScroll: 1,
      adaptiveHeight: true
    });

    config.slideCount = $slider.data('count');

    // Override slidesToShow/Scroll if there are not enough blocks
    if (config.slideCount < defaults.slidesToShow) {
      defaults.slidesToShow = config.slideCount;
      defaults.slidesToScroll = config.slideCount;
    }

    $slider.on('init', this.a11y.bind(this));

    enquire.register(config.mediaQuerySmall, {
      match: function() {
        initSlider($slider, mobileOptions);
      }
    });

    enquire.register(config.mediaQueryMediumUp, {
      match: function() {
        initSlider($slider, defaults);
      }
    });

    function initSlider(sliderObj, args) {
      if (sliderActive) {
        sliderObj.slick('unslick');
        sliderActive = false;
      }

      sliderObj.slick(args);
      sliderActive = true;
    }
  }

  Quotes.prototype = _.assignIn({}, Quotes.prototype, {
    onUnload: function() {
      enquire.unregister(config.mediaQuerySmall);
      enquire.unregister(config.mediaQueryMediumUp);

      $(this.slider, this.wrapper).slick('unslick');
    },

    onBlockSelect: function(evt) {
      // Ignore the cloned version
      var $slide = $('.quotes__slide--' + evt.detail.blockId + ':not(.slick-cloned)');
      var slideIndex = $slide.data('slick-index');

      // Go to selected slide, pause autoplay
      $(this.slider, this.wrapper).slick('slickGoTo', slideIndex);
    },

    a11y: function(event, obj) {
      var $list = obj.$list;
      var $wrapper = $(this.wrapper, this.$container);

      // Remove default Slick aria-live attr until slider is focused
      $list.removeAttr('aria-live');

      // When an element in the slider is focused set aria-live
      $wrapper.on('focusin', function(evt) {
        if ($wrapper.has(evt.target).length) {
          $list.attr('aria-live', 'polite');
        }
      });

      // Remove aria-live
      $wrapper.on('focusout', function(evt) {
        if ($wrapper.has(evt.target).length) {
          $list.removeAttr('aria-live');
        }
      });
    }
  });

  return Quotes;
})();

theme.slideshows = theme.slideshows || {};

theme.SlideshowSection = (function() {
  function SlideshowSection(container) {
    var $container = this.$container = $(container);
    var sectionId = $container.attr('data-section-id');
    var slideshow = this.slideshow = '#Slideshow-' + sectionId;

    $('.slideshow__video', slideshow).each(function() {
      var $el = $(this);
      theme.SlideshowVideo.init($el);
      theme.SlideshowVideo.loadVideo($el.attr('id'));
    });

    theme.slideshows[slideshow] = new theme.Slideshow(slideshow);
  }

  return SlideshowSection;
})();

theme.SlideshowSection.prototype = _.assignIn({}, theme.SlideshowSection.prototype, {
  onUnload: function() {
    delete theme.slideshows[this.slideshow];
  },

  onBlockSelect: function(evt) {
    var $slideshow = $(this.slideshow);

    // Ignore the cloned version
    var $slide = $('.slideshow__slide--' + evt.detail.blockId + ':not(.slick-cloned)');
    var slideIndex = $slide.data('slick-index');

    // Go to selected slide, pause autoplay
    $slideshow.slick('slickGoTo', slideIndex).slick('slickPause');
  },

  onBlockDeselect: function() {
    // Resume autoplay
    $(this.slideshow).slick('slickPlay');
  }
});

window.theme = window.theme || {};

theme.BrandValueSliders = (function() {
  var config = {
    mediaQuerySmall: 'screen and (max-width: 767px)',
    mediaQueryMediumUp: 'screen and (min-width: 768px)',
    slideCount: 0,
    anchorPosition: 'above', // above, below
    anchorElement: false, // '.site-header-lower'
    anchorViewport: 'small' // large, small
  };

  var cache = {
    anchorMarginBottom: 0,
    anchorMarginTop: 0,
    anchorOffset: 0
  }

  var defaults = {
    arrows: false,
    dots: false,
    autoplay: false,
    touchThreshold: 20,
    slidesToShow: 3,
    swipeToSlide: true,
    slidesToScroll: 1
  };

  function brandValueSliders(container) {
    var $container = this.$container = $(container);
    var sectionId = $container.attr('data-section-id');
    var wrapper = this.wrapper = '.brand-values-wrap';
    var slider = this.slider = '#brand-values-' + sectionId;
    var $slider = $(slider, wrapper);
    var $contentContainer = $('#PageContent');
    var $anchorElement = $(config.anchorElement);

    var mobileOptions = $.extend({}, defaults, {
      arrows: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      adaptiveHeight: true,
      autoplay: $slider.data('autoplay-mobile'),
      autoplaySpeed: $slider.data('speed')
    });

    var sliderActive = false;
    var desktopOptions = $.extend({}, defaults, {
      autoplay: $slider.data('autoplay'),
      autoplaySpeed: $slider.data('speed'),
      slidesToShow: $slider.data('slides-show-desktop')
    });

    config.slideCount = $slider.data('count');

    // Override slidesToShow/Scroll if there are not enough blocks
    if (config.slideCount < defaults.slidesToShow) {
      defaults.slidesToShow = config.slideCount;
      defaults.slidesToScroll = config.slideCount;
    }

    $slider.on('init', this.a11y.bind(this));

    if ($anchorElement.length) {
      cache.anchorMarginTop = parseInt($anchorElement.css("marginTop").replace('px', ''));
      cache.anchorMarginBottom = parseInt($anchorElement.css("marginBottom").replace('px', ''));
    }

    enquire.register(config.mediaQuerySmall, {
      deferSetup: true,
      match: function() {
        initSlider($slider, mobileOptions);

        if ($anchorElement.length) {
          $anchorElement.css({
            'margin-top': cache.anchorMarginTop + 'px',
            'margin-bottom': cache.anchorMarginBottom + 'px'
          });
          
          if (config.anchorViewport == 'small' || config.anchorViewport == 'all') {
            $container.css('position', 'fixed');
            switch (config.anchorPosition) {
              case 'above':
                cache.anchorOffset = $anchorElement.offset().top;
                var anchorAdjustment = {
                  'margin-top': (cache.anchorMarginTop + $container.outerHeight()) + 'px'
                };
                var sliderAdjustment = {
                  'top': cache.anchorOffset + 'px'
                };
                break;
              default:
                cache.anchorOffset = $anchorElement.offset().top + $anchorElement.innerHeight();
                var anchorAdjustment = {
                  'margin-bottom': (cache.anchorMarginBottom + $container.outerHeight()) + 'px'
                };
                var sliderAdjustment = {
                  'top': cache.anchorOffset + 'px'
                };
                break;
            }
          } else {
            var anchorAdjustment = {
              'margin-bottom': cache.anchorMarginBottom + 'px'
            };
            var sliderAdjustment = {
              'position': 'static',
              'top': '0px'
            };
          }

          $anchorElement.css(anchorAdjustment);
          $container.not('.brand-values--cloned').css(sliderAdjustment);
        }
      }
    });

    enquire.register(config.mediaQueryMediumUp, {
      deferSetup: true,
      match: function() {
        initSlider($slider, desktopOptions);
        if ($anchorElement.length) {
          $anchorElement.css({
            'margin-top': cache.anchorMarginTop + 'px',
            'margin-bottom': cache.anchorMarginBottom + 'px'
          });

          if (config.anchorViewport == 'large' || config.anchorViewport == 'all') {
            $container.css('position', 'fixed');
            switch (config.anchorPosition) {
              case 'above':
                cache.anchorOffset = $anchorElement.offset().top;
                var anchorAdjustment = {
                  'margin-top': (cache.anchorMarginTop + $container.outerHeight()) + 'px'
                };
                var sliderAdjustment = {
                  'position': 'fixed',
                  'top': cache.anchorOffset + 'px'
                };
                break;
              default:
                cache.anchorOffset = $anchorElement.offset().top + $anchorElement.innerHeight();
                var anchorAdjustment = {
                  'margin-bottom': (cache.anchorMarginBottom + $container.outerHeight()) + 'px'
                };
                var sliderAdjustment = {
                  'position': 'fixed',
                  'top': cache.anchorOffset + 'px'
                };
                break;
            }
          } else {
            var anchorAdjustment = {
              'margin-bottom': cache.anchorMarginBottom + 'px'
            };
            var sliderAdjustment = {
              'position': 'static',
              'top': '0px'
            };
          }

          $anchorElement.css(anchorAdjustment);
          $container.not('.brand-values--cloned').css(sliderAdjustment);
        }
      }
    });

    function initSlider(sliderObj, args) {
      if (sliderActive) {
        sliderObj.slick('unslick');
        sliderActive = false;
        $('.brand-values-clone').empty();
      }

      // Clone brand values content to other site areas
      // #TODO: Attach this to the main slider init so it functions as a slider
      sliderObj.clone().addClass('brand-values--cloned').removeAttr('id').removeAttr('style').appendTo('.brand-values-clone');

      sliderObj.slick(args);
      sliderActive = true;

      if ($anchorElement.length) {
        if ($(window).width() < 750) {
          switch (config.anchorPosition) {
            case 'above':
              $anchorElement.css('margin-top', sliderObj.outerHeight() + 'px');
              break;
            default:
              $anchorElement.css('margin-bottom', sliderObj.outerHeight() + 'px');
              break;
          }
        }
      }
    }
  }

  brandValueSliders.prototype = _.assignIn({}, brandValueSliders.prototype, {
    onUnload: function() {
      enquire.unregister(config.mediaQuerySmall);
      enquire.unregister(config.mediaQueryMediumUp);

      $(this.slider, this.wrapper).slick('unslick');
    },

    onBlockSelect: function(evt) {
      // Ignore the cloned version
      var $slide = $('.brand-values__slide--' + evt.detail.blockId + ':not(.slick-cloned)');
      var slideIndex = $slide.data('slick-index');

      // Go to selected slide, pause autoplay
      $(this.slider, this.wrapper).slick('slickGoTo', slideIndex);
    },

    a11y: function(event, obj) {
      var $list = obj.$list;
      var $wrapper = $(this.wrapper, this.$container);

      // Remove default Slick aria-live attr until slider is focused
      $list.removeAttr('aria-live');

      // When an element in the slider is focused set aria-live
      $wrapper.on('focusin', function(evt) {
        if ($wrapper.has(evt.target).length) {
          $list.attr('aria-live', 'polite');
        }
      });

      // Remove aria-live
      $wrapper.on('focusout', function(evt) {
        if ($wrapper.has(evt.target).length) {
          $list.removeAttr('aria-live');
        }
      });
    }
  });

  return brandValueSliders;
})();

window.theme = window.theme || {};

theme.FeaturedCollection = (function() {
  var config = {
    mediaQuerySmall: 'screen and (max-width: 767px)',
    mediaQueryMediumUp: 'screen and (min-width: 768px)',
    slideCount: 0
  };

  var sliderOptions = {
    arrows: true,
    dots: false,
    slidesToShow: 3,
    slidesToScroll: 3,
    infinite: true,
  };

  function featuredCollection(container) {
    var $container = this.$container = $(container);
    var sectionId = $container.attr('data-section-id');
    var wrapper = this.wrapper = '.featured-collection-wrap';
    var slider = this.slider = '#featured-collection-' + sectionId;
    var $slider = $(slider, wrapper);
    var sliderActive = false;

    var options = $.extend({}, sliderOptions, {
      prevArrow: slider + ' ~ .featured-collection__prev',
      nextArrow: slider + ' ~ .featured-collection__next',
      autoplay: $slider.data('autoplay'),
      autoplaySpeed: $slider.data('speed'),
      swipeToSlide: true,
      slidesToShow: 4,
      slidesToScroll: 1,
      responsive: [
        {
          breakpoint: 1480,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1
          }
        },
        {
          breakpoint: 992,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1
          }
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
            // dots: true,
            autoplay: $slider.data('autoplay-mobile'),
          }
        },
        {
          breakpoint: 512,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            // dots: true
          }
        }
      ]
    });

    var self = this;

    function appendSlickScrollbar(slick) {
      if (slick.$slides.filter('.slick-active').length != slick.$slides.length) {
        var currentMarkerOffset = slick.currentSlide * 100;
        var scrollbarMarkerWidth = 1 / slick.slideCount * 100;
        slick.$slider.append('<div class="slick-scrollbar"><div class="slick-scrollbar-mark" style="width: ' + scrollbarMarkerWidth + '%"></div></div>');
        $('.slick-scrollbar-mark', slick.$slider).css('transform', 'translateX(' + currentMarkerOffset + '%)');
      }
    }

    $slider.on('init', function(evt, slick){
      self.a11y.bind(this);

      appendSlickScrollbar(slick);
    });

    $slider.on('reInit', function(evt, slick){
      appendSlickScrollbar(slick);
    });

    $slider.on('beforeChange', function(evt, slick, currentSlide, nextSlide){
      var currentMarkerOffset = nextSlide * 100;
      $('.slick-scrollbar-mark', slick.$slider).css('transform', 'translateX(' + currentMarkerOffset + '%)');
    });
    
    initSlider($slider, options);

    function initSlider(sliderObj, args) {
      if (sliderActive) {
        sliderObj.slick('unslick');
        sliderActive = false;
      }

      sliderObj.slick(args);
      sliderActive = true;

      var markerRatio = $('.featured-collection .slick-list').width() / $('.featured-collection .slick-track').width();

      $('input[type="number"]', sliderObj).not('.js-qty-select input[type="number"]').each( function(){
        var $el = $(this);
        theme.QuantitySelectors.init($el);
      });
    }
  }

  featuredCollection.prototype = _.assignIn({}, featuredCollection.prototype, {
    onUnload: function() {
      $(this.slider, this.wrapper).slick('unslick');
    },

    a11y: function(event, obj) {
      var $list = obj.$list;
      var $wrapper = $(this.wrapper, this.$container);

      // Remove default Slick aria-live attr until slider is focused
      $list.removeAttr('aria-live');

      // When an element in the slider is focused set aria-live
      $wrapper.on('focusin', function(evt) {
        if ($wrapper.has(evt.target).length) {
          $list.attr('aria-live', 'polite');
        }
      });

      // Remove aria-live
      $wrapper.on('focusout', function(evt) {
        if ($wrapper.has(evt.target).length) {
          $list.removeAttr('aria-live');
        }
      });
    }
  });

  return featuredCollection;
})();

window.theme = window.theme || {};
theme.slideshows = theme.slideshows || {};

theme.FeaturedCollections = (function() {
  var selectors = {
    collectionLink: '.featured_colections__header-item',
  };

  function FeaturedCollections(container) {
    var $container = this.$container = $(container);
    var sectionId = $container.attr('data-section-id');
    var slideshow = this.slideshow = '#Slideshow-' + sectionId;
    var activeCollectionHandle = $('[data-block-id]', $container).first().data('related-collection');

    theme.slideshows[slideshow] = new theme.Slideshow(slideshow);

    $(selectors.collectionLink + '[data-related-collection=' + activeCollectionHandle + ']', $container).addClass('active');

    $(slideshow).on('beforeChange', function(event, slick, currentSlide, nextSlide){
      var nextCollectionHandle = $('[data-slick-index="' + nextSlide + '"]:not(.slick-cloned) [data-related-collection]', $container).data('related-collection');
      if (nextCollectionHandle != activeCollectionHandle) {
        activeCollectionHandle = nextCollectionHandle;

        $(selectors.collectionLink, $container).removeClass('active');
        $(selectors.collectionLink + '[data-related-collection="' + activeCollectionHandle + '"]', $container).addClass('active');
      }
    });

    $(selectors.collectionLink, $container).on('click', function(evt){
      evt.preventDefault();
      var $this = $(this);
      
      var relatedCollectionHandle = $this.data('related-collection');
      var $slide = $('.slick-slide[data-slick-index="' + $this.data('first-product') + '"]:not(.slick-cloned)', $container).first();
      var slideIndex = $slide.data('slick-index');
      $(slideshow).slick('slickGoTo', slideIndex);
    });
  }

  return FeaturedCollections;
})();

theme.FeaturedCollections.prototype = _.assignIn({}, theme.FeaturedCollections.prototype, {
  onUnload: function() {
    delete theme.slideshows[this.slideshow];
  },

  onBlockSelect: function(evt) {
    var $slideshow = $(this.slideshow);

    // Ignore the cloned version
    var $slide = $('[data-block-id="' + evt.detail.blockId + '"]:not(.slick-cloned)');
    var slideIndex = $slide.data('slick-index');

    // Go to selected slide, pause autoplay
    $slideshow.slick('slickGoTo', slideIndex).slick('slickPause');
  },

  onBlockDeselect: function() {
    // Resume autoplay
    $(this.slideshow).slick('slickPlay');
  }
});


window.theme = window.theme || {};

theme.FeaturedProducts = (function() {
  var config = {
    mediaQuerySmall: 'screen and (max-width: 767px)',
    mediaQueryMediumUp: 'screen and (min-width: 768px)',
    slideCount: 0
  };

  var sliderOptions = {
    autoplay: false,
    arrows: true,
    dots: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    infinite: true
  };

  function featuredProducts(container) {
    var $container = this.$container = $(container);
    var sectionId = $container.attr('data-section-id');
    var wrapper = this.wrapper = '.featured-products';
    var slider = this.slider = '#featured-products-' + sectionId;
    var $slider = $(slider, wrapper);
    var sliderActive = false;

    var options = $.extend({}, sliderOptions, {
      prevArrow: slider + ' ~ .featured-products__prev',
      nextArrow: slider + ' ~ .featured-products__next'
    });

    $slider.on('init', this.a11y.bind(this));

    initSlider($slider, options);

    function initSlider(sliderObj, args) {
      if (sliderActive) {
        sliderObj.slick('unslick');
        sliderActive = false;
      }

      sliderObj.slick(args);
      sliderActive = true;
    }
  }

  featuredProducts.prototype = _.assignIn({}, featuredProducts.prototype, {
    onUnload: function() {
      $(this.slider, this.wrapper).slick('unslick');
    },

    a11y: function(event, obj) {
      var $list = obj.$list;
      var $wrapper = $(this.wrapper, this.$container);

      // Remove default Slick aria-live attr until slider is focused
      $list.removeAttr('aria-live');

      // When an element in the slider is focused set aria-live
      $wrapper.on('focusin', function(evt) {
        if ($wrapper.has(evt.target).length) {
          $list.attr('aria-live', 'polite');
        }
      });

      // Remove aria-live
      $wrapper.on('focusout', function(evt) {
        if ($wrapper.has(evt.target).length) {
          $list.removeAttr('aria-live');
        }
      });
    }
  });

  return featuredProducts;
})();

window.theme = window.theme || {};
theme.slideshows = theme.slideshows || {};

theme.ImageRows = (function() {

  function ImageRows(container) {
    var $container = this.$container = $(container);
    var sectionId = $container.attr('data-section-id');
    var slideshow = this.slideshow = '#Slideshow-' + sectionId;

    theme.slideshows[slideshow] = new theme.Slideshow(slideshow);
  }

  return ImageRows;
})();

theme.ImageRows.prototype = _.assignIn({}, theme.ImageRows.prototype, {
  onUnload: function() {
    delete theme.slideshows[this.slideshow];
  },

  onBlockSelect: function(evt) {
    var $slideshow = $(this.slideshow);

    // Ignore the cloned version
    var $slide = $('[data-block-id="' + evt.detail.blockId + '"]:not(.slick-cloned)');
    var slideIndex = $slide.data('slick-index');

    // Go to selected slide, pause autoplay
    $slideshow.slick('slickGoTo', slideIndex).slick('slickPause');
  },

  onBlockDeselect: function() {
    // Resume autoplay
    $(this.slideshow).slick('slickPlay');
  }
});

window.theme = window.theme || {};

theme.ContentSliders = (function() {
  var config = {
    mediaQuerySmall: 'screen and (max-width: 600px)',
    mediaQueryMedium: 'screen and (min-width: 601px) and (max-width: 991px)',
    mediaQueryLargeUp: 'screen and (min-width: 992px)'
  };

  function contentSliders(container) {
    var $container = this.$container = $(container);
    var sectionId = $container.attr('data-section-id');
    var wrapper = this.wrapper = '.content-slider-wrap';
    var slider = this.slider = '#content-slider-' + sectionId;
    var $slider = $(slider, wrapper);
    var sliderActive = false;

    var options = {
      infinite: $slider.data('infinite'),
      prevArrow: slider + ' ~ .content-slider__prev',
      nextArrow: slider + ' ~ .content-slider__next',
      arrows: $slider.data('arrows'),
      dots: $slider.data('dots'),
      autoplay: $slider.data('autoplay'),
      autoplaySpeed: $slider.data('speed'),
      slidesToShow: $slider.data('slides-show-desktop'),
      slidesToScroll: $slider.data('slides-scroll-desktop'),
      rows: $slider.data('rows-desktop'),
      slidesPerRow: $slider.data('per-row-desktop')
    };

    var tabletOptions = $.extend({}, options, {
      slidesToShow: $slider.data('slides-show-tablet'),
      slidesToScroll: $slider.data('slides-scroll-tablet'),
      rows: $slider.data('rows-tablet'),
      slidesPerRow: $slider.data('per-row-tablet')
    });

    var mobileOptions = $.extend({}, options, {
      arrows: $slider.data('arrows-mobile'),
      dots: $slider.data('dots-mobile'),
      autoplay: $slider.data('autoplay-mobile'),
      slidesToShow: $slider.data('slides-show-mobile'),
      slidesToScroll: $slider.data('slides-scroll-mobile'),
      rows: $slider.data('rows-mobile'),
      slidesPerRow: $slider.data('per-row-mobile')
    });

    $slider.on('init', this.a11y.bind(this));

    enquire.register(config.mediaQuerySmall, {
      match: function() {
        initSlider($slider, mobileOptions);
      }
    });

    enquire.register(config.mediaQueryMedium, {
      match: function() {
        initSlider($slider, tabletOptions);
      }
    });

    enquire.register(config.mediaQueryLargeUp, {
      match: function() {
        initSlider($slider, options);
      }
    });

    function initSlider(sliderObj, args) {
      if (sliderActive) {
        sliderObj.slick('unslick');
        sliderActive = false;
      }

      sliderObj.slick(args);
      sliderActive = true;
    }

    $('.slideshow__video', wrapper).each(function() {
      var $el = $(this);
      theme.SlideshowVideo.init($el);
      theme.SlideshowVideo.loadVideo($el.attr('id'));
    });
  }

  contentSliders.prototype = _.assignIn({}, contentSliders.prototype, {
    onUnload: function() {
      $(this.slider, this.wrapper).slick('unslick');
    },

    a11y: function(event, obj) {
      var $list = obj.$list;
      var $wrapper = $(this.wrapper, this.$container);

      // Remove default Slick aria-live attr until slider is focused
      $list.removeAttr('aria-live');

      // When an element in the slider is focused set aria-live
      $wrapper.on('focusin', function(evt) {
        if ($wrapper.has(evt.target).length) {
          $list.attr('aria-live', 'polite');
        }
      });

      // Remove aria-live
      $wrapper.on('focusout', function(evt) {
        if ($wrapper.has(evt.target).length) {
          $list.removeAttr('aria-live');
        }
      });
    }
  });

  return contentSliders;
})();

window.theme = window.theme || {};
theme.slideshows = theme.slideshows || {};

theme.LatestBlogPosts = (function() {
  function LatestBlogPosts(container) {
    var $container = this.$container = $(container);
    var sectionId = $container.attr('data-section-id');
    var slideshow = this.slideshow = '#Slideshow-' + sectionId;

    theme.slideshows[slideshow] = new theme.Slideshow(slideshow);
  }

  return LatestBlogPosts;
})();

theme.LatestBlogPosts.prototype = _.assignIn({}, theme.LatestBlogPosts.prototype, {
  onUnload: function() {
    delete theme.slideshows[this.slideshow];
  },

  onBlockSelect: function(evt) {
    var $slideshow = $(this.slideshow);

    // Ignore the cloned version
    var $slide = $('.slideshow__slide--' + evt.detail.blockId + ':not(.slick-cloned)');
    var slideIndex = $slide.data('slick-index');

    // Go to selected slide, pause autoplay
    $slideshow.slick('slickGoTo', slideIndex).slick('slickPause');
  },

  onBlockDeselect: function() {
    // Resume autoplay
    $(this.slideshow).slick('slickPlay');
  }
});

window.theme = window.theme || {};
window.theme.slideshows = window.theme.slideshows || {};

theme.Hero = (function() {

  var selectors = {
    slideshow: '[data-slideshow]'
  };

  function Hero(container) {

    this.$container = $(container);
    this.$slideshows = $(selectors.slideshow, this.$container);

    $.each(this.$slideshows, function(index, slideshow) {
      theme.slideshows[slideshow] = new theme.Slideshow(slideshow);

      // Set intial theme if required
      var $currentSlide = $(slideshow).find('.slick-current');
      var newTheme = $currentSlide.find('.hero-slide').data('theme');
      if (newTheme) {
        theme.colors.transition(newTheme);
      }

      // Before Change event
      $(slideshow).on('beforeChange', function(event, slick, currentSlide, nextSlide){

        var $currentSlide = $(slideshow).find('.slick-slide[data-slick-index="' + currentSlide + '"]');
        $currentSlide.addClass('slick-previous');

        setTimeout(function() {
          $currentSlide.removeClass('slick-previous');
        }, 1000);
      });

      // After Change event
      $(slideshow).on('afterChange', function(event, slick, currentSlide){

        var $currentSlide = $(slideshow).find('.slick-slide[data-slick-index="' + currentSlide + '"]');
        var newTheme = $currentSlide.find('.hero-slide').data('theme');
        if (newTheme) {
          theme.colors.transition(newTheme);
        }

      });

    });

  }
  
  return Hero;

})();
window.theme = window.theme || {};
window.theme.slideshows = window.theme.slideshows || {};

theme.RelatedBrands = (function() {

  var selectors = {
    slideshow: '[data-slideshow]'
  };

  function RelatedBrands(container) {

    this.$container = $(container);
    this.$slideshows = $(selectors.slideshow, this.$container);

    $.each(this.$slideshows, function(index, slideshow) {
      theme.slideshows[slideshow] = new theme.Slideshow(slideshow);
    });

  }
  
  return RelatedBrands;

})();
window.theme = window.theme || {};
window.theme.slideshows = window.theme.slideshows || {};

theme.OrderingMadeSimple = (function() {

  var selectors = {
    slideshow: '[data-slideshow]'
  };

  function OrderingMadeSimple(container) {

    this.$container = $(container);
    this.$slideshows = $(selectors.slideshow, this.$container);
    this.slideshows = {};

    var self = this;

    $.each(this.$slideshows, function(index, slideshow) {
      self.slideshows[index] = theme.slideshows[slideshow] = new theme.Slideshow(slideshow);
    });

    this.viewData = {
      activeStep: 1,
      previousStep: 0,
      autoProgress: 0,
      stepCount: 0
    }

    this.viewData.stepCount = this.$container.data().stepCount;

    this.viewMethods = {
      updateStep: function(evt) {
        var newStep = $(evt.target).attr('data-go-to-step');
        self.goToStep(newStep);
      }
    }

    this.view = tinybind.bind(this.$container, {
      data: this.viewData,
      methods: this.viewMethods
    });

    this.startAutoProgress();


    $(self.$slideshows[0]).on('afterChange', function(event, slick, currentSlide) {
      self.viewData.activeStep = currentSlide + 1;
    });
  }

  OrderingMadeSimple.prototype = $.extend({}, OrderingMadeSimple.prototype, {
    goToStep: function(newStep) {
      var self = this;

      $(self.$slideshows[0]).slick('slickGoTo', newStep - 1);
      if (self.viewData.activeStep == newStep) {
        return;
      } else if (newStep > self.viewData.stepCount) {
        newStep = 1;
      } else if (newStep <= 0) {
        newStep = self.viewData.stepCount;
      }
      self.viewData.previousStep = parseInt(self.viewData.activeStep);
      // self.viewData.activeStep = parseInt(newStep);
      self.viewData.autoProgress = 0;
    },
    startAutoProgress: function() {
      var self = this;

      var duration = 10000;
      var interval = duration / 100;

      self.autoProgress = setInterval(function() {
        if (self.viewData.autoProgress >= 100) {
          var newStep = self.viewData.activeStep + 1;
          self.goToStep(newStep);
        } else {
          self.viewData.autoProgress++
        }
      }, interval)

    }
  });
  
  return OrderingMadeSimple;

})();
window.theme = window.theme || {};

theme.DashboardDynamicWelcome = (function() {

  var selectors = {
    title: '[data-dynamic-welcome-title]',
    message: '[data-dynamic-welcome]',
    data: '#dynamic-welcome-data'
  };

  function DashboardDynamicWelcome(container) {

    this.$container = $(container);
    this.$title = $(selectors.title);
    this.$message = $(selectors.message);
    this.data = JSON.parse($(selectors.data).html());

    if (!this.$message.length) {
      return;
    }

    var currentDate = new Date();
    var currentHour = currentDate.getHours();

    var message = 'Hello there';
    var timePeriod;
    var icon;

    if (currentHour < 4) {
      timePeriod = 'early_morning';
    } else if (currentHour >= 4 && currentHour < 12) {
      timePeriod = 'morning';
    } else if (currentHour >= 12 && currentHour < 17) {
      timePeriod = 'afternoon';
    } else if (currentHour >= 17 && currentHour < 18) {
      timePeriod = 'evening';
    } else {
      timePeriod = 'night';
    }

    message = this.data[timePeriod];
    icon = theme.utils.getTemplate('dynamic-welcome-icon-' + timePeriod);

    $(selectors.message).html(message);
    $(selectors.title).append(icon);

    this.$title.addClass('fade-in');
  
  }

  return DashboardDynamicWelcome;

})();
window.theme = window.theme || {};
window.theme.tabsGroups = window.theme.tabsGroups || {};

theme.DashboardPlaceOrder = (function() {
  var selectors = {
    tabsGroup: '.tabs-group',
    tabContent: '[data-tab]',
    accountViewRight: '.account__view-right'
  };

  function DashboardPlaceOrder(container) {

    this.$container = $(container);

    this.$accountViewRight = $(selectors.accountViewRight);
    this.$accountViewRight.addClass('hidden');

    if (!this.$container.length) {
      return;
    }

    this.$tabsGroup = $(selectors.tabsGroup, this.$container);
    this.$tabs = $(selectors.tabContent, this.$container);

    var self = this;

    var activeTab = this.$tabs.length;

    if (window.location.href.indexOf('search') > -1) {
      activeTab = 1;
    }

    if (window.location.href.indexOf('cart') > -1) {
      activeTab = this.$tabs.length;
      this.$accountViewRight.removeClass('hidden');
    }

    if (window.location.href.indexOf('account') > -1) {
      activeTab = 1;
    }

    $.each(this.$tabsGroup, function(index, tabsGroup) {

      window.theme.tabsGroups[tabsGroup] = new theme.TabsGroup(tabsGroup, {
        breakpoint: 0,
        activeTab: activeTab
      });

      window.theme.tabsGroups[tabsGroup].$tabsGroup.on('tabChange', function(evt) {
        var title = $(self.$tabs[evt.tabIndex - 1]).data('tabTitle');
        if (title.toLowerCase() == 'my cart') {
          self.$accountViewRight.removeClass('hidden');
        } else {
          self.$accountViewRight.addClass('hidden');
        }
      });

      window.theme.tabsGroups[tabsGroup].$navContainer.addClass('swipeable').css('overflow-x', 'auto');

      var $cartTab = window.theme.tabsGroups[tabsGroup].$navContainer.children().filter(function() {
        return $(this).data("targetTitle") == 'My Cart';
      });

      var cartCountHtml = '<span rv-class-cart-count--even="cart.item_count | modulo 2 | eq 0" rv-class-cart-count--odd="cart.item_count | modulo 2 | eq 1" class="cart-count" rv-html="cart.item_count">{{ cart.item_count }}</span>';
      
      $cartTab.append(cartCountHtml);
      tinybind.bind($cartTab, {cart: CartJS.cart})

    });


  }

  return DashboardPlaceOrder;
})();
window.theme = window.theme || {};

theme.DashboardReports = (function() {

  var selectors = {
    dropdownButton: '[data-dropdown-button]',
    dropdownOptions: '[data-dropdown-options]'
  };

  function DashboardReports(container) {

    this.$container = $(container);
    this.data = {};

    this.ui = {
      active: {}
    };

    this._bindView();
    this._getReportsData();

  }

  DashboardReports.prototype = $.extend({}, DashboardReports.prototype, {

    _getReportsData: function() {
      var self = this;

      // TODO: Check SessionStorage

      $.ajax({
        url: '/account?view=dashboard-reports-json'
      }).done(function(data) {
        var dataJson = JSON.parse(data.replace(/<!--[\s\S]*?-->/g, ""));
        self.data.reports = dataJson;
        self.ui.loadComplete = true;

        if (!dataJson.reports.length) {
          return;
        }

        self.ui.active = {
          days: dataJson.reports[0].days,
          title: dataJson.reports[0].title
        };

        self._bindDropdown();
      });

    },

    _bindView: function() {
      var self = this;

      var $el = self.$container;
      tinybind.bind($el, {
        ui: self.ui,
        data: self.data,
        actions: {
          toggleDropdown: self._toggleDropdown.bind(self),
          openDropdown: self._openDropdown.bind(self),
          closeDropdown: self._closeDropdown.bind(self),
          changeActiveReport: self._changeActiveReport.bind(self)
        }
      });

    },

    _toggleDropdown: function() {
      var self = this;
      self.ui.showDropdown = !self.ui.showDropdown;
    },

    _openDropdown: function() {
      var self = this;
      self.ui.showDropdown = true;
    },

    _closeDropdown: function() {
      var self = this;
      self.ui.showDropdown = false;
    },

    _changeActiveReport: function() {
      var self = this;

      var $target = $(event.target);
      var reportDays = $target.attr('data-report-days');
      var reportTitle = $target.attr('data-report-title');

      self.ui.active = {
        days: parseInt(reportDays),
        title: reportTitle
      };

      self._closeDropdown();
    },

    _bindDropdown: function() {
      var self = this;

      var $button = $(selectors.dropdownButton, self.$container);
      var $options = $(selectors.dropdownOptions, self.$container);

      self.dropdown = new Popper($button[0], $options[0], {
        placement: 'bottom-end'
      });
    }

  });

  return DashboardReports;

})();
window.theme = window.theme || {};

theme.CartSummary = (function() {

  var selectors = {

  };

  function CartSummary(container) {

    this.$container = $(container);
    this.$parent = $(container).parent();

    this.options = {
      breakpoint: 1200
    };

    this.breakpoints = {
      desktop: 'screen and (min-width: ' + this.options.breakpoint + 'px)',
      mobile: 'screen and (max-width: ' + (this.options.breakpoint - 1) + 'px)'
    };

    var offset = 40;
    this.$container.stickybits({stickyBitStickyOffset: offset});

    this.$dashboardTabs = $('.tabs-group--dashboard .tabs-group__tabs');
    this.$accountView = $('.account__view');

    var self = this;

    function buildDesktop() {

      self.$parent.height('100%');

      var paddingOffset = 0;
      if (self.$dashboardTabs.length && self.$accountView.length) {

        var tabsOffset = self.$dashboardTabs.offset().top;
        var accountOffset = self.$accountView.offset().top;
        paddingOffset = tabsOffset - accountOffset;
      }

      self.$parent.css('padding-top', paddingOffset + 'px');

    }

    function buildMobile() {

      self.$parent.height('auto');

      self.$parent.css('padding-top',  0 + 'px');
    }


    enquire.register(self.breakpoints.mobile, {
      match: function() {
        buildMobile();
      }
    });

    enquire.register(self.breakpoints.desktop, {
      match: function() {
        buildDesktop();
      }
    });

  }



  return CartSummary;

})();
window.theme = window.theme || {};
window.theme.slideshows = window.theme.slideshows || {};

theme.ProductRelatedProducts = (function() {

  var selectors = {
    slideshow: '[data-slideshow]'
  };

  function ProductRelatedProducts(container) {

    this.$container = $(container);
    this.$slideshows = $(selectors.slideshow, this.$container);

    $.each(this.$slideshows, function(index, slideshow) {
      theme.slideshows[slideshow] = new theme.Slideshow(slideshow);
    });

  }
  
  return ProductRelatedProducts;

})();
window.theme = window.theme || {};

theme.ConstantCart = (function() {

  var selectors = {
    cart: '.cart-drawer__inner',
    constantContainer: '.constant-cart',
    drawerContainer: '#CartDrawer',
    accountViewRight: '.account__view-right'
  };

  var options = {
    // breakpoint: 1200
    breakpoint: 1330
  };

  var breakpoints = {
    desktop: 'screen and (min-width: ' + options.breakpoint + 'px)',
    mobile: 'screen and (max-width: ' + (options.breakpoint - 1) + 'px)'
  };

  function ConstantCart(container) {

    this.$container = $(container);
    this.$constantContainer = $(selectors.constantContainer, this.$container);
    this.$drawerContainer = $(selectors.drawerContainer);
    this.$cart = $(selectors.cart);
    this.$accountViewRight = this.$container.closest(selectors.accountViewRight);
    this.$stickyElement = this.$accountViewRight.children().first();

    var self = this;

    this.$stickyElement.stickybits({stickyBitStickyOffset: 40});

    enquire.register(breakpoints.mobile, {
      match: function() {
        self._makeDrawer();
      }
    });

    enquire.register(breakpoints.desktop, {
      match: function() {
        self._makeConstant();
      }
    });

  }

  ConstantCart.prototype = $.extend({}, ConstantCart.prototype, {

    _makeConstant: function() {
      this.$cart.detach();
      this.$constantContainer.append(this.$cart);

      $('body').addClass('cart-is-constant');
      this.$accountViewRight.css('display', '');
    },

    _makeDrawer: function() {
      this.$cart.detach();
      this.$drawerContainer.append(this.$cart);

      $('body').removeClass('cart-is-constant');
      this.$accountViewRight.css('display', 'none');

    }

  });
  
  return ConstantCart;

})();
window.theme = window.theme || {};

theme.StickySubNav = (function() {

  var selectors = {
    subNav: '.sticky-sub-nav'
  }

  var options = {
    stickybits: {}
  }

  function StickySubNav(container) {

      this.$container = $(container);

      this.$subNav = $(selectors.subNav).insertBefore(this.$container.parent());
      this.$subNav.stickybits(options.stickybits);
  }

  return StickySubNav;
})();

window.theme = window.theme || {};

theme.QuoteWithParalax = (function() {

  var selectors = {
    imageLayer1: '.quote-with-paralax__image-layer-1 > img',
    imageLayer2: '.quote-with-paralax__image-layer-2 > img'
  }

  function QuoteWithParalax(container) {

      this.container = container;

      var imageLayer1 = document.querySelectorAll(selectors.imageLayer1);
      var imageLayer2 = document.querySelectorAll(selectors.imageLayer2);

      if (imageLayer1.length) {
        new simpleParallax(imageLayer1, {
          delay: .3,
          orientation: 'down',
          overflow: true,
          transition: 'cubic-bezier(0,0,0,1)'
        });
      }

      if (imageLayer2.length) {
        new simpleParallax(imageLayer2, {
          delay: 4,
          orientation: 'down',
          overflow: true,
          transition: 'cubic-bezier(0,0,0,1)'
        });
      }

  }

  return QuoteWithParalax;
})();


/*================ Templates ================*/
/**
 * Customer Addresses Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Customer Addresses
 * template.
 *
 * @namespace customerAddresses
 */

theme.customerAddresses = (function() {
  var $newAddressForm = $('#AddressNewForm');

  if ($newAddressForm.length) {

    // Initialize observers on address selectors, defined in shopify_common.js
    if (Shopify) {
      new Shopify.CountryProvinceSelector('AddressCountryNew', 'AddressProvinceNew', {
        hideElement: 'AddressProvinceContainerNew'
      });
    }

  }

  // Initialize each edit form's country/province selector
  $('.address-country-option').each(function() {
    var formId = $(this).data('form-id');
    var countrySelector = 'AddressCountry_' + formId;
    var provinceSelector = 'AddressProvince_' + formId;
    var containerSelector = 'AddressProvinceContainer_' + formId;

    new Shopify.CountryProvinceSelector(countrySelector, provinceSelector, {
      hideElement: containerSelector
    });
  });

  // // Toggle new/edit address forms
  // $('.address-new-toggle').on('click', function() {
  //   $newAddressForm.toggleClass('hide');
  // });

  // $('.address-edit-toggle').on('click', function() {
  //   var formId = $(this).data('form-id');
  //   $('#EditAddress_' + formId).toggleClass('hide');
  // });

  $('.address-delete').on('click', function() {
    var $el = $(this);
    var formId = $el.data('form-id');
    var confirmMessage = $el.data('confirm-message');
    if (confirm(confirmMessage || 'Are you sure you wish to delete this address?')) {
      Shopify.postLink('/account/addresses/' + formId, {parameters: {_method: 'delete'}});
    }
  });
})();

/**
 * Password Template Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Password template.
 *
 * @namespace password
 */

theme.customerLogin = (function() {

  var config = {
    recoverPasswordForm: '#RecoverPassword',
    newCustomerForm: '#NewCustomer',
    hideRecoverPasswordLink: '#HideRecoverPasswordLink',
    HideNewCustomerLink: '#HideNewCustomerLink'
  };

  if (!$(config.recoverPasswordForm).length) {
    return;
  }

  checkUrlHash();
  resetPasswordSuccess();
  newCustomerSuccess();

  $(config.recoverPasswordForm).on('click', onShowHidePasswordForm);
  $(config.hideRecoverPasswordLink).on('click', onShowHidePasswordForm);

  $(config.newCustomerForm).on('click', onShowHideNewCustomerForm);
  $(config.HideNewCustomerLink).on('click', onShowHideNewCustomerForm);

  function onShowHidePasswordForm(evt) {
    evt.preventDefault();

    if (!$('#RecoverEmail').val()) {
      var enteredEmail = $('#CustomerEmail').val();
      $('#RecoverEmail').val(enteredEmail);
    }

    toggleRecoverPasswordForm();
  }

  function onShowHideNewCustomerForm(evt) {
    evt.preventDefault();

    if (!$('#CreateEmail').val()) {
      var enteredEmail = $('#CustomerEmail').val();
      $('#CreateEmail').val(enteredEmail);
    }

    toggleNewCustomerForm();
  }

  function checkUrlHash() {
    var hash = window.location.hash;

    // Allow deep linking to recover password form
    if (hash === '#recover') {
      toggleRecoverPasswordForm();
    }

    if (hash === '#create') {
      toggleNewCustomerForm();
    }

  }

  /**
   *  Show/Hide recover password form
   */
  function toggleRecoverPasswordForm() {
    $('#RecoverPasswordForm').toggleClass('hide');
    $('#CustomerLoginForm').toggleClass('hide');
  }

  function toggleNewCustomerForm() {
    $('#NewCustomerForm').toggleClass('hide');
    $('#CustomerLoginForm').toggleClass('hide');
  }

  /**
   *  Show reset password success message
   */
  function resetPasswordSuccess() {
    var $formState = $('.reset-password-success');

    // check if reset password form was successfully submited.
    if (!$formState.length) {
      return;
    }

    // show success message
    $('#ResetSuccess').removeClass('hide');
    $('#CustomerLoginForm').toggleClass('hide');
  }

  function newCustomerSuccess() {
    var $formState = $('.new-customer-success');

    // check if reset password form was successfully submited.
    if (!$formState.length) {
      return;
    }

    // show success message
    $('#NewCustomerSuccess').removeClass('hide');
  }
})();
window.theme = window.theme || {};

theme.RegisterPage = (function() {
  var selectors = {
    registerPage: '.register-page',
  };

  if (!$(selectors.registerPage).length) {
    return;
  }

  var validateABN = function(abn) {
    var isValid = true;
    abn = abn.replace(/[^0-9]/g, '');
    isValid &= abn && /^\d{11}$/.test(abn);

    if(isValid){
      var weightedSum = 0;
      var weight = [10, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
      for (var i = 0; i < weight.length; i++) {
        weightedSum += (parseInt(abn[i]) - ((i === 0) ? 1 : 0)) * weight[i]; 
      }
      isValid &= ((weightedSum % 89) === 0);
    }

    return isValid;
  };

  var abnField = document.getElementById('CustomerFormABN');
  if (abnField !== undefined && abnField !== null) {
    abnField.addEventListener('input', function (event) {
      if (abnField.validity.typeMismatch || validateABN(abnField.value) != true) {
        abnField.setCustomValidity('Please enter a valid ABN.');
      } else {
        abnField.setCustomValidity('');
      }
    });
  }

  if ($('#CustomerFormCustomerType').length) {
    updateRegisterFormFields($('#CustomerFormCustomerType').val());

    $('#CustomerFormCustomerType').on('change', function(){
      updateRegisterFormFields($(this).val());
    });
  }

  $('.form-element--product-interest label:last-child input').on('change', function() {
    $('.form-element--product-interest label input').not(this).prop('checked', this.checked);
  });

  $('.form-element--product-interest label:not(:last-child) input').on('change', function() {
    $('.form-element--product-interest label:last-child input').prop('checked', false);
  });
  
  function updateRegisterFormFields(selector) {
    var activeGroup = theme.utils.handleize(selector);
    var activeSelector = '.form-element--' + activeGroup;
    
    $('.form-element--toggles').not(activeSelector).hide();
    $('.form-element--toggles').not(activeSelector).removeClass('form-element--visible');
    $('.form-element--toggles').not(activeSelector).prop('disabled', true);
    
    $(activeSelector).show();
    $(activeSelector).addClass('form-element--visible');
    $(activeSelector).prop('disabled', false);
    
    $('input[name="tags"]').val(activeGroup);
  };

})();

window.theme = window.theme || {};

theme.Password = (function() {
  var selectors = {
    passwordPage: '.password-page',
    loginModal: '#LoginModal',
    focusOnOpen: '#Password'
  };

  if (!$(selectors.passwordPage).length) {
    return;
  }

  initModal();

  function initModal() {

    var $loginModal = $(selectors.loginModal);

    if (!$loginModal.length) {
      return;
    }

    var passwordModal = new theme.Modals(selectors.loginModal, 'login-modal', {
      focusOnOpen: selectors.focusOnOpen
    });

    // Open modal if errors exist
    if ($loginModal.find('.errors').length) {
      passwordModal.open();
    }

  }
})();

(function() {
  var $filterBy = $('#BlogTagFilter');

  if (!$filterBy.length) {
    return;
  }

  $filterBy.on('change', function() {
    location.href = $(this).val();
  });

})();

function requestPopup() {
  let selectors = {
    $popupHash: "[data-popup-hash]",
    popupHashAttr: "data-popup-hash",
    $popup: ".request-popup-wrapper",
    $popupClose: ".popup-close-btn",
    popupShowClass: "active"
  }

  if($(selectors.$popupHash).length > 0) {
    let getHash = $(selectors.$popupHash).attr(selectors.popupHashAttr);
    let windowHref = location.href;

    if(windowHref.includes('#'+getHash)) {
      setTimeout(function() {
        $(selectors.$popup).addClass(selectors.popupShowClass);
        $('body, html').css({'overflow': 'hidden'})
      }, 500)
    }

    $(selectors.$popupClose).on('click', function() {
      $(selectors.$popup).removeClass(selectors.popupShowClass);
      $('body, html').css({'overflow': 'visible'})
    })
  }
}

$(document).ready(function() {

  // Object-fit polyfill initialise
  objectFitImages();

  // Hacky IE Lazysizes fix until we find a better solution or drop IE
  var ms_ie = !!window.navigator.userAgent.match(/MSIE|Trident/);
  if (ms_ie) {
    var lazyImageChecker = window.setInterval(function(){
      if(!$('img.lazyload').length) { window.clearInterval(lazyImageChecker);console.log(5); }
      $('img.lazyloading').each(function(){
        var imageSrc = $(this).attr('data-src');
        $(this).removeClass('lazyloading');
        $(this).get(0).src = imageSrc;
      });
    }, 3000);
  }

  var sections = new slate.Sections();
  sections.register('cart-template', theme.Cart);
  sections.register('product', theme.Product);
  sections.register('collection', theme.Collection);
  sections.register('sticky-sub-nav', theme.StickySubNav);
  sections.register('product-template', theme.Product);
  sections.register('header-section', theme.HeaderSection);
  sections.register('map', theme.Maps);
  sections.register('slideshow-section', theme.SlideshowSection);
  sections.register('quotes', theme.Quotes);
  sections.register('brand-values', theme.BrandValueSliders);
  sections.register('featured-collection', theme.FeaturedCollection);
  sections.register('featured-collections', theme.FeaturedCollections);
  sections.register('featured-product', theme.FeaturedProducts);
  sections.register('image-row', theme.ImageRows);
  sections.register('content-slider', theme.ContentSliders);
  sections.register('latest-blog-posts', theme.LatestBlogPosts);
  sections.register('hero', theme.Hero);
  sections.register('related-brands', theme.RelatedBrands);
  sections.register('ordering-made-simple', theme.OrderingMadeSimple);
  sections.register('dashboard-dynamic-welcome', theme.DashboardDynamicWelcome);
  sections.register('dashboard-place-order', theme.DashboardPlaceOrder);
  sections.register('dashboard-reports', theme.DashboardReports);
  sections.register('cart-summary', theme.CartSummary);
  sections.register('product-related-products', theme.ProductRelatedProducts);
  sections.register('constant-cart', theme.ConstantCart);
  sections.register('quote-with-paralax', theme.QuoteWithParalax);

  requestPopup();
  
  // Common a11y fixes
  slate.a11y.pageLinkFocus($(window.location.hash));

  $('.in-page-link').on('click', function(evt) {
    slate.a11y.pageLinkFocus($(evt.currentTarget.hash));
  });

  $('a[href="#"]').on('click', function(evt) {
    evt.preventDefault();
  });

  // Wrap videos in div to force responsive layout.
  slate.rte.wrapTable();
  slate.rte.iframeReset();

  // Apply a specific class to the html element for browser support of cookies.
  if (slate.cart.cookiesEnabled()) {
    document.documentElement.className = document.documentElement.className.replace('supports-no-cookies', 'supports-cookies');
  }

  // Setup progress bar plugin
  if ('NProgress' in window) {
    NProgress.configure({ showSpinner: false });
  }

  // $('.collection-filters a').click(function(e){
  //   e.preventDefault();
  //   var $this = $(this);
  //   $gridContainer = $('.collection-grid .row');
    
  //   $gridContainer.empty().addClass('loading');
    
  //   $.ajax({
  //     url: $this.attr('href') + '?view=json'
  //   }).done(function(data) {
  //     var products = JSON.parse(data);
  //     template = $('#collection_grid_tpl').html();
  //     for (var i = 0; i < products.length; i++) {
  //       var newProduct = template;
  //       product = products[i];

  //       newProduct = newProduct.replace(/\{url\}/g, product.url);
  //       newProduct = newProduct.replace(/\{title\}/g, product.title);
  //       newProduct = newProduct.replace(/\{price\}/g, product.price);
  //       newProduct = newProduct.replace(/\{image\}/g, product.featured_image);
  //       $gridContainer.append(newProduct);
  //     }
  //   });

  // });

  // #TODO Replace this with some nicer logic - Rivets, slick, etc.
  theme.RecentlyViewed.showRecentlyViewed( { howManyToShow:4 } );

  $(document).on('click', '.pagination a', function(e) {
    var $this = $(this);
    if (!$this.hasClass('pagination__view-all')) {
      var $paginationElem = $this.parents('.pagination');
      var targetContainer = $paginationElem.data('target-container');
      var targetContainerOffset = $paginationElem.data('offset') || 0;

      if (targetContainer) {
        e.preventDefault();
        var $parentElem = $(targetContainer).parent();
        var targetURL = $this.attr('href');
        var match = RegExp('[?&]page=([^&]*)').exec(targetURL);
        var targetPage = match && decodeURIComponent(match[1].replace(/\+/g, ' ')) || 1;
        
        $parentElem.addClass('ajax-loading');
      
        $('html, body').animate({ scrollTop: $(targetContainer).offset().top + targetContainerOffset }, 500 );
        // If page already exists
        if ($(targetContainer+'[data-page="'+targetPage+'"]').length) { 
          $(targetContainer).not('[data-page="'+targetPage+'"]').fadeOut('slow');
          $(targetContainer+'[data-page="'+targetPage+'"]').fadeIn('slow');
          history.pushState({}, targetPage, targetURL);
          $parentElem.offset().top;
          $parentElem.removeClass('ajax-loading');
        } else {
          $.ajax({
            type: 'GET',
            dataType: 'html',
            url: targetURL + '&view=ajax',
            success: function(data) {
              $(targetContainer).not('[data-page="'+targetPage+'"]').fadeOut('slow');
              history.pushState({}, targetPage, targetURL);
              var appendData = $(data).find(targetContainer).prependTo($parentElem).hide();
              
              var $qtyInputs = $('input[type="number"]', appendData);
              $qtyInputs.each( function(){
                var $el = $(this);
                theme.QuantitySelectors.init($el);
              });

              appendData.fadeIn('slow');
              $parentElem.offset().top;
              $parentElem.removeClass('ajax-loading');
            }
          });
        }
      }
    }
  });

  // $('#MainContent').on('click.quickAddToCart', '.product-grid-item .btn-add-to-cart', function(evt){
  //   var $this = $(this);
  //   var $container = $('#product-grid-item-' + $this.data('product-id'));
  //   var qty = $('input[name="quantity"]', $container).val();
  //   var progressElementSelector = $('[data-progress-element]', $container).data('progress-element');
  //   var $progressElement = progressElementSelector ? $(progressElementSelector) : $(this);

  //   if (qty > 0) {
  //     var variantId = $('#variant-select-' + $this.data('product-id') + ' option:selected').val();
      
  //     CartJS.addItem(variantId, qty, {}, {
  //       "success": function(data, textStatus, jqXHR) {
  //         iziToast.success({
  //           title: 'Success!',
  //           message: 'Added to cart.',
  //           position: 'bottomCenter',
  //           theme: 'light',
  //           buttons: [
  //             ['<button>View</button>', function (instance, toast) {
  //               instance.hide(toast);
  //               theme.CartDrawer.open();
  //             }]
  //           ]
  //         });
  //       }
  //     });
  //   } else {
  //     $progressElement.removeClass('loading');
  //     $progressElement.addClass('error');
  //     window.setTimeout(function(){
  //       $progressElement.removeClass('error');
  //     }, 1500);
  //     evt.stopImmediatePropagation();
  //   }
  // });

  $('.product-grid-form__items select').on('change', function(){
    var $selectedOption = $(this).find('option:selected');
    var productId = $(this).parents('.product-grid-form').data('product-id');
    var variantPrice = Currency.formatMoney(Currency.convert($selectedOption.data('price'), shop.currency, Currency.currentCurrency), Currency.currentFormat);
    
    $('#product-grid-item-' + productId + ' span.money').html(variantPrice);
    $('#product-grid-item-' + productId + ' input[name="quantity"]').val(0);
    $('#product-grid-item-' + productId + ' .btn-add-to-cart').removeClass('active');
    // $(this).attr('data-currency-' + shop.currency, $(this).html());
  });

  $('.product-grid-form__items').on('update.qtySelector', 'input[name="quantity"]', function(evt){
  // $('.product-grid-form__items').on('click', '.js-qty-select button', function(){
  //   var productId = $(this).parents('.product-grid-form').data('product-id');
  //   var selectedVariantId = $('#variant-select-' + productId + ' option:selected').val();
  //   var variantQuantity = $(this).siblings('input[name="quantity"]').val();
  //   // CartJS.updateItemById({selectedVariantId, variantQuantity});
    var quantity = $(evt.target).val();
    var productId = $(this).parents('.product-grid-form').data('product-id');
    var $addButton = $('#product-grid-item-' + productId + ' .btn-add-to-cart');
    if (quantity > 0) {
      $addButton.addClass('active');
    } else {
      $addButton.removeClass('active');
    }
  });


  // Transition helpers
  $('[data-prepare-transition="hover"]').bind('mouseenter', function(){
    var activeClass = $(this).data('data-prepare-transition-class') || 'hover';
    $(this).prepareTransition().addClass(activeClass);
  });

  $('[data-prepare-transition="hover"]').bind('mouseleave', function(){
    var activeClass = $(this).data('data-prepare-transition-class') || 'hover';
    $(this).prepareTransition().removeClass(activeClass);
  });


  // Update 'last viewed of type' text to match last viewed object, e.g. breadcrumbs
  $('[data-last-viewed]').each(function(){
    var $this = $(this);
    var type = $this.data('last-viewed');
    var typeVar = 'lastViewed' + type.charAt(0).toUpperCase() + type.slice(1);
    var lastViewed = sessionStorage[typeVar];
    
    if (lastViewed !== undefined) {
      type += 's';
      var relatedObjects = $this.data('related-' + type);
      if (relatedObjects[lastViewed] !== undefined) {
        $this.text(relatedObjects[lastViewed].title);
      }
    }
  });

  // Show password buttons
  $('.form-vertical__password-toggle').on('click', function(){
    var $input = $($(this).siblings('input'));
    
    $(this).toggleClass('active');
    
    if ($input.attr('type') == 'password') {
      $input.attr('type', 'text');
    } else {
      $input.attr('type', 'password');
    }
  });

  if (window.location.hostname == 'localhost') {
    document.documentElement.classList.add('localhost');
  }

  // var $registerForm = $("#register_form");
  // if ($registerForm.length > 0) {
  //   console.info('Register form exists');

  //   loadJS('https://app.accentuate.io/dist/proxy.js', function() {
  //     console.info('Loaded');
  //     Accentuate($("#register_form"), function(data) { console.log(data.status, data.message); });
  //   });
  // }

  try {
    var colorPrimary = getComputedStyle(document.body).getPropertyValue('--color-primary').trim();
    $('meta[name=theme-color]').attr('content', colorPrimary);
  } catch (err) {
    console.error(err);
  }


});
