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
                var viewerElement = angular.element('#' + _viewerDivId);

                // Keep track of the component element in a service, so that we can use it in the IE11 $destroy hack below 
                c360ViewerUtils.componentElement = element;

                scope.$on('$destroy', function (args) {
                    $window.addEventListener('resize', null, false);
                    
                    // In IE11, the timing the $destroy event is for some reason different than in other browsers.
                    //  When navigating between two views that both use the viewer, the $destroy on the old view
                    //  is happening after the viewer is created on the new view, so we need to make sure to only
                    //  return the 
                    if (c360ViewerUtils.componentElement === element) {
                        viewerElement.offset({ top: 0, left: 0 });
                        // Use z-index rather than visibility to hide/show, since the viewer apparently
                        //  doesn't updated itself when hidden
                        viewerElement.css('z-index', '-1');

                        c360ViewerUtils.componentElement = undefined;
                    }
                });

                $window.addEventListener('resize', positionViewer, false);

                // Wait for any other dynamic position to settle down first, then position viewer
                $timeout(function () {
                    positionViewer();
                }, 100);

                function positionViewer() {
                    // Use z-index rather than visibility to hide/show, since the viewer apparently
                    //  doesn't updated itself when hidden
                    viewerElement.css('z-index', '1');

                    viewerElement.offset(element.offset());

                    var width = element.width();
                    var widthPx = width + 'px';
                    var height = element.height();
                    var heightPx = height + 'px';

                    viewerElement.css('width', widthPx);
                    viewerElement.css('height', heightPx);

                    // Just setting the css would do it, but since c360 sets the width and height
                    //  attributes on iframe, we'll set them here to in order to prevent any confusion
                    var iFrame = angular.element(viewerElement.children()[0]);
                    iFrame.css('width', widthPx);
                    iFrame.width(width);
                    iFrame.css('height', heightPx);
                    iFrame.height(height);
                }
            }
        };
    }
})();