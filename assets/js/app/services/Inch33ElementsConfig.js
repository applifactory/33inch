var Inch33ElementsConfig = {
  "header-straight": {
    "elements": [{
      "name": "Title",
      "type": "text",
      "selector": ".hero h1",
      "elements": true
    }, {
      "name": "Claim",
      "type": "text",
      "selector": ".hero h2",
      "elements": true
    }]
  },
  "header-slider": {
    "elements": [{
      "name": "Title",
      "type": "text",
      "selector": ".hero h1",
      "elements": true
    }, {
      "name": "Claim",
      "type": "text",
      "selector": ".hero h2",
      "elements": true
    }]
  },
  "header-section": {
    "elements": [{
      "name": "Title",
      "type": "text",
      "selector": "h1",
      "elements": true,
      "id": "h1"
    }]
  },
  "article-text": {
    "style": {
      "backgroundColor": "#ffffff"
    },
    "elements": [{
      "name": "Title",
      "type": "text",
      "selector": ".container h1",
      "elements": true
    }, {
      "name": "Claim",
      "type": "text",
      "selector": ".container .claim",
      "elements": true
    }, {
      "name": "Text",
      "type": "text",
      "selector": ".container .regular",
      "elements": false
    }]
  },
  "article-features": {
    "style": {
      "backgroundColor": "#F5F5F5"
    },
    "columns": {
      "min": 2,
      "max": 5,
      "default": 3
    },
    "elements": [{
      "name": "Title",
      "type": "text",
      "selector": ".container h1",
      "elements": true
    }, {
      "name": "Claim",
      "type": "text",
      "selector": ".container .regular",
      "elements": false
    }, {
      "name": "Item title",
      "type": "text",
      "selector": ".container li h3",
      "elements": true,
      "column": true
    }, {
      "name": "Item text",
      "type": "text",
      "selector": ".container li p",
      "elements": true,
      "column": true
    }, {
      "name": "Image",
      "type": "image",
      "selector": "ul li .image img",
      "elements": true,
      "column": true
    }]
  },
  "attachements-list": {
    "columns": {
      "min": 3,
      "max": 6,
      "default": 4
    },
    "elements": [{
      "name": "Title",
      "type": "text",
      "selector": ".container h1",
      "elements": true,
      "id": "container-h1"
    }, {
      "name": "Claim",
      "type": "text",
      "selector": ".container .regular",
      "elements": false,
      "id": "container-regular"
    }, {
      "name": "Item title",
      "type": "text",
      "selector": ".container li a",
      "column": true,
      "id": "container-li-a"
    }, {
      "type": "attachement",
      "selector": ".container li",
      "column": true,
      "id": "container-li"
    }]
  },
  "showcase-grid": {
    "background": false,
    "style": {
      "backgroundColor": "#1D262D"
    },
    "columns": {
      "min": 2,
      "max": 6,
      "default": 3
    },
    "elements": [{
      "name": "Title",
      "type": "text",
      "selector": "li h3",
      "column": true
    }, {
      "name": "Background",
      "type": "background",
      "selector": "ul li",
      "column": true
    }]
  },
  "slider-straight": {
    "background": false,
    "columns": {
      "min": 1,
      "max": 1,
      "default": 1
    },
    "elements": [{
      "name": "Title",
      "type": "text",
      "selector": ".hero h1",
      "elements": true,
      "column": true
    }, {
      "name": "Claim",
      "type": "text",
      "selector": ".hero h2",
      "elements": true,
      "column": true
    }, {
      "name": "Background",
      "type": "background",
      "selector": ".slides .slide",
      "column": true
    }]
  },
  "slider-left": {
    "background": false,
    "columns": {
      "min": 1,
      "max": 1,
      "default": 1
    },
    "elements": [{
      "name": "Title",
      "type": "text",
      "selector": ".hero h1",
      "elements": true,
      "column": true
    }, {
      "name": "Claim",
      "type": "text",
      "selector": ".hero h2",
      "elements": true,
      "column": true
    }, {
      "name": "Background",
      "type": "background",
      "selector": ".slides .slide",
      "column": true
    }]
  },
  "list-grid": {
    "style": {
      "backgroundColor": "#C0A85A"
    },
    "columns": {
      "min": 1,
      "max": 4,
      "default": 2
    },
    "elements": [{
      "name": "Title",
      "type": "text",
      "selector": ".container li h3",
      "elements": true,
      "column": true
    }, {
      "name": "Text",
      "type": "text",
      "selector": ".container li p",
      "elements": true,
      "column": true
    }]
  },
  "menu-default": {},
  "pricing-default": {
    "elements": [{
      "name": "Title",
      "type": "text",
      "selector": "h1",
      "elements": false
    }, {
      "name": "Claim",
      "type": "text",
      "selector": ".regular",
      "elements": true
    }, {
      "name": "Items",
      "type": "text",
      "selector": ".table .items p"
    }, {
      "name": "Prices",
      "type": "text",
      "selector": ".table .prices p"
    }, {
      "name": "Sub-text",
      "type": "text",
      "selector": "p.small",
      "elements": true
    }]
  },
  "footer-default": {
    "elements": [{
      "name": "Name",
      "type": "text",
      "selector": "form .name label",
      "id": "form-name-label"
    }, {
      "name": "Email",
      "type": "text",
      "selector": "form .email label",
      "id": "form-email-label"
    }, {
      "name": "Message",
      "type": "text",
      "selector": "form .message label",
      "id": "form-message-label"
    }, {
      "name": "Title",
      "type": "text",
      "selector": "h3",
      "elements": true,
      "id": "h3"
    }, {
      "name": "Claim",
      "type": "text",
      "selector": "p.regular",
      "elements": true,
      "id": "p-regular"
    }, {
      "name": "Place",
      "type": "text",
      "selector": "li.place",
      "elements": true,
      "id": "li-place"
    }, {
      "name": "Email",
      "type": "text",
      "selector": "li.mail",
      "elements": true,
      "id": "li-mail"
    }, {
      "name": "Phone",
      "type": "text",
      "selector": "li.phone",
      "elements": true,
      "id": "li-phone"
    }, {
      "name": "Twitter",
      "type": "text",
      "selector": "li.twitter",
      "elements": true,
      "id": "li-twitter"
    }]
  },
  "subscribe-form": {
    "elements": [{
      "name": "Title",
      "type": "text",
      "selector": ".container h1",
      "elements": true
    }, {
      "name": "Claim",
      "type": "text",
      "selector": ".container p",
      "elements": true
    }, {
      "name": "Email",
      "type": "text",
      "selector": ".container .email label"
    }, {
      "name": "Name",
      "type": "text",
      "selector": ".container .name label"
    }, {
      "name": "Name",
      "type": "input",
      "selector": ".container .name",
      "elements": true
    }]
  }
}
