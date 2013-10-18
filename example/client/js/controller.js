(function($app) {

    "use strict";

    /**
     * @module App
     * @controller IndexController
     */
    $app.controller('IndexController', function IndexController($scope) {

        /**
         * @property collection
         * @type {Array}
         */
        $scope.collection = [];

        /**
         * @property stats
         * @type {Object}
         */
        $scope.stats = {};

        /**
         * @property debug
         * @type {Object}
         */
        $scope.debug = {};

        /**
         * @property filter
         * @type {String}
         */
        $scope.filter = '';

        // Establish a connection to the Node.js server.
        var socket = io.connect('http://localhost:8888');

        /**
         * @on snapshot/contentUpdated
         */
        socket.on('snapshot/contentUpdated', function(data) {

            $scope.$apply(function() {
                $scope.collection   = data.models;
                $scope.stats   = data.stats;
                $scope.debug        = data.debug;
            });

        });

        /**
         * @method nextPage
         * @return {void}
         */
        $scope.nextPage = function nextPage() {
            var nextPageNumber = $scope.stats.currentPage += 1;
            socket.emit('snapshot/pageNumber', nextPageNumber);
        };

        /**
         * @method previousPage
         * @return {void}
         */
        $scope.previousPage = function previousPage() {
            var previousPageNumber = $scope.stats.currentPage -= 1;
            socket.emit('snapshot/pageNumber', previousPageNumber);
        };

        /**
         * @method perPage
         * @param amount {Number}
         * @return {void}
         */
        $scope.perPage = function perPage(amount) {
            socket.emit('snapshot/perPage', amount);
        };

        /**
         * @method sortBy
         * @param property {String}
         * @return {void}
         */
        $scope.sortBy = function sortBy(property) {
            socket.emit('snapshot/sortBy', {
                key         : property,
                direction   : false
            });
        };

        /**
         * @method applyFilter
         * @param text {String|Number}
         * @return {void}
         */
        $scope.applyFilter = function applyFilter(text) {
            socket.emit('applyFilterByWord', text);
        };

        /**
         * @method clearFilter
         * @return {void}
         */
        $scope.clearFilter = function clearFilter() {
            socket.emit('clearFilterByWord');
            $scope.filter = '';
        };

    });

})(window.app);