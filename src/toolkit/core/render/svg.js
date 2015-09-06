Rpd.noderenderer('core/sum-of-three', 'svg', function() {
    var textElement;
    return {
        size: { width: 150, height: null },
        first: function(bodyElm) {
            textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            bodyElm.appendChild(textElement);
        },
        always: function(bodyElm, inlets, outlets) {
            textElement.innerHTML = '∑ (' + (inlets.a || '?') + ', '
                                          + (inlets.b || '?') + ', '
                                          + (inlets.c || '?') + ') = ' + (outlets.sum || '?');
        }
    }
});
