rsc = (function(){
var rsc = {
  version: '0.0.1'
};
/** @namespace utils */
rsc.utils = {};

/**
 * Generates a UUID
 * @memberof utils
 * @alias generateUUID
 * @returns {string}
 */
rsc.utils.generateUUID = function() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  });
};

/**
 * Converts a string to a hash code
 * @memberof utils
 * @alias stringToHashCode
 * @param {string} str - The string to convert
 * @returns {number}
 */
rsc.utils.stringToHashCode = function(str) {
  var hash = 0, i, char;
  if (str.length === 0) return hash;
  for (i = 0, l = str.length; i < l; i++) {
    char  = str.charCodeAt(i);
    hash  = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

/**
 * Generates a deep copy of an object or array
 * @memberof utils
 * @alias deepCopy
 * @param {object|array} o - The object or array to copy
 * @returns {object}
 */
rsc.utils.deepCopy = function(o) {
  var copy = o,k;

  if (o && typeof o === 'object') {
    copy = Object.prototype.toString.call(o) === '[object Array]' ? [] : {};
    for (k in o) {
      copy[k] = rsc.utils.deepCopy(o[k]);
    }
  }

  return copy;
};

/**
 * Converts a date to UTC
 * @memberof utils
 * @alias convertDateToUTC
 * @param {object} date - The date object to convert
 * @returns {date}
 */
rsc.utils.convertDateToUTC = function(date) {
  return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
};

/**
 * Formats a date into a readable string
 * @memberof utils
 * @alias multiTimeFormat
 * @param {object|number} d - The date object or datetime (millis) to format
 * @returns {string}
 */
rsc.utils.multiTimeFormat = function(d) {
  var format = d3.time.format.multi([
    [".%L", function(d) { return d.getMilliseconds(); }],
    [":%S", function(d) { return d.getSeconds(); }],
    ["%I:%M", function(d) { return d.getMinutes(); }],
    ["%I %p", function(d) { return d.getHours(); }],
    ["%a %d", function(d) { return d.getDay() && d.getDate() != 1; }],
    ["%b %d", function(d) { return d.getDate() != 1; }],
    ["%B", function(d) { return d.getMonth(); }],
    ["%Y", function(d) { return true; }]
  ]);

  return format(typeof d === 'object' ? d : rsc.utils.convertDateToUTC(new Date(d)));
};

/**
 * Formats a date into a simple string
 * @memberof utils
 * @alias timeFormat
 * @param {object|number} d - The date object or datetime (millis) to format
 * @returns {string}
 */
rsc.utils.timeFormat = function(d) {
  var format = d3.time.format('%x %X');
  return format(typeof d === 'object' ? d : rsc.utils.convertDateToUTC(new Date(d)));
};

/**
 * Format a number to an abbreviated scale
 * @memberof utils
 * @alias unitSuffixFormat
 * @param {number} d - The number to format
 * @returns {string}
 */
rsc.utils.unitSuffixFormat = function(d) {
  var prefix = d3.formatPrefix(d);
  return Number(prefix.scale(d).toFixed(2)) + prefix.symbol;
};

/**
 * Convert a data array to mimic series format
 * @memberof utils
 * @alias convertDataToSeries
 * @param {array} d - The data array to convert
 * @returns {array}
 */
rsc.utils.convertDataToSeries = function(d) {
  return [{ key: 'temp', values: d }];
};
/** @namespace tooltip */
rsc.tooltip = {};

/**
 * Show the tooltip
 * @memberof tooltip
 * @alias show
 * @param {number} x - The x position
 * @param {number} y - The y position
 * @param {object} parent - The parent node to place the tooltip
 * @param {string} content - The content of the tooltip
 */
rsc.tooltip.show = function(x, y, parent, content) {
  var tooltip = parent.select('.rsc-tooltip');
  if (!tooltip.node()) {
    tooltip = parent.append('div')
      .attr('class', 'rsc-tooltip')
      .style('left', '0')
      .style('top', '0');
  }

  tooltip
    .style('opacity', '0')
    .html(content);

  var left = x - tooltip.node().clientWidth / 2,
    top = y - tooltip.node().clientHeight - 10,
    parentWidth = parseInt(parent.style('width'), 10);

  if (left < 0) {
    left = 0;
  } else if (left + tooltip.node().clientWidth > parentWidth) {
    left = parentWidth - tooltip.node().clientWidth;
  }
  if (top < 0) {
    top = 0;
  }

  tooltip
    .style('left', left + 'px')
    .style('top', top + 'px')
    .style('opacity', 1);
};

/**
 * Update the position of the tooltip
 * @memberof tooltip
 * @alias update
 * @param {number} x - The x position
 * @param {number} y - The y position
 * @param {object} parent - The parent node that contains the tooltip
 */
rsc.tooltip.update = function(x, y, parent) {
  var tooltip = parent.select('.rsc-tooltip');

  var left = x - tooltip.node().clientWidth / 2,
    top = y - tooltip.node().clientHeight - 10,
    parentWidth = parseInt(parent.style('width'), 10);

  if (left < 0) {
    left = 0;
  } else if (left + tooltip.node().clientWidth > parentWidth) {
    left = parentWidth - tooltip.node().clientWidth;
  }
  if (top < 0) {
    top = 0;
  }

  tooltip
    .style('left', left + 'px')
    .style('top', top + 'px');
};

/**
 * Hide the tooltip
 * @memberof tooltip
 * @alias hide
 * @param {object} parent - The parent node that contains the tooltip
 */
rsc.tooltip.hide = function(parent) {
  var tooltips = parent.selectAll('.rsc-tooltip');

  tooltips
    .style('opacity', 0);
};

/**
 * Remove the tooltip
 * @memberof tooltip
 * @alias remove
 * @param {object} parent - The parent node that contains the tooltip
 */
rsc.tooltip.remove = function(parent) {
  var tooltips = parent.selectAll('.rsc-tooltip');

  tooltips.remove();
};
/** @namespace interact */
rsc.interact = {};

/**
 * Trigger mouseover interaction
 * @memberof interact
 * @alias mouseover
 * @param {array} nodesToIterate - The nodes to iterate over for changes
 * @param {object} nodeToCompare - The node to compare iterated nodes to
 * @param {function|array} nodesToChange - The nodes to change
 * @param {object} tooltipInfo - The data needed to generate a tooltip
 */
rsc.interact.mouseover = function(nodesToIterate, nodeToCompare, nodesToChange, tooltipInfo) {
  if (nodesToIterate) {
    nodesToIterate.each(function() {
      var nodes;

      if (typeof nodesToChange === 'function') {
        nodes = nodesToChange(this);
      } else {
        nodes = nodesToChange ? nodesToChange : d3.select(this);
      }

      if (this !== nodeToCompare) {
        nodes
          .classed('faded', true)
          .classed('bolden', false);
      } else {
        nodes
          .classed('faded', false)
          .classed('bolden', true);
      }
    });
  }

  if (tooltipInfo) {
    var mouse = d3.mouse(tooltipInfo.wrapper.node());
    rsc.tooltip.show(
      mouse[0],
      mouse[1],
      tooltipInfo.wrapper,
      tooltipInfo.text
    );
  }
};

/**
 * Trigger mouseout interaction
 * @memberof interact
 * @alias mouseout
 * @param {array} nodes - The nodes to reset
 * @param {object} tooltipWrapper - The wrapper node that contains the tooltip
 */
rsc.interact.mouseout = function(nodes, tooltipWrapper) {
  if (nodes) {
    nodes
      .classed('faded', false)
      .classed('bolden', false);
  }

  if (tooltipWrapper) {
    rsc.tooltip.hide(tooltipWrapper);
  }
};

/**
 * Trigger mousemove interaction
 * @memberof interact
 * @alias mousemove
 * @param {object} tooltipWrapper - The wrapper node that contains the tooltip
 */
rsc.interact.mousemove = function(tooltipWrapper) {
  if (tooltipWrapper) {
    var mouse = d3.mouse(tooltipWrapper.node());
    rsc.tooltip.update(
      mouse[0],
      mouse[1],
      tooltipWrapper
    );
  }
};
/** @namespace labels */
rsc.labels = {};

/**
 * Generate the chart title
 * @memberof labels
 * @alias title
 * @param {object} wrapper - The wrapper to place the title into
 * @param {string} title - The title text
 */
rsc.labels.title = function(wrapper, title) {
  var titleNode = wrapper.select('.rsc-title');

  if (!titleNode.node() && title) {
    wrapper.insert('div', ':first-child')
      .attr('class', 'rsc-title')
      .html(title);
  } else if (titleNode.node()) {
    if (title) {
      titleNode.html(title);
    } else {
      titleNode.remove();
    }
  }
};

/**
 * Generate the chart description
 * @memberof labels
 * @alias description
 * @param {object} wrapper - The wrapper to place the title into
 * @param {string} description - The description text
 */
rsc.labels.description = function(wrapper, description) {
  var descNode = wrapper.select('.rsc-description');

  if (!descNode.node() && description) {
    var insertBefore;

    if (wrapper.select('.rsc-title').node()) {
      var nextSibling = wrapper.select('.rsc-title').node().nextSibling;
      if (!nextSibling) {
        insertBefore = null;
      } else {
        insertBefore = '.' + d3.select(nextSibling).attr('class');
      }
    } else {
      insertBefore = ':first-child';
    }

    wrapper.insert('div', insertBefore)
      .attr('class', 'rsc-description')
      .html(description);
  } else if (descNode.node()) {
    if (description) {
      descNode.html(description);
    } else {
      descNode.remove();
    }
  }
};
/** @class legend
 * @param {object} _chart - The chart to generate a legend for
 */
rsc.legend = function(_chart) {
  this._chart = _chart;

  /**
   * Height of the legend
   * @memberof legend
   * @member {number} height
   */
  this.height = 21;
  /**
   * Padding around the legend
   * @memberof legend
   * @member {number} padding
   */
  this.padding = 5;
  /**
   * The legend node
   * @memberof legend
   * @member {object} node
   */
  this.node = null;

  var _key = function(d) { return d.key; };

  /**
   * Get or set the function that returns the legend key
   * @memberof legend
   * @alias key
   * @param {function} key - The key function
   */
  this.key = function(key) {
    if (typeof key !== 'undefined') {
      _key = key;

      return this;
    } else {
      return _key;
    }
  };

  /**
   * Render the legend
   * @memberof legend
   * @alias render
   * @param {object} wrapper - The wrapper node to place the legend into
   */
  this.render = function(wrapper) {
    var legendNode = wrapper.select('.rsc-legend');

    if (!legendNode.node()) {
      legendNode = wrapper.insert('div', 'svg')
        .attr('class', 'rsc-legend');

      legendNode.append('div')
        .attr('class', 'rsc-legend-inner')
          .append('div')
            .attr('class', 'expand-toggle')
            .html('+');

      this.node = legendNode;
    }

    var m = this._chart.getChartMargin();

    legendNode
      .style('height', (this.height + 7) + 'px')
      .style('margin-top', this._chart.margin().top + 'px')
      .style('margin-left', m.left + 'px')
      .style('margin-right', m.right + 'px');

    legendNode.select('.rsc-legend-inner')
      .style('height', this.height + 'px')
      .style('max-width', this._chart.getChartWidth() + 'px');

    legendNode.select('.expand-toggle')
      .style('height', this.height + 'px')
      .style('line-height', this.height + 'px')
      .on('click', function() {
        var expandToggleNode = legendNode.select('.expand-toggle');
        expandToggleNode.classed('active', !expandToggleNode.classed('active'));

        if (expandToggleNode.classed('active')) {
          expandToggleNode.html('&#151');
        } else {
          expandToggleNode.html('+');
        }

        this.expandToggle();
      }.bind(this));

    return this;
  };

  /**
   * Update the legend
   * @memberof legend
   * @alias update
   */
  this.update = function() {
    var self = this,
      innerNode = this.node.select('.rsc-legend-inner');

    var series = innerNode.selectAll('.series')
      .data(this._chart.data(), function(d) { return this.key()(d); }.bind(this));

    seriesNodes = series.enter().append('div')
      .attr('class', 'series')
        .on('click', function(d, i) {
          if (this._chart.legendToggle()) {
            if (d.disabled) {
              d.disabled = false;
            } else {
              d.disabled = true;
            }
            this._chart.dispatch.legend_click(d, i);
            this._chart.update();
          } else {
            this._chart.dispatch.legend_click(d, i);
          }
        }.bind(this))
        .on('dblclick', function(d, i) {
          this._chart.dispatch.legend_dblclick(d, i);
        }.bind(this));

    series.exit().remove();

    series.sort(function(a, b) {
      if (a.values && b.values) {
        return d3.descending(
          d3.median(a.values, function(d) { return self._chart.y()(d); }),
          d3.median(b.values, function(d) { return self._chart.y()(d); })
        );
      } else {
        return d3.descending(
          self._chart.y()(a),
          self._chart.y()(b)
        );
      }
    });

    seriesNodes
      .append('div')
        .style('border-color', function(d, i) { return self._chart.color()(rsc.utils.stringToHashCode(self.key()(d))); });

    innerNode.selectAll('.series div')
      .style('background-color', function(d) {
        if (d.disabled) {
          return 'transparent';
        } else {
          return d3.select(this).style('border-color');
        }
      });

    seriesNodes
      .append('span')
        .html(this.key());

    innerNode.selectAll('.series span')
      .style('opacity', function(d) {
        if (d.disabled) {
          return 0.5;
        } else {
          return 1;
        }
      });

    this.expandToggle(false);
    if (innerNode.node().scrollHeight <= innerNode.node().offsetHeight) {
      innerNode.select('.expand-toggle').classed('toggle-hidden', true);
    } else {
      innerNode.select('.expand-toggle').classed('toggle-hidden', false);
    }

    return this;
  };

  /**
   * Remove the legend
   * @memberof legend
   * @alias remove
   */
  this.remove = function() {
    if (this.node) {
      this.node.remove();
    }
  };

  /**
   * Toggle expanded/collapsed for the legend
   * @memberof legend
   * @alias expandToggle
   * @param {boolean} expand - Expand the legend
   */
  this.expandToggle = function(expand) {
    var node = this.node.select('.rsc-legend-inner');

    if (expand === true || expand === false) {
      node.classed('expand', expand);
    } else {
      if (node.classed('expand')) {
        node.classed('expand', false);
      } else {
        node.classed('expand', true);
      }
    }
  };

  /**
   * Get the calculated height of the legend
   * @memberof legend
   * @alias getHeight
   */
  this.getHeight = function() {
    return this.node.node().offsetHeight;
  };

  return this;
};
/** @class annotate
 * @param {object} _chart - The chart to attach annotations to
 */
rsc.annotate = function(_chart) {
  this._chart = _chart;

  this.node = this._chart.wrapper.append('div').attr('class', 'rsc-annotate').style('display', 'none');
  this.node.append('div').attr('class', 'rsc-annotate-label');
  this.config = this._chart.wrapper.append('div').attr('class', 'rsc-annotate-config').style('display', 'none');

  /**
   * The default color
   * @memberof annotate
   * @member {string} color
   */
  this.color = '#ff0000';
  /**
   * The default stroke width
   * @memberof annotate
   * @member {string} stroke
   */
  this.stroke = '4px';
  /**
   * The default label
   * @memberof annotate
   * @member {string} label
   */
  this.label = null;
  /**
   * The default opacity
   * @memberof annotate
   * @member {number} opacity
   */
  this.opacity = 0.6;

  // build config window
  this.config.append('div').html('Color').append('input')
    .attr('type', 'text')
    .attr('class', 'rsc-annotate-cfg-color')
    .property('value', this.color)
    .on('input', function() {
      self.node.style('border-color', d3.select(this).property('value'));
    });
  this.config.append('div').html('Stroke Width').append('input')
    .attr('type', 'text')
    .attr('class', 'rsc-annotate-cfg-stroke')
    .property('value', this.stroke)
    .on('input', function() {
      self.node.style('border-width', d3.select(this).property('value'));
    });
  this.config.append('div').html('Label').append('input')
    .attr('type', 'text')
    .attr('class', 'rsc-annotate-cfg-label')
    .property('value', this.label || '')
    .on('input', function() {
      self.node.select('.rsc-annotate-label').html(d3.select(this).property('value'));
    });
  this.config.append('div').attr('class', 'rsc-annotate-button').html('Okay').on('click', function() {
    self.color = self.config.select('.rsc-annotate-cfg-color').property('value');
    self.stroke = self.config.select('.rsc-annotate-cfg-stroke').property('value');
    self.label = self.config.select('.rsc-annotate-cfg-label').property('value');

    self.config.style('display', 'none');

    self._chart.dispatch.annotate({
      color: self.color,
      stroke: self.stroke,
      label: self.label,
      bbox: self.getBBox()
    });
  });

  var self = this;
  var _mousedown = false;
  var _drawn = false;
  var _md = null;
  var _mm = null;

  this.init = function() {
    self._chart.wrapper.select('.rsc-canvas')
      .on('mousedown', function() {
        self.mousedown();
      })
      .on('mouseup', function() {
        self.mouseup();
      })
      .on('mousemove', function() {
        self.mousemove();
      });
  };

  this.mousedown = function() {
    if (!self._chart.annotate()) return;

    var node = self._chart.wrapper.select('.rsc-canvas').node();
    var mouse = d3.mouse(node);
    var chartMargin = self._chart.getChartMargin();
    mouse[0] -= chartMargin.left;
    mouse[1] -= chartMargin.top;

    _md = [self._chart._xScale.invert(mouse[0]), self._chart._yScale.invert(mouse[1])];

    if (_md[0] < self._chart._xScale.domain()[0] || _md[0] > self._chart._xScale.domain()[1]) return;
    if (_md[1] < self._chart._yScale.domain()[0] || _md[1] > self._chart._yScale.domain()[1]) return;

    _mousedown = true;
    _drawn = false;

    this.color = '#ff0000';
    this.stroke = '4px';
    this.label = null;

    self.node.style('display', 'none');
    self.config.style('display', 'none');
  };

  this.mouseup = function() {
    if (!self._chart.annotate()) return;

    _mousedown = false;

    if (_drawn) {
      var node = self._chart.wrapper.select('.rsc-canvas').node();
      var mouse = d3.mouse(node);
      mouse[0] += node.offsetLeft;
      mouse[1] += node.offsetTop;

      self.popupConfig(mouse);
    }
  };

  this.mousemove = function() {
    if (!self._chart.annotate() || !_mousedown) return;

    var node = self._chart.wrapper.select('.rsc-canvas').node();
    var mouse = d3.mouse(node);
    var chartMargin = self._chart.getChartMargin();
    mouse[0] -= chartMargin.left;
    mouse[1] -= chartMargin.top;

    _mm = [self._chart._xScale.invert(mouse[0]), self._chart._yScale.invert(mouse[1])];

    self.draw(self.getBBox());
  };

  this.popupConfig = function(pos) {
    this.config.select('.rsc-annotate-cfg-color').property('value', this.color);
    this.config.select('.rsc-annotate-cfg-stroke').property('value', this.stroke);
    this.config.select('.rsc-annotate-cfg-label').property('value', this.label || '');

    this.config
      .style('display', null);

    var left = pos[0] + 10;
    var top = pos[1];

    if (left + parseInt(this.config.style('width'), 10) > parseInt(self._chart.wrapper.style('width'), 10)) {
      left = parseInt(self._chart.wrapper.style('width'), 10) - parseInt(this.config.style('width'), 10) - 10;
    }
    if (top + parseInt(this.config.style('height'), 10) > parseInt(self._chart.wrapper.style('height'), 10)) {
      top = parseInt(self._chart.wrapper.style('height'), 10) - parseInt(this.config.style('height'), 10) - 10;
    }

    this.config
      .style('left', left + 'px')
      .style('top', top + 'px');
  };

  /**
   * Get the bounding box of the annotation
   * @memberof annotate
   * @alias getBBox
   * @returns {object}
   */
  this.getBBox = function() {
    if (!_md) {
      return null;
    } else {
      return _md.concat(_mm); // x0, y0, x1, y1
    }
  };

  /**
   * Render an annotation
   * @memberof annotate
   * @alias render
   * @param {object} cfg - The annotation configuration
   */
  this.render = function(cfg) {
    if (!cfg.bbox) return;

    if (cfg.color) this.color = cfg.color;
    if (cfg.stroke) this.stroke = cfg.stroke;
    if (cfg.label) this.label = cfg.label;

    _md = cfg.bbox.slice(0, 2);
    _mm = cfg.bbox.slice(2);

    this.draw(cfg.bbox, false, true);
  };

  /**
   * Draw the annotation
   * @memberof annotate
   * @alias draw
   * @param {object} bbox - The bounding box
   * @param {boolean} transition - Transition the drawing
   * @param {boolean} opacityChange - Trigger an opacity change
   */
  this.draw = function(bbox, transition, opacityChange) {
    var node = self._chart.wrapper.select('.rsc-canvas').node();
    var chartMargin = self._chart.getChartMargin();

    var x0 = self._chart._xScale(bbox[0]);
    var y0 = self._chart._yScale(bbox[1]);
    var x1 = self._chart._xScale(bbox[2]);
    var y1 = self._chart._yScale(bbox[3]);

    if (Math.abs(x0 - x1) < 10 && Math.abs(y0 - y1) < 10) return;

    _drawn = true;

    self.node
      .style('display', null);

    self.node.select('.rsc-annotate-label').html(this.label);

    if (opacityChange) self.node.style('opacity', 0);

    if (transition) {
      self.node.transition().duration(self._chart.duration())
        .style('opacity', self.opacity)
        .style('border-color', self.color)
        .style('border-width', self.stroke)
        .style('left', (Math.min(x0, x1) + node.offsetLeft + chartMargin.left) + 'px')
        .style('top', (Math.min(y0, y1) + node.offsetTop + chartMargin.top) + 'px')
        .style('width', Math.abs(x0 - x1) + 'px')
        .style('height', Math.abs(y0 - y1) + 'px');
    } else {
      self.node
        .style('border-color', self.color)
        .style('border-width', self.stroke)
        .style('left', (Math.min(x0, x1) + node.offsetLeft + chartMargin.left) + 'px')
        .style('top', (Math.min(y0, y1) + node.offsetTop + chartMargin.top) + 'px')
        .style('width', Math.abs(x0 - x1) + 'px')
        .style('height', Math.abs(y0 - y1) + 'px');

      if (this._chart.transition()) {
        self.node.transition().duration(self._chart.duration())
          .style('opacity', self.opacity);
      } else {
        self.node.style('opacity', self.opacity);
      }
    }
  };

  /**
   * Update the annotation
   * @memberof annotate
   * @alias update
   */
  this.update = function() {
    var bbox = this.getBBox();

    if (bbox) this.draw(bbox, this._chart.transition());
  };

  return this;
};
/** @namespace charts */
rsc.charts = {};
/** @namespace base */
rsc.charts.base = function(parent) {
  var _parent = parent || 'body';

  var _chart = {};

  var THEMES = ['light', 'dark'];

  var _theme = 'light';
  var _data = [];
  var _title;
  var _description;
  var _margin = { top: 20, right: 20, bottom: 40, left: 40 };
  var _width = parseInt(d3.select(_parent).style('width'), 10);
  var _height = parseInt(d3.select(_parent).style('height'), 10);
  var _x = function(d) { return d[0]; };
  var _y = function(d) { return d[1]; };
  var _xLabel;
  var _xTickFormat;
  var _xFormat;
  var _xThresholds;
  var _xDomain;
  var _yLabel;
  var _yTickFormat;
  var _yFormat;
  var _yThresholds;
  var _yDomain;
  var _color = d3.scale.category20();
  // RAIN COLORS
  // var _color = d3.scale.ordinal().range([
  //   '#8e9493', '#bfc9be', '#5b859a', '#a4bfd7',
  //   '#59575f', '#144056', '#978290', '#263036'
  // ]);
  var _transition = true;
  var _duration = 750;
  var _tooltip;
  var _tooltips = true;
  var _grid = true;
  var _legend = true;
  var _legendToggle = true;

  /**
   * Gets or sets the parent element of the chart
   * @memberof base
   * @alias parent
   * @param {string|object} parent - CSS selector string or DOM node
   * @returns {string|object}
   */
  _chart.parent = function(parent) {
    if (typeof parent !== 'undefined' && parent !== null) {
      _parent = parent;

      return this;
    } else if (parent === null) {
      return this;
    } else {
      return _parent;
    }
  };

  /**
   * Gets or sets the theme of the chart
   * @memberof base
   * @alias theme
   * @param {string} theme - The name of the theme
   * @returns {string}
   */
  _chart.theme = function(theme) {
    if (typeof theme !== 'undefined' && theme !== null) {
      if (THEMES.indexOf(theme) !== -1) {
        var oldTheme = _theme;
        _theme = theme;

        if (_chart.wrapper) {
          _chart.wrapper.classed('rsc-theme-' + oldTheme, false);
          _chart.wrapper.classed('rsc-theme-' + _theme, true);
        }
      }

      return this;
    } else if (theme === null) {
      return this;
    } else {
      return _theme;
    }
  };

  /**
   * Gets or sets the data for the chart
   * @memberof base
   * @alias data
   * @param {object|array} data - The data for the chart
   * @returns {array}
   */
  _chart.data = function(data) {
    if (typeof data !== 'undefined') {
      data = rsc.utils.deepCopy(data);
      _data = Object.prototype.toString.call(data) !== '[object Array]' ? [data] : data;

      return this;
    } else {
      return _data;
    }
  };

  /**
   * Gets or sets the title of the chart
   * @memberof base
   * @alias title
   * @param {string} title - The title of the chart
   * @returns {string}
   */
  _chart.title = function(title) {
    if (typeof title !== 'undefined' && title !== null) {
      _title = title;

      return this;
    } else if (title === null) {
      return this;
    } else {
      return _title;
    }
  };

  /**
   * Gets or sets the description of the chart
   * @memberof base
   * @alias description
   * @param {string} description - The description of the chart
   * @returns {string}
   */
  _chart.description = function(description) {
    if (typeof description !== 'undefined' && description !== null) {
      _description = description;

      return this;
    } else if (description === null) {
      return this;
    } else {
      return _description;
    }
  };

  /**
   * Gets or sets the margin for the chart
   * @memberof base
   * @alias margin
   * @param {object} margin - The margin for the chart
   * @param {number} margin.top - The top margin
   * @param {number} margin.right - The right margin
   * @param {number} margin.bottom - The bottom margin
   * @param {number} margin.left - The left margin
   * @returns {object}
   */
  _chart.margin = function(margin) {
    if (typeof margin !== 'undefined' && margin !== null) {
      if (typeof margin.top !== 'undefined') _margin.top = margin.top;
      if (typeof margin.right !== 'undefined') _margin.right = margin.right;
      if (typeof margin.bottom !== 'undefined') _margin.bottom = margin.bottom;
      if (typeof margin.left !== 'undefined') _margin.left = margin.left;

      return this;
    } else if (margin === null) {
      return this;
    } else {
      return {
        top: _margin.top,
        right: _margin.right,
        bottom: _margin.bottom,
        left: _margin.left
      };
    }
  };

  /**
   * Gets or sets the width of the chart
   * @memberof base
   * @alias width
   * @param {number} width - The width of the chart
   * @returns {number}
   */
  _chart.width = function(width) {
    if (typeof width !== 'undefined' && width !== null) {
      _width = width;

      return this;
    } else if (width === null) {
      return this;
    } else {
      return _width - 4;
    }
  };

  /**
   * Gets or sets the height of the chart
   * @memberof base
   * @alias height
   * @param {number} height - The height of the chart
   * @returns {number}
   */
  _chart.height = function(height) {
    if (typeof height !== 'undefined' && height !== null) {
      _height = height;

      return this;
    } else if (height === null) {
      return this;
    } else {
      return _height - 4;
    }
  };

  /**
   * Gets or sets the function for the x value
   * @memberof base
   * @alias x
   * @param {function} x - The x value function
   * @returns {function}
   */
  _chart.x = function(x) {
    if (typeof x !== 'undefined' && x !== null) {
      _x = x;

      return this;
    } else if (x === null) {
      return this;
    } else {
      return _x;
    }
  };

  /**
   * Gets or sets the function for the y value
   * @memberof base
   * @alias y
   * @param {function} y - The y value function
   * @returns {function}
   */
  _chart.y = function(y) {
    if (typeof y !== 'undefined' && y !== null) {
      _y = y;

      return this;
    } else if (y === null) {
      return this;
    } else {
      return _y;
    }
  };

  /**
   * Gets or sets the x axis label
   * @memberof base
   * @alias xLabel
   * @param {string} xLabel - The x axis label
   * @returns {string}
   */
  _chart.xLabel = function(xLabel) {
    if (typeof xLabel !== 'undefined' && xLabel !== null) {
      _xLabel = xLabel;

      return this;
    } else if (xLabel === null) {
      return this;
    } else {
      return _xLabel;
    }
  };

  /**
   * Gets or sets the function for formatting the x tick value
   * @memberof base
   * @alias xTickFormat
   * @param {function} xTickFormat - The function for formatting the x tick value 
   * @returns {function}
   */
  _chart.xTickFormat = function(xTickFormat) {
    if (typeof xTickFormat !== 'undefined') {
      _xTickFormat = xTickFormat;

      return this;
    } else if (xTickFormat === null) {
      return this;
    } else {
      return _xTickFormat;
    }
  };

  /**
   * Gets or sets the function for formatting the x value
   * @memberof base
   * @alias xFormat
   * @param {function} xFormat - The function for formatting the x value 
   * @returns {function}
   */
  _chart.xFormat = function(xFormat) {
    if (typeof xFormat !== 'undefined') {
      _xFormat = xFormat;

      return this;
    } else if (xFormat === null) {
      return this;
    } else {
      return _xFormat;
    }
  };

  /**
   * Gets or sets the thresholds on the x axis
   * @memberof base
   * @alias xThresholds
   * @param {object|array} xThresholds - The thresholds on the x axis
   * @param {number} xThresholds.value - The value of the threshold
   * @param {string} xThresholds.color - The color of the threshold
   * @returns {array}
   */
  _chart.xThresholds = function(xThresholds) {
    if (typeof xThresholds !== 'undefined') {
      xThresholds = rsc.utils.deepCopy(xThresholds);
      _xThresholds = Object.prototype.toString.call(xThresholds) !== '[object Array]' ? [xThresholds] : xThresholds;

      return this;
    } else {
      return _xThresholds;
    }
  };

  /**
   * Gets or sets the domain of the x axis
   * @memberof base
   * @alias xDomain
   * @param {object} xDomain - The domain of the x axis
   * @param {number} xDomain.min - The minimum value of the x axis
   * @param {number} xDomain.max - The maximum value of the x axis
   * @returns {object}
   */
  _chart.xDomain = function(xDomain) {
    if (typeof xDomain !== 'undefined') {
      _xDomain = xDomain;

      return this;
    } else if (xDomain === null) {
      return this;
    } else {
      return _xDomain;
    }
  };

  /**
   * Gets or sets the y axis label
   * @memberof base
   * @alias yLabel
   * @param {string} yLabel - The y axis label
   * @returns {string}
   */
  _chart.yLabel = function(yLabel) {
    if (typeof yLabel !== 'undefined' && yLabel !== null) {
      _yLabel = yLabel;

      return this;
    } else if (yLabel === null) {
      return this;
    } else {
      return _yLabel;
    }
  };

  /**
   * Gets or sets the function for formatting the y tick value
   * @memberof base
   * @alias yTickFormat
   * @param {function} yTickFormat - The function for formatting the y tick value 
   * @returns {function}
   */
  _chart.yTickFormat = function(yTickFormat) {
    if (typeof yTickFormat !== 'undefined') {
      _yTickFormat = yTickFormat;

      return this;
    } else if (yTickFormat === null) {
      return this;
    } else {
      return _yTickFormat;
    }
  };

  /**
   * Gets or sets the function for formatting the y value
   * @memberof base
   * @alias yFormat
   * @param {function} yFormat - The function for formatting the y value 
   * @returns {function}
   */
  _chart.yFormat = function(yFormat) {
    if (typeof yFormat !== 'undefined') {
      _yFormat = yFormat;

      return this;
    } else if (yFormat === null) {
      return this;
    } else {
      return _yFormat;
    }
  };

  /**
   * Gets or sets the thresholds on the y axis
   * @memberof base
   * @alias yThresholds
   * @param {object|array} yThresholds - The thresholds on the y axis
   * @param {number} yThresholds.value - The value of the threshold
   * @param {string} yThresholds.color - The color of the threshold
   * @returns {array}
   */
  _chart.yThresholds = function(yThresholds) {
    if (typeof yThresholds !== 'undefined') {
      yThresholds = rsc.utils.deepCopy(yThresholds);
      _yThresholds = Object.prototype.toString.call(yThresholds) !== '[object Array]' ? [yThresholds] : yThresholds;

      return this;
    } else {
      return _yThresholds;
    }
  };

  /**
   * Gets or sets the domain of the y axis
   * @memberof base
   * @alias yDomain
   * @param {object} yDomain - The domain of the y axis
   * @param {number} yDomain.min - The minimum value of the y axis
   * @param {number} yDomain.max - The maximum value of the y axis
   * @returns {object}
   */
  _chart.yDomain = function(yDomain) {
    if (typeof yDomain !== 'undefined') {
      _yDomain = yDomain;

      return this;
    } else if (yDomain === null) {
      return this;
    } else {
      return _yDomain;
    }
  };

  /**
   * Gets or sets the function for chart colors
   * @memberof base
   * @alias color
   * @param {function} color - The function for the chart colors
   * @returns {function}
   */
  _chart.color = function(color) {
    if (typeof color !== 'undefined' && color !== null) {
      _color = color;

      return this;
    } else if (color === null) {
      return this;
    } else {
      return _color;
    }
  };

  /**
   * Gets or sets whether or not the chart should contain transitions
   * @memberof base
   * @alias transition
   * @param {boolean} transition - Whether or not the chart contains transitions
   * @returns {boolean}
   */
  _chart.transition = function(transition) {
    if (typeof transition !== 'undefined') {
      _transition = transition;

      return this;
    } else {
      return _transition;
    }
  };

  /**
   * Gets or sets the duration of transitions
   * @memberof base
   * @alias duration
   * @param {number} duration - The duration of transitions (in milliseconds)
   * @returns {number}
   */
  _chart.duration = function(duration) {
    if (typeof duration !== 'undefined') {
      _duration = duration;

      return this;
    } else {
      return _duration;
    }
  };

  /**
   * Gets or sets whether or not the chart should have tooltips
   * @memberof base
   * @alias tooltips
   * @param {boolean} tooltips - Whether or not to show tooltips
   * @returns {boolean}
   */
  _chart.tooltips = function(tooltips) {
    if (typeof tooltips !== 'undefined') {
      _tooltips = tooltips;

      return this;
    } else {
      return _tooltips;
    }
  };

  /**
   * Gets or sets the function for the tooltip content
   * @memberof base
   * @alias tooltip
   * @param {function} tooltip - The tooltip content function
   * @returns {function}
   */
  _chart.tooltip = function(tooltip) {
    if (typeof tooltip !== 'undefined') {
      _tooltip = tooltip;

      return this;
    } else {
      return _tooltip;
    }
  };

  /**
   * Gets or sets whether or not to show grid lines
   * @memberof base
   * @alias grid
   * @param {boolean} grid - Whether or not to show grid lines
   * @returns {boolean}
   */
  _chart.grid = function(grid) {
    if (typeof grid !== 'undefined') {
      _grid = grid;

      return this;
    } else {
      return _grid;
    }
  };

  /**
   * Gets or sets whether or not to show the legend
   * @memberof base
   * @alias legend
   * @param {boolean} legend - Whether or not to show the legend
   * @returns {boolean}
   */
  _chart.legend = function(legend) {
    if (typeof legend !== 'undefined') {
      _legend = legend;

      return this;
    } else {
      return _legend;
    }
  };

  /**
   * Gets or sets whether or not to allow toggling legend items
   * @memberof base
   * @alias legendToggle
   * @param {boolean} legendToggle - Whether or not to allow toggling legend items
   * @returns {boolean}
   */
  _chart.legendToggle = function(legendToggle) {
    if (typeof legendToggle !== 'undefined') {
      _legendToggle = legendToggle;

      return this;
    } else {
      return _legendToggle;
    }
  };

  /**
   * Force chart update, optionally with new data
   * @memberof base
   * @alias update
   * @param {object|array} data - Updated data
   * @returns {object}
   */
  _chart.update = function(data) {
    if (typeof data !== 'undefined') {
      this.data(rsc.utils.deepCopy(data)).render(true);
    } else {
      this.render(true);
    }

    if (this.modules.annotate) {
      this.modules.annotate.update();
    }

    return this;
  };

  /**
   * Force chart resize
   * @memberof base
   * @alias resize
   */
  _chart.resize = function() {
    this.width(parseInt(d3.select(_parent).style('width'), 10));
    this.height(parseInt(d3.select(_parent).style('height'), 10));

    this.update();
  };

  _chart.dispatch = d3.dispatch(); // placeholder
  _chart.wrapper = d3.select(_parent).append('div').attr('class', 'rsc-wrapper rsc-theme-' + _theme);

  _chart.modules = {
    legend: new rsc.legend(_chart)
  };

  /**
   * Get the calculated chart height
   * @memberof base
   * @alias getChartHeight
   * @returns {number}
   */
  _chart.getChartHeight = function() {
    var m = this.getChartMargin();
    var height = this.height();

    if (this.title()) {
      height -= parseInt(this.wrapper.select('.rsc-title').style('height'), 10);
    }
    if (this.description()) {
      height -= parseInt(this.wrapper.select('.rsc-description').style('height'), 10);
    }
    if (this.legend()) {
      height = height - this.modules.legend.getHeight() - this.modules.legend.padding;
    }

    return height - this.margin().top - m.bottom;
  };

  /**
   * Get the calculated chart width
   * @memberof base
   * @alias getChartWidth
   * @returns {number}
   */
  _chart.getChartWidth = function() {
    var m = this.getChartMargin();

    return this.width() - m.left - m.right;
  };

  /**
   * Get the calculated chart margin
   * @memberof base
   * @alias getChartMargin
   * @returns {number}
   */
  _chart.getChartMargin = function() {
    return {
      top: this.legend() ? this.modules.legend.padding : this.margin().top,
      bottom: this.xLabel() ? this.margin().bottom + 15 : this.margin().bottom,
      left: this.yLabel() ? this.margin().left + 15 : this.margin().left,
      right: this.margin().right
    };
  };

  return _chart;
};
/** @namespace area
 * @extends base
 */
rsc.charts.area = function(parent) {
  var chart = new this.base(parent);

  /**
   * d3 dispatcher for chart events<br/>
   * Available events: click, dblclick, mouseover, mouseout, mousemove, legend_click, legend_dblclick, annotate
   * @memberof area
   * @member {object} dispatch
   */
  chart.dispatch = d3.dispatch('click', 'dblclick', 'mouseover', 'mouseout', 'mousemove', 'legend_click', 'legend_dblclick', 'annotate');

  var _clipId = 'clip_' + rsc.utils.generateUUID();

  var _stacked = false;
  var _streamed = false;
  var _expanded = false;
  var _seriesFormat = function(d) { return d.key; };
  var _annotate = false;
  var _interpolate = 'linear';

  chart.modules.annotate = new rsc.annotate(chart);

  /**
   * Gets or sets whether or not the chart is stacked
   * @memberof area
   * @alias stacked
   * @param {boolean} stacked - Whether or not the chart is stacked
   * @returns {boolean}
   */
  chart.stacked = function(stacked) {
    if (typeof stacked !== 'undefined') {
      _stacked = stacked;

      return this;
    } else {
      return _stacked;
    }
  };

  /**
   * Gets or sets whether or not the chart is streamed
   * @memberof area
   * @alias streamed
   * @param {boolean} streamed - Whether or not the chart is streamed
   * @returns {boolean}
   */
  chart.streamed = function(streamed) {
    if (typeof streamed !== 'undefined') {
      _streamed = streamed;

      return this;
    } else {
      return _streamed;
    }
  };

  /**
   * Gets or sets whether or not the chart is expanded
   * @memberof area
   * @alias expanded
   * @param {boolean} expanded - Whether or not the chart is expanded
   * @returns {boolean}
   */
  chart.expanded = function(expanded) {
    if (typeof expanded !== 'undefined') {
      _expanded = expanded;

      return this;
    } else {
      return _expanded;
    }
  };

  /**
   * Gets or sets the function for formatting the series name
   * @memberof area
   * @alias seriesFormat
   * @param {function} seriesFormat - The function for formatting the series name
   * @returns {function}
   */
  chart.seriesFormat = function(seriesFormat) {
    if (typeof seriesFormat !== 'undefined') {
      if (seriesFormat === null) {
        _seriesFormat = function(d) { return d.key; };
      } else {
        _seriesFormat = seriesFormat;
      }

      return this;
    } else {
      return _seriesFormat;
    }
  };

  /**
   * Gets or sets whether or not to allow annotations
   * @memberof area
   * @alias annotate
   * @param {boolean} annotate - Whether or not to allow annotations
   * @returns {boolean}
   */
  chart.annotate = function(annotate) {
    if (typeof annotate !== 'undefined') {
      _annotate = annotate;

      return this;
    } else {
      return _annotate;
    }
  };

  /**
   * Force draw an annotation
   * @memberof area
   * @alias drawAnnotation
   * @param {object} annotationConfig - The annotation configuration object
   */
  chart.drawAnnotation = function(annotationConfig) {
    if (!this.annotate()) return;

    this.modules.annotate.render(annotationConfig);
  };

  /**
   * Gets or sets the interpolation type
   * @memberof area
   * @alias interpolate
   * @param {string} interpolate - The interpolation type
   * @returns {string}
   */
  chart.interpolate = function(interpolate) {
    if (typeof interpolate !== 'undefined') {
      _interpolate = interpolate;

      return this;
    } else {
      return _interpolate;
    }
  };

  chart.xTickFormat(rsc.utils.multiTimeFormat);

  /**
   * Render the chart
   * @memberof area
   * @alias render
   * @param {boolean} update - Update only
   * @returns {object}
   */
  chart.render = function(update) {
    var x, y, xAxis, yAxis, emptyArea, area, chartData,
      svg, series, paths, h, w, m, xThresholds, yThresholds,
      self = this;

    if (!this.data()[0].key && !this.data()[0].values) { // single series
      this.data(rsc.utils.convertDataToSeries(this.data()));
      this.legend(false);
    }

    rsc.labels.title(this.wrapper, this.title());
    rsc.labels.description(this.wrapper, this.description());

    if (this.legend()) {
      this.modules.legend.key(this.seriesFormat());
      this.modules.legend.render(this.wrapper);
    } else {
      this.modules.legend.remove();
    }

    h = this.getChartHeight();
    w = this.getChartWidth();
    m = this.getChartMargin();

    x = d3.time.scale()
      .range([0, w]);

    this._xScale = x;

    y = d3.scale.linear()
      .range([h, 0]);

    this._yScale = y;

    xAxis = d3.svg.axis()
      .scale(x)
      .orient('bottom');

    xAxis.tickFormat(this.xTickFormat());

    yAxis = d3.svg.axis()
      .scale(y)
      .orient('left');

    if (this.expanded()) {
      yAxis.tickFormat(function(v) { return (v * 100) + '%'; });
    } else if (this.yTickFormat()) {
      yAxis.tickFormat(this.yTickFormat());
    } else {
      yAxis.tickFormat(rsc.utils.unitSuffixFormat);
    }

    if (this.grid()) {
      xAxis.tickSize(-h);
      yAxis.tickSize(-w);
    }

    emptyArea = d3.svg.area()
      .defined(function(d) {
        return typeof self.y()(d) !== 'undefined' && self.y()(d) !== null &&
          typeof self.x()(d) !== 'undefined' && self.x()(d) !== null;
      })
      .x(function(d) { return x(self.x()(d)); })
      .y0(h)
      .y1(h)
      .interpolate(this.interpolate());

    area = d3.svg.area()
      .defined(function(d) {
        return typeof self.y()(d) !== 'undefined' && self.y()(d) !== null &&
          typeof self.x()(d) !== 'undefined' && self.x()(d) !== null;
      })
      .x(function(d) { return x(self.x()(d)); })
      .interpolate(this.interpolate());

    if (this.stacked() || this.streamed() || this.expanded()) {
      area
        .y0(function(d) { return y(d.y0); })
        .y1(function(d) { return y(d.y0 + d.y); });

      var stack = d3.layout.stack()
        .values(function(d) { return d.values; })
        .x(self.x())
        .y(self.y());

      if (this.streamed()) {
        stack.offset('wiggle');
        stack.order('inside-out');
      } else if (this.expanded()) {
        stack.offset('expand');
        stack.order('default');
      } else {
        stack.offset('zero');
        stack.order('default');
      }

      chartData = stack(this.data().filter(function(d) { return !d.disabled; }));

      if (this.expanded()) {
        y.domain([0, 1]);
      } else {
        y.domain([
          this.yDomain() && this.yDomain().min ? this.yDomain().min :
            d3.min([0, d3.min(chartData, function(s) { return d3.min(s.values, self.y()); })]),
          this.yDomain() && this.yDomain().max ? this.yDomain().max :
            d3.max(chartData, function(s) { return d3.max(s.values, function(d) { return d.y0 + d.y; }); })
        ]);
      }
    } else {
      area
        .y0(h)
        .y1(function(d) { return y(self.y()(d)); });

      chartData = this.data().filter(function(d) { return !d.disabled; });

      y.domain([
        this.yDomain() && this.yDomain().min ? this.yDomain().min :
          d3.min([0, d3.min(chartData, function(s) { return d3.min(s.values, self.y()); })]),
        this.yDomain() && this.yDomain().max ? this.yDomain().max :
          d3.max(chartData, function(s) { return d3.max(s.values, self.y()); })
      ]);
    }

    x.domain([
      this.xDomain() && this.xDomain().min ? this.xDomain().min :
        d3.min(chartData, function(s) { return d3.min(s.values, self.x()); }),
      this.xDomain() && this.xDomain().max ? this.xDomain().max :
        d3.max(chartData, function(s) { return d3.max(s.values, self.x()); })
    ]);

    svg = this.wrapper.select('.rsc-inner-wrapper');
    if (!svg.node()) {
      svg = this.wrapper.append('svg')
        .attr('class', 'rsc-canvas')
        .attr('width', w + m.left + m.right)
        .attr('height', h + m.top + m.bottom)
        .append('g')
          .attr('class', 'rsc-inner-wrapper')
          .attr('transform', 'translate(' + m.left + ',' + m.top + ')');

      if (this.annotate()) {
        this.modules.annotate.init();
      }

      svg.append('defs').append('clipPath')
        .attr('id', _clipId)
        .append('rect')
          .attr('width', w)
          .attr('height', h);
    } else {
      this.wrapper.select('svg')
        .attr('width', w + m.left + m.right)
        .attr('height', h + m.top + m.bottom);

      svg.attr('transform', 'translate(' + m.left + ',' + m.top + ')');

      svg.select('#' + _clipId + ' rect')
        .attr('width', w)
        .attr('height', h);
    }

    if (svg.select('.x.axis').node()) {
      if (this.transition()) {
        svg.select('.x.axis')
          .transition().duration(this.duration())
            .attr('transform', 'translate(0,' + h + ')')
            .call(xAxis);
      } else {
        svg.select('.x.axis')
          .attr('transform', 'translate(0,' + h + ')')
          .call(xAxis);
      }
    } else {
      svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + h + ')')
        .call(xAxis);
    }

    if (svg.select('.y.axis').node()) {
      if (this.transition()) {
        svg.select('.y.axis')
          .transition().duration(this.duration())
            .call(yAxis);
      } else {
        svg.select('.y.axis').call(yAxis);
      }
    } else {
      svg.append('g')
        .attr('class', 'y axis')
        .call(yAxis);
    }

    if (svg.select('.x.axis .axis-label').node()) {
      if (this.xLabel()) {
        svg.select('.x.axis .axis-label')
          .attr('x', w / 2)
          .attr('y', m.bottom - 5)
          .text(this.xLabel());
      } else {
        svg.select('.x.axis .axis-label').remove();
      }
    } else if (this.xLabel()) {
      svg.select('.x.axis').append('text')
        .attr('class', 'axis-label')
        .attr('x', w / 2)
        .attr('y', m.bottom - 5)
        .text(this.xLabel());
    }

    if (svg.select('.y.axis .axis-label').node()) {
      if (this.yLabel()) {
        svg.select('.y.axis .axis-label')
          .attr('x', -h / 2)
          .attr('y', 5 - m.left)
          .text(this.yLabel());
      } else {
        svg.select('.y.axis .axis-label').remove();
      }
    } else if (this.yLabel()) {
      svg.select('.y.axis').append('text')
        .attr('class', 'axis-label')
        .attr('transform', 'rotate(-90)')
        .attr('x', -h / 2)
        .attr('y', 5 - m.left)
        .attr('dy', '.71em')
        .text(this.yLabel());
    }

    series = svg.selectAll('.series')
      .data(chartData, this.seriesFormat());

    series
      .enter().append('g')
        .attr('class', 'series')
        .attr('fill', function(d, i) { return self.color()(rsc.utils.stringToHashCode(self.seriesFormat()(d))); })
        .on('click', function(d, i) {
          self.dispatch.click(d, i);
        })
        .on('dblclick', function(d, i) {
          self.dispatch.dblclick(d, i);
        })
        .on('mouseover', function(d, i) {
          self.dispatch.mouseover(d, i);
        })
        .on('mouseout', function(d, i) {
          self.dispatch.mouseout(d, i);
        });

    series.attr('clip-path', 'url(#' + _clipId + ')');

    series.exit().remove();

    paths = series.selectAll('.area')
      .data(function(d) { return [d.values]; });

    paths
      .enter().append('path')
        .attr('class', 'area')
        .attr('d', emptyArea);

    paths.exit().remove();

    if (this.transition()) {
      paths
        .transition().duration(this.duration())
          .attr('d', area);
    } else {
      paths
        .attr('d', area);
    }

    series
      .on('mouseover', function(d, i) {
        rsc.interact.mouseover(
          series,
          this,
          null,
          self.tooltips() && chartData.length > 1 ? {
            wrapper: self.wrapper,
            text: self.tooltip() ? self.tooltip()(d) : ('<h3>' + self.seriesFormat()(d) + '</h3>')
          } : null
        );

        self.dispatch.mouseover(d, i);
      })
      .on('mouseout', function(d, i) {
        rsc.interact.mouseout(series, self.tooltips() ? self.wrapper : null);

        self.dispatch.mouseout(d, i);
      })
      .on('mousemove', function(d, i) {
        if (self.tooltips() && chartData.length > 1) {
          rsc.interact.mousemove(self.wrapper);
        }

        self.dispatch.mousemove(d, i);
      });

    if (this.xThresholds()) {
      xThresholds = svg.selectAll('.x.threshold')
        .data(this.xThresholds());

      xThresholds
        .enter().append('line')
        .attr('class', 'x threshold')
        .style('stroke', function(d) { return d.color; });

      if (this.transition()) {
        if (update) {
          xThresholds
            .transition().duration(this.duration())
              .attr('x1', function(d) { return x(d.value); })
              .attr('x2', function(d) { return x(d.value); })
              .attr('y1', 0)
              .attr('y2', h);
        } else {
          xThresholds
            .attr('x1', function(d) { return x(d.value); })
            .attr('x2', function(d) { return x(d.value); })
            .attr('y1', 0)
            .attr('y2', h)
            .style('opacity', 0)
              .transition().duration(this.duration())
                .style('opacity', 0.7);
        }
      } else {
        xThresholds
          .attr('x1', function(d) { return x(d.value); })
          .attr('x2', function(d) { return x(d.value); })
          .attr('y1', 0)
          .attr('y2', h);
      }

      xThresholds.exit().remove();
    }

    if (this.yThresholds()) {
      yThresholds = svg.selectAll('.y.threshold')
        .data(this.yThresholds());

      yThresholds
        .enter().append('line')
        .attr('class', 'y threshold')
        .style('stroke', function(d) { return d.color; });

      if (this.transition()) {
        if (update) {
          yThresholds
            .transition().duration(this.duration())
              .attr('x1', 0)
              .attr('x2', w)
              .attr('y1', function(d) { return y(d.value); })
              .attr('y2', function(d) { return y(d.value); });
        } else {
          yThresholds
            .attr('x1', 0)
            .attr('x2', w)
            .attr('y1', function(d) { return y(d.value); })
            .attr('y2', function(d) { return y(d.value); })
            .style('opacity', 0)
              .transition().duration(this.duration())
                .style('opacity', 0.7);
        }
      } else {
        yThresholds
          .attr('x1', 0)
          .attr('x2', w)
          .attr('y1', function(d) { return y(d.value); })
          .attr('y2', function(d) { return y(d.value); });
      }

      yThresholds.exit().remove();
    }

    if (this.legend()) {
      this.modules.legend.update();
    }

    return this;
  };

  return chart;
};
/** @namespace bar
 * @extends base
 */
rsc.charts.bar = function(parent) {
  var chart = new this.base(parent);

  /**
   * d3 dispatcher for chart events<br/>
   * Available events: click, dblclick, mouseover, mouseout, mousemove, legend_click, legend_dblclick
   * @memberof bar
   * @member {object} dispatch
   */
  chart.dispatch = d3.dispatch('click', 'dblclick', 'mouseover', 'mouseout', 'mousemove', 'legend_click', 'legend_dblclick');

  var _stacked = false;
  var _expanded = false;

  /**
   * Gets or sets whether or not the chart is stacked
   * @memberof bar
   * @alias stacked
   * @param {boolean} stacked - Whether or not the chart is stacked
   * @returns {boolean}
   */
  chart.stacked = function(stacked) {
    if (typeof stacked !== 'undefined') {
      _stacked = stacked;

      return this;
    } else {
      return _stacked;
    }
  };

  /**
   * Gets or sets whether or not the chart is expanded
   * @memberof bar
   * @alias expanded
   * @param {boolean} expanded - Whether or not the chart is expanded
   * @returns {boolean}
   */
  chart.expanded = function(expanded) {
    if (typeof expanded !== 'undefined') {
      _expanded = expanded;

      return this;
    } else {
      return _expanded;
    }
  };

  /**
   * Render the chart
   * @memberof bar
   * @alias render
   * @param {boolean} update - Update only
   * @returns {object}
   */
  chart.render = function(update) {
    var x, y, xAxis, yAxis, svg, chartData, series, bars, h, w, m,
      xThresholds, yThresholds,
      self = this;

    rsc.labels.title(this.wrapper, this.title());
    rsc.labels.description(this.wrapper, this.description());

    if (this.legend()) {
      this.modules.legend.render(this.wrapper);
    } else {
      this.modules.legend.remove();
    }

    h = this.getChartHeight();
    w = this.getChartWidth();
    m = this.getChartMargin();

    x = d3.scale.ordinal()
      .rangeRoundBands([0, w], 0.1);

    y = d3.scale.linear()
      .range([h, 0]);

    xAxis = d3.svg.axis()
      .scale(x)
      .orient('bottom');

    yAxis = d3.svg.axis()
      .scale(y)
      .orient('left');

    if (this.expanded()) {
      yAxis.tickFormat(function(v) { return (v * 100) + '%'; });
    } else if (this.yTickFormat()) {
      yAxis.tickFormat(this.yTickFormat());
    } else {
      yAxis.tickFormat(rsc.utils.unitSuffixFormat);
    }

    if (this.grid()) {
      xAxis.tickSize(-h);
      yAxis.tickSize(-w);
    }

    svg = this.wrapper.select('.rsc-inner-wrapper');
    if (!svg.node()) {
      svg = this.wrapper.append('svg')
        .attr('width', w + m.left + m.right)
        .attr('height', h + m.top + m.bottom)
        .append('g')
          .attr('class', 'rsc-inner-wrapper')
          .attr('transform', 'translate(' + m.left + ',' + m.top + ')');
    } else {
      this.wrapper.select('svg')
        .attr('width', w + m.left + m.right)
        .attr('height', h + m.top + m.bottom);

      svg.attr('transform', 'translate(' + m.left + ',' + m.top + ')');
    }

    if (this.stacked() || this.expanded()) {
      var stack = d3.layout.stack()
        .values(function(d) { return d.values; })
        .x(self.x())
        .y(self.y())
        .offset(this.expanded() ? 'expand' : 'zero');

      chartData = stack(this.data().filter(function(d) { return !d.disabled; }));
    } else {
      chartData = this.data().filter(function(d) { return !d.disabled; });
    }

    chartData = chartData.map(function(series, i) {
      series.values = series.values.map(function(point) {
        point.series = i;
        return point;
      });
      return series;
    });

    x.domain(chartData[0].values.map(this.x())); // TODO: Using the first element is a hack

    if (this.expanded()) {
      y.domain([0, 1]);
    } else {
      y.domain([
        this.yDomain() && this.yDomain().min ? this.yDomain().min : 0, // d3.min(chartData, function(s) { return d3.min(s.values, self.y()); }),
        this.yDomain() && this.yDomain().max ? this.yDomain().max :
          d3.max(chartData, function(s) {
            return self.stacked() ? d3.max(s.values, function(d) { return d.y0 + d.y; }) : d3.max(s.values, self.y());
          })
      ]);
    }

    if (svg.select('.x.axis').node()) {
      if (this.transition()) {
        svg.select('.x.axis')
          .transition().duration(this.duration())
            .attr('transform', 'translate(0,' + h + ')')
            .call(xAxis);
      } else {
        svg.select('.x.axis')
          .attr('transform', 'translate(0,' + h + ')')
          .call(xAxis);
      }
    } else {
      svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + h + ')')
        .call(xAxis);
    }

    if (svg.select('.y.axis').node()) {
       if (this.transition()) {
        svg.select('.y.axis')
          .transition().duration(this.duration())
            .call(yAxis);
      } else {
        svg.select('.y.axis').call(yAxis);
      }
    } else {
      svg.append('g')
        .attr('class', 'y axis')
        .call(yAxis);
    }

    if (svg.select('.x.axis .axis-label').node()) {
      if (this.xLabel()) {
        svg.select('.x.axis .axis-label')
          .attr('x', w / 2)
          .attr('y', m.bottom - 5)
          .text(this.xLabel());
      } else {
        svg.select('.x.axis .axis-label').remove();
      }
    } else if (this.xLabel()) {
      svg.select('.x.axis').append('text')
        .attr('class', 'axis-label')
        .attr('x', w / 2)
        .attr('y', m.bottom - 5)
        .text(this.xLabel());
    }

    if (svg.select('.y.axis .axis-label').node()) {
      if (this.yLabel()) {
        svg.select('.y.axis .axis-label')
          .attr('x', -h / 2)
          .attr('y', 5 - m.left)
          .text(this.yLabel());
      } else {
        svg.select('.y.axis .axis-label').remove();
      }
    } else if (this.yLabel()) {
      svg.select('.y.axis').append('text')
        .attr('class', 'axis-label')
        .attr('transform', 'rotate(-90)')
        .attr('x', -h / 2)
        .attr('y', 5 - m.left)
        .attr('dy', '.71em')
        .text(this.yLabel());
    }

    series = svg.selectAll('.series')
      .data(chartData, function(d) { return d.key; });

    series
      .enter().append('g')
        .attr('class', 'series')
        .attr('fill', function(d, i) { return self.color()(rsc.utils.stringToHashCode(d.key)); });

    series.exit().remove();

    bars = series.selectAll('.bar')
      .data(function(d) { return d.values; });

    bars
      .enter().append('rect')
        .attr('class', 'bar')
        .attr('y', h)
        .attr('height', 0)
        .on('click', function(d, i) {
          self.dispatch.click(d, i);
        })
        .on('dblclick', function(d, i) {
          self.dispatch.dblclick(d, i);
        });

    bars
      .attr('x', this.stacked() || this.expanded() ? function(d) { return x(self.x()(d)); } : function(d, i, j) { return x(self.x()(d)) + x.rangeBand() / chartData.length * j; })
      .attr('width', this.stacked() || this.expanded() ? x.rangeBand() : x.rangeBand() / chartData.length);

    bars.exit().remove();

    if (this.transition()) {
      bars
        .transition().duration(this.duration())
          .attr('y', this.stacked() || this.expanded() ? function(d) { return y(d.y0 + d.y); } : function(d) { return y(self.y()(d)); })
          .attr('height', this.stacked() || this.expanded() ? function(d) { return y(d.y0) - y(d.y0 + d.y); } : function(d) { return h - y(self.y()(d)); });
    } else {
      bars
        .attr('y', this.stacked() || this.expanded() ? function(d) { return y(d.y0 + d.y); } : function(d) { return y(self.y()(d)); })
        .attr('height', this.stacked() || this.expanded() ? function(d) { return y(d.y0) - y(d.y0 + d.y); } : function(d) { return h - y(self.y()(d)); });
    }

    bars
      .on('mouseover', function(d, i) {
        rsc.interact.mouseover(
          series,
          this.parentNode,
          function(currentNode) {
            return d3.select(currentNode).selectAll('.bar');
          },
          self.tooltips() ? {
            wrapper: self.wrapper,
            text: self.tooltip() ? self.tooltip()(d) :
              ('<h3>' + self.x()(d) + ' - ' + chartData[d.series].key +
              '</h3><p>' + (self.yFormat() ? self.yFormat()(self.y()(d)) : d3.format(',.0f')(self.y()(d))) + '</p>' +
              (self.expanded() ? '<p>' + d3.format('%')(d.y) + '</p>' : ''))
          } : null
        );

        self.dispatch.mouseover(d, i);
      })
      .on('mouseout', function(d, i) {
        rsc.interact.mouseout(bars, self.tooltips() ? self.wrapper : null);

        self.dispatch.mouseout(d, i);
      })
      .on('mousemove', function(d, i) {
        if (self.tooltips()) {
          rsc.interact.mousemove(self.wrapper);
        }

        self.dispatch.mousemove(d, i);
      });

    if (this.xThresholds()) {
      xThresholds = svg.selectAll('.x.threshold')
        .data(this.xThresholds());

      xThresholds
        .enter().append('line')
        .attr('class', 'x threshold')
        .style('stroke', function(d) { return d.color; });

      if (this.transition()) {
        if (update) {
          xThresholds
            .transition().duration(this.duration())
              .attr('x1', function(d) { return x(d.value); })
              .attr('x2', function(d) { return x(d.value); })
              .attr('y1', 0)
              .attr('y2', h);
        } else {
          xThresholds
            .attr('x1', function(d) { return x(d.value); })
            .attr('x2', function(d) { return x(d.value); })
            .attr('y1', 0)
            .attr('y2', h)
            .style('opacity', 0)
              .transition().duration(this.duration())
                .style('opacity', 0.7);
        }
      } else {
        xThresholds
          .attr('x1', function(d) { return x(d.value); })
          .attr('x2', function(d) { return x(d.value); })
          .attr('y1', 0)
          .attr('y2', h);
      }

      xThresholds.exit().remove();
    }

    if (this.yThresholds()) {
      yThresholds = svg.selectAll('.y.threshold')
        .data(this.yThresholds());

      yThresholds
        .enter().append('line')
        .attr('class', 'y threshold')
        .style('stroke', function(d) { return d.color; });

      if (this.transition()) {
        if (update) {
          yThresholds
            .transition().duration(this.duration())
              .attr('x1', 0)
              .attr('x2', w)
              .attr('y1', function(d) { return y(d.value); })
              .attr('y2', function(d) { return y(d.value); });
        } else {
          yThresholds
            .attr('x1', 0)
            .attr('x2', w)
            .attr('y1', function(d) { return y(d.value); })
            .attr('y2', function(d) { return y(d.value); })
            .style('opacity', 0)
              .transition().duration(this.duration())
                .style('opacity', 0.7);
        }
      } else {
        yThresholds
          .attr('x1', 0)
          .attr('x2', w)
          .attr('y1', function(d) { return y(d.value); })
          .attr('y2', function(d) { return y(d.value); });
      }

      yThresholds.exit().remove();
    }

    if (this.legend()) {
      this.modules.legend.update();
    }

    return this;
  };

  return chart;
};
/** @namespace discreteBar
 * @extends base
 */
rsc.charts.discreteBar = function(parent) {
  var chart = new this.base(parent);

  /**
   * d3 dispatcher for chart events<br/>
   * Available events: click, dblclick, mouseover, mouseout, mousemove
   * @memberof discreteBar
   * @member {object} dispatch
   */
  chart.dispatch = d3.dispatch('click', 'dblclick', 'mouseover', 'mouseout', 'mousemove');
  chart.legend(false);

  /**
   * Render the chart
   * @memberof discreteBar
   * @alias render
   * @param {boolean} update - Update only
   * @returns {object}
   */
  chart.render = function(update) {
    var x, y, xAxis, yAxis, svg, bars, h, w, m, xThresholds, yThresholds,
      self = this;

    rsc.labels.title(this.wrapper, this.title());
    rsc.labels.description(this.wrapper, this.description());

    h = this.getChartHeight();
    w = this.getChartWidth();
    m = this.getChartMargin();

    x = d3.scale.ordinal()
      .rangeRoundBands([0, w], 0.1);

    y = d3.scale.linear()
      .range([h, 0]);

    xAxis = d3.svg.axis()
      .scale(x)
      .orient('bottom');

    yAxis = d3.svg.axis()
      .scale(y)
      .orient('left');

    if (this.yTickFormat()) {
      yAxis.tickFormat(this.yTickFormat());
    } else {
      yAxis.tickFormat(rsc.utils.unitSuffixFormat);
    }

    if (this.grid()) {
      xAxis.tickSize(-h);
      yAxis.tickSize(-w);
    }

    x.domain(this.data().map(this.x()));
    y.domain([
      this.yDomain() && this.yDomain().min ? this.yDomain().min : 0,
      this.yDomain() && this.yDomain().max ? this.yDomain().max : d3.max(this.data(), this.y())
    ]);

    svg = this.wrapper.select('.rsc-inner-wrapper');
    if (!svg.node()) {
      svg = this.wrapper.append('svg')
        .attr('width', w + m.left + m.right)
        .attr('height', h + m.top + m.bottom)
        .append('g')
          .attr('class', 'rsc-inner-wrapper')
          .attr('transform', 'translate(' + m.left + ',' + m.top + ')');
    } else {
      this.wrapper.select('svg')
        .attr('width', w + m.left + m.right)
        .attr('height', h + m.top + m.bottom);

      svg.attr('transform', 'translate(' + m.left + ',' + m.top + ')');
    }

    if (svg.select('.x.axis').node()) {
      if (this.transition()) {
        svg.select('.x.axis')
          .transition().duration(this.duration())
            .attr('transform', 'translate(0,' + h + ')')
            .call(xAxis);
      } else {
        svg.select('.x.axis')
          .attr('transform', 'translate(0,' + h + ')')
          .call(xAxis);
      }
    } else {
      svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + h + ')')
        .call(xAxis);
    }

    if (svg.select('.y.axis').node()) {
      if (this.transition()) {
        svg.select('.y.axis')
          .transition().duration(this.duration())
            .call(yAxis);
      } else {
        svg.select('.y.axis').call(yAxis);
      }
    } else {
      svg.append('g')
        .attr('class', 'y axis')
        .call(yAxis);
    }

    if (svg.select('.x.axis .axis-label').node()) {
      if (this.xLabel()) {
        svg.select('.x.axis .axis-label')
          .attr('x', w / 2)
          .attr('y', m.bottom - 5)
          .text(this.xLabel());
      } else {
        svg.select('.x.axis .axis-label').remove();
      }
    } else if (this.xLabel()) {
      svg.select('.x.axis').append('text')
        .attr('class', 'axis-label')
        .attr('x', w / 2)
        .attr('y', m.bottom - 5)
        .text(this.xLabel());
    }

    if (svg.select('.y.axis .axis-label').node()) {
      if (this.yLabel()) {
        svg.select('.y.axis .axis-label')
          .attr('x', -h / 2)
          .attr('y', 5 - m.left)
          .text(this.yLabel());
      } else {
        svg.select('.y.axis .axis-label').remove();
      }
    } else if (this.yLabel()) {
      svg.select('.y.axis').append('text')
        .attr('class', 'axis-label')
        .attr('transform', 'rotate(-90)')
        .attr('x', -h / 2)
        .attr('y', 5 - m.left)
        .attr('dy', '.71em')
        .text(this.yLabel());
    }

    bars = svg.selectAll('.bar')
      .data(this.data());

    bars
      .enter().append('rect')
        .attr('class', 'bar')
        .attr('y', h)
        .attr('height', 0)
        .on('click', function(d, i) {
          self.dispatch.click(d, i);
        })
        .on('dblclick', function(d, i) {
          self.dispatch.dblclick(d, i);
        });

    bars.exit().remove();

    bars
      .attr('fill', function(d, i) { return self.color()(rsc.utils.stringToHashCode(self.x()(d))); });

    if (this.transition() && update) {
      bars
        .transition().duration(this.duration())
          .attr('y', function(d) { return y(self.y()(d)); })
          .attr('height', function(d) { return self.getChartHeight() - y(self.y()(d)); })
          .attr('x', function(d) { return x(self.x()(d)); })
          .attr('width', x.rangeBand());
    } else if (this.transition()) {
      bars
        .attr('x', function(d) { return x(self.x()(d)); })
        .attr('width', x.rangeBand())
        .transition().duration(this.duration())
          .attr('y', function(d) { return y(self.y()(d)); })
          .attr('height', function(d) { return self.getChartHeight() - y(self.y()(d)); });
    } else {
      bars
        .attr('y', function(d) { return y(self.y()(d)); })
        .attr('height', function(d) { return self.getChartHeight() - y(self.y()(d)); })
        .attr('x', function(d) { return x(self.x()(d)); })
        .attr('width', x.rangeBand());
    }

    bars
      .on('mouseover', function(d, i) {
        rsc.interact.mouseover(
          bars,
          this,
          null,
          self.tooltips() ? {
            wrapper: self.wrapper,
            text: self.tooltip() ? self.tooltip()(d) :
              ('<h3>' + self.x()(d) + '</h3><p>' + (self.yTickFormat() ? self.yTickFormat()(self.y()(d)) : d3.format(',.0f')(self.y()(d))) + '</p>')
          } : null
        );

        self.dispatch.mouseover(d, i);
      })
      .on('mouseout', function(d, i) {
        rsc.interact.mouseout(bars, self.tooltips() ? self.wrapper : null);

        self.dispatch.mouseout(d, i);
      })
      .on('mousemove', function(d, i) {
        if (self.tooltips()) {
          rsc.interact.mousemove(self.wrapper);
        }

        self.dispatch.mousemove(d, i);
      });

    if (this.xThresholds()) {
      xThresholds = svg.selectAll('.x.threshold')
        .data(this.xThresholds());

      xThresholds
        .enter().append('line')
        .attr('class', 'x threshold')
        .style('stroke', function(d) { return d.color; });

      if (this.transition()) {
        if (update) {
          xThresholds
            .transition().duration(this.duration())
              .attr('x1', function(d) { return x(d.value); })
              .attr('x2', function(d) { return x(d.value); })
              .attr('y1', 0)
              .attr('y2', h);
        } else {
          xThresholds
            .attr('x1', function(d) { return x(d.value); })
            .attr('x2', function(d) { return x(d.value); })
            .attr('y1', 0)
            .attr('y2', h)
            .style('opacity', 0)
              .transition().duration(this.duration())
                .style('opacity', 0.7);
        }
      } else {
        xThresholds
          .attr('x1', function(d) { return x(d.value); })
          .attr('x2', function(d) { return x(d.value); })
          .attr('y1', 0)
          .attr('y2', h);
      }

      xThresholds.exit().remove();
    }

    if (this.yThresholds()) {
      yThresholds = svg.selectAll('.y.threshold')
        .data(this.yThresholds());

      yThresholds
        .enter().append('line')
        .attr('class', 'y threshold')
        .style('stroke', function(d) { return d.color; });

      if (this.transition()) {
        if (update) {
          yThresholds
            .transition().duration(this.duration())
              .attr('x1', 0)
              .attr('x2', w)
              .attr('y1', function(d) { return y(d.value); })
              .attr('y2', function(d) { return y(d.value); });
        } else {
          yThresholds
            .attr('x1', 0)
            .attr('x2', w)
            .attr('y1', function(d) { return y(d.value); })
            .attr('y2', function(d) { return y(d.value); })
            .style('opacity', 0)
              .transition().duration(this.duration())
                .style('opacity', 0.7);
        }
      } else {
        yThresholds
          .attr('x1', 0)
          .attr('x2', w)
          .attr('y1', function(d) { return y(d.value); })
          .attr('y2', function(d) { return y(d.value); });
      }

      yThresholds.exit().remove();
    }

    return this;
  };

  return chart;
};
/** @namespace line
 * @extends base
 */
rsc.charts.line = function(parent) {
  var chart = new this.base(parent);

  /**
   * d3 dispatcher for chart events<br/>
   * Available events: click, dblclick, mouseover, mouseout, mousemove, path_click, path_dblclick,
   * path_mouseover, path_mouseout, path_mousemove, legend_click, legend_dblclick, annotate
   * @memberof line
   * @member {object} dispatch
   */
  chart.dispatch = d3.dispatch('click', 'dblclick', 'mouseover', 'mouseout', 'mousemove',
    'path_click', 'path_dblclick', 'path_mouseover', 'path_mouseout', 'path_mousemove',
    'legend_click', 'legend_dblclick', 'annotate');

  var _clipId = 'clip_' + rsc.utils.generateUUID();
  var _baselineIndex;

  var _points = true;
  var _radius = 3;
  var _focus = false;
  var _index = false;
  var _seriesFormat = function(d) { return d.key; };
  var _annotate = false;
  var _interpolate = 'linear';

  chart.modules.annotate = new rsc.annotate(chart);

  /**
   * Gets or sets whether or not to show points
   * @memberof line
   * @alias points
   * @param {boolean} points - Whether or not to show points
   * @returns {boolean}
   */
  chart.points = function(points) {
    if (typeof points !== 'undefined') {
      _points = points;

      return this;
    } else {
      return _points;
    }
  };

  /**
   * Gets or sets the radius for points
   * @memberof line
   * @alias radius
   * @param {number} radius - The point radius
   * @returns {number}
   */
  chart.radius = function(radius) {
    if (typeof radius !== 'undefined') {
      _radius = radius;

      return this;
    } else {
      return _radius;
    }
  };

  /**
   * Gets or sets whether or not to render a focus chart
   * @memberof line
   * @alias focus
   * @param {boolean} focus - Whether or not to render a focus chart
   * @returns {boolean}
   */
  chart.focus = function(focus) {
    if (typeof focus !== 'undefined') {
      _focus = focus;

      return this;
    } else {
      return _focus;
    }
  };

  /**
   * Gets or sets whether or not to render an index line
   * @memberof line
   * @alias index
   * @param {boolean} index - Whether or not to render an index line
   * @returns {boolean}
   */
  chart.index = function(index) {
    if (typeof index !== 'undefined') {
      _index = index;

      return this;
    } else {
      return _index;
    }
  };

  /**
   * Gets or sets the function for formatting the series name
   * @memberof line
   * @alias seriesFormat
   * @param {function} seriesFormat - The function for formatting the series name
   * @returns {function}
   */
  chart.seriesFormat = function(seriesFormat) {
    if (typeof seriesFormat !== 'undefined') {
      if (seriesFormat === null) {
        _seriesFormat = function(d) { return d.key; };
      } else {
        _seriesFormat = seriesFormat;
      }

      return this;
    } else {
      return _seriesFormat;
    }
  };

  /**
   * Gets or sets whether or not to allow annotations
   * @memberof line
   * @alias annotate
   * @param {boolean} annotate - Whether or not to allow annotations
   * @returns {boolean}
   */
  chart.annotate = function(annotate) {
    if (typeof annotate !== 'undefined') {
      _annotate = annotate;

      return this;
    } else {
      return _annotate;
    }
  };

  /**
   * Force draw an annotation
   * @memberof line
   * @alias drawAnnotation
   * @param {object} annotationConfig - The annotation configuration object
   */
  chart.drawAnnotation = function(annotationConfig) {
    if (!this.annotate()) return;

    this.modules.annotate.render(annotationConfig);
  };

  /**
   * Gets or sets the interpolation type
   * @memberof line
   * @alias interpolate
   * @param {string} interpolate - The interpolation type
   * @returns {string}
   */
  chart.interpolate = function(interpolate) {
    if (typeof interpolate !== 'undefined') {
      _interpolate = interpolate;

      return this;
    } else {
      return _interpolate;
    }
  };

  chart.xTickFormat(rsc.utils.multiTimeFormat);

  /**
   * Render the chart
   * @memberof line
   * @alias render
   * @param {boolean} update - Update only
   * @returns {object}
   */
  chart.render = function(update) {
    var _height1, _height2, x, x2, y, y2, xAxis, xAxis2, yAxis, yAxis2,
      brush, line, line2, svg, main, context, mainSeries, mainPaths,
      contextSeries, contextPaths, points, h, w, m, chartData, cutIndex,
      xThresholds, yThresholds,
      self = this;

    if (!this.data()[0].key && !this.data()[0].values) { // single series
      this.data(rsc.utils.convertDataToSeries(this.data()));
      this.legend(false);
    }

    rsc.labels.title(this.wrapper, this.title());
    rsc.labels.description(this.wrapper, this.description());

    if (this.legend()) {
      this.modules.legend.key(this.seriesFormat());
      this.modules.legend.render(this.wrapper);
    } else {
      this.modules.legend.remove();
    }

    h = this.getChartHeight();
    w = this.getChartWidth();
    m = this.getChartMargin();

    if (this.focus()) {
      _height2 = h * 0.1;
      _height1 = h - _height2 - 40;
    } else {
      _height1 = h;
    }

    x = d3.time.scale()
      .range([0, w]);

    this._xScale = x;

    if (this.focus()) {
      x2 = d3.time.scale()
        .range([0, w]);
    }

    y = d3.scale.linear()
      .range([_height1, 0]);

    this._yScale = y;

    if (this.focus()) {
      y2 = d3.scale.linear()
        .range([_height2, 0]);
    }

    xAxis = d3.svg.axis()
      .scale(x)
      .orient('bottom');

    xAxis.tickFormat(this.xTickFormat());

    if(this.focus()) {
      xAxis2 = d3.svg.axis()
        .scale(x2)
        .orient('bottom');
    }

    yAxis = d3.svg.axis()
      .scale(y)
      .orient('left');

    if (this.index()) {
      yAxis.tickFormat(function(v) {
        var pct = d3.round(v * 100, 2);
        return (pct > 0 ? '+' : '') + pct + '%';
      });
    } else if (this.yTickFormat()) {
      yAxis.tickFormat(this.yTickFormat());
    } else {
      yAxis.tickFormat(rsc.utils.unitSuffixFormat);
    }

    if (this.focus()) {
      yAxis2 = d3.svg.axis()
        .scale(y2)
        .ticks(0)
        .orient('left');
    }

    if (this.grid()) {
      xAxis.tickSize(-_height1);
      yAxis.tickSize(-w);
    }

    if (this.focus()) {
      brush = d3.svg.brush()
        .x(x2)
        .on('brush', function() {
          x.domain(brush.empty() ? x2.domain() : brush.extent());
          mainPaths.attr('d', line);
          if (self.points()) {
            var mouseover, mouseout;
            if (self.tooltips()) {
              mouseover = points.on('mouseover');
              mouseout = points.on('mouseout');
            }

            points = mainSeries.selectAll('.point')
              .data(function(d) { return d.values; });

            points
              .enter().append('circle')
                .attr('class', 'point')
                .attr('r', self.radius());

            points
              .attr('cx', function(d) { return x(self.x()(d)) || 0; })
              .attr('cy', function(d) { return y(self.y()(d)) || 0; });

            points.exit().remove();

            if (self.tooltips()) {
              points
                .on('mouseover', mouseover)
                .on('mouseout', mouseout);
            }
          }
          main.select('.x.axis').call(xAxis);

          if (self.xThresholds()) {
            drawXThresholds('main', true);
            drawXThresholds('context', true);
          }

          if (self.yThresholds()) {
            drawYThresholds('main', true);
            drawYThresholds('context', true);
          }
        });
    }

    line = d3.svg.line()
      .defined(function(d) {
        return typeof self.y()(d) !== 'undefined' && self.y()(d) !== null &&
          typeof self.x()(d) !== 'undefined' && self.x()(d) !== null;
      })
      .x(function(d) { return x(self.x()(d)); })
      .y(function(d) { return y(self.y()(d)); })
      .interpolate(this.interpolate());

    if (this.focus()) {
      line2 = d3.svg.line()
        .defined(function(d) {
          return typeof self.y()(d) !== 'undefined' && self.y()(d) !== null &&
            typeof self.x()(d) !== 'undefined' && self.x()(d) !== null;
        })
        .x(function(d) { return x2(self.x()(d)); })
        .y(function(d) { return y2(self.y()(d)); })
        .interpolate(this.interpolate());
    }

    svg = this.wrapper.select('svg');
    if (!svg.node()) {
      svg = this.wrapper.append('svg')
        .attr('class', 'rsc-canvas')
        .attr('width', w + m.left + m.right)
        .attr('height', _height1 + (this.focus() ? _height2 + 40 : 0) + m.top + m.bottom);

      if (this.annotate()) {
        this.modules.annotate.init();
      }

      main = svg.append('g')
        .attr('class', 'focus')
        .attr('transform', 'translate(' + m.left + ',' + m.top + ')');

      if (this.focus()) {
        svg.append('defs').append('clipPath')
          .attr('id', _clipId)
          .append('rect')
            .attr('width', w)
            .attr('height', _height1);

        context = svg.append('g')
          .attr('class', 'context')
          .attr('transform', 'translate(' + m.left + ',' + (m.top + _height1 + 40) + ')');
      }
    } else {
      svg
        .attr('width', w + m.left + m.right)
        .attr('height', _height1 + (this.focus() ? _height2 + 10 : 0) + m.top + m.bottom);

      svg.select('#' + _clipId + ' rect')
        .attr('width', w)
        .attr('height', _height1);

      main = svg.select('.focus')
        .attr('transform', 'translate(' + m.left + ',' + m.top + ')');

      if (this.focus()) {
        context = svg.select('.context')
          .attr('transform', 'translate(' + m.left + ',' +
            (m.bottom + _height1 + 10 - (this.legend() ? this.modules.legend.height - this.modules.legend.padding : 0)) + ')');
      }
    }

    if (typeof update === 'undefined' || update === null || update === false) {
      _baselineIndex = null;
    }

    chartData = this.data().filter(function(d) { return !d.disabled; });

    function getAllowedIndex(idx, field) {
      var k;
      if (typeof idx === 'undefined' || idx === null) {
        idx = 0;
      }

      for (k = idx; k < chartData[0].values.length; k++) {
        if ((field ? chartData[0].values[k][field] : self.y()(chartData[0].values[k])) === 0) {
          continue;
        } else {
          var found = false;
          for (var n = 1; n < chartData.length; n++) {
            if ((field ? chartData[n].values[k][field] : self.y()(chartData[n].values[k])) === 0) {
              found = true;
              break;
            }
          }
          if (!found) {
            break;
          }
        }
      }
      return k;
    }

    cutIndex = 0;

    if (this.index()) {
      if (typeof _baselineIndex === 'undefined' || _baselineIndex === null) {
        cutIndex = getAllowedIndex();
      }
    }

    chartData.map(function(series, i) {
      var baseline, yStr, yField;
      if (self.index()) {
        if (typeof _baselineIndex === 'undefined' || _baselineIndex === null || _baselineIndex < cutIndex) {
          _baselineIndex = 0;
        } else {
          _baselineIndex = getAllowedIndex(_baselineIndex, '_originalY');
        }

        series.values = series.values.slice(cutIndex);

        baseline = (typeof series.values[_baselineIndex]._originalY === 'undefined' || series.values[_baselineIndex]._originalY === null) ?
          self.y()(series.values[_baselineIndex]) : series.values[_baselineIndex]._originalY;
        yStr = self.y().toString();
        yField = yStr.substring(yStr.indexOf('.') + 1, yStr.indexOf(';'));
      }

      series.values = series.values.map(function(point, idx) {
        if (self.index()) {
          if (typeof point._originalY === 'undefined' || point._originalY === null) {
            point._originalY = self.y()(point);
          }
          point[yField] = (point._originalY / baseline * 100 - 100) / 100;
        }
        point.series = i;
        return point;
      });

      return series;
    });

    x.domain([
      this.xDomain() && this.xDomain().min ? this.xDomain().min :
        d3.min(chartData, function(s) { return d3.min(s.values, self.x()); }),
      this.xDomain() && this.xDomain().max ? this.xDomain().max :
        d3.max(chartData, function(s) { return d3.max(s.values, self.x()); })
    ]);

    y.domain([
      this.yDomain() && this.yDomain().min ? this.yDomain().min :
        d3.min(chartData, function(s) { return d3.min(s.values, self.y()); }),
      this.yDomain() && this.yDomain().max ? this.yDomain().max :
        d3.max(chartData, function(s) { return d3.max(s.values, self.y()); })
    ]);

    if (this.focus()) {
      x2.domain(x.domain());
      y2.domain(y.domain());
    }

    if (main.select('.x.axis').node()) {
      if (this.transition()) {
        main.selectAll('.x.axis')
          .transition().duration(this.duration())
            .attr('transform', 'translate(0,' + _height1 + ')')
            .call(xAxis);
      } else {
        main.select('.x.axis')
          .attr('transform', 'translate(0,' + _height1 + ')')
          .call(xAxis);
      }
    } else {
      main.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + _height1 + ')')
        .call(xAxis);
    }

    if (this.focus()) {
      if (context.select('.x.axis').node()) {
        if (this.transition()) {
          context.selectAll('.x.axis')
            .transition().duration(this.duration())
              .attr('transform', 'translate(0,' + _height2 + ')')
              .call(xAxis2);
        } else {
          context.select('.x.axis')
            .attr('transform', 'translate(0,' + _height2 + ')')
            .call(xAxis2);
        }
      } else {
        context.append('g')
          .attr('class', 'x axis')
          .attr('transform', 'translate(0,' + _height2 + ')')
          .call(xAxis2);
      }
    }

    if (main.select('.y.axis').node()) {
      if (this.transition()) {
        main.select('.y.axis')
          .transition().duration(this.duration())
            .call(yAxis);
      } else {
        main.select('.y.axis').call(yAxis);
      }
    } else {
      main.append('g')
        .attr('class', 'y axis')
        .call(yAxis);
    }

    if (this.focus()) {
      if (context.select('.y.axis').node()) {
        if (this.transition()) {
          context.select('.y.axis')
            .transition().duration(this.duration())
              .call(yAxis2);
        } else {
          context.select('.y.axis').call(yAxis2);
        }
      } else {
        context.append('g')
          .attr('class', 'y axis')
          .call(yAxis2);
      }
    }

    var xAxisLabelContainer = this.focus() ? context : main;
    if (xAxisLabelContainer.select('.x.axis .axis-label').node()) {
      if (this.xLabel()) {
        xAxisLabelContainer.select('.x.axis .axis-label')
          .attr('x', w / 2)
          .attr('y', m.bottom - 5)
          .text(this.xLabel());
      } else {
        xAxisLabelContainer.select('.x.axis .axis-label').remove();
      }
    } else if (this.xLabel()) {
      xAxisLabelContainer.select('.x.axis').append('text')
        .attr('class', 'axis-label')
        .attr('x', w / 2)
        .attr('y', m.bottom - 5)
        .text(this.xLabel());
    }

    if (main.select('.y.axis .axis-label').node()) {
      if (this.yLabel()) {
        main.select('.y.axis .axis-label')
          .attr('x', -h / 2)
          .attr('y', 5 - m.left)
          .text(this.yLabel());
      } else {
        main.select('.y.axis .axis-label').remove();
      }
    } else if (this.yLabel()) {
      main.select('.y.axis').append('text')
        .attr('class', 'axis-label')
        .attr('transform', 'rotate(-90)')
        .attr('x', -h / 2)
        .attr('y', 5 - m.left)
        .attr('dy', '.71em')
        .text(this.yLabel());
    }

    if (this.index()) {
      var dragIndexLine = d3.behavior.drag()
        .on('dragstart', function() {
          d3.event.sourceEvent.stopPropagation();
        })
        .on('drag', function(d, i) {
          var node = d3.select(this);
          var x1 = Math.max(0, Math.min(w, d3.event.x));

          var min;
          var closestX;
          var closestIndex;
          main.select('.series').selectAll('.point').each(function(d, idx) {
            if (d._originalY === 0) return;

            var curX = x(self.x()(d));
            var diff = Math.abs(x1 - curX);

            if (typeof min === 'undefined' || min === null) {
              min = diff;
              closestX = curX;
              closestIndex = idx;
            } else if (diff < min) {
              min = diff;
              closestX = curX;
              closestIndex = idx;
            }
          });

          node
            .attr('x1', closestX)
            .attr('x2', closestX);

          if (self.focus()) {
            context.select('.index-line')
              .attr('x1', closestX)
              .attr('x2', closestX);
          }

          if (closestIndex !== _baselineIndex) {
            _baselineIndex = closestIndex;
            self.update();
          }
        });

      if (main.select('.index-line').node()) {
        var baselineX = x(this.x()(chartData[0].values[_baselineIndex]));

        main.select('.index-label').remove();

        if (this.transition()) {
          main.select('.index-line')
            .transition().duration(this.duration())
              .attr('x1', baselineX)
              .attr('x2', baselineX);

          if (this.focus()) {
            context.select('.index-line')
              .transition().duration(this.duration())
                .attr('x1', baselineX)
                .attr('x2', baselineX);
          }
        } else {
          main.select('.index-line')
            .attr('x1', baselineX)
            .attr('x2', baselineX);

          if (this.focus()) {
            context.select('.index-line')
              .attr('x1', baselineX)
              .attr('x2', baselineX);
          }
        }
      } else {
        var indexLineWrapper = main.append('g');

        indexLineWrapper.append('line')
          .attr('class', 'index-line')
          .attr('y1', _height1)
          .call(dragIndexLine);

        indexLineWrapper.append('text')
          .attr('class', 'index-label')
          .attr('x', 5)
          .attr('y', 6)
          .attr('dy', '.71em')
          .text('<- Drag Index Line');

        main.select('.index-line')
          .on('mouseover', function(d, i) {
            var node = d3.select(this);
            rsc.tooltip.show(
              d3.event.pageX,
              d3.event.pageY,
              self.wrapper,
              '<h3>' + (self.xFormat() ? self.xFormat()(self.x()(chartData[0].values[_baselineIndex])) :
                rsc.utils.timeFormat(self.x()(chartData[0].values[_baselineIndex]))) + '</h3>'
            );
          })
          .on('mouseout', function(d, i) {
            rsc.tooltip.remove(self.wrapper);
          });

        if (this.focus()) {
          context.append('line')
            .attr('class', 'index-line')
            .attr('y1', _height2);
        }
      }
    }

    mainSeries = main.selectAll('.series')
      .data(chartData, this.seriesFormat());

    mainSeries
      .enter().append('g')
        .attr('class', 'series')
        .attr('fill', function(d, i) { return self.color()(rsc.utils.stringToHashCode(self.seriesFormat()(d))); })
        .attr('stroke', function(d, i) { return self.color()(rsc.utils.stringToHashCode(self.seriesFormat()(d))); });

    if (this.focus()) {
      mainSeries.attr('clip-path', 'url(#' + _clipId + ')');
    }

    mainSeries.exit().remove();

    mainPaths = mainSeries.selectAll('.line')
      .data(function(d) { return [d.values]; });

    mainPaths
      .enter().append('path')
      .attr('class', 'line');

    mainPaths.exit().remove();

    if(!update || (update && !this.transition())) {
      mainPaths.attr('d', line);
    }

    if (this.focus()) {
      contextSeries = context.selectAll('.series')
        .data(chartData, this.seriesFormat());

      contextSeries
        .enter().append('g')
          .attr('class', 'series')
          .attr('fill', function(d, i) { return self.color()(rsc.utils.stringToHashCode(self.seriesFormat()(d))); })
          .attr('stroke', function(d, i) { return self.color()(rsc.utils.stringToHashCode(self.seriesFormat()(d))); });

      contextSeries.exit().remove();

      contextPaths = contextSeries.selectAll('.line')
        .data(function(d) { return [d.values]; });

      contextPaths
        .enter().append('path')
        .attr('class', 'line');

      contextPaths.exit().remove();

      if(!update || (update && !this.transition())) {
        contextPaths.attr('d', line2);
      }

      if (context.select('.x.brush').node()) {
        context.select('.x.brush').remove();
      }

      context.append('g')
        .attr('class', 'x brush')
        .call(brush)
        .selectAll('rect')
          .attr('y', -6)
          .attr('height', _height2 + 7);
    }

    if (this.points()) {
      points = mainSeries.selectAll('.point')
        .data(function(d) { return d.values; });

      points
        .enter().append('circle')
          .attr('class', 'point')
          .attr('r', function(d, i) {
            return (typeof self.y()(d) !== 'undefined' && self.y()(d) !== null &&
              typeof self.x()(d) !== 'undefined' && self.x()(d) !== null) ? self.radius() : 0;
          })
          .on('click', function(d, i) {
            self.dispatch.click(d, i);
          })
          .on('dblclick', function(d, i) {
            self.dispatch.dblclick(d, i);
          });

      if (!update || (update && !this.transition())) {
        points
          .attr('cx', function(d) { return x(self.x()(d)) || 0; })
          .attr('cy', function(d) { return y(self.y()(d)) || 0; });
      }

      points.exit().remove();

      if (this.transition() && !update) points.attr('opacity', 0);

      points
        .on('mouseover', function(d, i) {
          rsc.interact.mouseover(
            mainSeries.selectAll('.line'),
            d3.select(this.parentNode).select('.line').node(),
            function(currentNode) {
              return d3.select(currentNode.parentNode).selectAll('.line, .point');
            },
            self.tooltips() ? {
              wrapper: self.wrapper,
              text: self.tooltip() ? self.tooltip()(d) :
                ('<h3>' + (self.xFormat() ? self.xFormat()(self.x()(d)) : rsc.utils.timeFormat(self.x()(d))) +
                (chartData.length > 1 ? ' - ' + self.seriesFormat()(chartData[d.series]) : '') +
                '</h3><p>' + (self.index() ? yAxis.tickFormat()(self.y()(d)) : (self.yFormat() ? self.yFormat()(self.y()(d)) : d3.format(',.0f')(self.y()(d)))) + '</p>' +
                (self.index() ? '<p>' + d3.format(',.0f')(d._originalY) + '</p>' : ''))
            } : null
          );

          self.dispatch.mouseover(d, i);
        })
        .on('mouseout', function(d, i) {
          rsc.interact.mouseout(mainSeries.selectAll('.line, .point'), self.tooltips() ? self.wrapper : null);

          self.dispatch.mouseout(d, i);
        })
        .on('mousemove', function(d, i) {
          if (self.tooltips()) {
            rsc.interact.mousemove(self.wrapper);
          }

          self.dispatch.mousemove(d, i);
        });

      mainSeries.selectAll('.line')
        .on('mouseover', function(d, i) {
          rsc.interact.mouseover(
            mainSeries.selectAll('.line'),
            this,
            function(currentNode) {
              return d3.select(currentNode.parentNode).selectAll('.line, .point');
            },
            self.tooltips() && chartData.length > 1 ? {
              wrapper: self.wrapper,
              text: ('<h3>' + (Object.prototype.toString.call(d) !== '[object Array]' ? self.seriesFormat()(d) : self.seriesFormat()(chartData[d[0].series])) + '</h3>')
            } : null
          );

          self.dispatch.path_mouseover(d, i);
        })
        .on('mouseout', function(d, i) {
          rsc.interact.mouseout(mainSeries.selectAll('.line, .point'), self.tooltips() ? self.wrapper : null);

          self.dispatch.path_mouseout(d, i);
        })
        .on('mousemove', function(d, i) {
          if (self.tooltips() && chartData.length > 1) {
            rsc.interact.mousemove(self.wrapper);
          }

          self.dispatch.path_mousemove(d, i);
        })
        .on('click', function(d, i) {
          self.dispatch.path_click(d, i);
        })
        .on('dblclick', function(d, i) {
          self.dispatch.path_dblclick(d, i);
        });
    } else {
      mainSeries.selectAll('.line')
        .on('mouseover', function(d, i) {
          rsc.interact.mouseover(
            mainSeries.selectAll('.line'),
            this,
            function(currentNode) {
              return d3.select(currentNode.parentNode).selectAll('.line');
            },
            self.tooltips() && chartData.length > 1 ? {
              wrapper: self.wrapper,
              text: ('<h3>' + (Object.prototype.toString.call(d) !== '[object Array]' ? self.seriesFormat()(d) : self.seriesFormat()(chartData[d[0].series])) + '</h3>')
            } : null
          );

          self.dispatch.path_mouseover(d, i);
        })
        .on('mouseout', function(d, i) {
          rsc.interact.mouseout(mainSeries.selectAll('.line'), self.tooltips() ? self.wrapper : null);

          self.dispatch.path_mouseout(d, i);
        })
        .on('mousemove', function(d, i) {
          self.dispatch.path_mousemove(d, i);
        })
        .on('click', function(d, i) {
          self.dispatch.path_click(d, i);
        })
        .on('dblclick', function(d, i) {
          self.dispatch.path_dblclick(d, i);
        });
    }

    if (this.transition()) {
      mainSeries.selectAll('.line').each(function(d, i) {
        var node = d3.select(this);
        if (node.attr('d') === null || !update) {
          node.attr('d', line);
          var pathLength = node.node().getTotalLength();
          node
            .attr('stroke-dasharray', pathLength + ' ' + pathLength)
            .attr('stroke-dashoffset', pathLength)
            .transition().duration(self.duration())
              .attr('stroke-dashoffset', 0)
              .each('end', function() {
                d3.select(this).attr('stroke-dasharray', '');
              });
        } else {
          node
            .transition().duration(self.duration())
              .attr('d', line);
        }
      });

      if (this.focus()) {
        contextSeries.selectAll('.line').each(function(d, i) {
          var node = d3.select(this);
          if (node.attr('d') === null || !update) {
            node.attr('d', line2);
            var pathLength = node.node().getTotalLength();
            node
              .attr('stroke-dasharray', pathLength + ' ' + pathLength)
              .attr('stroke-dashoffset', pathLength)
              .transition().duration(self.duration())
                .attr('stroke-dashoffset', 0)
                .each('end', function() {
                  d3.select(this).attr('stroke-dasharray', '');
                });
          } else {
            node
              .transition().duration(self.duration())
                .attr('d', line2);
          }
        });
      }

      if (this.points()) {
        svg.selectAll('.point').each(function(d, i) {
          var node = d3.select(this);
          if (node.attr('opacity') === '0' || node.attr('cx') === null) {
            node
              .attr('opacity', 0)
              .attr('cx', function(d) { return x(self.x()(d)) || 0; })
              .attr('cy', function(d) { return y(self.y()(d)) || 0; })
              .transition().duration(self.duration())
                .attr('opacity', 1);
          } else {
            node
              .transition().duration(self.duration())
                .attr('cx', function(d) { return x(self.x()(d)) || 0; })
                .attr('cy', function(d) { return y(self.y()(d)) || 0; });
          }
        });
      }
    }

    function drawXThresholds(type, ignoreTransition) {
      var svgEl, xFunc, lineHeight;
      if (type === 'context') {
        svgEl = context;
        xFunc = x2;
        lineHeight = _height2;
      } else {
        svgEl = main;
        xFunc = x;
        lineHeight = _height1;
      }

      xThresholds = svgEl.selectAll('.x.threshold')
        .data(self.xThresholds());

      xThresholds
        .enter().append('line')
        .attr('class', 'x threshold')
        .style('stroke', function(d) { return d.color; });

      if (type !== 'content' && self.focus()) {
        xThresholds.attr('clip-path', 'url(#' + _clipId + ')');
      }

      if (self.transition() && !ignoreTransition) {
        if (update) {
          xThresholds
            .transition().duration(self.duration())
              .attr('x1', function(d) { return xFunc(d.value); })
              .attr('x2', function(d) { return xFunc(d.value); })
              .attr('y1', 0)
              .attr('y2', lineHeight);
        } else {
          xThresholds
            .attr('x1', function(d) { return xFunc(d.value); })
            .attr('x2', function(d) { return xFunc(d.value); })
            .attr('y1', 0)
            .attr('y2', lineHeight)
            .style('opacity', 0)
              .transition().duration(self.duration())
                .style('opacity', 0.7);
        }
      } else {
        xThresholds
          .attr('x1', function(d) { return xFunc(d.value); })
          .attr('x2', function(d) { return xFunc(d.value); })
          .attr('y1', 0)
          .attr('y2', lineHeight);
      }

      xThresholds.exit().remove();
    }

    function drawYThresholds(type, ignoreTransition) {
      var svgEl, yFunc;
      if (type === 'context') {
        svgEl = context;
        yFunc = y2;
      } else {
        svgEl = main;
        yFunc = y;
      }

      yThresholds = svgEl.selectAll('.y.threshold')
        .data(self.yThresholds());

      yThresholds
        .enter().append('line')
        .attr('class', 'y threshold')
        .style('stroke', function(d) { return d.color; });

      if (self.transition() && !ignoreTransition) {
        if (update) {
          yThresholds
            .transition().duration(self.duration())
              .attr('x1', 0)
              .attr('x2', w)
              .attr('y1', function(d) { return yFunc(d.value); })
              .attr('y2', function(d) { return yFunc(d.value); });
        } else {
          yThresholds
            .attr('x1', 0)
            .attr('x2', w)
            .attr('y1', function(d) { return yFunc(d.value); })
            .attr('y2', function(d) { return yFunc(d.value); })
            .style('opacity', 0)
              .transition().duration(self.duration())
                .style('opacity', 0.7);
        }
      } else {
        yThresholds
          .attr('x1', 0)
          .attr('x2', w)
          .attr('y1', function(d) { return yFunc(d.value); })
          .attr('y2', function(d) { return yFunc(d.value); });
      }

      yThresholds.exit().remove();
    }

    if (this.xThresholds()) {
      drawXThresholds();

      if (this.focus()) {
        drawXThresholds('context');
      }
    }

    if (this.yThresholds()) {
      drawYThresholds();

      if (this.focus()) {
        drawYThresholds('context');
      }
    }

    if (this.legend()) {
      this.modules.legend.update();
    }

    return this;
  };

  return chart;
};
/** @namespace pie
 * @extends base
 */
rsc.charts.pie = function(parent) {
  var chart = new this.base(parent);

  /**
   * d3 dispatcher for chart events<br/>
   * Available events: click, dblclick, mouseover, mouseout, mousemove, legend_click, legend_dblclick
   * @memberof pie
   * @member {object} dispatch
   */
  chart.dispatch = d3.dispatch('click', 'dblclick', 'mouseover', 'mouseout', 'mousemove', 'legend_click', 'legend_dblclick');

  var LABEL_THRESHOLD = 0.02;

  var _donut = false;

  /**
   * Gets or sets whether or not to render as a donut
   * @memberof pie
   * @alias donut
   * @param {boolean} donut - Whether or not to render as a donut
   * @returns {boolean}
   */
  chart.donut = function(donut) {
    if (typeof donut !== 'undefined') {
      _donut = donut;

      return this;
    } else {
      return _donut;
    }
  };

  /**
   * Render the chart
   * @memberof pie
   * @alias render
   * @param {boolean} update - Update only
   * @returns {object}
   */
  chart.render = function(update) {
    var radius, arc, pie, svg, slices, g, h, w, m, total, chartData,
      self = this;

    rsc.labels.title(this.wrapper, this.title());
    rsc.labels.description(this.wrapper, this.description());

    if (this.legend()) {
      this.modules.legend.key(this.x());
      this.modules.legend.render(this.wrapper);
    } else {
      this.modules.legend.remove();
    }

    h = this.getChartHeight();
    w = this.getChartWidth();
    m = this.getChartMargin();

    radius = Math.min(w + m.left + m.right, h + m.top + m.bottom) / 2;

    arc = d3.svg.arc()
      .outerRadius(radius - 10)
      .innerRadius(this.donut() ? radius / 2 : 0);

    pie = d3.layout.pie()
      .sort(null)
      .value(self.y());

    svg = this.wrapper.select('.rsc-inner-wrapper');
    if (!svg.node()) {
      svg = this.wrapper.append('svg')
        .attr('width', w + m.left + m.right)
        .attr('height', h + m.top + m.bottom)
        .append('g')
          .attr('class', 'rsc-inner-wrapper')
          .attr('transform', 'translate(' + ((w + m.left + m.right) / 2) + ',' + ((h + m.top + m.bottom) / 2) + ')');
    } else {
      this.wrapper.select('svg')
        .attr('width', w + m.left + m.right)
        .attr('height', h + m.top + m.bottom);

      svg.attr('transform', 'translate(' + ((w + m.left + m.right) / 2) + ',' + ((h + m.top + m.bottom) / 2) + ')');
    }

    chartData = this.data().filter(function(d) { return !d.disabled; });

    total = d3.sum(chartData, self.y());

    chartData.map(function(d, i) {
      d.internal_percentShare = d3.round(self.y()(d) / total * 100, 2);
      return d;
    });

    slices = svg.selectAll('.slice')
      .data(pie(chartData), function(d) { return self.x()(d.data); });

    g = slices
      .enter().append('g')
        .attr('class', 'slice')
        .on('click', function(d, i) {
          self.dispatch.click(d, i);
        })
        .on('dblclick', function(d, i) {
          self.dispatch.dblclick(d, i);
        });

    slices.exit().remove();

    g.append('path')
      .attr('fill', function(d, i) { return self.color()(rsc.utils.stringToHashCode(self.x()(d.data))); })
      .each(function(d) { this._current = d; });

    if (!this.legend()) {
      g.append('text')
        .attr('transform', 0)
        .attr('dy', '.35em')
        .style('text-anchor', 'middle');

      slices.select('text')
        .text(function(d) {
          var pct = (d.endAngle - d.startAngle) / (2 * Math.PI);
          return (self.x()(d.data) && pct > LABEL_THRESHOLD) ? self.x()(d.data) : '';
        });
    }

    function arcTween(a) {
      var i = d3.interpolate(update ? this._current : { startAngle: 0, endAngle: 0 }, a);
      this._current = i(0);
      return function(t) {
        return arc(i(t));
      };
    }

    if (this.transition()) {
      slices.select('path')
        .transition().duration(this.duration())
          .attr('d', arc)
          .attrTween('d', arcTween);

      if (!this.legend()) {
        slices.select('text')
          .transition().duration(this.duration())
            .attr('transform', function(d) { return 'translate(' + arc.centroid(d) + ')'; });
      }
    } else {
      slices.select('path')
        .attr('d', arc);

      if (!this.legend()) {
        slices.select('text')
          .attr('transform', function(d) { return 'translate(' + arc.centroid(d) + ')'; });
      }
    }

    slices
      .on('mouseover', function(d, i) {
        rsc.interact.mouseover(
          slices.selectAll('path'),
          d3.select(this).select('path').node(),
          null,
          self.tooltips() ? {
            wrapper: self.wrapper,
            text: self.tooltip() ? self.tooltip()(d) :
              ('<h3>' + self.x()(d.data) + '</h3><p>' + (self.yFormat() ? self.yFormat()(self.y()(d.data)) : d3.format(',.0f')(self.y()(d.data))) + '</p>' +
              '<p>' + (d.data.internal_percentShare + '%') + '</p>')
          } : null
        );

        self.dispatch.mouseover(d, i);
      })
      .on('mouseout', function(d, i) {
        rsc.interact.mouseout(slices.selectAll('path'), self.tooltips() ? self.wrapper : null);

        self.dispatch.mouseout(d, i);
      })
      .on('mousemove', function(d, i) {
        if (self.tooltips()) {
          rsc.interact.mousemove(self.wrapper);
        }

        self.dispatch.mousemove(d, i);
      });

    if (this.legend()) {
      this.modules.legend.update();
    }

    return this;
  };

  return chart;
};
/** @namespace scatter
 * @extends base
 */
rsc.charts.scatter = function(parent) {
  var chart = new this.base(parent);

  /**
   * d3 dispatcher for chart events<br/>
   * Available events: click, dblclick, mouseover, mouseout, mousemove, legend_click, legend_dblclick, annotate
   * @memberof scatter
   * @member {object} dispatch
   */
  chart.dispatch = d3.dispatch('click', 'dblclick', 'mouseover', 'mouseout', 'mousemove', 'legend_click', 'legend_dblclick', 'annotate');

  var _radius = 3;
  var _seriesFormat = function(d) { return d.key; };
  var _annotate = false;

  chart.modules.annotate = new rsc.annotate(chart);

  /**
   * Gets or sets the radius for points
   * @memberof scatter
   * @alias radius
   * @param {number} radius - The point radius
   * @returns {number}
   */
  chart.radius = function(radius) {
    if (typeof radius !== 'undefined') {
      _radius = radius;

      return this;
    } else {
      return _radius;
    }
  };

  /**
   * Gets or sets the function for formatting the series name
   * @memberof scatter
   * @alias seriesFormat
   * @param {function} seriesFormat - The function for formatting the series name
   * @returns {function}
   */
  chart.seriesFormat = function(seriesFormat) {
    if (typeof seriesFormat !== 'undefined') {
      if (seriesFormat === null) {
        _seriesFormat = function(d) { return d.key; };
      } else {
        _seriesFormat = seriesFormat;
      }

      return this;
    } else {
      return _seriesFormat;
    }
  };

  /**
   * Gets or sets whether or not to allow annotations
   * @memberof scatter
   * @alias annotate
   * @param {boolean} annotate - Whether or not to allow annotations
   * @returns {boolean}
   */
  chart.annotate = function(annotate) {
    if (typeof annotate !== 'undefined') {
      _annotate = annotate;

      return this;
    } else {
      return _annotate;
    }
  };

  /**
   * Force draw an annotation
   * @memberof scatter
   * @alias drawAnnotation
   * @param {object} annotationConfig - The annotation configuration object
   */
  chart.drawAnnotation = function(annotationConfig) {
    if (!this.annotate()) return;

    this.modules.annotate.render(annotationConfig);
  };

  /**
   * Render the chart
   * @memberof scatter
   * @alias render
   * @param {boolean} update - Update only
   * @returns {object}
   */
  chart.render = function(update) {
    var x, y, xAxis, yAxis, svg, series, points, h, w, m, chartData, xThresholds, yThresholds,
      self = this;

    if (!this.data()[0].key && !this.data()[0].values) { // single series
      this.data(rsc.utils.convertDataToSeries(this.data()));
      this.legend(false);
    }

    rsc.labels.title(this.wrapper, this.title());
    rsc.labels.description(this.wrapper, this.description());

    if (this.legend()) {
      this.modules.legend.key(this.seriesFormat());
      this.modules.legend.render(this.wrapper);
    } else {
      this.modules.legend.remove();
    }

    h = this.getChartHeight();
    w = this.getChartWidth();
    m = this.getChartMargin();

    x = d3.scale.linear()
      .range([0, w]);

    this._xScale = x;

    y = d3.scale.linear()
      .range([h, 0]);

    this._yScale = y;

    xAxis = d3.svg.axis()
      .scale(x)
      .orient('bottom');

    if (this.xTickFormat()) {
      xAxis.tickFormat(this.xTickFormat());
    }

    yAxis = d3.svg.axis()
      .scale(y)
      .orient('left');

    if (this.yTickFormat()) {
      yAxis.tickFormat(this.yTickFormat());
    } else {
      yAxis.tickFormat(rsc.utils.unitSuffixFormat);
    }

    if (this.grid()) {
      xAxis.tickSize(-h);
      yAxis.tickSize(-w);
    }

    svg = this.wrapper.select('.rsc-inner-wrapper');
    if (!svg.node()) {
      svg = this.wrapper.append('svg')
        .attr('class', 'rsc-canvas')
        .attr('width', w + m.left + m.right)
        .attr('height', h + m.top + m.bottom)
        .append('g')
          .attr('class', 'rsc-inner-wrapper')
          .attr('transform', 'translate(' + m.left + ',' + m.top + ')');

      if (this.annotate()) {
        this.modules.annotate.init();
      }
    } else {
      this.wrapper.select('svg')
        .attr('width', w + m.left + m.right)
        .attr('height', h + m.top + m.bottom);

      svg.attr('transform', 'translate(' + m.left + ',' + m.top + ')');
    }

    chartData = this.data().filter(function(d) { return !d.disabled; })
      .map(function(series, i) {
        series.values = series.values.map(function(point) {
          point.series = i;
          return point;
        });
        return series;
      });

    x.domain([
      this.xDomain() && this.xDomain().min ? this.xDomain().min :
        d3.min(chartData, function(s) { return d3.min(s.values, self.x()); }),
      this.xDomain() && this.xDomain().max ? this.xDomain().max :
        d3.max(chartData, function(s) { return d3.max(s.values, self.x()); })
    ]);

    y.domain([
      this.yDomain() && this.yDomain().min ? this.yDomain().min :
        d3.min(chartData, function(s) { return d3.min(s.values, self.y()); }),
      this.yDomain() && this.yDomain().max ? this.yDomain().max :
        d3.max(chartData, function(s) { return d3.max(s.values, self.y()); })
    ]);

    if (svg.select('.x.axis').node()) {
      if (this.transition()) {
        svg.select('.x.axis')
          .transition().duration(this.duration())
            .attr('transform', 'translate(0,' + h + ')')
            .call(xAxis);
      } else {
        svg.select('.x.axis')
          .attr('transform', 'translate(0,' + h + ')')
          .call(xAxis);
      }
    } else {
      svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + h + ')')
        .call(xAxis);
    }

    if (svg.select('.y.axis').node()) {
      if (this.transition()) {
        svg.select('.y.axis')
          .transition().duration(this.duration())
            .call(yAxis);
      } else {
        svg.select('.y.axis').call(yAxis);
      }
    } else {
      svg.append('g')
        .attr('class', 'y axis')
        .call(yAxis);
    }

    if (svg.select('.x.axis .axis-label').node()) {
      if (this.xLabel()) {
        svg.select('.x.axis .axis-label')
          .attr('x', w / 2)
          .attr('y', m.bottom - 5)
          .text(this.xLabel());
      } else {
        svg.select('.x.axis .axis-label').remove();
      }
    } else if (this.xLabel()) {
      svg.select('.x.axis').append('text')
        .attr('class', 'axis-label')
        .attr('x', w / 2)
        .attr('y', m.bottom - 5)
        .text(this.xLabel());
    }

    if (svg.select('.y.axis .axis-label').node()) {
      if (this.yLabel()) {
        svg.select('.y.axis .axis-label')
          .attr('x', -h / 2)
          .attr('y', 5 - m.left)
          .text(this.yLabel());
      } else {
        svg.select('.y.axis .axis-label').remove();
      }
    } else if (this.yLabel()) {
      svg.select('.y.axis').append('text')
        .attr('class', 'axis-label')
        .attr('transform', 'rotate(-90)')
        .attr('x', -h / 2)
        .attr('y', 5 - m.left)
        .attr('dy', '.71em')
        .text(this.yLabel());
    }

    series = svg.selectAll('.series')
      .data(chartData, this.seriesFormat());

    series
      .enter().append('g')
        .attr('class', 'series')
        .attr('fill', function(d, i) { return self.color()(rsc.utils.stringToHashCode(self.seriesFormat()(d))); })
        .attr('stroke', function(d, i) { return self.color()(rsc.utils.stringToHashCode(self.seriesFormat()(d))); });

    series.exit().remove();

    points = series.selectAll('.point')
      .data(function(d) { return d.values; });

    points
      .enter().append('circle')
        .attr('class', 'point')
        .attr('r', this.radius())
        .on('click', function(d, i) {
          self.dispatch.click(d, i);
        })
        .on('dblclick', function(d, i) {
          self.dispatch.dblclick(d, i);
        });

    if (!update || (update && !this.transition())) {
      points
        .attr('cx', function(d) { return x(self.x()(d)); })
        .attr('cy', function(d) { return y(self.y()(d)); });
    }

    points.exit().remove();

    if (this.transition()) {
      if (update) {
        points
          .transition().duration(this.duration())
            .attr('cx', function(d) { return x(self.x()(d)); })
            .attr('cy', function(d) { return y(self.y()(d)); });
      } else {
        points
          .style('opacity', 0)
          .transition().duration(this.duration())
            .style('opacity', 1);
      }
    }

    points
      .on('mouseover', function(d, i) {
        rsc.interact.mouseover(
          series,
          this.parentNode,
          function(currentNode) {
            return d3.select(currentNode).selectAll('.point');
          },
          self.tooltips() ? {
            wrapper: self.wrapper,
            text: self.tooltip() ? self.tooltip()(d) :
              ('<h3>' + (self.xFormat() ? self.xFormat()(self.x()(d)) : self.x()(d)) +
              (chartData.length > 1 ? ' - ' + self.seriesFormat()(chartData[d.series]) : '') +
              '</h3><p>' + (self.yFormat() ? self.yFormat()(self.y()(d)) : d3.format(',.0f')(self.y()(d))) + '</p>')
          } : null
        );

        self.dispatch.mouseover(d, i);
      })
      .on('mouseout', function(d, i) {
        rsc.interact.mouseout(points, self.tooltips() ? self.wrapper : null);

        self.dispatch.mouseout(d, i);
      })
      .on('mousemove', function(d, i) {
        if (self.tooltips()) {
          rsc.interact.mousemove(self.wrapper);
        }

        self.dispatch.mousemove(d, i);
      });

    if (this.xThresholds()) {
      xThresholds = svg.selectAll('.x.threshold')
        .data(this.xThresholds());

      xThresholds
        .enter().append('line')
        .attr('class', 'x threshold')
        .style('stroke', function(d) { return d.color; });

      if (this.transition()) {
        if (update) {
          xThresholds
            .transition().duration(this.duration())
              .attr('x1', function(d) { return x(d.value); })
              .attr('x2', function(d) { return x(d.value); })
              .attr('y1', 0)
              .attr('y2', h);
        } else {
          xThresholds
            .attr('x1', function(d) { return x(d.value); })
            .attr('x2', function(d) { return x(d.value); })
            .attr('y1', 0)
            .attr('y2', h)
            .style('opacity', 0)
              .transition().duration(this.duration())
                .style('opacity', 0.7);
        }
      } else {
        xThresholds
          .attr('x1', function(d) { return x(d.value); })
          .attr('x2', function(d) { return x(d.value); })
          .attr('y1', 0)
          .attr('y2', h);
      }

      xThresholds.exit().remove();
    }

    if (this.yThresholds()) {
      yThresholds = svg.selectAll('.y.threshold')
        .data(this.yThresholds());

      yThresholds
        .enter().append('line')
        .attr('class', 'y threshold')
        .style('stroke', function(d) { return d.color; });

      if (this.transition()) {
        if (update) {
          yThresholds
            .transition().duration(this.duration())
              .attr('x1', 0)
              .attr('x2', w)
              .attr('y1', function(d) { return y(d.value); })
              .attr('y2', function(d) { return y(d.value); });
        } else {
          yThresholds
            .attr('x1', 0)
            .attr('x2', w)
            .attr('y1', function(d) { return y(d.value); })
            .attr('y2', function(d) { return y(d.value); })
            .style('opacity', 0)
              .transition().duration(this.duration())
                .style('opacity', 0.7);
        }
      } else {
        yThresholds
          .attr('x1', 0)
          .attr('x2', w)
          .attr('y1', function(d) { return y(d.value); })
          .attr('y2', function(d) { return y(d.value); });
      }

      yThresholds.exit().remove();
    }

    if (this.legend()) {
      this.modules.legend.update();
    }

    return this;
  };

  return chart;
};
/** @namespace heatmap
 * @extends base
 */
rsc.charts.heatmap = function(parent) {
  var chart = new this.base(parent);

  /**
   * d3 dispatcher for chart events<br/>
   * Available events: click, dblclick, mouseover, mouseout, mousemove, legend_click, legend_dblclick
   * @memberof heatmap
   * @member {object} dispatch
   */
  chart.dispatch = d3.dispatch('click', 'dblclick', 'mouseover', 'mouseout', 'mousemove', 'legend_click', 'legend_dblclick');

  var THEME_MAPPINGS = {
    'light': 'white',
    'dark': 'black'
  };

  var _seriesFormat = function(d) { return d.key; };

  /**
   * Gets or sets the function for formatting the series name
   * @memberof heatmap
   * @alias seriesFormat
   * @param {function} seriesFormat - The function for formatting the series name
   * @returns {function}
   */
  chart.seriesFormat = function(seriesFormat) {
    if (typeof seriesFormat !== 'undefined') {
      if (seriesFormat === null) {
        _seriesFormat = function(d) { return d.key; };
      } else {
        _seriesFormat = seriesFormat;
      }

      return this;
    } else {
      return _seriesFormat;
    }
  };

  chart.xTickFormat(rsc.utils.multiTimeFormat);

  /**
   * Render the chart
   * @memberof heatmap
   * @alias render
   * @param {boolean} update - Update only
   * @returns {object}
   */
  chart.render = function(update) {
    var x, y, chartData, h, w, m, svg, series, tiles, xAxis, yAxis, yStep, xBuffer,
      self = this;

    rsc.labels.title(this.wrapper, this.title());
    rsc.labels.description(this.wrapper, this.description());

    // force no color on series since the only chart color pretains to the heatmap
    this.color(function() {
      return 'black';
    });

    if (this.legend()) {
      this.modules.legend.key(this.seriesFormat());
      this.modules.legend.render(this.wrapper);
    } else {
      this.modules.legend.remove();
    }

    h = this.getChartHeight();
    w = this.getChartWidth();
    m = this.getChartMargin();

    x = d3.time.scale()
      .range([0, w]);

    y = d3.scale.ordinal()
      .rangePoints([h, 0]);

    z = d3.scale.linear()
      .range([THEME_MAPPINGS[this.theme()], 'steelblue']);

    xAxis = d3.svg.axis()
      .scale(x)
      .tickSize(0)
      .orient('bottom');

    xAxis.tickFormat(this.xTickFormat());

    yAxis = d3.svg.axis()
      .scale(y)
      .tickSize(0)
      .orient('left');

    // if (this.grid()) {
    //   xAxis.tickSize(-h);
    //   yAxis.tickSize(-w);
    // }

    chartData = this.data().filter(function(d) { return !d.disabled; });

    chartData = chartData.map(function(series, i) {
      series.values = series.values.map(function(d, idx) {
        if (idx === series.values.length - 2) {
          xBuffer = self.x()(series.values[idx + 1]) - self.x()(series.values[idx]);
        }

        d.internal_nextX = idx < series.values.length - 1 ? self.x()(series.values[idx + 1]) : null;
        d.internal_series = self.seriesFormat()(series);

        return d;
      });
      return series;
    });

    x.domain([
      d3.min(chartData, function(s) { return d3.min(s.values, self.x()); }),
      d3.max(chartData, function(s) { return d3.max(s.values, self.x()); })
    ]);
    x.domain([x.domain()[0], +x.domain()[1] + (xBuffer || 0)]);

    // Use empty value for filler space for the last real value
    y.domain(chartData.map(this.seriesFormat()).concat(['']));

    z.domain([0, d3.max(chartData, function(s) { return d3.max(s.values, self.y()); })]);

    function yAxisAdjust(g) {
      g.selectAll('g').each(function (d, i) {
        var node = d3.select(this);
        var textNode = node.select('text');
        var step = y(y.domain()[0]) - y(y.domain()[1]);

        textNode
          .attr('transform', 'translate(0,' + (-(step) / 2) + ')');
      });
    }

    svg = this.wrapper.select('.rsc-inner-wrapper');
    if (!svg.node()) {
      svg = this.wrapper.append('svg')
        .attr('width', w + m.left + m.right)
        .attr('height', h + m.top + m.bottom)
        .append('g')
          .attr('class', 'rsc-inner-wrapper')
          .attr('transform', 'translate(' + m.left + ',' + m.top + ')');
    } else {
      this.wrapper.select('svg')
        .attr('width', w + m.left + m.right)
        .attr('height', h + m.top + m.bottom);

      svg.attr('transform', 'translate(' + m.left + ',' + m.top + ')');
    }

    if (svg.select('.x.axis').node()) {
      if (this.transition()) {
        svg.select('.x.axis')
          .transition().duration(this.duration())
            .attr('transform', 'translate(0,' + h + ')')
            .call(xAxis);
      } else {
        svg.select('.x.axis')
          .attr('transform', 'translate(0,' + h + ')')
          .call(xAxis);
      }
    } else {
      svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + h + ')')
        .call(xAxis);
    }

    if (svg.select('.y.axis').node()) {
      if (this.transition()) {
        svg.select('.y.axis')
          .transition().duration(this.duration())
            .attr('transform', 'translate(-1, 0)')
            .call(yAxis)
            .call(yAxisAdjust);
      } else {
        svg.select('.y.axis')
          .attr('transform', 'translate(-1, 0)')
          .call(yAxis)
          .call(yAxisAdjust);
      }
    } else {
      svg.append('g')
        .attr('class', 'y axis')
        .attr('transform', 'translate(-1, 0)')
        .call(yAxis)
        .call(yAxisAdjust);
    }

    if (svg.select('.x.axis .axis-label').node()) {
      if (this.xLabel()) {
        svg.select('.x.axis .axis-label')
          .attr('x', w / 2)
          .attr('y', m.bottom - 5)
          .text(this.xLabel());
      } else {
        svg.select('.x.axis .axis-label').remove();
      }
    } else if (this.xLabel()) {
      svg.select('.x.axis').append('text')
        .attr('class', 'axis-label')
        .attr('x', w / 2)
        .attr('y', m.bottom - 5)
        .text(this.xLabel());
    }

    if (svg.select('.y.axis .axis-label').node()) {
      if (this.yLabel()) {
        svg.select('.y.axis .axis-label')
          .attr('x', -h / 2)
          .attr('y', 5 - m.left)
          .text(this.yLabel());
      } else {
        svg.select('.y.axis .axis-label').remove();
      }
    } else if (this.yLabel()) {
      svg.select('.y.axis').append('text')
        .attr('class', 'axis-label')
        .attr('transform', 'rotate(-90)')
        .attr('x', -h / 2)
        .attr('y', 5 - m.left)
        .attr('dy', '.71em')
        .text(this.yLabel());
    }

    yStep = y(y.domain()[0]) - y(y.domain()[1]);

    series = svg.selectAll('.series')
      .data(chartData, this.seriesFormat());

    series
      .enter().append('g')
        .attr('class', 'series');

    series.exit().remove();

    tiles = series.selectAll('.tile')
      .data(function(d) { return d.values; });

    tiles
      .enter().append('rect')
        .attr('class', 'tile')
        .attr('x', function(d) { return x(self.x()(d)); })
        .attr('y', function(d) { return y(d.internal_series) - yStep; })
        .attr('width', function(d) {
          if (!d.internal_nextX) {
            return x(x.invert(w)) - x(self.x()(d));
          } else {
            return x(d.internal_nextX) - x(self.x()(d));
          }
        })
        .attr('height', yStep)
        .style('opacity', 0);

    tiles.exit().remove();

    if (this.transition()) {
      tiles
        .transition().duration(this.duration())
          .attr('x', function(d) { return x(self.x()(d)); })
          .attr('y', function(d) { return y(d.internal_series) - yStep; })
          .attr('width', function(d) {
            if (!d.internal_nextX) {
              return x(x.invert(w)) - x(self.x()(d));
            } else {
              return x(d.internal_nextX) - x(self.x()(d));
            }
          })
          .attr('height', yStep)
          .style('fill', function(d) { return z(self.y()(d)); })
          .style('opacity', 1);
    } else {
      tiles
        .attr('x', function(d) { return x(self.x()(d)); })
        .attr('y', function(d) { return y(d.internal_series) - yStep; })
        .attr('width', function(d) {
          if (!d.internal_nextX) {
            return x(x.invert(w)) - x(self.x()(d));
          } else {
            return x(d.internal_nextX) - x(self.x()(d));
          }
        })
        .attr('height', yStep)
        .style('fill', function(d) { return z(self.y()(d)); })
        .style('opacity', 1);
    }

    tiles
      .on('click', function(d, i) {
        self.dispatch.click(d, i);
      })
      .on('dblclick', function(d, i) {
        self.dispatch.dblclick(d, i);
      })
      .on('mouseover', function(d, i) {
        rsc.interact.mouseover(
          series,
          this.parentNode,
          null,
          self.tooltips() ? {
            wrapper: self.wrapper,
            text: self.tooltip() ? self.tooltip()(d) :
              ('<h3>' + (self.xFormat() ? self.xFormat()(self.x()(d)) : rsc.utils.timeFormat(self.x()(d))) + '</h3>' +
              '<p>' + (self.yFormat() ? self.yFormat()(self.y()(d)) : d3.format(',.0f')(self.y()(d))) + '</p>')
          } : null
        );

        self.dispatch.mouseover(d, i);
      })
      .on('mouseout', function(d, i) {
        rsc.interact.mouseout(series, self.tooltips() ? self.wrapper : null);

        self.dispatch.mouseout(d, i);
      })
      .on('mousemove', function(d, i) {
        if (self.tooltips()) {
          rsc.interact.mousemove(self.wrapper);
        }

        self.dispatch.mousemove(d, i);
      });

    if (this.legend()) {
      this.modules.legend.update();
    }

    return this;
  };

  return chart;
};
/** @namespace table
 * @extends base
 */
rsc.charts.table = function(parent) {
  var chart = new this.base(parent);

  /**
   * d3 dispatcher for chart events<br/>
   * Available events: click, dblclick
   * @memberof table
   * @member {object} dispatch
   */
  chart.dispatch = d3.dispatch('click', 'dblclick');
  chart.legend(false);
  chart.margin({ top: 20, right: 20, bottom: 20, left: 20});

  // override resize function
  chart.resize = function() {
    this.width(parseInt(d3.select(this.parent()).style('width'), 10));
    this.height(parseInt(d3.select(this.parent()).style('height'), 10));

    _resizeTable();
  };

  var _columns = [];
  var _sortable = true;

  /**
   * Gets or sets the table columns
   * @memberof table
   * @alias columns
   * @param {object|array} columns - The table columns
   * @returns {array}
   */
  chart.columns = function(columns) {
    if (typeof columns !== 'undefined') {
      columns = rsc.utils.deepCopy(columns);
      _columns = Object.prototype.toString.call(columns) !== '[object Array]' ? [columns] : columns;

      return this;
    } else {
      return _columns;
    }
  };

  /**
   * Gets or sets whether or not the table is sortable
   * @memberof table
   * @alias sortable
   * @param {boolean} sortable - Whether or not the table is sortable
   * @returns {boolean}
   */
  chart.sortable = function(sortable) {
    if (typeof sortable !== 'undefined') {
      _sortable = sortable;

      return this;
    } else {
      return _sortable;
    }
  };

  var _colWidths = [];
  var _selectedRowData;
  var _sortColIndex;

  function _selectRow(node) {
    chart.wrapper.select('.rsc-table-rows').selectAll('.rsc-table-row').classed('selected', false);
    node.classed('selected', true);

    _selectedRowData = node.datum();
  }

  function _resizeTable() {
    var h, w, rows;

    h = chart.getChartHeight();
    w = chart.getChartWidth();

    chart.wrapper.select('.rsc-table')
      .style('width', w + 'px')
      .style('height', h + 'px');

    // adjust row container height
    rows = chart.wrapper.select('.rsc-table-rows');
    if (chart.columns() && chart.columns().length > 0) {
      rows.style('height', (h - parseInt(chart.wrapper.select('.rsc-table-header').style('height'), 10) - 2) + 'px');
    } else {
      rows.style('height', h + 'px');
    }

    // adjust column widths
    if (_colWidths && _colWidths.length > 0) {
      var totalWidth = 0;
      for (i = 0; i < _colWidths.length; i++) {
        totalWidth += _colWidths[i];
      }

      chart.wrapper.select('.rsc-table-inner').style('min-width', totalWidth + 'px');

      var colSize = chart.wrapper.selectAll('.rsc-table-header .rsc-table-col').size();
      var totalWidthPct = 0;

      chart.wrapper.selectAll('.rsc-table-header .rsc-table-col').each(function(d, i) {
        var widthPct;
        if (i === colSize - 1) {
          widthPct = 100 - totalWidthPct;
        } else {
          widthPct = _colWidths[i] / totalWidth * 100;
        }

        d3.select(this).style('width', widthPct + '%');
        totalWidthPct += widthPct;
      });

      chart.wrapper.selectAll('.rsc-table-row').each(function(d, i) {
        totalWidthPct = 0;
        d3.select(this).selectAll('.rsc-table-col').each(function(d, i) {
          var widthPct;
          if (i === colSize - 1) {
            widthPct = 100 - totalWidthPct;
          } else {
            widthPct = _colWidths[i] / totalWidth * 100;
          }

          d3.select(this).style('width', widthPct + '%');
          totalWidthPct += widthPct;
        });
      });
    }

    function getScrollbarWidth() {
      var inner = document.createElement('p');
      inner.style.width = "100%";
      inner.style.height = "200px";

      var outer = document.createElement('div');
      outer.style.position = "absolute";
      outer.style.top = "0px";
      outer.style.left = "0px";
      outer.style.visibility = "hidden";
      outer.style.width = "200px";
      outer.style.height = "150px";
      outer.style.overflow = "hidden";
      outer.appendChild(inner);

      document.body.appendChild (outer);
      var w1 = inner.offsetWidth;
      outer.style.overflow = 'scroll';
      var w2 = inner.offsetWidth;
      if (w1 == w2) w2 = outer.clientWidth;

      document.body.removeChild(outer);

      return (w1 - w2);
    }

    // adjust header columns to line up with row columns
    if (rows.node().scrollHeight > rows.node().clientHeight) {
      chart.wrapper.select('.rsc-table-header').style('padding-right', getScrollbarWidth() + 'px');
    } else {
      chart.wrapper.select('.rsc-table-header').style('padding-right', 0);
    }
  }

  /**
   * Sort the table
   * @memberof table
   * @alias sort
   * @param {string} key - The key to sort on
   * @param {string} type - Type of sort: 'asc' or 'desc'
   */
  chart.sort = function(key, type) {
    this.wrapper.selectAll('.rsc-table-row').sort(function(a, b) {
      if (type === 'desc') {
        if (a[key] < b[key]) {
          return 1;
        } else if (a[key] > b[key]) {
          return -1;
        } else {
          return 0;
        }
      } else {
        if (a[key] < b[key]) {
          return -1;
        } else if (a[key] > b[key]) {
          return 1;
        } else {
          return 0;
        }
      }
    });
  };

  /**
   * Render the chart
   * @memberof table
   * @alias render
   * @param {boolean} update - Update only
   * @returns {object}
   */
  chart.render = function(update) {
    var i, w, h, header, cols, col, key,
      self = this;

    this.wrapper.select('.rsc-table').remove();

    rsc.labels.title(this.wrapper, this.title());
    rsc.labels.description(this.wrapper, this.description());

    h = this.getChartHeight();
    w = this.getChartWidth();
    m = this.margin();

    if (update) {
      _colWidths = [];
    } else {
      _selectedRowData = null;
      _sortColIndex = null;
    }

    this.wrapper.append('div')
      .attr('class', 'rsc-table')
      .style('width', w + 'px')
      .style('height', h + 'px')
      .style('margin', m.top + 'px ' + m.right + 'px ' + m.bottom + 'px ' + m.left + 'px')
      .append('div')
        .attr('class', 'rsc-table-inner');

    // header
    header = this.wrapper.select('.rsc-table-header');
    if (header.node()) {
      header.remove();
    }

    function headerClick(d, i) {
      var node = d3.select(this);
      if (node.classed('sort-icon')) {
        node = d3.select(node.property('parentNode'));
      }

      var sortType;
      if (node.classed('asc')) {
        sortType = 'desc';
      } else {
        sortType = 'asc';
      }

      var sortColIndex;
      self.wrapper.select('.rsc-table-header').selectAll('.rsc-table-col').each(function(d, i) {
        if (node.node() === this) {
          node
            .classed('asc', sortType === 'asc')
            .classed('desc', sortType === 'desc')
            .select('.sort-icon')
              .html(sortType === 'desc' ? '&#8595;' : '&#8593;');

          sortColIndex = i;
          node.classed('sorted', true);
        } else {
          d3.select(this)
            .classed('desc', false)
            .classed('asc', false)
            .classed('sorted', false);

          if (d3.select(this).select('.sort-icon').node()) {
            d3.select(this).select('.sort-icon').html('&#8645;');
          }
        }
      });

      self.wrapper.selectAll('.rsc-table-row').each(function(d, i) {
        d3.select(this).selectAll('.rsc-table-col').each(function(d, i) {
          d3.select(this).classed('sorted', i === sortColIndex);
        });
      });

      _sortColIndex = sortColIndex;

      self.sort(d.key, sortType);
    }

    cols = this.columns();
    if (cols && cols.length > 0) {
      var label;
      header = this.wrapper.select('.rsc-table-inner').append('div').attr('class', 'rsc-table-header');

      for (i = 0; i < cols.length; i++) {
        col = cols[i];
        var hidden, sortable;

        if (typeof col === 'object' && col !== null) {
          label = col.label ? col.label : col.key;
          key = col.key;
          hidden = col.hidden;
          sortable = typeof col.sortable !== 'undefined' && col.sortable !== null ?
            col.sortable : this.sortable();
        } else {
          label = col;
          key = col;
          sortable = this.sortable();
        }

        var colHeader = header.append('div')
          .attr('class', 'rsc-table-col')
          .datum({ key: key, label: label, hidden: hidden, sortable: sortable })
          .html(!label ? '&nbsp;' : label);

        if (hidden) {
          colHeader.classed('rsc-table-col-hidden', true);
        }

        if (sortable) {
          colHeader.append('div')
            .attr('class', 'sort-icon')
            .html('&#8645;');
          colHeader.on('click', headerClick);
        }

        _colWidths.push(hidden ? 0 : parseInt(colHeader.style('width'), 10));
      }
    }

    // rows
    rows = this.wrapper.select('.rsc-table-rows');
    if (rows) {
      rows.remove();
    }

    function addDataColumn(row, d, col, colIndex) {
      var dataNode = row.append('div').attr('class', 'rsc-table-col rsc-table-data');

      var formatter, styles, hidden, nodeFormatter;

      if (col && typeof col === 'object') {
        if (col.hidden) {
          hidden = col.hidden;
        }

        if (col.formatter) {
          formatter = col.formatter;
        }

        if (col.styles) {
          styles = col.styles;
        }

        if (col.nodeFormatter) {
          nodeFormatter = col.nodeFormatter;
        }
      }

      var val;
      if (typeof d === 'object' && d !== null) {
        if (d.formatter) {
          formatter = d.formatter;
        }

        if (d.nodeFormatter) {
          nodeFormatter = d.nodeFormatter;
        }

        if (d.styles) {
          styles = d.styles;
        }

        val = d.value;
      } else {
        val = d;
      }

      val = formatter ? formatter(val) : val;

      dataNode.html(!val ? '&nbsp;' : val);

      if (hidden) {
        dataNode.classed('rsc-table-col-hidden', true);
      }

      if (nodeFormatter) {
        nodeFormatter(dataNode, val);
      }

      if (styles) {
        dataNode.classed('rsc-table-col-custom-styling', true);
        dataNode.style(styles);
      }

      var dataNodeWidth = hidden ? 0 : parseInt(dataNode.style('width'), 10);
      if (dataNodeWidth > _colWidths[colIndex]) {
        _colWidths[colIndex] = dataNodeWidth;
      }
    }

    function rowClick(d, i) {
      _selectedRowData = null; // TODO: support ctrl+click, shift+click
      _selectRow(d3.select(this));

      self.dispatch.click(d, i);
    }

    function rowDblClick(d, i) {
      self.dispatch.dblclick(d, i);
    }

    rows = this.wrapper.select('.rsc-table-inner').append('div').attr('class', 'rsc-table-rows');

    for (i = 0; i < this.data().length; i++) {
      var d = this.data()[i];

      if (typeof d.id === 'undefined' || d.id === null) {
        d.id = rsc.utils.generateUUID();
      }

      var row = rows.append('div')
        .attr('class', 'rsc-table-row')
        .datum(d)
        .on('click', rowClick)
        .on('dblclick', rowDblClick);

      if (this.columns() && this.columns().length > 0) {
        for (k = 0; k < this.columns().length; k++) {
          col = this.columns()[k];

          if (typeof col === 'object' && col !== null) {
            key = col.key;
          } else {
            key = col;
          }

          addDataColumn(row, d[key], col, k);
        }
      } else {
        for (key in d) {
          addDataColumn(row, d[key]);
        }
      }
    }

    _resizeTable();

    return this;
  };

  /**
   * Get the selected row data
   * @memberof table
   * @alias getSelectedRow
   * @returns {object}
   */
  chart.getSelectedRow = function() {
    return rsc.utils.deepCopy(_selectedRowData);
  };

  /**
   * Select a row
   * @memberof table
   * @alias selectRow
   * @param {string} key - The key to search for
   * @param {string} val - The value to match
   */
  chart.selectRow = function(key, val) {
    _selectedRowData = null;

    this.wrapper.selectAll('.rsc-table-rows .rsc-table-row').each(function(d, i) {
      if (d[key] === val) {
        _selectRow(d3.select(this));
      }
    });

    return this.getSelectedRow();
  };

  return chart;
};
return rsc;})();