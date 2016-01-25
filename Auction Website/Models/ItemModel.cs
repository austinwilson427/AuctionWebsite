using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Auction_Website.Models
{
    public class ItemModel
    {
        public int Id { get; set; }
        public string ItemName { get; set; }
        public string ItemDescription { get; set; }
        public string CurrentWinner { get; set; }
        public decimal MinimumBid { get; set; }
        public string ItemImageLink { get; set; }
        public int NumberOfBids { get; set; }
        public bool IsActive { get; set; }
        public ICollection<BidModel> Bids { get; set; }


    }
}