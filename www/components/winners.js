AFRAME.registerComponent('winners', {
  init: function () {
    document.querySelectorAll('[vive-controls]').forEach(x => {
      x.addEventListener('trackpaddown', this.trophy.bind(this));
      x.addEventListener('gripdown', this.finalRound.bind(this));
    });
  },
  trophy: function () {
    var plotArea = this.el.components.plot.plotArea, 
        points = plotArea.components['plot-area'].pointEls,
        pointdat = plotArea.components['plot-area'].data.points,
        i, anim = 'property: rotation; from: 0 0 0; to: 0 360 0; loop: true; dir: normal; easing: linear; dur: 5000;';
    for(i = 0; i < points.length; i++) {
      if (pointdat[i].y < -0.2) {
        points[i].removeAttribute('geometry');
        points[i].removeAttribute('material');
        points[i].setAttribute('obj-model', 'obj: #trophy1-obj; mtl: #trophy1-mtl');
        points[i].setAttribute('scale', '0.0004 0.0003 0.0004');
        points[i].setAttribute('animation', anim);
      } else if(pointdat[i].y < -0.16) {
        points[i].removeAttribute('geometry');
        points[i].removeAttribute('material');
        points[i].setAttribute('obj-model', 'obj: #trophy2-obj; mtl: #trophy2-mtl');
        points[i].setAttribute('scale', '0.0004 0.0003 0.0004');
        points[i].setAttribute('animation', anim);
      } else if(pointdat[i].y < 0.25) {
        points[i].removeAttribute('geometry');
        points[i].removeAttribute('material');
        points[i].setAttribute('scale', '0.0005 0.0005 0.0005');
        points[i].setAttribute('obj-model', 'obj: #medal-obj; mtl: #medal-mtl');
        points[i].setAttribute('animation', anim);
      }
    }
    this.finalists.setAttribute('visible', 'false');
    this.congrats = document.createElement('a-entity');
    this.el.sceneEl.appendChild(this.congrats);
    this.congrats.setAttribute('position', '-7 4 -10');
    this.congrats.setAttribute('material', 'color: #D4AF37; metalness: 0.5; roughness: 0.2;');
    this.congrats.setAttribute('text', 'text: Congrats, Purple Pill!');
    this.congrats.setAttribute('scale', '0.01 0.01 0.01');
    this.congrats.setAttribute('animation', 'property: scale; to: 2 2 2; easing: easeOutQuad; elasticity: 1000; dur: 2000');
    this.spin();
  },
  spin: function() {
    var plotArea = this.el.components.plot.plotArea, 
        points = plotArea.components['plot-area'].pointEls;
    points.forEach(x => x.components.animation.playAnimation());
    
  },
  finalRound: function () {
    var plot = AFRAME.utils.extend({}, this.el.components.plot.data),
        dat = document.querySelector('[data-frame]').components['data-frame'].data.data,
        ranks = dat.filter(x => x.name === 'rank')[0].data,
        titles = dat.filter(x => x.name === 'title')[0].data,
        finalistNames = [], i, 
        newPoints = [], newBreaks = [], newLabels = [];
    for(i = 0; i < ranks.length; i++) {
      if(ranks[i] !== "NR") {
        newPoints.push(plot.points[i]);
        finalistNames.push(titles[i]);
      }
    }
    plot.points = newPoints;
    for(i = 0; i < plot.xbreaks.length; i++) {
      if(finalistNames.indexOf(plot.xlabels[i]) !== -1) {
        newLabels.push(plot.xlabels[i]);
        newBreaks.push(plot.xbreaks[i]);
      }
    }
    plot.xlabels = newLabels;
    plot.xbreaks = newBreaks;
    this.el.setAttribute('plot', plot);
    this.finalists = document.createElement('a-entity');
    this.el.sceneEl.appendChild(this.finalists);
    this.finalists.setAttribute('position', '-3.5 4 -10');
    this.finalists.setAttribute('material', 'color: #000000; metalness: 0.5; roughness: 0.2;');
    this.finalists.setAttribute('text', 'text: Finalists');
    this.finalists.setAttribute('scale', '0.01 0.01 0.01');
    this.finalists.setAttribute('animation', 'property: scale; to: 2 2 2; easing: easeOutQuad; elasticity: 1000; dur: 2000');
  }
});
