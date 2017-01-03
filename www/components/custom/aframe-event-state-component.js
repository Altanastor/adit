AFRAME.registerComponent('event-state', {
  schema: { event: { default: '' }, state: { default: '' }},
  init: function () {
    this.setStateB = this.setState.bind(this);
  },
  play: function() {
    if(this.data.event) {
      this.el.addEventListener(this.data.event, this.setStateB);
    }    
  },
  pause: function() {
    if(this.data.event) {
      this.el.removeEventListener(this.data.event, this.setStateB);
    }
  },
  setState: function (evt) {
    if(this.data.state) {
      this.el.addState(this.data.state);
    }
  }
});