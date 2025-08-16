const tooltipUtils = {
  show(tooltip, htmlContent, event) {
    tooltip
      .style('opacity', 1)
      .html(htmlContent);
    this.move(tooltip, event);
  },

  hide(tooltip) {
    tooltip.style('opacity', 0);
  },

  move(tooltip, event) {
    const tooltipNode = tooltip.node();
    if (!tooltipNode) return;

    const tooltipRect = tooltipNode.getBoundingClientRect();
    const offsetX = -330;
    const offsetY = 180;

    let x = event.pageX + offsetX;
    let y = event.pageY - offsetY;

    if (x + tooltipRect.width > window.innerWidth) {
      x = event.pageX - tooltipRect.width - offsetX;
    }

    if (y < 0) {
      y = 5;
    }

    if (y + tooltipRect.height > window.innerHeight) {
      y = window.innerHeight - tooltipRect.height - 5;
    }

    tooltip
      .style('left', `${x}px`)
      .style('top', `${y}px`);
  }
};

export default tooltipUtils;