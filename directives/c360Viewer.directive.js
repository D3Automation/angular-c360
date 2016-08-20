(function () {
    'use strict';

    angular
    .module('angular-c360')
    .directive('c360Viewer', c360Viewer);

    function c360Viewer($window, $timeout, c360ViewerUtils) {
        var _viewerDivId = 'c360Viewer';

        return {
            restrict: 'E',
            link: function (scope, element, attrs, ctrl) {
                var viewerElement = document.getElementById(_viewerDivId);

                // Keep track of the component element in a service, so that we can use it in the IE11 $destroy hack below 
                c360ViewerUtils.componentElement = element;

                scope.$on('$destroy', function (args) {
                    $window.addEventListener('resize', null, false);
                    
                    // In IE11, the timing the $destroy event is for some reason different than in other browsers.
                    //  When navigating between two views that both use the viewer, the $destroy on the old view
                    //  is happening after the viewer is created on the new view, so we need to make sure to only
                    //  return the 
                    if (c360ViewerUtils.componentElement === element) {
                        viewerElement.style.top = "0";
                        viewerElement.style.left = "0";
                        // Use z-index rather than visibility to hide/show, since the viewer apparently
                        //  doesn't updated itself when hidden
                        viewerElement.style.zIndex = "-1";

                        c360ViewerUtils.componentElement = undefined;
                    }
                });

                $window.addEventListener('resize', positionViewer, false);

                // Wait for any other dynamic position to settle down first, then position viewer
                $timeout(function () {
                    positionViewer();
                }, 100);

                function positionViewer() {
                    var widthPx = element[0].clientWidth + "px";
                    var heightPx = element[0].clientHeight + "px";
                    var offset = calculateOffset(element[0]);

                    // Use z-index rather than visibility to hide/show, since the viewer apparently
                    //  doesn't updated itself when hidden
                    viewerElement.style.zIndex = "1";
                    viewerElement.style.top = offset.top + "px";
                    viewerElement.style.left = offset.left + "px";
                    viewerElement.style.width = widthPx;
                    viewerElement.style.height = heightPx;

                    var iFrame = viewerElement.firstElementChild;
                    iFrame.style.width = widthPx;
                    iFrame.style.height = heightPx;

                    function calculateOffset(el) {
                        var parent = el.offsetParent;
                        var offset = {
                            top: el.offsetTop,
                            left: el.offsetLeft
                        };
                        
                        while(parent !== null) {
                            offset.top += parent.offsetTop;
                            offset.left += parent.offsetLeft;
                            parent = parent.offsetParent;
                        }

                        return offset;
                    }
                }
            }
        };
    }
})();