namespace MyApp.Controllers {


    export class AuctionControllers {

        public items;
        public itemDetail;

        public bid;
        public bidDetails;

        constructor(private auctionService: MyApp.Services.AuctionService, private $location: ng.ILocationService, private $uibModal: angular.ui.bootstrap.IModalService) {
            this.displayItems();
        }

        public displayItems() {
            this.items = this.auctionService.listItems();
        }

        public getItem(id) {

            this.itemDetail = this.auctionService.getSingleItem(id);
        }

        public getBids(id) {
            this.bidDetails = this.auctionService.listBids(id);
            console.log(this.bidDetails);
        }

        public showModal(item) {
            this.$uibModal.open({
                templateUrl: '/ngApp/views/modals/item-details.html',
                controller: ModalDetailsController,
                controllerAs: "vm",
                resolve: {
                    data: () => item
                },
                size: "sm"
            });
        }

        public addBid(item, id) {
            this.getBids(id);
            console.log(this.bidDetails);
            this.$uibModal.open({
                templateUrl: '/ngApp/views/modals/add-bid.html',
                controller: ModalAddBidController,
                controllerAs: "vm",
                resolve: {
                    data: () => item,
                    bidData: () => this.bidDetails

                },
                size: "sm"
            });
        }

        public addItemModal() {
            this.$uibModal.open({
                templateUrl: '/ngApp/views/modals/add-item.html',
                controller: ModalAddItemController,
                controllerAs: "vm",
                resolve: {
                    data: () => ""


                },
                size: "sm"
            });
        }

    }

    export class ModalDetailsController {


        public itemResource;
        public validationErrors;
        public selectedBids;
        public items;

        constructor(public data, private $uibModalInstance: angular.ui.bootstrap.IModalServiceInstance, $resource: ng.resource.IResourceService, private $route: ng.route.IRouteService, private auctionService: MyApp.Services.AuctionService, private $location: ng.ILocationService) {

        }

        closeModal() {
            this.$uibModalInstance.close();
            this.$route.reload();
        }

        public displayItems() {
            this.items = this.auctionService.listItems();
        }

        public deleteBids(id) {
            let itemsToDelete = [];
            this.auctionService.listBids(id).$promise.then((data) => {
                for (var i of data) {
                    this.auctionService.deleteBid(i.id);
                };
            });
            
        }

        public deleteItem(id, name) {
            let answer = confirm("Are you sure you want to permanently delete " + name + " ?");
            if (answer) {
                this.deleteBids(id);
                this.auctionService.deleteItem(id);
                this.displayItems();
                this.closeModal();
                this.$location.path('/');
            }
        }

    }

    export class ModalAddBidController {


        public itemResource;
        public validationErrors;
        public addItemError;

        constructor(public data, public bidData, private $uibModalInstance: angular.ui.bootstrap.IModalServiceInstance, $resource: ng.resource.IResourceService, private $route: ng.route.IRouteService, private auctionService: MyApp.Services.AuctionService, private $location: ng.ILocationService) {

        }

        closeModal() {
            this.$uibModalInstance.close();
            this.$route.reload();
        }

        submitBid(bidInfo, id, pastBidInfo) {
            bidInfo.itemModelId = id;
            
            if (pastBidInfo.currentWinner != null) {
                var minimumBid: number;
                if (1.05 * pastBidInfo.minimumBid < pastBidInfo.minimumBid + 1) {
                    minimumBid = pastBidInfo.minimumBid + 1;
                } else {
                    minimumBid = 1.05 * pastBidInfo.minimumBid
                }
                minimumBid = Math.floor(minimumBid);
            } else {
                var minimumBid = 1.0 * pastBidInfo.minimumBid;
                minimumBid = Math.floor(minimumBid);
            }

            var currentWinner = pastBidInfo.currentWinner;
            var currentBidsLeft = pastBidInfo.numberOfBids;

            if (bidInfo.bidAmount < minimumBid) {
                this.addItemError = "Your bid is too low. The minimum bid is " + minimumBid;
            } else if (bidInfo.bidderName == currentWinner) {
                this.addItemError = "It is not a good idea to out bid yourself, think again";
            } else if (currentBidsLeft <= 0) {
                this.addItemError = "Bid limit has been reached";
            }
            else {
                pastBidInfo.currentWinner = bidInfo.bidderName;
                pastBidInfo.minimumBid = bidInfo.bidAmount;
                pastBidInfo.numberOfBids--;
                if (pastBidInfo.numberOfBids == 0) {
                    pastBidInfo.isActive = false;
                }

                this.auctionService.saveBid(bidInfo).then(() => {
                    console.log(pastBidInfo);
                    this.auctionService.saveItem(pastBidInfo).then(() => {
                        this.closeModal();
                    })
                }).catch((error) => {
                    let validationErrors = [];
                    for (let i in error.data.modelState) {
                        let errorMessage = error.data.modelState[i];
                        validationErrors = validationErrors.concat(errorMessage);
                    }
                    this.validationErrors = validationErrors;
                });


            }

        }

    }

    export class ModalAddItemController {


        public itemResource;
        public validationErrors;
        public addItemError;

        constructor(public data, private $uibModalInstance: angular.ui.bootstrap.IModalServiceInstance, $resource: ng.resource.IResourceService, private $route: ng.route.IRouteService, private auctionService: MyApp.Services.AuctionService, private $location: ng.ILocationService) {

        }

        closeModal() {
            this.$uibModalInstance.close();
            this.$route.reload();
        }

        submitItem(item) {

            this.auctionService.saveItem(item).then(() => {
                console.log(item);
                this.closeModal();
            }).catch((error) => {
                let validationErrors = [];
                for (let i in error.data.modelState) {
                    let errorMessage = error.data.modelState[i];
                    validationErrors = validationErrors.concat(errorMessage);
                }
                this.validationErrors = validationErrors;
            });
        }

    }

}