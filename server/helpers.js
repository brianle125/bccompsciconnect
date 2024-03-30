const sanitizeHtml = require("sanitize-html")

const sanitizeOptions = {
    allowedTags: [
      "h5", "h6", "hgroup", "main", "nav", "section", "blockquote", "dd", "div",
      "address", "article", "aside", "footer", "header", "h1", "h2", "h3", "h4",
      "dl", "dt", "figcaption", "figure", "hr", "li", "main", "ol", "p", "pre",
      "ul", "a", "abbr", "b", "bdi", "bdo", "br", "cite", "code", "data", "dfn",
      "em", "i", "kbd", "mark", "q", "rb", "rp", "rt", "rtc", "ruby", "s", "samp",
      "small", "span", "strong", "sub", "sup", "time", "u", "var", "wbr", "caption",
      "col", "colgroup", "table", "tbody", "td", "tfoot", "th", "thead", "tr", "markdown"
    ],
    nonBooleanAttributes: [
      'abbr', 'accept', 'accept-charset', 'accesskey', 'action',
      'allow', 'alt', 'as', 'autocapitalize', 'autocomplete',
      'blocking', 'charset', 'cite', 'class', 'color', 'cols',
      'colspan', 'content', 'contenteditable', 'coords', 'crossorigin',
      'data', 'datetime', 'decoding', 'dir', 'dirname', 'download',
      'draggable', 'enctype', 'enterkeyhint', 'fetchpriority', 'for',
      'form', 'formaction', 'formenctype', 'formmethod', 'formtarget',
      'headers', 'height', 'hidden', 'high', 'href', 'hreflang',
      'http-equiv', 'id', 'imagesizes', 'imagesrcset', 'inputmode',
      'integrity', 'is', 'itemid', 'itemprop', 'itemref', 'itemtype',
      'kind', 'label', 'lang', 'list', 'loading', 'low', 'max',
      'maxlength', 'media', 'method', 'min', 'minlength', 'name',
      'nonce', 'optimum', 'pattern', 'ping', 'placeholder', 'popover',
      'popovertarget', 'popovertargetaction', 'poster', 'preload',
      'referrerpolicy', 'rel', 'rows', 'rowspan', 'sandbox', 'scope',
      'shape', 'size', 'sizes', 'slot', 'span', 'spellcheck', 'src',
      'srcdoc', 'srclang', 'srcset', 'start', 'step', 'style',
      'tabindex', 'target', 'title', 'translate', 'type', 'usemap',
      'value', 'width', 'wrap',
      // Event handlers
      'onauxclick', 'onafterprint', 'onbeforematch', 'onbeforeprint',
      'onbeforeunload', 'onbeforetoggle', 'onblur', 'oncancel',
      'oncanplay', 'oncanplaythrough', 'onchange', 'onclick', 'onclose',
      'oncontextlost', 'oncontextmenu', 'oncontextrestored', 'oncopy',
      'oncuechange', 'oncut', 'ondblclick', 'ondrag', 'ondragend',
      'ondragenter', 'ondragleave', 'ondragover', 'ondragstart',
      'ondrop', 'ondurationchange', 'onemptied', 'onended',
      'onerror', 'onfocus', 'onformdata', 'onhashchange', 'oninput',
      'oninvalid', 'onkeydown', 'onkeypress', 'onkeyup',
      'onlanguagechange', 'onload', 'onloadeddata', 'onloadedmetadata',
      'onloadstart', 'onmessage', 'onmessageerror', 'onmousedown',
      'onmouseenter', 'onmouseleave', 'onmousemove', 'onmouseout',
      'onmouseover', 'onmouseup', 'onoffline', 'ononline', 'onpagehide',
      'onpageshow', 'onpaste', 'onpause', 'onplay', 'onplaying',
      'onpopstate', 'onprogress', 'onratechange', 'onreset', 'onresize',
      'onrejectionhandled', 'onscroll', 'onscrollend',
      'onsecuritypolicyviolation', 'onseeked', 'onseeking', 'onselect',
      'onslotchange', 'onstalled', 'onstorage', 'onsubmit', 'onsuspend',
      'ontimeupdate', 'ontoggle', 'onunhandledrejection', 'onunload',
      'onvolumechange', 'onwaiting', 'onwheel'
    ],
    disallowedTagsMode: 'discard',
    allowedAttributes: {
      a: [ 'href', 'name', 'target' ],
      // We don't currently allow img itself by default, but
      // these attributes would make sense if we did.
      img: [ 'src', 'srcset', 'alt', 'title', 'width', 'height', 'loading' ]
    },
    // Lots of these won't come up by default because we don't allow them
    selfClosing: [ 'img', 'br', 'hr', 'area', 'base', 'basefont', 'input', 'link', 'meta' ],
    // URL schemes we permit
    allowedSchemes: [ 'http', 'https', 'ftp', 'mailto', 'tel' ],
    allowedSchemesByTag: {},
    allowedSchemesAppliedToAttributes: [ 'href', 'src', 'cite' ],
    allowProtocolRelative: true,
    enforceHtmlBoundary: false,
    parseStyleAttributes: true
}

const helpers = {
    sanitizePost: function (text) {
        return sanitizeHtml(text, sanitizeOptions)
    }
}

module.exports = helpers