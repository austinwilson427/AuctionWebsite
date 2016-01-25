namespace Auction_Website.Migrations
{
    using Models;
    using System;
    using System.Collections.Generic;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;

    internal sealed class Configuration : DbMigrationsConfiguration<Auction_Website.Models.ApplicationDbContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
        }

        protected override void Seed(Auction_Website.Models.ApplicationDbContext context)
        {
            ItemModel[] items = new ItemModel[]
            {
                new ItemModel {
                    ItemName = "Laptop",
                    ItemDescription = "HP 8530p",
                    MinimumBid = 575m,
                    CurrentWinner = "Austin Wilson",
                    NumberOfBids = 7,
                    ItemImageLink = "http://sigmabit.co.in/wp-content/uploads/2014/07/hp-laptop-png.png",
                    IsActive = true,
                    Bids = new List<BidModel>
                    {
                        new BidModel { BidAmount = 525m, BidderName = "Courtney Austin"},
                        new BidModel { BidAmount = 550m, BidderName = "Matt Collins"},
                        new BidModel { BidAmount = 575m, BidderName = "Austin Wilson"}
                    }
                },
                new ItemModel {
                    ItemName = "Peanut Butter",
                    ItemDescription = "Slightly used jar of Jiffy Creamy Peanut Butter",
                    MinimumBid = 7m,
                    CurrentWinner = "Austin Wilson",
                    NumberOfBids = 7,
                    ItemImageLink = "https://i.guim.co.uk/img/static/sys-images/Guardian/Pix/pictures/2014/3/28/1396007648035/6171bd9d-2858-48ba-97b2-2b32aabf2568-2060x1236.jpeg?w=620&q=85&auto=format&sharp=10&s=7b51e2412305826f42657f170009ec63",
                    IsActive = true,
                    Bids = new List<BidModel>
                    {
                        new BidModel { BidAmount = 5m, BidderName = "Courtney Austin"},
                        new BidModel { BidAmount = 6m, BidderName = "Matt Collins"},
                        new BidModel { BidAmount = 7m, BidderName = "Austin Wilson"}
                    }
                },
                new ItemModel {
                    ItemName = "Tesla",
                    ItemDescription = "Mint condition Tesla S",
                    MinimumBid = 70000m,
                    CurrentWinner = "Debbie Westwood",
                    NumberOfBids = 7,
                    ItemImageLink = "http://image.automobilemag.com/f/100479146+w660+h440+q80+re0+cr1+ar0+st0/black-solid.png",
                    IsActive = true,
                    Bids = new List<BidModel>
                    {
                        new BidModel { BidAmount = 50000m, BidderName = "Courtney Austin"},
                        new BidModel { BidAmount = 60000m, BidderName = "Matt Collins"},
                        new BidModel { BidAmount = 70000m, BidderName = "Debbie Westwood"}
                    }
                }

            };
            context.Items.AddOrUpdate(i => i.ItemName, items);
        }
    }
}
