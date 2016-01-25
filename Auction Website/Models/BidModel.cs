using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace Auction_Website.Models
{
    public class BidModel
    {
        public int Id { get; set; }
        public string BidderName { get; set; }
        public decimal BidAmount { get; set; }

        public int? ItemModelId { get; set; }
    }
}