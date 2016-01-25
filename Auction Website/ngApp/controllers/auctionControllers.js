var MyApp;
(function (MyApp) {
    var Controllers;
    (function (Controllers) {
        var AuctionControllers = (function () {
            function AuctionControllers(auctionService, $location, $uibModal) {
                this.auctionService = auctionService;
                this.$location = $location;
                this.$uibModal = $uibModal;
                this.displayItems();
            }
            AuctionControllers.prototype.displayItems = function () {
                this.items = this.auctionService.listItems();
            };
            AuctionControllers.prototype.getItem = function (id) {
                this.itemDetail = this.auctionService.getSingleItem(id);
            };
            AuctionControllers.prototype.getBids = function (id) {
                this.bidDetails = this.auctionService.listBids(id);
                console.log(this.bidDetails);
            };
            AuctionControllers.prototype.showModal = function (item) {
                this.$uibModal.open({
                    templateUrl: '/ngApp/views/modals/item-details.html',
                    controller: ModalDetailsController,
                    controllerAs: "vm",
                    resolve: {
                        data: function () { return item; }
                    },
                    size: "sm"
                });
            };
            AuctionControllers.prototype.addBid = function (item, id) {
                var _this = this;
                this.getBids(id);
                console.log(this.bidDetails);
                this.$uibModal.open({
                    templateUrl: '/ngApp/views/modals/add-bid.html',
                    controller: ModalAddBidController,
                    controllerAs: "vm",
                    resolve: {
                        data: function () { return item; },
                        bidData: function () { return _this.bidDetails; }
                    },
                    size: "sm"
                });
            };
            AuctionControllers.prototype.addItemModal = function () {
                this.$uibModal.open({
                    templateUrl: '/ngApp/views/modals/add-item.html',
                    controller: ModalAddItemController,
                    controllerAs: "vm",
                    resolve: {
                        data: function () { return ""; }
                    },
                    size: "sm"
                });
            };
            return AuctionControllers;
        })();
        Controllers.AuctionControllers = AuctionControllers;
        var ModalDetailsController = (function () {
            function ModalDetailsController(data, $uibModalInstance, $resource, $route, auctionService, $location) {
                this.data = data;
                this.$uibModalInstance = $uibModalInstance;
                this.$route = $route;
                this.auctionService = auctionService;
                this.$location = $location;
            }
            ModalDetailsController.prototype.closeModal = function () {
                this.$uibModalInstance.close();
                this.$route.reload();
            };
            ModalDetailsController.prototype.displayItems = function () {
                this.items = this.auctionService.listItems();
            };
            ModalDetailsController.prototype.deleteBids = function (id) {
                var _this = this;
                var itemsToDelete = [];
                this.auctionService.listBids(id).$promise.then(function (data) {
                    for (var _i = 0; _i < data.length; _i++) {
                        var i = data[_i];
                        _this.auctionService.deleteBid(i.id);
                    }
                    ;
                });
            };
            ModalDetailsController.prototype.deleteItem = function (id, name) {
                var answer = confirm("Are you sure you want to permanently delete " + name + " ?");
                if (answer) {
                    this.deleteBids(id);
                    this.auctionService.deleteItem(id);
                    this.displayItems();
                    this.closeModal();
                    this.$location.path('/');
                }
            };
            return ModalDetailsController;
        })();
        Controllers.ModalDetailsController = ModalDetailsController;
        var ModalAddBidController = (function () {
            function ModalAddBidController(data, bidData, $uibModalInstance, $resource, $route, auctionService, $location) {
                this.data = data;
                this.bidData = bidData;
                this.$uibModalInstance = $uibModalInstance;
                this.$route = $route;
                this.auctionService = auctionService;
                this.$location = $location;
            }
            ModalAddBidController.prototype.closeModal = function () {
                this.$uibModalInstance.close();
                this.$route.reload();
            };
            ModalAddBidController.prototype.submitBid = function (bidInfo, id, pastBidInfo) {
                var _this = this;
                bidInfo.itemModelId = id;
                if (pastBidInfo.currentWinner != null) {
                    var minimumBid;
                    if (1.05 * pastBidInfo.minimumBid < pastBidInfo.minimumBid + 1) {
                        minimumBid = pastBidInfo.minimumBid + 1;
                    }
                    else {
                        minimumBid = 1.05 * pastBidInfo.minimumBid;
                    }
                    minimumBid = Math.floor(minimumBid);
                }
                else {
                    var minimumBid = 1.0 * pastBidInfo.minimumBid;
                    minimumBid = Math.floor(minimumBid);
                }
                var currentWinner = pastBidInfo.currentWinner;
                var currentBidsLeft = pastBidInfo.numberOfBids;
                if (bidInfo.bidAmount < minimumBid) {
                    this.addItemError = "Your bid is too low. The minimum bid is " + minimumBid;
                }
                else if (bidInfo.bidderName == currentWinner) {
                    this.addItemError = "It is not a good idea to out bid yourself, think again";
                }
                else if (currentBidsLeft <= 0) {
                    this.addItemError = "Bid limit has been reached";
                }
                else {
                    pastBidInfo.currentWinner = bidInfo.bidderName;
                    pastBidInfo.minimumBid = bidInfo.bidAmount;
                    pastBidInfo.numberOfBids--;
                    if (pastBidInfo.numberOfBids == 0) {
                        pastBidInfo.isActive = false;
                    }
                    this.auctionService.saveBid(bidInfo).then(function () {
                        console.log(pastBidInfo);
                        _this.auctionService.saveItem(pastBidInfo).then(function () {
                            _this.closeModal();
                        });
                    }).catch(function (error) {
                        var validationErrors = [];
                        for (var i in error.data.modelState) {
                            var errorMessage = error.data.modelState[i];
                            validationErrors = validationErrors.concat(errorMessage);
                        }
                        _this.validationErrors = validationErrors;
                    });
                }
            };
            return ModalAddBidController;
        })();
        Controllers.ModalAddBidController = ModalAddBidController;
        var ModalAddItemController = (function () {
            function ModalAddItemController(data, $uibModalInstance, $resource, $route, auctionService, $location) {
                this.data = data;
                this.$uibModalInstance = $uibModalInstance;
                this.$route = $route;
                this.auctionService = auctionService;
                this.$location = $location;
            }
            ModalAddItemController.prototype.closeModal = function () {
                this.$uibModalInstance.close();
                this.$route.reload();
            };
            ModalAddItemController.prototype.submitItem = function (item) {
                var _this = this;
                this.auctionService.saveItem(item).then(function () {
                    console.log(item);
                    _this.closeModal();
                }).catch(function (error) {
                    var validationErrors = [];
                    for (var i in error.data.modelState) {
                        var errorMessage = error.data.modelState[i];
                        validationErrors = validationErrors.concat(errorMessage);
                    }
                    _this.validationErrors = validationErrors;
                });
            };
            return ModalAddItemController;
        })();
        Controllers.ModalAddItemController = ModalAddItemController;
    })(Controllers = MyApp.Controllers || (MyApp.Controllers = {}));
})(MyApp || (MyApp = {}));
