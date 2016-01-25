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
    public class ItemController : ApiController
    {
        private IGenericRepository _repo;

        public ItemController(IGenericRepository repo)
        {
            _repo = repo;
        }

        public IHttpActionResult GetAllItems()
        {
            var data = _repo.Query<ItemModel>();
            
            return Ok(data);
        }

        [Route("api/item/getIndItem/{id}")]
        public IHttpActionResult GetIndItem(int id)
        {
            var data = _repo.Find<ItemModel>(id);
            
            return Ok(data);
        }

        [Route("api/item/getBidsByItem/{id}")]
        public IHttpActionResult GetBidsByItem(int id)
        {

            var data = _repo.Query<ItemModel>().Where(i => i.Id == id).Include(i => i.Bids).FirstOrDefault();
            
            return Ok(data.Bids);
        }

        public IHttpActionResult PostItem(ItemModel itemToAdd)
        {
            if (ModelState.IsValid)
            {

                //Creating a new player
                if (itemToAdd.Id == 0)
                {
                    _repo.Add<ItemModel>(itemToAdd);
                    _repo.SaveChanges();
                    return Ok();

                }
                else
                {
                    //Updating if player already exists
                    // This may work, need to check: var originalPlayer = get(playerToAdd.Id);
                    var originalItem = _repo.Find<ItemModel>(itemToAdd.Id);
                    // var originalItem = _dbresults.Players.Find(playerToAdd.Id);
                    originalItem.CurrentWinner = itemToAdd.CurrentWinner;
                    originalItem.MinimumBid = itemToAdd.MinimumBid;
                    originalItem.ItemName = itemToAdd.ItemName;
                    originalItem.ItemDescription = itemToAdd.ItemDescription;
                    originalItem.ItemImageLink = itemToAdd.ItemImageLink;
                    originalItem.NumberOfBids = itemToAdd.NumberOfBids;
                    originalItem.IsActive = itemToAdd.IsActive;

                    _repo.SaveChanges();
                    return Ok(itemToAdd);
                }
            }

            return BadRequest();

            
        }

        public IHttpActionResult DeleteItem(int id)
        {
            _repo.Delete<ItemModel>(id);
            _repo.SaveChanges();
            return Ok();
        }




    }
}
