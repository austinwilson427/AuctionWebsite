namespace MyApp.Services {

    export class AuctionService {

        private auctionResource;
        private bidsResource;
        private itemsResource;

        constructor(private $resource: angular.resource.IResourceService) {

            this.auctionResource = $resource('/api/item/:id');
            
        };

        public listItems() {
            return this.auctionResource.query();
        }

        public listBids(id) {
            this.bidsResource = this.$resource('/api/item/getbidsbyitem/' + id);
            return this.bidsResource.query();
        }

        public getSingleItem(id) {
            return this.auctionResource.get({ id: id });
        }

        public saveBid(bid) {
            this.bidsResource = this.$resource('/api/bid/getbidsbyitem/:id');
            return this.bidsResource.save(bid).$promise;
        }

        public saveItem(item) {
            this.itemsResource = this.$resource('/api/item');
            return this.itemsResource.save(item).$promise;
        }
        //
        public deleteItem(id) {
            return this.auctionResource.delete({
                id: id
            }).$promise;
        }

        public deleteBid(id) {
            this.bidsResource = this.$resource('/api/bid');
            return this.bidsResource.delete({
                id: id
            }).$promise;
        }


    }

    angular.module("MyApp").service('auctionService', AuctionService);
}