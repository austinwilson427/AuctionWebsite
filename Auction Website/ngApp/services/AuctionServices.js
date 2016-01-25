var MyApp;
(function (MyApp) {
    var Services;
    (function (Services) {
        var AuctionService = (function () {
            function AuctionService($resource) {
                this.$resource = $resource;
                this.auctionResource = $resource('/api/item/:id');
            }
            ;
            AuctionService.prototype.listItems = function () {
                return this.auctionResource.query();
            };
            AuctionService.prototype.listBids = function (id) {
                this.bidsResource = this.$resource('/api/item/getbidsbyitem/' + id);
                return this.bidsResource.query();
            };
            AuctionService.prototype.getSingleItem = function (id) {
                return this.auctionResource.get({ id: id });
            };
            AuctionService.prototype.saveBid = function (bid) {
                this.bidsResource = this.$resource('/api/bid/getbidsbyitem/:id');
                return this.bidsResource.save(bid).$promise;
            };
            AuctionService.prototype.saveItem = function (item) {
                this.itemsResource = this.$resource('/api/item');
                return this.itemsResource.save(item).$promise;
            };
            //
            AuctionService.prototype.deleteItem = function (id) {
                return this.auctionResource.delete({
                    id: id
                }).$promise;
            };
            AuctionService.prototype.deleteBid = function (id) {
                this.bidsResource = this.$resource('/api/bid');
                return this.bidsResource.delete({
                    id: id
                }).$promise;
            };
            return AuctionService;
        })();
        Services.AuctionService = AuctionService;
        angular.module("MyApp").service('auctionService', AuctionService);
    })(Services = MyApp.Services || (MyApp.Services = {}));
})(MyApp || (MyApp = {}));
