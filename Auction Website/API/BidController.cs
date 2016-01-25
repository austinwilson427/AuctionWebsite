using Auction_Website.Models;
using Day20_Generic_Repository.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Auction_Website.API
{
    public class BidController : ApiController
    {
        private IGenericRepository _repo;

        public BidController(IGenericRepository repo)
        {
            _repo = repo;
        }

        public IHttpActionResult GetAllBids()
        {
            var data = _repo.Query<BidModel>();
            return Ok(data);
        }

        public IHttpActionResult GetIndBid(int id)
        {
            var data = _repo.Find<BidModel>(id);
            return Ok(data);
        }

        public IHttpActionResult PostBid(BidModel bid)
        {
            
            _repo.Add<BidModel>(bid);
            _repo.SaveChanges();
            return Ok();
        }

        public IHttpActionResult DeleteBid(int id)
        {
            _repo.Delete<BidModel>(id);
            _repo.SaveChanges();
            return Ok();
        }
    }
}
